from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class QuestionBankCompactUi(unittest.TestCase):
    def test_compact_styles_load_after_tablet_shell(self) -> None:
        html = (ROOT / "public/question-bank/index.html").read_text(encoding="utf-8")
        self.assertIn("question-bank-compact.css", html)
        self.assertLess(html.index("tablet-12-7.css"), html.index("question-bank-compact.css"))

        css = (ROOT / "public/css/question-bank-compact.css").read_text(encoding="utf-8")
        self.assertIn("font-size: clamp(24px, 2.4vw, 30px)", css)
        self.assertIn("min-height: 44px", css)
        self.assertNotIn("min-height: 48px", css)

    def test_live_metrics_follow_filtered_question_set(self) -> None:
        html = (ROOT / "public/question-bank/index.html").read_text(encoding="utf-8")
        self.assertIn("question-bank-live-stats.js", html)
        self.assertLess(html.index("question-bank.js"), html.index("question-bank-live-stats.js"))

        js = (ROOT / "public/js/question-bank-live-stats.js").read_text(encoding="utf-8")
        self.assertIn("Grade9QuestionBank", js)
        self.assertIn("Grade9QuestionBankData", js)
        self.assertIn("api.filtered()", js)
        self.assertIn("canonical questions", js)
        self.assertIn("matching questions", js)
        self.assertIn("subjects in view", js)
        self.assertIn("topics in view", js)
        for stale in ("81", "46", "35", "26", "20"):
            self.assertNotIn(stale, js)

    def test_pages_mirror_matches_public_ui_assets(self) -> None:
        pairs = [
            ("public/question-bank/index.html", "docs/question-bank/index.html"),
            ("public/css/question-bank-compact.css", "docs/css/question-bank-compact.css"),
            ("public/js/question-bank-live-stats.js", "docs/js/question-bank-live-stats.js"),
        ]
        for public_path, docs_path in pairs:
            self.assertEqual(
                (ROOT / public_path).read_text(encoding="utf-8"),
                (ROOT / docs_path).read_text(encoding="utf-8"),
                f"Pages mirror drift: {public_path} != {docs_path}",
            )


if __name__ == "__main__":
    unittest.main()
