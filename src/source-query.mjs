export function searchIntelligence(index,query){
 if(typeof query!=='string'||query.trim().length<2||query.length>200)throw Error('Search must be 2-200 characters');
 const q=query.toLowerCase().trim();return {query,symbols:index.symbols.filter(s=>s.name.toLowerCase().includes(q)).slice(0,100),files:index.inventory.filter(f=>f.path.toLowerCase().includes(q)).slice(0,100),imports:index.imports.filter(i=>i.specifier.toLowerCase().includes(q)||i.text.toLowerCase().includes(q)).slice(0,100),sourceDigest:index.sourceDigest,semanticSearch:false};
}
