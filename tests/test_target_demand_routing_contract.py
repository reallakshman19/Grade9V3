import copy
import json
import unittest
from pathlib import Path

from Shared.tools import target_demand_routing_contract


REPO = Path(__file__).resolve().parents[1]
SCHEMA = REPO / "Shared" / "library" / "target-demand-route.schema.json"


def valid_artifact():
    return {
        "schema_version": "1.0.0",
        "route_bundle_id": "ROUTE-DEMO",
        "subject": "Demo",
        "learner_context": {
            "evidence_state": "UNKNOWN",
            "owner_estimate_percent": 50,
            "owner_routing_waiver": True,
            "readiness_claim_allowed": False,
            "support_policy": "HIGH_SCAFFOLD",
        },
        "targets": [{
            "target_id": "TARGET-1",
            "owner_ref": "Q1",
            "summary": "Demo target",
            "identity": {
                "state": "EXACT_CONFIRMED",
                "exact_ref": "QUESTION-1",
                "candidate_refs": [],
                "resolution_basis": "Exact owner ref",
            },
            "authority": {
                "target_authority": "OWNER_FIXED",
                "direct_source_use": "HOLD",
                "instructional_demand_use": "ALLOWED",
                "assessment_claim": "HOLD",
            },
            "source_custody_state": "HOLD",
            "demand_moves": [{
                "move_id": "MOVE-1",
                "description": "Apply established capability.",
                "decision_type": "DECIDE",
                "provenance_class": "AUTHORED_ANALYSIS",
                "required_capability_refs": ["CAP-1"],
                "unresolved_capability_descriptions": [],
                "closure": {
                    "state": "ESTABLISHED_CURRENT_SCOPE",
                    "canonical_refs": ["CAP-1"],
                    "bridge_candidate_ref": None,
                    "hold_close_when": None,
                },
            }],
            "aggregate_route_state": "REACHABLE",
            "target_route": [{
                "sequence": 1,
                "kind": "CORE2A",
                "ref": "PRACTICE-1",
                "prepares_move_refs": ["MOVE-1"],
                "reason": "Familiar preparation for the target move.",
            }, {
                "sequence": 2,
                "kind": "TARGET",
                "ref": "TARGET-1",
                "prepares_move_refs": ["MOVE-1"],
                "reason": "Attempt fixed target.",
            }],
            "terminal_block": None,
        }],
        "bridge_candidates": [],
        "core_demand_influences": [{
            "core_role": "CORE1A",
            "projection_ref": "PROJECTION-1",
            "demand_influence_refs": [{
                "target_ref": "TARGET-1",
                "influence": "Emphasize the canonical decision needed by the target.",
            }],
        }],
        "validation": {
            "all_fixed_targets_accounted_for": True,
            "generic_practice_not_used_as_target_closure": True,
            "core1_family_scope_unchanged": True,
            "owner_waiver_not_treated_as_mastery": True,
        },
    }


class TargetDemandRoutingContractTests(unittest.TestCase):
    def test_blueprint_contract_is_complete(self):
        report = target_demand_routing_contract.audit_contract()
        self.assertTrue(report["passed"], report["findings"])
        self.assertEqual(report["contract_version"], "1.0")

    def test_route_artifact_schema_and_semantic_checks_pass(self):
        findings = target_demand_routing_contract.validate_route_artifact(valid_artifact())
        self.assertEqual(findings, [])

    def test_owner_fixed_target_can_be_instructional_when_direct_source_use_is_held(self):
        artifact = valid_artifact()
        authority = artifact["targets"][0]["authority"]
        self.assertEqual(authority["target_authority"], "OWNER_FIXED")
        self.assertEqual(authority["direct_source_use"], "HOLD")
        self.assertEqual(authority["instructional_demand_use"], "ALLOWED")

    def test_owner_waiver_does_not_enable_readiness_claim(self):
        artifact = valid_artifact()
        self.assertTrue(artifact["learner_context"]["owner_routing_waiver"])
        self.assertFalse(artifact["learner_context"]["readiness_claim_allowed"])

    def test_authorable_extension_requires_content_bearing_bridge(self):
        artifact = valid_artifact()
        move = artifact["targets"][0]["demand_moves"][0]
        move["closure"] = {
            "state": "AUTHORABLE_EXTENSION",
            "canonical_refs": [],
            "bridge_candidate_ref": "BRIDGE-1",
            "hold_close_when": "Bridge admitted.",
        }
        findings = target_demand_routing_contract.validate_route_artifact(artifact)
        self.assertIn("AUTHORABLE_EXTENSION_WITHOUT_BRIDGE:TARGET-1:MOVE-1", findings)

    def test_blocked_target_requires_terminal_close_condition(self):
        artifact = valid_artifact()
        artifact["targets"][0]["aggregate_route_state"] = "BLOCKED"
        artifact["targets"][0]["target_route"] = []
        findings = target_demand_routing_contract.validate_route_artifact(artifact)
        self.assertIn("TARGET_BLOCKED_WITHOUT_TERMINAL:TARGET-1", findings)

    def test_route_nodes_must_prepare_real_target_moves(self):
        artifact = valid_artifact()
        artifact["targets"][0]["target_route"][0]["prepares_move_refs"] = ["MOVE-NOT-THERE"]
        findings = target_demand_routing_contract.validate_route_artifact(artifact)
        self.assertTrue(any(x.startswith("ROUTE_UNKNOWN_MOVE:TARGET-1") for x in findings))


if __name__ == "__main__":
    unittest.main()
