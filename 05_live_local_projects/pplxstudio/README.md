# pplxstudio · the btb hub edge router

One Cloudflare Worker that binds your real domains to their `pplx.app` works and
serves them in place — the visitor's address bar keeps showing your domain. The
edge is **pass-through only**: it rewrites the `Host` header, forwards, and
returns the response untouched. No analytics, no cookies, no injection. If a
routed page promises "nothing phones home," that promise survives the hop.

Built slow and precise on purpose. Adding a work is adding a row — the spine
doesn't change, so the whole thing scales by scaling the build, not by patching.

```
pplxstudio/
  routes.json          the map — domain → pplx.app target, tier, status, seal
  routes.schema.json   what a valid map looks like
  src/worker.js        the edge router (read the creed at the top before editing)
  src/brain.js         the cockpit brain broker (interaction tier · fenced path)
  wrangler.toml        custom-domain bindings + brain [vars] (NOT the key)
  seal.mjs             hashes the map into ledger.jsonl (append-only)
  ledger.jsonl         the witnessed history of the map
  test/worker.test.mjs local proof-of-spine — router, no network
  test/brain.test.mjs  brain broker proof — streaming, errors, no-key-leak
  package.json         npm test / npm run seal / npm run deploy
```

## The map (`routes.json`)

Each row binds one domain to one target. Empty `target` = unbuilt = routes
nowhere yet (honest 404, never a guess). Current state:

| Domain | Tier | Target | Status |
|---|---|---|---|
| bns-ai.ai (+ www) | provenance · Bone & Saucer / 477 | bns-ai.pplx.app | **live** |
| anya-ai.xyz (+ www) | provenance · Anya | — | planned |
| velmaforge.ai | channel · Vaulted Delta storefront | — | owned |
| mimir.art | channel · Vaulted Delta print line | — | owned |
| l-lts.ai / llts.ai | interaction surface · **cockpit brain** | `/api/chat` broker | **brain** |

## First deploy (one time)

Prereqs: domains already in Cloudflare (they are), Node 18+, a Cloudflare API
token with **Workers Scripts: Edit** + **Workers Routes: Edit** for the zones.

```bash
cd pplxstudio
npm install
npx wrangler login          # or set CLOUDFLARE_API_TOKEN in the env
npm test                    # 20 checks (router + brain), all green before shipping
npm run deploy              # runs predeploy (test + seal) then wrangler deploy
```

`custom_domain = true` in `wrangler.toml` tells Cloudflare to attach the
hostname to this Worker and provision TLS automatically — no manual DNS record,
no certificate dance. Cloudflare creates the proxied record for you on deploy.

After deploy, visit `https://bns-ai.ai` — it should serve the Architecture
Record with `bns-ai.ai` staying in the bar.

## Adding the next work (the whole point)

Slow and precise, every time the same three moves:

1. **Build + publish** the work to its `pplx.app` (e.g. `anya-ai.pplx.app`).
2. **Add the target** to its row in `routes.json` and set `status` to `live`.
3. **Uncomment** the matching `[[routes]]` block(s) in `wrangler.toml`, then:

```bash
npm run deploy
```

That's it. `predeploy` re-tests and re-seals automatically, so the map's history
stays witnessed and the spine stays proven. No row ships untested.

## The brain (interaction tier · `l-lts.ai/api/chat`)

The cockpit operator-console talks to an LLM through **your own edge**, never the
vendor directly. `src/brain.js` is a second, clearly-fenced path on the same
Worker: the pass-through router stays dumb and honest; the brain is the opposite
kind of thing, kept in its own file behind its one path (`/api/chat`), allowed
only on **interaction-tier** hosts. Two doors, never blurred.

The contract, pinned by `test/brain.test.mjs`:

- The model key lives **only** in a Worker secret. Never in the repo, never in
  `wrangler.toml`, never sent to the browser. Set it once, locally:
  ```bash
  npx wrangler secret put LLM_API_KEY      # paste your key — it never touches git
  ```
- `[vars] LLM_BASE_URL` / `LLM_MODEL` pick the provider/model (OpenAI-compatible
  `/chat/completions`, `stream:true`). Change them freely; none is sensitive.
- The edge **streams** the reply straight back; it does **not** log prompts or
  store transcripts. A vendor `401` is masked as a generic `502` so an echoed
  key can never leak into a console.

The cockpit (the device-over-shell app) calls only `l-lts.ai/api/chat`. Its CSP
allows `connect-src 'self' https://l-lts.ai` and nothing else — the vendor host
never appears in the browser. The brain row sits in `routes.json` with
`status: "brain"`; the pass-through `injection: "none"` constraint still holds,
because the brain is a separate path, not injection into a proxied response.

## The seal

`seal.mjs` computes a SHA-256 over a **canonical, key-sorted** serialization of
the routes (so reformatting doesn't churn the hash — only meaning does) and
appends one line to `ledger.jsonl`. Same move as the storefront's buy-to-hash,
turned on the hub's own wiring: the map that routes the provenance is itself
provenanced. Run `npm run seal` anytime; it runs automatically before deploy.

## The contract (don't break it)

The transparency manifest on routed pages claims zero network calls and no
third-party anything. This edge must not make that a lie. The Worker streams the
body through untouched, by design. **If you ever splice something into the
response — a tag, a header beacon, a cookie — delete it and re-read the
manifest.** Boring is the feature.

## Notes for hosting outside Cloudflare later

If the works ever move off `pplx.app`, only the `target` fields change — the
spine doesn't care where upstream lives, as long as it answers for the right
`Host`. That's the future-proofing: the map is portable.

:<477>=-
