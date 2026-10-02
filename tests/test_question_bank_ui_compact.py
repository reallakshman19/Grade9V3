from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class QuestionBankCompactUi(unittest.TestCase):
    def test_compact_styles_override_tablet_shell_without_new_asset(self) -> None:
        html = (ROOT / "public/question-bank/index.html").read_text(encoding="utf-8")
        self.assertIn('id="qbCompactUi"', html)
        self.assertLess(html.index("tablet-12-7.css"), html.index('id="qbCompactUi"'))
        self.assertIn("font-size:clamp(24px,2.4vw,30px)", html)
        self.assertIn("min-height:44px", html)
        self.assertNotIn("question-bank-compact.css", html)

    def test_live_metrics_follow_filtered_question_set(self) -> None:
        html = (ROOT / "public/question-bank/index.html").read_text(encoding="utf-8")
        self.assertIn('id="qbLiveStats"', html)
        self.assertLess(html.index("question-bank.js"), html.index('id="qbLiveStats"'))
        live = html.split('<script id="qbLiveStats">', 1)[1].split("</script>", 1)[0]
        self.assertIn("Grade9QuestionBank", live)
        self.assertIn("Grade9QuestionBankData", live)
        self.assertIn("api.filtered()", live)
        self.assertIn("canonical questions", live)
        self.assertIn("matching questions", live)
        self.assertIn("subjects in view", live)
        self.assertIn("topics in view", live)
        for stale in ("81", "46", "35", "26", "20"):
            self.assertNotIn(stale, live)

    def test_pages_mirror_matches_public_question_bank(self) -> None:
        public = (ROOT / "public/question-bank/index.html").read_text(encoding="utf-8")
        docs = (ROOT / "docs/question-bank/index.html").read_text(encoding="utf-8")
        self.assertEqual(public, docs, "Question Bank Pages mirror drift")
        self.assertFalse((ROOT / "public/css/question-bank-compact.css").exists())
        self.assertFalse((ROOT / "public/js/question-bank-live-stats.js").exists())


if __name__ == "__main__":
    unittest.main()
