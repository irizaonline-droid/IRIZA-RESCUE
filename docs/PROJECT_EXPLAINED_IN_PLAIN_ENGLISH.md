# IRIZA RESCUE — explained simply

**Team:** Winning Team. **Objective:** Build and demonstrate a reliable Meta-AI-assisted incident investigation and safe-recovery product during the 2026 hackathon.

## What problem does it solve?

Websites and applications break. Small teams can lack the skills, time, monitoring tools or budget to understand why. They need one accessible place to check whether services are working, see evidence of failure, get actionable explanations, experiment safely and confirm that a fix actually worked.

## What is IRIZA RESCUE?

A reliability co-pilot and recovery laboratory with:

1. **URL checks** for public availability and TLS, never private server access.
2. **Ownership-verified monitoring** for recurring checks, alerts and history.
3. **GitHub connection** for authorized build/test evidence and proposed pull requests; no automatic merges.
4. **Read-only agent** for deeper host/application telemetry with clear owner authorization.
5. **Sandbox Studio** to reproduce failures in disposable, isolated apps and safely test repairs.
6. **Meta AI Investigator** for evidence-grounded hypotheses and safe action proposals.
7. **Human-approved recovery** in the controlled lab, never arbitrary commands or unattended production modifications.
8. **Independent verification** and a downloadable recovery receipt before saying the system is recovered.
9. **AI Support Center** for understandable answers, incident tracking, documentation and escalation.
10. **Developer API** to let other apps integrate checks, incidents, receipts, alerts and safe telemetry.

## What happens when a user pastes a URL?

Check whether it is a safe public HTTPS target; perform one bounded read-only availability check; show status code, safe latency and TLS information. Explain that no source code, logs or private infrastructure can be inspected. For recurring monitoring, require DNS TXT or file-based domain ownership verification. Offer GitHub/agent connection for deeper investigation.

## What happens when a developer connects GitHub?

GitHub authorization is scoped to selected repositories. The system may read permitted source and CI status. In an isolated supported sample runner it can reproduce failures and propose a patch. The user reviews a diff; after approval, RESCUE creates a pull request. It does not push to production or merge automatically.

## What happens when a server owner connects the agent?

A minimally privileged outbound agent sends authorized health events and sanitized logs. It can be revoked. It is read-only in the first release. Server repairs require a separately engineered future permission system; never assume an agent is a remote shell.

## The hackathon live demonstration

Deliberately stop a disposable sample backend, causing an actual HTTP 502 error. Detect it with independent probes. Show Meta Muse Spark 1.3 analyzing sanitized logs and proposing a pre-registered repair action. Require the user to approve. Restart the sample service. The independent verifier checks HTTP health **and** a critical application route. Issue a downloadable recovery receipt. Show one test where a bad action is rejected and another where a good health endpoint does not hide a broken application.

## Our boundary: idea versus finished product

This document is a specification. It does not claim the live backend, model integrations, sandbox isolation, SSO, production agent, subdomain or GitHub repository have been built. Codex must audit and implement those components, and report actual results.

## Development order

Audit real IRIZA source and theme → standalone RESCUE backend/UI → controlled F01 lab → Meta AI diagnosis → policy and approval → repair → independent verification → metrics and UI → optional connectors/API → submission package.

## Safety and trust

A URL does not authorize privileged actions. All third-party code and lab tests must run in safe isolation. Do not send private IRIZA production data or credentials to Meta. Keep a RESCUE-only database and server-side secrets; use verified adapters to connect existing IRIZA services without changing them.

## Competition schedule

Internal submission target November 3, 2026. Event listing sets final deadline November 4, 2026 at 9 PM US Eastern (November 5 at 4 AM in Kigali). Verify current authenticated final rules and permitted reuse of pre-existing work before submission.
