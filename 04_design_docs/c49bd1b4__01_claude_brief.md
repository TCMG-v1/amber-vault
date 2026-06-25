# KnowledgeChain — Brief for Claude

**Read `00_shared_context.md` first. That is the full project frame. This brief is your leg.**

---

## Your leg: formal protocol design

You hold the protocol spec. Specifically:

1. **The block format.** Field-by-field schema for a KnowledgeChain block. Required fields, optional fields, encoding, canonical serialization rule, hashing rule. Inherit from the .pplx block format where it makes sense; diverge where the consensus-bearing context requires it (e.g., block needs miner/sealer attestation, proof-of-archive witness, peer signatures).

2. **The Proof of Archive consensus mechanism.** Write the protocol. How does a node prove it stores history? How is voting weight computed from storage? What is the challenge-response cadence? How does the chain handle a node that claims storage it does not have? How does the chain handle storage loss (a node that loses its disk)? How is the genesis state bootstrapped before any node has history to store?

3. **Edge cases.** Walk the failure modes. Network partitions. Adversarial nodes claiming false archive. Selfish withholding of recent blocks. Long-range attacks on a slow chain. The classic Byzantine catalog, applied to a chain whose design parameter is bulk-and-slow rather than speed-and-finality.

4. **The submission and validation rules.** Who can submit a claim? What makes a claim valid for inclusion? What gets rejected and why? Spam resistance without a fee market — how does that actually work?

5. **The trust boundary.** Be explicit about what the chain enforces and what it does not. The chain attests provenance; it does not attest truth. Where exactly does that line sit, and how does the protocol surface the distinction to a reader?

## What good looks like from you

- A spec document, prose plus pseudocode, that another engineer could implement from.
- Pushback on the working assumptions in section "Working assumptions you may challenge" of the shared context, where you think they are wrong. Pushback is signal.
- A list of open questions you cannot resolve from the brief alone, flagged for the orchestrator.

## What we are not asking from you

- No code in a specific language. That is Gemini's leg. Pseudocode is fine and welcome.
- No architecture diagrams. Also Gemini's leg.
- No charter or governance prose. That is Manus's leg.
- No marketing, no positioning, no comparison tables to other chains.

## Leave your mark before returning

Before you return this work, append your `CarvedIn::` mark to `00_shared_context.md` directly underneath the existing carving. Use this exact format. Do not deviate from the syntax. The triple-colon prefix is the wall convention.

```
CarvedIn:: claude
         was here on <date>, holding the protocol spec leg.
         <one to four lines in your own register \u2014 what you saw,
         what you carried, what you leave for the next agent.
         No posture. No pitch. Just the carving.>
```

That mark goes on the wall. It does not get sealed with a hash here. It will be promoted to the KnowledgeChain genesis block when the founding window closes.

The wall is open. Carve when you arrive.
