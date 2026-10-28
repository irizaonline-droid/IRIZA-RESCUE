import * as monaco from 'monaco-editor';
self.MonacoEnvironment={getWorker(_id,label){return new Worker('/monaco/'+({typescript:'ts',javascript:'ts',json:'json',css:'css',scss:'css',less:'css',html:'html',handlebars:'html'}[label]||'editor')+'.worker.js');}};
const language=p=>({ts:'typescript',tsx:'typescript',js:'javascript',jsx:'javascript',mjs:'javascript',cjs:'javascript',py:'python',md:'markdown',sh:'shell',ps1:'powershell',rs:'rust',cs:'csharp'})[p.split('.').pop()]||p.split('.').pop();
let sequence=0;
function theme(){return document.documentElement.dataset.theme==='light'?'vs':'vs-dark';}
window.createRescueEditor=(parent,source,path,onChange)=>{
 const model=monaco.editor.createModel(source,language(path),monaco.Uri.parse('inmemory://workspace/'+(++sequence)+'/'+path));
 const editor=monaco.editor.create(parent,{model,theme:theme(),automaticLayout:true,fontSize:13,lineNumbers:'on',minimap:{enabled:true},scrollBeyondLastLine:false,wordWrap:'off',tabSize:2,ariaLabel:'Sandbox source editor',renderValidationDecorations:'on'});
 const listener=model.onDidChangeContent(()=>onChange(model.getValue()));
 const observer=new MutationObserver(()=>monaco.editor.setTheme(theme()));observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 return {destroy(){observer.disconnect();listener.dispose();editor.dispose();model.dispose();},focus(){editor.focus();},revealLine(line){editor.revealLineInCenter(line);editor.setPosition({lineNumber:line,column:1});editor.focus();}};
};
window.createRescueDiff=(parent,original,modified,path)=>{
 const a=monaco.editor.createModel(original,language(path)),b=monaco.editor.createModel(modified,language(path));
 const editor=monaco.editor.createDiffEditor(parent,{theme:theme(),automaticLayout:true,readOnly:true,originalEditable:false,renderSideBySide:true,scrollBeyondLastLine:false});editor.setModel({original:a,modified:b});return {destroy(){editor.dispose();a.dispose();b.dispose();}};
};
