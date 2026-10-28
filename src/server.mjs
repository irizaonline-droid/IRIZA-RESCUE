import {staticPreview} from './static-preview.mjs';
import {discoverMetaModels,configureProjectModel} from './meta-models.mjs';
import {admitZipUpload} from './zip-import.mjs';
import {engineeringTools,setEngineeringTool,languageCapabilities} from './tool-registry.mjs';
import {EngineeringAgent,ENGINEERING_MODES} from './engineering-agent.mjs';
import {Accounts} from './accounts.mjs';
import {AccountWorkspaces} from './account-workspaces.mjs';
import {requestContext} from './request-context.mjs';
import {SharedAuth,authLinks} from './shared-auth.mjs';
import {ProjectWorkbench} from './project-workbench.mjs';
import http from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {randomBytes,randomUUID,timingSafeEqual} from 'node:crypto';
import {Lab,scenarios} from './lab.mjs';
import {Store} from './store.mjs';
import {Engine} from './engine.mjs';
import {probeConnector} from './connectors.mjs';
import {Studio,digest,releaseGate} from './studio.mjs';
import {guides,referenceDocuments} from './guides.mjs';
import {supportAnswer} from './support.mjs';
import {Platform} from './platform.mjs';
import {customerJourneyReadiness} from './customer-journey.mjs';
import {Connections,websiteInput} from './connections.mjs';
import {DevOps} from './devops.mjs';
import {Scanner} from './scanner.mjs';
import {subscribeMeta,metaStatus,restoreMetaBudget,metaCompletion} from './meta-client.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export async function createApp({port=Number(process.env.PORT||4310),dataDir=process.env.RESCUE_DATA_DIR||path.join(root,'data'),token:givenToken,metaTransport=fetch,metaApiKey=process.env.MODEL_API_KEY||process.env.META_AI_API,accountsEnabled=process.env.RESCUE_AUTH_MODE==='accounts',tenantId=null}={}) {
  const sharedAuth=new SharedAuth();const publicOrigin=process.env.RESCUE_PUBLIC_ORIGIN;if(publicOrigin&&publicOrigin!=='https://rescue.iriza.online')throw Error('RESCUE_PUBLIC_ORIGIN must be https://rescue.iriza.online');if(publicOrigin&&!accountsEnabled&&!tenantId&&!sharedAuth.enabled&&!(process.env.RESCUE_AUTH_MODE==='operator'&&process.env.RESCUE_API_TOKEN?.length>=32))throw Error('Public deployment requires configured identity or explicit operator authentication with a strong server token');
  await mkdir(dataDir,{recursive:true});
  let token=givenToken||process.env.RESCUE_API_TOKEN;
  if(!token){try{token=(await readFile(path.join(dataDir,'operator-token'),'utf8')).trim();}catch{token=randomBytes(32).toString('hex');await writeFile(path.join(dataDir,'operator-token'),token,{mode:0o600});}}
  if(token.length<32)throw Error('RESCUE_API_TOKEN must contain at least 32 characters');
  const lab=new Lab();await lab.start({worker:!accountsEnabled});const store=new Store(path.join(dataDir,'rescue.sqlite'));const engine=new Engine(lab,store);
  const studio=new Studio(store);await studio.init();let supportBusy=false;const supportCalls=[];
  const platform=new Platform(store);await platform.init();if(!tenantId)restoreMetaBudget(store.db.prepare('SELECT payload FROM meta_requests ORDER BY id DESC LIMIT 300').all().map(r=>JSON.parse(r.payload)));const unsubscribeMeta=subscribeMeta(event=>{if((event.accountId||null)===(tenantId||null))store.db.prepare('INSERT INTO meta_requests(payload) VALUES (?)').run(JSON.stringify(event));});
  const connections=new Connections(store,{githubToken:tenantId?'':process.env.RESCUE_GITHUB_TOKEN}),devops=new DevOps(store,studio,platform,connections),scanner=new Scanner(store,platform,connections,studio),workbench=new ProjectWorkbench(store,platform,connections,studio,scanner);const engineering=new EngineeringAgent(workbench,{completion:(body,options)=>metaCompletion(body,{...options,apiKey:metaApiKey,fetcher:metaTransport})});const buckets=new Map();
  const json=(res,status,value)=>{if(status>=400&&value.error)value={...value,code:({400:'INVALID_REQUEST',401:'UNAUTHENTICATED',403:'FORBIDDEN',404:'NOT_FOUND',429:'RATE_LIMITED'})[status]||'REQUEST_FAILED',message:value.error,requestId:randomUUID()};res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(value));};
  const accounts=accountsEnabled?new Accounts(path.join(dataDir,'accounts.sqlite'),{secure:!!publicOrigin}):null;
  const memberWorkspaces=accounts?new AccountWorkspaces(path.join(dataDir,'members'),options=>createApp({...options,metaTransport,metaApiKey})):null;
  const server=http.createServer((req,res)=>requestContext.run({accountId:tenantId},async()=>{
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Frame-Options','DENY');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    const styleNonce=randomBytes(18).toString('base64');res.setHeader('Content-Security-Policy',`default-src 'self'; script-src 'self'; style-src 'self' 'nonce-${styleNonce}'; img-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'`);
    const host=req.headers.host;const expected=`127.0.0.1:${server.address().port}`;
    if(host!==expected && host!==`localhost:${server.address().port}` && !(publicOrigin&&host===new URL(publicOrigin).host))return json(res,403,{error:'Invalid host'});
    const url=new URL(req.url,`http://${host}`);
    if(req.method==='GET'&&url.pathname==='/healthz')return json(res,200,{service:'IRIZA RESCUE',status:'ok',release:process.env.RESCUE_RELEASE||'local',authentication:accounts?'accounts':sharedAuth.enabled?'shared-identity':'operator'});
    if(accounts){
      try{
        if(url.pathname==='/auth/session'&&req.method==='GET'){const user=accounts.session(req.headers.cookie);return json(res,200,{enabled:true,mode:'accounts',authenticated:!!user,authorized:!!user,user,signin:'/signin',register:'/register'});}
        if(['/auth/register','/auth/login','/auth/logout'].includes(url.pathname)&&req.method==='POST'){
          if(![publicOrigin,`http://${host}`].filter(Boolean).includes(req.headers.origin))return json(res,403,{error:'Invalid authentication origin'});
          if(req.headers['content-type']!=='application/json')return json(res,415,{error:'Expected application/json'});
          let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>8192)return json(res,413,{error:'Request too large'});}const input=raw?JSON.parse(raw):{};
          if(url.pathname==='/auth/logout'){res.setHeader('Set-Cookie',accounts.logout(req.headers.cookie));return json(res,200,{redirect:'/onboarding'});}
          const result=await accounts[url.pathname==='/auth/register'?'register':'login'](input,req.socket.remoteAddress||'unknown');res.setHeader('Set-Cookie',result.cookie);return json(res,200,{user:result.user,redirect:'/dashboard'});
        }
        const user=accounts.session(req.headers.cookie);
        if((url.pathname.startsWith('/api/')||url.pathname.startsWith('/preview/'))&&user){if(req.method==='POST'&&![publicOrigin,`http://${host}`].filter(Boolean).includes(req.headers.origin))return json(res,403,{error:'Invalid workspace origin'});const bearer=(req.headers.authorization||'').replace(/^Bearer /,'');if(bearer!==token)return await memberWorkspaces.forward(user,req,res);}
        if(req.method==='GET'&&['/','/dashboard','/onboarding','/signin','/sign-in','/register','/regiter','/sign-up'].includes(url.pathname)){
          if(!user||url.pathname==='/onboarding'){res.writeHead(200,{'Content-Type':'text/html'});res.end(await readFile(path.join(root,'public/account-entry.html')));return;}
          url.pathname='/';
        }
      }catch(error){return json(res,/capacity|busy/.test(error.message)?503:400,{error:error instanceof SyntaxError?'Invalid JSON':error.message});}
    }
    if(req.method==='GET'&&url.pathname==='/auth/session'){try{return json(res,200,await sharedAuth.session(req.headers.cookie));}catch{return json(res,503,{enabled:sharedAuth.enabled,authenticated:false,authorized:false,error:'IRIZA identity service is unavailable',...authLinks()});}}
    if(!accounts&&req.method==='GET'&&['/signin','/sign-in','/register','/regiter','/sign-up'].includes(url.pathname)){if(!sharedAuth.enabled)return json(res,503,{error:'RESCUE account sign-in is not configured. The IRIZA TASTE project remains unchanged.'});const destination=/register|regiter|sign-up/.test(url.pathname)?authLinks().register:authLinks().signin;res.writeHead(302,{Location:destination});res.end();return;}

    try{
      const preview=url.pathname.match(/^\/preview\/([0-9a-f-]{36})\/(health|checkout)?$/);
      if(preview&&req.method==='GET'){
        const result=await studio.preview(preview[1],url.searchParams.get('ticket'),preview[2]?'/'+preview[2]:'/');
        res.setHeader('X-Frame-Options','SAMEORIGIN');res.setHeader('Content-Security-Policy',"default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'self'; base-uri 'none'; form-action 'none'; sandbox allow-same-origin");
        res.writeHead(result.status,{'Content-Type':result.type||'text/plain'});res.end(result.body);return;
      }
      if(url.pathname.startsWith('/api/')){
        const candidate=(req.headers.authorization||'').replace(/^Bearer /,'');
        const actual=Buffer.from(candidate),secret=Buffer.from(token);
        const tokenOperator=actual.length===secret.length&&timingSafeEqual(actual,secret);const identity=sharedAuth.enabled&&!tokenOperator?await sharedAuth.session(req.headers.cookie):null;const operator=tokenOperator||identity?.authorized===true;
        const agent=connections.agentFor(candidate);
        const readKey=operator?null:store.db.prepare('SELECT * FROM developer_keys WHERE hash=? AND revoked=0 AND expires>?').get(digest(candidate),new Date().toISOString());
        if(!operator&&!readKey&&!agent)return json(res,401,{error:'Operator token or valid scoped credential required'});
        if(agent&&!(req.method==='POST'&&url.pathname==='/api/v1/agent-telemetry'))return json(res,403,{error:'Agent credentials can only submit their own telemetry'});
        if(!operator&&!agent&&!(req.method==='GET'&&(/^\/api\/v1\/sandboxes(?:\/[0-9a-f-]{36}(?:\/(?:release-gate|report))?)?$/.test(url.pathname)||url.pathname==='/api/v1/openapi')))return json(res,403,{error:'Read-only key has no permission for this operation'});
        if(req.method==='POST' && req.headers.origin && ![`http://${expected}`,`http://localhost:${server.address().port}`,publicOrigin].filter(Boolean).includes(req.headers.origin))return json(res,403,{error:'Invalid origin'});
        if(req.method==='POST'&&url.pathname==='/api/v1/projects/upload'&&!admitZipUpload(res)){req.resume();return json(res,429,{error:'Archive import capacity is busy. Retry after another upload finishes.'});}
        let body={};
        if(req.method==='POST'){
          if(req.headers['content-type']!=='application/json')return json(res,415,{error:'Expected application/json'});
          let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>(url.pathname==='/api/v1/projects/upload'?11200000:/^\/api\/v1\/projects\/[^/]+\/(?:file|draft)$/.test(url.pathname)?23000000:8192))return json(res,413,{error:'Request too large'});}body=raw?JSON.parse(raw):{};
        }
        if(url.pathname.startsWith('/api/v1/')){
          const route=url.pathname.slice('/api/v1'.length);
          if(route.startsWith('/projects')&&req.method==='POST'){const hits=(buckets.get('project-mutations')||[]).filter(t=>t>Date.now()-60000);if(hits.length>=60)return json(res,429,{error:'Project mutation rate limit reached'});hits.push(Date.now());buckets.set('project-mutations',hits);}
          if(route==='/meta/models'&&req.method==='GET')return json(res,200,await discoverMetaModels({apiKey:metaApiKey,fetcher:metaTransport}));
          if(route==='/meta/models/test'&&req.method==='POST'){const catalogue=await discoverMetaModels({apiKey:metaApiKey,fetcher:metaTransport});if(!catalogue.models.some(m=>m.id===body.model))throw Error('Select a model listed by Meta');const last=buckets.get('model-test')||0;if(Date.now()-last<10000)return json(res,429,{error:'Wait ten seconds between model probes'});buckets.set('model-test',Date.now());const result=await metaCompletion({model:body.model,max_completion_tokens:128,reasoning_effort:'low',messages:[{role:'user',content:'Reply READY only.'}]},{apiKey:metaApiKey,fetcher:metaTransport,purpose:'model-access-test'});return json(res,200,{model:result.model||body.model,requestId:result.id,status:'LIVE_INFERENCE_VERIFIED',usage:result.usage||null});}
          if(route==='/engineering/tools'){if(req.method==='GET')return json(res,200,{tools:engineeringTools(workbench),languages:languageCapabilities});if(req.method==='POST')return json(res,200,{tools:setEngineeringTool(workbench,body),languages:languageCapabilities});}
          const investigation=route.match(/^\/projects\/([^/]+)\/investigations(?:\/([0-9a-f-]{36})(?:\/(cancel))?)?$/);
          if(investigation){const key=decodeURIComponent(investigation[1]),id=investigation[2];if(req.method==='GET')return json(res,200,id?engineering.get(key,id):{modes:ENGINEERING_MODES,jobs:engineering.list(key)});if(req.method==='POST'){if(id&&investigation[3])return json(res,200,engineering.cancel(key,id));if(!id)return json(res,202,engineering.start(key,body));}}
          if(route==='/projects'&&req.method==='GET')return json(res,200,{projects:workbench.list(url.searchParams.get('state')||'active')});
          if(route==='/projects/upload'&&req.method==='POST')return json(res,201,await workbench.upload(body));
          if(route==='/projects/local'&&req.method==='POST')return json(res,201,await workbench.local(body));
          const projectRoute=route.match(/^\/projects\/([^/]+)(?:\/(workspace|file|validate|audit|propose|approve|export|scan|runtime|intelligence|draft|history|receipt|fixture-verify|search|model|prepare|static-preview))?$/);
          if(projectRoute){const key=decodeURIComponent(projectRoute[1]),op=projectRoute[2];if(req.method==='GET'){if(op==='static-preview'){const name=url.searchParams.get('path');if(!name?.endsWith('.html'))throw Error('Select an imported HTML document');const html=staticPreview(workbench.file(key,name).content);res.setHeader('X-Frame-Options','SAMEORIGIN');res.setHeader('Content-Security-Policy',"default-src 'none'; style-src 'unsafe-inline'; script-src 'none'; form-action 'none'; frame-ancestors 'self'; base-uri 'none'; sandbox");res.writeHead(200,{'Content-Type':'text/html'});res.end(html);return;}if(op==='search')return json(res,200,workbench.search(key,url.searchParams.get('q')));if(op==='receipt')return json(res,200,workbench.receipt(key));if(op==='history')return json(res,200,{history:workbench.history(key,url.searchParams.get('path'))});if(op==='intelligence')return json(res,200,await workbench.intelligence(key,url.searchParams.get('q')));if(op==='file')return json(res,200,workbench.file(key,url.searchParams.get('path')));if(op==='export')return json(res,200,workbench.export(key));if(op==='runtime')return json(res,200,workbench.detail(key).runner);if(!op)return json(res,200,workbench.detail(key));}
            if(req.method==='POST'){if(!op)return json(res,200,workbench.update(key,body));if(op==='prepare')return json(res,200,await workbench.prepare(key));if(op==='model')return json(res,200,await configureProjectModel(workbench,key,body,{apiKey:metaApiKey,fetcher:metaTransport}));if(op==='workspace')return json(res,201,await workbench.import(key));if(op==='fixture-verify')return json(res,200,await workbench.verifyFixture(key));if(op==='draft')return json(res,200,workbench.draft(key,body));if(op==='file')return json(res,200,workbench.edit(key,body));if(op==='runtime')return json(res,200,await workbench.runtime(key,body));if(op==='validate')return json(res,200,await workbench.validate(key));if(op==='audit')return json(res,200,await workbench.audit(key));if(op==='propose')return json(res,200,await workbench.propose(key,body));if(op==='approve')return json(res,200,await workbench.approve(key,body));if(op==='scan'){const p=workbench.project(key);workbench.save(key,{...workbench.meta(key),analysis:null});if(p.kind==='github')return json(res,201,await scanner.repository(p.id));if(p.kind==='website')return json(res,200,await platform.check(p.id));return json(res,200,await workbench.validate(key));}}
          }
          if(route==='/scans'&&req.method==='GET')return json(res,200,{reports:scanner.list()});
          const scan=route.match(/^\/scans\/([0-9a-f-]{36})$/);if(scan&&req.method==='GET')return json(res,200,scanner.get(scan[1]));
          if(route==='/devops'&&req.method==='GET')return json(res,200,devops.inspect());
          if(route==='/devops/report'&&req.method==='GET')return json(res,200,devops.report());
          if(route==='/agent-telemetry'&&req.method==='POST'){if(!agent)return json(res,403,{error:'Use the agent-specific credential'});return json(res,200,connections.ingest(agent,body));}
          if(route==='/connections'&&req.method==='GET')return json(res,200,connections.list());
          if(route==='/agent-sdk'&&req.method==='GET'){res.writeHead(200,{'Content-Type':'text/javascript'});res.end(await readFile(path.join(root,'packages/sdk/rescue-agent.mjs')));return;}
          if(route==='/customer-journey/readiness'&&['GET','POST'].includes(req.method))return json(res,200,customerJourneyReadiness({url:body.repositoryUrl,metaConfigured:!!metaApiKey}));
          if(route==='/settings'){
            const defaults={workspaceName:'Winning Team',displayName:'Local operator',theme:'system',language:'en',incidentAlerts:true};
            const saved=store.db.prepare("SELECT value FROM studio_settings WHERE name='ui-preferences'").get();
            if(req.method==='GET')return json(res,200,{...defaults,...(saved?JSON.parse(saved.value):{})});
            if(req.method==='POST'){
              if(!['system','light','dark'].includes(body.theme)||!['en','fr'].includes(body.language)||typeof body.incidentAlerts!=='boolean')throw Error('Invalid preference');
              for(const field of ['workspaceName','displayName'])if(typeof body[field]!=='string'||body[field].trim().length<2||body[field].length>60)throw Error('Profile names must contain 2–60 characters');
              const value={workspaceName:body.workspaceName.trim(),displayName:body.displayName.trim(),theme:body.theme,language:body.language,incidentAlerts:body.incidentAlerts};
              store.db.prepare("INSERT INTO studio_settings(name,value) VALUES ('ui-preferences',?) ON CONFLICT(name) DO UPDATE SET value=excluded.value").run(JSON.stringify(value));store.event('settings.updated',{fields:Object.keys(value)});return json(res,200,value);
            }
          }
          if(req.method==='POST'){const bucketKey=route==='/support'?'support':route.includes('assets')?'assets':'mutations';const cutoff=Date.now()-60000;const hits=(buckets.get(bucketKey)||[]).filter(t=>t>cutoff);if(hits.length>=(bucketKey==='assets'?20:bucketKey==='support'?8:60))return json(res,429,{error:'Local per-minute request limit reached'});hits.push(Date.now());buckets.set(bucketKey,hits);}
          if(route==='/scans'&&req.method==='POST')return json(res,201,await scanner.run(body));
          if(route==='/environments'&&req.method==='POST')return json(res,201,devops.save(body));
          const environment=route.match(/^\/environments\/([0-9a-f-]{36})(?:\/(archive|restore))?$/);if(environment&&req.method==='POST')return json(res,200,environment[2]?devops.archive(environment[1],environment[2]==='archive'):devops.save(body,environment[1]));
          const repositoryScan=route.match(/^\/repositories\/([0-9a-f-]{36})\/scan$/);if(repositoryScan&&req.method==='POST')return json(res,201,await scanner.repository(repositoryScan[1]));
          if(route==='/repositories'&&req.method==='POST')return json(res,201,await connections.connectRepository(body));
          if(route==='/agents'&&req.method==='POST')return json(res,201,connections.createAgent(body));
          const revokeAgent=route.match(/^\/agents\/([0-9a-f-]{36})\/revoke$/);if(revokeAgent&&req.method==='POST')return json(res,200,connections.revoke(revokeAgent[1]));
          if(req.method==='GET'&&route==='/meta/status'){const history=store.db.prepare('SELECT payload FROM meta_requests ORDER BY id DESC LIMIT 30').all().map(r=>JSON.parse(r.payload));const lastLive=history.find(e=>e.provider==='META');return json(res,200,{...metaStatus(),connection:lastLive?(lastLive.httpStatus===200&&!lastLive.error?'LIVE_VERIFIED':'LAST_REQUEST_FAILED'):(metaApiKey?'CONFIGURED_UNVERIFIED':'NOT_CONFIGURED'),lastLiveRequest:lastLive||null,history});}
          if(req.method==='POST'&&route==='/meta/test'){
            const result=await metaCompletion({max_completion_tokens:256,messages:[{role:'user',content:'Reply with the single word ready.'}]},{apiKey:metaApiKey,fetcher:metaTransport,purpose:'connection-test'});
            const reply=result.choices?.[0]?.message?.content;if(typeof reply!=='string'||!reply.trim())throw Error('Meta returned no usable connection-test reply');
            return json(res,200,{connected:true,provider:metaTransport===fetch?'META':'MOCK',model:result.model||process.env.META_MODEL||'muse-spark-1.3',requestId:result.id||null,usage:result.usage||null,reply:reply.slice(0,200),at:new Date().toISOString(),actionsExecuted:0});
          }
          if(route==='/assets'&&req.method==='GET')return json(res,200,{assets:platform.list()});
          if(route==='/assets/archived'&&req.method==='GET')return json(res,200,{assets:platform.archived()});
          const assetEdit=url.pathname.match(/^\/api\/v1\/assets\/([0-9a-f-]{36})\/(rename|archive|restore)$/);
          if(assetEdit&&req.method==='POST'){const [,id,op]=assetEdit;return json(res,200,op==='rename'?platform.rename(id,body):op==='archive'?platform.archive(id):platform.restoreAsset(id));}
          if(route==='/assets'&&req.method==='POST')return json(res,201,await platform.create({...body,url:websiteInput(body.url)}));
          const assetMatch=route.match(/^\/assets\/([0-9a-f-]{36})(?:\/(probe|ownership-challenge|verify-ownership|monitoring|report))?$/);
          if(assetMatch){const [,id,op]=assetMatch;if(req.method==='GET'&&!op)return json(res,200,platform.detail(id));if(req.method==='GET'&&op==='report')return json(res,200,{...platform.detail(id),generatedAt:new Date().toISOString(),repairAuthorized:false});
            if(req.method==='POST'){if(op==='probe')return json(res,200,await platform.check(id));if(op==='ownership-challenge')return json(res,201,platform.challenge(id,body.method));if(op==='verify-ownership')return json(res,200,await platform.verify(id,body.challengeId));if(op==='monitoring')return json(res,200,platform.monitoring(id,body));}
          }
          if(req.method==='GET'&&route==='/support/conversations')return json(res,200,{conversations:platform.conversations()});
          const conversationMatch=route.match(/^\/support\/conversations\/([0-9a-f-]{36})$/);if(req.method==='GET'&&conversationMatch)return json(res,200,platform.conversation(conversationMatch[1]));
          if(route==='/support/tickets'&&req.method==='GET')return json(res,200,{tickets:platform.tickets()});
          if(route==='/support/tickets'&&req.method==='POST')return json(res,201,platform.createTicket(body));
          const ticketMatch=route.match(/^\/support\/tickets\/([0-9a-f-]{36})$/);if(ticketMatch){if(req.method==='GET')return json(res,200,platform.ticket(ticketMatch[1]));if(req.method==='POST')return json(res,200,platform.updateTicket(ticketMatch[1],body));}
          if(req.method==='GET'&&route==='/guides')return json(res,200,{guides});
          if(req.method==='GET'&&route==='/reference')return json(res,200,{documents:referenceDocuments.map(({id,title,type,file})=>({id,title,type,file}))});
          const reference=route.match(/^\/reference\/([a-z-]+)$/);if(req.method==='GET'&&reference){const doc=referenceDocuments.find(d=>d.id===reference[1]);if(!doc)return json(res,404,{error:'Reference not found'});res.writeHead(200,{'Content-Type':doc.type,'Content-Disposition':`attachment; filename="${doc.file}"`});res.end(await readFile(path.join(root,'docs/reference',doc.file)));return;}
          if(req.method==='GET'&&route==='/openapi')return json(res,200,JSON.parse(await readFile(path.join(root,'docs/openapi.json'),'utf8')));
          if(req.method==='GET'&&route==='/sdk'){res.writeHead(200,{'Content-Type':'text/plain'});res.end(await readFile(path.join(root,'packages/sdk/rescue-client.ts'),'utf8'));return;}
          if(req.method==='GET'&&route==='/studio')return json(res,200,{emergencyStop:studio.emergencyStop,activePreviews:studio.runtime.size,maxActive:3,maxProjects:12,domain:'rescue.iriza.online',externalRunner:false,metaConfigured:!!process.env.MODEL_API_KEY,projects:studio.list().map(p=>({...p,gate:releaseGate(p)}))});
          if(req.method==='POST'&&route==='/emergency-stop'){if(typeof body.enabled!=='boolean')throw Error('enabled must be a boolean');studio.setEmergencyStop(body.enabled);return json(res,200,{enabled:studio.emergencyStop});}
          if(req.method==='GET'&&route==='/sandboxes')return json(res,200,{projects:studio.list(readKey?.tenant).map(p=>({id:p.id,name:p.name,state:p.state,createdAt:p.createdAt,buildHash:p.buildHash,gate:releaseGate(p)}))});
          if(req.method==='POST'&&route==='/sandboxes')return json(res,201,await studio.create(body));
          if(route==='/developer-keys'&&req.method==='GET')return json(res,200,{keys:store.db.prepare('SELECT id,expires,revoked FROM developer_keys WHERE tenant=?').all('local-owner')});
          if(route==='/developer-keys'&&req.method==='POST'){
            if(store.db.prepare('SELECT count(*) AS count FROM developer_keys WHERE revoked=0 AND expires>?').get(new Date().toISOString()).count>=10)throw Error('Maximum ten active read-only keys');
            const key='rescue_read_'+randomBytes(32).toString('hex'),id=randomBytes(16).toString('hex'),expires=new Date(Date.now()+86400000).toISOString();store.db.prepare('INSERT INTO developer_keys(id,tenant,hash,expires) VALUES (?,?,?,?)').run(id,'local-owner',digest(key),expires);store.event('developer-key.created',{id,scope:'sandbox:read',expires});return json(res,201,{id,key,expires,scope:'sandbox:read'});
          }
          const keyMatch=route.match(/^\/developer-keys\/([0-9a-f]{32})\/revoke$/);if(req.method==='POST'&&keyMatch){store.db.prepare('UPDATE developer_keys SET revoked=1 WHERE id=? AND tenant=?').run(keyMatch[1],'local-owner');store.event('developer-key.revoked',{id:keyMatch[1]});return json(res,200,{revoked:true});}
          if(req.method==='POST'&&route==='/support'){
            while(supportCalls.length&&supportCalls[0]<Date.now()-60000)supportCalls.shift();if(supportBusy||supportCalls.length>=8)return json(res,429,{error:'Support is busy or the eight-message-per-minute limit was reached'});
            supportBusy=true;supportCalls.push(Date.now());try{const conversation=platform.conversation(body.conversationId);let selectedModel=process.env.META_MODEL||'muse-spark-1.3';let context=body.projectId?studio.detail(body.projectId):null;if(body.workbenchKey){const p=workbench.detail(body.workbenchKey);selectedModel=p.engineeringModel||selectedModel;context={name:p.name,state:p.status,scan:{kind:p.kind,projectNotes:p.notes||'',validation:p.validation||null,audit:p.vulnerabilityAudit||null,sourceRevision:p.sourceRevision||p.source.commit,files:p.files.map(f=>({path:f.path,modified:f.modified})),runtime:{configuration:p.runner,receipt:p.runtimeReceipt||null}},gate:{deployReady:false}};}if(body.assetId){const a=platform.detail(body.assetId);context={name:a.name,state:'PUBLIC_OBSERVATION_ONLY',observation:a.probes[0]||null,gate:null};}if(body.agentId){const a=connections.list().agents.find(a=>a.id===body.agentId);if(!a||!a.lastTelemetry)throw Error('Agent telemetry is unavailable');context={name:a.name,state:a.revoked?'REVOKED_AGENT_TELEMETRY':'SELF_REPORTED_AGENT_TELEMETRY',observation:{...a.lastTelemetry,healthy:a.lastTelemetry.status==='healthy',source:'self-reported-agent; not independent verification'},logs:a.lastTelemetry.logs,gate:null};}if(body.scanId){const r=scanner.get(body.scanId);if(body.workbenchKey&&r.repository&&r.repository.repositoryId!==workbench.project(body.workbenchKey).id)throw Error('Scan does not belong to the selected project');context={name:'Workspace scan '+r.id,state:'BOUNDED_STATIC_SCAN',scan:{at:r.at,coverage:r.coverage.map(c=>({source:c.source,status:c.status,detail:c.detail})),findings:r.findings,inventory:r.local?.inventory,repository:r.repository?{name:r.repository.fullName,commit:r.repository.commit,transport:r.repository.transport,syntax:r.repository.syntax,filesInspected:r.repository.filesInspected,eligibleFiles:r.repository.eligibleFiles,skipped:r.repository.skipped,failed:r.repository.failed,runtimeTests:'NOT_RUN'}:null,limits:r.repository?.limits||r.local?.limits,limitations:r.limitations,actionsExecuted:0},gate:null};}const answer=await supportAnswer(body.message,context,{language:body.language||'en',history:conversation.messages,model:selectedModel});if(body.scanId)scanner.saveAnalysis(body.scanId,answer);if(body.workbenchKey)workbench.save(body.workbenchKey,{...workbench.meta(body.workbenchKey),analysis:{...answer,workspaceRevision:workbench.meta(body.workbenchKey).workspaceRevision||null}});platform.message(conversation.id,'user',{text:body.message});platform.message(conversation.id,'assistant',answer);store.event('support.answered',{provider:answer.provider,requestId:answer.requestId||null,conversationId:conversation.id});return json(res,200,{...answer,conversationId:conversation.id});}finally{supportBusy=false;}
          }
          const sm=route.match(/^\/sandboxes\/([0-9a-f-]{36})(?:\/(tests|inject|diagnose|analyze|approve|reset|rollback|stop|launch|release-gate|report))?$/);
          if(sm){const [,id,operation]=sm;const tenant=readKey?.tenant||'local-owner';const p=studio.get(id,tenant);
            if(req.method==='GET'&&!operation)return json(res,200,operator?studio.detail(id):{id:p.id,name:p.name,state:p.state,gate:releaseGate(p),buildHash:p.buildHash});
            if(req.method==='GET'&&operation==='release-gate')return json(res,200,releaseGate(p));
            if(req.method==='GET'&&operation==='report')return json(res,200,studio.report(id,tenant));
            if(req.method==='POST'){
              const ops={analyze:()=>studio.analyze(id),tests:()=>studio.tests(id,{browser:body.browser===true}),inject:()=>studio.inject(id,body.scenario),diagnose:()=>studio.investigate(id),approve:()=>studio.approve(id,body),reset:()=>studio.reset(id),rollback:()=>studio.restore(id,body.snapshotId),stop:()=>studio.stop(id),launch:()=>studio.launch(id)};
              if(Object.hasOwn(ops,operation))return json(res,200,await ops[operation]());
            }
          }
          return json(res,404,{error:'Studio API route not found'});
        }
        if(req.method==='GET'&&url.pathname==='/api/status')return json(res,200,{service:'IRIZA RESCUE',version:'0.3.0',mode:'local-lab',metaConfigured:!!(process.env.MODEL_API_KEY||process.env.META_AI_API),metaModel:process.env.META_MODEL||'muse-spark-1.3',meta:metaStatus(),lab:engine.latest||await engine.monitor(),busy:engine.busy,scenarios,incidents:store.all(),auditValid:store.verify()});
        if(req.method==='GET'&&url.pathname==='/api/audit')return json(res,200,{valid:store.verify(),events:store.audit()});
        if(req.method==='GET'&&url.pathname==='/api/connectors'){
          const configured=JSON.parse(await readFile(path.join(root,'config/connectors.json'),'utf8'));
          const results=await Promise.all(configured.map(async c=>{try{return await probeConnector(c);}catch(e){return {id:c.id,healthy:false,error:e.message};}}));return json(res,200,{connectors:results});
        }
        if(req.method==='POST'&&url.pathname==='/api/lab/inject'){if(studio.emergencyStop)throw Error('Emergency stop is enabled');return json(res,201,await engine.inject(body.scenario));}
        if(req.method==='POST'&&url.pathname==='/api/probe')return json(res,200,await engine.monitor());
        const match=url.pathname.match(/^\/api\/incidents\/([0-9a-f-]{36})(?:\/(investigate|approve|receipt))?$/);
        if(match){const [,id,operation]=match;
          if(req.method==='POST'&&operation==='investigate')return json(res,200,await engine.investigate(id));
          if(req.method==='POST'&&operation==='approve'){if(studio.emergencyStop)throw Error('Emergency stop is enabled');return json(res,200,await engine.approve(id,body.action));}
          if(req.method==='GET'){const i=store.get(id);if(!i)return json(res,404,{error:'Incident not found'});return json(res,200,operation==='receipt'?i.receipt||{error:'Receipt unavailable'}:i);}
        }
        return json(res,404,{error:'API route not found'});
      }
      if(req.method!=='GET')return json(res,405,{error:'Method not allowed'});
      if(req.method==='GET'&&/^\/monaco\/(?:editor(?:\.worker)?|ts\.worker|json\.worker|css\.worker|html\.worker)\.(?:js|css)$/.test(url.pathname)||req.method==='GET'&&/^\/monaco\/codicon-[A-Z0-9]+\.ttf$/.test(url.pathname)){const asset=await readFile(path.join(root,'public',url.pathname));res.writeHead(200,{'Content-Type':url.pathname.endsWith('.css')?'text/css':url.pathname.endsWith('.ttf')?'font/ttf':'text/javascript'});res.end(asset);return;}
      const files={'/muse-studio.js':['muse-studio.js','text/javascript'],'/engineering-demo.zip':['engineering-demo.zip','application/zip'],'/engineering-studio.js':['engineering-studio.js','text/javascript'],'/account-session.js':['account-session.js','text/javascript'],'/account-client.js':['account-client.js','text/javascript'],'/account.css':['account.css','text/css'],'/editor-bundle.js':['editor-bundle.js','text/javascript'],'/project-hub.js':['project-hub.js','text/javascript'],'/project-hub.css':['project-hub.css','text/css'],'/devops.js':['devops.js','text/javascript'],'/onboarding.js':['onboarding.js','text/javascript'],'/':['index.html','text/html'],'/workspace.js':['workspace.js','text/javascript'],'/app.js':['workspace.js','text/javascript'],'/workspace.css':['workspace.css','text/css'],'/theme-init.js':['theme-init.js','text/javascript'],'/prototype.css':['prototype.css','text/css'],'/logo.png':['logo.png','image/png'],'/mulish.woff2':['mulish.woff2','font/woff2']};
      if(!Object.hasOwn(files,url.pathname))return json(res,404,{error:'Not found'});
      const [file,type]=files[url.pathname];const bytes=await readFile(path.join(root,'public',file));res.writeHead(200,{'Content-Type':type});res.end(type==='text/html'?bytes.toString('utf8').replace('</head>',`<meta name="rescue-style-nonce" content="${styleNonce}"></head>`):bytes);
    }catch(error){json(res,400,{error:error instanceof SyntaxError?'Invalid JSON':error.message});}
  }));
  server.requestTimeout=10000;server.headersTimeout=10000;
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
  if(!accountsEnabled)await engine.monitor();
  let probing=false;const monitor=setInterval(async()=>{if(probing||engine.busy)return;probing=true;try{if(!accountsEnabled)await engine.monitor();await studio.maintenance();await platform.maintenance();}catch{}finally{probing=false;}},5000);monitor.unref();
  return {server,lab,store,engine,studio,platform,token,port:server.address().port,async close(){clearInterval(monitor);await engineering.close();await memberWorkspaces?.close();accounts?.close();unsubscribeMeta();await new Promise(r=>server.close(r));await studio.close();await lab.close();store.close();}};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const app=await createApp();console.log(`IRIZA RESCUE → http://127.0.0.1:${app.port}\n${process.env.RESCUE_AUTH_MODE==='accounts'?'Open onboarding, sign in or register.':'Operator token: read data/operator-token (or your configured RESCUE_API_TOKEN).'}\nAll services are bound to loopback. Ctrl+C stops the lab.`);
  for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await app.close();process.exit(0);});
}




