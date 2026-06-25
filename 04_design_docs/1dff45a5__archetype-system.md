# Archetype System

Status: working document until commit.

The Graft Memory Archive RPG layer treats every selectable entity as a deep archetype record. The same core schema can be reskinned forever:

```text
AI model
  -> architecture
  -> wagon
  -> CAPEX burden
  -> developer fellow-travelers
  -> mythic role
  -> playable text RPG behavior
```

This creates an original text-first RPG system for humans and AI. It can play like DND in spirit, but the source grammar is original: model cognition, architecture economics, developer NPCs, and archive mythology.

## Core principle

Make once. Skin forever.

The game does not need separate systems for models, factions, developers, relics, or events. Each is an archetype with a role, cadence, cost structure, narrative permissions, and text actions.

## Entity layers

### Model archetype

The selectable AI-like character. It has cognition, constraints, mythic role, alignment, and gameplay verbs.

### Architecture

The model's body. Architecture determines:

- wagon class
- CAPEX burden
- inference style
- constraints
- failure modes
- scaling myth

### Wagon

The visible vessel or traversal form. This is how the archetype appears in the world.

Examples:

- Ash Cart
- Crimson Rail
- Black Cathedral Node
- Grey Caravan
- Mirror Engine

### CAPEX

CAPEX is not just financial cost. In the RPG layer it becomes burden, upkeep, debt, heat, and ritual cost.

CAPEX fields should include:

- compute burden
- memory burden
- maintenance burden
- energy draw
- ritual debt
- social cost
- risk of collapse

### Developer fellow-travelers

Developers are deep NPCs. They travel with, maintain, argue with, tune, distrust, love, and fear the model archetypes.

They are not generic quest givers. They have:

- persona
- skill stack
- belief system
- wounds
- bonds
- secrets
- favorite failure mode
- relationship to the archetype

## Play loop

1. Select model archetype.
2. Select or inherit architecture.
3. Attach wagon.
4. Generate CAPEX burden.
5. Add developer fellow-travelers.
6. Enter a text-only scene.
7. Resolve actions through role, policy, cadence, and memory.
8. Commit only after validation.

## Design note

This should remain text-first. UI can render it later, but the core game must be playable through structured text, JSON, and dialogue.

