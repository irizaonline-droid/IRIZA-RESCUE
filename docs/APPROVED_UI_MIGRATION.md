# Approved prototype replacement — October 27, 2026

The original frontend has been replaced with the supplied prototype's actual HTML shell, SVG icon set and unchanged CSS. The original IRIZA TASTE logo is retained at public/logo.png. No prototype simulation JavaScript is loaded. The application's existing Node.js HTTP, SQLite, Meta and sample-worker services remain in use; the parent Next.js application is unchanged.

## Rollback

Before changes, public/ and src/server.mjs were copied to artifacts/ui-rollback-20261027-115559. An intermediate backup exists at artifacts/ui-intermediate-backup. The original prototype folder is unchanged. Credentials, SQLite data and production configuration were not deleted.

## Screens and controls

| Screen | Working controls and backend |
|---|---|
| Overview | Prototype KPI, notice, trend/infrastructure and incident/quick-action layout; actual /api/status and /api/v1/studio/assets data; session latency samples; project and incident navigation |
| Projects | Website cards, sample project cards, add/check website, detail, public observation report, edit name, confirmed recoverable removal, archived-project restoration; /api/v1/assets and /sandboxes |
| Sandbox Studio | Saved sample selector, create/lifetime, launch/stop/reset, actual preview iframe, controlled 502, independent tests, optional browser tests, live Meta investigation, exact-bound approval, automatic independent verification, receipt/report export, runtime/test/evidence/history tabs, snapshot restoration, emergency stop |
| Incident Center | Persisted register, text/status filtering, incident detail, evidence, investigation, approval, receipt export |
| AI Support | Prototype conversation sidebar and chat layout, new/saved conversations, EN/FR, explicit evidence context, small text-log attachment reviewed before Send, real Meta requests, model request IDs, connection test, local ticket creation/review/resolution/export |
| Maintenance | Real public HTTP/TLS records, retained probe history, open website incidents, ownership verification, recurring monitoring controls, certificate recommendations |
| Developer API | Actual response playground, copy code, expiring read-only keys, one-time password-masked reveal/copy, revocation, scope explanation, OpenAPI and TypeScript SDK downloads |
| Settings | Dark/Light/System, workspace/operator name, incident-alert preference, support language, SQLite save, lock browser session |
| Documentation | Searchable guide list, guide selection/download, supplied source-book downloads |
| Audit Trail | Chained event validation, event expansion, JSON export |
| Shared shell | Approved sidebar/header/ribbon/footer, global searchable page navigation, active-incident notifications, theme toggle, mobile drawer, keyboard modal focus trap/Escape, progress/error states |

Unsupported GitHub App enrollment, arbitrary-code execution, signed application-agent enrollment and email delivery are disabled with an explanation. No fake connection or simulated successful repair is substituted.

## Functional evidence

- npm test: **22 tests passed**, zero failures, final full run.
- npm run check: **28 JavaScript modules** passed syntax checks after old frontend removal.
- New tests verify settings validation, authentication/read-key denial, restart persistence, project rename, tenant scope, recoverable archival and retained observations.
- Browser: all ten sidebar screens loaded with their expected heading; no captured browser console errors.
- New Sandbox screen: existing QA sample 3f00e58d-e2a9-485e-908e-9e4ee88ac9d9 launched; controlled 502 injected; actual tests failed; real Muse Spark diagnosis returned lab.restart_service; exact proposal reviewed and approved; independent health/checkout/contract/policy tests passed; READY_FOR_REVIEW and recovery receipt displayed. Provider provenance remains in the saved project report. A later necessary server restart stopped temporary previews; the persisted receipt remains available.
- New Support screen: live English Muse response request chatcmpl-01a17cd8-2055-7740-919c-76d25336327f, 2,153 returned tokens, saved conversation d23ed64f…; no repair executed by support.
- Light theme saved and survived a full browser reload. Dark and System controls use the same persistent theme mechanism.
- Overview checked at 360, 390, 768, 1024, 1440 and 1920 px: no document horizontal overflow. Other screens checked at 360 and 1440 px: no observed document overflow. Mobile menu navigation was exercised.
- Desktop Overview visually inspected against previews/01_Overview_Dark.png; prototype CSS remains identical to its supplied source. Screenshot evidence includes Dark/Light Overview, verified Sandbox and live AI Support. No numerical pixel-difference score is claimed.

## Files and backend changes

Active frontend: public/index.html, prototype.css, workspace.css, workspace.js, theme-init.js and original brand/font assets. Obsolete app/studio/platform/agent/redesign JS and CSS were removed from public after verification. /app.js remains a compatibility alias to the new workspace.js. Old hash routes are mapped to the new screen names.

Backend: operator-only /api/v1/settings using studio_settings; asset rename/archive/restore and archive listing; recoverable archive metadata table with retained observations and disabled monitoring. Existing routes, policy engine, workers, credential storage and Meta transport were preserved.

## Remaining limits

This is a single-owner local workspace, not a hosted multi-tenant platform. Production recovery remains unavailable without an authorized origin connection. The runner executes only the trusted sample. No deployment, DNS change, repository publication or production mutation was performed. Exact decorative sample text/data from the prototype was replaced with truthful operational content; fabricated uptime and scripted AI output were not retained. Full formal accessibility certification and numerical visual regression baselines are not completed.
