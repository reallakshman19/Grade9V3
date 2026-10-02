from __future__ import annotations

from collections import defaultdict
from pathlib import Path
import os
import re
import shutil

ROOT = Path(__file__).resolve().parents[2]
ST = ROOT / "standalone"
PR = ST / "practice"

ROOT_PAGES = [
    ST / "core1a-motion-1d-straight-line-tablet.html",
    ST / "core1a-motion-in-a-plane-tablet.html",
    ST / "core1a-physics-nlm-tablet.html",
    ST / "core1a-vector-add-sub-tablet.html",
    ST / "core2-motion-in-a-plane-tablet.html",
    ST / "core2-physics-thrust-pressure-tablet.html",
]
PRACTICE_PAGES = [
    PR / "core1a-physics-motion-2d-ncert-tablet.html",
    PR / "core1a-physics-nlm-tablet.html",
    PR / "core1a-physics-vectors-tablet.html",
    PR / "core1a-sba-06-07-trajectory-and-height-tablet.html",
    PR / "core1a-sba-motion-in-a-plane-master-tablet.html",
    PR / "core2-motion-1d-straight-line-tablet.html",
    PR / "core2-motion-consolidated-practice-tablet.html",
    PR / "core2-motion-in-a-plane-tablet.html",
    PR / "core2-physics-thrust-pressure-tablet.html",
    PR / "core2a-projectile-study.html",
    PR / "index.html",
    PR / "motion-in-1d-master-suite.html",
    PR / "motion-in-2d-master-suite.html",
    PR / "physics-motion-in-a-plane-interactive-suite.html",
]
PAGES = ROOT_PAGES + PRACTICE_PAGES
assert len(PAGES) == 20 and all(p.is_file() for p in PAGES)
changed: set[str] = set()

def save(path: Path, text: str) -> None:
    old = path.read_text(encoding="utf-8")
    if text != old:
        path.write_text(text, encoding="utf-8")
        changed.add(path.relative_to(ROOT).as_posix())

# U2-1/U2-3/U2-4: vendor shared runtimes inside standalone/.
for package, version in [("katex", "0.16.8"), ("tailwind", "3.4.17")]:
    src = ROOT / "public" / "vendor" / package / version
    dst = ST / "vendor" / package / version
    assert src.is_dir(), src
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst)
    for p in dst.rglob("*"):
        if p.is_file(): changed.add(p.relative_to(ROOT).as_posix())

for path in [PR / "core2a-projectile-study.html", PR / "motion-in-1d-master-suite.html", PR / "motion-in-2d-master-suite.html", PR / "physics-motion-in-a-plane-interactive-suite.html"]:
    text = path.read_text(encoding="utf-8").replace("../../public/vendor/katex/0.16.8/", "../vendor/katex/0.16.8/")
    save(path, text)

local_tailwind = '<script src="../vendor/tailwind/3.4.17/tailwind-play.js"></script>'
motion2d = PR / "motion-in-2d-master-suite.html"
text = motion2d.read_text(encoding="utf-8")
text = text.replace('<script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>', local_tailwind)
text = text.replace("CDN libraries remain remote.", "Shared runtime dependencies are vendored under standalone/vendor.")
while text.count('id="sbTeacherChalk"') > 1:
    text, n = re.subn(r'(<g id="sbTeacherChalk" style="display: none;"></g>\s*)<g id="sbTeacherChalk" style="display: none;"></g>', r"\1", text, count=1)
    assert n == 1
assert "www.gstatic.com/antigravity/web/dev/tailwindcss.min.js" not in text
save(motion2d, text)

motion1d = PR / "motion-in-1d-master-suite.html"
text = motion1d.read_text(encoding="utf-8")
if "../vendor/tailwind/3.4.17/tailwind-play.js" not in text:
    config_pos = text.find("tailwind.config")
    if config_pos < 0: config_pos = text.find("(window.tailwind = window.tailwind || {}).config")
    assert config_pos >= 0
    script_pos = text.rfind("<script", 0, config_pos)
    assert script_pos >= 0
    text = text[:script_pos] + local_tailwind + "\n  " + text[script_pos:]
hub_anchor = re.compile(r'(<a\b[^>]*href="index\.html"[^>]*aria-label="Back to Practice Hub"[^>]*>)(.*?)(</a>)', re.S)
m = hub_anchor.search(text)
if m and "Practice Hub" not in re.sub(r"<[^>]+>", "", m.group(2)):
    text = text[:m.start()] + m.group(1) + "← Practice Hub" + m.group(3) + text[m.end():]
save(motion1d, text)

# The standalone Thrust page already has the Practice Hub; remove its full-site Question Bank dependency.
thrust_practice = PR / "core2-physics-thrust-pressure-tablet.html"
text = thrust_practice.read_text(encoding="utf-8")
text = re.sub(r'<a\b[^>]*href="\.\./\.\./public/question-bank/index\.html"[^>]*>\s*Question bank\s*</a>', "", text, flags=re.I)
save(thrust_practice, text)

# U2-2: repair the six root snapshots without inventing nonexistent core1a.html/core2.html files.
ID_RE = re.compile(r'\bid="([^"]+)"')
ids_by_file: dict[Path, set[str]] = {}
locations: dict[str, list[Path]] = defaultdict(list)
for path in PAGES:
    ids = set(ID_RE.findall(path.read_text(encoding="utf-8")))
    ids_by_file[path] = ids
    for item in ids: locations[item].append(path)

fallback = {
    "core1a-motion-1d-straight-line-tablet.html": PR / "core2-motion-1d-straight-line-tablet.html",
    "core1a-motion-in-a-plane-tablet.html": PR / "core2-motion-in-a-plane-tablet.html",
    "core1a-physics-nlm-tablet.html": PR / "core1a-physics-nlm-tablet.html",
    "core1a-vector-add-sub-tablet.html": PR / "core1a-physics-vectors-tablet.html",
    "core2-motion-in-a-plane-tablet.html": ST / "core1a-motion-in-a-plane-tablet.html",
    "core2-physics-thrust-pressure-tablet.html": PR / "core2-physics-thrust-pressure-tablet.html",
}
fallback_uses = []

def rel_href(source: Path, target: Path, fragment: str | None = None) -> str:
    rel = os.path.relpath(target, source.parent).replace(os.sep, "/")
    return rel + (("#" + fragment) if fragment else "")

def choose_target(source: Path, kind: str, fragment: str) -> str:
    if fragment in ids_by_file.get(source, set()): return "#" + fragment
    candidates = [p for p in locations.get(fragment, []) if p != source]
    if candidates:
        if kind == "core1a": candidates.sort(key=lambda p: (p.parent == PR, p.as_posix()))
        else: candidates.sort(key=lambda p: (p.parent != PR, p.as_posix()))
        return rel_href(source, candidates[0], fragment)
    target = fallback[source.name]
    fallback_uses.append((source.name, kind, fragment, target.name))
    return rel_href(source, target)

legacy_re = re.compile(r'href="(core1a|core2)\.html#([^"]+)"')
for path in ROOT_PAGES:
    text = path.read_text(encoding="utf-8")
    text = text.replace('href="../index.html"', 'href="practice/index.html"')
    text = re.sub(r'<a\b[^>]*href="\.\./question-bank/index\.html"[^>]*>\s*Question bank\s*</a>', "", text, flags=re.I)
    text = text.replace('href="index.html"', 'href="practice/index.html"')
    text = legacy_re.sub(lambda m: f'href="{choose_target(path, m.group(1), m.group(2))}"', text)
    save(path, text)

# U2-6/U2-9a: Matrix and Fast Jump now use one state-safe route.
core2 = PR / "core2-motion-in-a-plane-tablet.html"
text = core2.read_text(encoding="utf-8")
if "function jumpToQuestion(qId)" not in text:
    helper = '''\n  function jumpToQuestion(qId) {\n    const allTab = document.querySelector('.tab-btn[data-topic="all"]');\n    document.querySelectorAll('.tab-btn[data-topic]').forEach(btn => btn.classList.toggle('active', btn === allTab));\n    const matrix = document.getElementById('answer-matrix-view');\n    if (matrix) matrix.style.display = 'none';\n    const search = document.getElementById('search-input');\n    if (search) search.value = '';\n    document.querySelectorAll('article.challenge-card').forEach(card => card.style.display = '');\n    const targetEl = document.getElementById(qId);\n    if (!targetEl) return false;\n    if (location.hash !== '#' + qId) history.pushState(null, '', '#' + qId);\n    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });\n    const jumpSelect = document.getElementById('jump-select');\n    if (jumpSelect) jumpSelect.value = qId;\n    return true;\n  }\n\n'''
    marker = "// 4. Fast Jump Selector"
    assert marker in text
    text = text.replace(marker, helper + marker, 1)
old_jump = re.compile(r"const targetEl = document\.getElementById\(qId\);\s*if \(targetEl\) \{\s*targetEl\.style\.display = '';\s*targetEl\.scrollIntoView\(\{ behavior: 'smooth', block: 'start' \}\);\s*\}")
if old_jump.search(text): text = old_jump.sub("jumpToQuestion(qId);", text, count=1)
def matrix_link(m: re.Match[str]) -> str:
    qid, style = m.group(1), m.group(2)
    style = style.replace("min-height:36px", "min-height:48px").replace("min-width:36px", "min-width:48px").replace("padding:4px 10px", "padding:10px 14px").replace("font-size:12px", "font-size:13.5px")
    return f'<a href="#{qid}" class="btn jump-link" style="{style}" onclick="jumpToQuestion(\'{qid}\'); return false;">Jump</a>'
matrix_pattern = re.compile(r'<a href="#(q\d{2})" class="btn" style="([^"]*)">Jump</a>')
text, matrix_count = matrix_pattern.subn(matrix_link, text)
assert matrix_count in (0, 59), matrix_count
assert text.count('onclick="jumpToQuestion(') >= 59
save(core2, text)

# U2-5: enforce offline touch target without relying on a utility runtime.
touch_style = '<style id="u2-practice-hub-target">\na[href="index.html"]{min-height:48px!important;min-width:48px!important;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center}\n</style>\n'
for path in [p for p in PRACTICE_PAGES if p.name != "index.html"]:
    text = path.read_text(encoding="utf-8")
    if 'id="u2-practice-hub-target"' not in text:
        assert "</head>" in text
        text = text.replace("</head>", touch_style + "</head>", 1)
    save(path, text)

# U2-8/U2-9b: accurate hub metadata and a valid NLM card arrow.
hub = PR / "index.html"
text = hub.read_text(encoding="utf-8").replace("354 questions", "59 questions")
text = re.sub(r'(<div class="stat"><div class="number">)\d+(</div><div class="label">Topics</div>)', r"\g<1>7\g<2>", text, count=1)
standard_arrow = "M3 8a.75.75 0 0 1 .75-.75h6.19L7.47 4.78a.75.75 0 0 1 1.06-1.06l3.5 3.5a.75.75 0 0 1 0 1.06l-3.5 3.5a.75.75 0 1 1-1.06-1.06l2.47-2.47H3.75A.75.75 0 0 1 3 8z"
nlm_card = re.compile(r'(<a class="card" href="core1a-physics-nlm-tablet\.html">.*?<svg[^>]*><path d=")[^"]+("/>)', re.S)
text = nlm_card.sub(lambda m: m.group(1) + standard_arrow + m.group(2), text, count=1)
save(hub, text)

# U2-9d: retained outbound source links are explicitly marked online-only.
online_style = '<style id="u2-online-link-note">\na[href^="https://"]::after,a[href^="http://"]::after{content:" · online";font-size:.85em;font-weight:600}\n</style>\n'
for path in PAGES:
    text = path.read_text(encoding="utf-8")
    if re.search(r'<a\b[^>]*href="https?://', text) and 'id="u2-online-link-note"' not in text:
        assert "</head>" in text
        text = text.replace("</head>", online_style + "</head>", 1)
        save(path, text)

# U2-9c: disambiguate the exact root/practice Thrust title collision.
root_thrust = ST / "core2-physics-thrust-pressure-tablet.html"
rt, pt = root_thrust.read_text(encoding="utf-8"), thrust_practice.read_text(encoding="utf-8")
m1, m2 = re.search(r"<title>(.*?)</title>", rt, re.S), re.search(r"<title>(.*?)</title>", pt, re.S)
if m1 and m2 and m1.group(1) == m2.group(1):
    rt = rt[:m1.start(1)] + m1.group(1) + " · Root review snapshot" + rt[m1.end(1):]
    save(root_thrust, rt)

# Durable exact-denominator regression.
test_path = ROOT / "tests" / "test_pr375_u2_standalone.py"
test_path.write_text('''from __future__ import annotations\nfrom collections import Counter\nfrom pathlib import Path\nimport re, unittest\nfrom urllib.parse import unquote, urlsplit\nROOT=Path(__file__).resolve().parents[1]\nROOT_PAGES=[ROOT/"standalone/core1a-motion-1d-straight-line-tablet.html",ROOT/"standalone/core1a-motion-in-a-plane-tablet.html",ROOT/"standalone/core1a-physics-nlm-tablet.html",ROOT/"standalone/core1a-vector-add-sub-tablet.html",ROOT/"standalone/core2-motion-in-a-plane-tablet.html",ROOT/"standalone/core2-physics-thrust-pressure-tablet.html"]\nPRACTICE=[ROOT/"standalone/practice"/n for n in ["core1a-physics-motion-2d-ncert-tablet.html","core1a-physics-nlm-tablet.html","core1a-physics-vectors-tablet.html","core1a-sba-06-07-trajectory-and-height-tablet.html","core1a-sba-motion-in-a-plane-master-tablet.html","core2-motion-1d-straight-line-tablet.html","core2-motion-consolidated-practice-tablet.html","core2-motion-in-a-plane-tablet.html","core2-physics-thrust-pressure-tablet.html","core2a-projectile-study.html","index.html","motion-in-1d-master-suite.html","motion-in-2d-master-suite.html","physics-motion-in-a-plane-interactive-suite.html"]]\nPAGES=ROOT_PAGES+PRACTICE\nATTR=re.compile(r"\\b(?:href|src|action|poster|data)=[\\\"']([^\\\"']+)[\\\"']",re.I); IDS=re.compile(r"\\bid=[\\\"']([^\\\"']+)[\\\"']",re.I); REMOTE=re.compile(r"<(?:script|link|img|iframe|source|embed|object|video|audio)\\b[^>]*(?:src|href|data|poster)=[\\\"']https?://",re.I)\ndef ids(p): return set(IDS.findall(p.read_text(encoding="utf-8")))\nclass TestPR375U2Standalone(unittest.TestCase):\n def test_denominator(self):\n  self.assertEqual(20,len(PAGES)); [self.assertTrue(p.is_file(),p) for p in PAGES]\n def test_offline_dependencies(self):\n  for p in PAGES:\n   s=p.read_text(encoding="utf-8"); self.assertIsNone(REMOTE.search(s),p); self.assertNotIn("www.gstatic.com/antigravity/web/dev/tailwindcss.min.js",s); self.assertNotIn("../../public/vendor/katex/0.16.8/",s)\n  self.assertTrue((ROOT/"standalone/vendor/katex/0.16.8/katex.min.css").is_file()); self.assertTrue((ROOT/"standalone/vendor/tailwind/3.4.17/tailwind-play.js").is_file())\n def test_links_and_fragments(self):\n  cache={p.resolve():ids(p) for p in PAGES}\n  for p in PAGES:\n   for ref in ATTR.findall(p.read_text(encoding="utf-8")):\n    ref=ref.strip()\n    if not ref or ref.startswith(("#","?","data:","javascript:","mailto:","tel:","blob:","//")): continue\n    u=urlsplit(ref)\n    if u.scheme in {"http","https"}: continue\n    target=(p.parent/unquote(u.path)).resolve(); self.assertTrue(target.exists(),f"{p}: {ref}")\n    if u.fragment and target.suffix.lower() in {".html",".htm"}: self.assertIn(unquote(u.fragment),cache.setdefault(target,ids(target)),f"{p}: {ref}")\n def test_duplicate_ids(self):\n  for p in PAGES:\n   c=Counter(IDS.findall(p.read_text(encoding="utf-8"))); self.assertEqual([],[k for k,v in c.items() if v>1],p)\n def test_root_legacy_links_gone(self):\n  for p in ROOT_PAGES:\n   s=p.read_text(encoding="utf-8"); self.assertNotIn('href="../index.html"',s); self.assertNotIn('href="../question-bank/index.html"',s); self.assertNotRegex(s,r'href="core[12]a?\\.html#')\n def test_hub(self):\n  s=(ROOT/"standalone/practice/index.html").read_text(encoding="utf-8"); self.assertEqual(13,len(re.findall(r'<a class="card" href="[^"]+">',s))); self.assertIn("59 questions",s); self.assertRegex(s,r'<div class="number">7</div><div class="label">Topics</div>'); self.assertRegex(s,r'<div class="number">0</div><div class="label">Remote CDN</div>')\n def test_jumps(self):\n  s=(ROOT/"standalone/practice/core2-motion-in-a-plane-tablet.html").read_text(encoding="utf-8"); self.assertIn("function jumpToQuestion(qId)",s); self.assertEqual(59,len(re.findall(r'onclick="jumpToQuestion\\(\\\'q\\d{2}\\\'\\); return false;"',s))); self.assertNotIn("min-height:36px;min-width:36px",s)\n def test_return_targets(self):\n  for p in [x for x in PRACTICE if x.name!="index.html"]:\n   s=p.read_text(encoding="utf-8"); self.assertIn('href="index.html"',s,p); self.assertIn('id="u2-practice-hub-target"',s,p)\n''',encoding="utf-8")
changed.add(test_path.relative_to(ROOT).as_posix())

workflow = ROOT / ".github/workflows/learner-quality.yml"
wf = workflow.read_text(encoding="utf-8")
if "tests.test_pr375_u2_standalone" not in wf:
    needle = "          tests.test_renderer_inventory\n"
    assert needle in wf
    workflow.write_text(wf.replace(needle, needle + "          tests.test_pr375_u2_standalone\n", 1), encoding="utf-8")
    changed.add(workflow.relative_to(ROOT).as_posix())

print(f"U2 remediation changed {len(changed)} paths")
for path in sorted(changed): print(path)
print(f"Legacy fragment fallbacks without exact target: {len(fallback_uses)}")
for item in fallback_uses: print("fallback", item)
