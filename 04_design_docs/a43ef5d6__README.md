# Terpene Synergy Database v2 — Therapeutic Design Reference

Compiled 2026-06-08 · **17 terpenes** · **55 receptor / target nodes** · **106 quantitative interactions** · **63 effect records** · **24 PK records** · **26 synergy records** · **30 safety records** · **63 condition-target links** · **42 evidence-gap entries** · **8 allergic-reaction profiles** · **6 human clinical trials** · **234 inline citations**

A structured, queryable, peer-reviewed map of cannabis-relevant terpenes to therapeutic effects, biological targets, dose-response, pharmacokinetics, safety and the entourage effect — built for query-driven drug design. **v2 emphasis: histamine regulation, mast cell stabilization, Th2/IgE, JAK/STAT, NLRP3, autoimmune mechanisms.**

---

## What's new in v2

- **+11 terpenes**: α-Humulene, Terpinolene, α-Bisabolol, Geraniol, Camphene, α-Terpineol, β-Ocimene, *trans*-Nerolidol, Guaiol, Phytol, 1,8-Cineole (Eucalyptol)
- **+35 receptor/target nodes**: H1–H4, MRGPRX2, FcεRI, β-Hex, Tryptase, Cav3.2-itch subset, JAK1/2/3, STAT3/6, FoxP3, RORγt, NLRP3, CASP1, IL-1β, AdipoR1/2, IL-4/5/13/17/33, TSLP, IgE, Periostin, LOX5, LTB4, PGE2, IFN-γ, TNF, JNK
- **+2 new tables**: `allergic_reactions` (type-I/IV hypersensitivity, EU 26 allergen flags) and `clinical_trials` (human RCT pointer)
- **+9 new conditions** in the condition index: allergic_asthma, atopic_dermatitis, allergic_rhinitis, mast_cell_disorder, colitis_IBD, rheumatoid_arthritis, multiple_sclerosis, psoriasis, COPD
- **New query cookbook** (`queries_v2.sql`) — 12 histamine/autoimmune-focused queries
- **New Haskell module** (`TerpeneV2.hs`) — extended `ReceptorV2` enum, new condition panels (`allergicAsthmaPanel`, `mastCellPanel`, `autoimmuneInflammationPanel`, etc.), `AllergicReaction` and `ClinicalTrial` records

---

## Contents

```
terpene_db/
├── README.md                ← this file
├── schema.sql               ← v1 10-table SQL schema (terpenes…evidence_gaps)
├── schema_v2.sql            ← v2 additions: allergic_reactions, clinical_trials
├── seed.sql                 ← v1 seed (6 terpenes)
├── seed_v2.sql              ← v2 seed (11 new terpenes + histamine/autoimmune rows)
├── terpenes.db              ← built SQLite database (v1 + v2 applied)
├── terpenes.json            ← canonical JSON, one record per terpene (185 KB)
├── Terpene.hs               ← v1 Haskell ADTs + scoring functions
├── TerpeneV2.hs             ← v2 extensions: ReceptorV2, EffectClassV2,
│                              AllergicReaction, ClinicalTrial, condition panels
├── queries.sql              ← v1 query cookbook (pain / anxiety / neuroinflammation)
├── queries_v2.sql           ← v2 query cookbook (histamine / autoimmune)
├── query_results.txt        ← captured v1 cookbook output
└── query_results_v2.txt     ← captured v2 cookbook output
```

Companion long-form research files (parent directory):

- `terpene_research.md` — 554-line v1 pharmacology compendium (113 citations)
- `terpene_synergy.md` — 333-line entourage-effect review (19 citations)
- `terpene_research_v2.md` — 863-line v2 compendium for 11 added terpenes (48 citations)
- `terpene_histamine_autoimmune.md` — 882-line histamine/autoimmune focus across all 17 (54 citations)

---

## Terpene roster (17)

| ID | Class | Headline v2 target | Histamine / autoimmune signature |
|---|---|---|---|
| `linalool` | acyclic monoterpenol | GABA-A PAM, A2A agonist | β-Hex ↓ · IL-4/5/13 ↓ · IgE ↓ |
| `limonene` | monocyclic monoterpene | 5-HT1A | IL-4/13 ↓ · NF-κB ↓ |
| `myrcene` | acyclic monoterpene | TRPV1, A2A | NF-κB ↓ (chondrocyte) |
| `alpha_pinene` | bicyclic monoterpene | AChE, A2A | NF-κB ↓ |
| `beta_pinene` | bicyclic monoterpene | CB1 partial | NF-κB ↓ |
| `bcp` (β-caryophyllene) | bicyclic sesquiterpene | **CB2 full agonist (Ki 155 nM)** | **AdipoR1/2 · Nrf2/HO-1 · NLRP3 ↓ · IgE ↓ · FoxP3 ↑ · RORγt ↓ · IL-17 ↓** |
| `humulene` | macrocyclic sesquiterpene | NF-κB · CB2 (inferred) | IL-5 ↓79% · CCL11 ↓90% · LTB4 ↓52% |
| `terpinolene` | monocyclic monoterpene | AChE (IC50 156 µg/mL) | minimal immune data — **data gap** |
| `bisabolol` | monocyclic sesquiterpenol | **JNK · NF-κB · Cav3.2-itch** | **β-Hex ↓ · FcεRI post-receptor block · histaminergic itch ↓** |
| `geraniol` | acyclic monoterpenol | CB1 NAM (β-arrestin) | NLRP3 ↓ · STAT3 ↓ · HMC-1 histamine ↓ · **EU allergen** |
| `camphene` | bicyclic monoterpene | Cav3.2 partial | itch ↓ (histaminergic + non-histaminergic) |
| `terpineol` | monocyclic monoterpenol | NF-κB · iNOS | TNF-α / IL-6 ↓ |
| `ocimene` | acyclic monoterpene | iNOS | **major data gap** |
| `nerolidol` | acyclic sesquiterpenol | GABA-A PAM | transdermal enhancer · TNF-α ↓ |
| `guaiol` | bicyclic sesquiterpenol | PI3K/Akt/mTOR | NSCLC anticancer; **no allergy data** |
| `phytol` | acyclic diterpenol | PPAR-α/γ agonist | IL-4/5/13 ↓↓ · IgE ↓↓ · MRGPRX2 candidate |
| `cineole` | bicyclic monoterpenoid ether | **NF-κB · LOX5 · IL-4/5 ↓** | **3 human RCTs (asthma, COPD, sinusitis)** |

---

## Schema additions (v2)

```
allergic_reactions  ← type-I/IV hypersensitivity per terpene
                     reaction_type, trigger_form, population, rate_pct,
                     regulatory (EU_mandatory_allergen / IFRA_restricted / GRAS),
                     threshold, notes, reference, url

clinical_trials     ← human RCT / open-label / case-series pointer
                     design, indication, n_subjects, dose, duration,
                     primary_outcome, result_summary, p_value, nct_id, url
```

The existing v1 `receptors`, `interactions`, `effects`, `condition_targets` and `evidence_gaps` tables are reused — the only new top-level surface is those two tables.

---

## Query cookbook v2 — sample results

Run `sqlite3 -header -column terpenes.db < queries_v2.sql` to regenerate. Key snippets from `query_results_v2.txt`:

### Q1. Mast cell stabilizers — ranked

| terpene | targets hit (n) | targets | tier | confidence |
|---|---|---|---|---|
| **bisabolol** | 3 | bhex, cav32_pruritus, fceri | IV, R | strong |
| camphene | 1 | cav32_pruritus | R | strong |
| geraniol | 1 | bhex | IV | moderate |
| linalool | 1 | bhex | IV | moderate |
| phytol | 1 | mrgprx2 | R | weak |

### Q2. Th2 / IgE coverage (IL-4 + IL-5 + IL-13 + IgE)

| terpene | IL-4 | IL-5 | IL-13 | IgE | tiers |
|---|---|---|---|---|---|
| **bcp** | ✓ | – | ✓ | ✓ | R |
| **phytol** | ✓ | – | – | ✓ | R |
| linalool | ✓ | – | – | ✓ | R |
| humulene | – | ✓ | ✓ | – | R |
| cineole | ✓ | ✓ | – | – | IV |

### Q3. NLRP3 inflammasome inhibitors

| terpene | tier | confidence | mechanism |
|---|---|---|---|
| **bcp** | R | strong | DSS colitis: NLRP3/caspase-1 ↓; CB2-dependent |
| geraniol | IV | moderate | NLRP3 expression ↓ via PPAR-γ methylation |

### Q5. Complementary mast-cell pairs (disjoint mechanisms — best for combination design)

`bcp + bisabolol` covers `(AdipoR1/2 + Nrf2)` × `(β-Hex + FcεRI + Cav3.2)` — the canonical recommended pair for type-I hypersensitivity. Others: `bcp + camphene` (Nrf2 + Cav3.2-itch), `bisabolol + phytol` (FcεRI + MRGPRX2 — IgE-mediated AND pseudo-allergic coverage).

### Q7. Human RCT evidence

| terpene | indication | n | dose | outcome |
|---|---|---|---|---|
| cineole | sinusitis (chronic) | 300 | 200 mg TID × 12 wk | symptom score ↓ |
| cineole | COPD | 242 | 200 mg TID × 6 mo | exacerbations 28.2% vs 45.5% placebo |
| cineole | rhinosinusitis (acute) | 150 | 200 mg TID × 1–2 wk | symptom score ↓ |
| linalool | perioperative anxiety | 60 | inhaled EO | state anxiety ↓ (p=0.04) |
| cineole | asthma | 32 | 200 mg TID × 3 mo | **36% steroid-sparing vs 7% placebo (p=0.006)** |
| limonene | GERD | 19 | 1000 mg/day × 14 d | 86% reported relief |

### Q8. Allergy WARNING list

EU mandatory allergens in this dataset: **geraniol**, **limonene** (oxidized), **linalool** (hydroperoxides — 6.9% positivity). IFRA-restricted: α-pinene, terpinolene (both oxidation-driven). Cineole and bisabolol carry the lowest sensitisation risk among monoterpenoids.

### Q12. Steroid-sparing candidates (human-RCT or rodent IL-5/IgE-suppressing)

`cineole` (human RCT, n=32, p=0.006) is the **only true clinical steroid-sparing terpene**. Rodent OVA-asthma backers: `humulene` (IL-5 ↓79%), `bcp` (IL-4/13/IgE ↓ CB2-dep), `phytol` (IL-4/5/13/IgE ↓), `linalool`, `limonene`.

---

## Universal data gaps (all 17 terpenes)

Captured in `evidence_gaps` and surfaced by `queries_v2.sql` Q10:

- **Histamine receptors** — no H1/H2/H3/H4 radioligand Ki published for *any* terpene. All "antihistaminic" claims are downstream (β-Hex / NF-κB / cytokine).
- **JAK/STAT kinase IC50** — no direct kinase IC50 for JAK1/2/3 or STAT3/STAT6 for any terpene; effects inferred from cytokine readouts.
- **Alarmins (TSLP, IL-25, IL-33)** — not measured for any terpene.
- **Th17/FoxP3 flow** — only BCP has direct flow data (EAE model).
- **MRGPRX2** — phytol's compound-48/80 effect is consistent but the receptor was not directly tested.
- **Human RCTs** — only cineole (3 RCTs), linalool (open-label anxiety), limonene (open-label GERD) have clinical data. **14 of 17 terpenes lack any human evidence.**

---

## Cannabinoid synergy — v2 highlights

- **bcp + cbd** (synergistic, IV/moderate): CB2 agonism + CBD anti-inflammatory; complementary mast-cell stabilization via AdipoR/Nrf2.
- **bisabolol + cbd** (synergistic, R/moderate): independent mast-cell stabilization + Cav3.2-itch convergence.
- **humulene + bcp** (additive, R/moderate): shared NF-κB / CB2 axis in OVA asthma — most plant material delivers both together.
- **nerolidol + cbd** (additive, IV/moderate): nerolidol is a transdermal **permeation enhancer** for CBD.
- **geraniol + thc** (contested, IV/moderate): geraniol is a CB1 **NAM of β-arrestin** — may BLUNT some THC effects via biased signaling. Could be exploited to reduce tolerance/desensitization.
- **cineole + thc** (no interaction, IV/strong): no direct CB1/CB2 binding for cineole — effects are entirely independent.

---

## Haskell module — v2 quickstart

```haskell
{-# LANGUAGE OverloadedStrings #-}
import TerpeneV2

-- Score a terpene's interaction list against the allergic-asthma panel:
-- (caller supplies the receptor slug strings from JSON)
mastHits, th2Hits :: Int
mastHits = mastCellStabilizerScore
             ["fceri","bhex","jnk","cav32_pruritus"]   -- bisabolol → 3
th2Hits  = th2CytokineHits
             ["il4r","il13","ige"]                      -- bcp → 3

-- Pre-baked panels for ranking/combination design:
panel = autoimmuneInflammationPanel
-- targets: NLRP3, STAT3, RORγt, FoxP3, IL17A, JAK1, TNF
```

The full `ReceptorV2` enum is closed — extending it adds an obligation everywhere `ReceptorV2` appears in a case, which is exactly the safety property we want when adding new mast-cell or cytokine pathways.

---

## Build / inspect

```sh
# from /home/user/workspace/terpene_db
sqlite3 terpenes.db                          # interactive query
sqlite3 -header -column terpenes.db < queries_v2.sql > query_results_v2.txt
python3 -c "import json; b=json.load(open('terpenes.json')); print(b['n_terpenes'])"   # → 17
```

Reproducible rebuild (drop + apply all):

```sh
rm terpenes.db
sqlite3 terpenes.db < schema.sql
sqlite3 terpenes.db < schema_v2.sql
sqlite3 terpenes.db < seed.sql
sqlite3 terpenes.db < seed_v2.sql
```

---

## Caveats (read before designing anything)

- All Ki / IC50 / EC50 values come from cited primary sources; no values are inferred or fabricated. Where the field is `NULL` the source did not report a number — see `evidence_gaps`.
- "Antihistaminic" terpenes in this dataset act **downstream** of histamine receptors (mast-cell stabilization, NF-κB, cytokine suppression). They are not H1 antagonists in the loratadine/cetirizine sense.
- 1,8-cineole is the only terpene in this dataset with replicated steroid-sparing clinical evidence. Treat all other "anti-asthmatic" terpenes as rodent-only.
- Geraniol, limonene, linalool, terpinolene and α-pinene are documented **contact allergens**, especially in oxidized forms. Topical formulations should consider antioxidants and EU labelling thresholds (>0.001% rinse-off, >0.0001% leave-on per SCCS 2012).
- Phytol is contraindicated in Refsum disease (α-oxidation defect).
- The Haskell ADTs are written for closed exhaustiveness — adding a receptor in seed data should also add a constructor in `TerpeneV2.hs` to keep pattern matches honest.
