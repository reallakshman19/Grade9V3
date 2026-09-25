#!/usr/bin/env python3
"""Validate the six-Core authority and dependency contract.

This validator checks cross-Core authority ownership only. It does not certify academic
correctness, source authenticity, learner mastery, or publication readiness.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[2]
ROLE_DIR = REPO / "Shared" / "roles"
ROLE_ORDER = ("CORE1", "CORE2", "CORE1A", "CORE1B", "CORE2A", "CORE2B")
BLOCK = re.compile(r"^```core-authority\s*$\n(.*?)^```\s*$", re.MULTILINE | re.DOTALL)

REQUIRED_INVARIANTS = (
    "execution_order_is_not_authority_order",
    "core2_hold_does_not_rewrite_academic_authority",
    "core2_hold_does_not_automatically_block_valid_study_roles",
    "preserve_question_primary_capability_ref",
    "set_scope_must_not_overwrite_question_primary",
    "demand_evidence_and_learner_eligibility_are_distinct",
    "source_hints_and_authored_scaffolds_are_distinct",
    "extensions_require_canonical_admission_before_core1_family",
    "learner_estimate_is_not_mastery_evidence",
    "learner_estimate_cannot_change_core1_family_intrinsic_scope",
    "prompt_and_planning_outputs_are_not_academic_authority",
    "unresolved_authority_dependency_must_hold",
    "every_fixed_demand_requires_bridge_disposition",
    "fixed_demand_cannot_disappear_on_scope_mismatch",
    "bridge_does_not_create_core_role",
    "bridge_does_not_admit_extension_to_core1_family",
    "core2a_requires_established_capability_closure",
    "core2b_requires_established_capability_closure_and_prior_exposure",
    "fixed_demand_progression_must_remain_visible",
    "generic_practice_does_not_close_fixed_demand",
)

EXPECTED_ROLE_RULES = {
    "CORE1": {
        "required": {"CANONICAL_ACADEMIC_TRUTH"},
        "forbidden": {"AUTHORIZED_SOURCE_CUSTODY", "LEARNER_SUPPORT_INPUT"},
    },
    "CORE1A": {
        "required": {"CANONICAL_ACADEMIC_TRUTH"},
        "forbidden": {"AUTHORIZED_SOURCE_CUSTODY", "LEARNER_SUPPORT_INPUT"},
    },
    "CORE1B": {
        "required": {"CANONICAL_ACADEMIC_TRUTH"},
        "forbidden": {"AUTHORIZED_SOURCE_CUSTODY", "LEARNER_SUPPORT_INPUT"},
    },
    "CORE2": {
        "required": {"AUTHORIZED_SOURCE_CUSTODY"},
        "forbidden": {"AUTHORED_PRACTICE", "CANONICAL_ACADEMIC_TRUTH"},
    },
    "CORE2A": {
        "required": {"CANONICAL_ACADEMIC_TRUTH"},
        "one_of": {"ELIGIBLE_REVIEWED_DEMAND", "AUTHORED_PRACTICE"},
        "optional": {"LEARNER_SUPPORT_INPUT"},
        "forbidden": {"LEARNER_SUPPORT_INPUT"},
    },
    "CORE2B": {
        "required": {"CANONICAL_ACADEMIC_TRUTH", "PRIOR_EXPOSURE"},
        "one_of": {"ELIGIBLE_REVIEWED_DEMAND", "AUTHORED_PRACTICE"},
        "optional": {"LEARNER_SUPPORT_INPUT"},
        "forbidden": {"LEARNER_SUPPORT_INPUT"},
    },
}


class CoreAuthorityContractError(ValueError):
    """Raised when the authority contract cannot be loaded."""


def discover_contract(role_dir: Path = ROLE_DIR) -> Path:
    matches: list[Path] = []
    for path in sorted(role_dir.glob("*.md")):
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue
        if BLOCK.search(text):
            matches.append(path)
    if len(matches) != 1:
        raise CoreAuthorityContractError(
            f"CORE_AUTHORITY_DISCOVERY_FAILED: expected 1 fenced contract, found {len(matches)}"
        )
    return matches[0]


def load_contract(path: Path | None = None) -> dict[str, Any]:
    path = path or discover_contract()
    text = path.read_text(encoding="utf-8")
    match = BLOCK.search(text)
    if not match:
        raise CoreAuthorityContractError("CORE_AUTHORITY_BLOCK_MISSING")
    try:
        contract = json.loads(match.group(1))
    except json.JSONDecodeError as exc:
        raise CoreAuthorityContractError(f"CORE_AUTHORITY_JSON_INVALID: {exc}") from exc
    if not isinstance(contract, dict):
        raise CoreAuthorityContractError("CORE_AUTHORITY_ROOT_NOT_OBJECT")
    return contract


def _texts(value: Any) -> set[str]:
    if not isinstance(value, list):
        return set()
    return {item for item in value if isinstance(item, str) and item.strip()}


def audit(path: Path | None = None) -> dict[str, Any]:
    findings: list[str] = []
    try:
        contract = load_contract(path)
    except (OSError, CoreAuthorityContractError) as exc:
        return {"passed": False, "roles_checked": 0, "findings": [str(exc)]}

    authorities = contract.get("authority_classes")
    roles = contract.get("roles")
    invariants = contract.get("invariants")
    if not isinstance(authorities, dict) or not authorities:
        findings.append("CORE_AUTHORITY_CLASSES_MISSING")
        authorities = {}
    if not isinstance(roles, dict):
        findings.append("CORE_AUTHORITY_ROLES_MISSING")
        roles = {}
    if not isinstance(invariants, dict):
        findings.append("CORE_AUTHORITY_INVARIANTS_MISSING")
        invariants = {}

    authority_names = set(authorities)
    for role_name in ROLE_ORDER:
        row = roles.get(role_name)
        if not isinstance(row, dict):
            findings.append(f"CORE_AUTHORITY_ROLE_MISSING:{role_name}")
            continue
        referenced = set()
        for field in (
            "required_authority",
            "one_of_authority",
            "optional_authority",
            "forbidden_authority_substitution",
        ):
            values = row.get(field, [])
            if not isinstance(values, list) or not all(
                isinstance(item, str) and item.strip() for item in values
            ):
                findings.append(f"CORE_AUTHORITY_ROLE_FIELD_INVALID:{role_name}:{field}")
            referenced |= _texts(values)
        for unknown in sorted(referenced - authority_names):
            findings.append(f"CORE_AUTHORITY_UNKNOWN_CLASS:{role_name}:{unknown}")

        expected = EXPECTED_ROLE_RULES[role_name]
        if _texts(row.get("required_authority")) != expected["required"]:
            findings.append(f"CORE_AUTHORITY_REQUIRED_DRIFT:{role_name}")
        if _texts(row.get("forbidden_authority_substitution")) != expected["forbidden"]:
            findings.append(f"CORE_AUTHORITY_FORBIDDEN_DRIFT:{role_name}")
        if "one_of" in expected and _texts(row.get("one_of_authority")) != expected["one_of"]:
            findings.append(f"CORE_AUTHORITY_ONE_OF_DRIFT:{role_name}")
        if "optional" in expected and _texts(row.get("optional_authority")) != expected["optional"]:
            findings.append(f"CORE_AUTHORITY_OPTIONAL_DRIFT:{role_name}")

    for name in REQUIRED_INVARIANTS:
        if invariants.get(name) is not True:
            findings.append(f"CORE_AUTHORITY_INVARIANT_NOT_TRUE:{name}")

    fields = contract.get("canonical_field_rules") or {}
    if fields.get("question_primary") != "question.primary_capability_ref":
        findings.append("CORE_AUTHORITY_CANONICAL_PRIMARY_FIELD_DRIFT")
    if fields.get("source_hints") != "question.hints[]":
        findings.append("CORE_AUTHORITY_SOURCE_HINT_FIELD_DRIFT")
    if fields.get("authored_scaffolds") != "question.scaffolds[]":
        findings.append("CORE_AUTHORITY_SCAFFOLD_FIELD_DRIFT")
    if fields.get("core1_family_crux") != "microtopic.inferential_jump":
        findings.append("CORE_AUTHORITY_CORE1_CRUX_FIELD_DRIFT")

    distinctions = contract.get("planning_distinctions") or {}
    if distinctions.get("execution_order") != "PRODUCTION_CONTROL_ONLY":
        findings.append("CORE_AUTHORITY_EXECUTION_ORDER_SEMANTICS_DRIFT")
    if distinctions.get("set_level_scope") != "COMPOSITION_CONTEXT_ONLY":
        findings.append("CORE_AUTHORITY_SET_SCOPE_SEMANTICS_DRIFT")
    if distinctions.get("demand_evidence") != "MAY_EXIST_WITHOUT_LEARNER_ELIGIBILITY":
        findings.append("CORE_AUTHORITY_DEMAND_EVIDENCE_SEMANTICS_DRIFT")
    if distinctions.get("learner_eligibility") != "INDEPENDENT_REVIEW_STATE":
        findings.append("CORE_AUTHORITY_LEARNER_ELIGIBILITY_SEMANTICS_DRIFT")

    bridge = contract.get("demand_bridge")
    if not isinstance(bridge, dict):
        findings.append("CORE_AUTHORITY_DEMAND_BRIDGE_MISSING")
        bridge = {}
    if bridge.get("is_core_role") is not False:
        findings.append("CORE_AUTHORITY_DEMAND_BRIDGE_BECAME_CORE")
    if bridge.get("required_for_every_fixed_demand") is not True:
        findings.append("CORE_AUTHORITY_DEMAND_BRIDGE_NOT_REQUIRED")

    dispositions = bridge.get("dispositions")
    if not isinstance(dispositions, dict):
        findings.append("CORE_AUTHORITY_DEMAND_BRIDGE_DISPOSITIONS_MISSING")
        dispositions = {}
    expected_dispositions = {
        "WITHIN_CANONICAL_SCOPE": "ESTABLISHED",
        "CANONICAL_PREREQUISITE_ROUTE": "ROUTED",
        "EXTENSION_ADMISSION_CANDIDATE": "NOT_YET_ADMITTED",
        "UNRESOLVED_CAPABILITY_GAP": "UNRESOLVED",
        "IDENTITY_HOLD": "UNRESOLVED",
    }
    for name, closure in expected_dispositions.items():
        row = dispositions.get(name)
        if not isinstance(row, dict):
            findings.append(f"CORE_AUTHORITY_DEMAND_BRIDGE_DISPOSITION_MISSING:{name}")
            continue
        if row.get("capability_closure") != closure:
            findings.append(f"CORE_AUTHORITY_DEMAND_BRIDGE_CLOSURE_DRIFT:{name}")
        if name in {"EXTENSION_ADMISSION_CANDIDATE", "UNRESOLVED_CAPABILITY_GAP", "IDENTITY_HOLD"}:
            if row.get("downstream_application_state") != "HOLD":
                findings.append(f"CORE_AUTHORITY_DEMAND_BRIDGE_HOLD_DRIFT:{name}")

    required_bridge_fields = {
        "demand_ref",
        "canonical_primary_capability_ref",
        "canonical_capability_refs",
        "canonical_prerequisite_refs",
        "unresolved_prerequisite_demands",
        "disposition",
        "prerequisite_route",
        "extension_admission_candidate",
        "source_custody_state",
        "learner_eligibility_state",
        "core2a_eligibility",
        "core2b_eligibility",
        "hold_close_when",
    }
    if _texts(bridge.get("required_record_fields")) != required_bridge_fields:
        findings.append("CORE_AUTHORITY_DEMAND_BRIDGE_REQUIRED_FIELDS_DRIFT")
    allowed_closure = {"ESTABLISHED", "ROUTED"}
    if _texts(bridge.get("core2a_allowed_capability_closure")) != allowed_closure:
        findings.append("CORE_AUTHORITY_CORE2A_BRIDGE_CLOSURE_DRIFT")
    if _texts(bridge.get("core2b_allowed_capability_closure")) != allowed_closure:
        findings.append("CORE_AUTHORITY_CORE2B_BRIDGE_CLOSURE_DRIFT")
    if bridge.get("core2b_requires_prior_exposure") is not True:
        findings.append("CORE_AUTHORITY_CORE2B_BRIDGE_EXPOSURE_DRIFT")

    states = _texts(contract.get("allowed_dependency_states"))
    if states != {"PASS", "HOLD", "FAIL"}:
        findings.append("CORE_AUTHORITY_DEPENDENCY_STATES_DRIFT")

    return {
        "contract_version": contract.get("version"),
        "roles_checked": sum(1 for role in ROLE_ORDER if role in roles),
        "passed": not findings,
        "findings": findings,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--enforce", action="store_true")
    args = parser.parse_args()
    report = audit()
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 1 if args.enforce and not report["passed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
