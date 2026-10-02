import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
SITE_RESOURCES = PUBLIC / "data/site-search-resources.js"
QUESTION_BANK = PUBLIC / "data/question-bank-data.js"
SITE_HEADER = PUBLIC / "js/site-header.js"
REGISTRY = ROOT / "Shared/search/site-search-resources.v1.json"


def parse_assignment(path: Path, variable: str):
    text = path.read_text(encoding="utf-8").strip()
    prefix = f"window.{variable}="
    if not text.startswith(prefix) or not text.endswith(";"):
        raise AssertionError(f"{path} is not the expected {variable} assignment")
    return json.loads(text[len(prefix):-1])


def normalize(value):
    return re.sub(r"[^a-z0-9]+", " ", str(value or "").lower()).strip()


def merge_destinations(primary, extra):
    by_path = {}
    for item in [*(primary or []), *(extra or [])]:
        path = item.get("path") if isinstance(item, dict) else None
        if not path:
            continue
        existing = by_path.get(path)
        if existing is None:
            by_path[path] = {**item, "keywords": list(item.get("keywords") or [])}
            continue
        keywords = list(dict.fromkeys([*(existing.get("keywords") or []), *(item.get("keywords") or [])]))
        by_path[path] = {**existing, **item, "keywords": keywords}
    return list(by_path.values())


def page_matches(resources, query):
    tokens = normalize(query).split()
    matches = []
    for item in resources:
        hay = normalize(" ".join([
            item.get("title", ""),
            item.get("kind", ""),
            *(item.get("keywords") or []),
        ]))
        if all(token in hay for token in tokens):
            matches.append(item)
    return matches


def question_matches(questions, query):
    tokens = normalize(query).split()
    fields = (
        "id", "subject", "topic", "exam", "year", "paper", "question_type",
        "stem", "primary_capability_ref", "stable_crux_move",
    )
    matches = []
    for question in questions:
        hay = normalize(" ".join(str(question.get(field, "")) for field in fields))
        if all(token in hay for token in tokens):
            matches.append(question)
    return matches


class GlobalSiteSearchTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.registry = json.loads(REGISTRY.read_text(encoding="utf-8"))
        cls.static_resources = parse_assignment(SITE_RESOURCES, "GRADE9_SITE_SEARCH_RESOURCES")
        cls.question_bank = parse_assignment(QUESTION_BANK, "GRADE9_QUESTION_BANK")
        cls.qb_destinations = cls.question_bank.get("destinations", [])
        cls.merged_destinations = merge_destinations(cls.qb_destinations, cls.static_resources)

    def test_single_global_registry_projection_is_unique_and_live(self):
        self.assertEqual(self.registry.get("schema_version"), 1)
        self.assertEqual(self.registry.get("scope"), "global")
        self.assertEqual(self.registry.get("resources"), self.static_resources)
        paths = [item["path"] for item in self.static_resources]
        self.assertEqual(len(paths), len(set(paths)))
        missing = [path for path in paths if not (PUBLIC / path).is_file()]
        self.assertEqual(missing, [])

    def test_runtime_merges_qb_and_static_resources_by_path(self):
        source = SITE_HEADER.read_text(encoding="utf-8")
        self.assertIn("function mergeDestinations(primary,extra)", source)
        self.assertIn("const byPath=new Map()", source)
        self.assertIn("mergeDestinations(data.destinations||[],extra||[])", source)

        qb_paths = {item.get("path") for item in self.qb_destinations if item.get("path")}
        static_paths = {item.get("path") for item in self.static_resources if item.get("path")}
        overlap = qb_paths & static_paths
        self.assertTrue(overlap, "fixture must exercise duplicate authority projections")
        merged_paths = [item["path"] for item in self.merged_destinations]
        self.assertEqual(len(merged_paths), len(set(merged_paths)))
        self.assertLess(len(merged_paths), len(self.qb_destinations) + len(self.static_resources))

    def test_representative_subject_queries_share_one_result_model(self):
        friction = page_matches(self.merged_destinations, "friction")
        self.assertIn(
            "standalone/practice/friction/index.html",
            {item["path"] for item in friction},
        )

        redox_pages = page_matches(self.merged_destinations, "redox")
        redox_paths = [item["path"] for item in redox_pages]
        self.assertEqual(redox_paths.count("standalone/practice/chemistry/redox-reactions.html"), 1)
        self.assertTrue(question_matches(self.question_bank.get("questions", []), "redox"))

        euclid = page_matches(self.merged_destinations, "euclid")
        self.assertIn(
            "standalone/practice/mathematics/euclids-geometry.html",
            {item["path"] for item in euclid},
        )

    def test_question_bank_denominator_is_self_consistent_not_hard_coded(self):
        questions = self.question_bank.get("questions", [])
        counts = self.question_bank.get("counts", {})
        subjects = counts.get("subjects", {})
        self.assertEqual(counts.get("questions"), len(questions))
        self.assertEqual(sum(subjects.values()), len(questions))
        self.assertGreater(subjects.get("Physics", 0), 0)
        self.assertGreater(subjects.get("Chemistry", 0), 0)


if __name__ == "__main__":
    unittest.main()
