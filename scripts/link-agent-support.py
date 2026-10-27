from pathlib import Path
r=Path(__file__).resolve().parents[1]
p=r/'src/server.mjs';s=p.read_text(encoding='utf-8')
s=s.replace("}const answer=await supportAnswer(body.message,context,", "}if(body.agentId){const a=connections.list().agents.find(a=>a.id===body.agentId);if(!a||!a.lastTelemetry)throw Error('Agent telemetry is unavailable');context={name:a.name,state:a.revoked?'REVOKED_AGENT_TELEMETRY':'SELF_REPORTED_AGENT_TELEMETRY',observation:{...a.lastTelemetry,healthy:a.lastTelemetry.status==='healthy',source:'self-reported-agent; not independent verification'},logs:a.lastTelemetry.logs,gate:null};}const answer=await supportAnswer(body.message,context,")
p.write_text(s,encoding='utf-8')
p=r/'public/workspace.js';s=p.read_text(encoding='utf-8').replace("kind==='asset'?{assetId:target}:{}", "kind==='asset'?{assetId:target}:kind==='agent'?{agentId:target}:{}")
p.write_text(s,encoding='utf-8')
