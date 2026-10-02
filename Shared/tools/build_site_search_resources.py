#!/usr/bin/env python3
"""Build the single global static-resource search catalog deterministically."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SOURCE = REPO / "Shared/search/site-search-resources.v1.json"
OUTPUT = REPO / "public/data/site-search-resources.js"
PREFIX = "window.GRADE9_SITE_SEARCH_RESOURCES="


def load_resources() -> list[dict[str, object]]:
    payload = json.loads(SOURCE.read_text(encoding="utf-8"))
    if payload.get("schema_version") != 1 or payload.get("scope") != "global":
        raise ValueError("site search registry must be schema_version=1 and scope=global")
    resources = payload.get("resources")
    if not isinstance(resources, list) or not resources:
        raise ValueError("site search registry must contain resources")

    seen_paths: set[str] = set()
    for index, resource in enumerate(resources):
        if not isinstance(resource, dict):
            raise ValueError(f"resource {index} must be an object")
        for key in ("title", "path", "kind", "keywords"):
            if key not in resource:
                raise ValueError(f"resource {index} missing {key}")
        title = resource["title"]
        path = resource["path"]
        kind = resource["kind"]
        keywords = resource["keywords"]
        if not isinstance(title, str) or not title.strip():
            raise ValueError(f"resource {index} has invalid title")
        if not isinstance(path, str) or not path.strip() or path.startswith("/"):
            raise ValueError(f"resource {index} has invalid path")
        if path in seen_paths:
            raise ValueError(f"duplicate global search path: {path}")
        seen_paths.add(path)
        if not isinstance(kind, str) or not kind.strip():
            raise ValueError(f"resource {index} has invalid kind")
        if not isinstance(keywords, list) or not keywords or any(
            not isinstance(value, str) or not value.strip() for value in keywords
        ):
            raise ValueError(f"resource {index} has invalid keywords")
    return resources


def render(resources: list[dict[str, object]]) -> str:
    return PREFIX + json.dumps(resources, ensure_ascii=False, separators=(",", ":")) + ";\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if output is stale")
    args = parser.parse_args()

    rendered = render(load_resources())
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != rendered:
            raise SystemExit("global site-search resource projection is stale")
        print("GLOBAL_SITE_SEARCH_RESOURCES: PASS")
        return 0

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(rendered, encoding="utf-8")
    print(f"GLOBAL_SITE_SEARCH_RESOURCES: wrote {len(load_resources())} resources")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
