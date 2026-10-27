import https from 'node:https';
import {lookup} from 'node:dns/promises';
import {isIP} from 'node:net';
export function publicAddress(address){
  if(isIP(address)!==4)return false;
  const [a,b]=address.split('.').map(Number);
  return !(a===0||a===10||a===127||a>=224||a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&[0,168].includes(b)||a===100&&b>=64&&b<=127||a===198&&[18,19,51].includes(b)||a===203&&b===0);
}
export async function probeConnector(connector){
  const url=new URL(connector.url);
  if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||url.port&&url.port!=='443')throw Error('Connector requires an approved HTTPS URL without credentials, queries or custom ports');
  const addresses=await lookup(url.hostname,{all:true});
  if(!addresses.length||addresses.some(x=>!publicAddress(x.address)))throw Error('Connector resolved to a restricted address');
  const pinned=addresses[0];const started=performance.now();
  return new Promise((resolve,reject)=>{
    const req=https.get(url,{headers:{Accept:'application/json',...(connector.tokenEnv&&process.env[connector.tokenEnv]?{Authorization:`Bearer ${process.env[connector.tokenEnv]}`}:{})},lookup:(host,options,cb)=>options.all?cb(null,[pinned]):cb(null,pinned.address,pinned.family)},res=>{
      // Deliberately do not retain service bodies or follow redirects.
      res.destroy();resolve({id:connector.id,status:res.statusCode,healthy:res.statusCode===200,latencyMs:Math.round(performance.now()-started),at:new Date().toISOString()});
    });req.setTimeout(5000,()=>req.destroy(Error('Connector timeout')));req.on('error',()=>reject(Error('Connector unreachable')));
  });
}
