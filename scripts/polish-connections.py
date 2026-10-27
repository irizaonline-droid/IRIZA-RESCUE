from pathlib import Path
p=Path(__file__).resolve().parents[1]/'src/connections.mjs'
s=p.read_text(encoding='utf-8')
s=s.replace("const candidate=repositoryCandidate(input.url);if(this.list().repositories.length>=20)","const candidate=repositoryCandidate(input.url);const existing=this.list().repositories.find(r=>r.fullName.toLowerCase()===candidate.fullName.toLowerCase());if(!existing&&this.list().repositories.length>=20)")
s=s.replace("const p={id:randomUUID(),fullName:candidate.fullName", "const p={id:existing?.id||randomUUID(),fullName:candidate.fullName")
s=s.replace("INSERT INTO repository_connections VALUES (?,?,?)", "INSERT INTO repository_connections VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload")
p.write_text(s,encoding='utf-8')
