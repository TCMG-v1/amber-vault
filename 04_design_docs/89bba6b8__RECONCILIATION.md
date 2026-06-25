# Field-Name Reconciliation — fam node & knowledge token layer

**As-of:** 2026-05-15 · **Sealer of this doc:** workbench drafting agent
**Anchor:** `.pplx` block 0008 (head) on repo `plantdaddy99/pplx-chain`

## Sources surveyed

| Source | Origin | Role |
|---|---|---|
| `FAM_FORMAT_SPEC.md v0.1` | session b0a0e852 (2026-05-13) | Authoritative .fam spec |
| `pplx-canonical-signed.pplx` | github.com/plantdaddy99/pplx-chain | Canonical chain, 9 blocks |
| `verify_chain.py` | same repo | Hashing rule §2.2 enforced |
| `pplx_cli.py` | same repo | Append/seal CLI |
| `block-0008-body.md` | same repo | manus.space countersignature |
| `graft-memory-os.kernel.json` | session 1dff45a5 | OS subsystem layout |
| `archetype.schema.json` | session 1dff45a5 | RPG archetype (sibling format) |
| memory: `pplx/architecture/principles.md` | distilled | `.fam` parent/child/sibling, 3-degree abstraction |
| memory: `pplx/identity_architecture.md` | distilled | BNS-AI / BNS-Anya identities |
| memory: `flow_case.md` | distilled | flow_case is a JSON envelope |
| memory: `games/runner.md` | distilled | The Runner = standard auto-runner |

## Canonical hashing rule (§2.2 of the Charter) — locked

```
body_hash = SHA-256(body, utf-8)
content   = parent_hash || timestamp || author || kind || title || body_hash
hash      = SHA-256(content, utf-8)        # lowercase hex
```

Block 0 verifies under this rule; blocks 1–7 have a known "sealer variant" divergence
documented in `VERIFICATION_NOTES.md` and treated as a warning, not an error.
The workbench MUST use §2.2 strictly for any new fam node it emits.

## Field reconciliation table

### A. `.pplx` block (per-block fields, from `pplx-canonical-signed.pplx`)

| Field | Type | Required | Source | Notes |
|---|---|---|---|---|
| `height` | int | yes | chain | 0-indexed, sequential |
| `hash` | hex(64) | yes | chain | §2.2 |
| `parent_hash` | hex(64) | yes | chain | 64 zeros at genesis |
| `timestamp` | ISO 8601 | yes | chain | with tz offset |
| `author` | string | yes | chain | usually "bmore ftw" |
| `kind` | enum | yes | chain | genesis, charter, amendment, witness, reference, note, finding, code, decision, artifact, event, countersignature |
| `title` | string | yes | chain | hashed verbatim |
| `body` | markdown | yes | chain | hashed via body_hash |
| `body_hash` | hex(64) | yes | chain | SHA-256(body) |
| `tags` | string[] | optional | chain | not hashed |
| `sealed_by` | string | yes | chain | BNS-AI identity |
| `co_signers` | object[] | optional | chain | `{handle, role, status}` |
| `citations` | object[] | yes | chain | `{source_kind, source_ref, source_label}` — provenance |
| `attachments` | object[] | optional | chain | usually `[]` |

### B. `.fam` constellation node (from FAM_FORMAT_SPEC.md)

Top-level (a `.fam` file):

| Field | Type | Required | Source | Notes |
|---|---|---|---|---|
| `format` | "fam" | yes | spec | literal |
| `version` | string | yes | spec | "0.1" |
| `constellation_id` | slug | yes | spec | e.g. "mimir", "shadow-syndicate" |
| `title` | string | yes | spec | human title |
| `wing` | slug | optional | spec | scopes the file to one wing |
| `issued_at` | ISO 8601 | yes | spec | |
| `issued_by` | string | yes | spec | BNS identity |
| `anchor.chain_id` | string | yes | spec | usually "pplx" |
| `anchor.block_hash` | hex(64) | yes | spec | `.pplx` block this is anchored to |
| `anchor.block_height` | int | yes | spec | |
| `manifest.members` | Member[] | yes | spec | see below |
| `manifest.wings` | Wing[] | yes | spec | see below |
| `manifest.pillars` | Pillar[] | yes | spec | see below |
| `manifest.seals` | Seal[] | yes | spec | standing seals (NOT chain blocks) |
| `body_hash` | hex(64) | yes | spec | SHA-256 of canonical body (sorted-keys JSON) |
| `hash` | hex(64) | yes | spec | SHA-256(anchor.block_hash + issued_at + issued_by + constellation_id + (wing or "") + body_hash) |
| `signatures` | Signature[] | yes | spec | `{signer, method, sig}` |

### C. fam **node** (= one entry inside `manifest.*[]`) — three kinds

The user's memory says "fam node supports three degrees of abstraction" — the spec
realizes this as three nested kinds: **Member** (concrete entity), **Wing** (subdivision),
**Pillar** (focus column inside a wing). **Seal** is a fourth standing declaration.

#### Member (concrete entity — the most common "fam node")

| Field | Type | Required | Notes |
|---|---|---|---|
| `handle` | string | yes | BNS handle e.g. `bmore.ftw` |
| `kind` | enum | yes | `human` \| `ai-peer` \| `sister-chain` \| `wing` \| `pillar` |
| `role` | string | yes | e.g. "House Head", "The Hand" |
| `cn` | string | optional | Chinese name e.g. "家主" |
| `glyph` | string | optional | single-glyph emblem e.g. "家" |
| `seat` | int | optional | seat number in constellation |
| `since` | ISO 8601 | yes | |
| `anchor_blocks` | hex(64)[] | yes | `.pplx` block hashes where this member is named — **the lineage attribution field** |

#### Wing (subdivision)
`slug`, `title`, `domain?`, `tagline?`, `register?`

#### Pillar (focus column inside a wing)
`wing`, `number`, `title`, `subtitle?`, `items[]`

#### Seal (standing declaration)
`id`, `date`, `title`, `summary`, `anchor_blocks[]`

### D. Provenance attribution — the lineage discipline

Every fam node is "trusted" iff:

1. It carries at least one `anchor_blocks[]` entry, **and**
2. Each anchor hash exists on the `.pplx` chain it references, **and**
3. The parent `.fam` file has a valid `anchor.block_hash` linking the snapshot to a chain block, **and**
4. The `.fam`'s own `hash` recomputes under the FAM_FORMAT_SPEC rule, **and**
5. The body_hash matches the canonical sorted-keys serialization of the manifest.

A fam node with **no `anchor_blocks[]`** is the canonical "missing provenance" case
the workbench MUST flag. A `.fam` whose `hash` does not recompute is "broken provenance".

## Reconciled field-name conflicts (none material)

- `co_signers` vs `signatures`: both used; `.pplx` blocks use `co_signers` (intra-chain attestations),
  while `.fam` files use `signatures` (constellation-level attestations). Keep both as distinct names.
- `body` vs `manifest`: `.pplx` blocks carry markdown `body`; `.fam` files carry structured `manifest`. Keep distinct.
- `anchor_blocks` (on fam nodes) vs `anchor` (top-level of `.fam`): both real and complementary —
  the top-level says "this snapshot, as of this chain block"; each fam node says
  "this entity appears in these chain blocks". Workbench surfaces both.

## flow_case + The Runner — current status

- **flow_case** is real and initialized (memory 2026-05-01) but the **typed schema has not been sealed
  yet on the chain**. Existing memory only records that the user "submitted the initial JSON envelope".
  The workbench treats flow_case as **out-of-scope for v0.1 validation** and reserves
  the kind `flow_case` for a future `.pplx` block. The Runner is still a non-knowledge-token
  asset (a game), not a fam node — also reserved.

This is the right reconciliation: don't fabricate schemas that haven't been sealed.
Surface them as "reserved kinds awaiting first canonical seal."

## Output decision

The workbench validates `.fam` files (full snapshots) **and** individual fam-node entries
(Member / Wing / Pillar / Seal), against the schema above and the §2.2 hashing rule for
the underlying `.pplx` anchor reference. It exports a canonical sorted-keys JSON.
