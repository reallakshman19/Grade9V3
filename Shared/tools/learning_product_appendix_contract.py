#!/usr/bin/env python3
"""Validate optional learner-product appendix and publication-audit contracts.

This module checks only subject-neutral structural requirements. It does not certify
academic correctness, source fidelity, or publication readiness by itself.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[2]
ROLE_DIR = REPO / "Shared" / "roles"

TOOLKIT_BLOCK = re.compile(
    r"^\`\`\`ready-reference-toolkit\s*$\n(.*?)^\`\`\`\s*$",
    re.MULTILINE | re.DOTALL,
)
AUDIT_BLOCK = re.compile(
    r"^\`\`\`publication-audit\s*$\n(.*?)^\`\`\`\s*$",
    re.MULTILINE | re.DOTALL,
)


class AppendixContractError(ValueError):
    """Raised when appendix or audit contract data is malformed."""


def _parse_block(text: str, pattern: re.Pattern[str], label: str) -> dict[str, Any]:
    match = pattern.search(text)
    if not match:
        raise AppendixContractError(f"{label}_BLOCK_MISSING")
    try:
        payload = json.loads(match.group(1))
    except json.JSONDecodeError as exc:
        raise AppendixContractError(f"{label}_JSON_INVALID: {exc}") from exc
    if not isinstance(payload, dict):
        raise AppendixContractError(f"{label}_ROOT_NOT_OBJECT")
    return payload


def discover_contract_document(role_dir: Path = ROLE_DIR) -> Path:
    matches: list[Path] = []
    for path in sorted(role_dir.glob("*.md")):
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue
        if TOOLKIT_BLOCK.search(text) and AUDIT_BLOCK.search(text):
            matches.append(path)
    if len(matches) != 1:
        raise AppendixContractError(
            f"APPENDIX_CONTRACT_DISCOVERY_FAILED: expected 1 document, found {len(matches)}"
        )
    return matches[0]


def load_contracts(path: Path | None = None) -> dict[str, dict[str, Any]]:
    path = path or discover_contract_document()
    text = path.read_text(encoding="utf-8")
    return {
        "toolkit": _parse_block(text, TOOLKIT_BLOCK, "TOOLKIT"),
        "audit": _parse_block(text, AUDIT_BLOCK, "AUDIT"),
    }


def _nonempty_text(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def _nonempty_text_list(value: Any) -> bool:
    return (
        isinstance(value, list)
        and bool(value)
        and all(_nonempty_text(item) for item in value)
    )


def validate_toolkit_card(
    card: dict[str, Any], contract: dict[str, Any] | None = None
) -> list[str]:
    if contract is None:
        contract = load_contracts()["toolkit"]
    spec = contract.get("card_contract") or {}
    findings: list[str] = []

    if not isinstance(card, dict):
        return ["TOOLKIT_CARD_NOT_OBJECT"]

    for field in spec.get("required_fields") or []:
        if field not in card:
            findings.append(f"TOOLKIT_REQUIRED_FIELD_MISSING:{field}")

    for field in spec.get("nonempty_array_fields") or []:
        if field in card and not _nonempty_text_list(card.get(field)):
            findings.append(f"TOOLKIT_ARRAY_INVALID:{field}")

    for field in (
        "hack_id",
        "title",
        "recognition_trigger",
        "invariant",
        "derivation_anchor",
        "shortcut",
        "trap",
        "verification_check",
    ):
        if field in card and not _nonempty_text(card.get(field)):
            findings.append(f"TOOLKIT_TEXT_INVALID:{field}")

    drill = card.get("lightning_drill")
    if not isinstance(drill, dict):
        if "lightning_drill" in card:
            findings.append("TOOLKIT_DRILL_INVALID")
    else:
        for field in spec.get("lightning_drill_required_fields") or []:
            if not _nonempty_text(drill.get(field)):
                findings.append(f"TOOLKIT_DRILL_FIELD_INVALID:{field}")

    scope_values = set(spec.get("scope_status_values") or [])
    if card.get("scope_status") not in scope_values:
        findings.append("TOOLKIT_SCOPE_STATUS_INVALID")

    provenance_values = set(spec.get("provenance_values") or [])
    if card.get("provenance") not in provenance_values:
        findings.append("TOOLKIT_PROVENANCE_INVALID")

    return findings


def _claim_map(report: dict[str, Any]) -> dict[str, dict[str, Any]]:
    claims = report.get("claims")
    if not isinstance(claims, list):
        return {}
    mapped: dict[str, dict[str, Any]] = {}
    for row in claims:
        if not isinstance(row, dict) or not _nonempty_text(row.get("claim")):
            continue
        mapped[row["claim"]] = row
    return mapped


def _gate_map(report: dict[str, Any]) -> dict[str, dict[str, Any]]:
    gates = report.get("gates")
    if not isinstance(gates, list):
        return {}
    mapped: dict[str, dict[str, Any]] = {}
    for row in gates:
        if not isinstance(row, dict) or not _nonempty_text(row.get("gate")):
            continue
        mapped[row["gate"]] = row
    return mapped


def validate_audit_report(
    report: dict[str, Any], contract: dict[str, Any] | None = None
) -> list[str]:
    if contract is None:
        contract = load_contracts()["audit"]
    findings: list[str] = []

    if not isinstance(report, dict):
        return ["AUDIT_REPORT_NOT_OBJECT"]

    allowed_states = set(contract.get("gate_states") or [])
    expected_claims = list(contract.get("claims") or [])
    expected_gates = list(contract.get("required_gates") or [])

    claims = report.get("claims")
    if not isinstance(claims, list):
        findings.append("AUDIT_CLAIMS_INVALID")
        claims = []
    claim_rows = _claim_map(report)
    if len(claim_rows) != len(claims):
        findings.append("AUDIT_CLAIM_ID_DUPLICATE_OR_INVALID")

    for claim in expected_claims:
        row = claim_rows.get(claim)
        if row is None:
            findings.append(f"AUDIT_CLAIM_MISSING:{claim}")
            continue
        state = row.get("state")
        if state not in allowed_states:
            findings.append(f"AUDIT_CLAIM_STATE_INVALID:{claim}")
        if state == "PASS" and not _nonempty_text_list(row.get("evidence_refs")):
            findings.append(f"AUDIT_CLAIM_PASS_WITHOUT_EVIDENCE:{claim}")
        if state == "NOT_APPLICABLE" and not _nonempty_text(row.get("rationale")):
            findings.append(f"AUDIT_CLAIM_NA_WITHOUT_RATIONALE:{claim}")

    gates = report.get("gates")
    if not isinstance(gates, list):
        findings.append("AUDIT_GATES_INVALID")
        gates = []
    gate_rows = _gate_map(report)
    if len(gate_rows) != len(gates):
        findings.append("AUDIT_GATE_ID_DUPLICATE_OR_INVALID")

    for gate in expected_gates:
        row = gate_rows.get(gate)
        if row is None:
            findings.append(f"AUDIT_GATE_MISSING:{gate}")
            continue
        state = row.get("state")
        if state not in allowed_states:
            findings.append(f"AUDIT_GATE_STATE_INVALID:{gate}")
        if state == "PASS" and not _nonempty_text_list(row.get("evidence_refs")):
            findings.append(f"AUDIT_GATE_PASS_WITHOUT_EVIDENCE:{gate}")
        if state == "NOT_APPLICABLE" and not _nonempty_text(row.get("rationale")):
            findings.append(f"AUDIT_GATE_NA_WITHOUT_RATIONALE:{gate}")

    visual = gate_rows.get("VISUAL_SEMANTIC_BINDING")
    if visual and visual.get("state") == "PASS":
        details = visual.get("details")
        required_fields = (
            (contract.get("visual_semantic_binding") or {})
            .get("required_evidence_fields")
            or []
        )
        if not isinstance(details, dict):
            findings.append("AUDIT_VISUAL_DETAILS_MISSING")
        else:
            for field in required_fields:
                if field not in details:
                    findings.append(f"AUDIT_VISUAL_FIELD_MISSING:{field}")
            required = details.get("required_elements")
            present = details.get("present_elements")
            if not _nonempty_text_list(required):
                findings.append("AUDIT_VISUAL_REQUIRED_ELEMENTS_INVALID")
            if not _nonempty_text_list(present):
                findings.append("AUDIT_VISUAL_PRESENT_ELEMENTS_INVALID")
            if _nonempty_text_list(required) and _nonempty_text_list(present):
                missing = sorted(set(required) - set(present))
                if missing:
                    findings.append(
                        "AUDIT_VISUAL_REQUIRED_ELEMENT_ABSENT:" + ",".join(missing)
                    )
            if not _nonempty_text(details.get("canonical_representation_ref")):
                findings.append("AUDIT_VISUAL_CANONICAL_REF_INVALID")
            if not _nonempty_text(details.get("provenance")):
                findings.append("AUDIT_VISUAL_PROVENANCE_INVALID")
            must_equal = (contract.get("visual_semantic_binding") or {}).get(
                "semantic_review_must_equal"
            )
            if details.get("semantic_review") is not must_equal:
                findings.append("AUDIT_VISUAL_SEMANTIC_REVIEW_NOT_PASSED")

    publication = claim_rows.get("PUBLICATION_READY")
    if publication and publication.get("state") == "PASS":
        for required_claim in contract.get("publication_ready_requires") or []:
            row = claim_rows.get(required_claim) or {}
            if row.get("state") != "PASS":
                findings.append(
                    f"AUDIT_PUBLICATION_READY_UPSTREAM_NOT_PASS:{required_claim}"
                )
        source = claim_rows.get("SOURCE_VERIFIED") or {}
        if source.get("state") not in set(
            contract.get("publication_ready_source_states") or []
        ):
            findings.append("AUDIT_PUBLICATION_READY_SOURCE_NOT_RESOLVED")
        for gate in expected_gates:
            state = (gate_rows.get(gate) or {}).get("state")
            if state not in {"PASS", "NOT_APPLICABLE"}:
                findings.append(
                    f"AUDIT_PUBLICATION_READY_GATE_UNRESOLVED:{gate}"
                )

    joined = " ".join(
        str(report.get(field, ""))
        for field in ("title", "summary", "overall_claim")
    ).upper()
    for forbidden in contract.get("forbidden_overclaims") or []:
        if forbidden in joined:
            findings.append(f"AUDIT_FORBIDDEN_OVERCLAIM:{forbidden}")

    return findings


def audit_contracts(path: Path | None = None) -> dict[str, Any]:
    findings: list[str] = []
    try:
        contracts = load_contracts(path)
    except (OSError, AppendixContractError) as exc:
        return {"passed": False, "findings": [str(exc)]}

    toolkit = contracts["toolkit"]
    audit = contracts["audit"]

    required_card_fields = set(
        (toolkit.get("card_contract") or {}).get("required_fields") or []
    )
    for field in (
        "canonical_refs",
        "derivation_anchor",
        "valid_when",
        "fails_when",
        "provenance",
    ):
        if field not in required_card_fields:
            findings.append(f"TOOLKIT_CONTRACT_FIELD_NOT_REQUIRED:{field}")

    claims = set(audit.get("claims") or [])
    for claim in (
        "STRUCTURALLY_VALIDATED",
        "SOURCE_VERIFIED",
        "ACADEMICALLY_REVIEWED",
        "PUBLICATION_READY",
    ):
        if claim not in claims:
            findings.append(f"AUDIT_CONTRACT_CLAIM_MISSING:{claim}")

    gates = set(audit.get("required_gates") or [])
    for gate in (
        "FIELD_LEVEL_PROVENANCE",
        "VISUAL_SEMANTIC_BINDING",
        "GENERATED_ARTIFACT_FRESHNESS",
    ):
        if gate not in gates:
            findings.append(f"AUDIT_CONTRACT_GATE_MISSING:{gate}")

    return {
        "passed": not findings,
        "toolkit_version": toolkit.get("version"),
        "audit_version": audit.get("version"),
        "findings": findings,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--enforce", action="store_true")
    args = parser.parse_args()
    report = audit_contracts()
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 1 if args.enforce and not report["passed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
