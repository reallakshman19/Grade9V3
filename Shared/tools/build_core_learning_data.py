#!/usr/bin/env python3
"""Generate learner CoreProjection rows from canonical compiler output."""
from __future__ import annotations

import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
if str(REPO) not in sys.path:
    sys.path.insert(0, str(REPO))

from Shared.contracts import ContractError
from Shared.library.compile_inputs import compile_bucket
from Shared.library.resolve import build_index, load_packages
from Shared.tools.core_learning_projection_adapter import adapt_compiled_bucket_with_status
from Shared.tools import build_portable_workbench

OUT = REPO / "public" / "core-learning" / "data.js"


def subjects() -> list[str]:
    return sorted(p.parent.parent.name for p in REPO.glob("*/adapter/CoreContracts.json"))


def _subject_rows(subject: str) -> tuple[list[dict], list[dict]]:
    paths = sorted((REPO / subject / "library").glob("*.json"))
    if not paths:
        return [], []
    records = build_index(load_packages(paths))
    bucket_ids = sorted(
        row["id"]
        for row in records.values()
        if isinstance(row, dict) and row.get("_collection") == "buckets"
    )
    rows = []
    availability = []
    for bucket_id in bucket_ids:
        try:
            compiled = compile_bucket(
                records,
                bucket_id,
                topic_id=bucket_id,
                title=records[bucket_id]["title"],
                subject=subject,
                practice_control={"mode": "DESIGN_PREVIEW", "purpose": "PRACTICE"},
            )
        except ContractError as exc:
            availability.append({
                "subject": subject,
                "bucket_ref": bucket_id,
                "status": "UNSUPPORTED",
                "code": exc.code,
                "detail": exc.detail,
                "projection_refs": [],
            })
            continue
        bucket_rows, findings = adapt_compiled_bucket_with_status(compiled, records, subject=subject)
        rows.extend(bucket_rows)
        first = findings[0] if findings else None
        availability.append({
            "subject": subject,
            "bucket_ref": bucket_id,
            "status": "AVAILABLE" if bucket_rows else "UNSUPPORTED",
            "code": first["code"] if first else None,
            "detail": first["detail"] if first else None,
            "findings": findings,
            "projection_refs": [row["id"] for row in bucket_rows],
        })
    return rows, availability


def _portable_workbench_bindings() -> tuple[dict[str, dict], dict]:
    """Index canonical portable packages by exact representation identity.

    Fixture/noncanonical portable packages are deliberately excluded. The Core learner
    provider may bind only a canonical package that names exactly one representation,
    and duplicate representation ownership fails closed instead of picking a winner.
    """
    scenes: dict[str, dict] = {}
    adapters: dict[str, dict] = {}
    injections: dict[str, dict] = {}
    by_representation: dict[str, dict] = {}

    for package in build_portable_workbench.packages():
        provenance = package.get("provenance") or {}
        if provenance.get("authority") != "CANONICAL_COMPILED_RESOURCE":
            continue

        representation_refs = list(package.get("representationRefs") or [])
        if len(representation_refs) != 1:
            raise ValueError(
                "CORE_PORTABLE_REPRESENTATION_AMBIGUOUS: "
                f"{package.get('id')}: {representation_refs}"
            )
        representation_ref = representation_refs[0]
        if representation_ref in by_representation:
            previous = by_representation[representation_ref]["package_id"]
            raise ValueError(
                "CORE_PORTABLE_REPRESENTATION_DUPLICATE: "
                f"{representation_ref}: {previous}, {package.get('id')}"
            )

        package_id = package.get("id")
        scene = package.get("scene")
        adapter = package.get("adapter")
        if not isinstance(package_id, str) or not package_id:
            raise ValueError("CORE_PORTABLE_PACKAGE_ID_REQUIRED")
        if not isinstance(scene, dict) or not isinstance(adapter, dict):
            raise ValueError(f"CORE_PORTABLE_PACKAGE_INCOMPLETE: {package_id}")

        scene_ref = f"portable:{package_id}:scene"
        adapter_ref = f"portable:{package_id}:adapter"
        scenes[scene_ref] = scene
        adapters[adapter_ref] = adapter

        injection_refs = []
        for index, injection in enumerate(package.get("injections") or []):
            if not isinstance(injection, dict):
                raise ValueError(f"CORE_PORTABLE_INJECTION_INVALID: {package_id}:{index}")
            injection_ref = f"portable:{package_id}:injection:{index}"
            injections[injection_ref] = injection
            injection_refs.append(injection_ref)

        by_representation[representation_ref] = {
            "package_id": package_id,
            "scene_ref": scene_ref,
            "adapter_ref": adapter_ref,
            "injection_refs": injection_refs,
        }

    return by_representation, {
        "scenes": scenes,
        "adapters": adapters,
        "injections": injections,
    }


def _bind_portable_workbenches(rows: list[dict]) -> dict:
    by_representation, registries = _portable_workbench_bindings()
    for row in rows:
        projection = row.get("projection") or {}
        if projection.get("core") not in {"CORE1A", "CORE1B", "CORE2A", "CORE2B"}:
            continue
        presentation = projection.get("presentation") or {}
        representation_ref = presentation.get("initial_visual_ref")
        binding = by_representation.get(representation_ref)
        if not binding:
            continue
        row["scene_ref"] = binding["scene_ref"]
        row["adapter_ref"] = binding["adapter_ref"]
        row["injection_refs"] = list(binding["injection_refs"])
        row["portable_package_ref"] = binding["package_id"]
    return registries


def build() -> dict:
    rows = []
    availability = []
    for subject in subjects():
        subject_rows, subject_availability = _subject_rows(subject)
        rows.extend(subject_rows)
        availability.extend(subject_availability)
    rows.sort(key=lambda row: row["id"])
    availability.sort(key=lambda row: (row["subject"], row["bucket_ref"]))
    workbench_registries = _bind_portable_workbenches(rows)
    return {
        "generated_by": "Shared/tools/build_core_learning_data.py",
        "provider_status": "PRODUCTION_COMPILED_CANONICAL",
        "provider": {
            "mode": "CANONICAL_LIBRARY_TO_COMPILE_BUCKET_TO_CORE_PROJECTION",
            "contract_version": "1.0",
        },
        "workbench_registries": workbench_registries,
        "core_projections": rows,
        "bucket_availability": availability,
        "findings": [
            {
                "subject": row["subject"],
                "bucket_ref": row["bucket_ref"],
                **finding,
            }
            for row in availability
            for finding in row.get("findings", [])
        ],
    }


def render(payload: dict) -> str:
    return (
        "// Generated by Shared/tools/build_core_learning_data.py -- do not edit by hand.\n"
        "window.GRADE9V3_CORE = "
        + json.dumps(payload, indent=2, ensure_ascii=False)
        + ";\n"
    )


def rendered_file() -> dict[str, bytes]:
    return {OUT.relative_to(REPO).as_posix(): render(build()).encode("utf-8")}


def write() -> dict:
    payload = build()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(render(payload), encoding="utf-8", newline="\n")
    return payload


def main() -> int:
    payload = write()
    print(
        f"wrote {OUT.relative_to(REPO)}: "
        f"{len(payload['core_projections'])} canonical compiler projection(s)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
