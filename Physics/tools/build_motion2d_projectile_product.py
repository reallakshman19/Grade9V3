#!/usr/bin/env python3
"""Build the source-grounded six-Core Motion-in-2D projectile learner product."""
from __future__ import annotations

import argparse
import html
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
PRODUCT = REPO / "Physics/content/motion-2d-projectile-demand/product.v1.json"
CANONICAL = REPO / "Physics/library/phy-kin-2d-motion.v1.json"
EXTENSIONS = REPO / "Physics/library/phy-kin-2d-projectile-extensions.v1.json"
BANK = REPO / "Physics/library/exam-bank/competitive-exam-question-bank.v2.json"
OUT = REPO / "public/physics/motion-in-2d/projectile-demand"
TRACE = REPO / "Physics/content/motion-2d-projectile-demand/trace.v1.json"

CORE_FILES = {
    "CORE1": "core1.html",
    "CORE2": "core2.html",
    "CORE1A": "core1a.html",
    "CORE1B": "core1b.html",
    "CORE2A": "core2a.html",
    "CORE2B": "core2b.html",
}

STYLE = """
:root{font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#172033;background:#f5f7fb;line-height:1.55}
*{box-sizing:border-box}body{margin:0}.shell{max-width:1040px;margin:auto;padding:24px}
nav{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 22px}nav a,.pill{border:1px solid #cbd5e1;border-radius:999px;padding:5px 10px;background:white;text-decoration:none;color:#26344d}
header,.card,.concept,.question,.diagnostic{background:white;border:1px solid #dbe2ea;border-radius:14px;padding:20px;margin:16px 0}
h1,h2,h3{line-height:1.2}.eyebrow{font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:#52627a}
.extension{border-left:5px solid #64748b}.source{border-left:5px solid #475569}.attempt{border:2px solid #94a3b8;border-radius:10px;padding:14px;background:#f8fafc}
textarea{width:100%;min-height:92px;margin-top:8px;border:1px solid #94a3b8;border-radius:8px;padding:10px;font:inherit}
details{border:1px solid #cbd5e1;border-radius:9px;padding:10px 12px;margin:10px 0;background:#fff}summary{cursor:pointer;font-weight:700}
table{border-collapse:collapse;width:100%;font-size:.92rem}th,td{border:1px solid #dbe2ea;padding:8px;vertical-align:top;text-align:left}
.prov{font-size:.85rem;color:#52627a}.check{background:#f8fafc;border-left:4px solid #64748b;padding:10px 12px}
figure{margin:16px 0}svg{width:100%;max-width:640px;height:auto;border:1px solid #dbe2ea;border-radius:10px;background:white}figcaption{font-size:.88rem;color:#52627a;margin-top:5px}
.steps li{margin:6px 0}.warning{background:#fff7ed;border-left:4px solid #9a3412;padding:10px 12px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px}
@media(max-width:650px){.shell{padding:14px}header,.card,.concept,.question{padding:15px}}
""".strip()


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def nav() -> str:
    links = ['<a href="index.html">Preview</a>']
    links += [f'<a href="{CORE_FILES[c]}">{c}</a>' for c in CORE_FILES]
    return "<nav>" + "".join(links) + "</nav>"


def doc(title: str, core: str | None, blueprint: str | None, body: str) -> str:
    attrs = ""
    if core:
        attrs += f' data-core="{esc(core)}"'
    if blueprint:
        attrs += f' data-blueprint-ref="{esc(blueprint)}" data-blueprint-version="1.0.0"'
    return (
        '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
        f'<title>{esc(title)}</title>\n<style>{STYLE}</style>\n</head>\n'
        f'<body{attrs}><main class="shell">{nav()}{body}</main></body>\n</html>\n'
    )


def list_html(items: list[object], ordered: bool = False, cls: str = "") -> str:
    if not items:
        return "<p>None supplied by the governed record.</p>"
    tag = "ol" if ordered else "ul"
    klass = f' class="{cls}"' if cls else ""
    return f"<{tag}{klass}>" + "".join(f"<li>{esc(x)}</li>" for x in items) + f"</{tag}>"


def lookup_records(*packages: dict) -> dict[str, dict]:
    out: dict[str, dict] = {}
    for package in packages:
        for key in ("buckets","capabilities","microtopics","relations","representations","question_families","questions","teaching_routes","resources","data"):
            for row in package.get(key, []):
                if isinstance(row, dict) and row.get("id"):
                    out[row["id"]] = row
    return out


def visual_svg(spec: dict) -> str:
    rep = spec["representation_ref"]
    title = esc(spec["purpose"])
    desc = esc(spec["alt"])
    if rep == "REP-KIN-2D-TANGENT-VELOCITY":
        shapes = """
<path d="M60 235 Q220 35 560 170" fill="none" stroke="#334155" stroke-width="3"/>
<line x1="45" y1="250" x2="585" y2="250" stroke="#94a3b8"/><line x1="60" y1="270" x2="60" y2="35" stroke="#94a3b8"/>
<circle cx="300" cy="105" r="6" fill="#0f172a"/><text x="310" y="100">P</text>
<line x1="60" y1="250" x2="300" y2="105" stroke="#64748b" stroke-width="2"/><text x="175" y="165">r</text>
<line x1="300" y1="105" x2="420" y2="95" stroke="#0f172a" stroke-width="4"/><text x="425" y="94">v tangent</text>
<line x1="300" y1="105" x2="420" y2="105" stroke="#64748b"/><line x1="420" y1="105" x2="420" y2="95" stroke="#64748b"/>
"""
    elif rep == "REP-PROJ-BOUNCE-ENERGY":
        shapes = """
<path d="M55 245 Q185 45 330 245" fill="none" stroke="#334155" stroke-width="3"/>
<circle cx="330" cy="245" r="7" fill="#0f172a"/><text x="290" y="270">impact</text>
<text x="350" y="232">K₂ = fK₁</text><line x1="330" y1="245" x2="405" y2="170" stroke="#0f172a" stroke-width="4"/>
<line x1="330" y1="245" x2="405" y2="245" stroke="#64748b"/><line x1="405" y1="245" x2="405" y2="170" stroke="#64748b"/>
<path d="M330 245 Q430 120 555 245" fill="none" stroke="#64748b" stroke-width="3"/><text x="435" y="115">new apex</text>
"""
    elif rep == "REP-PROJ-PIECEWISE-G":
        shapes = """
<path d="M55 245 Q190 55 305 85" fill="none" stroke="#334155" stroke-width="3"/>
<line x1="305" y1="35" x2="305" y2="260" stroke="#64748b" stroke-dasharray="6 5"/>
<circle cx="305" cy="85" r="7" fill="#0f172a"/><text x="315" y="75">apex boundary: (x_A,H,v_x,0)</text>
<path d="M305 85 Q430 100 560 245" fill="none" stroke="#64748b" stroke-width="3"/>
<text x="130" y="55">stage 1: g₁</text><text x="430" y="155">stage 2: g₂</text>
"""
    elif rep == "REP-PROJ-TRAJECTORY-POINT":
        shapes = """
<line x1="45" y1="250" x2="585" y2="250" stroke="#94a3b8"/><line x1="60" y1="270" x2="60" y2="35" stroke="#94a3b8"/>
<path d="M60 250 Q300 30 560 245" fill="none" stroke="#334155" stroke-width="3"/>
<circle cx="405" cy="104" r="7" fill="#0f172a"/><text x="415" y="100">P</text>
<circle cx="300" cy="73" r="5" fill="#64748b"/><text x="260" y="60">apex</text>
<line x1="350" y1="80" x2="470" y2="145" stroke="#64748b" stroke-width="3"/><text x="470" y="145">local tangent</text>
"""
    else:
        shapes = """
<line x1="55" y1="250" x2="585" y2="250" stroke="#94a3b8"/><line x1="60" y1="270" x2="60" y2="35" stroke="#94a3b8"/>
<path d="M60 70 C160 110 250 165 555 230" fill="none" stroke="#334155" stroke-width="4"/>
<text x="72" y="60">vₓ₀</text><line x1="250" y1="45" x2="250" y2="250" stroke="#64748b" stroke-dasharray="6 5"/>
<text x="205" y="38">time scale m/c</text><text x="510" y="275">t</text><text x="24" y="50">vₓ</text>
"""
    elements = "".join(f"<li>{esc(e)}</li>" for e in spec.get("elements", []))
    return (
        f'<figure data-representation-ref="{esc(rep)}"><svg role="img" viewBox="0 0 620 290" '
        f'aria-label="{desc}"><title>{title}</title><desc>{desc}</desc>{shapes}</svg>'
        f'<figcaption>{title}</figcaption><details><summary>Accessible element list</summary><ul>{elements}</ul></details></figure>'
    )


def header(product: dict, core: str, purpose: str) -> str:
    return (
        f'<header><div class="eyebrow">Grade {esc(product["grade"])} Physics · {esc(core)}</div>'
        f'<h1>{esc(product["title"])}</h1><p>{esc(purpose)}</p>'
        '<p class="prov">Canonical authority: PKG-PHY-KIN-2D-MOTION. Explicit demand extensions are CANDIDATE records and are labelled EXTENSION.</p></header>'
    )


def canonical_orientation(product: dict, records: dict) -> str:
    rows = []
    for mid in product["canonical_microtopic_order"]:
        m = records[mid]
        reps = ", ".join(m.get("representation_refs", []))
        rows.append(
            f'<article class="concept" id="{esc(mid)}"><div class="eyebrow">Canonical</div>'
            f'<h2>{esc(m["title"])}</h2><p><strong>Hard transition:</strong> {esc(m["inferential_jump"])}</p>'
            f'<p><strong>Representation:</strong> {esc(reps)}</p>'
            f'<p><strong>Exit:</strong> {esc(m["exit_task"]["prompt"])}</p></article>'
        )
    ext = []
    for mid in product["extension_microtopic_order"]:
        m = records[mid]
        ext.append(f'<li><a href="core1a.html#{esc(mid)}">{esc(m["title"])}</a> — extends <code>{esc(m["extensions"]["grade9v3:extends_microtopic_ref"])}</code></li>')
    explorers = "".join(
        f'<li><a href="{esc(row["locator"])}">{esc(row["label"])}</a> — <code>{esc(row["representation_ref"])}</code></li>'
        for row in product["canonical_explorers"]
    )
    return (
        '<section class="card"><h2>Scope and conventions</h2><p>One plane-motion event is described in one declared Cartesian frame and one shared clock. '
        'Constant-acceleration relations are applied per component only when their model conditions hold. The projectile specialization is selected from retained forces before consequences are used.</p>'
        '<p>Core1 orients; it does not turn source questions into academic authority and it does not replace the detailed Core1A/Core1B construction.</p></section>'
        + "".join(rows)
        + '<section class="card extension"><div class="eyebrow">EXTENSION map</div><h2>Demand-driven extensions admitted after R1–R3</h2><ul>' + "".join(ext) + '</ul></section>'
        + '<section class="card"><h2>Canonical interactive representations</h2><ul>' + explorers + '</ul></section>'
    )


def source_question(q: dict, selected: bool) -> str:
    custody = q["extensions"]["grade9v3:source_custody"]
    stress = q["extensions"].get("grade9v3:projectile_stress", {})
    answer = q["answer"]
    badge = "Selected demand" if selected else "Q15 comparison evidence"
    options = list_html(q.get("options", [])) if q.get("options") else "<p>No answer options in the governed restatement.</p>"
    subparts = list_html(q.get("subparts", [])) if q.get("subparts") else "<p>No subparts in the governed restatement.</p>"
    source_hints = list_html([h.get("text", str(h)) for h in q.get("hints", [])]) if q.get("hints") else "<p>The source-custody record supplies no source hint.</p>"
    discr = stress.get("identity_discriminator")
    discr_html = f'<p><strong>Identity discriminator:</strong> {esc(discr)}</p>' if discr else ""
    return (
        f'<article class="question source" id="{esc(q["id"])}" data-role="source-question">'
        f'<div class="eyebrow">{esc(badge)} · {esc(stress.get("owner_label",""))}</div>'
        f'<h2>{esc(custody["exam"])} {esc(custody["year"])} · {esc(custody["paper"])} · Q{esc(custody["question_number"])}</h2>'
        f'<p><strong>Exact source identity:</strong> {esc(q["original_identifier"])}</p>'
        f'<p class="prov">Provenance: SOURCE_DERIVED / {esc(q["extensions"]["grade9v3:provenance_class"])}. '
        f'Wording custody: {esc(custody["wording_custody"])}. Exact official wording remains at the source locator.</p>'
        f'<p><a href="{esc(custody["paper_url"])}">Official paper locator</a></p>'
        f'{discr_html}<h3>Governed faithful restatement</h3><p>{esc(q["stem"])}</p>'
        f'<h3>Conditions</h3>{list_html(q.get("conditions", []))}<h3>Options</h3>{options}<h3>Subparts</h3>{subparts}'
        f'<h3>Figures and captions</h3>{list_html(q.get("figure_refs", []))}'
        f'<h3>Source hints only</h3>{source_hints}'
        f'<h3>Source-answer custody</h3><p><strong>{esc(answer["summary"])}</strong></p>{list_html(answer.get("reasoning", []), True, "steps")}'
        f'<p class="check"><strong>Independent check:</strong> {esc(answer["check"])}</p>'
        f'<p><strong>Primary capability preserved:</strong> <code>{esc(q["primary_capability_ref"])}</code></p>'
        f'</article>'
    )


def teaching_section(m: dict, records: dict, anchor: dict, visual_specs: dict, extension: bool) -> str:
    rels = [records[r] for r in m.get("relation_refs", []) if r in records]
    checks = [c for r in rels for c in r.get("checks", [])]
    wrong = "".join(
        f'<div class="warning"><strong>Plausible wrong path:</strong> {esc(x["wrong_idea"])}'
        f'<br><strong>Diagnostic:</strong> {esc(x["diagnostic_prompt"])}'
        f'<br><strong>Repair:</strong> {esc(x["repair"])}</div>'
        for x in m.get("misconceptions", [])
    )
    visual = ""
    for ref in m.get("representation_refs", []):
        if ref in visual_specs:
            visual += visual_svg(visual_specs[ref])
        else:
            visual += f'<p class="prov">Canonical representation: <code>{esc(ref)}</code>; use the linked canonical explorer where supplied.</p>'
    ext_class = " extension" if extension else ""
    ext_badge = '<div class="eyebrow">EXTENSION</div>' if extension else '<div class="eyebrow">Canonical</div>'
    anchor_html = (
        f'<section data-role="worked-anchor"><h3>Worked conceptual anchor</h3><p>{esc(anchor["problem"])}</p>'
        f'{list_html(anchor["route"], True, "steps")}<p><strong>Result:</strong> {esc(anchor["result"])}</p>'
        f'<p class="prov">Provenance: {esc(anchor["provenance"])}</p></section>'
    )
    return (
        f'<article class="concept{ext_class}" id="{esc(m["id"])}">{ext_badge}<h2>{esc(m["title"])}</h2>'
        f'<h3>Entry assumptions</h3>{list_html(m.get("entry_assumptions", []))}'
        f'<h3>Inferential jump</h3><p>{esc(m["inferential_jump"])}</p>'
        f'<h3>Stepwise construction</h3><ol class="steps">'
        + "".join(f'<li><strong>{esc(s["action"])}</strong><br>Why valid: {esc(s["why_valid"])}<br>Output: {esc(s["output"])}</li>' for s in m.get("teaching_path", []))
        + f'</ol><h3>Representation bridge</h3>{visual}{anchor_html}{wrong}'
        f'<h3>Independent checks and limits</h3>{list_html(checks)}'
        f'<h3>Exit task</h3><p>{esc(m["exit_task"]["prompt"])}</p>'
        f'<details data-role="answer"><summary>Model answer</summary><p>{esc(m["exit_task"]["answer"]["summary"])}</p>'
        f'{list_html(m["exit_task"]["answer"].get("reasoning", []), True, "steps")}'
        f'<p class="check">{esc(m["exit_task"]["answer"]["check"])}</p></details></article>'
    )


def reconstruction_section(m: dict, visual_specs: dict, extension: bool) -> str:
    e = m["elicitation"]
    attempt = e["attempt"]
    model = attempt.get("model_response")
    if not model:
        rubric = attempt.get("rubric", [])
        model = " | ".join(f'{x["criterion"]}: {x["evidence_of"]}' for x in rubric)
    wrong = "".join(
        f'<li><strong>DIAGNOSE:</strong> {esc(x["diagnostic_prompt"])}<br>'
        f'<strong>Wrong route:</strong> {esc(x["wrong_idea"])}<br><strong>REPAIR:</strong> {esc(x["repair"])}</li>'
        for x in m.get("misconceptions", [])
    )
    visual = "".join(visual_svg(visual_specs[r]) for r in m.get("representation_refs", []) if r in visual_specs)
    ext_class = " extension" if extension else ""
    ext_badge = '<div class="eyebrow">EXTENSION</div>' if extension else '<div class="eyebrow">Canonical</div>'
    return (
        f'<article class="concept{ext_class}" id="{esc(m["id"])}">{ext_badge}<h2>{esc(m["title"])}</h2>'
        f'<section data-stage="PREDICT"><h3>PREDICT</h3><p>{esc(e["predict"]["prompt"])}</p></section>'
        f'<section class="attempt" data-stage="ATTEMPT"><h3>ATTEMPT</h3><p>{esc(attempt["produces"])}</p>'
        f'<textarea aria-label="attempt for {esc(m["title"])}"></textarea></section>'
        f'<details data-stage="RECONSTRUCT"><summary>RECONSTRUCT · open after your attempt</summary>'
        f'<p><strong>Defensible prediction:</strong> {esc(e["predict"]["defensible_answer"])}</p>'
        f'<ol class="steps">{"".join(f"<li>{esc(x["ask"])}<br><span class=\"prov\">{esc(x["why_this_ask"])}</span></li>" for x in e["reconstruct"]["route"])}</ol>'
        f'<h3>DIAGNOSE → REPAIR</h3><ul>{wrong}</ul>'
        f'<h3>Model response / rubric</h3><p>{esc(model)}</p>'
        f'<h3>Rejoin the inferential jump</h3><p>{esc(m["inferential_jump"])}</p>{visual}</details>'
        f'<section data-stage="BOUNDARY_TEST"><h3>BOUNDARY TEST</h3><p>{esc(e["boundary_test"]["prompt"])}</p>'
        f'<div class="attempt"><textarea aria-label="boundary test attempt"></textarea></div>'
        f'<details data-role="answer"><summary>Boundary answer</summary><p>{esc(e["boundary_test"]["answer"])}</p>'
        f'<p>{esc(e["boundary_test"]["confirms"])}</p></details></section></article>'
    )


def scaffold_html(q: dict) -> str:
    rows = q.get("scaffolds", [])
    if not rows:
        return "<p>No pre-attempt authored scaffold is required.</p>"
    return "<details data-role=\"scaffold\"><summary>Optional authored support</summary><ol>" + "".join(
        f'<li>{esc(s["text"])} <span class="prov">({esc(s["support_kind"])}, supports {esc(s["supports_move_ref"])})</span></li>'
        for s in rows
    ) + "</ol></details>"


def application_question(q: dict) -> str:
    answer = q["answer"]
    repair = q.get("repair_ref", "")
    return (
        f'<article class="question" id="{esc(q["id"])}" data-role="supported-application"><div class="eyebrow">AUTHORED_PRACTICE</div>'
        f'<h2>{esc(q["stem"])}</h2><h3>Conditions</h3>{list_html(q.get("conditions", []))}'
        f'{scaffold_html(q)}<section class="attempt" data-stage="ATTEMPT"><h3>Your independent attempt</h3><textarea aria-label="application attempt"></textarea></section>'
        f'<details data-role="answer"><summary>Reasoning route and full solution</summary>'
        f'<ol class="steps">{"".join(f"<li><strong>{esc(m["kind"])}</strong> — {esc(m["action"])}<br>Why valid: {esc(m["why_valid"])}</li>" for m in answer.get("reasoning_route", []))}</ol>'
        f'<p><strong>Crux move:</strong> <code>{esc(answer.get("crux_move_ref",""))}</code></p>'
        f'<p><strong>Answer:</strong> {esc(answer["summary"])}</p>{list_html(answer.get("reasoning", []), True, "steps")}'
        f'<p class="check"><strong>Independent check:</strong> {esc(answer["check"])}</p>'
        f'<p><strong>Failure signal:</strong> your route selects an equation before naming the model, representation, or event condition.</p>'
        f'<p><strong>Repair pointer:</strong> <code>{esc(repair)}</code></p></details></article>'
    )


def transfer_question(q: dict, prior: list[str], visual_specs: dict, records: dict) -> str:
    answer = q["answer"]
    transfer = q["transfer"]
    protected = transfer["protected_move_ref"]
    move = next(m for m in answer["reasoning_route"] if m["id"] == protected)
    mic = next((records[r] for r in records if r == q.get("repair_ref")), None)
    rep_refs = [m.get("representation_ref") for m in answer["reasoning_route"] if m.get("representation_ref")]
    post_visual = "".join(visual_svg(visual_specs[r]) for r in rep_refs if r in visual_specs)
    lineage = "".join(f'<li><a href="{esc(x)}">{esc(x)}</a></li>' for x in prior)
    rubric = "".join(f'<li><strong>{esc(r["criterion"])}</strong> — {esc(r["evidence_of"])}</li>' for r in answer.get("rubric", []))
    return (
        f'<article class="question" id="{esc(q["id"])}" data-role="transfer"><div class="eyebrow">CORE2B changed-demand transfer</div>'
        f'<h2>{esc(q["stem"])}</h2><h3>Prior-exposure lineage</h3><ul>{lineage}</ul>'
        f'<h3>Conditions</h3>{list_html(q.get("conditions", []))}'
        f'<p class="prov" data-role="safe-support">Safe pre-attempt support: list the givens, event boundaries, and requested quantity. Do not choose the governing extension until you commit.</p>'
        f'<section class="attempt" data-role="learner-commitment" data-stage="ATTEMPT"><h3>Commit before support</h3>'
        f'<p>Write the model or representation you choose, the decision that justifies it, and your first executable relation.</p>'
        f'<textarea aria-label="transfer commitment"></textarea></section>'
        f'<details data-role="post-attempt-support"><summary>Post-attempt review and solution</summary>'
        f'<h3>Changed demand</h3><p>{esc(transfer["statement"])}</p>'
        f'<h3>Protected DECIDE move</h3><p><code>{esc(protected)}</code> — {esc(move["action"])}</p>'
        f'{post_visual}<h3>Complete reasoning route</h3><ol class="steps">'
        + "".join(f'<li><strong>{esc(m["kind"])}</strong> — {esc(m["action"])}<br>Why valid: {esc(m["why_valid"])}</li>' for m in answer["reasoning_route"])
        + f'</ol><h3>Answer</h3><p>{esc(answer["summary"])}</p>{list_html(answer.get("reasoning", []), True, "steps")}'
        f'<h3>Justification rubric</h3><ul>{rubric}</ul>'
        f'<p class="check"><strong>Independent check:</strong> {esc(answer["check"])}</p>'
        f'<p><strong>Repair route:</strong> <code>{esc(q.get("repair_ref",""))}</code> in Core1A/Core1B.</p></details></article>'
    )


def build_trace(product: dict, records: dict, bank_by_id: dict[str, dict]) -> dict:
    review = product["review_labels"]
    rows: list[dict] = []
    for core, conf in product["cores"].items():
        rows.append({
            "artifact_id": f"PAGE-{core}",
            "Core": core,
            "canonical_source_ref": product["canonical_package_ref"],
            "owner_label": None,
            "exact_ref": CORE_FILES[core],
            "other_candidates": [],
            "primary_capability_ref": None,
            "secondary_capability_refs": [],
            "microtopic": None,
            "demand_evidence_status": "PRODUCT_PROJECTION",
            "learner_eligibility_status": "LEARNER_PRODUCT",
            "prerequisites": [],
            "misconception": None,
            "representation_ref": None,
            "reveal_state": "ATTEMPT_FIRST" if core in {"CORE1B","CORE2B"} else "ROLE_DEFINED",
            "source_hint_refs": [],
            "authored_scaffold_refs": [],
            "reasoning_refs": [],
            "verification_ref": "Physics/tools/build_motion2d_projectile_product.py --check",
            "provenance_class": "CANONICAL_DERIVED",
            "transformation_from_canonical_truth": conf["purpose"],
            "prior_exposure_refs": [],
            "protected_move": None,
            "duties_performed": [],
            "review_labels": review,
        })
    for mid in product["cores"]["CORE1A"]["microtopic_refs"]:
        m = records[mid]
        ext = m.get("extensions", {}).get("grade9v3:classification") == "EXTENSION"
        canonical_ref = m.get("extensions", {}).get("grade9v3:extends_microtopic_ref", mid)
        misc = m.get("misconceptions", [])
        rep = (m.get("representation_refs") or [None])[0]
        for core in ("CORE1A","CORE1B"):
            rows.append({
                "artifact_id": f"{core}-{mid}",
                "Core": core,
                "canonical_source_ref": canonical_ref,
                "owner_label": None,
                "exact_ref": mid,
                "other_candidates": [],
                "primary_capability_ref": m["primary_capability_ref"],
                "secondary_capability_refs": [],
                "microtopic": mid,
                "demand_evidence_status": "RESEARCH_SUPPORTED_EXTENSION" if ext else "CANONICAL_DERIVED",
                "learner_eligibility_status": "TEACHING_ARTIFACT",
                "prerequisites": m.get("prerequisite_refs", []),
                "misconception": misc[0]["wrong_idea"] if misc else None,
                "representation_ref": rep,
                "reveal_state": "ATTEMPT_FIRST" if core == "CORE1B" else "IMMEDIATE",
                "source_hint_refs": [],
                "authored_scaffold_refs": [],
                "reasoning_refs": [s["id"] for s in m.get("teaching_path", [])],
                "verification_ref": m["exit_task"]["answer"].get("verification_status"),
                "provenance_class": "AUTHORED_PEDAGOGICAL" if ext else "CANONICAL_DERIVED",
                "transformation_from_canonical_truth": "Explicit admitted extension after canonical R1–R3." if ext else "Direct projection of canonical microtopic truth.",
                "prior_exposure_refs": [],
                "protected_move": None,
                "duties_performed": ["AUTHOR_EXTENSION_TEACHING","AUTHOR_ASSET"] if ext else ["AUTHOR_ASSET"],
                "review_labels": review,
            })
    for d in product["demands"]:
        source_q = bank_by_id[d["resolved_ref"]]
        rows.append({
            "artifact_id": f'CORE2-{d["resolved_ref"]}',
            "Core": "CORE2",
            "canonical_source_ref": d["microtopic_ref"],
            "owner_label": d["owner_label"],
            "exact_ref": d["resolved_ref"],
            "other_candidates": d["other_candidate_refs"],
            "primary_capability_ref": source_q["primary_capability_ref"],
            "secondary_capability_refs": source_q.get("secondary_capability_refs", []),
            "microtopic": d["microtopic_ref"],
            "demand_evidence_status": d["demand_evidence_status"],
            "learner_eligibility_status": d["learner_eligibility_status"],
            "prerequisites": [d["assumed_prerequisite"]],
            "misconception": source_q["extensions"]["grade9v3:analysis"]["common_wrong_route"],
            "representation_ref": None,
            "reveal_state": "SOURCE_CUSTODY",
            "source_hint_refs": [f'{source_q["id"]}#hint-{i+1}' for i,_ in enumerate(source_q.get("hints", []))],
            "authored_scaffold_refs": [],
            "reasoning_refs": [m["id"] for m in source_q["answer"].get("reasoning_route", [])],
            "verification_ref": source_q["answer"].get("verification_status"),
            "provenance_class": source_q["extensions"]["grade9v3:provenance_class"],
            "transformation_from_canonical_truth": "Demand evidence only; source custody does not author Core1-family truth.",
            "prior_exposure_refs": [],
            "protected_move": None,
            "duties_performed": d["duties_performed"],
            "review_labels": review,
        })
        for core, qref in (("CORE2A",d["core2a_ref"]),("CORE2B",d["core2b_ref"])):
            q = records[qref]
            prior = product["cores"]["CORE2B"].get("prior_exposure_map", {}).get(qref, []) if core == "CORE2B" else []
            rows.append({
                "artifact_id": f"{core}-{qref}",
                "Core": core,
                "canonical_source_ref": d["microtopic_ref"],
                "owner_label": d["owner_label"],
                "exact_ref": qref,
                "other_candidates": [],
                "primary_capability_ref": q["primary_capability_ref"],
                "secondary_capability_refs": q.get("secondary_capability_refs", []),
                "microtopic": d["extension_microtopic_refs"][0],
                "demand_evidence_status": "AUTHORED_PRACTICE_LINKED_TO_VERIFIED_DEMAND",
                "learner_eligibility_status": "ELIGIBLE_AUTHORED_PRACTICE",
                "prerequisites": [d["assumed_prerequisite"]],
                "misconception": None,
                "representation_ref": next((m.get("representation_ref") for m in q["answer"].get("reasoning_route", []) if m.get("representation_ref")), None),
                "reveal_state": "POST_ATTEMPT" if core == "CORE2B" else "SUPPORTED_ATTEMPT",
                "source_hint_refs": [],
                "authored_scaffold_refs": [f'{qref}#scaffold-{i+1}' for i,_ in enumerate(q.get("scaffolds", []))],
                "reasoning_refs": [m["id"] for m in q["answer"].get("reasoning_route", [])],
                "verification_ref": q["answer"].get("verification_status"),
                "provenance_class": q["extensions"]["grade9v3:provenance_class"],
                "transformation_from_canonical_truth": "Authored learner-eligible demand twin." if core == "CORE2A" else "Genuinely changed demand using already-taught extension.",
                "prior_exposure_refs": prior,
                "protected_move": q.get("transfer", {}).get("protected_move_ref"),
                "duties_performed": ["AUTHOR_PRACTICE"] if core == "CORE2A" else ["SEQUENCE_PRIOR_EXPOSURE"],
                "review_labels": review,
            })
    return {
        "schema_version": "motion2d-projectile-trace/v1",
        "product_id": product["product_id"],
        "starting_main_sha": product["starting_main_sha"],
        "canonical_package_ref": product["canonical_package_ref"],
        "extension_package_ref": product["extension_package_ref"],
        "q15_identity": {
            "selected_ref": "PYQ-PHY-JEEADV-2018-P2-Q08",
            "comparison_ref": "PYQ-PHY-JEEADV-2023-P1-Q01",
            "discriminator": next(d["other_candidate_refs"][0]["reason_not_selected"] for d in product["demands"] if d["owner_label"] == "Q15"),
        },
        "artifacts": rows,
    }


def build() -> dict[str, str]:
    product, canonical, extension, bank = map(load, (PRODUCT, CANONICAL, EXTENSIONS, BANK))
    records = lookup_records(canonical, extension)
    bank_by_id = {q["id"]: q for q in bank["questions"]}
    visual_specs = {x["representation_ref"]: x for x in product["visual_specs"]}
    outputs: dict[str, str] = {}

    c1 = header(product, "CORE1", product["cores"]["CORE1"]["purpose"]) + canonical_orientation(product, records)
    outputs[(OUT / "core1.html").relative_to(REPO).as_posix()] = doc("Core1 · Motion in 2D", "CORE1", product["cores"]["CORE1"]["blueprint_ref"], c1)

    selected = {d["resolved_ref"] for d in product["demands"]}
    source_refs = product["cores"]["CORE2"]["question_refs"]
    c2 = header(product, "CORE2", product["cores"]["CORE2"]["purpose"])
    c2 += '<section class="card"><h2>Custody boundary</h2><p>These records preserve source identity, conditions, answer custody and official locators. The repository stores faithful non-verbatim restatements rather than republishing official wording. Authored scaffolds are not source hints and do not appear in this Core.</p></section>'
    c2 += "".join(source_question(bank_by_id[r], r in selected) for r in source_refs)
    outputs[(OUT / "core2.html").relative_to(REPO).as_posix()] = doc("Core2 · Motion in 2D", "CORE2", product["cores"]["CORE2"]["blueprint_ref"], c2)

    for core in ("CORE1A","CORE1B"):
        body = header(product, core, product["cores"][core]["purpose"])
        for mid in product["cores"][core]["microtopic_refs"]:
            m = records[mid]
            is_ext = m.get("extensions", {}).get("grade9v3:classification") == "EXTENSION"
            body += teaching_section(m, records, product["worked_anchors"][mid], visual_specs, is_ext) if core == "CORE1A" else reconstruction_section(m, visual_specs, is_ext)
        outputs[(OUT / CORE_FILES[core]).relative_to(REPO).as_posix()] = doc(f"{core} · Motion in 2D", core, product["cores"][core]["blueprint_ref"], body)

    c2a = header(product, "CORE2A", product["cores"]["CORE2A"]["purpose"])
    c2a += "".join(application_question(records[r]) for r in product["cores"]["CORE2A"]["question_refs"])
    outputs[(OUT / "core2a.html").relative_to(REPO).as_posix()] = doc("Core2A · Motion in 2D", "CORE2A", product["cores"]["CORE2A"]["blueprint_ref"], c2a)

    c2b = header(product, "CORE2B", product["cores"]["CORE2B"]["purpose"])
    for ref in product["cores"]["CORE2B"]["question_refs"]:
        c2b += transfer_question(records[ref], product["cores"]["CORE2B"]["prior_exposure_map"][ref], visual_specs, records)
    outputs[(OUT / "core2b.html").relative_to(REPO).as_posix()] = doc("Core2B · Motion in 2D", "CORE2B", product["cores"]["CORE2B"]["blueprint_ref"], c2b)

    diag = "".join(
        f'<article class="diagnostic"><p>{esc(x["prompt"])}</p><div class="attempt"><textarea aria-label="diagnostic attempt"></textarea></div>'
        f'<details><summary>Check</summary><p>{esc(x["answer"])}</p><p class="prov">Routes to {esc(x["routes_to"])}</p></details></article>'
        for x in product["diagnostic"]
    )
    visuals = "".join(visual_svg(s) for s in product["visual_specs"])
    preview = (
        f'<header><div class="eyebrow">Learner preview</div><h1>{esc(product["title"])}</h1>'
        '<p>Start with the three-item diagnostic. Then use Core1 for orientation, Core1A/Core1B for teaching and reconstruction, Core2A for supported application, and Core2B for changed-demand transfer.</p></header>'
        f'<section class="card"><h2>Diagnostic</h2>{diag}</section>'
        '<section class="card"><h2>Rendered extension visuals</h2><p>Each visual is bound to an admitted representation and carries an accessible description.</p>'
        f'{visuals}</section><section class="card"><h2>Attempt/reveal contract</h2>'
        '<p>Core1B and Core2B place a learner commitment before protected reconstruction or transfer decisions. Open their disclosure controls only after writing an attempt.</p></section>'
    )
    outputs[(OUT / "index.html").relative_to(REPO).as_posix()] = doc("Motion in 2D · learner preview", None, None, preview)

    trace = build_trace(product, records, bank_by_id)
    trace_text = json.dumps(trace, indent=2, ensure_ascii=False) + "\n"
    outputs[TRACE.relative_to(REPO).as_posix()] = trace_text
    outputs[(OUT / "trace.json").relative_to(REPO).as_posix()] = trace_text
    return outputs


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    outputs = build()
    drift = []
    for rel, text in outputs.items():
        path = REPO / rel
        if args.check:
            if not path.is_file() or path.read_text(encoding="utf-8") != text:
                drift.append(rel)
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text, encoding="utf-8", newline="\n")
    if args.check:
        if drift:
            print("projectile learner product drift: " + ", ".join(drift))
            return 1
        print(f"projectile learner product current: {len(outputs)} artifact(s)")
        return 0
    print(f"wrote projectile learner product: {len(outputs)} artifact(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
