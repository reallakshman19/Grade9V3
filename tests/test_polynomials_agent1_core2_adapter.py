import copy
import importlib.util
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODULE = ROOT / "Shared" / "tools" / "adapt_polynomials_agent1_ledger.py"
PUBLISHED = ROOT / "docs" / "stress-tests" / "polynomials-agent1" / "source-ledger.json"
spec = importlib.util.spec_from_file_location("polynomials_adapter", MODULE)
adapter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(adapter)


def ready_row(i: int) -> dict:
    return {
        "id": f"READY-Q-{i:03d}",
        "page": 1 + ((i - 1) % 9),
        "book_page": f"2.{21 + 1 + ((i - 1) % 9):02d}",
        "section": "ASSESSMENT_CORNER" if i < 100 else "HOTS",
        "type": "SINGLE_CHOICE" if i == 1 else "FILL_IN_THE_BLANKS",
        "source_label": str(i),
        "stem": f"Synthetic admitted source row {i}.",
        "options": {"A": "alpha", "B": "beta"} if i == 1 else None,
        "source_answer": "A" if i == 1 else str(i),
        "source_answer_status": "PRESENT",
        "independent_derivation": f"VERIFICATION ANALYSIS MUST NOT LEAK {i}",
        "mathematical_family": "Definitions & Degree",
        "hardness": {"C": "C0", "R": "R0", "M": "M0", "A": "A0", "S": "S0", "overall": "EASY"},
        "fidelity_status": "VERIFIED",
        "source_readback_status": "DIRECT_REGISTERED_SOURCE_VERIFIED",
        "independent_comparison_status": "MATCH",
        "figure": {"state": "ABSENT"},
    }


def ready_ledger(row_count: int = 4) -> dict:
    rows = [ready_row(i) for i in range(1, row_count + 1)]
    return {
        "schema": adapter.SOURCE_SCHEMA,
        "status": "EVIDENCE_VERIFIED_COMPLETE",
        "issue": {"disposition": "SATISFIED"},
        "repository_basis": {"source_pr_head": "a" * 40},
        "source_basis": {
            "acquisition_id": adapter.EXPECTED_ACQUISITION,
            "resource_ref": "SRC-BOOK-MATH-CH2-CH3",
            "source_sha256": adapter.EXPECTED_SOURCE_SHA256,
            "rights": "COPYRIGHTED_OWNED_COPY",
        },
        "source_access": {
            "status": "OWNER_UPLOADED_REGISTERED_SOURCE",
            "source_sha256": adapter.EXPECTED_SOURCE_SHA256,
            "byte_length": adapter.EXPECTED_SOURCE_BYTES,
            "page_count": adapter.EXPECTED_SOURCE_PAGES,
        },
        "ledger": {
            "question_count": len(rows),
            "coverage_status": "COMPLETE_PAGES_1_TO_11",
            "coverage_receipt": {
                "question_pages": list(range(1, 10)),
                "answer_pages": [10, 11],
                "row_count": len(rows),
            },
            "rows": rows,
        },
        "validation": {
            "source_identity_locked": True,
            "source_text_fidelity_validated": True,
            "ledger_complete": True,
            "answer_custody_complete": True,
            "independent_mathematics_complete": True,
        },
    }


class PolynomialsAgent1AdapterTests(unittest.TestCase):
    def test_current_published_ledger_is_fail_closed(self):
        data = json.loads(PUBLISHED.read_text(encoding="utf-8"))
        failures = adapter.admission_failures(data)
        self.assertTrue(failures)
        self.assertTrue(any("readback is not independently reproducible" in x for x in failures))
        self.assertTrue(any("figure is missing" in x for x in failures))

    def test_agent1_status_and_disposition_are_not_source_truth_gates(self):
        data = ready_ledger()
        data["status"] = "EVIDENCE_PARTIAL_CONTRADICTORY"
        data["issue"]["disposition"] = "PRESERVE"
        self.assertEqual(adapter.admission_failures(data), [])

    def test_direct_registered_source_schema_is_admitted(self):
        data = ready_ledger()
        data["schema"] = "polynomials-registered-source/v1"
        data["status"] = "DIRECT_SOURCE_COMPLETE"
        data["issue"]["disposition"] = "PRESERVE"
        self.assertEqual(adapter.admission_failures(data), [])

    def test_magic_117_row_minimum_is_not_an_admission_gate(self):
        data = ready_ledger(row_count=4)
        self.assertEqual(adapter.admission_failures(data), [])
        self.assertEqual(len(adapter.adapt(data)["questions"]), 4)

    def test_complete_specimen_coverage_is_still_required(self):
        data = ready_ledger()
        data["ledger"]["coverage_status"] = "PARTIAL"
        self.assertIn("ledger coverage is not COMPLETE_PAGES_1_TO_11", adapter.admission_failures(data))

    def test_provider_non_reproducible_is_rejected(self):
        data = ready_ledger()
        data["source_access"] = {
            "status": "PUBLISHED_ROWS_AVAILABLE_SOURCE_BYTES_NOT_PROVIDER_REPRODUCIBLE",
            "current_executor_provider_checks": {"m2_pdf_present_in_pr_tree": False},
        }
        self.assertTrue(any("not independently reproducible" in x for x in adapter.admission_failures(data)))

    def test_direct_readback_must_match_exact_registered_bytes(self):
        data = ready_ledger()
        data["source_access"]["byte_length"] -= 1
        self.assertTrue(any("not independently reproducible" in x for x in adapter.admission_failures(data)))

    def test_coverage_receipt_is_required(self):
        data = ready_ledger()
        del data["ledger"]["coverage_receipt"]
        self.assertIn("ledger.coverage_receipt is required", adapter.admission_failures(data))

    def test_producer_available_booleans_are_not_provider_reproducibility(self):
        data = ready_ledger()
        data["source_access"] = {
            "status": "AVAILABLE",
            "provider_checks": {
                "m2_pages_json_present_in_pr_tree": True,
                "issue_or_pr_attachment_exposing_source_bytes": True,
            },
        }
        self.assertTrue(any("not independently reproducible" in x for x in adapter.admission_failures(data)))

    def test_conflicted_row_is_rejected(self):
        data = ready_ledger()
        data["ledger"]["rows"][0]["independent_comparison_status"] = "CONFLICT_MATH_VS_PUBLISHED_KEY"
        self.assertTrue(any("unresolved independent comparison" in x for x in adapter.admission_failures(data)))

    def test_missing_figure_state_is_rejected(self):
        data = ready_ledger()
        del data["ledger"]["rows"][0]["figure"]
        self.assertTrue(any("source-figure absence may not be inferred" in x for x in adapter.admission_failures(data)))

    def test_ready_ledger_adapts_without_verification_reasoning_leak(self):
        data = ready_ledger()
        out = adapter.adapt(data, provider_head="b" * 40)
        self.assertEqual(out["schema"], adapter.TARGET_SCHEMA)
        self.assertEqual(len(out["questions"]), 4)
        encoded = json.dumps(out)
        self.assertNotIn("VERIFICATION ANALYSIS MUST NOT LEAK", encoded)
        self.assertEqual(out["product"]["source_basis"]["provider_head"], "b" * 40)

    def test_option_mapping_preserves_source_labels(self):
        out = adapter.adapt(ready_ledger())
        first = out["questions"][0]
        self.assertEqual(first["response"]["type"], "MCQ_SINGLE")
        self.assertEqual(first["options"], ["A. alpha", "B. beta"])

    def test_absent_source_figure_maps_to_no_learner_figure(self):
        out = adapter.adapt(ready_ledger())
        first = out["questions"][0]
        self.assertEqual(first["figure"], {"state": "ABSENT"})
        self.assertEqual(first["custody"]["components"]["figures"], "NOT_PRESENT_IN_SOURCE")

    def test_source_derived_redraw_requires_explicit_payload(self):
        data = ready_ledger()
        data["ledger"]["rows"][0]["figure"] = {
            "state": "SOURCE_DERIVED_REDRAW",
            "alt": "A verified redraw",
            "svg": '<svg viewBox="0 0 10 10"></svg>',
        }
        out = adapter.adapt(data)
        self.assertEqual(out["questions"][0]["figure"]["state"], "SOURCE_DERIVED_REDRAW")
        self.assertEqual(out["questions"][0]["custody"]["components"]["figures"], "EXTERNAL_REFERENCE_VERIFIED")

    def test_selective_enrichment_maps_only_three_source_safe_clinics(self):
        data = ready_ledger(row_count=4)
        ids = sorted(adapter.CLINIC_QUESTION_IDS)
        for row, qid in zip(data["ledger"]["rows"][:3], ids):
            row["id"] = qid
        data["ledger"]["rows"][3]["id"] = "Q-MAT-09-POL-P08-ARC-11"
        out = adapter.adapt(data)

        by_id = {q["id"]: q for q in out["questions"]}
        for qid in ids:
            self.assertEqual(
                by_id[qid]["enrichment"]["clinic_href"],
                f"question-clinics.html#{qid}",
            )
        self.assertEqual(by_id["Q-MAT-09-POL-P08-ARC-11"]["enrichment"], {})
        self.assertNotIn("Q-MAT-09-POL-P03-SC-08", adapter.CLINIC_QUESTION_IDS)

    def test_product_exposes_one_concept_explorer_route(self):
        out = adapter.adapt(ready_ledger())
        self.assertEqual(out["product"]["explorer_href"], "concept-explorer.html")
        self.assertFalse(any("explorer_href" in q.get("enrichment", {}) for q in out["questions"]))

    def test_missing_source_answer_requires_authored_closure_without_fabricating_source(self):
        data = ready_ledger()
        row = data["ledger"]["rows"][0]
        row["source_answer_status"] = "MISSING"
        row["source_answer"] = None

        with self.assertRaises(adapter.AdmissionError):
            adapter.adapt(data)

        row["authored_answer"] = "Independently verified authored answer."
        out = adapter.adapt(data)
        q = out["questions"][0]
        self.assertNotIn("source_summary", q["answer"])
        self.assertEqual(q["answer"]["authored_summary"], "Independently verified authored answer.")
        self.assertEqual(q["custody"]["components"]["answer"], "NOT_PRESENT_IN_SOURCE")


if __name__ == "__main__":
    unittest.main()
