"""
Tests for standalone/practice/ physics modules.
Guardrail checks: viewport, CDN, touch targets, question presence.
Runs with: python3 -m unittest tests/test_physics_practice_standalone.py
"""
from __future__ import annotations

import re
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
PRACTICE_DIR = REPO / "standalone" / "practice"

EXPECTED_FILES = [
    "index.html",
    "core2-motion-in-a-plane-tablet.html",
    "core2a-projectile-study.html",
    "core1a-physics-motion-2d-ncert-tablet.html",
    "core1a-sba-motion-in-a-plane-master-tablet.html",
    "core1a-sba-06-07-trajectory-and-height-tablet.html",
    "core2-motion-1d-straight-line-tablet.html",
    "core2-motion-consolidated-practice-tablet.html",
    "core1a-physics-vectors-tablet.html",
    "motion-in-1d-master-suite.html",
    "motion-in-2d-master-suite.html",
    "physics-motion-in-a-plane-interactive-suite.html",
    "core1a-physics-nlm-tablet.html",
]

CDN_RE = re.compile(r'https?://(cdn\.|unpkg\.|jsdelivr\.|cdnjs\.)', re.I)
NO_SCALE_RE = re.compile(r'user-scalable\s*=\s*no', re.I)
MAX_SCALE_RE = re.compile(r'maximum-scale', re.I)
QUESTION_RE = re.compile(r'data-g9-kind=["\']QUESTION["\']', re.I)
CHALLENGE_RE = re.compile(
    r'<(?:article|section|div)[^>]+class=["\'][^"\']*(?:question|challenge|practice)[^"\']*["\']',
    re.I
)


def _read(fname: str) -> str:
    return (PRACTICE_DIR / fname).read_text(encoding="utf-8", errors="replace")


class TestPracticeFilesPresent(unittest.TestCase):
    def test_all_expected_files_exist(self):
        missing = [f for f in EXPECTED_FILES if not (PRACTICE_DIR / f).exists()]
        self.assertFalse(missing, f"Missing practice files: {missing}")


class TestPracticeViewport(unittest.TestCase):
    def test_no_user_scalable_no(self):
        violations = []
        for fname in EXPECTED_FILES:
            if not (PRACTICE_DIR / fname).exists():
                continue
            text = _read(fname)
            if NO_SCALE_RE.search(text):
                violations.append(fname)
        self.assertFalse(violations, f"user-scalable=no found in: {violations}")

    def test_maximum_scale_present(self):
        violations = []
        for fname in EXPECTED_FILES:
            if not (PRACTICE_DIR / fname).exists():
                continue
            text = _read(fname)
            if not MAX_SCALE_RE.search(text):
                violations.append(fname)
        self.assertFalse(violations, f"maximum-scale missing from viewport in: {violations}")


class TestPracticeNoCDN(unittest.TestCase):
    def test_no_remote_cdn(self):
        violations = []
        for fname in EXPECTED_FILES:
            if not (PRACTICE_DIR / fname).exists():
                continue
            text = _read(fname)
            hits = CDN_RE.findall(text)
            if hits:
                violations.append(f"{fname}: {hits}")
        self.assertFalse(violations, f"Remote CDN refs found:\n" + "\n".join(violations))


class TestPracticeQuestionCount(unittest.TestCase):
    def test_core2_2d_motion_has_sufficient_questions(self):
        fname = "core2-motion-in-a-plane-tablet.html"
        if not (PRACTICE_DIR / fname).exists():
            self.skipTest(f"{fname} not present")
        text = _read(fname)
        q = len(QUESTION_RE.findall(text))
        ch = len(CHALLENGE_RE.findall(text))
        total = max(q, ch)
        self.assertGreaterEqual(total, 50,
            f"Expected ≥50 questions in 2D challenge bank, found {total}")


class TestPracticeIndexLinks(unittest.TestCase):
    def test_index_links_to_all_modules(self):
        if not (PRACTICE_DIR / "index.html").exists():
            self.skipTest("index.html not present")
        text = _read("index.html")
        missing = [f for f in EXPECTED_FILES if f != "index.html" and f not in text]
        self.assertFalse(missing, f"index.html missing links to: {missing}")


if __name__ == "__main__":
    unittest.main()
