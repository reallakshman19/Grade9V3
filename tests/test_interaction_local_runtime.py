from __future__ import annotations

import copy
import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

from Shared.tools import interaction_local_runtime

REPO = Path(__file__).resolve().parents[1]
SOURCE = REPO / "Mathematics/interactions/linear-equations-two-variables.local.json"


class InteractionLocalRuntimeTests(unittest.TestCase):
    def compile(self):
        return interaction_local_runtime.compile_source(SOURCE)

    def test_real_witness_is_current_local_and_noncanonical(self):
        record = self.compile()
        self.assertEqual(record["status"], "CURRENT")
        self.assertEqual(record["authority"], "DERIVED_LOCAL_INTERACTION_RUNTIME_ONLY")
        self.assertEqual(record["interaction_brief"]["freshness"], "CURRENT")
        self.assertEqual(record["interaction_brief"]["target_ref"], "MIC-MAT-LEQ-04-TWO-VARIABLES-LINE-OF-SOLUTIONS")
        self.assertEqual(
            record["interaction_brief"]["source_academic_basis_digest"],
            record["interaction_brief"]["canonical_input_digest"],
        )

        runtime = record["runtime"]
        self.assertEqual(runtime["maturity"], "LOCAL")
        self.assertTrue(runtime["activity_ref"].startswith("local-activity-"))
        self.assertTrue(runtime["scene_ref"].startswith("local-scene-"))
        self.assertTrue(runtime["adapter_ref"].startswith("local-adapter-"))
        self.assertTrue(runtime["package_ref"].startswith("local-package-"))
        self.assertTrue(runtime["binding_ref"].startswith("local-binding-"))

        package = record["package"]
        self.assertEqual(package["id"], runtime["package_ref"])
        self.assertEqual(package["scene"]["id"], runtime["scene_ref"])
        self.assertEqual(package["adapter"]["id"], "declarative-transfer-v1")
        self.assertEqual(package["provenance"]["authority"], "NON_CANONICAL_COMPILED_PROOF")
        self.assertEqual(package["provenance"]["sourceKind"], "LOCAL_INTERACTION_IMPLEMENTATION")
        self.assertEqual(package["provenance"]["localInteraction"]["authority"], "DERIVED_LOCAL_INTERACTION_RUNTIME_ONLY")
        self.assertEqual(
            package["provenance"]["localInteraction"]["sourceAcademicBasisDigest"],
            record["interaction_brief"]["canonical_input_digest"],
        )
        self.assertNotIn("resourceRef", package)

        reuse = record["reuse_analysis"]
        self.assertEqual(reuse["maturity_status"], "OBSERVED")
        self.assertEqual(reuse["maturity"], "LOCAL")
        self.assertEqual(reuse["consumer_interaction_refs"], [])
        self.assertFalse(reuse["subject_neutral_shared_claim_proven"])

    def test_compile_is_deterministic(self):
        first = self.compile()
        second = self.compile()
        self.assertEqual(first["binding_digest"], second["binding_digest"])
        self.assertEqual(first["runtime"], second["runtime"])
        self.assertEqual(first["package"], second["package"])
        self.assertEqual(first["reuse_evidence"], second["reuse_evidence"])

    def test_activity_identity_is_stable_while_revision_identities_are_content_addressed(self):
        original = json.loads(SOURCE.read_text(encoding="utf-8"))
        baseline = self.compile()
        changed = copy.deepcopy(original)
        changed["title"] = changed["title"] + " revised"
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "changed.local.json"
            path.write_text(json.dumps(changed), encoding="utf-8")
            revised = interaction_local_runtime.compile_source(path)

        self.assertEqual(baseline["runtime"]["activity_ref"], revised["runtime"]["activity_ref"])
        for field in ("scene_ref", "adapter_ref", "package_ref", "binding_ref"):
            self.assertNotEqual(baseline["runtime"][field], revised["runtime"][field])
        self.assertNotEqual(baseline["source_digest"], revised["source_digest"])
        self.assertNotEqual(baseline["binding_digest"], revised["binding_digest"])

    def test_freshness_detects_stored_binding_drift(self):
        record = self.compile()
        tampered = copy.deepcopy(record)
        tampered["binding_digest"] = "sha256:" + "0" * 64
        result = interaction_local_runtime.freshness(tampered, SOURCE)
        self.assertEqual(result["status"], "STALE")
        self.assertEqual(result["brief_freshness"], "CURRENT")
        self.assertEqual(result["current_binding_digest"], record["binding_digest"])

    def test_truth_bearing_local_source_cannot_silently_rebind_to_new_academic_basis(self):
        source = json.loads(SOURCE.read_text(encoding="utf-8"))
        source["academic_basis"]["canonical_input_digest"] = "sha256:" + "0" * 64
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "stale-basis.local.json"
            path.write_text(json.dumps(source), encoding="utf-8")
            with self.assertRaisesRegex(
                interaction_local_runtime.InteractionLocalRuntimeError,
                "LOCAL_RUNTIME_ACADEMIC_BASIS_STALE",
            ):
                interaction_local_runtime.compile_source(path)

    def test_local_source_cannot_override_computed_scene_identity(self):
        source = json.loads(SOURCE.read_text(encoding="utf-8"))
        source["scene"]["id"] = "caller-chosen-scene"
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "bad.local.json"
            path.write_text(json.dumps(source), encoding="utf-8")
            with self.assertRaisesRegex(
                interaction_local_runtime.InteractionLocalRuntimeError,
                "SCENE_ID_OVERRIDE_FORBIDDEN",
            ):
                interaction_local_runtime.compile_source(path)

    def test_local_module_is_pinned_and_has_no_precomputed_pair_cards(self):
        record = self.compile()
        package = record['package']
        self.assertIn('localRuntime', package)
        self.assertEqual(package['localRuntime']['id'], 'mathematics-linear-pairs-v1')
        self.assertEqual([e['id'] for e in package['scene']['entities']], ['equation-source'])
        source = json.loads(SOURCE.read_text(encoding='utf-8'))
        source['runtime_module']['digest'] = 'sha256:' + '0' * 64
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / 'changed.local.json'
            path.write_text(json.dumps(source), encoding='utf-8')
            with self.assertRaisesRegex(interaction_local_runtime.InteractionLocalRuntimeError, 'MODULE_STALE'):
                interaction_local_runtime.compile_source(path)


if __name__ == "__main__":
    unittest.main()
