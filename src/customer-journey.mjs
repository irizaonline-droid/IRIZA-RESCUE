/** Assessment only. A connected coding-assistant account is not RESCUE authorization. */
export function repositoryCandidate(raw){
 if(typeof raw!=='string'||raw.length>300)throw Error('Provide a bounded GitHub repository URL');
 let u;try{u=new URL(raw);}catch{throw Error('Invalid repository URL');}
 if(u.protocol!=='https:'||u.hostname!=='github.com'||u.port||u.username||u.password||u.search||u.hash)throw Error('Use an HTTPS github.com repository URL without credentials or parameters');
 const match=u.pathname.match(/^\/([A-Za-z0-9][A-Za-z0-9-]{0,38})\/([A-Za-z0-9_.-]{1,100})\/?$/);
 if(!match||['.','..'].includes(match[2]))throw Error('Use a repository URL with exactly owner/repository');
 const name=match[2].replace(/\.git$/,'');if(!name)throw Error('Repository name is required');
 return {fullName:match[1]+'/'+name,url:'https://github.com/'+match[1]+'/'+name,authorizationVerified:false};
}
export function customerJourneyReadiness({url,metaConfigured=false}={}){
 const candidate=url===undefined?null:repositoryCandidate(url);
 const steps=[
  {id:'repository-authorization',status:'NOT IMPLEMENTED',reason:'Repository metadata and commit import are available separately. Customer checkout/PR authorization through a GitHub App is not implemented. A URL and coding-assistant connector do not authorize source execution.'},
  {id:'isolated-reproduction',status:'NOT VERIFIED',reason:'The optional Vercel Sandbox adapter is implemented. No authorized successful customer runtime has been verified; the connector creation attempt returned 403. Trusted sample workers are not an isolation boundary.'},
  {id:'customer-evidence',status:'NOT IMPLEMENTED',reason:'Pinned public source scans and copied-source checks are available per project. This assessment has not fetched this candidate or verified its failing runtime test.'},
  {id:'live-meta',status:metaConfigured?'PASS':'NOT IMPLEMENTED',reason:metaConfigured?'Server credential is configured; actual inference must be tested separately. Project evidence analysis and selected-file source patch proposals are available; this assessment does not execute inference.':'No Meta credential configured.'},
  {id:'reviewable-source-patch',status:'AVAILABLE',reason:'Selected-file source-copy proposals, exact review and exports are implemented. No patch for this candidate is assessed here.'},
  {id:'explicit-approval',status:'AVAILABLE',reason:'Source-copy approval binds file version, hash, nonce, digest and expiry. No approval is granted by this readiness request.'},
  {id:'independent-customer-tests',status:'NOT IMPLEMENTED',reason:'Python/Node/JSON source parsers and a configured Vercel test-plan adapter are available. Successful customer before/after runtime tests remain unverified.'},
  {id:'prepare-pull-request',status:'NOT IMPLEMENTED',reason:'No commit-pinned patch application, branch creation or draft PR preparation service exists.'}
 ];
 return {schema:'iriza-rescue/customer-journey-readiness/1',candidate,ready:false,steps,blockers:steps.filter(s=>!['PASS'].includes(s.status)).map(s=>s.id),fixtureOnly:false,actionsExecuted:0,repositoryFetched:false,mergeAllowed:false,deploymentAllowed:false};
}
