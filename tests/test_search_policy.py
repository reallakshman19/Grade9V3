"""The blueprint's search policy (shell.search_policy, registry 1.9.0): every page added to the site is found by the header search.

The policy is the registry's; the verifier, the builder and the acceptance step execute it. These tests hold the three together, so that a rule cannot be written that
nothing runs, and a check cannot be added that no rule owns.
"""
from __future__ import annotations

import json
import re
import unittest
from pathlib import Path
from unittest import mock

from Shared.search import site_index
from Shared.tools import accept_product, blueprint_spec, verify_search_index, web_blueprint_contract as contract

REPO = Path(__file__).resolve().parents[1]
POLICY = contract.load_registry()["shell"]["search_policy"]


class Policy(unittest.TestCase):
    def test_the_schema_accepts_the_registry_and_refuses_one_without_the_policy(self):
        import jsonschema
        schema = json.loads((REPO / "Shared/web/interactive-page-blueprint.schema.json").read_text(encoding="utf-8"))
        validator = jsonschema.Draft202012Validator(schema)
        registry = json.loads(json.dumps(contract.load_registry()))
        self.assertEqual([e.message for e in validator.iter_errors(registry)], [])
        del registry["shell"]["search_policy"]
        self.assertTrue(list(validator.iter_errors(registry)), "a registry without a search policy is accepted")

    def test_every_finding_the_verifier_can_write_belongs_to_exactly_one_rule_and_every_code_a_rule_names_is_written(self):
        source = (REPO / "Shared/tools/verify_search_index.py").read_text(encoding="utf-8")
        written = set(re.findall(r'found\("([A-Z_]+)"', source))
        named = [code for rule in POLICY["rules"] for code in rule["finding_codes"]]
        self.assertEqual(len(named), len(set(named)), "a code belongs to one rule")
        self.assertEqual(written, set(named))
        self.assertEqual(set(verify_search_index.rules()), set(named))

    def test_a_rule_with_no_code_is_executed_by_the_publication_step_and_only_that_one(self):
        by_construction = [r["id"] for r in POLICY["rules"] if not r["finding_codes"]]
        self.assertEqual(by_construction, ["PUBLICATION_REINDEXES"])

    def test_each_rule_names_an_assurance_type_the_evidence_schema_knows_and_a_policy_key_the_shell_has(self):
        known = set(json.loads((REPO / "Shared/assurance/assurance-evidence.schema.json").read_text())["properties"]["assurance_type"]["enum"])
        shell = contract.load_registry()["shell"]
        for rule in POLICY["rules"]:
            self.assertIn(rule["assurance_type"], known, rule["id"])
            self.assertIn(rule["assurance_type"], {"SEARCH_MEMBERSHIP", "SEARCH_RETRIEVABILITY"}, "what verify_search_index.py writes evidence of")
            head, _, key = rule["executes"].partition(".")
            self.assertIn(key, shell[head], rule["id"])

    def test_the_policy_and_the_route_table_agree_and_what_they_name_exists(self):
        config = site_index.load_config()
        self.assertEqual(POLICY["site_root"], config["site_root"])
        self.assertEqual(POLICY["index"], config["outputs"]["index"])
        self.assertEqual(REPO / POLICY["routes"], site_index.CONFIG)
        for key in ("routes", "builder", "verifier", "index"):
            self.assertTrue((REPO / POLICY[key]).exists(), key)
        for prefix in config["excluded_prefixes"]:
            self.assertIn(prefix, POLICY["not_indexed"], "the policy says what the route table leaves out")
        self.assertIn("build_search_index.py", POLICY["when_a_page_is_added"])

    def test_the_generated_spec_states_the_policy(self):
        spec = blueprint_spec.render()
        self.assertIn("Search: every page is found", spec)
        for rule in POLICY["rules"]:
            self.assertIn(f"`{rule['id']}`", spec)
        self.assertEqual(spec, (REPO / "docs/specs/PAGE-BLUEPRINT-COMPONENTS.md").read_text(encoding="utf-8"), "regenerate it with blueprint_spec.py --write")

    def test_the_policy_is_in_registry_1_9_0_and_the_shell_that_changed_says_so(self):
        registry = contract.load_registry()
        self.assertEqual(registry["registry_version"], "1.9.0")
        self.assertEqual(registry["shell"]["version"], "1.4.0")


class Publication(unittest.TestCase):
    """PUBLICATION_REINDEXES. That accept() calls the hook before it writes the mirror is tested where accept() is (test_publication.py); here, that the command hands it the real one."""

    def test_the_acceptance_command_rebuilds_the_search_index_through_the_shared_publisher(self):
        self.assertIn("after_publish=reindex_search", (REPO / "Shared/tools/accept_product.py").read_text(encoding="utf-8"))
        with mock.patch("Shared.search.publish.rebuild") as rebuild:
            accept_product.reindex_search(REPO)
        rebuild.assert_called_once_with(REPO)


class Committed(unittest.TestCase):
    def test_every_page_file_of_the_site_is_in_the_committed_index_with_a_title(self):
        """The rule, on the real repository: a page added without being indexed is this test failing, as it is the verifier failing in CI."""
        config = site_index.load_config()
        index = json.loads((REPO / config["outputs"]["index"]).read_text(encoding="utf-8"))
        indexed = {d["url"] for d in index["documents"] if d["id"].startswith("page:")}
        pages = site_index.page_descriptors(REPO / config["site_root"], config)
        self.assertEqual(sorted(indexed - {d["path"] for d in pages}), [], "indexed pages that are not files")
        self.assertEqual(sorted({d["path"] for d in pages} - indexed), [], "page files that are not indexed: run Shared/tools/build_search_index.py")
        self.assertEqual([d["path"] for d in pages if not d["titled"]], [], "pages with no title")
        self.assertEqual([d["path"] for d in pages if d["unanchored"]], [], "question elements with no id")


if __name__ == "__main__":
    unittest.main()
