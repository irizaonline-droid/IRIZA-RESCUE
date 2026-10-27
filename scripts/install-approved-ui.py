from pathlib import Path
import re
r=Path(__file__).resolve().parents[1]
p=Path(r'C:\Users\lilve\Documents\IRIZA_RESCUE_UI_UX_Prototype')
s=(p/'index.html').read_text(encoding='utf-8')
s=s.replace('assets/styles.css','/prototype.css').replace('assets/app.js','/workspace.js')
s=s.replace('<link rel="stylesheet" href="/prototype.css">','<script src="/theme-init.js"></script><link rel="stylesheet" href="/prototype.css"><link rel="stylesheet" href="/workspace.css">')
s=re.sub(r'<div class="brand-logo".*?</div><div><div class="brand-main">','<img class="official-logo" src="/logo.png" alt="IRIZA TASTE original logo"><div><div class="brand-main">',s,count=1)
s=s.replace('Interactive Prototype','Recovery Workspace').replace('DEMO ENVIRONMENT','LOCAL WORKSPACE').replace('Interactive sample','Local operator').replace('No live infrastructure connected','Approval-controlled recovery').replace('Demo workspace','Winning Team').replace('IRIZA design concept','rescue.iriza.online').replace('JM</div>','WT</div>')
s=s.replace('<strong>Concept prototype</strong><span>All incidents, AI output, checks and fixes on this page are simulated in your browser. No actual servers or Meta API are accessed.</span>','<strong>Local recovery workspace</strong><span>Actual observations · Server-side Meta AI · Human-approved sample repairs · Production unchanged</span>')
s=s.replace('UI/UX CONCEPT • DEMONSTRATION DATA ONLY','rescue.iriza.online • LOCAL OPERATOR')
s=s.replace('<div id="modalRoot"></div>','<div id="modalRoot"></div><dialog id="accessDialog"><form id="accessForm"><div class="eyebrow">LOCAL WORKSPACE</div><h2>Welcome to IRIZA RESCUE.</h2><p>Use the local operator token from RESCUE/data/operator-token.</p><label for="accessToken">Operator token</label><input id="accessToken" type="password" required autocomplete="off"><p id="accessError" role="alert"></p><button class="btn primary" type="submit">Unlock workspace</button></form></dialog>')
(r/'public/index.html').write_text(s,encoding='utf-8')
