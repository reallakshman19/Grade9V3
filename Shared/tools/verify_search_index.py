#!/usr/bin/env python3
"""Verify the committed site search index: current, complete, unaltered, and every result opens something that exists.

  SEARCH_MEMBERSHIP     the index is what its inputs give. It is rebuilt from the library, the pages, the Core learning data, the Question Bank data and the route table,
                        and compared: a document that is missing, one that should not be there, one that was edited, an input that changed since (STALE_INDEX), and any
                        document whose route does not open a file, a Core projection or a bank question that exists (BROKEN_ROUTE, checked on its own, not by the builder).
                        Canonical questions that no page shows are reported (UNROUTED_QUESTIONS, advisory): the distance between the library and what a learner can open.
  SEARCH_RETRIEVABILITY the index file and the script a page loads are the ones the manifest describes, and the script is the index.

Each is written as evidence about the PROJECTION `search`, bound to the digest of the index file, outside the tree it judges. With --enforce the exit status is 1
unless both PASS: a stale index is not a pass with a caveat.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
if str(REPO) not in sys.path:
    sys.path.insert(0, str(REPO))

from Shared.assurance import contract  # noqa: E402
from Shared.assurance.evidence import finding, make_evidence, write_evidence  # noqa: E402
from Shared.contracts import ContractError  # noqa: E402
from Shared.search import site_index  # noqa: E402

PRODUCER = "verify_search_index"
VERSION = "2.0.0"
EXAMPLES = 20


def sha(data: bytes) -> str:
    return "sha256:" + hashlib.sha256(contract.normalise_text(data)).hexdigest()


def verify(repo: Path, index_path: Path, manifest_path: Path, script_path: Path, library_dirs: list[Path]) -> dict:
    """{SEARCH_MEMBERSHIP: findings, SEARCH_RETRIEVABILITY: findings, digest}."""
    index_bytes = index_path.read_bytes()
    digest = sha(index_bytes)
    membership: list[dict] = []
    retrievability: list[dict] = []
    try:
        manifest = contract.require_valid("search-index-manifest", json.loads(manifest_path.read_text(encoding="utf-8")))
        index = contract.require_valid("search-index", json.loads(index_bytes.decode("utf-8")))
    except (ValueError, contract.ContractViolation) as exc:
        problem = finding("INDEX_OR_MANIFEST_INVALID", "S1", "search", f"the index or its manifest does not satisfy its schema: {exc}"[:300])
        return {"SEARCH_MEMBERSHIP": [problem], "SEARCH_RETRIEVABILITY": [problem], "digest": digest}

    config = site_index.load_config()
    built = site_index.build(repo, library_dirs, config)
    have = {d["id"]: d for d in index["documents"]}
    want = {d["id"]: d for d in built.index["documents"]}
    missing, phantom = sorted(want.keys() - have.keys()), sorted(have.keys() - want.keys())
    edited = sorted(i for i in want.keys() & have.keys() if want[i] != have[i])
    if missing:
        membership.append(finding("MISSING_FROM_INDEX", "S1", missing[0], f"{len(missing)} document(s) the inputs give are not in the index", evidence={"ids": missing[:EXAMPLES]}))
    if phantom:
        membership.append(finding("PHANTOM_IN_INDEX", "S1", phantom[0], f"{len(phantom)} document(s) in the index are not given by the inputs", evidence={"ids": phantom[:EXAMPLES]}))
    if edited:
        membership.append(finding("INDEX_DIFFERS", "S1", edited[0], f"{len(edited)} document(s) are not what the inputs give", evidence={"ids": edited[:EXAMPLES]}))
    changed = sorted(k for k, v in built.inputs.items() if manifest["inputs"].get(k) != v)
    if changed:
        membership.append(finding("STALE_INDEX", "S1", "search", f"built from different inputs than there are now ({', '.join(changed)}); rebuild it with build_search_index.py"))
    if manifest["questions"] != built.questions:
        membership.append(finding("QUESTIONS_DIFFER", "S1", "search", "the manifest's lists of canonical, routed and unrouted questions are not what the inputs give"))

    core_ids = {p["id"] for p in site_index.read_js_object(repo / config["site_root"] / config["core_learning"]["data"]).get("core_projections", [])}
    bank_ids = {q["id"] for q in site_index.read_js_object(repo / config["site_root"] / config["question_bank"]["data"]).get("questions", [])}
    broken = [(d["id"], why) for d in index["documents"] if (why := site_index.resolve_url(repo, d["url"], config, core_ids, bank_ids))]
    if broken:
        membership.append(finding("BROKEN_ROUTE", "S1", broken[0][0], f"{len(broken)} result(s) open nothing: {broken[0][1]}", evidence={"ids": [b[0] for b in broken[:EXAMPLES]]}))
    unrouted = built.questions["unrouted"]
    if unrouted:
        membership.append(finding("UNROUTED_QUESTIONS", "S3", "search", f"{len(unrouted)} of {len(built.questions['canonical'])} canonical question(s) are shown by no page of the site, "
                                  "so a learner cannot open them and they are not search results", evidence={"ids": unrouted[:EXAMPLES]}))

    if digest != manifest["index_digest"]:
        retrievability.append(finding("INDEX_DIGEST_MISMATCH", "S1", "search", "the index file is not the one its manifest describes"))
    if not script_path.is_file():
        retrievability.append(finding("SCRIPT_MISSING", "S1", "search", f"{script_path.name} is not there: a page opened from a file cannot load the index"))
    else:
        script = script_path.read_bytes()
        if sha(script) != manifest["script_digest"]:
            retrievability.append(finding("SCRIPT_DIGEST_MISMATCH", "S1", "search", "the script is not the one its manifest describes"))
        if script.decode("utf-8") != site_index.wrapper(index):
            retrievability.append(finding("SCRIPT_NOT_THE_INDEX", "S1", "search", "the script a page loads is not the index file"))
    return {"SEARCH_MEMBERSHIP": membership, "SEARCH_RETRIEVABILITY": retrievability, "digest": digest}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--repo", default=str(REPO))
    parser.add_argument("--index", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--script", required=True)
    parser.add_argument("--library-dirs", nargs="+", required=True)
    parser.add_argument("--evidence-dir", default="build/assurance/evidence")
    parser.add_argument("--enforce", action="store_true")
    args = parser.parse_args(argv)

    repo = Path(args.repo).resolve()
    resolve = lambda p: Path(p) if Path(p).is_absolute() else repo / p            # noqa: E731
    index_path, manifest_path, script_path = resolve(args.index), resolve(args.manifest), resolve(args.script)
    if not index_path.is_file() or not manifest_path.is_file():
        print("Missing index or manifest file.")
        return 1 if args.enforce else 0
    try:
        result = verify(repo, index_path, manifest_path, script_path, [r for r in map(resolve, args.library_dirs) if r.exists()])
    except ContractError as exc:                          # an input that does not parse: nothing can be said about membership
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    outcomes = {}
    for assurance_type in ("SEARCH_MEMBERSHIP", "SEARCH_RETRIEVABILITY"):
        found = result[assurance_type]
        outcomes[assurance_type] = "FAIL" if any(f["severity"] in ("S0", "S1", "S2") for f in found) else "PASS"
        record = make_evidence(assurance_type, "PROJECTION", "search", outcomes[assurance_type], PRODUCER, VERSION, findings=found,
                               subject_digest=result["digest"], configuration={"library_dirs": sorted(Path(d).as_posix() for d in args.library_dirs)})
        write_evidence(record, resolve(args.evidence_dir) / f"{record['evidence_id']}.json")
    print("=== Search Index Verification ===")
    for assurance_type, outcome in outcomes.items():
        print(f"{assurance_type}: {outcome}")
        for f in result[assurance_type]:
            print(f"  {f['severity']} {f['code']}: {f['message']}")
    return 1 if (args.enforce and "FAIL" in outcomes.values()) else 0


if __name__ == "__main__":
    raise SystemExit(main())
