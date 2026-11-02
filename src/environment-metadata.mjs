// Metadata-only environment planning: parsed values live only in request memory.
// No vault is configured, so no value or value-derived hash is persisted or returned.
const stages=['development','test','sandbox','staging','production'];
export function parseEnvironmentMetadata(text){
 if(typeof text!=='string'||Buffer.byteLength(text)>65536)throw Error('Environment input must be below 64 KB');
 const variables=new Map(),duplicates=new Set(),errors=[];const rows=text.replace(/^\uFEFF/,'').split(/\r?\n/);
 for(let i=0;i<rows.length;i++){
  const row=rows[i].trim();if(!row||row.startsWith('#'))continue;
  const match=/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]{0,127})\s*=\s*(.*)$/.exec(row);
  if(!match){errors.push({line:i+1,code:'INVALID_ASSIGNMENT'});continue;}
  const [,name,raw]=match;let value=raw,quoted=false;
  if(raw.startsWith('"')||raw.startsWith("'")){
   const quote=raw[0];let end=-1;
   for(let j=1;j<raw.length;j++)if(raw[j]===quote&&(quote==="'"||raw.slice(0,j).match(/\\*$/)[0].length%2===0)){end=j;break;}
   if(end<0||!/^\s*(?:#.*)?$/.test(raw.slice(end+1))){errors.push({line:i+1,code:'INVALID_QUOTED_VALUE'});continue;}
   value=raw.slice(1,end);quoted=true;
  }else value=raw.replace(/\s+#.*$/,'').trim();
  if(variables.has(name))duplicates.add(name);
  const references=raw.startsWith("'")?[]:[...value.matchAll(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)/g)].map(m=>m[1]||m[2]);
  variables.set(name,{name,line:i+1,declaredNonempty:value.length>0,quoted,referenceNames:[...new Set(references)],publicVariable:/^(?:NEXT_PUBLIC_|VITE_|PUBLIC_)/.test(name),unsafePublicName:/^(?:NEXT_PUBLIC_|VITE_|PUBLIC_).*(?:SECRET|PASSWORD|TOKEN|PRIVATE|DATABASE|API_KEY)/i.test(name)});
 }
 if(variables.size>500)throw Error('Environment metadata supports at most 500 variable names');
 return {variables:[...variables.values()],duplicates:[...duplicates],errors,semantics:'Single-line dotenv assignments; no interpolation, shell expansion or multiline values are executed. Duplicate names use the last valid declaration.',valuesStored:false};
}

export function environmentReferences(files){
 const refs=[];
 for(const file of files){const text=file.content;
  const patterns=[/\bprocess\.env\.([A-Za-z_][A-Za-z0-9_]*)/g,/\bprocess\.env\[\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*\]/g,/\bimport\.meta\.env\.([A-Za-z_][A-Za-z0-9_]*)/g,/\bos\.(?:getenv|environ\.get)\(\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]/g,/\bos\.environ\[\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*\]/g];
  for(const re of patterns){let cursor=0,line=1;for(const m of text.matchAll(re)){line+=text.slice(cursor,m.index).split('\n').length-1;cursor=m.index;refs.push({name:m[1],path:file.path,line,requirement:'UNKNOWN'});if(refs.length>=5000)return refs;}}
 }
 return refs.slice(0,5000);
}

export class EnvironmentMetadata{
 constructor(workbench){this.wb=workbench;this.db=workbench.db;this.db.exec('CREATE TABLE IF NOT EXISTS project_environment_metadata(project TEXT NOT NULL,stage TEXT NOT NULL,version INTEGER NOT NULL,payload TEXT NOT NULL,PRIMARY KEY(project,stage))');}
 inspect(key){const p=this.wb.project(key),references=environmentReferences(this.wb.rows(key));const profiles=this.db.prepare('SELECT stage,version,payload FROM project_environment_metadata WHERE project=?').all(key).map(r=>({...JSON.parse(r.payload),stage:r.stage,version:r.version}));
  return {project:key,workspaceRevision:p.workspaceRevision||0,mode:'METADATA_ONLY',stages,references,profiles:profiles.map(profile=>{
   const declared=new Set(profile.variables.map(v=>v.name)),used=new Set(references.map(r=>r.name));
   return {...profile,referencedButUndeclared:[...used].filter(n=>!declared.has(n)),declaredButUnreferenced:[...declared].filter(n=>!used.has(n)),unresolvedReferences:profile.variables.flatMap(v=>v.referenceNames.filter(n=>!declared.has(n)).map(name=>({variable:v.name,reference:name}))),unsafePublicNames:profile.variables.filter(v=>v.unsafePublicName).map(v=>v.name)};
  }),executionReady:false,secretStore:'NOT_CONFIGURED',limitations:['Names and declarations are planning metadata, never evidence that executable configuration is available.','All parsed values are discarded; no secrets can be revealed, exported, sent to AI or injected into a runtime.','Source references are lexical candidates; comments and strings may match. Required/optional status is unknown.','No framework interpolation, managed vault or sandbox environment injection is implemented.']};
 }
 save(key,input){const project=this.wb.project(key);if(project.archived||project.trashed)throw Error('Restore project first');
  if(!input||Object.keys(input).some(k=>!['stage','text','version','remove'].includes(k))||!stages.includes(input.stage)||!Number.isInteger(input.version)||input.version<0)throw Error('Choose a valid stage and metadata version');
  const old=this.db.prepare('SELECT version FROM project_environment_metadata WHERE project=? AND stage=?').get(key,input.stage);
  if((old?.version||0)!==input.version)throw Error('Environment metadata changed; refresh before saving');
  const parsed=input.remove===true?{variables:[],duplicates:[],errors:[],valuesStored:false}:parseEnvironmentMetadata(input.text);
  const payload={...parsed,updatedAt:new Date().toISOString(),removed:input.remove===true};
  this.db.prepare('INSERT INTO project_environment_metadata VALUES (?,?,?,?) ON CONFLICT(project,stage) DO UPDATE SET version=excluded.version,payload=excluded.payload').run(key,input.stage,input.version+1,JSON.stringify(payload));
  this.wb.store.event('project.environment.metadata.saved',{key,stage:input.stage,variables:parsed.variables.length,version:input.version+1});return this.inspect(key);
 }
}
