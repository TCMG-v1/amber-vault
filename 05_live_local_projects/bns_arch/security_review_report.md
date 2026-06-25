# Security Review Report
**Project:** /home/user/workspace/bns_arch/web  
**Date:** 2026-06-22  
**Files reviewed:** index.html, miner.js, checks.js (pure HTML/CSS/JS, no backend)

---

## Security Review Results

### BLOCK (must fix before publishing)
_None._

---

### WARN (inform user, let them decide)

- **Self-XSS via reflected network URL in innerHTML** — `checks.js:34,110` — `res.detail` for the `security_no_network` check includes `netLog.join(", ").slice(0,80)`, where `netLog` entries are built from intercepted fetch/XHR/WebSocket URLs (e.g. `"fetch:" + a[0]`). This value is injected via `innerHTML` at line 110. An attacker who can cause a network call with a crafted URL (e.g. via browser extension or injected third-party script) could theoretically inject HTML. **Actual risk is very low:** (a) the page itself makes zero network calls, (b) the site has no third-party scripts or external connectors, and (c) the netLog is populated only by code that runs inside the same page's JS context, meaning an attacker already has full JS execution. Suggested fix: replace the three `innerHTML =` assignments in `checks.js` (lines 98, 110) and the `hintTxt.innerHTML` in `miner.js` (line 110) with `textContent` for plain strings, or use `createElement`/`appendChild` for structured markup. This eliminates the pattern entirely.

- **No Content-Security-Policy header or meta tag** — `index.html` (no CSP present) — The page has no `<meta http-equiv="Content-Security-Policy">` tag. A CSP with `default-src 'self'` would enforce the zero-network-call guarantee at the browser level (complementing the JS instrumentation) and would block any injected scripts. Suggested fix: add `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'none';">` in `<head>`. (Note: the hosting platform may also be able to set this as an HTTP response header, which is stronger.)

---

### PASS

- **Check 1 — Dependency audit:** No `package.json` or `requirements.txt`. Zero third-party dependencies. No vulnerabilities possible.
- **Check 2 — Hardcoded secrets:** No API keys, tokens, private keys, passwords, or `.env` files found anywhere in the project.
- **Check 3 — Dangerous patterns (Python):** No Python files; not applicable.
- **Check 3 — eval / new Function / document.write:** None found in any JS file.
- **Check 4 — Open CORS / missing auth:** No server-side code, no CORS configuration, no API endpoints. Not applicable.
- **External scripts:** Both `<script>` tags in `index.html` load first-party files (`miner.js`, `checks.js`). No CDN, analytics, or third-party script sources.
- **Sensitive data handling:** No forms, no payment fields, no cookies, no localStorage/sessionStorage, no user accounts, no backend.
- **Secrets in HTML:** No inline credentials, tokens, or keys in `index.html`.
