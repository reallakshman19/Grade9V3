from __future__ import annotations

import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"


class LearnerResourceWiringTests(unittest.TestCase):
    def test_shared_shell_removes_test_and_owner_workflow_from_learner_presentation(self) -> None:
        shell = (PUBLIC / "js/site-header.js").read_text(encoding="utf-8")
        self.assertIn("querySelectorAll('[data-site-test]')", shell)
        self.assertIn("/owner workflow/i", shell)
        self.assertNotIn("t.href=root+'test/index.html'", shell)

    def test_subject_hubs_do_not_present_test_as_primary_navigation(self) -> None:
        for rel in ("physics/index.html", "chemistry/index.html", "mathematics/index.html"):
            text = (PUBLIC / rel).read_text(encoding="utf-8")
            self.assertNotIn("data-site-test", text, rel)

    def test_technical_atlases_are_not_the_subject_hub_learner_handoff(self) -> None:
        math = (PUBLIC / "mathematics/index.html").read_text(encoding="utf-8")
        self.assertNotIn('href="linear-equations/index.html"', math)
        self.assertIn("subject=Mathematics&amp;topic=Linear%20Equations", math)

        physics = (PUBLIC / "physics/index.html").read_text(encoding="utf-8")
        self.assertNotIn('href="nlm/index.html"', physics)
        self.assertIn("subject=Physics&amp;topic=Newton%27s%20Laws%20of%20Motion%20%2F%20NLM", physics)

    def test_motion_session_is_contextual_searchable_and_can_return(self) -> None:
        physics = (PUBLIC / "physics/index.html").read_text(encoding="utf-8")
        self.assertIn('../motion-session/index.html', physics)

        public_session = (PUBLIC / "motion-session/index.html").read_text(encoding="utf-8")
        self.assertIn('href="../physics/index.html"', public_session)
        self.assertIn('matrix_id: "MATRIX-PHY-KIN-2D-MOTION"', public_session)

        source_session = (ROOT / "standalone/motion-session/index.html").read_text(encoding="utf-8")
        self.assertIn('href="../../public/physics/index.html"', source_session)

        registry = json.loads((ROOT / "Shared/search/site-search-resources.v1.json").read_text(encoding="utf-8"))
        rows = [row for row in registry["resources"] if row["path"] == "motion-session/index.html"]
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["kind"], "guided_session")
        self.assertIn("shared clock", rows[0]["keywords"])

    def test_global_static_registry_does_not_publish_owner_or_atlas_surfaces(self) -> None:
        registry = json.loads((ROOT / "Shared/search/site-search-resources.v1.json").read_text(encoding="utf-8"))
        paths = {row["path"] for row in registry["resources"]}
        for forbidden in (
            "raw-intake/index.html",
            "core-prompt-composer/index.html",
            "portable-workbench/index.html",
            "mathematics/linear-equations/index.html",
            "physics/nlm/index.html",
            "physics/motion-2d/index.html",
        ):
            self.assertNotIn(forbidden, paths)

    def test_global_search_projection_matches_registry(self) -> None:
        registry = json.loads((ROOT / "Shared/search/site-search-resources.v1.json").read_text(encoding="utf-8"))["resources"]
        text = (PUBLIC / "data/site-search-resources.js").read_text(encoding="utf-8").strip()
        prefix = "window.GRADE9_SITE_SEARCH_RESOURCES="
        self.assertTrue(text.startswith(prefix) and text.endswith(";"))
        projected = json.loads(text[len(prefix):-1])
        self.assertEqual(projected, registry)


if __name__ == "__main__":
    unittest.main()
