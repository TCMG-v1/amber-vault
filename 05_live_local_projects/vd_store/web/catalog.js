/* Vaulted Delta storefront catalog — data only.
 * Sourced from velmic merch bible + SPECIMINA VELMICA colorway matrix.
 * Glyph art is still gated on Architecture Manual Appendix B extraction;
 * placeholders below are rendered from the four primitive forms (F1-F4),
 * which the matrix marks as merch-viable line-art on their own. */

// ── primitive-form placeholder glyphs (clean line-art, die-cut friendly) ──
const GLYPHS = {
  F1: `<svg viewBox="0 0 100 100" stroke="currentColor" fill="none" stroke-width="5" stroke-linecap="round">
        <line x1="14" y1="50" x2="86" y2="50"/></svg>`, // Line
  F2: `<svg viewBox="0 0 100 100" stroke="currentColor" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="14" y1="50" x2="78" y2="50"/><polyline points="66,38 86,50 66,62"/></svg>`, // Ray
  F3: `<svg viewBox="0 0 100 100" stroke="currentColor" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="50" x2="78" y2="50"/><polyline points="34,38 14,50 34,62"/><polyline points="66,38 86,50 66,62"/></svg>`, // Bilateral
  F4: `<svg viewBox="0 0 100 100" stroke="currentColor" fill="none" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
        <polygon points="50,18 82,68 18,68"/><line x1="36" y1="68" x2="64" y2="68" stroke-width="3"/></svg>`, // closed/sealed form
  SET: `<svg viewBox="0 0 100 100" stroke="currentColor" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
        <line x1="14" y1="26" x2="60" y2="26"/><line x1="14" y1="50" x2="52" y2="50"/><polyline points="44,42 60,50 44,58"/><polygon points="40,72 56,86 24,86"/></svg>`,
  SHEET: `<svg viewBox="0 0 100 100" stroke="currentColor" fill="none" stroke-width="3">
        <rect x="16" y="14" width="68" height="72" rx="2"/>
        <g stroke-width="2.6">
        <line x1="26" y1="30" x2="40" y2="30"/><circle cx="58" cy="30" r="6"/><line x1="70" y1="26" x2="70" y2="34"/>
        <polyline points="26,48 38,48"/><polyline points="34,44 40,48 34,52"/><rect x="52" y="44" width="10" height="8"/><path d="M68 44 l8 8 M76 44 l-8 8"/>
        <line x1="26" y1="66" x2="40" y2="66"/><circle cx="58" cy="66" r="5"/><polygon points="70,62 76,72 64,72"/></g></svg>`,
  CARD: `<svg viewBox="0 0 100 100" stroke="currentColor" fill="none" stroke-width="4" stroke-linejoin="round">
        <rect x="26" y="16" width="48" height="68" rx="3"/><line x1="34" y1="50" x2="58" y2="50" stroke-linecap="round"/><polyline points="50,42 66,50 50,58" stroke-linecap="round"/></svg>`,
  PATCH: `<svg viewBox="0 0 100 100" stroke="currentColor" fill="none" stroke-width="4" stroke-linejoin="round">
        <circle cx="50" cy="50" r="34" stroke-dasharray="3 4"/><circle cx="50" cy="50" r="34"/><line x1="34" y1="50" x2="66" y2="50" stroke-linecap="round"/></svg>`,
  TEE: `<svg viewBox="0 0 100 100" stroke="currentColor" fill="none" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
        <path d="M34 26 l-16 10 l8 12 l8 -5 v34 h32 v-34 l8 5 l8 -12 l-16 -10 a12 12 0 0 1 -24 0 z"/>
        <line x1="44" y1="48" x2="56" y2="48"/></svg>`,
  CIPHER: `<svg viewBox="0 0 100 100" stroke="currentColor" fill="none" stroke-width="3.4" stroke-linejoin="round">
        <rect x="18" y="22" width="64" height="56" rx="2"/><line x1="50" y1="22" x2="50" y2="78"/>
        <line x1="26" y1="36" x2="42" y2="36" stroke-linecap="round"/><line x1="26" y1="48" x2="40" y2="48" stroke-linecap="round"/>
        <polyline points="60,42 72,42" stroke-linecap="round"/><polyline points="66,36 72,42 66,48" stroke-linecap="round"/></svg>`,
};

// ── colorway lines (sealed + guest) ──
const LINES = [
  { key:"NATIVE", name:"Native Velmic (0-2-1)", register:"active · technical · canonical",
    swatches:["#0044AA","#FFB300","#00E5FF"], role:"Primary line — carries the state logic. Blue holds. Amber interrupts. Cyan activates.", guest:false },
  { key:"HOWLBOX", name:"Howlbox", register:"vivid · loudest allowable",
    swatches:["#150A2E","#7C3AED","#A855F7","#4ADE80"], role:"Expressive / faction / apparel.", guest:false },
  { key:"STELLARIA", name:"Stellaria", register:"quiet · cosmic · precise",
    swatches:["#050810","#E8ECF1","#C77B45"], role:"Elevated collector — posters, foil, night-mode.", guest:false },
  { key:"NEUTRAL", name:"Neutral (Void/Umbra)", register:"minimal · canonical · artifact",
    swatches:["#F3EDE1","#0B0A09","#B8862F"], role:"Archival — seals, labels, zines, notebooks.", guest:false },
  { key:"VRM", name:"Vermilion", register:"neon · three-channel · gradient-body",
    swatches:["#22D3EE","#E5484D","#8B5CF6","#5DD55D","#FFE16B","#FF8C42"],
    role:"Guest capsule — three channels over a green→yellow→orange body gradient.",
    prov:"Render palette compiled 2026-06-22 in dialogue with Computer (Perplexity). Proposed; not yet sealed. Awaiting Operator seal.",
    guest:true },
];

// colorway swatch lookup for chips (primary swatch per line)
const LINE_SW = { NATIVE:"#0044AA", HOWLBOX:"#7C3AED", STELLARIA:"#C77B45", NEUTRAL:"#B8862F", VRM:"#E5484D" };

// state codes (Native only)
const STATES = [
  { code:"0", label:"0 · Hold", sw:"#0044AA" },
  { code:"2", label:"2 · Pause", sw:"#FFB300" },
  { code:"1", label:"1 · Return", sw:"#00E5FF" },
];

// ── collections + listings ──
const COLLECTIONS = [
  { id:"c1", code:"C1", name:"The 0-2-1 Register", lede:"The native register. Four base forms. Three states. One grammar.",
    items:[
      { sku:"VEL-PACK-F01F04-021", glyph:"SET", tag:"F01–F04", title:"Primitive Pack",
        desc:"Line, Ray, Bilateral, and the closing form — the base grammar in the 0-2-1 native register.",
        price:24, rail:"aws", railLabel:"AWS Sticker Store",
        variants:{ colorway:["NATIVE","HOWLBOX","STELLARIA","NEUTRAL","VRM"], finish:["CLEAR","SOLID","MIXED"] } },
    ]},
  { id:"c5", code:"C5", name:"Field Kit", lede:"Everything needed to begin marking state. A multi-rail flagship bundle.",
    items:[
      { sku:"VEL-KIT-FIELD", glyph:"SET", tag:"BUNDLE", title:"Field Kit Bundle",
        desc:"Primitive Pack + State Singles + Cipher Card + one patch + alphabet sheet. Order splits across all three rails; Manus reconciles.",
        price:72, rail:"shopify", railLabel:"Shopify · ops by Manus · multi-rail",
        variants:{ colorway:["NATIVE","HOWLBOX","STELLARIA","NEUTRAL"] } },
    ]},
  { id:"c2", code:"C2", name:"State Singles", lede:"Choose the function. Choose the state. Mark the object.",
    items:[
      { sku:"VEL-PRIM-F01", glyph:"F1", tag:"F01 · LINE", title:"State Single — Line",
        desc:"Unbounded extension. Pure carrier signal. Extend range, duration, or continuity.",
        price:4, rail:"aws", railLabel:"AWS Sticker Store",
        variants:{ state:["0","2","1"], finish:["CLEAR","SOLID"], colorway:["NATIVE","HOWLBOX","STELLARIA","NEUTRAL","VRM"] } },
      { sku:"VEL-PRIM-F02", glyph:"F2", tag:"F02 · RAY", title:"State Single — Ray",
        desc:"Directed extension from fixed origin. Commit direction, target, or path.",
        price:4, rail:"aws", railLabel:"AWS Sticker Store",
        variants:{ state:["0","2","1"], finish:["CLEAR","SOLID"], colorway:["NATIVE","HOWLBOX","STELLARIA","NEUTRAL","VRM"] } },
      { sku:"VEL-PRIM-F03", glyph:"F3", tag:"F03 · BILATERAL", title:"State Single — Bilateral",
        desc:"Bidirectional relation. Exchange state between two entities.",
        price:4, rail:"aws", railLabel:"AWS Sticker Store",
        variants:{ state:["0","2","1"], finish:["CLEAR","SOLID"], colorway:["NATIVE","HOWLBOX","STELLARIA","NEUTRAL","VRM"] } },
    ]},
  { id:"c3", code:"C3", name:"The Mnemosyne Sheet", lede:"Twenty-two operators arranged across the arc.",
    items:[
      { sku:"VEL-SHEET-G01G22", glyph:"SHEET", tag:"G01–G22", title:"Mnemosyne Alphabet Sheet",
        desc:"The 22-glyph alphabet in one reference object. Collector sheet, composition guide, physical interface. (Glyph art pending extraction.)",
        price:28, rail:"aws", railLabel:"AWS Sticker Store",
        variants:{ colorway:["NATIVE","HOWLBOX","STELLARIA","NEUTRAL","VRM"], finish:["SOLID","POSTER"] } },
    ]},
  { id:"c4", code:"C4", name:"Operator Cards & Patches", lede:"A deck of symbolic actions, and field markers for your kit.",
    items:[
      { sku:"VEL-CARD-G01G22", glyph:"CARD", tag:"DECK", title:"Operator Deck",
        desc:"One card per glyph — semantic function, game verb, state interaction, example. A deck of symbolic actions.",
        price:38, rail:"shopify", railLabel:"Shopify · ops by Manus",
        variants:{ colorway:["NATIVE","HOWLBOX","STELLARIA","NEUTRAL"] } },
      { sku:"VEL-PATCH-SET", glyph:"PATCH", tag:"PATCH", title:"Patch Set",
        desc:"Embroidered primitives plus high-frequency glyphs. Mark your field kit.",
        price:30, rail:"uman", railLabel:"Uman · embroidery",
        variants:{ colorway:["NATIVE","HOWLBOX","STELLARIA","NEUTRAL"] } },
      { sku:"VEL-TEE-021", glyph:"TEE", tag:"TEE · 0-2-1", title:"0-2-1 Register Tee",
        desc:"Three glyphs stacked — Blue, Amber, Cyan state labels. One large mark; metadata at the hem.",
        price:34, rail:"uman", railLabel:"Uman · print",
        variants:{ size:["S","M","L","XL","2XL"], colorway:["NATIVE","HOWLBOX","STELLARIA","NEUTRAL"] } },
      { sku:"VEL-CARD-CIPHER", glyph:"CIPHER", tag:"GRAMMAR KEY", title:"Cipher Card",
        desc:"The grammar key — the 0-2-1 system, primitives, game verbs, composition rules. Included with every order; sold standalone in Neutral.",
        price:6, rail:"aws", railLabel:"AWS Sticker Store",
        variants:{ colorway:["NEUTRAL"] } },
    ]},
];
