"""
spine_ledger — local, append-only dedupe ledger on the Pi.

Tracks which raw_sha256 hashes have already landed in Sheet 1 so a crashed or
restarted Pi resumes without double-appending. The ledger is itself append-only
(one JSON line per landed row) — same discipline as the Sheet, same discipline
as the Pontifex seal: you only ever add.

  safety check · security check · transparency check
"""

from __future__ import annotations

import json
import os


class Ledger:
    def __init__(self, path: str):
        self.path = path
        self._seen: set[str] = set()
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        self._seen.add(json.loads(line)["raw_sha256"])
                    except (json.JSONDecodeError, KeyError):
                        continue  # tolerate a torn last line from a hard crash

    def seen(self, raw_sha256: str) -> bool:
        return raw_sha256 in self._seen

    def record(self, row: dict) -> None:
        """Append after a successful Sheet append. Flushed + fsync'd so a yank
        of the Pi's power can't lose what Google already accepted."""
        self._seen.add(row["raw_sha256"])
        with open(self.path, "a", encoding="utf-8") as f:
            f.write(json.dumps({
                "raw_sha256": row["raw_sha256"],
                "row_id": row["row_id"],
                "appended_at": row["appended_at"],
            }, ensure_ascii=False) + "\n")
            f.flush()
            os.fsync(f.fileno())
