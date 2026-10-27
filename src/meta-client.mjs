const listeners=new Set(),history=[];let requests=0,tokens=0,windowStart=Date.now(),failures=0,openUntil=0,active=0;
export function subscribeMeta(listener){listeners.add(listener);return ()=>listeners.delete(listener);}
export function restoreMetaBudget(events){const recent=events.filter(e=>e.provider==='META'&&Date.parse(e.at)>Date.now()-3600000);requests=recent.reduce((n,e)=>n+Number(e.attempts||1),0);tokens=recent.reduce((n,e)=>n+Number(e.usage?.total_tokens||0),0);windowStart=recent.length?Math.min(...recent.map(e=>Date.parse(e.at))):Date.now();}
export function metaStatus(){return {configured:!!(process.env.MODEL_API_KEY||process.env.META_AI_API),model:process.env.META_MODEL||'muse-spark-1.3',requestsThisHour:requests,tokensThisHour:tokens,maxRequestsPerHour:60,maxTokensPerHour:100000,circuitOpenUntil:openUntil>Date.now()?new Date(openUntil).toISOString():null,recent:history.slice(-10)};}
function record(event){history.push(event);if(history.length>100)history.shift();for(const listener of listeners)try{listener(event);}catch{}}
export async function metaCompletion(body,{apiKey=process.env.MODEL_API_KEY||process.env.META_AI_API,fetcher=fetch,purpose='diagnosis'}={}){
  if(!apiKey)throw Error('Meta API is not configured');const mocked=fetcher!==fetch;
  if(!mocked){if(Date.now()-windowStart>3600000){requests=0;tokens=0;windowStart=Date.now();}if(requests>=60||tokens>=100000)throw Error('Meta hourly request/token budget reached');if(Date.now()<openUntil)throw Error('Meta is temporarily paused after repeated failures; retry after 30 seconds');if(active>=2)throw Error('Meta concurrency limit reached');active++;}
  const started=Date.now();let status=0,payload=null,error=null,attempts=0;
  try{
    for(let attempt=0;attempt<2;attempt++){
      if(!mocked){if(requests>=60)throw Error('Meta hourly request budget reached');requests++;}attempts++;
      const response=await fetcher('https://api.meta.ai/v1/chat/completions',{method:'POST',signal:AbortSignal.timeout(45000),headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.META_MODEL||'muse-spark-1.3',reasoning_effort:'low',max_completion_tokens:4096,...body})});status=response.status;
      let raw='',size=0;const decoder=new TextDecoder();if(!response.body)throw Error('Meta response was empty');for await(const chunk of response.body){size+=chunk.byteLength;if(size>150000)throw Error('Meta response exceeded limit');raw+=decoder.decode(chunk,{stream:true});}raw+=decoder.decode();
      try{payload=JSON.parse(raw);}catch{throw Error(`Meta returned invalid JSON (HTTP ${status})`);}
      if(!response.ok){if(attempt===0&&[429,502,503,504].includes(status)){await new Promise(r=>setTimeout(r,300));continue;}const label={401:'credential rejected',402:'billing or credit access blocked',403:'model permission denied',429:'rate limit reached'}[status]||'provider unavailable';throw Error(`Meta ${label} (HTTP ${status}). No repair was approved.`);}
      if(!mocked){tokens+=Number(payload.usage?.total_tokens||0);failures=0;}return payload;
    }
  }catch(e){error=e.message;if(!mocked&&++failures>=3)openUntil=Date.now()+30000;throw e;}
  finally{if(!mocked)active--;record({at:new Date().toISOString(),purpose,provider:mocked?'MOCK':'META',httpStatus:status,attempts,requestId:payload?.id||null,model:payload?.model||body.model||process.env.META_MODEL||'muse-spark-1.3',usage:payload?.usage||null,durationMs:Date.now()-started,error,charge:null,chargeNote:'Tokens recorded; actual billed charge not supplied by provider.'});}
}
