# Security Dependency Remediation — Pre-Plan-034 Gate

You are the implementation agent responsible for eliminating or truthfully resolving the repository's current dependency-security findings **before Plan 034 starts**.

This is a dedicated security-maintenance task. It is not Plan 034 and must not broaden product scope.

## Absolute workspace

Repository root:

`/home/farismnrr/Projects/situm-explore`

Required maintenance branch:

`chore/security-dependency-remediation`

Create it from the latest clean `origin/main`. Do not implement directly on `main`.

This brief itself is expected to exist as an untracked file on `main` when you begin:

`/home/farismnrr/Projects/situm-explore/.agents/execution/security-dependency-remediation.md`

Preserve it when creating the maintenance branch and include it in the security-remediation commit(s). Do not delete it as “unrelated”.

## Mission

Bring dependency security to an industry-grade state before Plan 034:

1. remediate every dependency vulnerability that has a safe, supportable remediation path;
2. do not hide findings through dismissals, audit configuration, package downgrades, or unsupported dependency surgery;
3. preserve the approved Expo / React Native / Situm compatibility boundary unless verified security evidence requires a compatible change;
4. validate the full web + native build/runtime toolchain after dependency changes;
5. prove the final dependency graph and security state from fresh installs/lockfile resolution;
6. document any genuinely upstream-unpatched residual finding with exact exploitability and compensating-control evidence — never claim “zero vulnerabilities” if one actually remains;
7. commit and push the maintenance branch, but **do not open a PR, merge, or start Plan 034**.

The goal is real risk removal, not making a scanner print a prettier number.

---

# 0. Required reading and startup safety

Before changing anything, read in this order:

1. `/home/farismnrr/Projects/situm-explore/AGENTS.md`
2. `/home/farismnrr/Projects/situm-explore/.agents/state.md`
3. `/home/farismnrr/Projects/situm-explore/.agents/protocols/git-workflow.md`
4. this brief
5. `/home/farismnrr/Projects/situm-explore/.agents/memory/decisions.md`
6. `/home/farismnrr/Projects/situm-explore/ARCHITECTURE.md`
7. `/home/farismnrr/Projects/situm-explore/DESIGN.md`
8. `/home/farismnrr/Projects/situm-explore/plans/034-full-e2e-acceptance.md`
9. relevant dependency/version evidence under `.agents/`, especially Plans 028–033 where Expo / React Native / Situm compatibility was frozen.

Then verify:

```bash
cd /home/farismnrr/Projects/situm-explore
git status --short
git branch --show-current
git fetch origin
git rev-parse HEAD
git rev-parse origin/main
git worktree list --porcelain
```

Expected starting point:

- current branch is `main`;
- local `main` is synchronized with `origin/main` or can be safely fast-forwarded;
- no unrelated tracked changes exist;
- this remediation brief may be the only untracked change.

If safe, synchronize and create the dedicated branch:

```bash
git switch main
git pull --ff-only origin main
git switch -c chore/security-dependency-remediation origin/main
```

Do not use `git reset --hard`, `git clean -fd`, force-push, history rewriting, or destructive shortcuts.

---

# 1. Current verified vulnerability baseline

This baseline was independently measured on 2026-08-18 after Plan 033 merged to `main`.

## Root application

From `/home/farismnrr/Projects/situm-explore`:

```bash
npm audit --json
```

Current result:

- 0 critical
- 0 high
- 0 moderate
- 0 low
- **0 total vulnerabilities**

Do not regress this.

## GitHub Dependabot — currently open alerts

Repository:

`farismnrr/situm-explore`

There are currently **3 open Dependabot alerts**, all against:

`/home/farismnrr/Projects/situm-explore/mobile/package-lock.json`

### Alert #5 — HIGH

- package: `image-size`
- advisory: `GHSA-w3rx-r6r6-pgpr`
- CVE: `CVE-2025-71330`
- summary: ICNS parser denial of service through an infinite loop
- vulnerable range: `<= 2.0.2`
- GitHub currently reports no `first_patched_version`
- installed version: `1.2.1`

Verified dependency path:

```text
expo@57.0.13
└─ @expo/metro@56.0.0
   └─ metro@0.84.4
      └─ image-size@1.2.1
```

### Alert #4 — HIGH

- package: `image-size`
- advisory: `GHSA-5p2g-fcmc-qvqq`
- CVE: `CVE-2025-71329`
- summary: JXL and HEIF parsers denial of service through infinite loops
- vulnerable range: `<= 2.0.2`
- GitHub currently reports no `first_patched_version`
- installed version: `1.2.1`

Same dependency path as Alert #5.

### Alert #3 — MEDIUM

- package: `uuid`
- advisory: `GHSA-w5hq-g745-h8pq`
- CVE: `CVE-2026-41907`
- summary: missing buffer bounds check in UUID v3/v5/v6 when a caller-provided buffer is used
- vulnerable range: `< 11.1.1`
- first patched version: `11.1.1`
- installed version: `7.0.3`

Verified dependency path:

```text
expo@57.0.13
└─ @expo/config-plugins@57.0.8
   └─ xcode@3.0.1
      └─ uuid@7.0.3
```

Verified parent constraints at baseline:

- `metro@0.84.4` declares `image-size: ^1.0.2`
- `xcode@3.0.1` declares `uuid: ^7.0.3`
- `@expo/config-plugins@57.0.8` declares `xcode: ^3.0.1`

Registry state observed at baseline:

- latest published `image-size`: `2.0.2`
- latest published `uuid`: `14.0.1`
- latest published `xcode`: `3.0.1`
- `uuid@11.1.1` supports Node `>=16.x`

**Important:** because both `image-size` advisories currently cover `<=2.0.2` and the registry latest observed version is `2.0.2`, blindly overriding to the latest `image-size` does **not** constitute remediation.

## Mobile npm audit baseline

From `/home/farismnrr/Projects/situm-explore/mobile`:

```bash
npm audit --json
```

Current npm audit aggregates **18 dependency-tree findings**:

- 11 high
- 7 moderate
- 0 critical

Many are propagation through Expo / Metro / React Native dependency relationships rather than 18 independent CVEs. npm currently proposes obviously incompatible “fixes” such as:

- downgrading `expo` from 57.x to 53.x;
- downgrading `react-native` from 0.86.x to 0.72.x.

Those suggestions are **not acceptable merely to make `npm audit` green**.

You must reason from the underlying advisories and actual dependency graph, not blindly follow npm's suggested replacement versions.

---

# 2. Approved dependency boundary and security-change authority

Current product stack before this task:

- Expo `57.0.13`
- React Native `0.86.2`
- React `19.2.3`
- `@situm/react-native` `3.19.2`
- `react-native-webview` `13.16.1`
- `expo-build-properties` `57.0.11`
- `expo-secure-store` `~57.0.1`
- Android min / compile / target 24 / 36 / 36
- JDK 21.0.10
- Kotlin 2.1.20
- Gradle 9.3.1

Earlier roadmap work intentionally froze these versions for acceptance stability.

The user's present security-remediation request provides explicit authority to make **minimal compatible dependency changes necessary to remove vulnerabilities**, including compatible patch-level Expo ecosystem updates, lockfile changes, and narrowly justified package overrides.

It does **not** authorize:

- arbitrary major framework migrations;
- downgrading Expo / React Native to old branches;
- changing Situm SDK major/minor behavior without necessity;
- changing product functionality;
- changing backend/session/credential architecture;
- adding unrelated dependencies or tooling;
- weakening audit/scanner configuration;
- dismissing GitHub alerts merely to make the dashboard green.

Preserve Expo 57 / RN 0.86 / Situm 3.19.2 unless a verified compatible security fix absolutely requires otherwise. If a version change is needed, prove compatibility from primary/official package sources and actual build/runtime checks.

Prefer the **smallest patched version**, not “latest everything”.

---

# 3. Remediation methodology — mandatory

Treat each underlying advisory independently.

For each advisory:

1. confirm current advisory data from an authoritative source (GitHub Security Advisory, package maintainer advisory/release, npm registry metadata, or upstream repository);
2. map every vulnerable installed path using `npm ls` / lockfile inspection;
3. determine whether the vulnerable code is runtime, build-time, development-only, or unreachable;
4. identify the smallest safe remediation path;
5. verify compatibility with Expo 57 / RN 0.86 / Situm 3.19.2;
6. implement the remediation through a normal dependency declaration/lockfile mechanism;
7. perform a clean reinstall and prove the resolved versions;
8. rerun audit/scanners plus full app validation;
9. document exact evidence.

Do not treat scanner severity alone as exploitability proof, but also do not dismiss scanner findings merely because the package is transitive.

---

# 4. UUID remediation requirement

`uuid@7.0.3` is below the patched threshold `11.1.1`.

This finding is expected to be actionable.

## Required investigation

Inspect the exact installed `xcode@3.0.1` usage of `uuid` and determine which UUID APIs are actually called. Verify whether `uuid@11.1.1` is API-compatible for those calls under the current Node/toolchain.

A narrowly scoped npm `overrides` entry is an acceptable candidate **only if compatibility is proven**.

Preferred principles:

- use the minimum patched safe version (`>=11.1.1`) rather than jumping to 14.x without reason;
- avoid forking `xcode` or Expo if a safe override is sufficient;
- do not add a direct application dependency on `uuid` unless the app itself actually needs it;
- prove Expo config/prebuild behavior still works after the override.

## UUID acceptance

After remediation, all of the following must hold:

```bash
cd /home/farismnrr/Projects/situm-explore/mobile
npm ls uuid --all
```

must show **no installed `uuid` below 11.1.1 on the vulnerable path**.

`npm audit` / Dependabot must no longer report `GHSA-w5hq-g745-h8pq` for the resolved dependency graph once GitHub evaluates the committed lockfile.

Expo config and clean prebuild must still pass.

---

# 5. image-size remediation requirement

This is the harder part. At the verified baseline:

- installed: `image-size@1.2.1`
- latest registry version observed: `2.0.2`
- both active advisories affect `<=2.0.2`
- GitHub reports no patched release

Therefore **do not** claim this is solved by bumping `image-size` to 2.0.2.

## Required investigation order

Follow this order and document each result.

### A. Check whether an upstream patched release or commit now exists

Re-query authoritative current sources at execution time. The advisory/package state may have changed after this brief was written.

If a patched `image-size` release exists now:

- determine whether current Metro accepts it naturally or via a compatible override;
- use the minimum patched version;
- validate Metro/Expo bundling and clean prebuild/build.

### B. Check for a compatible Expo 57 / Metro patch that removes or replaces the vulnerable dependency

Inspect current Expo 57-compatible patch releases and Metro versions supported by Expo/RN.

A compatible Expo 57 patch update is allowed when it actually changes the vulnerable dependency path and full validation passes.

Do not move to Expo 53, downgrade React Native, or independently force a Metro version outside the supported Expo/RN matrix.

### C. Check whether the vulnerable parser path can be removed through an upstream-supported package configuration or package replacement

If Metro only needs dimensions for a bounded asset set and an upstream-supported newer dependency path removes `image-size`, prefer that supported path over local patching.

Do not modify app assets or silently ban valid product image formats just to suppress the advisory unless the product explicitly does not support those formats and the restriction is enforced and documented.

### D. If no patched release exists, inspect authoritative upstream fix work

If the maintainers have an accepted fix commit/PR but no release yet:

- only consider pinning an upstream maintainer-owned immutable commit if the fix is clearly authoritative, reviewable, and compatible;
- pin by immutable commit SHA, not a floating branch/tag;
- document why using an unreleased upstream commit is safer than retaining the known vulnerable release;
- validate integrity/reproducibility and the complete mobile toolchain.

Do **not** pull an arbitrary third-party fork.

### E. Last resort: bounded local patch only with proof

If no released/upstream-consumable remediation exists but the vulnerability is directly repairable with a small, auditable patch, a local reproducible patch mechanism may be considered only if all of the following are true:

- the exact vulnerable loop/parser behavior is understood from the advisory/upstream source;
- the patch is minimal and tied directly to the advisory;
- regression tests reproduce the vulnerable behavior without causing an actual unbounded hang in the test runner;
- patched behavior is deterministic and bounded;
- the patch survives a clean install reproducibly;
- Metro/Expo behavior remains supported;
- the solution does not merely falsify package version metadata to evade Dependabot;
- the evidence explains that the package is locally patched until an upstream release is available.

Do not invent security patches from guesswork.

### F. If genuinely impossible to remediate safely

If, after authoritative investigation, no safe released, upstream-commit, supported dependency-path, or auditable local-patch remediation exists:

- **do not dismiss the alert**;
- **do not claim 10/10 / zero vulnerabilities**;
- mark the security gate `BLOCKED — upstream unpatched`;
- document exact advisory, vulnerable code path, whether production/runtime exposure exists, how Metro reaches it, and concrete compensating controls;
- identify the exact upstream event/version that would unblock closure;
- stop before Plan 034 and report the blocker.

Industry-grade security means truthful risk ownership, not dashboard cosmetics.

---

# 6. npm audit aggregation review

After fixing the underlying `uuid` and `image-size` advisories, rerun:

```bash
cd /home/farismnrr/Projects/situm-explore/mobile
npm audit --json
npm audit --omit=dev --json
```

Review every remaining underlying advisory, not just package-level propagation counts.

For each remaining finding:

- record advisory ID;
- vulnerable package/version/path;
- patched version or absence thereof;
- actual package scope;
- remediation taken or reason it remains blocked.

Do not assume that the current three GitHub Dependabot alerts are the only possible actionable advisories. If npm audit reveals another distinct underlying advisory with a safe compatible fix, remediate it too.

Conversely, do not perform a destructive framework downgrade just because npm's generic `fixAvailable` metadata suggests one.

The desired end state is:

- **zero critical/high/moderate actionable vulnerabilities** in the actual resolved graph;
- ideally `npm audit` total = 0;
- if scanner aggregation remains because an upstream advisory has no safe fix, evidence must clearly distinguish the residual from already-remediated paths.

Do not use `npm audit fix --force`.

---

# 7. Lockfile and reproducibility requirements

Dependency security changes must be reproducible.

Required checks:

1. update `package.json` only where needed;
2. regenerate/update `mobile/package-lock.json` through npm, not manual lockfile editing;
3. do not edit integrity hashes manually;
4. verify `npm ci` from the committed lockfile succeeds;
5. verify `npm ls` has no invalid/extraneous dependency state;
6. verify exact remediated versions after clean install;
7. no Git URL may float on a branch if a temporary upstream commit pin is necessary — use immutable SHA;
8. do not commit `node_modules`, generated Android/iOS trees, caches, APKs, credentials, or `.env` files.

If an npm `overrides` section is used, keep it narrowly scoped and add a concise nearby durable explanation in repository security/evidence documentation, including the advisory that justifies it.

---

# 8. Full validation gate

After dependency remediation, perform a fresh, clean validation. At minimum:

## Root

From:

`/home/farismnrr/Projects/situm-explore`

Run:

```bash
npm ci
npm audit --json
npm test
npm run lint
npm run typecheck
npm run build
```

Expected:

- root audit remains 0 actionable vulnerabilities;
- tests all pass;
- lint passes;
- typecheck passes;
- production build passes.

## Mobile dependency integrity

From:

`/home/farismnrr/Projects/situm-explore/mobile`

Run from a clean dependency install:

```bash
npm ci
npm ls --all
npm audit --json
npm audit --omit=dev --json
npm run lint
npm run typecheck
npx expo config --type public
npx expo-doctor
```

`expo-doctor` may still report the repository's already-known Situm New Architecture metadata warning and approved patch-version warning **only if those exact warnings remain valid after your dependency changes**. Re-evaluate them; do not blindly copy old evidence.

If a safe compatible Expo patch update removes an old doctor warning, update the evidence accordingly.

## Clean native generation/build

Run:

```bash
cd /home/farismnrr/Projects/situm-explore/mobile
npx expo prebuild --clean --no-install
cd android
./gradlew assembleDebug
```

Use the configured Android SDK:

`/home/farismnrr/Android/Sdk`

The Android debug build must pass.

Generated native directories remain generated/ignored unless repository policy says otherwise.

## Production server smoke

Re-run a bounded production server smoke against the freshly built root app:

- `/` returns HTTP 200;
- `/api/me` unauthenticated returns HTTP 401;
- expected security headers remain present;
- no dependency change alters auth/session behavior.

## Source/security hygiene

Run bounded scans for:

- committed secrets/tokens/credentials;
- accidental `.env` or generated artifact inclusion;
- insecure registry/Git dependency URLs;
- floating Git dependencies;
- audit suppression/configuration changes;
- source changes unrelated to dependency remediation.

Run:

```bash
git diff --check origin/main...HEAD
git status --short
git diff origin/main...HEAD
```

---

# 9. GitHub verification

Before finalizing the branch, query current GitHub Dependabot alerts again:

```bash
gh api -H 'Accept: application/vnd.github+json' \
  repos/farismnrr/situm-explore/dependabot/alerts \
  --paginate
```

Understand that Dependabot normally evaluates the default branch; an alert may remain open until the remediation branch is merged.

Therefore final branch evidence must distinguish:

- local resolved dependency graph;
- advisory no longer applicable to the new lockfile;
- GitHub alert state still open only because the branch is not yet merged;
- genuinely unresolved advisory.

Do not dismiss alerts through the API/UI as part of this task.

After the user later authorizes PR/merge, Dependabot should close remediated alerts naturally based on the new default-branch dependency graph.

---

# 10. Required documentation/evidence

Create or update a dedicated evidence file:

`/home/farismnrr/Projects/situm-explore/.agents/evidence/security-dependency-remediation.md`

It must contain:

1. starting vulnerability inventory;
2. exact dependency paths;
3. authoritative advisory IDs/CVEs;
4. exploitability/scope assessment;
5. remediation selected for each advisory;
6. package/lockfile before → after versions;
7. why alternatives were rejected;
8. clean-install proof;
9. root + mobile audit results;
10. full validation results;
11. Expo/RN/Situm compatibility conclusion;
12. GitHub Dependabot status interpretation;
13. any residual upstream-unpatched advisory, if one truly remains;
14. explicit statement that Plan 034 was not started.

Update as applicable:

- `/home/farismnrr/Projects/situm-explore/.agents/state.md`
- `/home/farismnrr/Projects/situm-explore/.agents/memory/decisions.md` only if a durable dependency/security decision changes;
- `/home/farismnrr/Projects/situm-explore/.agents/knowledge/` if a reusable dependency compatibility fact is discovered;
- `/home/farismnrr/Projects/situm-explore/.agents/sessions/2026-08-18.md`

Do not edit Plan 034 to claim work was performed there. This task is a pre-Plan-034 gate.

---

# 11. Commit discipline

Use small, reviewable security-scoped commits. A reasonable shape is:

1. dependency/lockfile remediation;
2. tests/evidence/closeout if meaningfully separable.

Do not split artificially if one atomic security commit is clearer.

Before each commit:

```bash
git status --short
git diff --check
git diff
git diff --staged
```

Example subject:

```text
fix(security): remediate mobile dependency advisories
```

Push the branch:

```bash
git push -u origin chore/security-dependency-remediation
```

Verify local/upstream synchronization and a clean working tree.

Do **not**:

- create a PR;
- merge to main;
- delete the branch;
- start Plan 034.

The user will review/integrate after you report results.

---

# 12. Definition of Done

You may report **SECURITY REMEDIATION READY FOR INTEGRATION** only when every applicable checkbox below is true.

## Dependency truth

- [ ] Current GitHub advisories were revalidated from authoritative sources.
- [ ] Every vulnerable dependency path was mapped.
- [ ] `uuid` vulnerable versions are eliminated from the resolved vulnerable path.
- [ ] `image-size` advisories are genuinely remediated through a patched/safe path, **or** the task is explicitly marked BLOCKED because no safe upstream/supportable remediation exists.
- [ ] No alert was dismissed merely to make dashboards green.
- [ ] No scanner configuration was weakened.
- [ ] No incompatible Expo/RN downgrade was performed.
- [ ] Any override/temporary patch is minimal, justified, reproducible, and documented.
- [ ] Clean `npm ci` reproduces the dependency graph.
- [ ] `npm ls` has no invalid/extraneous state caused by the remediation.

## Security gates

- [ ] Root `npm audit` has zero actionable findings.
- [ ] Mobile audit has zero actionable critical/high/moderate findings, or any upstream-unpatched residual is explicitly documented and blocks “zero-vuln” closure.
- [ ] No secrets/generated artifacts/insecure dependency URLs were introduced.
- [ ] Git diff is limited to justified security remediation/evidence.

## Functional gates

- [ ] Root tests PASS.
- [ ] Root lint PASS.
- [ ] Root typecheck PASS.
- [ ] Root production build PASS.
- [ ] Mobile lint PASS.
- [ ] Mobile typecheck PASS.
- [ ] Expo config PASS.
- [ ] Expo Doctor reviewed truthfully.
- [ ] Clean Expo prebuild PASS.
- [ ] Android `assembleDebug` PASS.
- [ ] Production server smoke PASS.
- [ ] Existing auth/session/security behavior remains intact.

## Repository/process gates

- [ ] Evidence file is complete and truthful.
- [ ] Persistent agent state/session updates are complete where applicable.
- [ ] Branch is `chore/security-dependency-remediation`.
- [ ] Commits are pushed.
- [ ] Local HEAD equals upstream branch HEAD.
- [ ] Working tree is clean.
- [ ] No PR/merge performed.
- [ ] Plan 034 not started.

If any safe actionable vulnerability remains, continue remediation rather than declaring completion.

If only a genuinely upstream-unpatched vulnerability remains and no supportable mitigation can eliminate the vulnerable path, report:

`SECURITY GATE BLOCKED — UPSTREAM UNPATCHED`

with exact evidence. Do not relabel that as 10/10 closure.

---

# 13. Final report format

Return a concise but complete report with:

## Status

One of:

- `SECURITY REMEDIATION READY FOR INTEGRATION`
- `SECURITY GATE BLOCKED — UPSTREAM UNPATCHED`

## Findings

For each underlying advisory:

- advisory/CVE;
- before dependency path/version;
- remediation;
- after dependency path/version;
- residual risk, if any.

## Validation

Report exact outcomes for:

- root audit/tests/lint/typecheck/build;
- mobile audit/lint/typecheck;
- Expo config/doctor;
- clean prebuild;
- Android assembleDebug;
- production smoke;
- source/security scans.

## Git

Report:

- branch;
- commit(s);
- upstream synchronization;
- working-tree state.

## Carry-over

Explicitly state:

- whether any upstream vulnerability remains;
- that no Dependabot alert was manually dismissed;
- that no PR/merge occurred;
- that Plan 034 was not started.
