# Studio verification — October 27, 2026

## Executed checks

- `npm run check`: syntax validation of 20 source/browser/script/test JavaScript modules.
- `npm test`: 13 test groups passed; covers original recovery loop plus Studio API, nonce/digest approval, replay, expiry, read-only keys/scopes/revocation, tenant storage boundary, preview ticket project binding, TTL cleanup, resource count caps, emergency stop, automatic rollback, source drift, guide/OpenAPI/PDF/SDK routes and support output validation.
- `node ../node_modules/typescript/bin/tsc --noEmit --target ES2022 --lib ES2022,DOM --module NodeNext --moduleResolution NodeNext --skipLibCheck packages/sdk/rescue-client.ts`: exit 0. Uses the owner's installed TypeScript compiler; no runtime dependency added.
- `node scripts/evaluate-studio.mjs`: 30/30 verified actual lab recoveries, ten per fault, zero false-ready outcomes in those 30 cases. LOCAL RULES mode, not live Meta. Raw CSV and JSON are under `artifacts/studio-evaluation.*`.

## Browser-to-backend verification performed in the user's local browser

1. Sandbox navigation opens a real empty state.
2. Create dialog accepts project name and launches an actual sample preview.
3. Backend unavailable button produces actual 502 evidence.
4. Run tests records failures and the gate becomes BLOCKED.
5. AI Fix Assistant produces a clearly labeled local-rule proposal with a reviewable fixture diff.
6. Explicit approval performs the allowlisted repair, creates a snapshot, verifies three observations and shows READY FOR REVIEW.
7. Export JSON downloads an actual release report.
8. Support widget receives selected sandbox context and returns guide-grounded, read-only guidance with source-guide buttons.
9. Documentation search for 524 opens its troubleshooting guide; Developer API page and OpenAPI download work.
10. Server restart preserves project/recovery history and marks ephemeral previews STOPPED. A newly launched preview requires fresh tests and uses the updated source fingerprint.
11. The actual Run browser tests operation launched headless Edge, completed the synthetic checkout and passed the sample's 390px layout check. The browser test was shown as required PASS in the Test Center.
12. Studio document at a 390px browser breakpoint had no horizontal page overflow. The viewport override was reset afterward.
13. Header Light/Dark buttons changed the document appearance state. No browser error logs were reported in the inspected flow.

Screenshots: `studio-release-gate`, `studio-tests-passed`, `studio-light`, `studio-dark`, `studio-mobile`, and `studio-documentation` in the saved artifacts/output set. The source book PDFs, guides, OpenAPI and SDK are actually served through authenticated endpoints, not dummy links.

## Limits

No live Meta credentialed inference was performed. Support is LOCAL GUIDE and diagnosis is LOCAL RULES until the owner configures MODEL_API_KEY. The browser flow is a verified controlled demonstration, not an independent security audit or production deployment certification. No untrusted Git source, production service repair, DNS change, public publication or actual payment occurred. Twenty invalid source/injection inputs were rejected by the automated test; that is not a claim of twenty live model prompt-injection evaluations.
