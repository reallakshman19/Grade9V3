#!/usr/bin/env python3
"""Generate the learner-facing Core2A projectile sample from governed repository records."""
from __future__ import annotations

import argparse
import json
import math
import re
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[2]
BANK = REPO / "Physics/library/exam-bank/competitive-exam-question-bank.v2.json"
FIXTURE = REPO / "tests/fixtures/prompt-composer/projectile-stress-set.json"
BLUEPRINTS = REPO / "Shared/web/interactive-page-blueprints.v1.json"
OUT = REPO / "public/physics/motion-2d/core2a-projectile-sample/data.js"

BLUEPRINT_REF = "BP-CORE2A-SUPPORTED-APPLICATION@1.0.0"
QUESTION_REFS = (
    ("Q21", "PYQ-PHY-JEEADV-2022-P1-Q08"),
    ("Q26", "PYQ-PHY-JEEADV-2026-P1-Q06"),
    ("Q23", "PYQ-PHY-JEEADV-2025-P2-Q15"),
)
REPRESENTATION_BINDINGS = {
    "Q21": ["REP-KIN-2D-PROJECTILE-MODEL", "REP-KIN-2D-EVENT-CLOCK"],
    "Q26": ["REP-KIN-2D-PROJECTILE-MODEL", "REP-KIN-2D-EVENT-CLOCK"],
    "Q23": ["REP-KIN-2D-EVENT-CLOCK"],
}


def _load(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _records(value: Any):
    if isinstance(value, list):
        for row in value:
            yield from _records(row)
    elif isinstance(value, dict):
        if isinstance(value.get("id"), str):
            yield value
        for child in value.values():
            yield from _records(child)


def _one(rows: list[dict], label: str) -> dict:
    if len(rows) != 1:
        raise ValueError(f"{label}: expected exactly one row, found {len(rows)}")
    return rows[0]


def _num(pattern: str, text: str, label: str) -> float:
    match = re.search(pattern, text, re.IGNORECASE)
    if not match:
        raise ValueError(f"{label}: could not resolve from canonical stem")
    value = float(match.group(1))
    return int(value) if value.is_integer() else value


def _visual_binding(owner: str, record: dict) -> dict:
    stem = record["stem"]
    if owner == "Q21":
        divisor = _num(r"g\s*/\s*(0\.81)", stem, "Q21 gravity divisor")
        ratio = 0.5 + 0.5 * math.sqrt(divisor)
        return {
            "kind": "TWO_STAGE_APEX",
            "mount_mode": "COMPONENT",
            "representation_refs": REPRESENTATION_BINDINGS[owner],
            "normalization": {"ordinary_range_d": 1, "apex_height": 1},
            "post_apex_gravity_divisor": divisor,
            "derived_modified_range_ratio": round(ratio, 12),
        }
    if owner == "Q26":
        condition = " ".join(record.get("conditions", []))
        point_match = re.search(r"\((\d+(?:\.\d+)?)\s*m\s*,\s*(\d+(?:\.\d+)?)\s*m\)", condition)
        if not point_match:
            raise ValueError("Q26 point binding missing from canonical conditions")
        return {
            "kind": "POINT_CONSTRAINED_TRAJECTORY",
            "mount_mode": "COMPONENT",
            "representation_refs": REPRESENTATION_BINDINGS[owner],
            "point": [
                int(float(point_match.group(1))) if float(point_match.group(1)).is_integer() else float(point_match.group(1)),
                int(float(point_match.group(2))) if float(point_match.group(2)).is_integer() else float(point_match.group(2)),
            ],
            "source_angle_cases": ["45°", "30°", "tan⁻¹(1/5)"],
            "visualization_g_m_s2": 9.8,
            "visualization_g_is_canonical": False,
        }
    if owner == "Q23":
        return {
            "kind": "LINEAR_DRAG_HORIZONTAL",
            "mount_mode": "COMPONENT",
            "representation_refs": REPRESENTATION_BINDINGS[owner],
            "mass_kg": _num(r"A\s+(0\.2)\s*kg", stem, "Q23 mass"),
            "launch_speed_m_s": _num(r"launched at\s+(270)\s*m/s", stem, "Q23 speed"),
            "launch_angle_deg": _num(r"at\s+(60)\s+degrees", stem, "Q23 angle"),
            "drag_c_kg_s": _num(r"c\s*=\s*(0\.1)\s*kg/s", stem, "Q23 drag coefficient"),
            "event_time_s": _num(r"after\s+(2)\s*s", stem, "Q23 event time"),
            "source_e": _num(r"e\s*=\s*(2\.7)", stem, "Q23 e approximation"),
        }
    raise ValueError(f"unsupported owner label {owner}")


def build(repo: Path = REPO) -> dict:
    bank = _load(repo / BANK.relative_to(REPO))
    fixture = _load(repo / FIXTURE.relative_to(REPO))
    registry = _load(repo / BLUEPRINTS.relative_to(REPO))

    blueprint = _one(
        [row for row in registry["blueprints"] if f'{row["id"]}@{row["version"]}' == BLUEPRINT_REF],
        BLUEPRINT_REF,
    )
    if blueprint["shell_ref"] != "G9-TABLET-SHELL-V1" or blueprint["layout_family"] != "QUESTION_STUDY":
        raise ValueError("Core2A blueprint delivery contract changed")

    fixture_by_owner = {row["question_id"]: row for row in fixture["questions"]}
    bank_by_id = {row["id"]: row for row in _records(bank)}

    questions = []
    for owner, canonical_ref in QUESTION_REFS:
        workflow = fixture_by_owner.get(owner)
        if not workflow or workflow.get("canonical_question_ref") != canonical_ref:
            raise ValueError(f"{owner}: projectile stress-set identity drift")
        record = bank_by_id.get(canonical_ref)
        if not record:
            raise ValueError(f"{owner}: canonical question missing: {canonical_ref}")
        analysis = record.get("extensions", {}).get("grade9v3:analysis", {})
        custody = record.get("extensions", {}).get("grade9v3:source_custody", {})
        answer = record.get("answer", {})
        questions.append({
            "owner_label": owner,
            "canonical_ref": record["id"],
            "canonical_version": record["version"],
            "status": record["status"],
            "learner_eligibility": workflow["learner_eligibility"],
            "learner_eligibility_basis": workflow["learner_eligibility_basis"],
            "provenance_badge": analysis.get("exam_source_badge"),
            "wording_custody": custody.get("wording_custody"),
            "stem": record["stem"],
            "options": record.get("options", []),
            "conditions": record.get("conditions", []),
            "primary_capability_ref": record.get("primary_capability_ref"),
            "secondary_capability_refs": record.get("secondary_capability_refs", []),
            "analysis": {
                "common_wrong_route": analysis.get("common_wrong_route"),
                "stable_crux_move": analysis.get("stable_crux_move"),
            },
            "scaffolds": record.get("scaffolds", []),
            "answer": {
                "summary": answer.get("summary"),
                "reasoning_route": answer.get("reasoning_route", []),
                "crux_move_ref": answer.get("crux_move_ref"),
                "check": answer.get("check"),
            },
            "visualization": _visual_binding(owner, record),
        })

    return {
        "generated_by": "Physics/tools/build_core2a_projectile_sample.py",
        "contract_version": "1.0.0",
        "sample_status": "DESIGN_REVIEW_SAMPLE_CANDIDATE_NOT_LEARNER_ASSIGNMENT",
        "blueprint": {
            "ref": BLUEPRINT_REF,
            "shell_ref": blueprint["shell_ref"],
            "layout_family": blueprint["layout_family"],
            "slot_order": [row["id"] for row in blueprint["slots"]],
            "interaction_policy": blueprint["interaction_policy"],
            "responsive_policy": blueprint["responsive_policy"],
            "touch_policy": blueprint["touch_policy"],
        },
        "questions": questions,
    }


def render(payload: dict) -> str:
    return (
        "// Generated by Physics/tools/build_core2a_projectile_sample.py -- do not edit by hand.\n"
        "window.GRADE9V3_CORE2A_PROJECTILE_SAMPLE = "
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + ";\n"
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    intended = render(build())
    if args.check:
        if not OUT.is_file() or OUT.read_text(encoding="utf-8") != intended:
            print(f"stale generated sample data: {OUT.relative_to(REPO)}")
            return 1
        print("Core2A projectile sample data is current")
        return 0
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(intended, encoding="utf-8", newline="\n")
    print(f"wrote {OUT.relative_to(REPO)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
