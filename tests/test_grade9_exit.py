"""STEP-TA9-001 falsifiers for the derived Grade-9 exit evidence view."""
from __future__ import annotations

import unittest
from pathlib import Path
from unittest.mock import patch

from Shared.tools import grade9_exit

REPO = Path(__file__).resolve().parents[1]


class Grade9ExitProjectionTest(unittest.TestCase):
    def test_bench_ta9_001_frozen_exit_state_truth_table(self):
        cases = [
            (
                {"state": "DEMONSTRATED", "independence_proven": True},
                {"result": "DEMONSTRATED", "help": "NONE"},
                grade9_exit.SECURE,
            ),
            (
                {"state": "UNCERTAIN", "independence_proven": False},
                {"result": "DEMONSTRATED", "help": "HINT"},
                grade9_exit.USABLE_BUT_FRAGILE,
            ),
            (
                {"state": "MISSING", "independence_proven": True},
                {"result": "MISSING", "help": "NONE"},
                grade9_exit.KNOWN_GAP,
            ),
            (
                {"state": "UNOBSERVED", "independence_proven": False},
                None,
                grade9_exit.INSUFFICIENT_OR_UNKNOWN,
            ),
            (
                {
                    "state": "DEMONSTRATED",
                    "source": "PROFILE_OWNER_ESTIMATE",
                    "independence_proven": False,
                },
                None,
                grade9_exit.INSUFFICIENT_OR_UNKNOWN,
            ),
        ]
        for effective, observation, expected in cases:
            with self.subTest(effective=effective, observation=observation):
                self.assertEqual(
                    grade9_exit.evidence_category(effective, observation),
                    expected,
                )

    def test_required_scope_is_six_core_matrices_and_nondefault_rungs_do_not_leak(self):
        coverage = grade9_exit.scope_coverage(REPO)
        required = [
            row for row in coverage["matrices"]
            if row["role"] == "REQUIRED_CORE"
        ]
        self.assertEqual(len(required), 6)
        self.assertTrue(all(row["default_grade9_completion_blocker"] for row in required))

        by_id = {row["matrix_id"]: row for row in required}
        motion = grade9_exit.matrix_capabilities(
            by_id["MATRIX-PHY-KIN-1D-MOTION"], REPO
        )
        nlm = grade9_exit.matrix_capabilities(
            by_id["MATRIX-PHY-NLM-FIRST-LAW"], REPO
        )
        grav = grade9_exit.matrix_capabilities(
            by_id["MATRIX-PHY-GRAV-UNIVERSAL-LAW"], REPO
        )

        self.assertNotIn(
            "CAP-KIN-ZERO-V-NONZERO-A",
            {row["capability_ref"] for row in motion},
        )
        self.assertNotIn(
            "CAP-NLM-FRAME-CHOICE",
            {row["capability_ref"] for row in nlm},
        )
        self.assertNotIn(
            "CAP-PHY-GRAV-R4",
            {row["capability_ref"] for row in grav},
        )
        self.assertNotIn(
            "CAP-PHY-GRAV-R5",
            {row["capability_ref"] for row in grav},
        )

    def test_enrichment_without_evidence_stays_unknown_and_nonblocking(self):
        coverage = grade9_exit.scope_coverage(REPO)
        enrichment = next(
            row for row in coverage["matrices"]
            if row["role"] == "DECLARED_EXTENSION_NONBLOCKING"
        )
        cap = grade9_exit.matrix_capabilities(enrichment, REPO)[0]

        profile = {"profile_id": "PROFILE-EMPTY", "held": {}, "observation_refs": []}
        with patch.object(
            grade9_exit.learner_evidence,
            "evidence_for_capability",
            return_value=[],
        ), patch.object(
            grade9_exit.learner_evidence,
            "effective_state",
            return_value={
                "state": "UNOBSERVED",
                "source": "UNOBSERVED",
                "independence_proven": False,
                "independence_basis": "UNOBSERVED",
            },
        ):
            projected = grade9_exit.capability_projection(
                profile, cap["capability_ref"], REPO
            )

        self.assertEqual(
            projected["evidence_category"],
            grade9_exit.INSUFFICIENT_OR_UNKNOWN,
        )
        self.assertFalse(cap["default_grade9_completion_blocker"])
        self.assertFalse(cap["ordinary_grade9_core"])

    def test_projection_is_derived_and_does_not_create_grade_truth(self):
        profile = {"profile_id": "PROFILE-EMPTY", "held": {}, "observation_refs": []}
        with patch.object(
            grade9_exit.learner_evidence,
            "evidence_for_capability",
            return_value=[],
        ), patch.object(
            grade9_exit.learner_evidence,
            "effective_state",
            return_value={
                "state": "UNOBSERVED",
                "source": "UNOBSERVED",
                "independence_proven": False,
                "independence_basis": "UNOBSERVED",
            },
        ):
            report = grade9_exit.project(profile, REPO)

        self.assertEqual(report["projection_kind"], "DERIVED_QUERY")
        self.assertEqual(report["persistence"], "NOT_WRITTEN")
        self.assertEqual(
            sum(1 for row in report["domains"] if row["ordinary_grade9_core"]),
            6,
        )
        self.assertTrue(
            all(
                row["evidence_category"] == grade9_exit.INSUFFICIENT_OR_UNKNOWN
                for row in report["capabilities"]
            )
        )
        serialized = repr(report).lower()
        self.assertNotIn("mastery_percentage", serialized)
        self.assertNotIn("mastery_probability", serialized)


if __name__ == "__main__":
    unittest.main()
