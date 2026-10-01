"""Test suite ensuring 12.7\" Tablet Standalone HTML standards across Mathematics modules."""
from __future__ import annotations

import re
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]

MATHEMATICS_TABLET_FILES = [
    "standalone/core1a-mathematics-euclids-geometry-tablet.html",
    "standalone/core1a-mathematics-theory-of-equations-tablet.html",
]


class MathematicsTabletStandaloneTest(unittest.TestCase):
    def test_mathematics_files_exist_and_non_empty(self):
        for rel_path in MATHEMATICS_TABLET_FILES:
            with self.subTest(file=rel_path):
                fpath = REPO / rel_path
                self.assertTrue(fpath.exists(), f"File {rel_path} does not exist")
                self.assertGreater(fpath.stat().st_size, 30_000, f"File {rel_path} is unexpectedly small")

    def test_zero_external_cdn_dependencies(self):
        cdn_patterns = [
            r'https?://cdn\.',
            r'https?://cdnjs\.',
            r'https?://fonts\.googleapis\.com',
            r'https?://fonts\.gstatic\.com',
            r'https?://unpkg\.com',
            r'https?://cdn\.jsdelivr\.net',
        ]
        for rel_path in MATHEMATICS_TABLET_FILES:
            content = (REPO / rel_path).read_text(encoding="utf-8")
            for pattern in cdn_patterns:
                with self.subTest(file=rel_path, pattern=pattern):
                    matches = re.findall(pattern, content, re.IGNORECASE)
                    self.assertEqual(len(matches), 0, f"Found external remote CDN link in {rel_path}")

    def test_wcag_touch_targets_enforced(self):
        for rel_path in MATHEMATICS_TABLET_FILES:
            with self.subTest(file=rel_path):
                content = (REPO / rel_path).read_text(encoding="utf-8")
                self.assertTrue(
                    "48px" in content or "--tab12-touch-min: 48px" in content,
                    f"Touch target minimum 48px rule not found in {rel_path}",
                )

    def test_virtual_keyboard_safe_textareas(self):
        for rel_path in MATHEMATICS_TABLET_FILES:
            with self.subTest(file=rel_path):
                content = (REPO / rel_path).read_text(encoding="utf-8")
                self.assertIn("120px", content, f"Min-height 120px missing in {rel_path}")

    def test_theme_toggle_supported(self):
        for rel_path in MATHEMATICS_TABLET_FILES:
            with self.subTest(file=rel_path):
                content = (REPO / rel_path).read_text(encoding="utf-8")
                self.assertIn("data-theme", content, f"data-theme attribute missing in {rel_path}")


if __name__ == "__main__":
    unittest.main()
