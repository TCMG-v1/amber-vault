# fam-workbench · spec v0.1

**As-of:** 2026-05-15 · **Anchor:** `.pplx` block 5 (witness — founding overlap window) on repo `plantdaddy99/pplx-chain` · **Sealer:** bmore.ftw (家主)

A single-page workbench that validates `.fam` constellation snapshots and individual fam nodes against the reconciled schema, surfaces missing or broken provenance, and exports canonical JSON. Runs offline in any modern browser. SubtleCrypto SHA-256.

## 1. Scope

The workbench validates two object shapes:

1. **`.fam` constellation snapshot** — a full file conforming to FAM_FORMAT_SPEC v0.1
2. **Single fam node** — one entry from `manifest.{members,wings,pillars,seals}`

It does **not** validate the underlying `.pplx` chain (use `verify_chain.py` for that), and it does **not** validate the reserved kinds `flow_case` or `runner` — they have no sealed schema yet and are surfaced only as warnings.

## 2. Canonical hashing rules (locked)

### 2.1 `.pplx` block rule (§2.2 of the Charter)

```
body_hash = SHA-256(body, utf-8)
content   = parent_hash || timestamp || author || kind || title || body_hash
hash      = SHA-256(content, utf-8)                                  # lowercase hex
```

### 2.2 `.fam` file rule (FAM_FORMAT_SPEC v0.1)

```
body      = JSON.stringify(manifest)   with sorted keys, no whitespace, utf-8
body_hash = SHA-256(body)
content   = anchor.block_hash + issued_at + issued_by + constellation_id + (wing or "") + body_hash
hash      = SHA-256(content)                                         # lowercase hex
```

`canonical()` in the workbench implements sorted-keys serialization recursively: arrays preserve order, objects emit keys in `Array.prototype.sort()` order, no whitespace, UTF-8.

## 3. Schema (reconciled)

### 3.1 `.fam` top-level

| Field | Type | Required |
|---|---|---|
| `format` | `"fam"` | yes |
| `version` | string (`"0.1"`) | yes |
| `constellation_id` | slug | yes |
| `title` | string | yes |
| `wing` | slug | optional — scopes the file to one wing |
| `issued_at` | ISO 8601 | yes |
| `issued_by` | BNS handle | yes |
| `anchor.chain_id` | string (usually `"pplx"`) | yes |
| `anchor.block_hash` | hex(64) | yes |
| `anchor.block_height` | int | yes |
| `manifest.members` | Member[] | yes |
| `manifest.wings` | Wing[] | yes |
| `manifest.pillars` | Pillar[] | yes |
| `manifest.seals` | Seal[] | yes |
| `body_hash` | hex(64) | yes |
| `hash` | hex(64) | yes |
| `signatures` | `{signer, method, sig}[]` | yes |

### 3.2 Fam node kinds

A **fam node** is one entry inside `manifest.*`. Three abstraction degrees plus standing seals:

- **Member** (concrete entity) — `handle, kind ∈ {human, ai-peer, sister-chain, wing, pillar}, role, cn?, glyph?, seat?, since, anchor_blocks[]`
- **Wing** (subdivision) — `slug, title, domain?, tagline?, register?`
- **Pillar** (focus column inside a wing) — `wing, number, title, subtitle?, items[]`
- **Seal** (standing declaration) — `id, date, title, summary, anchor_blocks[]`

`anchor_blocks[]` is **the lineage attribution field**: the list of `.pplx` block hashes where this node is named or sealed.

## 4. Validation passes

The workbench runs the following passes in order. Any `bad` → BROKEN PROVENANCE. Any `warn` → PROVENANCE GAPS. All `ok` → TRUSTED.

1. **JSON parse** — fails fast on syntax.
2. **Shape classification** — `.fam` vs. single node (member/wing/pillar/seal).
3. **Required-field presence** — top-level + per-node.
4. **Kind enum** — Member.kind must be in the allowed set; `flow_case`/`runner` flagged as reserved.
5. **Hex-64 well-formedness** — every `anchor.block_hash` and every `anchor_blocks[i]` must match `/^[0-9a-f]{64}$/`.
6. **Missing-provenance surface** — empty `anchor_blocks[]` on Member or Seal emits a `warn` with explicit "missing provenance" wording. The node list also tints those rows.
7. **`body_hash` recomputation** — canonical sorted-keys serialization of `manifest`, SHA-256, compared to declared.
8. **`hash` recomputation** — concat per §2.2 of FAM rule, SHA-256, compared to declared.
9. **Signatures presence** — empty `signatures[]` is a `warn`, not fatal.

The chain-side check (does each `anchor_blocks[i]` actually exist on the `.pplx` chain?) is **out of scope for v0.1** — the workbench cannot reach a chain. That check belongs in `verify_chain.py` once `.pplx` files are available locally. v0.2 may add a chain-loading panel.

## 5. Trust definition (lineage discipline)

A fam node is **trusted** iff:

1. It carries at least one `anchor_blocks[]` entry, **and**
2. Each anchor hash is hex-64 well-formed (workbench), **and** exists on the `.pplx` chain it references (external, out of scope), **and**
3. For a full `.fam` file: the parent file has a valid `anchor.block_hash`, **and**
4. The `.fam`'s own `hash` recomputes under the FAM rule, **and**
5. The `body_hash` matches the canonical sorted-keys serialization of `manifest`.

Conditions (4) and (5) are enforced strictly by the workbench. Condition (2)'s chain-existence half is acknowledged but not checked here.

## 6. Reserved kinds

`flow_case` and `runner` are reserved — they're real concepts in the user's system but have no sealed JSON schema on the chain yet. The workbench:

- Accepts them as `kind` values without fatal error
- Emits a `warn` labelling them "kind reserved — awaiting first canonical seal"
- Will be upgraded to strict validation once a `.pplx` block seals their schemas

## 7. Export

- **export canonical JSON** — downloads the validated object with `body_hash` and `hash` overwritten by the freshly-computed values. Use this to repair a `.fam` whose hashes have drifted out of sync after manual edits.
- **copy canonical body** — copies the sorted-keys serialized `manifest` to clipboard (the exact bytes that get hashed).

## 8. Example node

`example.fam` ships with the workbench and auto-loads on first open. It is a four-member Shadow Syndicate constellation snapshot anchored to block 5 (witness — founding overlap window, hash `877b8466…2452c69f`). Members: `bmore.ftw` (家主), `perplexity.computer` (印), `manus.space` (手), `bns.anya` (書). Two wings (`shadow-syndicate`, `mimir`), one pillar (`Provenance`), one seal (`Founding overlap window`).

The example validates as TRUSTED:

```
body_hash: 0088fcd24dc4de69e921d9ab857ac3f751b577fbfa7e2218fdde37a08d4b8e8c
hash:      77355a0be200b77ecb772364009e0f1fd228f63ed24f8e134644143f5f4103e5
```

Anchor choice rationale: block 5 is the highest `.pplx` block whose hash is on local disk and recomputes cleanly under §2.2. Block 7 (manus.space's countersignature reference) is the chain head in `VERIFICATION_NOTES.md` but its hash was not on disk at workbench drafting time. Re-anchor to a higher head when its hash becomes available — the example can be regenerated by editing `anchor.block_hash` and clicking "export canonical JSON".

## 9. Files

- `fam-workbench.html` — single-file workbench (HTML + CSS + JS, no deps, no build step)
- `example.fam` — trusted example fam constellation snapshot, anchored to block 5
- `FAM_WORKBENCH_SPEC.md` — this document
- `RECONCILIATION.md` — field-name reconciliation table across all sources

## 10. Aesthetic register

Cream paper (`#f4ecd8`), amber accents (`#c8651a`), serif body (Iowan Old Style / Palatino fallback), monospace headers (SF Mono / JetBrains Mono fallback). Two-pane workbench, scholarly-archival, Chinese glyphs welcomed. Shadow Syndicate noir, 影家 · 三本一鏈.
