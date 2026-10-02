"""The site search index: what a learner can find from the header, and that every result opens something that exists.

A small repository is built in a temporary directory (pages, Core learning data, Question Bank data, a library), the index is built from it, and the verifier is shown to
refuse an index that is stale, edited, missing a document, holding one it should not, pointing at nothing, or showing a hint. The last test holds the committed index to
the real repository.
"""
from __future__ import annotations

import json
import shutil
import tempfile
import unittest
from pathlib import Path

from Shared.assurance import contract
from Shared.search import site_index
from Shared.tools import build_search_index, verify_search_index

REPO = Path(__file__).resolve().parents[1]
SECRET = "SECRET-ANSWER-42-DO-NOT-INDEX"


def page(title: str, *headings: str) -> str:
    return f"<!doctype html><html><head><title>{title}</title></head><body>{''.join(f'<h2>{h}</h2>' for h in headings)}</body></html>"


def projection(pid, subject, core, source_ref, title=None):
    body = {"core": core, "orientation": {"title": title} if title else {}, "concept": {"title": title} if title and core in ("CORE1A", "CORE1B") else {}}
    return {"id": pid, "subject": subject, "source_ref": source_ref, "projection": body}


def library_question(qid, stem, hints=(), scaffolds=(), difficulty=None, capability="CAP-1", **extra):
    q = {"id": qid, "stem": stem, "options": [], "conditions": [], "answer": {"summary": SECRET}, "hints": [{"text": h} for h in hints],
         "scaffolds": [{"text": h} for h in scaffolds], "primary_capability_ref": capability, "extensions": {}}
    if difficulty:
        q["difficulty"] = difficulty
    q.update(extra)
    return q


class Fixture(unittest.TestCase):
    def setUp(self):
        self.repo = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.repo, True)
        site = self.repo / "public"
        for rel, text in {"index.html": page("Grade9V3 portal", "Start here"), "physics/index.html": page("Physics subject", "Kinematics and forces"),
                          "physics/nlm/explorers/friction/index.html": page("Friction explorer", "Static and kinetic"),
                          "core-learning/index.html": page("Core learner"), "question-bank/index.html": page("Question Bank"),
                          "vendor/lib/demo.html": page("A vendored demo"), "test/hub.html": page("TEST sandbox page"),
                          "refresh.html": '<html><head><meta http-equiv="refresh" content="0; url=index.html"><title>Moved</title></head></html>'}.items():
            (site / rel).parent.mkdir(parents=True, exist_ok=True)
            (site / rel).write_text(text, encoding="utf-8")
        projections = [projection("physics:bucket-x:core1", "Physics", "CORE1", "BUCKET-X", "Forces and motion"),
                       projection("physics:mic-x:core1a", "Physics", "CORE1A", "MIC-X", "Friction opposes sliding"),
                       projection("physics:mic-x:core1b", "Physics", "CORE1B", "MIC-X", "Friction opposes sliding"),
                       projection("physics:q-lib-1:core2a", "Physics", "CORE2A", "Q-LIB-1")]
        (site / "core-learning" / "data.js").write_text("window.GRADE9V3_CORE = " + json.dumps({"core_projections": projections}) + ";\n", encoding="utf-8")
        bank = [{"id": "Q-BANK-1", "subject": "Chemistry", "topic": "Redox", "exam": "JEE", "year": 2020, "difficulty": {"band": "D2"}, "stem": "Classify the redox pattern."}]
        (site / "data").mkdir()
        (site / "data" / "question-bank-data.js").write_text("window.GRADE9_QUESTION_BANK = " + json.dumps({"questions": bank}) + ";\n", encoding="utf-8")
        self.write_library([library_question("Q-BANK-1", "Classify the redox pattern of phosphorus.", hints=["Assign oxidation states first."]),
                            library_question("Q-LIB-1", "A block slides on a rough incline; find the friction force.", hints=["Draw the forces.", "Resolve along the slope."],
                                             scaffolds=["Name the normal reaction."], difficulty={"band": "D3"}),
                            library_question("Q-NOROUTE", "A question that no page of the site shows.", hints=["Hidden away."]),
                            library_question("Q-EXCL", "Kept out of search.", extensions={"search_visibility": "EXCLUDED"})])

    def write_library(self, questions):
        lib = self.repo / "Physics" / "library"
        lib.mkdir(parents=True, exist_ok=True)
        (lib / "a.json").write_text(json.dumps({"subject": "Physics", "package_id": "P", "questions": questions,
                                                "microtopics": [{"id": "MIC-X", "title": "Friction opposes sliding", "primary_capability_ref": "CAP-1"}]}, indent=1), encoding="utf-8")

    def build(self):
        built = site_index.build(self.repo, [self.repo / "Physics" / "library"])
        return built

    def write_index(self):
        built = self.build()
        index_text, script_text, manifest = build_search_index.render(built)
        data = self.repo / "public" / "data"
        (data / "search-index.v2.json").write_text(index_text, encoding="utf-8")
        (data / "search-index.v2.js").write_text(script_text, encoding="utf-8")
        (data / "search-index-manifest.v2.json").write_text(json.dumps(manifest, indent=1, sort_keys=True) + "\n", encoding="utf-8")
        return built

    def verify(self):
        data = self.repo / "public" / "data"
        evidence = self.repo / "build-evidence"
        shutil.rmtree(evidence, ignore_errors=True)
        code = verify_search_index.main(["--repo", str(self.repo), "--index", str(data / "search-index.v2.json"), "--manifest", str(data / "search-index-manifest.v2.json"),
                                         "--script", str(data / "search-index.v2.js"), "--library-dirs", "Physics/library", "--evidence-dir", str(evidence), "--enforce"])
        records = [json.loads(p.read_text()) for p in sorted(evidence.glob("*.json"))]
        return code, {r["assurance_type"]: r for r in records}


class Index(Fixture):
    def docs(self, kind):
        return [d for d in self.build().index["documents"] if d["kind"] == kind]

    def test_four_kinds_each_with_a_route_that_exists(self):
        built = self.build()
        self.assertEqual(built.index["counts"], {"PAGE": 6, "TOPIC": 2, "QUESTION": 2, "HINT": 4}, "pages: five files and the Core 1B page; hints: one, and two hints and a scaffold")
        config = site_index.load_config()
        core_ids = {"physics:bucket-x:core1", "physics:mic-x:core1a", "physics:mic-x:core1b", "physics:q-lib-1:core2a"}
        for d in built.index["documents"]:
            self.assertIsNone(site_index.resolve_url(self.repo, d["url"], config, core_ids, {"Q-BANK-1"}), d["id"])

    def test_pages_are_the_files_of_the_site_a_learner_can_open_and_not_the_ones_they_cannot(self):
        titles = {d["title"] for d in self.docs("PAGE")}
        self.assertIn("Friction explorer", titles)
        self.assertNotIn("A vendored demo", titles)
        self.assertNotIn("TEST sandbox page", titles)
        self.assertNotIn("Moved", titles, "a redirect is not a page")
        subjects = {d["title"]: d["subject"] for d in self.docs("PAGE")}
        self.assertEqual((subjects["Physics subject"], subjects["Friction explorer"], subjects["Grade9V3 portal"]), ("Physics", "Physics", "General"))

    def test_a_topic_opens_its_first_core_page_and_the_other_core_pages_are_sub_pages(self):
        topics = {d["id"]: d for d in self.docs("TOPIC")}
        self.assertEqual(topics["topic:BUCKET-X"]["url"], "core-learning/index.html?projection=physics:bucket-x:core1")
        self.assertEqual(topics["topic:MIC-X"]["url"], "core-learning/index.html?projection=physics:mic-x:core1a")
        sub = [d for d in self.docs("PAGE") if d["id"].startswith("core:")]
        self.assertEqual([(d["id"], d["level"]) for d in sub], [("core:physics:mic-x:core1b", "CORE1B")], "not the page a topic opens, and not a question's own page")

    def test_a_question_opens_the_page_that_shows_it_and_carries_what_the_filters_need(self):
        q = {d["id"]: d for d in self.docs("QUESTION")}
        self.assertEqual(q["question:Q-BANK-1"]["url"], "question-bank/index.html?q=Q-BANK-1&mode=study#Q-BANK-1")
        self.assertEqual((q["question:Q-BANK-1"]["subject"], q["question:Q-BANK-1"]["difficulty"], q["question:Q-BANK-1"]["exam"], q["question:Q-BANK-1"]["year"]),
                         ("Chemistry", "D2", "JEE", 2020), "the bank says what subject a bank question is; the library file does not")
        self.assertEqual(q["question:Q-LIB-1"]["url"], "core-learning/index.html?projection=physics:q-lib-1:core2a")
        self.assertEqual((q["question:Q-LIB-1"]["level"], q["question:Q-LIB-1"]["difficulty"], q["question:Q-LIB-1"]["topic"]), ("CORE2A", "D3", "Friction opposes sliding"))

    def test_a_question_no_page_shows_is_not_a_result_and_is_named_so(self):
        built = self.build()
        self.assertNotIn("question:Q-NOROUTE", {d["id"] for d in built.index["documents"]})
        self.assertNotIn("hint:Q-NOROUTE:1", {d["id"] for d in built.index["documents"]})
        self.assertEqual(built.questions["unrouted"], ["Q-NOROUTE"])
        self.assertEqual(built.questions["excluded"], ["Q-EXCL"])
        self.assertEqual(built.questions["canonical"], ["Q-BANK-1", "Q-LIB-1", "Q-NOROUTE"])

    def test_a_hint_is_searched_and_never_shown(self):
        hints = self.docs("HINT")
        self.assertEqual([h["text"] for h in hints if h["parent"] == "question:Q-LIB-1"], ["Draw the forces.", "Resolve along the slope.", "Name the normal reaction."])
        for h in hints:
            self.assertIs(h["hidden"], True)
            self.assertNotIn(h["text"], h["title"] + h.get("subtitle", ""), "the hint's words are not in anything that is displayed")
            self.assertEqual(h["url"], next(d["url"] for d in self.docs("QUESTION") if d["id"] == h["parent"]))

    def test_no_answer_is_in_the_index_at_all(self):
        self.assertNotIn(SECRET, json.dumps(self.build().index))

    def test_it_is_the_same_every_time_and_satisfies_its_schema(self):
        first, second = self.build().index, self.build().index
        self.assertEqual(json.dumps(first, sort_keys=True), json.dumps(second, sort_keys=True))
        self.assertEqual(contract.schema_problems("search-index", first), [])

    def test_tex_and_markup_are_not_words_to_search(self):
        self.write_library([library_question("Q-LIB-1", r"Find \(\frac{a}{b}\) when $\vec{F}=ma$.")])
        text = next(d for d in self.docs("QUESTION") if d["id"] == "question:Q-LIB-1")["text"]
        self.assertNotIn("\\", text)
        self.assertNotIn("frac", text.replace("a b", ""), "commands are dropped; the letters stay")

    def test_a_library_file_that_does_not_parse_stops_the_build(self):
        (self.repo / "Physics" / "library" / "broken.json").write_text("{ nope", encoding="utf-8")
        with self.assertRaises(Exception):
            self.build()


class Verifier(Fixture):
    def setUp(self):
        super().setUp()
        self.write_index()

    def edit_index(self, fn):
        path = self.repo / "public" / "data" / "search-index.v2.json"
        index = json.loads(path.read_text(encoding="utf-8"))
        fn(index)
        path.write_text(json.dumps(index), encoding="utf-8")

    def codes(self, record):
        return {f["code"] for f in record["findings"]}

    def test_a_current_index_passes_and_reports_the_questions_no_page_shows(self):
        code, records = self.verify()
        self.assertEqual((code, records["SEARCH_MEMBERSHIP"]["outcome"], records["SEARCH_RETRIEVABILITY"]["outcome"]), (0, "PASS", "PASS"))
        found = {f["code"]: f for f in records["SEARCH_MEMBERSHIP"]["findings"]}
        self.assertEqual((set(found), found["UNROUTED_QUESTIONS"]["severity"]), ({"UNROUTED_QUESTIONS"}, "S3"))

    def test_a_page_that_went_away_leaves_a_result_that_opens_nothing(self):
        (self.repo / "public" / "physics" / "nlm" / "explorers" / "friction" / "index.html").unlink()
        code, records = self.verify()
        self.assertEqual(code, 1)
        self.assertTrue({"BROKEN_ROUTE", "STALE_INDEX", "MISSING_FROM_INDEX"} & self.codes(records["SEARCH_MEMBERSHIP"]) >= {"BROKEN_ROUTE", "STALE_INDEX"})

    def test_a_route_the_builder_never_checked_is_still_checked(self):
        """The verifier looks at where each result goes on its own: an index edited (with its manifest) to point at a projection that is not there fails."""
        def point_nowhere(index):
            next(d for d in index["documents"] if d["id"] == "topic:MIC-X")["url"] = "core-learning/index.html?projection=physics:nothing:core1a"
        self.edit_index(point_nowhere)
        code, records = self.verify()
        self.assertEqual(code, 1)
        self.assertIn("BROKEN_ROUTE", self.codes(records["SEARCH_MEMBERSHIP"]))

    def test_an_edited_a_missing_and_an_added_document_are_each_found(self):
        def tamper(index):
            docs = index["documents"]
            next(d for d in docs if d["id"] == "question:Q-LIB-1")["text"] += " hand edit"
            docs.remove(next(d for d in docs if d["id"] == "topic:BUCKET-X"))
            docs.append({**docs[0], "id": "page:invented.html"})
        self.edit_index(tamper)
        code, records = self.verify()
        self.assertEqual(code, 1)
        self.assertGreaterEqual(self.codes(records["SEARCH_MEMBERSHIP"]), {"INDEX_DIFFERS", "MISSING_FROM_INDEX", "PHANTOM_IN_INDEX"})
        self.assertIn("INDEX_DIGEST_MISMATCH", self.codes(records["SEARCH_RETRIEVABILITY"]))

    def test_the_evidence_is_about_the_search_projection_and_bound_to_the_index_file(self):
        code, records = self.verify()
        self.assertEqual({r["subject"]["kind"] for r in records.values()}, {"PROJECTION"})
        self.assertEqual({r["subject"]["id"] for r in records.values()}, {"search"})
        self.assertEqual({r["subject"]["digest"] for r in records.values()}, {contract.digest_file(self.repo / "public" / "data" / "search-index.v2.json")})

    def test_a_stale_index_is_a_fail_with_enforce_and_a_report_without(self):
        self.write_library([library_question("Q-BANK-1", "A different stem that the index does not hold at all.")])
        data = self.repo / "public" / "data"
        argv = ["--repo", str(self.repo), "--index", str(data / "search-index.v2.json"), "--manifest", str(data / "search-index-manifest.v2.json"), "--script", str(data / "search-index.v2.js"),
                "--library-dirs", "Physics/library", "--evidence-dir", str(self.repo / "ev")]
        self.assertEqual(verify_search_index.main(argv + ["--enforce"]), 1)
        self.assertEqual(verify_search_index.main(argv), 0)

    def test_a_library_file_that_does_not_parse_stops_the_verification(self):
        (self.repo / "Physics" / "library" / "broken.json").write_text("{ nope", encoding="utf-8")
        self.assertEqual(self.verify()[0], 1)

    def test_a_checkout_with_other_line_endings_does_not_make_the_index_stale(self):
        """The index was built from an LF library; a CRLF working copy of the same library digests the same, so the committed index is current on every machine."""
        path = self.repo / "Physics" / "library" / "a.json"
        text = path.read_text(encoding="utf-8")
        self.assertIn("\n", text, "a library with line breaks to change")
        path.write_bytes(text.replace("\n", "\r\n").encode("utf-8"))
        self.assertEqual(self.verify()[0], 0)

    def test_a_library_that_changed_after_the_index_was_built_makes_it_stale(self):
        self.write_library([library_question("Q-BANK-1", "A changed stem.", hints=["Assign oxidation states first."]), library_question("Q-LIB-1", "A block slides.")])
        code, records = self.verify()
        self.assertEqual(code, 1)
        self.assertIn("STALE_INDEX", self.codes(records["SEARCH_MEMBERSHIP"]))

    def test_a_hint_that_is_not_hidden_is_not_an_index(self):
        self.edit_index(lambda index: next(d for d in index["documents"] if d["kind"] == "HINT").pop("hidden"))
        code, records = self.verify()
        self.assertEqual(code, 1)
        self.assertIn("INDEX_OR_MANIFEST_INVALID", self.codes(records["SEARCH_MEMBERSHIP"]))

    def test_the_script_a_page_loads_must_be_the_index(self):
        script = self.repo / "public" / "data" / "search-index.v2.js"
        script.write_text(script.read_text(encoding="utf-8").replace("Friction", "Fiction", 1), encoding="utf-8")
        code, records = self.verify()
        self.assertEqual(code, 1)
        self.assertGreaterEqual(self.codes(records["SEARCH_RETRIEVABILITY"]), {"SCRIPT_DIGEST_MISMATCH", "SCRIPT_NOT_THE_INDEX"})
        script.unlink()
        self.assertIn("SCRIPT_MISSING", self.codes(self.verify()[1]["SEARCH_RETRIEVABILITY"]))


class Committed(unittest.TestCase):
    def test_the_committed_index_is_current_and_every_result_opens_something(self):
        out = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, out, True)
        argv = ["--index", "public/data/search-index.v2.json", "--manifest", "public/data/search-index-manifest.v2.json", "--script", "public/data/search-index.v2.js",
                "--library-dirs", "Physics/library", "Chemistry/library", "Mathematics/library", "--evidence-dir", str(out), "--enforce"]
        self.assertEqual(verify_search_index.main(argv), 0, "rebuild it with Shared/tools/build_search_index.py")

    def test_the_index_covers_every_kind_and_every_subject(self):
        index = json.loads((REPO / "public/data/search-index.v2.json").read_text(encoding="utf-8"))
        self.assertTrue(all(index["counts"][k] > 0 for k in ("PAGE", "TOPIC", "QUESTION", "HINT")), index["counts"])
        self.assertEqual({"Physics", "Chemistry", "Mathematics"} - set(index["facets"]["subject"]), set())
        self.assertNotIn("Unknown", index["facets"]["subject"], "a document whose subject is not known is a defect of the data model")


if __name__ == "__main__":
    unittest.main()
