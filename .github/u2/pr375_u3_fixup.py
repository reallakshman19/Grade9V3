from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
rem = ROOT / ".github/u2/pr375_u3_remediate.py"
aud = ROOT / ".github/u2/pr375_u3_audit.js"

# The issue comment names the concept, but the rendered representation ID for the
# orientation unit is not the same string. Patch all six CORE1A concept figures
# by DOM role/order instead of depending on representation-name spelling.
s = rem.read_text(encoding="utf-8")
start = s.index("# U3-6/U3-12:")
end = s.index("# U3-7:", start)
replacement = r'''# U3-6/U3-12: fix the six rendered CORE1A concept SVGs and persist CORE1A attempts.
short={"partner force on table":"partner force on table ↓","table acts on Q in two components":"table on Q: N and f","Rtable = vector sum of N and f":"Rtable = vector sum (N, f)","each dF is normal":"each dF ⟂ surface","N = mg - F⊥, only while contact remains":"N = mg − F⊥ (while in contact)","same N + smaller actual contact area -> larger p":"same N, smaller A ⇒ larger p","same N + smaller actual contact area → larger p"}
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
rem.write_text(s[:start] + replacement + s[end:], encoding="utf-8")

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
aud.write_text(s[:start] + replacement + s[end:], encoding="utf-8")
print("patched U3 SVG remediation/audit to role-based six-figure selection")
