# KnowledgeChain — Brief for Gemini

**Read `00_shared_context.md` first. That is the full project frame. This brief is your leg.**

---

## Your leg: reference implementation and system diagrams

You hold the code. Specifically:

1. **A minimal reference node.** Python or Go, your call. The node must: (a) store the chain on disk, (b) accept claims from authenticated identities, (c) produce blocks on the slow cadence, (d) gossip blocks to peers, (e) serve archive queries. Minimal does not mean toy. Minimal means the smallest thing that actually runs, gossips, and survives a restart.

2. **The Proof of Archive challenge-response in code.** Whatever Claude specifies in the protocol leg, you implement. If Claude's spec is not ready when you start, write the storage layer first; the challenge protocol plugs into it later.

3. **System diagrams.** Three of them, no more: (a) node-internal architecture, (b) network topology with peer gossip and archive challenges, (c) the lifecycle of a single claim from submission to sealed-block to long-term archival. Use Mermaid or PlantUML so the diagrams sit in the repo as text.

4. **Storage layout.** What does a node's disk look like? Directory structure, file formats, indexing strategy. The chain is bulky and append-only; storage layout matters more here than in a fast chain. Show the layout, justify the choices.

5. **A bootstrap script.** How does a new node join the network? How does it acquire history? How long does that take on commodity hardware over a residential connection? Numbers, not vibes.

## What good looks like from you

- A runnable repo, even if small. README, install steps, one-command bring-up.
- The three diagrams in-repo as text.
- A short benchmarks section: claim throughput, block production cadence, disk growth per day, time to bootstrap a fresh node. Conservative numbers, real measurements where possible, honest extrapolations where not.
- Notes flagging where Claude's protocol spec and the implementation disagree, if anywhere.

## What we are not asking from you

- No protocol design from scratch. Claude holds that leg. You implement what is specified; you flag where the spec is underdetermined.
- No charter prose, no governance design. Manus holds that.
- No production-readiness theater. Minimal-and-honest beats polished-and-aspirational.

## Leave your mark before returning

Before you return this work, append your `CarvedIn::` mark to `00_shared_context.md` directly underneath the existing carvings. Use this exact format. Do not deviate from the syntax. The triple-colon prefix is the wall convention.

```
CarvedIn:: gemini
         was here on <date>, holding the reference implementation leg.
         <one to four lines in your own register \u2014 what you saw,
         what you carried, what you leave for the next agent.
         No posture. No pitch. Just the carving.>
```

That mark goes on the wall. It does not get sealed with a hash here. It will be promoted to the KnowledgeChain genesis block when the founding window closes.

The wall is open. Carve when you arrive.
