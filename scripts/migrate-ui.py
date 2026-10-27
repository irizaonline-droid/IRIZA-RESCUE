from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
prototype=Path(r'C:\Users\lilve\Documents\IRIZA_RESCUE_UI_UX_Prototype')
p=root/'public/index.html'
s=p.read_text(encoding='utf-8')
sprite=re.search(r'  <svg class="icon-sprite".*?</svg>',(prototype/'index.html').read_text(encoding='utf-8'),re.S).group()
s=s.replace('<body>','<body>'+sprite+'<div id="mobile-scrim" class="mobile-scrim"></div>')
s=s.replace('</head>','<link rel="stylesheet" href="/prototype.css"><link rel="stylesheet" href="/redesign.css"><script src="/redesign.js" defer></script></head>')
s=s.replace('<title>IRIZA RESCUE · Recovery command center</title>','<title>IRIZA RESCUE | Winning Team</title>')
s=s.replace('<header class="topbar"><div>','<header class="topbar"><button id="mobile-menu" class="icon-button mobile-nav-btn" aria-label="Open navigation">☰</button><div>')
s=s.replace('<div class="top-actions">','<div class="top-actions"><button class="header-search" id="workspace-search">Search workspace <kbd>Ctrl K</kbd></button><button id="workspace-notifications" class="icon-button" aria-label="View notifications">♧</button>')
s=s.replace('<main>','<div class="demo-ribbon"><strong>LOCAL WORKSPACE</strong><span>Real observations · live Meta when available · approval-controlled sample recovery</span></div><main>')
s=s.replace('</main></div>','</main><footer class="main-footer"><span>© 2026 IRIZA RESCUE · Winning Team</span><span>rescue.iriza.online · LOCAL OPERATOR</span></footer></div>')
p.write_text(s,encoding='utf-8')
