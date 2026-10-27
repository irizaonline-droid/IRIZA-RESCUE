import {createHash} from 'node:crypto';
export const rescueOrigin='https://rescue.iriza.online';
export function authLinks(){const q=new URLSearchParams({callbackUrl:rescueOrigin+'/',authContext:'rescue'});return {signin:'https://iriza.online/sign-in?'+q,register:'https://iriza.online/sign-up?'+q};}
export class SharedAuth{
 constructor({fetcher=fetch,emails=process.env.RESCUE_ALLOWED_EMAILS||''}={}){this.fetcher=fetcher;this.allowed=new Set(emails.split(',').map(v=>v.trim().toLowerCase()).filter(Boolean));this.cache=new Map();}
 get enabled(){return this.allowed.size>0;}
 async session(cookie=''){
  if(!this.enabled)return {enabled:false,authenticated:false,authorized:false,...authLinks()};
  const selected=cookie.split(';').map(v=>v.trim()).filter(v=>/^__Secure-iriza\.session-token(?:\.\d+)?=/.test(v)).join('; ');
  if(!selected||selected.length>16000)return {enabled:true,authenticated:false,authorized:false,...authLinks()};
  const key=createHash('sha256').update(selected).digest('hex'),cached=this.cache.get(key);if(cached&&cached.until>Date.now())return cached.value;
  const r=await this.fetcher('https://iriza.online/api/auth/profile',{headers:{cookie:selected,accept:'application/json'},redirect:'error',signal:AbortSignal.timeout(5000)});
  if(!r.ok)return {enabled:true,authenticated:false,authorized:false,...authLinks()};
  const raw=await r.text();if(raw.length>16384)throw Error('Identity response exceeded limit');const user=JSON.parse(raw).user;
  const authorized=typeof user?.email==='string'&&this.allowed.has(user.email.toLowerCase());
  const value={enabled:true,authenticated:!!user?.id,authorized,user:authorized?{id:String(user.id),name:String(user.name||''),email:user.email}:null,...authLinks()};
  if(this.cache.size>=100)this.cache.clear();this.cache.set(key,{until:Date.now()+30000,value});return value;
 }
}
