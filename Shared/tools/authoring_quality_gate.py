#!/usr/bin/env python3
"""Authoring Quality Gate.

Validates that question records in library packages and draft pools meet
the Minimum Viable Record quality standard defined in docs/AUTHORING-CHECKLIST.md.

Usage:
    python3 Shared/tools/authoring_quality_gate.py [path/to/library.json ...]
    python3 Shared/tools/authoring_quality_gate.py --all-physics
"""

import sys
import json
import argparse
from pathlib import Path
from jsonschema import Draft202012Validator

REPO = Path(__file__).resolve().parent.parent.parent
SCHEMA_PATH = REPO / "Shared/library/package.schema.json"


def load_validator():
    schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
    return Draft202012Validator(schema)


def check_library_file(path: Path, validator) -> tuple[int, list[str]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    issues = []

    # 1. Schema Validation
    schema_errors = list(validator.iter_errors(data))
    for e in schema_errors:
        loc = "/".join(str(x) for x in e.absolute_path) or "<root>"
        issues.append(f"SCHEMA_ERROR: {loc}: {e.message}")

    # 2. Quality Rules
    questions = data.get("questions", [])
    for idx, q in enumerate(questions):
        qid = q.get("id", f"questions[{idx}]")

        # Status check
        status = q.get("status")
        if status == "DRAFT":
            issues.append(f"{qid}: status cannot be 'DRAFT' in committed library file")

        # Stem check
        stem = q.get("stem", "")
        if not stem or len(stem.strip()) < 10:
            issues.append(f"{qid}: stem is missing or too short (<10 chars)")

        # Answer checks
        ans = q.get("answer", {})
        if not ans.get("summary"):
            issues.append(f"{qid}: answer.summary is empty")
        if not ans.get("reasoning"):
            issues.append(f"{qid}: answer.reasoning is empty")
        if not ans.get("check"):
            issues.append(f"{qid}: answer.check is empty")

        # Options check
        options = q.get("options", [])
        for opt_idx, opt in enumerate(options):
            if not isinstance(opt, str):
                issues.append(f"{qid}: options[{opt_idx}] must be a string, got {type(opt).__name__}")

    return len(questions), issues


def main():
    parser = argparse.ArgumentParser(description="Validate question record authoring quality.")
    parser.add_argument("files", nargs="*", type=Path, help="Library files to check")
    parser.add_argument("--all-physics", action="store_true", help="Check all Physics library files")
    args = parser.parse_args()

    validator = load_validator()

    targets = list(args.files)
    if args.all_physics:
        targets.extend(sorted((REPO / "Physics/library").glob("*.v1.json")))

    if not targets:
        # Default to the 4 active physics practice libraries
        targets = [
            REPO / "Physics/library/phy-kin-2d-motion.v1.json",
            REPO / "Physics/library/phy-kin-1d-motion.v1.json",
            REPO / "Physics/library/phy-vec-add-sub.v1.json",
            REPO / "Physics/library/phy-nlm-first-law.v1.json",
        ]

    total_q = 0
    total_issues = 0

    print("=== Authoring Quality Gate Audit ===")
    for target in targets:
        if not target.exists():
            print(f"File not found: {target}")
            continue

        q_count, issues = check_library_file(target, validator)
        total_q += q_count
        total_issues += len(issues)

        rel = target.relative_to(REPO) if target.is_relative_to(REPO) else target
        if issues:
            print(f"❌ FAIL: {rel} ({q_count} questions, {len(issues)} issues)")
            for iss in issues[:5]:
                print(f"    - {iss}")
            if len(issues) > 5:
                print(f"    ... and {len(issues) - 5} more issues")
        else:
            print(f"✅ PASS: {rel} ({q_count} questions, 0 issues)")

    print("-" * 50)
    print(f"Summary: {len(targets)} files, {total_q} questions audited, {total_issues} issues found.")
    return 1 if total_issues > 0 else 0


if __name__ == "__main__":
    sys.exit(main())
