#!/usr/bin/env python3
"""Render the #350 Polynomials hard-first Core2 learner page with the sole shared renderer."""
from __future__ import annotations

import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO))

from Shared.tools import render_core  # noqa: E402

MANIFEST = REPO / "products/mathematics/polynomials.manifest.json"
OUT_DIR = REPO / "public/mathematics/polynomials"
OUT_HTML = OUT_DIR / "core2.html"
OUT_REPORT = OUT_DIR / "core2.render.json"

EXPECTED = [
    "Q-MAT-POLY-M2-P06-HIGHER-ORDER-THINKING-SKILLS-HOTS-16",
    "Q-MAT-POLY-M2-P09-ARCHIVE-CORNER-22",
    "Q-MAT-POLY-M2-P03-ASSESSMENT-CORNER-MULTIPLE-CORRECT-TYPE-QUESTIONS-21",
]


def main() -> int:
    ctx = render_core.context(MANIFEST)
    selected = [row["id"] for row in ctx.selection_rows["core2"]]
    if selected != EXPECTED:
        raise SystemExit(f"unexpected Core2 selection: {selected}")

    digest = render_core.render_digest(ctx)
    html = render_core.page(ctx, "CORE2", "PAGES", digest)

    if 'data-core="CORE2"' not in html:
        raise SystemExit("renderer did not produce a CORE2 page")
    for question_id in EXPECTED:
        if question_id not in html:
            raise SystemExit(f"render missing selected question {question_id}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_HTML.write_text(html, encoding="utf-8")

    report = {
        "schema": "polynomials-core2-render/v1",
        "product_id": ctx.manifest["product_id"],
        "manifest": MANIFEST.relative_to(REPO).as_posix(),
        "renderer": render_core.RENDERER_VERSION,
        "render_digest": digest,
        "selected_core2": EXPECTED,
        "core2_gaps": [row for row in ctx.gaps if row.get("core") == "CORE2"],
    }
    OUT_REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(json.dumps({
        "passed": True,
        "html": OUT_HTML.relative_to(REPO).as_posix(),
        "report": OUT_REPORT.relative_to(REPO).as_posix(),
        "render_digest": digest,
        "selected": len(EXPECTED),
        "core2_gaps": len(report["core2_gaps"]),
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
