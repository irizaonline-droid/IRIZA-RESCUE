# IRIZA RESCUE 0.5.0 - Connected Code Studio

Date: 2026-11-04. Scope: RESCUE only, Node.js stack and existing database/auth retained.

## Delivered

- One desk joins file explorer, Monaco editor, persisted Muse engineering chat, model/reasoning controls, Problems, Changes and Report.
- Six main project tools replace the long tab row. Additional engineering capabilities remain available under More tools.
- Full-stack Expert uses high reasoning, up to six model steps and fourteen read-only tool calls. Repository listings support pagination and path filtering. Same-revision follow-ups carry bounded prior context; cross-project/stale contexts are rejected.
- Real job/tool activity, cancellation, source links and provider request IDs. No fabricated live token stream or hidden chain-of-thought.
- Exact original/saved/proposed source comparison, numbered red/green lines, addition/deletion counts, split/unified display, explicit approval and rejection.
- Scan Center groups deduplicated recorded findings into source errors, environment gaps and unavailable tools. Freshness, TypeScript coverage, runtime and dependency audit remain separate.
- Existing tenant isolation, hash/version/nonce/digest/expiry checks, rollback, source sanitization, authentication and production protection retained.

## Executed evidence

| Capability | Result | Evidence |
|---|---|---|
| Automated regression suite | PASS | npm test: 92 passed; artifacts/studio-05/tests-initial.txt |
| Module syntax | PASS | npm run check: 100 modules |
| Editor build | PASS | npm run build:editor, five same-origin workers |
| Live Muse investigation | PASS | Synthetic 5-file checkout fixture, muse-spark-1.3, 5 provider requests, 27 persisted events |
| Live patch generation | PASS | chatcmpl-01a1a50d-d6d6-711d-a69b-6fed200a3750; exact +1/-1 checkout.mjs change |
| Explicit browser approval | PASS | Saved sandbox revision advanced 1 to 2; imported original retained |
| Independent maintained fixture | PASS | FIXTURE_BEFORE_AFTER_PASS, fixed Node test process; not customer-code isolation |
| Model discovery/save UI | PASS | Six server-listed Muse models; saved spark selection |
| Scan UI and mobile layout | PASS | Current revision grouped evidence; 390px layout without horizontal page overflow |
| Customer runtime | NOT CONFIGURED | No authorized isolated runner credential in this deployment |
| Generic hosting/Git deployment adapter | NOT IMPLEMENTED | No customer auto-push, merge or deploy |

## Validation and release commands

```powershell
npm test
npm run check
npm run build:editor
npm run docs
git diff --check
```

Browser journey used an isolated synthetic QA account and data under artifacts/studio-05/browser-data. No customer source was sent to Meta for these tests. Approval/rejection unit tests also verify stale/cross-project denial and preservation. Large repository execution remains a separate runner capability. Source checks retain bounded syntax/type coverage; unresolved aliases/dependencies are not mislabeled as confirmed source defects.

## Release safety

Publish only RESCUE to rescue.iriza.online after checks. Back up tenant SQLite databases, preserve production environment except release ID, verify exact release health/auth/asset hashes and record retention. Retain rollback release. IRIZA TASTE files, environment, database, authentication and service are outside this upgrade.

Final hosted QA correction: preserve measured TypeScript checked/eligible counts in new validation receipts; older receipts without coverage display not recorded. Regression test executes a real one-file TypeScript check and verifies persistence.
