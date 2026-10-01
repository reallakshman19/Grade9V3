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
        self.assertEqual(self.actual.count('class="question-card g9-stage-support"'), 77)
        self.assertEqual(self.actual.count('class="commit-attempt-btn"'), 77)
        self.assertEqual(len(re.findall(r'<button[^>]+data-g9-next-rung', self.actual)), 77)
        self.assertEqual(len(re.findall(r'<template[^>]+data-g9-rung-payload=', self.actual)), 195)
        self.assertEqual(len(re.findall(r'<template[^>]+data-g9-payload=', self.actual)), 77)
        self.assertEqual(self.actual.count("<template"), 272)  # 195 hints + 77 solutions

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
            crux_ref = q["answer"].get("crux_move_ref")
            if crux_ref:
                self.assertIn(f'data-g9-solution-move="{crux_ref}"', article)
                self.assertRegex(
                    article,
                    rf'data-g9-solution-move="{re.escape(crux_ref)}"[^>]+data-g9-solution-crux="true"',
                )
            present(q["extensions"]["grade9v3:analysis"]["common_wrong_route"], "common_wrong_route")

        self.assertGreater(reasoning_steps, 150)
        self.assertGreater(self.actual.count("<math"), 100)
        self.assertNotIn("katex.min.js", self.actual)

    def test_selected_benchmark_representations_are_explicitly_authored_not_source_figures(self):
        self.assertEqual(self.actual.count('g9-c-visual-card representation-box'), 7)
        self.assertEqual(self.actual.count('class="question-svg"'), 7)
        self.assertEqual(
            self.actual.count("not an original exam-source figure"),
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
            r'<button type="button" class="commit-attempt-btn"[^>]+ disabled>I have attempted this</button>',
        )
        self.assertEqual(self.actual.count("data-requires-attempt data-locked"), 77)
        self.assertEqual(len(re.findall(r'<template[^>]+data-g9-payload=', self.actual)), 77)
        self.assertEqual(len(re.findall(r'<template[^>]+data-g9-rung-payload=', self.actual)), 195)
        self.assertNotIn("matches the verified answer", self.actual)
        self.assertIn("details.addEventListener('toggle'", self.actual)
        self.assertNotIn("details.removeAttribute('data-locked');\n    materializeSolution(details);", self.actual)
        self.assertNotIn("materializeSolution(details);\n      const commit=card.querySelector('.commit-attempt-btn');", self.actual)
        self.assertIn("g9_qb_attempted_", self.actual)
        self.assertIn("g9_qb_hints_", self.actual)
        self.assertIn("materializeSolution(details);", self.actual)

    def test_offline_and_accessible_viewport_contract(self):
        lower = self.actual.lower()
        remote_runtime_tokens = (
            'src="http://', 'src="https://', "src='http://", "src='https://",
            'url(http://', 'url(https://', 'url("http://', 'url("https://',
            "url('http://", "url('https://", 'fetch("http://', 'fetch("https://',
            "fetch('http://", "fetch('https://",
        )
        for token in remote_runtime_tokens:
            self.assertNotIn(token, lower)
        self.assertEqual(self.actual.count('data-g9-source-pdf href="https://'), 77)
        self.assertNotIn("user-scalable=no", self.actual)
        self.assertNotIn("maximum-scale=1", self.actual)
        self.assertIn("viewport-fit=cover", self.actual)
        self.assertIn("--g9-touch-min:48px", self.actual)
        self.assertIn("--g9-type-body:17px", self.actual)
        self.assertIn('data-theme="light"', self.actual)
        self.assertIn("@media(min-width:980px)", self.actual)
        self.assertIn("minmax(0,42fr) minmax(0,58fr)", self.actual)
        self.assertNotIn("position:sticky;top:80px", self.actual)
        self.assertIn("visualViewport", self.actual)
        self.assertIn("scrollIntoView", self.actual)
        self.assertIn(":focus-visible", self.actual)
        self.assertIn("prefers-reduced-motion", self.actual)
        self.assertIn(".representation-box .question-svg .small{font-size:14px}", self.actual)

    def test_pr372_core2_blueprint_contract_is_bound_and_projected(self):
        self.assertIn('data-blueprint-ref="BP-CORE2-SOURCE-QUESTION@1.5.0"', self.actual)
        self.assertIn(
            '<meta name="grade9v3-blueprint-source" content="PR372@edba5daf43371b4f5142ccc3ae16a1a1af6ba7a6">',
            self.actual,
        )
        self.assertIn('data-g9-mode="SINGLE_FILE"', self.actual)
        self.assertIn("Single-file mode: page-PDF control omitted by the #372 shell policy.", self.actual)
        for component, count in {
            "IDENTITY": 77,
            "SOURCE_PDF": 77,
            "DIFFICULTY_WHY": 77,
            "STEM": 77,
            "ATTEMPT": 77,
            "HINT_LADDER": 77,
            "SOLUTION": 77,
            "SOLUTION_STEPS": 77,
            "ANSWER": 77,
            "CHECK": 77,
        }.items():
            self.assertEqual(
                len(re.findall(rf'<(?:div|section)[^>]+data-g9-component="{re.escape(component)}"', self.actual)),
                count,
            )
        self.assertEqual(self.actual.count('data-g9-support-provenance="AUTHORED_CORE2_PROMPT_REVEAL"'), 195)
        self.assertEqual(self.actual.count('class="g9-dcell"'), 77 * 5)

    def test_core2_reference_lane_structure(self):
        sample = builder.render_question(self.questions[0], set(self.view["resolved_question_refs"]), {})
        primary = sample.split('<div class="g9-col g9-col-primary">', 1)[1].split('<div class="g9-col g9-col-support">', 1)[0]
        support = sample.split('<div class="g9-col g9-col-support">', 1)[1].split('</div>\n  </div>', 1)[0]
        self.assertNotIn('data-g9-component="HINT_LADDER"', primary)
        self.assertIn('data-g9-component="HINT_LADDER"', support)
        self.assertIn('data-g9-component="TRAP"', primary)
        self.assertIn('data-blueprint-slot="solution"', sample)
        self.assertEqual(self.actual.count('data-blueprint-slot="solution"'), 77)
        self.assertIn('[data-g9-component="REPRESENTATION"]{order:40}', self.actual)
        self.assertIn('[data-g9-component="CONDITIONS"]{order:50}', self.actual)
        self.assertIn('[data-g9-component="ATTEMPT"]{order:70}', self.actual)
        self.assertIn('[data-g9-component="HINT_LADDER"]{order:80}', self.actual)

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
        self.assertEqual(self.actual.count('class="answer-choice" type="checkbox"'), 24)
        self.assertEqual(self.actual.count('class="answer-input"'), 42)
        self.assertEqual(self.actual.count('class="paper-check"'), 77)


if __name__ == "__main__":
    unittest.main()
