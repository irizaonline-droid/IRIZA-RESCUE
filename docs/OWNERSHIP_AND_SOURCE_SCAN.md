# Ownership, sandbox verification and repository source scans

October 27, 2026. These are separate capabilities.

## Website ownership

Projects -> website -> View project -> DNS ownership proof. The application generates the exact TXT name and value for that website, plus expiry, copying and downloadable instructions.

1. Open the domain DNS provider. DirectAdmin: DNS Management. cPanel: Zone Editor. If nameservers point elsewhere, edit the authoritative provider instead.
2. Add TXT, TTL 300/default, with the exact displayed value. The full name is `_iriza-rescue-verification.DOMAIN`. Some panels append the zone; confirm the final name matches exactly. Existing website/mail records stay in place.
3. Wait for propagation; optionally run `nslookup -type=TXT FULL_NAME`.
4. Click Verify published proof. Ownership becomes verified only after the backend observes the matching record. Challenges expire after 24 hours; successful verification lasts seven days.

Alternative: File ownership proof. Publish the exact generated token as plain text at `https://DOMAIN/.well-known/iriza-rescue-verification`, without .txt extension, extra text, authentication or an HTML page. The endpoint must return HTTP 200 with the exact token. Then verify.

No DNS or hosting changes were performed by this implementation. iriza.online proof instructions were generated and browser verified; actual domain ownership remains unverified until published proof is observed. Ownership enables recurring public monitoring; it does not authorize private hosting access or deployment.

## Sandbox recovery

An injected HTTP 502 is a real failure in the included disposable sample. DNS cannot resolve that state. Analyze with AI -> Review proposed repair -> Approve sandbox repair -> independent tests. The top of Sandbox Studio now states the next action explicitly. Approval binds the specific proposal/build/revision and expires. Re-analyze if expired. A model diagnosis alone is not verified recovery.

## GitHub source scan

Connected populated repositories now offer Scan source and View scan report. New connection forms also request a scan after metadata connection. The scanner reads a pinned tree and selected text blobs, stores file hashes/findings and shows partial coverage. It does not install or execute downloaded source. Secrets paths, traversal paths, symlinks and large files are excluded. Limits: twelve files, 32 KB each, 500 displayed inventory entries; provider limits may reduce coverage further. Empty SMS has no source until its first commit.

Actual MINECOFINE result: commit c1c6288fb8e91d91123fba90677b50c2cb7bfe03, 35 inventory files, 18 eligible, 10 inspected before GitHub unauthenticated rate limit. Included app.py, pyproject.toml, documentation and pipeline scripts. Zero findings in the selected heuristic checks does not establish correctness. Report: artifacts/easy-connect/minecofine-source-scan.json. Live Meta maintenance assessment was rendered from that report. Source text is not sent to Meta by this feature; its advice is limited to the recorded findings/inventory.

Validation: full suite 41/41 passing; tests/repository-scan.test.mjs covers pinned reads, malformed manifests, exclusions, no execution, rate-limit and truncated coverage. Latest syntax check: 46 modules. Publishing and isolated customer runtime tests remain unavailable.
