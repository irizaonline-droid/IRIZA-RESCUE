# AI engineering test results — November 2, 2026

Actual live test, separate local account/database:

1. Import maintained checkout ZIP into a real SQLite source copy.
2. Prepare and index source; diagnostic workflow executes independent maintained baseline checks.
3. Select recorded failing checkout finding and request live Meta correction.
4. Confirm file hash remains unchanged while the proposal awaits approval.
5. Submit exact proposal id/digest/nonce approval.
6. Source checks run after the saved correction.
7. Independent maintained before/after assertions execute.
8. Generate report and receipt from actual stored state.

Result: `muse-spark-1.3`, request `chatcmpl-01a19e04-7078-759f-b6bb-75781b3aebba`; proposal path `checkout.mjs`; approval applied; `FIXTURE_BEFORE_AFTER_PASS`; +1/-1 saved line; `published:false`.

Evidence: `artifacts/upgrade-4/live-meta-acceptance.json`, `live-meta-report.json`. Local reproduction helper: `node .private/upgrade4-live.mjs` while the isolated QA server is running with its existing server-side Meta configuration. The helper uses only synthetic source and a disposable QA account; it does not publish.

Customer functional verification remains **NOT_VERIFIED**. The maintained tests run fixed, fingerprinted source. They do not install customer packages, build a Next.js application or demonstrate an isolated customer VM.

Automated provider behavior tests use mocks and are labeled separately from this live request. No private model reasoning is displayed. No Meta request parameters or account model capabilities were changed in this increment.
