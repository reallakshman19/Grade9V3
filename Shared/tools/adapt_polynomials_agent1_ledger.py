#!/usr/bin/env python3
"""Adapt a reconciled Agent-1 Polynomials evidence ledger into the Core2 source-spine schema.

This adapter is intentionally fail-closed. It refuses the currently published partial /
contradictory 27-row corpus and only emits learner input after source custody, inventory
coverage, conflict state, and per-question figure state are independently usable.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

SOURCE_SCHEMA = "polynomials-agent1-evidence/v1"
TARGET_SCHEMA = "core2-source-spine/v1"
EXPECTED_ACQUISITION = "ACQ-1DD05CE5AA04B532EC68"
EXPECTED_SOURCE_SHA256 = "1dd05ce5aa04b532ec68c4054f55af1677ecb210be00b8f3085d6f29215a230c"
MIN_DECLARED_KEYED_ITEMS = 117

SECTION_TITLES = {
    "ASSESSMENT_CORNER": "Assessment Corner",
    "HOTS": "Higher Order Thinking Skills",
    "FREE_RESPONSE": "Free Response",
    "ARCHIVE_CORNER": "Archive Corner",
}

MCQ_TYPES = {"TRUE_FALSE", "SINGLE_CHOICE", "ASSERTION_REASON", "HOTS", "ARCHIVE_CORNER"}
SHORT_TYPES = {"FILL_IN_THE_BLANKS", "FREE_RESPONSE_VSA"}
FIGURE_STATES = {"ABSENT", "SOURCE_EMBED", "SOURCE_DERIVED_REDRAW"}


class AdmissionError(ValueError):
    pass


def _required(obj: dict[str, Any], key: str, where: str) -> Any:
    if key not in obj or obj[key] in (None, ""):
        raise AdmissionError(f"{where}.{key} is required")
    return obj[key]


def _provider_reproducible(source_access: dict[str, Any]) -> bool:
    """Require an explicit reconciled provider-readback state.

    Producer-side booleans about files/attachments are not independent proof. The
    reconciler must promote source access to a provider-reproducible state after
    actually establishing readback against the registered acquisition.
    """
    status = str(source_access.get("status", "")).upper()
    return status in {"PROVIDER_REPRODUCIBLE", "AVAILABLE_PROVIDER_REPRODUCIBLE"}


def _normalise_options(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, list):
        return [str(x) for x in value]
    if isinstance(value, dict):
        return [f"{key}. {text}" for key, text in value.items()]
    raise AdmissionError("question options must be null, list, or object")


def _response_type(row: dict[str, Any]) -> str:
    qtype = str(row.get("type", ""))
    options = _normalise_options(row.get("options"))
    if qtype in MCQ_TYPES and options:
        return "MCQ_SINGLE"
    if qtype in SHORT_TYPES:
        return "SHORT_TEXT"
    return "FREE_RESPONSE"


def _figure(row: dict[str, Any], where: str) -> tuple[dict[str, Any], str]:
    raw = row.get("figure")
    if not isinstance(raw, dict):
        raise AdmissionError(f"{where}.figure is required for explicit source-figure custody")
    state = _required(raw, "state", where + ".figure")
    if state not in FIGURE_STATES:
        raise AdmissionError(f"{where}.figure.state invalid: {state}")
    if state == "ABSENT":
        return {"state": "ABSENT"}, "NOT_PRESENT_IN_SOURCE"
    alt = _required(raw, "alt", where + ".figure")
    if state == "SOURCE_EMBED":
        src = _required(raw, "src", where + ".figure")
        return {
            "state": state,
            "alt": str(alt),
            "src": str(src),
            "caption": raw.get("caption", str(alt)),
        }, "PRESERVED"
    svg = _required(raw, "svg", where + ".figure")
    return {
        "state": state,
        "alt": str(alt),
        "svg": str(svg),
        "caption": raw.get("caption", str(alt)),
    }, "EXTERNAL_REFERENCE_VERIFIED"


def admission_failures(data: dict[str, Any]) -> list[str]:
    failures: list[str] = []
    if data.get("schema") != SOURCE_SCHEMA:
        failures.append(f"schema must be {SOURCE_SCHEMA}")

    source = data.get("source_basis") or {}
    if source.get("acquisition_id") != EXPECTED_ACQUISITION:
        failures.append("registered acquisition does not match the Polynomials specimen")
    if str(source.get("source_sha256", "")).lower() != EXPECTED_SOURCE_SHA256:
        failures.append("registered source SHA-256 does not match the Polynomials specimen")

    if data.get("status") != "EVIDENCE_VERIFIED_COMPLETE":
        failures.append("evidence status is not EVIDENCE_VERIFIED_COMPLETE")
    issue = data.get("issue") or {}
    if issue.get("disposition") != "SATISFIED":
        failures.append("Agent-1 issue disposition is not SATISFIED")

    ledger = data.get("ledger") or {}
    rows = ledger.get("rows")
    if not isinstance(rows, list):
        failures.append("ledger.rows is not a list")
        rows = []
    count = ledger.get("question_count")
    if count != len(rows):
        failures.append("ledger.question_count does not equal len(ledger.rows)")
    if len(rows) < MIN_DECLARED_KEYED_ITEMS:
        failures.append(
            f"ledger row count {len(rows)} is below declared source-key minimum {MIN_DECLARED_KEYED_ITEMS}"
        )
    if ledger.get("coverage_status") != "COMPLETE_PAGES_1_TO_11":
        failures.append("ledger coverage is not COMPLETE_PAGES_1_TO_11")

    validation = data.get("validation") or {}
    for key in (
        "source_identity_locked",
        "source_text_fidelity_validated",
        "ledger_complete",
        "answer_custody_complete",
        "independent_mathematics_complete",
    ):
        if validation.get(key) is not True:
            failures.append(f"validation.{key} is not true")

    if not _provider_reproducible(data.get("source_access") or {}):
        failures.append("registered source/OCR readback is not provider-reproducible")

    ids: set[str] = set()
    for index, row in enumerate(rows):
        where = f"ledger.rows[{index}]"
        qid = row.get("id")
        if not qid:
            failures.append(f"{where}.id is missing")
        elif qid in ids:
            failures.append(f"duplicate question id {qid}")
        else:
            ids.add(str(qid))

        for key in ("page", "book_page", "section", "type", "source_label", "stem", "mathematical_family"):
            if row.get(key) in (None, ""):
                failures.append(f"{where}.{key} is missing")

        if row.get("fidelity_status") != "VERIFIED":
            failures.append(f"{where}.fidelity_status is not VERIFIED")
        readback = str(row.get("current_executor_source_readback_status", "")).upper()
        if "NOT_PROVIDER_REPRODUCIBLE" in readback:
            failures.append(f"{where} source readback is not provider-reproducible")
        comparison = str(row.get("independent_comparison_status", "")).upper()
        if "CONFLICT" in comparison or "REVIEW" in comparison:
            failures.append(f"{where} has unresolved independent comparison status {comparison}")
        if row.get("source_answer_status") not in {"PRESENT", "MISSING"}:
            failures.append(f"{where}.source_answer_status must be PRESENT or MISSING")
        if row.get("source_answer_status") == "PRESENT" and row.get("source_answer") in (None, ""):
            failures.append(f"{where} claims a source answer but source_answer is empty")
        if not isinstance(row.get("figure"), dict):
            failures.append(f"{where}.figure is missing; source-figure absence may not be inferred")
        elif row["figure"].get("state") not in FIGURE_STATES:
            failures.append(f"{where}.figure.state is unresolved")

    return failures


def require_admitted(data: dict[str, Any]) -> None:
    failures = admission_failures(data)
    if failures:
        raise AdmissionError("Agent-1 ledger is not admissible for learner compilation:\n- " + "\n- ".join(failures))


def adapt(data: dict[str, Any], *, provider_head: str | None = None) -> dict[str, Any]:
    require_admitted(data)
    source = data["source_basis"]
    rows = data["ledger"]["rows"]

    section_order: list[str] = []
    for row in rows:
        section = str(row["section"])
        if section not in section_order:
            section_order.append(section)

    questions: list[dict[str, Any]] = []
    for index, row in enumerate(rows):
        where = f"ledger.rows[{index}]"
        options = _normalise_options(row.get("options"))
        figure, figure_custody = _figure(row, where)
        answer_status = row["source_answer_status"]
        answer_component = "PRESERVED" if answer_status == "PRESENT" else "NOT_PRESENT_IN_SOURCE"

        answer: dict[str, Any] = {}
        if answer_status == "PRESENT":
            answer["source_summary"] = str(row["source_answer"])
        else:
            if row.get("authored_answer") not in (None, ""):
                answer["authored_summary"] = str(row["authored_answer"])

        questions.append({
            "id": str(row["id"]),
            "section_id": str(row["section"]),
            "family_id": "FAM-" + str(row["mathematical_family"]).upper().replace(" ", "-").replace("&", "AND").replace("/", "-"),
            "family_label": str(row["mathematical_family"]),
            "difficulty": "HARD" if (row.get("hardness") or {}).get("overall") == "HARD" else "ROUTINE",
            "source_identity": {
                "label": f"Book {row['book_page']} · {row['type']}",
                "locator": f"m2.pdf#page={row['page']}",
                "original_identifier": f"{row['type']} {row['source_label']}",
            },
            "custody": {
                "mode": "EMBEDDED_VERBATIM",
                "comparison_status": "ORIGINAL_EXACT",
                "learner_display_authorized": True,
                "components": {
                    "stem": "PRESERVED",
                    "options": "PRESERVED" if options else "NOT_PRESENT_IN_SOURCE",
                    "subparts": "NOT_PRESENT_IN_SOURCE",
                    "conditions": "NOT_PRESENT_IN_SOURCE",
                    "figures": figure_custody,
                    "hints": "NOT_PRESENT_IN_SOURCE",
                    "answer": answer_component,
                },
            },
            "stem": str(row["stem"]),
            "options": options or None,
            "response": {
                "type": _response_type(row),
                "prompt": "Choose one answer" if _response_type(row) == "MCQ_SINGLE" else "Your attempt",
            },
            "answer": answer,
            "figure": figure,
        })

    return {
        "schema": TARGET_SCHEMA,
        "product": {
            "id": "MAT-09-POLYNOMIALS-CORE2",
            "title": "Polynomials · Source Questions",
            "subject": "Mathematics",
            "home_href": "../index.html",
            "intro": "Attempt each source question before opening its source answer. Source and authored content remain explicitly separated.",
            "source_basis": {
                "acquisition_id": source["acquisition_id"],
                "resource_ref": source["resource_ref"],
                "source_digest": source["source_sha256"],
                "rights": source["rights"],
                "provider_head": provider_head or data.get("repository_basis", {}).get("source_pr_head", "UNKNOWN"),
            },
        },
        "sections": [
            {"id": section, "title": SECTION_TITLES.get(section, section.replace("_", " ").title())}
            for section in section_order
        ],
        "questions": questions,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--agent1-ledger", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--provider-head")
    parser.add_argument("--check-only", action="store_true")
    args = parser.parse_args(argv)

    source = Path(args.agent1_ledger)
    data = json.loads(source.read_text(encoding="utf-8"))
    failures = admission_failures(data)
    if failures:
        for failure in failures:
            print(f"BLOCKED: {failure}")
        return 2
    if args.check_only:
        print(f"ADMITTED: {len(data['ledger']['rows'])} source questions")
        return 0

    adapted = adapt(data, provider_head=args.provider_head)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(adapted, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {out} ({len(adapted['questions'])} questions)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
