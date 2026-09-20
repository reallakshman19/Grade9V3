#!/usr/bin/env python3
"""Regression tests for GCDR companion diagnostic/helper/suite contracts."""
from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

import jsonschema

from Shared.tools import gcdr_companion_guard

REPO = Path(__file__).resolve().parents[1]


class GCDRCompanionContractTest(unittest.TestCase):
    def schema(self, name: str):
        return json.loads((REPO / "Shared/library" / name).read_text(encoding="utf-8"))

    def test_valid_diagnostic_contract(self):
        item = {
            "schema_version": "1.0.0",
            "item_id": "Q-001",
            "source_provenance": {
                "provider": "Author",
                "source_url": None,
                "source_item_verified": False,
                "source_snapshot_date": None,
                "source_claim_status": "AUTHORED_ADAPTATION",
            },
            "answer_contract": {
                "status": "PASS",
                "final_answer": "30 m/s^2",
                "derivation_specific": True,
                "independent_check": "Differentiate velocity independently and substitute the event time.",
                "audit_evidence_refs": ["test:diagnostic:Q-001"],
            },
            "teaching_contract": {
                "trap_alert": "Do not use a constant-acceleration formula when acceleration varies with time.",
                "transfer_takeaway": "Differentiate the supplied motion law before choosing a kinematic shortcut.",
                "chalkboard_check": "The derivative route reproduces the same acceleration at the requested instant.",
                "helper_contract_refs": ["HELPER-CHALKBOARD", "HELPER-TRAP"],
            },
            "simulation_contract": {
                "fidelity": "EXACT",
                "target_activity": "ACT-001",
                "binding_refs": ["BIND-X", "BIND-Y"],
                "fidelity_note": "Every governing parameter required by this representation is source-bound.",
            },
        }
        jsonschema.validate(instance=item, schema=self.schema("gcdr_diagnostic_item.schema.json"))

    def test_pass_diagnostic_rejects_filler_answer(self):
        item = {
            "schema_version": "1.0.0",
            "item_id": "Q-002",
            "source_provenance": {
                "provider": "Author",
                "source_url": None,
                "source_item_verified": False,
                "source_snapshot_date": None,
                "source_claim_status": "AUTHORED_ADAPTATION",
            },
            "answer_contract": {
                "status": "PASS",
                "final_answer": "Evaluate from coordinate equations",
                "derivation_specific": True,
                "independent_check": "A second derivation was performed for this item.",
                "audit_evidence_refs": ["test:Q-002"],
            },
            "teaching_contract": {
                "trap_alert": "A concrete wrong model is named here.",
                "transfer_takeaway": "A reusable decision rule is stated here.",
                "chalkboard_check": "A state-specific check is stated here.",
                "helper_contract_refs": ["HELPER-1"],
            },
            "simulation_contract": {
                "fidelity": "UNAVAILABLE",
                "target_activity": None,
                "binding_refs": [],
                "fidelity_note": "No current activity can represent this task safely.",
            },
        }
        with self.assertRaises(jsonschema.ValidationError):
            jsonschema.validate(instance=item, schema=self.schema("gcdr_diagnostic_item.schema.json"))

    def test_audited_helper_requires_state_and_evidence(self):
        helper = {
            "schema_version": "1.0.0",
            "helper_id": "HELPER-TRAP",
            "lifecycle_status": "AUDITED",
            "job": "Diagnose the concrete misconception in the current governed state.",
            "state_paths": [],
            "required_outputs": ["tempting_wrong_model", "observable_contradiction"],
            "evidence_refs": [],
        }
        with self.assertRaises(jsonschema.ValidationError):
            jsonschema.validate(instance=helper, schema=self.schema("gcdr_helper_contract.schema.json"))

    def test_suite_full_corpus_claim_must_match_counts(self):
        suite = {
            "schema_version": "1.0.0",
            "suite_id": "SUITE-TEST",
            "scope": {
                "canonical_binding_status": "PARTIAL",
                "instructional_depth": ["ADVANCED"],
                "certification_scope": "Only the explicitly bound canonical slice is in scope.",
            },
            "external_corpus": {
                "provider": "Example",
                "topic": "Example topic",
                "snapshot_date": "2026-09-20",
                "live_count": 100,
                "embedded_item_count": 13,
                "coverage_claim": "FULL_CORPUS_AUDITED",
            },
            "diagnostic_item_refs": [],
            "activity_refs": ["ACT-1"],
            "delivery_profiles": [{
                "profile": "REPO_BUNDLE",
                "artifact_locator": "public/example/index.html",
                "external_dependencies": [],
            }],
        }
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            lib = root / "Shared/library"
            lib.mkdir(parents=True)
            for name in (
                "gcdr_diagnostic_item.schema.json",
                "gcdr_helper_contract.schema.json",
                "gcdr_suite_contract.schema.json",
            ):
                (lib / name).write_text(
                    (REPO / "Shared/library" / name).read_text(encoding="utf-8"),
                    encoding="utf-8",
                )
            (root / "sample.gcdr-suite.json").write_text(json.dumps(suite), encoding="utf-8")
            findings = gcdr_companion_guard.findings(root)

        self.assertIn("FALSE_FULL_CORPUS_CLAIM", {row["point"] for row in findings})


if __name__ == "__main__":
    unittest.main()
