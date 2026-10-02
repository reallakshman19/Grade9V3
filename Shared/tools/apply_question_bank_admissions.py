#!/usr/bin/env python3
"""Apply explicit Question Bank admission decisions to canonical package questions.

Admission manifests are lifecycle/publication evidence. They contain IDs and review metadata,
never duplicate stems, answers or solutions. The canonical package remains academic truth.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Mapping

REPO = Path(__file__).resolve().parents[2]
ADMISSION_SCHEMA = "grade9v3-question-bank-admission-v1"
MANIFEST_GLOB = "*/question-bank/admissions.v1.json"


class AdmissionError(ValueError):
    pass


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def canonical_text(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2) + "\n"


def _answer_grounded(question: Mapping[str, object]) -> bool:
    extensions = question.get("extensions") or {}
    if not isinstance(extensions, Mapping):
        return False
    citations = extensions.get("grade9v3:citations") or {}
    if not isinstance(citations, Mapping):
        return False
    answer = citations.get("answer")
    return isinstance(answer, list) and bool(answer) and all(isinstance(ref, str) and ref for ref in answer)


def _question_bank_config(manifest: Mapping[str, object], entry: Mapping[str, object], question: Mapping[str, object]) -> dict:
    difficulty = question.get("difficulty")
    question_type = question.get("learner_question_type")
    if not isinstance(difficulty, Mapping) or not difficulty.get("band"):
        raise AdmissionError(f"{question.get('id')}: canonical difficulty metadata missing")
    if not isinstance(question_type, str) or not question_type:
        raise AdmissionError(f"{question.get('id')}: canonical learner_question_type missing")
    expected_time = entry.get("expected_time_seconds", manifest.get("expected_time_seconds"))
    if not isinstance(expected_time, int) or expected_time <= 0:
        raise AdmissionError(f"{question.get('id')}: positive expected_time_seconds required")

    config = {
        "include": True,
        "difficulty": dict(difficulty),
        "question_type": question_type,
        "expected_time_seconds": expected_time,
        "topic_ref": manifest.get("topic_ref"),
        "topic_label": manifest.get("topic_label"),
        "exam": entry.get("exam", ""),
        "paper": entry.get("paper", ""),
        "question_number": entry.get("question_number", ""),
        "source_status": "SOURCE_BACKED_ORIGINAL",
        "authority_class": "OFFICIAL_SOURCE_WITH_KEY",
        "wording_custody": "SOURCE_EVIDENCE_CARDED",
        "last_checked": manifest.get("last_checked"),
    }
    return {key: value for key, value in config.items() if value not in (None, "")}


def apply_manifest(repo: Path, manifest_path: Path) -> tuple[Path, dict, int]:
    manifest = load_json(manifest_path)
    if manifest.get("schema_version") != ADMISSION_SCHEMA:
        raise AdmissionError(f"unsupported admission schema: {manifest_path}")

    package_rel = manifest.get("package_path")
    package_id = manifest.get("package_id")
    if not isinstance(package_rel, str) or not package_rel:
        raise AdmissionError(f"package_path missing: {manifest_path}")
    package_path = repo / package_rel
    if not package_path.is_file():
        raise AdmissionError(f"canonical package missing: {package_rel}")

    package = load_json(package_path)
    if package.get("package_id") != package_id:
        raise AdmissionError(
            f"package identity mismatch: manifest={package_id!r} canonical={package.get('package_id')!r}"
        )
    if package.get("subject") != manifest.get("subject"):
        raise AdmissionError(
            f"subject mismatch: manifest={manifest.get('subject')!r} canonical={package.get('subject')!r}"
        )

    questions = package.get("questions")
    if not isinstance(questions, list):
        raise AdmissionError(f"canonical package has no question list: {package_rel}")
    by_id = {str(row.get("id")): row for row in questions if isinstance(row, dict) and row.get("id")}
    if len(by_id) != len([row for row in questions if isinstance(row, dict) and row.get("id")]):
        raise AdmissionError(f"canonical package contains duplicate question ids: {package_rel}")

    entries = manifest.get("questions")
    if not isinstance(entries, list) or not entries:
        raise AdmissionError(f"admission manifest has no questions: {manifest_path}")
    ids = [str(row.get("id") or "") for row in entries if isinstance(row, Mapping)]
    if len(ids) != len(entries) or any(not qid for qid in ids) or len(ids) != len(set(ids)):
        raise AdmissionError(f"admission question ids must be present and unique: {manifest_path}")

    changes = 0
    for entry in entries:
        qid = str(entry["id"])
        question = by_id.get(qid)
        if question is None:
            raise AdmissionError(f"admission names unknown canonical question: {qid}")
        if question.get("origin") != "ORIGINAL":
            raise AdmissionError(f"{qid}: only source-original questions may be admitted by this manifest")
        if not question.get("source_refs") or not question.get("evidence_refs"):
            raise AdmissionError(f"{qid}: source/evidence refs required for admission")
        if not _answer_grounded(question):
            raise AdmissionError(f"{qid}: answer must be grounded by canonical evidence refs, not authored-only")
        if not str(entry.get("independent_check") or "").startswith("PASS:"):
            raise AdmissionError(f"{qid}: explicit PASS independent_check required")

        answer = question.get("answer")
        if not isinstance(answer, dict):
            raise AdmissionError(f"{qid}: canonical answer object missing")
        extensions = question.setdefault("extensions", {})
        if not isinstance(extensions, dict):
            raise AdmissionError(f"{qid}: canonical extensions must be an object")

        intended_config = _question_bank_config(manifest, entry, question)
        if extensions.get("grade9v3:question_bank") != intended_config:
            extensions["grade9v3:question_bank"] = intended_config
            changes += 1
        if answer.get("verification_status") != "INDEPENDENTLY_CHECKED":
            answer["verification_status"] = "INDEPENDENTLY_CHECKED"
            changes += 1

    declared = set(ids)
    unexpected = sorted(
        str(q.get("id")) for q in questions
        if isinstance(q, Mapping)
        and ((q.get("extensions") or {}).get("grade9v3:question_bank") or {}).get("include") is True
        and str(q.get("id")) not in declared
    )
    if unexpected:
        raise AdmissionError(
            f"package has Question Bank admissions outside the declared manifest; reconcile explicitly: {unexpected}"
        )

    return package_path, package, changes


def process(repo: Path, *, write: bool, check: bool) -> int:
    manifests = sorted(repo.glob(MANIFEST_GLOB))
    if not manifests:
        raise AdmissionError(f"no admission manifests matched {MANIFEST_GLOB}")

    drift = []
    total = 0
    for manifest_path in manifests:
        package_path, intended, changes = apply_manifest(repo, manifest_path)
        current = package_path.read_text(encoding="utf-8")
        rendered = canonical_text(intended)
        total += len(load_json(manifest_path)["questions"])
        if current != rendered:
            drift.append(package_path.relative_to(repo).as_posix())
            if write:
                package_path.write_text(rendered, encoding="utf-8")

    if check and drift:
        print("Question Bank admissions are not materialized in canonical packages:")
        for path in drift:
            print(f"- {path}")
        print("Run: python3 Shared/tools/apply_question_bank_admissions.py --write")
        return 1

    action = "materialized" if write else "current"
    print(f"Question Bank admissions {action}: {total} explicit canonical question(s)")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--write", action="store_true", help="materialize admission metadata into canonical packages")
    mode.add_argument("--check", action="store_true", help="fail if canonical packages do not match admission manifests")
    args = parser.parse_args()
    try:
        return process(REPO, write=args.write, check=args.check)
    except (AdmissionError, OSError, json.JSONDecodeError) as exc:
        print(f"QUESTION_BANK_ADMISSION: FAIL: {exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
