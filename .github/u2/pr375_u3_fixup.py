from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
rem = ROOT / ".github/u2/pr375_u3_remediate.py"
aud = ROOT / ".github/u2/pr375_u3_audit.js"

# Patch all six CORE1A concept figures by DOM role/order instead of depending on
# representation-name spelling. The compact final-stage labels preserve the
# physics meaning while keeping all learner-visible text within the SVG viewBox.
s = rem.read_text(encoding="utf-8")
start = s.index("# U3-6/U3-12:")
end = s.index("# U3-7:", start)
replacement = r'''# U3-6/U3-12: fix the six rendered CORE1A concept SVGs and persist CORE1A attempts.
short={
"partner force on table":"partner on table ↓",
"partner force on table ↓":"partner on table ↓",
"table acts on Q in two components":"table on Q: N and f",
"Rtable = vector sum of N and f":"Rtable = vector sum (N, f)",
"each dF is normal":"each dF ⟂ surface",
"N = mg - F⊥, only while contact remains":"N = mg − F⊥ (while in contact)",
"If the algebra asks N<0, contact is lost.":"If N<0, contact is lost.",
"If the algebra asks N&lt;0, contact is lost.":"If N&lt;0, contact is lost.",
"same N + smaller actual contact area -> larger p":"same N, smaller A ⇒ larger p",
"same N + smaller actual contact area → larger p":"same N, smaller A ⇒ larger p",
"same N + smaller actual contact area → larger average pressure":"same N, smaller A ⇒ larger p",
"tilt rotates F; it does not shrink A":"tilt rotates F; A stays same"
}
for path in [ST/"core2-physics-thrust-pressure-tablet.html",PR/"core2-physics-thrust-pressure-tablet.html"]:
    text=path.read_text(encoding="utf-8")
    boundary=text.find('<section id="g9-role-CORE2"')
    assert boundary > 0, path
    prefix,suffix=text[:boundary],text[boundary:]
    figures=list(re.finditer(r'(<figure\b[^>]*data-g9-representation="[^"]+"[^>]*>.*?</figure>)',prefix,re.S))
    assert len(figures) == 6, (path, len(figures), [re.search(r'data-g9-representation="([^"]+)"',m.group(1)).group(1) for m in figures])
    for idx,m in reversed(list(enumerate(figures))):
        seg=m.group(1)
        seg=seg.replace('viewBox="0 0 440 300"','viewBox="0 0 520 340"').replace('<rect width="440" height="300" fill="white"/>','<rect width="520" height="340" fill="white"/>')
        seg=re.sub(r'<marker(?![^>]*markerUnits=)', '<marker markerUnits="userSpaceOnUse"', seg).replace('fill="currentColor"/></marker>','fill="#1f2937"/></marker>')
        for a,b in short.items(): seg=seg.replace(a,b)
        seg=re.sub(r'font-size="(?:20|18|17|16)"', 'font-size="15"', seg)
        if idx == 0:
            seg=seg.replace('x1="220" y1="205" x2="220" y2="95"','x1="270" y1="205" x2="270" y2="95"').replace('<text x="234" y="112"','<text x="282" y="112"')
        prefix=prefix[:m.start(1)]+seg+prefix[m.end(1):]
    text=prefix+suffix
    text=text.replace("if(a.dataset.g9Role!=='CORE2')return;","if(!['CORE1A','CORE2'].includes(a.dataset.g9Role))return;")
    save(path,text)

'''
s = s[:start] + replacement + s[end:]

# U3-10 was audited against the 20 PR-added Physics pages. Keep the durable test
# on exactly that denominator instead of globbing unrelated Chemistry/Math pages.
old_pages = 'PAGES=list((ROOT/"standalone").glob("*.html"))+list(PR.glob("*.html"))'
new_pages = '''PAGES=[
 ROOT/"standalone/core1a-motion-1d-straight-line-tablet.html",
 ROOT/"standalone/core1a-motion-in-a-plane-tablet.html",
 ROOT/"standalone/core1a-physics-nlm-tablet.html",
 ROOT/"standalone/core1a-vector-add-sub-tablet.html",
 ROOT/"standalone/core2-motion-in-a-plane-tablet.html",
 ROOT/"standalone/core2-physics-thrust-pressure-tablet.html",
 PR/"core1a-physics-motion-2d-ncert-tablet.html",
 PR/"core1a-physics-nlm-tablet.html",
 PR/"core1a-physics-vectors-tablet.html",
 PR/"core1a-sba-06-07-trajectory-and-height-tablet.html",
 PR/"core1a-sba-motion-in-a-plane-master-tablet.html",
 PR/"core2-motion-1d-straight-line-tablet.html",
 PR/"core2-motion-consolidated-practice-tablet.html",
 PR/"core2-motion-in-a-plane-tablet.html",
 PR/"core2-physics-thrust-pressure-tablet.html",
 PR/"core2a-projectile-study.html",
 PR/"index.html",
 PR/"motion-in-1d-master-suite.html",
 PR/"motion-in-2d-master-suite.html",
 PR/"physics-motion-in-a-plane-interactive-suite.html",
]'''
assert old_pages in s
s = s.replace(old_pages, new_pages, 1)
rem.write_text(s, encoding="utf-8")

s = aud.read_text(encoding="utf-8")
start = s.index(" // U3-6:")
end = s.index(" // U3-7:", start)
replacement = r''' // U3-6: final-stage labels stay inside each of the six actual CORE1A concept figures; markers use fixed user-space sizing.
 for(const url of [root+'standalone/core2-physics-thrust-pressure-tablet.html',practice+'core2-physics-thrust-pressure-tablet.html']){
   await goto(page,url);
   const result=await page.evaluate(()=>{
     const figs=[...document.querySelectorAll('article[data-g9-role="CORE1A"] figure[data-g9-representation]')];
     return {count:figs.length,rows:figs.map(fig=>{
       const chips=[...fig.querySelectorAll('[data-g9-stage-goto]')]; chips.at(-1)?.click(); const svg=fig.querySelector('svg'),sb=svg.getBoundingClientRect();
       const texts=[...svg.querySelectorAll('text')].filter(el=>{const st=getComputedStyle(el),b=el.getBoundingClientRect();return st.display!=='none'&&st.visibility!=='hidden'&&b.width>0&&b.height>0}).map(el=>{const b=el.getBoundingClientRect();return {label:(el.textContent||'').trim(),l:b.left,r:b.right,t:b.top,b:b.bottom}});
       const out=texts.filter(x=>x.l<sb.left-1||x.r>sb.right+1||x.t<sb.top-1||x.b>sb.bottom+1);
       const badMarker=[...svg.querySelectorAll('marker')].some(m=>m.getAttribute('markerUnits')!=='userSpaceOnUse');
       return{id:fig.dataset.g9Representation,out,badMarker};
     })};
   });
   assert(result.count===6,'U3-6 expected 6 CORE1A concept figures, got '+result.count);
   assert(result.rows.every(x=>!x.badMarker&&x.out.length===0),'U3-6 SVG bounds '+JSON.stringify(result.rows));
 }

'''
s = s[:start] + replacement + s[end:]

# U2 remediation can change surrounding accessibility structure; bind the U3-8
# interaction check to the exact control adjacent to #reconInput, not its
# accessible-name computation. Behavior assertions remain unchanged.
old_selector = "page.getByRole('button',{name:'Check Understanding'})"
new_selector = "page.locator('#reconInput').locator('xpath=following-sibling::button[1]')"
assert s.count(old_selector) == 2, s.count(old_selector)
s = s.replace(old_selector, new_selector)

aud.write_text(s, encoding="utf-8")
print("patched U3 SVG remediation/audit, 20-page favicon scope, and reconstruction-control locator")
