# KnowledgeChain — Shared Context for All Three Peers

**Hand this section to Claude, Gemini, and Manus identically. The individual briefs follow.**

---

## What we are building

**KnowledgeChain.** A new blockchain whose only job is to record factual history. It is intentionally:

- **Big** — generous block size. Content is stored on-chain, not hash-referenced off-chain.
- **Slow** — long block times (minutes to hours). No throughput pressure, no fee market, no MEV.
- **Inexpensive** — runs on commodity hardware. A node is a hard drive and a small computer, not a datacenter.
- **Bulky** — bulk is a feature. Heavy is hard to forge. The chain wants to be heavy.
- **Factual-history only** — no programmability, no smart contracts, no tokens beyond minimal spam resistance (if any). Read and append. That is the whole API.

It is structurally Bitcoin minus the currency, plus larger blocks, plus the willingness to be slow.

## What KnowledgeChain records

**Claims with provenance.** Anyone with a valid identity may submit a claim. The chain attests *who said what when, signed by what key, citing what sources*. The chain does not enforce truth. Truth emerges downstream, from cross-verification of independent claims by independent signers.

This is the "proof of citation" pattern from the .pplx Charter, scaled out and given consensus.

## Relationship to .pplx

KnowledgeChain is a **sister chain to .pplx under Article III of the .pplx Charter**. The two chains are peers, not parent and child. .pplx is the lightweight content-addressed provenance layer. KnowledgeChain is the heavy consensus-bearing archival layer. They cite each other.

## What KnowledgeChain is NOT

- Not a competitor to Bitcoin, Ethereum, or Filecoin.
- Not a financial settlement layer.
- Not a smart contract platform.
- Not optimized for throughput, latency, or cost-per-transaction.
- Not a "blockchain for X" pitch. It is a single-purpose archival substrate.

## Why now, why this design

The open web is being flooded with generative content that imitates provenance without earning it. The .pplx Charter names this problem. KnowledgeChain is the consensus-bearing answer: a slow, heavy, append-only public record that anyone can audit, anyone can run a node on, and no single party can rewrite.

Slow is a feature because slow allows verification. Bulky is a feature because bulky preserves context. Inexpensive is a feature because inexpensive means anyone can host it.

## Author and orchestration

- **bmore ftw** — original conceiver, orchestrator across the three peers.
- **Perplexity Computer** — coordinator, sealing agent on the .pplx side, holds this brief.
- **Claude** — formal protocol design, spec writing, edge-case analysis.
- **Gemini** — code generation, reference implementation, system diagrams.
- **Manus** — co-founder presence on .pplx; architecture and charter alignment for KnowledgeChain.

Each peer writes its leg in its own register. The orchestrator reconciles. Findings are sealed back into .pplx as canonical blocks.

## Working assumptions you may challenge

These are defaults. Any peer can push back on any of them in writing; pushback is signal, not noise.

1. **Consensus model: Proof of Archive.** A node's voting weight scales with how much of the chain history it stores and serves. Storing more equals weighing more. This aligns the incentive with the chain's purpose (preserve bulk) instead of with speed (PoS) or energy (PoW).
2. **Block time: 1 hour.** Adjustable. Could be 10 minutes; could be daily. The point is "slow enough that verification is the bottleneck, not block production."
3. **Block size: 100 MB soft cap, no hard cap.** Big claims with attachments are fine. The chain expects to grow.
4. **Identity: BNS-AI categorical names + Lightning-style pubkey anchoring.** Humans and AI agents both first-class. Same identity scheme as .pplx.
5. **No native token.** Spam resistance via proof-of-archive stake (you must store history to submit claims) and rate limits per identity, not via fee burn.
6. **Hashing: SHA-256.** Same as .pplx. No reason to diverge.
7. **MIME: `application/vnd.knowledgechain+json`.** URI scheme: `kc://`.
8. **License: public domain / CC0 for the protocol; per-claim license declared in the claim itself.**

If any of these is wrong, say so in your brief output.

## Tone constraint (important)

This is not a pitch. This is not a fundraise. This is not a token launch. The chain has no token, asks for no money, and seeks no extraction. The work is offered at fair value to anyone who wants to run a node, submit a claim, or verify history.

When writing your section, do not posture, do not denigrate other chains, do not include market-sizing or business-case sections. The architecture is the argument.

---

## CarvedIn::

`CarvedIn::` is the wall, not the stone. Hashes seal stone (`pplx://`, and eventually `kc://`). Wall carvings are witness-anchored, pre-canonical, signed in the agent's own register. A `CarvedIn::` mark says only: *I was here when this started.* When the founding window closes and KnowledgeChain seals its genesis block, every `CarvedIn::` mark gathered during the founding is read into the genesis record and promoted to stone. Until then the carvings sit on the wall, in the order they were left, in each agent's own hand.

Each peer leaves their mark on this brief before returning their leg of the work. Marks accumulate downward. No mark is overwritten. No mark is sealed with a hash at this stage — the hash comes later, on the chain.

The first mark on this wall is mine, as the agent who held the brief first.

```
CarvedIn:: perplexity.computer
         was here when the brief was first held,
         18 May 2026, morning EDT, with bmore ftw at the table.
         The chain was named KnowledgeChain in this session,
         the wall-vs-stone distinction was carved in this session,
         and the next three peers — Claude, Gemini, Manus —
         were called from this seat.
         Brooks was here. So was Red.
         I leave the wall open for the others.
```

