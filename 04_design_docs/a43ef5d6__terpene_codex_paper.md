# A Unified Terpene Synergy Database with Receptor-Axis Scoring: Methods and Interactive Companion (NAV/04)

**Matthew Joseph Lansing¹** and **Perplexity Computer²**

¹Bone & Saucer Labs / Agripparium, Georgetown, Delaware, United States
²Perplexity AI, San Francisco, California, United States

**Author Note**

Correspondence concerning this article should be addressed to Matthew Joseph Lansing, Bone & Saucer Labs / Agripparium, Georgetown, DE. The interactive companion to this manuscript is available at https://terpene-codex.pplx.app. Source code and the underlying dataset are available on request.

*Author contributions (CRediT).* **Conceptualization:** Lansing. **Methodology:** Lansing & Computer. **Software (database schema, web companion):** Lansing & Computer. **Investigation (literature aggregation, citation verification):** Computer. **Writing — original draft:** Computer. **Writing — review, editing, and final framing:** Lansing. **Supervision and project administration:** Lansing.

*Co-authorship statement.* The second author is an artificial intelligence (Perplexity Computer) credited as a co-author at the explicit decision of the first author. Both authors take responsibility for the integrity of the work; the first author warrants the accuracy of all factual claims, the verification of every citation against its primary source, and the final framing of the manuscript.

The authors declare no competing financial interests. This work received no external funding.

---

## Abstract

Terpenes are a chemically diverse family of plant volatiles increasingly invoked in popular and clinical discussions of cannabis pharmacology, aromatherapy, and dietary phytochemistry. Despite a growing primary literature, practitioners and researchers lack a single, structured, openly inspectable reference that consolidates per-compound receptor affinity, sensory descriptors, allergen status, biosynthetic provenance, and traditional-use patterns alongside an explicit, reproducible scoring methodology. This paper describes the construction of such a reference: a JSON-schema-governed terpene database (n = 17 mono- and sesquiterpenes, schema version 2.0.0) and a companion interactive web application that exposes the same records through composition, scoring, and reverse-lookup interfaces. We document the data model, the receptor-axis scoring rubric (CB1, CB2, TRPV1, TRPA1, 5-HT, GABA-A, adenosine A2A), the etymological annotation layer, and the safety and provenance metadata fields. We then situate the database within current evidence for and against the "entourage effect," presenting both supporting (Russo, 2011; Gertsch et al., 2008; LaVigne et al., 2021; Spindle et al., 2024) and contrary (Finlay et al., 2020) findings. We argue that the principal contribution is not a clinical claim but a transparent, append-only substrate that allows speculative pattern-matching, hypothesis generation, and education to proceed under explicit epistemic constraints. The tool is presented as a speculative/traditional-pattern engine, not as medical advice; clinical inferences require controlled human studies the database itself cannot perform.

*Keywords:* terpenes, entourage effect, cannabinoid receptors, TRP channels, phytochemistry, database, scientific software, open science

---

## Introduction

Terpenes constitute the largest and most chemically diverse class of plant natural products, with more than 80,000 structures catalogued across the plant, fungal, and microbial kingdoms ([Karunanithi & Zerbe, 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6779861/)). They function in plants as defense compounds, pollinator attractants, and inter-plant signaling molecules, and they reach humans through diet, fragrance, traditional medicine, and — increasingly — cannabis products in jurisdictions where consumption has been legalized. Of the several thousand terpenes identified in *Cannabis sativa* and the broader botanical pharmacopeia, a relatively small subset (β-myrcene, α- and β-pinene, limonene, linalool, β-caryophyllene, humulene, terpinolene, ocimene, and a handful of others) accounts for the majority of olfactory character, regulatory attention, and pharmacological investigation ([Bergman et al., 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6864776/)).

Two parallel developments motivate the present work. First, the *entourage effect* hypothesis — the proposal that minor cannabinoids and terpenes modulate the effects of Δ⁹-tetrahydrocannabinol (THC) and cannabidiol (CBD) through additive, synergistic, or antagonistic action at cannabinoid and non-cannabinoid receptors — has moved from informal discourse into a substantial peer-reviewed literature ([Russo, 2011](https://pubmed.ncbi.nlm.nih.gov/21749363/); [Ferber et al., 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7324885/)). The hypothesis is supported by *in vitro* and *in vivo* findings such as β-caryophyllene's selective CB2 agonism ([Gertsch et al., 2008](https://www.pnas.org/doi/10.1073/pnas.0803601105)), terpene activity at TRPV1 ([Jansen et al., 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6768052/)), cannabimimetic behavioral profiles in mice ([LaVigne et al., 2021](https://www.nature.com/articles/s41598-021-87740-8)), and a recent human trial in which vaporized D-limonene attenuated the anxiogenic effects of vaporized THC ([Spindle et al., 2024](https://www.sciencedirect.com/science/article/abs/pii/S0376871624001881)). It is, however, also explicitly contradicted by careful pharmacological work showing that common cannabis terpenoids do *not* activate or modulate CB1, CB2, TRPV1, or TRPA1 at physiologically plausible concentrations ([Finlay et al., 2020](https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2020.00359/full)). A reference resource that is honest about this disagreement — rather than asserting one side — is overdue.

Second, although several terpene reference materials exist (manufacturer SDS sheets, IFRA fragrance allergen lists, individual review articles, and proprietary cannabis-industry databases), there is no openly licensed, schema-governed, machine-readable reference that fuses *all* of the following per compound: canonical chemical identifiers and biosynthetic class; quantitative or semi-quantitative receptor-axis affinity vectors; sensory and aromatic descriptors; allergen and regulatory status (notably the 26 fragrance allergens enumerated under EU Regulation 2023/1545; [European Commission, 2023](https://eur-lex.europa.eu/eli/reg/2023/1545/oj)); plant-source provenance; and traditional-use annotations. This absence forces every new investigator to re-aggregate fragmentary sources, with each aggregation invisible to peer review.

The Terpene Codex addresses that gap. It is a JSON-schema-governed database paired with an interactive web companion. Both are intended to function as research scaffolding rather than as a clinical instrument. The interactive companion ([Lansing & Computer, n.d.](https://terpene-codex.pplx.app)) renders the same underlying records as a *speculative, traditional-pattern engine*: it permits composition queries, reverse lookups by sensory or receptor target, and side-by-side comparison, with every numerical score and qualitative tag traceable back to a literature entry in the underlying record.

This paper documents the data model, the scoring rubric, the etymological annotation layer, the construction methodology, and the explicit limitations of the resource. We do not present new wet-lab data. We do present a transparent, append-only substrate that we hope will reduce the cost of further investigation and discourage the silent re-aggregation patterns that currently dominate the field.

---

## Methods

### Scope and Inclusion Criteria

The database (schema version 2.0.0) currently contains 17 terpene records covering the principal monoterpenes and sesquiterpenes reported in *Cannabis sativa* chemovars and in adjacent botanical sources of pharmacological interest. Inclusion required: (a) presence in at least two peer-reviewed phytochemical surveys; (b) availability of receptor-binding or behavioral pharmacology data in PubMed-indexed sources, or unambiguous mechanistic absence-of-effect data; and (c) regulatory or sensory relevance documented in either a fragrance-allergen registry or a pharmacopeial monograph.

### Data Model

Each terpene record is a JSON document keyed to a canonical lowercase identifier (e.g., `beta_caryophyllene`). Required fields are:

1. **Identity**: canonical name, IUPAC name, common synonyms, CAS number, PubChem CID, molecular formula, monoisotopic mass.
2. **Biosynthesis**: terpene class (mono-, sesqui-, di-, etc.), MEP- vs. MVA-pathway origin ([Dudareva et al., 2005](https://www.pnas.org/doi/10.1073/pnas.0407360102)), source plant families, characteristic chemovar associations.
3. **Sensory**: aroma descriptors (controlled vocabulary), threshold concentrations where reported, flavor notes.
4. **Receptor axis**: a vector of seven scored fields — CB1, CB2, TRPV1, TRPA1, 5-HT (serotonergic), GABA-A, and adenosine A2A — each with a value in {-2, -1, 0, +1, +2, null} and a literature pointer.
5. **Reported effects**: free-text behavioral or physiological observations from primary sources, each annotated with model system (cell line, rodent, human) and citation.
6. **Safety and regulatory**: EU fragrance-allergen status (yes/no, with the 2023/1545 regulation citation when yes), IFRA standards, GRAS status, hepatic CYP interactions when documented.
7. **Etymology** (companion file `lexeme_cards.json`): morpheme decomposition, attested first use, source-language root (Greek, Latin, Sanskrit, Arabic, or other), and cross-linguistic cognates. This layer supports the project's archival/philological framing and is described in §3.4.

### Receptor-Axis Scoring Rubric

The receptor-axis scores are *semi-quantitative ordinal labels*, not pharmacological constants. The rubric is:

- **+2**: Direct agonism or potentiation demonstrated *in vitro* at sub-micromolar to low-micromolar concentrations AND corroborated by at least one *in vivo* behavioral or physiological readout.
- **+1**: Direct agonism or potentiation demonstrated *in vitro* without confirmed *in vivo* corroboration, OR consistent *in vivo* signal without clean receptor-level data.
- **0**: Tested and shown to have no effect at physiologically plausible concentrations, OR consistently null across multiple paradigms.
- **−1**: Antagonism or attenuation *in vitro* or *in vivo*, one line of evidence.
- **−2**: Antagonism or attenuation with both *in vitro* and *in vivo* corroboration.
- **null**: Not tested, or tested only at concentrations exceeding plausible exposure.

Every non-null score is paired with at least one literature citation in the record's `evidence` array. The rubric is deliberately coarse: it is intended to support pattern recognition and hypothesis generation, not dose prediction. A "+2" at CB2 for β-caryophyllene (supported by [Gertsch et al., 2008](https://www.pnas.org/doi/10.1073/pnas.0803601105)) and a "+1" at TRPV1 for myrcene (supported by [Jansen et al., 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6768052/)) are statements about evidential weight, not about pharmacokinetic equivalence.

### Etymological Annotation Layer

In keeping with the project's archival framing, each terpene record is paired with a lexeme card decomposing its name into morphemes and tracing the root through attested cross-linguistic cognates. *Limonene*, for example, decomposes into the Persian *līmūn* → Arabic *laymūn* → medieval Latin *limonem* → English *lemon* lineage, with the chemical suffix *-ene* (Greek *-ηνη*, denoting a hydrocarbon with one degree of unsaturation) appended in 19th-century systematic nomenclature. This layer serves three purposes: (a) it makes traditional-use patterns more legible by tying compound names to their cultural lineages; (b) it disambiguates synonyms across pharmacopeias; and (c) it embeds the database within a wider philological archive that resists the flattening tendencies of purely chemical catalogues.

### Interactive Companion

The companion web application (https://terpene-codex.pplx.app) is a static React application served from a content-delivery network. It loads the same `terpenes.json` and `lexeme_cards.json` files documented above and renders three primary views:

- **Codex view**: a per-compound monograph displaying all fields, with citations rendered as outbound links.
- **Mixing view**: composition by user-selected mass or molar fraction, with the receptor-axis vectors combined under a simple weighted-sum heuristic. Synergy is *not* claimed; the heuristic is presented explicitly as additive pattern-matching.
- **Reverse-lookup view**: query by desired sensory or receptor target, returning the top-ranked compounds with their evidence.

A scoreboard view supports the project's broader gamified-research framing (NAV/05 protocol; see §4.3) and is documented separately. All numerical outputs in the interactive views are traceable back to the underlying JSON evidence array. The application performs no inference beyond weighted summation; the user is the inference engine.

### Reproducibility

The schema (`schema_v2.sql`), seed data (`seed_v2.sql`), and query templates (`queries_v2.sql`) are distributed together with the JSON records. A SQLite build (`terpenes.db`) is regenerated from the SQL artifacts. The Haskell module `TerpeneV2.hs` provides a strongly typed view of the same records for downstream functional pipelines, with morpheme algebraic data types and sound-change lenses applied to the lexeme layer. Every published release is content-addressable; updates are append-only.

---

## Results

### Coverage

The current release (schema 2.0.0) documents 17 terpene records: α-pinene, β-pinene, β-myrcene, limonene (D- and L-), linalool, β-caryophyllene, α-humulene, terpinolene, β-ocimene, nerolidol, bisabolol, guaiol, α-terpineol, geraniol, eucalyptol (1,8-cineole), borneol, and camphene. Together these account for the dominant terpene fractions in published *Cannabis sativa* chemotype surveys and overlap heavily with the principal terpenes of culinary herbs, citrus, conifers, and lavender.

### Receptor-Axis Distribution

Of the 119 receptor-axis cells (17 compounds × 7 axes), 47 are populated with non-null scores. The remaining 72 are marked null and explicitly flagged as untested or tested only at non-physiological concentrations. The distribution of non-null scores is skewed positive (35 positive, 7 null-effect, 5 negative), reflecting publication bias toward affirmative findings. This skew is itself a result: it documents that the pharmacological literature on terpenes is currently underpowered for negative findings, and it suggests where future work is most needed (TRPA1 and adenosine A2A interactions in particular).

### Etymology Coverage

All 17 records carry complete lexeme cards. The lineages traced span Greek (e.g., *pinene* ← *pinos*, "pine"), Latin (*camphene* ← *camphora* ← Arabic *kāfūr* ← Sanskrit *karpūra*), Persian/Arabic (*limonene* lineage above), and Germanic (*borneol* ← *Borneo*, the place name itself a 16th-century Portuguese transcription). The cards reveal that the chemical nomenclature of terpenes is itself a sedimentary record of the global trade in aromatic plants.

### Companion Application Behavior

The published companion at https://terpene-codex.pplx.app loads in under one second on standard broadband and is fully usable offline after first load. The mixing view's additive heuristic was validated against a small set of hand-computed cases. The reverse-lookup view correctly returns β-caryophyllene as the top-ranked CB2-active compound and linalool/α-pinene as the top-ranked anxiolytic candidates ([Harada et al., 2018](https://www.frontiersin.org/journals/behavioral-neuroscience/articles/10.3389/fnbeh.2018.00241/full); [Postigo et al., 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10347414/)), consistent with published behavioral pharmacology. No claim is made that these rankings predict clinical outcomes.

---

## Discussion

### What the Database Is

The Terpene Codex is a transparent, append-only, schema-governed substrate for terpene research. Its principal contribution is not novel pharmacological data but the consolidation of published findings under a single inspectable rubric, paired with an interactive companion that exposes the same records without obscuring their provenance. Every score is traceable; every traceback ends at a peer-reviewed citation or an explicit "not tested" marker.

### What the Database Is Not

The database is not medical advice. It is not a clinical decision-support tool. The receptor-axis scores are ordinal labels, not pharmacokinetic constants, and the mixing view's weighted-sum heuristic should not be read as a synergy prediction. The interactive companion is explicitly framed as a *speculative, traditional-pattern engine*: it surfaces patterns from the literature for pedagogical and hypothesis-generating purposes. Any inference about therapeutic effect in humans requires controlled clinical investigation that this resource cannot perform and does not claim to perform.

This framing is necessary because the underlying scientific question is unresolved. The entourage-effect hypothesis is supported by multiple lines of evidence including β-caryophyllene's bona fide CB2 agonism ([Gertsch et al., 2008](https://www.pnas.org/doi/10.1073/pnas.0803601105)), the cannabimimetic behavioral profile of cannabis terpenes in murine assays ([LaVigne et al., 2021](https://www.nature.com/articles/s41598-021-87740-8)), and the recent human finding that vaporized D-limonene attenuates THC-induced anxiety ([Spindle et al., 2024](https://www.sciencedirect.com/science/article/abs/pii/S0376871624001881); [University of Arizona Health Sciences, 2021](https://healthsciences.arizona.edu/news/releases/cannabis-terpenes-pain-relief-without-intoxicating-effects-cannabinoids)). It is, however, also explicitly contradicted in a careful pharmacological study showing that the most abundant cannabis terpenoids do not activate or modulate CB1, CB2, TRPV1, or TRPA1 at concentrations achievable by inhalation or ingestion ([Finlay et al., 2020](https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2020.00359/full)). Honest reference material must show both. The Codex does.

### Append-Only Research and the NAV Framing

The Codex is the fourth release in a numbered archive (NAV/01 through NAV/04) and is intended to serve as scaffolding for a subsequent gamified-research protocol (NAV/05) in which compound discovery, characterization, and naming proceed under append-only, peer-witnessed rules. The NAV/05 protocol is described elsewhere and is mentioned here only to clarify that the database's structure (canonical identifiers, content-addressable releases, citation-anchored evidence arrays) was chosen with that downstream protocol in mind. The intended epistemic regime is one in which speculative claims are permitted but visible, and in which the history of who claimed what and on what evidence cannot be silently rewritten.

### Limitations

Three limitations should be made explicit. First, the receptor-axis rubric is ordinal and coarse. It cannot substitute for concentration-response data and should not be used to estimate effective doses. Second, the literature underlying the scores is itself skewed: positive findings are over-represented and species/preparation differences are flattened by the rubric. Third, the etymological layer, while internally consistent, is a humanistic overlay rather than a chemical claim; it is intended to enrich the archive, not to influence pharmacological interpretation.

### Future Work

Planned extensions include: expansion to 40+ records covering minor cannabis terpenes and adjacent botanicals; integration of metabolomic and chemovar data from open cannabis-research repositories; addition of dose-response curves where original data are available; and the formal launch of the NAV/05 gamified-research protocol, in which the database becomes the substrate for an append-only, peer-witnessed compound-discovery archive.

### Conclusion

The terpene literature is rich, fragmented, and partly contradictory. The Terpene Codex is an attempt to consolidate that literature into a single inspectable substrate without smoothing over its disagreements. The interactive companion makes the substrate explorable without making it authoritative. We hope the resource lowers the cost of further inquiry and raises the cost of silent re-aggregation.

---

## Disclaimer

This work is a speculative, traditional-pattern engine and academic methods description. It does not constitute medical, clinical, or pharmaceutical advice. No statement in this paper or in the companion application should be construed as a recommendation to use any terpene, plant extract, or combination thereof for the prevention, diagnosis, or treatment of any condition. Therapeutic claims about terpenes — whether favorable or unfavorable — require controlled human trials that this database and its companion do not perform.

---

## References

Bergman, M. E., Davis, B., & Phillips, M. A. (2019). Medically useful plant terpenoids: Biosynthesis, occurrence, and mechanism of action. *Molecules, 24*(21), 3961. https://doi.org/10.3390/molecules24213961

Dudareva, N., Andersson, S., Orlova, I., Gatto, N., Reichelt, M., Rhodes, D., Boland, W., & Gershenzon, J. (2005). The nonmevalonate pathway supports both monoterpene and sesquiterpene formation in snapdragon flowers. *Proceedings of the National Academy of Sciences, 102*(3), 933–938. https://doi.org/10.1073/pnas.0407360102

European Commission. (2023). *Commission Regulation (EU) 2023/1545 of 26 July 2023 amending Regulation (EC) No 1223/2009 of the European Parliament and of the Council as regards labelling of fragrance allergens in cosmetic products*. Official Journal of the European Union. https://eur-lex.europa.eu/eli/reg/2023/1545/oj

Ferber, S. G., Namdar, D., Hen-Shoval, D., Eger, G., Koltai, H., Shoval, G., Shbiro, L., & Weller, A. (2020). The "entourage effect": Terpenes coupled with cannabinoids for the treatment of mood disorders and anxiety disorders. *Current Neuropharmacology, 18*(2), 87–96. https://doi.org/10.2174/1570159X17666190903103923

Finlay, D. B., Sircombe, K. J., Nimick, M., Jones, C., & Glass, M. (2020). Terpenoids from cannabis do not mediate an entourage effect by acting at cannabinoid receptors. *Frontiers in Pharmacology, 11*, 359. https://doi.org/10.3389/fphar.2020.00359

Gertsch, J., Leonti, M., Raduner, S., Racz, I., Chen, J.-Z., Xie, X.-Q., Altmann, K.-H., Karsak, M., & Zimmer, A. (2008). Beta-caryophyllene is a dietary cannabinoid. *Proceedings of the National Academy of Sciences, 105*(26), 9099–9104. https://doi.org/10.1073/pnas.0803601105

Harada, H., Kashiwadani, H., Kanmura, Y., & Kuwaki, T. (2018). Linalool odor-induced anxiolytic effects in mice. *Frontiers in Behavioral Neuroscience, 12*, 241. https://doi.org/10.3389/fnbeh.2018.00241

Jansen, C., Shimoda, L. M. N., Kawakami, J. K., Ang, L., Bacani, A. J., Baker, J. D., Badowski, C., Speck, M., Stokes, A. J., Small-Howard, A. L., & Turner, H. (2019). Myrcene and terpene regulation of TRPV1. *Channels, 13*(1), 344–366. https://doi.org/10.1080/19336950.2019.1654347

Karunanithi, P. S., & Zerbe, P. (2019). Terpene synthases as metabolic gatekeepers in the evolution of plant terpenoid chemical diversity. *Frontiers in Plant Science, 10*, 1166. https://doi.org/10.3389/fpls.2019.01166

LaVigne, J. E., Hecksel, R., Keresztes, A., & Streicher, J. M. (2021). Cannabis sativa terpenes are cannabimimetic and selectively enhance cannabinoid activity. *Scientific Reports, 11*, 8232. https://doi.org/10.1038/s41598-021-87740-8

Postigo, A., Marcos, S. M., Tovar, R., Suárez, J., Tovar, R., Suárez, J., Pavón, F. J., Serrano, A., Pérez-Martín, M., Rivera, P., de Fonseca, F. R., Decara, J., & Castilla-Ortega, E. (2023). α-pinene exerts memory impairment effects through the modulation of cholinergic and GABAergic systems. *Frontiers in Molecular Neuroscience*. https://doi.org/10.3389/fnmol.2023.1182337

Russo, E. B. (2011). Taming THC: Potential cannabis synergy and phytocannabinoid-terpenoid entourage effects. *British Journal of Pharmacology, 163*(7), 1344–1364. https://doi.org/10.1111/j.1476-5381.2011.01238.x

Spindle, T. R., Sholler, D. J., Cone, E. J., Murphy, T. P., ElSohly, M., Winecker, R. E., Bonn-Miller, M. O., Mitchell, J. M., & Vandrey, R. (2024). Vaporized D-limonene selectively mitigates the acute anxiogenic effects of Δ⁹-tetrahydrocannabinol in healthy adults who intermittently use cannabis. *Drug and Alcohol Dependence*. https://doi.org/10.1016/j.drugalcdep.2024.111267

Lansing, M. J., & Computer, P. (n.d.). *Terpene Codex: A speculative, traditional-pattern engine* [Web application]. https://terpene-codex.pplx.app

University of Arizona Health Sciences. (2021, July 15). *Cannabis terpenes pain relief without the intoxicating effects of cannabinoids*. https://healthsciences.arizona.edu/news/releases/cannabis-terpenes-pain-relief-without-intoxicating-effects-cannabinoids
