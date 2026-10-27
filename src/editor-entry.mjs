import {EditorView,basicSetup} from 'codemirror';
import {keymap} from '@codemirror/view';
import {indentWithTab} from '@codemirror/commands';
import {javascript} from '@codemirror/lang-javascript';
import {python} from '@codemirror/lang-python';
import {json} from '@codemirror/lang-json';
import {html} from '@codemirror/lang-html';
import {css} from '@codemirror/lang-css';
import {markdown} from '@codemirror/lang-markdown';
import {oneDark} from '@codemirror/theme-one-dark';
window.createRescueEditor=(parent,source,path,onChange)=>{
 const ext=path.split('.').pop().toLowerCase();
 const language=({js:()=>javascript(),mjs:()=>javascript(),cjs:()=>javascript(),jsx:()=>javascript({jsx:true}),ts:()=>javascript({typescript:true}),tsx:()=>javascript({typescript:true,jsx:true}),py:python,json,html,css,md:markdown})[ext];
 return new EditorView({doc:source,parent,extensions:[basicSetup,EditorView.cspNonce.of(document.querySelector('meta[name="rescue-style-nonce"]')?.content||''),keymap.of([indentWithTab]),oneDark,...(language?[language()]:[]),EditorView.contentAttributes.of({'aria-label':'Sandbox source editor',spellcheck:'false'}),EditorView.theme({'&':{height:'550px',fontSize:'13px'},'.cm-scroller':{overflow:'auto',fontFamily:'Consolas, monospace'},'.cm-content':{padding:'16px 0'}}),EditorView.updateListener.of(update=>{if(update.docChanged)onChange(update.state.doc.toString());})]});
};
