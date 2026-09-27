#!/usr/bin/env python3
"""Compile a source-custodied Core2 ledger into one standalone learner HTML page."""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
from pathlib import Path
from typing import Any

SCHEMA = "core2-source-spine/v1"
RENDERER = "core2-source-spine/0.1.0"
RESPONSES = {"MCQ_SINGLE", "SHORT_TEXT", "FREE_RESPONSE"}
FIGURES = {"ABSENT", "SOURCE_EMBED", "SOURCE_DERIVED_REDRAW"}
CUSTODY = {"EMBEDDED_VERBATIM", "EXTERNAL_REFERENCE"}
COMPONENTS = {"PRESERVED", "NOT_PRESENT_IN_SOURCE", "EXTERNAL_REFERENCE_VERIFIED"}


class SpineError(ValueError):
    pass


def esc(value: Any) -> str:
    return html.escape(str(value), quote=True)


def req(obj: dict, key: str, where: str) -> Any:
    if key not in obj or obj[key] in (None, ""):
        raise SpineError(f"{where}.{key} is required")
    return obj[key]


def payload(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def validate(data: dict) -> None:
    if data.get("schema") != SCHEMA:
        raise SpineError(f"schema must be {SCHEMA}")
    product = req(data, "product", "ledger")
    for key in ("id", "title", "subject", "home_href", "source_basis"):
        req(product, key, "product")
    basis = product["source_basis"]
    for key in ("acquisition_id", "resource_ref", "source_digest", "rights", "provider_head"):
        req(basis, key, "product.source_basis")
    digest = str(basis["source_digest"]).lower()
    if not re.fullmatch(r"[0-9a-f]{64}", digest):
        raise SpineError("product.source_basis.source_digest must be sha256 hex")

    sections = req(data, "sections", "ledger")
    questions = req(data, "questions", "ledger")
    if not isinstance(sections, list) or not sections:
        raise SpineError("ledger.sections must be non-empty")
    if not isinstance(questions, list) or not questions:
        raise SpineError("ledger.questions must be non-empty")
    section_ids = set()
    for i, section in enumerate(sections):
        sid = req(section, "id", f"sections[{i}]")
        req(section, "title", f"sections[{i}]")
        if sid in section_ids:
            raise SpineError(f"duplicate section {sid}")
        section_ids.add(sid)

    qids = set()
    for i, q in enumerate(questions):
        where = f"questions[{i}]"
        qid = req(q, "id", where)
        if qid in qids:
            raise SpineError(f"duplicate question {qid}")
        qids.add(qid)
        if req(q, "section_id", where) not in section_ids:
            raise SpineError(f"{where}.section_id is unknown")
        req(q, "family_id", where)
        req(q, "family_label", where)
        ident = req(q, "source_identity", where)
        for key in ("label", "locator", "original_identifier"):
            req(ident, key, where + ".source_identity")

        custody = req(q, "custody", where)
        mode = req(custody, "mode", where + ".custody")
        if mode not in CUSTODY:
            raise SpineError(f"{where}.custody.mode invalid")
        if custody.get("comparison_status") not in {"ORIGINAL_EXACT", "ADAPTED_DECLARED"}:
            raise SpineError(f"{where}.custody comparison unresolved")
        comps = req(custody, "components", where + ".custody")
        for name in ("stem", "options", "subparts", "conditions", "figures", "hints", "answer"):
            if comps.get(name) not in COMPONENTS:
                raise SpineError(f"{where}.custody.components.{name} unresolved")
        if mode == "EXTERNAL_REFERENCE" and not custody.get("learner_display_authorized", False):
            raise SpineError(f"{where}: external-reference display is not authorized")

        req(q, "stem", where)
        response = req(q, "response", where)
        rtype = req(response, "type", where + ".response")
        if rtype not in RESPONSES:
            raise SpineError(f"{where}.response.type invalid")
        if rtype == "MCQ_SINGLE" and not q.get("options"):
            raise SpineError(f"{where}: MCQ_SINGLE requires options")
        answer = req(q, "answer", where)
        answer_state = comps["answer"]
        source_summary = answer.get("source_summary")
        authored_summary = answer.get("authored_summary")
        if answer_state in {"PRESERVED", "EXTERNAL_REFERENCE_VERIFIED"} and not source_summary:
            raise SpineError(f"{where}: source answer custody requires answer.source_summary")
        if answer_state == "NOT_PRESENT_IN_SOURCE" and source_summary:
            raise SpineError(f"{where}: source_summary supplied although source answer is absent")
        if answer_state == "NOT_PRESENT_IN_SOURCE" and not authored_summary:
            raise SpineError(f"{where}: source answer absent; an explicitly authored answer is required for learner closure")

        hints = q.get("source_hints") or []
        if comps["hints"] == "NOT_PRESENT_IN_SOURCE" and hints:
            raise SpineError(f"{where}: hints supplied although absent in source")
        if comps["hints"] == "PRESERVED" and not hints:
            raise SpineError(f"{where}: hints claimed preserved but empty")

        fig = q.get("figure") or {"state": "ABSENT"}
        state = fig.get("state", "ABSENT")
        if state not in FIGURES:
            raise SpineError(f"{where}.figure.state invalid")
        if comps["figures"] == "NOT_PRESENT_IN_SOURCE" and state != "ABSENT":
            raise SpineError(f"{where}: figure supplied although absent in source")
        if comps["figures"] in {"PRESERVED", "EXTERNAL_REFERENCE_VERIFIED"} and state == "ABSENT":
            raise SpineError(f"{where}: source figure present but learner figure absent")
        if state != "ABSENT":
            req(fig, "alt", where + ".figure")
        if state == "SOURCE_EMBED":
            src = str(req(fig, "src", where + ".figure")).lower()
            if src.startswith(("http://", "https://", "//")):
                raise SpineError(f"{where}: source figure must be local/offline")
        if state == "SOURCE_DERIVED_REDRAW":
            svg = str(req(fig, "svg", where + ".figure"))
            if "<svg" not in svg:
                raise SpineError(f"{where}: redraw must contain inline svg")
            if re.search(r"<(?:script|foreignObject|iframe|object|embed)\b|\son[a-z]+\s*=|javascript:|https?://", svg, re.I):
                raise SpineError(f"{where}: redraw contains unsafe/external SVG content")
        if q.get("difficulty", "ROUTINE") not in {"ROUTINE", "HARD"}:
            raise SpineError(f"{where}.difficulty invalid")


def lines(values: list[str] | None) -> str:
    values = [str(x) for x in (values or []) if str(x).strip()]
    return "" if not values else "<ul>" + "".join(f"<li>{esc(x)}</li>" for x in values) + "</ul>"


def render_figure(q: dict) -> str:
    fig = q.get("figure") or {"state": "ABSENT"}
    state = fig.get("state", "ABSENT")
    if state == "ABSENT":
        return ""
    label = "SOURCE FIGURE" if state == "SOURCE_EMBED" else "SOURCE-DERIVED REDRAW"
    if state == "SOURCE_EMBED":
        body = f'<img src="{esc(fig["src"])}" alt="{esc(fig["alt"])}" loading="lazy">'
    else:
        body = f'<div class="svg-wrap" role="img" aria-label="{esc(fig["alt"])}">{fig["svg"]}</div>'
    return (
        f'<figure class="source-figure" data-figure-state="{state}" data-g9-figure>'
        f'<div class="prov">{label}</div>{body}'
        f'<figcaption>{esc(fig.get("caption", fig["alt"]))}</figcaption></figure>'
    )


def render_attempt(q: dict) -> str:
    qid = esc(q["id"])
    rtype = q["response"]["type"]
    prompt = esc(q["response"].get("prompt", "Your attempt"))
    if rtype == "MCQ_SINGLE":
        options = []
        for i, option in enumerate(q.get("options") or []):
            oid = f"{qid}-opt-{i}"
            options.append(
                f'<label class="choice" for="{oid}"><input id="{oid}" type="radio" '
                f'name="attempt-{qid}" value="{i}" data-attempt-control><span>{esc(option)}</span></label>'
            )
        field = f"<fieldset><legend>{prompt}</legend>{''.join(options)}</fieldset>"
    elif rtype == "SHORT_TEXT":
        field = (
            f'<label for="{qid}-short">{prompt}</label>'
            f'<input id="{qid}-short" class="short-answer" type="text" autocomplete="off" data-attempt-control>'
        )
    else:
        field = (
            f'<label for="{qid}-work">{prompt}</label>'
            f'<textarea id="{qid}-work" rows="4" data-attempt-control></textarea>'
            '<label class="paper"><input type="checkbox" data-paper-attempt> I worked this question on paper.</label>'
        )
    return (
        '<div class="attempt" data-g9-attempt-panel>' + field +
        '<div class="attempt-actions"><button type="button" data-g9-commit disabled>Commit attempt</button>'
        '<span data-g9-attempt-status aria-live="polite">Answer remains locked.</span></div></div>'
    )


def render_hints(q: dict) -> str:
    hints = q.get("source_hints") or []
    if not hints:
        return ""
    return (
        '<div class="source-hints" data-source-hints><div class="prov">SOURCE HINT</div>'
        '<button type="button" data-g9-next-source-hint>Show source hint</button>'
        '<ol data-g9-source-hint-list aria-live="polite"></ol>'
        f'<script type="application/json" data-source-hint-payload>{payload(hints)}</script></div>'
    )


def render_question(q: dict) -> str:
    answer = q["answer"]
    authored = q.get("authored_support") or {}
    answer_data = {
        "source_summary": answer.get("source_summary"),
        "source_reasoning": answer.get("source_reasoning") or [],
        "source_rubric": answer.get("source_rubric") or [],
        "authored_summary": answer.get("authored_summary"),
        "authored_answer_label": answer.get("authored_answer_label", "AUTHORED ANSWER"),
        "authored_explanation": authored.get("explanation"),
        "authored_label": authored.get("label", "AUTHORED EXPLANATION / SUPPORT"),
    }
    ident = q["source_identity"]
    search_parts = [
        ident.get("label", ""), ident.get("original_identifier", ""), q.get("stem", ""),
        " ".join(q.get("options") or []), " ".join(q.get("conditions") or []),
        q.get("family_label", ""), q.get("section_id", ""),
    ]
    search_text = " ".join(x for x in search_parts if x).lower()
    extras = []
    enrich = q.get("enrichment") or {}
    if enrich.get("clinic_href"):
        extras.append(f'<a class="enrich" href="{esc(enrich["clinic_href"])}">Question Clinic</a>')
    if enrich.get("explorer_href"):
        extras.append(f'<a class="enrich" href="{esc(enrich["explorer_href"])}">Concept Explorer</a>')
    enrichment = (
        '<div class="enrichment"><span>Optional enrichment</span>' + "".join(extras) + "</div>"
        if extras else ""
    )
    meta = (
        f'<div class="source-meta"><span class="prov">SOURCE QUESTION</span>'
        f'<span>{esc(ident["label"])}</span><span>{esc(ident["original_identifier"])}</span>'
        f'<span>{esc(ident["locator"])}</span></div>'
    )
    options = lines(q.get("options"))
    subparts = lines(q.get("subparts"))
    conditions = lines(q.get("conditions"))
    detail = ""
    if conditions:
        detail += "<h3>Conditions</h3>" + conditions
    if subparts:
        detail += "<h3>Subparts</h3>" + subparts
    if options:
        detail += "<h3>Options</h3>" + options
    return (
        f'<article id="{esc(q["id"])}" class="question {q.get("difficulty","ROUTINE").lower()}" '
        f'data-question-id="{esc(q["id"])}" data-family="{esc(q["family_id"])}" '
        f'data-search-text="{esc(search_text)}" data-attempted="0">'
        f'{meta}<div class="qhead"><h3>{esc(q.get("learner_label", ident["original_identifier"]))}</h3>'
        f'<span class="difficulty">{esc(q.get("difficulty","ROUTINE"))}</span></div>'
        f'<div class="stem">{esc(q["stem"])}</div>{detail}{render_figure(q)}{render_hints(q)}'
        f'{render_attempt(q)}<div class="reveal-row"><button type="button" data-g9-reveal-answer '
        f'aria-expanded="false" disabled>Reveal answer</button></div>'
        f'<div class="answer-slot" data-g9-answer-slot hidden></div>'
        f'<script type="application/json" data-answer-payload>{payload(answer_data)}</script>'
        f'{enrichment}</article>'
    )


CSS = r"""
:root{--bg:#f5f7fb;--card:#fff;--text:#18212f;--muted:#5d6877;--line:#d7dde7;--accent:#1865f2;--focus:#7a4e00;--source:#eaf2ff;--authored:#fff5d9;--max:1380px;font:17px/1.55 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color-scheme:light}
*{box-sizing:border-box}html{scroll-behavior:smooth;overflow-x:hidden}body{margin:0;background:var(--bg);color:var(--text);overflow-x:hidden}a{color:#0b57c7}button,input,select,textarea{font:inherit}button,a.enrich,.nav a,select,.home{min-height:48px;min-width:48px}button,select,input,textarea{border:1px solid #aeb8c7;border-radius:10px;background:#fff;color:var(--text)}button{padding:10px 16px;font-weight:750;cursor:pointer}button:disabled{cursor:not-allowed;opacity:.52}input[type=text],input[type=search],select,textarea{padding:11px 12px;width:100%}:focus-visible{outline:3px solid var(--focus);outline-offset:3px}.header{position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid var(--line)}.header-inner{max-width:var(--max);margin:auto;padding:10px 18px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}.home{display:inline-flex;align-items:center;padding:8px 14px;border:1px solid var(--line);border-radius:10px;text-decoration:none;font-weight:800}.title{font-weight:850;flex:1}.search{min-width:min(420px,100%)}.search label,.family label{display:block;font-size:.82rem;font-weight:750;color:var(--muted);margin-bottom:4px}.layout{max-width:var(--max);margin:auto;padding:22px 18px 56px;display:grid;grid-template-columns:1fr;gap:20px}.side,.intro,.question{background:var(--card);border:1px solid var(--line);border-radius:14px}.side{padding:14px}.nav{display:flex;flex-wrap:wrap;gap:8px}.nav a{display:inline-flex;align-items:center;padding:8px 12px;border:1px solid var(--line);border-radius:10px;text-decoration:none}.family{margin-top:14px}.intro{padding:20px;margin-bottom:20px}.intro h1{margin:.2em 0}.basis{font-size:.86rem;color:var(--muted);overflow-wrap:anywhere}.source-section{scroll-margin-top:90px}.source-section>h2{margin:28px 0 10px}.question-list{display:grid;gap:14px}.question{padding:18px;scroll-margin-top:88px;min-width:0}.question.hard{border-left:5px solid #8d65c5}.source-meta{display:flex;gap:8px;flex-wrap:wrap;align-items:center;color:var(--muted);font-size:.83rem}.prov{display:inline-flex;align-items:center;width:max-content;max-width:100%;padding:4px 8px;border-radius:999px;background:var(--source);font-size:.76rem;font-weight:900;letter-spacing:.04em}.qhead{display:flex;justify-content:space-between;gap:12px;align-items:start}.qhead h3{font-size:1.2rem;margin:.7em 0}.difficulty{font-size:.75rem;padding:4px 8px;border-radius:999px;background:#eef1f5}.stem{font-size:1.06rem;overflow-wrap:anywhere}.question ul{padding-left:1.35em}.source-figure{margin:16px 0;padding:12px;border:1px solid var(--line);border-radius:12px;overflow:hidden}.source-figure img,.source-figure svg{display:block;max-width:100%;height:auto;margin:10px auto}.svg-wrap{max-width:100%;overflow:hidden}.source-figure figcaption{font-size:.88rem;color:var(--muted)}.source-hints{margin-top:14px;padding:12px;border-left:4px solid #5b92de;background:#f6f9ff}.source-hints ol{margin-bottom:0}.attempt{margin-top:16px;padding:14px;background:#f7f8fb;border:1px solid var(--line);border-radius:12px}.attempt fieldset{border:0;padding:0;margin:0}.attempt legend,.attempt>label{font-weight:800;margin-bottom:8px;display:block}.choice{display:flex;align-items:flex-start;gap:10px;min-height:48px;padding:10px;border:1px solid var(--line);border-radius:10px;margin-top:8px}.choice input{width:22px;height:22px;flex:0 0 auto}.paper{display:flex!important;align-items:center;gap:10px;min-height:48px;margin-top:8px;font-weight:600!important}.paper input{width:22px;height:22px}.attempt-actions,.reveal-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px}.attempt-actions span{color:var(--muted);font-size:.88rem}.answer-slot{margin-top:12px}.answer-card{padding:14px;border:1px solid #9db9e4;border-radius:12px;background:#f6faff}.authored{margin-top:12px;padding:12px;border:1px solid #dfc376;border-radius:10px;background:var(--authored)}.authored .prov{background:#ffe8a7}.enrichment{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:14px;padding-top:12px;border-top:1px dashed var(--line)}.enrich{display:inline-flex;align-items:center;padding:8px 12px;border:1px solid #baa8d8;border-radius:10px;text-decoration:none;background:#fbf8ff;font-weight:750}.empty{padding:24px;background:#fff;border:1px dashed var(--line);border-radius:12px;color:var(--muted)}footer{max-width:var(--max);margin:auto;padding:0 18px 34px;color:var(--muted);font-size:.84rem;overflow-wrap:anywhere}
@media (min-width:1100px) and (orientation:landscape){.layout{grid-template-columns:minmax(230px,270px) minmax(0,1fr)}.side{position:sticky;top:84px;align-self:start}.nav{display:grid}.nav a{width:100%}}
@media (max-width:700px){:root{font-size:16px}.header-inner,.layout{padding-left:12px;padding-right:12px}.question{padding:15px}.qhead{display:block}.search{min-width:100%}.nav{display:grid;grid-template-columns:1fr 1fr}.nav a{justify-content:center;text-align:center}}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
@media print{.header,.side,.attempt,.source-hints,.reveal-row,.enrichment{display:none!important}.layout{display:block;max-width:none}.question{break-inside:avoid}.answer-card{display:block!important}}
"""

JS = r"""
(function(){
'use strict';
var qa=function(s,r){return Array.from((r||document).querySelectorAll(s));};
var parse=function(el){try{return JSON.parse(el.textContent);}catch(e){return null;}};
var clean=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
var list=function(title,values){return Array.isArray(values)&&values.length?'<h3>'+clean(title)+'</h3><ul>'+values.map(function(x){return '<li>'+clean(x)+'</li>';}).join('')+'</ul>':'';};
qa('[data-question-id]').forEach(function(card){
  var controls=qa('[data-attempt-control]',card), paper=card.querySelector('[data-paper-attempt]'), commit=card.querySelector('[data-g9-commit]'), reveal=card.querySelector('[data-g9-reveal-answer]'), status=card.querySelector('[data-g9-attempt-status]');
  var ready=function(){var radios=controls.filter(function(x){return x.type==='radio';});if(radios.length)return radios.some(function(x){return x.checked;});var text=controls.find(function(x){return x.tagName==='INPUT'||x.tagName==='TEXTAREA';});return !!((text&&text.value.trim())||(paper&&paper.checked));};
  var sync=function(){commit.disabled=card.dataset.attempted==='1'||!ready();};
  controls.forEach(function(x){x.addEventListener('input',sync);x.addEventListener('change',sync);});if(paper)paper.addEventListener('change',sync);sync();
  commit.addEventListener('click',function(){if(!ready())return;card.dataset.attempted='1';controls.forEach(function(x){x.disabled=true;});if(paper)paper.disabled=true;commit.disabled=true;reveal.disabled=false;status.textContent='Attempt committed. Source answer can now be revealed.';});
  reveal.addEventListener('click',function(){if(card.dataset.attempted!=='1')return;var target=card.querySelector('[data-g9-answer-slot]');if(target.dataset.rendered==='1'){var was=target.hidden;target.hidden=!was;reveal.setAttribute('aria-expanded',String(was));reveal.textContent=was?'Hide answer':'Reveal answer';return;}var p=parse(card.querySelector('[data-answer-payload]'));if(!p)return;var out='<section class="answer-card">';if(p.source_summary){out+='<div class="prov">SOURCE ANSWER</div><h3>Answer key</h3><p>'+clean(p.source_summary)+'</p>'+list('Source working',p.source_reasoning)+list('Source rubric',p.source_rubric);}else{out+='<div class="prov">SOURCE ANSWER NOT PRESENT</div><p>The source custody record contains no source answer for this item.</p>';}if(p.authored_summary)out+='<section class="authored"><div class="prov">'+clean(p.authored_answer_label||'AUTHORED ANSWER')+'</div><h3>Answer</h3><p>'+clean(p.authored_summary)+'</p></section>';if(p.authored_explanation)out+='<section class="authored"><div class="prov">'+clean(p.authored_label||'AUTHORED EXPLANATION / SUPPORT')+'</div><p>'+clean(p.authored_explanation)+'</p></section>';out+='</section>';target.innerHTML=out;target.dataset.rendered='1';target.hidden=false;reveal.setAttribute('aria-expanded','true');reveal.textContent='Hide answer';});
  var hb=card.querySelector('[data-g9-next-source-hint]');if(hb){var hints=parse(card.querySelector('[data-source-hint-payload]'))||[],shown=0;hb.addEventListener('click',function(){if(shown>=hints.length)return;var li=document.createElement('li');li.textContent=hints[shown++];card.querySelector('[data-g9-source-hint-list]').appendChild(li);hb.textContent=shown<hints.length?'Next source hint':'All source hints shown';hb.disabled=shown>=hints.length;});}
});
var search=document.querySelector('[data-g9-search]'),family=document.querySelector('[data-g9-family]');
var filter=function(){var term=(search?search.value:'').trim().toLowerCase(),fam=family?family.value:'ALL',visible=0;qa('[data-question-id]').forEach(function(card){var yes=(!term||card.dataset.searchText.indexOf(term)>=0)&&(fam==='ALL'||card.dataset.family===fam);card.hidden=!yes;if(yes)visible++;});qa('[data-source-section]').forEach(function(sec){sec.hidden=!qa('[data-question-id]',sec).some(function(q){return !q.hidden;});});var empty=document.querySelector('[data-g9-empty]');if(empty)empty.hidden=visible!==0;};
if(search)search.addEventListener('input',filter);if(family)family.addEventListener('change',filter);
})();
"""


def render(data: dict) -> str:
    validate(data)
    product = data["product"]
    basis = product["source_basis"]
    families = []
    for q in data["questions"]:
        pair = (q["family_id"], q["family_label"])
        if pair not in families:
            families.append(pair)
    grouped = {s["id"]: [] for s in data["sections"]}
    for q in data["questions"]:
        grouped[q["section_id"]].append(q)
    nav = "".join(f'<a href="#{esc(s["id"])}">{esc(s["title"])}</a>' for s in data["sections"])
    family_options = '<option value="ALL">All families</option>' + "".join(
        f'<option value="{esc(fid)}">{esc(label)}</option>' for fid, label in families
    )
    sections = "".join(
        f'<section id="{esc(s["id"])}" class="source-section" data-source-section><h2>{esc(s["title"])}</h2>'
        '<div class="question-list">' + "".join(render_question(q) for q in grouped[s["id"]]) + '</div></section>'
        for s in data["sections"] if grouped[s["id"]]
    )
    digest = hashlib.sha256(json.dumps(data, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
    return f'''<!doctype html>
<html lang="en" data-core="CORE2" data-g9-renderer="{RENDERER}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="g9-source-acquisition" content="{esc(basis['acquisition_id'])}">
<meta name="g9-source-digest" content="{esc(basis['source_digest'])}">
<meta name="g9-ledger-digest" content="{digest}">
<title>{esc(product['title'])} | Source questions</title><style>{CSS}</style></head>
<body><header class="header" data-g9-shell-header><div class="header-inner">
<a class="home" href="{esc(product['home_href'])}">Home</a><div class="title">{esc(product['title'])}</div>
<div class="search"><label for="g9-search">Search source questions</label><input id="g9-search" data-g9-search type="search" placeholder="Search questions (answers stay locked)"></div>
</div></header><div class="layout"><aside class="side"><h2>Source sections</h2>
<nav class="nav" aria-label="Source sections">{nav}</nav><div class="family"><label for="g9-family">Mathematical family</label><select id="g9-family" data-g9-family>{family_options}</select></div></aside>
<main><section class="intro"><div class="prov">CORE2 | SOURCE QUESTION SPINE</div><h1>{esc(product['title'])}</h1>
<p>{esc(product.get('intro','Attempt the source question before opening its answer. Optional enrichment is separate.'))}</p>
<p class="basis">Source custody: {esc(basis['resource_ref'])} | acquisition {esc(basis['acquisition_id'])} | provider head {esc(basis['provider_head'])} | rights {esc(basis['rights'])}</p></section>
{sections}<div class="empty" data-g9-empty hidden>No source questions match this view.</div></main></div>
<footer>{esc(product['subject'])} | {esc(product['id'])} | renderer {RENDERER} | ledger {digest[:16]}</footer>
<script>{JS}</script></body></html>'''


def make_receipt(data: dict, html_text: str, source: str) -> dict:
    return {
        "renderer": RENDERER,
        "schema": SCHEMA,
        "input": source,
        "input_sha256": hashlib.sha256(json.dumps(data, sort_keys=True, ensure_ascii=False).encode()).hexdigest(),
        "html_sha256": hashlib.sha256(html_text.encode()).hexdigest(),
        "source_basis": data["product"]["source_basis"],
        "question_ids": [q["id"] for q in data["questions"]],
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ledger", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--receipt")
    args = parser.parse_args(argv)
    source = Path(args.ledger)
    data = json.loads(source.read_text(encoding="utf-8"))
    output = render(data)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(output, encoding="utf-8")
    receipt_path = Path(args.receipt) if args.receipt else out.with_suffix(".receipt.json")
    receipt_path.write_text(json.dumps(make_receipt(data, output, str(source)), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {out} ({len(data['questions'])} questions)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
