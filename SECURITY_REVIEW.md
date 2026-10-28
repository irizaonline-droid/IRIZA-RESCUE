# Security review — Engineering Studio 0.4.0

## Boundaries implemented

- Imported ZIPs are quarantined in bounded memory, never extracted into host paths. At most two uploads are admitted concurrently. Strict names reject traversal/drive paths, control characters, duplicate case-folded names and links; size, entry, expansion, UTF-8 and CRC checks precede a SQLite transaction. Excluded secret/dependency/build files do not enter the source copy. No source execution occurs during import.
- Tenant source, draft, history, index, job and policy records live in the existing separate per-account SQLite workspaces. Sessions select the workspace; project IDs do not grant another tenant access. Cross-account tests exercise upload, indexes, search and policy isolation.
- Source AST/type analysis uses a static worker with no inherited environment or execution flags, one global analysis slot, 192-MB old-space limit and 12-second timeout. Compiler file reads are restricted to virtual project text and trusted TypeScript standard libraries. No project config/plugin or imported source is executed. Python AST parsing retains its bounded isolated parser command.
- Engineering agent tools are a fixed read-only registry with Zod input schemas. No shell, host paths, production credentials, write, approval or deployment tool exists. Dynamic file reads with detected secrets are withheld. Source-upload consent is explicit. Tool output bytes, calls, model steps and duration are bounded; the existing global Meta budget is retained. Model recommendations do not grant approval.
- Draft saves require the exact source hash/version. Patch approval retains nonce/digest/version/expiry checks. Independent static-check failure rolls back copied source. History and jobs have bounded retention. Source changes invalidate index and exact-revision evidence.
- Customer execution requires an authorized remote VM; only reviewed supported files are uploaded into a fresh workspace. No production credential is passed to the VM; network is denied during tests, no ports are exposed and cleanup/timeout remain enforced.
- The fallback verifier runs only two exact maintained arithmetic function versions with fixed trusted tests. It refuses arbitrary code, records source hashes and explicitly says it is not a customer-code isolation boundary. It does not run uploaded test commands.
- Monaco assets are same-origin. Build-time nonce injection preserves CSP; no unsafe-eval or broad inline-style permission was added. DOMPurify was overridden to the patched version after install-time advisories.

## Material remaining limitations

No successful customer VM verification exists in this environment; no isolated local container provider is installed. Dependency advisories and strict compiler diagnostics are bounded evidence, not a full vulnerability certificate. Project language servers, arbitrary debuggers/terminals, GitHub App permissions and deployment adapters remain unavailable. Email verification/password recovery and larger-scale account operations remain pilot limitations. The parser worker limit is not an OS boundary for arbitrary execution. No permanent fix for unrelated hosting outages is claimed.

No TASTE configuration, environment, code, auth or database was modified. No credentials or test-account secrets are included in tracked evidence reports.
