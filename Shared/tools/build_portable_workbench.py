"""Generate versioned portable workbench packages and host fixtures from one source."""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from Shared.contracts import load
from Shared.library.resolve import build_index
from Shared.portable.package import (
    CANONICAL_PROVENANCE_AUTHORITY,
    PortablePackageError,
    build_package,
)
SOURCE_DIR = ROOT / "tests/fixtures/portable-workbench/sources"


def _json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def _require(condition: bool, code: str, detail: str = "") -> None:
    if not condition:
        raise PortablePackageError(code, detail)


def _canonical_packages() -> list[dict]:
    rows: list[dict] = []
    for contract_path in sorted(ROOT.glob("*/adapter/CoreContracts.json")):
        subject_root = contract_path.parent.parent
        package_paths = sorted((subject_root / "library").glob("*.json"))
        if not package_paths:
            continue
        records = build_index([load(path) for path in package_paths])
        for resource_ref, resource in sorted(records.items()):
            if resource.get("_collection") != "resources":
                continue
            declaration = (
                (resource.get("extensions") or {})
                .get("topic_atlas", {})
                .get("portable_workbench")
            )
            if declaration is None:
                continue
            _require(isinstance(declaration, dict), "PORTABLE_CANONICAL_DECLARATION_INVALID", resource_ref)
            _require(declaration.get("resource_ref") == resource_ref, "PORTABLE_CANONICAL_RESOURCE_REF_MISMATCH", resource_ref)

            package_ref = declaration.get("package_ref")
            representation_ref = declaration.get("representation_ref")
            scene_instance_ref = declaration.get("scene_instance_ref")
            for value, code in [
                (package_ref, "PORTABLE_PACKAGE_ID_REQUIRED"),
                (representation_ref, "PORTABLE_CANONICAL_REPRESENTATION_REF_REQUIRED"),
                (scene_instance_ref, "PORTABLE_CANONICAL_SCENE_INSTANCE_REF_REQUIRED"),
            ]:
                _require(isinstance(value, str) and value.strip(), code, resource_ref)

            representation = records.get(representation_ref)
            _require(
                isinstance(representation, dict) and representation.get("_collection") == "representations",
                "PORTABLE_CANONICAL_REPRESENTATION_NOT_FOUND",
                representation_ref,
            )
            scenes = [
                row for row in representation.get("scene_instances") or []
                if row.get("id") == scene_instance_ref
            ]
            _require(len(scenes) == 1, "PORTABLE_CANONICAL_SCENE_INSTANCE_UNRESOLVED", str(scene_instance_ref))
            scene = scenes[0].get("scene")
            _require(isinstance(scene, dict), "PORTABLE_CANONICAL_SCENE_REQUIRED", str(scene_instance_ref))

            adapter = declaration.get("adapter")
            _require(isinstance(adapter, dict), "PORTABLE_ADAPTER_REQUIRED", resource_ref)
            _require(adapter.get("id") == "declarative-transfer-v1", "PORTABLE_ADAPTER_ID_UNSUPPORTED", str(adapter.get("id")))
            _require(adapter.get("api_version") == "0.1.0", "PORTABLE_ADAPTER_API_VERSION_MISMATCH", str(adapter.get("api_version")))
            actions = adapter.get("actions")
            _require(isinstance(actions, list) and actions, "PORTABLE_CANONICAL_ACTIONS_REQUIRED", resource_ref)

            rules: list[dict] = []
            rejections: list[dict] = []
            seen_actions: set[str] = set()
            for action in actions:
                action_id = action.get("id")
                _require(isinstance(action_id, str) and action_id.strip(), "PORTABLE_CANONICAL_ACTION_ID_REQUIRED")
                _require(action_id not in seen_actions, "PORTABLE_CANONICAL_ACTION_ID_DUPLICATE", action_id)
                seen_actions.add(action_id)
                source_entity_ref = action.get("source_entity_ref")
                target_ref = action.get("target_ref")
                operation = action.get("operation")
                outcome = action.get("expected_outcome")
                for value, code in [
                    (source_entity_ref, "PORTABLE_ADAPTER_SOURCE_REQUIRED"),
                    (target_ref, "PORTABLE_ADAPTER_TARGET_REQUIRED"),
                    (operation, "PORTABLE_TARGET_OPERATION_REQUIRED"),
                ]:
                    _require(isinstance(value, str) and value.strip(), code, action_id)

                if outcome == "ACCEPT":
                    transformation_ref = action.get("transformation_ref")
                    patch = action.get("patch")
                    _require(isinstance(transformation_ref, str) and transformation_ref.strip(), "PORTABLE_ADAPTER_TRANSFORMATION_REQUIRED", action_id)
                    _require(isinstance(patch, dict), "PORTABLE_ADAPTER_PATCH_REQUIRED", action_id)
                    rules.append({
                        "id": action_id,
                        "transformationRef": transformation_ref,
                        "sourceEntityRef": source_entity_ref,
                        "targetRef": target_ref,
                        "operation": operation,
                        "summary": action.get("summary") or "Canonical transformation accepted.",
                        "patch": patch,
                    })
                elif outcome == "REJECT":
                    _require("transformation_ref" not in action, "PORTABLE_REJECTION_TRANSFORMATION_FORBIDDEN", action_id)
                    reason = action.get("reason")
                    _require(isinstance(reason, str) and reason.strip(), "PORTABLE_REJECTION_REASON_REQUIRED", action_id)
                    rejections.append({
                        "id": action_id,
                        "sourceEntityRef": source_entity_ref,
                        "targetRef": target_ref,
                        "operation": operation,
                        "reason": reason,
                    })
                else:
                    raise PortablePackageError("PORTABLE_CANONICAL_ACTION_OUTCOME_INVALID", str(outcome))

            source = {
                "id": package_ref,
                "title": resource.get("title") or package_ref,
                "sourceKind": "CANONICAL_RESOURCE",
                "sourceRefs": list(resource.get("source_refs") or []),
                "representationRefs": [representation_ref],
                "assetRefs": [],
                "accessibilityRefs": list(representation.get("accessibility") or []),
                "questionBindings": [],
                "injections": [],
                "provenanceAuthority": CANONICAL_PROVENANCE_AUTHORITY,
                "resourceRef": resource_ref,
                "representationRef": representation_ref,
                "adapterRules": rules,
                "rejections": rejections,
            }
            rows.append(build_package(source, scene))
    return rows


def packages() -> list[dict]:
    rows = []
    for path in sorted(SOURCE_DIR.glob("*.json")):
        source = _json(path)
        scene = _json(ROOT / source["sceneRef"]) if source.get("sceneRef") else source["scene"]
        rows.append(build_package(source, scene))
    rows.extend(_canonical_packages())
    ids = [row["id"] for row in rows]
    _require(len(ids) == len(set(ids)), "PORTABLE_PACKAGE_ID_DUPLICATE")
    return rows


def _host_html(*, title: str, asset_base: str, package_base: str) -> str:
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title><style>:root{{--workbench-border:#64748b;--workbench-focus:#1d4ed8;--workbench-surface:#f8fafc}}body{{font:16px/1.45 system-ui,sans-serif;margin:0;padding:1rem}}main{{max-width:70rem;margin:auto}}.diagnostic{{white-space:pre-wrap;border:1px solid #b91c1c;padding:.75rem}}</style></head>
<body><main><h1>{title}</h1><p id="package-label">Loading portable package...</p><semantic-workbench id="portable-workbench"></semantic-workbench><pre id="diagnostic" class="diagnostic" hidden></pre></main>
<script type="module">
import "{asset_base}semantic-workbench.mjs";
import {{ mountPortableWorkbench }} from "{asset_base}portable-host.mjs";
const events=[];window.__portableEvents=events;const params=new URLSearchParams(location.search);
try{{const catalog=await fetch("{package_base}catalog.json").then(r=>r.json());const requested=params.get("package");if(requested&&!catalog.packageIds.includes(requested))throw new Error("PORTABLE_PACKAGE_NOT_FOUND: "+requested);const id=requested||catalog.packageIds[0];const response=await fetch("{package_base}packages/"+id+".json");if(!response.ok)throw new Error("PORTABLE_PACKAGE_LOAD_FAILED: "+id);const pkg=await response.json();const element=document.querySelector("#portable-workbench");element.addEventListener("semantic-workbench-event",e=>events.push(e.detail));mountPortableWorkbench(element,pkg);document.querySelector("#package-label").textContent=pkg.title;window.__portablePackageId=pkg.id;window.__portableWorkbenchReady=true}}catch(error){{const d=document.querySelector("#diagnostic");d.hidden=false;d.textContent=error instanceof Error?error.message:String(error);window.__portableWorkbenchError=d.textContent}}
</script></body></html>'''


def _strip_import(source: str, module_name: str) -> str:
    pattern = rf'^import\s*\{{.*?\}}\s*from\s*"{re.escape(module_name)}";\s*'
    return re.sub(pattern, "", source, count=1, flags=re.S)


def _offline_html(package_rows: list[dict]) -> str:
    runtime = (ROOT / "Shared/workbench/runtime.mjs").read_text(encoding="utf-8")
    component = _strip_import((ROOT / "Shared/workbench/semantic-workbench.mjs").read_text(encoding="utf-8"), "./runtime.mjs")
    portable = _strip_import((ROOT / "Shared/portable/portable-host.mjs").read_text(encoding="utf-8"), "../workbench/runtime.mjs")
    payload = json.dumps(package_rows, ensure_ascii=True, separators=(",", ":")).replace("</", "<\\/")
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Portable Workbench Offline Host</title><style>:root{{--workbench-border:#64748b;--workbench-focus:#1d4ed8;--workbench-surface:#f8fafc}}body{{font:16px/1.45 system-ui,sans-serif;margin:0;padding:1rem}}main{{max-width:70rem;margin:auto}}</style></head><body><main><h1>Portable Workbench Offline Host</h1><p id="package-label"></p><semantic-workbench id="portable-workbench"></semantic-workbench><pre id="diagnostic" hidden></pre></main><script type="module">
{runtime}
{component}
{portable}
const PORTABLE_PACKAGES={payload};const events=[];window.__portableEvents=events;const params=new URLSearchParams(location.search);try{{const requested=params.get("package");const pkg=requested?PORTABLE_PACKAGES.find(row=>row.id===requested):PORTABLE_PACKAGES[0];if(!pkg)throw new Error("PORTABLE_PACKAGE_NOT_FOUND: "+requested);const element=document.querySelector("#portable-workbench");element.addEventListener("semantic-workbench-event",e=>events.push(e.detail));mountPortableWorkbench(element,pkg);document.querySelector("#package-label").textContent=pkg.title;window.__portablePackageId=pkg.id;window.__portableWorkbenchReady=true}}catch(error){{const d=document.querySelector("#diagnostic");d.hidden=false;d.textContent=error instanceof Error?error.message:String(error);window.__portableWorkbenchError=d.textContent}}
</script></body></html>'''


def render() -> dict[str, bytes]:
    package_rows = packages()
    outputs: dict[str, bytes] = {}
    for package in package_rows:
        outputs[f"public/portable-workbench/packages/{package['id']}.json"] = (json.dumps(package, ensure_ascii=True, indent=2) + "\n").encode("utf-8")
    catalog = {"schemaVersion": "portable-workbench-catalog", "packageIds": [row["id"] for row in package_rows]}
    outputs["public/portable-workbench/catalog.json"] = (json.dumps(catalog, indent=2) + "\n").encode("utf-8")
    outputs["public/portable-workbench/runtime.mjs"] = (ROOT / "Shared/workbench/runtime.mjs").read_bytes()
    outputs["public/portable-workbench/semantic-workbench.mjs"] = (ROOT / "Shared/workbench/semantic-workbench.mjs").read_bytes()
    portable_host = (ROOT / "Shared/portable/portable-host.mjs").read_text(encoding="utf-8").replace('from "../workbench/runtime.mjs"', 'from "./runtime.mjs"')
    outputs["public/portable-workbench/portable-host.mjs"] = portable_host.encode("utf-8")
    outputs["public/portable-workbench/index.html"] = _host_html(title="Grade9V3 Portable Workbench Host", asset_base="./", package_base="./").encode("utf-8")
    outputs["tests/fixtures/portable-workbench/external-host.html"] = _host_html(title="External Plain HTML Portable Workbench Host", asset_base="/public/portable-workbench/", package_base="/public/portable-workbench/").encode("utf-8")
    outputs["standalone/portable-workbench/index.html"] = _offline_html(package_rows).encode("utf-8")
    return outputs


def write() -> None:
    for relative, content in render().items():
        path = ROOT / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
        print(f"wrote {relative}")


def check() -> int:
    drift = []
    for relative, expected in render().items():
        path = ROOT / relative
        if not path.exists() or path.read_bytes() != expected:
            drift.append(relative)
    if drift:
        print("portable workbench generated artifacts have drifted:")
        for relative in drift:
            print(f"  {relative}")
        return 1
    print("portable workbench generated artifacts are current")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.check:
        return check()
    write()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
