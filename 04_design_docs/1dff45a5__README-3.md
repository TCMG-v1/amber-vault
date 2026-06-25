# Models

The first model pass uses a local SQL container that can read CSV, expose workbook-style views, and export plain tables back to CSV. It also keeps room for small Haskell payoff stubs when a pricing or strategy type needs sharper structure.

## Current direction

- Keep the schema close to DuckDB because it handles CSV and local analytics well.
- Stay near plain SQL so the table design can still be moved if needed.
- Split tables into registry, reference, prices, events, and workbook views.
- Rebuild loaded tables from CSV intake when the raw files change.

## First file

- `container_schema.sql`: registry tables, market tables, and starter workbook views
- `Payoff.hs`: starter Haskell stub for payoff and strategy types
