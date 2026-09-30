"""Resolve governed LOCAL implementations for the existing EXPLORE delivery path.

The canonical target remains academic authority. These derived registrations connect
existing implementation sources to actual consumers; they never promote LOCAL to SHARED.
"""
from pathlib import Path
from Shared.contracts import load
from Shared.tools import interaction_local_runtime, interaction_reuse_binding

REPO = Path(__file__).resolve().parents[2]


def resolve(subject, target, *, repo=REPO):
    # Subject names come from a validated request, but keep file discovery scoped too.
    directory = (repo / subject / "interactions").resolve()
    if not directory.is_relative_to(repo.resolve()):
        return None
    candidates = []
    for path in sorted(directory.glob("*.local.json")):
        try:
            source = load(path)
        except (ValueError, OSError):
            continue
        if source.get("microtopic_ref") == target:
            candidates.append(interaction_local_runtime.compile_source(path, repo=repo))
    for path in sorted(directory.glob("*.reuse-consumer.json")):
        try:
            source = load(path)
        except (ValueError, OSError):
            continue
        if source.get("consumer_ref") != target:
            continue
        consumer = interaction_reuse_binding.compile_source(path, repo=repo)
        local = interaction_local_runtime.compile_source(Path(consumer["implementation_source_ref"]), repo=repo)
        local["consumer_binding"] = consumer
        candidates.append(local)
    if len(candidates) > 1:
        raise ValueError("LOCAL_DELIVERY_TARGET_AMBIGUOUS: " + str(target))
    if not candidates:
        return None
    record = candidates[0]
    runtime = record["runtime"]
    record["visual_target"] = {
        "resource_ref": runtime["activity_ref"], "portable_package_ref": runtime["package_ref"],
        "locator": None, "authority": "DERIVED_LOCAL_INTERACTION_RUNTIME_ONLY",
        "availability": {k: "READY" for k in ("resource", "portable_package", "standalone")},
    }
    return record
