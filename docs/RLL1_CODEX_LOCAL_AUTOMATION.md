# RLL-1 + Codex local automation — Grade9V3

This repository contains only a thin consumer adapter. Common Engineering Relay V3.1 owns the worker, schemas, lease/state machine, directive filtering, Codex invocation, Git postflight and evidence publication.

Required Common basis: 22d365839e64c19c7ba606e2cf4edc6b9cc2999f.

## Authority

- V3.1 engineering authority and the governing issue/plan remain authoritative.
- RLL-1 transports already-authorized work only.
- Git material truth outranks RLL state.
- rll-review-ready is not engineering PASS and never grants merge/release authority.
- Codex must not use gh, GitHub APIs, GitHub MCP, commit/push/rebase/merge, or provider credentials.
- Common's deterministic launcher owns provider state and Git-ref mutations.
- Merge/release remain direct Owner/coordinator actions outside RLL.

## Topology

~~~text
Windows Task Scheduler (10 min, overlap IgnoreNew)
  -> external installed wrapper under LOCALAPPDATA
  -> Common rll_worker.py --executor codex
  -> exact-head detached worktree or governed branch worktree
  -> Codex read-only/workspace-write sandbox
~~~

For source-writing BRANCH_RESUME, use WSL2/Linux. Common fails closed on native-Windows source writes. The immediate #332 use case is read-only EXACT_HEAD_EVIDENCE.

## Authentication and identity separation

1. On the launcher/provider identity, run gh auth login --web once and verify gh auth status. Credentials must remain in the OS credential store.
2. Do not set or persist GH_TOKEN, GITHUB_TOKEN, GH_ENTERPRISE_TOKEN, or GITHUB_ENTERPRISE_TOKEN.
3. Prefer a dedicated Codex OS identity and dedicated CODEX_HOME. Common passes no GitHub token variables to Codex.
4. Codex provider login is separate from GitHub provider authority.

## Adapter files

- .agents/rules/rll-1.md — execution boundary.
- scripts/rll1-codex-worker.ps1 — thin Common worker wrapper.
- scripts/install-rll1-codex-task.ps1 — smoke-first installer.
- tests/test_rll_codex_adapter.py — static source guard.

No worker implementation, RLL schema, lease engine or state machine is copied into Grade9V3.

## Smoke-first install

Use a fresh open smoke issue that has never reached REVIEW_READY/CANCELLED. Do not use #332 for the initial smoke.

~~~powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/install-rll1-codex-task.ps1 -RepoRoot "C:\path\to\Grade9V3" -CommonRoot "C:\path\to\Common" -PilotIssue <fresh-smoke-issue>
~~~

The installer checks prerequisites, creates/updates only the four canonical RLL labels, copies the thin worker wrapper outside the governed checkout, installs a 10-minute task with overlap suppression, and defaults to Common worker --smoke.

After smoke review, re-run the installer with -EnableExecution. This enables transport only; it does not grant engineering, merge, release or acceptance authority.

## #332 exact-head evidence envelope

Once the adapter smoke is healthy, #332 may be made eligible with the existing authorized envelope:

~~~yaml
RLL_EXECUTION_V1

transport: RLL-1
worker: codex-local
mode: EXACT_HEAD_EVIDENCE
repository: reallaksh19/Grade9V3
head_sha: 1901acfb8be5864c2b49a01690cdbb67a2c1c292
base_sha: 7515c2e5898eeea86ae56b71cdfd8f8175b8ff67
allow_material_write: false
~~~

Activation sequence:

~~~text
adapter merged/current
-> fresh smoke issue + rll-ready
-> deterministic smoke PASS
-> read-only Codex exact-head smoke PASS
-> overlap/mutex smoke PASS
-> add rll-ready to #332
-> #332 exact-head evidence
-> rll-review-ready
-> independent coordinator review
~~~

Do not add rll-ready to #332 before the adapter smoke is reviewed.

## Branch writes

Future BRANCH_RESUME is not implied by #332. It requires separately authorized engineering scope and an envelope with semicolon-delimited allowed_paths. Common enforces WSL/Linux for source writes and launcher-owned commit/push.

## Rollback

- disable/remove the Windows Scheduled Task;
- remove RLL transport labels from eligible issues;
- retain issues, branches, commits and durable engineering evidence;
- resume interactive V3.1 execution from Git truth.

Rollback never resets/rebases governed material.
