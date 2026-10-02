from __future__ import annotations

import html
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ST = ROOT / "standalone"
PR = ST / "practice"
HIST = "46c667db4b23e3a5fb00c588825ea28bf60987c4"

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

def before_head(text: str, marker: str, fragment: str) -> str:
    if marker in text:
        return text
    assert "</head>" in text
    return text.replace("</head>", fragment + "\n</head>", 1)

# U3-2: recover generator-corrupted TeX escapes and render them with vendored KaTeX.
KATEX = r'''<link data-u3-katex rel="stylesheet" href="../vendor/katex/0.16.8/katex.min.css">
<script data-u3-katex defer src="../vendor/katex/0.16.8/katex.min.js"></script>
<script data-u3-katex defer src="../vendor/katex/0.16.8/contrib/auto-render.min.js"></script>
<script data-u3-katex>
function g9RenderMath(){if(!window.renderMathInElement)return;renderMathInElement(document.body,{throwOnError:false,delimiters:[{left:'$$',right:'$$',display:true},{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false},{left:'$',right:'$',display:false}]});}
document.addEventListener('DOMContentLoaded',g9RenderMath);
</script>'''
for path in [PR / "core1a-physics-nlm-tablet.html", PR / "core1a-physics-vectors-tablet.html", PR / "core1a-sba-motion-in-a-plane-master-tablet.html"]:
    text = path.read_text(encoding="utf-8").replace("\x0b", r"\v").replace("\x0c", r"\f")
    for suffix in ("heta", "ext", "imes", "an", "au"):
        text = text.replace("\t" + suffix, "\\t" + suffix)
    text = before_head(text, "data-u3-katex", KATEX)
    save(path, text)

# U3-3: the 2D master loaded auto-render but never invoked it.
motion2d = PR / "motion-in-2d-master-suite.html"
text = motion2d.read_text(encoding="utf-8")
INVOKE = r'''<script data-u3-katex-invoke>
function renderAllMath(){if(!window.renderMathInElement)return;renderMathInElement(document.body,{throwOnError:false,delimiters:[{left:'$$',right:'$$',display:true},{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false},{left:'$',right:'$',display:false}]});}
document.addEventListener('DOMContentLoaded',renderAllMath);
</script>'''
text = before_head(text, "data-u3-katex-invoke", INVOKE)
save(motion2d, text)

# U3-4: restore the 59 challenge stems/options from the pre-T1 candidate snapshot only as learner rendering.
def walk(v):
    if isinstance(v, dict):
        if isinstance(v.get("id"), str): yield v
        for x in v.values(): yield from walk(x)
    elif isinstance(v, list):
        for x in v: yield from walk(x)
raw = subprocess.check_output(["git", "show", f"{HIST}:Physics/library/phy-kin-2d-motion.v1.json"], cwd=ROOT, text=True)
records = {}
for row in walk(json.loads(raw)):
    m = re.fullmatch(r"Q-PHY-KIN-2D-SRC-(\d{2})", row.get("id", ""))
    if m: records[int(m.group(1))] = row
assert sorted(records) == list(range(1, 60))

def opts(row):
    out=[]
    for i,x in enumerate(row.get("options") or []):
        key=chr(65+i)
        if isinstance(x,dict):
            key=str(x.get("key") or x.get("label") or key)[:1].upper(); val=str(x.get("text") or x.get("value") or x.get("label_text") or "")
        else: val=str(x)
        out.append((key,val))
    return out

core2 = PR / "core2-motion-in-a-plane-tablet.html"
text = core2.read_text(encoding="utf-8")
QCSS='''<style data-u3-question-content>.question-stem-card{margin:14px 0;padding:16px 18px;border:1px solid var(--border);border-left:4px solid var(--accent);border-radius:10px;background:var(--bg-card-subtle)}.question-stem-label{font-size:13.5px;font-weight:800;text-transform:uppercase;color:var(--accent);margin-bottom:6px}.question-stem-text{font-size:16px;line-height:1.55;margin:0}.question-source-id{font-size:13.5px;color:var(--text-muted);margin-top:8px}.opt-btn{gap:8px;text-align:left}.opt-key{font-weight:850}.opt-text{font-weight:600;line-height:1.35}</style>'''
text = before_head(text, "data-u3-question-content", QCSS)
for i in range(1,60):
    qid=f"q{i:02d}"; row=records[i]; stem=str(row.get("stem") or "").strip(); options=opts(row)
    assert stem and len(options)==4, (qid, len(options))
    sid=html.escape(row["id"]); block=f'''\n<section class="question-stem-card" data-u3-question-content="{sid}"><div class="question-stem-label">Question</div><p class="question-stem-text">{html.escape(stem)}</p><div class="question-source-id">Reference ID: {sid}</div></section>\n'''
    if f'data-u3-question-content="{sid}"' not in text:
        pat=rf'(<article\b[^>]*id="{qid}"[^>]*>.*?</header>)'; text,n=re.subn(pat,lambda m:m.group(1)+block,text,count=1,flags=re.S); assert n==1,qid
    m=re.search(rf'(<article\b[^>]*id="{qid}"[^>]*>.*?)(?=<article\b|</main>)',text,re.S); assert m,qid
    seg=m.group(1)
    for key,label in options:
        pat=rf'(<button\b[^>]*class="opt-btn"[^>]*data-opt="{re.escape(key)}"[^>]*>)(.*?)(</button>)'
        seg,n=re.subn(pat,lambda mm,k=key,l=label:mm.group(1)+f'<span class="opt-key">{k}</span><span class="opt-text">{html.escape(l)}</span>'+mm.group(3),seg,count=1,flags=re.S); assert n==1,(qid,key)
    text=text[:m.start(1)]+seg+text[m.end(1):]

# U3-11: persist the chosen A-D option across reload.
needle="const correctOpt = card.getAttribute('data-correct-opt');\n    const optBtns = card.querySelectorAll('.opt-btn');"
if "g9_c2_opt_q" not in text:
    assert needle in text
    text=text.replace(needle,"const correctOpt = card.getAttribute('data-correct-opt');\n    const qNum = card.getAttribute('data-question');\n    const optBtns = card.querySelectorAll('.opt-btn');\n    const restoredOpt = qNum ? window.__g9Storage.getItem(`g9_c2_opt_q${qNum}`) : null;\n    if (restoredOpt) { const restoredBtn=[...optBtns].find(b=>b.getAttribute('data-opt')===restoredOpt); if(restoredBtn) restoredBtn.classList.add(restoredOpt===correctOpt?'selected-correct':'selected-incorrect'); }",1)
    text=text.replace("const choice = btn.getAttribute('data-opt');\n        optBtns.forEach(b => {","const choice = btn.getAttribute('data-opt');\n        if(qNum) window.__g9Storage.setItem(`g9_c2_opt_q${qNum}`, choice);\n        optBtns.forEach(b => {",1)
    text=text.replace("localStorage.removeItem(`g9_c2_q${qNum}`);","localStorage.removeItem(`g9_c2_q${qNum}`);\n        window.__g9Storage.removeItem(`g9_c2_opt_q${qNum}`);",1)
save(core2,text)

# U3-5: all localStorage use on the eight affected pages must degrade to memory when storage is blocked.
SAFE=r'''<script data-u3-storage-safe>(function(){const mem=new Map();const native=()=>{try{return globalThis['local'+'Storage']}catch(_){return null}};const call=(m,k,v)=>{const s=native();if(s){try{return v===undefined?s[m](k):s[m](k,v)}catch(_){}}k=String(k);if(m==='getItem')return mem.has(k)?mem.get(k):null;if(m==='setItem'){mem.set(k,String(v));return}if(m==='removeItem'){mem.delete(k);return}if(m==='clear'){mem.clear();return}return null};globalThis.__g9Storage=Object.freeze({getItem:k=>call('getItem',k),setItem:(k,v)=>call('setItem',k,v),removeItem:k=>call('removeItem',k),clear:()=>call('clear')});})();</script>'''
storage_pages=[PR/"core1a-physics-motion-2d-ncert-tablet.html",PR/"core1a-physics-nlm-tablet.html",PR/"core1a-physics-vectors-tablet.html",PR/"core1a-sba-06-07-trajectory-and-height-tablet.html",PR/"core1a-sba-motion-in-a-plane-master-tablet.html",PR/"core2-motion-1d-straight-line-tablet.html",PR/"core2-motion-consolidated-practice-tablet.html",PR/"core2-motion-in-a-plane-tablet.html"]
for path in storage_pages:
    text=path.read_text(encoding="utf-8").replace("window.localStorage.","window.__g9Storage.")
    text=re.sub(r'(?<![\w.])localStorage\.', 'window.__g9Storage.', text)
    text=before_head(text,"data-u3-storage-safe",SAFE)
    save(path,text)

# U3-6/U3-12: fix concept SVG geometry/markers and persist CORE1A attempts on both Thrust copies.
reps=["REP-PHY-THRUST-INTERFACE","REP-PHY-THRUST-NORMAL-BALANCE","REP-PHY-PRESSURE-CONTACT-AREA","REP-PHY-PRESSURE-SCALING","REP-PHY-PRESSURE-SURFACE-ORIENTATION","REP-PHY-PRESSURE-HYDROSTATIC-BRIDGE"]
short={"partner force on table":"partner force on table ↓","table acts on Q in two components":"table on Q: N and f","Rtable = vector sum of N and f":"Rtable = vector sum (N, f)","each dF is normal":"each dF ⟂ surface","N = mg - F⊥, only while contact remains":"N = mg − F⊥ (while in contact)","same N + smaller actual contact area -> larger p":"same N, smaller A ⇒ larger p","same N + smaller actual contact area → larger p":"same N, smaller A ⇒ larger p"}
for path in [ST/"core2-physics-thrust-pressure-tablet.html",PR/"core2-physics-thrust-pressure-tablet.html"]:
    text=path.read_text(encoding="utf-8")
    for rep in reps:
        pat=rf'(<figure\b[^>]*data-g9-representation="{re.escape(rep)}"[^>]*>.*?</figure>)'; m=re.search(pat,text,re.S); assert m,(path,rep); seg=m.group(1)
        seg=seg.replace('viewBox="0 0 440 300"','viewBox="0 0 520 340"').replace('<rect width="440" height="300" fill="white"/>','<rect width="520" height="340" fill="white"/>')
        seg=re.sub(r'<marker(?![^>]*markerUnits=)', '<marker markerUnits="userSpaceOnUse"', seg).replace('fill="currentColor"/></marker>','fill="#1f2937"/></marker>')
        for a,b in short.items(): seg=seg.replace(a,b)
        for a,b in [('font-size="20"','font-size="17"'),('font-size="18"','font-size="16"'),('font-size="17"','font-size="15"'),('font-size="16"','font-size="15"')]: seg=seg.replace(a,b)
        if rep=="REP-PHY-THRUST-INTERFACE": seg=seg.replace('x1="220" y1="205" x2="220" y2="95"','x1="270" y1="205" x2="270" y2="95"').replace('<text x="234" y="112"','<text x="282" y="112"')
        text=text[:m.start(1)]+seg+text[m.end(1):]
    text=text.replace("if(a.dataset.g9Role!=='CORE2')return;","if(!['CORE1A','CORE2'].includes(a.dataset.g9Role))return;")
    save(path,text)

# U3-7: print must omit navigation and interactive chrome.
PRINT='''<style data-u3-print-fix>@media print{.top-nav,.search-bar-row,.tabs-scroll-row,.jump-select-row,.workspace-actions,.theme-toggle-btn,.practice-hub-link,.nav-controls,.page-controls,[data-g9-shell-header],[data-g9-breadcrumb],.g9-cu-nav,.g9-stage-controls,#theme-toggle-btn,#clear-search-btn,#jump-select{display:none!important}.support-column{position:static!important;max-height:none!important;overflow:visible!important}details{break-inside:avoid}}</style>'''
for path in [PR/"core2-motion-in-a-plane-tablet.html",PR/"core2-motion-1d-straight-line-tablet.html",PR/"motion-in-2d-master-suite.html",PR/"index.html",ST/"core2-physics-thrust-pressure-tablet.html",PR/"core2-physics-thrust-pressure-tablet.html"]:
    save(path,before_head(path.read_text(encoding="utf-8"),"data-u3-print-fix",PRINT))

# U3-8: model solutions require a non-empty learner attempt.
sba=PR/"core1a-sba-06-07-trajectory-and-height-tablet.html"; text=sba.read_text(encoding="utf-8")
old="const parent = btn.closest('.workspace-box');\n      const rev = parent?.querySelector('details.solution-reveal');\n      if (rev) rev.open = true;"
new="const parent = btn.closest('.workspace-box');\n      const ta = parent?.querySelector('.faded-textarea');\n      if (!ta || !ta.value.trim()) { ta?.focus(); return; }\n      const rev = parent?.querySelector('details.solution-reveal');\n      if (rev) rev.open = true;"
if "!ta || !ta.value.trim()" not in text: assert old in text; text=text.replace(old,new,1)
lock="""\n  document.querySelectorAll('.workspace-box details.solution-reveal').forEach(rev => {\n    rev.addEventListener('toggle', () => {\n      const ta=rev.closest('.workspace-box')?.querySelector('.faded-textarea');\n      if(rev.open && (!ta || !ta.value.trim())){rev.open=false;ta?.focus();}\n    });\n  });\n"""
if "workspace-box details.solution-reveal" not in text: text=text.replace("  const checkBtns = document.querySelectorAll('.btn-check-faded');",lock+"\n  const checkBtns = document.querySelectorAll('.btn-check-faded');",1)
save(sba,text)
interactive=PR/"physics-motion-in-a-plane-interactive-suite.html"; text=interactive.read_text(encoding="utf-8")
old="onclick=\"document.getElementById('reconAnswer').style.display='block'; if(window.renderAllMath) window.renderAllMath();\""
new="onclick=\"if(!document.getElementById('reconInput').value.trim()){document.getElementById('reconInput').focus();return false;} document.getElementById('reconAnswer').style.display='block'; if(window.renderAllMath) window.renderAllMath();\""
if "reconInput').value.trim()" not in text: assert old in text; text=text.replace(old,new,1)
save(interactive,text)

# U3-9: numeric prediction fields reject non-numeric commits.
projectile=PR/"core2a-projectile-study.html"; text=projectile.read_text(encoding="utf-8")
old='requirePublicCondition(genuine, "GENUINE_ATTEMPT_REQUIRED");\n    state.attempted = true;'
new='requirePublicCondition(genuine, "GENUINE_ATTEMPT_REQUIRED");\n    if (state.owner === "Q21" || state.owner === "Q23") { const numeric=String(state.attempt ?? "").trim(); requirePublicCondition(/^[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:e[+-]?\\d+)?$/i.test(numeric) && Number.isFinite(Number(numeric)), "NUMERIC_ATTEMPT_REQUIRED"); }\n    state.attempted = true;'
if "NUMERIC_ATTEMPT_REQUIRED" not in text: assert old in text; text=text.replace(old,new,1)
save(projectile,text)

# U3-10: stop favicon 404s without adding network dependencies.
FAV="<link data-u3-favicon rel=\"icon\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='28' fill='%2338bdf8'/%3E%3C/svg%3E\">"
for path in PAGES:
    text=path.read_text(encoding="utf-8")
    if not re.search(r'<link\b[^>]*rel=["\'][^"\']*icon',text,re.I): text=before_head(text,"data-u3-favicon",FAV)
    save(path,text)

# Durable U3 structural regression.
test=ROOT/"tests/test_pr375_u3_standalone.py"
test.write_text('''from pathlib import Path\nimport re, unittest\nROOT=Path(__file__).resolve().parents[1]; PR=ROOT/"standalone/practice"\nPAGES=list((ROOT/"standalone").glob("*.html"))+list(PR.glob("*.html"))\nclass TestPR375U3(unittest.TestCase):\n def test_tex_and_math_runtime(self):\n  for n in ["core1a-physics-nlm-tablet.html","core1a-physics-vectors-tablet.html","core1a-sba-motion-in-a-plane-master-tablet.html"]:\n   s=(PR/n).read_text(encoding="utf-8"); self.assertNotIn("\\x0b",s); self.assertNotIn("\\x0c",s); self.assertIn("data-u3-katex",s)\n  self.assertIn("data-u3-katex-invoke",(PR/"motion-in-2d-master-suite.html").read_text(encoding="utf-8"))\n def test_core2_question_content(self):\n  s=(PR/"core2-motion-in-a-plane-tablet.html").read_text(encoding="utf-8"); self.assertEqual(59,len(re.findall(r'data-u3-question-content="Q-PHY-KIN-2D-SRC-',s))); self.assertGreaterEqual(s.count('class="opt-text"'),236); self.assertIn("g9_c2_opt_q",s)\n def test_storage_safe(self):\n  for n in ["core1a-physics-motion-2d-ncert-tablet.html","core1a-physics-nlm-tablet.html","core1a-physics-vectors-tablet.html","core1a-sba-06-07-trajectory-and-height-tablet.html","core1a-sba-motion-in-a-plane-master-tablet.html","core2-motion-1d-straight-line-tablet.html","core2-motion-consolidated-practice-tablet.html","core2-motion-in-a-plane-tablet.html"]:\n   s=(PR/n).read_text(encoding="utf-8"); self.assertIn("data-u3-storage-safe",s); self.assertNotRegex(s,r'(?<![\\w.])localStorage\\.')\n def test_thrust_and_gates(self):\n  for p in [ROOT/"standalone/core2-physics-thrust-pressure-tablet.html",PR/"core2-physics-thrust-pressure-tablet.html"]:\n   s=p.read_text(encoding="utf-8"); self.assertIn('markerUnits="userSpaceOnUse"',s); self.assertIn("['CORE1A','CORE2'].includes",s); self.assertIn("data-u3-print-fix",s)\n  self.assertIn("!ta || !ta.value.trim()",(PR/"core1a-sba-06-07-trajectory-and-height-tablet.html").read_text(encoding="utf-8")); self.assertIn("NUMERIC_ATTEMPT_REQUIRED",(PR/"core2a-projectile-study.html").read_text(encoding="utf-8"))\n def test_favicon(self):\n  for p in PAGES: self.assertRegex(p.read_text(encoding="utf-8"),r'<link\\b[^>]*rel=["\\\'][^"\\\']*icon',p)\n''',encoding="utf-8")
changed.add(test.relative_to(ROOT).as_posix())
wf=ROOT/".github/workflows/learner-quality.yml"; s=wf.read_text(encoding="utf-8")
if "tests.test_pr375_u3_standalone" not in s:
    needle="          tests.test_pr375_u2_standalone\n" if "tests.test_pr375_u2_standalone" in s else "          tests.test_renderer_inventory\n"; assert needle in s; s=s.replace(needle,needle+"          tests.test_pr375_u3_standalone\n",1); wf.write_text(s,encoding="utf-8"); changed.add(wf.relative_to(ROOT).as_posix())

# T1 boundary: this pass never edits canonical library or product manifests.
assert not [p for p in changed if p.startswith("Physics/library/") or p.startswith("products/physics/")]
print(f"U3 remediation changed {len(changed)} paths")
for p in sorted(changed): print(p)
