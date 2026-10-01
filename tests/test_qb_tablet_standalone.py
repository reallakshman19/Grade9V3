"""Contracts for the generated 12.7-inch standalone Canonical Question Bank."""
from __future__ import annotations

import html
import importlib.util
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUILDER = ROOT / "Shared/tools/build_qb_tablet_standalone.py"
OUT = ROOT / "standalone/core2-canonical-question-bank-tablet.html"

spec = importlib.util.spec_from_file_location("qb_tablet_builder", BUILDER)
builder = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(builder)


class QbTabletStandaloneTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.questions = builder.canonical_questions()
        cls.view = builder.selected_view()
        cls.expected = builder.render()
        cls.actual = OUT.read_text(encoding="utf-8")

    def test_committed_html_is_exact_deterministic_projection(self):
        self.assertEqual(self.actual, self.expected)

    def test_canonical_denominator_and_selected_view_are_exact(self):
        self.assertEqual(len(self.questions), 77)
        self.assertEqual(len({q["id"] for q in self.questions}), 77)
        self.assertEqual(
            {q["extensions"]["grade9v3:source_custody"]["section"] for q in self.questions},
            {"Physics", "Chemistry"},
        )
        self.assertEqual(
            sum(q["extensions"]["grade9v3:source_custody"]["section"] == "Physics" for q in self.questions),
            31,
        )
        self.assertEqual(
            sum(q["extensions"]["grade9v3:source_custody"]["section"] == "Chemistry" for q in self.questions),
            46,
        )
        self.assertEqual(len(self.view["resolved_question_refs"]), 7)
        self.assertEqual(
            set(self.view["resolved_question_refs"]),
            {
                q["id"]
                for q in self.questions
                if f'id="{q["id"]}"' in self.actual and f'id="{q["id"]}"' in self.actual
                and re.search(
                    rf'<article[^>]*id="{re.escape(q["id"])}"[^>]*data-selected="true"',
                    self.actual,
                )
            },
        )

    def test_every_question_keeps_verified_parent_custody(self):
        for q in self.questions:
            with self.subTest(q=q["id"]):
                custody = q["extensions"]["grade9v3:source_custody"]
                self.assertEqual(custody["source_status"], "PYQ_VERIFIED_PARENT")
                self.assertTrue(custody["parent_ref"])
                self.assertTrue(custody["paper_url"])

    def test_all_learner_support_and_solution_payloads_are_projected(self):
        scaffolds = sum(len(q.get("scaffolds") or []) for q in self.questions)
        self.assertEqual(scaffolds, 195)
        self.assertEqual(self.actual.count('class="question-card stage-support-columns"'), 77)
        self.assertEqual(self.actual.count('class="solution-slot"'), 77)
        self.assertEqual(self.actual.count('class="check-solution-btn"'), 77)
        self.assertEqual(self.actual.count('class="hint-pill"'), 195)
        self.assertEqual(self.actual.count('class="hint-slot"'), 195)
        self.assertEqual(self.actual.count('<template id='), 272)  # 195 hints + 77 solutions

    def test_every_question_projects_its_full_canonical_learner_payload(self):
        article_chunks = self.actual.split('<article class="question-card')[1:]
        articles = {}
        for chunk in article_chunks:
            article = '<article class="question-card' + chunk.split('</article>', 1)[0] + '</article>'
            match = re.search(r'\bid="([^"]+)"', article)
            self.assertIsNotNone(match)
            articles[match.group(1)] = article
        self.assertEqual(set(articles), {q["id"] for q in self.questions})

        reasoning_steps = 0
        for q in self.questions:
            article = articles[q["id"]]
            def present(value, target=None):
                expected = (
                    builder.render_text(q, target, value)
                    if target
                    else html.escape(str(value), quote=True)
                )
                self.assertIn(expected, article)

            present(q["stem"], "stem")
            for condition in q.get("conditions") or []:
                present(condition, "conditions")
            for option_index, option in enumerate(q.get("options") or []):
                present(builder.option_parts(option, option_index)[1], f"option:{option_index}")
            for scaffold_index, scaffold in enumerate(q.get("scaffolds") or []):
                present(scaffold["text"], f"scaffold:{scaffold_index}")
            present(q["answer"]["summary"], "answer_summary")
            route = q["answer"].get("reasoning_route") or []
            reasoning_steps += len(route)
            for step_index, step in enumerate(route):
                present(step["action"], f"answer_reasoning:{step_index}")
            present(q["extensions"]["grade9v3:analysis"]["stable_crux_move"], "stable_crux_move")
            present(q["extensions"]["grade9v3:analysis"]["common_wrong_route"], "common_wrong_route")

        self.assertGreater(reasoning_steps, 150)
        self.assertGreater(self.actual.count("<math"), 100)
        self.assertNotIn("katex.min.js", self.actual)

    def test_selected_benchmark_representations_are_explicitly_authored_not_source_figures(self):
        self.assertEqual(self.actual.count('class="representation-box"'), 7)
        self.assertEqual(len(re.findall(r"<svg\b", self.actual, re.I)), 7)
        self.assertEqual(
            self.actual.count("authored representation, not an original exam-source figure"),
            7,
        )

    def test_option_labels_are_not_duplicated(self):
        self.assertNotRegex(
            self.actual,
            r'class="option-letter">([A-Z])</span><span class="option-text">\(\1\)',
        )

    def test_attempt_reveal_and_hint_payloads_are_inert_by_construction(self):
        self.assertRegex(
            self.actual,
            r'<button type="button" class="check-solution-btn"[^>]+ disabled>',
        )
        self.assertIn("<template", self.actual)
        self.assertNotIn("<details class=\"solution-reveal\"", self.actual)

    def test_offline_and_accessible_viewport_contract(self):
        self.assertNotRegex(self.actual, r'https?://')
        self.assertNotIn("user-scalable=no", self.actual)
        self.assertNotIn("maximum-scale=1", self.actual)
        self.assertIn("viewport-fit=cover", self.actual)
        self.assertIn("--touch:48px", self.actual)
        self.assertIn("minmax(360px,1fr)", self.actual)
        self.assertIn("visualViewport", self.actual)
        self.assertIn("scrollIntoView", self.actual)

    def test_question_types_drive_real_answer_controls(self):
        single = sum(
            builder.question_type(q) in builder.MCQ_SINGLE and bool(q.get("options"))
            for q in self.questions
        )
        multi = sum(builder.question_type(q) in builder.MCQ_MULTI for q in self.questions)
        free = 77 - single - multi
        self.assertEqual(single, 29)
        self.assertEqual(multi, 6)
        self.assertEqual(free, 42)
        self.assertEqual(self.actual.count('type="radio"'), 116)
        self.assertEqual(self.actual.count('type="checkbox"'), 24)
        self.assertEqual(self.actual.count('class="answer-input"'), 42)


if __name__ == "__main__":
    unittest.main()
