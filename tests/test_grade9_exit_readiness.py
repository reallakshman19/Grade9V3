"""TEST-TA9-001 / BENCH-TA9-001: categorical Grade-9 evidence projection."""
from __future__ import annotations

import unittest
from pathlib import Path
from unittest.mock import patch

from Shared.tools import grade9_exit_readiness

REPO = Path(__file__).resolve().parents[1]


class Grade9ExitReadinessTest(unittest.TestCase):
    def scope_item(self, *, role="REQUIRED_CORE", required=True, blocker=True):
        return {
            "scope_ref": "MATRIX-FROZEN",
            "capability_ref": "CAP-FROZEN",
            "scope_role": role,
            "required_grade9": required,
            "default_grade9_completion_blocker": blocker,
        }

    def test_bench_ta9_001_frozen_truth_table(self):
        cases = [
            (
                "required + proven independent",
                self.scope_item(),
                {
                    "state": "DEMONSTRATED",
                    "source": "DIRECT_ATTEMPT",
                    "help": "NONE",
                    "independence_proven": True,
                    "independence_basis": "DIRECT_ATTEMPT_WITH_NO_HELP",
                },
                grade9_exit_readiness.SECURE,
            ),
            (
                "required + helped-only",
                self.scope_item(),
                {
                    "state": "UNCERTAIN",
                    "source": "DIRECT_ATTEMPT",
                    "help": "HINT",
                    "independence_proven": False,
                    "independence_basis": "NOT_PROVEN",
                },
                grade9_exit_readiness.INSUFFICIENT_UNKNOWN,
            ),
            (
                "required + explicit missing",
                self.scope_item(),
                {
                    "state": "MISSING",
                    "source": "DIRECT_ATTEMPT",
                    "help": "NONE",
                    "error_stage": "CONCEPT",
                    "independence_proven": True,
                },
                grade9_exit_readiness.KNOWN_GAP,
            ),
            (
                "required + unobserved",
                self.scope_item(),
                {
                    "state": "UNOBSERVED",
                    "source": "UNOBSERVED",
                    "independence_proven": False,
                },
                grade9_exit_readiness.INSUFFICIENT_UNKNOWN,
            ),
            (
                "enrichment + unobserved",
                self.scope_item(
                    role="DECLARED_EXTENSION_NONBLOCKING",
                    required=False,
                    blocker=False,
                ),
                {
                    "state": "UNOBSERVED",
                    "source": "UNOBSERVED",
                    "independence_proven": False,
                },
                grade9_exit_readiness.INSUFFICIENT_UNKNOWN,
            ),
        ]
        for label, scope_item, learner_state, expected in cases:
            with self.subTest(case=label):
                before_scope = dict(scope_item)
                before_state = dict(learner_state)
                projected = grade9_exit_readiness.project_state(scope_item, learner_state)
                self.assertEqual(projected["evidence_category"], expected)
                self.assertEqual(projected["persistence"], "DERIVED_NOT_STORED")
                self.assertEqual(scope_item, before_scope)
                self.assertEqual(learner_state, before_state)

        enrichment = grade9_exit_readiness.project_state(cases[-1][1], cases[-1][2])
        self.assertFalse(enrichment["required_grade9"])
        self.assertFalse(enrichment["default_grade9_completion_blocker"])

    def test_nonindependent_demonstrated_is_usable_but_fragile(self):
        projected = grade9_exit_readiness.project_state(
            self.scope_item(),
            {
                "state": "DEMONSTRATED",
                "source": "PROFILE_DIAGNOSTIC",
                "independence_proven": False,
                "independence_basis": "PROFILE_SNAPSHOT_NOT_PROOF",
            },
        )
        self.assertEqual(
            projected["evidence_category"],
            grade9_exit_readiness.USABLE_BUT_FRAGILE,
        )

    def test_helped_demonstration_consumes_existing_effective_state_downgrade(self):
        observation = {
            "observation_id": "OBS-TA9-HELPED",
            "capability_ref": "CAP-FROZEN",
            "evidence_kind": "DIRECT_ATTEMPT",
            "result": "DEMONSTRATED",
            "when": "2026-09-21",
            "help": "HINT",
            "error_stage": "UNKNOWN",
        }
        profile = {"profile_id": "PROFILE-TA9", "held": {}, "observation_refs": []}
        with patch(
            "Shared.tools.learner_evidence.evidence_for_capability",
            return_value=[observation],
        ):
            projected = grade9_exit_readiness.project_capability(
                self.scope_item(),
                profile,
                repo=REPO,
            )
        self.assertEqual(projected["evidence_basis"]["state"], "UNCERTAIN")
        self.assertEqual(
            projected["evidence_category"],
            grade9_exit_readiness.INSUFFICIENT_UNKNOWN,
        )

    def test_current_scope_authority_exposes_required_domains_without_promoting_extensions(self):
        domains = grade9_exit_readiness.scope_domains(REPO)
        required = [row for row in domains if row["required_grade9"]]
        self.assertEqual(len(required), 6)
        self.assertTrue(all(row["scope_role"] == "REQUIRED_CORE" for row in required))
        self.assertTrue(all(row["default_grade9_completion_blocker"] for row in required))

        relative_motion = next(
            row for row in domains
            if row["scope_ref"] == "MATRIX-PHY-RELATIVE-MOTION"
        )
        self.assertEqual(relative_motion["scope_role"], "DECLARED_EXTENSION_NONBLOCKING")
        self.assertFalse(relative_motion["required_grade9"])
        self.assertFalse(relative_motion["default_grade9_completion_blocker"])

    def test_unknown_state_fails_closed(self):
        with self.assertRaisesRegex(ValueError, "unsupported learner evidence state"):
            grade9_exit_readiness.project_state(
                self.scope_item(),
                {"state": "MASTERED"},
            )


if __name__ == "__main__":
    unittest.main()
