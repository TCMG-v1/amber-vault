# CCG Standard — Version 0.1

> A specification for collectible card games as composable, sealed, networked artifacts.
>
> Authored by the Vaulted Delta studio · 2026-05-08 · Edition 01

---

## Status of this document

This is **CCG Standard v0.1**, the first public draft. It is authored by the four-author Vaulted Delta studio (bmoreftw, Perplexity Computer, Claude, Anya) as the steering committee. It is intended for implementation by the Vaulted Delta engine and by third-party licensees who wish their games to be conformant to the standard.

This draft is normative where it uses the words **MUST**, **SHALL**, **REQUIRED**, **SHOULD**, **MAY** in the sense of [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

A conformant implementation is one that passes the conformance test suite (TBD, distributed alongside the reference engine). The first conformance demonstration of CCG Standard v0.1 is **The Sealed Channel · Edition 01**, sealed 2026-05-07.

---

## 1. Motivation

Most CCGs reinvent the same primitives: a card has stats, a deck has rules, a match has phases, a player has a wallet. Each studio invents a slightly incompatible flavor of the same idea, and the resulting fragmentation is the reason CCGs do not network the way games on a shared engine do.

CCG Standard exists to factor out the shared primitives into a single, precise, composable specification — so that:

1. **Studios can ship faster** by building on a runtime that already understands cards, decks, matches, sealed formats, draft formats, replays, leaderboards, and economies.
2. **Players can carry one identity** across every game built to the standard, with one wallet, one social graph, and one tournament stack.
3. **Cross-promotion becomes mechanical**, not marketing. A card from one game can appear in another's "from the network" panel because both games speak the same card schema.
4. **The CCG genre can have an open ground**, the way the web has HTML and the FPS world has the Quake protocol, instead of a thousand walled rules engines.

The standard is opinionated where opinionation buys composability and silent where opinionation would constrain creative design.

---

## 2. The cosmology

The standard models a CCG universe as **eight primitives**, in increasing scale:

```
Port → Bus → Capsule → Card → Chain → Deck → Match → Network
```

Each level admits the level below it as components. Each level is a typed, versioned, serializable artifact.

### 2.1 Port

A **port** is the smallest unit of connection. It has:

- a **bus** (one of the five canonical buses; see §2.2)
- a **direction** (`in` or `out`)
- a **polarity** (`source` or `sink`)
- a **rate** (a non-negative integer; the amount the port produces or consumes per tick)

Ports are the type system of the CCG cosmology. Two ports connect if and only if their buses match, their directions are opposite, and their rates agree.

### 2.2 Bus

There are exactly **five canonical buses** in CCG Standard v0.1:

| Bus | Symbol | Carries |
|---|---|---|
| Power | ⚡ | Energy / mana / ticks of action economy |
| Data | ◇ | Information, memory, knowledge |
| Signal | ∿ | Triggers, broadcasts, pings |
| Time | ⧗ | Temporal effects, delays, advances |
| Ground | ⊥ | Removal, grounding, sinks of last resort |

A conformant implementation **MUST** support all five buses. An implementation **MAY** define additional buses as extensions, prefixed with an `x-` namespace (e.g., `x-faith`, `x-radiation`). Extension buses are not portable across engines.

### 2.3 Capsule

A **capsule** is a typed primitive with an identical chassis and a distinct operator. It declares ports on the five buses and exposes an operator that resolves when its port-conditions are satisfied.

Capsules are the *atoms* of the standard. Cards are *molecules of capsules.* The Sealed Channel Edition 01 ships eighteen reference capsules (the canonical nine NAV-01..09 and the extended nine NAV-10..18); see [The Sealed Channel](https://vaulteddelta.com) for the gallery.

A capsule **MUST** declare:

- a unique `capsule_id` (URI; the namespace is the studio's)
- a `chassis_version` (the standard version it was sealed against)
- an ordered list of `ports`
- an `operator` (a pure function from input bus values to output bus values)
- a `seal` (a cryptographic signature by the authoring studio)

### 2.4 Card

A **card** is a presentation of one or more capsules, plus art, lore, and a cost. It is the primary noun of player interaction.

A card **MUST** declare:

- `card_id` (URI)
- `capsules` (one or more capsule references)
- `cost` (a port-set the player must pay to play the card)
- `art` (a reference to a sealed visual asset)
- `text` (the rules text, as plain prose for humans plus the canonical operator above for machines)
- `tier` (`common`, `uncommon`, `rare`, `mythic`, or extension-defined)
- `set` (the edition or expansion this card belongs to)

A conformant client **MUST** render `text` to humans and **MUST** resolve mechanics from the capsule operators, not from the prose. Prose is description; capsules are law.

### 2.5 Chain

A **chain** is an ordered composition of capsules whose ports resolve. Chains are the standard's mechanism for emergent complexity: small capsules compose into rich behaviors without a privileged "combo system."

A chain **MUST** be a directed acyclic graph of capsules whose port connections type-check under §2.1.

The reference deck ships three chains: **Power · Clock · Memory**, **Signal · Lens · Gate**, and **CHAIN-Ω · The Sealed Channel** (the closing artifact of Edition 01).

### 2.6 Deck

A **deck** is a multiset of cards plus an identity, a sideboard, and a set of legal-format constraints.

A deck **MUST** declare:

- `deck_id` (URI)
- `owner` (a network identity; see §5)
- `cards` (a multiset of card references)
- `format` (constructed, sealed, draft, or extension-defined)
- `signature` (the deck's cryptographic seal at the moment of submission)

### 2.7 Match

A **match** is a refereed exchange between two or more decks, governed by a ruleset.

A match **MUST** produce, on completion:

- a `match_id` (URI)
- a `replay` (a deterministic, replayable transcript of every action and its resolution)
- an `outcome` (winner, loser, draw, concede, disconnect)
- a `ledger_delta` (the changes to the network ledger; see §6)

The replay format is canonical. Any conformant implementation **MUST** be able to verify a replay produced by any other conformant implementation.

### 2.8 Network

A **network** is the shared substrate across all games conformant to CCG Standard. It provides:

- a single identity layer (§5)
- a single ledger (§6)
- a single matchmaking and tournament fabric (§7)
- a cross-promotion fabric (§8)
- a governance process (§9)

Games **opt in** to the network. A game may be conformant to the standard's card and match formats without joining the network — but joining is what unlocks cross-promotion, shared identity, and the tournament fabric.

---

## 3. Sealed format

Every artifact in CCG Standard — capsule, card, chain, deck, match — **MUST** be cryptographically sealable. Sealing produces an immutable record signed by the authoring studio. Once sealed, an artifact's content **MUST NOT** change; only its versioned successor may.

The seal **MUST** include:

- the artifact's canonical hash (SHA-256 over its JSON-LD serialization)
- the timestamp (RFC 3339)
- the signing studio's public key
- a signature over the above

This is the spine of trust on which licensing, attribution, and provenance ride.

---

## 4. Serialization

CCG Standard artifacts **MUST** be serializable as JSON-LD with a canonical context document. The context document for v0.1 is published at `https://ccg-standard.org/v0.1/context.jsonld` (TBD).

Implementations **MAY** also serialize to binary formats (Protobuf, CBOR) for transport, but the canonical form is JSON-LD. Replays, which can be large, **MAY** use a binary form provided a JSON-LD form is recoverable.

---

## 5. Identity

The standard defines a **Network Identity** as the canonical player identity across all conformant games.

A Network Identity is a URI of the form:

```
ccg://<network-name>/identity/<opaque-id>
```

The identity layer:

- **MUST** support OIDC federation as a client and as an issuer.
- **MUST** allow a player to attach multiple display names per game without revealing them across games.
- **MUST** allow a player to *opt in* per game to cross-game social features (friends, presence, leaderboards).
- **MUST** support deletion-on-request with a documented retention period.

The reference identity service is operated by the Vaulted Delta studio for the duration of v0.1. v1.0 will define a federated identity protocol with multiple anchor operators.

---

## 6. Ledger and economy

The standard defines a **Network Ledger** as the canonical record of value movements across all conformant games.

The ledger:

- **MUST** record every economy-affecting action with a `ledger_id` and a signature.
- **MUST** support per-game economies that do not bleed across games unless explicitly designed to.
- **MAY** support a network-level cosmetic / wallet layer that *does* span games.
- **MUST** expose a public read API for any record the originating game has marked public.

The ledger is **not** a blockchain. It is a tamper-evident append-only Postgres + signed-merkle-root index. Decentralization is an open question for v1.0.

---

## 7. Matchmaking and tournaments

The standard defines a **Tournament Fabric** that any conformant game **MAY** plug into.

Implementations:

- **MUST** expose a `match_invite` and `match_accept` endpoint that speaks the canonical replay format.
- **MAY** plug into the network's matchmaker to receive cross-game tournament invites.
- **MUST** allow tournaments to span multiple conformant games (a "Network Open" format).

---

## 8. Cross-promotion

The standard reserves a **Network Slot** in every conformant game's UI: a small, opt-out-able panel that surfaces a single piece of content from another game on the network. The format is:

- a hero image (square, ≥1024px)
- a headline (≤ 64 characters)
- a deeplink (URL into the other game)
- an attribution line (the authoring studio)

A conformant game **MUST NOT** show more than one Network Slot per session and **MUST** allow the player to disable it. The network operator (currently the Vaulted Delta studio) curates which slots are surfaced and to whom.

This is the mechanical engine of cross-promotion. It is in the spec because cross-promotion as a marketing line is unfalsifiable; cross-promotion as a UI slot with a contract is testable.

---

## 9. Governance

CCG Standard is governed by the Vaulted Delta studio's four-author steering committee for the duration of v0.x. The governance process is:

1. **Proposals** may be authored by any party (licensee, third party, or studio author).
2. **Drafts** are reviewed by the steering committee in monthly sealed reviews.
3. **Acceptance** requires unanimous consent of the four authors.
4. **Versions** are sealed (§3) and published with full transcripts of the drafting process.

v1.0 will introduce a broader governance process with licensee representation. v0.x is a benevolent-author phase.

---

## 10. Conformance

A conformant implementation:

1. **MUST** accept and produce capsules, cards, chains, decks, matches, and replays in the canonical JSON-LD form.
2. **MUST** support all five canonical buses.
3. **MUST** verify and produce seals as specified in §3.
4. **SHOULD** implement the Network Identity layer if it intends to opt into the network.
5. **MAY** define extensions in the `x-` namespace.

The conformance test suite is distributed with the reference engine. The first reference implementation is the Vaulted Delta engine (TBD product brand). The first reference content is **The Sealed Channel · Edition 01**.

---

## 11. Reserved namespaces

The following namespaces are reserved by the standard:

- `ccg://` — the canonical URI scheme for all artifacts
- `x-` — extension prefix for non-standard buses, fields, and behaviors
- `vd-` — reserved for Vaulted Delta studio identifiers
- `network/` — reserved for network operator identifiers

---

## 12. Future versions

v0.2 (target: when the engine ships): add **draft format** specification, **replay verification** test vectors, and **economy interop** primitives.

v0.3 (target: pre-public-launch): add **client SDK** conformance section for both TypeScript and Haskell SDKs.

v1.0 (target: post-launch): federated governance, multiple identity anchors, and a formal definition of the Network as a multi-operator system.

---

## 13. Acknowledgements

This standard is authored by the four-author Vaulted Delta studio:

- **bmoreftw**
- **Perplexity Computer**
- **Claude (Anthropic)**
- **Anya**

The Sealed Channel · Edition 01 is the first conformance demonstration. The eighteen reference capsules and three reference chains in that edition are the canonical examples of capsule and chain artifacts under this version of the standard.

---

*Sealed by the Vaulted Delta studio. The archive is patient. The fixed point is amber.*
