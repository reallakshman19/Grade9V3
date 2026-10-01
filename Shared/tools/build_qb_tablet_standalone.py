#!/usr/bin/env python3
"""Build/check the offline 12.7-inch Canonical Question Bank standalone.

The HTML is a projection only. Academic truth remains in the canonical Physics/
Chemistry exam-bank records and the governed Question Bank view registry.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import subprocess
from functools import lru_cache
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
PHYSICS = REPO / "Physics/library/exam-bank/competitive-exam-question-bank.v2.json"
CHEMISTRY = REPO / "Chemistry/library/exam-bank/competitive-exam-question-bank.v2.json"
VIEWS = REPO / "Shared/tools/question-bank-views.v1.json"
BENCHMARK = REPO / "benchmarks/selected_question_bank_TABLET_STUDY.html"
KATEX = REPO / "public/vendor/katex/0.16.8/katex.min.js"
OUT = REPO / "standalone/core2-canonical-question-bank-tablet.html"

MCQ_SINGLE = {"single_correct_mcq", "assertion_reason_mcq", "matrix_match_mcq"}
MCQ_MULTI = {"multi_correct_mcq"}


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def esc(value) -> str:
    return html.escape(str(value if value is not None else ""), quote=True)


@lru_cache(maxsize=1024)
def typed_math(tex: str, display: bool) -> str:
    """Compile declared TeX to native MathML with the repository's pinned local KaTeX."""
    script = (
        'const fs=require("fs");const k=require(process.argv[1]);'
        'const v=JSON.parse(fs.readFileSync(0,"utf8"));'
        'process.stdout.write(k.renderToString(v.tex,{displayMode:v.display,output:"mathml",'
        'throwOnError:true,trust:false,maxExpand:1000}));'
    )
    result = subprocess.run(
        ["node", "-e", script, str(KATEX)],
        input=json.dumps({"tex": tex, "display": display}),
        text=True,
        capture_output=True,
        encoding="utf-8",
        timeout=15,
    )
    if result.returncode:
        raise ValueError(f"declared TeX could not be typeset: {tex}")
    return result.stdout


def render_text(q, target: str, value) -> str:
    """Render only explicitly declared math spans; prose is escaped verbatim."""
    text = str(value or "")
    spans = [
        span
        for span in (q.get("extensions") or {}).get("grade9v3:math_spans", [])
        if span["target"] == target
    ]
    located = []
    for span in spans:
        literal = span["literal"]
        if literal not in text:
            if target == "conditions" and any(literal in row for row in q.get("conditions") or []):
                continue
            raise ValueError(f"{q['id']}: {target} declared math literal missing: {literal}")
        located.extend((match.start(), span) for match in re.finditer(re.escape(literal), text))
    located = [
        (start, span)
        for start, span in located
        if not any(
            other <= start
            and other + len(parent["literal"]) >= start + len(span["literal"])
            and len(parent["literal"]) > len(span["literal"])
            for other, parent in located
        )
    ]
    parts = []
    cursor = 0
    for start, span in sorted(located, key=lambda pair: pair[0]):
        if start < cursor:
            raise ValueError(f"{q['id']}: {target} overlapping declared math literals")
        parts.append(esc(text[cursor:start]))
        parts.append(typed_math(span["tex"], bool(span["display"])))
        cursor = start + len(span["literal"])
    parts.append(esc(text[cursor:]))
    return "".join(parts)


def build_id() -> str:
    h = hashlib.sha256()
    for path in (PHYSICS, CHEMISTRY, VIEWS, BENCHMARK, KATEX):
        h.update(path.relative_to(REPO).as_posix().encode())
        h.update(b"\0")
        h.update(path.read_bytes())
        h.update(b"\0")
    return "sha256:" + h.hexdigest()


def canonical_questions():
    physics = load_json(PHYSICS)["questions"]
    chemistry = load_json(CHEMISTRY)["questions"]
    questions = [*physics, *chemistry]
    ids = [q["id"] for q in questions]
    if len(ids) != 77 or len(set(ids)) != 77:
        raise ValueError(f"Expected exactly 77 unique canonical questions, got {len(ids)}")
    return questions


def selected_view():
    doc = load_json(VIEWS)
    view = next((v for v in doc["views"] if v["id"] == "selected-d3d4-non-jee-advanced"), None)
    if not view:
        raise ValueError("selected-d3d4-non-jee-advanced view missing")
    refs = list(view["resolved_question_refs"])
    if len(refs) != 7 or len(set(refs)) != 7:
        raise ValueError("Selected D3/D4 view must resolve to exactly seven unique questions")
    return view


def benchmark_svgs(refs, questions):
    """Bind benchmark study SVGs by source identity, never by local Q-number."""
    raw = BENCHMARK.read_text(encoding="utf-8")
    articles = []
    for match in re.finditer(r'<article class="question" id="([^"]+)">(.*?)</article>', raw, re.S):
        local_id, block = match.groups()
        qid_match = re.search(r'<div class="qid">(.*?)</div>', block, re.S)
        svg_match = re.search(r'(<svg\b.*?</svg>)', block, re.S)
        if qid_match and svg_match:
            label = re.sub(r'<[^>]+>', ' ', qid_match.group(1))
            label = re.sub(r'\s+', ' ', label).strip()
            articles.append((local_id, label, svg_match.group(1)))
    if len(articles) != 7:
        raise ValueError(f"Expected seven benchmark SVG articles, got {len(articles)}")

    by_id = {q["id"]: q for q in questions}
    svgs = {}
    used = set()
    for ref in refs:
        q = by_id[ref]
        source = custody(q)
        exam = str(source.get("exam", "")).lower()
        year = str(source.get("year", ""))
        qnum = re.sub(r'^Q', '', str(source.get("question_number", "")), flags=re.I).lstrip('0') or '0'
        matches = []
        for local_id, label, svg in articles:
            low = label.lower()
            exam_ok = exam in low
            year_ok = year in label
            q_ok = re.search(rf'\bQ0*{re.escape(qnum)}\b', label, re.I) is not None
            if exam_ok and year_ok and q_ok:
                matches.append((local_id, svg))
        if len(matches) != 1:
            raise ValueError(f"Benchmark source identity for {ref} resolved to {len(matches)} articles")
        local_id, svg = matches[0]
        if local_id in used:
            raise ValueError(f"Benchmark article {local_id} mapped more than once")
        used.add(local_id)
        svgs[ref] = svg
    return svgs


def analysis(q):
    return q.get("extensions", {}).get("grade9v3:analysis", {})


def custody(q):
    return q.get("extensions", {}).get("grade9v3:source_custody", {})


def question_type(q):
    return analysis(q).get("learner_question_type", "free_response")


def option_parts(option: str, index: int):
    text = str(option)
    match = re.match(r'^\(([^)]+)\)\s*(.*)$', text)
    if match and match.group(1) in {"A", "B", "C", "D", "1", "2", "3", "4"}:
        return match.group(1), match.group(2)
    return chr(65 + index), text


def _answer_norm(value: str) -> str:
    return re.sub(r'\s+', ' ', str(value)).strip().rstrip('.').casefold()


def correct_letters(q):
    qtype = question_type(q)
    summary = q.get("answer", {}).get("summary", "")
    options = q.get("options") or []
    if not options:
        return []
    if qtype in MCQ_SINGLE:
        m = re.search(r'^Option\s*\(([^)]+)\)', summary)
        if m:
            return [m.group(1)]
        m = re.search(r'official\s+option\s*\(?([A-Z0-9]+)\)?', summary, re.I)
        if m:
            return [m.group(1)]
        target = _answer_norm(summary)
        matches = [
            option_parts(option, idx)[0]
            for idx, option in enumerate(options)
            if _answer_norm(option_parts(option, idx)[1]) == target
        ]
        if len(matches) != 1:
            raise ValueError(f"{q['id']}: answer text resolved to {len(matches)} option payloads")
        return matches
    if qtype in MCQ_MULTI:
        prefix = summary.split(".", 1)[0]
        labels = re.findall(r'\(([^)]+)\)', prefix)
        if not labels:
            raise ValueError(f"{q['id']}: multi-answer summary does not identify options")
        return labels
    return []


def render_options(q):
    options = q.get("options") or []
    if not options:
        return ""
    qtype = question_type(q)
    input_type = "checkbox" if qtype in MCQ_MULTI else "radio"
    name = f"answer-{q['id']}"
    rows = []
    for idx, option in enumerate(options):
        label, payload = option_parts(option, idx)
        rows.append(
            f'<label class="q-option-control">'
            f'<input class="answer-choice" type="{input_type}" name="{esc(name)}" value="{esc(label)}" '
            f'data-key="{esc(q["id"])}">'
            f'<span class="option-letter">{esc(label)}</span>'
            f'<span class="option-text">{render_text(q, f"option:{idx}", payload)}</span>'
            f'</label>'
        )
    return '<fieldset class="q-options" aria-label="Answer choices">' + "".join(rows) + "</fieldset>"


def render_conditions(q):
    conditions = q.get("conditions") or []
    if not conditions:
        return ""
    return '<ul class="q-conditions">' + "".join(f"<li>{render_text(q, 'conditions', x)}</li>" for x in conditions) + "</ul>"


def render_hints(q):
    scaffolds = q.get("scaffolds") or []
    buttons, payloads, slots = [], [], []
    for idx, row in enumerate(scaffolds):
        hid = f"{q['id']}-hint-{idx}"
        label = row.get("support_kind") or f"HINT {idx + 1}"
        buttons.append(
            f'<button class="hint-pill" type="button" data-hint-index="{idx}" '
            f'data-target="{esc(hid)}"{" disabled" if idx else ""}>'
            f'Hint {idx + 1} · {esc(label)}</button>'
        )
        payloads.append(
            f'<template id="{esc(hid)}-template"><div class="hint-box">'
            f'<strong>{esc(label)}:</strong> {render_text(q, f"scaffold:{idx}", row.get("text", ""))}</div></template>'
        )
        slots.append(f'<div id="{esc(hid)}" class="hint-slot" aria-live="polite"></div>')
    if not buttons:
        return ""
    return (
        '<div class="hint-ladder" aria-label="Progressive hint ladder">'
        '<div class="hint-pill-row">' + "".join(buttons) + "</div>"
        + "".join(slots) + "".join(payloads) + "</div>"
    )


def render_solution(q):
    a = q.get("answer") or {}
    route = a.get("reasoning_route") or []
    crux = analysis(q).get("stable_crux_move", "")
    trap = analysis(q).get("common_wrong_route", "")
    check = a.get("check", "")
    reasoning = "".join(
        f'<li><span class="step-kind">{esc(step.get("kind", ""))}</span>'
        f'<span>{render_text(q, f"answer_reasoning:{idx}", step.get("action", ""))}</span></li>'
        for idx, step in enumerate(route)
    )
    return (
        f'<template id="{esc(q["id"])}-solution-template">'
        f'<section class="solution-body">'
        f'<p class="verified-answer"><strong>Verified answer:</strong> {render_text(q, "answer_summary", a.get("summary", ""))}</p>'
        f'<ol class="reasoning-route">{reasoning}</ol>'
        f'<div class="crux-box"><strong>Crux move:</strong> {render_text(q, "stable_crux_move", crux)}</div>'
        f'<div class="trap-box"><strong>Watch out:</strong> {render_text(q, "common_wrong_route", trap)}</div>'
        + (f'<div class="check-box"><strong>Independent check:</strong> {render_text(q, "answer_check", check)}</div>' if check else "")
        + '</section></template>'
        f'<div id="{esc(q["id"])}-solution" class="solution-slot" aria-live="polite"></div>'
    )


def render_attempt(q):
    has_options = bool(q.get("options"))
    if has_options:
        attempt = render_options(q)
    else:
        attempt = (
            f'<label class="answer-label" for="{esc(q["id"])}-answer">Your answer commit</label>'
            f'<input id="{esc(q["id"])}-answer" class="answer-input" type="text" '
            f'data-key="{esc(q["id"])}" autocomplete="off" '
            f'placeholder="Enter a concise answer before revealing the worked solution">'
        )
    return (
        '<div class="attempt-box">'
        + attempt
        + f'<label class="answer-label" for="{esc(q["id"])}-work">Working / scratchpad</label>'
        f'<textarea id="{esc(q["id"])}-work" class="practice-textarea" '
        f'data-key="{esc(q["id"])}" placeholder="Work out your reasoning here; it autosaves on this device."></textarea>'
        f'<div class="attempt-actions"><button type="button" class="check-solution-btn" '
        f'data-question="{esc(q["id"])}" disabled>Commit attempt &amp; reveal solution</button>'
        f'<button type="button" class="clear-attempt-btn" data-question="{esc(q["id"])}">Clear</button></div>'
        f'<div class="answer-feedback" aria-live="polite"></div>'
        + render_solution(q)
        + "</div>"
    )


def render_representation(q, svg_map):
    svg = svg_map.get(q["id"])
    if not svg:
        return ""
    return (
        '<div class="representation-box">'
        '<div class="meta-title">Study representation</div>'
        '<p class="representation-note">Owner-supplied Selected D3/D4 benchmark study aid; '
        'authored representation, not an original exam-source figure.</p>'
        + svg + "</div>"
    )


def render_question(q, selected_refs, svg_map):
    a = analysis(q)
    c = custody(q)
    difficulty = a.get("difficulty", {})
    diff = difficulty.get("band", "")
    score = difficulty.get("score", "")
    selected = q["id"] in selected_refs
    exam = c.get("exam", "")
    year = c.get("year", "")
    paper = c.get("paper", "")
    topic = a.get("topic", "")
    source_status = c.get("source_status", "")
    qtype = question_type(q)
    correct = ",".join(correct_letters(q)) if q.get("options") else ""
    search = " ".join(
        str(x) for x in (
            q["id"], exam, year, paper, topic, diff, q.get("stem", ""),
            a.get("stable_crux_move", ""), a.get("common_wrong_route", "")
        )
    ).lower()
    return f"""
<article class="question-card stage-support-columns" id="{esc(q['id'])}"
  data-subject="{esc(c.get('section', ''))}" data-diff="{esc(diff)}"
  data-selected="{'true' if selected else 'false'}" data-question-type="{esc(qtype)}"
  data-correct="{esc(correct)}" data-search="{esc(search)}">
  <div class="stage-column">
    <header class="q-header">
      <div><span class="q-id">{esc(q['id'])}</span><span class="paper-label">{esc(paper)}</span></div>
      <div class="q-badges"><span class="badge">{esc(c.get('section', ''))}</span>
      <span class="badge difficulty">{esc(diff)}{f' · {score}/10' if score != '' else ''}</span>
      {'<span class="badge selected">Selected D3/D4</span>' if selected else ''}</div>
    </header>
    <p class="q-stem">{render_text(q, "stem", q.get('stem', ''))}</p>
    {render_conditions(q)}
    {render_hints(q)}
    {render_attempt(q)}
  </div>
  <aside class="support-column">
    <div class="meta-box"><div class="meta-title">Academic provenance</div>
      <div class="meta-desc"><strong>Exam:</strong> {esc(exam)} {esc(year)}<br>
      <strong>Session:</strong> {esc(paper)}<br><strong>Topic:</strong> {esc(topic)}<br>
      <strong>Status:</strong> {esc(source_status.replace('_', ' ').title())}</div></div>
    {render_representation(q, svg_map)}
    <div class="meta-box"><div class="meta-title">Common trap</div>
      <div class="meta-desc">{render_text(q, "common_wrong_route", a.get('common_wrong_route', ''))}</div></div>
  </aside>
</article>"""


CSS = r"""
:root{--touch:48px;--page:#07101e;--surface:#101c2e;--card:#15243a;--soft:#1b2d47;--line:#31496c;--text:#f8fafc;--muted:#a8b7cc;--accent:#38bdf8;--success:#34d399;--warn:#f59e0b;--danger:#fb7185;--radius:14px}
[data-theme="light"]{--page:#eef3f8;--surface:#fff;--card:#fff;--soft:#f8fafc;--line:#cbd5e1;--text:#0f172a;--muted:#526175;--accent:#0369a1;--success:#047857;--warn:#a16207;--danger:#be123c}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--page);color:var(--text);font:16px/1.55 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
button,input,textarea{font:inherit}button,.tab-btn,.clear-search-btn,.hint-pill,.check-solution-btn,.clear-attempt-btn,.theme-toggle{min-height:var(--touch);min-width:var(--touch);touch-action:manipulation}
button{cursor:pointer}button:disabled{cursor:not-allowed;opacity:.48}.app{width:min(1480px,100%);margin:auto;padding:18px}.hero{background:linear-gradient(135deg,var(--surface),var(--card));border:1px solid var(--line);border-radius:20px;padding:22px;margin-bottom:16px}.hero-row{display:flex;gap:14px;justify-content:space-between;align-items:flex-start}.hero h1{font-size:clamp(24px,3vw,38px);line-height:1.12;margin:8px 0}.hero p{color:var(--muted);max-width:85ch}.badge-row,.tabs,.hint-pill-row,.q-badges,.attempt-actions{display:flex;gap:8px;flex-wrap:wrap}.badge{display:inline-flex;align-items:center;border:1px solid var(--line);background:var(--soft);padding:5px 9px;border-radius:999px;font-size:12px;font-weight:700}.selected{border-color:var(--accent);color:var(--accent)}.difficulty{color:var(--warn)}.toolbar{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--page) 90%,transparent);backdrop-filter:blur(12px);padding:10px 0}.search-row{display:flex;gap:10px;margin-bottom:10px}.search-input{width:100%;min-height:var(--touch);border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--text);padding:10px 13px}.tab-btn,.clear-search-btn,.theme-toggle,.hint-pill,.clear-attempt-btn{border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--text);padding:10px 14px}.tab-btn[aria-selected="true"],.hint-pill.revealed{border-color:var(--accent);color:var(--accent)}.result-count{color:var(--muted);font-size:14px;margin:8px 0 14px}
.question-card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px;margin:0 0 18px}.question-card[hidden]{display:none!important}.q-header{display:flex;gap:10px;justify-content:space-between;align-items:flex-start}.q-id{font:700 13px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--accent)}.paper-label{margin-left:8px;color:var(--muted);font-size:13px}.q-stem{font-size:17px;line-height:1.58}.q-conditions{color:var(--muted);padding-left:22px}.hint-ladder{margin:14px 0}.hint-slot:empty{display:none}.hint-box{margin:8px 0;padding:11px 13px;border-left:3px solid var(--accent);background:color-mix(in srgb,var(--accent) 9%,var(--surface));border-radius:0 9px 9px 0}
.attempt-box{margin-top:16px;padding:15px;border:1px solid var(--line);border-radius:13px;background:var(--surface)}.q-options{border:0;padding:0;margin:0 0 12px;display:grid;gap:8px}.q-option-control{min-height:var(--touch);display:grid;grid-template-columns:28px 34px 1fr;align-items:center;gap:7px;border:1px solid var(--line);border-radius:10px;padding:8px 10px;background:var(--card)}.q-option-control:focus-within{outline:3px solid color-mix(in srgb,var(--accent) 40%,transparent)}.answer-choice{width:20px;height:20px}.option-letter{font-weight:800;color:var(--accent)}.answer-label{display:block;font-weight:700;margin:8px 0 5px}.answer-input,.practice-textarea{width:100%;border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:10px;padding:11px 12px;scroll-margin-bottom:42vh}.answer-input{min-height:var(--touch)}.practice-textarea{min-height:130px;resize:vertical}.check-solution-btn{border:1px solid var(--accent);background:var(--accent);color:#00131c;border-radius:10px;padding:10px 15px;font-weight:800}.answer-feedback{min-height:24px;margin-top:8px;font-weight:700}.answer-feedback.correct{color:var(--success)}.answer-feedback.incorrect{color:var(--danger)}.solution-slot:empty{display:none}.solution-body{margin-top:12px;padding:14px;border:1px solid var(--line);border-radius:10px;background:var(--card)}.verified-answer{color:var(--success)}.reasoning-route{display:grid;gap:8px;padding-left:22px}.reasoning-route li{padding-left:4px}.step-kind{font-size:11px;font-weight:800;color:var(--accent);margin-right:8px}.crux-box,.trap-box,.check-box{padding:10px;border-radius:8px;margin-top:8px}.crux-box{background:color-mix(in srgb,var(--accent) 9%,var(--surface))}.trap-box{background:color-mix(in srgb,var(--danger) 9%,var(--surface))}.check-box{background:color-mix(in srgb,var(--success) 9%,var(--surface))}
.meta-box,.representation-box{border:1px solid var(--line);background:var(--surface);border-radius:12px;padding:12px;margin-bottom:12px}.meta-title{font-weight:800;color:var(--accent);margin-bottom:6px}.meta-desc,.representation-note{color:var(--muted);font-size:13px}.representation-box svg{display:block;width:100%;height:auto;max-height:340px}.support-column{min-width:0}
@media(min-width:1100px){.stage-support-columns{display:grid;grid-template-columns:minmax(0,2.1fr) minmax(360px,1fr);gap:26px;align-items:start}}
@media(max-width:1099px){.support-column{margin-top:18px;padding-top:16px;border-top:1px dashed var(--line)}}@media(max-width:620px){.app{padding:10px}.hero{padding:16px}.hero-row,.q-header,.search-row{flex-direction:column}.q-stem{font-size:16px}.question-card{padding:13px}.tabs{flex-wrap:nowrap;overflow-x:auto;padding-bottom:6px}.tab-btn{flex:0 0 auto}.q-option-control{grid-template-columns:26px 30px 1fr}}
button:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}}
@media print{body{background:#fff;color:#000}.toolbar,.theme-toggle,.attempt-actions,.practice-textarea,.answer-input,.hint-pill-row{display:none!important}.app{width:auto;padding:0}.hero,.question-card{box-shadow:none;border:0;border-radius:0}.question-card{break-after:page}.stage-support-columns{display:block}.support-column{position:static}.solution-slot:empty::before{content:"Solution remains withheld because no learner attempt was committed in this interactive session.";font-size:11px;color:#555}}
"""


JS = r"""
(() => {
  const root=document.documentElement;
  const safeGet=(k)=>{try{return localStorage.getItem(k)}catch{return null}};
  const safeSet=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
  const safeRemove=(k)=>{try{localStorage.removeItem(k)}catch{}};
  const theme=safeGet('g9_qb_theme')||'dark'; root.dataset.theme=theme;
  const themeBtn=document.getElementById('theme-toggle');
  const syncTheme=()=>{themeBtn.textContent=root.dataset.theme==='dark'?'Light mode':'Dark mode'};
  syncTheme(); themeBtn.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';safeSet('g9_qb_theme',root.dataset.theme);syncTheme()});

  const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionBehavior=reduceMotion?'auto':'smooth';
  const cards=[...document.querySelectorAll('.question-card')];
  const tabs=[...document.querySelectorAll('.tab-btn[data-filter]')];
  const search=document.getElementById('search-input');
  let filter='all';
  function applyFilter(){
    const query=search.value.trim().toLowerCase(); let count=0;
    cards.forEach(card=>{
      const subject=card.dataset.subject, diff=card.dataset.diff, selected=card.dataset.selected==='true';
      const tabOk=filter==='all'||(filter==='physics'&&subject==='Physics')||(filter==='chemistry'&&subject==='Chemistry')||(filter==='selected'&&selected)||(filter==='d3d4'&&(diff==='D3'||diff==='D4'));
      const searchOk=!query||card.dataset.search.includes(query);
      const show=tabOk&&searchOk; card.hidden=!show; if(show)count++;
    });
    document.getElementById('result-count').textContent=`Showing ${count} questions`;
  }
  tabs.forEach(btn=>btn.addEventListener('click',()=>{filter=btn.dataset.filter;tabs.forEach(x=>x.setAttribute('aria-selected',String(x===btn)));applyFilter()}));
  search.addEventListener('input',applyFilter);
  document.getElementById('clear-search').addEventListener('click',()=>{search.value='';applyFilter();search.focus()});

  function answerReady(card){
    const choices=[...card.querySelectorAll('.answer-choice')];
    if(choices.length)return choices.some(x=>x.checked);
    const input=card.querySelector('.answer-input'); return !!input&&input.value.trim().length>0;
  }
  function persistKey(el,suffix){return `g9_qb_${suffix}_${el.dataset.key}`}
  cards.forEach(card=>{
    const scratch=card.querySelector('.practice-textarea');
    const savedScratch=safeGet(persistKey(scratch,'work')); if(savedScratch!==null)scratch.value=savedScratch;
    scratch.addEventListener('input',()=>safeSet(persistKey(scratch,'work'),scratch.value));
    const answer=card.querySelector('.answer-input');
    if(answer){const saved=safeGet(persistKey(answer,'answer'));if(saved!==null)answer.value=saved;answer.addEventListener('input',()=>{safeSet(persistKey(answer,'answer'),answer.value);syncCommit(card)})}
    const choices=[...card.querySelectorAll('.answer-choice')];
    const savedChoice=safeGet(`g9_qb_choice_${card.id}`);
    if(savedChoice){
      const values=savedChoice.split(',');
      choices.forEach(x=>x.checked=values.includes(x.value));
    }
    choices.forEach(x=>x.addEventListener('change',()=>{safeSet(`g9_qb_choice_${card.id}`,choices.filter(y=>y.checked).map(y=>y.value).join(','));syncCommit(card)}));
    syncCommit(card);
  });
  function syncCommit(card){card.querySelector('.check-solution-btn').disabled=!answerReady(card)}

  document.querySelectorAll('.hint-ladder').forEach(ladder=>{
    const pills=[...ladder.querySelectorAll('.hint-pill')];
    pills.forEach((pill,index)=>pill.addEventListener('click',()=>{
      if(pill.disabled||pill.classList.contains('revealed'))return;
      const slot=document.getElementById(pill.dataset.target);
      const tpl=document.getElementById(pill.dataset.target+'-template');
      slot.replaceChildren(tpl.content.cloneNode(true)); pill.classList.add('revealed'); pill.disabled=true;
      if(pills[index+1])pills[index+1].disabled=false;
    }));
  });

  document.querySelectorAll('.check-solution-btn').forEach(btn=>btn.addEventListener('click',()=>{
    const card=document.getElementById(btn.dataset.question); if(!card||!answerReady(card))return;
    const feedback=card.querySelector('.answer-feedback');
    const choices=[...card.querySelectorAll('.answer-choice')];
    if(choices.length){
      const selected=choices.filter(x=>x.checked).map(x=>x.value).sort().join(',');
      const expected=(card.dataset.correct||'').split(',').filter(Boolean).sort().join(',');
      const ok=selected===expected; feedback.textContent=ok?'Your selected option set matches the verified answer.':'Your selected option set does not match the verified answer; compare your reasoning with the worked route.';
      feedback.className='answer-feedback '+(ok?'correct':'incorrect');
    }else{
      feedback.textContent='Attempt committed. Compare it with the verified worked route below.'; feedback.className='answer-feedback';
    }
    const tpl=document.getElementById(card.id+'-solution-template');
    const slot=document.getElementById(card.id+'-solution');
    if(slot.childElementCount===0)slot.append(tpl.content.cloneNode(true));
    btn.disabled=true; slot.scrollIntoView({block:'nearest',behavior:motionBehavior});
  }));

  document.querySelectorAll('.clear-attempt-btn').forEach(btn=>btn.addEventListener('click',()=>{
    const card=document.getElementById(btn.dataset.question); if(!card)return;
    const scratch=card.querySelector('.practice-textarea');scratch.value='';safeRemove(persistKey(scratch,'work'));
    const answer=card.querySelector('.answer-input');if(answer){answer.value='';safeRemove(persistKey(answer,'answer'))}
    card.querySelectorAll('.answer-choice').forEach(x=>x.checked=false);safeRemove(`g9_qb_choice_${card.id}`);
    card.querySelector('.answer-feedback').textContent='';card.querySelector('.solution-slot').replaceChildren();
    syncCommit(card);
  }));

  function keepFocusedVisible(){
    const el=document.activeElement;
    if(el&&el.matches('.practice-textarea,.answer-input,.search-input'))setTimeout(()=>el.scrollIntoView({block:'center',behavior:motionBehavior}),60);
  }
  document.addEventListener('focusin',e=>{if(e.target.matches('.practice-textarea,.answer-input,.search-input'))keepFocusedVisible()});
  if(window.visualViewport)window.visualViewport.addEventListener('resize',keepFocusedVisible);
  applyFilter();
})();
"""


def render():
    questions = canonical_questions()
    view = selected_view()
    selected_refs = list(view["resolved_question_refs"])
    ids = {q["id"] for q in questions}
    if not set(selected_refs) <= ids:
        raise ValueError("Selected D3/D4 view contains unknown canonical IDs")
    svg_map = benchmark_svgs(selected_refs, questions)
    cards = "\n".join(render_question(q, set(selected_refs), svg_map) for q in questions)
    bid = build_id()
    return f"""<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="77 source-verified canonical Physics and Chemistry PYQs with progressive support and worked solutions, plus the governed seven-question Selected D3/D4 study view.">
<meta name="grade9v3-qb-build" content="{esc(bid)}">
<title>Grade9V3 Canonical Question Bank · 12.7-inch Tablet Standalone</title>
<style>{CSS}</style>
</head>
<body>
<main class="app" data-build-id="{esc(bid)}">
<section class="hero">
  <div class="hero-row"><div>
    <div class="badge-row"><span class="badge">Canonical Question Bank</span><span class="badge">77 verified-parent PYQs</span><span class="badge selected">Selected D3/D4 · 7</span><span class="badge">Offline standalone</span></div>
    <h1>Canonical Question Bank · Tablet Study Edition</h1>
    <p>31 Physics + 46 Chemistry questions projected directly from repository canonical exam-bank records. Progressive hints stay hidden until requested; solutions remain inert until a learner commits an answer.</p>
  </div><button id="theme-toggle" type="button" class="theme-toggle">Light mode</button></div>
</section>
<section class="toolbar" aria-label="Question Bank controls">
  <div class="search-row"><input id="search-input" class="search-input" type="search" placeholder="Search question, exam, topic, crux move or trap"><button id="clear-search" type="button" class="clear-search-btn">Reset</button></div>
  <div class="tabs" role="tablist" aria-label="Question views">
    <button class="tab-btn" type="button" role="tab" aria-selected="true" data-filter="all">All 77</button>
    <button class="tab-btn" type="button" role="tab" aria-selected="false" data-filter="selected">Selected D3/D4 · 7</button>
    <button class="tab-btn" type="button" role="tab" aria-selected="false" data-filter="physics">Physics · 31</button>
    <button class="tab-btn" type="button" role="tab" aria-selected="false" data-filter="chemistry">Chemistry · 46</button>
    <button class="tab-btn" type="button" role="tab" aria-selected="false" data-filter="d3d4">All D3/D4</button>
  </div>
  <div id="result-count" class="result-count">Showing 77 questions</div>
</section>
<section id="question-list">{cards}</section>
</main>
<script>{JS}</script>
</body>
</html>
"""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    content = render()
    if args.write:
        OUT.write_text(content, encoding="utf-8")
    if args.check:
        actual = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
        if actual != content:
            raise SystemExit("QB_TABLET_STANDALONE_DRIFT: run build_qb_tablet_standalone.py --write")
    if not args.write and not args.check:
        print(content, end="")


if __name__ == "__main__":
    main()
