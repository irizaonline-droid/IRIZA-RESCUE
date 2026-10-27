# Published systems: actual observations — October 27, 2026

The owner explicitly requested real tests and recovery of educo.rw, iriza.online and mrcreativist.ca, and supplied authorized GitHub repositories IRIZA-TASTE and EDUCO. This report describes what was observed and distinguishes it from repairs actually performed.

## Public HTTPS checks

Three rounds were run against four targets using DNS-validated, address-pinned HTTPS with a bounded response and certificate validation. The 12 observations passed availability criteria:

| Target | Observed result | TLS certificate expiry |
|---|---|---|
| https://educo.rw/ | 307 to https://educo.rw/en | January 14, 2027 |
| https://educo.rw/en | 200 | January 14, 2027 |
| https://iriza.online/ | 200 | January 5, 2027 |
| https://mrcreativist.ca/ | 200 | December 10, 2026 |

Raw UTC timestamps and measured response timings: `artifacts/published-site-checks.json`. These are bounded point-in-time checks, not uptime guarantees or a reproduction of the earlier 524 incident.

## Real browser checks

- EDUCO: `/en` loaded and the Marketplace navigation reached `/en/marketplace` with rendered public catalogue content.
- IRIZA TASTE: the root navigated to `/home`; the initial menu loading state resolved into actual public catalogue/menu cards. No browser errors were observed in the inspected console window.
- MrCreativist: homepage loaded public course, product and directory content.

No production orders, payments, sign-ins, messages or account changes were created. No protected customer data was inspected. Screenshots are saved locally. These checks cover public read paths, not purchase/payment certification.

## Authorized GitHub evidence

Both supplied repositories are private and the connected GitHub identity reports administrator/read/write permissions. Only read operations were used.

- IRIZA-TASTE latest inspected run: https://github.com/irizaonline-droid/IRIZA-TASTE/actions/runs/40120911211 — failed in `Build payload-cms`. The log explicitly reports missing persistent Payload CMS deployment environment, including `PAYLOAD_DATABASE_URL` and `PAYLOAD_MEDIA_ROOT`, and says to configure DirectAdmin Nginx Unit. No secret values were read.
- The inspected workflow `.github/workflows/deploy-vercel.yml` attempts Vercel production deployment, while root build/deploy commands mask failures with `|| true`. A mixed hosting strategy and masked command failures are verified pipeline concerns, but this does not prove they caused the prior Cloudflare 524.
- EDUCO's three most recent inspected CI runs completed successfully. The latest inspected SHA was `3e84ffe5329eab34e868b4fe1dc4089f79017398`, from October 21, 2026. A successful build does not prove current production origin health under load.

## Hosting boundary and next required evidence

The connected Vercel listing returned candidate EDUCO/IRIZA project IDs, but scoped domain lookups returned `404 Project not found`. That prevents verifying an authoritative deployment target through that connection. Current source references DirectAdmin for IRIZA, and the previous timeout screenshot points to an origin-response issue. The exact production origin process, logs and current deployment route remain unverified.

Before a production correction: identify the active hosting connection, inspect bounded origin/proxy/application error logs around the 524 timestamps, confirm current runtime/release ownership, inspect resource saturation/slow requests, and prepare a target-specific tested correction plus rollback. Do not redeploy to a stale Vercel workflow or restart a healthy host merely to claim recovery.

**Production changes performed: none.** The sites currently respond normally in the checked public paths. RESCUE has registered their real observations, but persistent monitoring remains off until app-level DNS/file ownership proof is verified. This is separate from the owner's authorization to investigate.
