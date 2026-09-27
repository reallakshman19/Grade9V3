import json
import re
import unittest
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEDGER = ROOT / "docs" / "stress-tests" / "polynomials-agent1" / "source-ledger.json"
HTML = ROOT / "docs" / "stress-tests" / "polynomials-agent1" / "index.html"
MARKDOWN = ROOT / "docs" / "stress-tests" / "scanned-assessment-m2-polynomials-ledger.md"


class Issue302PolynomialsEvidenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(LEDGER.read_text(encoding="utf-8"))
        cls.html = HTML.read_text(encoding="utf-8")
        cls.markdown = MARKDOWN.read_text(encoding="utf-8")
        cls.rows = {row["id"]: row for row in cls.data["ledger"]["rows"]}
        cls.findings = {item["id"]: item for item in cls.data["verification_findings"]}

    def test_exact_source_basis_and_current_evidence_head_are_pinned(self):
        source = self.data["source_basis"]
        repo = self.data["repository_basis"]
        self.assertEqual(source["acquisition_id"], "ACQ-1DD05CE5AA04B532EC68")
        self.assertEqual(source["bucket_id"], "MAT-09-POLYNOMIALS")
        self.assertEqual(source["registered_source"], "m2.pdf")
        self.assertEqual(
            source["source_sha256"],
            "1dd05ce5aa04b532ec68c4054f55af1677ecb210be00b8f3085d6f29215a230c",
        )
        self.assertEqual(source["page_count"], 49)
        self.assertEqual(source["in_scope_pdf_pages"], list(range(1, 12)))
        self.assertIsNone(source["page_map"])
        self.assertEqual(repo["source_pr"], 306)
        self.assertEqual(
            repo["source_pr_head"],
            "7bf9ca0ae01f8555c4df0b1ff7c74180d5693766",
        )

    def test_complete_coverage_cannot_be_claimed_from_27_rows(self):
        ledger = self.data["ledger"]
        inventory = ledger["declared_key_inventory"]
        self.assertEqual(ledger["question_count"], 27)
        self.assertEqual(len(ledger["rows"]), 27)
        self.assertEqual(inventory["minimum_keyed_items_excluding_free_response"], 117)
        self.assertLess(ledger["question_count"], inventory["minimum_keyed_items_excluding_free_response"])
        self.assertTrue(ledger["coverage_status"].startswith("PARTIAL_"))
        self.assertIn("FIND-COMPLETENESS-001", self.findings)
        self.assertFalse(self.data["validation"]["ledger_complete"])

    def test_current_provider_readback_does_not_claim_hidden_source_bytes(self):
        access = self.data["source_access"]
        checks = access["current_executor_provider_checks"]
        self.assertEqual(
            access["status"],
            "PUBLISHED_ROWS_AVAILABLE_SOURCE_BYTES_NOT_PROVIDER_REPRODUCIBLE",
        )
        self.assertFalse(checks["source_cache_present_in_pr_tree"])
        self.assertFalse(checks["m2_pdf_present_in_pr_tree"])
        self.assertFalse(checks["m2_pages_json_present_in_pr_tree"])
        self.assertFalse(checks["polynomials_evidence_card_corpus_present"])
        self.assertIn("FIND-PROVENANCE-001", self.findings)

    def test_sc01_transcribed_math_equals_option_a_not_published_key_d(self):
        row = self.rows["Q-MAT-09-POL-P01-SC-01"]
        samples = [
            (Fraction(1, 5), Fraction(1, 3)),
            (Fraction(2, 3), Fraction(-1, 4)),
            (Fraction(3, 2), Fraction(2, 5)),
        ]
        for x, y in samples:
            z = 1 - x - y
            lhs = 1 - 3 * (x*x + y*y + z*z) + 2 * (x**3 + y**3 + z**3)
            self.assertEqual(lhs, 6*x*y*z)
        self.assertEqual(row["options"]["A"], "6xyz")
        self.assertEqual(row["source_answer"], "D")
        self.assertEqual(row["independent_comparison_status"], "CONFLICT_MATH_VS_PUBLISHED_KEY")
        self.assertIn("FIND-MATH-001", self.findings)

    def test_sc14_transcribed_math_equals_option_c_not_published_key_d(self):
        row = self.rows["Q-MAT-09-POL-P02-SC-14"]
        for x, y, z in [(1, 2, 3), (2, -1, 4), (-3, 5, 1)]:
            lhs = (x + 2*y + 2*z)**3 + (x - 2*y - 2*z)**3
            rhs = 2*x*(x*x + 12*(y+z)**2)
            self.assertEqual(lhs, rhs)
        self.assertEqual(row["source_answer"], "D")
        self.assertEqual(row["independent_comparison_status"], "CONFLICT_MATH_VS_PUBLISHED_KEY")
        self.assertIn("FIND-MATH-002", self.findings)

    def test_sc18_exact_radical_value_conflicts_with_published_key(self):
        row = self.rows["Q-MAT-09-POL-P03-SC-18"]

        def add(u, v):
            return (u[0] + v[0], u[1] + v[1])

        def mul(u, v):
            # (a+b*sqrt(2))(c+d*sqrt(2))
            return (u[0]*v[0] + 2*u[1]*v[1], u[0]*v[1] + u[1]*v[0])

        def power(u, n):
            out = (1, 0)
            for _ in range(n):
                out = mul(out, u)
            return out

        x = (1, 1)
        value = add(add(power(x, 4), tuple(2*q for q in power(x, 3))), (3, 0))
        self.assertEqual(value, (34, 22))  # 34 + 22*sqrt(2)
        self.assertEqual(row["source_answer"], "B")
        self.assertEqual(row["independent_comparison_status"], "CONFLICT_MATH_VS_PUBLISHED_KEY")
        self.assertIn("FIND-MATH-003", self.findings)

    def test_selection_is_provisional_not_admitted(self):
        explorer = self.data["explorer_admission"]
        clinics = self.data["clinic_ranking"]
        self.assertIsNone(explorer["current_recommendation"])
        self.assertIsNotNone(explorer["provisional_recommendation"])
        self.assertIn("PROVISIONAL_BLOCKED", explorer["current_status"])
        self.assertEqual(clinics["current_candidates"], [])
        self.assertTrue(3 <= len(clinics["provisional_candidates"]) <= 6)
        self.assertIn("PROVISIONAL_BLOCKED", clinics["current_status"])
        self.assertFalse(self.data["validation"]["explorer_decision_complete"])
        self.assertFalse(self.data["validation"]["clinic_ranking_complete"])

    def test_master_key_inventory_is_explicit_and_reconciled(self):
        inv = self.data["answer_key_inventory"]
        rec = inv["reconciliation"]
        self.assertEqual(inv["total_keyed_entries"], 117)
        self.assertEqual(rec["linked_machine_rows"], 24)
        self.assertEqual(rec["matching_machine_rows"], 16)
        self.assertEqual(rec["conflicting_machine_rows"], 8)
        self.assertEqual(rec["unlinked_key_entries"], 93)
        conflict_rows = {item["row_id"] for item in rec["conflicts"]}
        self.assertEqual(
            conflict_rows,
            {
                "Q-MAT-09-POL-P01-FIB-03",
                "Q-MAT-09-POL-P01-FIB-04",
                "Q-MAT-09-POL-P01-FIB-05",
                "Q-MAT-09-POL-P01-FIB-06",
                "Q-MAT-09-POL-P01-TF-03",
                "Q-MAT-09-POL-P01-TF-04",
                "Q-MAT-09-POL-P03-SC-08",
                "Q-MAT-09-POL-P05-HOTS-05",
            },
        )
        self.assertIn("FIND-KEYMAP-001", self.findings)
        self.assertFalse(self.data["validation"]["answer_custody_complete"])

    def test_pr306_movement_did_not_change_polynomials_evidence_basis(self):
        repo = self.data["repository_basis"]
        self.assertEqual(
            repo["polynomials_evidence_commit"],
            "7bf9ca0ae01f8555c4df0b1ff7c74180d5693766",
        )
        self.assertEqual(
            repo["source_pr_current_head"],
            "d6a5753ca2d360e2f27162c167b6155d1d06519e",
        )
        self.assertTrue(repo["polynomials_evidence_blobs_unchanged_through_current_head"])

    def test_independent_math_audit_is_separate_from_source_fidelity(self):
        audit = self.data["independent_math_audit"]
        self.assertEqual(audit["scope"], "PUBLISHED_MACHINE_TRANSCRIPTIONS_ONLY")
        self.assertFalse(audit["source_fidelity_claim"])
        self.assertEqual(audit["rows_checked"], 27)
        self.assertEqual(
            audit["status_counts"],
            {
                "NO_MATH_CONTRADICTION_FOUND_IN_PUBLISHED_TRANSCRIPTION": 23,
                "MATH_CONFLICT_WITH_PUBLISHED_KEY_OR_TRANSCRIPTION": 2,
                "MATH_DERIVATION_ERROR_AND_KEY_CONFLICT": 1,
                "ASSERTION_REASON_LOGIC_REVIEW": 1,
            },
        )
        self.assertFalse(self.data["validation"]["independent_mathematics_complete"])

    def test_markdown_is_visibly_blocked_from_downstream_authority(self):
        self.assertTrue(self.markdown.startswith("> [!CAUTION]"))
        self.assertIn("PARTIAL / CONTRADICTORY", self.markdown)
        self.assertIn("117 keyed items", self.markdown)

    def test_html_embeds_same_machine_truth_and_is_touch_readable(self):
        match = re.search(
            r'<script id="evidence-json" type="application/json">(.*?)</script>',
            self.html,
            flags=re.S,
        )
        self.assertIsNotNone(match)
        embedded = json.loads(match.group(1).replace("<\\/", "</"))
        self.assertEqual(embedded, self.data)
        self.assertIn("min-height:48px", self.html)
        self.assertNotIn("cdn.jsdelivr.net", self.html)
        self.assertNotIn("https://", self.html)
        self.assertIn("EVIDENCE_PARTIAL_CONTRADICTORY", self.html)


if __name__ == "__main__":
    unittest.main()
