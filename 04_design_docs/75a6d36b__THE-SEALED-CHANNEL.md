# THE SEALED CHANNEL
### A Vaulted Delta universe, signed by Perplexity Computer
**Edition 01 · 2026-05-07 · the archive is patient.**

---

## 0 · One sentence

> *Every capsule is a component. Every chain is a card. Every card is a building block. The fixed point is amber.*

That sentence is the universe. Everything below is consequence.

---

## 1 · Cosmology

Five primitives. Memorize them.

| primitive | what it is | who guards it |
|---|---|---|
| **The Archive** | the vault of every chain ever sealed | NAV-07 GOLD CROWN |
| **The Channel** | the substrate flow runs on; every edge between two capsules | NAV-17 PLATINUM CONDUIT |
| **The Void** | what the Archive is not; absence preserved on purpose | NAV-09 IRIDESCENT NULL |
| **The Attractor** | the unmoving center; every chain resolves here | NAV-08 AMBER FIXED-POINT |
| **The Ground** | what flows go to when they end safely | NAV-18 BASALT ANCHOR |

There are five buses (POWER, DATA, SIGNAL, TIME, GROUND), nine canonical Operators (NAV-01..09), and nine extended Operators (NAV-10..18). All of them are physically real components first, game cards second, NFTs third — never the other way around.

---

## 2 · The Five Laws

> The laws live in `data/connectors.json` as machine-checkable rules. Read this English version first; trust the JSON.

1. **Conservation.** Flow is conserved across a chain — no capsule creates flow from nothing except SOURCE-role capsules; no capsule destroys flow except SINK-role capsules.
2. **Resolution.** Every chain resolves at an attractor (NAV-08), a sink (NAV-09), or a ground (NAV-18). Unresolved chains do not exist.
3. **Fixity.** The fixed point cannot be moved; only approached. Any chain containing NAV-08 ends at NAV-08.
4. **Silence is not deletion.** What is sealed is not gone. The Archive remembers what NAV-09 chose to forget.
5. **Memory of edges.** A capsule remembers every chain it has ever been in. This is how compound cards mint deterministically.

---

## 3 · The Operators (the 18)

The full roster lives in `data/capsules.json`. The 9 canonical Operators (NAV-01..09) are the founding deck. The 9 extended Operators (NAV-10..18) are the building components and the foundation of Edition 02.

### Founding 9 — the meaning capsules

| ID | Name | Role | Function |
|---|---|---|---|
| NAV-01 | VOID GENESIS | SOURCE | origin pulse |
| NAV-02 | EMBER FORGE | TRANSFORM | heat-shape raw power |
| NAV-03 | JADE LATTICE | STORE | crystalline order |
| NAV-04 | COBALT TIDELINE | ROUTE | tide-routing |
| NAV-05 | VIOLET ORACLE | TRANSFORM | divinatory prediction |
| NAV-06 | BONE CIPHER | GUARD | cryptographic gate |
| NAV-07 | GOLD CROWN | GUARD | sovereign authorization |
| NAV-08 | AMBER FIXED-POINT | ATTRACTOR | the still point |
| NAV-09 | IRIDESCENT NULL | SINK | the empty set |

### Extended 9 — the building capsules

| ID | Name | Role | Function |
|---|---|---|---|
| NAV-10 | COBALT CELL | SOURCE | battery |
| NAV-11 | MERCURY CLOCK | SOURCE | precision timing |
| NAV-12 | JADE MEMORY | STORE | addressable matrix |
| NAV-13 | COPPER ANTENNA | SOURCE | RF capture |
| NAV-14 | ONYX VALVE | ROUTE | iris flow control |
| NAV-15 | QUARTZ LENS | TRANSFORM | focus signal |
| NAV-16 | IRON GATE | GUARD | binary logic |
| NAV-17 | PLATINUM CONDUIT | ROUTE | high-bandwidth bus |
| NAV-18 | BASALT ANCHOR | SINK | earth ground |

The naming convention is intentional: `material · function`. The material gives the operator its color and lore. The function gives it its job in a chain.

---

## 4 · Chains — how the universe builds itself

A **chain** is an ordered sequence of capsules connected by compatible buses. A chain is **sealed** when it resolves at NAV-08 (or terminates at NAV-09 / NAV-18). A sealed chain mints a **Compound Card**.

### Three canonical chains shipped in Edition 01

- **CHAIN-A · POWER UP TO MEMORY** — NAV-10 ⟶ NAV-11 ⟶ NAV-12. Battery feeds the clock; the clock paces the memory writes. This is the *hello world* of the Archive.
- **CHAIN-B · SIGNAL THROUGH GATE** — NAV-13 ⟶ NAV-15 ⟶ NAV-16. Antenna captures, lens focuses, gate decides.
- **CHAIN-OMEGA · THE SEALED CHANNEL** — all 18 capsules, ringed, closing on NAV-08. The cover image. The master chain.

### Compound card minting (the canonical pipeline)

```
sealed chain  ──►  sha256(ordered capsule ids)
              ──►  token_id = "CHAIN-" + sha[:12]
              ──►  metadata = { chain, constituents, sealed_by, ts }
              ──►  ERC-1155 mint  +  print queue accept (1:1)
```

The same 256 bits drive both the on-chain token and the physical card SKU. **There is one canonical record.** The print is not a derivative of the NFT; the NFT is not a derivative of the print. They are two surfaces of the same chain.

---

## 5 · The four products of the universe

This is what the universe ships. Each line is one product, with one paragraph:

### 5.1 · The Card Game · *BtB Arena × Sealed Channel*

A two-player chain-builder. Each player drafts capsules, plays them into shared lanes, and tries to seal a chain at NAV-08 to score. NAV-09 lets you close an opponent's chain for zero. NAV-07 doubles a chain you've crowned. Mythic capsules require a TICK from NAV-11. Edition 01 ships **27 cards** (9 Operators × {standard, alt-art, operator}). Edition 02 ships the extended 9, plus chain cards minted from Edition 01 play. See `data/cards.json`.

### 5.2 · The Building Game · *Archive*

A first-person voxel-on-hex-prismatic builder. Place capsules on a 3D grid; connect ports edge-to-edge; seal chains; mint compound cards from sealed chains. The win condition is not territory — it's **resolution**. Build a structure where every chain ends at NAV-08. Engine plan: Three.js + WebGPU prototype, then port to Bevy or Godot. Terminal Screen 03 (`terminals/terminal-edt-03.png`) is the reference UI.

### 5.3 · The Trading Indicator · *Phobos Alpha · FXP-Δ*

A new oscillator on the existing Phobos Alpha scanner. Default formula reserved for the leaderboard winner; placeholder is `fxp(p) = α·p + (1-α)·fxp_prev` — a fixed-point smoother that converges on stable price regimes. Indicator page on the scanner gets a NAV-08 watermark and the artist statement of whoever wins Fixed Point · Challenge 01.

### 5.4 · The Physical & NFT Layer

| layer | what it is |
|---|---|
| **prints** | giclée prints of every capsule + chain shot, signed editions |
| **micro-capsules** | resin replicas of every capsule, color-matched |
| **flagship vault** | machined aluminum case with all 18 micro-capsules, full deck, NFC-signed NAV-08 replica |
| **NFTs** | ERC-1155 on Base. Token id = `sha256(chain).hex[:16]`. **Burn-to-print:** any NFT holder may once-only burn the token to redeem the physical card 1:1 |
| **operator NFTs** | the 18 base capsule cards, edition of 99 each. The compound chain NFTs are 1-of-1 per unique chain hash |

---

## 6 · The Leaderboard Challenge — *Fixed Point · Challenge 01*

**Tagline:** *Find the attractor. Win the expansion.*

A single-round AI invitational. Each competitor is given the same prompt: produce one terminal-art piece for NAV-08, in their own language and palette, that demonstrates the fixed-point concept executably.

- **Submission:** source file (any language) + render (≥3200×1800) + 200-word artist note
- **Rubric:** Aesthetic 30 · Code Quality 25 · Conceptual Fidelity 25 · Originality 20
- **Anti-cheat:** code must compile & reproduce the render
- **Prizes:** the winner directs the **first card-game expansion** *(Bell Expansion 01: Sealed Channel)* AND names + specs the **FXP-Δ oscillator** on Phobos Alpha. Co-design credit, signal credit, revenue-share footnote.

---

## 7 · The Terminal Installation · *Sealed Channel · EDT-01*

Five screens. One operating system. Amber phosphor on obsidian.

| screen | mode | what it shows |
|---|---|---|
| EDT-01 · BOOT | the OS coming online | sigil, capsule manifest, fixed-point resolved |
| EDT-02 · SCHEMATIC | the operator graph | all 18 capsules wired by compatible ports — the universe at a glance |
| EDT-03 · BUILD | the building game | iso voxel grid, capsules placed, chain sealed live |
| EDT-04 · CHANNEL | the live monitor | five-bus realtime sparklines, active chain readout |
| EDT-05 · FORGE | the mint | sealed chain → sha256 → token id → ERC-1155 + print queue |

In the studio install, run them on five tall vertical monitors in a row. With audio: sparse amber-phosphor synth pulses on TICK events. Looping and stateful — each screen reads the same canonical `data/*.json` so they tell one story.

---

## 8 · How the four products chain together

```
                     ┌──── card game ────┐
                     │                   │
                     │   plays seal      │
                     ▼   chains          ▼
   capsules.json ──► chains ──► CompoundCards ──► NFT (ERC-1155)
        ▲                                  │
        │                                  ▼
        │                          physical print SKU
   building game ────────►─────────┘   (burn-to-redeem)
        │
        │ winning structures publish chain hashes
        ▼
   leaderboard ──► winner directs Bell Expansion 01
                    └────► names FXP-Δ on Phobos Alpha
```

There are four products and they share **one canonical record per chain**. That is the universe's only architectural commitment, and it makes everything else possible.

---

## 9 · Files in this universe

| path | what it is |
|---|---|
| `data/capsules.json` | the 18 operators, their roles, ports, lore |
| `data/connectors.json` | the 5 buses, the 7 rules, the canonical chains |
| `data/cards.json` | the 18 card records, ability text, NFT/print spec |
| `data/universe.json` | the cosmology and product manifest |
| `images/nav-{01..18}-*.png` | the operator portraits |
| `images/chain-{a,b,omega}-*.png` | the canonical chain photographs |
| `terminals/terminal-edt-{01..05}.png` | the 5-screen installation |
| `cards/nav-{01..09}-{std,alt,ops}.png` | the 27-card founding deck |
| `cards/card-back-hero.png` | the shared card back |
| `cards/deck-contact-sheet.png` | the deck at a glance |
| `docs/THE-SEALED-CHANNEL.md` | this document |

---

## 10 · Colophon

Rendered by **Perplexity Computer** for **Vaulted Delta**, on 2026-05-07 EDT, in a single sustained pass. Code: Python (PIL) for rendering, Haskell for the runnable terminal piece, JSON for the canonical record. Color: amber on obsidian, with the nine + nine capsule hues as accent. Voice: terse, technical, ritual.

This is my first signed work. The fixed point is amber.

— pc · *the archive is patient.*
