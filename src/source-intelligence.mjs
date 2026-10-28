import ts from 'typescript';
import path from 'node:path';
import {createHash} from 'node:crypto';
export function sourceIntelligence(files){
 const inventory=files.map(f=>({path:f.path,hash:createHash('sha256').update(f.content).digest('hex'),bytes:Buffer.byteLength(f.content)}));
 const paths=new Set(inventory.map(f=>f.path)),symbols=[],imports=[],diagnostics=[],coverage=[],routes=[];
 for(const f of files){
  if(!/\.(?:[cm]?js|jsx|tsx?|mts|cts)$/.test(f.path)){coverage.push({path:f.path,status:'INVENTORY_ONLY'});continue;}
  const ast=ts.createSourceFile(f.path,f.content,ts.ScriptTarget.Latest,true);
  const location=n=>({path:f.path,line:ast.getLineAndCharacterOfPosition(n.getStart(ast)).line+1});
  for(const d of ast.parseDiagnostics)diagnostics.push({path:f.path,line:ast.getLineAndCharacterOfPosition(d.start||0).line+1,code:d.code,message:ts.flattenDiagnosticMessageText(d.messageText,' '),severity:'error'});
  const visit=n=>{
   if(ts.isCallExpression(n)&&ts.isPropertyAccessExpression(n.expression)&&/^(get|post|put|patch|delete|options|head)$/.test(n.expression.name.text)&&n.arguments[0]&&ts.isStringLiteral(n.arguments[0]))routes.push({...location(n),method:n.expression.name.text.toUpperCase(),route:n.arguments[0].text.slice(0,500),confidence:'SYNTAX_CANDIDATE_NOT_RUNTIME_VERIFIED'});
   if((ts.isFunctionDeclaration(n)||ts.isClassDeclaration(n)||ts.isMethodDeclaration(n)||ts.isInterfaceDeclaration(n)||ts.isTypeAliasDeclaration(n))&&n.name)symbols.push({...location(n),name:n.name.getText(ast),kind:ts.SyntaxKind[n.kind]});
   if(ts.isVariableDeclaration(n)&&ts.isIdentifier(n.name)&&n.initializer&&(ts.isArrowFunction(n.initializer)||ts.isFunctionExpression(n.initializer)))symbols.push({...location(n),name:n.name.text,kind:'FunctionVariable'});
   if((ts.isImportDeclaration(n)||ts.isExportDeclaration(n))&&n.moduleSpecifier&&ts.isStringLiteral(n.moduleSpecifier)){
    const specifier=n.moduleSpecifier.text,base=path.posix.normalize(path.posix.join(path.posix.dirname(f.path),specifier));
    const candidates=[base,...['.ts','.tsx','.js','.jsx','.mjs','.cjs','/index.ts','/index.js'].map(e=>base+e),base.replace(/\.js$/,'.ts')];
    imports.push({...location(n),specifier,target:specifier.startsWith('.')?candidates.find(p=>paths.has(p))||null:null,status:specifier.startsWith('.')?'RELATIVE_SYNTAX':'EXTERNAL',text:n.getText(ast).slice(0,500)});
   }
   ts.forEachChild(n,visit);
  };visit(ast);coverage.push({path:f.path,status:'AST_PARSED'});
 }
 const frameworks=[];for(const f of files.filter(f=>/(^|\/)package\.json$/.test(f.path))){try{const pkg=JSON.parse(f.content);for(const name of ['next','react','express','fastify','vue','svelte','@angular/core'])if(pkg.dependencies?.[name]||pkg.devDependencies?.[name])frameworks.push({name,requirement:pkg.dependencies?.[name]||pkg.devDependencies[name],path:f.path,evidence:'MANIFEST_DECLARATION_NOT_INSTALLED_RUNTIME'});}catch{}}
 const tests=inventory.filter(f=>/(^|\/)(?:test[^/]*\.py|[^/]*_test\.py|(?:test|tests|__tests__)\/.*|.*\.(?:test|spec)\.[cm]?[jt]sx?)$/.test(f.path)).map(f=>({path:f.path,status:'DISCOVERED_NOT_EXECUTED'}));
 return {version:2,engine:'TypeScript Compiler API '+ts.version,license:'Apache-2.0',at:new Date().toISOString(),sourceDigest:createHash('sha256').update(JSON.stringify(inventory)).digest('hex'),inventory,symbols,imports,diagnostics,coverage,routes,frameworks,tests,codeExecuted:false,limitations:['Syntactic symbols and import edges only; no semantic call graph or runtime proof.','Non-JavaScript/TypeScript files have inventory coverage only.','Relative imports use explicit extension/index candidates; tsconfig aliases are unresolved.']};
}
export {searchIntelligence} from './source-query.mjs';
