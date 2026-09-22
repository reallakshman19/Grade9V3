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
- `GRADE10_WITH_TARGETED_RECHECKS`: there is no known blocker or unknown required evidence, but required/prerequisite evidence is usable-but-fragile. Grade 10 may begin while those items receive fresh independent rechecks.
- `GRADE10_NEXT_PRODUCTIVE_FRONTIER`: there is no known required/prerequisite blocker, unknown required evidence, or fragile required/prerequisite evidence.

Enrichment, later-grade sophistication, and other non-blocking scope remain visible in both machine and parent/agent views but do not block merely because evidence is absent or a gap is known.

## Usage

Machine-readable projection:

```bash
python3 Shared/tools/grade9_exit.py --profile-id <PROFILE_ID>
```

Parent/agent-readable Markdown:

```bash
python3 Shared/tools/grade9_exit.py --profile-id <PROFILE_ID> --format text
```

Every reported capability carries its scope role, evidence category, evidence trail, blocker disposition, repair/recheck action, and transition implication. When earlier difficulty is followed by fresh independent evidence, both observations remain visible rather than being overwritten.

Changed-demand availability is derived only when canonical question truth combines a `CORE2B` exposure with canonical `transfer.dimension` metadata. A `transfer` block on a familiar `CORE2A` question is not changed-demand evidence.

Availability, learner observation, and transition-requiredness are separate. An authored changed-demand question means such a task exists; it does not by itself require an independent witness before Grade 10. Missing changed-demand evidence becomes `EVIDENCE_NEEDED` only when explicit transition authority requires it. Otherwise the report uses `AVAILABLE_UNOBSERVED` and keeps the information visible without making optional perfection a blocker.

The report is recomputed from source truth and is not persisted as grade readiness.
