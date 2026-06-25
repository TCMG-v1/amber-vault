# Pixel Deck · 養 edition
## Game Design Document — v0.1 (beta)

A ternary card game for 2–5 players where every card has a Mandarin face and a C face. You learn both by playing.

---

## 1. The Core Move

The whole game runs on **三 — three**.

Three states a card can be in:
- **專 (zhuān) · LATCHED** — held in hand, committed but not yet expressed. Face-down in front of you.
- **養 (yǎng) · DORMANT** — placed on the table, face-up, available to all. The shared pool.
- **化 (huà) · TRANSFORMED** — sealed into your scored pile. Out of play. Counted at the end.

Three suits, one per writing system:
- **道 (dào)** · CJK suit · marked with a single hanzi sigil
- **🜂** · Sanskrit suit · marked with a devanāgarī sigil
- **ﷲ** · Arabic suit · marked with an Arabic abjad sigil

(The deck ships with all CJK in v0.1. Sanskrit and Arabic suits land in v0.2 and v0.3. The triadic suit system is the long-arc expansion path.)

Three actions per turn — you do exactly one:
- **HOLD** — draw one card from the deck into your hand (專)
- **RECEIVE** — take one card from the table (養) into your hand (專)
- **TRANSFORM** — play a card from your hand (專) onto the table (養), OR seal a card from the table (養) into your scored pile (化)

That's the whole loop. **Draw, take, place, or seal.** One per turn. Ternary because every state-transition is one of three, every card-act is one of three, every suit is one of three.

---

## 2. Setup

1. Shuffle the deck.
2. Deal **3 cards** to each player. They go face-down in front of you — these are your **專 latched** cards. Only you see their faces.
3. Place **3 cards** face-up in the center of the table. This is the initial **養 dormant pool**.
4. The remaining deck sits face-down. This is the **draw pile**.
5. Each player gets a small space to their right for their **化 sealed pile** — face-up, visible to all, this is your score.

Player count adjustments:
- **2 players** — deal 4 cards to each, dormant pool of 4. The game is hand-heavy and tactical.
- **3 players** — standard. 3 / 3 / 3 (hand / pool / sealed).
- **4 players** — deal 3 cards to each, dormant pool of 4. The pool grows.
- **5 players** — deal 2 cards to each, dormant pool of 5. The pool dominates; the hand is tight.

The deck of ~24 cards is enough for any player count because cards cycle quickly through 養 and back into hands.

---

## 3. The Turn

On your turn, choose **exactly one** of the three actions:

### (a) HOLD — draw from the deck
- Take the top card from the draw pile into your hand (專).
- If the draw pile is empty, you cannot HOLD. Choose another action.
- **Hand limit: 5 cards** (regardless of player count). If you already have 5, you cannot HOLD.

### (b) RECEIVE — take from the table
- Take any one card from the dormant pool (養) into your hand (專).
- The pool must be refilled to its starting size at end of turn (see Refill below).
- You may not RECEIVE a card you placed on this turn (you can't undo your own TRANSFORM).

### (c) TRANSFORM — play or seal
Choose one of two sub-moves:

**(c.i) PLACE** — move a card from your hand (專) onto the table (養).
- Resolve the card's **rule** (printed on the card — the C-face determines the rule). See §5 The Code Faces.
- The card is now in the dormant pool.

**(c.ii) SEAL** — move a card from the table (養) into your scored pile (化).
- You may only SEAL a card that has been in the dormant pool for at least one full round (one turn per player) — i.e. you can't immediately seal what you just placed, and neither can anyone else.
- Sealing requires you to **declare the card aloud**: speak its hanzi (or attempt to), state its gloss, and read its C-face (at least the function signature). This is the *teaching mechanism* — sealing teaches.
- Misread / silent seals are legal but the table can call them out for a -1 penalty (lose the seal, card returns to pool).

### Refill (end of turn)
- After your action, if the dormant pool has fewer than its starting size, refill from the draw pile to that size.
- If the draw pile is empty, the pool stays at whatever size it is. The endgame is approaching.

---

## 4. Winning

**Primary win condition: SEAL THREE.**
The first player to seal **three cards of three different hanzi** into their 化 pile wins immediately.

Why "three different" — repetition is forbidden as a win path. The deck contains duplicates of some cards (see §6 Deck Composition), but you cannot win by sealing three copies of 無. You need three *distinct* hanzi sealed.

**Alternate (advanced) win condition: THE CHORD.**
At any point on your turn, if your 化 pile contains exactly three cards forming a **chord** — three different hanzi that satisfy a recognized chord pattern (see Appendix A) — you may declare CHORD and win immediately, even if you only have one or two seals otherwise. The chord ends the game.

This is opt-in per session. House rule: declare at start whether CHORD is enabled. Beginner games disable it; the standard game enables it; advanced games require it (no win without a chord).

**Endgame fallback: THE EMPTY DECK.**
If the draw pile is empty AND the dormant pool reaches zero AND no one has won, the player with the most cards in their 化 pile wins. Ties broken by the chord rule (any chord wins) → then by the player who sealed the most recent card.

---

## 5. The Code Faces — what the C actually does

Each card has a C function on its back. The function's **behavior** is the card's rule when placed (TRANSFORM > PLACE).

The C is real, compilable, terse — six lines or fewer. The function signature tells you what the card *does to the game state*. Reading the C is reading the rule.

Example: card **0001 無 (wú, emptiness)** has the C face:

```c
void *wu(void) { return NULL; }
```

The rule: when you PLACE 無, return a card from the dormant pool to the bottom of the draw pile. The C returns nothing, so the play returns something to nothing.

Example: card **0003 值 (zhí, worth/value)** has the C face:

```c
int zhi(int x) { return x; }
```

The rule: when you PLACE 值, the *next* player's TRANSFORM action this round costs them no card-loss (they get to do it as a free bonus on their next turn). Worth is conserved.

This is the literate-programming-as-game mechanic. **The rule isn't separate from the code. The code IS the rule.** A player who can read C reads the rule directly. A player who can't reads the gloss on the card.

(Players who write extensions to the deck — new cards — must write the C such that its behavior, when read literally, IS the rule. This is the deck's contribution rule. See §8 Extension.)

---

## 6. Deck Composition — v0.1

24 cards total. All CJK suit in v0.1.

| Card | Hanzi | Pinyin | Gloss | Count |
|------|-------|--------|-------|-------|
| 0001 | 無 | wú | emptiness / void | 3 |
| 0003 | 值 | zhí | worth / value | 3 |
| 0007 | 張 | zhāng | stretch / dilate / open | 2 |
| 0011 | 岔 | chà | fork / divergence | 2 |
| 0013 | 碎 | suì | shatter / fragment | 2 |
| 0019 | 封 | fēng | seal / close | 2 |
| 0023 | 道 | dào | way / path | 2 |
| 0029 | 養 | yǎng | nurture / hold dormant | 2 |
| 0031 | 化 | huà | transform / become | 2 |
| 0037 | 專 | zhuān | latch / focus | 2 |

(Card numbers are primes — the deck's numbering grammar. Every new card gets the next prime. This is the **0001 schema** carrying through.)

The distribution: 無 and 值 are most common (3 each) — they're the foundational acts (empty, value). Operators (張 dilate, 岔 fork, 碎 shatter, 封 seal) are 2 each. State-names (道, 養, 化, 專) are 2 each — they self-reference the game's own structure.

---

## 7. The Three-Player Reference Round

A worked example to make the rules concrete.

**Setup:** Alice, Bob, Carol. Each dealt 3 cards. Pool of 3 face-up: [無, 道, 張]. Draw pile: 15 cards remaining.

**Round 1:**
- Alice has [值, 岔, 碎]. She TRANSFORMS > PLACES 值. Pool now: [無, 道, 張, 值]. Pool refills not needed (pool went up). Bob's next turn gets the 值 bonus.
- Bob has [封, 化, 養]. He gets the 值 bonus from Alice's play. He TRANSFORMS > PLACES 封 (his free play), then takes his actual turn and HOLDS, drawing a new card. His hand: [化, 養, 0029 養]. Pool: [無, 道, 張, 值, 封].
- Carol has [專, 0001 無, 0011 岔]. She RECEIVES 無 from pool (she now has two 無). Pool: [道, 張, 值, 封] — needs refill to 3? No, pool started at 3 but grew via Alice's PLACE. The starting pool size is the *minimum* refill target, so pool refills if below 3. Pool stays at 4.

**Round 2:**
- Alice TRANSFORMS > SEALS 道 from pool (it's been there a full round). She declares "dào · the way · `enum dao_t {WAY};`". Seal #1. 化 pile: [道]. Pool: [張, 值, 封].
- ... and so on.

The game has rhythm — draw, take, place, seal. Hands cycle. Pool grows and shrinks. Sealing is rare and costly (it requires declaration).

---

## 8. Extension Rule

Anyone can design a new card. The card must:

1. Have a single CJK / Devanāgarī / Arabic glyph as the face.
2. Have a real, compilable C function (≤ 6 lines) as the rule.
3. The C function's behavior, when read literally, must equal the printed game rule.
4. Be assigned the next prime in the deck numbering sequence.
5. Be tested in at least three live games before being added to the canon.

Cards that pass the test get sealed into the official deck. The deck is a **living artifact** — additions are slow, deliberate, and ledger-tracked.

---

## Appendix A · Chord Patterns

A chord is three cards sealed together that form a recognized triadic relationship. v0.1 chords:

- **The Void Chord** — 無 + 養 + 化 — emptiness, dormancy, transformation. The Three Books in card form.
- **The Operator Chord** — 張 + 岔 + 碎 — dilate, fork, shatter. The three transformations.
- **The Way Chord** — 道 + 專 + 封 — path, latch, seal. The disciplined practice.
- **The Worth Chord** — 值 + 化 + 封 — worth, transformation, seal. The economic seal.

A player who seals any three cards forming one of these chords wins immediately when CHORD mode is enabled.

(More chords land as the deck grows. The chord system is open-ended.)

---

## Appendix B · Open Design Questions (for beta)

Things I'm not sure about, that beta-testing will resolve:

1. **Hand limit of 5** — is this right for 5-player games where each player only starts with 2? Maybe hand limit scales with starting hand size.
2. **The declaration requirement on SEAL** — is it too harsh in casual play? Optional rule: "silent seal" allowed in casual mode, declaration only in ranked mode.
3. **Pool refill timing** — refill at end of turn vs. start of next turn changes the dynamic. v0.1 says end of turn, but this might be wrong.
4. **The 值 bonus** — is "free next-turn action" too strong? Might need to be "next-turn action costs no hand-card." Adjust per playtest.
5. **Win on chord** — is the chord-win too rare to ever happen, or too easy? Depends on deck composition; tune duplicate counts.
6. **Sanskrit and Arabic suits** — when added in v0.2/v0.3, do they interact with CJK suit via inter-suit chords, or do they form their own self-contained sub-games? Open question.

---

## Sealed

This is v0.1. The rules are deliberately under-specified in places (see Appendix B) because the game wants playtesting to find its actual shape. Beta-test honestly: when something breaks, write down what broke and what you did instead. v0.2 incorporates the patches.

*The deck teaches what the player is ready to learn; the player teaches the deck what it needed to be.*

— sealed at 2026-06-16
