# Sandbox & Recovery Studio — October 27, 2026

The owner requested implementation of the full backend and working product flows. This increment implements the controlled P0 studio from the supplied books while retaining the existing standalone Node HTTP/SQLite application. It does not replace the app with the suggested Next.js monorepo or claim that the whole commercial roadmap is finished.

## Specification review

Read all four PDFs: Project Book (6 pages), Technical Blueprint (9 pages), Engineering Manual (8 pages), Hackathon Rules & Evidence (5 pages). Read the supplied AGENTS, project decisions, master prompt, v1.1 master addendum and Sandbox & Recovery Studio prompt. The base master and v1.1 were compared; v1.1 adds the Studio priority. Reference copies live in `docs/reference/`.

Source references were inspected again read-only: parent IRIZA TASTE CSS tokens (`--mobile-red: #ed1c24`), Developer bearer authentication/scopes, Synapse gateway README and existing health adapters. No production data or credentials were read or copied. The supplied D: folder is used as a specification source; the current working app remains in the user's previously requested C: RESCUE directory. New user-facing domain remains `rescue.iriza.online`, superseding old domain references in the books.

## Implemented modules and flows

- `src/studio.mjs`: per-project workers, fixed sample source fingerprints, lifecycle checks, create/launch/stop/reset, quotas, TTL cleanup, logs, test runs, diagnosis, nonce/digest-bound approval, pre-change snapshots, failed-verification rollback, history, release gate, reports and monitoring.
- `db/001-studio.sql`: additive SQLite migration for projects, read-only developer keys, persisted emergency-stop setting, and migration record. Existing incident/audit data is retained.
- `src/server.mjs`: authenticated `/api/v1` routes, scoped expiring hashed read-only keys, real preview tickets limited to exact project/routes, support throttling and accurate downloadable docs/SDK.
- `src/support.mjs` and `src/guides.mjs`: ten searchable guides, grounded read-only support, explicit local-guide mode, validated live Meta answers when configured. No model execution authority.
- `public/studio.js` and `public/studio.css`: Sandbox and Documentation below Integrations, create dialog, project cards, Preview/Test Center/AI Fix/History/Release/Maintenance tabs, actual report downloads, support widget, header sun/moon controls and mobile layouts. Official local IRIZA icon preserved.
- `packages/sdk/rescue-client.ts`: typed client for list/detail/gates/reports and operator-only sample creation/testing/stopping.
- `docs/openapi.json`, `docs/USER_GUIDE.md`: generated from implemented API and guide source via `node scripts/generate-docs.mjs`.

## Test semantics

Required suite: three independent HTTP observations of health and synthetic checkout, JSON service contract, actual policy denial against a production target. Optional browser tests become required when requested; unsupported or failing browser execution blocks that run. A missing, outdated, wrong-revision or wrong-build test cannot produce READY FOR REVIEW. Current observed faults can block a reviewed build. Verification is a short demo stability window, not a production soak test.

The browser job uses the owner's existing installed Playwright and Microsoft Edge. Neither is bundled as a production runtime dependency. It executes only the fixed sample routes. If not installed, results show UNSUPPORTED rather than invented success. Source snapshots are fixture state, not arbitrary repository copies or OS-level snapshots. Displayed diffs describe that fixture state explicitly.

## Security implemented

- Only fixed trusted included source runs; arbitrary Git repositories and freeform shell/patch execution disabled.
- Three active previews, twelve saved projects, bounded history/log/test retention, 15/30/60 minute TTLs and periodic cleanup.
- Single local operator, loopback-only HTTP, existing Host/Origin validation, bearer tokens; no public multi-tenant deployment claim.
- Read-only report keys: SHA-256 storage, 24-hour expiry, max ten active, revocation, scope checks; cannot read preview capabilities/pending proposals or invoke repairs/support.
- Approval binds exact proposal ID, one-time nonce, digest, build, revision, target and expiry. Per-project operation lock prevents concurrent mutation; maintenance uses the same lock to avoid overwriting approvals.
- Pre-change snapshot and automatic restoration on failed verification; honest failed receipt.
- Emergency stop persists across restart and blocks new studio mutations. It cannot retroactively undo completed operations or cancel a repair already executing.
- Preview browser CSP disables scripts, forms, external connections and parent access. It uses narrowly scoped expiring random read-only tickets. The worker process is not a hardened OS sandbox.
- Meta output is validated and never executed; no credential collection in support; sanitized evidence only. Support requests bounded and throttled.

## Remaining scope

Live Meta inference still needs the owner's server-side MODEL_API_KEY and actual account access verification. No key was borrowed from another IRIZA system. TypeScript/Next.js monorepo migration, durable distributed jobs, multi-user accounts, audited untrusted-code runner, arbitrary repo builds, external ownership onboarding, production monitoring/TLS telemetry, notification delivery and production deployment remain separate work. There is no hosted public API yet. Authenticated official hackathon rules remain unverified; the supplied compliance PDF explicitly records that limitation.

The educo.rw screenshot is treated as an observed timeout at one moment, not an authorization or evidence of a precise root cause. No scan or modification of that site was performed.
