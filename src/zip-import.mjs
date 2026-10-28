import {workspaceLimits} from './workspace-limits.mjs';
import yauzl from 'yauzl';
import {crc32} from 'node:zlib';
import {createHash} from 'node:crypto';

export const ZIP_LIMITS=Object.freeze({compressed:8*1024*1024,expanded:64*1024*1024,source:workspaceLimits().maxSourceBytes,entries:5000,files:5000,file:workspaceLimits().maxFileBytes,ratio:200});
let activeRequests=0;
export function admitZipUpload(res){if(activeRequests>=2)return false;activeRequests++;let released=false;const release=()=>{if(!released){released=true;activeRequests--;}};res.once('finish',release);res.once('close',release);return true;}
export function archivePath(name){
 if(typeof name!=='string'||name.length>220||/[\x00-\x1f<>:"\\|?*]/.test(name)||name.startsWith('/'))return false;
 return name.replace(/\/$/,'').split('/').every(s=>s&&s!=='.'&&s!=='..'&&!/[. ]$/.test(s)&&! /^(?:con|prn|aux|nul|com\d|lpt\d)(?:\.|$)/i.test(s));
}

// Quarantine is memory-only. Nothing is extracted to disk or executed. Only after
// every entry validates may the caller commit selected UTF-8 source to SQLite.
export function inspectZip(buffer,accept){
 if(!Buffer.isBuffer(buffer)||buffer.length<22||buffer.length>ZIP_LIMITS.compressed||buffer.readUInt32LE(0)!==0x04034b50)throw Error('Upload a ZIP between 22 bytes and 8 MB');
 return new Promise((resolve,reject)=>{
  let zip,stream,done=false,entries=0,expanded=0,sourceBytes=0;const files=[],skipped=[],seen=new Set();
  const finish=(error,value)=>{if(done)return;done=true;clearTimeout(timer);stream?.destroy();zip?.close();error?reject(error):resolve(value);};
  const timer=setTimeout(()=>finish(Error('ZIP validation exceeded 15 seconds')),15000);
  yauzl.fromBuffer(buffer,{lazyEntries:true,strictFileNames:true,validateEntrySizes:true},(error,opened)=>{
   if(error)return finish(error);zip=opened;
   if(zip.entryCount>ZIP_LIMITS.entries)return finish(Error('ZIP exceeds 5000 archive entries'));
   zip.on('error',error=>finish(error));
   zip.on('entry',entry=>{(async()=>{
    if(++entries>ZIP_LIMITS.entries)throw Error('ZIP exceeds entry limit');
    const name=entry.fileName;if(!archivePath(name))throw Error('Unsafe archive path');
    const canonical=name.replace(/\/$/,'').toLowerCase();if(seen.has(canonical))throw Error('Duplicate archive path');seen.add(canonical);
    const mode=(entry.externalFileAttributes>>>16)&0xf000;
    if(mode&&mode!==0x8000&&mode!==0x4000)throw Error('ZIP links and special files are forbidden');
    if(entry.generalPurposeBitFlag&1)throw Error('Encrypted ZIP files are unsupported');
    if(![0,8].includes(entry.compressionMethod))throw Error('Unsupported ZIP compression');
    expanded+=entry.uncompressedSize;
    if(expanded>ZIP_LIMITS.expanded||entry.uncompressedSize>Math.max(1048576,entry.compressedSize*ZIP_LIMITS.ratio))throw Error('ZIP expansion budget exceeded');
    if(name.endsWith('/')){zip.readEntry();return;}
    if(!accept(name)||entry.uncompressedSize>ZIP_LIMITS.file){skipped.push({path:name,reason:'Excluded path, unsupported type, or file above configured source-file budget'});zip.readEntry();return;}
    if(files.length>=ZIP_LIMITS.files)throw Error('ZIP exceeds archive entry budget');
    await new Promise((yes,no)=>zip.openReadStream(entry,(error,openedStream)=>{
     if(error)return no(error);stream=openedStream;const chunks=[];let size=0,checksum=0;
     stream.on('error',no);stream.on('data',chunk=>{size+=chunk.length;sourceBytes+=chunk.length;if(size>ZIP_LIMITS.file||sourceBytes>ZIP_LIMITS.source){stream.destroy(Error('ZIP source byte budget exceeded'));return;}checksum=crc32(chunk,checksum);chunks.push(chunk);});
     stream.on('end',()=>{try{if(checksum!==entry.crc32)throw Error('ZIP CRC mismatch');const content=new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(chunks));if(content.includes('\0'))throw Error('Binary source file rejected');files.push({path:name,content});yes();}catch(e){no(e);}});
    }));
    if(!done)zip.readEntry();
   })().catch(error=>finish(error));});
   zip.on('end',()=>{if(!files.length)return finish(Error('ZIP contains no supported source files'));const first=files[0].path.split('/')[0];if(files.every(f=>f.path.startsWith(first+'/'))&&skipped.every(f=>f.path.startsWith(first+'/')))for(const f of files)f.path=f.path.slice(first.length+1);finish(null,{files,skipped,entries,expandedBytes:expanded,sourceBytes,sha256:createHash('sha256').update(buffer).digest('hex'),codeExecuted:false});});
   zip.readEntry();
  });
 });
}
