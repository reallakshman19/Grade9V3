#!/usr/bin/env python3
"""Generate the data file the browsable surfaces read.

The surfaces are static and must work from `file://`, where `fetch()` of a sibling
JSON file is blocked. The data is therefore emitted as a JavaScript file assigning a
global, not as JSON to be fetched. That is the whole reason this generator exists.

It also precomputes, per bucket, what the library compiler would produce: which
products are supported, which are not and why, and what authoring remains. The run
builder can then tell the truth about a bucket without a server behind it.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO))
OUT = REPO / "tools" / "data.js"
PUBLIC_OUT = REPO / "public" / "data" / "data.js"

from Shared.contracts import ContractError, load  # noqa: E402
from Shared.library.compile_inputs import compile_bucket  # noqa: E402
from Shared.library.intake import check  # noqa: E402
from Shared.library.resolve import build_index, slice_for_bucket  # noqa: E402


def subjects() -> list[str]:
    return sorted(p.parent.parent.name for p in REPO.glob("*/adapter/CoreContracts.json"))


def gate_summary(subject: str) -> list[dict]:
    rows = []
    for path in sorted((REPO / subject / "gates").glob("*.json")):
        registry = load(path)
        if "gates" not in registry:
            continue
        for gate in registry["gates"]:
            rows.append({"gate_id": gate["gate_id"], "title": gate["title"],
                         "grade": gate["curriculum"]["grade"], "chapter": gate["curriculum"]["chapter"],
                         "scope_class": gate["curriculum"]["scope_class"], "tier": gate["tier"],
                         "scope_state": gate["scope_state"],
                         "prerequisites": gate["prerequisites"],
                         "external_prerequisites": [e["capability_id"]
                                                    for e in gate.get("external_prerequisites", [])],
                         "concepts": [c["statement"] for c in gate["canonical_concepts"]],
                         "misconceptions": [m["wrong_idea"] for m in gate["misconceptions"]]})
    return rows


def bucket_view(records: dict, bucket_id: str) -> dict:
    chosen = slice_for_bucket(records, bucket_id)
    bucket = records[bucket_id]
    microtopics = []
    for mid in chosen["microtopic_order"]:
        row = records[mid]
        microtopics.append({
            "id": mid, "title": row["title"], "badge": row["intrinsic_badge"],
            "status": row.get("status"), "badge_reason": row.get("badge_reason"),
            "entry_assumptions": row.get("entry_assumptions", []),
            "inferential_jump": row.get("inferential_jump"),
            "teaching_path": [{"id": s.get("id"), "action": s["action"], "why_valid": s["why_valid"],
                               "role": s.get("role"), "output": s.get("output"),
                               "inputs": s.get("inputs", [])} for s in row.get("teaching_path", [])],
            "misconceptions": row.get("misconceptions", []),
            "exit_task": row.get("exit_task"),
            "prerequisites": row.get("prerequisite_refs", []),
        })
    return {"id": bucket_id, "title": bucket["title"], "topic": bucket.get("topic"),
            "badge": bucket["intrinsic_badge"], "status": bucket.get("status"),
            "prerequisites": bucket.get("prerequisite_refs", []),
            "curriculum": bucket.get("curriculum_mappings", []),
            "microtopics": microtopics,
            "relations": [{"id": r["id"], "expression": r["expression"], "meaning": r["meaning"],
                           "conditions": r.get("conditions", [])}
                          for r in chosen["records"].get("relations", [])],
            "questions": [{"id": q["id"], "stem": q["stem"], "origin": q.get("origin"),
                           "answer": q["answer"].get("summary")}
                          for q in chosen["records"].get("questions", [])],
            "capabilities": [{"id": c["id"], "action": c["action"],
                              "provider": c.get("external_provider"),
                              "acceptance": c.get("acceptance_status")}
                             for c in chosen["records"].get("capabilities", [])],
            "record_count": chosen["record_count"]}


def compile_preview(records: dict, bucket_id: str, subject: str) -> dict:
    try:
        compiled = compile_bucket(records, bucket_id, topic_id=f"PREVIEW-{bucket_id}",
                                  title=records[bucket_id]["title"], subject=subject,
                                  practice_control={"mode": "DESIGN_PREVIEW", "purpose": "PRACTICE"})
    except ContractError as exc:
        return {"compilable": False, "code": exc.code, "detail": exc.detail}
    return {"compilable": True,
            "supported_products": compiled["baseline"]["selected_cores"],
            "atoms": len(compiled["source"]["atoms"]),
            "questions": len(compiled["source"]["questions"]),
            "obligations": len(compiled["baseline"]["obligations"]),
            "authoring_requirements": compiled["authoring_requirements"]}


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


def matrix_summary(subject: str, records: dict) -> list[dict]:
    rows = []
    for path in sorted((REPO / subject / "matrices").glob("*.rungs.json")):
        board = load(path)
        rungs = []
        for r in board.get("rungs", []):
            mid = r.get("microtopic_ref")
            m = records.get(mid, {}) if mid else {}
            cap_id = m.get("primary_capability_ref")
            cap = records.get(cap_id, {}) if cap_id else {}

            cap_questions = []
            if cap_id:
                for q in records.values():
                    if q.get("_collection") == "questions" and q.get("primary_capability_ref") == cap_id:
                        ans = q.get("answer")
                        summary = ans.get("summary") if isinstance(ans, dict) else ans
                        cap_questions.append({
                            "id": q["id"],
                            "stem": q.get("stem"),
                            "answer": summary,
                            "origin": q.get("origin"),
                            "family_ref": q.get("family_ref"),
                            "repair_ref": q.get("repair_ref")
                        })

            activities = []
            if cap_id:
                for res in records.values():
                    if res.get("_collection") == "resources" and "ACTIVITY" in res.get("role", []):
                        if cap_id in res.get("supports_claims", []):
                            atlas_ext = res.get("extensions", {}).get("topic_atlas", {})
                            activity = {
                                "id": res["id"],
                                "title": res["title"],
                                "locator": res["locator"],
                                "section": res.get("section"),
                                "supports_claims": res.get("supports_claims", [])
                            }
                            if atlas_ext:
                                activity["teaching_step_refs"] = atlas_ext.get("teaching_step_refs", [])
                                activity["activity_kind"] = atlas_ext.get("activity_kind")
                                activity["design_issue_ref"] = atlas_ext.get("design_issue_ref")
                                gcdr = atlas_ext.get("gcdr_contract")
                                if gcdr:
                                    policy = gcdr.get("route_policy", {})
                                    quality = gcdr.get("quality_audit", {})
                                    fidelity = gcdr.get("state_fidelity_contract", {})
                                    audit_groups = [
                                        quality.get("audit_1_canonical_truth_scope", {}),
                                        quality.get("audit_2_graphical_state_fidelity", {}),
                                        quality.get("audit_3_reconstruction_teaching_transfer", {}),
                                        quality.get("audit_4_runtime_release_integrity", {}),
                                    ]
                                    statuses = [
                                        status
                                        for group in audit_groups
                                        for status in group.values()
                                    ]
                                    activity["support_route"] = {
                                        "kind": "GCDR",
                                        "conformance_status": gcdr.get("conformance_status"),
                                        "quality_audit_status": quality.get("audit_status"),
                                        "quality_check_counts": {
                                            "PASS": statuses.count("PASS"),
                                            "FAIL": statuses.count("FAIL"),
                                            "PENDING": statuses.count("PENDING"),
                                            "NOT_APPLICABLE": statuses.count("NOT_APPLICABLE"),
                                        },
                                        "audit_provenance_mode": quality.get("audit_provenance", {}).get("mode"),
                                        "unresolved_findings_count": len(quality.get("unresolved_findings", [])),
                                        "external_state_mapping": fidelity.get("external_state_mapping"),
                                        "external_state_binding_count": len(fidelity.get("external_state_bindings", [])),
                                        "missing_parameter_policy": fidelity.get("missing_parameter_policy"),
                                        "recommended_when": policy.get("recommended_when", []),
                                        "learner_evidence_triggers": policy.get("learner_evidence_triggers", []),
                                        "auto_route_policy": policy.get("auto_route_policy"),
                                        "rejoin_step_ref": gcdr.get("exit_evidence", {}).get("rejoin_step_ref")
                                    }
                            activities.append(activity)

            tpath = []
            for idx, s in enumerate(m.get("teaching_path", [])):
                tpath.append({
                    "id": s.get("id", f"{r['rung']}.{idx}"),
                    "role": s.get("role", "TRANSFORM"),
                    "action": s.get("action", ""),
                    "why_valid": s.get("why_valid", ""),
                    "output": s.get("output"),
                    "inputs": s.get("inputs", [])
                })

            rungs.append({
                "rung": r["rung"],
                "ladder_position": r["ladder_position"],
                "default_entry_eligible": r.get("default_entry_eligible", True),
                "microtopic_ref": mid,
                "ceiling": r.get("ceiling", []),
                "must_contain": r.get("must_contain", []),
                "controlled_variation": r.get("controlled_variation", []),
                "microtopic": {
                    "id": mid,
                    "title": m.get("title"),
                    "intrinsic_badge": m.get("intrinsic_badge"),
                    "badge_reason": m.get("badge_reason"),
                    "entry_assumptions": m.get("entry_assumptions", []),
                    "inferential_jump": m.get("inferential_jump"),
                    "misconceptions": m.get("misconceptions", []),
                    "exit_task": m.get("exit_task"),
                    "elicitation": m.get("elicitation"),
                    "prerequisite_refs": m.get("prerequisite_refs", []),
                    "teaching_path": tpath
                } if m else None,
                "capability": {
                    "id": cap_id,
                    "action": cap.get("action"),
                    "success_criterion": cap.get("success_criterion"),
                    "prerequisite_refs": cap.get("prerequisite_refs", []),
                    "acceptance_status": cap.get("acceptance_status")
                } if cap else None,
                "questions": cap_questions,
                "activities": activities
            })

        rows.append({
            "matrix_id": board["matrix_id"],
            "subject": board.get("subject", subject),
            "bucket_id": board.get("bucket_id"),
            "topic": board.get("topic"),
            "subtopic": board.get("subtopic"),
            "axis_note": board.get("axis_note"),
            "family": board.get("family", {}),
            "rungs": rungs
        })
    return rows


def build() -> dict:
    payload = {
        "generated_by": "Shared/tools/build_web_data.py",
        "subjects": {},
    }
    for subject in subjects():
        packages = [load(p) for p in sorted((REPO / subject / "library").glob("*.json"))]
        entry = {"contract": {}, "gates": gate_summary(subject), "buckets": [],
                 "matrices": [], "packages": [], "library_available": bool(packages)}
        contract = load(REPO / subject / "adapter" / "CoreContracts.json")
        entry["contract"] = {
            "learner_products": contract["learner_products"],
            "validator_catalogue": [{"id": v["id"], "status": v["status"],
                                     "shape": v["result"]["shape"],
                                     "comparison": v["result"]["comparison"],
                                     "does_not_prove": v["does_not_prove"]}
                                    for v in contract["validator_catalogue"]],
            "representation_kinds": contract.get("representation_kinds", []),
            "curriculum": contract.get("curriculum", {}),
        }
        if packages:
            entry["packages"] = [{"package_id": p["package_id"], "status": p["status"],
                                  "admitted": check(p)["admitted"]} for p in packages]
            records = build_index(packages)
            entry["matrices"] = matrix_summary(subject, records)
            for bucket_id in sorted(r for r, v in records.items() if v["_collection"] == "buckets"):
                view = bucket_view(records, bucket_id)
                view["compile_preview"] = compile_preview(records, bucket_id, subject)
                entry["buckets"].append(view)
        else:
            entry["matrices"] = matrix_summary(subject, {})
        payload["subjects"][subject] = entry
    return payload


def render(payload: dict) -> str:
    """The file's exact text, without writing it, so a check can compare without touching disk."""
    return ("// Generated by Shared/tools/build_web_data.py -- do not edit by hand.\n"
            "window.GRADE9V3 = " + json.dumps(payload, indent=2, ensure_ascii=False) + ";\n")


def write() -> dict:
    """Regenerate the page data file. Silent, so other tools can depend on it."""
    payload = build()
    text = render(payload)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(text, encoding="utf-8", newline="\n")
    PUBLIC_OUT.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_OUT.write_text(text, encoding="utf-8", newline="\n")
    return payload


def main() -> int:
    payload = write()
    buckets = sum(len(s["buckets"]) for s in payload["subjects"].values())
    print(f"wrote {OUT.relative_to(REPO)}: {len(payload['subjects'])} subject(s), {buckets} bucket(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
