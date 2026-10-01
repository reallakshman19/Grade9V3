#!/usr/bin/env python3
"""Synchronize learner-facing Chemistry Core1A standalones from render_core/2.

The governed package/manifests are the source of truth. The committed standalone
HTML files are deterministic SINGLE_FILE convenience snapshots for review; they
must never be hand-authored or used as a second academic source.
"""
from __future__ import annotations

import argparse
import hashlib
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
RENDERER = REPO / "Shared/tools/render_core.py"
MAPPINGS = {
    "behaviour-of-gases": REPO / "standalone/core1a-chemistry-behaviour-of-gases-tablet.html",
    "chemical-bonding": REPO / "standalone/core1a-chemistry-chemical-bonding-tablet.html",
    "redox-reactions": REPO / "standalone/core1a-chemistry-redox-reactions-tablet.html",
    "some-basic-concepts": REPO / "standalone/core1a-chemistry-some-basic-concepts-tablet.html",
}
WITHDRAWN_CORE2 = (
    REPO / "standalone/core2-chemistry-chemical-bonding-tablet.html",
    REPO / "standalone/core2-chemistry-redox-reactions-tablet.html",
    REPO / "standalone/core2-chemistry-some-basic-concepts-tablet.html",
)


def render(slug: str, root: Path) -> bytes:
    out = root / slug
    subprocess.run(
        [
            sys.executable,
            str(RENDERER),
            "build",
            "--manifest",
            str(REPO / f"products/chemistry/{slug}.manifest.json"),
            "--out",
            str(out),
            "--mode",
            "SINGLE_FILE",
        ],
        cwd=REPO,
        check=True,
    )
    text = (out / "product.html").read_text(encoding="utf-8")
    # The manifest navigation is authored for product build directories. These
    # committed convenience snapshots live one level below repository root.
    text = text.replace('../../../public/', '../public/')
    validate(slug, text)
    return text.encode("utf-8")


def validate(slug: str, text: str) -> None:
    required = (
        'data-g9-role="CORE1A"',
        'data-g9-mode="SINGLE_FILE"',
        'data-blueprint-ref="BP-CORE1A-CONSTRUCTION@1.4.0"',
        'data-g9-component="EQUATIONS"',
        'data-g9-component="STAGED_VISUAL"',
        'data-g9-component="QUICK_CHECK"',
    )
    missing = [marker for marker in required if marker not in text]
    if missing:
        raise SystemExit(f"{slug}: generated page missing blueprint markers: {missing}")
    if len(re.findall(r'<g\b[^>]*data-g9-stage-id="', text)) != 9:
        raise SystemExit(f"{slug}: expected 9 authored visual stages (3 per unit)")
    roles = re.findall(r'<li data-g9-triad-role="(CHECK|APPLY|CONNECT)"', text)
    if roles.count("CHECK") != 3 or roles.count("APPLY") != 3 or roles.count("CONNECT") != 3:
        raise SystemExit(f"{slug}: expected three CHECK/APPLY/CONNECT triads")
    if text.count("data-g9-equation-matrix") != 3:
        raise SystemExit(f"{slug}: expected one equation matrix per construction unit")
    if "Draft audit hold:" in text or "NCERT Try the question" in text:
        raise SystemExit(f"{slug}: legacy standalone/audit prose escaped into learner page")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    present_core2 = [str(path.relative_to(REPO)) for path in WITHDRAWN_CORE2 if path.exists()]
    if present_core2:
        raise SystemExit(
            "Ungoverned Core2 learner HTML must stay withdrawn until exact source custody exists: "
            + ", ".join(present_core2)
        )

    with tempfile.TemporaryDirectory(prefix="chemistry-blueprint-v2-") as temp:
        root = Path(temp)
        intended = {slug: render(slug, root) for slug in MAPPINGS}

    if args.check:
        failures = []
        for slug, target in MAPPINGS.items():
            if not target.is_file():
                failures.append(f"missing {target.relative_to(REPO)}")
                continue
            actual = target.read_bytes()
            if actual != intended[slug]:
                failures.append(
                    f"stale {target.relative_to(REPO)} "
                    f"(expected sha256:{hashlib.sha256(intended[slug]).hexdigest()}, "
                    f"got sha256:{hashlib.sha256(actual).hexdigest()})"
                )
        if failures:
            print("\n".join(failures))
            print("Regenerate with: python3 Chemistry/tools/sync_blueprint_pages.py")
            return 1
        print("Chemistry Core1A standalone snapshots match render_core/2 blueprint-v2 output.")
        return 0

    for slug, target in MAPPINGS.items():
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(intended[slug])
        print(f"wrote {target.relative_to(REPO)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
