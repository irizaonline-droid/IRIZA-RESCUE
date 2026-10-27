# Public release verified

https://rescue.iriza.online is serving the DirectAdmin release over HTTPS. Cloudflare DNS record creation, public health/root/assets, API authorization, browser operator login, live sample preview and four sample checks were executed. The earlier Vercel routing blocker described below was resolved. Shared TASTE auth remains paused; operator authentication is active.

# DirectAdmin release: 20261027T212217Z

## Executed and verified

- DirectAdmin HTTPS login succeeded using the owner's supplied account. Password was not saved in project source, release archive or Git. Ephemeral panel session is local and gitignored.
- A separate rescue.iriza.online domain was created under the hosting account. No TASTE application, database, authentication code or existing service was edited or restarted.
- Dedicated application root: /home/mrcreati/domains/rescue.iriza.online. Backend listens only on 127.0.0.1:18106; Passenger proxies this domain to it.
- Node24.22.1 and node:sqlite verified on host. Source dependencies installed with npm ci --omit=dev --ignore-scripts. Remote syntax checks: 62 modules.
- Local full suite: 60 passed. Production-mode test rejects public deployment without explicit identity or a strong operator credential, and verifies 401 for unauthenticated API requests.
- Remote release health: HTTP200, release=20261027T212217Z; authenticated project API200; unauthenticated project API401. Backend liveness reveals only service/release/auth mode.
- Origin routing and HTTPS validated from the hosting server using the exact RESCUE hostname and --resolve to69.10.42.26, with certificate validation enabled.
- Live remote Meta test: HTTP200, model muse-spark-1.3, request chatcmpl-01a17f42-1974-7304-9104-8b2d10f579b2.
- Persistent application data and server credentials live outside versioned release folders. Configuration mode0600. A dedicated minute supervisor job was appended while retaining existing cron entries; the previous crontab was backed up.
- Operator mode is retained. Shared TASTE sign-in is paused; customer registration and multi-tenant identity are not released. No unverified account is elevated.

Artifact SHA256: 0dc0133b097b96ea2c081b5c1c0c54a8bb79121e1af3b734dc3d17a209ac19f3

## Public DNS change completed

Initially public https://rescue.iriza.online returned HTTP404 from Vercel DEPLOYMENT_NOT_FOUND after origin deployment. iriza.online authoritative nameservers are zainab.ns.cloudflare.com and lennox.ns.cloudflare.com. DirectAdmin's DNS zone is not authoritative. The owner opened the authenticated Cloudflare account. Browser DNS inspection showed no exact rescue record; wildcard A records pointed to Vercel addresses. A single explicit proxied A record rescue ->69.10.42.26 (Auto TTL) was created and its saved row verified. Root, wildcard and other records were not modified.

Completed change, limited to RESCUE: in Cloudflare iriza.online DNS, set an explicit A record named rescue with content69.10.42.26 and proxy enabled (Auto TTL). Replace only a conflicting exact rescue record, if present; preserve root, wildcard and other subdomain records. Record previous values for rollback. An explicit rescue record should override wildcard routing. The source origin has been independently tested for this hostname.

After that change, require public /healthz200 matching this release, root HTML200, unauthenticated API401, authenticated API200, editor bundle200, and browser login/navigation before declaring public launch complete. Do not claim DNS propagation is the only cause without rechecking the response.

The local production operator token is stored only in .private/production-operator-token. Do not publish it. Use the deployed operator entry after HTTPS DNS verification. Independent user-account authentication remains unfinished.

## Recovery and rollback

The activation script in scripts/directadmin/activate-rescue.sh accepts a staged release ID, installs in a dedicated folder, preserves prior configuration and current-release link, checks authorization/health, and writes only RESCUE's Passenger proxy and supervisor. It is a hosting deployment script, not a customer-code execution feature. For later release failure, restore the recorded previous release/configuration, then stop only the PID verified to belong to RESCUE's release directory and rerun its supervisor. Preserve the database and logs; do not restore an old database without a separate reviewed migration/backup plan. Public DNS rollback restores only the prior exact rescue record.


Public release verification after DNS: /healthz200 matched release20261027T212217Z, root HTML200 and editor-bundle.js200. The new domain default DirectAdmin placeholder index was archived so the Passenger route serves RESCUE at /. Origin API authorization passed; public API checks completed: unauthenticated401 and authenticated200. Browser operator login succeeded; navigation to Sandbox completed. A disposable sample998cad1e-6ba5-4b69-b2ce-118e94dc3aa9 was created and launched; its backend health, critical checkout journey, JSON contract and production-action-denial tests all passed. No customer source or existing local records were migrated.
