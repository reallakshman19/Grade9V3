#!/usr/bin/env python3
"""Validate companion GCDR diagnostic, helper and suite contracts.

Companion contracts are optional until authored, but once a matching file exists it must
validate and satisfy the semantic checks below. This keeps master-suite/question governance
separate from the explorer activity schema.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import jsonschema

REPO = Path(__file__).resolve().parents[2]
SCHEMAS = {
    ".gcdr-diagnostic.json": "gcdr_diagnostic_item.schema.json",
    ".gcdr-helper.json": "gcdr_helper_contract.schema.json",
    ".gcdr-suite.json": "gcdr_suite_contract.schema.json",
}


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def findings(repo: Path = REPO) -> list[dict]:
    out: list[dict] = []
    schema_dir = repo / "Shared" / "library"
    schemas = {suffix: load(schema_dir / name) for suffix, name in SCHEMAS.items()}

    def add(path: Path, point: str, detail: str):
        out.append({
            "file": str(path.relative_to(repo)),
            "point": point,
            "detail": detail,
        })

    for path in sorted(repo.rglob("*.json")):
        suffix = next((s for s in SCHEMAS if path.name.endswith(s)), None)
        if suffix is None:
            continue
        try:
            obj = load(path)
        except json.JSONDecodeError as exc:
            add(path, "INVALID_JSON", str(exc))
            continue

        try:
            jsonschema.validate(instance=obj, schema=schemas[suffix])
        except jsonschema.ValidationError as exc:
            location = ".".join(str(p) for p in exc.absolute_path) or "<root>"
            add(path, "SCHEMA_INVALID", f"{location}: {exc.message}")
            continue

        if suffix == ".gcdr-suite.json":
            corpus = obj["external_corpus"]
            if corpus["embedded_item_count"] > corpus["live_count"]:
                add(path, "EMBEDDED_COUNT_EXCEEDS_CORPUS",
                    "embedded_item_count cannot exceed live_count")
            if (
                corpus["coverage_claim"] == "FULL_CORPUS_AUDITED"
                and corpus["embedded_item_count"] != corpus["live_count"]
            ):
                add(path, "FALSE_FULL_CORPUS_CLAIM",
                    "FULL_CORPUS_AUDITED requires embedded_item_count == live_count")

    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--enforce", action="store_true")
    args = parser.parse_args()
    rows = findings()
    print(json.dumps({"findings": rows, "passed": not rows}, indent=2))
    return 1 if args.enforce and rows else 0


if __name__ == "__main__":
    raise SystemExit(main())
