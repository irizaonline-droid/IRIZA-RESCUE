# Implementation progress — Engineering Studio 0.4.0

Delivered locally and released to rescue.iriza.online in the existing RESCUE project with its approved identity and Node/SQLite backend preserved:

1. Safe ZIP import and private source-copy storage, with a two-upload admission limit.
2. Monaco editor, five same-origin workers, nonce-preserving theme CSS, editor tabs, persistent drafts, conflict rejection, file history and actual diff viewer.
3. Source index persisted by schema/source digest. TS/JS AST declarations/imports, Python AST declarations, framework declarations, tests, syntactic route candidates and literal source search.
4. Restricted source-analysis worker with trusted TypeScript standard libraries only; real type diagnostics and explicit unresolved dependency status.
5. AI SDK ToolLoopAgent using the existing budgeted server-side Meta transport. Six read-only tools, ten modes, schema validation, project scope, bounded source excerpts, usage/request provenance, cancellation, timeout and restart interruption state.
6. Workspace tool policies and language coverage registry; inferred architecture view navigates actual source files.
7. Exact snapshot upload for remote verification instead of cloning extra repository files; test-definition digest comparison and conservative engineering receipts.
8. Exact maintained checkout fixture verification with three functional assertions. Arbitrary replacement code is refused; this is not a generic host execution service.
9. In-app guides, OpenAPI routes, source notices and these evidence reports.

Actual browser sequence: staging account sign-in → ZIP import → Monaco source → Deep Investigation with live Muse Spark 1.3 (four model requests and actual tool reads) → minimal arithmetic patch → side-by-side review → explicit approval → copied-source checks → independent maintained before/after tests → downloaded JSON receipt. Customer runtime remains NOT_VERIFIED.

Pre-change rollback files: .private/upgrade-v3-rollback. Existing account work was preserved. New databases use additive tables; original imports and production data are not overwritten.

Not delivered: GitHub App enrollment, successful arbitrary-customer VM run, full LSP/debugger, semantic database/call graphs, multi-file repair transactions, automatic customer PR/merge/deploy. No claim of complete commercial-platform readiness.

Hosted release: 20261028T160604Z, source a7eec63. Five consistent RESCUE SQLite backups and preserved environment/rollback preceded activation. Public and authenticated import/index smoke checks passed.

Production Meta verification also completed: the synthetic QA project used live Muse Spark 1.3 in Quick Help, made two provider requests, read checkout.mjs and returned actual source references. Clicking checkout.mjs:2 opened the correct file in Monaco. Hosted browser console inspection reported no warnings/errors in that tested flow. The QA account was signed out after verification.
## RESCUE 4.0 increment 1 — November 2, 2026

Baseline 42a8463 preserved on rollback/rescue-4-baseline-20261102; clean status recorded before changes. Existing working source/data preserved; TASTE unchanged. Changes remain local.

Implemented project-scoped saved-code statistics with bounded real line alignment, file hashes, language/directory charts, revision-aware validation, actual audit timeline and JSON/Markdown engineering reports. Added metadata-only five-stage environment import/requirements with no value persistence and optimistic conflict checks. Extended Monaco with nested explorer, breadcrumbs, saved font/wrap/minimap preferences, supported find/format actions, saved/draft comparison and exact reviewed original restore. Corrected Overview counts and ZIP project labels.

Executed: npm test (88 pass), npm run check (97 JS modules), npm run build:editor. Focused API tests compare line counts with Git, apply an exported patch in a disposable directory, verify restore confirmation/stale checks, deny cross-account reads and scan SQLite/WAL files for a dummy imported value. Browser sign-in/edit/Ctrl+S/download/env-import/preferences/original-restore passed. Mobile390 and tablet768 had no page-level horizontal overflow. Inspected browser logs had no warnings/errors.

Live Muse Spark1.3 request chatcmpl-01a19e04-7078-759f-b6bb-75781b3aebba generated a real maintained checkout correction; unchanged source before approval, explicit exact approval, independent fixture before/after pass. Customer runtime remains NOT_VERIFIED. See the seven new upgrade reports and artifacts/upgrade-4.

No full 4.0/Priority0 completion claim: generic customer runner, managed vault, authenticated staging release/rollback, multi-file/hunk review and the remaining specification are tracked in ENGINEERING_UPGRADE_AUDIT.md and RELEASE_READINESS.md.
