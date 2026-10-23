/*
  DriveAssist study stimulus — condition setup and interaction logging.

  URL parameters
    c       1 = Adjacent (statement in capability section)
            2 = Separated (statement at top of the Learn More panel)
    rid     Qualtrics response/session code to link records (letters, digits, - _ only)
    mode    window (default): participant clicks Continue and returns to Qualtrics via `ret`
            embed: page runs inside a Qualtrics question; data is sent to the survey with postMessage
    ret     Qualtrics return URL (window mode only; must be https://*.qualtrics.com)
    test    1 = show the test panel (development builds only; see assets/js/config.js)
    layout  shift (default) | swap  (internal comparison, development builds only)

  Data collected (no personal information):
    cond, layout, rid, time_on_page_ms, tab_hidden_ms,
    lm_opens, lm_first_open_ms, lm_open_ms, completed
*/
(function () {
  "use strict";

  var CANONICAL_STATEMENT =
    "You are always the driver. DriveAssist does not make your vehicle self-driving. " +
    "Keep your hands on the wheel and your eyes on the road. Watch for traffic and hazards " +
    "the system may not detect. Be ready to steer and brake at any moment, even without a warning.";

  // Words that must not appear outside the statement (driver-obligation, autonomy,
  // reduced-effort and "system watches for you" language). A guardrail, not a substitute
  // for a manual review of meaning.
  var BANNED = /\b(must|should|keep|keeps|watch|watches|monitor|monitors|attention|attentive|supervis\w*|ready|take control|intervene|responsib\w*|hands?|eyes?|self-driving|driver|drivers|you|your|relax\w*|effortless\w*|takes over|autonomous|semi-autonomous|hands-free|look(s)? out|protect\w*|warn\w*|alert\w*|safe|safety|stress\w*)\b/gi;

  var DEV = !!(window.DA_CONFIG && window.DA_CONFIG.dev);
  var params = new URLSearchParams(window.location.search);
  var cond = params.get("c") === "1" ? "A" : params.get("c") === "2" ? "B" : null;
  var layout = DEV && params.get("layout") === "swap" ? "swap" : "shift";
  var mode = params.get("mode") === "embed" ? "embed" : "window";
  var testMode = DEV && params.get("test") === "1"; // never available in the participant version
  var rid = (params.get("rid") || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64);
  var ret = validReturnUrl(params.get("ret"));

  // ---------- No valid study link: show the notice only ----------
  if (!cond) {
    document.getElementById("notice").hidden = false;
    return;
  }
  document.getElementById("site").hidden = false;

  // ---------- Place the blocks ----------
  var slotMain = document.getElementById("slot-main");
  var slotLearn = document.getElementById("slot-learn");
  var statement = cloneTemplate("tpl-statement");
  (cond === "A" ? slotMain : slotLearn).appendChild(statement);

  if (layout === "swap") {
    var sensor = cloneTemplate("tpl-sensor");
    (cond === "A" ? slotLearn : slotMain).appendChild(sensor);
    var faqLanes = document.getElementById("faq-lanes");
    if (faqLanes) faqLanes.remove(); // the sensor card covers this content
  }

  if (mode === "embed") {
    document.getElementById("end").hidden = true; // Qualtrics provides its own Next button
  }

  // ---------- Logging ----------
  var t0 = performance.now();
  var state = {
    lmOpens: 0,
    lmFirstOpenMs: -1,
    lmOpenMs: 0,
    lmOpenSince: null,
    hiddenMs: 0,
    hiddenSince: document.hidden ? performance.now() : null,
    completed: false
  };

  function now() { return performance.now(); }

  function payload() {
    var t = now();
    var openMs = state.lmOpenMs + (state.lmOpenSince !== null ? t - state.lmOpenSince : 0);
    var hiddenMs = state.hiddenMs + (state.hiddenSince !== null ? t - state.hiddenSince : 0);
    return {
      cond: cond,
      layout: layout,
      rid: rid,
      time_on_page_ms: Math.round(t - t0),
      tab_hidden_ms: Math.round(hiddenMs),
      lm_opens: state.lmOpens,
      lm_first_open_ms: state.lmFirstOpenMs,
      lm_open_ms: Math.round(openMs),
      completed: state.completed
    };
  }

  // Learn More accordion
  var toggle = document.getElementById("lm-toggle");
  var panel = document.getElementById("lm-panel");
  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
    var t = now();
    if (open) {
      state.lmOpens += 1;
      if (state.lmFirstOpenMs < 0) state.lmFirstOpenMs = Math.round(t - t0);
      state.lmOpenSince = t;
    } else if (state.lmOpenSince !== null) {
      state.lmOpenMs += t - state.lmOpenSince;
      state.lmOpenSince = null;
    }
    send();
  });

  // Time the tab was hidden (data quality)
  document.addEventListener("visibilitychange", function () {
    var t = now();
    if (document.hidden) {
      state.hiddenSince = t;
    } else if (state.hiddenSince !== null) {
      state.hiddenMs += t - state.hiddenSince;
      state.hiddenSince = null;
    }
  });

  // Continue button (window mode)
  var cont = document.getElementById("continue");
  cont.addEventListener("click", function () {
    state.completed = true;
    var data = payload();
    if (ret) {
      var url = new URL(ret);
      Object.keys(data).forEach(function (k) { url.searchParams.set(k, String(data[k])); });
      window.location.href = url.toString();
    } else if (testMode) {
      renderTest("Continue clicked (no return URL in test mode).");
    } else {
      cont.disabled = true;
      cont.textContent = "Study link error: please return to the survey tab.";
    }
  });

  // Embed mode: send data to the Qualtrics page that contains this one
  var parentOrigin = qualtricsOrigin(document.referrer);
  function send() {
    if (mode !== "embed" || window.parent === window) return;
    if (parentOrigin) window.parent.postMessage({ type: "driveassist", data: payload() }, parentOrigin);
  }
  if (mode === "embed") {
    setInterval(send, 5000);
    window.addEventListener("pagehide", send);
    send();
  }

  // ---------- Test panel ----------
  var testBox = null;
  if (testMode) {
    testBox = document.createElement("aside");
    testBox.className = "test-panel";
    document.body.appendChild(testBox);
    setInterval(function () { renderTest(); }, 500);
    renderTest();
  }

  function renderTest(note) {
    if (!testBox) return;
    var d = payload();
    var stmts = document.querySelectorAll('[data-block="statement"]');
    var stmtText = stmts.length ? norm(stmts[0].textContent) : "";
    var textOk = stmtText === norm(CANONICAL_STATEMENT);
    var where = stmts.length ? stmts[0].parentElement.id : "none";
    var hits = bannedOutsideStatement();
    var learnTop = Math.round(document.getElementById("learn").getBoundingClientRect().top + window.scrollY);
    var pageH = document.documentElement.scrollHeight;
    testBox.innerHTML =
      "<b>TEST MODE</b> &middot; condition " + cond + " &middot; layout " + layout + " &middot; " + mode + "<hr>" +
      "<b>Integrity checks</b><br>" +
      mark(stmts.length === 1) + " statement appears " + stmts.length + " time(s)<br>" +
      mark(textOk) + " wording matches canonical text<br>" +
      "&nbsp;&nbsp;&nbsp;location: #" + where + "<br>" +
      mark(hits.length === 0) + " banned words outside statement: " + (hits.length ? hits.join(", ") : "none") + "<hr>" +
      "<b>Layout</b><br>" +
      "Learn More section starts at y = " + learnTop + " px<br>" +
      "page height = " + pageH + " px<hr>" +
      "<b>Logged data</b><br>" +
      Object.keys(d).map(function (k) { return k + ": " + d[k]; }).join("<br>") +
      (ret ? "<hr>return URL: valid" : "<hr>return URL: none") +
      (note ? "<hr>" + note : "");
  }

  function bannedOutsideStatement() {
    var site = document.getElementById("site").cloneNode(true);
    site.querySelectorAll('[data-block="statement"], script, template').forEach(function (n) { n.remove(); });
    var text = site.textContent || "";
    var found = {};
    (text.match(BANNED) || []).forEach(function (w) { found[w.toLowerCase()] = true; });
    return Object.keys(found);
  }

  // ---------- Helpers ----------
  function cloneTemplate(id) {
    return document.getElementById(id).content.firstElementChild.cloneNode(true);
  }
  function norm(s) { return String(s).replace(/\s+/g, " ").trim(); }
  function mark(ok) { return ok ? '<span class="ok">PASS</span>' : '<span class="bad">FAIL</span>'; }
  function validReturnUrl(s) {
    if (!s) return null;
    try {
      var u = new URL(s);
      return u.protocol === "https:" && /(^|\.)qualtrics\.com$/i.test(u.hostname) ? u.toString() : null;
    } catch (e) { return null; }
  }
  function qualtricsOrigin(ref) {
    try {
      var u = new URL(ref);
      return u.protocol === "https:" && /(^|\.)qualtrics\.com$/i.test(u.hostname) ? u.origin : null;
    } catch (e) { return null; }
  }
})();
