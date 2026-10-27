import test from 'node:test';
import assert from 'node:assert/strict';
import {diagnoseOutage} from '../src/outage-diagnosis.mjs';
const clock=Date.parse('2026-10-27T20:20:00Z');
const p=(status,at='2026-10-27T20:19:00Z')=>({status,healthy:status===200,at});
test('outage assessment distinguishes stale, repeated, recovered and absent evidence without granting authority',()=>{
 assert.equal(diagnoseOutage([],{clock}).state,'NO_EVIDENCE');
 const d=diagnoseOutage([p(502),p(502,'2026-10-27T20:18:00Z')],{clock});assert.equal(d.state,'REPEATED_FAILURE');assert.equal(d.category,'GATEWAY_OR_UPSTREAM_FAILURE');assert.equal(d.repairReady,false);assert.equal(d.releaseReady,false);assert.ok(d.hypotheses[0].includes('logs'));
 assert.equal(diagnoseOutage([p(502,'2026-10-27T19:00:00Z')],{clock}).state,'STALE_EVIDENCE');
 assert.equal(diagnoseOutage([p(502,'2026-10-27T20:18:00Z'),p(200)],{clock}).state,'PUBLICLY_RESPONDING');
 assert.equal(diagnoseOutage([p(0)],{clock}).category,'TRANSPORT_FAILURE');
 assert.equal(diagnoseOutage([{status:200,at:'invalid'}],{clock}).state,'NO_EVIDENCE');
});
