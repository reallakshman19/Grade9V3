#!/usr/bin/env python3
"""Regression tests for the versioned GCDR v1.3 explorer contract."""
from __future__ import annotations

import copy
import json
import tempfile
import unittest
from pathlib import Path

from Shared.tools import explorer_design_guard

REPO = Path(__file__).resolve().parents[1]


def upgraded_activity():
    package = json.loads(
        (REPO / "Physics/library/phy-kin-2d-motion.v1.json").read_text(encoding="utf-8")
    )
    activity = copy.deepcopy(next(
        row for row in package["resources"]
        if row["id"] == "ACT-KIN-2D-SHARED-CLOCK"
    ))
    contract = activity["extensions"]["topic_atlas"]["gcdr_contract"]
    contract["schema_version"] = "1.3.0"
    contract["scope_contract"] = {
        "canonical_binding_status": "BOUND",
        "canonical_capability_refs": ["CAP-KIN-2D-INDEPENDENT-COMPONENTS"],
        "instructional_depth": ["FOUNDATION", "ADVANCED"],
        "certification_scope": "Shared-clock reconstruction for the declared independent-components capability only.",
        "extension_reason": None,
    }
    contract["representation_invariants"] = [{
        "id": "INV-K2D-SHARED-EVENT-TIME",
        "views": ["x-component history", "y-component history", "particle state"],
        "relation": "Every coordinate in one reconstructed particle state is evaluated at the same physical event time.",
        "audit_method": "PROPERTY_TEST",
    }]
    contract["helper_contract_refs"] = []
    contract["delivery_contract"] = {
        "profile": "REPO_BUNDLE",
        "entrypoint_locator": activity["locator"],
        "external_dependencies": [],
        "local_dependency_policy": "REPOSITORY_RELATIVE_ALLOWED",
        "offline_claim": False,
    }
    quality = contract["quality_audit"]
    quality["checklist_version"] = "1.2.0"
    quality["audit_2_graphical_state_fidelity"]["rendered_geometry_truth"] = "PENDING"
    quality["audit_2_graphical_state_fidelity"]["representation_invariants_hold"] = "PENDING"
    quality["audit_3_reconstruction_teaching_transfer"]["helper_activation"] = "PENDING"
    quality["audit_4_runtime_release_integrity"]["delivery_profile_integrity"] = "PENDING"
    return activity


def run_guard(activity):
    mini = {
        "resources": [activity],
        "capabilities": [{"id": "CAP-KIN-2D-INDEPENDENT-COMPONENTS"}],
        "microtopics": [{"teaching_path": [{"id": "K2D1-3"}, {"id": "K2D1-4"}]}],
    }
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        (root / "Shared/library").mkdir(parents=True)
        for name in (
            "explorer_design_contract.schema.json",
            "explorer_design_contract.v1_3.schema.json",
        ):
            (root / "Shared/library" / name).write_text(
                (REPO / "Shared/library" / name).read_text(encoding="utf-8"),
                encoding="utf-8",
            )
        (root / "Physics/library").mkdir(parents=True)
        (root / "Physics/library/test.json").write_text(json.dumps(mini), encoding="utf-8")
        target = root / activity["locator"]
        target.parent.mkdir(parents=True)
        target.write_bytes((REPO / activity["locator"]).read_bytes())
        return explorer_design_guard.findings(root)


class GCDRV13ExplorerContractTest(unittest.TestCase):
    def test_existing_v12_partial_contracts_remain_valid(self):
        self.assertEqual(explorer_design_guard.findings(REPO), [])

    def test_v13_partial_contract_is_valid_without_fake_certification(self):
        activity = upgraded_activity()
        self.assertEqual(run_guard(activity), [])

    def test_v12_contract_cannot_be_promoted_to_certified(self):
        package = json.loads(
            (REPO / "Physics/library/phy-kin-2d-motion.v1.json").read_text(encoding="utf-8")
        )
        activity = copy.deepcopy(next(
            row for row in package["resources"]
            if row["id"] == "ACT-KIN-2D-SHARED-CLOCK"
        ))
        activity["extensions"]["topic_atlas"]["gcdr_contract"]["conformance_status"] = "CERTIFIED"
        points = {row["point"] for row in run_guard(activity)}
        self.assertIn("LEGACY_CERTIFICATION_NOT_ALLOWED", points)

    def test_v13_certification_requires_bound_scope_and_helper_contract(self):
        activity = upgraded_activity()
        contract = activity["extensions"]["topic_atlas"]["gcdr_contract"]
        contract["conformance_status"] = "CERTIFIED"
        contract["scope_contract"]["canonical_binding_status"] = "PARTIAL"
        points = {row["point"] for row in run_guard(activity)}
        self.assertIn("FALSE_SCOPE_CERTIFICATION", points)
        self.assertIn("CERTIFIED_WITHOUT_HELPER_CONTRACT", points)

    def test_offline_delivery_profile_rejects_dependencies(self):
        activity = upgraded_activity()
        delivery = activity["extensions"]["topic_atlas"]["gcdr_contract"]["delivery_contract"]
        delivery["profile"] = "SINGLE_FILE_OFFLINE"
        delivery["external_dependencies"] = ["https://cdn.example.invalid/library.js"]
        delivery["local_dependency_policy"] = "REPOSITORY_RELATIVE_ALLOWED"
        delivery["offline_claim"] = False
        points = {row["point"] for row in run_guard(activity)}
        self.assertIn("OFFLINE_PROFILE_EXTERNAL_DEPENDENCY", points)
        self.assertIn("OFFLINE_PROFILE_LOCAL_DEPENDENCY", points)
        self.assertIn("OFFLINE_PROFILE_WITHOUT_CLAIM", points)


if __name__ == "__main__":
    unittest.main()
