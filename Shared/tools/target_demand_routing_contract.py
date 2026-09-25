#!/usr/bin/env python3
"""Validate the Target Demand Routing blueprint contract and route artifacts."""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[2]
ROLE_DIR = REPO / "Shared" / "roles"
CONTRACT_PATH = ROLE_DIR / "TARGET-DEMAND-ROUTING-CONTRACT.md"
SCHEMA_PATH = REPO / "Shared" / "library" / "target-demand-route.schema.json"
BLOCK = re.compile(r"^```target-demand-routing\s*$\n(.*?)^```\s*$", re.MULTILINE | re.DOTALL)

REQUIRED_INVARIANTS = {
    "every_fixed_target_requires_route_or_terminal_block",
    "whole_question_hold_cannot_hide_partial_capability_closure",
    "generic_practice_does_not_close_target",
    "target_authority_is_independent_of_direct_source_use",
    "direct_source_use_is_independent_of_instructional_demand_use",
    "instructional_demand_use_is_independent_of_assessment_claim",
    "identity_is_independent_of_source_custody",
    "owner_waiver_is_not_mastery_evidence",
    "owner_waiver_cannot_bypass_capability_gap",
    "core1_family_scope_remains_canonical",
    "demand_influence_must_be_traceable",
    "core2a_target_use_requires_capability_closure",
    "core2b_target_use_requires_capability_closure_and_prior_exposure",
    "extension_candidate_is_not_canonical_until_admitted",
}

EXPECTED_CLOSURES = {
    "ESTABLISHED_CURRENT_SCOPE",
    "ESTABLISHED_CANONICAL_PREREQUISITE",
    "AUTHORABLE_EXTENSION",
    "UNRESOLVED_GAP",
    "IDENTITY_BLOCKED",
}


def load_contract(path: Path = CONTRACT_PATH) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    match = BLOCK.search(text)
    if not match:
        raise ValueError("TARGET_DEMAND_ROUTING_BLOCK_MISSING")
    value = json.loads(match.group(1))
    if not isinstance(value, dict):
        raise ValueError("TARGET_DEMAND_ROUTING_ROOT_NOT_OBJECT")
    return value


def audit_contract(path: Path = CONTRACT_PATH) -> dict[str, Any]:
    findings: list[str] = []
    try:
        contract = load_contract(path)
    except Exception as exc:
        return {"passed": False, "findings": [str(exc)]}

    if contract.get("is_core_role") is not False:
        findings.append("TARGET_ROUTING_BECAME_CORE_ROLE")
    if set(contract.get("capability_closure_states") or []) != EXPECTED_CLOSURES:
        findings.append("TARGET_ROUTING_CAPABILITY_CLOSURES_DRIFT")
    invariants = contract.get("invariants") or {}
    for name in sorted(REQUIRED_INVARIANTS):
        if invariants.get(name) is not True:
            findings.append(f"TARGET_ROUTING_INVARIANT_NOT_TRUE:{name}")
    required_bridge = {
        "bridge_id","target_refs","teaching_goal","prerequisite_refs",
        "required_new_capabilities","construction","representation_requirements",
        "worked_anchor","misconceptions","independent_check","exit_task",
        "authority_state","review_state",
    }
    if set(contract.get("bridge_candidate_required_fields") or []) != required_bridge:
        findings.append("TARGET_ROUTING_BRIDGE_REQUIRED_FIELDS_DRIFT")
    return {
        "passed": not findings,
        "contract_version": contract.get("version"),
        "findings": findings,
    }


def validate_route_artifact(value: dict[str, Any], repo: Path = REPO) -> list[str]:
    findings: list[str] = []
    try:
        import jsonschema
    except ModuleNotFoundError:
        return ["JSONSCHEMA_UNAVAILABLE"]
    schema = json.loads((repo / SCHEMA_PATH.relative_to(REPO)).read_text(encoding="utf-8"))
    validator = jsonschema.Draft202012Validator(schema)
    for error in validator.iter_errors(value):
        where = "/".join(str(x) for x in error.path)
        findings.append(f"SCHEMA:{where}:{error.message}")

    target_ids = {row.get("target_id") for row in value.get("targets", []) if isinstance(row, dict)}
    bridge_ids = {row.get("bridge_id") for row in value.get("bridge_candidates", []) if isinstance(row, dict)}
    for target in value.get("targets", []):
        if not isinstance(target, dict):
            continue
        moves = target.get("demand_moves") or []
        move_ids = {m.get("move_id") for m in moves if isinstance(m, dict)}
        route = target.get("target_route") or []
        aggregate = target.get("aggregate_route_state")
        terminal = target.get("terminal_block")
        if aggregate == "BLOCKED" and not terminal:
            findings.append(f"TARGET_BLOCKED_WITHOUT_TERMINAL:{target.get('target_id')}")
        if aggregate != "BLOCKED" and not route:
            findings.append(f"TARGET_REACHABLE_WITHOUT_ROUTE:{target.get('target_id')}")
        for move in moves:
            closure = (move or {}).get("closure") or {}
            state = closure.get("state")
            bridge_ref = closure.get("bridge_candidate_ref")
            if state == "AUTHORABLE_EXTENSION":
                if not bridge_ref or bridge_ref not in bridge_ids:
                    findings.append(f"AUTHORABLE_EXTENSION_WITHOUT_BRIDGE:{target.get('target_id')}:{move.get('move_id')}")
            elif bridge_ref:
                findings.append(f"BRIDGE_REF_ON_NON_EXTENSION:{target.get('target_id')}:{move.get('move_id')}")
        for node in route:
            unknown = set(node.get("prepares_move_refs") or []) - move_ids
            if unknown:
                findings.append(f"ROUTE_UNKNOWN_MOVE:{target.get('target_id')}:{','.join(sorted(unknown))}")
    for bridge in value.get("bridge_candidates", []):
        unknown_targets = set(bridge.get("target_refs") or []) - target_ids
        if unknown_targets:
            findings.append(f"BRIDGE_UNKNOWN_TARGET:{bridge.get('bridge_id')}:{','.join(sorted(unknown_targets))}")
        if bridge.get("authority_state") == "CANDIDATE" and bridge.get("review_state") == "REVIEWED":
            findings.append(f"CANDIDATE_CANNOT_CLAIM_REVIEWED:{bridge.get('bridge_id')}")
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--artifact", type=Path)
    parser.add_argument("--enforce", action="store_true")
    args = parser.parse_args()
    report = audit_contract()
    if args.artifact:
        value = json.loads(args.artifact.read_text(encoding="utf-8"))
        route_findings = validate_route_artifact(value)
        report["route_findings"] = route_findings
        report["passed"] = report["passed"] and not route_findings
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 1 if args.enforce and not report["passed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
