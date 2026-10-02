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


def load_js_assignment(path: Path) -> dict:
    raw = path.read_text(encoding="utf-8").strip()
    return json.loads(raw.split("=", 1)[1].rstrip(";"))


class ChemistryPracticeIntegration(unittest.TestCase):
    def test_practice_projection_and_subject_question_bank_handoff(self) -> None:
        for name in EXPECTED_PAGES:
            self.assertTrue((PRACTICE / name).is_file(), name)
        hub = (PRACTICE / "index.html").read_text(encoding="utf-8")
        self.assertIn("subject=Chemistry", hub)
        self.assertIn("topic=Redox%20Reactions", hub)
        self.assertIn("topic=Some%20Basic%20Concepts%20of%20Chemistry", hub)
        self.assertIn("Canonical topic questions: not yet admitted.", hub)

    def test_site_shell_hydrates_practice_counts_from_canonical_qb(self) -> None:
        shell = (ROOT / "public/js/site-header.js").read_text(encoding="utf-8")
        self.assertIn("hydratePracticeQuestionCounts", shell)
        self.assertIn("GRADE9_QUESTION_BANK", shell)
        self.assertIn("practice-qb-status", shell)
        self.assertIn("g9-practice-hub-polish", shell)

    def test_site_search_contains_every_chemistry_practice_route(self) -> None:
        rows = load_js_assignment(ROOT / "public/data/site-search-resources.js")
        paths = {row["path"] for row in rows}
        expected = {f"standalone/practice/chemistry/{name}" for name in EXPECTED_PAGES}
        self.assertTrue(expected <= paths)

    def test_question_bank_resources_reference_practice_without_copying_questions(self) -> None:
        resources = json.loads((ROOT / "Chemistry/question-bank/resources.v1.json").read_text(encoding="utf-8"))
        ids = {row["id"] for row in resources["resources"]}
        self.assertTrue(EXPECTED_RESOURCE_IDS <= ids)

        web = load_js_assignment(ROOT / "public/data/question-bank-data.js")
        questions = web["questions"]
        chemistry_count = sum(q.get("subject") == "Chemistry" for q in questions)

        catalog = load_js_assignment(ROOT / "public/data/question-bank-catalog.js")
        chemistry = next(subject for subject in catalog["subjects"] if subject["label"] == "Chemistry")
        self.assertEqual(chemistry["question_count"], chemistry_count)
        self.assertEqual(catalog["counts"]["questions"], len(questions))

    def test_chemistry_portal_exposes_practice_and_subject_qb(self) -> None:
        portal = (ROOT / "public/chemistry/index.html").read_text(encoding="utf-8")
        self.assertIn("Chemistry Practice Library", portal)
        self.assertIn("../standalone/practice/chemistry/index.html", portal)
        self.assertIn("../question-bank/index.html?subject=Chemistry", portal)


if __name__ == "__main__":
    unittest.main()
