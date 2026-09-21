#!/usr/bin/env python3
"""Derive a categorical Grade-9 Physics exit-evidence view from existing truth.

This module is intentionally a query/view. It does not persist readiness, invent a
mastery score, or edit canonical Physics/learner evidence. Scope comes from the
Grade-9 scope coverage audit and learner state comes from learner_evidence.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
if __package__ in (None, ""):
    sys.path.insert(0, str(REPO))

from Shared.contracts import load  # noqa: E402
from Shared.tools import learner_evidence  # noqa: E402

SCOPE_COVERAGE = "docs/grade9/grade9-physics-scope-coverage.json"

SECURE = "SECURE"
USABLE_BUT_FRAGILE = "USABLE_BUT_FRAGILE"
KNOWN_GAP = "KNOWN_GAP"
INSUFFICIENT_OR_UNKNOWN = "INSUFFICIENT_OR_UNKNOWN"

CATEGORIES = {
    SECURE,
    USABLE_BUT_FRAGILE,
    KNOWN_GAP,
    INSUFFICIENT_OR_UNKNOWN,
}


def _package_path(matrix_path: str) -> Path:
    """Return the sibling subject-library package for one canonical matrix."""
    path = Path(matrix_path)
    name = path.name
    if not name.endswith(".rungs.json"):
        raise ValueError(f"matrix path does not end in .rungs.json: {matrix_path}")
    if path.parent.name != "matrices":
        raise ValueError(f"matrix path is not under a subject matrices directory: {matrix_path}")
    return path.parent.parent / "library" / name.replace(".rungs.json", ".v1.json")


def scope_coverage(repo: Path = REPO) -> dict:
    return load(repo / SCOPE_COVERAGE)


def matrix_capabilities(scope_row: dict, repo: Path = REPO) -> list[dict]:
    """Resolve default-entry matrix rungs to canonical capability refs.

    Required Grade-9 scope fails closed when a default rung lacks its canonical
    microtopic/capability binding. Non-required extension/deferred scope remains
    visible without becoming a hard dependency on incomplete later-grade authoring.
    """
    strict_required = scope_row.get("ordinary_grade9_core") is True
    matrix_path = str(scope_row["path"])
    matrix = load(repo / matrix_path)
    package_path = _package_path(matrix_path)
    package = load(repo / package_path)
    capability_defs = {
        row["id"]: row
        for row in package.get("capabilities", [])
        if isinstance(row, dict) and row.get("id")
    }
    microtopics = {
        row["id"]: row
        for row in package.get("microtopics", [])
        if isinstance(row, dict) and row.get("id")
    }

    by_capability: dict[str, dict] = {}
    for rung in matrix.get("rungs", []):
        if rung.get("default_entry_eligible", True) is False:
            continue
        microtopic_ref = rung.get("microtopic_ref")
        if not microtopic_ref:
            if strict_required:
                raise ValueError(
                    f'{scope_row["matrix_id"]}:{rung.get("rung")} has no microtopic_ref'
                )
            continue
        microtopic = microtopics.get(microtopic_ref)
        if not microtopic:
            if strict_required:
                raise ValueError(
                    f'{scope_row["matrix_id"]}:{rung.get("rung")} references missing '
                    f"microtopic {microtopic_ref} in {package_path}"
                )
            continue
        capability_ref = microtopic.get("primary_capability_ref")
        if not capability_ref:
            if strict_required:
                raise ValueError(
                    f"{microtopic_ref} has no primary_capability_ref in {package_path}"
                )
            continue
        capability_def = capability_defs.get(capability_ref)
        if not capability_def:
            if strict_required:
                raise ValueError(
                    f"{microtopic_ref} references missing capability {capability_ref} "
                    f"in {package_path}"
                )
            continue
        row = by_capability.setdefault(
            capability_ref,
            {
                "capability_ref": capability_ref,
                "prerequisite_refs": list(capability_def.get("prerequisite_refs", [])),
                "matrix_id": scope_row["matrix_id"],
                "matrix_role": scope_row["role"],
                "ordinary_grade9_core": bool(scope_row.get("ordinary_grade9_core")),
                "default_grade9_completion_blocker": bool(
                    scope_row.get("default_grade9_completion_blocker")
                ),
                "rungs": [],
                "microtopic_refs": [],
            },
        )
        row["rungs"].append(rung.get("rung"))
        row["microtopic_refs"].append(microtopic_ref)

    return list(by_capability.values())


def evidence_category(effective: dict, observation: dict | None = None) -> str:
    """Map one capability's evidence to the WP-TA-105 categorical view.

    SECURE requires the existing learner-evidence owner to prove independence.
    A demonstrated observation without independent proof remains usable-but-fragile.
    Explicit missing remains a known gap. Uncertain, unobserved, and unsupported
    profile-only demonstrations remain insufficient/unknown.
    """
    if observation is not None:
        result = observation.get("result")
        if result == "DEMONSTRATED":
            return SECURE if effective.get("independence_proven") is True else USABLE_BUT_FRAGILE
        if result == "MISSING":
            return KNOWN_GAP
        return INSUFFICIENT_OR_UNKNOWN

    if effective.get("state") == "MISSING":
        return KNOWN_GAP
    return INSUFFICIENT_OR_UNKNOWN


def capability_projection(profile: dict, capability_ref: str,
                          repo: Path = REPO) -> dict:
    history = learner_evidence.evidence_for_capability(profile, capability_ref, repo)
    observation = history[0] if history else None
    effective = learner_evidence.effective_state(profile, capability_ref, repo)
    category = evidence_category(effective, observation)

    basis = []
    if observation:
        basis.append({
            "observation_ref": observation.get("observation_id"),
            "evidence_kind": observation.get("evidence_kind") or "OBSERVATION",
            "result": observation.get("result"),
            "help": observation.get("help"),
            "when": observation.get("when"),
            "error_stage": observation.get("error_stage"),
        })
    elif effective.get("source") != "UNOBSERVED":
        basis.append({
            "source": effective.get("source"),
            "state": effective.get("state"),
            "independence_basis": effective.get("independence_basis"),
        })

    return {
        "capability_ref": capability_ref,
        "evidence_category": category,
        "independence_proven": effective.get("independence_proven") is True,
        "effective_state": effective.get("state"),
        "evidence_source": effective.get("source"),
        "basis": basis,
    }


def _domain_category(capabilities: list[dict]) -> str:
    categories = [row["evidence_category"] for row in capabilities]
    if not categories:
        return INSUFFICIENT_OR_UNKNOWN
    if KNOWN_GAP in categories:
        return KNOWN_GAP
    if INSUFFICIENT_OR_UNKNOWN in categories:
        return INSUFFICIENT_OR_UNKNOWN
    if USABLE_BUT_FRAGILE in categories:
        return USABLE_BUT_FRAGILE
    return SECURE


def transition_boundary(capabilities: list[dict]) -> list[dict]:
    """Classify known blockers without turning unknowns or optional scope into gaps.

    Required capabilities may block when explicitly MISSING. A non-core capability
    blocks only when a required Grade-9 capability names it as a prerequisite.
    Unknown required/prerequisite evidence is reported separately as evidence needed,
    not mislabeled as a known content gap.
    """
    required_prerequisites = {
        prerequisite
        for row in capabilities
        if row.get("ordinary_grade9_core") is True
        for prerequisite in row.get("prerequisite_refs", [])
    }

    decisions = []
    for row in capabilities:
        capability_ref = row["capability_ref"]
        category = row["evidence_category"]
        ordinary_required = row.get("ordinary_grade9_core") is True
        prerequisite_to_required = capability_ref in required_prerequisites

        if category == KNOWN_GAP and (ordinary_required or prerequisite_to_required):
            decisions.append({
                "matrix_id": row["matrix_id"],
                "capability_ref": capability_ref,
                "blocks_transition": True,
                "disposition": "BLOCKER",
                "reason": (
                    "GENUINE_PREREQUISITE_GAP"
                    if prerequisite_to_required
                    else "REQUIRED_SCOPE_GAP"
                ),
            })
            continue

        if category == INSUFFICIENT_OR_UNKNOWN and (
            ordinary_required or prerequisite_to_required
        ):
            decisions.append({
                "matrix_id": row["matrix_id"],
                "capability_ref": capability_ref,
                "blocks_transition": False,
                "disposition": "EVIDENCE_REQUIRED",
                "reason": (
                    "PREREQUISITE_EVIDENCE_UNKNOWN"
                    if prerequisite_to_required
                    else "REQUIRED_SCOPE_EVIDENCE_UNKNOWN"
                ),
            })
            continue

        if category == KNOWN_GAP:
            decisions.append({
                "matrix_id": row["matrix_id"],
                "capability_ref": capability_ref,
                "blocks_transition": False,
                "disposition": "NON_BLOCKING_GAP",
                "reason": "NON_BLOCKING_SCOPE_GAP",
            })
            continue

        decisions.append({
            "matrix_id": row["matrix_id"],
            "capability_ref": capability_ref,
            "blocks_transition": False,
            "disposition": "NON_BLOCKING",
            "reason": "NO_KNOWN_BLOCKER",
        })

    return decisions


def _repair_recheck_context(capability: dict, boundary: dict) -> str:
    category = capability["evidence_category"]
    basis = capability.get("basis", [])
    latest = basis[0] if basis else {}
    error_stage = latest.get("error_stage")
    help_used = latest.get("help")

    if category == SECURE:
        return "Independent evidence is present; retain ordinary recheck/review rather than recertifying the whole grade."
    if category == USABLE_BUT_FRAGILE:
        if help_used and help_used != "NONE":
            return f"Success used {help_used}; obtain a fresh independent verification."
        return "Performance is usable but independence is not proven; obtain a fresh independent verification."
    if category == KNOWN_GAP:
        if error_stage and error_stage != "UNKNOWN":
            return f"Repair the observed {error_stage.lower()} gap, then obtain fresh independent verification."
        return "Repair the known gap, then obtain fresh independent verification."
    if boundary["disposition"] == "EVIDENCE_REQUIRED":
        return "Collect direct independent evidence before making the transition decision."
    return "No repair is implied by current evidence; missing optional evidence remains visible without gating progression."


def _transition_implication(boundary: dict) -> str:
    disposition = boundary["disposition"]
    if disposition == "BLOCKER":
        return "Resolve this blocker before treating Grade 10 as the next productive frontier."
    if disposition == "EVIDENCE_REQUIRED":
        return "Verify this required/prerequisite capability before deciding the Grade-10 transition."
    if disposition == "NON_BLOCKING_GAP":
        return "Keep this gap visible for optional repair; it does not block Grade-9 exit under current scope authority."
    return "This capability does not currently block the Grade-10 transition."


def transition_report(projection: dict) -> dict:
    """Build a derived machine-readable transition report from one projection."""
    boundary_by_capability = {
        row["capability_ref"]: row
        for row in projection["transition_boundary"]
    }
    rows = []
    for capability in projection["capabilities"]:
        boundary = boundary_by_capability[capability["capability_ref"]]
        rows.append({
            "matrix_id": capability["matrix_id"],
            "capability_ref": capability["capability_ref"],
            "scope_role": capability["matrix_role"],
            "required_grade9": capability["ordinary_grade9_core"],
            "evidence_category": capability["evidence_category"],
            "evidence_basis": list(capability.get("basis", [])),
            "blocker_status": boundary["disposition"],
            "blocker_reason": boundary["reason"],
            "repair_recheck_context": _repair_recheck_context(capability, boundary),
            "transition_implication": _transition_implication(boundary),
        })

    blockers = [row for row in rows if row["blocker_status"] == "BLOCKER"]
    evidence_needed = [
        row for row in rows
        if row["blocker_status"] == "EVIDENCE_REQUIRED"
    ]
    if blockers:
        transition_state = "GRADE9_REPAIR_REQUIRED"
        transition_message = (
            "Grade 10 is not yet the next productive frontier because one or more "
            "known required/prerequisite Grade-9 gaps remain."
        )
    elif evidence_needed:
        transition_state = "GRADE9_EVIDENCE_INCOMPLETE"
        transition_message = (
            "Grade-10 transition is not yet established because required/prerequisite "
            "Grade-9 evidence is still insufficient or unknown."
        )
    else:
        transition_state = "GRADE10_NEXT_PRODUCTIVE_FRONTIER"
        transition_message = (
            "No known required/prerequisite blocker or unresolved required evidence "
            "remains in this projection, so Grade 10 is the next productive frontier."
        )

    return {
        "schema_version": "grade9v3-grade9-transition-report-v1",
        "projection_kind": "DERIVED_REPORT",
        "persistence": "NOT_WRITTEN",
        "profile_id": projection.get("profile_id"),
        "scope_source": projection.get("scope_source"),
        "transition_state": transition_state,
        "transition_message": transition_message,
        "rows": rows,
        "known_limitations": [
            "The governed learner-observation contract has no explicit misconception identifier/severity field, so this report does not infer a 'major unresolved misconception' from error_stage alone.",
            "Unknown or missing evidence is never promoted to secure evidence.",
            "Session-only READY/REINFORCE/REBUILD posture is not persisted or reused as grade-level mastery truth.",
        ],
    }


def parent_agent_text(report: dict) -> str:
    """Render a deterministic human-readable view without hidden scoring."""
    lines = [
        "grade-exit transition view",
        f"Profile: {report.get('profile_id') or 'unspecified'}",
        f"Transition: {report['transition_state']}",
        report["transition_message"],
        "",
        "Required and relevant capability evidence:",
    ]
    for row in report["rows"]:
        if not row["required_grade9"] and row["blocker_status"] not in {
            "BLOCKER", "EVIDENCE_REQUIRED"
        }:
            continue
        lines.extend([
            (
                f"- {row['capability_ref']} [{row['scope_role']}]: "
                f"{row['evidence_category']} / {row['blocker_status']}"
            ),
            f"  Repair/recheck: {row['repair_recheck_context']}",
            f"  Transition implication: {row['transition_implication']}",
        ])
        if row["evidence_basis"]:
            refs = [
                item.get("observation_ref") or item.get("source")
                for item in row["evidence_basis"]
                if item.get("observation_ref") or item.get("source")
            ]
            if refs:
                lines.append(f"  Evidence basis: {', '.join(refs)}")

    lines.extend([
        "",
        "Known limitation:",
        (
            "- Major-misconception status is not inferred from generic error_stage; "
            "the current governed observation contract does not encode misconception "
            "identity/severity."
        ),
    ])
    return "\n".join(lines)


def project(profile: dict, repo: Path = REPO) -> dict:
    """Return a reproducible matrix/capability exit-evidence projection."""
    coverage = scope_coverage(repo)
    domains = []
    flat_capabilities = []

    for scope_row in coverage.get("matrices", []):
        resolved = []
        for capability in matrix_capabilities(scope_row, repo):
            evidence = capability_projection(profile, capability["capability_ref"], repo)
            row = {**capability, **evidence}
            resolved.append(row)
            flat_capabilities.append(row)

        counts = {category: 0 for category in sorted(CATEGORIES)}
        for row in resolved:
            counts[row["evidence_category"]] += 1

        domains.append({
            "matrix_id": scope_row["matrix_id"],
            "matrix_role": scope_row["role"],
            "ordinary_grade9_core": bool(scope_row.get("ordinary_grade9_core")),
            "default_grade9_completion_blocker": bool(
                scope_row.get("default_grade9_completion_blocker")
            ),
            "evidence_category": _domain_category(resolved),
            "category_counts": counts,
            "capabilities": resolved,
        })

    return {
        "schema_version": "grade9v3-grade9-exit-evidence-v1",
        "projection_kind": "DERIVED_QUERY",
        "profile_id": profile.get("profile_id"),
        "scope_source": SCOPE_COVERAGE,
        "persistence": "NOT_WRITTEN",
        "categories": [
            SECURE,
            USABLE_BUT_FRAGILE,
            KNOWN_GAP,
            INSUFFICIENT_OR_UNKNOWN,
        ],
        "domains": domains,
        "capabilities": flat_capabilities,
        "transition_boundary": transition_boundary(flat_capabilities),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--profile-id", required=True)
    parser.add_argument(
        "--format",
        choices=("json", "text"),
        default="json",
        help="Emit the machine-readable report or parent/agent-readable text.",
    )
    args = parser.parse_args()

    profiles = learner_evidence.load_profiles(REPO)
    profile = profiles.get(args.profile_id)
    if profile is None:
        print(json.dumps({
            "status": "FAIL",
            "reason": f"unknown profile_id {args.profile_id}",
        }, indent=2))
        return 2

    report = transition_report(project(profile, REPO))
    if args.format == "text":
        print(parent_agent_text(report))
    else:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
