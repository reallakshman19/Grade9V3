import copy
import json
import unittest
from pathlib import Path

from Shared.tools import learning_product_appendix_contract


REPO = Path(__file__).resolve().parents[1]
FIXTURE = REPO / "tests" / "fixtures" / "learner-product-appendix-example.json"


class LearningProductAppendixContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fixture = json.loads(FIXTURE.read_text(encoding="utf-8"))
        cls.contracts = learning_product_appendix_contract.load_contracts()

    def test_contract_document_is_structurally_complete(self):
        report = learning_product_appendix_contract.audit_contracts()
        self.assertTrue(report["passed"], report["findings"])
        self.assertEqual(report["toolkit_version"], "1.0")
        self.assertEqual(report["audit_version"], "1.0")

    def test_provenance_safe_speed_card_passes(self):
        findings = learning_product_appendix_contract.validate_toolkit_card(
            self.fixture["toolkit_card"],
            self.contracts["toolkit"],
        )
        self.assertEqual(findings, [])

    def test_speed_card_requires_domain_failure_domain_and_provenance(self):
        card = copy.deepcopy(self.fixture["toolkit_card"])
        card["valid_when"] = []
        card["fails_when"] = []
        card["provenance"] = "UNDECLARED"
        findings = learning_product_appendix_contract.validate_toolkit_card(
            card,
            self.contracts["toolkit"],
        )
        self.assertIn("TOOLKIT_ARRAY_INVALID:valid_when", findings)
        self.assertIn("TOOLKIT_ARRAY_INVALID:fails_when", findings)
        self.assertIn("TOOLKIT_PROVENANCE_INVALID", findings)

    def test_complete_audit_fixture_passes(self):
        findings = learning_product_appendix_contract.validate_audit_report(
            self.fixture["audit_report"],
            self.contracts["audit"],
        )
        self.assertEqual(findings, [])

    def test_structural_pass_cannot_imply_publication_readiness(self):
        report = copy.deepcopy(self.fixture["audit_report"])
        for claim in report["claims"]:
            if claim["claim"] == "ACADEMICALLY_REVIEWED":
                claim["state"] = "HOLD"
                claim["evidence_refs"] = []
        findings = learning_product_appendix_contract.validate_audit_report(
            report,
            self.contracts["audit"],
        )
        self.assertIn(
            "AUDIT_PUBLICATION_READY_UPSTREAM_NOT_PASS:ACADEMICALLY_REVIEWED",
            findings,
        )

    def test_publication_ready_requires_every_gate_resolved(self):
        report = copy.deepcopy(self.fixture["audit_report"])
        gate = next(
            row for row in report["gates"] if row["gate"] == "MATH_RENDERING"
        )
        gate["state"] = "HOLD"
        gate["evidence_refs"] = []
        findings = learning_product_appendix_contract.validate_audit_report(
            report,
            self.contracts["audit"],
        )
        self.assertIn(
            "AUDIT_PUBLICATION_READY_GATE_UNRESOLVED:MATH_RENDERING",
            findings,
        )

    def test_source_verification_is_explicit_even_when_not_applicable(self):
        report = copy.deepcopy(self.fixture["audit_report"])
        source = next(
            row for row in report["claims"] if row["claim"] == "SOURCE_VERIFIED"
        )
        source.pop("rationale")
        findings = learning_product_appendix_contract.validate_audit_report(
            report,
            self.contracts["audit"],
        )
        self.assertIn("AUDIT_CLAIM_NA_WITHOUT_RATIONALE:SOURCE_VERIFIED", findings)

    def test_source_verified_claim_matches_source_fidelity_gate(self):
        report = copy.deepcopy(self.fixture["audit_report"])
        source = next(
            row for row in report["claims"] if row["claim"] == "SOURCE_VERIFIED"
        )
        source["state"] = "PASS"
        source["evidence_refs"] = ["fixture_source_review"]
        source.pop("rationale")
        findings = learning_product_appendix_contract.validate_audit_report(
            report,
            self.contracts["audit"],
        )
        self.assertIn(
            "AUDIT_SOURCE_CLAIM_GATE_MISMATCH:PASS:NOT_APPLICABLE",
            findings,
        )

    def test_visual_gate_requires_semantic_elements_not_only_a_label(self):
        report = copy.deepcopy(self.fixture["audit_report"])
        visual = next(
            row for row in report["gates"] if row["gate"] == "VISUAL_SEMANTIC_BINDING"
        )
        visual["details"]["present_elements"] = ["state"]
        findings = learning_product_appendix_contract.validate_audit_report(
            report,
            self.contracts["audit"],
        )
        self.assertTrue(
            any(
                finding.startswith("AUDIT_VISUAL_REQUIRED_ELEMENT_ABSENT:")
                for finding in findings
            ),
            findings,
        )

    def test_visual_gate_requires_explicit_semantic_review(self):
        report = copy.deepcopy(self.fixture["audit_report"])
        visual = next(
            row for row in report["gates"] if row["gate"] == "VISUAL_SEMANTIC_BINDING"
        )
        visual["details"]["semantic_review"] = False
        findings = learning_product_appendix_contract.validate_audit_report(
            report,
            self.contracts["audit"],
        )
        self.assertIn("AUDIT_VISUAL_SEMANTIC_REVIEW_NOT_PASSED", findings)

    def test_zero_defect_style_overclaim_is_rejected(self):
        report = copy.deepcopy(self.fixture["audit_report"])
        report["overall_claim"] = "Zero defect publication"
        findings = learning_product_appendix_contract.validate_audit_report(
            report,
            self.contracts["audit"],
        )
        self.assertIn("AUDIT_FORBIDDEN_OVERCLAIM:ZERO_DEFECT", findings)

    def test_nested_zero_defect_style_overclaim_is_rejected(self):
        report = copy.deepcopy(self.fixture["audit_report"])
        provenance = next(
            row for row in report["gates"] if row["gate"] == "FIELD_LEVEL_PROVENANCE"
        )
        provenance["details"] = {
            "review_note": "Certified zero-defect publication."
        }
        findings = learning_product_appendix_contract.validate_audit_report(
            report,
            self.contracts["audit"],
        )
        self.assertIn("AUDIT_FORBIDDEN_OVERCLAIM:ZERO_DEFECT", findings)


if __name__ == "__main__":
    unittest.main()
