#!/usr/bin/env python3
"""Publish governed Chemistry Core1A snapshots into learner Practice surfaces.

Question records remain owned by the canonical Question Bank.  This publisher
creates only learner routes and resource/search registrations, so subject
segregation never forks question authority.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PRACTICE = ROOT / "public/standalone/practice/chemistry"
COPIES = {
    "standalone/core1a-chemistry-behaviour-of-gases-tablet.html": "behaviour-of-gases.html",
    "standalone/core1a-chemistry-chemical-bonding-tablet.html": "chemical-bonding.html",
    "standalone/core1a-chemistry-redox-reactions-tablet.html": "redox-reactions.html",
    "standalone/core1a-chemistry-some-basic-concepts-tablet.html": "some-basic-concepts.html",
}
RESOURCE_ROWS = [
    {
        "id": "RES-CHEM-PRACTICE-GASES",
        "kind": "revision",
        "title": "Behaviour of Gases · Core 1A Practice",
        "topic": "JEE Main Chemistry · Gaseous State",
        "path": "standalone/practice/chemistry/behaviour-of-gases.html",
        "keywords": ["chemistry", "practice", "gases", "gas laws", "kinetic theory", "core1a", "blueprint 1.9"],
        "order": 30,
        "status": "PUBLISHED",
    },
    {
        "id": "RES-CHEM-PRACTICE-BONDING",
        "kind": "revision",
        "title": "Chemical Bonding · Core 1A Practice",
        "topic": "JEE Main Chemistry · Chemical Bonding & Molecular Structure",
        "path": "standalone/practice/chemistry/chemical-bonding.html",
        "keywords": ["chemistry", "practice", "chemical bonding", "vsepr", "molecular structure", "core1a", "blueprint 1.9"],
        "order": 30,
        "status": "PUBLISHED",
    },
    {
        "id": "RES-CHEM-PRACTICE-REDOX",
        "kind": "revision",
        "title": "Redox Reactions · Core 1A Practice",
        "topic": "Redox Reactions",
        "path": "standalone/practice/chemistry/redox-reactions.html",
        "keywords": ["chemistry", "practice", "redox", "oxidation state", "balancing", "core1a", "blueprint 1.9"],
        "order": 30,
        "status": "PUBLISHED",
    },
    {
        "id": "RES-CHEM-PRACTICE-MOLE",
        "kind": "revision",
        "title": "Mole Concept & Stoichiometry · Core 1A Practice",
        "topic": "Some Basic Concepts of Chemistry / Mole Concept / Stoichiometry",
        "path": "standalone/practice/chemistry/some-basic-concepts.html",
        "keywords": ["chemistry", "practice", "mole concept", "stoichiometry", "concentration", "core1a", "blueprint 1.9"],
        "order": 30,
        "status": "PUBLISHED",
    },
]
SEARCH_ROWS = [
    {
        "title": "Chemistry Practice Library",
        "path": "standalone/practice/chemistry/index.html",
        "kind": "practice",
        "keywords": ["chemistry", "practice", "standalone", "tablet", "offline", "blueprint 1.9", "redox", "mole concept", "stoichiometry", "bonding", "gases"],
    },
    {
        "title": "Behaviour of Gases — Core 1A Practice",
        "path": "standalone/practice/chemistry/behaviour-of-gases.html",
        "kind": "practice",
        "keywords": ["chemistry", "practice", "gases", "gas laws", "kinetic theory", "core1a"],
    },
    {
        "title": "Chemical Bonding — Core 1A Practice",
        "path": "standalone/practice/chemistry/chemical-bonding.html",
        "kind": "practice",
        "keywords": ["chemistry", "practice", "bonding", "vsepr", "molecular structure", "core1a"],
    },
    {
        "title": "Redox Reactions — Core 1A Practice",
        "path": "standalone/practice/chemistry/redox-reactions.html",
        "kind": "practice",
        "keywords": ["chemistry", "practice", "redox", "oxidation state", "balancing", "core1a"],
    },
    {
        "title": "Mole Concept & Stoichiometry — Core 1A Practice",
        "path": "standalone/practice/chemistry/some-basic-concepts.html",
        "kind": "practice",
        "keywords": ["chemistry", "practice", "mole", "stoichiometry", "concentration", "core1a"],
    },
]


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.replace("\r\n", "\n"), encoding="utf-8", newline="\n")


def publish_pages() -> None:
    PRACTICE.mkdir(parents=True, exist_ok=True)
    for source, target in COPIES.items():
        text = (ROOT / source).read_text(encoding="utf-8")
        text = text.replace("../public/index.html", "../../../index.html")
        text = text.replace("../public/question-bank/index.html", "../../../question-bank/index.html?subject=Chemistry")
        write_text(PRACTICE / target, text)

    hub = """<!doctype html>
<html lang="en" data-g9-shell>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>Chemistry Practice · Grade9V3</title>
  <link rel="stylesheet" href="../../../css/site.css">
  <link rel="stylesheet" href="../../../css/tablet-12-7.css">
  <style>
    body{margin:0;background:var(--bg);color:var(--text)}
    .practice-shell{max-width:1180px;margin:0 auto;padding:24px 18px 48px}
    .practice-hero{padding:20px 0 12px}.practice-hero h1{font-size:32px;margin:0 0 8px}
    .practice-hero p{font-size:16px;color:var(--text-muted);max-width:860px;line-height:1.6}
    .practice-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:20px}
    .practice-card{border:1px solid var(--border);background:var(--bg-card);border-radius:14px;padding:18px;display:flex;flex-direction:column;gap:12px}
    .practice-card h2{font-size:20px;margin:0}.practice-card p{font-size:15px;line-height:1.55;color:var(--text-muted);margin:0}
    .practice-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:auto}.practice-actions a{min-height:48px;display:inline-flex;align-items:center}
    .practice-meta{display:flex;gap:8px;flex-wrap:wrap}.practice-note{font-size:14px;color:var(--text-muted)}
    @media(max-width:720px){.practice-hero h1{font-size:28px}}
  </style>
</head>
<body>
<header class="site-nav">
  <a href="../../../index.html" class="brand-link"><span class="logo-icon">⚡</span><span>Grade9V3 Knowledge Portal</span></a>
  <nav class="nav-links" aria-label="Primary">
    <a href="../../../index.html">Home</a><a href="../../../physics/index.html">Physics</a>
    <a href="../../../chemistry/index.html" class="active chem-link">Chemistry</a><a href="../../../mathematics/index.html">Mathematics</a>
    <a href="../../../question-bank/index.html?subject=Chemistry" data-site-question-bank>Question Bank</a>
  </nav>
</header>
<main class="practice-shell">
  <div class="breadcrumb"><a href="../../../index.html">Home</a><span class="sep">/</span><a href="../../../chemistry/index.html">Chemistry</a><span class="sep">/</span><span class="current">Practice</span></div>
  <section class="practice-hero">
    <div class="practice-meta"><span class="badge chem">Chemistry Practice</span><span class="badge ok">Blueprint 1.9</span><span class="badge neutral">Tablet-ready</span></div>
    <h1>🧪 Chemistry Practice Library</h1>
    <p>Four governed Core 1A concept books paired with the subject-filtered canonical Question Bank. Redox and Mole Concept link directly to admitted question collections; Bonding and Gases remain practice-only until canonical questions are admitted.</p>
    <div class="practice-actions"><a class="btn outline" href="../../../question-bank/index.html?subject=Chemistry">Browse 46 canonical Chemistry questions →</a></div>
  </section>
  <section class="practice-grid" aria-label="Chemistry practice modules">
    <article class="practice-card"><div class="practice-meta"><span class="badge chem">Core 1A</span><span class="badge ok">Gases</span></div><h2>Behaviour of Gases</h2><p>Gas-law models, molecular-speed reasoning, ideal/real-gas boundaries and validity conditions.</p><div class="practice-actions"><a class="btn primary-chem" href="behaviour-of-gases.html">Open Practice →</a></div><span class="practice-note">Canonical topic questions: not yet admitted.</span></article>
    <article class="practice-card"><div class="practice-meta"><span class="badge chem">Core 1A</span><span class="badge ok">Bonding</span></div><h2>Chemical Bonding &amp; Molecular Structure</h2><p>Lewis structures, VSEPR, formal charge, polarity, molecular orbital reasoning and hydrogen bonding.</p><div class="practice-actions"><a class="btn primary-chem" href="chemical-bonding.html">Open Practice →</a></div><span class="practice-note">Canonical topic questions: not yet admitted.</span></article>
    <article class="practice-card"><div class="practice-meta"><span class="badge chem">Core 1A</span><span class="badge ok">Redox</span></div><h2>Redox Reactions</h2><p>Oxidation-state bookkeeping, agent roles, reaction classification and half-reaction balancing.</p><div class="practice-actions"><a class="btn primary-chem" href="redox-reactions.html">Open Practice →</a><a class="btn outline" href="../../../question-bank/index.html?subject=Chemistry&amp;topic=Redox%20Reactions">26 canonical questions</a></div></article>
    <article class="practice-card"><div class="practice-meta"><span class="badge chem">Core 1A</span><span class="badge ok">Mole Concept</span></div><h2>Some Basic Concepts of Chemistry</h2><p>Mole scale, stoichiometry, concentration, limiting reagent and quantitative chemical reasoning.</p><div class="practice-actions"><a class="btn primary-chem" href="some-basic-concepts.html">Open Practice →</a><a class="btn outline" href="../../../question-bank/index.html?subject=Chemistry&amp;topic=Some%20Basic%20Concepts%20of%20Chemistry%20%2F%20Mole%20Concept%20%2F%20Stoichiometry">20 canonical questions</a></div></article>
  </section>
</main>
<script src="../../../js/site-header.js" data-site-root="../../../" data-site-parent="../../../chemistry/index.html"></script>
</body></html>
"""
    write_text(PRACTICE / "index.html", hub)


def update_portal() -> None:
    path = ROOT / "public/chemistry/index.html"
    text = path.read_text(encoding="utf-8").replace("\r\n", "\n")
    if "Chemistry Practice Library" in text:
        return
    marker = """  <div class="chapter-card" style="margin-top: 18px;">
    <div class="chapter-header">
      <div class="chapter-title">
        <span>🧪</span>
        <span>Audited Chemistry Master Suites</span>"""
    practice = """  <div class="chapter-card" style="margin-top: 18px; border-color: rgba(52, 211, 153, 0.45);">
    <div class="chapter-header">
      <div class="chapter-title"><span>🧪</span><span>Chemistry Practice Library</span></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;"><span class="badge ok">Blueprint 1.9</span><span class="badge chem">4 Core 1A books</span></div>
    </div>
    <p style="color:var(--text-muted);font-size:14px;margin:0 0 14px;">Tablet-ready governed practice paired with the canonical Chemistry Question Bank. Redox and Mole Concept expose direct question hand-offs without duplicating question authority.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;"><a class="btn primary-chem" href="../standalone/practice/chemistry/index.html">Open Chemistry Practice →</a><a class="btn outline" href="../question-bank/index.html?subject=Chemistry">Chemistry Question Bank</a></div>
  </div>
"""
    if marker not in text:
        raise SystemExit("Chemistry portal insertion marker not found")
    write_text(path, text.replace(marker, practice + marker, 1))


def update_resources() -> None:
    path = ROOT / "Chemistry/question-bank/resources.v1.json"
    doc = json.loads(path.read_text(encoding="utf-8"))
    existing = {row["id"]: row for row in doc.get("resources", [])}
    for row in RESOURCE_ROWS:
        existing[row["id"]] = row
    doc["resources"] = list(existing.values())
    write_text(path, json.dumps(doc, indent=2, ensure_ascii=False) + "\n")


def update_search_resources() -> None:
    path = ROOT / "public/data/site-search-resources.js"
    raw = path.read_text(encoding="utf-8").strip()
    prefix = "window.GRADE9_SITE_SEARCH_RESOURCES="
    if not raw.startswith(prefix):
        raise SystemExit("unexpected site-search-resources format")
    payload = raw[len(prefix):].removesuffix(";")
    rows = json.loads(payload)
    existing = {row["path"]: row for row in rows}
    for row in SEARCH_ROWS:
        existing[row["path"]] = row
    write_text(path, prefix + json.dumps(list(existing.values()), ensure_ascii=False, separators=(",", ":")) + ";\n")


def update_pages_manifest() -> None:
    path = ROOT / "docs/.pages-manifest.json"
    doc = json.loads(path.read_text(encoding="utf-8"))
    mappings = [
        ("public/standalone/practice/chemistry/index.html", "standalone/practice/chemistry/index.html"),
        ("public/standalone/practice/chemistry/behaviour-of-gases.html", "standalone/practice/chemistry/behaviour-of-gases.html"),
        ("public/standalone/practice/chemistry/chemical-bonding.html", "standalone/practice/chemistry/chemical-bonding.html"),
        ("public/standalone/practice/chemistry/redox-reactions.html", "standalone/practice/chemistry/redox-reactions.html"),
        ("public/standalone/practice/chemistry/some-basic-concepts.html", "standalone/practice/chemistry/some-basic-concepts.html"),
    ]
    targets = {row["target"] for row in doc["files"]}
    for source, target in mappings:
        if target not in targets:
            doc["files"].append({"source": source, "target": target})
            targets.add(target)
    write_text(path, json.dumps(doc, indent=2, ensure_ascii=False) + "\n")


def main() -> int:
    publish_pages()
    update_portal()
    update_resources()
    update_search_resources()
    update_pages_manifest()
    print("Chemistry Practice publication synchronized.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
