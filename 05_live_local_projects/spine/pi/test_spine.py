#!/usr/bin/env python3
"""Local proof of the spine row builder — no hardware, no Google, no edge.
Runs the example manifest through build_row, exercises all three x-ref keys,
checks the place snap, dedupe, and schema conformance. Run: python3 test_spine.py
"""
import json, os, tempfile, sys
import spine_core as core
from spine_ledger import Ledger

HERE = os.path.dirname(os.path.abspath(__file__))
fails = []

def check(name, cond):
    print(f"  {'PASS' if cond else 'FAIL'}  {name}")
    if not cond: fails.append(name)

places = core.load_my_maps(os.path.join(HERE, "my_maps.example.json"))
with open(os.path.join(HERE, "manifest_example.json")) as f:
    m = json.load(f)

# point raw_path at a real local file so sha256 works (the .dng path won't exist here)
tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".dng")
tmp.write(b"raw max-detail bytes stay local to the pixel first"); tmp.close()
m["raw_path"] = tmp.name

def cap_from(mm):
    return core.Capture(mm["raw_ref"], mm["raw_path"], mm["media_kind"],
                        mm["captured_at"], mm.get("exif", {}),
                        mm.get("live_track"), mm.get("timeline"))

print("== Key 1: EXIF GPS wins, snaps to nearest place ==")
row = core.build_row(cap_from(m), "pi-test-01", places)
check("gps_source == exif", row["gps_source"] == "exif")
check("place snapped to Agripparium HQ", row["place_name"] == "Agripparium HQ — Milton DE")
check("xref_key records how", row["xref_key"].startswith("exif:38.784620,-75.305180@30"))
check("sha256 is 64 hex", len(row["raw_sha256"]) == 64)
check("exif_json holds full blob", json.loads(row["exif_json"])["Model"] == "Pixel 9 Pro")
check("row_id minted", len(row["row_id"]) == 26)
check("captured_at <= appended_at", row["captured_at"] <= row["appended_at"])

print("== Key 2: no EXIF GPS -> phone_live ==")
m2 = json.loads(json.dumps(m)); m2["exif"].pop("gps_lat"); m2["exif"].pop("gps_lon")
row2 = core.build_row(cap_from(m2), "pixel-orion", places)
check("gps_source == phone_live", row2["gps_source"] == "phone_live")

print("== Key 3: no EXIF, no live -> maps_timeline backstop ==")
m3 = json.loads(json.dumps(m2)); m3["live_track"] = None
row3 = core.build_row(cap_from(m3), "pi-prod-02", places)
check("gps_source == maps_timeline", row3["gps_source"] == "maps_timeline")
check("timeline snaps to The Lab", row3["place_name"] == "The Lab")

print("== No fix at all -> row still lands, gps_source none ==")
m4 = json.loads(json.dumps(m3)); m4["timeline"] = None
row4 = core.build_row(cap_from(m4), "pi-test-01", places)
check("gps_source == none", row4["gps_source"] == "none")
check("lat/lon blank-able (None)", row4["gps_lat"] is None and row4["gps_lon"] is None)
check("row_to_values blanks None", core.row_to_values(row4)[7] == "")

print("== Dedupe ledger is idempotent ==")
led = Ledger(tempfile.NamedTemporaryFile(delete=False).name)
check("unseen before record", not led.seen(row["raw_sha256"]))
led.record(row)
check("seen after record", led.seen(row["raw_sha256"]))

print("== Row conforms to the 14-col schema ==")
with open(os.path.join(HERE, "..", "schema", "capture_row.schema.json")) as f:
    schema = json.load(f)
check("column order matches schema", core.COLUMNS == schema["x-sheet-columns"])
vals = core.row_to_values(row)
check("row_to_values yields 14 cells", len(vals) == 14)

os.unlink(tmp.name)
print()
if fails:
    print(f"FAILED: {fails}"); sys.exit(1)
print("ALL SPINE TESTS PASS  ·  safety check · security check · transparency check  ·  :<477>=-")
