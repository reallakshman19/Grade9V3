#!/usr/bin/env python3
"""Generate the bounded public Core learner projection payload.

The general Topic Atlas data remains unchanged. Each subject may opt canonical records
into this static learner proof from its own content directory. Shared tooling only
projects and validates those selections; it never names a subject or academic record.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO))

from Shared.contracts import load  # noqa: E402
from Shared.library.resolve import build_index  # noqa: E402

SELECTION_NAME = "core-learning-proof.json"
OUT = REPO / "public" / "core-learning" / "data.js"


class CoreLearningDataError(ValueError):
    pass


def _core_projection_concept(microtopic: dict) -> dict | None:
    """Project authored concept truth without synthesizing missing teaching semantics."""
    jump = microtopic.get("inferential_jump")
    teaching_path = microtopic.get("teaching_path") or []
    if not isinstance(jump, str) or not jump.strip() or not teaching_path:
        return None
    if any(not isinstance(step, dict)
           or not isinstance(step.get("id"), str) or not step["id"].strip()
           or not isinstance(step.get("action"), str) or not step["action"].strip()
           or not isinstance(step.get("why_valid"), str) or not step["why_valid"].strip()
           for step in teaching_path):
        return None

    authored_elicitation = microtopic.get("elicitation")
    prompt = None
    if isinstance(authored_elicitation, dict):
        direct = authored_elicitation.get("prompt")
        predict = authored_elicitation.get("predict")
        if isinstance(direct, str) and direct.strip():
            prompt = direct
        elif isinstance(predict, dict):
            candidate = predict.get("prompt")
            if isinstance(candidate, str) and candidate.strip():
                prompt = candidate

    concept = {
        "microtopic_ref": microtopic["id"],
        "inferential_jump": jump,
        "teaching_path": [
            {
                "id": step["id"],
                "action": step["action"],
                "why_valid": step["why_valid"],
                **({"role": step["role"]} if step.get("role") else {}),
                **({"inputs": list(step["inputs"])} if step.get("inputs") else {}),
                **({"output": step["output"]} if step.get("output") else {}),
            }
            for step in teaching_path
        ],
        "misconceptions": list(microtopic.get("misconceptions") or []),
        "representation_refs": list(microtopic.get("representation_refs") or []),
    }
    if prompt:
        concept["elicitation"] = {"prompt": prompt}
    return concept


def _core_projection_application(question: dict) -> dict | None:
    """Project only the structured application route already authored on the question."""
    answer = question.get("answer")
    if not isinstance(answer, dict):
        return None
    route = answer.get("reasoning_route")
    crux = answer.get("crux_move_ref")
    family_ref = question.get("family_ref")
    stem = question.get("stem")
    if not isinstance(route, list) or not route:
        return None
    if not isinstance(crux, str) or not crux.strip():
        return None
    if not isinstance(family_ref, str) or not family_ref.strip():
        return None
    if not isinstance(stem, str) or not stem.strip():
        return None

    if any(
        not isinstance(move, dict)
        or not isinstance(move.get("id"), str) or not move["id"].strip()
        or not isinstance(move.get("kind"), str) or not move["kind"].strip()
        or not isinstance(move.get("action"), str) or not move["action"].strip()
        or not isinstance(move.get("why_valid"), str) or not move["why_valid"].strip()
        or not isinstance(move.get("inputs"), list)
        or not isinstance(move.get("output"), str) or not move["output"].strip()
        for move in route
    ):
        return None
    move_ids = {move["id"] for move in route}
    if crux not in move_ids or len(move_ids) != len(route):
        return None

    scaffolds = list(question.get("scaffolds") or [])
    if any(not isinstance(row, dict)
           or row.get("supports_move_ref") not in move_ids
           for row in scaffolds):
        return None

    return {
        "question_ref": question["id"],
        "family_ref": family_ref,
        "stem": stem,
        "reasoning_route": route,
        "crux_move_ref": crux,
        "hints": list(question.get("hints") or []),
        "scaffolds": scaffolds,
    }


def core_projection_rows(subject: str, records: dict) -> list[dict]:
    """Build portable learner rows from canonical records only.

    This is deliberately a projection, not an authoring fallback. Legacy records that
    lack stable teaching steps or structured reasoning/crux data stay absent until the
    canonical provider supplies them.
    """
    rows = []
    claims = {"CORE1A": set(), "CORE1B": set()}
    for record in records.values():
        if record.get("_collection") != "teaching_routes":
            continue
        for core in claims:
            if core in record.get("cores", []):
                claims[core].update(record.get("microtopic_refs", []))

    for microtopic in sorted(
        (row for row in records.values() if row.get("_collection") == "microtopics"),
        key=lambda row: row["id"],
    ):
        concept = _core_projection_concept(microtopic)
        if concept is None:
            continue
        for core in ("CORE1A", "CORE1B"):
            if microtopic["id"] not in claims[core]:
                continue
            rows.append({
                "id": f"{subject}:{core}:{microtopic['id']}",
                "subject": subject,
                "source_ref": microtopic["id"],
                "projection": {
                    "contract_version": "1.0",
                    "core": core,
                    "concept": concept,
                    "application": None,
                    "presentation": {
                        "attempt_before_reveal": core == "CORE1B",
                        "show_full_construction": core == "CORE1A",
                        "protected_move_refs": [],
                    },
                },
                "scene_ref": None,
                "adapter_ref": None,
                "injection_refs": [],
            })

    questions = sorted(
        (row for row in records.values() if row.get("_collection") == "questions"),
        key=lambda row: row["id"],
    )
    for question in questions:
        application = _core_projection_application(question)
        if application is None:
            continue
        exposed = {row.get("core") for row in question.get("exposure", []) if isinstance(row, dict)}
        for core in ("CORE2A", "CORE2B"):
            if core not in exposed:
                continue
            protected = []
            application_for_core = dict(application)
            if core == "CORE2B":
                transfer = question.get("transfer") or {}
                protected_ref = transfer.get("protected_move_ref")
                if not isinstance(protected_ref, str) or not protected_ref:
                    continue
                if protected_ref not in {move.get("id") for move in application["reasoning_route"]}:
                    continue
                protected = [protected_ref]
                if any(scaffold.get("supports_move_ref") == protected_ref
                       for scaffold in application["scaffolds"]):
                    continue
                application_for_core["transfer"] = transfer

            visual = next(
                (
                    (move.get("representation_ref"), move.get("visual_stage_ref"))
                    for move in application["reasoning_route"]
                    if move.get("representation_ref") and move.get("visual_stage_ref")
                ),
                (None, None),
            )
            presentation = {
                "attempt_before_reveal": core == "CORE2B",
                "show_full_construction": False,
                "protected_move_refs": protected,
            }
            if visual[0]:
                presentation["initial_visual_ref"] = visual[0]
                presentation["initial_visual_stage_ref"] = visual[1]

            rows.append({
                "id": f"{subject}:{core}:{question['id']}",
                "subject": subject,
                "source_ref": question["id"],
                "projection": {
                    "contract_version": "1.0",
                    "core": core,
                    "concept": None,
                    "application": application_for_core,
                    "presentation": presentation,
                },
                "scene_ref": None,
                "adapter_ref": None,
                "injection_refs": [],
            })
    return rows


def selection_paths() -> list[Path]:
    return sorted(REPO.glob(f"*/content/{SELECTION_NAME}"))


def _selection(path: Path) -> tuple[str, list[dict]]:
    subject = path.relative_to(REPO).parts[0]
    payload = json.loads(path.read_text(encoding="utf-8"))
    if payload.get("schema_version") != "1.0":
        raise CoreLearningDataError(
            f"CORE_LEARNING_SELECTION_VERSION_UNSUPPORTED: {path.relative_to(REPO)}"
        )
    requested = payload.get("projections")
    if not isinstance(requested, list) or not requested:
        raise CoreLearningDataError(
            f"CORE_LEARNING_SELECTION_INVALID: {path.relative_to(REPO)}"
        )

    normalized = []
    seen = set()
    for index, row in enumerate(requested):
        if not isinstance(row, dict):
            raise CoreLearningDataError(
                f"CORE_LEARNING_SELECTION_INVALID: {path.relative_to(REPO)}#{index}"
            )
        source_ref = row.get("source_ref")
        cores = row.get("cores")
        if (
            not isinstance(source_ref, str) or not source_ref.strip()
            or not isinstance(cores, list) or not cores
            or any(core not in {"CORE1A", "CORE1B", "CORE2A", "CORE2B"} for core in cores)
            or len(set(cores)) != len(cores)
        ):
            raise CoreLearningDataError(
                f"CORE_LEARNING_SELECTION_INVALID: {path.relative_to(REPO)}#{index}"
            )
        for core in cores:
            key = (source_ref, core)
            if key in seen:
                raise CoreLearningDataError(
                    f"CORE_LEARNING_SELECTION_DUPLICATE: {subject}:{core}:{source_ref}"
                )
            seen.add(key)
            normalized.append({"source_ref": source_ref, "core": core})
    return subject, normalized


def _subject_rows(subject: str) -> list[dict]:
    packages = [
        load(path)
        for path in sorted((REPO / subject / "library").glob("*.json"))
    ]
    if not packages:
        raise CoreLearningDataError(f"CORE_LEARNING_SUBJECT_LIBRARY_EMPTY: {subject}")
    return core_projection_rows(subject, build_index(packages))


def build() -> dict:
    selected = []
    ids = set()
    paths = selection_paths()
    if not paths:
        raise CoreLearningDataError("CORE_LEARNING_SELECTION_REQUIRED")

    for path in paths:
        subject, requested = _selection(path)
        candidates = _subject_rows(subject)
        by_key = {
            (row["source_ref"], row["projection"]["core"]): row
            for row in candidates
        }
        for request in requested:
            key = (request["source_ref"], request["core"])
            row = by_key.get(key)
            if row is None:
                raise CoreLearningDataError(
                    f"CORE_LEARNING_SELECTION_UNRESOLVED: "
                    f"{subject}:{request['core']}:{request['source_ref']}"
                )
            if row["id"] in ids:
                raise CoreLearningDataError(
                    f"CORE_LEARNING_PROJECTION_ID_COLLISION: {row['id']}"
                )
            ids.add(row["id"])
            selected.append(row)

    return {
        "generated_by": "Shared/tools/build_core_learning_data.py",
        "selection_version": "1.0",
        "core_projections": selected,
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
        f"{len(payload['core_projections'])} selected projection(s)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
