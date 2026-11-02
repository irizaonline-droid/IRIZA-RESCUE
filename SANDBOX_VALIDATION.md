# Sandbox validation — November 2, 2026

| Scope | Result | Evidence |
|---|---|---|
| SQLite source copy / manual edits | PASS | Browser changed revision 1→2; exact original restored as revision 3; initial import preserved |
| Version/conflict/approval and original restore | PASS | API rejects missing confirmation/stale version; confirmed restore resets diff and records history |
| Git patch compatibility | PASS | Actual exported patch passes git apply --check and applies to expected source content in a temporary directory |
| Live AI reviewed maintained repair | PASS — MAINTAINED FIXTURE ONLY | Spark request and fixed before/after assertions; see AI_ENGINEERING_TEST_RESULTS.md |
| Generic VM provisioning / dependency installation / build | NOT VERIFIED | No successfully authorized customer runner connection demonstrated |
| Generic customer preview/debugger/logs | NOT IMPLEMENTED as a complete verified flow | Static sanitized HTML is separate from dynamic execution |
| Provider network/resource/cleanup policies | SIMULATED PROVIDER TEST | Existing adapter tests inspect mocked provider calls; not a live VM isolation certification |
| Environment injection | NOT IMPLEMENTED | Metadata-only profiles contain no runnable values |
| Staging deployment/rollback | NOT IMPLEMENTED | No project-authenticated adapter/candidate/rollback receipt |

The primary web server does not execute arbitrary imported customer code. No weaker host execution fallback was introduced to make a test appear green. Trusted maintained fixture processes have fixed source fingerprints and are not represented as a security boundary for untrusted repositories.

Priority 0 remains unfinished until an authenticated isolated runner can demonstrate real customer installation/build/tests with resource, network, cancellation and cleanup evidence.
