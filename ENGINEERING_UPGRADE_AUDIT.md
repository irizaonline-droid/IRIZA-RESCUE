# RESCUE 4.0 engineering upgrade audit

Date: November 2, 2026, Africa/Kigali. Status: **increment 1 implemented locally; full specification unfinished**.

Baseline: `42a8463a3b8b689bd0c092db0f79119cde306441`. Git status was clean before edits. Rollback branch: `rollback/rescue-4-baseline-20261102`. No existing user database, import, history or project was deleted. Main local database was inspected read-only: quick_check `ok`, 26 tables, 41 project files, 4 workbench records, 3 history rows, 247 audit events. See `artifacts/upgrade-4/baseline-database.json`. Test changes use separate temporary databases and `artifacts/upgrade-4/browser-data`.

## Capability evidence

VERIFIED WORKING applies to the stated scope, not to every requested future feature. Test doubles are not live provider evidence. Historical production verification is distinguished from this local candidate.

| Capability / existing area | Classification | Actual evidence / limitations |
|---|---|---|
| Independent onboarding, sign-in and tenant routing | VERIFIED WORKING | Browser signed into synthetic account on port 4312; `tests/accounts.test.mjs`, `tests/engineering-upgrade.test.mjs`; no TASTE account/database reuse |
| Projects: ZIP import, public GitHub, local operator copy, CRUD | VERIFIED WORKING within bounds | ZIP/browser project and 514-file regression tests; pinned public repository/archive tests in existing suite. Private GitHub App enrollment and PR writing absent |
| Overview | PARTIALLY WORKING | Actual local lab metrics; fixed active project count to include uploaded/GitHub/local projects. No complete engineering trend dashboard |
| Scan Center / diagnostics | PARTIALLY WORKING | Real bounded parser/manifest checks; exact-version advisory tests. Not full language/build/runtime/security coverage |
| AI Analysis / Find & repair | VERIFIED WORKING for single-file reviewed repair | Live Spark request `chatcmpl-01a19e04-7078-759f-b6bb-75781b3aebba`; unchanged hash before approval; approved correction; fixture before/after pass |
| Sandbox editor | PARTIALLY WORKING as requested full IDE | Monaco, nested explorer, path filter, tabs, breadcrumb, preferences, supported formatter action, find/replace, saved drafts/history, diff and exact original restore. No full LSP/debugger, editable split panes, file lifecycle or hunk acceptance |
| New Changes & reports | VERIFIED WORKING within documented scope | Browser edit revision 1→2: 1 modified file, +1/-1, real language/directory bars; JSON downloaded. Git numstat comparison tests, Markdown API and Git apply check pass |
| Architecture / Source Intelligence | PARTIALLY WORKING | Persisted syntax index, TS/JS/Python AST, literal search and import edges; existing parser tests. No full semantic call/database graph or embedding retrieval |
| Engineering Agent | PARTIALLY WORKING | Existing scoped tools, modes, budgets, job/cancellation tests. No imported manifest library or controlled specialist orchestrator implemented |
| Vulnerabilities | PARTIALLY WORKING | Exact-version OSV lookup with unresolved dependencies and provider errors surfaced; not a complete vulnerability audit |
| DevOps | PARTIALLY WORKING | Runtime/DB health and planning profiles; no authenticated customer hosting adapter |
| New Environments | PARTIALLY WORKING | Browser imports synthetic .env: duplicate PORT, lexical PORT reference, public-secret-name warning. Metadata only, all values discarded. No vault or runtime secret injection |
| Runtime & Release: generic customer build/test/preview | NOT IMPLEMENTED as a verified live journey | Adapter code/policy mocks exist. No successfully authorized customer VM receipt, dynamic preview/build lifecycle or verified staging deploy |
| Sample Recovery Lab | VERIFIED WORKING as a trusted fixture | Real fixed-source child-process tests and HTTP lab tests. These are NOT an arbitrary-code security boundary |
| Incident Center / Maintenance | PARTIALLY WORKING | Persisted incidents, repeated public probes, ownership gating, fixed lab maintenance; no unrestricted origin repair or universal cloud monitoring |
| AI Support | VERIFIED WORKING for bounded read-only service | Saved conversation/secret redaction/tool-denial tests; not a production execution agent |
| Developer API / Settings / Audit Trail | VERIFIED WORKING within existing scope | Operator/read-key/agent denial matrix, preferences persistence, chain tests and tenant tests. New project report/env/restore routes use same account forwarding boundaries |
| Documentation | PARTIALLY WORKING | Existing guides retained; seven upgrade reports maintained here. Complete future-feature guides cannot describe unimplemented behavior |
| Provider lifecycle tests with injected fake sandbox | SIMULATED provider portion | `tests/runtime-verification.test.mjs` checks limits/network/stop against a fake provider; not evidence of an actual VM |
| Rejected patches, per-hunk comments/approval, create/delete/rename, PDF report | NOT IMPLEMENTED | Report explicitly uses null for unrecorded rejection counts; no guessed file/semantic metrics or PDF claim |
| Production Go Live / rollback across customer hosts | NOT IMPLEMENTED | No authenticated project adapter, immutable built candidate or tested staging rollback. Release remains blocked |

No new feature was left with a known failing automated test. This does not imply every page/action has received exhaustive manual or automated browser coverage.

## Executed evidence

- `npm test`: 88 passing tests in the first upgrade run (85 baseline + 3 new test groups).
- `npm run check`: 97 JS modules passed syntax checks.
- `npm run build:editor`: actual bundled Monaco plus five same-origin workers built.
- `node --test tests/engineering-upgrade.test.mjs`: Git numstat, Git apply, restore conflict/approval, account isolation, metadata leakage and API flow checks.
- Live API journey: `artifacts/upgrade-4/live-meta-acceptance.json`, `live-meta-report.json`.
- Browser: actual sign-in, project open, nested explorer, source edit and Ctrl+S, real counts, JSON download, .env names import, 15px editor font, original restore revision 2→3, no warnings/errors in inspected browser logs.
- Browser layouts: normal desktop; 390×844 mobile and 768×1024 tablet; measured page width did not exceed viewport. Screenshots in `artifacts/upgrade-4/`. This is focused flow coverage, not screenshot-diff coverage of every existing page.

## Unfinished specification register

| Phase | Remaining work |
|---|---|
| 0 audit | Exhaustive all-button/all-page browser matrix; production regression audit after a separately authorized release |
| 1 Code Studio | Fuzzy matching, persistent recent files, full split editing/LSP, hunk selection/comments, create/delete/rename, semantic changed-symbol/dependency/route metrics, duration charts, PDF renderer |
| 2 intelligence | Automatic post-import indexing job, richer configuration/model discovery, semantic retrieval/references and evidence-backed source Q&A improvements |
| 3 agents | Provider capability/cost refresh, specialized structured modes beyond existing tools, orchestrator dependency graph, manifest provenance/license review/import/disable |
| 4 fixes | Atomic multi-file patches, affected/regression customer test execution, new-failure retry workflow and per-hunk review |
| 5 environments | Managed vault, encryption key lifecycle, edit/reveal/rotate permissions, profile history/compare, framework semantics, authorized sandbox injection |
| 6 runtime | Successfully authenticated isolated customer runner, pinned reproducible build images, scoped dependencies, dynamic preview/logs/cancellation/cleanup verification, event stream |
| 7 releases | Authenticated disposable staging adapter, immutable artifact candidate, exact approval, provider timeline/smoke checks and tested authorized rollback |
| 8 UI | Broader motion/accessibility/keyboard audit, actual streamed agent and job states, no redundant page creation |
| 9 registry | Evaluate and verify only needed language tools; versions/schemas/licenses/resources; no mass dependency installation |
| 10 observability | Historical engineering metrics, actual model usage/cost summaries, filters and evidence links |
| 11 reliability | Durable queues/recovery, idempotent cancellation/retries, job/tenant quotas and additional abuse/isolation testing |
| 12 acceptance | Real customer VM and staging deployment tests E/F remain blocked; full desktop/tablet/mobile page matrix G unfinished |
| 13/14 delivery | Continue Priority 0 runtime first; retain all existing data and update these reports per increment |

No Git push, production deployment, DNS change or external infrastructure modification was performed in this increment. The production domain remains rescue.iriza.online. The parent IRIZA TASTE project was not edited.
