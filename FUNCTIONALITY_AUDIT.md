# IRIZA RESCUE — functionality audit

> Latest project-scoped workbench update: [Project workbench release](docs/PROJECT_WORKBENCH_RELEASE.md). Includes source copies/editor, project CRUD, dependency advisory lookup, live Meta patch proposals, exact approval, parser verification and export. 56 tests pass. The Vercel adapter's lifecycle is mock-tested; an actual connector attempt returned 403, so no successful customer runtime or production release is claimed. Earlier NOT IMPLEMENTED entries for source editing/proposals are superseded within this bounded scope.

> Latest customer-source follow-up: [Actual project diagnostics](docs/ACTUAL_PROJECT_DIAGNOSTICS.md). Public archive scans and Python AST checks are executed, AI report advice persists, and 45 tests pass. Customer application execution/repair/PR/deployment remains incomplete. Historical reports from the first Windows parser bridge may contain a documented encoding false positive.

> Follow-up: [Scanner and DevOps verification](docs/SCAN_AND_DEVOPS_UPDATE.md). Current suite: 38 passing tests; 43 modules pass syntax checks. Limited public repository metadata, local telemetry, scan inventory, live scan AI advice and DevOps profiles are implemented. Customer source execution, patch/PR preparation and production publishing remain unavailable. The earlier audit below is historical where superseded by that report.

**Date:** October 27, 2026, Africa/Kigali (UTC+2). **Main application:** http://127.0.0.1:4310/. **Source:** this RESCUE directory. **Verdict: the customer GitHub → isolated failing test → approved source patch → PR journey is NOT IMPLEMENTED.** A real, approval-controlled trusted-sample recovery works. These are different capabilities.

The current IRIZA design, logo, Node.js backend, SQLite records and server-side credentials were preserved. No production system, DNS record, remote branch, PR, merge or deployment was changed. The main workspace's existing emergency stop was **true** and was not disabled. Its rejection of sandbox creation was observed in the browser. Stateful browser recovery testing used the same source on **127.0.0.1:4311 with a separate disposable audit database**. That is not a customer integration or an OS-isolated runner.

## Status definitions and evidence limits

- **PASS:** the stated capability was executed successfully with the evidence indicated. Scope matters: a fixture PASS is not a customer-repository PASS.
- **FAIL:** an observed defect or a required verification gap; fixed defects show their before/after status.
- **SIMULATED:** fixture-specific or mocked external behavior. The sample's HTTP failures, process restart and verification are real; the customer workload and orders are synthetic. This does not mean fabricated browser results.
- **NOT IMPLEMENTED:** no functioning implementation/authorized runtime connection exists. Disabled controls are not counted as working integrations.

Browser inventories cover all ten pages and their currently rendered controls. They do **not** establish that every possible button/state combination was clicked. The tables distinguish browser journeys, executable backend tests, source inspection and unverified controls. No historical report or old screenshot was treated as a fresh executed result.

## Priority customer journey

| Step | Status | Actual evidence / blocker |
|---|---|---|
| Read existing GitHub repository with coding-assistant connector | PASS | Read-only connector retrieved private `irizaonline-droid/IRIZA-TASTE` metadata, package.json and workflow. Evidence: `artifacts/functionality-audit/github-read-evidence.json`. This permission belongs to the connector, not RESCUE. |
| Authorize that repository inside RESCUE | NOT IMPLEMENTED | GitHub card is disabled. No GitHub App/OAuth installation, callback, server-side installation token or per-repository grant is implemented. No runtime GitHub credentials were configured. |
| Identify a real recorded CI failure | PASS | GitHub run **40120911211**, job **120952038094**, October 24, 2026, failed at **Build payload-cms**. Logs report missing required environment configuration including PAYLOAD_DATABASE_URL/PAYLOAD_MEDIA_ROOT. This is a historical build failure, not a reproduced failing unit test or a proven cause of a website outage. |
| Safely rerun that workflow | NOT IMPLEMENTED | Existing workflow includes `vercel --prod` and swallowed errors (`|| true`). It was not rerun because it could deploy. No production workflow was modified. |
| Clone/import an immutable customer commit | NOT IMPLEMENTED | No runtime checkout, commit pinning, credential broker, repository/file policy or import artifact exists. File blob SHA is not a commit pin. |
| Reproduce a customer failing test in an isolated runner | NOT IMPLEMENTED | Docker/Podman are unavailable; WSL did not provide an operational distribution. No isolated runner adapter is integrated. Cloud sandbox tools available to the coding assistant are not a configured RESCUE service or authorization to copy private source there. |
| Collect customer runner logs, test artifacts and evidence hashes | NOT IMPLEMENTED | Only trusted sample and public website evidence are implemented. No customer runner execution occurred. |
| Investigate fixture evidence with live Meta | PASS | Fresh live Muse Spark requests were made from the audit twin. First diagnosis failed strict route validation; revised instructions passed on retest. IDs and outcomes are in `executed-journey.json`. No local-rule output was reported as live Meta. |
| Generate a reviewable customer source-code patch | NOT IMPLEMENTED | Current `patchFor()` is a fixed descriptive sample runtime/config/release diff. It does not edit a repository. |
| Review/approve a bounded sample action | PASS | Browser displayed target, revision, action, expiry, diff and verification plan, then explicit approval executed only `lab.restart_service` in the audit sample. |
| Approve/apply a customer patch bound to commit and test evidence | NOT IMPLEMENTED | No customer patch object, commit binding, file allowlist, application engine or approval scope exists. |
| Independently verify repaired sample | PASS | Three health and checkout observations plus contract/policy tests passed. A separate actual Edge checkout + 390px test passed. Receipt downloaded through the browser. |
| Independently run customer before/after tests and negative tests | NOT IMPLEMENTED | No customer code was executed. Sample passes cannot satisfy this step. |
| Prepare a customer branch / pull request | NOT IMPLEMENTED | No runtime GitHub write integration, verified source patch or customer test artifacts. No PR was created. Local audit fixes are available for review in `rescue-audit-fixes.patch`; that is not an IRIZA-TASTE PR. |
| Automatic merge/deploy | NOT IMPLEMENTED | Intentionally unavailable. No merge or deployment was attempted. |

Next prerequisites, in order: repository-scoped GitHub App authorization → pinned read-only checkout → an explicitly authorized isolated runner with bounded resources/egress and no host credentials → captured failing command and artifacts → live evidence-grounded patch proposal → separate commit/diff-bound approval → clean independent before/after tests → reviewable draft PR preparation. Do not bypass the first two blockers by running repository scripts on this Windows host or by borrowing the assistant connector's credentials.

## Defects reproduced and fixed in small increments

| Finding | Before | After | Evidence |
|---|---|---|---|
| Emergency stop did not block legacy `/api/lab/inject` | FAIL — test returned 201 with stop enabled | PASS — legacy injection and approval reject while stop is true | `tests/audit-regressions.test.mjs`; initially 201 != 400, then passed. Main stop remains enabled. |
| Old support tickets inaccessible after the 50-row list window | FAIL — `Ticket not found` for oldest of 100 | PASS — detail queries exact tenant/id independently of list pagination | Same regression test, 100 synthetic tickets in temporary SQLite only. |
| Ticket quota counted the limited list rather than all rows | FAIL — 100 limit could not be reached through count | PASS — SQL count enforces 100 | Regression test rejects ticket 101; no main tickets created. |
| Ticket state could persist before an invalid comment failed | FAIL — partial update possible by source inspection | PASS — all validation precedes transactional update/comment/audit write | Regression asserts state stays OPEN after invalid 4,001-character comment. |
| Sample worker inherited server environment and Node env-file flags | FAIL — fork defaults inherited both | PASS — OS-variable allowlist plus `execArgv: []` | `workerEnvironment` regression; actual sample workers and checkout still run. This is credential minimization, not OS isolation. |
| Repair verification dropped a previously requested browser requirement | FAIL — regression saw browserRequested=false | PASS — approval preserves last test run's required browser check; unsupported required browser causes rollback | Controlled regression plus existing real sample tests. |
| Live diagnosis did not cite valid failing routes | FAIL — actual live request rejected, sample left broken/unapproved | PASS on retest — exact route instructions; at most one structure correction within four completion rounds; prohibited actions still fail immediately | Live history contains original `Diagnosis must cite failing evidence routes`; six read-only tool types remain bounded. Correction branch was unit-tested; live successful retry did not require the correction branch. |
| OpenAPI omitted settings/archive routes | FAIL — implementation/documentation drift | PASS — generator now describes those routes plus readiness assessment | `npm run docs`, API matrix and regenerated `docs/openapi.json`. |

## Page and control audit

All pages retained the approved shell/layout/CSS. Desktop browser inventory captured 10 pages and 114 rendered controls in the observed states, including disabled controls; the machine-readable inventory is authoritative if counts change with records. Dynamic modals and subsequent fixture states are additional controls.

| Page / capability | Status | Scope and evidence |
|---|---|---|
| Sidebar routes: Overview, Projects, Sandbox, Incidents, Support, Maintenance, Developer, Settings, Documentation, Audit | PASS | All ten opened in main browser and showed their expected heading; no captured console errors. `browser-controls.json`. |
| Global search, notifications, keyboard modal behavior | FAIL | Source inspected; full keyboard/focus and notification-state combinations were not exhaustively executed in this audit. No accessibility certification claimed. |
| Current approved visual design and original logo | PASS | `index.html`, `prototype.css`, `workspace.css`, logo unchanged from pre-fix copies; SHA-256 comparison. |
| Overview cards and session latency trend | PASS | Authenticated status/studio/assets reads returned genuine data. Trend is retained browser-session lab samples, not production uptime. |
| “Connected projects” interpreted as real customers | SIMULATED | Count mixes public URL records and trusted sample projects. It is not a count of authenticated customer integrations. Cards identify sample/public-observation scope. |
| Overview recent incidents and quick actions | PASS | Persisted legacy incidents rendered; navigation controls inventoried. |
| Combined legacy + Studio + website incident center | FAIL | Incident Center reads only `data.incidents` from the legacy engine. Studio events/receipts and website incidents remain separate; source inspection and fixture incident count 0 during Studio fault. |
| Projects list/detail/public HTTP/TLS report | PASS | Main GET routes and browser cards/details; public probe policy tests and API matrix. Existing observations are point-in-time records, not retested production repair. |
| Add website, rename, archive, restore | PASS | API matrix executes these against mocked HTTPS in temporary data; regression retains observations, disables scheduling and enforces tenant scope. Browser form/dialog inspected. |
| Edit/remove availability after detail refresh | FAIL | Refreshing an asset modal calls the base detail renderer, while edit/archive buttons are appended only by initial action wrapper. Full repeated-refresh UI behavior remains to be consolidated/tested. |
| GitHub repository button | NOT IMPLEMENTED | Disabled with explicit explanation. No OAuth consent, repository import or PR journey. |
| Application-agent enrollment | NOT IMPLEMENTED | Disabled; no signed enrollment or agent telemetry contract in runtime. |
| Sandbox create/select/lifetime/launch/stop | PASS | Executed through browser in audit twin; real worker and iframe rendered; worker stopped after tests. Unit tests cover lifecycle/quota/TTL. |
| Controlled 502 injection | PASS | Actual proxy returned 502, test suite and browser checkout failed as expected. `fixture-outage.png`. |
| Controlled 500 / broken-release 404 scenarios | PASS | Executed by automated integration tests with actual HTTP workers. These are fixed fixture states, not customer errors. |
| Customer workload represented by sample app | SIMULATED | Included checkout uses synthetic items, no orders/payments. No arbitrary repository execution. |
| Run tests / Verify repair | PASS | Actual three-observation HTTP/JSON/policy suite; fail/block before recovery and pass after. |
| Run browser tests | PASS | Actual Edge navigated the included sample at 390px and observed synthetic checkout completion. It failed during 502 and passed after repair. |
| Analyze with AI | PASS | Live provider result validated, with read-only probe/log/snapshot/action/timeline/guide tools; initial failure and successful retest both recorded. |
| Review and approve exact sample repair | PASS | Browser review dialog and explicit approval; nonce/digest/revision/expiry denial cases run in tests. |
| Sample proposal “patch” as customer source edit | SIMULATED | Static `lab/runtime.json`/config/release description, not an applied Git diff. |
| Runtime logs / Test results / Evidence / History tabs | PASS | Actual logs/tests/JSON/history rendered; History selected in browser; remaining tab renderers source-reviewed and project fields validated in API tests. |
| Snapshot rollback and reset | PASS | Browser restore reintroduced the recorded stopped state and blocked tests; reset restored healthy baseline. Rollback failure path also integration-tested. |
| Receipt/report download | PASS | Browser downloaded `rescue-recovery-report.json`; persisted receipt contains actual approval, provider request ID and independent observations. |
| Emergency stop | PASS | Main browser denied sample creation; legacy bypass regression fixed. Existing main setting preserved. |
| Incident text/status search and detail | PASS | Rendered main register; integration tests verify persistent incident detail/state/approval/receipt. Full visual filter permutations were not all exercised. |
| Support new/saved conversation and live reply | PASS | Browser sent an audit-only question; result/request provenance and saved conversation are recorded in audit twin. No external message or repair is sent by ticket creation. |
| Support EN/FR | PASS | Input validation and language routing covered by tests/source; fresh audit browser request was English. French live behavior from earlier reports is historical, not retested here. |
| Kinyarwanda | NOT IMPLEMENTED | No evaluated language capability. |
| Error-log attachment | FAIL | Small text-file loader/limits/source reviewed; fresh chooser/upload journey was not executed. No private log was transmitted during this audit. |
| Ticket create/view/resolve/export/comment | PASS | Temporary-database API matrix, quota/detail/atomicity regression; main existing ticket left unchanged. Full browser ticket permutations not all executed. |
| Support chat executes commands or repairs | NOT IMPLEMENTED | Intentionally no execution authority. Support responses say actionsExecuted=0. |
| Maintenance HTTP/TLS history and recommendations | PASS | Main persisted observations and expiration fields rendered; mock transport tests verify failures/observed recovery/deduplication. No current customer SLA claim. |
| DNS/file ownership proof | PASS | One-use, tenant-bound expiry verified with mocked DNS/file transport; no actual DNS/file publishing occurred. |
| Recurring verified-domain monitoring | PASS | Scheduler/ownership expiry/archived-asset gates exercised in integration tests. No unverified main website scheduling was enabled. |
| Authorized origin logs / production repair | NOT IMPLEMENTED | No SSH/DirectAdmin runtime connection. No production access requested or attempted. |
| Developer cURL/JS/response tabs and GET playground | PASS | Actual local API data, generated examples and authenticated list endpoint; UI source/inventory plus API matrix. |
| API-key create/hash/expiry/scope/revoke | PASS | Temporary-db tests issue, use, deny privileged calls, expire/revoke keys. No persistent main key created. |
| One-time key UI reveal/copy | FAIL | Implemented and source-reviewed, but not exercised through browser against main credentials; backend behavior alone does not prove clipboard UI. |
| Copy example / clipboard UX | FAIL | Source-reviewed but clipboard not exhaustively exercised in this audit. |
| OpenAPI / SDK / guide / original PDF downloads | PASS | Main endpoints returned 200; API matrix retrieves original PDF, rejects unknown reference; SDK TypeScript compilation succeeds. Browser receipt download separately verified. |
| Settings names/theme/language/alerts | PASS | SQLite validation, restart persistence and read-key denial tests; main preferences unchanged. |
| Light/Dark/System visual checks in this audit | FAIL | Existing mechanisms/source inspected; all theme combinations were not freshly re-executed. Earlier migration screenshots are historical evidence only. |
| Single local operator login/lock | PASS | Audit twin unlocked through browser, main unauthenticated GET returned 401, scope denial tested. Not hosted organization authentication. |
| Multi-user organization membership / RBAC | NOT IMPLEMENTED | One local-owner tenant and operator token; no enrollment/login service. |
| Audit chain and export | PASS | Main hash chain verified true; SQLite integrity `ok`, no foreign-key violations; GET/export payload inspected. Chain is not an external signature. |
| Signed external webhooks / email / notifications delivery | NOT IMPLEMENTED | No configured delivery service or functioning provider adapter. |
| Production deployment certification / automatic production actions | NOT IMPLEMENTED | Intentionally absent. |
| Old `scripts/browser-check.mjs` | FAIL | Historical harness still targets removed `#token/#login` and old Failure Lab selectors. It was not run against the main app or represented as passing. Current browser evidence came from CUA automation. |

## Backend/API route matrix

Every handler in `src/server.mjs` was inspected. Main read-only HTTP probes (16 authenticated endpoint groups) returned 200; unauthenticated status returned 401. Mutation semantics below were exercised on temporary instances/databases, not production or main user records. `tests/api-audit.test.mjs` uses clearly mocked public HTTPS/DNS; that transport is SIMULATED, not an actual ownership proof.

| Routes (prefix `/api/v1` unless noted) | Status | Executed checks |
|---|---|---|
| `/api/status`, `/api/audit`, `/api/connectors`, `/studio` | PASS | Main GET, audit valid, empty connectors accurately empty; no ecosystem integration inferred. |
| `/api/probe` | PASS | Real loopback worker monitor used by integration tests. |
| `/api/lab/inject`, `/api/incidents/{id}`, `/investigate`, `/approve`, `/receipt` | PASS | Three real fixture fault/recovery loops, state/expiry/concurrency denial; emergency-stop enforcement added. |
| `/sandboxes` GET/POST; `/sandboxes/{id}` GET | PASS | Actual fixture create/select/detail and scope-limited metadata. Customer source values rejected. |
| `/sandboxes/{id}/launch`, `/stop`, `/reset`, `/inject` | PASS | Browser fixture lifecycle + integration tests; TTL/quota and unsupported input rejection. |
| `/sandboxes/{id}/tests`, `/diagnose`, `/approve` | PASS | Real browser/HTTP tests and live Meta in audit twin; explicit policy approvals and negative tests. |
| `/sandboxes/{id}/rollback`, `/release-gate`, `/report` | PASS | Actual snapshot restoration, blocked/ready gate and receipt/report. |
| `/emergency-stop` | PASS | Persisted setting and blocking legacy/Studio mutations. It does not cancel an operation already executing. |
| `/assets` GET/POST; `/assets/{id}`; `/report`; `/probe` | PASS | Main reads; temporary mock external transport exercises create/probe/report. No remote repair authority. |
| `/assets/archived`; `/assets/{id}/rename`, `/archive`, `/restore` | PASS | Tenant-bound rename, recoverable removal, restore, retained history. |
| `/assets/{id}/ownership-challenge`, `/verify-ownership`, `/monitoring` | PASS | Mock DNS/file proof, replay/expiry/tenant denial and scheduling rules. |
| `/support` | PASS | Fresh live English browser request; malformed model citations/provider failures tested separately. |
| `/support/conversations`, `/support/conversations/{id}` | PASS | Saved conversation and tenant-bound message retrieval. |
| `/support/tickets`, `/support/tickets/{id}` | PASS | Create, exact detail, comment, state, count quota and atomic rejection. |
| `/settings` GET/POST | PASS | Validation, persistence across restart, auth/scope checks. |
| `/meta/status`, `/meta/test` | PASS | Main persisted live status; fixed readiness prompt verified by mock transport in automated tests. Live diagnosis/support independently observed. |
| `/developer-keys`, `/developer-keys/{id}/revoke` | PASS | SHA-256 storage, scopes, expiry, revocation; no main key issuance. |
| `/guides`, `/reference`, `/reference/{id}`, `/openapi`, `/sdk` | PASS | Main GET + original PDF/unknown-ref tests + TypeScript compile. |
| `/customer-journey/readiness` GET/POST | PASS | New assessment validates only canonical GitHub URL; ready=false and authorizationVerified=false; no fetch/action/merge/deploy. Read keys denied. This is not a GitHub connection. |
| Unknown route / bad origin / wrong content type / invalid JSON / oversized body | PASS | 404 / 403 / 415 / 400 / 413 assertions in tests; no successful mutation accepted. |

## Database, model and isolation review

| Capability | Status | Evidence / limit |
|---|---|---|
| Consistent backup and source rollback point | PASS | `pre-audit.sqlite` via Node SQLite backup; pre-fix src/public/tests/db copies under ignored artifacts. Secrets not copied into report. |
| SQLite WAL / foreign keys / integrity | PASS | `baseline.json`: integrity_check=ok, foreign_key_check empty. Journal and parameterized statements reviewed. |
| Incident/project/receipt persistence | PASS | Existing integration tests restart and check saved records. Browser twin receipts survive audit-server restart. |
| Asset failure deduplication / observed recovery | PASS | Mock failure sequence creates one observed incident; HTTP recovery does not claim an executed repair. |
| Persistent job queue / distributed locking / multi-instance shared budget | NOT IMPLEMENTED | Current locks/Meta circuit/concurrency are in-process. SQLite does not provide a durable external workflow engine. |
| Source fingerprint and exact-build gate | PASS | Source drift/stale-build/no-required-tests/old-verification rejection tests. |
| Preview ticket, route allowlist, CSP and loopback binding | PASS | Auth/scope/expired-ticket/stop tests; preview is read-only and not customer-code isolation. |
| OS isolation for included sample | SIMULATED | Trusted child process, not VM/container security. Credentials now minimized; no untrusted code executed. |
| Provider endpoint/model credentials stay server-side | PASS | Existing official endpoint adapter; public source contains no credential value; no `.env` content included in artifacts/report. |
| Meta read-only tools / action and evidence validation | PASS | Forbidden tools/actions, invalid citations, bounded correction and JSON/provider errors tested. Live valid result recorded. |
| Meta budget/circuit/retry | PASS | Implemented limits/source tests; budget is local process/workspace accounting, not provider-wide billing enforcement. Actual charges unavailable. |
| Local rules and guide fallback | SIMULATED | Clearly labeled deterministic fallback when no key; mock unit requests never treated as live provider output. |
| Independent external customer verification / stability soak | NOT IMPLEMENTED | Three observations are a short fixture check, not production soak or customer acceptance suite. |
| Formal accessibility certification / load and penetration testing | NOT IMPLEMENTED | Source review, functional checks and selected negative tests are not comprehensive certification. |

## Commands and reproducibility

Executed results: baseline **22/22** automated tests; final **29/29** tests, zero failures; syntax checks passed for **34 JavaScript modules**; TypeScript SDK compilation exited **0**. New regression tests were first run failing for the emergency-stop bypass, old-ticket access and dropped browser requirement, then passed after fixes. Main read probes and DB integrity checks are recorded separately from the browser twin's live-provider calls.

Run from the RESCUE directory. Do not load the production `.env` when running the deterministic automated suite.

```powershell
npm test
npm run check
npm run docs
node --test tests/audit-regressions.test.mjs
node --test tests/api-audit.test.mjs
node ../node_modules/typescript/bin/tsc --noEmit --target ES2022 --lib ES2022,DOM --module NodeNext --moduleResolution NodeNext --skipLibCheck packages/sdk/rescue-client.ts
node scripts/audit-inventory.mjs
```

For the separate audit twin only (contains synthetic audit records, uses real server-side Meta when `.env` is explicitly loaded):

```powershell
node --env-file-if-exists=.env scripts/audit-server.mjs
node scripts/audit-evidence.mjs
```

Use browser automation on port 4311 to create a clearly named sample, run tests, inject 502, verify failing tests, analyze with AI, inspect the exact proposal, approve that sample repair, rerun independent HTTP/browser tests, download the receipt, restore a snapshot, reset and stop the preview. This is the executed sample journey; it does not authorize a customer repository. Do not rerun the upstream deployment workflow as a test.

## Evidence files and remaining work

- `artifacts/functionality-audit/source-inventory.json`: initial active code/config file hashes.
- `baseline.json`: main read-route responses, DB integrity/counts and discovered action branches.
- `browser-controls.json`: per-page enabled/disabled control inventory; captures labels/actions without secret values.
- `github-read-evidence.json`: connector-only repository/CI facts; no runtime authorization.
- `executed-journey.json`: fresh fixture run results, original diagnosis failure, real model request IDs, receipt checks and readiness blockers.
- `fixture-outage.png`, `fixture-approval.png`, `fixture-verified.png`, `fixture-rollback-blocked.png`: actual browser states.
- `rescue-audit-fixes.patch`: reviewable local RESCUE changes; **not** a customer patch or opened PR.

Open issues remain explicit: customer GitHub/runner/patch/PR chain; unified incident center; legacy browser harness; exhaustive keyboard/clipboard/attachment/theme UI verification; multi-user identity and durable orchestration. The existing main emergency stop and all production systems remain protected. A full customer recovery or PR-preparation success is **not claimed**.


## Production outage investigation and motion update

2026-10-27 20:17 UTC: iriza.online and educo.rw returned actual HTTP 502 responses. Production recovery and publication are BLOCKED by unavailable origin administration and denied/unmapped Vercel deployment access. See docs/PRODUCTION_RECOVERY_STATUS.md. No DNS or production mutation occurred.

Local project workspace was restarted and browser-verified with the editor, source checks and patch-export controls. The motion system now includes navigation entry, staggered cards, focus/hover/click feedback, operation progress and result transitions. Reduced-motion preferences disable animations. Post-response text reveal is presentation, not streamed model reasoning.


## Evidence-based outage assessment update

PASS: deterministic outage assessment distinguishes missing/stale evidence, transport failure, repeated failure and public response availability; raw probe data is preserved. Cloudflare Ray IDs and server headers are bounded and recorded. Project cards use assessment state instead of stale HEALTHY labels. Website project overview/scan shows measured facts, explicitly unverified hypotheses and numbered recovery steps; raw evidence remains expandable.

Executed through browser: refreshed IRIZA public check at 2026-10-27T20:30:50.377Z, actual HTTP 502, valid TLS, Cloudflare Ray a51475d1ce368a46-NBO. No origin repair or deployment performed. Full npm test: 57 passed; npm run check: 57 modules.


## AI fix entry button repair

PASS: Generate AI fix proposal is enabled without imported source and opens guided source selection instead of a disabled control. User must explicitly select and confirm the matching source before linking/importing; no repository is guessed. Existing importable projects offer Import source & continue. Imported projects offer a file selector and issue form; generation runs source checks and uses the existing bound proposal/approval backend. Browser-executed on IRIZA website: AI tab -> button -> source confirmation dialog, no website/source association changed. Six project-workbench backend tests pass; browser JavaScript syntax passes. Full proposal lifecycle was previously executed on a synthetic fixture, not production.


## Shared identity, workstation UI and repository release

PASS: CodeMirror line numbers and coloured Python source browser-inspected; source remains in sandbox copies. Compact gallery and bounded support layout browser-inspected. 59 RESCUE tests passed, seven parent TASTE auth-return tests passed; shared identity tests use mocked profile responses. Production shared sign-in is NOT VERIFIED; allowed account configuration and healthy TASTE origin are still required. Token fallback is retained until then, not removed from an unauthenticated workspace.

PASS: complete reviewed source uploaded to irizaonline-droid/IRIZA-RESCUE main through the GitHub connector and package.json fetched back by exact commit. CLI push had no credential; connector write succeeded. No private data or .env was uploaded. Latest production observations at 21:03 UTC: iriza.online 502; educo.rw 307 then /en 200; mrcreativist.ca 200. These are observations, not repairs performed by RESCUE. DirectAdmin release, DNS and recurring outage remediation remain BLOCKED on credential-file path, verified target, Node24+ runtime and shared-identity rollout.


## DirectAdmin release verification

Origin deployment PASS: dedicated domain, Node24.22.1, remote syntax62modules, API authorization, loopback service and HTTPS Host routing verified. Live remote Meta test200. Full local suite60passed. Public launch FAIL/BLOCKED: Cloudflare public route still reaches Vercel404; dashboard requires sign-in. See docs/DIRECTADMIN_RELEASE_STATUS.md. TASTE remains unchanged. Operator authentication retained; independent user sign-in/registration is not implemented.


### Public launch completion

PASS: Cloudflare exact proxied A rescue->69.10.42.26 saved and row verified; wildcard/root unchanged. Public HTTPS /healthz200 matches release20261027T212217Z; root200; editor bundle200; unauthenticated API401; authenticated API200. Browser operator login and sample create/launch executed. Sample998cad1e-6ba5-4b69-b2ce-118e94dc3aa9 has four required checks PASS. Public deployment is complete for the current operator-controlled product; independent registration and customer arbitrary-code runner remain unfinished. TASTE application unchanged.
