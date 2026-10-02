"""Source-bound Chemistry representation scenes.

PARTICLE_DIAGRAM is deliberately a static representational model. It draws only
declared particle-count data and names the representation level on the figure. Every
scene must also state that it is not a reaction/collision mechanism; a static diagram
must not silently become a microscopic movie.
"""
from __future__ import annotations

import math
from html import escape
from xml.etree import ElementTree as ET

from Shared.contracts import require, text
from Shared.publication_host.drawing import WIDTH, bound_atom, label, line, svg

HEIGHT = 330
RADIUS = 15


def _count(ctx, block, atom_id):
    value = bound_atom(ctx, block, atom_id, "count")
    number = float(value)
    require(math.isfinite(number) and number.is_integer(), "PARTICLE_COUNT_INTEGER_REQUIRED", atom_id)
    count = int(number)
    require(1 <= count <= 24, "PARTICLE_COUNT_OUT_OF_RANGE", atom_id)
    return count


def _circle(x, y, group, symbol):
    safe_group = escape(group, quote=True)
    safe_symbol = escape(symbol)
    return (
        f'<circle cx="{x:.3f}" cy="{y:.3f}" r="{RADIUS}" '
        f'fill="#e9f2f8" stroke="#135b89" stroke-width="2" '
        f'data-particle-group="{safe_group}"/>'
        f'<text x="{x:.3f}" y="{y + 5:.3f}" text-anchor="middle" '
        f'font-size="11" font-weight="700">{safe_symbol}</text>'
    )


def _row_layout(groups):
    rows = []
    y = 105
    evidence = []
    for group in groups:
        count = group["count"]
        name = group["label"]
        symbol = group["symbol"]
        rows.append(label(28, y - 24, f"{name} × {count}", "start"))
        gap = 42
        start = 52
        max_per_row = 10
        for index in range(count):
            row = index // max_per_row
            col = index % max_per_row
            x = start + col * gap
            cy = y + row * 42
            rows.append(_circle(x, cy, name, symbol))
        used_rows = (count - 1) // max_per_row + 1
        evidence.append({"label": name, "symbol": symbol, "count": count})
        y += max(72, used_rows * 42 + 40)
    return rows, evidence, max(HEIGHT, y + 40)


def _central_shell(groups, geometry):
    require(len(groups) >= 2, "PARTICLE_CENTRAL_SHELL_GROUPS_REQUIRED")
    centre, shell = groups[0], groups[1]
    require(centre["count"] == 1, "PARTICLE_CENTRAL_COUNT_REQUIRED")
    require(1 <= shell["count"] <= 8, "PARTICLE_SHELL_COUNT_UNSUPPORTED")
    cx, cy = WIDTH / 2, 165
    rows = [_circle(cx, cy, centre["label"], centre["symbol"])]
    positions = []
    if geometry == "TRIGONAL_BIPYRAMIDAL":
        require(shell["count"] == 5, "PARTICLE_GEOMETRY_COUNT_MISMATCH", geometry)
        positions = [
            (cx, cy - 115), (cx, cy + 115),
            (cx - 115, cy), (cx + 82, cy - 72), (cx + 82, cy + 72),
        ]
        # Separate the two conceptual sets explicitly; this is a 2-D schematic, not
        # a claim that every bond lies in the page.
        rows.append(label(24, 58, "2 axial + 3 equatorial directions (schematic)", "start"))
    else:
        radius = 105
        for index in range(shell["count"]):
            angle = -math.pi / 2 + 2 * math.pi * index / shell["count"]
            positions.append((cx + radius * math.cos(angle), cy + radius * math.sin(angle)))
    for x, y in positions:
        rows.append(line((cx, cy), (x, y), stroke="#94a3b8", stroke_dasharray="4 3"))
        rows.append(_circle(x, y, shell["label"], shell["symbol"]))
    evidence = [
        {"label": centre["label"], "symbol": centre["symbol"], "count": centre["count"]},
        {"label": shell["label"], "symbol": shell["symbol"], "count": shell["count"]},
    ]
    return rows, evidence, HEIGHT


def particle_diagram(ctx, block):
    spec = block["scene"]
    level = text(spec.get("representation_level"), "CHEMISTRY_REPRESENTATION_LEVEL_REQUIRED")
    mechanism_note = text(spec.get("mechanism_note"), "CHEMISTRY_MECHANISM_LIMIT_REQUIRED")
    groups_spec = spec.get("groups")
    require(isinstance(groups_spec, list) and groups_spec, "PARTICLE_GROUPS_REQUIRED")

    groups = []
    for index, row in enumerate(groups_spec):
        require(isinstance(row, dict), "PARTICLE_GROUP_INVALID", str(index))
        name = text(row.get("label"), "PARTICLE_IDENTITY_REQUIRED")
        symbol = text(row.get("symbol"), "PARTICLE_SYMBOL_REQUIRED")
        atom = text(row.get("count_atom"), "PARTICLE_COUNT_ATOM_REQUIRED")
        groups.append({"label": name, "symbol": symbol, "count": _count(ctx, block, atom)})

    layout = spec.get("layout", "ROWS")
    if layout == "CENTRAL_SHELL":
        rows, evidence_groups, height = _central_shell(groups, spec.get("geometry"))
    else:
        require(layout == "ROWS", "PARTICLE_LAYOUT_UNSUPPORTED", str(layout))
        rows, evidence_groups, height = _row_layout(groups)

    rows.insert(0, label(24, 28, f"Representation level: {level}", "start"))
    annotation = spec.get("annotation")
    if isinstance(annotation, str) and annotation.strip():
        rows.insert(1, label(24, 52, annotation, "start"))
    rows.append(label(24, height - 18, f"Model limit: {mechanism_note}", "start"))
    return svg(
        block,
        rows,
        {
            "kind": "PARTICLE_DIAGRAM",
            "representation_level": level,
            "groups": evidence_groups,
            "mechanism_note": mechanism_note,
            "layout": layout,
        },
        WIDTH,
        height,
    )


def _equation_atom(ctx, block, atom_id):
    require(atom_id in block["source_atom_ids"], "FIGURE_SOURCE_BINDING_MISSING", atom_id)
    atom = ctx["atoms"].get(atom_id)
    require(isinstance(atom, dict) and atom.get("kind") == "EQUATION",
            "CHEMISTRY_EQUATION_ATOM_REQUIRED", atom_id)
    value = text(atom.get("value"), "CHEMISTRY_EQUATION_VALUE_REQUIRED")
    require("<!" not in value, "MATHML_DECLARATION_FORBIDDEN")
    root = ET.fromstring(value)
    require(root.tag.split("}")[-1] == "math", "MATHML_ROOT_REQUIRED")
    allowed = {"math", "mrow", "mi", "mn", "mo", "mfrac", "msqrt", "msup", "msub",
               "msubsup", "mover", "munder", "munderover", "mtable", "mtr", "mtd", "mtext"}
    for node in root.iter():
        require(node.tag.split("}")[-1] in allowed, "MATHML_TAG_UNSUPPORTED")
        require(set(node.attrib) <= {"display", "mathvariant"}, "MATHML_ATTRIBUTE_UNSUPPORTED")
    rendered = "".join(root.itertext()).strip()
    require(bool(rendered), "CHEMISTRY_EQUATION_TEXT_REQUIRED", atom_id)
    return rendered


def symbolic_equation(ctx, block):
    """One source-bound symbolic relation with explicit chemistry notation limits."""
    spec = block["scene"]
    atom_id = text(spec.get("equation_atom"), "CHEMISTRY_EQUATION_ATOM_REQUIRED")
    equation = _equation_atom(ctx, block, atom_id)
    coefficient_note = text(spec.get("coefficient_note"), "CHEMISTRY_COEFFICIENT_NOTE_REQUIRED")
    charge_note = text(spec.get("charge_note"), "CHEMISTRY_CHARGE_NOTE_REQUIRED")
    phase_note = text(spec.get("phase_note"), "CHEMISTRY_PHASE_NOTE_REQUIRED")
    arrow_note = text(spec.get("arrow_note"), "CHEMISTRY_ARROW_NOTE_REQUIRED")
    annotation = text(spec.get("annotation"), "CHEMISTRY_EQUATION_ANNOTATION_REQUIRED")

    rows = [
        label(24, 32, "Symbolic chemistry relation", "start"),
        f'<text x="{WIDTH / 2:.3f}" y="112" text-anchor="middle" font-size="28" '
        f'font-weight="700">{escape(equation)}</text>',
        label(24, 160, annotation, "start"),
        label(24, 205, f"Coefficient/subscript scope: {coefficient_note}", "start"),
        label(24, 235, f"Charge scope: {charge_note}", "start"),
        label(24, 265, f"Phase-label scope: {phase_note}", "start"),
        label(24, 295, f"Arrow scope: {arrow_note}", "start"),
    ]
    return svg(
        block,
        rows,
        {
            "kind": "SYMBOLIC_EQUATION",
            "equation_atom": atom_id,
            "equation_text": equation,
            "coefficient_note": coefficient_note,
            "charge_note": charge_note,
            "phase_note": phase_note,
            "arrow_note": arrow_note,
        },
        WIDTH,
        HEIGHT,
    )


SCENES = {"PARTICLE_DIAGRAM": particle_diagram, "SYMBOLIC_EQUATION": symbolic_equation}
