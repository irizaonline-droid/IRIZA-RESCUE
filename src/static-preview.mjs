import {parse,serialize} from 'parse5';
const forbidden=new Set(['script','iframe','frame','frameset','object','embed','base','meta','link','form','portal']);
export function staticPreview(source){
 if(Buffer.byteLength(source)>262144)throw Error('Static HTML preview supports documents up to256 KB');
 const document=parse(source);let count=0;
 function clean(node,depth=0){if(++count>30000||depth>100)throw Error('Preview document exceeds its structure budget');if(node.attrs)node.attrs=node.attrs.filter(a=>/^(?:class|id|title|alt|style|role|width|height|colspan|rowspan|aria-[a-z-]+)$/.test(a.name));if(node.childNodes){node.childNodes=node.childNodes.filter(n=>!forbidden.has(n.tagName));for(const child of node.childNodes)clean(child,depth+1);}if(node.content)clean(node.content,depth+1);}
 clean(document);const html=document.childNodes.find(n=>n.tagName==='html'),head=html?.childNodes.find(n=>n.tagName==='head');if(head)head.childNodes.unshift({nodeName:'meta',tagName:'meta',namespaceURI:'http://www.w3.org/1999/xhtml',attrs:[{name:'http-equiv',value:'Content-Security-Policy'},{name:'content',value:"default-src 'none'; style-src 'unsafe-inline'; script-src 'none'; form-action 'none'; base-uri 'none'"}],childNodes:[],parentNode:head});return serialize(document);
}
