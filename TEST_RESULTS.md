# Test results — Engineering Studio 0.4.0

## Automated checks

- `npm test`: **72 passed, 0 failed**, 35.1 seconds. Output: artifacts/easy-connect/v3-final-tests.txt.
- `npm run check`: **84 JavaScript modules passed** at the final recorded syntax check.
- `npm run build:editor`: Monaco plus five same-origin workers built successfully.
- `npm audit`: **0 advisories** in the recorded JSON report.

Tests cover archive traversal/links/duplicates/expansion, actual persisted ZIP import, copied source CRUD, source references, a real TS2322 type error in the restricted compiler, exact approval mismatch rejection, rollback, persistent drafts/history/conflicts, real maintained arithmetic before/after failures, SDK read-only tool calls/cancellation and cross-account isolation. External-provider lifecycle unit tests are mocked and are not treated as successful customer VM runs.

## Actual browser and live-provider evaluation

On a disposable account and database at localhost:4311:

1. Registered and reached the private dashboard with no operator unlock prompt.
2. Uploaded the maintained five-file checkout ZIP through the real browser file chooser. Project and source persisted in that account's SQLite workspace.
3. Opened imported Python/JavaScript source in Monaco, including source tabs and line highlighting; captured console inspection returned no warnings/errors for the tested flow.
4. Deep Investigation called live Muse Spark 1.3 four times, used real source tools, and identified checkout.mjs:2 adding instead of multiplying. The answer correctly stated that runtime tests had not run.
5. Generated a real Meta minimal patch, reviewed the actual side-by-side diff, clicked explicit approval and observed a sandbox-only patch receipt with independent source checks and published=false.
6. Ran the exact maintained verifier: known broken baseline exit1, corrected current version exit0, using three fixed assertions. Arbitrary source extensions are rejected. This is not execution of the customer's test command or an OS-isolated customer runner.
7. Downloaded the engineering receipt. Saved copy: artifacts/easy-connect/v3-browser-engineering-receipt.json. It records workspace revision2, patchApplied=true, FIXTURE_BEFORE_AFTER_PASS, customer functionalVerification=NOT_VERIFIED, published=false.

## Blocked or not executed

No authorized RESCUE Vercel Sandbox project/token/team is configured in the application. The connected assistant account lists an unrelated project only; it was not changed or used. Docker/Podman are unavailable locally; WSL is not an installed execution provider. No generic customer runtime, customer preview, PR creation, merge or deployment was executed by these engineering actions. Full project LSP/debugging and multi-file patch verification remain unavailable.

## Hosted release smoke test

Release 20261028T160604Z activated on DirectAdmin with five consistent RESCUE database backups. Public onboarding/signin/assets/example returned200, anonymous projects401. Existing synthetic QA sign-in, real ZIP upload and hosted JS/Python source indexing succeeded in the browser. IRIZA TASTE homepage returned200 after activation and was not modified. See docs/DIRECTADMIN_RELEASE_STATUS.md.

Production Meta verification also completed: the synthetic QA project used live Muse Spark 1.3 in Quick Help, made two provider requests, read checkout.mjs and returned actual source references. Clicking checkout.mjs:2 opened the correct file in Monaco. Hosted browser console inspection reported no warnings/errors in that tested flow. The QA account was signed out after verification.
