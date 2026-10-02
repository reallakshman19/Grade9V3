"""Chemistry adapter: contract, source-bound particle scenes and fail-closed calculation seam.

Only capabilities implemented in this package are marked IMPLEMENTED in CoreContracts.
The Chemistry numerical validators remain PROPOSED; recompute therefore fails closed.
"""
from __future__ import annotations

from pathlib import Path

from Shared.publication_host.adapter import Adapter, load_contract

from .scenes import SCENES
from .validator import recompute

HERE = Path(__file__).resolve().parent
SUBJECT_ROOT = HERE.parent
CONTRACT = HERE / "CoreContracts.json"


def runtime_files() -> list[Path]:
    """Subject files required to rebuild a staged Chemistry learner product."""
    files = [CONTRACT]
    run = SUBJECT_ROOT / "run.py"
    if run.is_file():
        files.append(run)
    files += sorted(HERE.glob("*.py"))
    return [p for p in files if p.is_file()]


def load() -> Adapter:
    return Adapter(
        contract=load_contract(CONTRACT),
        recompute=recompute,
        scenes=SCENES,
        runtime_files=runtime_files,
    )
