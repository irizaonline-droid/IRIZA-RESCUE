import {workspaceLimits} from './workspace-limits.mjs';
import {publicRepositoryArchive} from './public-repository-archive.mjs';
import {pythonSyntax} from './source-syntax.mjs';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {inspectLocalProject} from './scanner.mjs';

// Read fixed GitHub API endpoints only. No checkout hooks, installation or execution.
export async function inspectRepository(connections,id){
 const repo=connections.list().repositories.find(r=>r.id===id);
 if(!repo)throw Error('Connect this repository first');
 if(!repo.commit)throw Error('Repository has no commits. Add project files and a first commit, then refresh.');
 if(repo.visibility==='public')return inspectPublicArchive(repo,connections.fetcher);
 const tree=await connections.github('/repos/'+repo.fullName+'/git/trees/'+repo.commit+'?recursive=1',2000000);
 if(!Array.isArray(tree.tree))throw Error('GitHub did not return a source tree');
 const inventory=tree.tree.filter(f=>f.type==='blob');
 const safe=f=>f.mode!=='120000'&&f.mode!=='160000'&&typeof f.path==='string'&&!f.path.includes('\\')&&!/[<>:"|?*]/.test(f.path)&&f.path.length<220&&!f.path.startsWith('/')&&f.path.split('/').every(p=>p&&p!=='.'&&p!=='..'&&!/^(?:\.env|\.git$|node_modules$|dist$|build$|data$|\.ssh$|\.aws$|\.azure$|\.kube$|credentials|secrets|service[-_]account)/i.test(p))&&/\.(?:mjs|cjs|js|ts|tsx|jsx|json|yml|yaml|py|php|go|rs|md|toml)$|(?:^|\/)Dockerfile$/.test(f.path)&&Number.isSafeInteger(f.size)&&f.size<=32768&&/^[a-f0-9]{40}$/.test(f.sha);
 const eligible=inventory.filter(safe).sort((a,b)=>Number(/(?:^|\/)(?:package|composer)\.json$/.test(b.path))-Number(/(?:^|\/)(?:package|composer)\.json$/.test(a.path))||a.path.split('/').length-b.path.split('/').length||a.path.localeCompare(b.path));
 const selected=eligible.slice(0,12),failed=[];const temp=await mkdtemp(path.join(tmpdir(),'rescue-github-scan-'));
 try{
  await mkdir(path.join(temp,'.git')); // Identifies this temporary inventory to the shared static inspector.
  for(const f of selected){try{const blob=await connections.github('/repos/'+repo.fullName+'/git/blobs/'+f.sha);if(blob.encoding!=='base64'||typeof blob.content!=='string')throw Error('Unsupported GitHub blob format');const content=Buffer.from(blob.content,'base64');if(content.length!==f.size||content.length>32768)throw Error('Source size changed or exceeded limit');const target=path.join(temp,...f.path.split('/'));await mkdir(path.dirname(target),{recursive:true});await writeFile(target,content);}catch(error){failed.push({path:f.path,error:error.message});if(/rate limit|denied|credential/i.test(error.message))break;}}
  const local=await inspectLocalProject(temp);local.root=repo.url+' @ '+repo.commit;local.source='github-static';
  return {repositoryId:repo.id,fullName:repo.fullName,commit:repo.commit,local,findings:local.findings,filesAvailable:inventory.length,eligibleFiles:eligible.length,filesInspected:local.filesChecked,failed,partial:!!tree.truncated||local.filesChecked<eligible.length||failed.length>0,treeTruncated:!!tree.truncated,files:inventory.slice(0,500).map(f=>({path:f.path,bytes:f.size,sha:f.sha,selected:selected.some(s=>s.path===f.path)})),limits:{maxSourceFiles:12,maxFileBytes:32768,maxInventoryFiles:500},codeExecuted:false};
 }finally{await rm(temp,{recursive:true,force:true});}
}

async function inspectPublicArchive(repo,fetcher){
 const files=await publicRepositoryArchive(repo,fetcher),temp=await mkdtemp(path.join(tmpdir(),'rescue-public-source-')),selected=[],skipped=[];let bytes=0;
 const allowed=f=>f.path.length<220&&!/[<>:"\\|?*]/.test(f.path)&&!f.path.startsWith('/')&&f.path.split('/').every(p=>p&&p!=='.'&&p!=='..'&&!/^(?:\.env|\.git$|node_modules$|dist$|build$|data$|\.ssh$|\.aws$|\.azure$|\.kube$|credentials|secrets|service[-_]account)/i.test(p))&&(/\.(?:mjs|cjs|js|ts|tsx|jsx|json|yml|yaml|py|php|go|rs|md|toml)$/i.test(f.path)||/(?:^|\/)(?:Dockerfile|requirements.txt)$/.test(f.path));
 try{await mkdir(path.join(temp,'.git'));for(const f of files){if(!allowed(f)){skipped.push({path:f.path,reason:'Excluded path or unsupported/binary format'});continue;}if(f.size>workspaceLimits().maxFileBytes||bytes+f.size>workspaceLimits().maxSourceBytes){skipped.push({path:f.path,reason:'Source scan resource limit'});continue;}const target=path.join(temp,...f.path.split('/'));await mkdir(path.dirname(target),{recursive:true});await writeFile(target,f.content);selected.push(f);bytes+=f.size;}
 const local=await inspectLocalProject(temp);local.root=repo.url+' @ '+repo.commit;local.source='github-public-archive';
 const syntax=await pythonSyntax(selected.filter(f=>f.path.endsWith('.py')).map(f=>({path:f.path,source:f.content.toString('utf8')})));
 for(const r of syntax.results.filter(r=>r.status==='FAIL'))local.findings.push({severity:'ERROR',path:r.path,line:r.line,check:'python-syntax',message:r.message});
 const unsupported=skipped.filter(s=>s.reason==='Source scan resource limit').length;
 return {repositoryId:repo.id,fullName:repo.fullName,commit:repo.commit,transport:'PUBLIC_PINNED_ARCHIVE',local,syntax,findings:local.findings,filesAvailable:files.length,eligibleFiles:selected.length+unsupported,filesInspected:local.filesChecked,failed:[],skipped:skipped.slice(0,500),partial:unsupported>0||!!local.skipped.limits||!!local.skipped.large,treeTruncated:false,files:files.slice(0,500).map(f=>({path:f.path,bytes:f.size,selected:selected.some(s=>s.path===f.path)})),limits:{maxSourceFiles:5000,maxFileBytes:workspaceLimits().maxFileBytes,maxSourceBytes:workspaceLimits().maxSourceBytes,maxArchiveBytes:16777216},codeExecuted:false};
 }finally{await rm(temp,{recursive:true,force:true});}
}
