# Sheet 1 — Column Map (append-only, live)

The raw, max-detail capture **stays local to the Pixel first**. What lands in Sheet 1 is the cross-referenced *projection* of each capture: a pointer to the raw bytes + the metadata + the Maps match. The Sheet is the live ledger; rows are **appended, never edited**. Tandem rigs (`pixel-orion`, `pi-test-01`, `pi-prod-02`) all append to the same Sheet — `source_device` keeps them sorted out.

| Col | Field | Type | What it holds |
|-----|-------|------|---------------|
| A | `row_id` | text | ULID minted on the Pi at append. Primary key, never reused. |
| B | `captured_at` | ISO-8601 UTC | When the media was captured (EXIF `DateTimeOriginal`, else file mtime). |
| C | `appended_at` | ISO-8601 UTC | When the Pi appended the row. Always `>= captured_at`. |
| D | `source_device` | text | Which rig: `pixel-orion`, `pi-test-01`, `pi-prod-02`. |
| E | `media_kind` | enum | `photo · video · audio · screen · map_tile · doc · other`. |
| F | `raw_ref` | text | Pointer to the raw artifact (stays local first): `content://`, abs path, or object id once mirrored. |
| G | `raw_sha256` | hex(64) | SHA-256 of the raw bytes. Provenance + dedupe. |
| H | `gps_lat` | number / blank | Decimal degrees. |
| I | `gps_lon` | number / blank | Decimal degrees. |
| J | `gps_source` | enum | Which x-ref key resolved the fix: `exif · phone_live · maps_timeline · none`. |
| K | `place_name` | text / blank | Nearest place after snapping to **your** Maps data. |
| L | `place_id` | text / blank | Stable id of the matched place. |
| M | `xref_key` | text | Audit trail of HOW the match was made: `<source>:<lat>,<lon>@<radius_m>`. |
| N | `exif_json` | text (JSON) | Full capture metadata as a compact JSON string — "all raw mad detailed" lives here. |

## The three cross-reference keys (resolution order)

Every capture tries to resolve a fix in this order; the first that wins sets `gps_source`:

1. **`exif`** — embedded photo GPS. Fully offline on the Pi. Fastest, most precise when present.
2. **`phone_live`** — the phone's live location stream at capture time. Catches photos with GPS stripped.
3. **`maps_timeline`** — resolved from your Google Maps location history at `captured_at`. The backstop.
4. **`none`** — no fix; `gps_lat/lon` blank, `place_*` blank. Row still lands (append-only never drops a capture).

`place_name`/`place_id` come from snapping `(lat,lon)` to the nearest place in **your** Maps dataset within a radius tolerance (default 30 m for `exif`, wider for the looser sources — encoded in `xref_key`).

## Append discipline

- **Append-only.** New captures = new rows at the bottom. No cell is ever rewritten. Corrections land as a new row referencing the same `raw_sha256`.
- **Idempotent.** Re-running the appender over already-seen `raw_sha256` is a no-op (dedupe on hash), so a crashed Pi can safely resume.
- **Live.** The Pi appends as captures arrive; Sheet 1 is the real-time tail.

_safety check · security check · transparency check_

:<477>=-
