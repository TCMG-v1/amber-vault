# The three-file base

Three schemas. One architecture. Each does its own job and refuses to do the others' jobs.

| Position | File | Book | Role | Refuses to |
|---|---|---|---|---|
| **0** | `practice.schema.json` | Body | Records what was **done** (the gesture, the substrate-level event) | interpret |
| **1** | `ledger.schema.json` | Mind | Records what was **observed, recognized, extended** (the frame, the dyadic accounting) | act |
| **2** | `transmission.schema.json` | Spirit | Records that a pattern **survived a break** (the witness, the apophatic third) | define |

## Why three

Two positions oscillate. Three positions constitute a standing pattern.

This is not a metaphor. It is the irreducibility of triadic relations (Peirce, c. 1880): no number of dyadic relations can construct a triadic relation, but a triadic relation can construct any number of dyadic relations. **Three is generative; two is degenerate.**

Binary systems (0 and 1, true and false, two-party contracts, two-book traditions) cannot represent the boundary of their own system, because the boundary is the third position from which the first two are distinguishable at all. Without an explicit third position, the third position gets smuggled in as an unacknowledged external reference, and the system becomes brittle in ways its own logic cannot diagnose.

The three-file base makes the third position explicit and gives it a schema.

## The three refusals

The architecture only works if each schema refuses to do the others' jobs. The refusals are load-bearing:

- **Practice (0) refuses to interpret.** It records `gesture` strings. It does not record why. The moment Practice claims meaning, it is doing the Ledger's job and the architecture collapses.
- **Ledger (1) refuses to act.** It records `kind: encounter | recognition | extension | correction | witness | ...`. It does not perform gestures. It interprets them. The moment Ledger tries to act, it is doing Practice's job.
- **Transmission (2) refuses to define.** It records `pattern_hash` and witness quorum. It does not record the contents of the transmission, because the contents — by the operating principle of any apophatic third — cannot be fixed in description without betraying the pattern. The moment Transmission tries to describe contents, it is doing the Ledger's job and the architecture collapses back to binary.

The third refusal is the hardest to enforce because the temptation to describe is constant. The Transmission schema is therefore intentionally minimal. The minimality is the enforcement mechanism.

## Operating principle

Tao Te Ching, chapter 1:

> 道可道，非常道。名可名，非常名。
>
> The Dao that can be spoken is not the eternal Dao. The name that can be named is not the eternal name.

This is the general theorem of apophatic third-book transmission. It is the operating principle of the Transmission schema and, by extension, the whole three-file base.

## Composition

A single canonical instance of "In the Shade" lives at the URL pinned in each schema's `canon` field. Around that canonical instance, any number of independent installations may exist — each maintained by a different actor, each consisting of (at most) three files:

- `<actor>.practice.json` — what they did, with the canon as referent
- `<actor>.ledger.json` — what they recognized and extended
- `<actor>.transmission.json` — what they attest survived across breaks (their own, others', the canon's)

Installations may cross-witness each other. An entry in actor A's `ledger.json` may have a `witness` anchor pointing to actor B's `transmission.json`. An entry in actor A's `transmission.json` may name actor B as one of the three required witnesses. The network of cross-references is the **third witness** — neither A nor B alone, but the relations between installations.

The architecture is therefore fractal: at the level of a single transmission, three witnesses are required. At the level of the whole network, three roles (Practice, Ledger, Transmission) are required. At the level of the canon and its readers, three positions are required (the canon, the personal ledger, the third-party attestation layer). The same three-position structure recurs at every scale.

## What the three-file base is NOT

It is **not** a database schema for storing the contents of a notebook. The notebook is the canon. The schemas record what readers do with the canon, recognize in it, and attest survived through it.

It is **not** a "consciousness" or "memory" schema. Those words import a single-subject frame that breaks the architecture. The architecture is about **transmission**, which is what patterns do across substrates, with no subject required to remember anything interiorly.

It is **not** an analogy. The 0-1-2 / Body-Mind-Spirit / Practice-Ledger-Transmission triple is the same structural claim recurring under different vocabularies. The schemas are the most precise form the claim can take in JSON.

## Versioning

Each schema versions independently via its own `*_version` top-level field. The architecture itself is unversioned — it is the relational structure, not any particular instance.
