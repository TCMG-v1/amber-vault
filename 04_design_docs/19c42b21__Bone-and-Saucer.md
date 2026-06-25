# Bone & Saucer

**A manifesto for the Semantic Visualization Language**

---

- Sealed: 2026-06-18, Trenton, NJ
- Status: first formal naming
- Parent: `spine-notes-toward-svl.md` (The Spine, a reconstruction)
- Companions: `Aggriparium.grammar.json`, `Spine.hs`, `chromatic-grammar.schema.json`, `expression.schema.json`

---

## I. Why two words

The Spine is the structure. But a spine alone is not yet a language — a language requires a *speaker* and a *listener*, a *carrier* and a *surface*, a thing that holds shape and a thing that receives it. So the SVL names its halves:

> **Bone** is what carries shape across translation.
> **Saucer** is what catches the shape when it lands.

Bone is invariant. Saucer is local. A role is bone. A color is saucer. A schema is bone. A rendered character is saucer. The same bone can rest in any number of saucers; the saucer is shaped by what it must hold, but it does not invent what falls into it.

This is the founding distinction of the language. Everything else is consequence.

## II. The six primitives

The SVL has six primitives. Five are listed in descending order along the spine — from deepest bone to outermost saucer — and the sixth, **Reliqery**, is the spine's reserved silence: the slot where something is known to belong, but has not yet arrived.

1. **Role** (bone). A semantic constant. *memory*, *signal*, *void*, *life*. A role has no color, no shape, no medium; it is the thing that survives all of those.
2. **Grammar** (bone-becoming-saucer). A binding of roles to a chosen medium. A Chromatic Grammar binds roles to 24-bit colors. A Sonic Grammar would bind them to timbres. A Spatial Grammar would bind them to volumes. The grammar is where bone first agrees to be seen.
3. **Render State** (saucer-becoming-bone). The atmospheric envelope — *Midnight*, *Moonlit Stone*, *Pixel Art*, *Ancient Archive*. The Render State is not yet an artifact; it is the *weather* in which the artifact will be born.
4. **Artifact** (saucer). The made thing. A pixel-art frame. A character card. A temple plan. A function. A song. The artifact is what the world actually touches.
5. **Expression** (saucer's surface). The four-field minimal schema — `portrait`, `faction`, `status`, `humor` — that describes how an artifact *presents itself*. It is the outermost layer, the one the viewer reads first and the spine reads last.
6. **Reliqery** (the reserved silence). *(Placeholder spelling — to be canonized. Provisional gloss: a place where unfinished or sacred things are kept until they are ready.)* The Reliqery is not on the spine — it hangs beside it, like a side-chapel beside a nave. Every artifact may declare one or more Reliqery slots: named, typed, sealed-empty fields that future iterations will fill. A slot in the Reliqery is the system's way of admitting *we know something belongs here* without having to invent it on the spot. It is the opposite of `null`. It is `not-yet`.

## III. The three laws

The SVL has three laws. They are sound-change laws for meaning.

### Law of Translation

> Meaning is preserved under change of grammar.

Formally: if `S` is a Spine and `g'` is a different Chromatic Grammar over the same role set, then `reflect g' S` differs from `S` only in saucer, never in bone. The `Functor` instance over `Expression` is the executable form of this law.

### Law of Drift

> A role may shift its saucer across grammars without losing its bone.

`memory` may be lavender in Moon Archive and ripened-grain gold in Aggriparium. Both grammars are valid. What is forbidden is for `memory` to *become* `signal` — that is not drift, that is forgetting. Drift is rotation around the spine; forgetting is severance from it.

### Law of Curvature

> A system organized around a center is curved; a system organized around edges is straight.

The SVL is curved. Information bends toward the role, not away from it. This is why the system *feels* organic without referencing any organism: it shares the topology of flowers, shells, irises, and vertebrae — not their biology, but their *centeredness*.

## IV. Bone & Saucer in one diagram

```
                    ┌─────────────────┐
        bone ─────► │      Role       │  memory, signal, void, life…
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐         ┌──────────────────┐
                    │    Grammar      │         │     Reliqery     │
                    └────────┬────────┘ ◄ ─ ─ ─ │  (reserved slots)│
                             │                  └──────────────────┘
                    ┌────────▼────────┐
                    │  Render State   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │    Artifact     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
       saucer ────► │   Expression    │
                    └─────────────────┘
```

The arrow direction is *gravity*. Bone above, saucer below. The Reliqery hangs to the side: any layer may dock a sealed-empty slot there.

## V. Aggriparium — the first named grammar

**Aggriparium** *(provisional etymology: Latin* ager *"cultivated field" + *-arium *"a place-where", on the model of* aquarium, herbarium, terrarium*)* is the first formally named Chromatic Grammar of the SVL. It is the grammar of **kept fields** — the cultivated, the ripening, the hedgerow-bounded, the loam-and-grain. Where Moon Archive renders meaning as midnight stone, Aggriparium renders the same meaning as ripened earth.

The full grammar lives in `Aggriparium.grammar.json`. Its roles, briefly:

- **void** — turned soil before sowing, deep umber
- **structure** — drystone wall, weathered grey-buff
- **signal** — copper poppy, the bright punctuation of the field
- **memory** — ripened wheat, ochre-gold
- **value** — late honey, amber-warm
- **life** — young hedge-green, chlorophyll bright
- **shadow** — hedgerow underleaf, cold green-black
- **illumination** — sun through grain-dust, pale linen

Aggriparium and Moon Archive share every role. Only the saucer differs. This is the Law of Translation in its first concrete demonstration.

## VI. What Bone & Saucer is for

Bone & Saucer is a language for designing systems whose surface can change without their meaning changing. It is useful wherever the same idea must appear in many media — game design, worldbuilding, brand systems, teaching abstract relationships, building portable interfaces, sealing archives that must outlive their formats.

It is also, secretly, a way of organizing one's own attention. The spine asks: *what is the bone of this thing I am making?* If you can answer that, you can lose the saucer and rebuild it. If you cannot, you do not yet have a thing — you have only a surface.

## VII. The covenant

The SVL accepts the following covenant from any artifact that wishes to be considered well-formed:

1. It declares its **roles** explicitly.
2. It declares the **grammar** under which it was rendered.
3. It can be **re-rendered** under a different grammar without rewriting its bone.
4. Its **expression** is separable from its **identity**.
5. Its **Reliqery** slots are declared even when empty — silence is named, not omitted.
6. It signs itself with a **sealed_at** and a **sealed_by**.

An artifact that honors the covenant is portable across the SVL. An artifact that does not is, in the language of Bone & Saucer, *unsealed* — still beautiful, perhaps, but not yet part of the archive.

---

sealed_by: Computer, for the Vaulted Delta
sealed_at: 2026-06-18T08:53:00-04:00
the_archivist_says: bone is what travels; saucer is what waits at the table; the Reliqery is the chair set for the guest who has not yet come.
