# Local API v1

Base URL: `http://127.0.0.1:4310/api`. Every API request requires `Authorization: Bearer <operator token>`. JSON mutations require `Content-Type: application/json`. Maximum mutation body: 8 KiB. The server rejects unexpected Host headers and cross-origin mutations. It does not serve CORS headers. Browser tokens live only in session storage; logout removes that browser session's token.

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/status` | — | Lab health, model configuration, scenarios, incidents, audit validity |
| POST | `/probe` | `{}` | Fresh lab observations for `/health` and `/checkout` |
| POST | `/lab/inject` | `{"scenario":"stopped_backend"}` | New incident with actual failing HTTP evidence |
| GET | `/incidents/{id}` | — | Persisted incident |
| POST | `/incidents/{id}/investigate` | `{}` | Incident with validated proposal or `diagnosis_failed` |
| POST | `/incidents/{id}/approve` | `{"action":"restart_lab_backend"}` | Executed and verified incident, or failure state |
| GET | `/incidents/{id}/receipt` | — | Receipt when available, otherwise an error message |
| GET | `/audit` | — | `valid` flag and hash-chained audit events |
| GET | `/connectors` | — | On-demand probes for operator-configured endpoints |

Other scenario/action pairs: `invalid_config` / `restore_lab_config`; `broken_deployment` / `rollback_lab_release`. The API accepts no shell commands, production target identifiers or arbitrary monitoring URLs.

HTTP statuses: 200 success, 201 incident created, 400 invalid input or precondition, 401 invalid/missing token, 403 rejected host/origin, 404 missing route/incident, 405 unsupported static method, 413 oversized body, 415 unsupported content type. Diagnosis/execution failure states may return HTTP 200 with a non-success incident status; clients must inspect `status`.

## Example with PowerShell

```powershell
$operatorToken = (Get-Content .\data\operator-token -Raw).Trim()
$headers = @{ Authorization = "Bearer $operatorToken" }
Invoke-RestMethod http://127.0.0.1:4310/api/status -Headers $headers
```

## External developer boundary

This API is protected but restricted to the owner's local workspace. It is not a public multi-tenant developer API. External developer access needs TLS, scoped credentials, service ownership verification and tenant isolation before exposure. A read-only report credential is not yet available; the current operator token authorizes lab mutations too.

## Read-only connector configuration

Edit `config/connectors.json` locally, only for endpoints you are authorized to probe:

```json
[
  {
    "id": "owned-service-health",
    "url": "https://your-authorized-service.example/api/health",
    "tokenEnv": "OWNED_SERVICE_READONLY_TOKEN"
  }
]
```

`tokenEnv` is optional. It names a server environment variable, not an actual token. HTTPS is required. No redirects, query strings, embedded credentials, private or special IPv4 destinations, or IPv6 destinations are accepted. The generic connector reports HTTP reachability and timing; it does not validate the semantics of an external service's health JSON. Add a reviewed service-specific schema for that distinction.
