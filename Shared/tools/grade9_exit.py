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

    Non-default extension/diagnostic rungs remain visible in canonical content but
    are not ordinary Grade-9 exit requirements.
    """
    matrix_path = str(scope_row["path"])
    matrix = load(repo / matrix_path)
    package_path = _package_path(matrix_path)
    package = load(repo / package_path)
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
            raise ValueError(
                f'{scope_row["matrix_id"]}:{rung.get("rung")} has no microtopic_ref'
            )
        microtopic = microtopics.get(microtopic_ref)
        if not microtopic:
            raise ValueError(
                f'{scope_row["matrix_id"]}:{rung.get("rung")} references missing '
                f"microtopic {microtopic_ref} in {package_path}"
            )
        capability_ref = microtopic.get("primary_capability_ref")
        if not capability_ref:
            raise ValueError(
                f"{microtopic_ref} has no primary_capability_ref in {package_path}"
            )
        row = by_capability.setdefault(
            capability_ref,
            {
                "capability_ref": capability_ref,
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
    if KNOWN_GAP in categories:
        return KNOWN_GAP
    if INSUFFICIENT_OR_UNKNOWN in categories:
        return INSUFFICIENT_OR_UNKNOWN
    if USABLE_BUT_FRAGILE in categories:
        return USABLE_BUT_FRAGILE
    return SECURE


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
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--profile-id", required=True)
    args = parser.parse_args()

    profiles = learner_evidence.load_profiles(REPO)
    profile = profiles.get(args.profile_id)
    if profile is None:
        print(json.dumps({
            "status": "FAIL",
            "reason": f"unknown profile_id {args.profile_id}",
        }, indent=2))
        return 2

    print(json.dumps(project(profile, REPO), indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
