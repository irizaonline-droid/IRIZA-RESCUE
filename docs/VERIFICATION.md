# Verification — October 27, 2026

Story: the operator injects a real fault through the browser, sends an authenticated investigation/approval to the API, executes a fixed local repair, verifies HTTP recovery, and reloads the persisted SQLite receipt.

| Boundary | Result | Evidence |
|---|---|---|
| UI renders | Passed | `artifacts/dashboard-light.png`, `dashboard-dark.png`, `dashboard-mobile.png` |
| Browser → API | Passed | Browser automated 502 injection, investigation and explicit approval |
| API → child process | Passed | Tests observe actual 502, 500 and 404 responses before repair |
| Execution → verification | Passed | Three consecutive probes per recovery; both routes return 200 |
| SQLite → UI | Passed | Receipt appears and recovery count survives browser reload |
| JS errors | Passed | No browser page errors during tested flow |
| Mobile layout | Passed | 390 px viewport, no horizontal document overflow |
| Policy/security tests | Passed | Six Node test groups, including arbitrary command rejection, stale revision, production target, replay and auth/origin checks |
| Meta request contract | Mock passed | Correct endpoint, bearer key and structured response handling; HTTP/JSON failure rejection |
| Credentialed Meta access | Not tested | No MODEL_API_KEY configured for this implementation |
| External IRIZA service probes | Not tested | Empty authorized connector registry |
| Container deployment | Not tested | Template only, no production exposure |

Initial audit-tampering test revealed malformed JSON could throw in chain verification. Fixed verification to hash raw stored payloads and return false for mismatches. The subsequent test run passed 6/6. Browser verification also exposed a helper attempting to select the desktop theme while in mobile viewport; corrected the helper to restore desktop size first. Source paths with spaces are handled with `fileURLToPath`.

Test outcomes and receipt screenshots describe the local-rule demonstration. They must not be presented as evidence of a credentialed Meta diagnosis or production repair.
