#!/usr/bin/env python3
from __future__ import annotations

import json
import subprocess
import unittest
from pathlib import Path

from Shared.tools import core_template_contract

REPO = Path(__file__).resolve().parents[2]
BANK = REPO / "Physics/library/exam-bank/competitive-exam-question-bank.v2.json"
PUBLIC = REPO / "public/physics/motion-2d/samples/core2a-projectile-study"
PAGES = REPO / "docs/physics/motion-2d/samples/core2a-projectile-study"
HTML = PUBLIC / "index.html"
APP = PUBLIC / "app.mjs"
MODEL = PUBLIC / "model.mjs"

EXPECTED = {
    "Q21": "PYQ-PHY-JEEADV-2022-P1-Q08",
    "Q26": "PYQ-PHY-JEEADV-2026-P1-Q06",
    "Q23": "PYQ-PHY-JEEADV-2025-P2-Q15",
}


def questions():
    doc = json.loads(BANK.read_text(encoding="utf-8"))
    return {q["id"]: q for q in doc["questions"]}


def node_probe() -> dict:
    script = r"""
const p = './public/physics/motion-2d/samples/core2a-projectile-study/model.mjs';
const m = await import(p);
const q21before = m.q21Snapshot(0.99);
const q21apex = m.q21Snapshot(1);
const q21after = m.q21Snapshot(1.01);
const q26 = m.q26Case('45', 9.8);
const q26_30 = m.q26Case('30', 9.8);
const q26_edge = m.q26Case('atan1over5', 9.8);
const q23t1 = m.q23Horizontal(1);
const initial = m.createStudyState('Q21');
let blocked = false;
try { m.openSolution(initial); } catch (error) { blocked = error.message === 'ATTEMPT_REQUIRED_FOR_SOLUTION'; }
const committed = m.commitAttempt(m.markAttempting(initial), '0.9');
const resetA = m.createStudyState('Q21');
const resetB = m.createStudyState('Q21');
console.log(JSON.stringify({
  refs:m.QUESTION_REFS,
  ratio:m.q21RangeRatio(),
  q21before,q21apex,q21after,
  q26,q26_30,q26_edge,
  q23t1,
  q23source:m.q23SourceDistance(),
  blocked,
  committed,
  deterministic:JSON.stringify(resetA)===JSON.stringify(resetB),
  q21correct:m.answerMatches('Q21','0.95'),
  q26correct:m.answerMatches('Q26',['B','A']),
  q23correct:m.answerMatches('Q23','170')
}));
"""
    result = subprocess.run(
        ["node", "--input-type=module", "-e", script],
        cwd=REPO,
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


class Core2AProjectileSampleTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bank = questions()
        cls.probe = node_probe()
        cls.html = HTML.read_text(encoding="utf-8")
        cls.app = APP.read_text(encoding="utf-8")
        cls.model = MODEL.read_text(encoding="utf-8")

    def test_01_exact_canonical_question_refs(self):
        self.assertEqual(self.probe["refs"], EXPECTED)
        for ref in EXPECTED.values():
            self.assertIn(ref, self.bank)
            self.assertEqual(self.bank[ref]["status"], "CANDIDATE")

    def test_02_core2a_blueprint_resolution(self):
        blueprint = core_template_contract.resolve_web_blueprint_for_core("CORE2A")
        self.assertEqual(blueprint["ref"], "BP-CORE2A-SUPPORTED-APPLICATION@1.0.0")
        self.assertEqual(blueprint["shell_ref"], "G9-TABLET-SHELL-V1")
        self.assertEqual(blueprint["layout_family"], "QUESTION_STUDY")
        self.assertIn('data-web-blueprint="BP-CORE2A-SUPPORTED-APPLICATION@1.0.0"', self.html)
        self.assertIn('data-shell-ref="G9-TABLET-SHELL-V1"', self.html)
        self.assertIn('data-layout-family="QUESTION_STUDY"', self.html)

    def test_03_attempt_precedes_solution_and_crux(self):
        self.assertTrue(self.probe["blocked"])
        self.assertTrue(self.probe["committed"]["attempted"])
        self.assertIn("ATTEMPT_REQUIRED_FOR_SOLUTION", self.model)
        self.assertIn("Commit an attempt before authored support is available", self.html)
        self.assertNotIn("0.95", self.html)

    def test_04_q21_acceleration_changes_only_after_apex(self):
        self.assertFalse(self.probe["q21before"]["changedGravityActive"])
        self.assertFalse(self.probe["q21apex"]["changedGravityActive"])
        self.assertTrue(self.probe["q21after"]["changedGravityActive"])
        self.assertAlmostEqual(self.probe["q21before"]["accelerationRatio"], 1.0, places=12)
        self.assertAlmostEqual(self.probe["q21apex"]["accelerationRatio"], 1.0, places=12)
        self.assertAlmostEqual(self.probe["q21after"]["accelerationRatio"], 1 / 0.81, places=12)

    def test_05_q21_normalized_range_result(self):
        self.assertAlmostEqual(self.probe["ratio"], 0.95, places=12)
        self.assertTrue(self.probe["q21correct"])

    def test_06_q26_point_binding(self):
        self.assertEqual(self.probe["q26"]["point"], {"x": 5, "y": 1})
        q = self.bank[EXPECTED["Q26"]]
        self.assertIn("Point P has coordinates (5 m,1 m)", q["conditions"][1])

    def test_07_q26_45_speed_and_apex_before_p(self):
        q26 = self.probe["q26"]
        self.assertTrue(q26["finiteSpeed"])
        self.assertAlmostEqual(q26["v2"] / q26["g"], 25 / 4, places=10)
        self.assertEqual(q26["symbolicSpeed"], "5√g / 2")
        self.assertLess(q26["slopeAtP"], 0)
        self.assertEqual(q26["apexRelation"], "BEFORE_P")
        self.assertEqual(self.probe["q26_30"]["apexRelation"], "BEFORE_P")
        self.assertFalse(self.probe["q26_edge"]["finiteSpeed"])
        self.assertTrue(self.probe["q26correct"])

    def test_08_q23_horizontal_exponential_decay(self):
        q23 = self.probe["q23t1"]
        self.assertAlmostEqual(q23["vx"] / 135, 2.718281828459045 ** -0.5, places=10)
        self.assertLess(q23["vx"], 135)
        self.assertGreater(q23["x"], q23["vx"] * q23["time"])
        self.assertIn("m dvx/dt", self.bank[EXPECTED["Q23"]]["answer"]["reasoning"][0])

    def test_09_q23_source_e_convention_gives_170_m(self):
        self.assertAlmostEqual(self.probe["q23source"], 170.0, places=10)
        self.assertTrue(self.probe["q23correct"])
        q = self.bank[EXPECTED["Q23"]]
        self.assertIn("170 m", q["answer"]["summary"])
        self.assertIn("e=2.7", q["stem"])

    def test_10_deterministic_reset(self):
        self.assertTrue(self.probe["deterministic"])
        self.assertIn("resetQuestion", self.app)
        self.assertIn("freshSimulation(owner)", self.app)

    def test_11_keyboard_accessible_controls(self):
        self.assertIn('tabindex="0"', self.html)
        self.assertIn('event.code === "Space"', self.app)
        self.assertIn('event.key === "Home"', self.app)
        self.assertIn('event.key === "ArrowRight"', self.app)
        self.assertIn("min-height:48px", (PUBLIC / "study.css").read_text(encoding="utf-8"))

    def test_12_public_pages_generated_artifact_parity(self):
        for name in ("index.html", "study.css", "app.mjs", "model.mjs"):
            public = PUBLIC / name
            pages = PAGES / name
            self.assertTrue(pages.is_file(), f"missing Pages mirror {pages.relative_to(REPO)}")
            self.assertEqual(public.read_bytes(), pages.read_bytes(), name)

    def test_13_no_external_runtime_dependency(self):
        for path in (HTML, PUBLIC / "study.css", APP, MODEL):
            text = path.read_text(encoding="utf-8")
            self.assertNotIn("https://", text, path.name)
            self.assertNotIn("http://", text, path.name)
        self.assertIn("../../../../data/question-bank-data.js", self.html)
        self.assertNotIn("<iframe", self.html.lower())

    def test_14_authority_and_progressive_support_labels(self):
        self.assertIn("Academic authority: generated Question Bank projection", self.html)
        self.assertIn("Authored support — not a source hint.", self.app)
        for ref in EXPECTED.values():
            q = self.bank[ref]
            self.assertEqual(q["answer"]["crux_move_ref"], q["answer"]["reasoning_route"][1]["id"])
            self.assertGreaterEqual(len(q["scaffolds"]), 2)


if __name__ == "__main__":
    unittest.main()
