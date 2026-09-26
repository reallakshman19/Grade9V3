"""Stress-product regression checks for the researched projectile six-Core pack."""
from __future__ import annotations
import json, re, unittest
from pathlib import Path
REPO=Path(__file__).resolve().parents[1]
PACK=REPO/"Physics/library/phy-kin-2d-projectile-extensions.v1.json"
TRACE=REPO/"Physics/content/motion-2d-projectile-stress/trace.json"
WEB=REPO/"public/physics/motion-2d/projectile-stress"
class ProjectileStressDelivery(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pack=json.loads(PACK.read_text(encoding="utf-8"))
        cls.trace=json.loads(TRACE.read_text(encoding="utf-8"))
    def test_canonical_spine_is_dependency_not_redefinition(self):
        self.assertEqual(self.pack["buckets"][0]["prerequisite_refs"],["BUCKET-PHY-KIN-2D-MOTION"])
        self.assertEqual(len(self.pack["microtopics"]),5)
        self.assertTrue(all(m["extensions"]["projectile_stress:classification"]=="EXTENSION" for m in self.pack["microtopics"]))
    def test_all_five_demands_and_q15_discriminator(self):
        self.assertEqual({d["owner_label"] for d in self.trace["demands"]},{"Q28","Q15","Q21","Q26","Q23"})
        q15=self.trace["q15_resolution"]
        self.assertEqual(q15["resolved_ref"],"PYQ-PHY-JEEADV-2018-P2-Q08")
        self.assertIn("PYQ-PHY-JEEADV-2023-P1-Q01",q15["candidates_considered"])
        self.assertIn("half kinetic-energy loss",q15["discriminator"])
    def test_authored_practice_and_transfer_inventory(self):
        qs=self.pack["questions"]
        self.assertEqual(len([q for q in qs if q["exposure"][0]["core"]=="CORE2A"]),5)
        transfer=[q for q in qs if q["exposure"][0]["core"]=="CORE2B"]
        self.assertEqual(len(transfer),5)
        self.assertTrue(all(q["transfer"]["protected_move_ref"]==q["answer"]["crux_move_ref"] for q in transfer))
        self.assertTrue(all(q["origin"]=="AUTHORED" for q in qs))
    def test_six_pages_exist_and_no_escape_state_language(self):
        forbidden=re.compile(r"\b(?:HOLD|HELD|FAILED|INCOMPLETE|BLOCKED|WAITING|PENDING|WITHHELD|NOT_ESTABLISHED|UNAVAILABLE|DEFERRED)\b")
        for core in ("core1","core2","core1a","core1b","core2a","core2b"):
            text=(WEB/f"{core}.html").read_text(encoding="utf-8")
            self.assertFalse(forbidden.search(text),core)
            self.assertIn("Projectile Stress Pack",text)
    def test_attempt_first_pages_conceal_post_attempt_blocks(self):
        for core in ("core1b","core2b"):
            text=(WEB/f"{core}.html").read_text(encoding="utf-8")
            self.assertIn('data-role="attempt"',text)
            self.assertIn('data-role="post-attempt"',text)
            self.assertRegex(text,r'data-role="post-attempt"[^>]*hidden')
            self.assertLess(text.index('data-role="attempt"'),text.index('data-role="post-attempt"'))
    def test_no_primary_concept_id(self):
        self.assertNotIn("primary_concept_id",json.dumps(self.pack)+json.dumps(self.trace))
if __name__=="__main__":
    unittest.main()
