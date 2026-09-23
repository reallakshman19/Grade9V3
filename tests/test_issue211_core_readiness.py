from pathlib import Path
import re
import unittest

from Shared.library.resolve import build_index, load_packages
from Shared.tools import build_core_learning_data


class Issue211CoreReadiness(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.payload = build_core_learning_data.build()
        cls.by_id = {
            row["id"]: row
            for row in cls.payload["core_projections"]
        }

    def test_every_canonical_bucket_has_explicit_availability(self):
        expected = set()
        for subject in build_core_learning_data.subjects():
            paths = sorted((build_core_learning_data.REPO / subject / "library").glob("*.json"))
            if not paths:
                continue
            records = build_index(load_packages(paths))
            expected.update(
                (subject, row["id"])
                for row in records.values()
                if isinstance(row, dict) and row.get("_collection") == "buckets"
            )

        observed = {
            (row["subject"], row["bucket_ref"])
            for row in self.payload["bucket_availability"]
        }
        self.assertEqual(expected, observed)
        self.assertTrue(expected)

        finding_keys = {
            (row["subject"], row["bucket_ref"], row["code"])
            for row in self.payload["findings"]
        }
        for row in self.payload["bucket_availability"]:
            self.assertIn(row["status"], {"AVAILABLE", "UNSUPPORTED"})
            if row["status"] == "UNSUPPORTED":
                self.assertTrue(row["code"])
                self.assertIn(
                    (row["subject"], row["bucket_ref"], row["code"]),
                    finding_keys,
                )

    def test_motion2d_witness_preserves_core1a_core1b_boundary(self):
        core1a = self.by_id[
            "physics:mic-phy-kin-2d-independent-components:core1a"
        ]
        core1b = self.by_id[
            "physics:mic-phy-kin-2d-independent-components:core1b"
        ]

        self.assertEqual(core1a["source_ref"], core1b["source_ref"])
        self.assertEqual(
            core1a["projection"]["concept"]["microtopic_ref"],
            core1b["projection"]["concept"]["microtopic_ref"],
        )
        self.assertEqual(
            core1a["projection"]["presentation"]["initial_visual_ref"],
            core1b["projection"]["presentation"]["initial_visual_ref"],
        )
        self.assertFalse(
            core1a["projection"]["presentation"]["attempt_before_reveal"]
        )
        self.assertTrue(
            core1a["projection"]["presentation"]["show_full_construction"]
        )
        self.assertTrue(
            core1b["projection"]["presentation"]["attempt_before_reveal"]
        )
        self.assertFalse(
            core1b["projection"]["presentation"]["show_full_construction"]
        )

    def test_core2_witness_preserves_source_identity_crux_and_protected_transfer(self):
        core2a = self.by_id[
            "physics:q-phy-kin-2d-2a-horizontal-launch-04:core2a"
        ]
        core2b = self.by_id[
            "physics:q-phy-kin-2d-2b-projectile-validity-04:core2b"
        ]

        for row in (core2a, core2b):
            app = row["projection"]["application"]
            self.assertEqual(row["source_ref"], app["question_ref"])
            self.assertTrue(app["family_ref"])
            self.assertTrue(app["source_refs"])
            self.assertTrue(app["origin"])
            self.assertTrue(app["original_number"])
            self.assertIsInstance(app["subparts"], list)
            self.assertIsInstance(app["options"], list)
            self.assertTrue(app["reasoning_route"])
            move_ids = {move["id"] for move in app["reasoning_route"]}
            self.assertIn(app["crux_move_ref"], move_ids)
            self.assertTrue(app["check"])

        self.assertFalse(
            core2a["projection"]["presentation"]["attempt_before_reveal"]
        )
        self.assertTrue(
            core2b["projection"]["presentation"]["attempt_before_reveal"]
        )
        protected = core2b["projection"]["application"]["transfer"]["protected_move_ref"]
        self.assertIn(
            protected,
            core2b["projection"]["presentation"]["protected_move_refs"],
        )
        self.assertEqual(
            protected,
            core2b["projection"]["application"]["crux_move_ref"],
        )

    def test_projection_rows_keep_visual_binding_slots_explicit(self):
        for row in self.payload["core_projections"]:
            self.assertIn("scene_ref", row)
            self.assertIn("adapter_ref", row)
            self.assertIn("injection_refs", row)
            self.assertIsInstance(row["injection_refs"], list)

    def test_shared_core_lane_has_no_subject_specific_switch(self):
        repo = build_core_learning_data.REPO
        paths = [
            repo / "Shared/tools/core_learning_projection_adapter.py",
            repo / "Shared/tools/build_core_learning_data.py",
            repo / "Shared/workbench/core-learning-page.mjs",
            repo / "Shared/workbench/core-learning-host.mjs",
        ]
        forbidden = re.compile(
            r"""subject\s*={2,3}\s*["'](?:Physics|Mathematics|Chemistry)["']""",
            re.IGNORECASE,
        )
        for path in paths:
            source = path.read_text(encoding="utf-8")
            self.assertIsNone(forbidden.search(source), path.as_posix())


if __name__ == "__main__":
    unittest.main()
