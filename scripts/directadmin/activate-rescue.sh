#!/bin/sh
set -eu
umask 077
BASE='/home/mrcreati/domains/rescue.iriza.online'
RID="${1:?Provide the staged release ID}"
case "$RID" in *[!0-9TZ]*|'') echo "Invalid release ID" >&2; exit 2;; esac
RELEASE="$BASE/releases/$RID"
NODE='/opt/alt/alt-nodejs24/root/usr/bin/node'
export PATH="/opt/alt/alt-nodejs24/root/usr/bin:$PATH"
export UV_THREADPOOL_SIZE=1 MALLOC_ARENA_MAX=2
export NODE_OPTIONS="--v8-pool-size=1 --max-old-space-size=256"
PREVIOUS="$(readlink -f "$BASE/current" 2>/dev/null || true)"
SUCCESS=0
rollback(){
 rc=$?
 if [ "$SUCCESS" -ne 1 ]; then
  if [ -f "$BASE/data/config/production.env.before-$RID" ]; then cp -p "$BASE/data/config/production.env.before-$RID" "$BASE/data/config/production.env"; fi
  if [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS" ]; then ln -sfn "$PREVIOUS" "$BASE/current"; /bin/sh "$BASE/bin/rescue-supervisor.sh" || true; fi
  printf '__RESCUE_ACTIVATION_FAILED__=%s\n' "$rc"
 fi
 exit "$rc"
}
trap rollback EXIT
mkdir -p "$RELEASE"
tar -xzf "$BASE/releases/rescue-$RID.tar.gz" -C "$RELEASE"
cd "$RELEASE"
"$NODE" --version
if [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS/node_modules" ] && cmp -s "$PREVIOUS/package-lock.json" "$RELEASE/package-lock.json"; then
 ln -s "$PREVIOUS/node_modules" "$RELEASE/node_modules"
else
 npm ci --omit=dev --ignore-scripts --no-audit --no-fund
fi
for f in src/*.mjs public/*.js; do "$NODE" --check "$f"; done
if [ -f "$BASE/data/config/production.env" ]; then cp -p "$BASE/data/config/production.env" "$BASE/data/config/production.env.before-$RID"; fi
mv "$BASE/data/config/production.env.incoming" "$BASE/data/config/production.env"
chmod 600 "$BASE/data/config/production.env"
ln -sfn "$RELEASE" "$BASE/current"
cat > "$BASE/bin/rescue-supervisor.sh" <<'SUPERVISOR'
#!/bin/sh
set -eu
umask 077
BASE='/home/mrcreati/domains/rescue.iriza.online'
NODE='/opt/alt/alt-nodejs24/root/usr/bin/node'
exec 9>"$BASE/data/run/supervisor.lock"
/usr/bin/flock -n 9 || exit 0
pid="$(cat "$BASE/data/run/server.pid" 2>/dev/null || true)"
if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
 expected="$(readlink -f "$BASE/current")"
 cwd="$(readlink -f "/proc/$pid/cwd" 2>/dev/null || true)"
 if [ "$cwd" = "$expected" ] && curl -fsS --max-time 5 http://127.0.0.1:18106/healthz >/dev/null; then exit 0; fi
 case "$cwd" in "$BASE"/releases/*) kill "$pid"; tries=0; while kill -0 "$pid" 2>/dev/null && [ "$tries" -lt 15 ]; do tries=$((tries+1)); sleep 1; done; if kill -0 "$pid" 2>/dev/null; then echo "Old RESCUE process is still stopping"; exit 1; fi;; *) echo 'Refusing to replace unknown process'; exit 1;; esac
fi
cd "$BASE/current"
export UV_THREADPOOL_SIZE=1 MALLOC_ARENA_MAX=2
nohup /usr/bin/setsid "$NODE" --max-old-space-size=384 --v8-pool-size=1 --env-file="$BASE/data/config/production.env" src/server.mjs >>"$BASE/data/logs/runtime.log" 2>&1 </dev/null 9>&- &
echo $! > "$BASE/data/run/server.pid"
SUPERVISOR
chmod 700 "$BASE/bin/rescue-supervisor.sh"
/bin/sh "$BASE/bin/rescue-supervisor.sh"
attempt=0
until curl -fsS --max-time 3 http://127.0.0.1:18106/healthz >"$BASE/data/run/health.json" && grep -Fq "\"release\":\"$RID\"" "$BASE/data/run/health.json"; do
 attempt=$((attempt+1)); [ "$attempt" -lt 20 ] || exit 1
 # A scheduled supervisor may hold the lock briefly. Retry this release rather
 # than treating the previous listener's HTTP 200 as a successful activation.
 /bin/sh "$BASE/bin/rescue-supervisor.sh"
 sleep 2
done
"$NODE" --env-file="$BASE/data/config/production.env" --input-type=module -e "const r=await fetch('http://127.0.0.1:18106/api/v1/projects');if(r.status!==401)process.exit(1);const a=await fetch('http://127.0.0.1:18106/api/v1/projects',{headers:{Authorization:'Bearer '+process.env.RESCUE_API_TOKEN}});if(a.status!==200)process.exit(2);const h=await (await fetch('http://127.0.0.1:18106/healthz')).json();if(h.release!==process.env.RESCUE_RELEASE)process.exit(3);console.log('AUTH_AND_RELEASE_GATES_PASS');"
cat > "$BASE/application/passenger.cjs" <<'PROXY'
const http=require('node:http');
http.createServer((req,res)=>{const upstream=http.request({hostname:'127.0.0.1',port:18106,path:req.url,method:req.method,headers:{...req.headers,host:'rescue.iriza.online'}},response=>{res.writeHead(response.statusCode,response.headers);response.pipe(res);});upstream.setTimeout(240000,()=>upstream.destroy());upstream.on('error',()=>{if(!res.headersSent)res.writeHead(503,{'content-type':'application/json'});res.end(JSON.stringify({error:'RESCUE is starting; retry shortly'}));});req.pipe(upstream);}).listen(process.env.PORT||3000);
PROXY
chmod 600 "$BASE/application/passenger.cjs"
if [ -f "$BASE/public_html/.htaccess" ]; then cp -p "$BASE/public_html/.htaccess" "$BASE/data/config/htaccess.before-$RID"; fi
cat > "$BASE/public_html/.htaccess" <<'HTACCESS'
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteCond %{HTTP:X-Forwarded-Proto} !https [NC]
RewriteRule ^ https://rescue.iriza.online%{REQUEST_URI} [R=308,L]
PassengerEnabled on
PassengerAppRoot /home/mrcreati/domains/rescue.iriza.online/application
PassengerBaseURI /
PassengerAppType node
PassengerStartupFile passenger.cjs
PassengerNodejs /opt/alt/alt-nodejs24/root/usr/bin/node
HTACCESS
chmod 644 "$BASE/public_html/.htaccess"
if [ -f "$BASE/public_html/index.html" ] && grep -q "Something amazing will be constructed here" "$BASE/public_html/index.html"; then mv "$BASE/public_html/index.html" "$BASE/data/config/directadmin-default-index-$RID.html"; fi
mkdir -p "$BASE/application/tmp"
touch "$BASE/application/tmp/restart.txt"
(crontab -l 2>/dev/null || true) > "$BASE/data/config/crontab.before-$RID"
{ (crontab -l 2>/dev/null || true) | sed '\|domains/rescue.iriza.online/bin/rescue-supervisor.sh|d'; printf '* * * * * /bin/sh /home/mrcreati/domains/rescue.iriza.online/bin/rescue-supervisor.sh >> /home/mrcreati/domains/rescue.iriza.online/data/logs/supervisor.log 2>&1\n'; } > "$BASE/data/run/crontab.new"
crontab "$BASE/data/run/crontab.new"
SUCCESS=1
printf '__RESCUE_RELEASE_OK__=%s\n' "$RID"
cat "$BASE/data/run/health.json"
