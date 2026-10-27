# Read-only source audit — 2026-10-27

## Scope and authority

The user explicitly chose `C:\Users\lilve\Desktop\IRIZA TASTE JUNE\RESCUE`. This takes precedence over the pasted instruction's standalone Desktop folder name. The directory was empty. The separate Desktop `IRIZA RESCUE` directory was also empty when inspected.

The supplied launch text was read in full. The referenced `CODEX_MASTER_BUILD_PROMPT.md`, `PROJECT_MEMORY_AND_DECISIONS.md`, `SOURCE_AND_DISCOVERY_CHECKLIST.md`, and four Rescue PDF books were not present in either Rescue folder. The parent project's `docs` contained one WhatsApp Markdown guide, which was read; it is unrelated to the missing Rescue books. No complete engineering contract beyond the pasted instruction was available. The supplied private ChatGPT conversation URL returned a login page; its contents and any previous ChatGPT memory were unavailable.

## Verified source interfaces

| System | Local evidence | Verified contract | Implementation decision |
|---|---|---|---|
| IRIZA TASTE | `src/app/api/health/route.ts` | GET/HEAD; `status: healthy`, `service: iriza-taste`, timestamp, capability flags | Eligible read-only health target after explicit connector configuration |
| IRIZA Developer | `src/app/api/v1/health/route.ts` | GET; platform version/status and service availability | Do not infer service internals from these flags |
| IRIZA Synapse | `src/lib/synapse/client.ts` | GET `/health`, `/v1/nodes`, `/v1/metrics`; header `x-iriza-synapse-key`; tenant-scoped jobs at `/v1/tasks` | Documented; job execution and privileged access remain disabled |
| IRIZA AI | Desktop `IRIZA AI/docs/architecture/overview.md` | Monorepo architecture; API/worker/AI scaffolding described as placeholders | Do not treat architecture descriptions as live service contracts |
| Brand | Parent `public/assets/icons/iriza.png`; installed Mulish font | Existing owner's icon and local font asset | Copy only these presentation assets, include font license |

Parent `AGENTS.md` was read. It concerns Next.js-specific documentation. This independent project uses Node HTTP and browser JavaScript, so it does not change Next.js code. The parent uses Next.js 16, React 19, Mulish and Poppins. The rescue dashboard retains the IRIZA red/white identity and Mulish; its navigation and layouts are newly implemented rather than a claimed exact component match.

No `.env` files, databases, private keys, customer records, or proprietary application modules were copied. Existing projects were inspected read-only. IRIZA DEVELOPER is represented by source routes in the parent; an independent repository was not established. Live systems and credentials were not tested.

## Domain and external references

**Owner correction, October 27, 2026:** the intended project domain is `rescue.iriza.online`. The `bridge.iriza.online` lookup below is historical discovery for the superseded launch instruction, not the current deployment target.

DNS lookup found `bridge.iriza.online` resolving to Cloudflare addresses (104.21.73.162 and 172.67.163.220, plus IPv6). This does not prove which product owns it. Treat it as occupied until the hosting owner confirms. No DNS or hosting mutation occurred.

- Meta quickstart: https://dev.meta.ai/docs/cookbook/quickstart-chat-completions — confirmed endpoint, `MODEL_API_KEY`, developer messages, and `muse-spark-1.3`.
- Event page: https://dev.meta.ai/events/global-hackathon — confirms Startup track and Push the Frontier theme. Public page lists November 4 at 9 PM ET for submission; the team's earlier internal target is November 3.
- Authenticated rules for source reuse, coding assistance, required submission materials, and individual team eligibility were **not verified**. Do not infer approval from the public event page.
