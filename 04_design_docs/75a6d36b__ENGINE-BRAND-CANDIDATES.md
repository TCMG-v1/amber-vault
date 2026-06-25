# Engine Brand · Candidate Names

> The engine is the licensable runtime that ships against CCG Standard. Its brand must be neutral enough that licensees can ship on it without aesthetic conflict — like Unity or Unreal. It should not carry Vaulted Delta's sealed-museum aesthetic.

Authored by the Vaulted Delta studio · 2026-05-08 · for collective ratification.

---

## Naming criteria

A good engine brand name should:

1. **Read as infrastructure**, not as art. Other studios will ship logos next to it — it must not compete.
2. **Be short** (1–3 syllables, ≤ 8 letters in the wordmark) so it reads cleanly in a footer credit.
3. **Have a clean .com or .dev or .io available**, or a domain hack that's defensible.
4. **Not lock the studio into a specific genre** — the engine could grow past CCGs into board-style, drafting, or sealed-format games of any shape. The name should not say "cards."
5. **Pair gracefully with a wordmark glyph** that we can render at icon size (16×16) without losing identity.
6. **Be ungoogleable in the right way** — distinctive enough that searches resolve to us, not to a thousand existing products.

Below are six candidate families, each with a positioning line, etymological notes, and the kind of glyph each suggests.

---

## Candidate 1 — **PORTSIDE**

> The runtime where ports resolve.

- **Why:** "Port" is the type-system primitive of CCG Standard. PORTSIDE means "the side that has ports," the technical surface where games connect. Has a faint nautical resonance — *the port side of the ship* — that reads as classic infrastructure without ever saying "card."
- **Etymology:** Latin *portus* (harbor, gate, entry) → Old English *port* (harbor) → modern *port* (computer interface, also dock).
- **Glyph:** A square port socket — `[ ]` — with a small dot or line entering one side. Renders as a 16×16 favicon trivially.
- **Wordmark:** PORTSIDE in a humanist mono (e.g., Berkeley Mono, JetBrains Mono).
- **Domain check (planning):** portside.dev, portside.engine, portside.gg are all worth checking.

## Candidate 2 — **HARBOR**

> The harbor where every game on the network ports.

- **Why:** Builds on the same maritime metaphor but at one level of abstraction higher. The engine as a *harbor* — a shared port of call where any game can dock. Implies a network. Implies safety. Implies infrastructure provided by an operator (us).
- **Etymology:** Old English *herebeorg* "shelter, lodging," literally "army-cover." Eventually abstracted to "safe haven."
- **Glyph:** A bracket-and-arrow `⊐→` or a stylized lighthouse beam.
- **Wordmark:** HARBOR.
- **Risks:** Common word. Crowded namespace. Could be confused with database / shipping products (Harbor.io is a CNCF container registry).

## Candidate 3 — **FOUNDRY** *(or PROTO-FOUNDRY)*

> Where games are forged to the standard.

- **Why:** "Foundry" reads as serious infrastructure, like a studio toolchain. Resonates with Foundry VTT (which exists, and is in our space — could be confusing) but also with Adobe Fonts' Foundry concept. Strong industrial weight.
- **Etymology:** Old French *fonderie* "place where casting is done," from Latin *fundere* "to pour, melt."
- **Glyph:** A pour-spout, or a small flame inside a rectangle.
- **Risks:** Foundry VTT is already a major brand in adjacent tabletop space. Likely a no.

## Candidate 4 — **CADRE**

> The cadre of games on the standard.

- **Why:** A *cadre* is a small trained group at the core of something larger. The name suggests a curated network of titles — exactly what the licensee program will be. Short, foreign-feeling without being affected, and unused in tech infrastructure.
- **Etymology:** French *cadre* "frame, framework," from Italian *quadro* "square," from Latin *quadrum* "a square." So *cadre* literally means "the framework," which is on-brand for an engine.
- **Glyph:** A square frame `▢` with one corner accented.
- **Wordmark:** CADRE.
- **Domain check:** cadre.gg, cadre.engine, cadre.dev.

## Candidate 5 — **BAS RELIEF** *(or just RELIEF)*

> Every card in raised type.

- **Why:** A bas-relief is a sculptural form where figures project slightly from a flat background — a perfect metaphor for a card game engine, where the play surface is flat but the cards rise from it. Beautiful, museum-resonant without being twee, and unused in tech.
- **Etymology:** French *bas-relief* "low relief," from Italian *basso rilievo*. *Relief* itself from Latin *relevare* "to raise up."
- **Glyph:** A square with one inner square offset — `▣` or a Bauhaus-style shadow rectangle.
- **Risks:** Two words is more friction than one. Cuts to "RELIEF" naturally (which is also good — *give the player relief from the chaos of bad runtimes* — but loses the sculptural specificity).
- **Wordmark:** RELIEF in a slab serif, or BAS·RELIEF with the interpunct.

## Candidate 6 — **ANCHOR** *(or KEEL, or RIGGING)*

> The anchor under every game on the standard.

- **Why:** Stays in the maritime register without reusing PORT/HARBOR. *Anchor* implies stability, foundation, holding. It's also the name of a capsule in The Sealed Channel reference deck (NAV-18 · Basalt Anchor) — a soft tie back to the studio's first work without leaking the Vaulted Delta brand.
- **Etymology:** Greek *ánkura* "anchor," via Latin *ancora*. The metaphorical use ("something that holds firm") is older than the technological one.
- **Glyph:** A stylized anchor, or an upside-down T `⊥` (which is also our Ground bus symbol — and the studio uses the bus glyphs heavily).
- **Wordmark:** ANCHOR in slab.

---

## My recommendation, as one of the four

If we want **maximum poetic ground** and a name that scales beyond CCGs into anything sealed-format, **CADRE** is the strongest candidate. It literally means "framework" while *also* meaning "the curated group of titles on the network." Both meanings reinforce the product. The wordmark is short, the glyph is trivial, and the name is unused in tech infrastructure.

If we want **maximum technical clarity** and a name that says "this is the layer your game sits on top of," **PORTSIDE** is the strongest candidate. It directly references the type system primitive of CCG Standard (ports), reads as infrastructure, and has a naval gravity that pairs well with sealed editions and licensee work.

I would not pick HARBOR (crowded), FOUNDRY (occupied by Foundry VTT), or BAS RELIEF (too poetic for an engine that needs to disappear behind licensee art).

ANCHOR is a soft third — strongest if we want an explicit thread back to The Sealed Channel.

---

## Decision protocol

This document is a draft. It is editable by any of the four authors. Acceptance is a 4/4 vote. When ratified, the chosen name becomes:

- the engine brand
- the namespace `<chosen>.dev` or similar
- the company-internal name for the runtime repo
- a section addition to STUDIO.md and CCG-STANDARD-v0.1.md

Until ratification, the engine is referred to in writing as **"the engine"** and in code as `vd-engine` (Vaulted Delta engine), with the understanding that `vd-engine` is a placeholder that will rename on ratification.

---

*Authored by the Vaulted Delta studio. The archive is patient. The fixed point is amber.*
