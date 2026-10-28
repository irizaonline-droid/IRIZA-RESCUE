import {parentPort,workerData} from 'node:worker_threads';
import ts from 'typescript';import path from 'node:path';
import {sourceIntelligence} from './source-intelligence.mjs';

function typeDiagnostics(files){
 const selected=files.filter(f=>/\.(?:ts|tsx|mts|cts)$/.test(f.path));if(!selected.length)return {status:'NOT_APPLICABLE',results:[]};
 const options={noEmit:true,strict:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,skipLibCheck:true,jsx:ts.JsxEmit.Preserve,types:[]};
 const virtualRoot=path.resolve('rescue-virtual-source'),normalize=p=>path.resolve(p).replaceAll('\\','/'),virtual=new Map(files.map(f=>[normalize(path.join(virtualRoot,f.path)),f.content]));
 const library=normalize(path.dirname(ts.getDefaultLibFilePath(options))),host=ts.createCompilerHost(options);
 const trustedLib=p=>normalize(p).startsWith(library+'/')&&/^lib\.[a-z0-9.]+\.d\.ts$/i.test(path.basename(p))&&normalize(path.dirname(p))===library;
 const read=host.readFile.bind(host),exists=host.fileExists.bind(host);
 host.readFile=p=>virtual.get(normalize(p))??(trustedLib(p)?read(p):undefined);
 host.fileExists=p=>virtual.has(normalize(p))||trustedLib(p)&&exists(p);
 host.getSourceFile=(p,languageVersion)=>{const text=host.readFile(p);return text===undefined?undefined:ts.createSourceFile(p,text,languageVersion,true);};
 host.directoryExists=p=>normalize(p)===library||[...virtual.keys()].some(f=>f.startsWith(normalize(p)+'/'));
 host.getCurrentDirectory=()=>virtualRoot;host.getDirectories=()=>[];host.readDirectory=()=>[];host.realpath=p=>p;host.writeFile=()=>{throw Error('Source analysis cannot emit files');};
 const program=ts.createProgram(selected.map(f=>path.join(virtualRoot,f.path)),options,host),results=[];
 for(const d of program.getSemanticDiagnostics()){if(!d.file||!virtual.has(normalize(d.file.fileName)))continue;results.push({path:path.relative(virtualRoot,d.file.fileName).replaceAll('\\','/'),line:d.file.getLineAndCharacterOfPosition(d.start||0).line+1,code:d.code,status:[2307,2688,2580].includes(d.code)?'UNRESOLVED_ENVIRONMENT':'FAIL',message:ts.flattenDiagnosticMessageText(d.messageText,' ').slice(0,800)});if(results.length>=200)break;}
 return {status:results.some(d=>d.status==='FAIL')?'FAIL':results.length?'PARTIAL':'PASS',results,engine:'TypeScript '+ts.version,limitations:'Strict checking of virtual source and trusted TypeScript standard libraries only; no project dependency installation or tsconfig execution.'};
}
try{const index=sourceIntelligence(workerData);index.typescript=typeDiagnostics(workerData);parentPort.postMessage({index});}catch(error){parentPort.postMessage({error:String(error.message).slice(0,1000)});}
