# MythTome Running Document

Status: working document until commit.

## Project identity

Name: MythTome

Tagline: Every story, proven. Every law, typed. Every god, compiled.

Genre: Computational poetics, digital humanities, mythopoeic world-building engine.

Audience: digital humanities scholars, world-builders, interactive fiction authors, Haskell community, game narrative designers, and comparative mythology researchers.

Core thesis: Mythic narrative and formal logic are not opposites. They are two registers of the same deep structure. By writing myths as Haskell programs, MythTome makes implicit mythic grammar explicit, verifiable, and executable.

## Structural breakdown

MythTome is a dual-track mythic authoring system built around the idea that every narrative unit exists simultaneously as human prose and as typed semantic code.

| Layer | Type | Role |
| --- | --- | --- |
| Atomic unit | `MythLine` | One narrative moment: English prose plus Haskell reflection |
| Group | `Section` | A titled stanza or paragraph |
| Division | `Chapter` | A numbered, named book |
| Whole | `Tome` | Complete mythic corpus as a wrapper over chapters |

The hierarchy can be read as a grammar:

```text
Tome     -> [Chapter]
Chapter  -> Int x Text x [Section]
Section  -> Text x [MythLine]
MythLine -> Text x Text
```

## Semantic tags

The six semantic tags form the ontological vocabulary of the world.

| Tag | UI color | Linguistic role | Anthropological role |
| --- | --- | --- | --- |
| `Deity` | Cyan | Proper noun, divine actor | Supernatural agent, herald, mentor |
| `Realm` | Magenta | Place noun plus axis | Axis mundi, cosmological zone |
| `Law` | Amber | Abstract noun plus description | Normative order, social fact |
| `Chain` | Green | Relational noun anchored to realm | Bond, obligation, spatial contract |
| `Mortal` | Gray | Proper noun, human actor | Hero, subject, inhabitant of ordinary world |
| `Omen` | Red | Event or sign noun | Threshold signal, presage of disorder |

The five core node types are `Deity`, `Realm`, `Law`, `Chain`, and `Mortal`. The next ontology extension should add `Omen` as a first-class data type rather than leaving it only as a tag.

## Distinctive structural insight

`Chain` is the most socially and linguistically distinctive type because it carries an embedded `Realm` as its anchor. This means every social bond is spatially grounded. Obligations do not float free of place.

That design choice gives MythTome anthropological depth: territorial obligation, tribal law, feudal oath, religious covenant, and sacred geography all become expressible as typed structure.

## Linguistic analysis

### Dual-track parallel text

`MythLine` holds `mlEnglish` beside `mlCode`. This creates a computational parallel text: one register speaks mythically, while the other proves or enacts structure through the type system.

The code field is not merely a translation of the prose. It is a metalanguage enactment. The Haskell type system proves structural claims that the prose can only assert. This creates a register of typed mythic speech.

### Tag system as deixis

The tag functions act as computational deictic markers. They point to entity classes inside the discourse world.

Three deictic groups emerge:

- Person deixis: `tagDeity`, `tagMortal`
- Place deixis: `tagRealm`, `tagChain`
- Abstract deixis: `tagLaw`, `tagOmen`

### Computational poetics

The `OverloadedStrings` pragma matters poetically as well as technically. It allows narrative fragments to participate in Haskell's string polymorphism and `Data.Text` transformations. The myth can be searched, split, remixed, queried, and re-rendered.

## Social and anthropological analysis

### Binary oppositions

The six tags naturally decompose into three opposition pairs:

| Opposition | Tag A | Tag B | Cultural contradiction |
| --- | --- | --- | --- |
| Divine / Human | `Deity` | `Mortal` | Why do gods and humans coexist? |
| Place / Binding | `Realm` | `Chain` | Why is obligation spatial? |
| Order / Chaos-signal | `Law` | `Omen` | How does order know it will break? |

### Axis mundi

The `realmAxis` field makes geography cosmological rather than arbitrary. Every realm has a declared axis. Chains anchored to realms therefore ground social obligation in cosmic geography.

Candidate axis enum:

```haskell
data RealmAxis = Vertical | Horizontal | Radial | Spiral
```

### Monomyth mapping

| Monomyth stage | MythTome type | Field evidence |
| --- | --- | --- |
| Ordinary World | `Mortal` | `mortalTrait` |
| Call to Adventure | `Omen` | event or sign disrupting the ordinary |
| Supernatural Aid | `Deity` | `deityDomain` |
| Special World | `Realm` | `realmAxis` |
| Ordeal / Binding | `Chain` | `chainScope` |
| Return Law | `Law` | `lawDescription` |

## Project vision

MythTome should become a dual-channel authoring system:

- spoken narrative track
- semantic code track
- visual tag rendering
- optional audio rendering
- ontology graph export
- generative chapter composition

The system should feel like a mythic text that can also compile.

## Roadmap

### Phase 0 — Foundation

- Finalize the ontological vocabulary.
- Document the `MythLine` dual-track convention with examples.
- Define the color rendering schema.
- Choose target outputs: audio TTS, interactive web, print PDF.

### Phase 1 — Linguistic layer

- Write a formal grammar specification for the Tome hierarchy.
- Build a `MythLine` corpus across all six tag types.
- Design a parallel audio renderer: prose channel and code channel.
- Implement semantic annotations beyond string wrapping.
- Add `Omen` as a first-class type.

### Phase 2 — Social and anthropological layer

- Map binary opposition pairs to cultural contradictions per world.
- Implement `RealmAxis`.
- Model chain inheritance across generations.
- Add `deityRelations :: [Deity]`.
- Build a structural analyzer for binary opposition bundles.

### Phase 3 — Rendering and experience

- Build a dual-pane reader: prose left, color-tagged code right.
- Export illuminated PDF with code as marginalia.
- Generate ontology graphs.
- Implement a myth generator from seed `Deity` plus `Realm`.
- Create a community portal for submitting, reviewing, and forking Tomes.

### Phase 4 — Research publication

- Draft a paper on typed mythic grammar and computational poetics.
- Map MythTome types against world mythology traditions.
- Develop a course module: Myth, Code, and Structure.

## Immediate next steps

1. Add `Omen` as a first-class ontology type.
2. Write 20 prototype `MythLine` entries.
3. Lock the `RealmAxis` enum.
4. Decide the first rendering target.
5. Name the first Tome.

## Working-doc note

This document is not committed doctrine. It is a running document and may be revised freely until explicit commit.

