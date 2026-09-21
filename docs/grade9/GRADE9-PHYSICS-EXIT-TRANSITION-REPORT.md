# Grade-9 Physics exit and Grade-10 transition report

This view is a **derived report** over the existing Grade-9 scope audit and learner-evidence contracts. It is not a mastery percentage, probability, certification database, or new learner-state owner.

## Evidence categories

- `SECURE`: existing learner evidence proves independent demonstration.
- `USABLE_BUT_FRAGILE`: there is demonstrated work, but independence is not proven; carry an unassisted recheck.
- `KNOWN_GAP`: evidence explicitly records missing understanding/performance.
- `INSUFFICIENT_OR_UNKNOWN`: the repository does not yet have enough evidence to decide.

Unknown evidence is neither mastery nor failure.

## Transition interpretation

The report distinguishes three decision situations rather than forcing a binary grade verdict:

- `KNOWN_BLOCKER`: a required Grade-9 or genuine prerequisite gap is explicitly known. Repair it and obtain fresh verification before transition.
- `EVIDENCE_INCOMPLETE`: there is no known blocker, but required/prerequisite evidence is still unknown. Gather fresh evidence before claiming that Grade 10 is the next productive frontier.
- `NO_KNOWN_BLOCKER[_WITH_RECHECKS]`: required evidence does not show a blocker. Fragile evidence remains visible as targeted rechecks instead of becoming a hidden mastery assumption.

Enrichment, later-grade sophistication, and other non-blocking scope remain visible but do not block merely because evidence is absent or a gap is known.

## Usage

Machine-readable projection:

```bash
python3 Shared/tools/grade9_exit.py --profile-id <PROFILE_ID>
```

Parent/agent-readable Markdown:

```bash
python3 Shared/tools/grade9_exit.py --profile-id <PROFILE_ID> --format markdown
```

Every reported capability carries its scope role, evidence category, evidence basis when present, blocker disposition, repair/recheck action, and transition implication. The report is recomputed from source truth and is not persisted as grade readiness.
