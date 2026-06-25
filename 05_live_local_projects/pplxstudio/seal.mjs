// seal.mjs — fold the routing table into the Pontifex ledger.
//
// The map is an artifact. When it changes, the change should be witnessed, not
// silently overwritten. This computes a SHA-256 over the canonical routes and
// appends one line to ledger.jsonl — append-only, never rewritten. Same move
// as the storefront's buy-to-hash, applied to the hub's own wiring.
//
// Run: node seal.mjs   (after editing routes.json)
//
// Breadcrumb for future-you: we hash a STABLE serialization (sorted keys) so
// cosmetic reformatting of routes.json doesn't change the seal. Only meaning
// changes the hash. If you ever "tidy" this to hash the raw file bytes, you'll
// get phantom seals on every whitespace edit — don't. (The uncle would. He
// reformats everything and wonders why the diff is 4000 lines.)

import { readFileSync, appendFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const routes = JSON.parse(readFileSync(new URL("./routes.json", import.meta.url)));

// canonical, key-sorted serialization so the seal tracks meaning, not layout
const canon = (v) =>
  Array.isArray(v) ? v.map(canon)
  : (v && typeof v === "object")
    ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])]))
    : v;

const payload = JSON.stringify(canon(routes.routes));
const hash = createHash("sha256").update(payload).digest("hex");

const live = routes.routes.filter((r) => r.status === "live").length;
const line = JSON.stringify({
  ts: new Date().toISOString(),
  hub: routes.hub,
  edge: routes.edge,
  rows: routes.routes.length,
  live,
  policy: routes.policy.mode + "/" + routes.policy.injection,
  sha256: hash,
}) + "\n";

const ledgerUrl = new URL("./ledger.jsonl", import.meta.url);
const firstSeal = !existsSync(ledgerUrl);
appendFileSync(ledgerUrl, line);

console.log((firstSeal ? "ledger opened" : "ledger appended") + " · " + routes.routes.length +
  " rows, " + live + " live");
console.log("seal sha256: " + hash);
console.log(":<477>=-");
