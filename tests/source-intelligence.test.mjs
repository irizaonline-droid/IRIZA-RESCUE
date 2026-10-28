import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sourceIntelligence,searchIntelligence} from '../src/source-intelligence.mjs';
test('AST index finds declarations, cross-file imports, source locations and genuine syntax errors without executing code',()=>{
 const files=[{path:'auth.ts',content:'export function authorize(token: string) { return token.length > 0; }\n'},{path:'api.ts',content:'import {authorize} from "./auth.js";\nexport const handler = () => authorize("test");\n'},{path:'broken.ts',content:'export function broken( { '},{path:'README.md',content:'function invented() {}'}];
 const i=sourceIntelligence(files);assert.equal(i.codeExecuted,false);assert(i.symbols.some(s=>s.name==='authorize'&&s.line===1));assert(i.symbols.some(s=>s.name==='handler'&&s.line===2));assert(!i.symbols.some(s=>s.name==='invented'));assert.equal(i.imports[0].target,'auth.ts');assert(i.diagnostics.some(d=>d.path==='broken.ts'));assert.equal(searchIntelligence(i,'authorize').symbols.length,1);assert.throws(()=>searchIntelligence(i,'a'),/2-200/);assert.notEqual(sourceIntelligence([...files,{path:'new.ts',content:'export class Added {}'}]).sourceDigest,i.sourceDigest);
});
