from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

EXPECTED_CANVAS_PAGES = {
    "public/chemistry/bonding/explorers/chemical_bonding/index.html",
    "public/chemistry/gases/explorers/behaviour_of_gases/index.html",
    "public/chemistry/redox/explorers/redox_reactions/index.html",
    "public/chemistry/some-basic-concepts/explorers/mole_concept/index.html",
    "public/mathematics/vectors/explorers/vector_algebra/index.html",
    "public/physics/motion-1d/explorers/circular-dynamics/index.html",
    "public/physics/motion-1d/explorers/motion_in_1d/index.html",
    "public/physics/nlm/explorers/accelerated-frames/index.html",
    "public/physics/nlm/explorers/atwood-pulleys/index.html",
    "public/physics/nlm/explorers/connected-blocks/index.html",
    "public/physics/nlm/explorers/friction-threshold/index.html",
    "standalone/chemistry-behaviour-of-gases-master-suite.html",
    "standalone/chemistry-chemical-bonding-master-suite.html",
    "standalone/chemistry-mole-concept-master-suite.html",
    "standalone/chemistry-redox-reactions-master-suite.html",
    "standalone/motion-in-1d-master-suite.html",
    "standalone/vector-algebra-3d-master-suite.html",
}

ORBIT_PAGES = {
    "public/mathematics/vectors/explorers/vector_algebra/index.html",
    "standalone/vector-algebra-3d-master-suite.html",
    "public/chemistry/bonding/explorers/chemical_bonding/index.html",
    "standalone/chemistry-chemical-bonding-master-suite.html",
}


def _read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def test_canvas_page_inventory_is_explicit() -> None:
    actual: set[str] = set()
    for root_name in ("public", "standalone"):
        for page in (ROOT / root_name).rglob("*.html"):
            text = page.read_text(encoding="utf-8")
            if "<canvas" in text:
                actual.add(page.relative_to(ROOT).as_posix())
    assert actual == EXPECTED_CANVAS_PAGES


def test_orbit_redraws_do_not_resize_backing_store_mid_drag() -> None:
    for relative in ORBIT_PAGES:
        text = _read(relative)
        assert "g9PointerActive" in text, relative
        assert "canvas.dataset.g9PointerActive = '1'" in text, relative
        assert "delete canvas.dataset.g9PointerActive" in text, relative
        assert "setPointerCapture" in text, relative
        assert "releasePointerCapture" in text, relative
        assert "touchAction = 'none'" in text or "touch-action: none" in text, relative
        # setupCanvas must explicitly suppress bitmap mutation while orbitLocked.
        assert "if (!orbitLocked" in text, relative


def test_vector_orbit_is_rotation_not_zoom() -> None:
    for relative in (
        "public/mathematics/vectors/explorers/vector_algebra/index.html",
        "standalone/vector-algebra-3d-master-suite.html",
    ):
        text = _read(relative)
        assert "Orthographic orbit" in text, relative
        assert "cameraDist = 25" not in text, relative
        assert "cameraDist / (cameraDist +" not in text, relative

    standalone = _read("standalone/vector-algebra-3d-master-suite.html")
    assert "Fit from the 3D radius, which is invariant under orbit rotation." in standalone


def test_atwood_graph_uses_pointer_events_and_css_to_intrinsic_mapping() -> None:
    text = _read("public/physics/nlm/explorers/atwood-pulleys/index.html")
    assert "graphPointFromEvent" in text
    assert "graphCanvas.width / rect.width" in text
    assert "graphCanvas.height / rect.height" in text
    assert "addEventListener('pointerdown'" in text
    assert "addEventListener('pointermove'" in text
    assert "setPointerCapture" in text
    assert "releasePointerCapture" in text
    assert "addEventListener('mousedown'" not in text
    assert "graphCanvas.style.touchAction = 'none'" in text


def test_friction_graph_keeps_pointer_and_coordinate_repair() -> None:
    text = _read("public/physics/nlm/explorers/friction-threshold/index.html")
    assert "graphPointFromEvent" in text
    assert "graphCanvas.width / rect.width" in text
    assert "graphCanvas.height / rect.height" in text
    assert "addEventListener('pointerdown'" in text
    assert "setPointerCapture" in text
    assert "touch-action: none" in text


def test_connected_blocks_canvas_fills_fixed_parent_without_pixel_css_feedback() -> None:
    text = _read("public/physics/nlm/explorers/connected-blocks/index.html")
    setup = re.search(r"function setupCanvas\(canvas\) \{(?P<body>[\s\S]*?)\n  \}", text)
    assert setup is not None
    body = setup.group("body")
    assert "parent.clientWidth" in body
    assert "parent.clientHeight" in body
    assert "canvas.style.width = '100%'" in body
    assert "canvas.style.height = '100%'" in body
    assert "canvas.style.width = cssW + 'px'" not in body
    assert "canvas.style.height = cssH + 'px'" not in body
    assert "ctx.setTransform(dpr, 0, 0, dpr, 0, 0)" in body


def test_static_legacy_canvas_pages_have_no_drag_handlers() -> None:
    for relative in (
        "public/physics/motion-1d/explorers/circular-dynamics/index.html",
        "public/physics/nlm/explorers/accelerated-frames/index.html",
    ):
        text = _read(relative)
        assert "addEventListener('pointermove'" not in text, relative
        assert "addEventListener('mousedown'" not in text, relative
