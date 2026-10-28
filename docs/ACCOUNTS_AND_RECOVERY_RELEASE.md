# Standalone RESCUE accounts and runtime recovery

RESCUE onboarding, sign-in and registration are independent of TASTE. Original iriza.png is reused unchanged for the browser favicon, touch icon and branding. No shared TASTE database, cookie or account edits are required.

## Account flow

Public / and /onboarding show the introduction. /register (including /regiter alias) creates an account; /signin signs in; successful authentication opens /dashboard. No operator-token prompt is presented in accounts mode. Sign out revokes the session and returns to onboarding. Existing operator APIs retain their bearer protection for hosting maintenance, but account cookies never authorize that operator store.

Passwords are hashed asynchronously with scrypt N32768/r8/p3 and a unique random16-byte salt; no plaintext passwords or session tokens are stored in the database. Session identifiers are256-bit random values; only SHA256 digests are stored. Public cookies use __Host-rescue_session, Secure, HttpOnly, SameSite=Strict, host-only Path=/ and seven-day expiry. Auth and account mutations check the exact origin. Registration/login are bounded and rate-limited. Public registration is a pilot, capped at20accounts and3registrations per10minutes per observed network address; expensive password work is serialized.

User workspaces are physically separate SQLite stores under persistent members/<uuid> folders, behind private loopback app instances and server-only random credentials. User identifiers come exclusively from the validated session, never a request-body workspace selector. Tests verify two accounts retain different settings and Meta provenance. Parent operator data is not copied to users. Host filesystem imports are denied to customer sessions and the local-folder option is hidden. GitHub access in member instances does not borrow the operator's token. Public-repository source copies remain available. Arbitrary terminals, deployment credentials, remote agent enrollment and arbitrary customer-code execution are not granted by registering.

There are at most two active account workspaces on this shared hosting pilot; idle workspaces close after15minutes while keeping their data. Meta's global hourly budget remains shared and bounded. Production also caps all trusted sample workers at three across account workspaces; the account router itself does not start a redundant sample worker. Node heap and thread-pool limits apply to RESCUE only. Email addresses are not verified, and automated password recovery is not available; both are disclosed on the auth pages. Do not claim production-grade email enrollment or unlimited SaaS scale.

## Verification

Full RESCUE suite62passed; syntax checks68modules. Further targeted account tests passed after adding exact-origin checks and Meta-history isolation. Browser staging: onboarding -> register -> dashboard without unlock -> sign out -> sign in. Public post-deployment verification is recorded in the audit after rollout.

## TASTE runtime recovery

The owner clarified runtime-only recovery is authorized, without environment/function changes. Its origin18101 refused connections. The existing, unmodified iriza-supervisor.sh started CMS, Synapse, Python and main services at2026-10-27 21:44UTC (23:44 Kigali). Public /, /home, /api/health and /sign-in returned200. The homepage rendered real navigation and product listings in the browser.

SHA256 before/after matched for cms.env, main.env, synapse.env, iriza-supervisor.sh and the current main server.js. No environment values were printed; no source/configuration/database edits or new TASTE deployment were made. Runtime PID/fingerprint/heartbeat/log records changed through the existing supervisor. Historical logs showed process resource exhaustion; this successful restart does not establish a permanent fix or exclude recurrence. Further infrastructure changes require a separate reviewed diagnosis and owner authorization.
