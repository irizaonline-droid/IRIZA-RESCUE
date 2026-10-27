import https from 'node:https';
import {lookup} from 'node:dns/promises';
import {isIP} from 'node:net';
export function publicIP(ip){
  if(isIP(ip)===4){const [a,b]=ip.split('.').map(Number);return !(a===0||a===10||a===127||a>=224||a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&[0,168].includes(b)||a===100&&b>=64&&b<=127||a===198&&[18,19,51].includes(b)||a===203&&b===0);}
  if(isIP(ip)===6)return /^[23]/i.test(ip)&&!/^2001:(?:db8|0|2|10|20):/i.test(ip)&&!/^2002:/i.test(ip);
  return false;
}
export function publicURL(raw,{verification=false}={}){
  if(typeof raw!=='string'||raw.length>1000)throw Error('Provide a bounded public HTTPS URL');let url;try{url=new URL(raw);}catch{throw Error('Invalid website URL');}
  if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||url.port&&url.port!=='443'||isIP(url.hostname.replace(/^\[|\]$/g,''))||!url.hostname.includes('.')||url.hostname.endsWith('.local')||url.hostname.endsWith('.localhost'))throw Error('Only public DNS HTTPS domains without credentials, query strings or custom ports are supported');
  const allowed=['/','/en','/fr','/rw','/health','/api/health','/api/v1/health',...(verification?['/.well-known/iriza-rescue-verification']:[])];if(!allowed.includes(url.pathname))throw Error('Only root, locale and approved health routes can be observed');return url;
}
export async function publicProbe(raw,{verification=false,resolver=lookup,transport=https.get}={}){
  const url=publicURL(raw,{verification});const started=Date.now();let addresses;let timer;
  try{addresses=await Promise.race([resolver(url.hostname,{all:true}),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('DNS lookup timed out')),3000);})]);}finally{clearTimeout(timer);}
  if(!addresses?.length||addresses.some(a=>!publicIP(a.address)))throw Error('Website resolves to a private, special or unsupported network address');
  const pinned=addresses.find(a=>a.family===4)||addresses[0];
  return new Promise((resolve,reject)=>{
    let done=false;const finish=v=>{if(!done){done=true;resolve({...v,url:url.href,at:new Date().toISOString(),latencyMs:Date.now()-started,source:'independent-https-observer/v1',publicObservationOnly:true});}};
    const req=transport(url,{agent:false,headers:{Accept:'text/html,application/json,text/plain','User-Agent':'IRIZA-RESCUE/0.3 read-only-observer'},lookup:(_host,options,cb)=>options.all?cb(null,[pinned]):cb(null,pinned.address,pinned.family)},res=>{
      const certificate=res.socket?.getPeerCertificate?.();const validTo=certificate?.valid_to?new Date(certificate.valid_to).toISOString():null;
      const tls={authorized:res.socket?.authorized===true,validTo,daysRemaining:validTo?Math.floor((Date.parse(validTo)-Date.now())/86400000):null};let body='',bytes=0;
      let redirectLocation=null;if(res.headers?.location)try{const target=new URL(res.headers.location,url);if(target.protocol==='https:'&&!target.username&&!target.password&&!target.search)redirectLocation=target.origin+target.pathname;}catch{}
      const outcome=()=>({status:res.statusCode,healthy:res.statusCode>=200&&res.statusCode<400,tls,edge:{server:String(res.headers?.server||'').slice(0,80),rayId:String(res.headers?.['cf-ray']||'').replace(/[^a-zA-Z0-9-]/g,'').slice(0,100)},body:verification?body.trim():undefined,redirect:res.statusCode>=300&&res.statusCode<400?'Observed; redirects are not followed':null,redirectLocation});
      res.on('data',chunk=>{bytes+=chunk.length;if(bytes>16384){finish({...outcome(),body:undefined,truncated:true});req.destroy();return;}if(verification)body+=chunk.toString('utf8');});res.on('end',()=>finish(outcome()));res.on('error',()=>finish({...outcome(),error:'Response ended early'}));
    });req.setTimeout(5000,()=>req.destroy(Error('HTTPS request timed out')));req.on('error',error=>finish({status:0,healthy:false,tls:{authorized:false,validTo:null,daysRemaining:null},error:/cert|tls/i.test(error.message)?'TLS certificate validation failed':'HTTPS request failed or timed out'}));
  });
}
