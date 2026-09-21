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
python3 Shared/tools/grade9_exit.py --profile-id <PROFILE_ID> --format markdown
```

Every reported capability carries its scope role, evidence category, evidence trail, blocker disposition, repair/recheck action, and transition implication. When earlier difficulty is followed by fresh independent evidence, both observations remain visible rather than being overwritten.

For required domains that actually author canonical transfer questions, the projection also asks for one independent changed-demand witness at domain level. Today that applies only where the canonical library exposes such questions; it does not manufacture a transfer requirement for domains with no authored transfer witness. This keeps the check sparse while preventing ordinary same-form success from masquerading as transfer.

The report is recomputed from source truth and is not persisted as grade readiness.
