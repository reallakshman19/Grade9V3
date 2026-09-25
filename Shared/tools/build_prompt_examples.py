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

FIXTURE = REPO / "tests" / "fixtures" / "prompt-composer" / "projectile-stress-set.json"
OUT = REPO / "docs" / "prompts" / "projectile-stress-set.generated.md"


def render(repo: Path = REPO) -> bytes:
    fixture = repo / FIXTURE.relative_to(REPO)
    doc = load(fixture)
    result = prompt_composer.compose(
        doc,
        repo=repo,
        repository_basis=doc.get("repository_basis"),
    )
    return result["agent_prompt"].encode("utf-8")


def rendered_file(repo: Path = REPO) -> dict[str, bytes]:
    return {OUT.relative_to(REPO).as_posix(): render(repo)}


def write(repo: Path = REPO) -> None:
    target = repo / OUT.relative_to(REPO)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(render(repo))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    intended = render()
    if args.check:
        if not OUT.is_file() or OUT.read_bytes() != intended:
            print(f"generated prompt example is stale: {OUT.relative_to(REPO)}")
            print("Regenerate with: python3 Shared/tools/build_prompt_examples.py")
            return 1
        print(f"prompt example up to date: {OUT.relative_to(REPO)}")
        return 0
    write()
    print(f"wrote {OUT.relative_to(REPO)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
