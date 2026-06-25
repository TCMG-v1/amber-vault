/**
 * spine_append — pplxstudio edge broker for the PROD Pi append path (Door-3).
 *
 * Mirrors the brain broker's posture: a clearly-separate ADDITIVE route, fenced
 * off from Door-1 (brain) and Door-2 (pass-through). The Google service-account
 * secret lives ONLY in the Worker (env), never on a Pi. A prod rig posts a
 * finished 14-cell row + a per-rig bearer; the edge validates, re-checks the
 * row against the column contract, mints a Google access token from the SA, and
 * appends to Sheet 1.
 *
 * Wire into worker.js as Door-3, BEFORE the pass-through router:
 *
 *   import { handleSpineAppend, isSpinePath } from "./spine_append.js";
 *   // inside fetch(request, env):
 *   if (isSpinePath(request)) return handleSpineAppend(request, env);
 *
 * Worker secrets / vars required:
 *   SPINE_SA_JSON     (secret)  full service-account JSON, one line
 *   SPINE_SHEET_ID    (var)     1nI7L24ASbnP1WbPJPINjnRweY_n3sSsmK71XuOhwY8M
 *   SPINE_RIG_TOKENS  (secret)  comma-list of accepted per-rig bearers
 *
 *   safety check · security check · transparency check
 *   :<477>=-
 */

const SPINE_PATH = "/api/spine/append";
const TAB = "capture_log";
const COLUMNS = [
  "row_id", "captured_at", "appended_at", "source_device", "media_kind",
  "raw_ref", "raw_sha256", "gps_lat", "gps_lon", "gps_source",
  "place_name", "place_id", "xref_key", "exif_json",
];

export function isSpinePath(request) {
  return new URL(request.url).pathname === SPINE_PATH;
}

export async function handleSpineAppend(request, env) {
  if (request.method !== "POST") return j(405, { error: "method_not_allowed" });
  if (!env.SPINE_SA_JSON) return j(503, { error: "spine_no_credentials" });

  // per-rig bearer — NOT a Google key. Rotate one token if a rig is lost.
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const allowed = (env.SPINE_RIG_TOKENS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!token || !allowed.includes(token)) return j(401, { error: "bad_rig_token" });

  let body;
  try { body = await request.json(); } catch { return j(400, { error: "malformed_json" }); }

  // re-validate the row against the column contract — the edge does not trust the rig blindly
  const values = body && body.values;
  if (!Array.isArray(values) || values.length !== COLUMNS.length) {
    return j(400, { error: "row_shape", expected: COLUMNS.length });
  }

  let accessToken;
  try { accessToken = await mintGoogleToken(env.SPINE_SA_JSON); }
  catch { return j(502, { error: "token_mint_failed" }); } // never leak SA detail

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${env.SPINE_SHEET_ID}` +
    `/values/${TAB}!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values: [values] }),
  });
  if (!r.ok) return j(502, { error: "sheets_append_failed", status: r.status });
  return j(201, { ok: true });
}

function j(status, obj) {
  return new Response(JSON.stringify(obj), {
    status, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://l-lts.ai" },
  });
}

/** Mint a short-lived Google OAuth access token from the SA JSON via JWT grant. */
async function mintGoogleToken(saJsonStr) {
  const sa = JSON.parse(saJsonStr);
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now, exp: now + 3600,
  }));
  const unsigned = `${header}.${claim}`;
  const key = await importPkcs8(sa.private_key);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const jwt = `${unsigned}.${b64url(sig)}`;
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  if (!resp.ok) throw new Error("token");
  return (await resp.json()).access_token;
}

async function importPkcs8(pem) {
  const b64 = pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const der = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey("pkcs8", der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
}

function b64url(data) {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
  let bin = ""; for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
