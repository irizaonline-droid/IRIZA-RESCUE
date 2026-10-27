# Scanner and DevOps verification

GitHub follow-up: the actual public irizaonline-droid/SMS repository returned metadata HTTP 200 and commit HTTP 409, `Git Repository is empty.` Empty repositories now connect with `commit:null`, `EMPTY_REPOSITORY` and first-commit guidance. Reconnecting after a first commit updates the same record. Regression coverage also distinguishes rate limits, invalid credentials, permission denial and other commit conflicts; no fabricated commit or source import.

Verified October 27, 2026. Domain: rescue.iriza.online.

| Capability | Result | Executed evidence |
|---|---|---|
| Local source/config inventory | PASS | Browser scan: 83 files, four advisories, manifests/dependencies, infrastructure paths and file hashes. |
| Static checks, exclusions, no execution | PASS | tests/scanner.test.mjs verifies malformed manifests, masked failures, secret exclusions and no source execution. |
| Live Meta scan assessment | PASS | API request chatcmpl-01a17dea-5d2c-7600-a67c-e5b7cfe6b2f4; browser request chatcmpl-01a17dea-d0fe-75b7-ae53-2e057118c01b. Muse Spark 1.3; actionsExecuted=0. |
| Runtime/database doctor | PASS | Browser: actual Node/process memory, SQLite quick_check=ok, zero foreign-key violations. |
| Environment profiles | PASS | API create/edit/archive/restore tests; browser saved Local RESCUE development linked to TEST and MODEL_API_KEY name only. |
| Easy onboarding | PASS | Actual public HTTP, octocat/Hello-World pinned metadata and scoped local agent SDK telemetry verified. Smoke credential revoked. |
| Sample expert analysis and approval | PASS | Actual healthy/failing Meta requests; independent tests and separate approval. Repeat-tests regression fixed. |
| TEST recovery | PASS | Receipt 2c7ed4ac-e1d1-4fd5-8e0e-fcb42f64a20e recovered=true after approval and three healthy observations. Fresh tests after restart: READY_TO_REVIEW. |
| Failed preview guidance | PASS | HTTP 502 retained; root explains recovery, probes retain JSON failure. |
| Customer reproduction by included sample | SIMULATED | Synthetic trusted checkout; a website-like name does not clone that website. |
| Private cloud/VM/hosting adapters | NOT IMPLEMENTED | AWS/Azure/Google Cloud/VM/cPanel/DirectAdmin/Vercel/Netlify explicitly NOT_CONNECTED. |
| Customer isolated execution, patches and PRs | NOT IMPLEMENTED | No usable customer isolation runner or authorized source execution workflow. |
| Production repair/publish | NOT IMPLEMENTED | Publish disabled; server readiness false. No merge or deployment performed. |

Run `npm test`, `npm run check`, `npm run docs`, then `npm start` from RESCUE. Actual results: 38 tests passed, zero failed; syntax passed for 43 modules. Browser: unlock locally, Scan Center, Run workspace scan, Analyze scan with AI. Export retains displayed advice; reopening a saved scan requires requesting advice again.

Evidence: artifacts/easy-connect/final-tests.txt, scan-ai-live.json, main-recovery-verified.json, agent-sdk-smoke.json. Automated provider tests mock transport; cited Meta calls are real.

Bounds: 500 files, depth 10, 8 MB total, 256 KB/file. Excludes .env, credential folders, symlinks and build/data artifacts. Extensions cover JavaScript/TypeScript, Python, PHP, Go, Rust, JSON/YAML/TOML and Dockerfile. Inventory and selected heuristics cannot detect every defect or certify vulnerabilities. Secret matches are withheld; fixtures can trigger false positives.

Scan AI receives findings, coverage and inventory, not source bodies or secret values. Advice requires review. Stored website observations remain labeled not refreshed until selected. Profiles store variable names, never edit live values. Records are local-operator evidence, not multi-tenant customer integrations.

Remaining: scoped provider adapters, OS-isolated customer runner, exact patch review/approval, independent customer tests, PR preparation, deployment target binding and verified rollback. Passing the sample cannot unlock customer publishing.
