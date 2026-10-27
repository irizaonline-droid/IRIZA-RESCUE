import {scenarios} from './lab.mjs';
export function authorize(incident,action,revision) {
  if(!incident || incident.status!=='awaiting_approval') throw Error('Incident is not awaiting approval');
  if(incident.target!=='disposable-local-lab') throw Error('Recovery is restricted to the disposable lab');
  if(incident.revision!==revision) throw Error('Stale evidence: investigate again');
  if(typeof action!=='string' || action!==scenarios[incident.scenario]?.action || action!==incident.proposal?.action) throw Error('Action rejected by deterministic policy');
  return true;
}
export function sanitize(value) {
  if(Array.isArray(value))return value.map(sanitize);
  if(value && typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,/password|secret|token|authorization|api.?key|cookie/i.test(k)?'[REDACTED]':sanitize(v)]));
  if(typeof value==='string') return value.replace(/LLM_\d+_[A-Za-z0-9_-]+/g,'[REDACTED META KEY]').replace(/\bsk-[A-Za-z0-9_-]{16,}/g,'[REDACTED API KEY]').replace(/Bearer\s+\S+/gi,'Bearer [REDACTED]').replace(/((?:password|secret|token|api[_-]?key)\s*[=:]\s*)[^\s,;]+/gi,'$1[REDACTED]');
  return value;
}
