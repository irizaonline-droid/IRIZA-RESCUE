# Production recovery investigation — 2026-10-27

## Actual observations

| Target | UTC observation | Result | Cloudflare Ray ID |
|---|---|---|---|
| https://iriza.online/ | 20:17:16 | HTTP 502 | a51461f5999c2c2f-NBO |
| https://educo.rw/ | 20:17:17 | HTTP 502 | a51461fcfa3c4f1f-NBO |

Both responses show Bad gateway. This does not prove a specific root cause or identify the origin server. No production repair, DNS change, restart or publication was performed.

## Access blockers

The connected Vercel account returned HTTP 403 when listing EDUCO deployments and HTTP 404 for the selected project's domains. Searching its projects for iriza returned no matches. Vercel hosting of these domains has not been established. The Vercel CLI is not installed. Earlier Sandbox creation also returned 403; this is a separate capability from deployment access.

DirectAdmin was identified by the owner previously, but no authorized origin session or configured SSH connection is available. The owner declined opening its panel; that request is not repeated. A URL and ownership verification alone cannot grant origin administration.

## Concrete recovery sequence once origin access exists

1. Read domain-to-application mapping, upstream address/port, service status, disk/memory usage and web-server/application logs around 20:14–20:18 UTC. Preserve logs and configuration before changes.
2. Check the application's local health endpoint from the origin, then the reverse proxy upstream. Compare both sites' host mappings to determine whether the failure is shared.
3. Reproduce the measured failure in an isolated environment using the pinned source and sanitized configuration. Do not copy production secrets into a model or sample environment.
4. Review the exact proposed configuration/source change, backup and rollback procedure. Run independent application and critical-route tests.
5. Apply the verified change to the identified target, then check origin health, public HTTPS and actual customer routes. Record deployment/release identifier. Roll back on failed acceptance checks.

Do not change Cloudflare DNS or replace production with a sample simply to remove a 502 page.
