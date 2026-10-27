from pathlib import Path
import hashlib,json,difflib
r=Path(__file__).resolve().parents[1]
out=r/'artifacts/functionality-audit'
baseline=out/'pre-fix-source'
changed=[];patch=[]
for folder in ['src','public','tests','db']:
 for p in sorted((r/folder).rglob('*')):
  if not p.is_file() or p.suffix not in ['.js','.mjs','.sql','.css','.html']:continue
  rel=p.relative_to(r);old=baseline/rel
  before=old.read_text(encoding='utf-8') if old.exists() else ''
  after=p.read_text(encoding='utf-8')
  if before!=after:
   changed.append(str(rel).replace('\\','/'))
   patch.extend(difflib.unified_diff(before.splitlines(True),after.splitlines(True),fromfile='a/'+str(rel).replace('\\','/') if old.exists() else '/dev/null',tofile='b/'+str(rel).replace('\\','/')))
(out/'rescue-audit-fixes.patch').write_text(''.join(patch),encoding='utf-8')
design={}
for name in ['index.html','prototype.css','workspace.css','logo.png']:
 current=(r/'public'/name).read_bytes();original=(baseline/'public'/name).read_bytes()
 design[name]={'sha256':hashlib.sha256(current).hexdigest(),'unchanged':current==original}
(out/'final-change-manifest.json').write_text(json.dumps({'changedCodeFiles':changed,'design':design,'patchScope':'Backed-up src/public/tests/db files only; generator/docs/audit scripts listed separately in audit report.'},indent=2),encoding='utf-8')
report=r/'FUNCTIONALITY_AUDIT.md'
s=report.read_text(encoding='utf-8').replace('124 rendered controls','114 rendered controls')
report.write_text(s,encoding='utf-8')
print(json.dumps({'changedCodeFiles':changed,'designUnchanged':all(v['unchanged'] for v in design.values())}))
