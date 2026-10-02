"""Write the site search index: the index file, the script a page loads, and the manifest, from what the repository holds now.

Shared by the builder's command line (Shared/tools/build_search_index.py) and by accepting a product (Shared/tools/accept_product.py), which rebuilds the index before it
writes the Pages mirror, so that the pages it publishes are found when they are published (the blueprint's PUBLICATION_REINDEXES).
"""
from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

from Shared.assurance import contract
from Shared.search import site_index

GENERATOR = {"name": "build_search_index", "version": "2.1.0"}


def sha(text: str) -> str:
    return "sha256:" + hashlib.sha256(contract.normalise_text(text.encode("utf-8"))).hexdigest()


def render(built: site_index.Built) -> tuple[str, str, dict]:
    """(index text, script text, manifest) for a built index; each is checked against its schema."""
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


def write(index_text: str, script_text: str, manifest: dict, targets: dict[str, Path]) -> None:
    for key, text in (("index", index_text), ("script", script_text), ("manifest", json.dumps(manifest, indent=1, sort_keys=True) + "\n")):
        targets[key].parent.mkdir(parents=True, exist_ok=True)
        targets[key].write_text(text, encoding="utf-8", newline="\n")


def rebuild(repo: Path, config: dict | None = None) -> dict:
    """Rebuild the committed index from the repository as it is, at the places the route table names. Returns the manifest."""
    config = config or site_index.load_config()
    roots = [repo / d for d in config["library_dirs"] if (repo / d).exists()]
    built = site_index.build(repo, roots, config)
    index_text, script_text, manifest = render(built)
    write(index_text, script_text, manifest, {k: repo / v for k, v in config["outputs"].items()})
    return manifest
