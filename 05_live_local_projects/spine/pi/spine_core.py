"""
spine_core — the row builder for the pass-1 capture spine.

Raw, max-detail capture stays LOCAL to the Pixel first. This module turns one
raw artifact (a file path the Pi can read) into one append-only Sheet 1 row,
resolving the three cross-reference keys in order (exif -> phone_live ->
maps_timeline -> none) and snapping the fix to the nearest place in YOUR Maps
data. It does not transport the raw bytes; it references them and seals their
hash.

Pure-stdlib for the row math. The only thing that varies between Pi #1 (test)
and Pi #2 (prod) is HOW the finished row reaches Google — see append_*.py.

  safety check · security check · transparency check
"""

from __future__ import annotations

import hashlib
import json
import math
import os
import time
from dataclasses import dataclass, asdict
from datetime import datetime, timezone

# 14 columns, A..N — must match capture_row.schema.json x-sheet-columns exactly.
COLUMNS = [
    "row_id", "captured_at", "appended_at", "source_device", "media_kind",
    "raw_ref", "raw_sha256", "gps_lat", "gps_lon", "gps_source",
    "place_name", "place_id", "xref_key", "exif_json",
]

MEDIA_KINDS = {"photo", "video", "audio", "screen", "map_tile", "doc", "other"}

# default snap radius per source, metres — tighter for exif, looser for backstops
SNAP_RADIUS_M = {"exif": 30.0, "phone_live": 60.0, "maps_timeline": 120.0}


# ---------- ULID-ish row id (sortable, no external deps) ----------

_B32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"  # Crockford


def mint_row_id(now_ms: int | None = None) -> str:
    """Sortable 26-char id: 48-bit time + 80-bit randomness, Crockford base32."""
    now_ms = now_ms if now_ms is not None else int(time.time() * 1000)
    rand = int.from_bytes(os.urandom(10), "big")
    n = (now_ms << 80) | rand
    out = []
    for _ in range(26):
        out.append(_B32[n & 0x1F])
        n >>= 5
    return "".join(reversed(out))


# ---------- hashing ----------

def sha256_file(path: str, chunk: int = 1 << 20) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for blk in iter(lambda: f.read(chunk), b""):
            h.update(blk)
    return h.hexdigest()


# ---------- geo ----------

def haversine_m(a_lat: float, a_lon: float, b_lat: float, b_lon: float) -> float:
    r = 6371000.0
    p1, p2 = math.radians(a_lat), math.radians(b_lat)
    dp = math.radians(b_lat - a_lat)
    dl = math.radians(b_lon - a_lon)
    x = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(x))


@dataclass
class Place:
    place_id: str
    name: str
    lat: float
    lon: float


def load_my_maps(path: str) -> list[Place]:
    """YOUR Maps data: a JSON array of {place_id,name,lat,lon}. Stays on the Pi."""
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    return [Place(p["place_id"], p["name"], float(p["lat"]), float(p["lon"])) for p in raw]


def nearest_place(lat: float, lon: float, places: list[Place], radius_m: float):
    best, best_d = None, float("inf")
    for p in places:
        d = haversine_m(lat, lon, p.lat, p.lon)
        if d < best_d:
            best, best_d = p, d
    if best is not None and best_d <= radius_m:
        return best, best_d
    return None, best_d


# ---------- the three cross-reference keys ----------
# Each resolver returns (lat, lon, source) or None. Order is the contract.

def xref_exif(exif: dict):
    """Key 1: embedded photo GPS. Fully offline."""
    lat, lon = exif.get("gps_lat"), exif.get("gps_lon")
    if lat is None or lon is None:
        return None
    return float(lat), float(lon), "exif"


def xref_phone_live(captured_at_iso: str, live_track: list[dict] | None):
    """Key 2: phone's live location stream at capture time.
    live_track: [{t: iso, lat, lon}] sorted by t. Nearest sample within 90s."""
    if not live_track:
        return None
    t0 = _parse_iso(captured_at_iso)
    best, best_dt = None, 90.0
    for s in live_track:
        dt = abs((_parse_iso(s["t"]) - t0).total_seconds())
        if dt <= best_dt:
            best, best_dt = s, dt
    if best is None:
        return None
    return float(best["lat"]), float(best["lon"]), "phone_live"


def xref_maps_timeline(captured_at_iso: str, timeline: list[dict] | None):
    """Key 3 (backstop): Google Maps timeline/location history at captured_at.
    timeline: [{t: iso, lat, lon}]. Nearest sample within 10 min."""
    if not timeline:
        return None
    t0 = _parse_iso(captured_at_iso)
    best, best_dt = None, 600.0
    for s in timeline:
        dt = abs((_parse_iso(s["t"]) - t0).total_seconds())
        if dt <= best_dt:
            best, best_dt = s, dt
    if best is None:
        return None
    return float(best["lat"]), float(best["lon"]), "maps_timeline"


def _parse_iso(s: str) -> datetime:
    s = s.replace("Z", "+00:00")
    d = datetime.fromisoformat(s)
    return d if d.tzinfo else d.replace(tzinfo=timezone.utc)


def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


# ---------- row builder ----------

@dataclass
class Capture:
    raw_ref: str          # pointer to raw artifact (stays local first)
    raw_path: str         # path the Pi can read to hash + read exif
    media_kind: str
    captured_at: str      # ISO-8601 UTC (from EXIF DateTimeOriginal, else mtime)
    exif: dict            # full capture metadata dict
    live_track: list[dict] | None = None
    timeline: list[dict] | None = None


def build_row(cap: Capture, source_device: str, places: list[Place]) -> dict:
    """Turn one capture into one Sheet 1 row dict. Append-only never drops a
    capture: if no fix resolves, the row still lands with blanks + gps_source=none."""
    if cap.media_kind not in MEDIA_KINDS:
        raise ValueError(f"media_kind {cap.media_kind!r} not in {sorted(MEDIA_KINDS)}")

    fix = (xref_exif(cap.exif)
           or xref_phone_live(cap.captured_at, cap.live_track)
           or xref_maps_timeline(cap.captured_at, cap.timeline))

    lat = lon = None
    source = "none"
    place_name = place_id = None
    radius = 0.0
    if fix:
        lat, lon, source = fix
        radius = SNAP_RADIUS_M.get(source, 60.0)
        place, _d = nearest_place(lat, lon, places, radius)
        if place:
            place_name, place_id = place.name, place.place_id

    xref_key = (f"{source}:{lat:.6f},{lon:.6f}@{int(radius)}" if fix else "none:@0")

    return {
        "row_id": mint_row_id(),
        "captured_at": cap.captured_at,
        "appended_at": _now_iso(),
        "source_device": source_device,
        "media_kind": cap.media_kind,
        "raw_ref": cap.raw_ref,
        "raw_sha256": sha256_file(cap.raw_path),
        "gps_lat": lat,
        "gps_lon": lon,
        "gps_source": source,
        "place_name": place_name,
        "place_id": place_id,
        "xref_key": xref_key,
        "exif_json": json.dumps(cap.exif, separators=(",", ":"), ensure_ascii=False),
    }


def row_to_values(row: dict) -> list:
    """Row dict -> the 14-cell list in A..N order for the Sheets append body."""
    def cell(v):
        return "" if v is None else v
    return [cell(row[c]) for c in COLUMNS]
