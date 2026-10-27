from pathlib import Path
import re
r=Path(__file__).resolve().parents[1]
server=r/'src/server.mjs'
s=server.read_text(encoding='utf-8')
s=re.sub(r"      const files=\{.*?\};", "      const files={'/':['index.html','text/html'],'/workspace.js':['workspace.js','text/javascript'],'/app.js':['workspace.js','text/javascript'],'/workspace.css':['workspace.css','text/css'],'/theme-init.js':['theme-init.js','text/javascript'],'/prototype.css':['prototype.css','text/css'],'/logo.png':['logo.png','image/png'],'/mulish.woff2':['mulish.woff2','font/woff2']};",s)
server.write_text(s,encoding='utf-8')
backup=r/'artifacts/ui-intermediate-backup/public'
obsolete=['app.js','studio.js','platform.js','agent.js','style.css','studio.css','platform.css','redesign.css','redesign.js']
for name in obsolete:
    target=r/'public'/name
    assert target.resolve().parent==(r/'public').resolve()
    assert (backup/name).is_file(),f'Missing rollback copy: {name}'
    if target.exists():target.unlink()
platform=r/'src/platform.mjs'
s=platform.read_text(encoding='utf-8').replace("const a=this.asset(id,tenant);if(typeof input.enabled", "const a=this.asset(id,tenant);if(input.enabled&&this.db.prepare('SELECT asset_id FROM archived_assets WHERE asset_id=?').get(id))throw Error('Restore the archived asset before enabling monitoring');if(typeof input.enabled")
platform.write_text(s,encoding='utf-8')
