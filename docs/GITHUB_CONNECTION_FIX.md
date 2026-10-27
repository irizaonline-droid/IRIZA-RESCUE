# GitHub connection fixes

October 27, 2026. Two actual failures were reproduced:

- SMS: repository metadata HTTP 200, commit lookup HTTP 409, Git Repository is empty. The app previously mislabeled this as unavailable/rate limited. It now saves an empty repository with a null commit and first-commit guidance.
- MINECOFINE: full commit responses can contain file diffs and exceed the 200 KB metadata limit. Onboarding now reads the default branch reference instead, validating a commit object and forty-character SHA without downloading diffs. Actual reference response: 354 characters, commit c1c6288fb8e91d91123fba90677b50c2cb7bfe03.

Both repository cards were verified through the live browser connection flow. Refresh repository updates metadata and deduplicates the existing record. Rate limits, invalid credentials, permissions, missing repositories and branch conflicts now have distinct messages. Source checkout/execution remains a separate unavailable capability. No remote write was performed.

Validation: `node --test tests/github-empty.test.mjs tests/easy-connect.test.mjs tests/scanner.test.mjs` passed nine tests. `npm run check` passed 44 modules. Full test log: artifacts/easy-connect/github-fix-tests.txt.

GitHub endpoint contract: https://docs.github.com/en/rest/git/refs#get-a-reference
