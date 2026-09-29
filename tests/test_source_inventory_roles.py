"""Focused source-inventory role regression coverage for #350."""
from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO))

from Shared.tools import evidence_check  # noqa: E402


class SourceInventoryRoles(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.repo = Path(self.tmp.name)
        research = self.repo / "Mathematics/research"
        for folder in ("acquisitions", "inventories", "evidence"):
            (research / folder).mkdir(parents=True)
        (self.repo / "Mathematics/library").mkdir(parents=True)
        (research / "acquisitions/SRC.json").write_text(
            json.dumps({"sha256": "a" * 64}), encoding="utf-8"
        )
        self.path = research / "inventories/INV.json"

    def tearDown(self):
        self.tmp.cleanup()

    def write_inventory(self, item: dict) -> None:
        inventory = {
            "schema": "source-inventory/v1",
            "inventory_id": "INV",
            "subject": "Mathematics",
            "members": [{"acquisition_ref": "SRC", "sha256": "a" * 64, "pages": "4"}],
            "declared_scope": "PAGE_RANGE",
            "completeness_unit": "all numbered source items on page 4",
            "items": [item],
            "counts": {
                "items": 1,
                "key_present": 0,
                "key_absent": 1,
                "key_ambiguous": 0,
            },
            "digest": evidence_check.inventory_digest([item]),
            "supersedes": None,
        }
        self.path.write_text(json.dumps(inventory), encoding="utf-8")

    def test_worked_example_source_role_accepts_worked_example_card(self):
        item = {
            "item_id": "W1",
            "locator": {"acquisition_ref": "SRC", "page": 4, "label": "Illustration 1"},
            "format": "OTHER",
            "source_role": "WORKED_EXAMPLE",
            "question_card": "WC",
            "key": {"state": "ABSENT"},
        }
        self.write_inventory(item)
        cards = {"WC": {"card_id": "WC", "kind": "WORKED_EXAMPLE"}}
        self.assertEqual(evidence_check.inventory_findings("Mathematics", cards, self.repo), [])

    def test_worked_example_source_role_rejects_question_card_kind(self):
        item = {
            "item_id": "W1",
            "locator": {"acquisition_ref": "SRC", "page": 4, "label": "Illustration 1"},
            "format": "OTHER",
            "source_role": "WORKED_EXAMPLE",
            "question_card": "QC",
            "key": {"state": "ABSENT"},
        }
        self.write_inventory(item)
        cards = {"QC": {"card_id": "QC", "kind": "QUESTION"}}
        codes = {row["code"] for row in evidence_check.inventory_findings("Mathematics", cards, self.repo)}
        self.assertIn("INVENTORY_QUESTION_CARD", codes)

    def test_missing_source_role_keeps_legacy_question_semantics(self):
        item = {
            "item_id": "Q1",
            "locator": {"acquisition_ref": "SRC", "page": 4, "label": "1"},
            "format": "SHORT",
            "question_card": "QC",
            "key": {"state": "ABSENT"},
        }
        self.write_inventory(item)
        cards = {"QC": {"card_id": "QC", "kind": "QUESTION"}}
        self.assertEqual(evidence_check.inventory_findings("Mathematics", cards, self.repo), [])


if __name__ == "__main__":
    unittest.main()
