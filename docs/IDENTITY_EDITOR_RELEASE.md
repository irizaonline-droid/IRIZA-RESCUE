# Identity and workstation increment

Implemented locally: CodeMirror 6 with line numbers, syntax highlighting (JS/TS/Python/JSON/HTML/CSS/Markdown), folding, search, bracket matching, indentation and undo. All dependencies are bundled locally; editor changes use the existing revision-bound sandbox Save API. CSP permits editor-generated styles through a per-response nonce, not unsafe-inline.

Cards now use compact content-driven spacing. Support uses a bounded conversation viewport and scrollable history with a visible composer. Original logo remains.

## Shared identity preparation

/signin, /sign-in, /register, /regiter and /sign-up route to IRIZA's existing sign-in/registration pages with the fixed rescue.iriza.online callback. Passwords, OTP and email verification remain in IRIZA TASTE's own identity database and flows. No password or identity database is copied.

RESCUE_ALLOWED_EMAILS enables server validation of the shared __Secure-iriza.session-token cookie against https://iriza.online/api/auth/profile. Only explicitly permitted emails may access this existing administrator workspace. All ordinary TASTE users do NOT automatically become operators. Successful identity validation enters directly without a second unlock. Public origin configuration refuses startup without an allowlist. The local token fallback remains until shared identity is configured and verified. No production identity round trip has succeeded yet; IRIZA origin availability is a prerequisite. This is not a completed multi-tenant customer platform.

The parent IRIZA TASTE src/lib/auth-return.ts now recognizes the exact RESCUE origin and rescue context; seven parent redirect tests pass. This parent change must be deployed with TASTE before relying on the callback. It preserves other contexts and rejects lookalike domains.

## Verification

59 RESCUE tests passed. Seven TASTE redirect tests passed. Browser inspection confirmed CodeMirror line numbers and coloured Python source. npm audit reported zero advisories. New identity tests use mock profile responses; no real account sign-in is claimed.

## Production requirements

DirectAdmin credential file path is required by the existing diagnostic scripts and has been requested without asking for passwords in chat. No production access is currently configured. RESCUE needs Node >=24 (node:sqlite); the inspected TASTE supervisor defaults to Node20 and EDUCO to Node22, so those runtimes must not be reused blindly. Do not replace their services with RESCUE.

Verify an available Node24+ binary, dedicated persistent data directory, process supervision, isolated sandbox provider, shared identity, HTTPS reverse proxy, backups and rollback before enabling rescue.iriza.online. DNS alone is not a deployment. The origin IP mentioned in old EDUCO scripts has not been independently confirmed as the current target. No DNS mutation or production repair is claimed.
