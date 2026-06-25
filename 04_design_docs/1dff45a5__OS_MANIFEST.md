# Graft Memory OS

Status: working document until commit.

Graft Memory OS bundles the game, Velma, the Archive, and Cybernetic Chain into one text-first operating layer.

## Kernel law

Everything is playable until commit; nothing is authoritative until memory writes it.

## Bundled subsystems

- Game Layer — archetypes, wagons, CAPEX, NPC fellow-travelers, Bell to Bell.
- Archive Layer — Graft Memory Archive docs, MythTome, Noir Myths, semantic renderer.
- Chain Layer — CyberneticChain event/block validation and prong checks.
- Velma Layer — OS librarian, router, clue-binder, and commit guardian.
- Commit Layer — working-doc boundary, audit memory, authority transfer.

## Modes

```text
GameMode
ArchiveMode
ChainMode
MythMode
CommitMode
```

## Velma's job

Velma is not just an NPC. Velma is the OS-facing persona that keeps the system playable, searchable, safe, and coherent.

Velma:

- indexes working docs
- routes scenes
- binds clues to memory
- refuses silent authority transfer
- watches Breaker events
- guards commit ceremonies

## First build target

Create a text-only OS loop:

```text
boot
  -> choose mode
  -> choose archetype
  -> attach wagon / CAPEX / fellow-traveler
  -> enter scene
  -> log action
  -> validate chain event
  -> commit or keep working
```

