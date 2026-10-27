# Local Studio threat model

## Assets and boundaries

Operator credential and SQLite database remain on the owner's computer. A preview ticket authorizes only read access to one trusted sample project's three routes. Developer keys are hashed, expire in 24 hours, can be revoked, and authorize only sandbox list/detail/gate/report reads. Meta keys are server-only. Existing IRIZA commerce and identity systems are outside this application's authority.

## Implemented controls

Host and Origin validation, loopback binding, no permissive CORS, bounded JSON requests, CSP and output escaping. Only fixed sample worker source executes; no repository cloning, shell, SSH or arbitrary path execution exists. A deterministic action catalog and exact proposal/target/revision/build/nonce/digest/expiry approval bind each repair. Operation locks cover mutations and maintenance. Current faults, stale verification, broken checkout and requested-but-unsupported browser tests cannot produce a passing gate. Snapshot restoration and failure receipts cover unsuccessful verification.

Model input is bounded fixture data and sanitized logs; model output is schema checked and never used as executable authority. Support is read-only, limited to eight requests/minute, and has no tools that mutate state. Local guidance is labeled separately from live Meta. Preview tickets cannot call operator routes. The iframe disables scripts, external network connections and forms. Arbitrary third-party code stays disabled because no secure runner was audited.

## Limits

The worker is a trusted host process, not an OS sandbox or a hostile-tenant boundary. Three active previews and TTLs limit workload count/lifetime, but CPU/RAM are not kernel-enforced quotas. Authentication is single-owner; tenant filtering exists in storage and tests but multi-user enrollment, federation and hosted tenant isolation are not implemented. Emergency stop blocks new work, not instructions already executed. In-process work is not a durable distributed queue; process restarts stop previews and require revalidation. The audit chain is not externally anchored or signed. Model token/charge accounting is recorded when returned, but a persistent monetary cost budget and circuit breaker remain future hardening. Do not publicly expose this local server.

External HTTPS connectors remain operator-configured and read-only with public-address checks, pinned DNS, TLS validation and no redirects. There is no unauthenticated arbitrary URL scanner or production recovery endpoint.
