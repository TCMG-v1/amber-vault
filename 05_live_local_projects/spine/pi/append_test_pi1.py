#!/usr/bin/env python3
"""
append_test_pi1 — Pi #1 (TEST rig). The simplest path that proves the spine.

A Google service-account JSON key lives ON THE PI. The Pi appends rows directly
to Sheet 1. No edge hop, fully local-to-Pi. This is the "first is just test"
rig — get one real row into the live Sheet, confirm the append discipline, then
graduate to Pi #2.

  Deps:  pip install google-api-python-client google-auth
  Env:   SPINE_SA_KEY=/home/pi/spine/sa.json
         SPINE_SHEET_ID=1nI7L24ASbnP1WbPJPINjnRweY_n3sSsmK71XuOhwY8M
         SPINE_MAPS=/home/pi/spine/my_maps.json
         SPINE_WATCH=/home/pi/spine/inbox      # capture manifests drop here
         SPINE_LEDGER=/home/pi/spine/ledger.jsonl
         SPINE_DEVICE=pi-test-01

  A "capture manifest" is one JSON file in the watch dir describing one raw
  artifact (see manifest_example.json). The phone drops manifests; the Pi turns
  each into a row and appends. Raw bytes stay where they are; the Pi only needs
  read access to hash + read exif.

  safety check · security check · transparency check
  :<477>=-
"""

from __future__ import annotations

import json
import os
import sys
import time

import spine_core as core
from spine_ledger import Ledger

SHEET_ID = os.environ["SPINE_SHEET_ID"]
RANGE = "capture_log!A1"
DEVICE = os.environ.get("SPINE_DEVICE", "pi-test-01")
WATCH = os.environ["SPINE_WATCH"]
POLL_S = float(os.environ.get("SPINE_POLL_S", "2"))


def sheets_service():
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    creds = service_account.Credentials.from_service_account_file(
        os.environ["SPINE_SA_KEY"],
        scopes=["https://www.googleapis.com/auth/spreadsheets"],
    )
    return build("sheets", "v4", credentials=creds, cache_discovery=False)


def append_values(svc, values: list) -> dict:
    return svc.spreadsheets().values().append(
        spreadsheetId=SHEET_ID,
        range=RANGE,
        valueInputOption="USER_ENTERED",
        insertDataOption="INSERT_ROWS",
        body={"values": [values]},
    ).execute()


def manifest_to_capture(m: dict) -> core.Capture:
    return core.Capture(
        raw_ref=m["raw_ref"],
        raw_path=m["raw_path"],
        media_kind=m["media_kind"],
        captured_at=m["captured_at"],
        exif=m.get("exif", {}),
        live_track=m.get("live_track"),
        timeline=m.get("timeline"),
    )


def main() -> int:
    places = core.load_my_maps(os.environ["SPINE_MAPS"])
    ledger = Ledger(os.environ.get("SPINE_LEDGER", "ledger.jsonl"))
    svc = sheets_service()
    print(f"[pi1-test] watching {WATCH} -> Sheet {SHEET_ID} as {DEVICE}")

    while True:
        for fn in sorted(os.listdir(WATCH)):
            if not fn.endswith(".json"):
                continue
            fp = os.path.join(WATCH, fn)
            try:
                with open(fp, "r", encoding="utf-8") as f:
                    m = json.load(f)
            except json.JSONDecodeError:
                continue  # still being written; pick it up next sweep

            row = core.build_row(manifest_to_capture(m), DEVICE, places)
            if ledger.seen(row["raw_sha256"]):
                os.replace(fp, fp + ".done")  # already landed; clear it
                continue

            append_values(svc, core.row_to_values(row))
            ledger.record(row)
            os.replace(fp, fp + ".done")
            print(f"[pi1-test] appended {row['row_id']} "
                  f"({row['media_kind']}, {row['gps_source']}, "
                  f"place={row['place_name']})")
        time.sleep(POLL_S)


if __name__ == "__main__":
    sys.exit(main() or 0)
