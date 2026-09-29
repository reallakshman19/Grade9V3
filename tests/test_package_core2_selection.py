from __future__ import annotations

import unittest

from Shared.tools import product_manifest


class PackageOwnedCore2Selection(unittest.TestCase):
    def setUp(self) -> None:
        self.source_q = {
            "id": "Q-SOURCE",
            "exposure": [{"core": "CORE2", "role": "SOURCE_QUESTION", "artifact_ref": None}],
        }
        self.practice_q = {
            "id": "Q-PRACTICE",
            "exposure": [{"core": "CORE2A", "role": "PRACTICE", "artifact_ref": None}],
        }
        self.package = {
            "subject": "Mathematics",
            "microtopics": [],
            "questions": [self.source_q, self.practice_q],
        }

    @staticmethod
    def manifest(core2: list[str]) -> dict:
        return {
            "selection": {
                "microtopics": [],
                "core2": core2,
                "core2a": [],
                "core2b": [],
            }
        }

    def test_package_question_explicitly_exposed_to_core2_is_valid(self):
        resolved = product_manifest.validate_selection(
            self.manifest(["Q-SOURCE"]), [self.package], []
        )
        self.assertEqual([row["id"] for row in resolved["core2"]], ["Q-SOURCE"])

    def test_package_practice_question_is_still_wrong_authority_for_core2(self):
        with self.assertRaisesRegex(
            product_manifest.ProductSelectionError,
            r"PRODUCT_SELECTION_WRONG_AUTHORITY: core2:Q-PRACTICE:expected=BANK",
        ):
            product_manifest.validate_selection(
                self.manifest(["Q-PRACTICE"]), [self.package], []
            )

    def test_derive_includes_package_owned_core2_exposure(self):
        # _exposed_to is the shared predicate used by derive; exercise the contract directly
        # without creating filesystem fixtures for the CLI helper.
        self.assertTrue(product_manifest._exposed_to(self.source_q, "CORE2"))
        self.assertFalse(product_manifest._exposed_to(self.practice_q, "CORE2"))


if __name__ == "__main__":
    unittest.main()
