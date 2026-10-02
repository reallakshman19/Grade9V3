import html
import re
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
PRACTICE = REPO / "standalone" / "practice"

PLACEHOLDERS = (
    "Apply 2D projectile kinematic decomposition.",
    "Follow step-by-step kinematics setup and verify dimensional units.",
    "Apply 2D vector kinematics and equations of motion.",
    "Apply ΣF = ma along acceleration axis.",
    "Use kinematic equations: v = u + at, s = ut + 0.5at², v² - u² = 2as.",
)

def text_of(path):
    return path.read_text(encoding="utf-8", errors="replace")

def prompts(markup):
    return [
        html.unescape(re.sub(r"<[^>]+>", " ", x)).strip()
        for x in re.findall(r'<p class="q-prompt">(.*?)</p>', markup, flags=re.S)
    ]

class TestPracticeContentQuality(unittest.TestCase):
    def test_generic_reveal_placeholders_are_removed(self):
        targets = [
            "core2-motion-1d-straight-line-tablet.html",
            "core1a-physics-nlm-tablet.html",
            "core1a-physics-motion-2d-ncert-tablet.html",
            "core1a-sba-motion-in-a-plane-master-tablet.html",
            "core2-motion-consolidated-practice-tablet.html",
        ]
        for name in targets:
            markup = text_of(PRACTICE / name)
            for placeholder in PLACEHOLDERS:
                self.assertNotIn(placeholder, markup, f"{name} still contains generic reveal text")

    def test_attempt_prompts_are_complete_questions(self):
        cases = [
            ("core2-motion-1d-straight-line-tablet.html", 14),
            ("core1a-physics-nlm-tablet.html", 20),
            ("core1a-physics-motion-2d-ncert-tablet.html", 9),
        ]
        for name, count in cases:
            ps = prompts(text_of(PRACTICE / name))[:count]
            self.assertEqual(len(ps), count, f"{name}: expected {count} attempt prompts")
            for p in ps:
                self.assertNotIn("answer protected QUESTION", p, f"{name}: extraction wrapper leaked into prompt")
                self.assertRegex(p, r"[?.!]$", f"{name}: incomplete/truncated prompt: {p}")

    def test_method_cards_are_explicitly_answerable(self):
        sba = text_of(PRACTICE / "core1a-sba-motion-in-a-plane-master-tablet.html")
        consolidated = text_of(PRACTICE / "core2-motion-consolidated-practice-tablet.html")
        self.assertGreaterEqual(sba.count("Method check —"), 50)
        self.assertGreaterEqual(consolidated.count("Method check —") + consolidated.count("Review check —"), 48)

    def test_advanced_core2_items_are_labelled_extensions(self):
        markup = text_of(PRACTICE / "core2-motion-in-a-plane-tablet.html")
        for qid in ("q45", "q46", "q50", "q53", "q57"):
            m = re.search(rf'<article[^>]*id="{qid}"[^>]*>(.*?)</article>', markup, flags=re.S)
            self.assertIsNotNone(m, f"{qid} missing")
            self.assertIn("Declared extension", m.group(1), f"{qid} missing extension label")
        self.assertIn("SBA-21 · Declared extension", text_of(PRACTICE / "core1a-sba-motion-in-a-plane-master-tablet.html"))

if __name__ == "__main__":
    unittest.main()
