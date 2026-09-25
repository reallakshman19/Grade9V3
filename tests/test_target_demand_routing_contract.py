import copy
import json
import unittest
from pathlib import Path

from Shared.tools import target_demand_routing_contract


REPO = Path(__file__).resolve().parents[1]
BANK = REPO / "Physics" / "library" / "exam-bank" / "competitive-exam-question-bank.v2.json"


def identity(exact_ref="QUESTION-1"):
    return {
        "state": "EXACT_CONFIRMED",
        "exact_ref": exact_ref,
        "candidate_refs": [exact_ref],
        "candidate_set_provenance": "Owner exact ref.",
        "demand_fingerprint": {
            "setup": "demo setup",
            "requested_output": "demo output",
            "special_condition": None,
            "answer_type": "demo",
            "distinctive_transformation": "demo decision",
        },
        "discriminating_features": [],
        "rejected_candidates": [],
        "resolution_decision": "Exact ref supplied.",
        "resolution_reviewer": "owner",
        "identity_confidence": "HIGH",
    }


def move(move_id="MOVE-1", target_id="TARGET-1"):
    return {
        "move_id": move_id,
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
        "coverage": {
            "entry_task_ref": "ENTRY-1",
            "teaching_refs": ["TEACH-1"],
            "supported_attempt_refs": ["GUIDED-1"],
            "independent_evidence_refs": ["INDEPENDENT-1"],
            "target_use_ref": target_id,
            "coverage_state": "INDEPENDENT_EVIDENCE",
        },
    }


def valid_artifact():
    return {
        "schema_version": "1.1.0",
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
            "identity": identity(),
            "authority": {
                "target_authority": "OWNER_FIXED",
                "direct_source_use": "HOLD",
                "instructional_demand_use": "ALLOWED",
                "assessment_claim": "HOLD",
            },
            "source_custody_state": "HOLD",
            "demand_moves": [move()],
            "coverage_state": "INDEPENDENT_EVIDENCE_COMPLETE",
            "authorization_state": "READY",
            "preparation_state": "PREPARED",
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
                "move_ref": "MOVE-1",
                "observable_teaching_change": "Require the learner to state the decision before selecting an equation.",
                "affected_blocks": ["worked_anchor", "exit_task"],
            }],
        }],
        "validation": {
            "all_fixed_targets_accounted_for": True,
            "all_required_moves_have_coverage_ledgers": True,
            "generic_practice_not_used_as_target_closure": True,
            "core1_family_scope_unchanged": True,
            "owner_waiver_not_treated_as_mastery": True,
            "owner_waiver_not_used_to_bypass_academic_review": True,
            "blocked_target_counted_as_prepared": False,
            "fixed_target_preparation_acceptance": "PASS",
        },
    }


def find_questions(bank, wanted):
    out = {}
    def walk(value):
        if isinstance(value, list):
            for item in value:
                walk(item)
        elif isinstance(value, dict):
            qid = value.get("id")
            if qid in wanted:
                out[qid] = value
            for item in value.values():
                walk(item)
    walk(bank)
    return out


class TargetDemandRoutingContractTests(unittest.TestCase):
    def test_blueprint_contract_is_complete(self):
        report = target_demand_routing_contract.audit_contract()
        self.assertTrue(report["passed"], report["findings"])
        self.assertEqual(report["contract_version"], "1.1")

    def test_route_artifact_schema_and_semantic_checks_pass(self):
        findings = target_demand_routing_contract.validate_route_artifact(valid_artifact())
        self.assertEqual(findings, [])

    def test_owner_fixed_target_can_be_instructional_when_direct_source_use_is_held(self):
        authority = valid_artifact()["targets"][0]["authority"]
        self.assertEqual(authority["target_authority"], "OWNER_FIXED")
        self.assertEqual(authority["direct_source_use"], "HOLD")
        self.assertEqual(authority["instructional_demand_use"], "ALLOWED")

    def test_owner_waiver_does_not_enable_readiness_or_academic_review_claim(self):
        artifact = valid_artifact()
        self.assertTrue(artifact["learner_context"]["owner_routing_waiver"])
        self.assertFalse(artifact["learner_context"]["readiness_claim_allowed"])
        bridge = {
            "bridge_id": "BRIDGE-1",
            "target_refs": ["TARGET-1"],
            "teaching_goal": "Teach a bounded extension.",
            "prerequisite_refs": ["CAP-1"],
            "mathematical_prerequisite_refs": [],
            "required_new_capabilities": ["EXT-CAP-1"],
            "grade_scope_decision": "BOUNDED_ADVANCED_ROUTE",
            "construction": ["Step one.", "Step two."],
            "representation_requirements": ["Show the changed model."],
            "worked_anchor": {
                "prompt": "Demo.",
                "reasoning_route": ["Step one.", "Step two."],
                "answer": "Demo answer.",
                "check": "Demo check.",
            },
            "worked_solution_check": "Independently recomputed.",
            "misconceptions": [{
                "wrong_idea": "Wrong.",
                "diagnostic": "Ask why.",
                "repair": "Repair it.",
            }],
            "independent_check": "Limit check.",
            "exit_task": "Independent task.",
            "independent_transfer_ref": "TRANSFER-1",
            "authority_state": "CANDIDATE",
            "academic_review": {
                "reviewer": None,
                "decision": "PENDING",
                "evidence": None,
                "limitations": "Awaiting academic review.",
            },
        }
        artifact["bridge_candidates"] = [bridge]
        target = artifact["targets"][0]
        target["demand_moves"][0]["closure"] = {
            "state": "AUTHORABLE_EXTENSION",
            "canonical_refs": [],
            "bridge_candidate_ref": "BRIDGE-1",
            "hold_close_when": "Bridge is academically admitted.",
        }
        target["authorization_state"] = "READY"
        findings = target_demand_routing_contract.validate_route_artifact(artifact)
        self.assertIn("READY_WITH_UNADMITTED_EXTENSION:TARGET-1:MOVE-1", findings)

    def test_prepared_requires_independent_evidence_and_authorization(self):
        artifact = valid_artifact()
        target = artifact["targets"][0]
        target["coverage_state"] = "SUPPORTED_ONLY"
        target["demand_moves"][0]["coverage"]["coverage_state"] = "SUPPORTED_EVIDENCE"
        target["demand_moves"][0]["coverage"]["independent_evidence_refs"] = []
        findings = target_demand_routing_contract.validate_route_artifact(artifact)
        self.assertIn("PREPARED_WITHOUT_INDEPENDENT_COVERAGE:TARGET-1", findings)

        artifact = valid_artifact()
        artifact["targets"][0]["authorization_state"] = "ACADEMIC_REVIEW_HOLD"
        findings = target_demand_routing_contract.validate_route_artifact(artifact)
        self.assertIn("PREPARED_WITHOUT_AUTHORIZATION:TARGET-1", findings)

    def test_blocked_target_is_valid_diagnostic_but_cannot_pass_preparation_acceptance(self):
        artifact = valid_artifact()
        target = artifact["targets"][0]
        target["preparation_state"] = "BLOCKED"
        target["coverage_state"] = "INCOMPLETE"
        target["demand_moves"][0]["coverage"] = {
            "entry_task_ref": None,
            "teaching_refs": [],
            "supported_attempt_refs": [],
            "independent_evidence_refs": [],
            "target_use_ref": "TARGET-1",
            "coverage_state": "UNTAUGHT",
        }
        target["target_route"] = []
        target["terminal_block"] = {
            "reason": "Capability not admitted.",
            "closes_when": "Academic review admits the capability.",
        }
        artifact["validation"]["fixed_target_preparation_acceptance"] = "PASS"
        findings = target_demand_routing_contract.validate_route_artifact(artifact)
        self.assertIn("BLOCKED_TARGET_COUNTED_AS_PREPARED", findings)
        self.assertIn("PREPARATION_ACCEPTANCE_PASS_WITH_NONPREPARED_TARGET", findings)

    def test_semantic_identity_resolution_requires_documented_candidate_review(self):
        artifact = valid_artifact()
        identity_row = artifact["targets"][0]["identity"]
        identity_row["state"] = "SEMANTIC_MATCH_RESOLVED"
        identity_row["candidate_refs"] = ["A", "B"]
        identity_row["exact_ref"] = "A"
        identity_row["candidate_set_provenance"] = None
        identity_row["discriminating_features"] = []
        identity_row["rejected_candidates"] = []
        identity_row["resolution_reviewer"] = None
        findings = target_demand_routing_contract.validate_route_artifact(artifact)
        self.assertTrue(any(x.startswith("SEMANTIC_IDENTITY_MISSING_EVIDENCE:TARGET-1") for x in findings))

    def test_demand_influence_must_reference_real_move(self):
        artifact = valid_artifact()
        artifact["core_demand_influences"][0]["demand_influence_refs"][0]["move_ref"] = "MOVE-NOT-THERE"
        findings = target_demand_routing_contract.validate_route_artifact(artifact)
        self.assertIn("INFLUENCE_UNKNOWN_MOVE:TARGET-1:MOVE-NOT-THERE", findings)

    def test_cross_topic_counterexamples_are_not_projectile_only(self):
        bank = json.loads(BANK.read_text(encoding="utf-8"))
        ids = {
            "PYQ-PHY-IITJEE-2011-P2-Q33",
            "PYQ-PHY-IITJEE-2012-P1-Q05",
            "PYQ-PHY-IITJEE-2011-P2-Q26",
        }
        rows = find_questions(bank, ids)
        self.assertEqual(set(rows), ids)

        q14 = rows["PYQ-PHY-IITJEE-2011-P2-Q33"]
        q20 = rows["PYQ-PHY-IITJEE-2012-P1-Q05"]
        q24 = rows["PYQ-PHY-IITJEE-2011-P2-Q26"]

        q14_actions = " ".join(step["action"] for step in q14["answer"]["reasoning_route"])
        q20_actions = " ".join(step["action"] for step in q20["answer"]["reasoning_route"])
        q24_actions = " ".join(step["action"] for step in q24["answer"]["reasoning_route"])

        self.assertIn("accelerating train", q14_actions)
        self.assertIn("spring extension", q20_actions)
        self.assertIn("momentum", q24_actions.lower())
        self.assertIn("CAP-NLM-SECOND-LAW", q24["secondary_capability_refs"])

        # The falsifier: a planner that keeps only the shared projectile primary would erase
        # the decisive cross-topic move in all three source-grounded targets.
        self.assertEqual(q14["primary_capability_ref"], "CAP-KIN-PROJECTILE-MODEL")
        self.assertEqual(q20["primary_capability_ref"], "CAP-KIN-PROJECTILE-MODEL")
        self.assertEqual(q24["primary_capability_ref"], "CAP-KIN-PROJECTILE-MODEL")
        self.assertNotEqual(q14_actions, q20_actions)
        self.assertNotEqual(q20_actions, q24_actions)


if __name__ == "__main__":
    unittest.main()
