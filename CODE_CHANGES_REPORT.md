# Code changes report — November 2, 2026

Local RESCUE 4.0 increment 1; baseline `42a8463`. Not a completed 4.0 production release.

| File | Change |
|---|---|
| src/change-statistics.mjs | Bounded LCS alignment, saved-vs-imported counts, hashes, language/directory/test/config grouping and Markdown report |
| src/environment-metadata.mjs | Dotenv metadata parser, five project stages, optimistic versions, lexical references, duplicate/unused/missing/public-name diagnostics; no value storage |
| src/project-workbench.mjs | Engineering report assembly, revision-aware evidence, safe event projection, exact original restore with confirmation/hash/version; future saved events include line deltas |
| src/server.mjs | Tenant-protected GET engineering-report, GET/POST environment-metadata and POST restore; bounded environment request size; new frontend script |
| src/monaco-entry.mjs | Persisted browser preferences and supported action bridge, preserving CSP and semantic-analysis limitations |
| public/engineering-upgrade.js | Project-scoped statistics/env views, real downloads, nested explorer, breadcrumbs, preferences and read-only draft/original diff dialogs |
| public/project-hub.js / .css | Project tabs, metadata source labels, responsive panels/charts/timeline, compact breadcrumb |
| public/workspace.js | Active project KPI now includes uploads, GitHub and local copies |
| public/index.html | Loads the new module within the existing shell |
| tests/engineering-upgrade.test.mjs | Independent Git comparisons/apply, real account/API flow, optimistic restore, cross-user denial and dummy secret persistence scan |

Reports never include source text, environment values, raw model responses or runtime logs. JSON has exact artifact/file hashes and real event identifiers. Unsupported semantic/file-lifecycle metrics are disclosed. Changed-line totals become unavailable when the bounded alignment budget is exceeded, rather than returning invented precision.

Rollback: the baseline branch is preserved. Reverting source is separate from rolling back any database; test databases are isolated. This change adds a metadata table only when the new server starts. It does not migrate or delete existing records.
