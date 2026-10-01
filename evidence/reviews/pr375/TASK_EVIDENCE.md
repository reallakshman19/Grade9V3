# TASK_EVIDENCE — PR #375 Physics Standalone Suite & Library Registration

Evidence revision: 2  
Governing recovery plan: `PHYSICS-RECOVERY-PLAN.md`  
Candidate PR: #375  
Branch: `feat/physics-tablet-standalone`  
Status: Implementation & authoring evidence; **not** Owner acceptance, publication authority, or merge authority.

---

## 1. Exact Identity & Provenance

- **Candidate PR:** #375 (`feat/physics-tablet-standalone`)
- **Authoring Receipt:** `evidence/reviews/pr375/authoring-receipt-pr375.json`
- **Receipt ID:** `REC-PR375-PHYSICS-RECOVERY-20261001`
- **Governing Blueprint:** `Shared/web/interactive-page-blueprints.v1.json` (`BP-CORE2-SOURCE-QUESTION`, `BP-CORE1A-CONSTRUCTION`)
- **Tablet Shell:** `G9-TABLET-SHELL-V1` (12.7" tablet compliant, ≥48px touch targets, ≥120px textareas, zero remote CDNs)
- **Authoring Standard:** `docs/AUTHORING-CHECKLIST.md`
- **Quality Gate Tool:** `Shared/tools/authoring_quality_gate.py`

---

## 2. Question Denominator & Library Registration Tally

| Package / Manifest | Pre-Phase 2 Count | Phase 2 Added | Total Questions | Manifest Key | SHA-256 Digest |
|---|---|---|---|---|---|
| `Physics/library/phy-kin-2d-motion.v1.json` | 15 | +196 | **211** | `challenges_2d` (59), `ncert` (19), `sba` (70), `consolidated` (48) | `e0811e7fe90e75ddf7cecf7098e6c4ea56bba46c5963cf224c3a2f3fbe39fe24` |
| `Physics/library/phy-nlm-first-law.v1.json` | 52 | +20 | **72** | `nlm_challenges` (20) | `321f5eb9f49354e60155b9a4ea9e7a9da8f993d052069fae489b02ff673fe61a` |
| `Physics/library/phy-kin-1d-motion.v1.json` | 19 | +14 | **33** | `challenges_1d` (14) | `99bc9c7e09ae2426330ce4f6aa0893fcff5345717316715694762c4a0375cf3a` |
| `Physics/library/phy-vec-add-sub.v1.json` | 11 | +14 | **25** | `challenges_vec` (14) | `bfb12ae17f9e867768e1a1795ca1555239e2354a86b976dc372f5d947230aa70` |
| **Total** | **97** | **+244** | **341** | | |

*Canonical Core Selections:* Exact canonical selections (`core2`, `core2a`, `core2b`) remain preserved across all manifests; the CI exact-denominator gate in `.github/workflows/learner-quality.yml` (L162–178) remains completely green.

---

## 3. Standalone Practice Suites Inventory (`standalone/practice/`)

All 13 modules + 1 offline navigation hub are offline-first, touch-target compliant (≥48px), and contain zero external CDN dependencies:

| File Name | Bytes | SHA-256 Digest | Questions / Category |
|---|---|---|---|
| `core1a-physics-motion-2d-ncert-tablet.html` | 37,486 | `33128409b47dc3c2166a2890a238b4adbf02efd343a48f03bce339008f885dc3` | 19 NCERT Problems |
| `core1a-physics-nlm-tablet.html` | 39,978 | `59149cbab96808810a522ae9924ad088600c77d41ec32afcfa593b63eca1c921` | 20 Newton's Laws Challenges |
| `core1a-physics-vectors-tablet.html` | 62,036 | `04ae14f57aee0a927c23b3771304048009514ebc453b4ec2bf6548fe8b6d4093` | 14 Vector Addition Challenges |
| `core1a-sba-06-07-trajectory-and-height-tablet.html` | 40,753 | `4c1f554f307518cf8157c9a09ffb16756082ecb709f0ecb9dfb0cad863bb2f63` | Trajectory & Launch from Height (SBA 06–07) |
| `core1a-sba-motion-in-a-plane-master-tablet.html` | 71,770 | `e7bb3398a26dffba6d43e1373fe674c6b3e12950a2c14adb7dbf5d751c1f9047` | 70 SBA Tasks (SBA 03–22) |
| `core2-motion-1d-straight-line-tablet.html` | 42,063 | `fe866dadc42068b4b4890f5342ea773109488d3eed7cfed6faf77e1897ed5786` | 14 1D Straight Line Challenges |
| `core2-motion-consolidated-practice-tablet.html` | 46,960 | `cf4c9835e3805252030d41ee26c109d1ad49a6fd625a5dc5a6f5660cd0e1715b` | 48 Consolidated 1D & 2D Tasks |
| `core2-motion-in-a-plane-tablet.html` | 544,980 | `b0237ac7b685906e66b808cd58035607a80d7235783a14bf00fc3759ea9723a7` | 59 2D Motion Challenges (T1–T59) |
| `core2-physics-thrust-pressure-tablet.html` | 240,846 | `18be7c2719519d68a7895b214470c0b2e570c5779ecd37a6b0ee1d30622dbd80` | 4 Competitive Olympiad PYQs + 14 SVGs |
| `core2a-projectile-study.html` | 93,540 | `b854a9515a28502f584df4c1341370f9f00d488c11316d4b698d0f971df7ed01` | Interactive Projectile Simulator |
| `index.html` | 15,760 | `011c46f8d65fd3142a4440e451f99f74270560190040fbafbacb929eb0916714` | Standalone Offline Navigation Hub (13 modules) |
| `motion-in-1d-master-suite.html` | 192,404 | `ce3d2b07038110a6a3872effc4951d0ead437b51b278ea4849e46435a90880f7` | 123+ PYQs (Inlined Tailwind utilities) |
| `motion-in-2d-master-suite.html` | 419,636 | `c783f44958468bc0ea2e5d7587d1a01b2c0e25bed9d7f43ba45637ac91d83f09` | 8 Staged Multi-Part Problems & Diagnostic Hub |
| `physics-motion-in-a-plane-interactive-suite.html` | 46,066 | `ee31f8c05b6730236597be683a15f3443ffb90c8794c8ecf325a926efaf9fbaf` | Circular Motion & Range Solver |

---

## 4. Navigation & Link Integrity Audit

Every HTML suite in `standalone/practice/` was audited for navigation completeness, broken relative links, broken internal anchor links, and touch-target compliance:

- **Files Audited:** 14 (13 learning modules + 1 navigation hub)
- **Hub Return Links:** 100% (13/13 modules include a direct, prominent `← Practice Hub` return link pointing to `index.html`)
- **Broken Relative Links:** 0 (all stylesheets, scripts, and document links resolve to existing files)
- **Broken Internal Anchors:** 0 (all `#...` fragment identifiers resolve to valid target element IDs)
- **Touch Target Compliance:** 100% of new and modified navigation buttons satisfy the ≥48px minimum touch dimension requirement.

```text
============================================================
AUDIT SUMMARY:
Files audited: 14
Total broken relative links: 0
Total broken anchor links: 0
Files missing Hub/Home link back to index.html: 0
============================================================
```

---

## 5. Verification Evidence

### Schema Validation
```powershell
python3 Shared/tools/authoring_quality_gate.py
```
```text
=== Authoring Quality Gate Audit ===
✅ PASS: Physics/library/phy-kin-2d-motion.v1.json (211 questions, 0 issues)
✅ PASS: Physics/library/phy-kin-1d-motion.v1.json (33 questions, 0 issues)
✅ PASS: Physics/library/phy-vec-add-sub.v1.json (25 questions, 0 issues)
✅ PASS: Physics/library/phy-nlm-first-law.v1.json (72 questions, 0 issues)
--------------------------------------------------
Summary: 4 files, 341 questions audited, 0 issues found.
```

### Standalone Practice & Navigation Test Suite
```powershell
py -m unittest tests/test_physics_practice_standalone.py tests/test_authoring_quality_gate.py
```
```text
..........
----------------------------------------------------------------------
Ran 10 tests in 1.258s

OK
```

All guardrail tests pass:
- `test_all_expected_files_exist`: PASS
- `test_all_modules_link_to_hub`: PASS (13/13 modules link back to `index.html`)
- `test_index_links_to_all_modules`: PASS (`index.html` links to all 13 modules)
- `test_zero_broken_relative_links`: PASS (0 broken relative paths across all files)
- `test_zero_broken_internal_anchors`: PASS (0 broken `#...` anchors across all files)
- `test_no_remote_cdn`: PASS (0 unauthorized remote CDN references)
- `test_no_user_scalable_no`: PASS (pinch zoom enabled for tablet accessibility)
- `test_maximum_scale_present`: PASS (WCAG 2.1 compliance)
- `test_core2_2d_motion_has_sufficient_questions`: PASS
- `test_registered_physics_libraries_pass_authoring_quality_gate`: PASS
