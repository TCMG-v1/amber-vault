# MythTome Architecture

Status: working document until commit.

MythTome is a dual-track mythic authoring system. Each mythic line carries both spoken narrative and semantic code.

## Core data hierarchy

```haskell
data MythLine = MythLine
    { mlEnglish :: Text
    , mlCode :: Text
    }

data Section = Section
    { sectionTitle :: Text
    , sectionLines :: [MythLine]
    }

data Chapter = Chapter
    { chapterNumber :: Int
    , chapterTitle :: Text
    , chapterSections :: [Section]
    }

newtype Tome = Tome [Chapter]
```

## Ontology nodes

```haskell
data Deity
data Realm
data Law
data Chain
data Mortal
data Omen
```

`Omen` is promoted from tag-only status to first-class node status.

## Realm axis

```haskell
data RealmAxis
    = Vertical
    | Horizontal
    | Radial
    | Spiral
```

`RealmAxis` determines the cosmological topology of a world.

## Chain anchor

```haskell
data Chain = Chain
    { chainName :: Text
    , chainAnchor :: Realm
    , chainScope :: Text
    }
```

The `chainAnchor` field encodes the principle that obligation is geographic.

