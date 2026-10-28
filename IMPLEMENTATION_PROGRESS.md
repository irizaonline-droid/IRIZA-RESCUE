# Implementation progress — Engineering Studio 0.4.0

Delivered locally in the existing RESCUE project with its approved identity and Node/SQLite backend preserved:

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
