// QUMZO global leaderboard — Vercel serverless function.
//
// Storage: Upstash Redis (add it from the Vercel dashboard → Storage / Marketplace → Upstash Redis,
// connect it to this project). Vercel then sets the env vars below automatically:
//   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN   (or KV_REST_API_URL + KV_REST_API_TOKEN)
// Optional: LEADERBOARD_SECRET — any long random string used to sign run tokens.
//
// Endpoints (all JSON):
//   GET  /api/scores?limit=10&name=foo   → { ok, top:[{rank,name,score}], me:{rank,score}|null }
//   POST /api/scores {action:"start"}    → { ok, token }         (call when a run starts)
//   POST /api/scores {action:"submit", token, name, score} → { ok, best, rank, improved }
//
// Anti-cheat (basic, no accounts): every submit needs a single-use signed token from "start",
// the score must be possible for the time elapsed since that token, names are validated,
// and each IP is rate limited. It stops casual cheating, not a determined attacker.

const crypto = require("crypto");

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const SECRET = process.env.LEADERBOARD_SECRET || REDIS_TOKEN || "";

const K_BOARD = "qumzo:lb";          // sorted set: member = lowercase name, score = best score
const K_NAMES = "qumzo:names";       // hash: lowercase name → display name
const K_RUN = "qumzo:run:";          // single-use run nonces
const K_RATE = "qumzo:rate:";        // per-IP request counters

const NAME_RE = /^[A-Za-z0-9_.\- ]{2,16}$/;
const MIN_RUN_MS = 2000;             // a run shorter than this can't be submitted
const MAX_RUN_MS = 2 * 60 * 60 * 1000;
const MAX_POINTS_PER_SEC = 150;      // generous ceiling: stars + combo x5 + survival points
const RATE_LIMIT = 40;               // requests per IP per minute

async function redis(commands) {
  const r = await fetch(REDIS_URL + "/pipeline", {
    method: "POST",
    headers: { Authorization: "Bearer " + REDIS_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(commands)
  });
  if (!r.ok) throw new Error("redis " + r.status);
  const out = await r.json();
  return out.map(x => { if (x.error) throw new Error(x.error); return x.result; });
}

const b64 = s => Buffer.from(s).toString("base64url");
const sign = data => crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
function makeToken(nonce, iat) { const body = b64(JSON.stringify({ n: nonce, t: iat })); return body + "." + sign(body); }
function readToken(tok) {
  if (typeof tok !== "string" || tok.length > 300) return null;
  const [body, sig] = tok.split(".");
  if (!body || !sig) return null;
  const good = Buffer.from(sign(body)), got = Buffer.from(sig);
  if (good.length !== got.length || !crypto.timingSafeEqual(good, got)) return null;
  try { const p = JSON.parse(Buffer.from(body, "base64url").toString()); return typeof p.n === "string" && typeof p.t === "number" ? p : null; } catch (e) { return null; }
}

function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}
async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch (e) { return {}; } }
  let raw = "";
  for await (const c of req) { raw += c; if (raw.length > 4096) break; }
  try { return JSON.parse(raw || "{}"); } catch (e) { return {}; }
}
function clientIp(req) {
  const f = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return f || req.socket?.remoteAddress || "unknown";
}
const cleanName = n => String(n ?? "").trim().replace(/\s+/g, " ");

async function top(limit) {
  const flat = (await redis([["ZREVRANGE", K_BOARD, "0", String(limit - 1), "WITHSCORES"]]))[0] || [];
  const ids = [], scores = [];
  for (let i = 0; i < flat.length; i += 2) { ids.push(flat[i]); scores.push(Number(flat[i + 1])); }
  const names = ids.length ? (await redis([["HMGET", K_NAMES, ...ids]]))[0] : [];
  return ids.map((id, i) => ({ rank: i + 1, id, name: names[i] || id, score: scores[i] }));
}
async function standing(id) {
  const [rank, score] = await redis([["ZREVRANK", K_BOARD, id], ["ZSCORE", K_BOARD, id]]);
  return rank === null || rank === undefined ? null : { rank: Number(rank) + 1, score: Number(score) };
}

module.exports = async function handler(req, res) {
  if (!REDIS_URL || !REDIS_TOKEN) return send(res, 503, { ok: false, error: "leaderboard_not_configured" });
  try {
    const ip = clientIp(req);
    const [count] = await redis([["INCR", K_RATE + ip], ["EXPIRE", K_RATE + ip, "60", "NX"]]);
    if (count > RATE_LIMIT) return send(res, 429, { ok: false, error: "too_many_requests" });

    if (req.method === "GET") {
      const url = new URL(req.url, "http://x");
      const limit = Math.max(1, Math.min(50, parseInt(url.searchParams.get("limit"), 10) || 10));
      const name = cleanName(url.searchParams.get("name"));
      const rows = await top(limit);
      const me = NAME_RE.test(name) ? await standing(name.toLowerCase()) : null;
      return send(res, 200, { ok: true, top: rows, me });
    }

    if (req.method !== "POST") { res.setHeader("Allow", "GET, POST"); return send(res, 405, { ok: false, error: "method_not_allowed" }); }
    const body = await readBody(req);

    if (body.action === "start") {
      const nonce = crypto.randomBytes(12).toString("base64url");
      await redis([["SET", K_RUN + nonce, "1", "EX", String(Math.ceil(MAX_RUN_MS / 1000))]]);
      return send(res, 200, { ok: true, token: makeToken(nonce, Date.now()) });
    }

    if (body.action === "submit") {
      const name = cleanName(body.name);
      const score = Number(body.score);
      if (!NAME_RE.test(name)) return send(res, 400, { ok: false, error: "bad_name" });
      if (!Number.isInteger(score) || score < 0) return send(res, 400, { ok: false, error: "bad_score" });
      const tok = readToken(body.token);
      if (!tok) return send(res, 400, { ok: false, error: "bad_token" });
      const elapsed = Date.now() - tok.t;
      if (elapsed < MIN_RUN_MS || elapsed > MAX_RUN_MS) return send(res, 400, { ok: false, error: "bad_timing" });
      if (score > 50 + (elapsed / 1000) * MAX_POINTS_PER_SEC) return send(res, 400, { ok: false, error: "implausible_score" });
      const [used] = await redis([["DEL", K_RUN + tok.n]]); // single use
      if (used !== 1) return send(res, 400, { ok: false, error: "token_used" });

      const id = name.toLowerCase();
      const prev = await standing(id);
      const improved = !prev || score > prev.score;
      if (improved) await redis([["ZADD", K_BOARD, "GT", String(score), id], ["HSET", K_NAMES, id, name]]);
      const now = await standing(id);
      return send(res, 200, { ok: true, improved, best: now ? now.score : score, rank: now ? now.rank : null });
    }

    return send(res, 400, { ok: false, error: "unknown_action" });
  } catch (e) {
    console.error("leaderboard error:", e);
    return send(res, 500, { ok: false, error: "server_error" });
  }
};
