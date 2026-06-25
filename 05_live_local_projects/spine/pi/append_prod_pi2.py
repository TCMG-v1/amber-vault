#!/usr/bin/env python3
"""
append_prod_pi2 — Pi #2 (PROD rig). Same row builder, key server-side.

The Pi holds NO Google credentials. It POSTs the finished row to the pplxstudio
edge (l-lts.ai), and the Worker — holding the Google service-account secret
server-side — does the actual append to Sheet 1. Same key-server-side posture
as the brain: nothing sensitive lives on the rig. This is the production tandem
path; many prod rigs can share one edge.

  Deps:  none beyond stdlib (urllib). Keeps the prod rig minimal.
  Env:   SPINE_EDGE=https://l-lts.ai/api/spine/append
         SPINE_EDGE_TOKEN=<per-rig bearer minted by the edge>   # NOT a Google key
         SPINE_MAPS=/home/pi/spine/my_maps.json
         SPINE_WATCH=/home/pi/spine/inbox
         SPINE_LEDGER=/home/pi/spine/ledger.jsonl
         SPINE_DEVICE=pi-prod-02

  The edge endpoint validates the bearer, re-validates the row against the
  schema, and appends with its own Google secret. The Pi never sees that secret
  — if a prod rig is lost, you rotate one edge token, not a Google key.

  safety check · security check · transparency check
  :<477>=-
"""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request

import spine_core as core
from spine_ledger import Ledger

EDGE = os.environ["SPINE_EDGE"]
TOKEN = os.environ["SPINE_EDGE_TOKEN"]
DEVICE = os.environ.get("SPINE_DEVICE", "pi-prod-02")
WATCH = os.environ["SPINE_WATCH"]
POLL_S = float(os.environ.get("SPINE_POLL_S", "2"))


def post_to_edge(row: dict) -> None:
    body = json.dumps({"columns": core.COLUMNS,
                       "values": core.row_to_values(row)}).encode("utf-8")
    req = urllib.request.Request(
        EDGE, data=body, method="POST",
        headers={"Content-Type": "application/json",
                 "Authorization": f"Bearer {TOKEN}"},
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        if resp.status not in (200, 201):
            raise RuntimeError(f"edge returned {resp.status}")


def manifest_to_capture(m: dict) -> core.Capture:
    return core.Capture(
        raw_ref=m["raw_ref"], raw_path=m["raw_path"],
        media_kind=m["media_kind"], captured_at=m["captured_at"],
        exif=m.get("exif", {}), live_track=m.get("live_track"),
        timeline=m.get("timeline"),
    )


def main() -> int:
    places = core.load_my_maps(os.environ["SPINE_MAPS"])
    ledger = Ledger(os.environ.get("SPINE_LEDGER", "ledger.jsonl"))
    print(f"[pi2-prod] watching {WATCH} -> edge {EDGE} as {DEVICE}")

    while True:
        for fn in sorted(os.listdir(WATCH)):
            if not fn.endswith(".json"):
                continue
            fp = os.path.join(WATCH, fn)
            try:
                with open(fp, "r", encoding="utf-8") as f:
                    m = json.load(f)
            except json.JSONDecodeError:
                continue

            row = core.build_row(manifest_to_capture(m), DEVICE, places)
            if ledger.seen(row["raw_sha256"]):
                os.replace(fp, fp + ".done")
                continue

            try:
                post_to_edge(row)
            except (urllib.error.URLError, RuntimeError) as e:
                # edge unreachable -> leave the manifest in place, retry next sweep.
                # append-only never drops a capture; it just waits.
                print(f"[pi2-prod] edge deferred {row['row_id']}: {e}")
                time.sleep(min(POLL_S * 4, 30))
                continue

            ledger.record(row)
            os.replace(fp, fp + ".done")
            print(f"[pi2-prod] landed {row['row_id']} via edge "
                  f"({row['media_kind']}, {row['gps_source']})")
        time.sleep(POLL_S)


if __name__ == "__main__":
    sys.exit(main() or 0)
