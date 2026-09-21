#!/usr/bin/env python3
"""Derive Grade-9 exit evidence categories without owning learner truth.

The projection consumes two existing authorities:
- Grade-9 scope coverage decides whether an item is ordinary required scope.
- learner_evidence.effective_state decides what evidence currently exists.

Nothing here persists mastery/readiness, computes a percentage, or decides Grade-10
transition blockers. Those are deliberately outside STEP-TA9-001.
"""
from __future__ import annotations

from pathlib import Path

from Shared.contracts import load
from Shared.tools import learner_evidence

REPO = Path(__file__).resolve().parents[2]
SCOPE_COVERAGE = "docs/grade9/grade9-physics-scope-coverage.json"

SECURE = "SECURE"
USABLE_BUT_FRAGILE = "USABLE_BUT_FRAGILE"
KNOWN_GAP = "KNOWN_GAP"
INSUFFICIENT_UNKNOWN = "INSUFFICIENT_UNKNOWN"

VALID_EVIDENCE_STATES = {"DEMONSTRATED", "UNCERTAIN", "MISSING", "UNOBSERVED"}


def scope_domains(repo: Path = REPO) -> list[dict]:
    """Return the existing matrix/domain scope classification as a derived view."""
    coverage = load(repo / SCOPE_COVERAGE)
    return [
        {
            "scope_ref": row["matrix_id"],
            "scope_role": row["role"],
            "required_grade9": row.get("ordinary_grade9_core") is True,
            "default_grade9_completion_blocker": (
                row.get("default_grade9_completion_blocker") is True
            ),
            "basis": list(row.get("basis", [])),
        }
        for row in coverage.get("matrices", [])
    ]


def evidence_category(learner_state: dict) -> str:
    """Map existing evidence into one conservative, non-persisted exit category."""
    state = learner_state.get("state", "UNOBSERVED")
    if state not in VALID_EVIDENCE_STATES:
        raise ValueError(f"unsupported learner evidence state: {state}")

    if state == "DEMONSTRATED":
        return SECURE if learner_state.get("independence_proven") is True else USABLE_BUT_FRAGILE
    if state == "MISSING":
        return KNOWN_GAP
    return INSUFFICIENT_UNKNOWN


def project_capability(
    scope_item: dict,
    profile: dict,
    *,
    repo: Path = REPO,
) -> dict:
    """Project one explicitly scoped capability from current learner evidence.

    The caller supplies the capability-to-scope association. This function does not
    infer that every rung inside a required matrix is itself a required capability.
    """
    capability_ref = scope_item.get("capability_ref")
    if not isinstance(capability_ref, str) or not capability_ref:
        raise ValueError("scope_item.capability_ref must be explicit")

    state = learner_evidence.effective_state(profile, capability_ref, repo)
    return project_state(scope_item, state)


def project_state(scope_item: dict, learner_state: dict) -> dict:
    """Pure projection helper used by the frozen truth-table oracle."""
    scope_ref = scope_item.get("scope_ref")
    capability_ref = scope_item.get("capability_ref")
    if not isinstance(scope_ref, str) or not scope_ref:
        raise ValueError("scope_item.scope_ref must be explicit")
    if not isinstance(capability_ref, str) or not capability_ref:
        raise ValueError("scope_item.capability_ref must be explicit")

    return {
        "scope_ref": scope_ref,
        "capability_ref": capability_ref,
        "scope_role": scope_item.get("scope_role"),
        "required_grade9": scope_item.get("required_grade9") is True,
        "default_grade9_completion_blocker": (
            scope_item.get("default_grade9_completion_blocker") is True
        ),
        "evidence_category": evidence_category(learner_state),
        "evidence_basis": {
            key: learner_state.get(key)
            for key in (
                "state",
                "source",
                "observation_ref",
                "when",
                "help",
                "error_stage",
                "independence_proven",
                "independence_basis",
            )
        },
        "persistence": "DERIVED_NOT_STORED",
    }
