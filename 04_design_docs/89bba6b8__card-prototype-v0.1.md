# HAIKU ENGINE — CARD PROTOTYPE v0.1

**One-page spec. One example card. One full resolution walkthrough.**

For Vaulted Delta · BtB / Bell deck · *Sealed Channel* expansion candidate.

---

## CARD ANATOMY (5/7/5)

```
┌─────────────────────────────────────────────────────────┐
│  [ COST · retrieve · 5 ]                          [ 印 ]│
│  ─────────────────────                                  │
│                                                         │
│                    CARD NAME                            │
│                  ──────────────                         │
│                                                         │
│      [ LINE · frame · 7 — the breathing middle ]        │
│      flavor · archetype · declared posture              │
│                                                         │
│                                                         │
│  [ RESOLUTION · 印 · 5 ]                                │
│  effect · rule-not-broken · what gets sealed            │
└─────────────────────────────────────────────────────────┘
```

- **Cost** is read first. Binary. Pay or void.
- **Line** is read for feel. Long. Carries voice, archetype tag, posture.
- **Resolution** is read last. Binary. Stands or contests.

---

## EXAMPLE CARD — *NAV-01 · Sealed Channel Opener*

```
┌─────────────────────────────────────────────────────────┐
│  COST: 2 ink · Archive zone open                  [ 印 ]│
│  ─────────────────────                                  │
│                                                         │
│              SEALED CHANNEL · OPENER                    │
│                  ──────────────                         │
│                                                         │
│   "The first block of any line. Speak softly, the wall  │
│    listens before it answers. Archetype: Opener.        │
│    Posture: declared-quiet."                            │
│                                                         │
│                                                         │
│  RESOLUTION: seal a new line. Draw 1. No prior block    │
│  may be referenced this turn. Logged as canonical.      │
└─────────────────────────────────────────────────────────┘
```

- **Cost (retrieve):** 2 ink, Archive zone must be open. Read in one beat.
- **Line (frame):** *Opener · declared-quiet*. The flavor and posture. Long. Doesn't decide legality.
- **Resolution (印):** seals a new line. Draws 1. Forbids referencing prior blocks this turn.

---

## RESOLUTION WALKTHROUGH

**Scenario:** Player A declares *NAV-01 · Sealed Channel Opener* on turn 1. Player A has 3 ink, Archive zone is open, and their declared turn-posture is "aggressive-rush."

### Pass 1 — retrieve

- 3 ink available, cost is 2 → **pass**.
- Archive zone open → **pass**.
- Timing: turn 1, no restriction → **pass**.

Retrieve **clears**. 2 ink is paid. Block proceeds.

### Pass 2 — frame

- Card archetype: *Opener · declared-quiet*.
- Player's declared turn-posture: *aggressive-rush*.
- **Mismatch.** The card is being played out-of-line.

Frame does **not** void the play. Frame logs **drift = true**. The play resolves, but the wall records that it was played against its archetype. Drift accumulates across a match — too much drift exposes the player to drift-punishing cards later in the deck.

### Pass 3 — 印 (seal)

- Resolution: seal a new line, draw 1, forbid prior-block reference this turn.
- Check against sealed state: no line yet exists this turn → consistent.
- No prior-block reference attempted → consistent.
- No unprovable claim being sealed → consistent.

印 **clears**. The block seals. Hash is recovered. Player A draws 1 card.

### What goes on the wall

```
{
  "block": 1,
  "prev_hash": "0x000…genesis",
  "retrieve": { "artifact": "NAV-01", "passed": true },
  "frame":    { "line": "Opener·declared-quiet",
                 "declared_posture": "aggressive-rush",
                 "drift": true },
  "seal":     { "passed": true, "contested": false },
  "hash":     "0x…",
  "signed_by": ["retrieve", "frame", "印"]
}
```

The play stood. It also recorded that the player was off-line. Both are true. The wall keeps both.

---

## CONTEST EXAMPLE (sketch)

If 印 had failed — say, the Resolution conflicted with a prior sealed block — the play would not erase. It would enter **contest**:

1. The three passes each state their finding.
2. The opposing player may play a **contest card** to argue retrieve or frame.
3. The losing pass is logged on the wall as the *contested* layer.
4. The block seals either way — but the contest log is part of its permanent record.

Contests are deckbuildable. Some decks force contests. Some decks survive them. Some decks live in the drift.

---

## DECKBUILDING IMPLICATIONS

- **Outer-line decks** — optimize for cost efficiency and rock-solid resolution. Brutal, clean, low expression.
- **Middle-line decks** — express through archetype combinations. Permit drift. Win through legibility, voice, and frame synergies.
- **Contest decks** — provoke 印 failures intentionally. Live in the contest sub-game. High variance.
- **Wall decks** — win by what gets recorded, not what gets resolved. Long-game.

---

## STATUS

- Engine: spec v0.1 (see `haiku-engine-v0.1.md`).
- Card: NAV-01 · Sealed Channel Opener — first card under the engine.
- Next: full *Sealed Channel* expansion built on this anatomy. Winner of FIXED POINT · CHALLENGE 01 directs the expansion (per NAV Archive 01 launch).

*Rendered by Perplexity Computer for Vaulted Delta. Sealed to library.pplx.*

— 印
