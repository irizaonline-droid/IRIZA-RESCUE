/* Revision-bound engineering evidence. No source or secret values in reports. */
function engineeringChangesView(){return `<section class="card pad"><div class="card-head"><div><div class="eyebrow">ENGINEERING EVIDENCE</div><h2>Code changes & engineering statistics</h2><p>Imported originals compared with saved workspace files.</p></div><div class="control-row">${btn('Refresh statistics','upgradeStatistics','primary','pulse')}${btn('Download JSON','upgradeReportJson','','download')}${btn('Download Markdown','upgradeReportMarkdown','','download')}</div></div><div id="upgradeStatistics" aria-live="polite"><p>Load statistics to inspect the current revision and its recorded evidence.</p></div></section>`;}
function engineeringStatisticsResult(r){
 const s=r.statistics, count=v=>v===null?'Unavailable':v;
 const bars=(title,data)=>`<section class="card pad"><h3>${title}</h3>${data.length?data.map(d=>`<div class="upgrade-bar-row"><span>${esc(d.name)}</span><meter min="0" max="${Math.max(1,s.filesModified)}" value="${d.files}" aria-label="${esc(d.name)} changed files"></meter><strong>${d.files}</strong></div>`).join(''):'<p>No saved changes.</p>'}</section>`;
 return `<p class="muted">Revision ${r.project.workspaceRevision} · Source ${esc(r.project.sourceRevision||'local / uploaded copy')} · ${esc(when(r.at))}</p><div class="kpi-grid">${kpi('Project files',s.totalFiles,'Compared with imported originals','layers')}${kpi('Modified files',s.filesModified,'Saved workspace only','code')}${kpi('Lines added',count(s.linesAdded),s.lineCountStatus,'plus')}${kpi('Lines removed',count(s.linesRemoved),s.diffHunks===null?'Diff budget exceeded':s.diffHunks+' diff hunks','code')}</div><div class="upgrade-chart-grid section-space">${bars('Changes by language',s.byLanguage)}${bars('Changes by directory',s.byDirectory)}</div><h3>Saved changes</h3><div class="table-scroll"><table class="history-table"><thead><tr><th>File</th><th>Added</th><th>Removed</th><th>Hunks</th><th>Version</th></tr></thead><tbody>${s.files.map(f=>`<tr><td>${btn(f.path,'engineeringLocation|1|'+f.path,'small')}<small>${esc(f.status)} · SHA ${f.hash.slice(0,12)}</small></td><td>${count(f.added)}</td><td>${count(f.removed)}</td><td>${count(f.hunks)}</td><td>${f.version}</td></tr>`).join('')||'<tr><td colspan="5">No saved changes. Unsaved editor drafts are excluded.</td></tr>'}</tbody></table></div><h3>Verification for this revision</h3><dl class="upgrade-verification"><dt>Source checks</dt><dd>${esc(r.verification.source)}</dd><dt>Customer runtime</dt><dd>${esc(r.verification.runtime)}</dd><dt>Maintained fixture</dt><dd>${esc(r.verification.fixture)}</dd><dt>Deployment</dt><dd>BLOCKED · No authenticated adapter</dd></dl><h3>Recorded project timeline</h3><ol class="upgrade-timeline">${r.timeline.map(e=>`<li><time>${esc(when(e.at))}</time><strong>${esc(e.type.replaceAll('.',' '))}</strong>${e.path?`<code>${esc(e.path)}</code>`:''}${e.requestId?`<small>Provider request: ${esc(e.requestId)}</small>`:''}</li>`).join('')||'<li>No project events recorded.</li>'}</ol><details><summary>Coverage and limitations</summary><ul>${r.limitations.map(l=>'<li>'+esc(l)+'</li>').join('')}</ul></details>`;
}
const upgradeActionBase=act;
act=async function(action){
 if(action==='upgradeStatistics'){
   const key=hubKey,node=document.querySelector('#upgradeStatistics');if(!node)return;
   node.setAttribute('aria-busy','true');node.innerHTML='<p class="upgrade-working">Calculating saved changes and reading recorded evidence…</p>';
   try{const report=await hubApi('engineering-report');if(key===hubKey&&node.isConnected)node.innerHTML=engineeringStatisticsResult(report);}catch(error){node.textContent=error.message;}finally{node.removeAttribute('aria-busy');}return;
 }
 if(action==='upgradeReportJson'){download('rescue-engineering-report.json',await hubApi('engineering-report'));return;}
 if(action==='upgradeReportMarkdown'){const result=await hubApi('engineering-report?format=markdown');download('rescue-engineering-report.md',result.markdown,'text/markdown');return;}
 return upgradeActionBase(action);
};

let upgradeEnvironment=null;
function engineeringEnvironmentView(){return `<section class="card pad"><div class="eyebrow">PROJECT CONFIGURATION</div><h2>Environment requirements</h2><p>Compare variable names with source references, separately for development, testing, sandbox, staging and production.</p><p class="screen-error">Metadata only: imported values are discarded. No secret vault or runtime injection is connected. These profiles cannot make a release ready.</p><div class="control-row">${btn('Inspect requirements','upgradeEnvironment','primary','search')}${btn('Import .env names','upgradeEnvironmentImport','','plus')}</div><div id="upgradeEnvironmentResults" aria-live="polite"></div></section>`;}
function environmentMetadataResult(r){return `<h3>Source references</h3><p>Revision ${r.workspaceRevision} · Lexical references; required/optional status is unknown.</p><div class="table-scroll"><table class="history-table"><thead><tr><th>Name</th><th>Source</th><th>Requirement</th></tr></thead><tbody>${r.references.map(v=>`<tr><td><code>${esc(v.name)}</code></td><td>${btn(v.path+':'+v.line,'engineeringLocation|'+v.line+'|'+v.path,'small')}</td><td>Unknown</td></tr>`).join('')||'<tr><td colspan="3">No supported environment reference syntax found.</td></tr>'}</tbody></table></div>${r.profiles.map(p=>`<section class="card pad section-space"><div class="card-head"><h3>${esc(p.stage)} · v${p.version}</h3>${btn('Clear metadata','upgradeEnvironmentRemove|'+p.stage+'|'+p.version)}</div><p>${p.variables.length} names declared. Values discarded; execution blocked.</p><div class="table-scroll"><table class="history-table"><thead><tr><th>Variable</th><th>Declaration</th><th>Value storage</th><th>Exposure check</th></tr></thead><tbody>${p.variables.map(v=>`<tr><td><code>${esc(v.name)}</code></td><td>${v.declaredNonempty?'Nonempty declaration':'Empty declaration'}</td><td>NOT STORED</td><td>${v.unsafePublicName?'REVIEW PUBLIC SECRET NAME':v.publicVariable?'Public prefix · review required':'Server candidate'}</td></tr>`).join('')}</tbody></table></div><p>Referenced, undeclared: ${esc(p.referencedButUndeclared.join(', ')||'None')}</p><p>Declared, unreferenced: ${esc(p.declaredButUnreferenced.join(', ')||'None')}</p><p>Duplicates: ${esc(p.duplicates.join(', ')||'None')}</p>${p.errors.length?'<p role="alert">Invalid entries: '+p.errors.map(e=>'line '+e.line+' ('+esc(e.code)+')').join(', ')+'</p>':''}</section>`).join('')}<details><summary>Supported semantics and limitations</summary><ul>${r.limitations.map(l=>'<li>'+esc(l)+'</li>').join('')}</ul></details>`;}
const environmentUpgradeAction=act;
act=async function(action){
 if(action==='upgradeEnvironment'){upgradeEnvironment=await hubApi('environment-metadata');const node=document.querySelector('#upgradeEnvironmentResults');if(node)node.innerHTML=environmentMetadataResult(upgradeEnvironment);return;}
 if(action==='upgradeEnvironmentImport'){
  upgradeEnvironment=await hubApi('environment-metadata');
  modal('Import environment names','Planning metadata only. Use synthetic configuration to try this workflow.',`<form id="upgradeEnvironmentForm"><label for="upgradeStage">Environment</label><select id="upgradeStage">${upgradeEnvironment.stages.map(s=>'<option>'+s+'</option>').join('')}</select><label for="upgradeEnvFile">Environment file (up to 64 KB)</label><input id="upgradeEnvFile" type="file" required><p>File values are sent to this server for parsing and immediately discarded. Only variable names, duplicate/empty flags and source references are retained. Never select production credentials for metadata planning.</p><label><input type="checkbox" required> I understand no values will be stored or made available to a sandbox.</label></form>`,btn('Cancel','closeModal')+'<button class="btn primary" form="upgradeEnvironmentForm">Import names only</button>');return;
 }
 if(action.startsWith('upgradeEnvironmentRemove|')){const [,stage,version]=action.split('|');await hubApi('environment-metadata',{stage,version:Number(version),remove:true});return act('upgradeEnvironment');}
 return environmentUpgradeAction(action);
};
document.addEventListener('submit',async event=>{
 if(event.target.id!=='upgradeEnvironmentForm')return;event.preventDefault();if(!event.target.reportValidity())return;
 const file=document.querySelector('#upgradeEnvFile').files[0];if(!file||file.size>65536)return toast('Choose an environment file below 64 KB.','warn');
 const stage=document.querySelector('#upgradeStage').value,version=upgradeEnvironment.profiles.find(p=>p.stage===stage)?.version||0,key=hubKey;
 try{const text=await file.text();await v1('/projects/'+encodeURIComponent(key)+'/environment-metadata',{stage,version,text});closeModal();if(key===hubKey){hubTab='environment';render();await act('upgradeEnvironment');}toast('Names imported. All values discarded.');}catch(error){toast(error.message,'warn');}
});

function upgradeFileTree(files){
 const root={dirs:new Map(),files:[]};for(const f of files){let node=root;const parts=f.path.split('/');for(const part of parts.slice(0,-1)){if(!node.dirs.has(part))node.dirs.set(part,{dirs:new Map(),files:[]});node=node.dirs.get(part);}node.files.push(f);}
 function view(node,prefix=''){return [...node.dirs].map(([name,child])=>`<details class="upgrade-folder" ${hubFile?.path.startsWith(prefix+name+'/')?'open':''}><summary>${esc(name)}</summary>${view(child,prefix+name+'/')}</details>`).join('')+node.files.map(f=>`<button class="${hubFile?.path===f.path?'selected':''}" data-action="hubFile|${esc(f.path)}">${f.modified?'● ':''}${esc(f.path.split('/').pop())}${hubDrafts.has(hubKey+'|'+f.path)?' *':''}</button>`).join('');}
 return view(root);
}
const upgradeMountBase=mountCodeEditor;
let upgradeDraftDiff=null,upgradeRestore=null;
mountCodeEditor=function(){
 upgradeDraftDiff?.destroy();upgradeDraftDiff=null;upgradeMountBase();
 const tree=document.querySelector('.hub-file-tree');if(tree){tree.innerHTML=`<label for="upgradeFileFilter">Explorer</label><input id="upgradeFileFilter" placeholder="Search file paths" aria-label="Search file paths"><div id="upgradeFileTree">${upgradeFileTree(hubProject.files)}</div>`;}
 const pane=document.querySelector('.hub-code-pane');if(!pane||!hubFile)return;
 const controls=document.createElement('div');controls.className='control-row upgrade-editor-controls';controls.innerHTML=btn('Editor preferences','upgradeEditorPreferences')+btn('Find / replace','upgradeEditorFind')+btn('Format document','upgradeEditorFormat')+btn('Compare saved / draft','upgradeEditorCompare')+btn('Restore imported file','upgradeEditorRestore','','',!hubProject.files.find(f=>f.path===hubFile.path)?.modified);pane.prepend(controls);
 const crumb=document.createElement('nav');crumb.className='upgrade-breadcrumb';crumb.setAttribute('aria-label','Current file path');crumb.textContent=hubFile.path.split('/').join(' / ');pane.prepend(crumb);
};
document.addEventListener('input',event=>{
 if(event.target.id!=='upgradeFileFilter')return;const q=event.target.value.toLowerCase();
 const files=hubProject.files.filter(f=>f.path.toLowerCase().includes(q));
 document.querySelector('#upgradeFileTree').innerHTML=q?files.slice(0,200).map(f=>btn(f.path,'hubFile|'+f.path,'small')).join('')+(files.length>200?'<p>Showing first 200 matches. Refine your search.</p>':''):upgradeFileTree(files);
});
const upgradeEditorActionBase=act;
act=async function(action){
 if(action==='upgradeEditorPreferences'){
  let p={};try{p=JSON.parse(localStorage.getItem('rescue-editor-preferences')||'{}');}catch{}
  modal('Editor preferences','Saved in this browser. Themes follow the workspace light/dark control.',`<form id="upgradeEditorPreferencesForm"><label for="upgradeFontSize">Font size</label><input id="upgradeFontSize" type="number" min="10" max="24" value="${Math.max(10,Math.min(24,Number(p.fontSize)||13))}"><label><input type="checkbox" id="upgradeWordWrap" ${p.wordWrap==='on'?'checked':''}> Wrap long lines</label><label><input type="checkbox" id="upgradeMinimap" ${p.minimap!==false?'checked':''}> Show minimap</label><p>Ctrl+S saves the sandbox file. Ctrl+H opens find/replace. Ctrl+Z undoes edits in the current open editor session. Formatting is available only where Monaco has a registered formatter.</p></form>`,btn('Cancel','closeModal')+'<button class="btn primary" form="upgradeEditorPreferencesForm">Save preferences</button>');return;
 }
 if(action==='upgradeEditorFind'||action==='upgradeEditorFormat'){const supported=await rescueCodeView?.command?.(action==='upgradeEditorFind'?'editor.action.startFindReplaceAction':'editor.action.formatDocument');if(!supported)toast('This editor/language has no registered provider for that action.','warn');return;}
 if(action==='upgradeEditorRestore'){
  if(hubDrafts.has(hubKey+'|'+hubFile.path))return toast('Save or discard your draft before restoring the imported original.','warn');
  const exported=await hubApi('export'),file=exported.files.find(f=>f.path===hubFile.path);if(!file)return toast('This file already matches its imported original.');
  upgradeRestore={key:hubKey,path:hubFile.path,baseHash:hubFile.hash,version:hubFile.version,confirm:true};
  modal('Restore imported original',hubFile.path+' · Current saved file on the left, original import on the right. This creates a new reversible saved version.','<div id="upgradeDraftDiff" class="upgrade-diff-host"></div>',btn('Cancel','closeModal')+btn('Restore this file','upgradeEditorRestoreConfirm','primary'));
  if(window.createRescueDiff)upgradeDraftDiff=window.createRescueDiff(document.querySelector('#upgradeDraftDiff'),hubFile.content,file.original,hubFile.path);return;
 }
 if(action==='upgradeEditorRestoreConfirm'){
  if(!upgradeRestore||upgradeRestore.key!==hubKey)throw Error('Restore target changed. Review the file again.');
  const {key,...payload}=upgradeRestore;await hubApi('restore',payload);upgradeRestore=null;upgradeDraftDiff?.destroy();upgradeDraftDiff=null;closeModal();hubFile=await hubApi('file?path='+encodeURIComponent(payload.path));hubProject=await hubApi('');render();toast('Imported original restored as a new saved version.');return;
 }
 if(action==='upgradeEditorCompare'){
  const draft=hubDrafts.get(hubKey+'|'+hubFile.path)??hubFile.content;
  modal('Saved file vs current draft',hubFile.path+' · read-only comparison; no change is accepted by opening it.','<div id="upgradeDraftDiff" class="upgrade-diff-host"></div>');
  if(window.createRescueDiff)upgradeDraftDiff=window.createRescueDiff(document.querySelector('#upgradeDraftDiff'),hubFile.content,draft,hubFile.path);else document.querySelector('#upgradeDraftDiff').textContent='Diff editor unavailable. No file changed.';return;
 }
 if(action==='closeModal'){upgradeDraftDiff?.destroy();upgradeDraftDiff=null;}
 return upgradeEditorActionBase(action);
};
document.addEventListener('submit',event=>{if(event.target.id!=='upgradeEditorPreferencesForm')return;event.preventDefault();if(!event.target.reportValidity())return;localStorage.setItem('rescue-editor-preferences',JSON.stringify({fontSize:Number(document.querySelector('#upgradeFontSize').value),wordWrap:document.querySelector('#upgradeWordWrap').checked?'on':'off',minimap:document.querySelector('#upgradeMinimap').checked}));rescueCodeView?.preferences?.();closeModal();toast('Editor preferences saved.');});
