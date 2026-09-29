#!/usr/bin/env python3
"""Render the complete #350 Polynomials Core2 question bank with the sole shared renderer."""
from __future__ import annotations

import json
import sys
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


def main() -> int:
    expected = write_manifest()
    ctx = render_core.context(MANIFEST)
    selected = [row["id"] for row in ctx.selection_rows["core2"]]
    if selected != expected:
        raise SystemExit("renderer Core2 selection differs from the deterministic full-bank manifest")

    digest = render_core.render_digest(ctx)
    html = render_core.page(ctx, "CORE2", "PAGES", digest)

    if 'data-core="CORE2"' not in html:
        raise SystemExit("renderer did not produce a CORE2 page")
    rendered_ids = [qid for qid in selected if f'id="{qid}"' in html]
    if len(rendered_ids) != EXPECTED_COUNT:
        missing = [qid for qid in selected if qid not in rendered_ids]
        raise SystemExit(f"render missing {len(missing)} Core2 question(s): {missing[:10]}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_HTML.write_text(html, encoding="utf-8")

    report = {
        "schema": "polynomials-core2-render/v1",
        "product_id": ctx.manifest["product_id"],
        "manifest": MANIFEST.relative_to(REPO).as_posix(),
        "renderer": render_core.RENDERER_VERSION,
        "render_digest": digest,
        "selected_core2_count": len(selected),
        "selected_core2": selected,
        "hard_priority_refs": HARD_PRIORITY_REFS,
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
        "core2_gaps": len(report["core2_gaps"]),
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
