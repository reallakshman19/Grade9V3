import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CH2_JSON = ROOT / "docs" / "stress-tests" / "polynomials-agent1" / "source-ledger.json"
CH3_JSON = ROOT / "docs" / "stress-tests" / "coordinate-geometry" / "source-ledger.json"
CH4_JSON = ROOT / "docs" / "stress-tests" / "linear-equations" / "source-ledger.json"
CH5_JSON = ROOT / "docs" / "stress-tests" / "euclid-geometry" / "source-ledger.json"

CH2_HTML = ROOT / "docs" / "stress-tests" / "polynomials-agent1" / "index.html"
CH3_HTML = ROOT / "docs" / "stress-tests" / "coordinate-geometry" / "index.html"
CH4_HTML = ROOT / "docs" / "stress-tests" / "linear-equations" / "index.html"
CH5_HTML = ROOT / "docs" / "stress-tests" / "euclid-geometry" / "index.html"


class M2AllChaptersEvidenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.ch2 = json.loads(CH2_JSON.read_text(encoding="utf-8"))
        cls.ch3 = json.loads(CH3_JSON.read_text(encoding="utf-8"))
        cls.ch4 = json.loads(CH4_JSON.read_text(encoding="utf-8"))
        cls.ch5 = json.loads(CH5_JSON.read_text(encoding="utf-8"))

    def test_all_chapters_pin_exact_m2_source(self):
        sha = "1dd05ce5aa04b532ec68c4054f55af1677ecb210be00b8f3085d6f29215a230c"
        acq = "ACQ-1DD05CE5AA04B532EC68"
        for ch, name in [(self.ch2, "Ch 2"), (self.ch3, "Ch 3"), (self.ch4, "Ch 4"), (self.ch5, "Ch 5")]:
            src = ch.get("source_basis", {})
            self.assertEqual(src["acquisition_id"], acq, f"{name} acquisition id mismatch")
            self.assertEqual(src["source_sha256"], sha, f"{name} source sha256 mismatch")
            self.assertEqual(src["registered_source"], "m2.pdf", f"{name} registered source mismatch")

    def test_all_chapters_cover_in_scope_page_ranges(self):
        self.assertEqual(self.ch2["source_basis"]["in_scope_pdf_pages"], list(range(1, 12)))
        self.assertEqual(self.ch3["source_basis"]["in_scope_pdf_pages"], list(range(12, 25)))
        self.assertEqual(self.ch4["source_basis"]["in_scope_pdf_pages"], list(range(25, 42)))
        self.assertEqual(self.ch5["source_basis"]["in_scope_pdf_pages"], list(range(42, 50)))

    def test_ch2_reconciliation_is_not_misreported_as_verified_complete(self):
        rows = self.ch2.get("ledger", {}).get("rows", [])
        self.assertGreater(len(rows), 0)
        self.assertEqual(self.ch2["status"], "EVIDENCE_PARTIAL_CONTRADICTORY")
        self.assertFalse(self.ch2["validation"]["ledger_complete"])
        self.assertFalse(self.ch2["validation"]["answer_custody_complete"])
        self.assertFalse(self.ch2["validation"]["independent_mathematics_complete"])

    def test_other_published_chapters_keep_their_current_producer_status(self):
        for ch, name in [(self.ch3, "Ch 3"), (self.ch4, "Ch 4"), (self.ch5, "Ch 5")]:
            rows = ch.get("ledger", {}).get("rows") or ch.get("rows", [])
            self.assertGreater(len(rows), 0, f"{name} rows empty")
            self.assertEqual(ch["status"], "EVIDENCE_VERIFIED_COMPLETE", f"{name} producer status changed")

    def test_ch2_selection_is_provisional_during_reconciliation(self):
        self.assertIsNone(self.ch2["explorer_admission"]["current_recommendation"])
        self.assertIsNotNone(self.ch2["explorer_admission"]["provisional_recommendation"])
        self.assertIn("PROVISIONAL_BLOCKED", self.ch2["explorer_admission"]["current_status"])
        self.assertEqual(self.ch2["clinic_ranking"]["current_candidates"], [])
        self.assertGreater(len(self.ch2["clinic_ranking"]["provisional_candidates"]), 0)
        self.assertIn("PROVISIONAL_BLOCKED", self.ch2["clinic_ranking"]["current_status"])

    def test_other_published_chapter_selection_status_is_unchanged(self):
        self.assertTrue(self.ch3["explorer_recommendation"]["admission_test_passed"])
        self.assertTrue(self.ch4["explorer_recommendation"]["admission_test_passed"])
        self.assertTrue(self.ch5["explorer_recommendation"]["admission_test_passed"])
        self.assertGreater(len(self.ch3["clinic_candidates"]), 0)
        self.assertGreater(len(self.ch4["clinic_candidates"]), 0)
        self.assertGreater(len(self.ch5["clinic_candidates"]), 0)

    def test_html_projections_exist_and_touch_compliant(self):
        for html_path, name in [
            (CH2_HTML, "Ch 2 HTML"),
            (CH3_HTML, "Ch 3 HTML"),
            (CH4_HTML, "Ch 4 HTML"),
            (CH5_HTML, "Ch 5 HTML"),
        ]:
            self.assertTrue(html_path.exists(), f"{name} missing")
            content = html_path.read_text(encoding="utf-8")
            self.assertTrue("min-height: 48px" in content or "min-height:48px" in content, f"{name} lacks 48px touch target")
            self.assertNotIn("cdn.jsdelivr.net", content, f"{name} contains external CDN")


if __name__ == "__main__":
    unittest.main()
