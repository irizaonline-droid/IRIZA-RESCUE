import * as monaco from 'monaco-editor';
import {typescriptDefaults,javascriptDefaults,JsxEmit} from 'monaco-editor/language/typescript/monaco.contribution.js';
self.MonacoEnvironment={getWorker(_id,label){return new Worker('/monaco/'+({typescript:'ts',javascript:'ts',json:'json',css:'css',scss:'css',less:'css',html:'html',handlebars:'html'}[label]||'editor')+'.worker.js');}};
const language=p=>({ts:'typescript',tsx:'typescript',js:'javascript',jsx:'javascript',mjs:'javascript',cjs:'javascript',py:'python',md:'markdown',sh:'shell',ps1:'powershell',rs:'rust',cs:'csharp'})[p.split('.').pop()]||p.split('.').pop();
// Browser models have no installed project dependencies. Keep syntax diagnostics;
// semantic diagnostics come from the bounded backend evidence, not missing browser types.
for(const defaults of [typescriptDefaults,javascriptDefaults]){defaults.setDiagnosticsOptions({noSemanticValidation:true,noSyntaxValidation:false});defaults.setCompilerOptions({allowNonTsExtensions:true,jsx:JsxEmit.Preserve});}
let sequence=0;
function theme(){return document.documentElement.dataset.theme==='light'?'vs':'vs-dark';}
function preferences(){try{const p=JSON.parse(localStorage.getItem('rescue-editor-preferences')||'{}');return {fontSize:Math.min(24,Math.max(10,Number(p.fontSize)||13)),wordWrap:p.wordWrap==='on'?'on':'off',minimap:{enabled:p.minimap!==false}};}catch{return {fontSize:13,wordWrap:'off',minimap:{enabled:true}};}}
window.createRescueEditor=(parent,source,path,onChange)=>{
 const model=monaco.editor.createModel(source,language(path),monaco.Uri.parse('inmemory://workspace/'+(++sequence)+'/'+path));
 const editor=monaco.editor.create(parent,{model,theme:theme(),automaticLayout:true,lineNumbers:'on',scrollBeyondLastLine:false,tabSize:2,ariaLabel:'Sandbox source editor',renderValidationDecorations:'on',...preferences()});
 const listener=model.onDidChangeContent(()=>onChange(model.getValue()));
 const observer=new MutationObserver(()=>monaco.editor.setTheme(theme()));observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 return {destroy(){observer.disconnect();listener.dispose();editor.dispose();model.dispose();},focus(){editor.focus();},preferences(){editor.updateOptions(preferences());},async command(id){const action=editor.getAction(id);if(!action||!action.isSupported())return false;await action.run();return true;},revealLine(line){editor.revealLineInCenter(line);editor.setPosition({lineNumber:line,column:1});editor.focus();}};
};
window.createRescueDiff=(parent,original,modified,path)=>{
 const a=monaco.editor.createModel(original,language(path)),b=monaco.editor.createModel(modified,language(path));
 const editor=monaco.editor.createDiffEditor(parent,{theme:theme(),automaticLayout:true,readOnly:true,originalEditable:false,renderSideBySide:parent.clientWidth>=700,enableSplitViewResizing:true,renderOverviewRuler:false,scrollBeyondLastLine:false});editor.setModel({original:a,modified:b});return {layout(sideBySide){editor.updateOptions({renderSideBySide:sideBySide});},destroy(){editor.dispose();a.dispose();b.dispose();}};
};

