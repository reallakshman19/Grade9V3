#!/usr/bin/env python3
"""Canonical source falsifiers for Issue #225 shared-clock portable input."""
from __future__ import annotations

import json
import unittest
from pathlib import Path

from Shared.contracts import load
from Shared.library.resolve import build_index
from Shared.portable.package import _validate_scene

REPO = Path(__file__).resolve().parents[1]
PACKAGE = REPO / "Physics/library/phy-kin-2d-motion.v1.json"

BUCKET = "BUCKET-PHY-KIN-2D-MOTION"
MICROTOPIC = "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS"
REPRESENTATION = "REP-KIN-2D-SHARED-CLOCK"
RESOURCE = "ACT-KIN-2D-SHARED-CLOCK"
SCENE_INSTANCE = "SI-KIN-2D-SHARED-CLOCK-PORTABLE"
SCENE = "scene-kin-2d-shared-clock"
PACKAGE_REF = "portable-kin-2d-shared-clock"

DATUMS = {
    "DAT-KIN-2D-SHARED-T1": (1, "s"),
    "DAT-KIN-2D-SHARED-T2": (2, "s"),
    "DAT-KIN-2D-SHARED-X1": (2, "m"),
    "DAT-KIN-2D-SHARED-X2": (4, "m"),
    "DAT-KIN-2D-SHARED-Y1": (3, "m"),
    "DAT-KIN-2D-SHARED-Y2": (6, "m"),
}


class SharedClockCanonicalPortableSourceTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.package = load(PACKAGE)
        cls.records = build_index([cls.package])

    def test_representation_has_one_governed_portable_scene(self):
        bucket = self.records[BUCKET]
        representation = self.records[REPRESENTATION]
        self.assertEqual(bucket["primary_representation_ref"], REPRESENTATION)

        scenes = [
            row for row in representation["scene_instances"]
            if row["id"] == SCENE_INSTANCE
        ]
        self.assertEqual(len(scenes), 1)
        instance = scenes[0]
        self.assertEqual(instance["microtopic_ref"], MICROTOPIC)
        self.assertEqual(instance["cores"], ["CORE1A", "CORE1B"])
        self.assertEqual(set(instance["datum_refs"]), set(DATUMS))

        scene = instance["scene"]
        self.assertEqual(scene["id"], SCENE)
        self.assertEqual(scene["kind"], "VECTOR")
        self.assertEqual(scene["apiVersion"], "0.1.0")
        self.assertEqual(scene["sceneVersion"], "1.0.0")
        self.assertEqual(scene["x_atom"], "DAT-KIN-2D-SHARED-X1")
        self.assertEqual(scene["y_atom"], "DAT-KIN-2D-SHARED-Y1")
        self.assertEqual(scene["unit"], "m")
        self.assertEqual(_validate_scene(scene)["id"], SCENE)

    def test_every_scene_datum_is_governed_and_exact(self):
        for datum_ref, (value, unit) in DATUMS.items():
            with self.subTest(datum=datum_ref):
                row = self.records[datum_ref]
                self.assertEqual(row["_collection"], "data")
                self.assertEqual(row["kind"], "DATUM")
                self.assertEqual(row["value"], value)
                self.assertEqual(row["unit"], unit)
                self.assertEqual(
                    row["source_refs"],
                    ["SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"],
                )
                self.assertIn("Author-created", row["locator"])

    def test_portable_declaration_is_exact_id_only(self):
        resource = self.records[RESOURCE]
        portable = resource["extensions"]["topic_atlas"]["portable_workbench"]

        self.assertEqual(portable["schema_version"], "1.0.0")
        self.assertEqual(portable["package_ref"], PACKAGE_REF)
        self.assertEqual(portable["resource_ref"], RESOURCE)
        self.assertEqual(portable["representation_ref"], REPRESENTATION)
        self.assertEqual(portable["scene_instance_ref"], SCENE_INSTANCE)
        self.assertEqual(portable["adapter"]["id"], "declarative-transfer-v1")
        self.assertEqual(portable["adapter"]["api_version"], "0.1.0")

        # Existing repository activity delivery remains a separate, unchanged destination.
        self.assertEqual(
            resource["locator"],
            "public/physics/motion-2d/explorers/shared-clock/index.html",
        )
        self.assertEqual(
            self.records[REPRESENTATION]["interactive_resource_refs"],
            [RESOURCE],
        )
        self.assertEqual(
            resource["extensions"]["topic_atlas"]["teaching_step_refs"],
            ["K2D1-3", "K2D1-4"],
        )

    def test_same_time_is_authorized_and_mixed_time_is_explicitly_rejected(self):
        representation = self.records[REPRESENTATION]
        scene = next(
            row["scene"]
            for row in representation["scene_instances"]
            if row["id"] == SCENE_INSTANCE
        )
        resource = self.records[RESOURCE]
        actions = resource["extensions"]["topic_atlas"]["portable_workbench"]["adapter"]["actions"]
        self.assertEqual([row["expected_outcome"] for row in actions], ["ACCEPT", "REJECT"])

        entities = {row["id"]: row for row in scene["entities"]}
        targets = {row["id"]: row for row in scene["targets"]}
        transformations = {row["id"]: row for row in scene["canonicalTransformations"]}

        accepted, rejected = actions
        for action in actions:
            with self.subTest(action=action["id"]):
                self.assertIn(action["source_entity_ref"], entities)
                self.assertIn(action["target_ref"], targets)
                self.assertEqual(
                    action["operation"],
                    targets[action["target_ref"]]["operation"],
                )

        transform = transformations[accepted["transformation_ref"]]
        self.assertIn(accepted["source_entity_ref"], transform["sourceEntityRefs"])
        self.assertEqual(transform["targetRef"], accepted["target_ref"])
        self.assertIn("same time", accepted["summary"].lower())
        self.assertEqual(
            accepted["patch"]["addEntities"][0],
            {
                "id": "simultaneous-state-t1",
                "label": "r(1 s) = (2 m, 3 m)",
                "provenance": {
                    "kind": "DERIVED",
                    "sourceEntityRefs": ["state-same-time"],
                },
            },
        )
        self.assertEqual(
            accepted["patch"]["addProjections"][0]["placement"],
            {"grid": "shared-clock-grid", "row": "result", "column": "state"},
        )

        self.assertNotIn("transformation_ref", rejected)
        self.assertIn("non-simultaneous", rejected["reason"].lower())
        self.assertNotIn(
            rejected["source_entity_ref"],
            {
                source
                for transform in transformations.values()
                for source in transform["sourceEntityRefs"]
            },
        )

    def test_pair_entities_name_the_exact_datum_inputs(self):
        scene = next(
            row["scene"]
            for row in self.records[REPRESENTATION]["scene_instances"]
            if row["id"] == SCENE_INSTANCE
        )
        entities = {row["id"]: row for row in scene["entities"]}
        self.assertEqual(
            entities["state-same-time"]["datumRefs"],
            [
                "DAT-KIN-2D-SHARED-T1",
                "DAT-KIN-2D-SHARED-X1",
                "DAT-KIN-2D-SHARED-Y1",
            ],
        )
        self.assertEqual(
            entities["state-mixed-time"]["datumRefs"],
            [
                "DAT-KIN-2D-SHARED-T1",
                "DAT-KIN-2D-SHARED-T2",
                "DAT-KIN-2D-SHARED-X1",
                "DAT-KIN-2D-SHARED-Y2",
            ],
        )


if __name__ == "__main__":
    unittest.main()
