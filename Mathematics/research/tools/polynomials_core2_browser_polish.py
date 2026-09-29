#!/usr/bin/env python3
"""Deterministic Question-Bank presentation for the #350 Polynomials Core2 corpus.

Browse mode renders compact Question Bank cards from canonical metadata. The full Core2
articles produced by render_core.py are retained unchanged in a hidden study store and one
article is mounted into the focused Study workspace at a time. This is presentation-only:
stems, options, attempts, source keys, answers and working remain renderer-owned.
"""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
HTML = REPO / "public/mathematics/polynomials/core2.html"
REPORT = REPO / "public/mathematics/polynomials/core2.render.json"
EXPECTED_COUNT = 172
SOURCE_OLD = '<p class="g9-prov">Source unverified</p>'
SOURCE_NEW = '<p class="g9-prov">Owner-supplied exact scan</p>'

NEW_CSS = r'''<style data-g9-core2-browser-v2>
body[data-core="CORE2"] [data-g9-breadcrumb]{display:none!important}
body[data-core="CORE2"] header[data-g9-shell-header]{border-bottom:1px solid var(--line);box-shadow:none}
.g9-core2-bank{max-width:1240px!important;padding-top:18px!important}
.g9-core2-bank .qb-hero{margin:0 0 22px;background:linear-gradient(135deg,var(--card),color-mix(in srgb,var(--accent) 5%,var(--card)))}
.g9-core2-bank .qb-discover{margin:0 0 24px}
.g9-core2-bank .qb-collection-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
.g9-core2-bank .qb-collection-card{min-height:132px;justify-content:space-between}
.g9-core2-bank .qb-collection-card[data-active="true"]{border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 12%,transparent)}
.g9-core2-bank .qb-browser{margin-top:0}
.g9-core2-bank .qb-filter-panel{margin-bottom:10px}
.g9-core2-bank .qb-active-filters{margin-bottom:16px}
.g9-bank-browser-results{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.g9-bank-browser-results .qb-question{display:flex;flex-direction:column;min-height:260px;margin:0;background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden}
.g9-bank-browser-results .qb-qhead{padding:16px 18px 12px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--accent) 2%,var(--card))}
.g9-bank-browser-results .qb-qtitle{font-size:1rem;line-height:1.35}
.g9-bank-browser-results .qb-qsource{font-size:.78rem;margin-top:4px;color:var(--muted)}
.g9-bank-browser-results .qb-badges{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.g9-bank-browser-results .qb-badge{max-width:100%;white-space:normal}
.g9-bank-browser-results .qb-compact-body{display:flex;flex:1;flex-direction:column;padding:17px 18px}
.g9-bank-browser-results .qb-stem{font-size:.98rem;line-height:1.55;display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden}
.g9-bank-browser-results .qb-qactions{margin-top:auto;padding-top:16px;border-top:1px solid color-mix(in srgb,var(--line) 70%,transparent)}
.g9-bank-browser-results .qb-id{max-width:65%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.g9-bank-browser-results .btn{min-height:42px}
.g9-bank-study-host{margin-top:12px}
.g9-bank-study-host>article{display:grid!important;grid-template-columns:minmax(0,1.15fr) minmax(320px,.85fr);gap:18px;border:1px solid var(--line);border-radius:14px;background:var(--card);padding:20px}
.g9-bank-study-host .slot-identity{grid-column:1/-1;border-bottom:1px solid var(--line);padding-bottom:14px}
.g9-bank-study-host .slot-attempt{grid-column:1;grid-row:2/5;padding:0!important}
.g9-bank-study-host .slot-support{grid-column:2;grid-row:2;padding:0!important}
.g9-bank-study-host .slot-solution{grid-column:2;grid-row:3;padding:0!important;align-self:start}
.g9-bank-study-host .slot-identity h2{font-size:1.35rem;margin-bottom:6px}
.g9-bank-study-host .g9-attempt{margin-top:18px}
.g9-bank-study-host details{background:var(--bg);border:1px solid var(--line);border-radius:10px}
.g9-bank-study-host details>summary{padding:14px 16px;font-weight:700}
.g9-bank-nav{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:10px 0 18px}
.g9-bank-position{font-weight:700;color:var(--muted)}
.g9-bank-empty{grid-column:1/-1;padding:36px;border:1px dashed var(--line);border-radius:12px;text-align:center;color:var(--muted)}
.g9-bank-disputed{border-color:#b45309!important}
.g9-bank-disputed .qb-qhead{background:rgba(180,83,9,.05)}
@media(max-width:980px){.g9-core2-bank .qb-collection-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.g9-bank-browser-results{grid-template-columns:1fr}.g9-bank-study-host>article{grid-template-columns:1fr}.g9-bank-study-host .slot-identity,.g9-bank-study-host .slot-attempt,.g9-bank-study-host .slot-support,.g9-bank-study-host .slot-solution{grid-column:1;grid-row:auto}}
@media(max-width:620px){.g9-core2-bank .qb-collection-grid{grid-template-columns:1fr}.g9-core2-bank .qb-hero{grid-template-columns:1fr}.g9-bank-browser-results .qb-qactions{align-items:flex-start;flex-direction:column}.g9-bank-browser-results .qb-id{max-width:100%}}
</style>'''

NEW_JS = r'''<script data-g9-core2-browser-v2>
(()=>{
  const DATA=window.G9_POLYNOMIALS_BANK||[];
  const $=id=>document.getElementById(id);
  const els={search:$('g9BankSearch'),family:$('g9BankFamily'),scope:$('g9BankScope'),source:$('g9BankSource'),status:$('g9BankStatus'),mode:$('g9BankMode'),count:$('g9BankCount'),results:$('g9BankResults'),study:$('g9BankStudyHost'),store:$('g9BankTemplates'),load:$('g9BankLoadMore'),reset:$('g9BankReset'),back:$('g9BankBack'),prev:$('g9BankPrev'),next:$('g9BankNext'),pos:$('g9BankPosition'),top:$('g9BankTop'),active:$('g9BankActive')};
  let limit=20,focus=null,currentStudy=null;
  const norm=v=>String(v||'').toLowerCase().replace(/[^a-z0-9±]+/g,' ').trim();
  const pretty=v=>({CORE_SYLLABUS:'Core syllabus',EXTENSION:'Extension',RELATED:'Related'}[v]||v);
  const mk=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
  function filtered(){const terms=norm(els.search.value).split(/\s+/).filter(Boolean);return DATA.filter(q=>{if(els.family.value&&q.family!==els.family.value)return false;if(els.scope.value&&q.scope!==els.scope.value)return false;if(els.source.value&&q.source!==els.source.value)return false;if(els.status.value&&q.status!==els.status.value)return false;if(terms.length){const hay=norm([q.id,q.title,q.stem,q.familyLabel,q.scope,q.source].join(' '));if(!terms.every(t=>hay.includes(t)))return false}return true})}
  function badge(text,extra=''){return mk('span','qb-badge '+extra,text)}
  function compactCard(q){const a=mk('article','qb-question'+(q.status==='DISPUTED'?' g9-bank-disputed':''));a.dataset.qid=q.id;const h=mk('header','qb-qhead'),top=mk('div','qb-qhead-top'),left=mk('div');left.append(mk('div','qb-qtitle',q.title),mk('div','qb-qsource',`${q.source} scan · ${q.status==='DISPUTED'?'needs review':'source captured'}`));const scope=mk('span','qb-diff',pretty(q.scope));scope.dataset.band=q.scope==='EXTENSION'?'D3':q.scope==='RELATED'?'D2':'D1';top.append(left,scope);h.append(top);const badges=mk('div','qb-badges');badges.append(badge(q.familyLabel));if(q.status==='DISPUTED')badges.append(badge('Disputed','trap'));h.append(badges);const body=mk('div','qb-compact-body');body.append(mk('div','qb-stem',q.stem));const actions=mk('div','qb-qactions');actions.append(mk('span','qb-id',q.id));const btn=mk('button','btn outline','Study question');btn.type='button';btn.onclick=()=>enterStudy(q.id);actions.append(btn);body.append(actions);a.append(h,body);return a}
  function familyCards(){document.querySelectorAll('[data-g9-bank-family-card]').forEach(btn=>{btn.dataset.active=String(btn.dataset.family===els.family.value);btn.onclick=()=>{els.family.value=btn.dataset.family===els.family.value?'':btn.dataset.family;limit=20;focus=null;els.mode.value='browse';render()}})}
  function activeFilters(){els.active.replaceChildren();const rows=[['family',els.family,'Family'],['scope',els.scope,'Scope'],['source',els.source,'Source'],['status',els.status,'State']];if(els.search.value)rows.unshift(['search',els.search,'Search']);for(const [key,control,label] of rows){if(!control.value)continue;const chip=mk('span','qb-chip',`${label}: ${key==='scope'?pretty(control.value):control.options?.[control.selectedIndex]?.text||control.value} `);const x=mk('button','', '×');x.type='button';x.onclick=()=>{control.value='';limit=20;focus=null;render()};chip.append(x);els.active.append(chip)}}
  function returnStudy(){if(currentStudy){els.store.append(currentStudy);currentStudy=null}els.study.replaceChildren()}
  function renderBrowse(list){returnStudy();els.results.hidden=false;els.study.hidden=true;els.results.replaceChildren();list.slice(0,limit).forEach(q=>els.results.append(compactCard(q)));if(!list.length)els.results.append(mk('div','g9-bank-empty','No canonical questions match these filters.'));els.load.hidden=list.length<=limit;els.back.hidden=els.prev.hidden=els.next.hidden=els.pos.hidden=true}
  function enterStudy(id){focus=id;els.mode.value='study';history.replaceState(null,'','#'+encodeURIComponent(id));render();document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})}
  function renderStudy(list){els.results.hidden=true;els.study.hidden=false;els.load.hidden=true;returnStudy();if(!list.length){els.study.append(mk('div','g9-bank-empty','No canonical questions match these filters.'));els.back.hidden=false;els.prev.hidden=els.next.hidden=els.pos.hidden=true;return}let idx=list.findIndex(q=>q.id===focus);if(idx<0)idx=0;focus=list[idx].id;const article=els.store.querySelector(`[id="${CSS.escape(focus)}"]`);if(article){currentStudy=article;article.hidden=false;els.study.append(article)}els.back.hidden=false;els.prev.hidden=idx===0;els.next.hidden=idx===list.length-1;els.pos.hidden=false;els.pos.textContent=`Question ${idx+1} of ${list.length}`;els.prev.onclick=()=>enterStudy(list[Math.max(0,idx-1)].id);els.next.onclick=()=>enterStudy(list[Math.min(list.length-1,idx+1)].id)}
  function render(){const list=filtered();els.count.textContent=`${list.length} of ${DATA.length} questions`;activeFilters();familyCards();if(els.mode.value==='study')renderStudy(list);else renderBrowse(list);document.body.dataset.g9BankMode=els.mode.value}
  for(const el of [els.family,els.scope,els.source,els.status,els.mode])el.addEventListener('change',()=>{limit=20;focus=null;render()});let timer=null;els.search.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>{limit=20;focus=null;render()},100)});els.load.onclick=()=>{limit+=20;render()};els.reset.onclick=()=>{els.search.value='';els.family.value='';els.scope.value='';els.source.value='';els.status.value='';els.mode.value='browse';limit=20;focus=null;history.replaceState(null,'',location.pathname);render()};els.back.onclick=()=>{els.mode.value='browse';focus=null;history.replaceState(null,'',location.pathname);render();window.scrollTo({top:0,behavior:'smooth'})};els.top.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});const hash=decodeURIComponent(location.hash.slice(1));if(hash&&DATA.some(q=>q.id===hash)){focus=hash;els.mode.value='study'}render();
})();
</script>'''


def attr(article: str, name: str) -> str:
    match = re.search(rf'\b{name}="([^"]*)"', article)
    return html.unescape(match.group(1)) if match else ""


def text_between(article: str, pattern: str) -> str:
    match = re.search(pattern, article, re.S)
    if not match:
        return ""
    raw = re.sub(r"<[^>]+>", " ", match.group(1))
    return " ".join(html.unescape(raw).split())


def main() -> int:
    text = HTML.read_text(encoding="utf-8")
    if "data-g9-core2-browser-v2" in text:
        raise SystemExit("Core2 browser v2 marker already present before polish step")

    # Remove the first browser adapter emitted by build_polynomials_core2_html.py. The
    # shared Core runtime remains; only the browser presentation is replaced.
    text = re.sub(r'<style data-g9-core2-bank>.*?</style>', '', text, count=1, flags=re.S)
    text = re.sub(r'<script data-g9-core2-bank>.*?</script>', '', text, count=1, flags=re.S)

    source_count = text.count(SOURCE_OLD)
    if source_count != EXPECTED_COUNT:
        raise SystemExit(f"expected {EXPECTED_COUNT} owner-source provenance labels, found {source_count}")
    text = text.replace(SOURCE_OLD, SOURCE_NEW)

    start_marker = '<div class="g9-bank-results" id="g9BankResults">'
    end_marker = '<button type="button" class="btn outline qb-load-more" id="g9BankLoadMore">Load more</button>'
    start = text.index(start_marker)
    end = text.index(end_marker, start) + len(end_marker)
    region = text[start:end]
    articles = re.findall(r'<article\b.*?</article>', region, re.S)
    if len(articles) != EXPECTED_COUNT:
        raise SystemExit(f"expected {EXPECTED_COUNT} rendered Core2 articles, found {len(articles)}")

    data = []
    for article in articles:
        data.append({
            "id": attr(article, "id"),
            "family": attr(article, "data-qb-family"),
            "familyLabel": attr(article, "data-qb-family-label"),
            "scope": attr(article, "data-qb-scope"),
            "status": attr(article, "data-qb-status"),
            "source": attr(article, "data-qb-source"),
            "title": text_between(article, r'<div[^>]*data-g9-block="source_identity"[^>]*>.*?<h2>(.*?)</h2>'),
            "stem": text_between(article, r'<div[^>]*data-g9-block="stem"[^>]*>(.*?)</div>'),
        })

    family_counts: dict[str, tuple[str, int]] = {}
    for question in data:
        previous = family_counts.get(question["family"], (question["familyLabel"], 0))
        family_counts[question["family"]] = (question["familyLabel"], previous[1] + 1)

    family_cards = "".join(
        f'<button type="button" class="qb-collection-card" data-g9-bank-family-card '
        f'data-family="{html.escape(ref, quote=True)}"><div><h3>{html.escape(label)}</h3>'
        f'<p>Focused source-question collection</p></div><div class="qb-card-meta">'
        f'<span>{count} questions</span><span>Polynomials</span></div></button>'
        for ref, (label, count) in family_counts.items()
    )

    hero_boundary = '</section>\n<section class="qb-browser" aria-labelledby="g9BankBrowseTitle">'
    discover = (
        '</section>\n<section class="qb-discover" aria-labelledby="g9BankDiscover">'
        '<div class="qb-section-heading"><div><p class="qb-kicker">Study collections</p>'
        '<h2 id="g9BankDiscover">Choose a problem family</h2></div></div>'
        f'<div class="qb-collection-grid">{family_cards}</div></section>\n'
        '<section class="qb-browser" aria-labelledby="g9BankBrowseTitle">'
    )
    if hero_boundary not in text:
        raise SystemExit("Core2 hero/browser boundary not found")
    text = text.replace(hero_boundary, discover, 1)

    form_boundary = '</form>\n  <div class="g9-bank-nav">'
    if form_boundary not in text:
        raise SystemExit("Core2 filter/navigation boundary not found")
    text = text.replace(
        form_boundary,
        '</form>\n  <div class="qb-active-filters" id="g9BankActive" aria-label="Active filters"></div>\n  <div class="g9-bank-nav">',
        1,
    )

    data_json = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    replacement = (
        f'<script>window.G9_POLYNOMIALS_BANK={data_json};</script>'
        '<div id="g9BankResults" class="qb-results g9-bank-browser-results"></div>'
        '<div id="g9BankStudyHost" class="g9-bank-study-host" hidden></div>'
        '<div id="g9BankTemplates" hidden>' + "".join(articles) + '</div>'
        '<button type="button" class="btn outline qb-load-more" id="g9BankLoadMore" hidden>Load more</button>'
    )
    text = text[:start] + replacement + text[end:]
    text = text.replace("</head>", NEW_CSS + "</head>", 1)
    text = text.replace("</body>", NEW_JS + "</body>", 1)
    HTML.write_text(text, encoding="utf-8")

    report = json.loads(REPORT.read_text(encoding="utf-8"))
    browser = report.setdefault("browser_ui", {})
    browser.update({
        "architecture": "compact_cards_plus_hidden_study_templates",
        "browse_card_structure": "question-bank compactCard analogue",
        "study_workspace": "two-column Core2 article",
        "source_provenance_label": "Owner-supplied exact scan",
        "visible_card_metadata": ["source_member", "family", "scope", "disputed_state"],
        "family_collection_cards": len(family_counts),
    })
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(json.dumps({
        "passed": True,
        "questions": len(data),
        "family_collection_cards": len(family_counts),
        "architecture": browser["architecture"],
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
