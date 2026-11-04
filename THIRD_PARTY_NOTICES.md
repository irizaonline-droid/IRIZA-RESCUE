# Engineering Studio third-party components

Versions below were read from installed package manifests. The lockfile and npm ci make setup repeatable. Keep upstream notices in generated bundles; selecting a license for the RESCUE source is a separate owner decision.

| Component | Installed version | Declared license |
|---|---|---|
| monaco-editor | 0.56.0 | MIT |
| typescript | 5.9.3 | Apache-2.0 |
| yauzl | 3.4.0 | MIT |
| ai | 7.0.155 | Apache-2.0 |
| @ai-sdk/openai | 4.0.104 | Apache-2.0 |
| zod | 4.6.7 | MIT |
| dompurify | 3.4.17 | (MPL-2.0 OR Apache-2.0) |
| @vercel/sandbox | 3.9.0 | Apache-2.0 |
| esbuild | 0.28.2 | MIT |

Monaco assets are generated with npm run build:editor. A build-time adapter attaches the server CSP nonce to dynamic theme styles; upstream library source is not edited in node_modules. The DOMPurify override resolves the advisories reported during installation. npm audit results are in local artifacts.

## Scope of the root license

The owner authorized MIT licensing for original RESCUE code on 4 November 2026. The root license does not relicense third-party dependencies, the IRIZA logo/brand/trademarks, supplied reference books, customer source, or generated media. Public logo use identifies this project; no trademark rights are granted. Owner asserts use of the existing brand; independent chain-of-title verification is not available here.

`public/mulish.woff2` is accompanied by `public/FONT-LICENSE.txt`; retain that upstream font license. Generated editor bundles retain upstream notices. No customer uploads, databases or credentials belong in the public source distribution. A dependency's manifest license is inventory evidence, not a complete legal clearance of every transitive asset.
