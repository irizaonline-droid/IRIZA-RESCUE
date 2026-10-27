import {gunzipSync} from 'node:zlib';
// Public pinned archives require no credential and avoid per-file REST quota.
export function readTarGzip(compressed){
 if(compressed.length>16*1024*1024)throw Error('Repository archive exceeds 16 MB compressed limit');
 const tar=gunzipSync(compressed,{maxOutputLength:64*1024*1024}),files=[];let offset=0,entries=0;
 while(offset+512<=tar.length){const header=tar.subarray(offset,offset+512);if(header.every(b=>b===0))break;if(++entries>5000)throw Error('Repository archive exceeds 5000 entries');
 const string=(a,b)=>header.subarray(a,b).toString('utf8').split('\0')[0];const number=(a,b)=>{const raw=string(a,b).trim();if(!/^[0-7]+$/.test(raw))throw Error('Invalid archive numeric field');return parseInt(raw,8);};
 const expected=number(148,156);let sum=0;for(let i=0;i<512;i++)sum+=i>=148&&i<156?32:header[i];if(sum!==expected)throw Error('Invalid archive header checksum');
 const size=number(124,136),type=string(156,157),prefix=string(345,500),name=(prefix?prefix+'/':'')+string(0,100);offset+=512;if(size>tar.length-offset)throw Error('Truncated repository archive');
 if(type==='0'||type===''){const parts=name.split('/');parts.shift();const relative=parts.join('/');files.push({path:relative,size,content:tar.subarray(offset,offset+size)});}
 offset+=Math.ceil(size/512)*512;
 }
 return files;
}
export async function publicRepositoryArchive(repo,fetcher=fetch){
 if(repo.visibility!=='public'||!/^[-a-zA-Z0-9]+\/[-a-zA-Z0-9_.]+$/.test(repo.fullName)||!/^[a-f0-9]{40}$/.test(repo.commit))throw Error('A pinned public repository is required');
 const response=await fetcher('https://codeload.github.com/'+repo.fullName+'/tar.gz/'+repo.commit,{redirect:'error',signal:AbortSignal.timeout(45000),headers:{'User-Agent':'IRIZA-RESCUE-local'}});
 if(!response.ok)throw Error('Public repository archive returned HTTP '+response.status);
 const chunks=[];let bytes=0;for await(const chunk of response.body){bytes+=chunk.length;if(bytes>16*1024*1024)throw Error('Repository archive exceeds 16 MB compressed limit');chunks.push(chunk);}
 return readTarGzip(Buffer.concat(chunks));
}
