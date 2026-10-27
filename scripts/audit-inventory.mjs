import {readdir,readFile,mkdir,writeFile,cp} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {DatabaseSync,backup} from 'node:sqlite';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,'artifacts/functionality-audit');await mkdir(out,{recursive:true});
const inventory=[];
async function scan(dir){for(const e of await readdir(path.join(root,dir),{withFileTypes:true})){const rel=path.join(dir,e.name);if(e.isDirectory()){if(!['node_modules','.git','data','artifacts'].includes(e.name))await scan(rel);}else if(!e.name.startsWith('.env')){const bytes=await readFile(path.join(root,rel));inventory.push({path:rel.replaceAll('\\','/'),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}}}
for(const dir of ['src','public','tests','scripts','db','packages','config'])await scan(dir);
await writeFile(path.join(out,'source-inventory.json'),JSON.stringify({at:new Date().toISOString(),files:inventory},null,2));
for(const dir of ['src','public','tests','db'])await cp(path.join(root,dir),path.join(out,'pre-fix-source',dir),{recursive:true,force:false,errorOnExist:false});
const db=new DatabaseSync(path.join(root,'data/rescue.sqlite'),{readOnly:true});
if(!(await readdir(out)).includes('pre-audit.sqlite'))await backup(db,path.join(out,'pre-audit.sqlite'));
const tables=db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all().map(r=>r.name);
const dbEvidence={integrity:db.prepare('PRAGMA integrity_check').all(),foreignKeyViolations:db.prepare('PRAGMA foreign_key_check').all(),counts:Object.fromEntries(tables.map(t=>[t,db.prepare('SELECT count(*) AS n FROM '+t).get().n]))};db.close();
const token=(await readFile(path.join(root,'data/operator-token'),'utf8')).trim(),base='http://127.0.0.1:4310';
const routes=['/api/status','/api/audit','/api/connectors','/api/v1/studio','/api/v1/assets','/api/v1/assets/archived','/api/v1/settings','/api/v1/meta/status','/api/v1/guides','/api/v1/reference','/api/v1/openapi','/api/v1/sdk','/api/v1/developer-keys','/api/v1/support/conversations','/api/v1/support/tickets','/api/v1/sandboxes'];
const results=[];for(const route of routes){try{const response=await fetch(base+route,{headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(10000)});const content=await response.text();results.push({route,status:response.status,bytes:content.length,...(route==='/api/status'?{version:JSON.parse(content).version,labHealthy:JSON.parse(content).lab.healthy}:{}),...(route==='/api/v1/meta/status'?{connection:JSON.parse(content).connection}:{}),...(route==='/api/audit'?{valid:JSON.parse(content).valid}:{})});}catch(e){results.push({route,error:e.message});}}
const denied=await fetch(base+'/api/status');results.push({route:'/api/status without credentials',status:denied.status});
const js=await readFile(path.join(root,'public/workspace.js'),'utf8');const actions=[...new Set([...js.matchAll(/name==='([^']+)'/g)].map(m=>m[1]))].sort();
await writeFile(path.join(out,'baseline.json'),JSON.stringify({at:new Date().toISOString(),database:dbEvidence,routes:results,actionBranches:actions},null,2));
console.log(JSON.stringify({inventoryFiles:inventory.length,database:dbEvidence,routes:results,actionBranches:actions},null,2));
