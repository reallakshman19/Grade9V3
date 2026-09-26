from __future__ import annotations

import json
import re
import subprocess
import unittest
from pathlib import Path

from Shared.library.intake import check

REPO = Path(__file__).resolve().parents[1]
PRODUCT = REPO / "Physics/content/motion-2d-projectile-demand/product.v1.json"
CANONICAL = REPO / "Physics/library/phy-kin-2d-motion.v1.json"
EXT = REPO / "Physics/library/phy-kin-2d-projectile-extensions.v1.json"
BANK = REPO / "Physics/library/exam-bank/competitive-exam-question-bank.v2.json"
TRACE = REPO / "Physics/content/motion-2d-projectile-demand/trace.v1.json"
OUT = REPO / "public/physics/motion-in-2d/projectile-demand"

CANONICAL_MICROS = [
    "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
    "MIC-PHY-KIN-2D-CONSTANT-ACCELERATION",
    "MIC-PHY-KIN-PROJECTILE-MODEL",
]
EXT_MICROS = [
    "MIC-PHY-KIN-2D-VEL-FROM-POSITION",
    "MIC-PHY-KIN-PROJ-BOUNCE-ENERGY",
    "MIC-PHY-KIN-PROJ-PIECEWISE-G",
    "MIC-PHY-KIN-PROJ-TRAJECTORY-POINT",
    "MIC-PHY-KIN-2D-LINEAR-DRAG",
]
PRIMARY = {
    "PYQ-PHY-JEEMAIN-2026-04APR-S2-Q29": "CAP-KIN-2D-INDEPENDENT-COMPONENTS",
    "PYQ-PHY-JEEADV-2018-P2-Q08": "CAP-KIN-PROJECTILE-MODEL",
    "PYQ-PHY-JEEADV-2022-P1-Q08": "CAP-KIN-PROJECTILE-MODEL",
    "PYQ-PHY-JEEADV-2026-P1-Q06": "CAP-KIN-PROJECTILE-MODEL",
    "PYQ-PHY-JEEADV-2025-P2-Q15": "CAP-KIN-2D-CONSTANT-ACCELERATION",
}


class Motion2DProjectileStressProductTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.product = json.loads(PRODUCT.read_text(encoding="utf-8"))
        cls.canonical = json.loads(CANONICAL.read_text(encoding="utf-8"))
        cls.ext = json.loads(EXT.read_text(encoding="utf-8"))
        cls.bank = json.loads(BANK.read_text(encoding="utf-8"))
        cls.bank_by_id = {q["id"]: q for q in cls.bank["questions"]}
        cls.ext_by_id = {
            row["id"]: row
            for key in ("capabilities","microtopics","relations","representations","questions")
            for row in cls.ext.get(key, [])
        }

    def test_extension_package_is_schema_admitted(self):
        report = check(self.ext)
        self.assertTrue(report["admitted"], report)

    def test_canonical_r1_r3_remain_exact_and_extensions_are_separate(self):
        self.assertEqual([m["id"] for m in self.canonical["microtopics"]], CANONICAL_MICROS)
        self.assertEqual(
            [c["id"] for c in self.canonical["capabilities"]],
            [
                "CAP-KIN-2D-INDEPENDENT-COMPONENTS",
                "CAP-KIN-2D-CONSTANT-ACCELERATION",
                "CAP-KIN-PROJECTILE-MODEL",
            ],
        )
        canonical_ids = {row["id"] for key in ("capabilities","microtopics","relations","representations","questions")
                         for row in self.canonical.get(key, [])}
        self.assertFalse(set(EXT_MICROS) & canonical_ids)
        self.assertEqual([m["id"] for m in self.ext["microtopics"]], EXT_MICROS)
        for m in self.ext["microtopics"]:
            self.assertEqual(m["extensions"]["grade9v3:classification"], "EXTENSION")
            self.assertIn(m["extensions"]["grade9v3:extends_microtopic_ref"], CANONICAL_MICROS)

    def test_all_five_demands_and_primary_capability_refs_are_preserved(self):
        self.assertEqual([d["owner_label"] for d in self.product["demands"]], ["Q28","Q15","Q21","Q26","Q23"])
        for ref, capability in PRIMARY.items():
            self.assertEqual(self.bank_by_id[ref]["primary_capability_ref"], capability)
        text = PRODUCT.read_text(encoding="utf-8") + EXT.read_text(encoding="utf-8")
        self.assertNotIn("primary_concept_id", text)

    def test_q15_identity_is_researched_and_discriminated(self):
        d = next(x for x in self.product["demands"] if x["owner_label"] == "Q15")
        self.assertEqual(d["resolved_ref"], "PYQ-PHY-JEEADV-2018-P2-Q08")
        self.assertEqual(d["other_candidate_refs"][0]["ref"], "PYQ-PHY-JEEADV-2023-P1-Q01")
        self.assertIn("different demand", d["other_candidate_refs"][0]["reason_not_selected"])
        chosen = self.bank_by_id[d["resolved_ref"]]["extensions"]["grade9v3:projectile_stress"]
        other = self.bank_by_id["PYQ-PHY-JEEADV-2023-P1-Q01"]["extensions"]["grade9v3:projectile_stress"]
        self.assertEqual(chosen["selection_status"], "SELECTED")
        self.assertEqual(other["selection_status"], "NOT_SELECTED")

    def test_demand_evidence_and_learner_eligibility_are_separate(self):
        excluded = [d for d in self.product["demands"] if d["learner_eligibility_status"] == "EXCLUDED"]
        self.assertGreaterEqual(len(excluded), 4)
        for d in excluded:
            self.assertEqual(d["demand_evidence_status"], "SOURCE_VERIFIED")
            q = self.ext_by_id[d["core2a_ref"]]
            self.assertEqual(q["extensions"]["grade9v3:provenance_class"], "AUTHORED_PRACTICE")
            self.assertEqual(q["exposure"][0]["core"], "CORE2A")

    def test_core1a_and_core1b_have_identical_concept_coverage(self):
        a = self.product["cores"]["CORE1A"]["microtopic_refs"]
        b = self.product["cores"]["CORE1B"]["microtopic_refs"]
        self.assertEqual(a, b)
        self.assertEqual(a[:3], CANONICAL_MICROS)
        self.assertEqual(a[3:], EXT_MICROS)

    def test_core2a_routes_are_complete(self):
        for ref in self.product["cores"]["CORE2A"]["question_refs"]:
            q = self.ext_by_id[ref]
            self.assertTrue(q["answer"]["reasoning_route"])
            self.assertTrue(q["answer"]["crux_move_ref"])
            self.assertTrue(q["answer"]["check"])
            self.assertTrue(q["repair_ref"])

    def test_core2b_protected_move_is_decide_and_has_prior_exposure(self):
        exposure = self.product["cores"]["CORE2B"]["prior_exposure_map"]
        for ref in self.product["cores"]["CORE2B"]["question_refs"]:
            q = self.ext_by_id[ref]
            protected = q["transfer"]["protected_move_ref"]
            move = next(m for m in q["answer"]["reasoning_route"] if m["id"] == protected)
            self.assertEqual(move["kind"], "DECIDE")
            self.assertEqual(q.get("scaffolds", []), [])
            self.assertEqual(len(exposure[ref]), 3)
            self.assertEqual(q["transfer"]["builds_on"], [exposure[ref][2].split("#", 1)[1]])

    def test_three_item_diagnostic_and_default_learner_contract(self):
        self.assertGreaterEqual(len(self.product["diagnostic"]), 3)
        self.assertEqual(self.product["learner_defaults"]["knowledge_estimate_percent"], 50)
        self.assertEqual(self.product["learner_defaults"]["support"], "FULL")
        self.assertIn("does not change Core1A/Core1B coverage", self.product["learner_defaults"]["interpretation"])

    def test_rendered_product_is_current(self):
        done = subprocess.run(
            ["python3", "Physics/tools/build_motion2d_projectile_product.py", "--check"],
            cwd=REPO,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        self.assertEqual(done.returncode, 0, done.stdout)

    def test_all_six_pages_and_preview_are_rendered(self):
        for name in ("core1.html","core2.html","core1a.html","core1b.html","core2a.html","core2b.html","index.html","trace.json"):
            self.assertTrue((OUT / name).is_file(), name)
        for core, filename in {
            "CORE1":"core1.html","CORE2":"core2.html","CORE1A":"core1a.html",
            "CORE1B":"core1b.html","CORE2A":"core2a.html","CORE2B":"core2b.html",
        }.items():
            text = (OUT / filename).read_text(encoding="utf-8")
            self.assertIn(f'data-core="{core}"', text)
            self.assertIn(self.product["cores"][core]["blueprint_ref"], text)

    def test_core2_keeps_source_hints_separate_from_authored_scaffolds(self):
        text = (OUT / "core2.html").read_text(encoding="utf-8")
        for ref in self.product["cores"]["CORE2"]["question_refs"]:
            q = self.bank_by_id[ref]
            for scaffold in q.get("scaffolds", []):
                self.assertNotIn(scaffold["text"], text)

    def test_core1b_attempt_precedes_reconstruction_for_every_concept(self):
        text = (OUT / "core1b.html").read_text(encoding="utf-8")
        for mid in self.product["cores"]["CORE1B"]["microtopic_refs"]:
            start = text.index(f'id="{mid}"')
            end = text.index("</article>", start)
            section = text[start:end]
            self.assertLess(section.index('data-stage="PREDICT"'), section.index('data-stage="ATTEMPT"'))
            self.assertLess(section.index('data-stage="ATTEMPT"'), section.index('data-stage="RECONSTRUCT"'))
            self.assertLess(section.index('data-stage="RECONSTRUCT"'), section.index('data-stage="BOUNDARY_TEST"'))

    def test_core2b_commitment_precedes_changed_demand_and_protected_move(self):
        text = (OUT / "core2b.html").read_text(encoding="utf-8")
        for ref in self.product["cores"]["CORE2B"]["question_refs"]:
            start = text.index(f'id="{ref}"')
            end = text.index("</article>", start)
            section = text[start:end]
            commit = section.index('data-role="learner-commitment"')
            changed = section.index("<h3>Changed demand</h3>")
            protected = section.index("<h3>Protected DECIDE move</h3>")
            self.assertLess(commit, changed)
            self.assertLess(commit, protected)

    def test_every_extension_visual_is_rendered_and_accessible(self):
        text = (OUT / "core1a.html").read_text(encoding="utf-8")
        preview = (OUT / "index.html").read_text(encoding="utf-8")
        for spec in self.product["visual_specs"]:
            needle = f'data-representation-ref="{spec["representation_ref"]}"'
            self.assertIn(needle, text)
            self.assertIn(needle, preview)
            self.assertIn(spec["alt"], text)

    def test_trace_contains_required_fields_and_every_demand(self):
        trace = json.loads(TRACE.read_text(encoding="utf-8"))
        required = {
            "artifact_id","Core","canonical_source_ref","owner_label","exact_ref","other_candidates",
            "primary_capability_ref","secondary_capability_refs","microtopic","demand_evidence_status",
            "learner_eligibility_status","prerequisites","misconception","representation_ref","reveal_state",
            "source_hint_refs","authored_scaffold_refs","reasoning_refs","verification_ref","provenance_class",
            "transformation_from_canonical_truth","prior_exposure_refs","protected_move","duties_performed","review_labels",
        }
        self.assertTrue(trace["artifacts"])
        for row in trace["artifacts"]:
            self.assertTrue(required <= set(row), row["artifact_id"])
        labels = {row["owner_label"] for row in trace["artifacts"] if row["owner_label"]}
        self.assertEqual(labels, {"Q28","Q15","Q21","Q26","Q23"})

    def test_new_learner_product_surfaces_have_no_escape_state_tokens(self):
        forbidden = re.compile(r"\b(?:HOLD|HELD|FAILED?|INCOMPLETE|BLOCKED|WAITING|PENDING|WITHHELD|NOT_ESTABLISHED|UNAVAILABLE|DEFERRED)\b")
        paths = [PRODUCT, TRACE, *sorted(OUT.glob("*"))]
        for path in paths:
            if path.is_file():
                self.assertIsNone(forbidden.search(path.read_text(encoding="utf-8")), path)


if __name__ == "__main__":
    unittest.main()
