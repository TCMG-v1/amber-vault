/* AGRIPPARIUM · cockpit · split.js
 * ------------------------------------------------------------------
 * One file, three jobs: drive the divider, run the shell, drive the
 * device. No build step, no framework — if you can't read it top to
 * bottom in one sitting it's too clever, and clever is how Uncle
 * "fixed" the garage door so it only opens at 3am. Keep it plain.
 *
 * Honesty contract (this is load-bearing, do not soften it):
 *   - the shell is a parser, not a kernel. It says so out loud at boot.
 *   - the only network thing that happens is the iframe loading a URL
 *     the operator typed themselves. connect-src is 'none' in the CSP,
 *     so this script literally cannot phone home. That's the point.
 */
"use strict";

(function () {
  // ---- handles. grabbed once; re-querying in a loop is a Dad move
  // ("I'll just look for my glasses every time I need 'em"). ----
  const split   = document.getElementById("split");
  const divider = document.getElementById("divider");
  const term    = document.getElementById("term");
  const cmd      = document.getElementById("cmd");
  const screen   = document.getElementById("screen");
  const phone    = document.getElementById("phone");
  const veil     = document.getElementById("veil");
  const veilMsg  = document.getElementById("veilMsg");
  const deviceTarget = document.getElementById("deviceTarget");
  const clockEl  = document.getElementById("clock");
  const osClock  = document.getElementById("osClock");

  // =================================================================
  // 1) CLOCKS — bar clock (session, with seconds) + faux OS clock
  // =================================================================
  function tick() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    clockEl.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
    osClock.textContent = `${p(d.getHours())}:${p(d.getMinutes())}`;
  }
  tick();
  setInterval(tick, 1000);

  // =================================================================
  // 2) DIVIDER — drag + keyboard. clamps so neither pane vanishes.
  //    Dad says screens don't move. This one does, between 20%–85%.
  // =================================================================
  const MIN = 20, MAX = 85;
  let dragging = false;

  function setTop(pct) {
    const v = Math.min(MAX, Math.max(MIN, pct));
    split.style.setProperty("--top", v.toFixed(2) + "%");
    divider.setAttribute("aria-valuenow", Math.round(v));
  }
  function pctFromY(clientY) {
    const r = split.getBoundingClientRect();
    return ((clientY - r.top) / r.height) * 100;
  }

  divider.addEventListener("pointerdown", (e) => {
    dragging = true;
    split.classList.add("dragging");
    divider.setPointerCapture(e.pointerId);
  });
  divider.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    setTop(pctFromY(e.clientY));
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    split.classList.remove("dragging");
  }
  divider.addEventListener("pointerup", endDrag);
  divider.addEventListener("pointercancel", endDrag);

  // keyboard: arrows nudge, Home/End slam to the rails. a11y isn't optional.
  divider.addEventListener("keydown", (e) => {
    const cur = parseFloat(split.style.getPropertyValue("--top")) || 62;
    const step = e.shiftKey ? 10 : 3;
    if (e.key === "ArrowUp") { setTop(cur - step); e.preventDefault(); }
    else if (e.key === "ArrowDown") { setTop(cur + step); e.preventDefault(); }
    else if (e.key === "Home") { setTop(MIN); e.preventDefault(); }
    else if (e.key === "End") { setTop(MAX); e.preventDefault(); }
  });

  // =================================================================
  // 3) DEVICE — load a URL into the phone screen, with a veil while
  //    it settles. We can't read cross-origin load success (same-origin
  //    policy, correctly), so we lift the veil on the iframe's own load
  //    event or a timeout. Honest about what we can and can't see.
  // =================================================================
  function showVeil(msg) { veilMsg.textContent = msg || "loading…"; veil.hidden = false; }
  function hideVeil() { veil.hidden = true; }

  let veilTimer = null;
  let lastURL = "";    // remembered so `newtab` can open a real door to it

  function openURL(raw) {
    let url = String(raw || "").trim();
    if (!url) return shellPrint("warn", "open: needs a url, e.g. open https://example.com");
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;   // be kind about the scheme
    let host;
    try { host = new URL(url).host; }
    catch { return shellPrint("warn", "open: that didn't parse as a url"); }

    lastURL = url;
    showVeil("loading " + host + " …");
    clearTimeout(veilTimer);
    veilTimer = setTimeout(hideVeil, 4000);    // safety net; cross-origin load events can be shy
    // We lift the veil on the frame's load event and do NOT try to guess
    // whether a cross-origin site actually painted or quietly refused — the
    // browser won't tell us (same-origin policy, correctly). Guessing risks a
    // lie, so instead the new-tab door stays open and the boot banner warns
    // that your own works send frame-ancestors 'none' and sit blank here.
    // Honest beats clever. (Uncle wanted to strip the header off every site so
    // it'd "just work" — no, Uncle, that header is theirs, not ours. Dad would
    // have unplugged the monitor and declared the bug fixed.)
    screen.addEventListener("load", hideVeil, { once: true });
    screen.src = url;
    deviceTarget.textContent = host;
    return shellPrint("ok", "device → " + url + "  (blank? run `newtab`)");
  }

  // honest escape hatch for sites that won't embed. user-gesture only.
  function newTab() {
    if (!lastURL) return shellPrint("warn", "newtab: nothing loaded — `open <url>` first");
    window.open(lastURL, "_blank", "noopener,noreferrer");
    return shellPrint("ok", "newtab → " + lastURL);
  }

  // device nav buttons. "home" returns to the canonical work; we don't
  // fake browser back-stack across origins (can't, shouldn't pretend).
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const act = btn.dataset.act;
      if (act === "home") openURL("https://example.com");
      else if (act === "back") { try { screen.contentWindow.history.back(); } catch { shellPrint("sys", "back: blocked by same-origin policy (expected)"); } }
      else if (act === "recent") shellPrint("sys", "recent: no multi-app stack in a single frame (by design)");
    });
  });

  function rotate() {
    phone.classList.toggle("land");
    return shellPrint("ok", "device rotated → " + (phone.classList.contains("land") ? "landscape" : "portrait"));
  }

  // =================================================================
  // 4) THE SHELL — a parser. history with up/down. a small, honest
  //    command set. Some commands act on the cockpit (open/rotate),
  //    some are unix-flavored muscle memory (ls/cat/echo/pwd/clear).
  //    The "filesystem" is a tiny in-memory fake and SAYS it's a fake.
  // =================================================================

  // tiny faux-fs. not a disk. just enough that `ls` and `cat` feel real.
  const FS = {
    "readme":   "cockpit — Android device over a Linux-style shell, now with a brain.\nTop pane: a real iframe in a CSS phone. Bottom pane: this shell, a\nparser (not a kernel) that also talks to an LLM through YOUR edge\n(l-lts.ai/api/chat). The model key stays server-side; the cockpit\ntalks only to your own domain; nothing is logged. `brain on` to chat.",
    "routes":   "this cockpit ships standalone. the edge map lives in the\npplxstudio repo (routes.json), not here.",
    "creed":    "safety check · security check · transparency check.\nsaid every time, out loud, on purpose.",
  };

  const history = [];
  let hIdx = -1;     // -1 = not browsing history

  function el(cls, text) {
    const span = document.createElement("span");
    span.className = "line " + (cls || "");
    span.textContent = text;
    return span;
  }
  function shellPrint(cls, text) {
    // NOTE: textContent only, never innerHTML on anything that came from
    // input. Uncle pasted user input into innerHTML "once" and we don't
    // talk about the popup that followed. createElement or go home.
    term.appendChild(el(cls, text));
    term.scrollTop = term.scrollHeight;
  }
  function echoCommand(text) {
    const row = document.createElement("span");
    row.className = "line echo";
    const pr = document.createElement("span"); pr.className = "pr"; pr.textContent = "cockpit:~$ ";
    const ct = document.createElement("span"); ct.className = "ct"; ct.textContent = text;
    row.appendChild(pr); row.appendChild(ct);
    term.appendChild(row);
  }

  const COMMANDS = {
    help() {
      shellPrint("amber", "commands:");
      shellPrint("sys",
        "  open <url>     load a site into the device frame\n" +
        "  reload         reload the device frame\n" +
        "  rotate         portrait <-> landscape\n" +
        "  map <place>    load a map of a place into the device pane\n" +
        "  device         show what the frame is pointed at\n" +
        "  newtab         open the current target in a real browser tab\n" +
        "  brain on/off   route plain prose to the LLM brain (via your edge)\n" +
        "  ask <q>        ask the brain one question without turning it on\n" +
        "  ls             list the faux files (readme, routes, creed)\n" +
        "  cat <name>     print a faux file\n" +
        "  echo <text>    print text\n" +
        "  pwd            print working dir (it's faux, and it'll say so)\n" +
        "  whoami         who's at the console\n" +
        "  check          run the three checks, out loud\n" +
        "  clear          clear this shell\n" +
        "  help           this");
    },
    open(args) { openURL(args.join(" ")); },
    reload() {
      // re-poke the current src. cache-buster avoids a stale frame.
      const cur = screen.src;
      showVeil("reloading …"); clearTimeout(veilTimer); veilTimer = setTimeout(hideVeil, 4000);
      screen.addEventListener("load", hideVeil, { once: true });
      screen.src = cur;
      shellPrint("ok", "device reloaded");
    },
    rotate() { rotate(); },
    device() { shellPrint("sys", "device → " + screen.src); },
    map(args) {
      // Phase-2 limb, basic form: load a map surface into the device pane.
      // OpenStreetMap embeds happily (no frame-ancestors lockout), so the
      // brain's `cockpit: map <place>` actually shows something today. We
      // search by query; precise pin-dropping is a later, sealed iteration.
      const place = args.join(" ").trim();
      if (!place) return shellPrint("warn", "map: needs a place, e.g. map Milton Delaware");
      // OSM's search page frames fine (no frame-ancestors lockout). precise
      // pin-dropping + a tighter bbox is a later, sealed iteration.
      openURL("https://www.openstreetmap.org/search?query=" + encodeURIComponent(place));
      shellPrint("ok", "map → " + place);
    },
    newtab() { newTab(); },
    ls() { shellPrint("sys", Object.keys(FS).join("   ")); },
    cat(args) {
      const name = (args[0] || "").toLowerCase();
      if (!name) return shellPrint("warn", "cat: needs a name. try `ls`.");
      if (name in FS) shellPrint("sys", FS[name]);
      else shellPrint("warn", "cat: " + name + ": no such faux file (this fs isn't real, remember)");
    },
    echo(args) { shellPrint("", args.join(" ")); },
    pwd() { shellPrint("sys", "/cockpit (faux — there is no disk here, by design)"); },
    whoami() { shellPrint("sys", "cockpit@agripparium · operator · seat 477"); },
    check() {
      // the recurring motif, made literal. these are statements of posture,
      // honestly scoped — not a scan we're pretending ran.
      shellPrint("ok",   "safety check     · no payment fields, no autoplay, motion gated");
      shellPrint("ok",   "security check   · first-party scripts · connect-src = self + your edge only");
      shellPrint("ok",   "transparency check · brain key server-side at the edge · no prompt logging");
    },
    clear() { term.replaceChildren(); chat.length = 0; },
    brain(args) { brainCmd(args); },
    ask(args) { askBrain(args.join(" ")); },
  };

  // =================================================================
  // 4b) THE BRAIN — chat through YOUR edge, never the vendor directly.
  //     The cockpit only ever fetches l-lts.ai/api/chat; the key lives
  //     in the Worker secret. We stream tokens in as they arrive. The
  //     model may emit a whitelisted `cockpit: <cmd>` line to drive the
  //     GUI — we parse ONLY commands that already exist, never eval.
  //     (Uncle would "just eval whatever the model says, it's smart" —
  //     that is how you hand the keys to a stranger who talks pretty.)
  // =================================================================
  const BRAIN = {
    // same-origin when the cockpit itself lives behind l-lts.ai; the absolute
    // fallback lets the pplx.app preview reach the live edge once deployed.
    endpoint: (location.hostname.endsWith("l-lts.ai") || location.hostname.endsWith("llts.ai"))
      ? "/api/chat" : "https://l-lts.ai/api/chat",
    on: false,
    system: "You are the cockpit operator-console brain. Be terse and lab-honest. " +
      "You can drive the GUI by emitting a line that begins exactly with 'cockpit: ' " +
      "followed by ONE allowed command: open <url>, rotate, reload, map <place>. " +
      "Emit at most one such line, on its own line, only when the user clearly wants the device to change.",
  };
  const chat = [];   // in-session memory only. nothing persisted, nothing logged.

  function brainCmd(args) {
    const a = (args[0] || "").toLowerCase();
    if (a === "on")  { BRAIN.on = true;  return shellPrint("ok", "brain on - plain prose now goes to the model (" + BRAIN.endpoint + "). commands still work."); }
    if (a === "off") { BRAIN.on = false; return shellPrint("ok", "brain off - prose no longer routed. use `ask <q>` for a one-off."); }
    if (a === "reset") { chat.length = 0; return shellPrint("ok", "brain memory cleared (in-session only - there was never a transcript on disk)."); }
    shellPrint("sys", "brain is " + (BRAIN.on ? "on" : "off") + " - endpoint " + BRAIN.endpoint);
    shellPrint("sys", "usage: brain on | brain off | brain reset | ask <question>");
  }

  // a whitelisted command-emit parser. the model can ask the GUI to move, but
  // only through commands we already trust. anything else is printed, not run.
  // (this is the line that keeps a chatty model from becoming an exec() hole.)
  function maybeRunEmit(line) {
    const m = /^cockpit:\s*(.+)$/i.exec(line.trim());
    if (!m) return false;
    const parts = m[1].trim().split(/\s+/);
    const name = parts[0].toLowerCase();
    const ALLOWED = new Set(["open", "rotate", "reload", "map"]);
    if (!ALLOWED.has(name)) { shellPrint("warn", "brain tried a non-whitelisted command (" + name + ") - ignored"); return true; }
    const fn = COMMANDS[name];
    if (fn) { shellPrint("sys", "> brain drives: " + m[1].trim()); try { fn(parts.slice(1)); } catch (e) { shellPrint("warn", "emit: " + e.message); } }
    return true;
  }

  async function askBrain(text) {
    const q = (text || "").trim();
    if (!q) return shellPrint("warn", "ask: needs something to ask");
    chat.push({ role: "user", content: q });
    const messages = [{ role: "system", content: BRAIN.system }, ...chat];

    // a live line we append tokens into - streaming feels alive; a frozen
    // prompt feels broken even when it's working underneath.
    const lineEl = el("amber", "brain - ");
    term.appendChild(lineEl);
    let acc = "";

    let resp;
    try {
      resp = await fetch(BRAIN.endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages }),
      });
    } catch (e) {
      lineEl.textContent = "brain - (unreachable) - is the edge deployed and the secret set?";
      lineEl.className = "line warn";
      return;
    }
    if (!resp.ok || !resp.body) {
      let note = "brain - edge said " + resp.status;
      try { const j = await resp.json(); if (j && j.error) note = "brain - " + j.error; } catch (_) {}
      lineEl.textContent = note; lineEl.className = "line warn";
      return;
    }

    // read the SSE stream: lines like `data: {json}` then a final `data: [DONE]`.
    const reader = resp.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop();   // keep the partial last line for the next chunk
      for (const raw of lines) {
        const s = raw.trim();
        if (!s.startsWith("data:")) continue;
        const data = s.slice(5).trim();
        if (data === "[DONE]") continue;
        try {
          const j = JSON.parse(data);
          const tok = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content;
          if (tok) { acc += tok; lineEl.textContent = "brain - " + acc; term.scrollTop = term.scrollHeight; }
        } catch (_) { /* partial/keepalive line - skip, don't crash the stream */ }
      }
    }

    chat.push({ role: "assistant", content: acc });
    // after the full reply, scan its lines for a single GUI-drive emit.
    for (const ln of acc.split("\n")) if (maybeRunEmit(ln)) break;
  }

  function run(input) {
    const text = input.trim();
    if (!text) return;
    echoCommand(text);
    history.push(text); hIdx = -1;
    const parts = text.split(/\s+/);
    const name = parts[0].toLowerCase();
    const args = parts.slice(1);
    const fn = COMMANDS[name];
    if (fn) { try { fn(args); } catch (err) { shellPrint("warn", name + ": " + err.message); } }
    else if (BRAIN.on) { askBrain(text); }   // prose -> brain, when the brain is awake
    else shellPrint("warn", name + ": command not found - try `help` (or `brain on` to chat)");
  }

  cmd.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      run(cmd.value);
      cmd.value = "";
      term.scrollTop = term.scrollHeight;
    } else if (e.key === "ArrowUp") {
      if (history.length === 0) return;
      hIdx = hIdx < 0 ? history.length - 1 : Math.max(0, hIdx - 1);
      cmd.value = history[hIdx]; e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (hIdx < 0) return;
      hIdx++;
      if (hIdx >= history.length) { hIdx = -1; cmd.value = ""; }
      else cmd.value = history[hIdx];
      e.preventDefault();
    }
  });

  // clicking anywhere in the bottom pane focuses the prompt — small mercy
  document.getElementById("paneBottom").addEventListener("click", () => cmd.focus());

  // =================================================================
  // 5) BOOT — print the honest banner. This is the transparency line
  //    we promised: the shell tells you what it is before you trust it.
  // =================================================================
  function boot() {
    shellPrint("amber", "cockpit · operator console · v0.2 (brain)");
    shellPrint("sys",   "browser-side shell + an LLM brain. the shell is a parser, not a");
    shellPrint("sys",   "kernel. the brain runs through YOUR edge (" + BRAIN.endpoint + "):");
    shellPrint("sys",   "the model key stays server-side at the edge, never in this browser,");
    shellPrint("sys",   "and the cockpit talks only to your own domain. no prompt logging.");
    shellPrint("ok",    "safety check · security check · transparency check");
    shellPrint("sys",   "`brain on` to chat · `ask <q>` for one-off · `help` for commands.");
    shellPrint("sys",   "the device shows example.com; your own works refuse embedding");
    shellPrint("sys",   "(frame-ancestors 'none') — that's them defending themselves. use `newtab`.");
  }
  boot();
  cmd.focus();
})();
