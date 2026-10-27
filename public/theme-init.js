var requestedWorkspaceView=location.hash.slice(1);
try{const choice=localStorage.getItem('rescue-theme')||'dark';document.documentElement.dataset.theme=choice==='system'?(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):choice;}catch{document.documentElement.dataset.theme='dark';}

