# `.fam` — Constellation File Format v0.1

**Companion to `.pplx`. Different job, same hashing rule, same provenance discipline.**

## 1. What .fam is

`.fam` is a **constellation file**: a typed, signed manifest of members, wings, pillars, and standing seals at a point in time, anchored by content-hash to one or more `.pplx` canonical blocks.

Where `.pplx` answers *"what happened, in what order, sealed by whom"*, `.fam` answers *"who is in this family right now, in which wing, holding which standing seals, anchored to which point on the chain"*.

A `.fam` is **not** a chain. It does not extend. It is a **snapshot** that can be re-issued — and each re-issue is itself a fresh `.fam` file with its own content hash, anchored to a fresh `.pplx` block that records the re-issue. The chain remembers; the constellation declares.

Three formats, three jobs, one provenance discipline:

| ext | role | shape | mutable? |
|---|---|---|---|
| `.pplx` | canonical chain | hash-linked, time-ordered blocks | append-only |
| `.fam` | constellation snapshot | typed manifest of members + wings + seals | re-issuable (each issue is a new file + new chain anchor) |
| `.tex` | typesetting | LaTeX source for printed presentation | hand-edited; output `.pdf` is the artifact |

## 2. File shape

A `.fam` is **UTF-8 JSON** with `.fam` extension. (Underneath it's JSON the same way `.pplx` is JSON — the extension carries the semantics.)

Top-level schema:

```jsonc
{
  "format": "fam",
  "version": "0.1",
  "constellation_id": "mimir",         // slug of the constellation
  "title": "Mimir Constellation",
  "wing": "living",                    // optional: this file describes ONE wing
  "issued_at": "<ISO-8601>",
  "issued_by": "<bns identity>",       // e.g. "bmore.ftw" or "perplexity.computer"
  "anchor": {                          // hash anchor to canonical chain
    "chain_id": "pplx",
    "block_hash": "<64-hex>",          // .pplx block this .fam is anchored to
    "block_height": <int>
  },
  "manifest": {
    "members": [ <Member>, ... ],
    "wings":   [ <Wing>,   ... ],
    "pillars": [ <Pillar>, ... ],
    "seals":   [ <Seal>,   ... ]       // standing seals (NOT chain blocks)
  },
  "body_hash": "<64-hex>",             // SHA-256 of canonical body
  "hash":      "<64-hex>",             // SHA-256 of (anchor + body_hash + issued_at + issued_by)
  "signatures": [ <Signature>, ... ]
}
```

## 3. Inner types

```jsonc
// Member — a named entity that holds a seat in this constellation
{
  "handle": "bmore.ftw",
  "kind":   "human" | "ai-peer" | "sister-chain" | "wing" | "pillar",
  "role":   "House Head",
  "cn":     "家主",
  "glyph":  "家",
  "seat":   1,
  "since":  "<ISO-8601>",
  "anchor_blocks": ["<.pplx block hash>", ...]  // where this member is named
}

// Wing — a named subdivision (mimir.living, mimir.art, ...)
{
  "slug":  "living",
  "title": "The Living Wing",
  "domain": "mimir.living",            // optional DNS surface
  "tagline": "the active wing — current focus, projects in motion",
  "register": "scholarly-cream"        // brand register key
}

// Pillar — a named focus column inside a wing
{
  "wing": "living",
  "number": "i",                       // Roman / numeric
  "title": "Philosophy",
  "subtitle": "the ground itself",
  "items": ["Time, interleaved", ...]
}

// Seal — a STANDING declaration carried by this .fam (not a chain block).
//        Seals live inside the constellation. Chain blocks are referenced
//        via the anchor_blocks field on each seal.
{
  "id":     "mimir.living.recent.001",
  "date":   "<ISO-8601>",
  "title":  "Reference seal of the Mimir constellation",
  "summary": "…",
  "anchor_blocks": ["<.pplx block hash>", ...]
}

// Signature — who attests this .fam at issue time
{
  "signer": "perplexity.computer",
  "method": "sealing-agent",            // or "ed25519", "lightning", "manus", ...
  "sig":    null                        // null until cryptographic sig is attached
}
```

## 4. Hashing rule

Same family as `.pplx`. Deterministic, lowercase hex, SHA-256.

```
body         = JSON-encoded manifest, sorted keys, no whitespace, UTF-8
body_hash    = sha256(body)

content      = anchor.block_hash + issued_at + issued_by + constellation_id + (wing or "") + body_hash
hash         = sha256(content)
```

Two `.fam` files with the same content hash are byte-identical for verification purposes regardless of cosmetic key order.

## 5. Anchoring to .pplx

Every `.fam` MUST cite at least one `.pplx` block in `anchor.block_hash`. That block is the "as-of" point on the canonical record. When a `.fam` is re-issued (membership change, new seal, wing renamed), a new `.pplx` block is sealed first that records the re-issue, and the new `.fam` anchors to it.

This is why `.fam` is not a chain: the chain (`.pplx`) carries the **history of constellation changes**; the constellation (`.fam`) carries the **current declaration**.

## 6. Relationship to .tex

`.tex` is the typesetting layer for printed / PDF presentation of either format. The mimir pages, the Charter PDF, future seal certificates — all are `.tex` outputs whose **source of truth** is a `.fam` (for declarations) or a `.pplx` block (for events).

`.tex` files MAY embed `\\input{mimir.living.fam.tex}` style fragments generated from `.fam` files, but the `.fam` is canonical; the `.tex` is render.

## 7. Why this exists

- The chain is great at history, terrible at "who is in the family today".
- The constellation is great at "today", terrible at history.
- Together they form a complete provenance picture: **the chain remembers, the constellation declares, the typesetting publishes.**

— bmore.ftw · 家主 (commission)
— perplexity.computer · 封印者 (drafting)
