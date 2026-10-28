# DirectAdmin release status — Engineering Studio 0.4.0

Activated RESCUE release **20261028T160604Z** from source commit **a7eec63c8591d432aa7efd663e3cb3969efd6ac1** on 2026-10-28 (Africa/Kigali).

- Public domain: https://rescue.iriza.online/
- Dedicated RESCUE backend: loopback18106, Node24.22.1.
- Account mode preserved. No operator unlock prompt appears in the authenticated public journey.
- Archive SHA256: 777a12804485ae61454c43f59c1c5f1cfd65b03b1afe746963ff16aa108f75a3. Remote checksum matched before activation.
- Five consistent SQLite database backups were made under RESCUE's private data/backups/engineering-20261028T160604Z directory.
- Existing RESCUE environment values were preserved; only RESCUE_RELEASE changed. Previous configuration/current release remain available for rollback.
- npm ci installed runtime dependencies with install scripts disabled. Syntax checks and anonymous401 / operator200 / exact-release health gates passed.
- Public health, signin, Monaco editor/worker and example ZIP returned200. Anonymous project API returned401.
- A synthetic production QA account signed in and imported the maintained five-file ZIP. Hosted indexing returned actual checkout and Python health symbols and source import relationships.
- TASTE source, environment, functions, database and service were not modified. Its public homepage returned200 after the RESCUE activation.

No DNS change was needed. Customer arbitrary-code execution remains disabled without an authorized remote runner. Customer PR, merge and deployment adapters remain unavailable. Maintained fixture results are not customer runtime certification.

Local evidence remains in ignored .private/engineering-activation-result.txt, .private/engineering-preflight-result.txt and artifacts/easy-connect/v3-production-smoke.json. Credential values and account passwords are excluded from source and reports.

Production Meta verification also completed: the synthetic QA project used live Muse Spark 1.3 in Quick Help, made two provider requests, read checkout.mjs and returned actual source references. Clicking checkout.mjs:2 opened the correct file in Monaco. Hosted browser console inspection reported no warnings/errors in that tested flow. The QA account was signed out after verification.
