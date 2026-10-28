export const referenceDocuments=[
{id:'project-book',file:'01_IRIZA_RESCUE_PROJECT_BOOK.pdf',title:'Project Book',type:'application/pdf'},
{id:'blueprint',file:'02_IRIZA_RESCUE_TECHNICAL_BLUEPRINT.pdf',title:'Technical Blueprint',type:'application/pdf'},
{id:'engineering',file:'03_IRIZA_RESCUE_ENGINEERING_MANUAL.pdf',title:'Engineering Manual',type:'application/pdf'},
{id:'compliance',file:'04_IRIZA_RESCUE_HACKATHON_RULES_AND_EVIDENCE.pdf',title:'Hackathon Rules & Evidence',type:'application/pdf'},
{id:'master',file:'CODEX_MASTER_BUILD_PROMPT_v1.1.md',title:'Master Build Prompt v1.1',type:'text/markdown'},
{id:'studio',file:'CODEX_SANDBOX_AND_RECOVERY_STUDIO_PROMPT.md',title:'Sandbox & Recovery Studio Prompt',type:'text/markdown'}
];
export const guides=[
{id:'engineering-v3',title:'Import, investigate and review a source repair',category:'Engineering Studio',summary:'ZIP import, source intelligence, live Meta tools, explicit approval and exact evidence.',body:`# Source engineering workflow
1. Sign in to your independent RESCUE account. Open Projects, Add project, Upload a project ZIP.
2. Choose an archive below 8 MB. RESCUE validates paths, links, file counts, expansion and UTF-8 source before saving a private copy. Import does not run code or send it to AI.
3. Open Source intelligence and Index source. JavaScript/TypeScript AST symbols and import relationships include file lines. Python AST indexing requires Python on the host. Unsupported languages show inventory coverage.
4. Use Sandbox editor for Monaco syntax highlighting, folding, line numbers, find/replace and file tabs. Edits autosave as private drafts; Save file creates a new workspace revision. Stale draft bases are rejected. Ctrl+S saves; File history shows prior saved contents.
5. Open Engineering agent. Choose a mode and a focused question. Review the source-upload consent before sending source excerpts and diagnostics to Meta. Deep Investigation has a larger bounded tool budget; displayed activity is tool events, never hidden reasoning.
6. Review source-grounded recommendations. In Sandbox editor, select the target file, choose AI fix and describe the reproducible issue. Review the original and proposed replacement in the side-by-side diff.
7. Approve the exact proposal only if it is correct. Approval changes only the source copy. Static checks run independently and a failed patch is rolled back.
8. Open Runtime & release. Customer tests require an authorized remote runner and explicit source-upload consent. Only the reviewed supported source files enter a fresh VM; no production credentials or host filesystem are exposed.
9. For the exact maintained checkout arithmetic fixture, Verify maintained checkout fixture runs three independent fixed tests against the known broken and corrected versions. This is explicitly a maintained fixture test, not a customer-code isolation boundary or execution of a customer's test command.
10. Export engineering receipt for revision, hashes, patch approval, checks and honest runtime status. Export Git patch provides a review artifact; it does not push, merge or deploy.

GitHub App enrollment, project language servers, arbitrary terminals, automatic PRs and production publishing remain unavailable. A successful sample is not proof that an unrelated customer application is repaired.`},
{id:'engineering-tools',title:'Engineering modes, tool policies and language coverage',category:'Engineering Studio',summary:'Ten modes over six restricted inspection tools with visible limits and cancellation.',body:`# Engineering modes and tools
Quick Help uses fewer steps. Deep Investigation allows more evidence gathering. Architecture, AI Fix, Test, Security, Performance, Refactoring, Release and Maintenance modes focus the same permission-scoped source tools on different questions. No mode gains execution or approval authority.

Use Language & tool coverage in the Engineering agent tab to inspect and enable or disable registered read-only tools in your own workspace. Tool arguments are validated server-side. Requests are bounded by model calls, tool calls, evidence bytes, provider budgets and a 150-second job timeout. Cancel investigation aborts provider work. A server restart marks unfinished jobs interrupted rather than claiming completion.

Architecture builds modules and dependency edges from the current source index. Route candidates come from syntax and are labelled inferred. Framework names come from manifest declarations; they do not prove dependencies are installed. Source search is literal and returns actual paths/lines. No project LSP, debugger or blanket all-language support is claimed.`},

{id:'quickstart',title:'Your first verified recovery',category:'Start here',summary:'Create a demo preview, find a release-blocking fault, approve a repair and export the evidence.',body:`# Your first verified recovery
1. Open Sandbox in the left navigation and select Create sandbox.
2. Give it a name, select the included IRIZA checkout demo and choose its lifetime.
3. Select Run tests. Inspect the individual health, checkout, API contract and policy results.
4. Inject Backend stopped. The sample proxy really returns HTTP 502.
5. Run tests again. The release gate must say BLOCKED.
6. Select Investigate failure. With MODEL_API_KEY configured, the server calls Meta Muse Spark. Without it, the result is labeled LOCAL RULES, not live AI.
7. Review the evidence, proposed action, configuration diff and risk. Select Approve sandbox repair.
8. Independent probes check both health and checkout three times. Only passing evidence for the exact build can produce READY FOR REVIEW.
9. Export the JSON or Markdown report. Nothing is published to production.

The sample uses synthetic data. No real orders or payments occur. The workspace is a trusted local demo, not a container security boundary for arbitrary code.`},
{id:'sandbox',title:'Sandbox lifecycle & preview',category:'Sandbox Studio',summary:'Environment creation, source choices, quotas, expiry and cleanup.',body:`# Sandbox lifecycle & preview
Each project starts a dedicated trusted sample worker and reverse proxy. The included source is fixed and fingerprinted; project names cannot become file paths or commands.

## Available sources
- Included IRIZA checkout sample: available.
- Owned Git repository: disabled until an audited isolated runner is configured.
- External website repair: unavailable. A URL does not grant server access.

## Limits
Maximum 12 saved projects and 3 active previews. Preview lifetime is 15, 30 or 60 minutes. The maintenance loop checks every 5 seconds and cleans up expired workers. Stop preview frees a slot. Launch preview creates a fresh healthy environment; run tests again before review.

## Preview access
The iframe renders the real sample HTTP response. A short-lived random read-only ticket grants access only to that project's three preview routes. It cannot mutate state or read operator APIs. Stop or expiry invalidates runtime access. Browser content policy blocks external connections and form submission. The trusted worker is not an OS network sandbox.

## Controls
Run tests records independent checks. Inject failure changes only the sample. Reset creates a pre-change snapshot and restores known-good fixture settings. Rollback restores a selected snapshot, which may intentionally reintroduce a fault. Stop ends the environment. Browser tests launch local Edge when the installed Playwright runner is available; unsupported execution is reported honestly.`},
{id:'tests',title:'Test Center & release decisions',category:'Verification',summary:'What PASS, FAIL, NOT_RUN and READY FOR REVIEW actually mean.',body:`# Test Center & release decisions
The verifier runs three observations over a measured stability window. Required checks include backend HTTP health, critical synthetic checkout completion, response contract, and production-action policy denial. Browser tests navigate the actual sample checkout and inspect a 390px viewport when selected and supported.

## Decisions
- NEEDS REVIEW: tests are missing, stale, or belong to a different revision/build.
- BLOCKED: a required check failed or the environment stopped/expired.
- READY FOR REVIEW: all required checks passed for this exact build and revision within five minutes. This is not automatic publishing or a promise of production safety.

Health alone is insufficient. A broken checkout must block review even when /health returns 200. A model response never changes a gate to green. Each report includes the artifact fingerprint, suite version, results and timestamps.

Optional browser tests start as NOT_RUN. When requested, they become required for that run: FAIL or UNSUPPORTED blocks the gate. General accessibility, load testing and third-party repository builds are not implemented.`},
{id:'recovery',title:'AI proposals, approval & rollback',category:'Recovery',summary:'Read the diff, bind consent to a proposal, and verify before claiming success.',body:`# AI proposals, approval & rollback
The engine collects current probes, fixture configuration, build identity and bounded request logs. Meta returns a hypothesis and one allowlisted action. Redaction occurs before model requests. Model content never becomes a command, file path, network target or database query.

## Allowed actions
- lab.restart_service: start only the fixed sample worker.
- lab.restore_known_good_config: restore the known-good fixture configuration.
- lab.rollback_test_release: select the stable sample release.

The displayed diff describes fixture state, not a patch applied to an external repository. Approval binds to the exact proposal ID, nonce, digest, target, build, revision and five-minute expiry. Replay, stale consent and arbitrary action IDs are rejected. The approving identity is the single local operator.

Before change the engine records a snapshot. After change an independent verifier checks the actual behavior. A failed verification restores the pre-change snapshot and records the failure. You can also restore a saved snapshot from History; a snapshot can contain a broken state, so review its label and test again. The emergency stop blocks new sandbox mutations and proposals cannot authorize production repair.`},
{id:'meta',title:'Connect Meta Muse Spark',category:'AI & support',summary:'Configure server credentials, verify real inference, and recognize local fallback.',body:`# Connect Meta Muse Spark
1. Copy .env.example to .env in the RESCUE folder.
2. Set MODEL_API_KEY to your Meta Model API key. Keep it off the browser, screenshots and Git.
3. META_MODEL defaults to muse-spark-1.3.
4. Restart the local server and investigate a failing sandbox.

The server uses https://api.meta.ai/v1/chat/completions. A configured key is not proof of successful access. The actual request may fail due to authentication, account access, service availability or invalid output. Such errors remain visible and do not execute recovery.

Without a key, local rules provide a clearly labeled development demonstration. The support widget answers from bundled guides in LOCAL GUIDE mode. With a key it can request a live Meta answer grounded in guides and selected sandbox evidence. Support chat cannot approve repairs or run commands.

Do not paste API keys or production logs into support. Billing/access restrictions must be resolved in the owner's Meta account. Reference: https://dev.meta.ai/docs/cookbook/quickstart-chat-completions`},
{id:'maintenance',title:'Maintenance & monitoring',category:'Operations',summary:'Real recurring sample checks and honest integration status.',body:`# Maintenance & monitoring
The local maintenance loop checks active sample environments every five seconds and keeps a bounded window of 120 observations per project. Health percentages use only those recorded checks, not invented uptime. Expired previews stop automatically. A new failed observation can block a previously reviewed build.

The current integration registry is operator-owned config/connectors.json. Probes are read-only HTTPS requests to explicitly authorized targets, with private/special address blocking, DNS pinning, no redirects and bounded timeouts. External connector checks are on demand. Production TLS-expiry telemetry, external notifications, backup verification and persistent third-party monitoring are not yet enabled.

IRIZA TASTE health and Synapse/Developer interfaces were inspected in source. Live authentication, identity federation and deployed contracts remain NOT CONFIGURED unless separately tested. No production databases, customer data or hosting changes are part of this feature.`},
{id:'timeouts',title:'Understand HTTP 502, 500, 404 & 524',category:'Troubleshooting',summary:'Distinguish an observed symptom from a proven root cause.',body:`# Understand HTTP failures
## 502 in this sample
The lab proxy cannot reach its stopped backend. Inspect worker state and actual route probes. The allowed lab restart can repair this staged fault after approval.

## 500 in this sample
An invalid fixture setting causes the sample to reject requests. Review the configuration diff and restore the known-good state through the approval flow.

## 404 in this sample
The faulty sample release omits checkout. /health can still pass. Roll back the fixture release and independently test checkout.

## Cloudflare 524 screenshot
The supplied educo.rw screenshot records a Cloudflare timeout at that moment; it is not proof of the precise origin cause or current site status. Check the owner's authorized origin logs, slow requests, database timing and resource telemetry before choosing a correction. No access to that site's server has been established, and RESCUE cannot repair it from a screenshot or URL. Do not raise timeouts or restart production blindly.

Reference for the owner: https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-524/`},
{id:'api',title:'Developer API & read-only keys',category:'Developer',summary:'Use scoped report credentials without granting recovery authority.',body:`# Developer API
The local API is rooted at /api/v1. Operator credentials can create and manage trusted sample environments. Read-only developer keys can list sandboxes, read their metadata, gates and release reports. They cannot create projects, inject faults, access preview tickets, ask the model, change settings or approve recovery.

Generate a read-only key from Documentation → Developer API. The key is displayed once for copying; only its SHA-256 hash is stored. Keys expire after 24 hours and can be revoked. Keep them in environment variables and never in source code. The local single-owner API is not a public multi-tenant hosting service.

GET /api/v1/sandboxes
POST /api/v1/sandboxes
GET /api/v1/sandboxes/{id}
POST /api/v1/sandboxes/{id}/tests
POST /api/v1/sandboxes/{id}/inject
POST /api/v1/sandboxes/{id}/diagnose
POST /api/v1/sandboxes/{id}/approve
POST /api/v1/sandboxes/{id}/rollback
GET /api/v1/sandboxes/{id}/release-gate
GET /api/v1/sandboxes/{id}/report

OpenAPI and a TypeScript client are available from the Documentation view. The confirmed future domain is rescue.iriza.online; this app currently runs locally. No DNS changes or public deployment are included.`},
{id:'security',title:'Security boundaries & emergency stop',category:'Security',summary:'Why project execution is limited and how to pause mutations.',body:`# Security boundaries
This release runs only trusted included fixture code as local child processes. It is not a secure execution service for arbitrary third-party repositories. The UI disables repository import until a reviewed rootless/container or managed runner provides quotas, egress restrictions and tenant isolation.

No arbitrary shell, SSH, privileged database access, production write credential, host Docker socket or user-authored patch execution is exposed. The API binds to loopback and rejects unexpected Host and Origin values. Every mutation requires the operator credential. Read-only keys are hashed, scoped and expiring.

## Emergency stop
The Sandbox toolbar toggle prevents new create, launch, inject, reset, restore and approved-repair operations. Existing environments remain observable and can be stopped. It does not claim to undo an operation already executed. To fully end execution, stop each preview or stop the server.

Audit events are SHA-256 chained locally. This detects edits within the retained chain, not a machine administrator rewriting the whole database. Evidence is not a legal signature, immutable blockchain or production safety certification.`},
{id:'books',title:'Project books & implementation map',category:'Project reference',summary:'The four supplied books, specification conflicts, and remaining launch gates.',body:`# Project books & implementation map
The four supplied PDF books and five Markdown files from D:\\IRIZA TASTE\\IRIZA TASTE NEW PROJET\\RESCUE were read during this implementation. Copies are retained under docs/reference. They describe a target architecture, not existing functionality.

The latest user decisions take precedence: keep the current working local project, preserve its left navigation design, add Sandbox and Documentation below Integrations, add support and header theme controls, and use rescue.iriza.online. Old bridge.iriza.online and generic Desktop-folder suggestions in the books are superseded.

Implemented path: controlled sample environment → real failures → required tests → evidence-grounded proposal → explicit approval → snapshot → fixed repair → independent verification → release report. External source execution remains disabled. The existing lightweight Node HTTP/SQLite app is retained instead of a disruptive framework migration.

Authenticated official competition rules, membership, source reuse permissions, final submission requirements and real Meta account access remain launch gates. Nothing in a supplied book grants permission to publish, accept terms, modify DNS or alter production.`}
];

guides.push({id:'websites',title:'Published websites & ownership proof',category:'Monitoring',summary:'Record real HTTP/TLS evidence and enable scheduled checks only after proving domain control.',body:`# Published websites & ownership proof
1. Open Websites & monitoring and enter a name plus public HTTPS domain.
2. Review the recorded HTTP status, bounded response timing, TLS authorization and certificate expiry. Root, EN/FR/RW locale and approved health routes are supported. Redirects are recorded, not followed automatically.
3. To enable recurring monitoring, generate a DNS TXT or file challenge. Publish its exact token at the displayed DNS name or well-known file. RESCUE never changes DNS for you.
4. Select Verify published proof. Proof is hashed, scoped, expiring and one-use; successful domain verification lasts seven days.
5. Choose a 60, 300 or 900 second interval, then enable monitoring. It pauses when ownership expires.
6. Two consecutive failed observations open a public incident. Later successful observations mark observed availability recovery, not an executed server repair.

A URL cannot authorize private logs, databases, code changes or restarts. The published EDUCO, IRIZA and MrCreativist domains were registered at the owner's request and passed point-in-time checks; earlier 524 incidents still require authorized DirectAdmin origin logs for root-cause analysis. External production checkout/payments were not tested.

The app is local and single-operator. Public probes pin validated A/AAAA destinations, reject private/special addresses, use TLS validation, restrict ports/routes, bound bytes/time, and never forward server credentials. API: /api/v1/assets and documented subroutes.`},
{id:'support-center',title:'Saved AI conversations & local escalation',category:'AI & support',summary:'Use live Meta guidance, retain history, and save a ticket without messaging third parties.',body:`# Saved AI conversations & local escalation
The bottom-right support widget uses server-side Meta Muse Spark when configured. Each real response shows its model, token usage and guide citations. Logs and user text cannot grant execution privileges.

Select EN or FR. English and a French response were verified in the local product; this is a sample check, not a broad multilingual benchmark. RW remains disabled until evaluated. Never paste passwords or model keys into support.

Opened sandbox context or selected public website observations are sent only when explicitly selected. A public HTTP 200 means the page responded at that time; it does not prove that RESCUE repaired the server. No support chat command can approve a repair.

Conversations and answers persist in the local SQLite database. Saved history reopens them. Save ticket creates a local record with problem details; Support Center lets the operator track OPEN, IN PROGRESS or RESOLVED and export a bundle. No external email, chat message or support staff notification is sent.

Meta inference records contain actual request IDs, timing, tools and returned token usage, not API keys. An unavailable provider is shown as an error. The transport enforces bounded rounds, timeouts, retry/concurrency limits and a request/token budget restored from the local ledger after restart. Actual provider charges are unknown when the API does not return billing values.`});

guides.push({id:'easy-connect',category:'Connections',title:'Connect a website, GitHub repository or local agent',summary:'Simple setup with honest access boundaries.',body:`# Connect your application
Open Projects and choose New project.

Website: enter a domain such as example.com. HTTPS and a display name are filled automatically. RESCUE checks public HTTP and TLS only. Use domain proof before recurring monitoring.

GitHub: paste the repository URL. Public repositories can be read immediately. Private metadata/commit access requires a repository-scoped RESCUE_GITHUB_TOKEN configured server-side in .env and a restart. No credential is entered into the browser. The imported commit is pinned; source checkout, arbitrary execution, patches and PRs remain unavailable until their separate authorization/runner services exist.

Application agent: name the local app, copy the one-time 24-hour credential and download rescue-agent.mjs. In the sending app set RESCUE_AGENT_TOKEN and optionally RESCUE_URL (local loopback only), then import sendTelemetry and submit healthy/degraded with named PASS/FAIL checks and sanitized log lines. Sequence and timestamp checks reject replay. Credentials can write only their own observations, not read operator records or execute commands. Revoke from Projects.

A sample sandbox is always the included synthetic checkout; entering a website URL as its name does not clone that website.`});
guides.push({id:'expert-analysis',category:'Sandbox Studio',title:'One-click sample and expert AI analysis',summary:'Start easily, understand current evidence and approve repairs separately.',body:`# Start and analyze a sample
Open Sandbox Studio and choose Start sample now. No name or setup command is needed; a real local sample starts and current health/checkout tests run. Advanced name/lifetime options remain available.

If changes are paused, review the emergency-stop explanation and resume deliberately. RESCUE never silently disables that stop.

Analyze with AI works for healthy samples too. RESCUE collects current independent tests, asks Muse for an evidence-led assessment and records provider/request provenance. Healthy evidence needs no repair. Failing supported sample scenarios produce a validated allowlisted proposal, with observed failed checks, hypotheses, uncertainty, a reviewable sample diff and the next safe action.

Review and approve separately. AI cannot approve or execute a repair. Independent verification follows execution. Stop or expiration requires a fresh preview and new tests. Old assessments are labeled with their revision. Live provider failures remain visible; local guidance is clearly labeled.`});

guides.push({id:'scan-devops',category:'Operations',title:'Scan Center and DevOps workspace',summary:'Inspect source, coverage and environment requirements without changing production.',body:`# Scan and plan maintenance
Open Scan Center, optionally choose an absolute project folder and run a scan. The scanner inventories supported code/configuration files, manifests, dependency names and versions, infrastructure file paths and hashes. It checks strict JSON manifests, failure-suppressing scripts and possible literal secrets. Findings may be false positives; dependency inventory is not a vulnerability audit. Limits are 500 files, 8 MB total, 256 KB per file and depth 10. Secrets folders, .env files, symlinks and build/data artifacts are excluded. No source code is executed.

Refresh public websites explicitly when current HTTP evidence is needed. Repository metadata is not a source scan, agent telemetry is self-reported, and AWS/Azure/VM/control-panel services remain not connected until authorized adapters exist.

Analyze scan with AI sends the report findings, coverage and inventory (not source bodies or secret values) to the configured server-side Meta provider. The answer is read-only advice, with request provenance. Review false positives before acting. Export the report to retain evidence.

DevOps workspace shows real Node process memory, uptime and SQLite integrity. Environment profiles store required variable names and evidence links only. They do not edit application environment values or deploy. Publish remains blocked: an isolated customer runner, exact approved customer patch, passing independent customer tests, authorized target and rollback mechanism are still required. Passing the included trusted sample does not certify a customer deployment.`});

guides.push({id:'project-workbench',category:'Project workspace',title:'Project tools, source editor and reviewed AI fixes',summary:'Each project owns its checks, source copies, AI assessment and repair receipts.',body:`# Your project workspace
1. Open Projects and choose Open project. Scan Center and DevOps are project tabs, alongside AI analysis, Sandbox editor, Vulnerabilities and Runtime & release.
2. Use the three-dot menu to edit details, archive, move to recoverable Trash or restore a project.
3. Import a public GitHub source copy or add a Local source folder. Website projects can Attach source project. This link does not prove the deployed revision.
4. Select a file in Sandbox editor. Save file writes only the local copy using a version and base-hash check. Save or discard drafts before requesting or approving a patch.
5. Run source checks. Python AST, JavaScript Node syntax and JSON checks are real parser checks. These do not execute application behavior.
6. Analyze project evidence, then Generate AI fix proposal. Describe the exact failing behavior and selected file. The selected source is sent to the configured Meta provider; potential secrets block transmission.
7. Review the current source, proposed replacement, uncertainty and suggested tests. Approve exact sandbox patch binds the nonce, digest, file hash, version and expiry. Failed source validation restores prior content.
8. Export changes as JSON or a Git patch. No branch, push, PR, merge or deployment is performed automatically.

## Vulnerability checks
Run vulnerability audit after importing source. OSV queries exact versions from supported package-lock.json, package.json and requirements text. Ranges stay unresolved. Advisory IDs link to authoritative records. An empty response is not a full security certificate, and absent fixed-version evidence must not become a guessed upgrade.

## Runtime verification
The optional Vercel Sandbox adapter requires RESCUE_VERCEL_TOKEN, RESCUE_VERCEL_TEAM_ID and RESCUE_VERCEL_PROJECT_ID on the server. Credential values never go into the VM. Each run requires explicit upload consent. The bounded public GitHub test plan installs dependencies with registry-restricted egress, disables networking for tests, records exits/logs for the exact source digest and stops the temporary VM. npm install hooks are disabled. The VM uses one vCPU, no exposed ports, nonpersistent storage and a five-minute timeout. Source test changes are flagged. Successful commands are not blanket proof of repair or permission to release.

The assistant connector's actual creation attempt was denied with HTTP 403; that connection does not configure the application's own credential. No customer runtime test succeeded during this update. cPanel/DirectAdmin/Vercel production terminals, Git push and deployment need separate authorized adapters and remain unavailable.`});
