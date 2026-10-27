export type ReleaseGate = {decision:'READY_FOR_REVIEW'|'BLOCKED'|'NEEDS_REVIEW';buildHash:string;revision:number;verifiedAt:string|null;productionPublished:false};
export type SandboxSummary = {id:string;name:string;state:string;buildHash:string;gate:ReleaseGate};
/** Use an operator token only for mutations. Read-only keys support list/detail/gate/report. */
export class RescueClient {
  constructor(private baseUrl:string,private token:string) {}
  private async request<T>(route:string,body?:unknown):Promise<T>{
    const response=await fetch(this.baseUrl.replace(/\/$/,'')+'/api/v1'+route,{method:body===undefined?'GET':'POST',headers:{Authorization:`Bearer ${this.token}`,...(body===undefined?{}:{'Content-Type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)})});
    const value=await response.json();if(!response.ok)throw new Error(value.error||`HTTP ${response.status}`);return value as T;
  }
  listSandboxes(){return this.request<{projects:SandboxSummary[]}>('/sandboxes');}
  getSandbox(id:string){return this.request<SandboxSummary>('/sandboxes/'+encodeURIComponent(id));}
  releaseGate(id:string){return this.request<ReleaseGate>('/sandboxes/'+encodeURIComponent(id)+'/release-gate');}
  report(id:string){return this.request<Record<string,unknown>>('/sandboxes/'+encodeURIComponent(id)+'/report');}
  createDemo(name:string,ttlMinutes:15|30|60=30){return this.request<SandboxSummary>('/sandboxes',{name,source:'demo',ttlMinutes});}
  runTests(id:string,browser=false){return this.request<SandboxSummary>('/sandboxes/'+encodeURIComponent(id)+'/tests',{browser});}
  stopPreview(id:string){return this.request<SandboxSummary>('/sandboxes/'+encodeURIComponent(id)+'/stop',{});}
  listAssets(){return this.request<{assets:Record<string,unknown>[]}>('/assets');}
  addWebsite(name:string,url:string){return this.request<Record<string,unknown>>('/assets',{name,url});}
  checkWebsite(id:string){return this.request<Record<string,unknown>>('/assets/'+encodeURIComponent(id)+'/probe',{});}
  ownershipChallenge(id:string,method:'dns'|'file'){return this.request<{id:string;token:string;location:string;expiresAt:string}>('/assets/'+encodeURIComponent(id)+'/ownership-challenge',{method});}
  verifyOwnership(id:string,challengeId:string){return this.request<Record<string,unknown>>('/assets/'+encodeURIComponent(id)+'/verify-ownership',{challengeId});}
  monitoring(id:string,enabled:boolean,intervalSeconds:60|300|900=300){return this.request<Record<string,unknown>>('/assets/'+encodeURIComponent(id)+'/monitoring',{enabled,intervalSeconds});}
  listTickets(){return this.request<{tickets:Record<string,unknown>[]}>('/support/tickets');}
  createTicket(title:string,description:string){return this.request<Record<string,unknown>>('/support/tickets',{title,description});}
  modelStatus(){return this.request<Record<string,unknown>>('/meta/status');}
}
