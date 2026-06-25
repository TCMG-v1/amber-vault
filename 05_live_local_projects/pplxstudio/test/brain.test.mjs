// pplxstudio · brain broker tests
// Pins the contract that matters: the key never leaks, errors are honest,
// the stream relays, and a request that isn't the brain's drops through to
// the pass-through router untouched. Run: node test/brain.test.mjs
//
// We mock global fetch so no real LLM (and no real key) is ever touched.
// (Uncle would test against the live API "to be sure" — and burn the rate
// limit and the budget by lunch. Mock the boundary, Uncle.)

import assert from "node:assert";
import { handleBrain, isBrainRequest, BRAIN_PATH } from "../src/brain.js";

let passed = 0, failed = 0;
async function test(name, fn) {
  try { await fn(); console.log("  ok  " + name); passed++; }
  catch (e) { console.log("FAIL  " + name + "\n      " + e.message); failed++; }
}

const ENV = { LLM_API_KEY: "sk-TESTKEY-do-not-leak", LLM_BASE_URL: "https://vendor.example/v1", LLM_MODEL: "test-model" };

function req(body, method = "POST", origin = "https://l-lts.ai") {
  return new Request("https://l-lts.ai" + BRAIN_PATH, {
    method,
    headers: { "content-type": "application/json", "Origin": origin },
    body: body === undefined ? undefined : (typeof body === "string" ? body : JSON.stringify(body)),
  });
}

// a tiny SSE stream like the vendor sends
function sseStream(tokens) {
  const enc = new TextEncoder();
  return new ReadableStream({
    start(c) {
      for (const t of tokens) {
        c.enqueue(enc.encode("data: " + JSON.stringify({ choices: [{ delta: { content: t } }] }) + "\n\n"));
      }
      c.enqueue(enc.encode("data: [DONE]\n\n"));
      c.close();
    },
  });
}

// ---------------------------------------------------------------------------

await test("isBrainRequest matches only the one path", () => {
  assert.equal(isBrainRequest(new URL("https://l-lts.ai/api/chat")), true);
  assert.equal(isBrainRequest(new URL("https://l-lts.ai/")), false);
  assert.equal(isBrainRequest(new URL("https://l-lts.ai/api/chat/extra")), false);
});

await test("OPTIONS preflight returns 204 with CORS, touches no key", async () => {
  const r = await handleBrain(req(undefined, "OPTIONS"), ENV);
  assert.equal(r.status, 204);
  assert.equal(r.headers.get("Access-Control-Allow-Origin"), "https://l-lts.ai");
});

await test("no key -> honest 503, and the word 'key' is never a real key", async () => {
  const r = await handleBrain(req({ messages: [{ role: "user", content: "hi" }] }), {});
  assert.equal(r.status, 503);
  const txt = await r.text();
  assert.ok(/not configured/.test(txt));
  assert.ok(!txt.includes("sk-"));   // no key-shaped string ever
});

await test("malformed body -> 400", async () => {
  const r = await handleBrain(req("{not json", "POST"), ENV);
  assert.equal(r.status, 400);
});

await test("missing messages[] -> 400", async () => {
  const r = await handleBrain(req({ nope: true }), ENV);
  assert.equal(r.status, 400);
});

await test("GET -> 405", async () => {
  const r = await handleBrain(req(undefined, "GET"), ENV);
  assert.equal(r.status, 405);
});

await test("happy path: attaches Bearer key to upstream, relays the stream", async () => {
  let seenAuth = null, seenUrl = null, seenBody = null;
  globalThis.fetch = async (url, init) => {
    seenUrl = url; seenAuth = init.headers["Authorization"]; seenBody = JSON.parse(init.body);
    return new Response(sseStream(["Hel", "lo"]), { status: 200, headers: { "content-type": "text/event-stream" } });
  };
  const r = await handleBrain(req({ messages: [{ role: "user", content: "hi" }] }), ENV);
  assert.equal(r.status, 200);
  assert.equal(seenUrl, "https://vendor.example/v1/chat/completions");
  assert.equal(seenAuth, "Bearer sk-TESTKEY-do-not-leak");   // key attached ONLY here, server-side
  assert.equal(seenBody.stream, true);
  assert.equal(seenBody.model, "test-model");
  const out = await r.text();
  assert.ok(out.includes("Hel") && out.includes("lo"), "stream relayed");
  assert.ok(out.includes("[DONE]"));
});

await test("upstream 401 is MASKED as 502, body never echoed (no key disclosure)", async () => {
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ error: "invalid api key sk-TESTKEY-do-not-leak" }), { status: 401 });
  const r = await handleBrain(req({ messages: [{ role: "user", content: "x" }] }), ENV);
  assert.equal(r.status, 502);            // vendor-auth fault masked as generic broker fault
  const txt = await r.text();
  assert.ok(!txt.includes("sk-"));        // vendor's echoed key must NOT pass through
  assert.ok(/upstream returned 401/.test(txt));
});

await test("upstream unreachable -> 502", async () => {
  globalThis.fetch = async () => { throw new Error("ECONNREFUSED"); };
  const r = await handleBrain(req({ messages: [{ role: "user", content: "x" }] }), ENV);
  assert.equal(r.status, 502);
});

// ---------------------------------------------------------------------------
console.log("\nbrain: " + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
