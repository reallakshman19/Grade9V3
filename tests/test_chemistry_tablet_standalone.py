"""Regression checks for the audited Chemistry standalone promotion candidates."""
from __future__ import annotations

import re
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
CORE1A_FILES = [
    "standalone/core1a-chemistry-redox-reactions-tablet.html",
    "standalone/core1a-chemistry-chemical-bonding-tablet.html",
    "standalone/core1a-chemistry-some-basic-concepts-tablet.html",
    "standalone/core1a-chemistry-behaviour-of-gases-tablet.html",
]
CORE2_FILES = [
    "standalone/core2-chemistry-chemical-bonding-tablet.html",
    "standalone/core2-chemistry-redox-reactions-tablet.html",
    "standalone/core2-chemistry-some-basic-concepts-tablet.html",
]
CHEMISTRY_TABLET_FILES = CORE1A_FILES + CORE2_FILES
SOURCE_HOLD_FILES = CORE2_FILES + ["standalone/core1a-chemistry-behaviour-of-gases-tablet.html"]


def read(rel_path: str) -> str:
    return (REPO / rel_path).read_text(encoding="utf-8")


class ChemistryTabletStandaloneTest(unittest.TestCase):
    def test_files_exist_and_non_empty(self):
        for rel_path in CHEMISTRY_TABLET_FILES:
            with self.subTest(file=rel_path):
                fpath = REPO / rel_path
                self.assertTrue(fpath.exists())
                self.assertGreater(fpath.stat().st_size, 30_000)

    def test_zero_external_runtime_dependencies(self):
        remote = re.compile(r"""(?:src|href)\s*=\s*["']https?://""", re.IGNORECASE)
        for rel_path in CHEMISTRY_TABLET_FILES:
            with self.subTest(file=rel_path):
                self.assertIsNone(remote.search(read(rel_path)))

    def test_zoom_is_not_disabled_and_reduced_motion_is_supported(self):
        for rel_path in CHEMISTRY_TABLET_FILES:
            with self.subTest(file=rel_path):
                content = read(rel_path)
                self.assertNotIn("user-scalable=no", content)
                self.assertNotIn("maximum-scale=1.0", content)
                self.assertIn("@media (prefers-reduced-motion: reduce)", content)

    def test_declared_touch_target_minima_are_at_least_48px(self):
        for rel_path in CHEMISTRY_TABLET_FILES:
            with self.subTest(file=rel_path):
                values = [float(v) for v in re.findall(r"min-height\s*:\s*([0-9.]+)px", read(rel_path))]
                self.assertTrue(values)
                self.assertGreaterEqual(min(values), 48.0)

    def test_no_micro_font_declarations_below_13_5px(self):
        for rel_path in CHEMISTRY_TABLET_FILES:
            with self.subTest(file=rel_path):
                values = [float(v) for v in re.findall(r"font-size\s*:\s*([0-9.]+)px", read(rel_path))]
                self.assertFalse([v for v in values if v < 13.5])

    def test_virtual_keyboard_safe_textareas(self):
        for rel_path in CHEMISTRY_TABLET_FILES:
            with self.subTest(file=rel_path):
                self.assertIn("120px", read(rel_path))

    def test_theme_toggle_supported(self):
        for rel_path in CHEMISTRY_TABLET_FILES:
            with self.subTest(file=rel_path):
                self.assertIn("data-theme", read(rel_path))

    def test_all_candidates_show_audit_hold(self):
        for rel_path in CHEMISTRY_TABLET_FILES:
            with self.subTest(file=rel_path):
                self.assertIn("<strong>Draft audit hold:</strong>", read(rel_path))

    def test_unverified_source_answers_are_withheld(self):
        for rel_path in SOURCE_HOLD_FILES:
            with self.subTest(file=rel_path):
                content = read(rel_path)
                solution_count = content.count('class="solution-content"')
                self.assertGreater(solution_count, 0)
                self.assertEqual(solution_count, content.count("Source reconstruction hold:"))

    def test_core2_never_presents_unverified_import_text_as_a_question(self):
        for rel_path in CORE2_FILES:
            with self.subTest(file=rel_path):
                content = read(rel_path)
                card_count = content.count('<div class="q-title">')
                self.assertGreater(card_count, 0)
                self.assertEqual(
                    card_count,
                    content.count("Candidate source item — reconstruction required"),
                )
                self.assertEqual(card_count, content.count("Source reconstruction required:"))
                self.assertNotIn("NCERT Try the question", content)
                self.assertNotIn('<div class="q-title">Question', content)

    def test_no_generator_template_tokens_or_corrupt_math_escape_controls(self):
        for rel_path in CHEMISTRY_TABLET_FILES:
            with self.subTest(file=rel_path):
                content = read(rel_path)
                self.assertNotIn("{len(questions)}", content)
                self.assertNotIn("\x07", content)
                self.assertNotIn("\x0c", content)

    def test_core2_all_questions_and_part_tabs_are_same_logical_items(self):
        for rel_path in CORE2_FILES:
            with self.subTest(file=rel_path):
                content = read(rel_path)
                cards = re.findall(r'<div class="q-card">([\s\S]*?)(?=<div class="q-card">|</div>\s*</div>\s*<div id=|</main>|<aside class="support-rail">)', content)
                self.assertEqual(len(cards) % 2, 0)
                half = len(cards) // 2
                def identity(card: str) -> tuple[str, str, str]:
                    def grab(pattern: str) -> str:
                        match = re.search(pattern, card, re.S)
                        return re.sub(r"<[^>]+>", " ", match.group(1) if match else "").strip()
                    return (
                        grab(r'<span class="tag-pill">([\s\S]*?)</span>'),
                        grab(r'<div class="q-title">([\s\S]*?)</div>'),
                        grab(r'<p class="q-prompt">([\s\S]*?)</p>'),
                    )
                self.assertEqual([identity(card) for card in cards[:half]], [identity(card) for card in cards[half:]])


if __name__ == "__main__":
    unittest.main()
