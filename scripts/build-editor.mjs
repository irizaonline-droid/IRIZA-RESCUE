import {build} from 'esbuild';
import {mkdir,readFile} from 'node:fs/promises';
await mkdir('public/monaco',{recursive:true});
// Monaco creates dynamic theme sheets. Add the server's nonce at build time,
// preserving the application's CSP instead of allowing arbitrary inline styles.
const noncePlugin={name:'monaco-csp-nonce',setup(builder){builder.onLoad({filter:/domStylesheets\.js$/},async args=>({contents:(await readFile(args.path,'utf8')).replace("style.type = 'text/css';","style.type = 'text/css'; style.nonce = document.querySelector('meta[name=\"rescue-style-nonce\"]')?.content || '';"),loader:'js'}));}};
await build({entryPoints:['src/monaco-entry.mjs'],bundle:true,minify:true,outfile:'public/monaco/editor.js',loader:{'.ttf':'file'},assetNames:'[name]-[hash]',plugins:[noncePlugin]});
for(const name of ['editor','ts','json','css','html']){
 const location=name==='editor'?'editor/editor.worker':`language/${name==='ts'?'typescript':name}/${name}.worker`;
 await build({entryPoints:[`node_modules/monaco-editor/esm/vs/${location}.js`],bundle:true,minify:true,outfile:`public/monaco/${name}.worker.js`});
}
console.log('Monaco editor and five same-origin workers built.');
