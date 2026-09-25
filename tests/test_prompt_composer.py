from __future__ import annotations

import copy
import json
import subprocess
import unittest
from pathlib import Path

from Shared.tools import prompt_composer, study_map

REPO = Path(__file__).resolve().parents[1]
FIXTURES = REPO / "tests/fixtures/prompt-composer"


class PromptComposerTests(unittest.TestCase):
    def load(self, name):
        return json.loads((FIXTURES / name).read_text(encoding="utf-8"))

    def test_nested_exam_bank_question_resolves_through_existing_study_map(self):
        mapping = {
            "worksheet_id": "NESTED-QUESTION-PROOF",
            "subject": "Physics",
            "questions": [{
                "question_id": "Q28",
                "primary_capability_ref": "CAP-KIN-2D-INDEPENDENT-COMPONENTS",
                "secondary_capability_refs": ["CAP-KIN-PROJECTILE-MODEL"],
                "mapping_basis": "CANONICAL_QUESTION",
                "canonical_question_ref": "PYQ-PHY-JEEMAIN-2026-04APR-S2-Q29",
            }],
        }
        report = study_map.resolve(mapping)
        self.assertTrue(report["passed"], report["findings"])

    def test_projectile_stress_set_preserves_fixed_target_authority_with_resolved_q15(self):
        result = prompt_composer.compose(self.load("projectile-stress-set.json"))
        self.assertTrue(result["passed"], result["prompt_brief"]["holds"])
        brief = result["prompt_brief"]
        self.assertEqual(brief["scope"]["matrix_ref"], "MATRIX-PHY-KIN-2D-MOTION")
        self.assertEqual(brief["scope"]["status"], "OWNER_CONFIRMED_CANONICAL_RUNG")
        q15 = next(row for row in brief["question_rows"] if row["owner_question_id"] == "Q15")
        self.assertEqual(q15["identity_status"], "EXACT_CONFIRMED")
        self.assertEqual(q15["canonical_question_ref"], "PYQ-PHY-JEEADV-2018-P2-Q08")
        self.assertEqual(q15["mapping_status"], "CANONICAL_MATCH")
        self.assertIn("uniquely matches", q15["candidate_set_provenance"])
        for row in brief["question_rows"]:
            self.assertEqual(row["target_authority"], "OWNER_FIXED")
            self.assertEqual(row["direct_source_use"], "HOLD")
            self.assertEqual(row["instructional_demand_use"], "ALLOWED")
            self.assertEqual(row["assessment_claim"], "HOLD")
        self.assertTrue(brief["learner_entry"]["owner_routing_waiver"])
        self.assertFalse(brief["learner_entry"]["readiness_claim_allowed"])
        self.assertEqual(brief["planner_handoff"]["state"], "READY_FOR_PLANNER")

    def test_semantic_identity_review_uses_separate_fixture_and_does_not_become_permanent_hold(self):
        result = prompt_composer.compose(self.load("identity-review.json"))
        self.assertTrue(result["passed"], result["prompt_brief"]["holds"])
        row = result["prompt_brief"]["question_rows"][0]
        self.assertEqual(row["identity_status"], "IDENTITY_REVIEW_REQUIRED")
        self.assertEqual(row["mapping_status"], "IDENTITY_REVIEW_REQUIRED")
        self.assertEqual(
            set(row["candidate_question_refs"]),
            {"PYQ-PHY-JEEADV-2018-P2-Q08", "PYQ-PHY-JEEADV-2023-P1-Q01"},
        )
        self.assertIn("Owner supplied candidate set", row["candidate_set_provenance"])
        self.assertFalse(any(h["point"] == "QUESTION_IDENTITY_AMBIGUOUS" for h in result["prompt_brief"]["holds"]))


    def test_target_route_output_is_required_for_every_fixed_target(self):
        result = prompt_composer.compose(self.load("projectile-stress-set.json"))
        route = result["prompt_brief"]["target_route_output"]
        self.assertTrue(route["required"])
        self.assertEqual(
            route["schema_path"],
            "Shared/library/target-demand-route.schema.json",
        )
        self.assertEqual(len(route["seed_rows"]), 5)
        self.assertEqual(
            {row["owner_question_id"] for row in route["seed_rows"]},
            {"Q28", "Q15", "Q21", "Q26", "Q23"},
        )
        q15 = next(row for row in route["seed_rows"] if row["owner_question_id"] == "Q15")
        self.assertEqual(q15["identity_status"], "EXACT_CONFIRMED")
        self.assertEqual(q15["canonical_question_ref"], "PYQ-PHY-JEEADV-2018-P2-Q08")
        self.assertIn("uniquely matches", q15["candidate_set_provenance"])


    def test_prompt_contains_clause_ids_role_refs_and_downstream_pdf_intent_without_rendering_pdf(self):
        result = prompt_composer.compose(self.load("projectile-stress-set.json"))
        text = result["agent_prompt"]
        for clause in [
            "GOAL_OUTCOME", "FIXED_SOURCE_QUESTIONS", "LEARNER_PROFILE",
            "EXECUTION_ORDER", "AUTHORITY_GRAPH", "TARGET_DEMAND_ROUTING", "LEARNER_PRODUCT_QUALITY", "TOPIC_BOUNDARY", "CORE_OBLIGATIONS",
            "DIFFICULTY_PROGRESSION", "PROVENANCE_TRACE", "ACCEPTANCE",
            "NON_GOALS", "HOLD_FAIL", "DOWNSTREAM_DELIVERABLE",
        ]:
            self.assertIn(f"[{clause}]", text)
        self.assertIn("Shared/roles/CORE1A.md", text)
        self.assertIn("learner percentage must not shrink", text.lower())
        self.assertIn("execution order is production control only", text.lower())
        self.assertIn("required authority = CANONICAL_ACADEMIC_TRUTH", text)
        self.assertIn("demand evidence and learner eligibility are independent states", text.lower())
        self.assertIn("question.primary_capability_ref", text)
        self.assertIn("extension demands do not become core1/core1a/core1b microtopics", text.lower())
        self.assertIn("Shared/library/target-demand-route.schema.json", text)
        self.assertIn("Generic easier practice cannot close a fixed target", text)
        self.assertIn("AUTHORABLE_EXTENSION", text)
        self.assertIn("Every move needs a coverage ledger", text)
        self.assertIn("PREPARED requires independent evidence", text)
        self.assertIn("candidate-set provenance", text)
        self.assertIn("observable teaching change", text)
        self.assertIn("Route validity and learner-product quality are separate claims", text)
        self.assertIn("TARGET_MOVE_CONNECTION", text)
        self.assertIn("owner routing waiver is on", text.lower())
        self.assertIn("#273 owns PDF publication", text)
        self.assertFalse(any(path.suffix == ".pdf" for path in (REPO / "public").rglob("*.pdf")))

    def test_blueprint_contract_is_embedded_by_reference_not_reinvented(self):
        result = prompt_composer.compose(self.load("math-linear-equation.json"))
        brief = result["prompt_brief"]
        self.assertEqual(
            brief["authority_contract"]["path"],
            "Shared/roles/CORE-AUTHORITY-CONTRACT.md",
        )
        self.assertRegex(brief["authority_contract"]["digest"], r"^sha256:[a-f0-9]{64}$")
        self.assertNotIn("primary_concept_id", result["agent_prompt"])
        self.assertIn(
            "A Core2 HOLD does not become academic authority",
            result["agent_prompt"],
        )
        self.assertEqual(
            brief["target_routing_contract"]["path"],
            "Shared/roles/TARGET-DEMAND-ROUTING-CONTRACT.md",
        )
        self.assertRegex(brief["target_routing_contract"]["digest"], r"^sha256:[a-f0-9]{64}$")
        self.assertEqual(
            brief["learner_product_contract"]["path"],
            "Shared/roles/LEARNER-PRODUCT-TEMPLATES.md",
        )
        self.assertRegex(brief["learner_product_contract"]["digest"], r"^sha256:[a-f0-9]{64}$")

    def test_mixed_subtopic_fails_closed(self):
        result = prompt_composer.compose(self.load("mixed-subtopic.json"))
        self.assertFalse(result["passed"])
        self.assertEqual(result["prompt_brief"]["scope"]["status"], "MIXED_SUBTOPIC_HOLD")
        self.assertTrue(any(h["status"] == "MIXED_SUBTOPIC_HOLD" for h in result["prompt_brief"]["holds"]))

    def test_unknown_exact_ref_does_not_fuzzy_match_short_label(self):
        result = prompt_composer.compose(self.load("unknown-question.json"))
        self.assertFalse(result["passed"])
        row = result["prompt_brief"]["question_rows"][0]
        self.assertEqual(row["mapping_status"], "UNMAPPED_HOLD")
        self.assertIsNone(row["primary_capability_ref"])
        self.assertTrue(any(h["point"] == "CANONICAL_QUESTION_UNKNOWN" for h in result["prompt_brief"]["holds"]))

    def test_agent_proposal_remains_pending_owner_review(self):
        doc = self.load("projectile-stress-set.json")
        doc["questions"] = [{
            "question_id": "P",
            "summary": "Agent-proposed mapping.",
            "mapping_basis": "AGENT_PROPOSAL",
            "primary_capability_ref": "CAP-KIN-PROJECTILE-MODEL",
            "secondary_capability_refs": ["CAP-KIN-2D-INDEPENDENT-COMPONENTS"],
        }]
        result = prompt_composer.compose(doc)
        self.assertFalse(result["passed"])
        self.assertEqual(result["prompt_brief"]["question_rows"][0]["mapping_status"], "AGENT_PROPOSAL_PENDING_REVIEW")

    def test_explicit_zero_is_preserved_and_absent_is_null(self):
        math = prompt_composer.compose(self.load("math-linear-equation.json"))
        self.assertEqual(math["prompt_brief"]["learner_entry"]["owner_estimate"]["knowledge_percentage"], 0)
        doc = self.load("math-linear-equation.json")
        doc.pop("learner")
        no_learner = prompt_composer.compose(doc)
        self.assertIsNone(no_learner["prompt_brief"]["learner_entry"])

    def test_source_basis_never_accepts_canonical_question_ids(self):
        doc = self.load("projectile-stress-set.json")
        doc["source_basis"] = ["PYQ-PHY-JEEADV-2022-P1-Q08"]
        result = prompt_composer.compose(doc)
        self.assertFalse(result["passed"])
        self.assertNotIn("source_basis", result["authoring_request"])
        self.assertTrue(any(h["point"] == "SOURCE_BASIS_QUESTION_ID_INVALID" for h in result["prompt_brief"]["holds"]))

    def test_cross_subject_math_uses_same_composer(self):
        result = prompt_composer.compose(self.load("math-linear-equation.json"))
        self.assertTrue(result["passed"], result["prompt_brief"]["holds"])
        row = result["prompt_brief"]["question_rows"][0]
        self.assertEqual(row["primary_capability_ref"], "CAP-MATH-ISOLATE")
        self.assertEqual(row["primary_location"]["matrix_id"], "MATRIX-MATH-LINEAR-EQUATIONS")
        self.assertEqual(row["primary_location"]["rung"], "R2")

    def test_digest_is_deterministic_and_input_change_is_visible(self):
        doc = self.load("projectile-stress-set.json")
        a = prompt_composer.compose(copy.deepcopy(doc))
        b = prompt_composer.compose(copy.deepcopy(doc))
        self.assertEqual(a["prompt_brief"]["input_digest"], b["prompt_brief"]["input_digest"])
        self.assertEqual(a["prompt_brief"]["prompt_digest"], b["prompt_brief"]["prompt_digest"])
        changed = copy.deepcopy(doc)
        changed["learner"]["owner_estimate"]["knowledge_percentage"] = 51
        c = prompt_composer.compose(changed)
        self.assertNotEqual(a["prompt_brief"]["input_digest"], c["prompt_brief"]["input_digest"])
        self.assertNotEqual(a["prompt_brief"]["prompt_digest"], c["prompt_brief"]["prompt_digest"])

    def test_hostile_summary_is_preserved_as_data_not_executed_markup(self):
        doc = self.load("math-linear-equation.json")
        doc["questions"][0]["summary"] = "<script>globalThis.pwned=true</script>"
        result = prompt_composer.compose(doc)
        self.assertIn("<script>globalThis.pwned=true</script>", result["agent_prompt"])
        self.assertEqual(result["prompt_brief"]["question_rows"][0]["summary"], "<script>globalThis.pwned=true</script>")


    def test_browser_parity_syntax_and_generated_projection_checks(self):
        commands = [
            ["node", "--check", "public/js/core-prompt-composer.js"],
            ["node", "--check", "public/js/topic-atlas.js"],
            ["node", "--test", "tests/prompt_composer.test.mjs"],
            ["python3", "Shared/tools/build_prompt_composer_data.py", "--check"],
        ]
        for command in commands:
            completed = subprocess.run(
                command,
                cwd=REPO,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                check=False,
            )
            self.assertEqual(
                completed.returncode,
                0,
                f"{' '.join(command)} failed:\n{completed.stdout}",
            )


if __name__ == "__main__":
    unittest.main()
