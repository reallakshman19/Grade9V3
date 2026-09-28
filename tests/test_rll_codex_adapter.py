from __future__ import annotations

import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
RULE = REPO / ".agents/rules/rll-1.md"
WORKER = REPO / "scripts/rll1-codex-worker.ps1"
INSTALLER = REPO / "scripts/install-rll1-codex-task.ps1"
DOCS = REPO / "docs/RLL1_CODEX_LOCAL_AUTOMATION.md"
EP = REPO / "relay/WORK/EP-ISS334-RLL-CODEX-ADAPTER-V31-001.yaml"
COMMON_BASIS = "1ced68258afeaf50df113b1d38a4ceb9193587e3"


class RllCodexAdapterContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.rule = RULE.read_text(encoding="utf-8")
        cls.worker = WORKER.read_text(encoding="utf-8")
        cls.installer = INSTALLER.read_text(encoding="utf-8")
        cls.docs = DOCS.read_text(encoding="utf-8")
        cls.ep = EP.read_text(encoding="utf-8")
        cls.all_text = "\n".join([cls.rule, cls.worker, cls.installer, cls.docs, cls.ep])

    def test_adapter_is_pinned_to_common_and_codex(self):
        for text in (self.rule, self.worker, self.docs, self.ep):
            self.assertIn(COMMON_BASIS, text)
        self.assertIn('"--executor", "codex"', self.worker)
        self.assertIn("rll_worker.py", self.worker)
        self.assertNotIn("def Mutex", self.all_text)
        self.assertNotIn("RLL_RUN_RESULT_V1", self.worker)

    def test_credential_and_provider_boundaries(self):
        for token in ("GH_TOKEN", "GITHUB_TOKEN", "GH_ENTERPRISE_TOKEN", "GITHUB_ENTERPRISE_TOKEN"):
            self.assertIn(token, self.worker)
            self.assertIn(token, self.installer)
        self.assertIn("GitHub MCP", self.rule)
        self.assertIn("must not commit, push, merge, rebase", self.rule)
        self.assertNotIn("--dangerously", self.all_text.lower())

    def test_installer_is_smoke_first_and_non_overlapping(self):
        self.assertIn("[switch]$EnableExecution", self.installer)
        self.assertIn('" -Smoke"', self.installer)
        self.assertIn("New-TimeSpan -Minutes 10", self.installer)
        self.assertIn("-MultipleInstances IgnoreNew", self.installer)
        self.assertIn("LOCALAPPDATA", self.installer)
        self.assertIn("Copy-Item -Force $SourceWorker $installedWorker", self.installer)

    def test_only_canonical_labels_are_declared(self):
        canonical = {"rll-ready", "rll-active", "rll-review-ready", "rll-escalation"}
        for label in canonical:
            self.assertIn('Name="' + label + '"', self.installer)
        for forbidden in ("rll-pass", "rll-fail", "rll-completed", "rll-blocked"):
            self.assertNotIn(forbidden, self.all_text)

    def test_no_merge_release_or_force_push_behavior(self):
        lowered = self.worker.lower() + "\n" + self.installer.lower()
        for forbidden in ("gh pr merge", "git merge", "git push --force", "git push -f", "gh release", "remove-item"):
            self.assertNotIn(forbidden, lowered)

    def test_docs_bind_exact_head_and_protect_331(self):
        self.assertIn("mode: EXACT_HEAD_EVIDENCE", self.docs)
        self.assertIn("allow_material_write: false", self.docs)
        self.assertIn("1901acfb8be5864c2b49a01690cdbb67a2c1c292", self.docs)
        self.assertIn("Do not add rll-ready to #332 before the adapter smoke is reviewed.", self.docs)
        self.assertIn("PR #331", self.ep)


if __name__ == "__main__":
    unittest.main()
