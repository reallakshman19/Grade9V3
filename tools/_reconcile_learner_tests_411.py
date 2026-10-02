#!/usr/bin/env python3
"""One-shot exact reconciliation of stale TEST learner-navigation contracts for #411."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def replace_once(path: Path, pattern: str, replacement: str, *, flags: int = 0) -> None:
    text = path.read_text(encoding="utf-8")
    updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f"expected exactly one stale contract in {path}; found {count}")
    path.write_text(updated, encoding="utf-8")


py_test = ROOT / "tests/test_test_area.py"
replace_once(
    py_test,
    r"    def test_the_tab_is_in_the_shared_header_and_on_the_hubs_and_the_site_can_reach_test\(self\):\n.*?(?=\n    def test_test_is_not_a_question_bank_subject)",
    '''    def test_test_stays_internal_and_is_not_exposed_by_learner_shell_or_hubs(self):
        header = (REPO / "public/js/site-header.js").read_text(encoding="utf-8")
        self.assertNotIn("root+'test/index.html'", header)
        self.assertTrue((REPO / "public/test/index.html").is_file(), "the internal TEST route is retained")
        for page in ("index.html", "physics/index.html", "chemistry/index.html", "mathematics/index.html"):
            text = (REPO / "public" / page).read_text(encoding="utf-8")
            self.assertNotIn("data-site-test", text, page)
''',
    flags=re.S,
)
replace_once(
    py_test,
    r"    def test_test_is_not_a_question_bank_subject\(self\):\n.*?(?=\n\n\nclass TestDeploy)",
    '''    def test_test_is_not_a_question_bank_subject(self):
        projection = build_question_bank_web.build(REPO)
        questions = projection["questions"]
        subjects = {q.get("subject") for q in questions}
        ids = [q["id"] for q in questions]
        self.assertNotIn("TEST", subjects)
        self.assertGreater(len(questions), 0)
        self.assertEqual(len(ids), len(set(ids)), "canonical Question Bank IDs remain unique")
        self.assertTrue({"Physics", "Chemistry", "Mathematics"}.issubset(subjects))
''',
    flags=re.S,
)

browser = ROOT / "tests/test_area_browser.mjs"
replace_once(
    browser,
    r"// The tab: from the portal and from each subject hub, one tap reaches the TEST hub, and the hub reaches the other pages\.\n.*?(?=\nawait browser\.close\(\);)",
    '''// TEST is an internal sandbox: learner Home and subject hubs must not expose a TEST tab.
for (const from of ['index.html', 'physics/index.html', 'chemistry/index.html', 'mathematics/index.html']) {
  const { context, tab, problems } = await open(390, from);
  const count = await tab.locator('a[data-site-test]').count();
  checked += 1;
  if (count) failures.push(`${from}: learner navigation exposes ${count} TEST tab(s)`);
  for (const problem of problems) failures.push(`${from}: ${problem}`);
  await context.close();
}

// The TEST sandbox itself remains directly addressable and keeps its internal navigation.
{
  const { context, tab, problems } = await open(390, 'test/index.html');
  checked += 1;
  for (const label of ['Atlas', 'Rungs', 'Deployments']) {
    if (!(await tab.locator('nav[data-g9-breadcrumb] a', { hasText: label }).count())) failures.push(`test/index.html: TEST hub has no ${label} link`);
  }
  for (const problem of problems) failures.push(`test/index.html: ${problem}`);
  await context.close();
}
''',
    flags=re.S,
)

browser_text = browser.read_text(encoding="utf-8")
old = "PASS: the TEST pages hold at ${WIDTHS.length} widths, the Atlas shows its empty state and renders a TEST matrix, and the tab is reachable (${checked} checks)"
new = "PASS: the TEST pages hold at ${WIDTHS.length} widths, the Atlas renders correctly, learner hubs hide TEST, and the internal TEST route remains reachable (${checked} checks)"
if old not in browser_text:
    raise SystemExit("expected legacy browser PASS summary was not found")
browser.write_text(browser_text.replace(old, new, 1), encoding="utf-8")

print("Reconciled stale TEST learner-navigation contracts for #411")
