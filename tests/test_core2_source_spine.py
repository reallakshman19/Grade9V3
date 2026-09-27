import importlib.util
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODULE = ROOT / "Shared" / "tools" / "render_core2_source_spine.py"
FIXTURE = ROOT / "tests" / "fixtures" / "core2-source-spine.fixture.json"
spec = importlib.util.spec_from_file_location("core2_spine", MODULE)
spine = importlib.util.module_from_spec(spec)
spec.loader.exec_module(spine)


class Core2SourceSpineTests(unittest.TestCase):
    def data(self):
        return json.loads(FIXTURE.read_text(encoding="utf-8"))

    def article(self, html, qid):
        return re.search(r'<article id="' + re.escape(qid) + r'".*?</article>', html, re.S).group(0)

    def test_fixture_renders_one_standalone_core2_page(self):
        out = spine.render(self.data())
        self.assertIn('data-core="CORE2"', out)
        self.assertEqual(out.count('data-question-id="'), 3)
        self.assertNotIn("CORE1A", out)
        self.assertNotIn("CORE2A", out)
        self.assertNotIn("cdn.jsdelivr", out)
        self.assertNotIn("https://", out)

    def test_absent_source_figure_emits_no_placeholder(self):
        q1 = self.article(spine.render(self.data()), "FIX-Q-01")
        self.assertNotIn("data-g9-figure", q1)
        self.assertNotIn("No figure", q1)

    def test_source_derived_figure_is_explicitly_labelled(self):
        q3 = self.article(spine.render(self.data()), "FIX-Q-03")
        self.assertIn("SOURCE-DERIVED REDRAW", q3)
        self.assertIn('aria-label="Synthetic coordinate axes with one marked point"', q3)

    def test_no_generic_hint_ui_when_source_has_no_hint(self):
        out = spine.render(self.data())
        self.assertNotIn("Show source hint", self.article(out, "FIX-Q-01"))
        q2 = self.article(out, "FIX-Q-02")
        self.assertIn("Show source hint", q2)
        self.assertIn("SOURCE HINT", q2)

    def test_answer_slot_is_empty_and_disabled_pre_attempt(self):
        q3 = self.article(spine.render(self.data()), "FIX-Q-03")
        self.assertIn('data-g9-answer-slot hidden></div>', q3)
        self.assertIn("data-answer-payload", q3)
        self.assertNotIn('<section class="answer-card">', q3)
        self.assertIn('aria-expanded="false" disabled>Reveal answer', q3)

    def test_search_index_excludes_answer_and_authored_support(self):
        q3 = self.article(spine.render(self.data()), "FIX-Q-03")
        searchable = re.search(r'data-search-text="([^"]+)"', q3).group(1)
        self.assertIn("synthetic free-response item", searchable)
        self.assertNotIn("synthetic source-answer fixture", searchable)
        self.assertNotIn("synthetic authored support", searchable)
        self.assertIn("card.dataset.searchText.indexOf", spine.JS)
        self.assertNotIn("card.textContent", spine.JS)

    def test_external_reference_requires_display_authorization(self):
        data = self.data()
        data["questions"][1]["custody"]["learner_display_authorized"] = False
        with self.assertRaisesRegex(spine.SpineError, "not authorized"):
            spine.validate(data)

    def test_figure_custody_mismatch_fails_closed(self):
        data = self.data()
        data["questions"][0]["figure"] = {
            "state": "SOURCE_DERIVED_REDRAW",
            "alt": "bad mismatch",
            "svg": '<svg viewBox="0 0 1 1"></svg>'
        }
        with self.assertRaisesRegex(spine.SpineError, "absent in source"):
            spine.validate(data)

    def test_receipt_binds_source_and_question_ids(self):
        data = self.data()
        output = spine.render(data)
        receipt = spine.make_receipt(data, output, "fixture.json")
        self.assertEqual(receipt["source_basis"]["acquisition_id"], "TEST-ACQ-NOT-SOURCE")
        self.assertEqual(receipt["question_ids"], ["FIX-Q-01", "FIX-Q-02", "FIX-Q-03"])
        self.assertRegex(receipt["html_sha256"], r"^[0-9a-f]{64}$")

    def test_touch_accessibility_css_contract_is_present(self):
        self.assertIn("min-height:48px", spine.CSS)
        self.assertIn("min-width:48px", spine.CSS)
        self.assertIn("overflow-x:hidden", spine.CSS)
        self.assertIn(":focus-visible", spine.CSS)
        self.assertIn("prefers-reduced-motion:reduce", spine.CSS)

    def test_source_section_and_family_navigation_keep_stable_question_anchors(self):
        out = spine.render(self.data())
        self.assertIn('href="#assessment"', out)
        self.assertIn('href="#archive"', out)
        self.assertIn('id="FIX-Q-03"', out)
        self.assertIn('data-family="FAM-GRAPH"', out)
        self.assertIn('<option value="FAM-GRAPH">Representation</option>', out)

    def test_missing_source_answer_is_labelled_and_requires_authored_closure(self):
        data = self.data()
        q = data["questions"][0]
        q["custody"]["components"]["answer"] = "NOT_PRESENT_IN_SOURCE"
        q["answer"] = {"authored_summary": "Synthetic independently supplied answer."}
        out = spine.render(data)
        payload = self.article(out, "FIX-Q-01")
        self.assertIn("AUTHORED ANSWER", payload)
        self.assertIn("SOURCE ANSWER NOT PRESENT", spine.JS)
        broken = self.data()
        broken["questions"][0]["custody"]["components"]["answer"] = "NOT_PRESENT_IN_SOURCE"
        broken["questions"][0]["answer"] = {}
        with self.assertRaisesRegex(spine.SpineError, "authored answer is required"):
            spine.validate(broken)

    def test_source_derived_svg_rejects_script_or_remote_content(self):
        data = self.data()
        data["questions"][2]["figure"]["svg"] = '<svg><script>alert(1)</script></svg>'
        with self.assertRaisesRegex(spine.SpineError, "unsafe/external SVG"):
            spine.validate(data)

    def test_source_embed_rejects_remote_asset(self):
        data = self.data()
        q = data["questions"][2]
        q["figure"] = {"state": "SOURCE_EMBED", "alt": "fixture", "src": "https://example.com/figure.png"}
        q["custody"]["components"]["figures"] = "PRESERVED"
        with self.assertRaisesRegex(spine.SpineError, "local/offline"):
            spine.validate(data)


if __name__ == "__main__":
    unittest.main()
