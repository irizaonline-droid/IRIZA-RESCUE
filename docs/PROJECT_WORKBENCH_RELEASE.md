# Project workbench and presentation update

Verified October 27, 2026, Africa/Kigali. Original IRIZA logo and Node.js stack retained. Parent IRIZA TASTE source was not modified.

## Implemented behavior

- Projects now combine websites, GitHub connections, local copies, agents and explicitly labelled sample fixtures. DevOps and Scan Center were removed from the global left menu and appear inside each project, alongside AI analysis, Sandbox editor, Vulnerabilities and Runtime & release.
- Three-dot actions edit metadata, archive, move to recoverable Trash and restore. Archiving/trashing a website disables its recurring monitoring. Original sources and historical records are retained.
- Local folder import and public GitHub import copy supported source into SQLite-backed repair workspaces. Website/agent projects can attach an existing GitHub/local source project. This association is not proof of the deployed revision.
- The editor has a file explorer, path filtering, version/hash labels, save/discard, source checks and change exports. Drafts are project-scoped. Saving rejects stale versions and changes only the copy. Imports exclude secrets/build artifacts/symlinks and are bounded to 500 files / 8 MB, 256 KB/file.
- Source validation actually invokes Python AST, Node syntax and JSON parsers without executing repository behavior. Unsupported languages are not runtime-verified by those parsers.
- OSV checks exact dependency versions from supported manifests/lockfiles and records unresolved ranges. Advisory IDs link to their records. This is known dependency-advisory coverage, not certification that the application is secure. No fixed version may be invented when evidence does not supply it.
- Meta can propose a bounded replacement for a selected file. The current file, proposal, rationale, risk and test suggestions are reviewable before approval. Approval binds nonce, digest, base hash, version and ten-minute expiry. Source-check failure restores previous content. A successful source check does not imply a behavioral repair.
- Export returns a JSON change bundle and a Git patch. No remote branch, push, PR, merge or deployment is performed.
- Guides and AI responses render escaped headings, numbered steps, lists, code blocks and tables. Buttons have click feedback; progress shows actual elapsed time. Answer typing is a post-response presentation animation, not provider token streaming or private reasoning. Reduced-motion preferences are respected. Navigation is held during an operation to avoid moving a result into another project.

## Executed evidence

| Journey | Actual result |
|---|---|
| MINECOFINE project -> source import -> editor -> source checks | 19 supported files copied; Python checks passed. GitHub and original source remained unchanged. |
| MINECOFINE dependency audit | No exact supported pinned versions. Ranges unresolved; no vulnerability-free verdict. |
| Synthetic acceptance fixture -> live Meta analysis -> proposal | Analysis request chatcmpl-01a17e3d-aa04-700c-8f17-4a53e5777aa9; patch request chatcmpl-01a17e3e-3d2c-77df-8a38-edd3106b97ff. The fixture intentionally lacked a colon. |
| Explicit fixture approval -> independent source checks | Sandbox-only patch applied; Python AST passed; original file remained broken and untouched. Runtime tests NOT RUN; published=false. |
| Manual editor Save, rename, archive, Trash, restore | Executed through browser controls on the synthetic fixture. Edits restored to the approved content afterward. |
| Live OSV request on synthetic pinned urllib3 fixture | One version queried; 20 advisory IDs returned. These are not MINECOFINE findings. |
| Read-only connector discovery -> attempted isolated runtime | Vercel project listing worked, but sandbox creation was denied HTTP 403. No VM was created; no customer runtime succeeded. No Vercel CLI fallback was installed. |

The official `@vercel/sandbox` adapter is implemented and lifecycle-tested with mocks. It uses only explicitly configured server variables: RESCUE_VERCEL_TOKEN, RESCUE_VERCEL_TEAM_ID and RESCUE_VERCEL_PROJECT_ID. It never borrows the assistant connector identity or forwards these credentials into the VM. Each run needs explicit source-upload consent, a pinned public GitHub origin and a supported root npm/pytest plan. Resources: one vCPU, five-minute maximum, nonpersistent VM, no public ports; registry-only setup egress and denied egress during tests. Commands, bounded logs, source digest, changed test definitions and cleanup status are recorded. It always stops in finally. Passing commands do not authorize release.

No successful live SDK runtime is claimed. The current connector's 403 needs account/permission review; reauthentication is not a confirmed fix. The local app still needs its own Sandbox-authorized server credential. DirectAdmin/cPanel terminal adapters, Git write authorization, deployment target binding and production rollback remain unavailable.

## Validation and reproduction

Run `npm ci`, `npm test`, `npm run check`, `npm run docs` and `npm start`. Full suite: 56 passing tests; syntax: 55 modules. Tests cover source isolation, stale edits, exact approval, expiry, rollback, scoped project routes, archive/trash, source links, dependency lookup, VM consent/credentials, restricted network policy, command failures, cleanup and secret redaction. SDK remote lifecycle tests are mocks; live provider evidence is identified separately above.

The SDK initially introduced a transitive Zod advisory. An override upgrades the same major version to a patched release; the final lockfile audit reports zero npm advisories. The SDK import was tested.

Evidence files are under artifacts/easy-connect: project-workbench-final-tests.txt, sdk-dependency-audit-final.json, osv-live-acceptance-fixture.json and project-workbench-acceptance.json. Source scan evidence and earlier audit reports remain available. The in-app project-workbench guide and generated USER_GUIDE.md describe the same scope.

Primary API references: https://google.github.io/osv.dev/post-v1-querybatch/ and https://vercel.com/docs/sandbox.
