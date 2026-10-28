import {Worker} from 'node:worker_threads';
let active=0;
export async function analyzeSource(files){
 if(active>=1)throw Error('Source analysis capacity is busy. Retry after the current index completes.');active++;
 try{return await new Promise((resolve,reject)=>{const worker=new Worker(new URL('./source-analysis-worker.mjs',import.meta.url),{workerData:files,env:{},execArgv:[],resourceLimits:{maxOldGenerationSizeMb:192,stackSizeMb:4}});let done=false;const finish=(error,index)=>{if(done)return;done=true;clearTimeout(timer);worker.terminate().finally(()=>error?reject(error):resolve(index));};const timer=setTimeout(()=>finish(Error('Source analysis exceeded its 12-second budget; no complete index claimed')),12000);worker.on('message',value=>finish(value.error?Error(value.error):null,value.index));worker.on('error',error=>finish(error));worker.on('exit',code=>{if(!done)finish(Error('Source analysis worker stopped before returning an index ('+code+')'));});});}finally{active--;}
}
