import {DatabaseSync} from 'node:sqlite';
import {createHash,randomUUID} from 'node:crypto';
export class Store {
  constructor(file){this.db=new DatabaseSync(file);this.db.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS incidents (id TEXT PRIMARY KEY, payload TEXT NOT NULL); CREATE TABLE IF NOT EXISTS audit (seq INTEGER PRIMARY KEY, payload TEXT NOT NULL, previous TEXT NOT NULL, hash TEXT NOT NULL);');}
  all(){return this.db.prepare('SELECT payload FROM incidents ORDER BY rowid DESC').all().map(x=>JSON.parse(x.payload));}
  get(id){const row=this.db.prepare('SELECT payload FROM incidents WHERE id=?').get(id);return row?JSON.parse(row.payload):null;}
  save(i){this.db.prepare('INSERT INTO incidents VALUES (?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload').run(i.id,JSON.stringify(i));return i;}
  event(type,data){const previous=this.db.prepare('SELECT hash FROM audit ORDER BY seq DESC LIMIT 1').get()?.hash||'GENESIS';const payload=JSON.stringify({id:randomUUID(),at:new Date().toISOString(),type,data});const hash=createHash('sha256').update(previous+payload).digest('hex');this.db.prepare('INSERT INTO audit(payload,previous,hash) VALUES (?,?,?)').run(payload,previous,hash);return hash;}
  audit(){return this.db.prepare('SELECT * FROM audit ORDER BY seq').all().map(x=>({...x,event:JSON.parse(x.payload)}));}
  verify(){let previous='GENESIS';for(const row of this.db.prepare('SELECT * FROM audit ORDER BY seq').all()){if(row.previous!==previous||row.hash!==createHash('sha256').update(previous+row.payload).digest('hex'))return false;previous=row.hash;}return true;}
  close(){this.db.close();}
}
