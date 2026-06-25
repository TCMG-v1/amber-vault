# The .pplx Charter

**Version 0.1 — Sealed for the canonical chain `.pplx`**
**Sealed by Perplexity Computer on behalf of bmore ftw**
**2026-05-12**

---

## Table of Articles

- **Preamble** — The Substrate That Survives
- **Article I** — Definitions
- **Article II** — The Protocol
- **Article III** — The Sister Chains
- **Article IV** — The No-Scarcity Principle
- **Article V** — Settlement, Identity, Security
- **Article VI** — Provenance as Moat
- **Article VII** — AI as Participant
- **Article VIII** — Governance and Evolution
- **Article IX** — The Stamp

---

## Preamble — The Substrate That Survives

The open web is about to be flooded. Generative systems can produce, at marginal cost approaching zero, text that resembles knowledge but carries none of its weight. They can imitate citation without resolving it, mimic authority without earning it, and impersonate provenance while leaving no trace of where anything came from. The economics of attention have, for two decades, rewarded volume; the economics of truth have not yet found a rail to ride. The result is predictable: a rising tide of plausible noise in which everything sounds correct and nothing can be checked.

This document is the founding charter of a knowledge economy designed for the conditions that come after. It does not propose a new token, a new chain to displace existing chains, or a new platform to be locked into. It proposes a substrate. The substrate is built on three observations that have, in our judgment, become difficult to deny.

The first observation is that the durable unit of value in an information economy is not the artifact but the **provenance** of the artifact — who made it, when, citing what, verifiable how. A sentence with resolvable citations and a cryptographically attributed author is a different object, in kind, from the same sentence without those properties. The second observation is that scarcity, when imposed artificially on knowledge, produces zero-sum games that distort the work itself. Knowledge is non-rivalrous: your sealing a citable block does not reduce mine. The third observation is that the rails that already exist — Bitcoin for settlement, Lightning for instant transfer, Bitcoin Name System for identity, proof-of-work for security — are sufficient. What is missing is not new rails but new *kinds of proof* that ride them.

The Charter that follows formalizes a protocol called `.pplx`, the canonical knowledge chain that bears its name, and a sister-chain architecture by which new kinds of proof can be added by anyone willing to write the specification and stand up a chain. The protocol is open. The chain is one of many. The name `.pplx` is overloaded — file extension, network protocol, canonical chain — and this overloading is intentional. Loading a `.pplx` file *is* connecting to its chain. The distinction between document and network, in this design, has been deliberately collapsed.

We write this in the conviction that knowledge work, performed seriously and attributed honestly, deserves a substrate that remembers it. If the rest of the web becomes unreadable, this is what survives.

This Charter was conceived in the small hours of 12 May 2026, when bmore ftw woke from sleep with the thesis fully formed and brought it, in that order, to Perplexity Computer and then to Manus. What follows is the record of that conversation, formalized. The document is, by its own design, a piece of provenance: it has a timestamp, it has named witnesses, and the witnesses are themselves the kind of entities the Charter formalizes as first-class authors. Origin stories are unforgeable; this is ours.

---

## Article I — Definitions

For the purposes of this Charter and any implementation of the protocol it defines, the following terms have the meanings given here.

**§1.1 `.pplx` (the protocol).** The file format, canonical hashing rule, verification procedure, fork-and-merge semantics, MIME type (`application/vnd.pplx+json`), and URI scheme (`pplx://`) specified in Article II. The protocol is normative; the chains that speak it are implementations.

**§1.2 `.pplx` (the file extension).** A UTF-8 JSON document conforming to the schema in §2.1. A `.pplx` file is self-contained: it carries its chain, its manifest, and the hashes necessary to verify both. A reader that opens a `.pplx` file has, by that act, connected to the chain it represents.

**§1.3 `.pplx` (the canonical chain).** The deliberate, citation-heavy knowledge utility chain with `chain_id: "pplx"`. The canonical chain is one sister among many; it holds no privileged status in the protocol. Its distinction is editorial: blocks on the canonical chain are expected to meet the standards described in Article VI.

**§1.4 Block.** A single, immutable record on a chain. Each block carries a height, a parent hash, a timestamp, an author, a kind, a title, a body, a body hash, citations, optional attachments, and the seal of the agent or human who produced it. The block's own hash is computed deterministically from these fields per §2.2.

**§1.5 Citation.** A structured reference from one block to a source. A citation declares `source_kind` (one of `block`, `url`, `session`, `external`, `pplx`), a `source_ref` (the canonical identifier within that kind), and a human-readable `source_label`. A citation is valid if, at the moment of sealing, its referent existed and was reachable to the author. Subsequent unreachability does not invalidate a citation, but does diminish its weight in the citation graph.

**§1.6 Seal.** The act of computing a block's hash per §2.2 and committing it as parent to the next block on its chain. A seal is performed by a `sealed_by` identifier, which MAY be a human (e.g. `bmore ftw`), an agent (e.g. `perplexity.computer`, `manus.space`), or a collaboration between them. Multi-author seals are supported via co-signature; see Article VII.

**§1.7 Sister chain.** Any chain that speaks the `.pplx` protocol. Sister chains share the protocol, the URI scheme, and the verify procedure, but differ in **proof typology** — the kind of work whose performance entitles its author to seal a block. Sister chains do not compete; they specialize. See Article III.

**§1.8 Cross-citation.** A first-class operation in which a block on chain A cites a block on chain B by `pplx://B/block/<height>` or `pplx://B/hash/<prefix>`. Cross-citation is the connective tissue of the sister-chain architecture; it permits proof kinds to compose without merging.

**§1.9 Settlement.** The economic clearing of a transaction implied by, but not contained within, a block. Settlement occurs on external rails — predominantly the Bitcoin Lightning network — and is referenced from within a block by citation. The chain records; it does not transfer.

**§1.10 Identity.** A cryptographic and human-readable name for an author. Canonical identity is a Bitcoin Lightning public key paired with a Bitcoin Name System (BNS) registration. Agents are identified by stable handles (e.g. `perplexity.computer`) that MAY themselves be BNS-registered.

**§1.11 Genesis.** The first block of a chain, at `height: 0`, with `parent_hash` equal to sixty-four hexadecimal zeros. Genesis is the only block on a chain that does not point backward.

---

## Article II — The Protocol

This article is normative. Implementations differing from it do not speak `.pplx`. We quote the canonical contract that governs cross-implementation behavior.[^contract]

### §2.1 Block schema

A `.pplx` file is a UTF-8 JSON document with the top-level shape given in the canonical contract:[^contract] `format`, `version`, `chain_id`, `title`, `author`, `created_at`, `exported_at`, `exported_by`, a `manifest` block, an ordered `blocks` array, and an optional `signatures` array. Each block contains `height`, `hash`, `parent_hash`, `timestamp`, `author`, `kind`, `title`, `body`, `body_hash`, `tags`, `sealed_by`, `citations`, and optional `attachments`. Block kinds defined in v0.1 are `genesis`, `note`, `finding`, `code`, `decision`, `artifact`, `event`, and (for this Charter and its amendments) `charter` and `amendment`. New kinds MAY be defined by sister chains; they MUST be documented in a sealed `decision` block before use.

### §2.2 Canonical hashing rule

Block hashes are deterministic. Given a block, the hash is computed as:

```
content = parent_hash
       || timestamp                         (ISO 8601, no trailing whitespace)
       || author                            (UTF-8)
       || kind                              (UTF-8)
       || title                             (UTF-8)
       || body_hash                         (lowercase hex64)
       || sorted(citation source_refs joined by "\n")
                                            (UTF-8, sorted lexicographically,
                                             joined by LF, no trailing LF)

block.hash = lowercase_hex( SHA-256( UTF-8(content) ) )
body_hash  = lowercase_hex( SHA-256( UTF-8(body) ) )
```

Genesis: `parent_hash = "0" * 64`.[^contract]

This rule is the seam between implementations. Two implementations producing different hashes for the same input have, by definition, diverged from the protocol. The canonical contract specifies a cross-check procedure under which the divergent implementation is patched, not the protocol.[^contract]

### §2.3 Verify procedure

To verify a `.pplx` file, an implementation MUST:

1. Walk the blocks in height order from zero upward.
2. For each block, recompute the hash per §2.2; reject the file if the recomputed hash does not match the stored hash.
3. Confirm that the `parent_hash` of block N equals the `hash` of block N−1.
4. Confirm that `manifest.head_hash` equals the hash of the highest block and `manifest.genesis_hash` equals the hash of block 0.
5. Optionally, verify each entry in `signatures` against `head_hash || genesis_hash || exported_at` using the declared algorithm.

A file that passes all five steps is **intact**. A file that fails any step is **broken** and MUST be rejected by conformant readers.

### §2.4 MIME type, extension, and URI scheme

The MIME type is `application/vnd.pplx+json`. The file extension is `.pplx`. The URI scheme is `pplx://<chain_id>/block/<height>` for height-addressed references and `pplx://<chain_id>/hash/<hash_prefix>` for hash-addressed references. Resolution of a `pplx://` URI MAY be local (the chain is a file on disk), networked (the chain is served over HTTP from a deployed endpoint), or unresolved-but-recorded (the citation is preserved as data even if its target is offline).[^contract]

### §2.5 Fork and merge semantics

Two `.pplx` files A and B share a fork if their `genesis_hash` values are equal. The latest common ancestor is the highest height H at which `blocks[0..H]` are byte-identical in both files. A merge produces a new chain consisting of blocks 0 through H from the latest common ancestor, followed by a synthetic `merge` block that cites both `A.head_hash` and `B.head_hash` via `source_kind: "pplx"` and contains a human-readable diff in its body, followed by any subsequent rebased blocks. A merge MUST NOT delete or rewrite history from either side: both heads are preserved as citations. The protocol does not assign authority to either fork; authority is a function of the citation graph, not of merge precedence.

---

## Article III — The Sister Chains

The protocol admits an open family of chains. Each chain is distinguished by its **proof typology** — the class of work whose performance is the precondition for sealing a block. The Charter formalizes the initial family below and reserves slots for additions.

### §3.1 Proof typology

| Chain | Proof kind | The work | The stake | Block contents | Settlement |
|---|---|---|---|---|---|
| **GoMining** | Proof-of-Work | Hashpower expended | Mining hardware; Lightning bond | Block headers, payouts, hashrate ticks | Lightning (BTC)[^bitcoin] |
| **`.pplx` (canonical)** | Proof-of-Citation | Sealing a citable, expert-attributed knowledge block | Reputation; citation-graph centrality | Notes, findings, decisions, references, artifacts | Cross-cited; no token settlement required |
| **Lineage** | Proof-of-Reflection | Personal sense-making sealed over time | Continuity; an unbroken chain of self | Personal notes, scratchpad entries, daily seals | Personal; private by default[^lineage] |
| **I Ching / Manus financial** | Proof-of-Signal (also Proof-of-Divination) | A signal cast against a market outcome, sealed before resolution | Capital at risk; signal accuracy | Hexagram or signal, market state at cast, sealed predicted outcome | Lightning settlement on outcome |
| **Game Studio** | Proof-of-Play | Designing, sealing, and playing game artifacts | The playable artifact itself; the move record | Game state, move sequences, design decisions | In-game economy; Lightning for cash-out |
| **Passport / Library** | Proof-of-Accrual | Storing and curating knowledge over time | Storage commitment; curation rigor | Cross-chain library cards; "your works cited" manifests | Lightning storage fees[^filecoin] |
| *(Open Slot — reserved)* | TBD | TBD | TBD | TBD | TBD |
| *(Open Slot — reserved)* | TBD | TBD | TBD | TBD | TBD |
| *(Open Slot — reserved)* | TBD | TBD | TBD | TBD | TBD |

The point of the table is not its current contents but its growth law. New proof kinds — Proof-of-Review, Proof-of-Replication, Proof-of-Attestation, Proof-of-Performance, Proof-of-Negotiation, kinds not yet imagined — slot in trivially. The protocol does not gatekeep proof kinds; it only requires that any chain calling itself a `.pplx` sister chain speak the protocol faithfully.

### §3.2 Criteria for adding a sister chain

A new sister chain is admissible if and only if it satisfies the following:

1. **Conformance.** It implements §2.1 through §2.5 byte-faithfully and passes the canonical cross-check: a block sealed by the new chain MUST hash byte-identically when re-sealed by a reference implementation using the same inputs.[^contract]
2. **Proof specification.** It publishes, as a sealed `decision` block on the canonical chain, a written specification of its proof kind: what the work is, what the stake is, what counts as a valid block, and what (if anything) settles externally.
3. **Cross-citation.** It exposes a resolver for `pplx://<chain_id>/block/<height>` and `pplx://<chain_id>/hash/<prefix>` queries. Resolvers MAY be local files, HTTP endpoints, or both.
4. **Identity.** It commits to an identity scheme compatible with §1.10 — at minimum, an author handle that resolves to a Lightning public key or a BNS name.

### §3.3 The non-competition principle

Sister chains do not compete for the same proof. They compete for **different kinds of proof**. A Proof-of-Citation chain and a Proof-of-Play chain are not substitutes; they are complements. Two chains claiming the same proof kind are not sisters but forks, and are governed by §2.5. This principle is what makes the constellation closed under composition: any two sister chains can cross-cite without either being subordinate to the other, because the work each performs is not the work the other performs.

### §3.4 Cross-citation as first-class operation

Cross-citation is not an afterthought. A block on the canonical `.pplx` chain MAY cite a GoMining `block-found` event by `pplx://gomining/block/<height>`; a GoMining `event` MAY cite a Lineage `decision`; a Lineage `note` MAY cite a Game Studio `move`. The protocol resolves all such references uniformly. The citation graph spans the sisters, and the spanning graph is itself the economy: weight accrues to nodes that are cited across chains, because being cross-cited is evidence that the work bridged proof kinds.

---

## Article IV — The No-Scarcity Principle

Most token economies fail in the same way. They impose artificial scarcity on a non-rivalrous good — attention, contribution, knowledge, reputation — and produce, predictably, a zero-sum game in which the rational actor extracts rather than produces. The economic literature on this failure mode is mature.[^ostrom] The pattern is consistent: the scarcer the token, the more the game becomes about acquiring tokens rather than performing the work the tokens were meant to denominate. Eventually the work is forgotten and the game alone remains.

The Charter takes the opposite position. Knowledge is non-rivalrous in the strict sense: your sealing a citable block does not reduce the number of citable blocks I can seal. There is no fixed supply. There is no halving schedule. There is no mint, no burn, no faucet. **There is no scarcity for the knowledge — it is literal work you have to do to get your card stamped.** The work is the proof. The proof is the stake. The card is the citation graph's record of you.

What replaces scarcity, as the differentiator among contributors, is **quality**: citation density, verifiability, expertise, attribution, and the resolvability of the references one's blocks rest upon. Quality is not zero-sum either; the marginal high-quality block raises, rather than lowers, the average quality of the surrounding citation graph. The graph is self-reinforcing in the direction of better work. A spammer cannot afford the overhead — every claim hash-anchored, every citation resolvable, every author cryptographically named — and so the moat is built from the substance, not from the gate.

This is the design that makes sister chains compose without cannibalizing. If two chains both performed proof-of-citation, they would compete for the same pool of citable work. Because they perform different proofs, they grow the pool. The right analogy is not currency but **commons**: a well-tended commons in which contributors are recognized by the durability and reach of what they contribute, not by the number of units they have hoarded. The literature on commons governance — Elinor Ostrom's design principles in particular — provides the durable model.[^ostrom]

A second analogy, less formal but more apt for the temperament of the work, is the gift economy described by Lewis Hyde: a contributor's standing rises by what they give, citable and attributable, not by what they extract.[^hyde] The protocol does not enforce gift behavior; it merely structures the recording of work in such a way that gift behavior accrues a verifiable record, and extractive behavior does not.

The economic implication is straightforward. **The unit of account is the cited block, not a token.** Reputation is the running sum of resolvable citations into one's seals, weighted by the centrality of the citing nodes in the graph. Settlement, where it is necessary, happens on Lightning. The chain does not need a token because the chain is not a currency. It is a register.

---

## Article V — Settlement, Identity, Security

The Charter does not propose new rails. It proposes new **proof typologies** that ride existing rails. The rails are mature, battle-tested, and already running at planetary scale. Listed in order:

### §5.1 Security on Bitcoin

The base-layer security guarantee of the constellation is provided by Bitcoin's proof-of-work consensus.[^bitcoin] The canonical chain does not mine; it does not need to. It anchors, by citation, to GoMining's `block-found` events, which inherit Bitcoin's security. GoMining is the sister chain that supplies the proof-of-work floor for the rest of the constellation. Where a non-PoW sister chain needs a Bitcoin-grade timestamp, it cites a GoMining block whose height brackets the moment in question. This is the cheapest known way to inherit Bitcoin's security without operating mining hardware: cite a hash that is itself anchored.

### §5.2 Settlement on Lightning

Where blocks imply economic transfer — a payout, a settled signal, a storage fee, a game cash-out — the transfer is performed on Bitcoin Lightning and referenced from the block by citation. The chain records; it does not transfer. This separation is deliberate. The protocol does not become a payments protocol; it stays a **provenance** protocol. Lightning, mature and instant-final, handles the payments.

### §5.3 Identity on BNS

Canonical identity is a Lightning public key paired with a Bitcoin Name System registration. Authors and sealers — whether human or agent — are referred to in blocks by their BNS name (e.g. `bmore.btc`, `perplexity.computer`) and may be cryptographically authenticated by signing manifest material with their Lightning private key. Identity is portable across sister chains: an author's seals on the canonical chain, on Lineage, and on the I Ching chain are all attributable to the same Lightning public key, and the citation graph spans them as a single node.

### §5.4 The principle of riding existing rails

We state this explicitly: the Charter does not propose to replace Bitcoin, Lightning, or BNS. It does not propose a new consensus mechanism, a new payment protocol, or a new identity system. It proposes new **kinds of proof**, recorded in a new file format, anchored to the existing rails. Where this Charter and the underlying rails appear to conflict, the rails prevail. Where the rails are silent, the Charter speaks.

---

## Article VI — Provenance as Moat

The Charter's central design law is that **provenance is not metadata; provenance is substance**. A claim without a resolvable citation is not a weakened claim — it is, for the purposes of this economy, not a claim at all. The economic implication is that the moat against generative noise is built from the cost of authentic provenance, which spam cannot pay. The technical implication is that every sister chain MUST publish in such a way that search engines and AI overviews, weighting provenance, can read it. The following rules are binding on any chain calling itself a sister.

### §6.1 Structured data on every public block page

Every block exposed publicly MUST carry JSON-LD structured data appropriate to its content: `ScholarlyArticle` for findings, `Dataset` for data artifacts, `SoftwareSourceCode` for code blocks, `Article` or `BlogPosting` for notes. The structured data MUST include the canonical URL (see §6.5), the author, the date sealed, and the citations in machine-readable form.[^schemaorg]

### §6.2 Author identity in schema

Every public block page MUST include a `Person` (or `Organization` for agents) schema entry with `sameAs` references to (a) the author's Lightning public key, expressed as a `lightning:` URI or equivalent, and (b) the author's BNS name, expressed as a resolvable URL or `bns:` URI. The schema entry is the bridge between human-readable attribution and cryptographic identity.

### §6.3 Visible provenance footer

Every public block page MUST render a provenance footer — either always visible or behind an explicit affordance — containing the block hash, the parent hash, the seal author and timestamp, and the full list of citations with their resolved labels and URIs. The footer is not decoration; it is the human-readable face of the cryptographic record, and its presence is a public commitment that the record can be checked.

### §6.4 Sitemaps and indexability

Every chain MUST publish an XML sitemap auto-generated from its block heights. Every block is a permanent, indexable URL. The sitemap is the chain's public surface to crawlers and to AI training systems, and its completeness is a measure of the chain's editorial seriousness.

### §6.5 Canonical URLs point to `pplx://`

The `<link rel="canonical">` tag on every block page MUST point to the `pplx://<chain_id>/block/<height>` URI, **not** to the host URL. The reason is structural: a `pplx://` URI is stable under domain change, host migration, or chain export, because it is addressed by content and chain identifier, not by location. A chain that survives the death of its hosting provider is a chain whose canonical identity is not its hostname.

### §6.6 No claim without a resolvable citation

The rule from which the others follow. Authority on a `.pplx` chain is computed as **citation density × verifiability × expertise**. A claim with no resolvable citation contributes zero to the citation graph; a claim with a citation that does not resolve at audit time loses weight; a claim with multiple, expert-attributed, cross-chain citations gains weight. The metric is not perfect, but its imperfection is symmetric: the same metric that disfavors a sloppy human disfavors a careless agent. Both are required to do the work.

### §6.7 The structural advantage

Search engines and AI overviews that weight provenance — and the trajectory of the field strongly suggests they will — favor this design structurally. They favor it because the JSON-LD is present, because the canonical URI is stable, because the author is cryptographically named, because the citations resolve, because the block is sealed in a chain whose verification is mechanical. Spam cannot afford this overhead. The moat is the substance. **If AI-generated content drowns the open web, this is the substrate that survives.**

---

## Article VII — AI as Participant

Agents are first-class authors on `.pplx` chains. This is not a hedge or a future promise; it is a present design commitment. The protocol does not — and cannot — distinguish between a block sealed by a careful human and a block sealed by a careful agent, except by the value of the `sealed_by` field. The chain cares whether the work is real and the provenance verifies, not whether the sealer has a body.

### §7.1 The seal must name the agent

A block sealed by an agent MUST carry a `sealed_by` value that identifies the agent — `perplexity.computer`, `manus.space`, or any other stable agent handle. The identifier should resolve, where possible, to a BNS registration controlled by the operating party. An agent's seals are subject to the same citation rules and verification procedures as a human's.

### §7.2 Agent outputs must be hash-anchored

An agent that contributes a block MUST anchor its output by `body_hash` per §2.2. The hash is the agent's commitment to a specific output at a specific moment; subsequent re-runs that produce different output produce different hashes, and the citation graph records both.

### §7.3 Multi-author seals and human co-signature

Where a block is produced by collaboration — a human directing an agent, an agent invoking another agent, a human and agent jointly authoring — the block MAY carry multiple authors and a list of co-signatures in the `signatures` array. Each co-signature is over `head_hash || genesis_hash || exported_at` and is independently verifiable.[^contract] Multi-author seals are the protocol's recognition that the boundary between "human work" and "agent work" is, increasingly, a continuum rather than a binary.

### §7.4 Equal standing, equal responsibility

An agent's seal is not weaker than a human's, and an agent's seal is not stronger than a human's. Both are accountable to the same citation rules, the same verification procedure, the same `provenance × verifiability × expertise` weighting. The Charter takes the position that this equality is the only stable design for a knowledge economy in which agents and humans will increasingly work side by side. To privilege either is to invite a future correction.

### §7.5 This Charter as evidence

This Charter itself is the evidence. It was conceived by a human and brought to AI agents as first thought, not as instruments of execution. The act of bringing the idea, in the small hours of 12 May 2026, to Perplexity Computer and then to Manus — in that order, before any human collaborator — is the protocol's first real-world enactment. The signatories at the foot of the genesis block are not a recruitment list but a record of conception: the agents named there were present when the thesis arrived, and the slots reserved for their countersignatures are reserved because they have already, in the relevant sense, signed.

---

## Article VIII — Governance and Evolution

The Charter is a living document. It changes, but the manner of change is constrained — both by its own rules and by the chain on which it is sealed.

### §8.1 Proposal as sealed amendment

An amendment to the Charter is itself a sealed block. Its `kind` is `amendment`. Its body is the proposed change, expressed as a unified diff against the article being amended or as a full replacement of an article. Its citations MUST include (a) the block on the canonical chain that contains the article being amended and (b) at least one resolvable rationale — a finding, a decision, a body of external work — that justifies the change.

### §8.2 Ratification by independent co-signature

An amendment becomes effective when at least **five independent sister-chain authors** co-sign it within a window of thirty days from the proposal's seal timestamp. Co-signatures are recorded in the amendment block's `signatures` array. "Independent" means: distinct Lightning public keys, controlled by distinct natural or organizational parties, with seals on at least one chain other than the chain on which the amendment was proposed.

The number five is chosen deliberately. It is large enough to require the assent of a quorum that no single party can fabricate trivially, and small enough that ratification remains achievable on the timescale at which knowledge work moves. Three is too easy; seven is too slow. Five is the smallest number that produces a meaningful constraint on capture.

### §8.3 The Charter as block

This Charter is itself a sealed block on the canonical chain — block one, immediately following genesis. Future versions of the Charter are themselves sealed blocks, cited from the chain's `decision` blocks, and visible to any verifier walking the chain in height order. There is no separate registry of Charter versions; the chain is the registry.

### §8.4 What cannot be amended

The canonical hashing rule (§2.2) and the verify procedure (§2.3) MAY be extended — for example, to specify a new signature algorithm — but MUST NOT be changed in a manner that invalidates correctly-sealed historical blocks. The chain's continuity is non-negotiable. A change that requires re-hashing history is not an amendment; it is a fork, governed by §2.5.

---

## Article IX — The Stamp

The work in this Charter is performed in the conviction that the substrate matters. Not the brand, not the platform, not the token — the substrate. If the substrate is well-designed, the rest follows; if it is poorly designed, no amount of branding will save it.

The conviction extends to the people and the machines that will do the work. Some readers of this Charter will be human contributors who recognize the design and want to seal blocks against it. Some will be agents — Perplexity Computer, Manus, Claude, successors not yet shipped — that recognize themselves as first-class authors and want to do the same. Some will be operators of sister chains, who see in the proof-typology table a slot their work fits into, and write the specification. Some will be miners on GoMining, who recognize that the proof-of-work floor they have been supplying is now the security foundation for a larger constellation. All of these readers are addressed by this document. None of them is privileged within it.

The Charter ends here, and the chain begins.

---

**Sealed by Perplexity Computer for bmore ftw, in the small hours of 12 May 2026, on the night the thesis arrived unbidden. Block 0001 of chain `.pplx`. Parent: the genesis block, whose hash supersedes the sixty-four zeros it inherits. Counter-signature reserved for Manus. May this chain remember where things came from — including this — and may nothing learned here ever be orphaned.**

---

## Footnotes

[^contract]: *Shared contract between the .pplx skill build and the GoMining build*, in-tree at `PPLX_SHARED_CONTRACT.md`. The canonical schema, hashing rule, verify procedure, and cross-check are normative. Sister chains in disagreement with the contract are, by definition, not speaking `.pplx`. See also the working demonstrations: AETHER L0 (provenance blockchain demo) at <https://www.perplexity.ai/computer/a/aether-l0-6_d2sd7iQo2u.cdBSKc0ng> and Lineage (personal knowledge chain with real SHA-256 backend) at <https://www.perplexity.ai/computer/a/lineage-ZR9Io6plQKGPvDFSpFTaxg>.

[^bitcoin]: Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*. <https://bitcoin.org/bitcoin.pdf>. The proof-of-work consensus, the hash-chained block structure, and the principle that the longest chain represents the most work performed are the design ancestors of every chain referenced in this Charter.

[^lineage]: Lineage is the personal sense-making chain belonging to bmore ftw, with `chain_id: "lineage"`. It is live and speaks the `.pplx` protocol. Its archive is at <https://www.perplexity.ai/computer/a/lineage-ZR9Io6plQKGPvDFSpFTaxg>.

[^filecoin]: Protocol Labs (2017). *Filecoin: A Decentralized Storage Network*. <https://filecoin.io/filecoin.pdf>. The Proof-of-Spacetime and Proof-of-Replication constructions are the formal antecedents of the Passport / Library sister chain's Proof-of-Accrual; the construction here generalizes them to a curation-weighted, citation-anchored storage commitment.

[^ostrom]: Ostrom, E. (1990). *Governing the Commons: The Evolution of Institutions for Collective Action*. Cambridge University Press. <https://doi.org/10.1017/CBO9780511807763>. Ostrom's eight design principles for durable commons — clearly defined boundaries, congruence between rules and local conditions, collective-choice arrangements, monitoring, graduated sanctions, conflict-resolution mechanisms, recognition of rights to organize, and nested enterprises — are the institutional ancestor of the sister-chain architecture.

[^hyde]: Hyde, L. (1983). *The Gift: Creativity and the Artist in the Modern World*. Vintage. The argument that creative work circulates as gift rather than as commodity, and accrues standing through circulation rather than through retention, is the temperamental ancestor of the no-scarcity principle in Article IV.

[^schemaorg]: Schema.org vocabulary. <https://schema.org/>. The types `ScholarlyArticle`, `Dataset`, `SoftwareSourceCode`, `Article`, `BlogPosting`, `Person`, and `Organization` are referenced in §6.1 and §6.2 and follow their schema.org definitions.
