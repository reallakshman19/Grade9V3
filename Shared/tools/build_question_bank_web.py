#!/usr/bin/env python3
"""Build the subject-neutral static Question Bank projection for the browser."""
from __future__ import annotations

import argparse
import json
import re
import shutil
from collections import Counter
from pathlib import Path

try:
    from .question_bank_platform import project_package_question
except ImportError:  # direct: python3 Shared/tools/build_question_bank_web.py
    from question_bank_platform import project_package_question

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "public" / "data" / "question-bank-data.js"
VIEWS = REPO / "Shared" / "tools" / "question-bank-views.v1.json"
BANK_NAME = "competitive-exam-question-bank.v2.json"
PACKAGE_GLOB = "*/library/*.json"
RESOURCE_SCHEMA = "grade9v3-question-bank-resources-v1"


def _suite_destinations(repo: Path) -> list[dict]:
    destinations = []
    suites_dir = repo / "docs" / "gcdr-suites"
    if suites_dir.is_dir():
        for suite_path in sorted(suites_dir.glob("*.json")):
            try:
                data = json.loads(suite_path.read_text(encoding="utf-8"))
            except Exception:
                continue
            title = data.get("title")
            if not title:
                continue
            artifacts = data.get("delivery_artifacts", [])
            bundle_artifact = next(
                (a for a in artifacts if a.get("profile") == "REPO_BUNDLE" and "locator" in a),
                None,
            )
            if not bundle_artifact:
                continue
            locator = bundle_artifact["locator"]
            path = locator[7:] if locator.startswith("public/") else locator
            corpus_topic = data.get("external_corpus", {}).get("topic", "")
            suite_id = data.get("suite_id", "")
            raw_words = re.findall(r"[A-Za-z0-9]+", f"{title} {corpus_topic} {suite_id}")
            keywords = sorted(
                {w.lower() for w in raw_words if len(w) > 1}
                | {"explorer", "interactive", "suite"}
            )
            destinations.append({
                "title": title,
                "path": path,
                "kind": "explorer",
                "keywords": keywords,
            })

    for registry_path in sorted(repo.glob("*/question-bank/resources.v1.json")):
        data = json.loads(registry_path.read_text(encoding="utf-8"))
        if data.get("schema_version") != RESOURCE_SCHEMA:
            raise ValueError(f"unsupported Question Bank resource schema: {registry_path}")
        for resource in data.get("resources", []):
            missing = [key for key in ("title", "path", "kind", "keywords") if key not in resource]
            if missing:
                raise ValueError(f"Question Bank resource missing {missing}: {registry_path}")
            target = repo / "public" / resource["path"]
            if not target.is_file():
                raise ValueError(
                    f"Question Bank resource target missing: {registry_path}: {resource['path']}"
                )
            destinations.append({
                "title": resource["title"],
                "path": resource["path"],
                "kind": resource["kind"],
                "keywords": resource["keywords"],
            })
    return destinations


def bank_paths(repo: Path = REPO) -> list[Path]:
    return sorted(repo.glob(f"*/library/exam-bank/{BANK_NAME}"))


def package_paths(repo: Path = REPO) -> list[Path]:
    return sorted(repo.glob(PACKAGE_GLOB))


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def _slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", str(value).casefold()).strip("-") or "unknown"


def _safe_repo_svg(repo: Path, value: object) -> Path | None:
    if not isinstance(value, str) or not value.strip().lower().endswith(".svg"):
        return None
    rel = Path(value.strip())
    if rel.is_absolute() or ".." in rel.parts:
        return None
    candidates = [repo / rel, repo / "public" / rel]
    for candidate in candidates:
        try:
            resolved = candidate.resolve()
            resolved.relative_to(repo.resolve())
        except (OSError, ValueError):
            continue
        if resolved.is_file() and resolved.suffix.lower() == ".svg":
            return resolved
    return None


def _representation_asset(package: dict | None, ref: object) -> object:
    if not package or not isinstance(ref, str):
        return ref
    for rep in package.get("representations", []) or []:
        if isinstance(rep, dict) and rep.get("id") == ref:
            assets = rep.get("rendered_asset_refs") or []
            return assets[0] if assets else ref
    return ref


def _record_visual_asset(repo: Path, subject: str, source: Path, visual_assets: list[dict] | None) -> str:
    public = (repo / "public").resolve()
    resolved = source.resolve()
    try:
        return resolved.relative_to(public).as_posix()
    except ValueError:
        target_rel = Path("question-bank/visuals/canonical") / _slug(subject) / source.name
        if visual_assets is not None:
            source_rel = resolved.relative_to(repo.resolve()).as_posix()
            row = {"source": source_rel, "target": (Path("public") / target_rel).as_posix()}
            existing = next((item for item in visual_assets if item["target"] == row["target"]), None)
            if existing and existing["source"] != row["source"]:
                raise ValueError(f"Question Bank canonical visual target collision: {existing} vs {row}")
            if not existing:
                visual_assets.append(row)
        return target_rel.as_posix()


def _resolve_visual_refs(
    repo: Path, subject: str, question: dict, package: dict | None = None, visual_assets: list[dict] | None = None
) -> list[str]:
    refs: list[object] = []
    extensions = question.get("extensions") or {}
    qbank = extensions.get("grade9v3:question_bank") if isinstance(extensions, dict) else None
    if isinstance(qbank, dict):
        if qbank.get("visual_ref"):
            refs.append(qbank["visual_ref"])
        refs.extend(qbank.get("visual_refs") or [])
    if question.get("visual_ref"):
        refs.append(question["visual_ref"])
    refs.extend(question.get("figure_refs") or [])

    legacy = repo / "public" / "question-bank" / "visuals" / f"{question['id']}.svg"
    if legacy.is_file():
        refs.append(legacy.relative_to(repo / "public").as_posix())

    for scaffold in question.get("scaffolds") or []:
        if isinstance(scaffold, dict) and scaffold.get("visual_ref"):
            refs.append(scaffold["visual_ref"])

    resolved_refs: list[str] = []
    for raw in refs:
        candidate = _representation_asset(package, raw)
        source = _safe_repo_svg(repo, candidate)
        if source is None:
            continue
        public_ref = _record_visual_asset(repo, subject, source, visual_assets)
        if public_ref not in resolved_refs:
            resolved_refs.append(public_ref)
    return resolved_refs


def _sync_visual_assets(repo: Path, assets: list[dict], *, check: bool) -> bool:
    ok = True
    for row in assets:
        source = repo / row["source"]
        target = repo / row["target"]
        if not target.is_file() or target.read_bytes() != source.read_bytes():
            if check:
                print(f"question-bank canonical visual drift: {row['target']} <- {row['source']}")
                ok = False
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(source, target)
    return ok


def _project_question(
    subject: str, question: dict, order: int, repo: Path, visual_assets: list[dict] | None = None
) -> dict:
    extensions = question["extensions"]
    analysis = extensions["grade9v3:analysis"]
    custody = extensions["grade9v3:source_custody"]
    answer = question["answer"]
    visual_refs = _resolve_visual_refs(repo, subject, question, visual_assets=visual_assets)
    visual_ref = visual_refs[0] if visual_refs else None
    return {
        "id": question["id"],
        "order": order,
        "subject": subject,
        "version": question["version"],
        "status": question["status"],
        "topic": analysis["topic"],
        "question_type": analysis["learner_question_type"],
        "exam": custody["exam"],
        "year": custody["year"],
        "paper": custody["paper"],
        "question_number": custody["question_number"],
        "source_status": custody["source_status"],
        "authority_class": custody["authority_class"],
        "wording_custody": custody["wording_custody"],
        "paper_url": custody["paper_url"],
        "answer_key_url": custody.get("answer_key_url"),
        "last_checked": custody["last_checked"],
        "origin": question["origin"],
        "provenance_class": extensions["grade9v3:provenance_class"],
        "math_spans": extensions.get("grade9v3:math_spans", []),
        "stem": question["stem"],
        "subparts": question["subparts"],
        "options": question["options"],
        "conditions": question["conditions"],
        "difficulty": analysis["difficulty"],
        "expected_time_seconds": analysis["expected_time_seconds"],
        "common_wrong_route": analysis["common_wrong_route"],
        "stable_crux_move": analysis["stable_crux_move"],
        "primary_capability_ref": question["primary_capability_ref"],
        "secondary_capability_refs": question["secondary_capability_refs"],
        "family_ref": question["family_ref"],
        "source_hints": question["hints"],
        "scaffolds": question["scaffolds"],
        "figure_refs": list(question.get("figure_refs") or []),
        "answer": {
            "summary": answer["summary"],
            "reasoning": answer["reasoning"],
            "reasoning_route": answer["reasoning_route"],
            "crux_move_ref": answer["crux_move_ref"],
            "check": answer["check"],
            "verification_status": answer["verification_status"],
        },
        "visual_ref": visual_ref,
        "visual_refs": visual_refs,
    }


def _matches_policy(question: dict, policy: dict) -> bool:
    if policy.get("subjects") and question["subject"] not in policy["subjects"]:
        return False
    if policy.get("difficulty") and question["difficulty"]["band"] not in policy["difficulty"]:
        return False
    if policy.get("include_exams") and question["exam"] not in policy["include_exams"]:
        return False
    if question["exam"] in policy.get("exclude_exams", []):
        return False
    if policy.get("topics") and question["topic"] not in policy["topics"]:
        return False
    return True


def build(repo: Path = REPO, *, visual_assets: list[dict] | None = None) -> dict:
    questions = []
    bank_meta = []
    package_meta = []
    order = 0
    for path in bank_paths(repo):
        subject = path.relative_to(repo).parts[0]
        bank = load_json(path)
        bank_meta.append({
            "subject": subject,
            "manifest_id": bank["manifest_id"],
            "version": bank["version"],
            "path": path.relative_to(repo).as_posix(),
            "question_count": len(bank["questions"]),
        })
        for question in bank["questions"]:
            questions.append(_project_question(subject, question, order, repo, visual_assets))
            order += 1

    # Package-shaped canonical records use the same projection only when their package
    # or question explicitly opts into Question Bank publication. Discovery is generic;
    # no subject name or filename convention is encoded here.
    for path in package_paths(repo):
        package = load_json(path)
        package_questions = package.get("questions")
        if not isinstance(package_questions, list):
            continue
        projected_count = 0
        for question in package_questions:
            projected = project_package_question(package, question, order)
            if projected is None:
                continue
            projected["source_path"] = path.relative_to(repo).as_posix()
            projected["figure_refs"] = list(question.get("figure_refs") or [])
            visual_refs = _resolve_visual_refs(
                repo, str(package.get("subject") or ""), question, package, visual_assets
            )
            projected["visual_refs"] = visual_refs
            projected["visual_ref"] = visual_refs[0] if visual_refs else None
            questions.append(projected)
            order += 1
            projected_count += 1
        if projected_count:
            package_meta.append({
                "subject": package.get("subject"),
                "package_id": package.get("package_id"),
                "version": package.get("version"),
                "path": path.relative_to(repo).as_posix(),
                "question_count": projected_count,
            })

    by_id = {q["id"]: q for q in questions}
    if len(by_id) != len(questions):
        raise ValueError("Question Bank projection contains duplicate canonical IDs")

    views_doc = load_json(repo / VIEWS.relative_to(REPO))
    views = []
    for view in views_doc["views"]:
        refs = view["resolved_question_refs"]
        if len(refs) != len(set(refs)):
            raise ValueError(f"View {view['id']} contains duplicate question refs")
        unknown = sorted(set(refs) - set(by_id))
        if unknown:
            raise ValueError(f"View {view['id']} has unknown canonical refs: {unknown}")
        if view.get("match_mode") == "EXACT_POLICY_SET":
            matching = [q["id"] for q in questions if _matches_policy(q, view["policy"])]
            if set(matching) != set(refs):
                missing = sorted(set(matching) - set(refs))
                extra = sorted(set(refs) - set(matching))
                raise ValueError(
                    f"View {view['id']} policy/ref drift: missing={missing} extra={extra}"
                )
        views.append(view)

    def counts(key: str):
        return dict(sorted(Counter(q[key] for q in questions).items()))

    basis = {
        "banks": bank_meta,
        "view_config": VIEWS.relative_to(repo).as_posix(),
    }
    if package_meta:
        basis["packages"] = package_meta

    return {
        "schema_version": "grade9v3-question-bank-browser-v1",
        "authority": "GENERATED_BROWSER_PROJECTION",
        "basis": basis,
        "counts": {
            "questions": len(questions),
            "subjects": counts("subject"),
            "topics": counts("topic"),
            "exams": counts("exam"),
            "difficulty": dict(sorted(Counter(q["difficulty"]["band"] for q in questions).items())),
        },
        "views": views,
        "questions": questions,
        "destinations": [
            {"title": "Home", "path": "index.html", "kind": "page", "keywords": ["portal", "home"]},
            *[
                {
                    "title": subject,
                    "path": subject.lower() + "/index.html",
                    "kind": "subject",
                    "keywords": [subject.lower()],
                }
                for subject in sorted({q["subject"] for q in questions})
            ],
            *_suite_destinations(repo),
            {"title": "Question Bank", "path": "question-bank/index.html", "kind": "tool", "keywords": ["questions", "practice", "pyq"]},
            {"title": "Core Prompt Composer", "path": "core-prompt-composer/index.html", "kind": "tool", "keywords": ["prompt", "cores", "composer"]},
            {"title": "Run Builder", "path": "tools/run-builder/index.html", "kind": "tool", "keywords": ["planner", "authoring", "run"]},
            {"title": "Topic Library", "path": "tools/library/index.html", "kind": "tool", "keywords": ["library", "topics"]},
        ],
    }


def render(data: dict) -> str:
    payload = json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return "window.GRADE9_QUESTION_BANK=" + payload + ";\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    visual_assets: list[dict] = []
    intended = render(build(visual_assets=visual_assets))
    if args.check:
        ok = True
        if not OUT.is_file() or OUT.read_text(encoding="utf-8") != intended:
            print("question-bank browser projection has drifted")
            print("Regenerate with: python3 Shared/tools/build_question_bank_web.py")
            ok = False
        if not _sync_visual_assets(REPO, visual_assets, check=True):
            ok = False
        if not ok:
            return 1
        print("question-bank browser projection and canonical visuals are current")
        return 0
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(intended, encoding="utf-8")
    _sync_visual_assets(REPO, visual_assets, check=False)
    print(f"wrote {OUT.relative_to(REPO)}")
    if visual_assets:
        print(f"synchronized {len(visual_assets)} canonical Question Bank visual asset(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
