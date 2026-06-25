# Bell to Bell Engine

Status: running document until commit.

Bell to Bell is a local React combat simulator node for the Graft Memory Archive game layer.

Current seed:

- Kai Morales versus Darius Cole
- append-only combat log aesthetic
- Haskell / BigQuery validation proxy concept
- card-based turn combat
- local React state only

## Working rule

This file is playable and mutable, but not committed doctrine.

## Current component

The working component is preserved at:

```text
game/BellToBellEngine.jsx
```

## Next validation pass

- Move combat math into pure reducer functions.
- Add deterministic seed mode.
- Replace mock hash with real digest helper.
- Add card schema validation.
- Add append-only event model.
- Add MythicRole mapping: Gate for validation, Breaker for knockout, Archivist for ledger.

