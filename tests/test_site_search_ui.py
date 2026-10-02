"""The header search as a learner meets it: the matching in Node, and the dialog in a real browser on a tablet and a phone, opened from files."""
from __future__ import annotations

import json
import shutil
import subprocess
import unittest
from pathlib import Path

from tests.test_tablet_audit import _browser_available

REPO = Path(__file__).resolve().parents[1]
JS = ("public/js/site-header.js", "public/js/site-search-core.js", "public/js/site-search.js")


class Source(unittest.TestCase):
    def test_the_scripts_parse_and_build_no_markup_from_strings(self):
        for rel in JS:
            done = subprocess.run(["node", "--check", str(REPO / rel)], capture_output=True, text=True)
            self.assertEqual(done.returncode, 0, done.stderr)
            self.assertNotIn("innerHTML", (REPO / rel).read_text(encoding="utf-8"), rel)

    def test_the_dialog_never_assigns_the_read_only_window_top(self):
        for rel in JS:
            self.assertNotIn(",top=document.createElement", (REPO / rel).read_text(encoding="utf-8"), rel)
            self.assertNotRegex((REPO / rel).read_text(encoding="utf-8"), r"(?<![\w.])top\s*=\s*document\.createElement", rel)

    def test_the_header_loads_the_search_only_when_it_is_first_opened(self):
        source = (REPO / "public/js/site-header.js").read_text(encoding="utf-8")
        self.assertIn("site-search-core.js", source)
        self.assertIn("site-search.js", source)
        self.assertNotIn("question-bank-data.js", source, "the header no longer reads the Question Bank monolith")
        self.assertNotIn("<script", source)

    def test_the_dialog_does_not_print_a_hint(self):
        source = (REPO / "public/js/site-search.js").read_text(encoding="utf-8")
        hint_branch = source[source.index("if (doc.kind === 'HINT')"):source.index("marked(line, meta")]
        self.assertNotIn("doc.text", hint_branch, "a hint's own words are searched and never printed")

    def test_the_dialogs_text_is_at_least_14_px_in_the_stylesheet(self):
        css = (REPO / "public/css/site.css").read_text(encoding="utf-8")
        block = "\n".join(line for line in css.splitlines() if ".g9-search" in line)
        sizes = [float(n) for n in __import__("re").findall(r"font-size:\s*([0-9.]+)px", block)]
        self.assertTrue(sizes and min(sizes) >= 14, sizes)


class Core(unittest.TestCase):
    def test_matching_and_ranking(self):
        node = shutil.which("node")
        if not node:
            self.skipTest("node is not installed")
        done = subprocess.run([node, "--test", str(REPO / "tests/site_search_core.test.mjs")], capture_output=True, text=True, cwd=REPO, timeout=120)
        self.assertEqual(done.returncode, 0, done.stdout[-2500:] + done.stderr[-1000:])


class Browser(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        why_not = _browser_available()
        if why_not:
            raise unittest.SkipTest(why_not)
        done = subprocess.run(["node", str(REPO / "tests/site_search_browser.cjs"), str(REPO)], capture_output=True, text=True, cwd=REPO, timeout=300)
        if done.returncode:
            raise AssertionError(done.stderr[-2500:])
        cls.report = json.loads(done.stdout)

    def each(self):
        for name, v in self.report["viewports"].items():
            with self.subTest(viewport=name):
                yield name, v

    def test_nothing_failed_in_the_page_and_nothing_left_the_machine(self):
        self.assertEqual(self.report["errors"], [])
        self.assertEqual(self.report["external"], [], "a page opened from a file asks for no other host")

    def test_it_opens_on_the_shortcut_with_the_cursor_in_the_box_and_says_what_it_searches(self):
        for _, v in self.each():
            self.assertTrue(v["focusOnInput"])
            self.assertRegex(v["empty"], r"Search \d+ things: \d+ topics, \d+ pages, \d+ questions and \d+ hints")

    def test_one_word_finds_topics_pages_questions_and_hints_with_the_counts_on_the_chips(self):
        for _, v in self.each():
            self.assertEqual([c.split(" (")[0] for c in v["chips"]], ["All", "Topics", "Pages", "Questions", "Hints"])
            self.assertTrue(all(int(c.split("(")[1].rstrip(")")) > 0 for c in v["chips"]), v["chips"])
            self.assertEqual({r["kind"] for r in v["all"]}, {"TOPIC", "PAGE", "QUESTION", "HINT"})

    def test_a_hint_is_found_and_its_words_are_not_shown(self):
        for _, v in self.each():
            self.assertEqual(v["hintTextShown"], 0)
            self.assertEqual(v["hintTextShownOnHintTab"], 0)
            self.assertTrue(v["hints"] and all(r["kind"] == "HINT" for r in v["hints"]))
            self.assertIn("A hint of this question matches", v["hintNote"])
            self.assertIn("Its text is hidden", v["hintNote"])

    def test_filters_narrow_the_results_and_say_how_many_are_set(self):
        for _, v in self.each():
            self.assertGreater(v["redoxChemistry"], 0)
            self.assertEqual(v["redoxMathematics"], 0)
            self.assertEqual(v["summaryAfterFilter"], "Filters (1)")
            self.assertIn("Nothing matches with these filters", v["noMatchMessage"])

    def test_a_question_id_finds_that_question_and_enter_opens_it(self):
        for _, v in self.each():
            self.assertEqual([r["kind"] for r in v["idResults"]], ["QUESTION"])
            self.assertTrue(v["focusOnFirstResult"] and v["focusBackOnInput"])
            self.assertRegex(v["openedUrl"], r"question-bank/index\.html\?q=PYQ-PHY-IITJEE-2011-P2-Q33")
            self.assertTrue(v["openedPageHasHeader"])

    def test_the_links_are_right_from_a_page_at_another_depth(self):
        for _, v in self.each():
            self.assertTrue(all(not href.startswith("/") for href in v["rootResults"]))
            self.assertRegex(v["rootOpened"], r"public/core-learning/index\.html\?projection=mathematics:")

    def test_escape_closes_it(self):
        for _, v in self.each():
            self.assertTrue(v["closedByEscape"])

    def test_the_tablet_floors_hold_everywhere_in_the_dialog(self):
        """Text at least 14 px, every control at least 48 px high, nothing wider than the dialog: empty, with results, and with the filters open."""
        for _, v in self.each():
            for state in ("floorsEmpty", "floorsResults", "floorsFilters"):
                self.assertEqual(v[state], {"small": [], "tight": [], "overflowX": False}, state)


if __name__ == "__main__":
    unittest.main()
