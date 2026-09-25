#!/usr/bin/env python3
"""Build checked-in prompt examples from the Core Prompt Composer.

Examples are generated from owner-input fixtures through the same schema/template/composer
path used by production prompt bundles. They are review artifacts, not hand-authored prompts.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
if __package__ in (None, ""):
    sys.path.insert(0, str(REPO))

from Shared.contracts import load  # noqa: E402
from Shared.tools import prompt_composer  # noqa: E402

CONFIG = REPO / "tests" / "fixtures" / "prompt-composer" / "generated-examples.json"


def _examples(repo: Path = REPO) -> list[dict]:
    rows = load(repo / CONFIG.relative_to(REPO))
    if not isinstance(rows, list):
        raise ValueError("prompt example config must be an array")
    return rows


def _render_one(row: dict, repo: Path = REPO) -> bytes:
    fixture = repo / row["fixture"]
    doc = load(fixture)
    result = prompt_composer.compose(
        doc,
        repo=repo,
        repository_basis=doc.get("repository_basis"),
    )
    return result["agent_prompt"].encode("utf-8")


def rendered_file(repo: Path = REPO) -> dict[str, bytes]:
    return {
        row["output"]: _render_one(row, repo)
        for row in _examples(repo)
    }


def write(repo: Path = REPO) -> None:
    for relative, content in rendered_file(repo).items():
        target = repo / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(content)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    intended = rendered_file()
    if args.check:
        stale = [
            path for path, content in intended.items()
            if not (REPO / path).is_file() or (REPO / path).read_bytes() != content
        ]
        if stale:
            for path in stale:
                print(f"generated prompt example is stale: {path}")
            print("Regenerate with: python3 Shared/tools/build_prompt_examples.py")
            return 1
        print(f"prompt examples up to date: {len(intended)}")
        return 0
    write()
    for path in intended:
        print(f"wrote {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
