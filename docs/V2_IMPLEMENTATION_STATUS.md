# Full Platform v2 implementation status — October 27, 2026

Read `CODEX_MASTER_PROMPT_FULL_PLATFORM_v2.md`, `PROJECT_EXPLAINED_IN_PLAIN_ENGLISH.md`, README_START and the newly pasted full-stack instruction. The four prior PDFs/master/studio guides had already been read. They are specifications, not completion claims. The explicit owner domain remains rescue.iriza.online; the existing C: RESCUE app remains the working location.

## Implemented and verified in this increment

- Server-only credential configuration in ignored `.env`, normalized from supplied META_AI_API to MODEL_API_KEY. No key copied into source, UI, screenshots, reports or Git.
- Real Meta connectivity: HTTP 200, actual model muse-spark-1.3, returned request ID and token usage.
- Bounded read-only evidence tool loop: probes, sanitized logs, timeline, fixture snapshot, allowed action catalogue and knowledge guide. Unknown tools, external targets and privileged parameters are rejected. Maximum four model rounds, six tools per round. No execution/approval tool.
- Validated diagnosis with hypotheses, actual evidence IDs/hashes, uncertainty, request provenance, tool trace, usage and bounded allowlisted proposal. Existing deterministic human approval/execution/independent verification retained.
- Central Meta transport: fixed official endpoint, response bounds, request timeouts, at most one retry for transient statuses, concurrency cap, session/hour request/token budget and short circuit breaker. Metadata is persisted separately from secrets and prompts. Actual charges are not supplied by the provider and remain unknown; no monetary cost is invented. Budget counters are process-local; persistent account-wide spending enforcement remains future work.
- Actual live-Meta three-scenario demo: real 502, 500 and health-200/checkout-404 faults; approved fixture repair; independent successful verification. Raw receipts and live tool/model traces: `artifacts/live-meta-demo.json`. Browser also completed a live-Meta legacy lab recovery and displayed the actual request ID.
- New additive SQLite migration for assets, ownership challenges, public probe history, observed incidents, model request records, saved conversations, support tickets and comments.
- Safe public HTTPS registration/probes with A/AAAA destination checks, pinned connection address, blocked special/private networks, bounded bodies, no redirects, TLS evidence and approved routes. No URL-based repair authority.
- DNS TXT or verification-file ownership challenges: hashed proof storage, expiration, tenant binding, one-time use; scheduled checks only after ownership proof and seven-day revalidation. Two consecutive failed observations open an incident; observed recovery never claims an executed remote repair.
- Persistent support conversation/ticket APIs and UI, local escalation with no external message, state updates/comments/export, French/English model prompt selection. Kinyarwanda remains explicitly disabled pending evaluation.
- Websites & Monitoring and Support Center screens, real TLS/history/ownership controls, live usage records. Failure Lab now has an explicit active-incident recovery card and prevents accidental second injections; the overview plus opens recovery or Sandbox.
- Typed SDK and OpenAPI expanded for implemented assets/ownership/support/model endpoints. Legacy APIs remain compatible; structured error fields added.

## Verification

18 automated test groups passed during this increment, including SSRF/DNS-address blocking, tenant and one-use ownership proofs, scheduling expiry, incident thresholds, support/ticket persistence and redaction, read-only tool calling and forbidden tool rejection. Existing 13 groups remain passing. Syntax checks include 26 JavaScript modules at this point. SDK typecheck is run separately. Live demonstrations are separately identified from mock unit tests and the earlier 30-run LOCAL RULE evaluation.

## Still not the complete commercial platform

The app still uses the established dependency-light Node/browser-JS/SQLite local architecture. It has a single operator workspace and read-only developer keys; full user registration, multi-user organization membership/RBAC, production SSO and multi-tenant hosting are not implemented. There is no arbitrary Git runner, general patch executor, agent enrollment, production remote repair, durable distributed job queue, signed external webhook delivery, email/SMS notification delivery or authenticated hackathon submission. No empty endpoints or unused tables were added to pretend otherwise.

User authorization to investigate published systems was used for real public/browser checks and read-only GitHub inspection; see PUBLISHED_SYSTEMS_INVESTIGATION.md. Active hosting/origin logs are still required before choosing a production recovery action. No public deployment, DNS mutation, production database write or repo push occurred.
