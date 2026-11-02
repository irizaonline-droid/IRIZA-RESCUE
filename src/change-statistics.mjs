import {createHash} from 'node:crypto';

const digest = text => createHash('sha256').update(text).digest('hex');
const lines = text => text.match(/[^\n]*\n|[^\n]+$/g) || [];

// Bounded LCS. Large unrelated replacements return unavailable, never estimated counts.
export function lineChanges(before, after, budget = 2_000_000) {
  if (before === after) return {status:'EXACT',added:0,removed:0,hunks:0,newlineChanged:false,workCells:0};
  const a=lines(before), b=lines(after); let start=0, endA=a.length, endB=b.length;
  while(start<endA && start<endB && a[start]===b[start])start++;
  while(endA>start && endB>start && a[endA-1]===b[endB-1]){endA--;endB--;}
  const n=endA-start,m=endB-start;
  if(!n||!m)return {status:'EXACT',added:m,removed:n,hunks:n||m?1:0,newlineChanged:before.endsWith('\n')!==after.endsWith('\n'),workCells:0};
  if((n+1)*(m+1)>budget)return {status:'BUDGET_EXCEEDED',added:null,removed:null,hunks:null,newlineChanged:before.endsWith('\n')!==after.endsWith('\n')};
  const width=m+1, dp=new Uint32Array((n+1)*width);
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)dp[i*width+j]=a[start+i]===b[start+j]?1+dp[(i+1)*width+j+1]:Math.max(dp[(i+1)*width+j],dp[i*width+j+1]);
  let i=0,j=0,added=0,removed=0,hunks=0,gap=7;
  while(i<n||j<m){
    if(i<n&&j<m&&a[start+i]===b[start+j]){i++;j++;gap++;continue;}
    if(gap>6)hunks++;gap=0;
    if(i<n&&(j===m||dp[(i+1)*width+j]>=dp[i*width+j+1])){removed++;i++;}else{added++;j++;}
  }
  const newlineChanged=before.endsWith('\n')!==after.endsWith('\n');
  // A final newline change replaces the final Git line, even if its text is equal.
  if(newlineChanged && !n && !m && a.length){added++;removed++;hunks++;}
  return {status:'EXACT',added,removed,hunks,newlineChanged,workCells:(n+1)*(m+1)};
}

export function changeStatistics(files) {
  let remaining=8_000_000;
  const changed=files.filter(f=>f.original!==f.content).map(f=>({path:f.path,version:f.version,language:language(f.path),directory:f.path.includes('/')?f.path.slice(0,f.path.lastIndexOf('/')):'(root)',baseHash:digest(f.original),hash:digest(f.content),...(()=>{const result=lineChanges(f.original,f.content,Math.min(2_000_000,remaining));remaining-=result.workCells||0;return result;})(),testFile:/(?:^|\/)(?:tests?|__tests__)(?:\/|$)|\.(?:test|spec)\./i.test(f.path),configuration:/(?:^|\/)(?:[^/]*config[^/]*|Dockerfile|.*\.toml|.*\.ya?ml|package(?:-lock)?\.json)$/i.test(f.path)}));
  const exact=changed.every(f=>f.status==='EXACT');
  const group=field=>Object.entries(changed.reduce((all,f)=>(all[f[field]]=(all[f[field]]||0)+1,all),{})).map(([name,files])=>({name,files}));
  return {totalFiles:files.length,filesInspected:files.length,filesModified:changed.length,filesAdded:0,filesDeleted:0,filesRenamed:0,linesAdded:exact?changed.reduce((n,f)=>n+f.added,0):null,linesRemoved:exact?changed.reduce((n,f)=>n+f.removed,0):null,diffHunks:exact?changed.reduce((n,f)=>n+f.hunks,0):null,lineCountStatus:exact?'EXACT':'PARTIAL',testFilesAffected:changed.filter(f=>f.testFile).length,configurationFilesAffected:changed.filter(f=>f.configuration).length,byLanguage:group('language'),byDirectory:group('directory'),files:changed,limitations:['Statistics compare imported originals with saved workspace files; unsaved drafts and AI proposals are separate.','File create/delete/rename and semantic changed-symbol analysis are not implemented.','Line alignment is bounded to 2,000,000 LCS cells per changed file and 8,000,000 per report; unavailable counts are null.','Hunks merge changes separated by six or fewer unchanged lines (three lines of context).']};
}
function language(p){return ({ts:'TypeScript',tsx:'TypeScript',js:'JavaScript',jsx:'JavaScript',mjs:'JavaScript',cjs:'JavaScript',py:'Python',json:'JSON',md:'Markdown',css:'CSS',html:'HTML',sql:'SQL',yml:'YAML',yaml:'YAML'})[p.split('.').pop()]||'Other';}

export function reportMarkdown(report){
  const cell=v=>String(v??'Unavailable').replaceAll('|','\\|').replace(/[\r\n]/g,' ');
  const s=report.statistics;
  return `# Engineering report\n\nProject: ${cell(report.project.name)}\n\nSource revision: ${cell(report.project.sourceRevision)}\n\nWorkspace revision: ${report.project.workspaceRevision}\n\nGenerated: ${report.at}\n\n## Saved changes\n\n${s.filesModified} of ${s.totalFiles} files modified. Lines added: ${s.linesAdded??'unavailable'}; removed: ${s.linesRemoved??'unavailable'}.\n\n| File | Added | Removed | Hunks | Status |\n|---|---:|---:|---:|---|\n${s.files.map(f=>`| ${cell(f.path)} | ${cell(f.added)} | ${cell(f.removed)} | ${cell(f.hunks)} | ${f.status} |`).join('\n')}\n\n## Verification and release\n\nSource validation: ${cell(report.verification.source)}\n\nCustomer runtime: ${cell(report.verification.runtime)}\n\nMaintained fixture: ${cell(report.verification.fixture)}\n\nRelease: BLOCKED — no authenticated deployment adapter.\n\n## Recorded activity\n\n${report.timeline.map(e=>`- ${e.at}: ${e.type}${e.path?' ('+cell(e.path)+')':''}`).join('\n')}\n\n## Limitations\n\n${report.limitations.map(x=>'- '+x).join('\n')}\n\nProduction changed: false. Published: false.\n`;
}
