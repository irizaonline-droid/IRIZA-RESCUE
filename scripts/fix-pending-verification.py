from pathlib import Path
p=Path(__file__).resolve().parents[1]/'src/studio.mjs'
s=p.read_text(encoding='utf-8').replace("TESTING:['READY_TO_REVIEW','BLOCKED','FAILED']", "TESTING:['READY_TO_REVIEW','BLOCKED','FAILED','AWAITING_APPROVAL']")
s=s.replace("transition(p,releaseGate(p).decision==='READY_FOR_REVIEW'?'READY_TO_REVIEW':'BLOCKED');this.record(p,'tests.completed'", "const pending=p.proposal&&p.proposal.revision===p.revision&&p.proposal.buildHash===p.buildHash&&Date.parse(p.proposal.expiresAt)>Date.now()&&!p.observation.healthy;transition(p,pending?'AWAITING_APPROVAL':releaseGate(p).decision==='READY_FOR_REVIEW'?'READY_TO_REVIEW':'BLOCKED');this.record(p,'tests.completed'")
p.write_text(s,encoding='utf-8')
