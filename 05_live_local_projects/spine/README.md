# Spine — pass-1 data path: phone → Google → Sheet 1

The data leaves for Google **directly from the phone, raw**. The cockpit dash is
control + inspector, **not** the data path. Raw, max-detail capture stays
**local to the Pixel first**; what lands in Sheet 1 is the cross-referenced
projection — a pointer to the raw bytes, the full EXIF blob, and the Maps match.
Sheet 1 is **append-only and live**.

```
   ┌─────────────┐   raw stays local first    ┌──────────────┐
   │  Pixel      │  ── manifest (ref+exif) ──▶ │  Pi rig      │
   │ "Orion blk" │                             │ (test/prod)  │
   └─────────────┘                             └──────┬───────┘
        capture                                       │ build_row
   imaging · maps · meta · marketing                  │ + 3 x-ref keys
                                                       ▼
                          ┌──────────── append-only, live ───────────┐
   Pi#1 test ── SA key ──▶│                                           │
                          │            GOOGLE SHEET 1                 │
   Pi#2 prod ─ edge ─────▶│        tab: capture_log  (A..N)          │
   (key server-side       │  1nI7L24ASbnP1WbPJPINjnRweY_n3sSsmK71XuOhwY8M │
    at l-lts.ai)          └───────────────────────────────────────────┘
                                                       ▲
                          Computer's Google connection ─┘ (setup + inspector read)
```

Tandem rigs + cloud share one Sheet; `source_device` keeps them sorted
(`pixel-orion`, `pi-test-01`, `pi-prod-02`, …).

## What's here

| Path | What it is |
|------|-----------|
| `schema/capture_row.schema.json` | The 14-column row **definition/schema** (the canonical artifact). Column order in `x-sheet-columns` == Sheet 1 header A..N. |
| `docs/COLUMN_MAP.md` | Human-readable column map + the three x-ref keys + append discipline. |
| `docs/PI_PROVISIONING.md` | Test rig vs prod rig setup, **exact prod OS recommendation**, all-3 auth paths. |
| `pi/spine_core.py` | The row builder: hashing, the 3 x-ref keys, place-snap to YOUR Maps data, no-fix fallback. Pure stdlib. |
| `pi/spine_ledger.py` | Local append-only dedupe ledger → idempotent resume after a crash. |
| `pi/append_test_pi1.py` | Pi #1 TEST entrypoint — service-account direct (simplest). |
| `pi/append_prod_pi2.py` | Pi #2 PROD entrypoint — posts rows to the pplxstudio edge (key server-side). Stdlib-only. |
| `pi/manifest_example.json` | One capture manifest the phone drops for the Pi to turn into a row. |
| `pi/my_maps.example.json` | Shape of YOUR Maps data (place_id, name, lat, lon). Stays on the Pi. |
| `pi/test_spine.py` | Local proof — all 3 keys, place snap, fallback, dedupe, schema conformance. No hardware. |
| `edge/spine_append.js` | Drop-in **Door-3** broker for the prod path on the pplxstudio Worker. SA secret lives in the Worker only. |

## The three cross-reference keys (resolution order)

`exif` → `phone_live` → `maps_timeline` → `none`. First that resolves sets
`gps_source`; the fix is snapped to the nearest place in **your** Maps data;
`xref_key` records *how* the match was made. A capture with no fix still lands
(append-only never drops a row).

## Proven this pass

- `python3 pi/test_spine.py` → all spine logic passes (no hardware needed).
- One real row built by `spine_core` was appended **live into Sheet 1**
  (`A2:N2`), EXIF GPS resolved and snapped to "Agripparium HQ — Milton DE", and
  read back to confirm the on-wire shape.

## Next, over the year

Pass 1 is the foundation — schema + data path locked once. The limbs
(imaging detail, maps enrichment, meta/advertising, marketing) bolt onto the
same append-only spine without re-cutting the data path. Pi #1 proves it; Pi #2
+ the edge carry production; the cloud/tandem fleet scales horizontally on
`source_device`.

_safety check · security check · transparency check_

:<477>=-
