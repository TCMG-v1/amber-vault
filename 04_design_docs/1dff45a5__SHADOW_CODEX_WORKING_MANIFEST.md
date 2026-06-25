# Shadow Codex Working Manifest

Status: working document until explicit commit.

Prime rule: no raw power without role, no role without validation, no validation without memory.

Commit rule: everything is a working document until commit.

## Assimilated source

- `paste.txt` — unified write-up titled “The Shadow Codex: A Unified Type-Theoretic Framework for Synthetic Market Intelligence.”
- `HyperTaxonomyCodexSemanticBook.hs` — core semantic algebra for `TextSegment`, `ArchiveStream`, `HasSpatioSemantic`, privilege checks, codex lifting, audit logging, and monoid laws.
- `ShadowMarketSemantics.hs` — market-domain translation layer for VIX regimes, quotes, positions, alerts, portfolio snapshots, route selection, and guard functions.
- `ShadowBridge.hs` — ingest bridge for Python/dashboard JSON, allocation stream, payoff contracts, option payoff profiles, and end-to-end pipeline dispatch.
- `PolicyLayer.hs` — Fortify-era action policy layer with `ActionRequest`, privilege requirements, `PolicyDecision`, `PolicyContext`, batch evaluation, and max-action resolution.
- `GraftMemoryArchiveFortify.hs` — five-layer security architecture with `FortifyStatus`, `FortifyReason`, `FortifyResult`, ceremony/mutation/governance checks, audit logging, render permissions, fortified segments, and fortified pipeline dispatch.
- `ioGreeksCodex.hs` — working quant-finance semantic state engine for color, chromatic codes, semantic segments, portfolio snapshots, segment aggregation, and role validation.

## Current interpretation

The paste defines the Shadow Synthetic Market Dashboard and Graft Memory Archive as the same architecture at different surfaces:

- Surface UI renders semantic segments.
- Haskell-style codex defines ontology, algebra, privilege, and audit.
- Python dashboard supplies real-time market state, options ladder, VIX term structure, and portfolio frames.
- Bridge code maps ingest JSON into semantic streams, payoff profiles, routes, and audit-governed decisions.
- Fortify inserts a policy layer between privilege and rendering/action, preventing a role from mutating state merely because it exists.
- ioGreeksCodex supplies a parallel quant-finance lexicon for Alpha/Theta/Momentum-style semantic state aggregation.

## Fortified stack

The fortified architecture is now:

```text
TextSegment
  -> PrivilegeCheck
  -> PolicyDecision
  -> FortifyResult
  -> RenderPermission
  -> DOM / Archive / Action
```

Canonical security law:

```text
Breaker may warn. Gate may decide. Archivist may preserve.
Witness may remember. Scout may notice.
None may act without their role being seen.
```

## Authority status

These files are not committed doctrine yet. They are working documents:

- visible
- playable
- inspectable
- non-authoritative

They become authoritative only after explicit commit.

## Next integration target

The next safe integration step is an append-only audit/memory layer shared by:

- `graft_memory_archive_bridge.hs`
- `semantic_renderer.js`
- `market_dashboard.py`
- `ShadowBridge.hs`

Every Gate, Breaker, and Archivist action should produce a durable memory frame before any authority transfer.
