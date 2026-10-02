#!/usr/bin/env python3
"""Build the site search index: pages, topics, questions and hints, each with a route that exists, and the manifest that says what it was built from.

    python3 Shared/tools/build_search_index.py                 # at the places, and from the library directories, the route table names

The index is a projection. Its manifest names the inputs it read by digest, the questions it holds and the ones no page shows (unrouted), and the digest of the index
itself, so that verify_search_index.py can rebuild it and say whether it is current, complete and unaltered. An input that does not parse stops the build: an index
built over what could be read would be missing routes and say nothing. Read Shared/search/site_index.py for what is in it and why; the blueprint's search_policy
(Shared/web/interactive-page-blueprints.v1.json) is what it is held to. Run this when a page is added.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
if str(REPO) not in sys.path:
    sys.path.insert(0, str(REPO))

from Shared.search import publish, site_index  # noqa: E402


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--repo", default=str(REPO))
    parser.add_argument("--library-dirs", nargs="+", help="default: the route table's library_dirs")
    parser.add_argument("--output-index", help="default: the route table's outputs.index")
    parser.add_argument("--output-manifest", help="default: the route table's outputs.manifest")
    parser.add_argument("--output-script", help="default: the route table's outputs.script")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)

    repo = Path(args.repo).resolve()
    config = site_index.load_config()
    resolve = lambda p: Path(p) if Path(p).is_absolute() else repo / p            # noqa: E731
    roots = [resolve(d) for d in (args.library_dirs or config["library_dirs"])]
    targets = {k: resolve(getattr(args, f"output_{k}") or config["outputs"][k]) for k in ("index", "manifest", "script")}
    built = site_index.build(repo, [r for r in roots if r.exists()], config)
    index_text, script_text, manifest = publish.render(built)
    counts = ", ".join(f"{n} {k.lower()}" for k, n in built.index["counts"].items())
    unrouted = len(built.questions["unrouted"])
    if args.dry_run:
        print(f"Would write {manifest['record_count']} documents ({counts}); {unrouted} canonical question(s) have no page to open")
        return 0
    publish.write(index_text, script_text, manifest, targets)
    print(f"Indexed {manifest['record_count']} documents ({counts}); {unrouted} of {len(built.questions['canonical'])} canonical question(s) have no page to open")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
