// pplxstudio · the btb hub edge router
// ---------------------------------------------------------------------------
// One Worker. It binds real domains to pplx.app targets and serves them
// in-place — the visitor's address bar keeps showing your domain.
//
// DISCIPLINE: this edge is PASS-THROUGH ONLY. It rewrites the Host header so
// the upstream answers for the right site, forwards the request unchanged,
// and returns the response unchanged. It injects nothing — no analytics, no
// cookies, no scripts, no body rewriting. If a routed page promises "nothing
// phones home," that promise must survive this hop. Keep it that way.
//
// Maintenance creed (read before you "improve" this):
//   - Boring is the feature. The day this Worker gets clever is the day the
//     transparency manifest starts lying. Resist.
//   - Every behavior below is load-bearing. If a line looks pointless, it's
//     guarding a 2am edge case you haven't met yet. Don't delete on a hunch.
//   - Uncle Rule: someone WILL insist "just slap a redirect on it, simpler."
//     He says that about everything. Confidently, lovingly wrong. We
//     reverse-proxy because the domain has to stay in the bar — posture B.
//   - Dad Rule: "if it ain't broke don't touch it" cuts both ways — it also
//     means don't bolt features onto a thing whose whole job is to do nothing
//     extra. Pass-through stays pass-through. (He'd never admit he was right.)
// ---------------------------------------------------------------------------

// Map ships inside the bundle (build-time JSON import), not fetched at runtime.
// One less thing that can phone home or go stale mid-flight.
// import attribute is the current standard; Wrangler and Node 20+ both honor it.
import routes from "../routes.json" with { type: "json" };
import { isBrainRequest, handleBrain } from "./brain.js";

// Which hosts are allowed to wear the brain. The brain is an interaction-tier
// concern, not a provenance one — a system-of-record domain has no business
// holding a chat endpoint. So we whitelist explicitly from the routing table
// instead of letting any routed host expose /api/chat. Tighter is cheaper than
// sorry. (Uncle: "just let every domain do everything." That is precisely how
// the provenance seat ends up with a chatbot bolted to it. No.)
const BRAIN_HOSTS = new Set(
  routes.routes
    .filter((r) => r.tier === "interaction")
    .flatMap((r) => [r.domain.toLowerCase(), ...(r.aliases || []).map((a) => a.toLowerCase())])
);

// Built once per isolate, not per request. Workers reuse isolates across many
// requests, so this Map is effectively free after the first hit. Rebuilding it
// inside fetch() would be the kind of "looks fine in dev" mistake that only
// shows up under load — i.e. exactly the bill nobody wants to read.
const TABLE = (() => {
  const m = new Map();
  for (const r of routes.routes) {
    if (!r.target) continue; // unbuilt rows route nowhere yet — empty target = no key
    // lowercase everything: hostnames are case-insensitive, Map keys are not.
    // this asymmetry has quietly eaten an afternoon off more than one careful dev.
    const t = r.target.toLowerCase();
    m.set(r.domain.toLowerCase(), t);
    for (const a of r.aliases || []) m.set(a.toLowerCase(), t); // www + alt spellings
  }
  return m;
})();

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();

    // ---- Door 1: the brain. Checked FIRST, but only for interaction-tier
    // hosts and only on its one path. Everything else drops straight through
    // to the pass-through router below, which stays exactly as honest as it
    // was. Two doors, never blurred. ----
    if (BRAIN_HOSTS.has(host) && isBrainRequest(url)) {
      return handleBrain(request, env);
    }

    // ---- Door 2: the pass-through router (unchanged) ----
    const target = TABLE.get(host);

    // Unknown host: be honest, don't guess. No silent fallback to some
    // "default" site — a wrong-but-confident answer is worse than an honest
    // miss (we all know a guy). 404 with a plain note and move on.
    if (!target) {
      return new Response(
        "pplxstudio edge · no route for " + host + "\n",
        { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } }
      );
    }

    // Loop guard. If the incoming host already equals the target, proxying it
    // just hands the request back to ourselves, forever. 508 is the honest
    // status for "loop detected." Cheap insurance against a config typo turning
    // the edge into an infinite hall of mirrors.
    if (host === target) {
      return new Response("pplxstudio edge · loop guard\n", { status: 508 });
    }

    // Rebuild the upstream URL: keep scheme/path/query exactly, swap only the
    // host. Clear the port too — inheriting an inbound :443 here and then
    // setting Host with a stale port is a classic foot-gun.
    const upstream = new URL(request.url);
    upstream.hostname = target;
    upstream.port = "";

    // Clone request, rewrite Host so the upstream serves the right site.
    // redirect:"manual" (set below) so we can repair upstream redirects and keep
    // the user's domain in the bar — letting fetch auto-follow would leak the
    // pplx.app hostname into the address bar, defeating the whole posture-B
    // point. Forward standard X-Forwarded-* breadcrumbs so the upstream can know
    // its real public face if it ever needs to.
    const headers = new Headers(request.headers);
    headers.set("Host", target);
    headers.set("X-Forwarded-Host", host);
    headers.set("X-Forwarded-Proto", url.protocol.replace(":", ""));

    const proxied = new Request(upstream.toString(), {
      method: request.method,
      headers,
      body: request.body,
      redirect: "manual",
    });

    let resp;
    try {
      resp = await fetch(proxied);
    } catch (e) {
      return new Response("pplxstudio edge · upstream unreachable\n", { status: 502 });
    }

    // Redirect repair. If the upstream bounces to its OWN hostname (very common
    // — trailing-slash normalization and friends), rewrite Location back to the
    // visitor's domain so pplx.app never flashes in the bar. Only rewrite when
    // the redirect points at our known target; a redirect to anywhere else is
    // the upstream's intent and we leave it strictly alone.
    const out = new Headers(resp.headers);
    const loc = out.get("Location");
    if (loc) {
      try {
        const lu = new URL(loc, upstream); // resolve relative Locations too
        if (lu.hostname.toLowerCase() === target) {
          lu.hostname = host;
          lu.port = "";
          out.set("Location", lu.toString());
        }
      } catch (_) { /* malformed/non-URL Location: leave it, don't crash the hop */ }
    }

    // Stream the body through untouched. No buffering, no rewriting, no
    // injection — by contract, see the creed up top. The moment anything gets
    // spliced into this response, delete that line and re-read the manifest.
    return new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers: out,
    });
  },
};
