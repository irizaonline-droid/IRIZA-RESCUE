# IRIZA RESCUE

**Winning Team — local recovery intelligence.** Detect an actual HTTP fault, investigate its evidence, approve a restricted repair, and independently verify the result.

**Sandbox & Recovery Studio is implemented.** Open **Sandbox** below Integrations to create a temporary sample project, use its actual preview, run tests, inject controlled faults, review a diagnosis/diff, approve a fixed repair, restore snapshots and export JSON/Markdown release reports. **Documentation** contains ten searchable guides, original PDF/specification downloads, OpenAPI, a TypeScript client and read-only developer keys. The bottom-right support widget uses bundled guide retrieval without a key or real Meta inference when configured. Header sun/moon icons control appearance.

Read `docs/USER_GUIDE.md` for complete instructions and `docs/STUDIO_IMPLEMENTATION.md` for implemented boundaries. The D: RESCUE folder supplied by the owner is the specification source; this running application remains in the C: RESCUE workspace previously requested.

This is an original standalone local implementation created on October 27, 2026. It does not modify IRIZA TASTE. No cloud resources, GitHub repository, production repairs, or DNS changes are created.

## Start on Windows

1. Install Node.js 24 or later (the implementation was tested with Node 25.9.0).
2. Double-click `Start-Rescue.cmd`, or run `npm start` in this folder.
3. Open http://127.0.0.1:4310.
4. Open `data/operator-token` in Notepad and paste its contents into the unlock form. Treat this file as a password. The token is generated automatically and never embedded in the frontend.
5. Select **Failure lab**, inject a failure, select **Investigate evidence**, then **Approve lab recovery**. Download the resulting receipt.

No dependency installation, VS Code, database server, Docker, or internet connection is required for the local-rule demonstration. Node's built-in SQLite stores incidents and audit events under `data/`.

## Demonstrated faults

| Scenario | Actual failure | Restricted recovery |
|---|---|---|
| Stopped backend | Child process stops; proxy returns 502 | Start the fixed lab worker |
| Invalid configuration | Worker returns 500 | Restore the known valid configuration |
| Broken deployment | `/checkout` returns 404 | Switch the fixture to its stable release |

The deployment scenario uses a real HTTP fixture with a controlled release switch; it is not a cloud rollback. The configuration scenario changes disposable runtime state. No AI-generated commands are executed. The lab is a trusted child process, **not an OS security sandbox** for arbitrary untrusted code.

## Enable real Meta diagnosis

Copy `.env.example` to `.env`, set `MODEL_API_KEY`, then restart. The server calls Meta directly at `https://api.meta.ai/v1/chat/completions` using `muse-spark-1.3`. Documentation was checked on October 27, 2026. The key remains on the server; do not paste it into the dashboard.

Without a key, the interface explicitly identifies diagnoses as **local rules**. They are not AI results. With a key, an API or validation failure blocks the proposal; the application never silently relabels fallback text as Meta output. A live credentialed Meta request has not yet been verified.

## Verification

```powershell
npm test
# While npm start is running: explicitly runs AND approves three fixed local repairs
npm run demo
```

`npm test` checks real HTTP failures and recoveries, authentication, cross-origin rejection, replay prevention, policy boundaries, model validation, redaction, restricted network addresses, persistent records, and audit tampering. The Meta unit test uses a mock transport and does not prove live access.

`scripts/browser-check.mjs` is a developer verification helper that currently uses the existing IRIZA TASTE Playwright installation and installed Microsoft Edge. It is not needed to run the application. Screenshots and demo receipts are written under `artifacts/`, which is excluded from Git by default.

## Files

- `src/`: HTTP application, recovery engine, lab process, Meta adapter, policy, connectors, SQLite store.
- `public/`: responsive dashboard, Light/Dark/System theme, locally hosted IRIZA logo and Mulish font.
- `tests/`: built-in Node test runner suite.
- `config/connectors.json`: operator-owned read-only endpoint allowlist, initially empty.
- `docs/`: audit, architecture, API specification, decisions, source checklist, changelog, and remaining work.

## Limits before production

This is a working local prototype, not a production deployment. It binds only to loopback, uses one operator token, and cannot repair external targets. External connectors are optional and read-only. Production needs scoped identities, TLS, hardened isolated runners, durable operation reconciliation, rate limits, externally anchored audit signatures, retention policy, and independent security review. Do not expose the local server through a public tunnel.

The project domain is **`rescue.iriza.online`**, as explicitly confirmed by the owner. This supersedes the older `bridge.iriza.online` suggestion in the pasted launch instruction. No DNS or hosting changes have been made; the application currently runs locally. The four specification books and master/studio Markdown guides have now been supplied and read; authenticated official hackathon rules still require verification before submission. The internal target remains November 3, 2026.

Brand provenance: `public/logo.png` is the owner's existing IRIZA icon. `public/mulish.woff2` comes from the owner's installed `@fontsource-variable/mulish`; its license is included. No proprietary application source or existing credentials were copied. Review branding permission before publishing a public repository.


## Project workbench update
Open a project to access its Scan Center, DevOps, AI analysis, copied-source editor and vulnerability checks. See docs/PROJECT_WORKBENCH_RELEASE.md for implemented scope and executed evidence. Run npm ci for the official Vercel SDK dependency. Runtime checks require the explicit RESCUE_VERCEL server configuration; the current connector attempt was denied 403. No live customer runtime or production deployment is claimed.
