// Local proof-of-spine. No Cloudflare, no network — we stub global fetch and
// assert the Worker routes, guards, and repairs redirects the way the creed
// promises. Run: node test/worker.test.mjs
//
// Why bother before deploy: the cheapest place to catch a routing bug is right
// here, on the bench. The most expensive place is a live domain at 2am. We pick
// the bench. (Every careful dev has a story about why. So does the uncle, but
// his story ends with "and that's why I just use a redirect.")

import worker from "../src/worker.js";

let pass = 0, fail = 0;
const ok = (name, cond) => { (cond ? (pass++, console.log("  ok  " + name)) : (fail++, console.log("FAIL  " + name))); };

// stub upstream: echoes back the Host it was called with, or emits a redirect
// to its own hostname when the path is /redirect-self.
let lastUpstreamHost = null;
globalThis.fetch = async (req) => {
  const u = new URL(req.url);
  lastUpstreamHost = req.headers.get("Host");
  if (u.pathname === "/redirect-self") {
    return new Response(null, { status: 301, headers: { Location: "https://" + u.hostname + "/landed" } });
  }
  if (u.pathname === "/redirect-away") {
    return new Response(null, { status: 302, headers: { Location: "https://example.com/elsewhere" } });
  }
  return new Response("upstream-body", { status: 200, headers: { "x-served-by": u.hostname } });
};

const call = (urlStr, headers = {}) =>
  worker.fetch(new Request(urlStr, { headers }));

// 1. apex routes to its target, Host header is rewritten
{
  const r = await call("https://bns-ai.ai/");
  ok("apex bns-ai.ai routes 200", r.status === 200);
  ok("upstream Host rewritten to target", lastUpstreamHost === "bns-ai.pplx.app");
}

// 2. www alias routes to the same target
{
  const r = await call("https://www.bns-ai.ai/path?q=1");
  ok("www alias routes 200", r.status === 200);
  ok("alias hits same target", lastUpstreamHost === "bns-ai.pplx.app");
}

// 3. case-insensitive host
{
  const r = await call("https://BNS-AI.AI/");
  ok("uppercase host still routes", r.status === 200);
}

// 4. unknown host => honest 404, no guess
{
  const r = await call("https://nope.example/");
  ok("unknown host 404", r.status === 404);
}

// 5. unbuilt row (empty target) => not in table => 404
{
  const r = await call("https://anya-ai.xyz/");
  ok("unbuilt row not yet routed (404)", r.status === 404);
}

// 6. redirect to upstream's own host => Location repaired back to visitor domain
{
  const r = await call("https://bns-ai.ai/redirect-self");
  const loc = r.headers.get("Location");
  ok("self-redirect status preserved", r.status === 301);
  ok("Location repaired to visitor domain", loc === "https://bns-ai.ai/landed");
  ok("Location does NOT leak pplx.app", !/pplx\.app/.test(loc));
}

// 7. redirect to a foreign host => left strictly alone
{
  const r = await call("https://bns-ai.ai/redirect-away");
  ok("foreign redirect untouched", r.headers.get("Location") === "https://example.com/elsewhere");
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
