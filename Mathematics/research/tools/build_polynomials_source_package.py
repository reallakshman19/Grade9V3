#!/usr/bin/env python3
"""Project the #350 Polynomials source inventory into the canonical package model.

This is a deterministic research projector, not a new academic authority. It consumes
committed source inventory/evidence and the syllabus spine. It keeps unresolved source
readback and unverified mathematics explicit.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO))

from Shared.contracts import load  # noqa: E402
from Shared.library import source_custody  # noqa: E402
from Shared.library.intake import schema_errors  # noqa: E402
from Shared.library.resolve import build_index  # noqa: E402

SUBJECT = "Mathematics"
NODE = "MAT-09-POLYNOMIALS"
INV_ID = "INV-MAT-09-POLYNOMIALS-M1P33-50-M2P1-11"
INV_PATH = REPO / "Mathematics/research/inventories" / f"{INV_ID}.json"
EVIDENCE_DIR = REPO / "Mathematics/research/evidence"
SPINE_PATH = REPO / "Mathematics/research/syllabus-spine.json"
OUT = REPO / "Mathematics/library/polynomials.v1.json"

M1_ACQ = "ACQ-0B3450C353FF29985152"
M2_ACQ = "ACQ-1DD05CE5AA04B532EC68"
M1_SHA = "0b3450c353ff299851528edd4469bc01413920135b0fd041fe89286a00086afa"
M2_SHA = "1dd05ce5aa04b532ec68c4054f55af1677ecb210be00b8f3085d6f29215a230c"
M1_RESOURCE = "SRC-BOOK-MATH-CH2-CH3-M1-SCAN"
M2_RESOURCE = "SRC-BOOK-MATH-CH2-CH3-M2-SCAN"

CAPS = {
    "MAT-09-POLYNOMIALS-01": "CAP-MAT-POLY-STRUCTURE",
    "MAT-09-POLYNOMIALS-02": "CAP-MAT-POLY-EVALUATION",
    "MAT-09-POLYNOMIALS-03": "CAP-MAT-POLY-REMAINDER-FACTOR",
    "MAT-09-ALGEBRAIC-IDENTITIES-01": "CAP-MAT-ALG-IDENTITIES",
}
FAMS = {
    "MAT-09-POLYNOMIALS-01": "FAM-MAT-POLY-STRUCTURE",
    "MAT-09-POLYNOMIALS-02": "FAM-MAT-POLY-EVALUATION",
    "MAT-09-POLYNOMIALS-03": "FAM-MAT-POLY-REMAINDER-FACTOR",
    "MAT-09-ALGEBRAIC-IDENTITIES-01": "FAM-MAT-ALG-IDENTITIES",
}
MICS = {
    "MAT-09-POLYNOMIALS-01": "MIC-MAT-POLY-STRUCTURE",
    "MAT-09-POLYNOMIALS-02": "MIC-MAT-POLY-EVALUATION",
    "MAT-09-POLYNOMIALS-03": "MIC-MAT-POLY-REMAINDER-FACTOR",
    "MAT-09-ALGEBRAIC-IDENTITIES-01": "MIC-MAT-ALG-IDENTITIES",
}

UNRESOLVED_MARKERS = (
    "[source", "obscured", "unclear", "unresolved", "clipped",
)


def base(rid: str, source_refs: list[str] | None = None) -> dict:
    return {
        "id": rid,
        "version": "0.1.0",
        "status": "CANDIDATE",
        "source_refs": list(source_refs or []),
        "evidence_refs": [],
        "extensions": {},
    }


def source_records() -> list[dict]:
    rows = []
    for rid, acq, digest, locator, snapshot, pages in (
        (M1_RESOURCE, M1_ACQ, M1_SHA, "scan://SRC-BOOK-MATH-CH2-CH3/m1.pdf",
         f".source-cache/{M1_SHA}.pdf", "PDF pages 33-50"),
        (M2_RESOURCE, M2_ACQ, M2_SHA, "scan://SRC-BOOK-MATH-CH2-CH3/m2.pdf",
         f".source-cache/{M2_SHA}.pdf", "PDF pages 1-11"),
    ):
        row = base(rid)
        row.update({
            "title": "Class 9 Mathematics Modules: Polynomials and Coordinate Geometry",
            "origin": "LOCAL",
            "locator": locator,
            "edition": "Reference Press, edition 1, 2021; Owner-supplied exact scan",
            "section": f"Chapter 2 Polynomials, {pages}",
            "last_checked": "2026-09-29",
            "access_status": "FULL_ITEM_INSPECTED",
            "rights_status": "Copyrighted owner-supplied copy; only bounded question text/key evidence is retained in repository records.",
            "snapshot_ref": snapshot,
            "snapshot_digest": digest,
            "role": ["QUESTION_BANK"],
            "supports_claims": [],
            "entry_capabilities": [],
            "depth": ["SOURCE_QUESTION_CUSTODY"],
            "selection_reason": "Exact scan member of the Owner-selected Polynomials source specimen.",
            "fallback": [],
            "extensions": {
                "grade9v3:acquisition_ref": acq,
                "grade9v3:source_family": "SRC-BOOK-MATH-CH2-CH3",
            },
        })
        rows.append(row)
    return rows


def answer(summary: str, reasoning: list[str], check: str, status: str, source_key: dict,
           key_relation: str | None = None, conflict: str | None = None) -> dict:
    row = {
        "kind": "MODEL_RESPONSE",
        "summary": summary,
        "reasoning": reasoning,
        "check": check,
        "acceptable_alternatives": [],
        "subpart_answers": [],
        "verification_status": status,
        "source_key": source_key,
    }
    if key_relation:
        row["key_relation"] = key_relation
    if conflict:
        row["key_conflict_explanation"] = conflict
    return row


def _load_cards() -> dict[str, dict]:
    cards: dict[str, dict] = {}
    paths = sorted(EVIDENCE_DIR.glob("MAT-09-POLYNOMIALS-M1-B*.cards.json"))
    paths += sorted(EVIDENCE_DIR.glob("MAT-09-POLYNOMIALS-M2-B*.cards.json"))
    paths += [EVIDENCE_DIR / "MAT-09-POLYNOMIALS-M1-CHECKPOINT-KEYS.cards.json"]
    for path in paths:
        doc = load(path)
        for card in doc.get("cards", []):
            cid = card["card_id"]
            if cid in cards and cards[cid] != card:
                raise ValueError(f"duplicate unequal evidence card: {cid}")
            cards[cid] = card
    return cards


def _text(card: dict) -> str:
    q = card.get("question") or {}
    parts = [card.get("quote", ""), card.get("claim", ""), " ".join(q.get("options") or [])]
    return " ".join(str(x) for x in parts).lower()


def map_item(card: dict) -> tuple[str, str, str]:
    """Return syllabus node, scope class, short basis."""
    loc = card.get("locator") or {}
    section = str(loc.get("section", ""))
    text = _text(card)
    section_l = section.lower()

    extension_section = any(token in section_l for token in (
        "higher order thinking", "archive corner", "multiple correct", "numerical answer",
    ))

    if any(token in text for token in (
        "remainder", "divided by", "divisible by", "quotient", "factor theorem",
        "is a factor", "are factors", "root", "zero of", "zeroes", "zeros",
    )):
        node = "MAT-09-POLYNOMIALS-03"
        basis = "Remainder/factor/division or zero/root demand."
    elif any(token in text for token in (
        "factorize", "factorise", "expand", "identity", "simplify", "a³", "b³", "x³",
        "cube", "square", "(a + b)", "(a - b)", "x + 1/x", "x - 1/x",
        "a² + b²", "x² + y²", "a + b + c", "ab + bc", "product of",
    )):
        node = "MAT-09-ALGEBRAIC-IDENTITIES-01"
        basis = "Algebraic identity/factorisation/simplification demand."
    elif any(token in text for token in (
        "linear polynomial", "value of the polynomial", "value of p(", "p(", "f(", "evaluate",
    )):
        node = "MAT-09-POLYNOMIALS-02"
        basis = "Polynomial evaluation or linear-polynomial relation demand."
    else:
        node = "MAT-09-POLYNOMIALS-01"
        basis = "Polynomial form/term/coefficient/degree/basic classification demand."

    scope = "EXTENSION" if extension_section else "CORE_SYLLABUS"
    if "comprehension" in section_l and scope != "EXTENSION":
        scope = "RELATED"
    return node, scope, basis


def unresolved_card(card: dict) -> bool:
    text = (str(card.get("quote", "")) + " " + str(card.get("claim", ""))).lower()
    q = card.get("question") or {}
    text += " " + " ".join(str(x) for x in q.get("options") or [])
    return any(marker in text for marker in UNRESOLVED_MARKERS)


def verified_override(card: dict, key_card: dict | None) -> dict | None:
    loc = card.get("locator") or {}
    section = str(loc.get("section", "")).lower()
    qn = str(loc.get("question_number", ""))

    if "higher order thinking" in section and qn == "15":
        return {
            "summary": "0 (option C).",
            "reasoning": [
                "x/y + y/x = -1 implies (x²+y²)/(xy) = -1, so x²+xy+y² = 0.",
                "x³-y³ = (x-y)(x²+xy+y²) = 0.",
            ],
            "check": "Factor x³-y³ and substitute x²+xy+y²=0.",
            "status": "CHECKED_BY_AUTHOR", "relation": "MATCHES_KEY",
        }
    if "higher order thinking" in section and qn == "16":
        return {
            "summary": "-153/65 (option B).",
            "reasoning": [
                "Direct readback gives the condition R1 + R2 = 0.",
                "Using the remainder theorem at x=4 gives 64a+45 and 108+a; setting their sum to zero gives 65a+153=0.",
            ],
            "check": "Substitute a=-153/65 into both remainder expressions and confirm the sum is zero.",
            "status": "CHECKED_BY_AUTHOR", "relation": "MATCHES_KEY",
        }
    if "higher order thinking" in section and qn == "6":
        return {
            "summary": "-2 (option A).",
            "reasoning": ["Independent algebraic simplification gives -2."],
            "check": "Substitute the stated relation back into the simplified expression.",
            "status": "CHECKED_BY_AUTHOR", "relation": "MATCHES_KEY",
        }
    if "long answer" in section and qn == "7":
        return {
            "summary": "-10y(12x² + 25y²).",
            "reasoning": ["Independent expansion/factorisation gives -10y(12x²+25y²)."],
            "check": "Expand the factorised result and compare term-by-term with the source expression.",
            "status": "DISPUTED", "relation": "CONFLICTS_WITH_KEY",
            "conflict": "The printed source key omits the leading minus sign.",
        }
    if "archive corner" in section and qn == "22":
        return {
            "summary": "Option A: 2x³ + x² - 5x + 7.",
            "reasoning": ["Dividend = divisor × quotient + remainder = (x+2)(2x²-3x+1)+5."],
            "check": "Expand (x+2)(2x²-3x+1)+5.",
            "status": "DISPUTED", "relation": "CONFLICTS_WITH_KEY",
            "conflict": "The printed key says B, but direct polynomial reconstruction yields option A.",
        }
    if "short answer" in section and qn == "6":
        return {
            "summary": "Source item remains disputed: subpart (i) independently evaluates to 77760, while the printed key gives 7760.",
            "reasoning": ["Independent calculation of subpart (i) gives 77760."],
            "check": "Re-evaluate subpart (i) directly from the source expression.",
            "status": "DISPUTED", "relation": "CONFLICTS_WITH_KEY",
            "conflict": "Printed-key typo in subpart (i): 7760 versus independently calculated 77760.",
        }
    if "multiple correct" in section and qn == "21":
        return {
            "summary": "Disputed: the stated conditions allow a sign ambiguity; ±539 is obtained for the targeted expression.",
            "reasoning": ["Independent algebra shows the source conditions do not determine a unique sign."],
            "check": "Solve the pair of symmetric conditions and test both sign-consistent branches.",
            "status": "DISPUTED", "relation": "CONFLICTS_WITH_KEY",
            "conflict": "The printed key supplies one positive option although the source conditions are underdetermined up to sign.",
        }
    if "multiple correct" in section and qn == "22":
        return {
            "summary": "Disputed option design: A and B both print the value 2.",
            "reasoning": ["Direct source readback shows duplicate answer values in options A and B."],
            "check": "Compare the printed option strings directly.",
            "status": "DISPUTED", "relation": None,
            "conflict": "The item has duplicate equivalent options, so a unique option-letter answer is not well-defined.",
        }
    return None


def source_key(item: dict, cards: dict[str, dict]) -> tuple[dict, dict | None]:
    key = item.get("key") or {"state": "ABSENT"}
    state = key.get("state", "ABSENT")
    if state == "PRESENT":
        ref = key["card"]
        card = cards[ref]
        return {"state": "PRESENT", "value": card.get("quote", ""), "card": ref}, card
    if state == "AMBIGUOUS":
        row = {"state": "AMBIGUOUS"}
        if key.get("card"):
            card = cards[key["card"]]
            row.update({"value": card.get("quote", ""), "card": key["card"]})
            return row, card
        return row, None
    return {"state": "ABSENT"}, None


def make_question(item: dict, cards: dict[str, dict]) -> tuple[dict, dict]:
    card = cards[item["question_card"]]
    qmeta = card.get("question") or {}
    loc = card.get("locator") or {}
    node, scope, mapping_basis = map_item(card)
    acq = item["locator"]["acquisition_ref"]
    if acq == M1_ACQ:
        resource, digest = M1_RESOURCE, M1_SHA
    elif acq == M2_ACQ:
        resource, digest = M2_RESOURCE, M2_SHA
    else:
        raise ValueError(f"unexpected acquisition {acq}")

    key, key_card = source_key(item, cards)
    unresolved = unresolved_card(card)
    override = verified_override(card, key_card)
    if override:
        ans = answer(
            override["summary"], override["reasoning"], override["check"], override["status"], key,
            override.get("relation"), override.get("conflict"),
        )
    elif key["state"] == "PRESENT":
        ans = answer(
            "Printed source key preserved; independent mathematical verification not run for this item.",
            ["The exact printed key is retained in answer.source_key; no independent derivation is claimed."],
            "Independent mathematical verification remains outstanding.",
            "NOT_RUN", key,
        )
    else:
        ans = answer(
            "No printed key is present in the selected source range; independent answer not established in #350.",
            ["The source item is preserved, but this source phase does not invent an answer where the selected source provides none."],
            "Requires independent mathematical solution before learner-facing use.",
            "NOT_RUN", key, "NO_KEY",
        )

    qid = "Q-MAT-POLY-" + re.sub(r"[^A-Z0-9]+", "-", item["item_id"].upper()).strip("-")
    original_identifier = f"{loc.get('section','')} {loc.get('question_number','')}".strip()
    options = list(qmeta.get("options") or [])
    subparts = list(qmeta.get("subparts") or [])
    conditions = list(qmeta.get("conditions") or [])
    has_figure = bool(qmeta.get("has_figure"))

    status = "DISPUTED" if unresolved or (override and override["status"] == "DISPUTED") else "CANDIDATE"
    row = base(qid, [resource])
    row.update({
        "status": status,
        "evidence_refs": [item["question_card"]] + ([key.get("card")] if key.get("card") else []),
        "origin": "ORIGINAL",
        "origin_ref": resource,
        "original_identifier": original_identifier,
        "stem": card.get("quote", ""),
        "subparts": subparts,
        "options": options,
        "conditions": conditions,
        "figure_refs": [],
        "answer": ans,
        "primary_capability_ref": CAPS[node],
        "secondary_capability_refs": [],
        "family_ref": FAMS[node],
        "adaptation": None,
        "exposure": [{"core": "CORE2", "role": "SOURCE_QUESTION", "artifact_ref": None}],
        "hints": [],
        "extensions": {
            "grade9v3:inventory_item": f"{INV_ID}#{item['item_id']}",
            "grade9v3:research_node": NODE,
            "grade9v3:syllabus_node": node,
            "grade9v3:scope_class": scope,
            "grade9v3:mapping_basis": mapping_basis,
            "grade9v3:provenance_class": "OWNER_SUPPLIED",
            "grade9v3:citations": {
                "stem": item["question_card"],
                "answer": key.get("card"),
            },
        },
    })

    stem_state = "UNRESOLVED" if unresolved else "PRESERVED"
    options_state = "UNRESOLVED" if unresolved and options else ("PRESERVED" if options else "NOT_PRESENT_IN_SOURCE")
    figure_state = "UNRESOLVED" if has_figure else "NOT_PRESENT_IN_SOURCE"
    proof = {
        "version": "1.0.0",
        "acquisition_ref": acq,
        "resource_ref": resource,
        "source_item_locator": f"{INV_ID}#{item['item_id']}",
        "source_digest": digest,
        "custody_mode": "EXTERNAL_REFERENCE",
        "comparison_status": "UNRESOLVED" if unresolved or has_figure else "ORIGINAL_EXACT",
        "demand_signature": source_custody.demand_signature(row),
        "components": {
            "original_identifier": "PRESERVED",
            "stem": stem_state,
            "subparts": "PRESERVED" if subparts else "NOT_PRESENT_IN_SOURCE",
            "options": options_state,
            "conditions": "PRESERVED" if conditions else "NOT_PRESENT_IN_SOURCE",
            "figures": figure_state,
            "captions": "UNRESOLVED" if has_figure else "NOT_PRESENT_IN_SOURCE",
            "hints": "NOT_PRESENT_IN_SOURCE",
            "answer_or_rubric": "EXTERNAL_REFERENCE_VERIFIED" if key["state"] == "PRESENT" else "NOT_PRESENT_IN_SOURCE",
        },
        "notes": [
            "Question stem/options are projected from the committed Reader-A evidence card.",
            "Printed key, when present, is preserved separately in answer.source_key; verification_status is authoritative for whether the mathematics was independently re-derived.",
        ],
    }
    if has_figure:
        proof["notes"].append("Source metadata indicates a figure; figure/caption custody remains unresolved in #350.")
    if unresolved:
        proof["notes"].append("Reader-A evidence still contains an explicit unresolved readback marker.")
    row["extensions"]["source_custody"] = proof
    return row, {"node": node, "scope": scope, "unresolved": unresolved or has_figure, "override": override}


def capability(rid: str, action: str, success: str) -> dict:
    row = base(rid)
    row.update({
        "action": action,
        "success_criterion": success,
        "prerequisite_refs": [],
        "curriculum_mappings": [],
        "external_provider": None,
        "acceptance_status": "CANDIDATE",
    })
    return row


def family(rid: str, title: str, cap: str) -> dict:
    row = base(rid)
    row.update({
        "title": title,
        "capability_refs": [cap],
        "solution_structure": ["Read the exact source demand.", "Select the relevant polynomial relation or identity.", "Carry out the algebra without changing source conditions."],
        "demand_dimensions": {
            "model_choice": "Select the appropriate polynomial/identity method from the source demand.",
            "representation_translation": "Translate source notation/options into a solvable algebraic form.",
            "reasoning_steps": "Varies by source item; source order is preserved independently of authoring priority.",
            "novelty": "Reference-book source items range from direct syllabus checks to extension/HOTS variants.",
        },
        "safe_variations": [],
        "transfer_boundaries": ["Source custody must remain exact; authored transfer variants are outside #350."],
        "common_wrong_routes": [],
        "item_refs": [],
    })
    return row


def micro(rid: str, title: str, cap: str, fam: str, badge: str, jump: str) -> dict:
    row = base(rid)
    step_id = rid.replace("MIC-", "STEP-")
    row.update({
        "title": title,
        "bucket_id": "BUCKET-MAT-POLYNOMIALS-SOURCE",
        "primary_capability_ref": cap,
        "intrinsic_badge": badge,
        "badge_reason": "Candidate concept difficulty for source-bank organization; downstream #352 authoring may refine it using #329 metadata.",
        "entry_assumptions": ["Basic arithmetic and symbolic manipulation appropriate to Grade 9."],
        "inferential_jump": jump,
        "teaching_path": [{
            "id": step_id, "role": "DECLARE",
            "action": "Preserve the source demand and identify the governing polynomial idea before computation.",
            "why_valid": "#350 is source-bank projection, not learner-facing teaching authoring.",
            "inputs": [], "output": "A source-faithful problem classification.",
        }],
        "relation_refs": [],
        "representation_refs": [],
        "question_family_refs": [fam],
        "misconceptions": [{
            "wrong_idea": "Treat source notation or an answer-key letter as a substitute for understanding the mathematical demand.",
            "diagnostic_prompt": "State the governing polynomial idea before using the printed key.",
            "repair": "Return to the exact source stem and classify the relation/identity being tested.",
        }],
        "exit_task": {
            "prompt": "Choose one source item in this class and state the governing idea without changing the source conditions.",
            "source_ref": M2_RESOURCE,
            "answer": answer(
                "A valid response names the governing polynomial idea and preserves the source conditions.",
                ["This is a classification check, not a new solved source item."],
                "Compare the classification with the source item's syllabus-node mapping.",
                "NOT_RUN", {"state": "ABSENT"}, "NO_KEY",
            ),
            "oracle": {"no_numeric_claim": "The exit task asks for a classification statement, not a computed value."},
        },
        "research_contribution": "Minimal source-bank organization only; complete Core1/Core1A teaching craft is outside #350.",
        "prerequisite_refs": [],
        "lineage": [],
    })
    return row


def build() -> dict:
    inv = load(INV_PATH)
    cards = _load_cards()
    spine = load(SPINE_PATH)
    valid_nodes = {n["id"] for n in spine.get("nodes", [])}
    for node in CAPS:
        if node not in valid_nodes:
            raise ValueError(f"mapped syllabus node missing from spine: {node}")

    questions = []
    mapping_counts: dict[str, int] = {}
    scope_counts: dict[str, int] = {}
    unresolved_refs = []
    verified_overrides = []
    question_items = [i for i in inv["items"] if i.get("source_role") == "QUESTION"]
    if len(question_items) != 172:
        raise ValueError(f"expected 172 QUESTION inventory items, got {len(question_items)}")
    for item in question_items:
        q, meta = make_question(item, cards)
        questions.append(q)
        mapping_counts[meta["node"]] = mapping_counts.get(meta["node"], 0) + 1
        scope_counts[meta["scope"]] = scope_counts.get(meta["scope"], 0) + 1
        if meta["unresolved"]:
            unresolved_refs.append(q["id"])
        if meta["override"]:
            verified_overrides.append(q["id"])

    fams = [
        family(FAMS["MAT-09-POLYNOMIALS-01"], "Polynomial structure, terms, coefficients and degree", CAPS["MAT-09-POLYNOMIALS-01"]),
        family(FAMS["MAT-09-POLYNOMIALS-02"], "Polynomial evaluation and linear-polynomial relations", CAPS["MAT-09-POLYNOMIALS-02"]),
        family(FAMS["MAT-09-POLYNOMIALS-03"], "Remainder, factor, zero/root and polynomial division", CAPS["MAT-09-POLYNOMIALS-03"]),
        family(FAMS["MAT-09-ALGEBRAIC-IDENTITIES-01"], "Algebraic identities, factorisation and simplification", CAPS["MAT-09-ALGEBRAIC-IDENTITIES-01"]),
    ]
    by_family: dict[str, list[str]] = {f["id"]: [] for f in fams}
    for q in questions:
        by_family[q["family_ref"]].append(q["id"])
    for f in fams:
        f["item_refs"] = by_family[f["id"]]

    bucket = base("BUCKET-MAT-POLYNOMIALS-SOURCE")
    bucket.update({
        "title": "Polynomials source corpus",
        "topic": "Polynomials",
        "intrinsic_badge": "HARD",
        "badge_reason": "Mixed source corpus includes direct checks, multi-step identities, remainder/factor problems and HOTS/Archive extensions; item difficulty remains separate.",
        "depth_overlay": "EXAM",
        "curriculum_mappings": [],
        "prerequisite_refs": [],
    })

    capabilities = [
        capability(CAPS["MAT-09-POLYNOMIALS-01"], "Classify polynomial structure, coefficients and degree", "Correctly identify the requested structural property from the exact source item."),
        capability(CAPS["MAT-09-POLYNOMIALS-02"], "Evaluate polynomial expressions and linear-polynomial relations", "Evaluate using the stated value/relationship without changing source conditions."),
        capability(CAPS["MAT-09-POLYNOMIALS-03"], "Use remainder/factor/zero/division relations", "Select and apply the appropriate polynomial theorem or division relation."),
        capability(CAPS["MAT-09-ALGEBRAIC-IDENTITIES-01"], "Use algebraic identities for expansion, factorisation and simplification", "Choose and execute an identity/factorisation route consistent with the exact source demand."),
    ]
    microtopics = [
        micro(MICS["MAT-09-POLYNOMIALS-01"], "Polynomial structure, coefficients and degree", CAPS["MAT-09-POLYNOMIALS-01"], FAMS["MAT-09-POLYNOMIALS-01"], "MEDIUM", "Read the simplified polynomial structure rather than surface notation alone."),
        micro(MICS["MAT-09-POLYNOMIALS-02"], "Polynomial evaluation and linear relations", CAPS["MAT-09-POLYNOMIALS-02"], FAMS["MAT-09-POLYNOMIALS-02"], "MEDIUM", "Translate the stated input/relation into a valid polynomial evaluation."),
        micro(MICS["MAT-09-POLYNOMIALS-03"], "Remainder, factors, zeroes and division", CAPS["MAT-09-POLYNOMIALS-03"], FAMS["MAT-09-POLYNOMIALS-03"], "HARD", "Connect divisor/root information to evaluation, factor and remainder relations."),
        micro(MICS["MAT-09-ALGEBRAIC-IDENTITIES-01"], "Algebraic identities and factorisation", CAPS["MAT-09-ALGEBRAIC-IDENTITIES-01"], FAMS["MAT-09-ALGEBRAIC-IDENTITIES-01"], "HARD", "Recognize which identity exposes the requested simplification/factorisation with least loss of structure."),
    ]

    package = {
        "schema_version": "0.2.0",
        "package_id": "LIB-MATH-POLYNOMIALS",
        "title": "Polynomials source question bank",
        "version": "0.1.0",
        "status": "CANDIDATE",
        "subject": SUBJECT,
        "scope_summary": "Owner-selected source corpus from m1 PDF pages 33-50 and m2 PDF pages 1-11. Contains 172 source QUESTION records; 40 WORKED_EXAMPLE inventory items remain evidence rather than being miscast as assessment questions.",
        "curriculum_mappings": [],
        "resources": source_records(),
        "buckets": [bucket],
        "capabilities": capabilities,
        "microtopics": microtopics,
        "relations": [],
        "representations": [],
        "question_families": fams,
        "questions": questions,
        "teaching_routes": [],
        "practice_profiles": [],
        "evidence": [],
        "known_issues": [
            {
                "id": "KI-POLY-READER-B-INDEPENDENCE",
                "affected_refs": [q["id"] for q in questions],
                "classification": "CAPABILITY_LIMIT",
                "description": "A genuinely independent Reader-B/verifier agent was not available in this execution context. Reader-A source coverage is complete and a same-agent second read corrected known defects, but that does not satisfy the repository's independent-verifier definition.",
                "next_action": "Run the prepared <=25-item blind Reader-B batches with a verifier who is not the researcher/author; record AGREED/CORRECTED/AMBIGUOUS and independent solutions in research-verification/v1.",
            },
            {
                "id": "KI-POLY-MATH-VERIFY",
                "affected_refs": [q["id"] for q in questions if q["answer"]["verification_status"] == "NOT_RUN"],
                "classification": "SCIENTIFIC_REVIEW_REQUIRED",
                "description": "Most printed source keys are preserved but not independently re-derived in #350. Known checked/conflicting items are recorded explicitly; unverified keys are not promoted to independently checked truth.",
                "next_action": "Independent verifier solves each keyed item and updates verification status/key relation without overwriting the printed source key.",
            },
            {
                "id": "KI-POLY-SOURCE-READBACK",
                "affected_refs": unresolved_refs,
                "classification": "SOURCE_CUSTODY_HELD",
                "description": "These source questions retain an explicit unresolved readback marker or an unbound source figure/caption. Their source_custody comparison remains UNRESOLVED.",
                "next_action": "Resolve the exact scan readback/figure identity before treating these items as Core2-ready.",
            },
            {
                "id": "KI-POLY-SCAN-RESOURCE-ALIASES",
                "affected_refs": [M1_RESOURCE, M2_RESOURCE],
                "classification": "ADVISORY",
                "description": "The historical acquisitions share parent resource_ref SRC-BOOK-MATH-CH2-CH3, but the canonical package needs one digest-bound resource record per exact scan. M1/M2 scan aliases retain the acquisition id and parent source family in extensions.",
                "next_action": "If source_pipeline is generalized for multi-snapshot parent resources, reconcile these scan aliases into that shared representation without losing per-scan digests.",
            },
        ],
        "extensions": {
            "grade9v3:source_inventory": INV_ID,
            "grade9v3:inventory_digest": inv["digest"],
            "grade9v3:source_role_counts": {"QUESTION": 172, "WORKED_EXAMPLE": 40},
            "grade9v3:mapping_counts": mapping_counts,
            "grade9v3:scope_counts": scope_counts,
            "grade9v3:author_checked_question_refs": verified_overrides,
            "grade9v3:reader_b_state": "NOT_RUN_INDEPENDENTLY",
        },
        "data": [],
    }
    return package


def validate(package: dict) -> list[str]:
    errors = list(schema_errors(package))
    records = build_index([package])
    seen_inventory = set()
    unresolved = 0
    resolved = 0
    for q in package["questions"]:
        ref = q["extensions"]["grade9v3:inventory_item"]
        if ref in seen_inventory:
            errors.append(f"duplicate inventory linkage: {ref}")
        seen_inventory.add(ref)
        findings = source_custody.validate_question(q, records=records, require_resolved=False, repo=REPO)
        if findings:
            errors.extend(f"{q['id']}: {f['point']}: {f['detail']}" for f in findings)
        strict = source_custody.validate_question(q, records=records, require_resolved=True, repo=REPO)
        if strict:
            unresolved += 1
        else:
            resolved += 1
    if len(package["questions"]) != 172:
        errors.append(f"question count {len(package['questions'])} != 172")
    if len(seen_inventory) != 172:
        errors.append(f"unique inventory question refs {len(seen_inventory)} != 172")
    package["extensions"]["grade9v3:resolved_source_custody_count"] = resolved
    package["extensions"]["grade9v3:unresolved_source_custody_count"] = unresolved
    return errors


def main() -> int:
    package = build()
    errors = validate(package)
    if errors:
        print(json.dumps({"passed": False, "errors": errors[:100], "error_count": len(errors)}, indent=2))
        return 1
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(package, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({
        "passed": True,
        "output": str(OUT.relative_to(REPO)),
        "questions": len(package["questions"]),
        "mapping_counts": package["extensions"]["grade9v3:mapping_counts"],
        "scope_counts": package["extensions"]["grade9v3:scope_counts"],
        "resolved_source_custody": package["extensions"]["grade9v3:resolved_source_custody_count"],
        "unresolved_source_custody": package["extensions"]["grade9v3:unresolved_source_custody_count"],
        "author_checked": len(package["extensions"]["grade9v3:author_checked_question_refs"]),
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
