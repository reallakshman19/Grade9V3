#!/usr/bin/env python3
"""Deterministic presentation polish for the #350 Polynomials Core2 browser.

This does not author or transform academic question content. It only refines the browser
presentation after render_core.py + build_polynomials_core2_html.py have produced the
canonical 172-question page.
"""
from __future__ import annotations

import json
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
HTML = REPO / "public/mathematics/polynomials/core2.html"
REPORT = REPO / "public/mathematics/polynomials/core2.render.json"
EXPECTED_COUNT = 172
MARKER = "data-g9-core2-browser-polish"

SOURCE_OLD = '<p class="g9-prov">Source unverified</p>'
SOURCE_NEW = '<p class="g9-prov">Owner-supplied exact scan</p>'

POLISH_CSS = r'''<style data-g9-core2-browser-polish>
.g9-bank-card-action{justify-content:flex-start!important;align-items:center;flex-wrap:wrap}
.g9-bank-card-action [data-g9-bank-study]{margin-left:auto}
body[data-g9-bank-mode="study"] [data-g9-bank-study]{display:none!important}
.g9-bank-card-action .g9-bank-family-chip{max-width:48ch;white-space:normal}
.g9-bank-card-action .g9-bank-disputed-chip{border-color:#b45309;color:#92400e}
</style>'''

POLISH_JS = r'''<script data-g9-core2-browser-polish>
(()=>{
  const prettyScope=value=>({CORE_SYLLABUS:'Core syllabus',EXTENSION:'Extension',RELATED:'Related'}[value]||value);
  const chip=(text,extra='')=>{
    const el=document.createElement('span');
    el.className='g9-bank-source-chip '+extra;
    el.textContent=text;
    return el;
  };
  document.querySelectorAll('article[data-g9-unit]').forEach(article=>{
    const bar=article.querySelector('.g9-bank-card-action');
    if(!bar||bar.dataset.g9Polished)return;
    bar.dataset.g9Polished='1';
    const study=bar.querySelector('[data-g9-bank-study]');
    const source=bar.querySelector('.g9-bank-source-chip');
    if(source&&article.dataset.qbSource)source.textContent=article.dataset.qbSource+' scan';
    const inserts=[];
    if(article.dataset.qbFamilyLabel)inserts.push(chip(article.dataset.qbFamilyLabel,'g9-bank-family-chip'));
    if(article.dataset.qbScope)inserts.push(chip(prettyScope(article.dataset.qbScope),'g9-bank-scope-chip'));
    if(article.dataset.qbStatus==='DISPUTED')inserts.push(chip('Disputed','g9-bank-disputed-chip'));
    inserts.forEach(node=>bar.insertBefore(node,study||null));
  });
})();
</script>'''


def main() -> int:
    text = HTML.read_text(encoding="utf-8")
    if MARKER in text:
        raise SystemExit("Core2 browser polish marker already present before polish step")
    count = text.count(SOURCE_OLD)
    if count != EXPECTED_COUNT:
        raise SystemExit(f"expected {EXPECTED_COUNT} owner-source provenance labels, found {count}")
    text = text.replace(SOURCE_OLD, SOURCE_NEW)
    text = text.replace("</head>", POLISH_CSS + "</head>", 1)
    text = text.replace("</body>", POLISH_JS + "</body>", 1)
    HTML.write_text(text, encoding="utf-8")

    report = json.loads(REPORT.read_text(encoding="utf-8"))
    browser = report.setdefault("browser_ui", {})
    browser["source_provenance_label"] = "Owner-supplied exact scan"
    browser["visible_card_metadata"] = ["source_member", "family", "scope", "disputed_state"]
    browser["study_mode_hides_redundant_study_action"] = True
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(json.dumps({
        "passed": True,
        "provenance_labels_replaced": count,
        "visible_card_metadata": browser["visible_card_metadata"],
        "study_action_hidden_in_study_mode": True,
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
