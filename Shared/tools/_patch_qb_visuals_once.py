#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def replace_once(path: Path, old: str, new: str) -> None:
    text = path.read_text(encoding="utf-8")
    if old not in text:
        raise SystemExit(f"patch anchor missing in {path}: {old[:80]!r}")
    path.write_text(text.replace(old, new, 1), encoding="utf-8")


builder = ROOT / "Shared/tools/build_question_bank_web.py"
replace_once(
    builder,
    "import re\nfrom collections import Counter\n",
    "import re\nimport shutil\nfrom collections import Counter\n",
)

old = '''def _project_question(subject: str, question: dict, order: int, repo: Path) -> dict:\n    extensions = question["extensions"]\n    analysis = extensions["grade9v3:analysis"]\n    custody = extensions["grade9v3:source_custody"]\n    answer = question["answer"]\n    visual_rel = f"question-bank/visuals/{question['id']}.svg"\n    visual_ref = visual_rel if (repo / "public" / visual_rel).is_file() else None\n    return {\n'''
new = '''def _slug(value: str) -> str:\n    return re.sub(r"[^a-z0-9]+", "-", str(value).casefold()).strip("-") or "unknown"\n\n\ndef _safe_repo_svg(repo: Path, value: object) -> Path | None:\n    if not isinstance(value, str) or not value.strip().lower().endswith(".svg"):\n        return None\n    rel = Path(value.strip())\n    if rel.is_absolute() or ".." in rel.parts:\n        return None\n    candidates = [repo / rel, repo / "public" / rel]\n    for candidate in candidates:\n        try:\n            resolved = candidate.resolve()\n            resolved.relative_to(repo.resolve())\n        except (OSError, ValueError):\n            continue\n        if resolved.is_file() and resolved.suffix.lower() == ".svg":\n            return resolved\n    return None\n\n\ndef _representation_asset(package: dict | None, ref: object) -> object:\n    if not package or not isinstance(ref, str):\n        return ref\n    for rep in package.get("representations", []) or []:\n        if isinstance(rep, dict) and rep.get("id") == ref:\n            assets = rep.get("rendered_asset_refs") or []\n            return assets[0] if assets else ref\n    return ref\n\n\ndef _record_visual_asset(repo: Path, subject: str, source: Path, visual_assets: list[dict] | None) -> str:\n    public = (repo / "public").resolve()\n    resolved = source.resolve()\n    try:\n        return resolved.relative_to(public).as_posix()\n    except ValueError:\n        target_rel = Path("question-bank/visuals/canonical") / _slug(subject) / source.name\n        if visual_assets is not None:\n            source_rel = resolved.relative_to(repo.resolve()).as_posix()\n            row = {"source": source_rel, "target": (Path("public") / target_rel).as_posix()}\n            existing = next((item for item in visual_assets if item["target"] == row["target"]), None)\n            if existing and existing["source"] != row["source"]:\n                raise ValueError(f"Question Bank canonical visual target collision: {existing} vs {row}")\n            if not existing:\n                visual_assets.append(row)\n        return target_rel.as_posix()\n\n\ndef _resolve_visual_refs(\n    repo: Path, subject: str, question: dict, package: dict | None = None, visual_assets: list[dict] | None = None\n) -> list[str]:\n    refs: list[object] = []\n    extensions = question.get("extensions") or {}\n    qbank = extensions.get("grade9v3:question_bank") if isinstance(extensions, dict) else None\n    if isinstance(qbank, dict):\n        if qbank.get("visual_ref"):\n            refs.append(qbank["visual_ref"])\n        refs.extend(qbank.get("visual_refs") or [])\n    if question.get("visual_ref"):\n        refs.append(question["visual_ref"])\n    refs.extend(question.get("figure_refs") or [])\n\n    legacy = repo / "public" / "question-bank" / "visuals" / f"{question['id']}.svg"\n    if legacy.is_file():\n        refs.append(legacy.relative_to(repo / "public").as_posix())\n\n    for scaffold in question.get("scaffolds") or []:\n        if isinstance(scaffold, dict) and scaffold.get("visual_ref"):\n            refs.append(scaffold["visual_ref"])\n\n    resolved_refs: list[str] = []\n    for raw in refs:\n        candidate = _representation_asset(package, raw)\n        source = _safe_repo_svg(repo, candidate)\n        if source is None:\n            continue\n        public_ref = _record_visual_asset(repo, subject, source, visual_assets)\n        if public_ref not in resolved_refs:\n            resolved_refs.append(public_ref)\n    return resolved_refs\n\n\ndef _sync_visual_assets(repo: Path, assets: list[dict], *, check: bool) -> bool:\n    ok = True\n    for row in assets:\n        source = repo / row["source"]\n        target = repo / row["target"]\n        if not target.is_file() or target.read_bytes() != source.read_bytes():\n            if check:\n                print(f"question-bank canonical visual drift: {row['target']} <- {row['source']}")\n                ok = False\n            else:\n                target.parent.mkdir(parents=True, exist_ok=True)\n                shutil.copyfile(source, target)\n    return ok\n\n\ndef _project_question(\n    subject: str, question: dict, order: int, repo: Path, visual_assets: list[dict] | None = None\n) -> dict:\n    extensions = question["extensions"]\n    analysis = extensions["grade9v3:analysis"]\n    custody = extensions["grade9v3:source_custody"]\n    answer = question["answer"]\n    visual_refs = _resolve_visual_refs(repo, subject, question, visual_assets=visual_assets)\n    visual_ref = visual_refs[0] if visual_refs else None\n    return {\n'''
replace_once(builder, old, new)

replace_once(
    builder,
    '        "source_hints": question["hints"],\n        "scaffolds": question["scaffolds"],\n',
    '        "source_hints": question["hints"],\n        "scaffolds": question["scaffolds"],\n        "figure_refs": list(question.get("figure_refs") or []),\n',
)
replace_once(
    builder,
    '        "visual_ref": visual_ref,\n',
    '        "visual_ref": visual_ref,\n        "visual_refs": visual_refs,\n',
)
replace_once(
    builder,
    'def build(repo: Path = REPO) -> dict:\n',
    'def build(repo: Path = REPO, *, visual_assets: list[dict] | None = None) -> dict:\n',
)
replace_once(
    builder,
    '            questions.append(_project_question(subject, question, order, repo))\n',
    '            questions.append(_project_question(subject, question, order, repo, visual_assets))\n',
)
replace_once(
    builder,
    '''            projected["source_path"] = path.relative_to(repo).as_posix()\n            questions.append(projected)\n''',
    '''            projected["source_path"] = path.relative_to(repo).as_posix()\n            projected["figure_refs"] = list(question.get("figure_refs") or [])\n            visual_refs = _resolve_visual_refs(\n                repo, str(package.get("subject") or ""), question, package, visual_assets\n            )\n            projected["visual_refs"] = visual_refs\n            projected["visual_ref"] = visual_refs[0] if visual_refs else None\n            questions.append(projected)\n''',
)
replace_once(
    builder,
    '''    args = parser.parse_args()\n    intended = render(build())\n    if args.check:\n        if not OUT.is_file() or OUT.read_text(encoding="utf-8") != intended:\n            print("question-bank browser projection has drifted")\n            print("Regenerate with: python3 Shared/tools/build_question_bank_web.py")\n            return 1\n        print("question-bank browser projection is current")\n        return 0\n    OUT.parent.mkdir(parents=True, exist_ok=True)\n    OUT.write_text(intended, encoding="utf-8")\n    print(f"wrote {OUT.relative_to(REPO)}")\n    return 0\n''',
    '''    args = parser.parse_args()\n    visual_assets: list[dict] = []\n    intended = render(build(visual_assets=visual_assets))\n    if args.check:\n        ok = True\n        if not OUT.is_file() or OUT.read_text(encoding="utf-8") != intended:\n            print("question-bank browser projection has drifted")\n            print("Regenerate with: python3 Shared/tools/build_question_bank_web.py")\n            ok = False\n        if not _sync_visual_assets(REPO, visual_assets, check=True):\n            ok = False\n        if not ok:\n            return 1\n        print("question-bank browser projection and canonical visuals are current")\n        return 0\n    OUT.parent.mkdir(parents=True, exist_ok=True)\n    OUT.write_text(intended, encoding="utf-8")\n    _sync_visual_assets(REPO, visual_assets, check=False)\n    print(f"wrote {OUT.relative_to(REPO)}")\n    if visual_assets:\n        print(f"synchronized {len(visual_assets)} canonical Question Bank visual asset(s)")\n    return 0\n''',
)

js = ROOT / "public/js/question-bank.js"
replace_once(
    js,
    '''  const right=el('section','qb-panel');\n  right.append(el('div','qb-eyebrow','Representation & support'));\n  const visual=el('div','qb-visual');\n  if(q.visual_ref){\n    const img=document.createElement('img');\n    img.loading='lazy';\n    img.src='../'+q.visual_ref;\n    img.alt='Question-aligned representation for '+q.id;\n    visual.append(img);\n  }else visual.textContent='No separate representation asset is published for this canonical record.';\n  right.append(visual);\n''',
    '''  const right=el('section','qb-panel');\n  const visualRefs=(Array.isArray(q.visual_refs)&&q.visual_refs.length)?q.visual_refs:(q.visual_ref?[q.visual_ref]:[]);\n  right.append(el('div','qb-eyebrow',visualRefs.length?'Representation & support':'Support'));\n  if(visualRefs.length){\n    const visual=el('div','qb-visual');\n    visualRefs.forEach((ref,index)=>{\n      const img=document.createElement('img');\n      img.loading='lazy';\n      img.src='../'+ref;\n      img.alt='Question-aligned representation '+(index+1)+' for '+q.id;\n      visual.append(img);\n    });\n    right.append(visual);\n  }\n''',
)

# Regression test: canonical representation reuse, deterministic mirror, and learner-safe no-visual state.
test = ROOT / "tests/test_question_bank_web.py"
replace_once(test, "import subprocess\nimport unittest\n", "import subprocess\nimport tempfile\nimport unittest\n")
replace_once(
    test,
    '''    def test_selected_d3d4_view_is_exact_and_canonical(self):\n''',
    '''    def test_canonical_package_figure_resolves_and_mirrors_without_guessing(self):\n        with tempfile.TemporaryDirectory() as tmp:\n            root = Path(tmp)\n            source = root / "Mathematics/assets/representations/REP-MATH-LINE.svg"\n            source.parent.mkdir(parents=True)\n            source.write_text('<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h10"/></svg>', encoding="utf-8")\n            package = {"representations": [{\n                "id": "REP-MATH-LINE",\n                "rendered_asset_refs": ["Mathematics/assets/representations/REP-MATH-LINE.svg"],\n            }]}\n            question = {\n                "id": "Q-MATH-VISUAL",\n                "figure_refs": ["REP-MATH-LINE"],\n                "scaffolds": [],\n                "extensions": {},\n            }\n            assets = []\n            refs = build_question_bank_web._resolve_visual_refs(root, "Mathematics", question, package, assets)\n            self.assertEqual(refs, ["question-bank/visuals/canonical/mathematics/REP-MATH-LINE.svg"])\n            self.assertEqual(assets, [{\n                "source": "Mathematics/assets/representations/REP-MATH-LINE.svg",\n                "target": "public/question-bank/visuals/canonical/mathematics/REP-MATH-LINE.svg",\n            }])\n            self.assertTrue(build_question_bank_web._sync_visual_assets(root, assets, check=False))\n            target = root / assets[0]["target"]\n            self.assertEqual(target.read_bytes(), source.read_bytes())\n            self.assertTrue(build_question_bank_web._sync_visual_assets(root, assets, check=True))\n\n            unbound = dict(question, id="Q-MATH-NO-VISUAL", figure_refs=["REP-NOT-THERE"])\n            self.assertEqual(build_question_bank_web._resolve_visual_refs(root, "Mathematics", unbound, package, []), [])\n\n    def test_selected_d3d4_view_is_exact_and_canonical(self):\n''',
)
replace_once(
    test,
    '''            self.assertNotIn("innerHTML", path.read_text(encoding="utf-8"))\n''',
    '''            self.assertNotIn("innerHTML", path.read_text(encoding="utf-8"))\n        qb_js = (ROOT / "public/js/question-bank.js").read_text(encoding="utf-8")\n        self.assertNotIn("No separate representation asset is published", qb_js)\n        self.assertIn("visualRefs", qb_js)\n''',
)

print("QB_VISUAL_PATCH: applied")
