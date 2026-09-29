import json
import os

with open("Shared/tools/topic_independence_allowlist.json", "r") as f:
    data = json.load(f)

data["exclude_paths"].append({
    "path": "evidence/stress-tests/polynomials-six-core",
    "reason": "Test evidence containing hardcoded strings related to Polynomials module testing."
})

with open("Shared/tools/topic_independence_allowlist.json", "w") as f:
    json.dump(data, f, indent=2)
