/* Vaulted Delta storefront — render + cart logic (vanilla, no deps). */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = (n) => "$" + n.toFixed(2);

const RAIL_LABEL = {
  aws: "AWS Sticker Store · vinyl & paper",
  uman: "Uman · print & embroidery",
  shopify: "Shopify · ops by Manus",
};
const STATE_BY_CODE = Object.fromEntries(STATES.map((s) => [s.code, s]));
const LINE_BY_KEY = Object.fromEntries(LINES.map((l) => [l.key, l]));

// ── render collections ──
function renderCollections() {
  const root = $("#collections");
  COLLECTIONS.forEach((col) => {
    const sec = document.createElement("section");
    sec.className = "collection";
    sec.id = col.id;
    sec.innerHTML = `
      <div class="wrap">
        <div class="col-head">
          <div>
            <div class="id">${col.code} · Collection</div>
            <h2>${col.name}</h2>
          </div>
          <div class="lede">${col.lede}</div>
        </div>
        <div class="grid"></div>
      </div>`;
    const grid = $(".grid", sec);
    col.items.forEach((item) => grid.appendChild(renderCard(item)));
    root.appendChild(sec);
  });
}

function renderCard(item) {
  const card = document.createElement("div");
  card.className = "card";
  const sel = {}; // current selection per variant axis

  const variantGroups = Object.entries(item.variants)
    .map(([axis, opts]) => {
      // default-select first option
      sel[axis] = opts[0];
      const chips = opts
        .map((opt) => chipFor(axis, opt))
        .join("");
      return `<div class="vgroup">
                <div class="vlabel">${axisLabel(axis)}</div>
                <div class="chips" data-axis="${axis}">${chips}</div>
              </div>`;
    })
    .join("");

  const guest = sel.colorway === "VRM";
  card.innerHTML = `
    <div class="frame" style="color:${LINE_SW[sel.colorway] || "#0B0A09"}">
      <span class="glyph-tag">${item.tag}</span>
      ${GLYPHS[item.glyph] || ""}
    </div>
    <div class="meta">
      <div class="title">${item.title}</div>
      <div class="sku">${item.sku}</div>
      <div class="desc">${item.desc}</div>
      <div class="variants">${variantGroups}</div>
      <div class="guest-note" style="display:${guest ? "block" : "none"}">Guest colorway · unsealed capsule</div>
      <div class="rail ${item.rail}"><span class="dot"></span>${RAIL_LABEL[item.rail]}</div>
      <div class="priceRow">
        <span class="price">${money(item.price)}</span>
        <button class="add">Add</button>
      </div>
    </div>`;

  // chip interactions
  $$(".chips", card).forEach((group) => {
    const axis = group.dataset.axis;
    group.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      sel[axis] = chip.dataset.val;
      $$(".chip", group).forEach((c) => c.setAttribute("aria-pressed", c === chip));
      // recolor glyph by colorway + guest note
      if (axis === "colorway") {
        $(".frame", card).style.color = LINE_SW[sel.colorway] || "#0B0A09";
        $(".guest-note", card).style.display = sel.colorway === "VRM" ? "block" : "none";
      }
    });
  });

  $(".add", card).addEventListener("click", () => addToCart(item, { ...sel }));
  return card;
}

function chipFor(axis, opt) {
  if (axis === "colorway") {
    const ln = LINE_BY_KEY[opt];
    const guest = ln?.guest ? " guest" : "";
    return `<button class="chip${guest}" data-val="${opt}" aria-pressed="${false}">
              <span class="cs" style="background:${LINE_SW[opt]}"></span>${ln ? ln.name.replace(/ \(.*\)/, "") : opt}
            </button>`;
  }
  if (axis === "state") {
    const s = STATE_BY_CODE[opt];
    return `<button class="chip" data-val="${opt}" aria-pressed="${false}">
              <span class="cs" style="background:${s.sw}"></span>${s.label}
            </button>`;
  }
  return `<button class="chip" data-val="${opt}" aria-pressed="${false}">${opt}</button>`;
}
function axisLabel(axis) {
  return { state: "State", finish: "Finish", colorway: "Colorway", size: "Size" }[axis] || axis;
}
// pre-press the first chip of every group after render
function pressDefaults() {
  $$(".chips").forEach((g) => {
    const first = $(".chip", g);
    if (first) first.setAttribute("aria-pressed", "true");
  });
}

// ── colorway legend ──
function renderLines() {
  const grid = $("#linesGrid");
  LINES.forEach((l) => {
    const c = document.createElement("div");
    c.className = "lcard" + (l.guest ? " guest" : "");
    c.innerHTML = `
      <div class="nm">${l.name}</div>
      <div class="rg">${l.register}</div>
      <div class="swatches">${l.swatches.map((s) => `<span style="background:${s}"></span>`).join("")}</div>
      <div class="role">${l.role}</div>
      ${l.prov ? `<div class="prov">${l.prov}</div>` : ""}`;
    grid.appendChild(c);
  });
}

// ── cart ──
let CART = [];
function variantString(sel) {
  const bits = [];
  if (sel.state) bits.push("state " + sel.state);
  if (sel.finish) bits.push(sel.finish);
  if (sel.size) bits.push("size " + sel.size);
  if (sel.colorway) bits.push((LINE_BY_KEY[sel.colorway]?.name || sel.colorway).replace(/ \(.*\)/, ""));
  return bits.join(" · ");
}
function skuFull(item, sel) {
  // VEL-[family]-[slot]-[state]-[finish]-[colorway]
  const parts = [item.sku];
  if (sel.state) parts.push(sel.state);
  if (sel.finish) parts.push(sel.finish);
  if (sel.size) parts.push(sel.size);
  if (sel.colorway) parts.push(sel.colorway);
  return parts.join("-");
}
function addToCart(item, sel) {
  const fullSku = skuFull(item, sel);
  const existing = CART.find((l) => l.fullSku === fullSku);
  if (existing) existing.qty += 1;
  else CART.push({ fullSku, title: item.title, price: item.price, rail: item.rail, variant: variantString(sel), qty: 1, guest: sel.colorway === "VRM" });
  renderCart();
  openCart();
}
function removeLine(fullSku) {
  CART = CART.filter((l) => l.fullSku !== fullSku);
  renderCart();
}
function renderCart() {
  const body = $("#cartBody");
  const count = CART.reduce((n, l) => n + l.qty, 0);
  $("#cartCount").textContent = count;
  if (!CART.length) {
    body.innerHTML = `<p class="empty">Cart is empty. Pick a glyph, a state, a colorway.</p>`;
    $("#cartTotal").textContent = money(0);
    return;
  }
  // group by rail
  const rails = ["aws", "uman", "shopify"];
  body.innerHTML = rails.map((r) => {
    const lines = CART.filter((l) => l.rail === r);
    if (!lines.length) return "";
    return `<div class="railgroup">
      <div class="rh"><span class="rail ${r}"><span class="dot"></span></span>${RAIL_LABEL[r]}</div>
      ${lines.map((l) => `
        <div class="litem">
          <div class="ln">${l.title}${l.guest ? ' <span style="color:var(--ochre-deep)">· guest</span>' : ""}
            <div class="lv">${l.variant} · ×${l.qty} <span class="rm" data-rm="${l.fullSku}">remove</span></div>
          </div>
          <div>${money(l.price * l.qty)}</div>
        </div>`).join("")}
    </div>`;
  }).join("");
  $$("[data-rm]", body).forEach((b) => b.addEventListener("click", () => removeLine(b.dataset.rm)));
  const total = CART.reduce((s, l) => s + l.price * l.qty, 0);
  $("#cartTotal").textContent = money(total);
}

// ── drawer open/close ──
function openCart() { $("#drawer").classList.add("open"); $("#drawerBack").classList.add("open"); }
function closeCart() { $("#drawer").classList.remove("open"); $("#drawerBack").classList.remove("open"); }

// ── checkout (stubbed; shows rail split) ──
function checkout() {
  if (!CART.length) return;
  const byRail = {};
  CART.forEach((l) => { (byRail[l.rail] ||= []).push(l); });
  const lines = Object.entries(byRail)
    .map(([r, ls]) => `  ${RAIL_LABEL[r]}: ${ls.reduce((n, l) => n + l.qty, 0)} item(s)`)
    .join("\n");
  alert(
    "Checkout (v0.1 — stubbed)\n\n" +
    "This order would split across rails:\n" + lines +
    "\n\nManus reconciles into one confirmation; per-line tracking by rail.\n" +
    "Live rail keys (AWS / Uman / Shopify) pending before real checkout."
  );
}

// ── init ──
renderCollections();
renderLines();
pressDefaults();
renderCart();
$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#drawerBack").addEventListener("click", closeCart);
$("#checkoutBtn").addEventListener("click", checkout);
