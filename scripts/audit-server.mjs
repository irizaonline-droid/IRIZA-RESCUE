import {createApp} from '../src/server.mjs';
import {fileURLToPath} from 'node:url';
const app=await createApp({port:4311,dataDir:fileURLToPath(new URL('../artifacts/functionality-audit/browser-data/',import.meta.url))});
console.log('Disposable audit instance: http://127.0.0.1:4311 (separate database; fixed trusted samples only)');
for(const sig of ['SIGINT','SIGTERM'])process.once(sig,async()=>{await app.close();process.exit(0);});
