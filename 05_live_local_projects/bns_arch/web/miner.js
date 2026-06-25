// bns-ai.ai · tap-miner — real SHA-256 in the browser via Web Crypto.
// Every tap on the page contributes entropy. Enough taps "seal" a small
// document. This is the storefront tap-to-hash loop, demonstrated live.

(() => {
  const enc = new TextEncoder();
  let taps = 0;
  let entropy = "";              // accumulates tap signatures
  let lastSeal = null;
  let sealedCount = 0;
  const TAPS_PER_SEAL = 12;      // taps needed to seal one small doc

  // a tiny "document" that gets sealed — grows with each seal
  const docLines = [
    "AGRIPPARIUM · PONTIFEX ARCHIVE · live tap-ledger",
    "—".repeat(28),
  ];

  // ---- tactile feedback: tiny Web Audio 'tick' (the serotonin pop) ----
  let actx = null;
  function tick(seal) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      const o = actx.createOscillator();
      const g = actx.createGain();
      // seal = warmer, higher chime; normal tap = soft click
      o.type = seal ? "triangle" : "sine";
      o.frequency.value = seal ? 880 : 440 + Math.random() * 60;
      g.gain.setValueAtTime(seal ? 0.09 : 0.045, actx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + (seal ? 0.18 : 0.07));
      o.connect(g).connect(actx.destination);
      o.start();
      o.stop(actx.currentTime + (seal ? 0.2 : 0.08));
    } catch (_) {}
  }

  async function sha256(str) {
    const buf = await crypto.subtle.digest("SHA-256", enc.encode(str));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }

  // UI refs (the dock)
  const dock = document.getElementById("miner-dock");
  const elTaps = document.getElementById("m-taps");
  const elProg = document.getElementById("m-progress-fill");
  const elProgTxt = document.getElementById("m-progress-txt");
  const elHash = document.getElementById("m-hash");
  const elSeals = document.getElementById("m-seals");
  const elStatus = document.getElementById("m-status");

  async function registerTap(x, y) {
    taps++;
    const sig = `${x},${y}@${performance.now().toFixed(2)}|${Math.random()}`;
    entropy += sig;

    // live rolling hash of all entropy so far — visible churn
    const rolling = await sha256(entropy);
    if (elHash) elHash.textContent = rolling.slice(0, 32) + "…";
    if (elTaps) elTaps.textContent = String(taps);

    const inCycle = taps % TAPS_PER_SEAL;
    const pct = Math.round((inCycle === 0 ? TAPS_PER_SEAL : inCycle) / TAPS_PER_SEAL * 100);
    if (elProg) elProg.style.width = pct + "%";
    if (elProgTxt) elProgTxt.textContent = `${inCycle === 0 ? TAPS_PER_SEAL : inCycle}/${TAPS_PER_SEAL} to seal`;

    // seal a line every TAPS_PER_SEAL taps
    if (taps % TAPS_PER_SEAL === 0) {
      sealedCount++;
      const line = `line ${sealedCount} · sealed at tap ${taps}`;
      docLines.push(line);
      lastSeal = await sha256(docLines.join("\n"));
      if (elSeals) elSeals.textContent = String(sealedCount);
      if (elStatus) {
        elStatus.textContent = `SEALED · ${lastSeal.slice(0, 12)}`;
        elStatus.classList.add("flash");
        setTimeout(() => elStatus.classList.remove("flash"), 600);
      }
      if (dock) {
        dock.classList.add("seal-pulse");
        setTimeout(() => dock.classList.remove("seal-pulse"), 700);
      }
    }
    // expose for exit message
    window.__bnsTaps = taps;
    window.__bnsSeals = sealedCount;

    // ---- guidance progression ----
    if (taps >= 1) markStep(1, "You're mining — watch the dock, the hash is churning.");
    if (taps >= 3) markStep(2, "See the cyan hash changing? That's real SHA-256. Keep going to seal a line.");
    if (sealedCount >= 1) markStep(3, "Sealed. That's a ledger line minted. Scroll to the bottom for the debrief.");

    // live-update debrief counters
    const dt = document.getElementById("d-taps");
    const ds = document.getElementById("d-seals");
    if (dt) dt.textContent = String(taps);
    if (ds) ds.textContent = String(sealedCount);
    const dl = document.getElementById("d-lede");
    if (dl && taps > 0) dl.textContent =
      `Everything you tapped on this page was feeding a real cryptographic seal. You made ${taps} tap${taps===1?"":"s"} and minted ${sealedCount} ledger line${sealedCount===1?"":"s"} — with actual SHA-256, the same primitive that would seal a real sale. Here's the receipt.`;
  }

  // ---- guidance hint + step rail ----
  let stepReached = 0;
  const hint = document.getElementById("hint");
  const hintTxt = document.getElementById("hint-txt");
  let hintTimer = null;
  function showHint(html, sticky) {
    if (!hint || !hintTxt) return;
    hintTxt.innerHTML = html;
    hint.classList.add("show");
    if (hintTimer) clearTimeout(hintTimer);
    if (!sticky) hintTimer = setTimeout(() => hint.classList.remove("show"), 4200);
  }
  function markStep(n, msg) {
    for (let k = 1; k <= n; k++) {
      const d = document.getElementById("sd-" + k);
      if (d) d.classList.add("done");
    }
    if (n > stepReached) {
      stepReached = n;
      if (msg) showHint(msg);
    }
  }

  // visual ripple + floating +1 pop on every tap, anywhere
  function ripple(x, y) {
    const r = document.createElement("span");
    r.className = "tap-ripple";
    r.style.left = x + "px"; r.style.top = y + "px";
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 600);

    const p = document.createElement("span");
    p.className = "tap-pop";
    p.textContent = "+1";
    p.style.left = x + "px"; p.style.top = y + "px";
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 720);
  }

  // radial spark burst when a line seals
  function sealBurst(x, y) {
    for (let i = 0; i < 10; i++) {
      const s = document.createElement("span");
      s.className = "seal-burst";
      const ang = (Math.PI * 2 * i) / 10;
      const dist = 26 + Math.random() * 22;
      s.style.left = x + "px"; s.style.top = y + "px";
      s.style.setProperty("--bx", Math.cos(ang) * dist + "px");
      s.style.setProperty("--by", Math.sin(ang) * dist + "px");
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 600);
    }
  }

  let dockOpened = false;
  document.addEventListener("pointerdown", (e) => {
    // first tap wakes the dock open so the resting state never covers content
    if (!dockOpened) {
      dockOpened = true;
      dock.classList.remove("min");
      const t = document.getElementById("m-toggle");
      if (t) t.textContent = "▼";
    }
    ripple(e.clientX, e.clientY);
    const willSeal = (taps + 1) % TAPS_PER_SEAL === 0;
    tick(willSeal);
    if (willSeal) sealBurst(e.clientX, e.clientY);
    document.body.classList.add("tapped");
    setTimeout(() => document.body.classList.remove("tapped"), 130);
    registerTap(e.clientX | 0, e.clientY | 0);
  }, { passive: true });

  // ---- everything clickable: section cards expand/collapse detail ----
  document.querySelectorAll("[data-expand]").forEach(card => {
    const detail = card.querySelector(".expand-body");
    if (!detail) return;
    card.addEventListener("click", (e) => {
      // don't toggle when clicking a tag chip link
      card.classList.toggle("open");
    });
  });

  // loop nodes: clicking advances a little "demo" highlight
  const nodes = [...document.querySelectorAll(".node")];
  nodes.forEach((n, i) => {
    n.addEventListener("click", () => {
      nodes.forEach(x => x.classList.remove("active"));
      for (let k = 0; k <= i; k++) nodes[k].classList.add("active");
    });
  });

  // dock minimize toggle
  const toggle = document.getElementById("m-toggle");
  if (toggle) toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    dock.classList.toggle("min");
    toggle.textContent = dock.classList.contains("min") ? "▲" : "▼";
  });

  // ---- exit intent + beforeunload message ----
  let exitShown = false;
  function showExit() {
    if (exitShown) return;
    exitShown = true;
    const t = window.__bnsTaps || 0;
    const s = window.__bnsSeals || 0;
    const banner = document.getElementById("exit-banner");
    const msg = document.getElementById("exit-msg");
    if (banner && msg) {
      msg.textContent = t > 0
        ? `Did you know? Your ${t} taps just hashed a small document into ${s} sealed line${s === 1 ? "" : "s"}. That's the whole idea — your touch wrote provenance.`
        : `Did you know your unique tapping could hash a small document? Every tap here was feeding a live SHA-256 seal. Try it next time.`;
      banner.classList.add("show");
      setTimeout(() => banner.classList.remove("show"), 6000);
    }
  }
  // desktop: mouse leaves toward the top (toward tabs/close)
  document.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget && e.clientY <= 0) showExit();
  });
  // any leave / tab-hide
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") showExit();
  });
  window.addEventListener("pagehide", showExit);

  // initial nudge: show the 'tap anywhere' hint shortly after load
  setTimeout(() => {
    if (stepReached === 0) showHint("Tap anywhere — you're mining a seal. <b>Try it.</b>", true);
  }, 1400);

  // step 4 lights when the debrief scrolls into view
  const debrief = document.getElementById("debrief");
  if (debrief && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) {
        const d = document.getElementById("sd-4");
        if (d) d.classList.add("done");
        io.disconnect();
      }});
    }, { threshold: 0.25 });
    io.observe(debrief);
  }
})();
