# Muse Code Studio 0.4.1 — executed upgrade

The old 500-file / 8 MB workspace rejection prevented the supplied MR-CREATIVIST repository from importing. The workspace now defaults to 64 MB of source and 4 MB per file, configurable using RESCUE_SOURCE_MAX_MB (8–256) and RESCUE_SOURCE_FILE_MAX_MB (1–16). GitHub workspaces have no separate file-count ceiling. Transport remains bounded: GitHub archives 16 MB compressed / 64 MB expanded / 5,000 entries; ZIP uploads 8 MB compressed / 64 MB expanded / 5,000 entries. Local operator traversal remains bounded to 20,000 files / depth 10. Secrets, symlinks and unsupported files are excluded. These are resource budgets, not unlimited storage.

## Use the tools

1. Open your project → Sandbox editor → **Import & prepare source**. For a website, attach the matching source first; a URL cannot supply code.
2. Preparation copies source, indexes supported symbols and runs parser checks. Open **Diagnostics**. Missing React/Next/dependency types appear as unresolved environment, not confirmed code defects. Type semantics cover up to 32 files / 512 KB; syntactic indexing covers all supported source within the worker time/memory budget.
3. Choose **Muse models**. The catalogue is fetched from this server's Meta account. Select a model and reasoning effort, test live access, then save the project setting. Hosted models require API access, not local weight installation. Model choice applies to engineering investigations, project evidence analysis and patch proposals.
4. **Guided AI repair** prepares checks, chooses an eligible failing file where possible, and pre-fills the proposal request. Review the issue before generating. A proposal never changes a file until exact explicit approval. Large files above 30 KB still need a smaller targeted patch workflow; whole-repository automatic rewrites are unavailable.
5. Monaco supports line numbers, syntax colors, search and existing draft/history/diff workflows. **Preview HTML** shows an imported static HTML document with scripts/forms/external resources blocked. It does not launch Next.js or a backend.
6. Run independent tests in an authorized isolated runner. The production runner connection is not configured; no arbitrary customer code runs on the primary server. Existing maintained checkout fixture verification is separate and cannot certify another application.

## Executed evidence

- Synthetic regression: 513 source files imported, indexed (512 symbols) and prepared; runtime NOT_RUN remains explicit.
- Supplied public MR-CREATIVIST archive: initial pinned inventory contained 513 eligible files / 2.2 MB, proving file count caused rejection. Browser connection pinned the then-current commit and imported 514 files / 1,805 symbols; Monaco opened actual auth.ts. No edits were made to that upstream repository.
- Browser model probe: Muse Wonder 1.0 returned LIVE_INFERENCE_VERIFIED, request chatcmpl-01a18434-5859-76b2-a356-d6df1affbd10. Per-project choice saved successfully.
- Separate live API probes accepted Wonder 1.0, Spark 1.3, Spark 1.3 contributor, Spark 1.2, Spark 1.2 contributor and Spark 1.1. Short token-limited probes prove API acceptance, not coding competence or a repaired project.
- Evidence files: artifacts/easy-connect/041-model-access.json, 041-repository-inventory.json, 041-code-studio.png, 041-full-tests.txt, 041-check.txt, 041-audit.json.

## Remaining limits

General customer runtime, interactive debugger/LSP, arbitrary terminal, private GitHub App installation, multi-file transactional AI edits, customer PR creation and customer hosting deployment are not implemented or connected. No automatic merge/deploy is added. TASTE source, environment, database and functions were untouched.

Official model and reasoning references: https://dev.meta.ai/docs/models and https://dev.meta.ai/docs/reasoning.
