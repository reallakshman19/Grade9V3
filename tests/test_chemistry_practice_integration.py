from __future__ import annotations

import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRACTICE = ROOT / "public/standalone/practice/chemistry"
EXPECTED_PAGES = {
    "index.html",
    "behaviour-of-gases.html",
    "chemical-bonding.html",
    "redox-reactions.html",
    "some-basic-concepts.html",
}
EXPECTED_RESOURCE_IDS = {
    "RES-CHEM-PRACTICE-GASES",
    "RES-CHEM-PRACTICE-BONDING",
    "RES-CHEM-PRACTICE-REDOX",
    "RES-CHEM-PRACTICE-MOLE",
}


class ChemistryPracticeIntegration(unittest.TestCase):
    def test_practice_projection_and_subject_question_bank_handoff(self) -> None:
        for name in EXPECTED_PAGES:
            self.assertTrue((PRACTICE / name).is_file(), name)
        hub = (PRACTICE / "index.html").read_text(encoding="utf-8")
        self.assertIn("subject=Chemistry", hub)
        self.assertIn("26 canonical questions", hub)
        self.assertIn("20 canonical questions", hub)
        self.assertIn("Canonical topic questions: not yet admitted.", hub)

    def test_site_search_contains_every_chemistry_practice_route(self) -> None:
        raw = (ROOT / "public/data/site-search-resources.js").read_text(encoding="utf-8").strip()
        rows = json.loads(raw.split("=", 1)[1].rstrip(";"))
        paths = {row["path"] for row in rows}
        expected = {f"standalone/practice/chemistry/{name}" for name in EXPECTED_PAGES}
        self.assertTrue(expected <= paths)

    def test_question_bank_resources_reference_practice_without_copying_questions(self) -> None:
        resources = json.loads((ROOT / "Chemistry/question-bank/resources.v1.json").read_text(encoding="utf-8"))
        ids = {row["id"] for row in resources["resources"]}
        self.assertTrue(EXPECTED_RESOURCE_IDS <= ids)
        catalog = (ROOT / "public/data/question-bank-catalog.js").read_text(encoding="utf-8")
        self.assertIn('"Chemistry":46', catalog)

    def test_chemistry_portal_exposes_practice_and_subject_qb(self) -> None:
        portal = (ROOT / "public/chemistry/index.html").read_text(encoding="utf-8")
        self.assertIn("Chemistry Practice Library", portal)
        self.assertIn("../standalone/practice/chemistry/index.html", portal)
        self.assertIn("../question-bank/index.html?subject=Chemistry", portal)


if __name__ == "__main__":
    unittest.main()
