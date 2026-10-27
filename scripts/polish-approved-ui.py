from pathlib import Path
r=Path(__file__).resolve().parents[1]
p=r/'public/workspace.js'
s=p.read_text(encoding='utf-8')
s=s.replace("selectedProject=null,project=null", "selectedProject=sessionStorage.getItem('rescue-project')||null,project=null")
s=s.replace("if(selectedProject){project=await v1('/sandboxes/'+selectedProject);}","if(selectedProject){project=await v1('/sandboxes/'+selectedProject);}if(page==='audit')data.audit=await api('/audit');")
s=s.replace("data.incidents.filter(i=>i.status==='recovered').length,'Persisted independent verification receipts'", "data.incidents.filter(i=>i.status==='recovered').length+studio.projects.reduce((n,p)=>n+(p.receipts||[]).filter(r=>r.recovered).length,0),'Persisted independent verification receipts'")
s=s.replace("selectedProject=e.target.value||null;operation", "selectedProject=e.target.value||null;if(selectedProject)sessionStorage.setItem('rescue-project',selectedProject);else sessionStorage.removeItem('rescue-project');operation")
s=s.replace("selectedProject=project.id;page='sandbox';", "selectedProject=project.id;sessionStorage.setItem('rescue-project',selectedProject);page='sandbox';")
s=s.replace("a.download=arg; a.click();", "a.download=r.headers.get('Content-Disposition')?.match(/filename=\"([^\"]+)\"/)?.[1]||arg;a.click();")
p.write_text(s,encoding='utf-8')
