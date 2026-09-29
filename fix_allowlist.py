import json

with open("Shared/tools/topic_independence_allowlist.json", "r") as f:
    data = json.load(f)

new_entries = [
    {"path": "Shared/tools/library_board.py", "reason": "Hardcoded identifiers for the tool"},
    {"path": "Shared/tools/migrate_math_linear.py", "reason": "Migration tool containing specific math paths"},
    {"path": "Shared/tools/package_depth.py", "reason": "Tool containing specific identifiers"},
    {"path": "Shared/tools/quality_observe.py", "reason": "Tool containing hardcoded subjects"},
    {"path": "Shared/tools/self_check.py", "reason": "Tool containing hardcoded docs names"},
    {"path": "Shared/tools/unit_status.py", "reason": "Tool containing hardcoded docs names"},
    {"path": "docs/data/research-first-workflow.js", "reason": "Docs scripts"},
    {"path": "evidence/stress-tests/polynomials-six-core/audit_inventory.py", "reason": "Test evidence tool"},
    {"path": "evidence/stress-tests/polynomials-six-core/prototype/build_records.py", "reason": "Test evidence prototype"},
    {"path": "public/data/research-first-workflow.js", "reason": "Generated file mirror"}
]

for entry in new_entries:
    if not any(e["path"] == entry["path"] for e in data["exclude_paths"]):
        data["exclude_paths"].append(entry)

with open("Shared/tools/topic_independence_allowlist.json", "w") as f:
    json.dump(data, f, indent=2)
