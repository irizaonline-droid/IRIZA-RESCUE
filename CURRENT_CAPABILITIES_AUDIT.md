# Current capabilities audit — 2026-10-29

Current source: 0.4.3. Statuses below describe executed evidence and explicit limits. The public 0.4.2 release remained healthy overnight at the start of this continuation. Earlier audits are historical where superseded.

| Capability | Status | Evidence, coverage and limits |
|---|---|---|
| Node HTTP / SQLite backend | PASS | Node stack preserved; API and persistence regressions |
| Independent account registration/sign-in and tenant isolation | PASS | Real public sign-in and per-account project journeys; isolation tests |
| Expired account session handling | PASS | Client regression redirects to sign-in rather than operator unlock |
| Email verification/password recovery | NOT IMPLEMENTED | Screens disclose this; TASTE auth/database untouched |
| Pinned public GitHub connection and source import | PASS | Actual MR-CREATIVIST public revision imported 514 files in production; metadata alone is never called a source import |
| Large-project source copy | PASS | >500 regression; 64 MB default total / 4 MB per file; bounded archive transport retained |
| ZIP upload and quarantine | PASS | Actual private five-file fixture plus traversal/link/CRC/UTF-8/expansion tests |
| Local folder import | PASS | Operator-only source copies; original files preserved; tenant account sessions denied filesystem import |
| Private GitHub source / App installation | NOT IMPLEMENTED | Public import works; app needs its own authorized private-source adapter |
| Project editing/archive/trash/restore | PASS | Persistent project CRUD and recoverable lifecycle tests |
| Monaco code editing | PASS | Real source editing with line numbers, colors, tabs, folding and same-origin workers; browser semantic errors from absent dependencies disabled |
| Drafts, history, stale-edit protection, side-by-side diff and export | PASS | Persistence/rollback tests and real browser diff/source changes |
| File creation/deletion/rename and multi-file atomic AI patches | NOT IMPLEMENTED | Current source edits are existing-file replacements; do not advertise complete IDE parity |
| Source intelligence | PASS | Actual 1,805 symbols and 2,040 import edges; syntax/index coverage only, not a semantic call graph |
| Bounded TypeScript checking | PASS | TS2322 regression; 32-file / 512 KB semantic budget; missing React/Next/alias types reported as unresolved environment |
| Source-check repair planning | PASS | Actual ranked diagnostic choices, withheld-file locations, stale plan rejection and remaining-error accounting |
| Source credential guard | PASS | Variable/env-reference false positive corrected; known credential/literal/private-key patterns withheld; detection cannot guarantee all secrets |
| Muse model catalogue and selection | PASS | Live account catalogue; per-project settings; Spark/Wonder API requests accepted; listing and inference distinguished |
| Live coding repair generation | PASS | Actual Meta requests returned minimal source corrections, displayed before applying |
| Sandbox repair application and rollback | PASS | Exact approval changes copied source; rejects new failures; accepts reduction while retaining existing failures; tests and browser evidence |
| Animated activity and changed-source display | PASS | Activity corresponds to actual request stages; provider IDs and changed file shown; hidden reasoning is not exposed |
| Static HTML preview | PASS | Actual HTML displayed with scripts/forms/external resources blocked; not a dynamic backend preview |
| Maintained checkout before/after test | PASS | Exact trusted fixture only: baseline exit1/current exit0 across three fixed tests; explicitly a demonstration, not customer runtime proof |
| Generic customer VM lifecycle | SIMULATED | Adapter installed and lifecycle/snapshot/network/cleanup mock-tested; no successful authorized live customer VM run |
| Actual customer build/start/test/debugger/terminal | NOT IMPLEMENTED | No Sandbox-authorized app runner credentials; never execute arbitrary customer code on the shared app server |
| Website HTTP/TLS observations and ownership proof | PASS | Public observation and DNS/HTTP proof paths; public URL does not supply origin logs/source or grant repair authority |
| Dependency advisory lookup | PASS | Exact-version OSV queries; unresolved ranges and provider errors reported; not a comprehensive vulnerability audit |
| Architecture explorer | PASS | Declared framework/import/route candidates only; database/call/service graph inference incomplete |
| Semantic database model and full call graph | NOT IMPLEMENTED | No invented topology |
| Engineering agent read tools, modes, cancellation | PASS | Real tool-assisted Meta requests plus tool policy, schema, budget and cancellation tests; no unrestricted shell/write authority |
| Customer Git push/PR/deploy tools | NOT IMPLEMENTED | Git patch export works; app has no GitHub App/PR or project deployment/rollback adapter |
| AWS/Azure/VM/cPanel/DirectAdmin/Vercel/Netlify customer adapters | NOT IMPLEMENTED | No authenticated project-scoped runtime repair adapters. This RESCUE release's own manual deployment is not a customer-hosting capability |
| Complete customer GitHub → failing test → live investigation → approved patch → independent test → PR journey | FAIL | Blocked at authorized generic runner and application PR adapter; maintained fixture success cannot satisfy this requirement |
| User guides, API documentation, source notices | PASS | Updated guides/model/import/repair paths and OpenAPI routes generated from source; commands below reproduce verification |
| RESCUE GitHub push and DirectAdmin release | PASS | Explicitly authorized RESCUE-only releases with archive checksum, five consistent database backups, preserved configuration and exact health/auth gates |

## Reproduction commands and evidence

- `npm test` — full regression suite; current continuation log: artifacts/easy-connect/043-full-tests.txt.
- `npm run check` — module syntax verification.
- `npm run build:editor` — Monaco and same-origin workers.
- `npm run docs` — in-app guide/OpenAPI generation.
- `npm audit --omit=dev --json` — dependency advisory check for the RESCUE application itself.
- Browser: sign in → open project → import/prepare → Find & repair errors → Prepare recommended repair → review diff → Repair sandbox → inspect changed source → independent fixture or authorized customer tests → export receipt.
- Actual prior evidence: 041-model-access.json, 041-browser-evidence.json, 041-production-code-studio.png, 042-muse-working.png, 042-repaired-source.png and 042-full-tests.txt under artifacts/easy-connect. No raw credentials are included.

All artifacts are local ignored files. No TASTE source, environment, auth, database or functions were edited. Production customer repairs and automatic publishing are not claimed.

## Final executed continuation evidence

85 tests passed; 93 JavaScript modules passed syntax checks. The 2026-10-29 live production QA journey saved a disposable failing checkout draft, selected its error automatically, called Muse Wonder, displayed the exact diff and applied it to the sandbox. Request: chatcmpl-01a18635-7d3a-7315-9896-1c84f033e9cd. The downloaded receipt is artifacts/easy-connect/043-production-receipt.json: fixed maintained baseline exit1/current exit0, scope MAINTAINED_FIXTURE_ONLY, published=false. Generic customer functionalVerification remains NOT_VERIFIED by design.
