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
BLUEPRINT_REF = "BP-CORE2-SOURCE-QUESTION@1.5.0"
BLUEPRINT_SOURCE_PR = 372
BLUEPRINT_SOURCE_SHA = "edba5daf43371b4f5142ccc3ae16a1a1af6ba7a6"

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
    h.update(BLUEPRINT_REF.encode())
    h.update(b"\0")
    h.update(BLUEPRINT_SOURCE_SHA.encode())
    h.update(b"\0")
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


def question_type_label(q):
    return question_type(q).replace("_", " ").title()


def provenance_label(q):
    provenance = q.get("extensions", {}).get("grade9v3:provenance_class", "")
    if provenance == "PYQ_ADAPTED":
        return "Verified past-exam adaptation"
    return provenance.replace("_", " ").title()


def difficulty_time_label(seconds):
    if seconds in (None, ""):
        return ""
    minutes = max(1, round(float(seconds) / 60))
    return f"about {minutes} min"


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
            f'<label class="q-option-control g9-answer-option">'
            f'<input class="answer-choice" type="{input_type}" name="{esc(name)}" value="{esc(label)}" '
            f'data-key="{esc(q["id"])}">'
            f'<span class="option-letter" aria-hidden="true">{esc(label)}</span>'
            f'<span class="option-text">{render_text(q, f"option:{idx}", payload)}</span>'
            f'</label>'
        )
    return '<fieldset class="q-options g9-answer-options" aria-label="Answer choices">' + "".join(rows) + "</fieldset>"


def render_meta_item(kind, label, value):
    if value in (None, ""):
        return ""
    return (
        f'<span data-g9-meta-item data-g9-meta-kind="{esc(kind)}" data-g9-meta-value="{esc(value)}">'
        f'<strong>{esc(label)}:</strong> <span data-g9-meta-label>{esc(value)}</span></span>'
    )


def render_identity(q, selected):
    a = analysis(q)
    c = custody(q)
    d = a.get("difficulty") or {}
    exam = c.get("exam", "")
    year = c.get("year", "")
    paper = c.get("paper", "")
    qnum = str(c.get("question_number", "")).lstrip("0") or str(c.get("question_number", ""))
    source = " · ".join(x for x in (str(exam), str(year), str(paper), f"Q{qnum}" if qnum else "") if x)
    diff = d.get("band", "")
    score = d.get("score", "")
    diff_value = f"{diff} · {score}/10" if diff and score != "" else diff
    meta = [
        render_meta_item("subject", "Subject", c.get("section", "")),
        render_meta_item("topic", "Topic", a.get("topic", "")),
        render_meta_item("question-difficulty", "Difficulty", diff_value),
        render_meta_item("question-type", "Type", question_type_label(q)),
        render_meta_item("source", "Source", source),
        render_meta_item("provenance", "Provenance", provenance_label(q)),
    ]
    if selected:
        meta.append(render_meta_item("selected-view", "View", "Selected D3/D4"))
    paper_url = c.get("paper_url", "")
    pdf = ""
    if paper_url:
        pdf = (
            '<div class="g9-component g9-c-link-list" data-g9-component="SOURCE_PDF" '
            'data-g9-level="OPTIONAL" data-g9-presentation="LINK_LIST">'
            '<div class="g9-block" data-g9-block="source_pdf">'
            f'<a class="g9-pdf-link g9-source-pdf" data-g9-source-pdf href="{esc(paper_url)}" '
            'target="_blank" rel="noopener noreferrer" type="application/pdf" '
            'aria-label="Open the original past paper as a PDF to print it">'
            '<svg class="g9-pdf-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="24" height="24">'
            '<path d="M6 2.5h8l4.5 4.5v14.5H6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>'
            '<path d="M14 2.5V7h4.5M9 12h6.5M9 15.5h6.5M9 19h4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>'
            '</svg><span>Source paper (PDF)</span></a></div></div>'
        )
    components = d.get("components") or {}
    labels = (
        ("concept_model_selection", "Choosing the model"),
        ("representation_translation", "Representation"),
        ("reasoning_chain_length", "Reasoning chain"),
        ("algebra_computational_load", "Algebra and numbers"),
        ("trap_exception_sensitivity", "Traps and exceptions"),
    )
    cells = "".join(
        f'<div class="g9-dcell"><span>{esc(label)}</span><b>{esc(components.get(key, "–"))}/2</b></div>'
        for key, label in labels
    )
    why_id = f"g9-why-{q['id']}"
    time_label = difficulty_time_label(a.get("expected_time_seconds"))
    pill_bits = " · ".join(str(x) for x in (diff, f"{score}/10" if score != "" else "", time_label) if x)
    why = (
        '<div class="g9-component g9-c-disclosure-grid" data-g9-component="DIFFICULTY_WHY" '
        'data-g9-level="EXPECTED" data-g9-presentation="DISCLOSURE_GRID">'
        f'<button type="button" class="g9-why-toggle" data-g9-toggle aria-expanded="false" aria-controls="{esc(why_id)}">'
        f'<span class="g9-pill g9-pill-band" data-g9-band="{esc(diff)}">{esc(pill_bits)}</span>'
        '<span>Why this difficulty?</span></button>'
        f'<div id="{esc(why_id)}" class="g9-why" hidden><p>{esc(d.get("basis", ""))}</p>'
        f'<div class="g9-dgrid">{cells}</div></div></div>'
    )
    return (
        '<section class="blueprint-slot slot-identity" data-blueprint-slot="identity" data-required="true">'
        '<div class="g9-component g9-c-header" data-g9-component="IDENTITY" data-g9-level="REQUIRED" '
        'data-g9-presentation="HEADER">'
        f'<div class="g9-block" data-g9-block="source_identity"><h2>{esc(source)}</h2>'
        '<p class="g9-prov">Official past paper, faithful restatement of the original</p></div>'
        f'<div data-g9-meta-strip data-g9-meta-role="CORE2" data-g9-meta-record="{esc(q["id"])}">'
        + "".join(meta) + '</div></div>' + pdf + why + '</section>'
    )


def render_conditions(q):
    conditions = q.get("conditions") or []
    if not conditions:
        return ""
    rows = "".join(f"<li>{render_text(q, 'conditions', x)}</li>" for x in conditions)
    return (
        '<div class="g9-component g9-c-callout-info" data-g9-component="CONDITIONS" '
        'data-g9-level="EXPECTED" data-g9-presentation="CALLOUT_INFO">'
        f'<div class="g9-block" data-g9-block="conditions"><h4>Conditions</h4><ul>{rows}</ul></div></div>'
    )


def render_trap(q):
    trap = analysis(q).get("common_wrong_route", "")
    if not trap:
        return ""
    return (
        '<div class="g9-component g9-c-callout-warn" data-g9-component="TRAP" '
        'data-g9-level="EXPECTED" data-g9-presentation="CALLOUT_WARN">'
        '<div class="g9-block" data-g9-block="common_wrong_route"><h4>Common wrong route</h4>'
        f'<p>{render_text(q, "common_wrong_route", trap)}</p></div></div>'
    )


def support_stage_label(kind):
    return {"REPRESENT": "Represent", "CONNECT": "Connect", "EXECUTE": "Carry out"}.get(kind, kind.title())


def render_hints(q):
    scaffolds = q.get("scaffolds") or []
    if not scaffolds:
        return ""
    ghosts = []
    payloads = []
    for idx, row in enumerate(scaffolds):
        label = support_stage_label(row.get("support_kind") or f"Hint {idx + 1}")
        ghosts.append(
            f'<li data-g9-rung-ghost><div class="g9-rung-head"><span class="g9-rung-no">H{idx}</span>'
            f'<span class="g9-rung-label" data-g9-support-stage-label>{esc(label)}</span>'
            '<span class="g9-pill g9-pill-guided">Guided</span></div></li>'
        )
        payloads.append(
            f'<template data-g9-rung-payload="{esc(q["id"])}-hint-{idx}">'
            f'<li data-g9-rung="{idx + 1}" data-g9-support-provenance="AUTHORED_CORE2_PROMPT_REVEAL" '
            f'data-g9-support-source="scaffolds[{idx}]" data-g9-support-reveals="{esc(row.get("reveals", ""))}" '
            f'data-g9-support-kind="{esc(row.get("support_kind", ""))}" '
            f'data-g9-supports-move="{esc(row.get("supports_move_ref", ""))}">'
            f'<div class="g9-rung-head"><span class="g9-rung-no">H{idx}</span>'
            f'<span class="g9-rung-label" data-g9-support-stage-label>{esc(label)}</span>'
            '<span class="g9-pill g9-pill-guided">Guided</span></div>'
            f'<div data-g9-support-reveal><p>{render_text(q, f"scaffold:{idx}", row.get("text", ""))}</p></div>'
            '</li></template>'
        )
    return (
        f'<div class="g9-component g9-c-ladder" data-g9-component="HINT_LADDER" data-g9-level="REQUIRED" '
        f'data-g9-presentation="LADDER" data-g9-component-items="{len(scaffolds)}">'
        '<div class="g9-eyebrow">Hint ladder · reveal only what you need</div>'
        '<div class="g9-block" data-g9-block="authored_core2_support"><h4>Guided support</h4>'
        f'<div class="g9-ladder" data-g9-support-group="AUTHORED_CORE2_PROMPT_REVEAL" data-question="{esc(q["id"])}">'
        '<ol data-g9-ladder></ol><ol class="g9-rung-map" aria-label="Rungs still to come">'
        + "".join(ghosts) + '</ol>' + "".join(payloads)
        + '<button type="button" data-g9-next-rung>Show guided support</button></div></div></div>'
    )


def render_solution(q):
    a = q.get("answer") or {}
    route = a.get("reasoning_route") or []
    crux_ref = a.get("crux_move_ref", "")
    moves = []
    stage_names = {"DECIDE": "Decide", "REPRESENT": "Represent", "CONNECT": "Connect", "TRANSFORM": "Calculate", "VERIFY": "Check"}
    for idx, step in enumerate(route):
        move_id = step.get("id", "")
        inputs = "".join(f"<li>{esc(x)}</li>" for x in (step.get("inputs") or []))
        crux = move_id == crux_ref
        moves.append(
            f'<section class="g9-solution-move" data-g9-solution-order="{idx + 1}" '
            f'data-g9-solution-move="{esc(move_id)}" data-g9-solution-kind="{esc(step.get("kind", ""))}" '
            f'data-g9-solution-crux="{"true" if crux else "false"}">'
            f'<div class="g9-step-no" aria-hidden="true">{idx + 1}</div><div class="g9-step-body">'
            f'<h4 data-g9-solution-stage-label>{esc(stage_names.get(step.get("kind", ""), step.get("kind", "").title()))}</h4>'
            + ('<p class="g9-prov" data-g9-crux-label>Key move</p>' if crux else '')
            + f'<p data-g9-solution-action>{render_text(q, f"answer_reasoning:{idx}", step.get("action", ""))}</p>'
            + (f'<div class="g9-block" data-g9-block="solution_inputs"><h4>Uses</h4><ul>{inputs}</ul></div>' if inputs else '')
            + f'<p data-g9-solution-why><em>Why valid:</em> {esc(step.get("why_valid", ""))}</p>'
            + f'<p data-g9-solution-output><strong>Result:</strong> {esc(step.get("output", ""))}</p>'
            + '</div></section>'
        )
    check = a.get("check", "")
    payload_id = f"{q['id']}-solution"
    return (
        '<section class="blueprint-slot slot-solution" data-blueprint-slot="solution" data-required="true">'
        '<div class="g9-component g9-c-disclosure" data-g9-component="SOLUTION" data-g9-level="REQUIRED" '
        'data-g9-presentation="DISCLOSURE">'
        f'<details data-g9-reveal data-requires-attempt data-locked data-question="{esc(q["id"])}" '
        f'data-g9-payload-ref="{esc(payload_id)}"><summary>Answer and working</summary>'
        '<div data-g9-payload-slot></div></details>'
        f'<template data-g9-payload="{esc(payload_id)}">'
        f'<div class="g9-component g9-c-step-list" data-g9-component="SOLUTION_STEPS" data-g9-level="REQUIRED" '
        f'data-g9-presentation="STEP_LIST" data-g9-component-items="{len(route)}">'
        '<div class="g9-block" data-g9-block="structured_working"><h4>Reasoning route</h4>'
        + "".join(moves) + '</div></div>'
        '<div class="g9-component g9-c-answer-box" data-g9-component="ANSWER" data-g9-level="REQUIRED" '
        'data-g9-presentation="ANSWER_BOX"><div class="g9-block" data-g9-block="answer">'
        f'<p>{render_text(q, "answer_summary", a.get("summary", ""))}</p></div></div>'
        + (
            '<div class="g9-component g9-c-check-box" data-g9-component="CHECK" data-g9-level="EXPECTED" '
            'data-g9-presentation="CHECK_BOX"><div class="g9-block" data-g9-block="independent_check">'
            f'<h4>Independent check</h4><p>{render_text(q, "answer_check", check)}</p></div></div>'
            if check else ""
        )
        + '</template></div></section>'
    )


def render_attempt(q):
    has_options = bool(q.get("options"))
    if has_options:
        attempt = render_options(q)
    else:
        attempt = (
            f'<label class="answer-label" for="{esc(q["id"])}-answer">Your answer</label>'
            f'<textarea id="{esc(q["id"])}-answer" class="answer-input" data-key="{esc(q["id"])}" rows="3" '
            'placeholder="Write your answer before opening the worked solution"></textarea>'
        )
    return (
        '<div class="g9-component g9-c-attempt" data-g9-component="ATTEMPT" data-g9-level="REQUIRED" '
        'data-g9-presentation="ATTEMPT"><div class="g9-attempt" data-g9-attempt-box>'
        + attempt
        + f'<label class="answer-label" for="{esc(q["id"])}-work">Working / scratchpad</label>'
        f'<textarea id="{esc(q["id"])}-work" class="practice-textarea" data-key="{esc(q["id"])}" '
        'placeholder="Work out your reasoning here; it autosaves on this device."></textarea>'
        f'<label class="g9-paper"><input class="paper-check" data-key="{esc(q["id"])}" type="checkbox">I worked this on paper</label>'
        f'<div class="attempt-actions"><button type="button" class="commit-attempt-btn" data-g9-commit '
        f'data-question="{esc(q["id"])}" disabled>I have attempted this</button>'
        f'<button type="button" class="clear-attempt-btn" data-question="{esc(q["id"])}">Clear</button></div>'
        '<div class="answer-feedback" aria-live="polite"></div></div></div>'
    )


def render_representation(q, svg_map):
    svg = svg_map.get(q["id"])
    if not svg:
        return ""
    return (
        '<div class="g9-component g9-c-visual-card representation-box" data-g9-component="REPRESENTATION" '
        'data-g9-level="EXPECTED" data-g9-presentation="VISUAL_CARD" '
        'data-g9-representation-provenance="BENCHMARK_STUDY_AID">'
        '<div class="g9-card-head"><strong>Representation</strong><span>Study aid · not source figure</span></div>'
        '<figure><figcaption>Owner-supplied Selected D3/D4 benchmark representation; not an original exam-source figure.</figcaption>'
        + svg + '</figure></div>'
    )


def render_question(q, selected_refs, svg_map):
    a = analysis(q)
    c = custody(q)
    difficulty = a.get("difficulty", {})
    diff = difficulty.get("band", "")
    selected = q["id"] in selected_refs
    exam = c.get("exam", "")
    year = c.get("year", "")
    paper = c.get("paper", "")
    topic = a.get("topic", "")
    qtype = question_type(q)
    search = " ".join(
        str(x) for x in (
            q["id"], exam, year, paper, topic, diff, question_type_label(q), q.get("stem", ""),
            a.get("stable_crux_move", ""), a.get("common_wrong_route", "")
        )
    ).lower()
    identity = render_identity(q, selected)
    representation = render_representation(q, svg_map)
    return f"""
<article class="question-card g9-stage-support" id="{esc(q['id'])}" data-g9-unit="{esc(q['id'])}"
  data-g9-kind="QUESTION" data-g9-role="CORE2" data-subject="{esc(c.get('section', ''))}"
  data-diff="{esc(diff)}" data-selected="{'true' if selected else 'false'}"
  data-question-type="{esc(qtype)}" data-search="{esc(search)}">
  {identity}
  <div class="g9-split">
    <div class="g9-col g9-col-primary">
      <section class="blueprint-slot slot-attempt" data-blueprint-slot="attempt" data-required="true">
        <div class="g9-component g9-c-stem" data-g9-component="STEM" data-g9-level="REQUIRED" data-g9-presentation="STEM">
          <div class="g9-eyebrow">Attempt first</div>
          <div class="g9-block" data-g9-block="stem"><p>{render_text(q, "stem", q.get('stem', ''))}</p></div>
        </div>
        {render_conditions(q)}
        {render_trap(q)}
        {render_attempt(q)}
      </section>
    </div>
    <div class="g9-col g9-col-support">
      <section class="blueprint-slot slot-representation" data-blueprint-slot="representation" data-required="false">
        {representation}
      </section>
      <section class="blueprint-slot slot-support" data-blueprint-slot="support" data-required="false">
        {render_hints(q)}
      </section>
    </div>
  </div>
  {render_solution(q)}
</article>"""


CSS = r"""
[hidden]{display:none!important}
:root{--g9-zoom:1;--g9-content-max:1380px;--g9-touch-min:48px;--g9-space:clamp(16px,2vw,28px);--g9-type-body:17px;--bg:#f6f7fb;--fg:#172033;--card:#fff;--line:#d5dce6;--accent:#1f5fae;--muted:#52627a;--soft:#fbfdff;--pill-bg:#eef2ff;--pill-fg:#4338ca;--src-bg:#ecfdf5;--src-fg:#047857;--info-bg:#f8fbff;--info-line:#93c5fd;--info-fg:#455d72;--warn-bg:#fff7f8;--warn-line:#ffc9d3;--warn-fg:#8a2942;--ok-bg:#f0fdf7;--ok-line:#bbf7d0;--ok-fg:#14532d}
:root[data-theme=dark]{--bg:#0f1520;--fg:#e8edf5;--card:#18212f;--line:#2c394d;--accent:#8ab4f8;--muted:#a3b1c6;--soft:#141c29;--pill-bg:#262f5a;--pill-fg:#c3c9ff;--src-bg:#12301f;--src-fg:#6ee7b7;--info-bg:#14263d;--info-line:#3b6db3;--info-fg:#b8c9de;--warn-bg:#2b1620;--warn-line:#6b3045;--warn-fg:#f3b6c4;--ok-bg:#10281d;--ok-line:#1f6b44;--ok-fg:#b7efcf}
*{box-sizing:border-box}html{font-size:calc(var(--g9-type-body)*var(--g9-zoom));scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--fg);font:1rem/1.6 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overflow-wrap:break-word}
a{color:var(--accent)}button,input,textarea{font:inherit}
header[data-g9-shell-header]{position:sticky;top:0;z-index:30;display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:8px var(--g9-space);background:var(--card);border-bottom:1px solid var(--line)}
header a,header button,button,summary,nav a{min-height:var(--g9-touch-min);min-width:var(--g9-touch-min);padding:10px 14px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--fg);text-decoration:none;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;touch-action:manipulation}
header [data-g9-search-panel],header [data-g9-display-panel],header [data-g9-subject-panel],header [data-g9-overflow-panel]{flex:1 0 100%;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
header [hidden]{display:none!important}.shell-context{color:var(--muted);font-weight:700;padding:0 4px}
nav[data-g9-breadcrumb]{display:flex;gap:8px;flex-wrap:wrap;padding:8px var(--g9-space);max-width:var(--g9-content-max);margin:auto}
.app{max-width:var(--g9-content-max);margin:0 auto;padding:var(--g9-space)}.app>*{min-width:0}
.page-intro{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:clamp(16px,2vw,24px);margin-bottom:14px}.page-intro h1{margin:.1rem 0 .5rem}.page-intro p{margin:.3rem 0;color:var(--muted)}
.badge-row,.tabs,.attempt-actions{display:flex;gap:8px;flex-wrap:wrap}.badge{display:inline-flex;align-items:center;border:1px solid var(--line);background:var(--soft);padding:5px 9px;border-radius:999px;font-size:.85rem;font-weight:800}.selected{color:var(--accent)}
.toolbar{background:var(--bg);padding:6px 0 12px}.tabs{align-items:center}.tab-btn[aria-selected=true]{background:var(--accent);border-color:var(--accent);color:var(--card);font-weight:800}.result-count{color:var(--muted);font-size:.9rem;margin:8px 0}
.search-input{flex:1 1 20rem;min-height:48px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--fg);padding:10px 13px}
article[data-g9-unit]{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:var(--g9-space);margin:18px 0;min-width:0;scroll-margin-top:96px}.question-card[hidden]{display:none!important}
article[data-g9-unit]>*{min-width:0}.g9-split{display:block;min-width:0}.g9-col{min-width:0}.g9-component{min-width:0;margin:14px 0}.g9-component:first-child{margin-top:0}
.g9-eyebrow{font-size:.85rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:0 0 6px}
.g9-pill{display:inline-flex;align-items:center;font-size:.85rem;font-weight:800;line-height:1.2;padding:3px 10px;border-radius:999px;background:var(--pill-bg);color:var(--pill-fg);white-space:nowrap}.g9-pill-source{background:var(--src-bg);color:var(--src-fg)}
article[data-g9-role=CORE2]>.slot-identity{display:flex;flex-wrap:wrap;align-items:center;gap:4px 16px;padding:0 0 8px;margin-bottom:12px;border-bottom:1px solid var(--line)}
article[data-g9-role=CORE2]>.slot-identity>.g9-component{display:contents}
article[data-g9-role=CORE2]>.slot-identity [data-g9-block=source_identity]{order:1;flex:1 1 16rem;display:flex;align-items:baseline;flex-wrap:wrap;gap:0 14px;min-width:0}
article[data-g9-role=CORE2]>.slot-identity [data-g9-block=source_identity] h2{font-size:1.2rem;line-height:1.3;margin:0}.g9-prov{color:var(--muted);font-size:.95rem;margin:0}
article[data-g9-role=CORE2]>.slot-identity .g9-why-toggle{order:2;margin:0;padding:2px 0;min-height:var(--g9-touch-min);border:0;background:transparent;color:var(--muted);font-weight:700;gap:4px 10px;flex-wrap:wrap}
article[data-g9-role=CORE2]>.slot-identity [data-g9-meta-strip]{order:3;flex:1 0 100%;display:flex;flex-wrap:wrap;gap:6px;margin:0}
article[data-g9-role=CORE2]>.slot-identity .g9-why{order:4;flex:1 0 100%}
article[data-g9-role=CORE2]>.slot-identity .g9-c-link-list{order:2}
[data-g9-meta-item]{display:inline-flex;gap:4px;align-items:baseline;padding:2px 10px;border:1px solid var(--line);border-radius:999px;background:var(--bg);font-size:.9rem;line-height:1.35;max-width:100%}[data-g9-meta-item] strong{flex:0 0 auto}[data-g9-meta-label]{min-width:0;overflow-wrap:anywhere}
.g9-pdf-link{display:inline-flex;align-items:center;gap:6px;min-height:var(--g9-touch-min);min-width:var(--g9-touch-min);padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:var(--card);font-weight:700;text-decoration:none}.g9-pdf-icon{flex:none;width:24px;height:24px}.g9-source-pdf{border-radius:12px}
.g9-pill-band{background:#fff7ed;color:#9a3412}.g9-pill-band[data-g9-band=D1]{background:#ecfdf5;color:#047857}.g9-pill-band[data-g9-band=D2]{background:#eff6ff;color:#1d4ed8}.g9-pill-band[data-g9-band=D4]{background:#fdf2f8;color:#be185d}
:root[data-theme=dark] .g9-pill-band{background:#3a2a14;color:#fdba74}:root[data-theme=dark] .g9-pill-band[data-g9-band=D1]{background:#12301f;color:#6ee7b7}:root[data-theme=dark] .g9-pill-band[data-g9-band=D2]{background:#172a4d;color:#9ec5ff}:root[data-theme=dark] .g9-pill-band[data-g9-band=D4]{background:#3a1830;color:#f9a8d4}
.g9-why{margin-top:6px}.g9-why p{margin:.2rem 0 .6rem;color:var(--muted)}.g9-dgrid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}.g9-dcell{background:var(--soft);border:1px solid var(--line);border-radius:10px;padding:8px 10px;font-size:.85rem;color:var(--muted)}.g9-dcell b{display:block;color:var(--fg);font-size:1rem}
.g9-c-stem [data-g9-block=stem] p{margin:.1rem 0;font-size:1.12rem;line-height:1.58;font-weight:560;white-space:pre-line}
.g9-c-callout-info{border-left:4px solid var(--info-line);background:var(--info-bg);padding:10px 14px;border-radius:0 12px 12px 0;color:var(--info-fg)}.g9-c-callout-warn{background:var(--warn-bg);border:1px solid var(--warn-line);border-radius:12px;padding:10px 14px;color:var(--warn-fg)}
.g9-c-callout-info h4,.g9-c-callout-warn h4{margin:0 0 .2rem;font-size:1rem}.g9-c-callout-info ul{margin:.2rem 0;padding-left:1.2rem}.g9-c-callout-info p,.g9-c-callout-warn p{margin:.1rem 0}
.g9-c-attempt .g9-attempt{border:1px solid var(--line);border-radius:14px;padding:12px 14px;background:var(--soft)}.q-options{border:0;padding:0;margin:0 0 12px;display:grid;gap:8px}.g9-answer-option{display:grid;grid-template-columns:48px 34px minmax(0,1fr);align-items:center;gap:7px;min-height:48px;border:1px solid var(--line);background:var(--card);border-radius:12px;padding:6px 12px}.g9-answer-option input{width:20px;height:20px;justify-self:center}.option-letter{font-weight:850;color:var(--accent)}.answer-label{display:block;font-weight:700;margin:8px 0 5px}.answer-input,.practice-textarea{width:100%;min-height:120px;border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:10px;padding:14px 16px;scroll-margin-bottom:42vh;resize:vertical}.g9-paper{display:flex;align-items:center;gap:.5rem;min-height:48px}.g9-paper input{min-width:48px;min-height:48px}.attempt-actions{margin-top:8px}.answer-feedback{min-height:24px;margin-top:8px;color:var(--muted);font-weight:700}
.g9-c-visual-card{border:1px solid var(--line);border-radius:16px;background:var(--soft);padding:10px 12px 12px}.g9-card-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:6px}.g9-card-head strong{font-size:.9rem}.g9-card-head span,figcaption{color:var(--muted);font-size:.85rem}.g9-c-visual-card figure{margin:0}.g9-c-visual-card figure svg{display:block;width:100%;height:auto;max-width:100%;max-height:min(48vh,440px)}.representation-box .question-svg .label{font-size:17px}.representation-box .question-svg .flow{font-size:16px}.representation-box .question-svg .small{font-size:14px}.representation-box .question-svg .equation{font-size:17px;font-family:Cambria,"Times New Roman",serif}
.g9-c-ladder .g9-block>h4{margin:.9rem 0 .2rem;font-size:.85rem;color:var(--muted)}.g9-rung-map,.g9-c-ladder [data-g9-ladder]{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:8px}.g9-rung-map>li{border:1px dashed var(--line);border-radius:12px;padding:9px 13px;color:var(--muted)}.g9-c-ladder [data-g9-ladder]>li{border:1px solid var(--line);border-radius:12px;background:var(--card);padding:10px 13px}.g9-rung-head{display:flex;gap:10px;align-items:center;flex-wrap:wrap;font-weight:800}.g9-rung-no{display:inline-grid;place-items:center;min-width:2.3em;height:2.1em;border-radius:8px;background:var(--pill-bg);color:var(--pill-fg);font-size:.85rem}.g9-pill-guided{background:var(--pill-bg);color:var(--pill-fg)}[data-g9-support-reveal] p{margin:.5rem 0}
.g9-c-disclosure>details{border:1px solid var(--line);border-radius:14px;background:var(--soft);padding:0;overflow:hidden;margin:0}.g9-c-disclosure>details>summary{list-style:none;display:flex;width:100%;justify-content:space-between;border:0;border-radius:0;background:transparent;padding:13px 15px;font-weight:850;min-height:48px}.g9-c-disclosure>details>summary::-webkit-details-marker{display:none}.g9-c-disclosure>details>summary::after{content:"Show";font-size:.85rem;background:var(--pill-bg);color:var(--pill-fg);padding:4px 10px;border-radius:999px}.g9-c-disclosure>details[open]>summary::after{content:"Hide"}.g9-c-disclosure>details[data-locked]>summary{opacity:.55;cursor:not-allowed}.g9-c-disclosure>details[data-locked]>summary::after{content:"After you attempt"}.g9-c-disclosure>details[open]>summary{border-bottom:1px solid var(--line);background:var(--card)}.g9-c-disclosure [data-g9-payload-slot]{padding:6px 16px 16px}
.g9-solution-move{display:grid;grid-template-columns:42px minmax(0,1fr);gap:12px;padding:10px 0;border-bottom:1px solid var(--line)}.g9-solution-move:last-child{border-bottom:0}.g9-solution-move[data-g9-solution-crux=true]{background:var(--info-bg);border-radius:10px;padding:10px}.g9-step-no{font-weight:850;font-size:.9rem;color:var(--pill-fg);background:var(--pill-bg);border-radius:8px;padding:5px 6px;text-align:center;height:max-content}.g9-step-body p{margin:.25rem 0}.g9-step-body h4{margin:0;font-size:.85rem;color:var(--muted)}.g9-step-body [data-g9-block=solution_inputs]{display:flex;flex-wrap:wrap;gap:.4rem;align-items:baseline;color:var(--muted)}.g9-step-body [data-g9-block=solution_inputs] ul{display:flex;flex-wrap:wrap;gap:.4rem;list-style:none;margin:0;padding:0}.g9-step-body [data-g9-block=solution_inputs] li{border:1px solid var(--line);border-radius:999px;padding:1px 10px;font-size:.85rem}
.g9-c-answer-box{background:var(--ok-bg);border:1px solid var(--ok-line);border-radius:12px;padding:12px 14px;color:var(--ok-fg)}.g9-c-answer-box p{margin:.1rem 0}.g9-c-check-box{margin-top:10px;border-left:4px solid var(--ok-line);padding:8px 14px;color:var(--ok-fg)}.g9-c-check-box h4,.g9-c-check-box p{margin:.2rem 0}
@media(min-width:980px){article[data-g9-role="CORE2"] .g9-split{display:grid;grid-template-columns:minmax(0,42fr) minmax(0,58fr);gap:22px;align-items:start}}
@media(max-width:979px){article[data-g9-role="CORE2"] .g9-split{display:flex;flex-direction:column}article[data-g9-role="CORE2"] .g9-split .g9-col,article[data-g9-role="CORE2"] .g9-split .blueprint-slot{display:contents}article[data-g9-role="CORE2"] [data-g9-component="STEM"]{order:30}article[data-g9-role="CORE2"] [data-g9-component="REPRESENTATION"]{order:40}article[data-g9-role="CORE2"] [data-g9-component="CONDITIONS"]{order:50}article[data-g9-role="CORE2"] [data-g9-component="TRAP"]{order:60}article[data-g9-role="CORE2"] [data-g9-component="ATTEMPT"]{order:70}article[data-g9-role="CORE2"] [data-g9-component="HINT_LADDER"]{order:80}}
@media(max-width:899px){header[data-g9-shell-header]{position:relative}.app{padding:16px}nav[data-g9-breadcrumb]{font-size:.95rem}.g9-dgrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
:focus-visible{outline:3px solid var(--accent);outline-offset:2px}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}}
@media print{:root,:root[data-theme=dark]{--bg:#fff;--fg:#000;--card:#fff;--line:#bbb;--accent:#1f5fae;--muted:#333;--soft:#fff;--pill-bg:#eee;--pill-fg:#222;--info-bg:#fff;--info-line:#888;--info-fg:#222;--warn-bg:#fff;--warn-line:#888;--warn-fg:#222;--ok-bg:#fff;--ok-line:#888;--ok-fg:#222}header[data-g9-shell-header],nav[data-g9-breadcrumb],.toolbar,.g9-attempt,button,[data-g9-display-panel],[data-g9-source-pdf]{display:none!important}.g9-attempt:has(.g9-answer-options){display:block!important}.g9-attempt>:not(.g9-answer-options),.g9-answer-option input{display:none!important}details[data-requires-attempt]:not([open]){display:none!important}details{border:none}article[data-g9-unit]{break-inside:auto;border:none}h1,h2,h3,h4{break-after:avoid-page}body{background:#fff;color:#000}}
"""
JS = r"""
(() => {
  const root=document.documentElement;
  const safeGet=(k)=>{try{return localStorage.getItem(k)}catch{return null}};
  const safeSet=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
  const safeRemove=(k)=>{try{localStorage.removeItem(k)}catch{}};
  const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));

  const theme=safeGet('g9_qb_theme')||'light';
  const baseType=Number(safeGet('g9_qb_type')||17);
  const zoom=Number(safeGet('g9_qb_zoom')||1);
  root.dataset.theme=theme;
  root.style.setProperty('--g9-type-body',clamp(baseType,14,22)+'px');
  root.style.setProperty('--g9-zoom',String(clamp(zoom,.8,1.5)));

  const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionBehavior=reduceMotion?'auto':'smooth';
  const cards=[...document.querySelectorAll('.question-card')];
  const tabs=[...document.querySelectorAll('.tab-btn[data-filter]')];
  const search=document.getElementById('search-input');
  let filter='all';

  function setFilter(next){
    filter=next;
    tabs.forEach(x=>x.setAttribute('aria-selected',String(x.dataset.filter===next)));
    applyFilter();
  }
  function applyFilter(){
    const query=search.value.trim().toLowerCase(); let count=0;
    cards.forEach(card=>{
      const subject=card.dataset.subject, diff=card.dataset.diff, selected=card.dataset.selected==='true';
      const tabOk=filter==='all'||(filter==='physics'&&subject==='Physics')||(filter==='chemistry'&&subject==='Chemistry')||(filter==='selected'&&selected)||(filter==='d3d4'&&(diff==='D3'||diff==='D4'));
      const searchOk=!query||card.dataset.search.includes(query);
      const show=tabOk&&searchOk; card.hidden=!show; if(show)count++;
    });
    document.getElementById('result-count').textContent='Showing '+count+' questions';
  }
  tabs.forEach(btn=>btn.addEventListener('click',()=>setFilter(btn.dataset.filter)));
  document.querySelectorAll('[data-shell-filter]').forEach(btn=>btn.addEventListener('click',()=>setFilter(btn.dataset.shellFilter)));
  search.addEventListener('input',applyFilter);
  document.getElementById('clear-search').addEventListener('click',()=>{search.value='';applyFilter();search.focus()});

  const togglePanel=(name)=>{
    const panel=document.querySelector('header ['+name+']');
    if(panel) panel.hidden=!panel.hidden;
  };
  document.querySelector('[data-g9-action=search]').addEventListener('click',()=>{togglePanel('data-g9-search-panel'); if(!document.querySelector('[data-g9-search-panel]').hidden)search.focus()});
  document.querySelector('[data-g9-action=display]').addEventListener('click',()=>togglePanel('data-g9-display-panel'));
  document.querySelector('[data-g9-action=subject]').addEventListener('click',()=>togglePanel('data-g9-subject-panel'));
  document.querySelector('[data-g9-action=overflow]').addEventListener('click',()=>togglePanel('data-g9-overflow-panel'));
  document.querySelector('[data-g9-action=refresh]').addEventListener('click',()=>location.reload());

  document.querySelectorAll('[data-g9-theme]').forEach(btn=>btn.addEventListener('click',()=>{
    root.dataset.theme=btn.dataset.g9Theme; safeSet('g9_qb_theme',root.dataset.theme);
  }));
  document.querySelectorAll('[data-g9-font]').forEach(btn=>btn.addEventListener('click',()=>{
    let size=parseFloat(getComputedStyle(root).getPropertyValue('--g9-type-body'))||17;
    if(btn.dataset.g9Font==='dec')size-=1; else if(btn.dataset.g9Font==='inc')size+=1; else size=17;
    size=clamp(size,14,22); root.style.setProperty('--g9-type-body',size+'px'); safeSet('g9_qb_type',String(size));
  }));
  document.querySelectorAll('[data-g9-zoom]').forEach(btn=>btn.addEventListener('click',()=>{
    let z=parseFloat(getComputedStyle(root).getPropertyValue('--g9-zoom'))||1;
    if(btn.dataset.g9Zoom==='dec')z-=.1; else if(btn.dataset.g9Zoom==='inc')z+=.1; else z=1;
    z=clamp(Math.round(z*10)/10,.8,1.5); root.style.setProperty('--g9-zoom',String(z)); safeSet('g9_qb_zoom',String(z));
  }));

  document.querySelectorAll('[data-g9-toggle]').forEach(btn=>btn.addEventListener('click',()=>{
    const target=document.getElementById(btn.getAttribute('aria-controls')); if(!target)return;
    target.hidden=!target.hidden; btn.setAttribute('aria-expanded',String(!target.hidden));
  }));

  function answerReady(card){
    const choices=[...card.querySelectorAll('.answer-choice')];
    const answer=card.querySelector('.answer-input');
    const scratch=card.querySelector('.practice-textarea');
    const paper=card.querySelector('.paper-check');
    return choices.some(x=>x.checked) || !!(answer&&answer.value.trim()) || !!(scratch&&scratch.value.trim()) || !!(paper&&paper.checked);
  }
  function persistKey(el,suffix){return 'g9_qb_'+suffix+'_'+el.dataset.key}
  function syncCommit(card){
    const btn=card.querySelector('.commit-attempt-btn');
    if(!btn||btn.dataset.committed==='true')return;
    btn.disabled=!answerReady(card);
  }
  cards.forEach(card=>{
    const scratch=card.querySelector('.practice-textarea');
    const savedScratch=safeGet(persistKey(scratch,'work')); if(savedScratch!==null)scratch.value=savedScratch;
    scratch.addEventListener('input',()=>{safeSet(persistKey(scratch,'work'),scratch.value);syncCommit(card)});
    const answer=card.querySelector('.answer-input');
    if(answer){const saved=safeGet(persistKey(answer,'answer'));if(saved!==null)answer.value=saved;answer.addEventListener('input',()=>{safeSet(persistKey(answer,'answer'),answer.value);syncCommit(card)})}
    const choices=[...card.querySelectorAll('.answer-choice')];
    const savedChoice=safeGet('g9_qb_choice_'+card.id);
    if(savedChoice){const values=savedChoice.split(',');choices.forEach(x=>x.checked=values.includes(x.value))}
    choices.forEach(x=>x.addEventListener('change',()=>{safeSet('g9_qb_choice_'+card.id,choices.filter(y=>y.checked).map(y=>y.value).join(','));syncCommit(card)}));
    const paper=card.querySelector('.paper-check');
    const savedPaper=safeGet('g9_qb_paper_'+card.id)==='1'; paper.checked=savedPaper;
    paper.addEventListener('change',()=>{safeSet('g9_qb_paper_'+card.id,paper.checked?'1':'0');syncCommit(card)});
    syncCommit(card);
  });

  document.querySelectorAll('.g9-ladder').forEach(ladder=>{
    const live=ladder.querySelector('[data-g9-ladder]');
    const ghosts=ladder.querySelector('.g9-rung-map');
    const payloads=[...ladder.querySelectorAll('template[data-g9-rung-payload]')];
    const next=ladder.querySelector('[data-g9-next-rung]');
    const card=ladder.closest('.question-card');
    const hintKey='g9_qb_hints_'+card.id;
    const sync=()=>{
      const index=live.children.length;
      next.disabled=index>=payloads.length;
      next.textContent=index>=payloads.length?'All guided support shown':'Show guided support';
    };
    const revealNext=()=>{
      const index=live.children.length; if(index>=payloads.length)return false;
      live.append(payloads[index].content.cloneNode(true));
      ghosts.querySelector('[data-g9-rung-ghost]')?.remove();
      sync();
      return true;
    };
    const savedCount=Math.max(0,Math.min(payloads.length,Number(safeGet(hintKey)||0)));
    for(let i=0;i<savedCount;i++)revealNext();
    next.addEventListener('click',()=>{
      if(!revealNext())return;
      safeSet(hintKey,String(live.children.length));
    });
    sync();
  });

  function materializeSolution(details){
    const ref=details.dataset.g9PayloadRef;
    const tpl=document.querySelector('template[data-g9-payload="'+ref+'"]');
    const slot=details.querySelector('[data-g9-payload-slot]');
    if(tpl&&slot&&slot.childElementCount===0)slot.append(tpl.content.cloneNode(true));
  }
  document.querySelectorAll('details[data-requires-attempt]').forEach(details=>{
    const card=details.closest('.question-card');
    details.querySelector('summary').addEventListener('click',e=>{
      if(details.hasAttribute('data-locked')){
        e.preventDefault();
        card?.querySelector('.answer-choice,.answer-input,.practice-textarea,.paper-check')?.focus();
      }
    });
    if(card&&safeGet('g9_qb_attempted_'+card.id)==='1'){
      card.dataset.attempted='1';
      details.removeAttribute('data-locked');
      const commit=card.querySelector('.commit-attempt-btn');
      commit.dataset.committed='true'; commit.disabled=true;
      card.querySelector('.answer-feedback').textContent='Attempt recorded. You can now open Answer and working.';
    }
  });

  document.querySelectorAll('.commit-attempt-btn').forEach(btn=>btn.addEventListener('click',()=>{
    const card=document.getElementById(btn.dataset.question); if(!card||!answerReady(card))return;
    const details=card.querySelector('details[data-requires-attempt]');
    card.dataset.attempted='1';
    details.removeAttribute('data-locked');
    materializeSolution(details);
    safeSet('g9_qb_attempted_'+card.id,'1');
    btn.dataset.committed='true'; btn.disabled=true;
    card.querySelector('.answer-feedback').textContent='Attempt recorded. You can now open Answer and working.';
    details.querySelector('summary').focus();
  }));

  document.querySelectorAll('.clear-attempt-btn').forEach(btn=>btn.addEventListener('click',()=>{
    const card=document.getElementById(btn.dataset.question); if(!card)return;
    const scratch=card.querySelector('.practice-textarea');scratch.value='';safeRemove(persistKey(scratch,'work'));
    const answer=card.querySelector('.answer-input');if(answer){answer.value='';safeRemove(persistKey(answer,'answer'))}
    card.querySelectorAll('.answer-choice').forEach(x=>x.checked=false);safeRemove('g9_qb_choice_'+card.id);
    const paper=card.querySelector('.paper-check');paper.checked=false;safeRemove('g9_qb_paper_'+card.id);
    const details=card.querySelector('details[data-requires-attempt]');details.open=false;details.setAttribute('data-locked','');
    details.querySelector('[data-g9-payload-slot]').replaceChildren();
    safeRemove('g9_qb_attempted_'+card.id); delete card.dataset.attempted;
    const commit=card.querySelector('.commit-attempt-btn');delete commit.dataset.committed;
    card.querySelector('.answer-feedback').textContent='';syncCommit(card);
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
<html lang="en" data-theme="light" data-g9-shell data-g9-role="CORE2" data-g9-mode="SINGLE_FILE"
  data-g9-product="PRODUCT-QB-CANONICAL-TABLET" data-g9-render-digest="{esc(bid.removeprefix('sha256:')[:16])}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="77 source-verified canonical Physics and Chemistry PYQs with progressive support and worked solutions, plus the governed seven-question Selected D3/D4 study view.">
<meta name="grade9v3-qb-build" content="{esc(bid)}">
<meta name="g9-render" content="qb_tablet/3 {esc(BLUEPRINT_REF)}">
<meta name="grade9v3-blueprint-source" content="PR{BLUEPRINT_SOURCE_PR}@{esc(BLUEPRINT_SOURCE_SHA)}">
<title>Grade9V3 Canonical Question Bank · CORE2 Tablet Standalone</title>
<style>{CSS}</style>
</head>
<body data-core="CORE2" data-blueprint-ref="{esc(BLUEPRINT_REF)}">
<header data-g9-shell-header>
  <a data-g9-home href="#question-bank-top">Home</a>
  <button type="button" onclick="history.back()">Back</button>
  <button type="button" data-g9-action="subject">Physics + Chemistry</button>
  <a href="#question-bank-list">Question bank</a>
  <button type="button" data-g9-action="search">Search</button>
  <button type="button" data-g9-action="refresh">Refresh</button>
  <button type="button" data-g9-action="display">Display</button>
  <button type="button" data-g9-action="overflow">More</button>
  <div data-g9-search-panel hidden><input id="search-input" class="search-input" type="search" aria-label="Search this question bank" placeholder="Search question, exam, topic, crux move or trap"><button id="clear-search" type="button">Reset</button></div>
  <div data-g9-subject-panel hidden><button type="button" data-shell-filter="all">All subjects</button><button type="button" data-shell-filter="physics">Physics</button><button type="button" data-shell-filter="chemistry">Chemistry</button></div>
  <div data-g9-display-panel hidden><button type="button" data-g9-font="dec">A−</button><button type="button" data-g9-font="reset">A</button><button type="button" data-g9-font="inc">A+</button><button type="button" data-g9-theme="light">Light</button><button type="button" data-g9-theme="dark">Dark</button><button type="button" data-g9-zoom="dec">Zoom −</button><button type="button" data-g9-zoom="reset">100%</button><button type="button" data-g9-zoom="inc">Zoom +</button></div>
  <div data-g9-overflow-panel hidden><span class="shell-context">Single-file mode: page-PDF control omitted by the #372 shell policy. Source-paper PDF links remain available per question.</span></div>
</header>
<nav data-g9-breadcrumb aria-label="Breadcrumb"><a href="#question-bank-top">Home</a><a href="#question-bank-list">Canonical Question Bank</a><a href="#question-bank-list" aria-current="page">CORE2</a></nav>
<noscript>Answers open after you attempt; this page needs JavaScript for progressive support and solution unlocking.</noscript>
<main id="question-bank-top" class="app" data-build-id="{esc(bid)}">
<section class="page-intro">
  <div class="badge-row"><span class="badge">Canonical Question Bank</span><span class="badge">77 verified-parent PYQs</span><span class="badge selected">Selected D3/D4 · 7</span><span class="badge">Offline single-file</span><span class="badge">{esc(BLUEPRINT_REF)}</span></div>
  <h1>Canonical Question Bank · CORE2 Tablet Study Edition</h1>
  <p>31 Physics + 46 Chemistry questions projected directly from repository canonical exam-bank records. The page follows the #372 CORE2 blueprint: attempt first, bounded progressive support, and a learner-openable worked solution after commitment.</p>
</section>
<section class="toolbar" aria-label="Question Bank views">
  <div class="tabs" role="tablist" aria-label="Question views">
    <button class="tab-btn" type="button" role="tab" aria-selected="true" data-filter="all">All 77</button>
    <button class="tab-btn" type="button" role="tab" aria-selected="false" data-filter="selected">Selected D3/D4 · 7</button>
    <button class="tab-btn" type="button" role="tab" aria-selected="false" data-filter="physics">Physics · 31</button>
    <button class="tab-btn" type="button" role="tab" aria-selected="false" data-filter="chemistry">Chemistry · 46</button>
    <button class="tab-btn" type="button" role="tab" aria-selected="false" data-filter="d3d4">All D3/D4</button>
  </div>
  <div id="result-count" class="result-count">Showing 77 questions</div>
</section>
<section id="question-bank-list">{cards}</section>
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
