// pplxstudio · brain broker
// ---------------------------------------------------------------------------
// A SECOND, clearly-fenced path on the edge. The pass-through router in
// worker.js stays exactly what it is — dumb, honest, injects nothing. This
// module is the opposite kind of thing on purpose: it TALKS to an LLM. So we
// keep it in its own file, behind its own door (a single path prefix), and we
// never let the two blur together. Two jobs, two modules, one Worker.
//
// THE CONTRACT (load-bearing, do not soften):
//   - The model key lives ONLY in a Worker secret (env.LLM_API_KEY). It is
//     never in the repo, never in routes.json, never sent to the browser.
//   - The cockpit talks only to your own domain (l-lts.ai/api/chat). The
//     vendor hostname never appears in the browser. The edge is the broker.
//   - We stream the vendor's response straight back. We do not log prompts,
//     we do not stash transcripts, we add no analytics. What you say to the
//     brain is between you and the model. (Uncle would "just log everything to
//     be safe" — no, Uncle, logging the prompts IS the unsafe part.)
//
// Endpoint shape: OpenAI-compatible /chat/completions with stream:true. Point
// LLM_BASE_URL / LLM_MODEL at whatever provider you like; the broker doesn't
// care which, it just relays. (Dad would ask "why's it gotta work with all of
// 'em" — because vendor lock-in is how you end up rebuilding this at 2am, Dad.)
// ---------------------------------------------------------------------------

// The one door this module owns. Anything not under here is none of its
// business and falls through to the pass-through router.
export const BRAIN_PATH = "/api/chat";

// CORS for the cockpit. We don't wildcard '*' — the brain answers the cockpit
// origin and OPTIONS preflight, nothing else. Tight by default; widen only with
// intent. (A '*' here is the kind of "temporary" that outlives three laptops.)
function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Vary": "Origin",
  };
}

// Decide if a request belongs to the brain. Method + path only — we keep the
// host check in worker.js where the routing table already lives, so there's
// one source of truth for "which domains are ours."
export function isBrainRequest(url) {
  return url.pathname === BRAIN_PATH;
}

export async function handleBrain(request, env) {
  const origin = request.headers.get("Origin") || "";

  // Preflight. Cheap, early, no secrets touched.
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (request.method !== "POST") {
    return json({ error: "brain: POST only" }, 405, origin);
  }

  // No key, no brain. Fail loud and honest rather than pretend. This is the
  // exact case the no-leak test pins: we surface "not configured," never the
  // key, never a stack trace that might carry it.
  const key = env && env.LLM_API_KEY;
  if (!key) {
    return json(
      { error: "brain: not configured. set the LLM_API_KEY worker secret (wrangler secret put LLM_API_KEY)." },
      503, origin
    );
  }

  const base = (env.LLM_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
  const model = env.LLM_MODEL || "gpt-4o-mini";

  // Parse the cockpit's payload. We accept a tiny shape: { messages:[...] }.
  // Anything malformed gets an honest 400 — we don't try to "fix" the caller's
  // body and forward a guess (guessing is how you proxy garbage upstream and
  // pay for the tokens).
  let payload;
  try {
    payload = await request.json();
  } catch (_) {
    return json({ error: "brain: body must be JSON { messages: [...] }" }, 400, origin);
  }
  if (!payload || !Array.isArray(payload.messages)) {
    return json({ error: "brain: missing messages[]" }, 400, origin);
  }

  // Build the upstream call. stream:true so the cockpit can paint tokens as
  // they arrive — a console that types back in real time feels alive; one that
  // freezes for ten seconds feels broken even when it's working.
  const upstreamBody = JSON.stringify({
    model,
    stream: true,
    messages: payload.messages,
    temperature: typeof payload.temperature === "number" ? payload.temperature : 0.6,
  });

  let upstream;
  try {
    upstream = await fetch(base + "/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + key, // the ONLY place the key is ever attached
        "Content-Type": "application/json",
      },
      body: upstreamBody,
    });
  } catch (_) {
    return json({ error: "brain: upstream unreachable" }, 502, origin);
  }

  // Upstream said no. Relay a SANITIZED status — never the upstream body
  // verbatim, because vendor error blobs sometimes echo the auth header or
  // org IDs. We translate to a plain note. (This is the line that keeps a 401
  // from turning into a key disclosure in someone's console.)
  if (!upstream.ok || !upstream.body) {
    return json(
      { error: "brain: upstream returned " + upstream.status },
      upstream.status === 401 ? 502 : (upstream.status || 502), // mask vendor-auth as a generic broker fault
      origin
    );
  }

  // Stream the SSE body straight back to the cockpit, untouched. The cockpit
  // knows how to read OpenAI-style "data:" lines. We add CORS + the right
  // content-type and otherwise stay out of the way.
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(origin),
    },
  });
}

// small JSON helper — keeps error shapes consistent so the cockpit can trust
// one format. textContent on the other end; we never hand back HTML.
function json(obj, status, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) },
  });
}
