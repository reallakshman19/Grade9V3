"""Issue #124: horse-cart third-law/system-boundary explorer."""
from __future__ import annotations

import json
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]


class HorseCartExplorerContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.package = json.loads(
            (REPO / "Physics/library/phy-nlm-first-law.v1.json").read_text(encoding="utf-8")
        )
        cls.html = (
            REPO / "public/physics/nlm/explorers/horse-cart/index.html"
        ).read_text(encoding="utf-8")
        cls.resources = {row["id"]: row for row in cls.package["resources"]}
        cls.microtopics = {row["id"]: row for row in cls.package["microtopics"]}
        cls.representations = {row["id"]: row for row in cls.package["representations"]}

    def test_activity_reuses_existing_third_law_truth(self):
        row = self.resources["ACT-NLM-HORSE-CART-SYSTEM-BOUNDARY"]
        self.assertEqual(
            row["supports_claims"],
            ["CAP-NLM-FBD-BODY-OWNERSHIP", "CAP-NLM-THIRD-LAW"],
        )
        self.assertEqual(
            row["locator"],
            "public/physics/nlm/explorers/horse-cart/index.html",
        )
        self.assertEqual(row["origin"], "AUTHORED")
        self.assertEqual(row["depth"], ["FOUNDATION"])

    def test_third_law_microtopic_binds_existing_fbd_representation(self):
        micro = self.microtopics["MIC-PHY-NLM-THIRD-LAW"]
        self.assertIn("REP-NLM-FBD-BODY-OWNERSHIP", micro["representation_refs"])
        rep = self.representations["REP-NLM-FBD-BODY-OWNERSHIP"]
        self.assertIn(
            "ACT-NLM-HORSE-CART-SYSTEM-BOUNDARY",
            rep["interactive_resource_refs"],
        )

    def test_explorer_keeps_partner_forces_on_different_bodies(self):
        self.assertIn("horse on cart = +T", self.html)
        self.assertIn("cart on horse = -T", self.html)
        self.assertIn("act on different bodies", self.html)
        self.assertIn("chosen system: horse + cart", self.html)

    def test_combined_system_uses_external_ground_force(self):
        self.assertIn(
            "ground-on-horse traction is external",
            self.html,
        )
        self.assertIn(
            "F<sub>g</sub> = (m<sub>h</sub> + m<sub>c</sub>)a",
            self.html,
        )
        self.assertIn(
            "the environment exerts a non-zero external force",
            self.html,
        )

    def test_single_body_equations_do_not_cancel_third_law_pair(self):
        self.assertIn(
            "Horse: F<sub>g</sub> - T = m<sub>h</sub>a",
            self.html,
        )
        self.assertIn(
            "Cart: T = m<sub>c</sub>a",
            self.html,
        )

    def test_slice_does_not_expand_to_other_open_backlog(self):
        lower = self.html.lower()
        self.assertNotIn("pseudo force", lower)
        self.assertNotIn("centripetal", lower)
        row = self.resources["ACT-NLM-HORSE-CART-SYSTEM-BOUNDARY"]
        self.assertNotIn("CAP-NLM-FRAME-CHOICE", row["supports_claims"])


if __name__ == "__main__":
    unittest.main()
