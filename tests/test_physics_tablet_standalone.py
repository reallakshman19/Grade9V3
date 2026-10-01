"""Cheap static guardrails for Physics tablet standalone promotion candidates.

These checks intentionally do *not* claim rendered WCAG compliance, academic
correctness, source fidelity, Core-role conformance, responsive behaviour, or
publication readiness. LPAP browser/semantic evidence must establish those
properties separately.
"""
from __future__ import annotations

import re
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]

PHYSICS_TABLET_FILES = [
    "standalone/core1a-motion-in-a-plane-tablet.html",
    "standalone/core1a-motion-1d-straight-line-tablet.html",
    "standalone/motion-1d-practice-companion-tablet.html",
    "standalone/core1a-physics-nlm-tablet.html",
    "standalone/core1a-vector-add-sub-tablet.html",
]


def _read(rel_path: str) -> str:
    return (REPO / rel_path).read_text(encoding="utf-8")


def _viewport_content(html: str) -> str:
    match = re.search(
        r'<meta\s+[^>]*name=["\']viewport["\'][^>]*content=["\']([^"\']*)["\'][^>]*>',
        html,
        re.IGNORECASE,
    )
    if not match:
        match = re.search(
            r'<meta\s+[^>]*content=["\']([^"\']*)["\'][^>]*name=["\']viewport["\'][^>]*>',
            html,
            re.IGNORECASE,
        )
    return match.group(1) if match else ""


class PhysicsTabletStandaloneStaticGuardTest(unittest.TestCase):
    def test_candidate_files_exist_and_are_html_documents(self):
        """Presence/identity guard only; byte count is not a quality proxy."""
        for rel_path in PHYSICS_TABLET_FILES:
            with self.subTest(file=rel_path):
                fpath = REPO / rel_path
                self.assertTrue(fpath.exists(), f"File {rel_path} does not exist")
                content = fpath.read_text(encoding="utf-8").lstrip()
                self.assertTrue(content, f"File {rel_path} is empty")
                self.assertTrue(
                    content.lower().startswith("<!doctype html>"),
                    f"File {rel_path} is not an HTML document",
                )
                self.assertRegex(content, r"(?i)<html\b")
                self.assertRegex(content, r"(?i)<body\b")

    def test_no_remote_runtime_dependency_urls(self):
        """Reject remote load-bearing URLs; ordinary cited/source links are not banned."""
        load_patterns = [
            re.compile(
                r'<(?:script|img|iframe|source|video|audio|link)\b[^>]*'
                r'(?:src|href)\s*=\s*["\']\s*https?://',
                re.IGNORECASE,
            ),
            re.compile(r'url\(\s*["\']?\s*https?://', re.IGNORECASE),
        ]
        for rel_path in PHYSICS_TABLET_FILES:
            content = _read(rel_path)
            for pattern in load_patterns:
                with self.subTest(file=rel_path, pattern=pattern.pattern):
                    self.assertIsNone(
                        pattern.search(content),
                        f"Remote runtime dependency found in {rel_path}",
                    )

    def test_viewport_does_not_disable_user_zoom(self):
        for rel_path in PHYSICS_TABLET_FILES:
            with self.subTest(file=rel_path):
                viewport = _viewport_content(_read(rel_path))
                self.assertTrue(viewport, f"Viewport meta missing in {rel_path}")
                compact = re.sub(r"\s+", "", viewport.lower())
                self.assertNotIn(
                    "user-scalable=no",
                    compact,
                    f"User zoom is disabled in {rel_path}",
                )
                self.assertIsNone(
                    re.search(r"(?:^|,)maximum-scale=1(?:\.0+)?(?:,|$)", compact),
                    f"Viewport caps zoom at 1x in {rel_path}",
                )

    def test_no_unresolved_generator_count_tokens(self):
        for rel_path in PHYSICS_TABLET_FILES:
            with self.subTest(file=rel_path):
                content = _read(rel_path)
                self.assertNotIn(
                    "{len(",
                    content,
                    f"Unresolved generator count token in learner HTML: {rel_path}",
                )

    def test_no_declared_sub_48px_interactive_min_heights(self):
        """Catch explicit undersizing; rendered geometry still requires browser evidence."""
        selector_block = re.compile(r"([^{}]+)\{([^{}]*)\}", re.DOTALL)
        min_height = re.compile(r"min-height\s*:\s*([0-9]+(?:\.[0-9]+)?)px", re.I)
        control_selector = re.compile(
            r"(?:^|[\s,.#>+~:])(?:button|input|select|summary|\.btn|\.tab-btn)(?:\b|[\s,.#>+~:\[])",
            re.I,
        )
        inline_control = re.compile(
            r"<(?:button|input|select|summary)\b[^>]*\bstyle=[\"'][^\"']*"
            r"min-height\s*:\s*([0-9]+(?:\.[0-9]+)?)px",
            re.I,
        )

        for rel_path in PHYSICS_TABLET_FILES:
            content = _read(rel_path)
            offenders: list[str] = []
            for selector, declarations in selector_block.findall(content):
                if not control_selector.search(selector):
                    continue
                for raw in min_height.findall(declarations):
                    if float(raw) < 48:
                        offenders.append(f"{selector.strip()} => {raw}px")
            for raw in inline_control.findall(content):
                if float(raw) < 48:
                    offenders.append(f"inline interactive control => {raw}px")
            with self.subTest(file=rel_path):
                self.assertEqual(
                    offenders,
                    [],
                    f"Explicit interactive min-height below 48px in {rel_path}: {offenders}",
                )

    def test_scratchpad_textarea_rule_reserves_120px(self):
        rule = re.compile(
            r"textarea\.tablet-safe-input\s*\{([^}]*)\}",
            re.IGNORECASE | re.DOTALL,
        )
        height = re.compile(r"min-height\s*:\s*([0-9]+(?:\.[0-9]+)?)px", re.I)
        for rel_path in PHYSICS_TABLET_FILES:
            with self.subTest(file=rel_path):
                content = _read(rel_path)
                match = rule.search(content)
                self.assertIsNotNone(
                    match,
                    f"Scoped tablet scratchpad rule missing in {rel_path}",
                )
                values = height.findall(match.group(1)) if match else []
                self.assertTrue(values, f"Scratchpad min-height missing in {rel_path}")
                self.assertGreaterEqual(
                    max(map(float, values)),
                    120,
                    f"Scratchpad min-height below 120px in {rel_path}",
                )

    def test_theme_toggle_has_static_runtime_wiring(self):
        """Static wiring only; browser behaviour is verified separately."""
        for rel_path in PHYSICS_TABLET_FILES:
            with self.subTest(file=rel_path):
                content = _read(rel_path)
                self.assertRegex(content, r'id=["\']themeToggle["\']')
                self.assertIn("getElementById('themeToggle')", content)
                self.assertRegex(
                    content,
                    r"themeBtn\.addEventListener\(\s*['\"]click['\"]",
                )
                self.assertIn("setAttribute('data-theme'", content)


if __name__ == "__main__":
    unittest.main()
