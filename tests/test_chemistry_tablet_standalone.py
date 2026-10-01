"""Regression checks for renderer-generated Chemistry blueprint-v2 snapshots."""
from __future__ import annotations

import hashlib
import json
import re
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
CORE1A_FILES = [
    "standalone/core1a-chemistry-behaviour-of-gases-tablet.html",
    "standalone/core1a-chemistry-chemical-bonding-tablet.html",
    "standalone/core1a-chemistry-redox-reactions-tablet.html",
    "standalone/core1a-chemistry-some-basic-concepts-tablet.html",
]
WITHDRAWN_CORE2_FILES = [
    "standalone/core2-chemistry-chemical-bonding-tablet.html",
    "standalone/core2-chemistry-redox-reactions-tablet.html",
    "standalone/core2-chemistry-some-basic-concepts-tablet.html",
]
LINEAGE = {
    "Chemistry/library/behaviour-of-gases.v1.json": (
        "evidence/lineage/pr376/core1a-source/core1a-chemistry-behaviour-of-gases-tablet.html",
        "5c1013e66ffa1964e0b58c1452034304f3e06bf40bc3eb252255271a95419454",
    ),
    "Chemistry/library/chemical-bonding.v1.json": (
        "evidence/lineage/pr376/core1a-source/core1a-chemistry-chemical-bonding-tablet.html",
        "e48261dcdac2d1f696f2acdb2270ce5bab8370e2273e95d8c057e3ad57a63ade",
    ),
    "Chemistry/library/redox-reactions.v1.json": (
        "evidence/lineage/pr376/core1a-source/core1a-chemistry-redox-reactions-tablet.html",
        "95fc2a7e49b1ac629b0571e3085018d28f8c40ce5e0ae43c94274e47340f720c",
    ),
    "Chemistry/library/some-basic-concepts.v1.json": (
        "evidence/lineage/pr376/core1a-source/core1a-chemistry-some-basic-concepts-tablet.html",
        "cc0bc2d8463ca55c1ce5eb47ddccab77f9ce651ada9e9c8fa2864d6c1629fb34",
    ),
}


class ChemistryBlueprintV2Test(unittest.TestCase):
    def test_core2_ungoverned_html_is_withdrawn(self):
        for rel in WITHDRAWN_CORE2_FILES:
            with self.subTest(file=rel):
                self.assertFalse((REPO / rel).exists())

    def test_core1a_snapshots_have_blueprint_v2_anatomy(self):
        for rel in CORE1A_FILES:
            with self.subTest(file=rel):
                text = (REPO / rel).read_text(encoding="utf-8")
                self.assertGreater(len(text), 50_000)
                self.assertIn('data-g9-role="CORE1A"', text)
                self.assertIn('data-g9-mode="SINGLE_FILE"', text)
                self.assertIn('data-blueprint-ref="BP-CORE1A-CONSTRUCTION@1.4.0"', text)
                self.assertIn('meta name="g9-render" content="render_core/2 ', text)
                self.assertEqual(3, text.count('data-g9-component="EQUATIONS"'))
                self.assertEqual(3, text.count('data-g9-component="STAGED_VISUAL"'))
                self.assertEqual(3, text.count('data-g9-component="QUICK_CHECK"'))
                self.assertEqual(3, text.count('data-g9-component="WORKED_EXAMPLE"'))
                self.assertEqual(9, len(re.findall(r'<g\b[^>]*data-g9-stage-id="', text)))
                roles = re.findall(r'<li data-g9-triad-role="(CHECK|APPLY|CONNECT)"', text)
                self.assertEqual(3, roles.count("CHECK"))
                self.assertEqual(3, roles.count("APPLY"))
                self.assertEqual(3, roles.count("CONNECT"))
                self.assertNotIn("Draft audit hold:", text)
                self.assertNotIn("NCERT Try the question", text)
                self.assertIsNone(re.search(r'(?:src|href)\\s*=\\s*["\']https?://', text, re.I))

    def test_lineage_snapshots_are_immutable_and_package_bound(self):
        for package_rel, (snapshot_rel, digest) in LINEAGE.items():
            with self.subTest(package=package_rel):
                snapshot = REPO / snapshot_rel
                self.assertTrue(snapshot.is_file())
                self.assertEqual(digest, hashlib.sha256(snapshot.read_bytes()).hexdigest())
                package = json.loads((REPO / package_rel).read_text(encoding="utf-8"))
                refs = {row["snapshot_ref"]: row["snapshot_digest"] for row in package["resources"]}
                self.assertEqual("sha256:" + digest, refs.get(snapshot_rel))


if __name__ == "__main__":
    unittest.main()
