#!/usr/bin/env python3
"""Render the complete #350 Polynomials Core2 question bank with the sole shared renderer.

The canonical question content still comes only from render_core.py. This adapter adds a
learner-browser layer modelled on the repository's existing public/question-bank experience:
summary stats, filters, browse/study modes, paging and focused navigation. It injects no
academic claims and creates no second question authority.
"""
from __future__ import annotations

import html as html_lib
import json
import re
import sys
from collections import Counter
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO))

from Shared.tools import product_manifest, render_core  # noqa: E402

PACKAGE_REF = "Mathematics/library/polynomials.v1.json"
MANIFEST = REPO / "products/mathematics/polynomials.manifest.json"
OUT_DIR = REPO / "public/mathematics/polynomials"
OUT_HTML = OUT_DIR / "core2.html"
OUT_REPORT = OUT_DIR / "core2.render.json"
EXPECTED_COUNT = 172

# Difficulty-first authoring priorities remain visible for review, but they do not reduce
# the learner-facing Core2 denominator or reorder the canonical source-question selection.
HARD_PRIORITY_REFS = [
    "Q-MAT-POLY-M2-P06-HIGHER-ORDER-THINKING-SKILLS-HOTS-16",
    "Q-MAT-POLY-M2-P09-ARCHIVE-CORNER-22",
    "Q-MAT-POLY-M2-P03-ASSESSMENT-CORNER-MULTIPLE-CORRECT-TYPE-QUESTIONS-21",
]

BANK_CSS = r"""
<style data-g9-core2-bank>
:root{
  --bg-panel:var(--card);
  --bg-card:var(--bg);
  --border:var(--line);
  --text:var(--fg);
  --text-muted:var(--muted);
}
body[data-core="CORE2"] header[data-g9-shell-header] [data-g9-action="search"],
body[data-core="CORE2"] header[data-g9-shell-header] [data-g9-search-panel]{display:none!important}
.g9-core2-bank .qb-hero{margin-top:8px}
.g9-core2-bank .qb-browser{margin-top:24px}
.g9-core2-bank .qb-filter-panel{margin-bottom:12px}
.g9-core2-bank .qb-filter-panel select,
.g9-core2-bank .qb-filter-panel input{background:var(--card);color:var(--fg);border-color:var(--line)}
.g9-core2-bank .qb-stat,
.g9-core2-bank .qb-hero,
.g9-core2-bank .qb-filter-panel{background:var(--card);border-color:var(--line)}
.g9-core2-bank .qb-kicker{color:var(--accent)}
.g9-core2-bank .qb-hero h1,
.g9-core2-bank .qb-stat b,
.g9-core2-bank .qb-section-heading h2{color:var(--fg)}
.g9-core2-bank .qb-lede,
.g9-core2-bank .qb-stat span,
.g9-core2-bank .qb-result-count,
.g9-core2-bank .qb-filter-panel label>span{color:var(--muted)}
.g9-bank-results article.qb-question{margin:18px 0}
.g9-bank-card-action{display:flex;justify-content:flex-end;gap:8px;margin-top:10px}
.g9-bank-card-action button{min-height:44px}
.g9-bank-compact .slot-support,
.g9-bank-compact .slot-solution,
.g9-bank-compact .g9-attempt{display:none!important}
.g9-bank-compact .slot-attempt [data-g9-block="conditions"],
.g9-bank-compact .slot-attempt figure{display:none!important}
.g9-bank-compact .slot-identity,
.g9-bank-compact .slot-attempt{grid-column:1/-1!important}
.g9-bank-compact .slot-attempt{padding-top:0}
.g9-bank-compact .slot-attempt [data-g9-block="stem"] p{
  display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden
}
.g9-bank-nav{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:10px 0 20px}
.g9-bank-nav button{min-height:44px}
.g9-bank-position{color:var(--muted);font-weight:700}
.g9-bank-empty{padding:28px;border:1px dashed var(--line);border-radius:12px;color:var(--muted);text-align:center}
.g9-bank-source-chip{
  display:inline-flex;align-items:center;padding:4px 9px;border:1px solid var(--line);
  border-radius:999px;background:var(--bg);color:var(--muted);font-size:.82rem;font-weight:700
}
.g9-bank-disputed{border-color:#b45309!important}
@media(max-width:720px){
  .g9-core2-bank .qb-hero{grid-template-columns:1fr}
  .g9-bank-nav button{flex:1 1 44%}
}
</style>
"""

BANK_JS = r"""
<script data-g9-core2-bank>
(()=>{
  const all=[...document.querySelectorAll('article[data-g9-unit]')];
  if(!all.length)return;
  const $=id=>document.getElementById(id);
  const els={
    search:$('g9BankSearch'),family:$('g9BankFamily'),scope:$('g9BankScope'),
    source:$('g9BankSource'),status:$('g9BankStatus'),mode:$('g9BankMode'),
    count:$('g9BankCount'),load:$('g9BankLoadMore'),reset:$('g9BankReset'),
    back:$('g9BankBack'),prev:$('g9BankPrev'),next:$('g9BankNext'),
    pos:$('g9BankPosition'),top:$('g9BankTop'),empty:$('g9BankEmpty')
  };
  let limit=20;
  let focus=null;
  const norm=v=>String(v||'').toLowerCase().replace(/[^a-z0-9±]+/g,' ').trim();

  all.forEach(article=>{
    const identity=article.querySelector('.slot-identity');
    if(!identity)return;
    const bar=document.createElement('div');
    bar.className='g9-bank-card-action';
    const source=document.createElement('span');
    source.className='g9-bank-source-chip';
    source.textContent=article.dataset.qbSource||'Source';
    const study=document.createElement('button');
    study.type='button';
    study.textContent='Study question';
    study.dataset.g9BankStudy='';
    study.addEventListener('click',()=>{
      focus=article.id;
      els.mode.value='study';
      history.replaceState(null,'','#'+encodeURIComponent(article.id));
      render();
      article.scrollIntoView({behavior:'smooth',block:'start'});
    });
    bar.append(source,study);
    identity.append(bar);
    if(article.dataset.qbStatus==='DISPUTED')article.classList.add('g9-bank-disputed');
  });

  function filtered(){
    const terms=norm(els.search.value).split(/\s+/).filter(Boolean);
    return all.filter(a=>{
      if(els.family.value&&a.dataset.qbFamily!==els.family.value)return false;
      if(els.scope.value&&a.dataset.qbScope!==els.scope.value)return false;
      if(els.source.value&&a.dataset.qbSource!==els.source.value)return false;
      if(els.status.value&&a.dataset.qbStatus!==els.status.value)return false;
      if(terms.length){
        const hay=norm([a.id,a.dataset.g9SearchText,a.dataset.qbFamilyLabel,a.dataset.qbScope,a.dataset.qbSource].join(' '));
        if(!terms.every(t=>hay.includes(t)))return false;
      }
      return true;
    });
  }

  function showBrowse(list){
    all.forEach(a=>{a.hidden=true;a.classList.add('g9-bank-compact')});
    list.slice(0,limit).forEach(a=>a.hidden=false);
    els.load.hidden=list.length<=limit;
    els.back.hidden=els.prev.hidden=els.next.hidden=els.pos.hidden=true;
    els.empty.hidden=!!list.length;
  }

  function showStudy(list){
    all.forEach(a=>{a.hidden=true;a.classList.remove('g9-bank-compact')});
    if(!list.length){
      els.load.hidden=true;els.back.hidden=false;els.prev.hidden=els.next.hidden=els.pos.hidden=true;
      els.empty.hidden=false;return;
    }
    let index=list.findIndex(a=>a.id===focus);
    if(index<0)index=0;
    focus=list[index].id;
    list[index].hidden=false;
    els.load.hidden=true;els.empty.hidden=true;
    els.back.hidden=false;els.prev.hidden=index===0;els.next.hidden=index===list.length-1;els.pos.hidden=false;
    els.pos.textContent=`Question ${index+1} of ${list.length}`;
    els.prev.onclick=()=>{focus=list[Math.max(0,index-1)].id;history.replaceState(null,'','#'+encodeURIComponent(focus));render();document.getElementById(focus)?.scrollIntoView({behavior:'smooth',block:'start'})};
    els.next.onclick=()=>{focus=list[Math.min(list.length-1,index+1)].id;history.replaceState(null,'','#'+encodeURIComponent(focus));render();document.getElementById(focus)?.scrollIntoView({behavior:'smooth',block:'start'})};
  }

  function render(){
    const list=filtered();
    els.count.textContent=`${list.length} of ${all.length} questions`;
    if(els.mode.value==='study')showStudy(list);else showBrowse(list);
    document.body.dataset.g9BankMode=els.mode.value;
  }

  for(const el of [els.family,els.scope,els.source,els.status]){
    el.addEventListener('change',()=>{limit=20;focus=null;render()});
  }
  let timer=null;
  els.search.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>{limit=20;focus=null;render()},100)});
  els.mode.addEventListener('change',()=>{limit=20;render()});
  els.load.addEventListener('click',()=>{limit+=20;render()});
  els.reset.addEventListener('click',()=>{
    els.search.value='';els.family.value='';els.scope.value='';els.source.value='';els.status.value='';
    els.mode.value='browse';limit=20;focus=null;history.replaceState(null,'',location.pathname);render();
  });
  els.back.addEventListener('click',()=>{els.mode.value='browse';focus=null;history.replaceState(null,'',location.pathname);render();window.scrollTo({top:0,behavior:'smooth'})});
  els.top.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

  const hash=decodeURIComponent(location.hash.replace(/^#/,''));
  if(hash&&all.some(a=>a.id===hash)){focus=hash;els.mode.value='study'}
  render();
})();
</script>
"""


def write_manifest() -> list[str]:
    manifest = product_manifest.derive(
        PACKAGE_REF,
        [],
        "PRODUCT-MAT-POLYNOMIALS",
        "../../../index.html",
        "../../../question-bank/index.html",
    )
    selected = manifest["selection"]["core2"]
    if len(selected) != EXPECTED_COUNT:
        raise SystemExit(
            f"Core2 must contain the full canonical question bank: expected {EXPECTED_COUNT}, got {len(selected)}"
        )
    if len(selected) != len(set(selected)):
        raise SystemExit("Core2 full-bank selection contains duplicate question ids")
    missing_priority = [qid for qid in HARD_PRIORITY_REFS if qid not in selected]
    if missing_priority:
        raise SystemExit(f"hard-priority refs missing from full Core2 bank: {missing_priority}")

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return selected


def _source_label(question: dict) -> str:
    custody = ((question.get("extensions") or {}).get("source_custody") or {})
    resource = str(custody.get("resource_ref") or "")
    if "-M1-" in resource:
        return "m1"
    if "-M2-" in resource:
        return "m2"
    return "source"


def _bank_browser_html(ctx: render_core.Ctx, rows: list[dict]) -> str:
    families = ctx.index("question_families")
    family_refs: list[str] = []
    for row in rows:
        ref = row.get("family_ref")
        if ref and ref not in family_refs:
            family_refs.append(ref)

    def opt(value: str, label: str) -> str:
        return f'<option value="{html_lib.escape(value, quote=True)}">{html_lib.escape(label)}</option>'

    family_options = "".join(
        opt(ref, (families.get(ref) or {}).get("title") or ref) for ref in family_refs
    )
    scope_counts = Counter(
        ((row.get("extensions") or {}).get("grade9v3:scope_class") or "UNCLASSIFIED")
        for row in rows
    )

    return f"""
<section class="qb-hero" aria-labelledby="g9BankTitle">
  <div>
    <p class="qb-kicker">CORE2 · complete canonical source bank</p>
    <h1 id="g9BankTitle">Polynomials question bank</h1>
    <p class="qb-lede">Browse all {len(rows)} canonical source questions. Filter first, then open one question in focused study mode. Answers stay locked until you attempt.</p>
  </div>
  <div class="qb-stat-grid" aria-label="Polynomials question bank totals">
    <div class="qb-stat"><b>{len(rows)}</b><span>questions</span></div>
    <div class="qb-stat"><b>{scope_counts.get("CORE_SYLLABUS",0)}</b><span>core syllabus</span></div>
    <div class="qb-stat"><b>{scope_counts.get("EXTENSION",0)}</b><span>extension</span></div>
    <div class="qb-stat"><b>{scope_counts.get("RELATED",0)}</b><span>related</span></div>
  </div>
</section>
<section class="qb-browser" aria-labelledby="g9BankBrowseTitle">
  <div class="qb-section-heading">
    <div><p class="qb-kicker">Discover · Browse · Study</p><h2 id="g9BankBrowseTitle">Question browser</h2></div>
    <div class="qb-result-count" id="g9BankCount" aria-live="polite"></div>
  </div>
  <form class="qb-filter-panel" role="search" onsubmit="return false">
    <label class="qb-search-field"><span>Search questions</span><input id="g9BankSearch" type="search" placeholder="Stem, canonical ID, family…" autocomplete="off"></label>
    <label><span>Family</span><select id="g9BankFamily"><option value="">All families</option>{family_options}</select></label>
    <label><span>Scope</span><select id="g9BankScope"><option value="">All scope</option><option value="CORE_SYLLABUS">Core syllabus</option><option value="EXTENSION">Extension</option><option value="RELATED">Related</option></select></label>
    <label><span>Source</span><select id="g9BankSource"><option value="">All source members</option><option value="m1">m1</option><option value="m2">m2</option></select></label>
    <label><span>Record state</span><select id="g9BankStatus"><option value="">All states</option><option value="CANDIDATE">Candidate</option><option value="DISPUTED">Disputed</option></select></label>
    <label><span>Mode</span><select id="g9BankMode"><option value="browse">Browse</option><option value="study">Study</option></select></label>
    <button type="button" class="btn outline qb-clear" id="g9BankReset">Clear filters</button>
  </form>
  <div class="g9-bank-nav">
    <button type="button" id="g9BankBack" hidden>← Back to browse</button>
    <button type="button" id="g9BankPrev" hidden>← Previous</button>
    <span class="g9-bank-position" id="g9BankPosition" hidden></span>
    <button type="button" id="g9BankNext" hidden>Next →</button>
    <button type="button" id="g9BankTop">↑ Top</button>
  </div>
</section>
<div class="g9-bank-results" id="g9BankResults">
<div class="g9-bank-empty" id="g9BankEmpty" hidden>No questions match these filters.</div>
"""


def _enhance_bank_html(ctx: render_core.Ctx, html: str, rows: list[dict]) -> str:
    families = ctx.index("question_families")
    for row in rows:
        ref = row.get("family_ref") or ""
        family_label = (families.get(ref) or {}).get("title") or ref
        ext = row.get("extensions") or {}
        attrs = {
            "data-qb-family": ref,
            "data-qb-family-label": family_label,
            "data-qb-scope": ext.get("grade9v3:scope_class") or "",
            "data-qb-status": row.get("status") or "",
            "data-qb-source": _source_label(row),
        }
        needle = f'<article id="{html_lib.escape(row["id"], quote=True)}"'
        suffix = "".join(
            f' {name}="{html_lib.escape(str(value), quote=True)}"' for name, value in attrs.items()
        )
        html = html.replace(needle, needle + suffix, 1)

    html = html.replace('class="g9-stage-support"', 'class="g9-stage-support qb-question"')
    html = html.replace("<main>", '<main class="qb-shell g9-core2-bank">', 1)
    html = re.sub(
        r"<h1>.*?</h1>",
        _bank_browser_html(ctx, rows),
        html,
        count=1,
        flags=re.S,
    )
    html = html.replace("</main>", "</div><button type=\"button\" class=\"btn outline qb-load-more\" id=\"g9BankLoadMore\">Load more</button></main>", 1)
    html = html.replace(
        "</head>",
        '<link rel="stylesheet" href="../../../css/question-bank.css">' + BANK_CSS + "</head>",
        1,
    )
    html = html.replace("</body>", BANK_JS + "</body>", 1)
    return html


def main() -> int:
    expected = write_manifest()
    ctx = render_core.context(MANIFEST)
    rows = ctx.selection_rows["core2"]
    selected = [row["id"] for row in rows]
    if selected != expected:
        raise SystemExit("renderer Core2 selection differs from the deterministic full-bank manifest")

    digest = render_core.render_digest(ctx)
    rendered = render_core.page(ctx, "CORE2", "PAGES", digest)
    rendered = _enhance_bank_html(ctx, rendered, rows)

    if 'data-core="CORE2"' not in rendered:
        raise SystemExit("renderer did not produce a CORE2 page")
    rendered_ids = [qid for qid in selected if f'id="{qid}"' in rendered]
    if len(rendered_ids) != EXPECTED_COUNT:
        missing = [qid for qid in selected if qid not in rendered_ids]
        raise SystemExit(f"render missing {len(missing)} Core2 question(s): {missing[:10]}")
    for required in (
        'id="g9BankSearch"',
        'id="g9BankFamily"',
        'id="g9BankScope"',
        'id="g9BankSource"',
        'id="g9BankStatus"',
        'id="g9BankMode"',
        'id="g9BankLoadMore"',
    ):
        if required not in rendered:
            raise SystemExit(f"question-bank browser control missing: {required}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_HTML.write_text(rendered, encoding="utf-8")

    report = {
        "schema": "polynomials-core2-render/v1",
        "product_id": ctx.manifest["product_id"],
        "manifest": MANIFEST.relative_to(REPO).as_posix(),
        "renderer": render_core.RENDERER_VERSION,
        "render_digest": digest,
        "selected_core2_count": len(selected),
        "selected_core2": selected,
        "hard_priority_refs": HARD_PRIORITY_REFS,
        "browser_ui": {
            "benchmark": "public/question-bank/index.html",
            "design_system": "public/css/question-bank.css",
            "default_mode": "browse",
            "page_size": 20,
            "modes": ["browse", "study"],
            "filters": ["search", "family", "scope", "source", "record_state"],
            "focused_navigation": ["previous", "next", "back_to_browse"],
        },
        "core2_gaps": [row for row in ctx.gaps if row.get("core") == "CORE2"],
    }
    OUT_REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(json.dumps({
        "passed": True,
        "html": OUT_HTML.relative_to(REPO).as_posix(),
        "report": OUT_REPORT.relative_to(REPO).as_posix(),
        "render_digest": digest,
        "selected": len(selected),
        "hard_priority_refs": len(HARD_PRIORITY_REFS),
        "browser_default_page_size": 20,
        "core2_gaps": len(report["core2_gaps"]),
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
