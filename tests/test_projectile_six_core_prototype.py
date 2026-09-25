from __future__ import annotations
import json, unittest
from pathlib import Path
REPO=Path(__file__).resolve().parents[1]
ROOT=REPO/"docs/grade9/projectile-motion-standard-modified"
PACKAGE=REPO/"Physics/library/phy-kin-2d-motion.v1.json"
BANK=REPO/"Physics/library/exam-bank/competitive-exam-question-bank.v2.json"
PREVIEW=REPO/"docs/core-learning/projectile-motion-standard-modified-preview.html"
def contains_key(obj,key):
 if isinstance(obj,dict): return key in obj or any(contains_key(v,key) for v in obj.values())
 if isinstance(obj,list): return any(contains_key(v,key) for v in obj)
 return False
class ProjectileSixCorePrototypeTest(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.products=json.loads((ROOT/"core-products.json").read_text())
  cls.demands=json.loads((ROOT/"demand-map.json").read_text())
  cls.trace=json.loads((ROOT/"traceability.json").read_text())
  cls.holds=json.loads((ROOT/"hold-register.json").read_text())
  cls.package=json.loads(PACKAGE.read_text()); cls.bank=json.loads(BANK.read_text())
 def test_six_roles_and_core2_hold(self):
  self.assertEqual(set(self.products["products"]),{"CORE1","CORE2","CORE1A","CORE1B","CORE2A","CORE2B"}); self.assertEqual(self.products["products"]["CORE2"]["status"],"HOLD"); self.assertEqual(self.products["products"]["CORE2"]["projection_refs"],[])
 def test_core1a_core1b_same_coverage(self):
  a=self.products["products"]["CORE1A"]["canonical_microtopic_refs"]; b=self.products["products"]["CORE1B"]["canonical_microtopic_refs"]; self.assertEqual(a,b); self.assertEqual(a,[m["id"] for m in self.package["microtopics"]])
 def test_no_replacement_canonical_key(self):
  for path in ROOT.glob("*.json"): self.assertFalse(contains_key(json.loads(path.read_text()),"primary_concept_id"))
 def test_q15_identity_hold(self):
  rows={r["owner_label"]:r for r in self.demands["records"]}; self.assertEqual(set(rows),{"Q28","Q15","Q21","Q26","Q23"}); self.assertIsNone(rows["Q15"]["exact_repository_ref"]); self.assertEqual(rows["Q15"]["primary_capability_state"],"IDENTITY_HOLD"); self.assertEqual(set(rows["Q15"]["candidate_refs"]),{"PYQ-PHY-JEEADV-2018-P2-Q08","PYQ-PHY-JEEADV-2023-P1-Q01"})
 def test_primary_capability_refs_preserved(self):
  b={q["id"]:q for q in self.bank["questions"]}
  for r in self.demands["records"]:
   if r["exact_repository_ref"]:
    q=b[r["exact_repository_ref"]]; self.assertEqual(r["canonical_primary_capability_ref"],q["primary_capability_ref"]); self.assertEqual(r["secondary_capability_refs"],q["secondary_capability_refs"])
 def test_evidence_separate_from_eligibility(self):
  for r in self.demands["records"]: self.assertIn("demand_evidence_status",r); self.assertIn("learner_eligibility_status",r)
 def test_authored_practice_not_anchor_substitution(self):
  anchors={r["exact_repository_ref"] for r in self.demands["records"] if r["exact_repository_ref"]}
  for c in ("CORE2A","CORE2B"):
   p=self.products["products"][c]; self.assertEqual(p["provenance_class"],"AUTHORED_PRACTICE"); self.assertTrue(anchors.isdisjoint(p["question_refs"]))
 def test_core2b_protected_decide_not_scaffolded(self):
  qmap={q["id"]:q for q in self.package["questions"]}
  for qid in self.products["products"]["CORE2B"]["question_refs"]:
   q=qmap[qid]; pref=q["transfer"]["protected_move_ref"]; move=next(m for m in q["answer"]["reasoning_route"] if m["id"]==pref); self.assertEqual(move["kind"],"DECIDE"); self.assertFalse(any(s.get("supports_move_ref")==pref for s in q.get("scaffolds",[]))); self.assertTrue(q["transfer"]["builds_on"]); self.assertEqual(self.products["products"]["CORE2B"]["protected_move_refs"][qid],pref)
 def test_core2a_reasoning_closure(self):
  qmap={q["id"]:q for q in self.package["questions"]}
  for qid in self.products["products"]["CORE2A"]["question_refs"]:
   a=qmap[qid]["answer"]; self.assertTrue(a["reasoning_route"]); self.assertTrue(a["crux_move_ref"]); self.assertTrue(a["summary"]); self.assertTrue(a["check"])
 def test_hint_scaffold_trace_separation(self):
  for r in self.trace["rows"]:
   if r["core_role"] in {"CORE2A","CORE2B"}: self.assertEqual(r["source_hint_refs"],[]); self.assertIn("authored_scaffold_refs",r)
 def test_visual_hold_and_shared_preview(self):
  self.assertTrue(all(v["semantic_review_status"]=="VISUAL_HOLD" for v in self.trace["visual_records"])); self.assertTrue(any(h["id"]=="HOLD-VISUAL-SEMANTIC-REVIEW" for h in self.holds["holds"])); text=PREVIEW.read_text(); self.assertIn('src="./data.js"',text); self.assertIn("mountCoreLearningPage",text); self.assertIn("../js/core-learning/core-learning-host.mjs",text)
if __name__=="__main__": unittest.main()
