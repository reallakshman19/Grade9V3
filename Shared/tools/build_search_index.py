#!/usr/bin/env python3
"""Build the site search index: pages, topics, questions and hints, each with a route that exists, and the manifest that says what it was built from.

    python3 Shared/tools/build_search_index.py --library-dirs Physics/library Chemistry/library Mathematics/library \\
        --output-index public/data/search-index.v2.json --output-manifest public/data/search-index-manifest.v2.json --output-script public/data/search-index.v2.js

The index is a projection. Its manifest names the inputs it read by digest, the questions it holds and the ones no page shows (unrouted), and the digest of the index
itself, so that verify_search_index.py can rebuild it and say whether it is current, complete and unaltered. An input that does not parse stops the build: an index
built over what could be read would be missing routes and say nothing. Read Shared/search/site_index.py for what is in it and why.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
if str(REPO) not in sys.path:
    sys.path.insert(0, str(REPO))

from Shared.assurance import contract  # noqa: E402
from Shared.search import site_index  # noqa: E402

GENERATOR = {"name": "build_search_index", "version": "2.0.0"}


def sha(text: str) -> str:
    return "sha256:" + hashlib.sha256(contract.normalise_text(text.encode("utf-8"))).hexdigest()


def render(built: site_index.Built) -> tuple[str, str, dict]:
    """(index text, script text, manifest) for a built index."""
    contract.require_valid("search-index", built.index)
    index_text = json.dumps(built.index, indent=1, sort_keys=True, ensure_ascii=False) + "\n"
    script_text = site_index.wrapper(built.index)
    manifest = {
        "schema": "search-index-manifest/v2",
        "index_version": "2",
        "generator": GENERATOR,
        "inputs": built.inputs,
        "record_count": len(built.index["documents"]),
        "counts": built.index["counts"],
        "questions": built.questions,
        "index_digest": sha(index_text),
        "script_digest": sha(script_text),
        "generated_at": datetime.now(timezone.utc).replace(tzinfo=None, microsecond=0).isoformat() + "Z",
    }
    return index_text, script_text, contract.require_valid("search-index-manifest", manifest)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--repo", default=str(REPO))
    parser.add_argument("--library-dirs", nargs="+", required=True)
    parser.add_argument("--output-index", required=True)
    parser.add_argument("--output-manifest", required=True)
    parser.add_argument("--output-script", required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)

    repo = Path(args.repo).resolve()
    roots = [(repo / d) if not Path(d).is_absolute() else Path(d) for d in args.library_dirs]
    built = site_index.build(repo, [r for r in roots if r.exists()])
    index_text, script_text, manifest = render(built)
    counts = ", ".join(f"{n} {k.lower()}" for k, n in built.index["counts"].items())
    unrouted = len(built.questions["unrouted"])
    if args.dry_run:
        print(f"Would write {manifest['record_count']} documents ({counts}); {unrouted} canonical question(s) have no page to open")
        return 0
    for target, text in ((args.output_index, index_text), (args.output_script, script_text), (args.output_manifest, json.dumps(manifest, indent=1, sort_keys=True) + "\n")):
        path = Path(target) if Path(target).is_absolute() else repo / target
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8", newline="\n")
    print(f"Indexed {manifest['record_count']} documents ({counts}); {unrouted} of {len(built.questions['canonical'])} canonical question(s) have no page to open")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
