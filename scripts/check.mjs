import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);let count=0;
for(const dir of ['src','public','scripts','tests'])for(const file of await readdir(new URL(dir+'/',root)))if(/\.(?:mjs|js)$/.test(file)){const result=spawnSync(process.execPath,['--check',fileURLToPath(new URL(dir+'/'+file,root))],{encoding:'utf8'});if(result.status!==0){process.stderr.write(result.stderr);process.exit(1);}count++;}
console.log(`Syntax checks passed for ${count} JavaScript modules.`);
