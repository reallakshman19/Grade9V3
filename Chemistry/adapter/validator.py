"""Chemistry calculation seam.

The contract currently declares Chemistry validators as PROPOSED. Keeping one explicit
fail-closed entrypoint lets the subject participate in the shared publication engine
without pretending any numerical or equation validator has been implemented.
"""
from __future__ import annotations

from Shared.contracts import require

VALIDATORS = {}


def recompute(case):
    validator_id = case.get("validator_id") if isinstance(case, dict) else None
    require(False, "CHEMISTRY_VALIDATOR_UNIMPLEMENTED", str(validator_id))
