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
        "current_executor_source_readback_status": "PROVIDER_REPRODUCIBLE",
        "independent_comparison_status": "MATCH",
        "figure": {"state": "ABSENT"},
    }


def ready_ledger() -> dict:
    rows = [ready_row(i) for i in range(1, adapter.MIN_DECLARED_KEYED_ITEMS + 1)]
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
        "source_access": {"status": "PROVIDER_REPRODUCIBLE"},
        "ledger": {
            "question_count": len(rows),
            "coverage_status": "COMPLETE_PAGES_1_TO_11",
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
        self.assertTrue(any("below declared source-key minimum" in x for x in failures))
        self.assertTrue(any("figure is missing" in x for x in failures))

    def test_reconciled_partial_status_is_rejected(self):
        data = ready_ledger()
        data["status"] = "EVIDENCE_PARTIAL_CONTRADICTORY"
        data["issue"]["disposition"] = "PRESERVE"
        failures = adapter.admission_failures(data)
        self.assertIn("evidence status is not EVIDENCE_VERIFIED_COMPLETE", failures)
        self.assertIn("Agent-1 issue disposition is not SATISFIED", failures)

    def test_provider_non_reproducible_is_rejected(self):
        data = ready_ledger()
        data["source_access"] = {
            "status": "PUBLISHED_ROWS_AVAILABLE_SOURCE_BYTES_NOT_PROVIDER_REPRODUCIBLE",
            "current_executor_provider_checks": {"m2_pdf_present_in_pr_tree": False},
        }
        self.assertTrue(any("not provider-reproducible" in x for x in adapter.admission_failures(data)))

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
        self.assertEqual(len(out["questions"]), adapter.MIN_DECLARED_KEYED_ITEMS)
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

    def test_source_answer_missing_never_invents_source_answer(self):
        data = ready_ledger()
        row = data["ledger"]["rows"][0]
        row["source_answer_status"] = "MISSING"
        row["source_answer"] = None
        out = adapter.adapt(data)
        q = out["questions"][0]
        self.assertNotIn("source_summary", q["answer"])
        self.assertEqual(q["custody"]["components"]["answer"], "NOT_PRESENT_IN_SOURCE")
        self.assertIn("No source answer", q["answer"]["authored_summary"])


if __name__ == "__main__":
    unittest.main()
