#!/usr/bin/env python3
from __future__ import annotations
"""CF Pages chunked-upload deployer for readinglist.school.

WHY: readinglist out/ is ~962MB / 11,981 files. `wrangler pages deploy` closes
the upload socket at a hard ~56MB PER CONNECTION (log-verified EPIPE), and Next's
build-ID churn makes ~all HTML re-upload each build → the changed payload is
hundreds of MB → wrangler deterministically EPIPEs. RSC-pruning is not enough
here (still way over 56MB). This script uploads in 8-file/1MB batches (each a
fresh connection, far under the cap) and then creates the deployment.

AUTH (verified 2026-06-20): create-deployment requires an Account·Cloudflare
Pages·Edit API token. The asset-upload JWT alone returns error 9106 on
create-deployment, and the wrangler OAuth token is NOT accepted as a raw API
Bearer, and the session $CLOUDFLARE_API_TOKEN has no Pages scope. So a Pages:Edit
token is mandatory and is read from (in order):
    $CLOUDFLARE_PAGES_TOKEN   OR   ~/.cf-pages-token   OR   $CLOUDFLARE_API_TOKEN
Create it once: dash.cloudflare.com → My Profile → API Tokens → Create Token →
"Edit Cloudflare Pages" template → Continue → Create →
    echo 'THE_TOKEN' > ~/.cf-pages-token
Then: python3 scripts/cf-pages-chunked-deploy.py   (after `npm run build` + RSC prune)

Run-from-clean wrapper: scripts/deploy-cf-chunked.sh (build + prune + this).
"""
import base64, hashlib, json, mimetypes, os, pathlib, sys, time, uuid, urllib.request, urllib.error

# Asset key (2026-09-24, ported from readstacks a72126a8). wrangler keys assets as
# blake3(base64(content) + extension)[:32], and Cloudflare's check-missing only ever reports
# THOSE keys as already uploaded. The sha256 key this script used was reported "missing" for
# files uploaded hours earlier, so every deploy re-uploaded every file (readstacks: 1,022 s ->
# 552 s after the fix). Uses blake3 when the module is installed (`pip install blake3`);
# otherwise falls back to the old sha256 key, which still deploys correctly, just uncached.
try:
    from blake3 import blake3 as _blake3
except ImportError:
    _blake3 = None

class _AssetKey:
    def __init__(self, content, ext):
        if _blake3 is not None:
            self._h = _blake3(base64.b64encode(content) + ext.encode())
        else:
            self._h = hashlib.sha256(); self._h.update(content); self._h.update(ext.encode())
    def hexdigest(self):
        return self._h.hexdigest()
import re

# Fleet task mtk9rrqrubziml (2026-09-02): this script is also invoked DIRECTLY, bypassing the npm predeploy hook.
# Run the git guard here too (wrong branch / stale checkout => a Pages deploy REPLACES the live site).
import subprocess as _sp, pathlib as _pl, sys as _sys
_g = _pl.Path(__file__).resolve().with_name("predeploy-git-guard.mjs")
if _g.exists() and _sp.run(["node", str(_g)], cwd=str(_g.parent.parent)).returncode != 0:
    _sys.exit("predeploy-git-guard blocked the deploy (see message above); SKIP_GIT_GUARD=1 is the only override")

ACCOUNT = "72bfd26c5f3c935393a25e5c0dea6039"
PROJECT = os.environ.get("CF_PAGES_PROJECT", "secfilingdex")

def _assert_out_belongs_to_project():
    """Refuse to publish one site's build into another site's Pages project.
    Pages replaces the WHOLE directory, so a mismatched deploy swaps a live site
    entirely and reports success (askedwell -> meeplepick, 2026-08-26: meeplepick.com
    served AskedWell's homepage for ~16 minutes). Ported fleet-wide 2026-08-29.
    CF_SKIP_PROJECT_GUARD=1 only for a deliberate cross-deploy."""
    if os.environ.get("CF_SKIP_PROJECT_GUARD") == "1":
        return
    import re as _re
    idx = os.path.join(str(OUT_DIR), "index.html")
    if not os.path.exists(idx):
        return
    head = open(idx, encoding="utf-8", errors="replace").read(20000)
    mm = _re.search(r'<link[^>]+rel="canonical"[^>]+href="https?://([^/"]+)', head)
    host = mm.group(1).lower() if mm else ""
    if not host:
        return
    stem = PROJECT.replace("-com", "").replace("-org", "").replace("-school", "").replace("-", "")
    if stem and stem not in host.replace("-", "").replace(".", ""):
        raise SystemExit(
            "REFUSING TO DEPLOY: out/ canonical host is '" + host + "' but target project is '"
            + PROJECT + "' - that would replace a different live site. Fix CF_PAGES_PROJECT."
        )

# ^ VERIFIED against the CF API 2026-08-28: the account has NO project named
# "color" (8000007 Project not found) — that default was a second copy-fork
# leftover and every chunked deploy from this repo would have failed on it.
# The project serving colorcombinations.org is "secfilingdex"
# (domains: colorcombinations.pages.dev, colorcombinations.org).
BRANCH = os.environ.get("CF_BRANCH", "main")
# ^ env-overridable so a risky change (e.g. a new _worker.js, which takes over
# ALL routing and can 404 the whole site) can be deployed to a PREVIEW branch
# and verified before production. Required by rules/cloudflare-pages-epipe.md.
OUT_DIR = pathlib.Path(os.environ.get("OUT_DIR",
    str(pathlib.Path(__file__).resolve().parent.parent / "out"))).resolve()

def _load_token() -> str:
    # Pages:Edit token. Prefer explicit Pages vars (the session $CLOUDFLARE_API_TOKEN
    # is DNS-scoped and has NO Pages scope). ~/.zshenv ships CF_PAGES_TOKEN (verified
    # Pages:Edit 2026-06-20). Order: explicit Pages env → token file → generic.
    for var in ("CLOUDFLARE_PAGES_TOKEN", "CF_PAGES_TOKEN", "CLOUDFLARE_PAGES_API_TOKEN"):
        t = os.environ.get(var)
        if t and t.strip():
            return t.strip()
    f = pathlib.Path.home() / ".cf-pages-token"
    if f.is_file():
        v = f.read_text().strip()
        if v:
            return v
    return (os.environ.get("CLOUDFLARE_API_TOKEN") or "").strip()

API_TOKEN = _load_token()
MAX_BATCH_FILES = 1000
# CF_BATCH_MB / CF_UPLOAD_TIMEOUT env-overridable (2026-06-28): on a slow/throttled
# upload path a 20MB batch POST hangs past the 60s per-batch timeout and every batch
# fails. PROVEN zero-retry profile on a ~100KB/s throttled uplink (2026-07-14, 14,865
# files / 640 batches / 9.3h / 1 retry): CF_HTTP2=1 CF_BATCH_MB=3 CF_UPLOAD_TIMEOUT=300.
# CRITICAL: CF persists NOTHING from a killed run (no deployment = no cached hashes) —
# the upload must complete in ONE run; never kill/restart to "resume", it restarts from 0.
# Drop to e.g. CF_BATCH_MB=8 + CF_UPLOAD_TIMEOUT=180 (and run in background,
# uncapped) for a large changed payload over a slow link. Defaults preserve prior behaviour.
MAX_BATCH_BYTES = int(os.environ.get("CF_BATCH_MB", "20")) * 1024 * 1024  # 20MB raw (~27MB base64 body) — stays well under
UPLOAD_TIMEOUT = int(os.environ.get("CF_UPLOAD_TIMEOUT", "180"))  # 60 was a foot-gun on throttled links: a 20MB batch can NEVER finish at ~100KB/s, so every batch exhausted 40 attempts and the run died (2026-07-14). Timeout is a ceiling, not a wait — generous is strictly safer.
# the ~56MB/connection cap (each batch is a fresh Connection: close), but drops the
# batch COUNT ~25× (1MB/8-file → ~1600 batches ≈ 23min; 20MB → ~48 batches ≈ 2-4min).
# The per-batch connection/SSL-handshake overhead (~0.85s) dominated total upload time,
# so big batches finish FAST — critical when the env kills long-running deploys mid-upload
# (CF doesn't persist uploaded assets without a created deployment, so a killed run can't
# resume → the whole upload must complete in one shot). 2026-06-21.

if not API_TOKEN:
    print("ERROR: no Pages token. Create 'Edit Cloudflare Pages' token, then:\n"
          "  echo 'THE_TOKEN' > ~/.cf-pages-token", file=sys.stderr)
    sys.exit(2)
if not OUT_DIR.is_dir():
    print(f"ERROR: build dir not found: {OUT_DIR} (run `npm run build` first)", file=sys.stderr)
    sys.exit(2)

def http(url, method="GET", headers=None, data=None, timeout=120):
    # Transport via curl, not urllib: macOS system Python (/usr/bin/python3) ships
    # LibreSSL 2.8.3, which intermittently fails CF's TLS with SSLV3_ALERT_BAD_RECORD_MAC
    # on POST bodies (log-verified 2026-06-21, while curl/OpenSSL on the same host+network
    # succeeds). curl makes this deployer SSL-stack-immune fleet-wide.
    import subprocess, tempfile
    # --http1.1: CF's assets/upload edge over a flaky/proxied path resets HTTP/2 streams,
    # surfacing as SSL_read/bad-record-mac; HTTP/1.1 + curl's own --retry is far more robust.
    # --http1.1 by default (CF's upload edge historically resets HTTP/2 streams on a
    # flaky path). But when egress is throttled, HTTP/2 can be several× faster on the
    # SAME path — CF_HTTP2=1 opts in. Env-gated so default behaviour is unchanged. (2026-07-09)
    proto = "--http2" if os.environ.get("CF_HTTP2") else "--http1.1"
    args = ["curl", "-sS", proto, "--retry", "3", "--retry-all-errors", "--max-time", str(timeout), "-X", method, "-w", "\n%{http_code}", url]
    for k, v in (headers or {}).items():
        args += ["-H", f"{k}: {v}"]
    tmp = None
    if data is not None:
        tmp = tempfile.NamedTemporaryFile(delete=False)
        tmp.write(data); tmp.flush(); tmp.close()
        args += ["--data-binary", f"@{tmp.name}"]
    try:
        p = subprocess.run(args, capture_output=True, timeout=timeout + 15)
    finally:
        if tmp is not None:
            try: os.unlink(tmp.name)
            except OSError: pass
    if p.returncode != 0:
        raise RuntimeError(f"curl {p.returncode} on {url}: {p.stderr.decode('utf-8','replace')[:200]}")
    raw = p.stdout; nl = raw.rfind(b"\n")
    body, code = (raw[:nl], raw[nl + 1:].decode().strip()) if nl >= 0 else (raw, "")
    if code and not code.startswith("2"):
        raise RuntimeError(f"HTTP {code} on {url}: {body.decode('utf-8','replace')[:300]}")
    return json.loads(body) if body else {"success": True}

def get_jwt():
    r = http(f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT}/pages/projects/{PROJECT}/upload-token",
             headers={"Authorization": f"Bearer {API_TOKEN}"})
    if not r.get("success"):
        raise RuntimeError(f"upload-token fetch failed (is the token Pages:Edit scoped?): {r}")
    return r["result"]["jwt"]

def walk(root):
    out = []
    for p in sorted(root.rglob("*")):
        if not p.is_file(): continue
        rel = "/" + str(p.relative_to(root)).replace(os.sep, "/")
        c = p.read_bytes(); ext = p.suffix.lstrip(".")
        h = _AssetKey(c, ext)
        out.append((rel, c, h.hexdigest()[:32]))
    return out

def check_missing(jwt, hashes):
    miss = []
    for i in range(0, len(hashes), 5000):
        r = http("https://api.cloudflare.com/client/v4/pages/assets/check-missing", method="POST",
                 headers={"Authorization": f"Bearer {jwt}", "Content-Type": "application/json"},
                 data=json.dumps({"hashes": hashes[i:i+5000]}).encode(), timeout=60)
        if not r.get("success"): raise RuntimeError(f"check-missing failed: {r}")
        miss.extend(r.get("result", []))
    return miss

def upsert_hashes(jwt, hashes):
    # Register every asset key with Pages after upload, as wrangler does. Without this,
    # check-missing keeps reporting already-uploaded files as missing, so every deploy
    # re-uploads everything (measured 2026-09-24 on fermentcalc: 3,448 of 3,468 "need
    # upload" on two back-to-back runs of the same build). Best-effort: a failure here only
    # costs cache hits on the NEXT deploy, never this one, so it warns instead of aborting.
    try:
        for i in range(0, len(hashes), 5000):
            r = http("https://api.cloudflare.com/client/v4/pages/assets/upsert-hashes", method="POST",
                     headers={"Authorization": f"Bearer {jwt}", "Content-Type": "application/json"},
                     data=json.dumps({"hashes": hashes[i:i+5000]}).encode(), timeout=60)
            if not r.get("success"): raise RuntimeError(str(r)[:200])
        print(f"[+] registered {len(hashes)} asset keys (upsert-hashes)")
    except Exception as e:
        sys.stderr.write(f"  ⚠ upsert-hashes failed (next deploy re-uploads): {str(e)[:160]}\n")

def upload(jwt, batch, attempts=40):
    # Returns the (possibly refreshed) jwt — a batch that stalls in retries
    # through a slow window can cross the token's 30-min TTL MID-batch, and
    # the caller's proactive between-batch refresh never gets a chance. On an
    # auth failure (403 / "Expired JWT") we mint a fresh token and keep going.
    body = json.dumps(batch).encode(); last = None
    for a in range(1, attempts+1):
        try:
            r = http("https://api.cloudflare.com/client/v4/pages/assets/upload", method="POST",
                     headers={"Authorization": f"Bearer {jwt}", "Content-Type": "application/json", "Connection": "close"},
                     data=body, timeout=UPLOAD_TIMEOUT)
            if not r.get("success"): raise RuntimeError(f"upload failed: {r}")
            return jwt
        except Exception as e:
            last = e; s = min(30, 2**(a-1))
            if "Expired JWT" in str(e) or "HTTP 403" in str(e):
                try:
                    jwt = get_jwt()
                    sys.stderr.write("  ↻ upload JWT expired mid-batch — refreshed\n")
                except Exception as je:
                    sys.stderr.write(f"  ⚠ JWT refresh failed: {str(je)[:80]}\n")
            sys.stderr.write(f"  ⚠ batch {a}/{attempts}: {str(e)[:110]} — retry {s}s\n"); sys.stderr.flush()
            time.sleep(s)
    raise RuntimeError(f"batch failed after {attempts}: {last}")

# CF Pages treats these four as CONFIGURATION, not static assets. They must be
# posted as their own multipart FILE parts on create-deployment; anything left in
# the asset manifest is stored as an inert file and never executed. Shipping
# _worker.js only in the manifest is what silently killed meeplepick's affiliate
# gate on 2026-08-26: every /go/ link 404'd because the worker was uploaded as a
# static asset and Pages never entered advanced mode. Keep this list in sync with
# wrangler's own special-file handling.
# 2026-08-26: the "read fine from the asset manifest" claim above was never
# actually verified and was WRONG. Live-tested on 2 sites (zipradar +
# readinglist), and re-confirmed 2026-08-29 on sourcescore.org via a real
# deploy through this exact fix (redirects fired correctly post-deploy): a
# manifest-only _redirects is fetchable at its own URL (200, correct
# content) but its RULES never fire -- every path that should 301 instead
# 404s, on every deployment, indefinitely. Same root cause as the
# _worker.js incident above: CF Pages only compiles _redirects into routing
# config when it arrives as its own multipart field. _headers is untested
# here but almost certainly the same failure shape -- added defensively.
# Propagated from zipradar-org (2026-08-29, task mtdiyyenkatwon) after a
# fleet sweep found this site ships 9 real rules in public/_redirects
# (incl. /sitemap.xml and the 2026-08-26 color-of-the-year cluster) that
# the stale list would silently kill on the next deploy.
SPECIAL_FILES = ("_worker.js", "_routes.json", "_redirects", "_headers")

def create_deployment(manifest, specials=None):
    b = f"----cf{uuid.uuid4().hex}"; parts = []
    def fld(n, v):
        parts.append(f"--{b}\r\nContent-Disposition: form-data; name=\"{n}\"\r\n\r\n{v}\r\n".encode())
    def filefld(n, content, ctype):
        parts.append(
            f"--{b}\r\nContent-Disposition: form-data; name=\"{n}\"; filename=\"{n}\"\r\n"
            f"Content-Type: {ctype}\r\n\r\n".encode() + content + b"\r\n")
    fld("manifest", json.dumps(manifest)); fld("branch", BRANCH)
    for name, content in (specials or {}).items():
        ctype = "application/javascript" if name.endswith(".js") else (
            "application/json" if name.endswith(".json") else "text/plain")
        filefld(name, content, ctype)
    parts.append(f"--{b}--\r\n".encode())
    return http(f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT}/pages/projects/{PROJECT}/deployments",
                method="POST", data=b"".join(parts),
                headers={"Authorization": f"Bearer {API_TOKEN}", "Content-Type": f"multipart/form-data; boundary={b}"},
                timeout=180)

def mime(p):
    m, _ = mimetypes.guess_type(p); return m or "application/octet-stream"

def assert_build_is_complete():
    """Refuse to deploy a TRUNCATED build.

    A Cloudflare Pages deploy REPLACES the directory, so shipping a partial out/
    does not merge — it takes the live site down to whatever fragment you uploaded.
    On 2026-08-29 zipradar produced three builds that died mid-static-export and
    left exactly that: ~4,100 of 6,203 pages, no out/index.html, four route
    families empty, and NO error anywhere (Next buffers, so the log was 0 bytes).

    Two conditions, both self-contained — no network, no memory of the previous
    deploy. The sitemap is written by prebuild (complete) while pages are written
    by the export (partial when it dies), so a truncation fails condition 2 at once.

    ALLOW_PARTIAL_DEPLOY=1 overrides, for a deliberately-built subset.
    """
    if os.environ.get("ALLOW_PARTIAL_DEPLOY") == "1":
        print("[!] ALLOW_PARTIAL_DEPLOY=1 — skipping build-completeness check")
        return
    root_index = OUT_DIR / "index.html"
    if not root_index.exists():
        sys.exit(f"[x] REFUSING TO DEPLOY: {root_index} is missing — the build is "
                 f"truncated. A CF Pages deploy REPLACES the site.")
    # Resolve the sitemap the way the SITE emits it, not the way we assume.
    # Astro's @astrojs/sitemap writes sitemap-index.xml + sitemap-0.xml and NO
    # file called sitemap.xml, so the original single-filename lookup took the
    # `return` below on every Astro site — meaning condition 2, the one that
    # actually catches a truncated export, never ran. Seen live in this site's
    # own 2026-08-29 deploy log ("[!] no out/sitemap.xml — skipping per-URL
    # completeness check") on the very next deploy after the guard shipped.
    #
    # Follow the INDEX rather than globbing sitemap-*.xml. A glob also matches
    # sitemap-ai.xml, which is a separate AI-crawler sitemap with a different
    # URL set — it inflated this site 1469 -> 2206 when first written that way.
    # The index names exactly the page-sitemap parts and nothing else.
    def _page_sitemaps():
        direct = OUT_DIR / "sitemap.xml"
        if direct.exists():
            return [direct]
        index = OUT_DIR / "sitemap-index.xml"
        if index.exists():
            parts = re.findall(r"<loc>([^<]+)</loc>",
                               index.read_text(encoding="utf-8", errors="ignore"))
            files = [OUT_DIR / re.sub(r"^https?://[^/]+/", "", u) for u in parts]
            return [f for f in files if f.exists()]
        return []

    sitemap_files = _page_sitemaps()
    if not sitemap_files:
        print("[!] no sitemap in out/ (tried sitemap.xml, then sitemap-index.xml) "
              "— skipping per-URL completeness check")
        return
    locs = []
    for sm in sitemap_files:
        locs += re.findall(r"<loc>([^<]+)</loc>",
                           sm.read_text(encoding="utf-8", errors="ignore"))
    print(f"[+] completeness source: {', '.join(f.name for f in sitemap_files)} "
          f"({len(locs)} urls)")
    missing = []
    for loc in locs:
        rel = re.sub(r"^https?://[^/]+", "", loc).strip("/")
        if not (OUT_DIR / (rel + "/index.html" if rel else "index.html")).exists():
            missing.append(loc)
            if len(missing) > 25:
                break
    if missing:
        sys.exit(f"[x] REFUSING TO DEPLOY: {len(missing)}+ of {len(locs)} sitemap URLs "
                 f"have no built page — the export did not finish. First few:\n    "
                 + "\n    ".join(missing[:5]))
    print(f"[+] build completeness OK · homepage present · {len(locs)} sitemap URLs all have pages")


def main():
    _assert_out_belongs_to_project()
    assert_build_is_complete()
    t0 = time.time()

    # HARD GUARD (2026-08-28, re-landed correctly) — this repo's outage class is
    # "the worker didn't ship": /go/* 404'd in production because a chunked
    # deploy shipped static assets without the Function (see
    # rules/cloudflare-pages-epipe.md). scripts/make-worker.mjs emits
    # dist/_worker.js; if functions/ exists but the worker is absent, deploying
    # would reproduce the outage silently, with exit 0. So refuse.
    # NOTE: the first landing of this guard (c9f9565) was inserted at column 0
    # inside this function, which turned the whole deploy body into the dead
    # branch of this if — every deploy exited 0 having done NOTHING. Same
    # failure smell it was written to prevent: exit 0 that didn't do the job.
    # Verify placement by RUNNING the script, not just parsing it.
    repo = pathlib.Path(__file__).resolve().parent.parent
    if (repo / "functions").is_dir() and not (OUT_DIR / "_worker.js").is_file():
        if os.environ.get("SKIP_WORKER_CHECK") != "1":
            print("[!] ABORT: functions/ exists but dist/_worker.js is MISSING.")
            print("    A chunked (direct-upload) deploy CANNOT compile Pages Functions -")
            print("    deploying now would 404 every /go/* buy link and /api/subscribe.")
            print("    Fix: node scripts/make-worker.mjs   (or npm run build, which runs it)")
            print("    Deliberate worker-less deploy: SKIP_WORKER_CHECK=1")
            sys.exit(1)

    print(f"[+] chunked deploy · project={PROJECT} · out={OUT_DIR}")
    entries = walk(OUT_DIR)
    # Pull the configuration files out of the asset set — they ship as multipart
    # fields below, and leaving them in the manifest is what breaks the worker.
    specials = {}
    kept = []
    for rel, c, sha in entries:
        if rel.lstrip("/") in SPECIAL_FILES:
            specials[rel.lstrip("/")] = c
        else:
            kept.append((rel, c, sha))
    entries = kept
    print(f"[+] {len(entries)} files" + (f" + specials: {sorted(specials)}" if specials else " (no _worker.js/_routes.json)"))
    # Fail-fast BEFORE the (expensive, ~14min) upload: create_deployment rejects a
    # manifest >20,000 files (HTTP 400), so uploading first just wastes the upload.
    # The RSC soft-nav .txt prune (scripts/deploy-cf-chunked.sh) gets us under the cap.
    if len(entries) > 20000:
        print(f"ERROR: {len(entries)} files exceeds CF Pages' 20,000/deployment cap.\n"
              f"  Prune first — deploy via `bash scripts/deploy-cf-chunked.sh` (it strips\n"
              f"  the RSC soft-nav .txt payloads), or run that prune before this script.",
              file=sys.stderr)
        sys.exit(2)
    manifest = {rel: sha for rel, _, sha in entries}
    idx = {}
    for rel, c, sha in entries: idx.setdefault(sha, (c, rel))
    uniq = list(idx.keys())
    jwt = get_jwt(); jwt_at = time.time()
    miss = check_missing(jwt, uniq)
    print(f"[+] {len(miss)} need upload ({len(uniq)-len(miss)} cached)")
    if miss:
        miss.sort(key=lambda h: len(idx[h][0]))
        batch, nb, up, by = [], 0, 0, 0
        for h in miss:
            c, path = idx[h]
            if batch and (len(batch) >= MAX_BATCH_FILES or by + len(c) > MAX_BATCH_BYTES):
                if time.time() - jwt_at > 1500: jwt = get_jwt(); jwt_at = time.time()  # refresh < 30min
                jwt = upload(jwt, batch); nb += 1; up += len(batch); batch, by = [], 0
                if nb % 25 == 0: print(f"[+] {up}/{len(miss)} · {nb} batches · {int(time.time()-t0)}s")
            batch.append({"key": h, "value": base64.b64encode(c).decode("ascii"),
                          "metadata": {"contentType": mime(path)}, "base64": True}); by += len(c)
        if batch:
            if time.time() - jwt_at > 1500: jwt = get_jwt()
            jwt = upload(jwt, batch); nb += 1; up += len(batch)
        print(f"[+] uploaded {up} files in {nb} batches · {int(time.time()-t0)}s")
    upsert_hashes(jwt, uniq)
    print("[+] creating deployment…")
    r = create_deployment(manifest, specials)
    if not r.get("success"):
        print(f"ERROR: create-deployment failed: {r}", file=sys.stderr); sys.exit(1)
    res = r["result"]
    print(f"[✓] DEPLOYED · id={res.get('id')} · {res.get('url')} · {int(time.time()-t0)}s")

if __name__ == "__main__":
    main()
