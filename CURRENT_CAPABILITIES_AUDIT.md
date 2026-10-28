# Current capabilities audit — 2026-10-28

Version 0.4.0. Evidence: executed tests and actual browser → API → tenant SQLite → rendered result journeys. Previous audit narratives are historical where superseded here.

| Capability | Classification | Evidence and practical scope |
|---|---|---|
| Node HTTP / SQLite backend | WORKING | Existing API regression suite; existing stack preserved |
| Independent accounts and tenant workspaces | WORKING | Register/sign-in browser journey; account and engineering-isolation tests |
| Email verification / password reset | NOT IMPLEMENTED | Auth screens disclose this limit |
| ZIP project upload | WORKING | Real browser upload of five-file checkout fixture; API persists private copied source |
| Archive safety | WORKING | Traversal, drive paths, symlinks, duplicates, entry/expansion bounds, UTF-8 and CRC validation; no extraction to host paths |
| Pinned public GitHub source import | WORKING | Existing public-source and workbench tests; commit-pinned archives |
| Scoped GitHub App installation / private checkout | NOT IMPLEMENTED | Requires App registration, installation flow and configured credentials |
| Website observations / domain proof | PARTIAL | Existing public checks and verification; URL does not grant source/origin access |
| Local import | WORKING | Hosting-operator only; denied to account sessions |
| Monaco editor | WORKING | Browser opened actual imported JS/Python files; same-origin workers; no console errors in tested flow |
| Tabs, draft autosave, conflict checks, history, diff review | WORKING | Server tests plus real Monaco proposal view; persistent draft data stored per tenant |
| Project LSP / debugger / arbitrary terminal | NOT IMPLEMENTED | Editor-level features are not advertised as a project language server |
| Source intelligence | PARTIAL | TS/JS declarations/imports/routes, Python AST symbols, manifest frameworks, test discovery; actual path/line references |
| Type diagnostics | WORKING | Restricted compiler worker detects TS2322 across virtual source; no project plugin execution |
| Analysis resource boundaries | WORKING | One concurrent worker, 192-MB old-space cap, 12-second timeout; source limits remain 500 files / 8 MB |
| Semantic call graph / database model graph | NOT IMPLEMENTED | Syntactic edges and inferred route candidates are labelled |
| Architecture explorer | PARTIAL | Current file/module import view and route candidates; no invented service topology |
| Engineering agent | WORKING | AI SDK ToolLoopAgent; live Muse Spark 1.3 made four provider calls and read actual controlled fixture source |
| Ten engineering modes | WORKING | Different focus and bounded step/tool budgets; no extra write or execution authority |
| Tool policy registry / cancellation | WORKING | Six schema-validated read-only tools, workspace disable policy, persisted events, timeout and cancellation tests |
| Dependency vulnerabilities | PARTIAL | Exact-version OSV advisory lookup; not proof of exploitation or a complete security audit |
| AI proposal / exact approval / rollback | WORKING | Live browser generated and approved operator-only arithmetic patch; static checks and rollback regressions |
| Maintained before/after functional demo | WORKING | Exact reviewed fixture: broken baseline exit1, corrected exit0 across three fixed Node tests; downloaded engineering receipt |
| Customer runtime verification | PARTIAL | Exact-snapshot remote adapter implemented/mock tested; no RESCUE remote credentials or authorized Sandbox project is configured |
| Customer app build/preview/test success | NOT IMPLEMENTED | No executed successful customer remote journey; no Docker/Podman runner available here |
| PR creation / Git push / production release tools | NOT IMPLEMENTED | Patch export works; app cannot create PRs, merge or deploy customer projects |

No new capability is labelled operational from a mocked provider response alone. The live model exercise used a maintained synthetic checkout project, not a customer repository. Its receipt explicitly retains customerRuntime NOT_VERIFIED and published=false.

Evidence files: artifacts/easy-connect/v3-browser-engineering-receipt.json, v3-final-tests.txt, v3-final-syntax.txt, v3-npm-audit.json. These are local ignored artifacts. No TASTE environment, source, function or database was edited for this upgrade.
