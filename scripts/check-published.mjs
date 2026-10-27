import {publicProbe} from '../src/public-probe.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const urls=['https://educo.rw/','https://educo.rw/en','https://iriza.online/','https://mrcreativist.ca/'];const records=[];
for(let round=1;round<=3;round++){
  const observations=await Promise.all(urls.map(async url=>{try{return {...await publicProbe(url),round};}catch(error){return {url,round,error:error.message,healthy:false,status:0,at:new Date().toISOString()};}}));records.push(...observations);console.log(`Round ${round}: `+observations.map(x=>new URL(x.url).hostname+new URL(x.url).pathname+' HTTP '+x.status).join(' · '));
}
const report={at:new Date().toISOString(),scope:'User-authorized, bounded read-only public checks',records,passing:records.filter(x=>x.healthy).length,total:records.length,productionChangesPerformed:false,limitations:['Point-in-time observations; intermittent 524 cause remains unproven','EDUCO root redirects to /en; final route checked independently','No payment/order creation, protected workflows or account mutations tested','Authorized origin logs are required to diagnose prior timeouts']};
await mkdir(new URL('../artifacts/',import.meta.url),{recursive:true});await writeFile(new URL('../artifacts/published-site-checks.json',import.meta.url),JSON.stringify(report,null,2));
