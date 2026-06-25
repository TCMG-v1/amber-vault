# Pi Provisioning — test rig vs prod rig

Two rigs, one Sheet. Pi #1 proves the spine; Pi #2 is the production appliance.
Both run the same `spine_core` row builder — only the append path differs.

---

## Pi #1 — TEST rig (`pi-test-01`)

Goal: get one real capture into the live Sheet, confirm the append discipline,
then stop touching it. "first is just test."

- **OS:** Whatever Pi you already have flashed is fine — this rig is disposable.
  If flashing fresh, use **Raspberry Pi OS Lite (64-bit)** (see prod note below).
- **Auth:** a Google **service-account JSON key on the Pi**. Simplest path, no edge.
  1. In Google Cloud console: create a service account, enable the Sheets API,
     download its JSON key to the Pi as `~/spine/sa.json`.
  2. Share **Sheet 1** with the service account's email (Editor). The Sheet id is
     `1nI7L24ASbnP1WbPJPINjnRweY_n3sSsmK71XuOhwY8M`.
- **Run:**
  ```bash
  pip install google-api-python-client google-auth
  export SPINE_SA_KEY=~/spine/sa.json
  export SPINE_SHEET_ID=1nI7L24ASbnP1WbPJPINjnRweY_n3sSsmK71XuOhwY8M
  export SPINE_MAPS=~/spine/my_maps.json
  export SPINE_WATCH=~/spine/inbox
  export SPINE_LEDGER=~/spine/ledger.jsonl
  export SPINE_DEVICE=pi-test-01
  mkdir -p ~/spine/inbox
  python3 append_test_pi1.py
  ```
- Drop a capture manifest (see `pi/manifest_example.json`) into `~/spine/inbox`.
  Watch the row land in Sheet 1. That's the whole test.

---

## Pi #2 — PROD rig (`pi-prod-02`) — exact OS recommended

**Recommended OS: Raspberry Pi OS Lite (64-bit), Bookworm — Legacy track.**

Reasoning, lab-honest:

- As of **18 June 2026**, the *current* Raspberry Pi OS moved to **Debian 13
  (Trixie)**; **Bookworm (Debian 12)** is now the **Legacy** track
  ([Raspberry Pi OS downloads](https://www.raspberrypi.com/software/operating-systems/)).
  For an always-on appliance you want the track that's been hammered on, not the
  fresh one. Pin to **Bookworm 64-bit Lite** until Trixie has a few months of
  field time, then re-flash.
- **Lite, not Desktop** — a prod appender has no business running a compositor.
  Raspberry Pi's own docs recommend **Lite** for headless setups, with SSH /
  Raspberry Pi Connect only ([Getting started](https://www.raspberrypi.com/documentation/computers/getting-started.html)).
- **64-bit, not 32** — Pi 5 is 64-bit only, and modern Python wheels + any future
  on-device ML assume arm64 ([Bookworm announcement](https://www.raspberrypi.com/news/bookworm-the-new-version-of-raspberry-pi-os/)).
- **Caveat for the imaging/AI limb:** if a prod rig carries a **Hailo AI HAT**,
  it is **not Trixie-compatible at launch — stay on Bookworm** regardless
  ([Raspberry Pi OS 2026 notes](https://raspberryparatorpes.net/sistemas-operativos/raspberry-pi-os-2026/)).
  Bookworm-Legacy is the safe default for the whole tandem fleet.

Flash with **Raspberry Pi Imager**: choose *Raspberry Pi OS (other)* →
*Raspberry Pi OS Lite (Legacy, 64-bit)*. In Imager's settings, preset hostname,
SSH key, Wi-Fi, and locale so it comes up headless on first boot.

- **Auth:** NO Google key on the rig. The Pi posts the finished row to the
  **pplxstudio edge** (`l-lts.ai`), which holds the Google secret server-side —
  same key-server-side posture as the brain. If a prod rig is lost, you rotate
  one edge bearer token, not a Google key.
- **Run as a service (survives reboots):**
  ```bash
  # no pip deps — prod path is stdlib-only urllib
  export SPINE_EDGE=https://l-lts.ai/api/spine/append
  export SPINE_EDGE_TOKEN=<per-rig bearer minted by the edge>
  export SPINE_MAPS=~/spine/my_maps.json
  export SPINE_WATCH=~/spine/inbox
  export SPINE_LEDGER=~/spine/ledger.jsonl
  export SPINE_DEVICE=pi-prod-02
  python3 append_prod_pi2.py
  ```
  Wrap in a `systemd` unit (`spine-appender.service`, `Restart=always`) so it
  resumes after power loss — the local ledger makes resume idempotent.

---

## All three auth paths, mapped to your "all 3 need exact OS" answer

| Path | Who holds the Google key | Rig | When |
|------|--------------------------|-----|------|
| **Service-account direct** | the Pi (`sa.json`) | Pi #1 test | proving the spine, single rig |
| **pplxstudio edge** | the edge Worker (server-side) | Pi #2 prod + tandem fleet | production, many rigs, key never on a rig |
| **Connector target** | you, via Computer's Google connection | n/a — Computer creates/reads Sheet 1 | setup + inspection (already used to build Sheet 1) |

The connector path is how Sheet 1 itself got created and how Computer reads it
back for the inspector view — it is not a per-rig runtime path.

_safety check · security check · transparency check_

:<477>=-
