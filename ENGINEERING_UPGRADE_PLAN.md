# Engineering upgrade plan — 0.4.0

| Priority | Delivered | Still required |
|---|---|---|
| P0 working engineering loop | Real ZIP import, actual source reads, live Meta diagnosis, minimal reviewed patch, explicit approval, independent maintained-fixture before/after tests, export | A successful authorized remote run of arbitrary customer tests; GitHub App authorization and separately approved PR preparation |
| P1 workspace | Monaco, same-origin workers, tabs, drafts, version conflicts, history, side-by-side diff, source search, parser/type diagnostics, persistent source indexes | Full project LSP, debugging, split editable panes, rich multi-file patch transactions |
| P2 developer platform | Language capability registry, tool registry/policies, ten AI modes, bounded tool agent, cancellation/events, grounded architecture view, documented APIs | Additional verified ecosystem tools, database semantic models, service integrations |
| P3 expansion | Honest availability and disabled controls | Broader runtimes/scanners/profilers, audited execution adapters, optional publishing integrations |

The runtime adapter uploads only the exact workspace copy into a fresh remote VM. Never enable primary-host execution of untrusted code as a workaround. Before/after customer verification must use matching test definitions and exact revisions. Existing production and TASTE systems remain separate.

External blockers are connections, not UI switches: RESCUE needs a Sandbox-authorized Vercel project/token/team; GitHub needs an installed, narrowly scoped App; hosting releases need a project-specific authorized target and rollback plan. The coding assistant connector is not an application credential. No automatic merge/deploy is provided.
