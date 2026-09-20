#!/usr/bin/env python3
"""Regression tests for the four Chemistry master suites extracted from PR #144."""
from __future__ import annotations

import json
import re
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]

SUITES = {
    "bonding": (
        REPO / "public/chemistry/bonding/explorers/chemical_bonding/index.html",
        REPO / "public/chemistry/bonding/explorers/chemical_bonding/jee_questions_data.js",
        REPO / "standalone/chemistry-chemical-bonding-master-suite.html",
        17,
        3,
    ),
    "mole": (
        REPO / "public/chemistry/some-basic-concepts/explorers/mole_concept/index.html",
        REPO / "public/chemistry/some-basic-concepts/explorers/mole_concept/jee_questions_data.js",
        REPO / "standalone/chemistry-mole-concept-master-suite.html",
        5,
        15,
    ),
    "redox": (
        REPO / "public/chemistry/redox/explorers/redox_reactions/index.html",
        REPO / "public/chemistry/redox/explorers/redox_reactions/jee_questions_data.js",
        REPO / "standalone/chemistry-redox-reactions-master-suite.html",
        8,
        12,
    ),
    "gases": (
        REPO / "public/chemistry/gases/explorers/behaviour_of_gases/index.html",
        REPO / "public/chemistry/gases/explorers/behaviour_of_gases/jee_questions_data.js",
        REPO / "standalone/chemistry-behaviour-of-gases-master-suite.html",
        2,
        18,
    ),
}

REQUIRED = {
    "id", "q", "options", "formula", "steps", "ans", "trap",
    "answerAudit", "answerAuditNote", "sourceAudit",
    "simFidelity", "simFidelityNote", "targetTab", "simParams", "simBindingRefs",
}


def load_bank(path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8")
    start = text.index("[")
    end = text.rindex("]") + 1
    return json.loads(text[start:end])


def embedded_bank(html: str) -> list[dict]:
    marker = html.index("window.JEE_QUESTIONS_DATA")
    start = html.index("[", marker)
    end = html.index("];", start) + 1
    return json.loads(html[start:end])


class ChemistryMasterSuitesAuditTest(unittest.TestCase):
    def test_banks_are_structurally_audited(self):
        for name, (html_path, data_path, _, constrained, concept) in SUITES.items():
            with self.subTest(suite=name):
                html = html_path.read_text(encoding="utf-8")
                bank = load_bank(data_path)
                self.assertEqual(len(bank), 20)
                self.assertEqual(len({q["id"] for q in bank}), 20)
                self.assertNotIn("ExamSIDE Verified Bank", html)

                for q in bank:
                    self.assertTrue(REQUIRED.issubset(q), q["id"])
                    self.assertEqual(q["sourceAudit"], "SOURCE_PROVENANCE_PENDING")
                    self.assertIn(f'id="{q["targetTab"]}"', html, q["id"])
                    refs = q["simBindingRefs"]
                    self.assertEqual(
                        refs,
                        [f"simParams.{key}" for key in q["simParams"]],
                        q["id"],
                    )
                    if q["simFidelity"] == "CONSTRAINT_FAITHFUL":
                        self.assertTrue(refs, q["id"])
                    elif q["simFidelity"] == "CONCEPT_ONLY":
                        self.assertEqual(refs, [], q["id"])
                    else:
                        self.fail(f"{q['id']}: unexpected fidelity {q['simFidelity']}")

                    if q["answerAudit"] == "PASS":
                        self.assertIn(q["correct"], {o["key"] for o in q["options"]})

                self.assertEqual(
                    sum(q["simFidelity"] == "CONSTRAINT_FAITHFUL" for q in bank),
                    constrained,
                )
                self.assertEqual(
                    sum(q["simFidelity"] == "CONCEPT_ONLY" for q in bank),
                    concept,
                )

    def test_known_answer_audit_exceptions_are_fail_closed(self):
        bonding = {q["id"]: q for q in load_bank(SUITES["bonding"][1])}
        mole = {q["id"]: q for q in load_bank(SUITES["mole"][1])}

        self.assertEqual(bonding["BOND-Q19"]["answerAudit"], "PENDING")
        self.assertEqual(mole["CHEM02-Q04"]["answerAudit"], "FAIL")
        self.assertIsNone(mole["CHEM02-Q04"]["correct"])
        self.assertIn("C₄H₆", mole["CHEM02-Q04"]["ans"])

    def test_canvas_setup_does_not_recurse_dpr_height(self):
        for name, (html_path, _, _, _, _) in SUITES.items():
            with self.subTest(suite=name):
                html = html_path.read_text(encoding="utf-8")
                start = html.index("function setupCanvas")
                end = html.index("\n    function ", start + 20)
                setup = html[start:end]
                self.assertIn("dataset.logicalHeight", setup)
                self.assertIn("ctx.setTransform", setup)
                self.assertNotIn("getAttribute('height') ?", setup)

        bonding = SUITES["bonding"][0].read_text(encoding="utf-8")
        self.assertNotIn("window.addEventListener('mousemove'", bonding)
        self.assertNotIn("window.addEventListener('touchmove'", bonding)
        self.assertIn("pointerdown", bonding)

    def test_standalones_embed_exact_canonical_bank(self):
        for name, (_, data_path, standalone_path, _, _) in SUITES.items():
            with self.subTest(suite=name):
                source = load_bank(data_path)
                html = standalone_path.read_text(encoding="utf-8")
                self.assertEqual(embedded_bank(html), source)
                self.assertNotIn('src="jee_questions_data.js"', html)
                self.assertIn("SINGLE_FILE_ONLINE", html)

    def test_no_duplicate_static_ids_or_unresolved_inline_handlers(self):
        for name, (html_path, _, _, _, _) in SUITES.items():
            with self.subTest(suite=name):
                html = html_path.read_text(encoding="utf-8")
                ids = re.findall(r'\bid="([^"]+)"', html)
                self.assertEqual(len(ids), len(set(ids)))
                handlers = set(re.findall(
                    r'on(?:click|input|change)="([A-Za-z_$][\w$]*)\(',
                    html,
                ))
                functions = set(re.findall(
                    r'function\s+([A-Za-z_$][\w$]*)\s*\(',
                    html,
                ))
                self.assertEqual(handlers - functions, set())

    def test_inline_javascript_parses_with_node(self):
        if not shutil.which("node"):
            self.skipTest("node is not installed")
        for name, (html_path, _, _, _, _) in SUITES.items():
            html = html_path.read_text(encoding="utf-8")
            blocks = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', html, re.S)
            script = "\n".join(blocks)
            with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as fh:
                fh.write(script)
                temp = Path(fh.name)
            try:
                proc = subprocess.run(
                    ["node", "--check", str(temp)],
                    text=True,
                    capture_output=True,
                    check=False,
                )
                self.assertEqual(proc.returncode, 0, f"{name}: {proc.stderr}")
            finally:
                temp.unlink(missing_ok=True)


if __name__ == "__main__":
    unittest.main()
