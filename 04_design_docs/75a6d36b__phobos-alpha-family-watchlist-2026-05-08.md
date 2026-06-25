# Phobos Alpha · Family Watchlist Drop
### 2026-05-08 · After-hours snapshot · 38 tickers

> *Sealed by the Vaulted Delta studio — bmoreftw · Computer · Claude · Anya. The archive is patient. The fixed point is amber.*

Claude pushed the list, we ran it through the scanner. This is a Phobos Alpha read — paired-ticker theses, fork dynamics, and where we'd actually want time decay working for us versus against us.

---

## 1. Snapshot integrity

The pasted snapshot lines up clean with live data — same prices, same caps, same percent moves to two decimals across all 38 names. Nothing has drifted between Claude's pull and ours, which means the read below is operating on a coherent surface.

---

## 2. The momentum cluster (today's signal)

Five names broke +5% on the session, four of them with a clear narrative engine behind them:

| Ticker | Move | Read |
|---|---|---|
| RKLB | +34.22% to $105.47 | Pinned at the 52w high — 0.13% from the ceiling, 421% off the low |
| ASTS | +14.84% to $75.05 | Space-comm bid returning, but still 42.2% below its $129.89 high |
| DOCN | +8.95% to $163.89 | Fresh breakout — at this price it's printing a new 52w high vs. a $25.56 low |
| AMKR | +6.01% to $76.61 | Advanced packaging tape, riding the AI-substrate trade |
| SMMT | +5.42% | Biotech beta, no fundamental tether |

**RKLB is the page one story.** A +34% gap that closes pinned to the 52-week high is the textbook setup we treat as **non-mean-reverting** in Phobos — gap-and-go, not gap-and-fade. Volume confirms it (76M shares vs. its usual run rate). The $60.7B market cap is now the question — at this size RKLB is a top-10 US space-and-defense name on equity value, not a small-cap anymore.

---

## 3. Paired-ticker theses (the fork map)

### Fork A · Space-comm doublet · RKLB ↔ ASTS
Both ripped today. Same macro driver (orbital infrastructure spend), but the chart geometry forks:
- RKLB is **at the high** (0.13% to ceiling) — momentum trade, breakout extension
- ASTS is **42.2% below** its $129.89 high — recovery trade, base-rebuild

The pair creates a clean **relative-value structure**: long ASTS / short RKLB on a basis ratio, betting the gap closes. We don't love legging into either alone right now — RKLB is too extended, ASTS is too binary. The pair smooths both.

### Fork B · Bitcoin proxy fork · MSTR
- $187.59, +4.31% on session, but **59.0% below** its $457.22 high
- PE prints -5.07 (irrelevant — it's a balance-sheet vehicle, not an operating company)
- This is the cleanest delta-1-to-BTC name in the list. If we want crypto exposure with an equity wrapper plus a vol surface to sell against, MSTR is still the trade. **Iron condor candidate** — wide wings, sell premium against the realized vol, the strikes practically pick themselves around the current $187 print.

### Fork C · AI infra cluster · SMCI ↔ AMKR ↔ MTSI ↔ SITM ↔ FN
This is the densest cluster in the list. Four moved together (SMCI +5.21%, AMKR +6.01%, MTSI +4.47%, SITM +4.49%, SANM +4.75%). The fork inside the cluster is **valuation**:
- **Cheap end:** SMCI at PE 18.62 — the controversial name, but the multiple is the lowest in the cluster by 3x
- **Premium end:** SITM at PE -946.68 (loss-making, multiple meaningless), MTSI at PE 153.79

If you want long the AI substrate trade with a margin of safety, **SMCI is the only name in this cluster trading at a normal multiple**. The other four are paying for growth at the door.

### Fork D · The two infrastructure verticals
- **Construction services** (FIX, STRL, IESC, DY, APG) — slow, mechanical, all with PE in the 30-75 band, all behaving like compounders. **MLI at PE 18.46** is the value anomaly here.
- **Aerospace metallurgy** (ATI -2.63%, CRS -3.88%, FTAI) — rolled today. These are the cyclical end of the same defense-build trade RKLB is riding. Not coincidence: when capital rotates *into* the launch story, it rotates *out* of the metals story on the same day.

### Fork E · Biotech volatility (where iron condors actually pay)
MDGL -4.64% sitting between a $265 low and $615 high — that's a 132% high-low range over 12 months. INSM -3.48%, BBIO flat, RVMD flat, SMMT +5.42%. These are **catalyst names** with implied vol that funds wide condors. We don't like directional exposure here, but selling 30-delta strangles on MDGL specifically — given that range — is a structure worth modeling.

---

## 4. Risk flags

**Three valuation signals that need to be named:**
1. **BE PE -8,701** — printed loss is so close to zero it's making the multiple unreadable. The $261 print sits 87% above the $17.01 low. Whatever this stock is doing, it's not earnings-driven.
2. **SITM PE -946.68 at $833.08** — same disease, smaller magnitude. Market is paying $21B in cap for a name that's still net-loss.
3. **MSTR PE -5.07** — explainable (BTC mark-to-market accounting), but we need to remember this is a *leveraged* BTC bet, not a software company.

**One leadership-loss signal:**
- **CVNA -2.58%** at $77.94, $84.5B cap, PE 9.02 — the only sub-10 PE in the entire 38-name list. If this name keeps fading while the rest of the list goes up, that's a tell about where retail flow is rotating *from*.

---

## 5. Suggested structures (Phobos style — time decay edge first)

| Trade | Ticker(s) | Structure | Why |
|---|---|---|---|
| **A** | MSTR | 30-day iron condor, $160/$170/$210/$220 | High realized vol + clean BTC pegging; 59% drawdown gives mean-reversion symmetry to both wings |
| **B** | RKLB / ASTS | Pair: long ASTS Jul calls 80c / short RKLB Jul calls 110c | Fork-A relative value; RKLB is too extended for outright long, ASTS still has room |
| **C** | MDGL | 45-day strangle SELL, 30-delta both sides | Implied vol fat from the 132% 52w range; biotech catalysts already priced in |
| **D** | SMCI | Bull call butterfly $35/$45/$55 | Lowest PE in AI-infra cluster; defined-risk way to participate in the +5% move |
| **E** | MLI | Long stock, no options overlay | PE 18.46 in a list where the median is north of 50 — it's just cheap |

The thread across A–C: **we're getting paid to wait, not paid to direct**. That's the Phobos house style — when implied vol is rich and the chart is choppy, sell time and let the central limit theorem do the work.

---

## 6. The one-line takeaway

> Today the list said *space and AI substrate up, metals down, biotech sideways, MSTR alive again*. RKLB is the headline but ASTS is the better entry. Don't chase RKLB at the 52w high. Sell vol on MSTR and MDGL where the surface is paying you to.

---

> *Sealed by the Vaulted Delta studio — bmoreftw · Computer · Claude · Anya. The archive is patient. The fixed point is amber.*
