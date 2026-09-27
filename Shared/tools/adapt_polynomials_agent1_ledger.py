#!/usr/bin/env python3
"""Adapt a source-custodied Polynomials ledger into the Core2 source-spine schema.

Admission is intentionally based on source truth, not producer workflow state. A ledger
may originate from Agent-1 evidence or from direct readback of the registered m2.pdf,
but learner compilation is allowed only when acquisition/digest identity, complete
specimen coverage, per-row readback, answer custody, mathematical conflict state, and
figure custody are independently usable.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

SOURCE_SCHEMAS = {"polynomials-agent1-evidence/v1", "polynomials-registered-source/v1"}
SOURCE_SCHEMA = "polynomials-agent1-evidence/v1"  # backwards-compatible export
TARGET_SCHEMA = "core2-source-spine/v1"
EXPECTED_ACQUISITION = "ACQ-1DD05CE5AA04B532EC68"
EXPECTED_SOURCE_SHA256 = "1dd05ce5aa04b532ec68c4054f55af1677ecb210be00b8f3085d6f29215a230c"
EXPECTED_SOURCE_BYTES = 18424888
EXPECTED_SOURCE_PAGES = 49
DIRECT_READBACK_STATES = {
    "DIRECT_REGISTERED_SOURCE_READBACK",
    "OWNER_UPLOADED_REGISTERED_SOURCE",
    "PROVIDER_REPRODUCIBLE",
    "AVAILABLE_PROVIDER_REPRODUCIBLE",
}
ROW_READBACK_STATES = {
    "DIRECT_REGISTERED_SOURCE_VERIFIED",
    "VERIFIED_DIRECT_READBACK",
    "PROVIDER_REPRODUCIBLE",
    "AVAILABLE_PROVIDER_REPRODUCIBLE",
}

CLINIC_QUESTION_IDS = {
    "Q-MAT-09-POL-P05-NUM-04",
    "Q-MAT-09-POL-P06-HOTS-14",
    "Q-MAT-09-POL-P09-ARC-21",
}
CLINIC_HREF = "question-clinics.html"
EXPLORER_HREF = "concept-explorer.html"

SECTION_TITLES = {
    "ASSESSMENT_CORNER": "Assessment Corner",
    "HOTS": "Higher Order Thinking Skills",
    "FREE_RESPONSE": "Free Response",
    "ARCHIVE_CORNER": "Archive Corner",
}

MCQ_TYPES = {"TRUE_FALSE", "SINGLE_CHOICE", "ASSERTION_REASON", "HOTS", "ARCHIVE_CORNER"}
SHORT_TYPES = {"FILL_IN_THE_BLANKS", "FREE_RESPONSE_VSA", "NUMERICAL_TYPE"}
FIGURE_STATES = {"ABSENT", "SOURCE_EMBED", "SOURCE_DERIVED_REDRAW"}


class AdmissionError(ValueError):
    pass


def _required(obj: dict[str, Any], key: str, where: str) -> Any:
    if key not in obj or obj[key] in (None, ""):
        raise AdmissionError(f"{where}.{key} is required")
    return obj[key]


def _provider_reproducible(source_access: dict[str, Any]) -> bool:
    """Require explicit readback of bytes matching the registered acquisition.

    This is deliberately independent of which agent/issue produced the ledger.
    """
    status = str(source_access.get("status", "")).upper()
    if status not in DIRECT_READBACK_STATES:
        return False
    digest = str(
        source_access.get("computed_sha256")
        or source_access.get("source_sha256")
        or ""
    ).lower()
    return (
        digest == EXPECTED_SOURCE_SHA256
        and source_access.get("byte_length") == EXPECTED_SOURCE_BYTES
        and source_access.get("page_count") == EXPECTED_SOURCE_PAGES
    )


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
    if data.get("schema") not in SOURCE_SCHEMAS:
        failures.append("schema is not an accepted Polynomials source-ledger schema")

    source = data.get("source_basis") or {}
    if source.get("acquisition_id") != EXPECTED_ACQUISITION:
        failures.append("registered acquisition does not match the Polynomials specimen")
    if str(source.get("source_sha256", "")).lower() != EXPECTED_SOURCE_SHA256:
        failures.append("registered source SHA-256 does not match the Polynomials specimen")
    if source.get("resource_ref") != "SRC-BOOK-MATH-CH2-CH3":
        failures.append("registered resource ref does not match the Polynomials specimen")
    if source.get("rights") in (None, ""):
        failures.append("source rights/custody classification is missing")

    # Producer workflow state is intentionally NOT an admission predicate.
    # data.status / issue.disposition may be useful provenance, but direct registered-
    # source readback outranks whether another workstream is SATISFIED or COMPLETE.

    ledger = data.get("ledger") or {}
    rows = ledger.get("rows")
    if not isinstance(rows, list):
        failures.append("ledger.rows is not a list")
        rows = []
    count = ledger.get("question_count")
    if count != len(rows):
        failures.append("ledger.question_count does not equal len(ledger.rows)")
    if ledger.get("coverage_status") != "SOURCE_READBACK_COMPLETE_PAGES_1_TO_11":
        failures.append("ledger coverage is not SOURCE_READBACK_COMPLETE_PAGES_1_TO_11")
    if ledger.get("selection_scope") not in {"CURATED_SOURCE_SPINE", "FULL_CORPUS"}:
        failures.append("ledger.selection_scope must be CURATED_SOURCE_SPINE or FULL_CORPUS")

    coverage = ledger.get("coverage_receipt")
    if not isinstance(coverage, dict):
        failures.append("ledger.coverage_receipt is required")
    else:
        question_pages = coverage.get("question_pages")
        answer_pages = coverage.get("answer_pages")
        if question_pages != list(range(1, 10)):
            failures.append("coverage_receipt.question_pages must be PDF pages 1..9")
        if answer_pages != [10, 11]:
            failures.append("coverage_receipt.answer_pages must be PDF pages 10..11")
        if coverage.get("row_count") != len(rows):
            failures.append("coverage_receipt.row_count does not equal len(ledger.rows)")

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
        failures.append("registered source readback is not independently reproducible")

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

        readback = str(
            row.get("source_readback_status")
            or row.get("current_executor_source_readback_status")
            or ""
        ).upper()
        if readback not in ROW_READBACK_STATES:
            failures.append(f"{where} does not have verified direct registered-source readback")

        comparison = str(row.get("independent_comparison_status", "")).upper()
        if comparison not in {"MATCH", "SOURCE_KEY_CONFLICT_RECONCILED"}:
            failures.append(f"{where}.independent_comparison_status is unresolved: {comparison or 'MISSING'}")
        if comparison == "SOURCE_KEY_CONFLICT_RECONCILED" and row.get("authored_answer") in (None, ""):
            failures.append(f"{where} reconciles a source-key conflict but has no authored_answer")

        if row.get("source_answer_status") not in {"PRESENT", "MISSING"}:
            failures.append(f"{where}.source_answer_status must be PRESENT or MISSING")
        if row.get("source_answer_status") == "PRESENT" and row.get("source_answer") in (None, ""):
            failures.append(f"{where} claims a source answer but source_answer is empty")
        if row.get("source_answer_status") == "MISSING" and row.get("authored_answer") in (None, ""):
            failures.append(f"{where} has no source answer and no independently authored closure answer")

        if not isinstance(row.get("figure"), dict):
            failures.append(f"{where}.figure is missing; source-figure absence may not be inferred")
        elif row["figure"].get("state") not in FIGURE_STATES:
            failures.append(f"{where}.figure.state is unresolved")

    return failures


def require_admitted(data: dict[str, Any]) -> None:
    failures = admission_failures(data)
    if failures:
        raise AdmissionError("Polynomials source ledger is not admissible for learner compilation:\n- " + "\n- ".join(failures))


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
        if row.get("authored_answer") not in (None, ""):
            answer["authored_summary"] = str(row["authored_answer"])
            answer["authored_answer_label"] = str(row.get("authored_answer_label", "AUTHORED MATHEMATICAL CHECK"))

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
                    "subparts": "PRESERVED" if row.get("subparts") else "NOT_PRESENT_IN_SOURCE",
                    "conditions": "PRESERVED" if row.get("conditions") else "NOT_PRESENT_IN_SOURCE",
                    "figures": figure_custody,
                    "hints": "NOT_PRESENT_IN_SOURCE",
                    "answer": answer_component,
                },
            },
            "stem": str(row["stem"]),
            "options": options or None,
            "subparts": [str(x) for x in (row.get("subparts") or [])],
            "conditions": [str(x) for x in (row.get("conditions") or [])],
            "response": {
                "type": _response_type(row),
                "prompt": "Choose one answer" if _response_type(row) == "MCQ_SINGLE" else "Your attempt",
            },
            "answer": answer,
            "figure": figure,
            "enrichment": (
                {"clinic_href": f"{CLINIC_HREF}#{row['id']}"}
                if str(row["id"]) in CLINIC_QUESTION_IDS else {}
            ),
        })

    return {
        "schema": TARGET_SCHEMA,
        "product": {
            "id": "MAT-09-POLYNOMIALS-CORE2",
            "title": "Polynomials · Source Questions",
            "subject": "Mathematics",
            "home_href": "../index.html",
            "intro": "Attempt each source question before opening its source answer. Source and authored content remain explicitly separated.",
            "explorer_href": EXPLORER_HREF,
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
    source_group = parser.add_mutually_exclusive_group(required=True)
    source_group.add_argument("--source-ledger")
    source_group.add_argument("--agent1-ledger", help="legacy alias for --source-ledger")
    parser.add_argument("--out", required=True)
    parser.add_argument("--provider-head")
    parser.add_argument("--check-only", action="store_true")
    args = parser.parse_args(argv)

    source = Path(args.source_ledger or args.agent1_ledger)
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
