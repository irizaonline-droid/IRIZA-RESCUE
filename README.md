# IRIZA RESCUE — Engineering Studio 0.4.0

Winning Team. Import a project, inspect source, investigate evidence, review a patch and verify what actually changed. Domain: **rescue.iriza.online**.

The existing IRIZA identity, standalone Node.js backend and SQLite stores are preserved. IRIZA TASTE remains separate and unchanged by this upgrade.

## Run locally

Requires Node.js 24+. From this directory:

```powershell
npm ci --ignore-scripts
npm run build:editor
```

Create your own `.env` from `.env.example` only on first setup. Do not overwrite an existing configuration. Set `RESCUE_AUTH_MODE=accounts`, then run:

```powershell
npm start
```

Open http://127.0.0.1:4310/. Onboarding leads to independent RESCUE sign-in/register, then the private dashboard. Account mode requires no operator unlock token. Existing operator data remains preserved and separate from new member workspaces; it is not automatically assigned to a public account. Email verification and automated password recovery are not implemented in this pilot.

## Engineering workflow

1. Projects → Add project → Upload a project ZIP (8 MB maximum). The import form offers a maintained checkout example. Public GitHub import and hosting-operator local import also remain available.
2. Source intelligence indexes declarations/imports and reports coverage, Python AST availability and restricted TypeScript diagnostics. Search returns actual source locations.
3. Sandbox editor uses Monaco with line numbers, code highlighting, folding, find/replace, tabs, persistent drafts, conflict checks, history and diff review.
4. Engineering agent offers ten focused modes over six permission-scoped read-only tools. Source disclosure to Meta requires explicit consent. Tool events, model requests and results are persisted; cancellation and budgets are enforced.
5. AI fix generates a selected-file proposal. Review the side-by-side diff, then explicitly approve. Only copied source changes; failed static validation rolls it back.
6. Runtime & release exports an engineering receipt. The maintained arithmetic fixture has an exact-version verifier with real failing baseline/passing corrected tests. It is labelled as a trusted fixture test, not a generic customer sandbox.
7. Arbitrary customer tests require a configured, authorized remote Vercel Sandbox. Only the exact reviewed snapshot is uploaded; no customer code runs on the primary server. Missing credentials keep the action disabled.

## Meta configuration

Set `MODEL_API_KEY` or `META_AI_API` only in your ignored server environment. The configured model defaults to `muse-spark-1.3`. This release's actual browser evaluation used live Muse Spark 1.3 to inspect a controlled checkout source and generate a minimal arithmetic repair. Missing/failing inference is reported as an error; mock tests are distinguished from live evidence.

No repair tool is granted to the investigation agent. Patch approval remains a separate deterministic API. Source, logs and tool output are untrusted data.

## Checks

```powershell
npm test
npm run check
npm audit
```

See [CURRENT_CAPABILITIES_AUDIT.md](CURRENT_CAPABILITIES_AUDIT.md), [TEST_RESULTS.md](TEST_RESULTS.md), [SECURITY_REVIEW.md](SECURITY_REVIEW.md) and [docs/USER_GUIDE.md](docs/USER_GUIDE.md).

## Availability limits

GitHub App enrollment/private checkout, full project LSP/debugger, semantic call/database graphs, multi-file patch transactions, automatic customer PR creation and customer deployment adapters are not implemented. Generic customer before/after runtime success is unverified until an authorized isolated runner is connected. A URL does not grant source or origin access. No automatic merge or deployment is available.

Original trusted sample health recovery remains available in Sample recovery lab. Its local processes and synthetic orders are explicitly separate from customer systems.

Monaco assets are generated rather than stored as large Git blobs. Deployment archives must include the built `public/monaco` directory. Package versions/licenses and the CSP build adapter are recorded in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Credentials, SQLite data, private deployment state and evaluation artifacts are ignored by Git.
