import json
import math
import subprocess
import unittest
from pathlib import Path

from Shared.tools import build_pages_site, web_blueprint_contract

REPO = Path(__file__).resolve().parents[1]
BANK = REPO / "Physics/library/exam-bank/competitive-exam-question-bank.v2.json"
MODEL = REPO / "public/physics/motion-2d/core2a-projectile-study/study-model.mjs"
COMPONENT = REPO / "public/physics/motion-2d/core2a-projectile-study/study-component.mjs"
VISUALS = REPO / "public/physics/motion-2d/core2a-projectile-study/study-visuals.mjs"
STYLES = REPO / "public/physics/motion-2d/core2a-projectile-study/study-styles.mjs"
PAGE = REPO / "public/physics/motion-2d/core2a-projectile-study/index.html"
REFS = [
    "PYQ-PHY-JEEADV-2022-P1-Q08",
    "PYQ-PHY-JEEADV-2026-P1-Q06",
    "PYQ-PHY-JEEADV-2025-P2-Q15",
]


class Core2AProjectileStudyTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bank = json.loads(BANK.read_text(encoding="utf-8"))
        cls.by_id = {row["id"]: row for row in cls.bank["questions"]}
        cls.page = PAGE.read_text(encoding="utf-8")
        cls.source = "\n".join(
            path.read_text(encoding="utf-8")
            for path in [MODEL, COMPONENT, VISUALS, STYLES]
        )

    def test_exact_canonical_question_refs_and_candidate_status(self):
        self.assertEqual(len(REFS), len(set(REFS)))
        for ref in REFS:
            row = self.by_id[ref]
            self.assertEqual("CANDIDATE", row["status"])
            self.assertEqual("FAM-PHY-KIN-2D-PRACTICE", row["family_ref"])
            self.assertIn("CORE2A", {item["core"] for item in row["exposure"]})
            self.assertIn(ref, self.source)

    def test_core2a_blueprint_resolves_to_required_shell_and_layout(self):
        row = web_blueprint_contract.resolve_blueprint(
            "BP-CORE2A-SUPPORTED-APPLICATION@1.0.0"
        )
        self.assertEqual("G9-TABLET-SHELL-V1", row["shell_ref"])
        self.assertEqual("QUESTION_STUDY", row["layout_family"])
        self.assertTrue(row["interaction_policy"]["progressive_support"])
        self.assertGreaterEqual(row["touch_policy"]["minimum_target_css_px"], 48)
        self.assertGreaterEqual(row["touch_policy"]["minimum_control_gap_css_px"], 8)
        self.assertIn("BP-CORE2A-SUPPORTED-APPLICATION@1.0.0", self.page)

    def test_attempt_before_solution_and_deterministic_reset(self):
        script = f"""
          import {{createStudyState, transitionStudyState}} from {json.dumps(MODEL.as_uri())};
          let s=createStudyState("Q21");
          const before=transitionStudyState(s,{{type:"OPEN_SOLUTION",requiredReasoning:3}});
          s=transitionStudyState(s,{{type:"SET_ATTEMPT",value:"0.9"}});
          s=transitionStudyState(s,{{type:"COMMIT_ATTEMPT"}});
          const blocked=transitionStudyState(s,{{type:"OPEN_SOLUTION",requiredReasoning:3}});
          for(let i=0;i<3;i++) s=transitionStudyState(s,{{type:"SHOW_REASONING",total:3}});
          s=transitionStudyState(s,{{type:"OPEN_SOLUTION",requiredReasoning:3}});
          const reset=transitionStudyState(s,{{type:"RESET"}});
          console.log(JSON.stringify({{before,blocked,open:s,reset}}));
        """
        result = json.loads(
            subprocess.check_output(
                ["node", "--input-type=module", "-e", script], text=True
            )
        )
        self.assertFalse(result["before"]["solutionOpen"])
        self.assertFalse(result["blocked"]["solutionOpen"])
        self.assertTrue(result["open"]["solutionOpen"])
        self.assertEqual(
            result["reset"],
            {
                "owner": "Q21",
                "phase": "INITIAL",
                "attempted": False,
                "attempt": "",
                "supportIndex": 0,
                "reasoningIndex": 0,
                "solutionOpen": False,
                "checked": False,
                "q21": {
                    "time": 0,
                    "playing": False,
                    "vectors": False,
                    "compare": True,
                },
                "q26": {"angle": "degree0"},
                "q23": {
                    "time": 0,
                    "playing": False,
                    "compare": True,
                    "vector": True,
                },
            },
        )

    def test_q21_acceleration_switch_and_normalized_range(self):
        script = f"""
          import {{q21State}} from {json.dumps(MODEL.as_uri())};
          console.log(JSON.stringify({{
            before:q21State(.8,.81),
            apex:q21State(1,.81),
            after:q21State(1.01,.81),
            end:q21State(99,.81)
          }}));
        """
        data = json.loads(
            subprocess.check_output(
                ["node", "--input-type=module", "-e", script], text=True
            )
        )
        self.assertEqual(1, data["before"]["accelerationFactor"])
        self.assertEqual(1, data["apex"]["accelerationFactor"])
        self.assertAlmostEqual(1 / 0.81, data["after"]["accelerationFactor"], places=12)
        self.assertAlmostEqual(0.95, data["end"]["rangeRatio"], places=12)
        self.assertAlmostEqual(0.95, data["end"]["x"], places=12)

    def test_q26_point_binding_45_degree_speed_and_apex_state(self):
        row = self.by_id[REFS[1]]
        point_condition = next(
            item for item in row["conditions"] if "coordinates" in item
        )
        self.assertIn("(5 m,1 m)", point_condition)
        script = f"""
          import {{solvePointPassage}} from {json.dumps(MODEL.as_uri())};
          console.log(JSON.stringify(solvePointPassage(Math.PI/4,1,{{x:5,y:1}})));
        """
        data = json.loads(
            subprocess.check_output(
                ["node", "--input-type=module", "-e", script], text=True
            )
        )
        self.assertTrue(data["valid"])
        self.assertAlmostEqual(2.5, data["v"], places=12)
        self.assertLess(data["slope"], 0)
        self.assertEqual("BEFORE", data["apexRelativeToP"])
        self.assertLess(data["apexX"], 5)

    def test_q23_exponential_horizontal_model_and_source_e_evaluation(self):
        script = f"""
          import {{q23Horizontal}} from {json.dumps(MODEL.as_uri())};
          const p={{mass:.2,speed:270,angleDegrees:60,c:.1,eBase:2.7}};
          console.log(JSON.stringify({{
            start:q23Horizontal(0,p),
            end:q23Horizontal(2,p)
          }}));
        """
        data = json.loads(
            subprocess.check_output(
                ["node", "--input-type=module", "-e", script], text=True
            )
        )
        self.assertAlmostEqual(135, data["start"]["vx0"], places=10)
        self.assertAlmostEqual(2, data["start"]["tau"], places=12)
        self.assertLess(data["end"]["vx"], data["start"]["vx0"])
        self.assertAlmostEqual(170, data["end"]["x"], places=9)
        self.assertAlmostEqual(270, data["end"]["noDragX"], places=9)

    def test_keyboard_touch_progressive_reveal_and_no_external_runtime_dependency(self):
        self.assertIn('role="tablist"', self.source)
        self.assertIn('"ArrowLeft"', self.source)
        self.assertIn('"ArrowRight"', self.source)
        self.assertIn("min-height:48px", self.source)
        self.assertIn("@media(prefers-reduced-motion:reduce)", self.source)
        self.assertIn("reveal = this.state.solutionOpen", self.source)
        self.assertIn("if (!this.state.attempted)", self.source)
        self.assertIn("Q23-UI-6", self.source)
        self.assertNotIn("<iframe", self.page.lower())
        self.assertNotIn("https://", self.page)
        self.assertNotIn("http://", self.page)
        self.assertIn("../../../data/question-bank-data.js", self.page)
        projection = (
            REPO / "public/data/question-bank-data.js"
        ).read_text(encoding="utf-8")
        for ref in REFS:
            self.assertIn(ref, projection)

    def test_modules_import_without_runtime_errors(self):
        script = "\n".join(
            [
                f"import {json.dumps(MODEL.as_uri())};",
                f"import {json.dumps(VISUALS.as_uri())};",
                f"import {json.dumps(STYLES.as_uri())};",
                f"import {json.dumps(COMPONENT.as_uri())};",
                'console.log("ok")',
            ]
        )
        output = subprocess.check_output(
            ["node", "--input-type=module", "-e", script], text=True
        ).strip()
        self.assertEqual("ok", output)

    def test_pages_outputs_match_the_normal_generator_transform(self):
        for path in [MODEL, COMPONENT, VISUALS, STYLES, PAGE]:
            relative = path.relative_to(REPO / "public").as_posix()
            expected = build_pages_site._public_payload(relative, path.read_bytes())
            actual = (REPO / "docs" / relative).read_bytes()
            self.assertEqual(expected, actual, relative)


if __name__ == "__main__":
    unittest.main()
