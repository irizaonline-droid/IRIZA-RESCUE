# IRIZA RESCUE — verified hackathon demonstration

[Watch the 2:58 Unlisted demo](https://www.youtube.com/watch?v=4zTvm_lGqeE) · [Open RESCUE](https://rescue.iriza.online/)

The demo was captured from the actual hosted application on 4 November 2026 using a synthetic QA workspace and a controlled five-file checkout fixture. It contains real source inspection, live Muse Spark 1.3 investigation, exact patch review and approval, and an independent maintained-fixture test result.

## Reproduce the demonstrated journey

1. Open RESCUE, continue through onboarding, and sign in or register for an independent RESCUE account.
2. Open Projects → Add project → Upload ZIP. The import form provides the maintained checkout example; its source is in `public/engineering-demo.zip`.
3. Open Code Studio and `checkout.mjs`. The original uses addition where the checkout total requires multiplication. `total(12, 2)` incorrectly returns 14; the fixture expects 24.
4. Run source checks, then ask Muse to investigate this exact behavior. Consent to sending the selected synthetic source context to the configured Meta provider. A server-side Meta API key and working inference are required for a live result.
5. Review the proposed exact +1/-1 diff. Approval changes only the imported working copy. The model cannot approve its own patch.
6. Open Tests & release → Verify maintained fixture. The fixed verifier executes the recognized original and corrected checkout cases and records the failing original and passing correction.
7. Open Reports for measured changed-file and line statistics. Export the engineering receipt, which preserves what ran and what did not.

## What the demonstration proves

- A real hosted source import and in-browser editor workflow.
- Source-aware live Muse investigation with recorded tool events and file references.
- One explicitly reviewed source change in a copied workspace.
- Actual original-fail/corrected-pass execution for the recognized maintained fixture.
- Engineering reports and evidence export.

It does **not** prove that arbitrary customer projects execute safely, that every application defect or vulnerability is detected, or that a production website was repaired. The maintained fixture is a trusted fixed Node test, not a generic customer-code isolation boundary. Generic customer runtime requires an authorized isolated runner; automatic customer PR creation and deployment adapters are not complete.

## Evaluation evidence

The final sprint regression passed 92 tests with zero failures. Module syntax checks passed for 100 JavaScript modules; the Monaco editor build and generated documentation completed. The npm production dependency audit reported zero advisories at the time checked, within the advisory database's scope.

The video uses genuine sampled browser frames held and retimed into a 30 fps presentation, synthetic narration and an original procedural score. It does not present invented model or test outputs. The master is 1920×1080, 178 seconds, H.264 with AAC audio. The YouTube link was independently checked without cookies or authorization and returned `playability: OK` with `isUnlisted: true`.

Original RESCUE source is MIT licensed. See `THIRD_PARTY_NOTICES.md` for separate asset, font and dependency rights. Source and deployed backend can differ; inspect `/healthz` for the hosted release identifier.
