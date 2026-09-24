/* Kerala Journey — a walk through Kerala's districts, one scene at a time. */
(() => {
  "use strict";

  const DISTRICTS = window.KERALA_DISTRICTS;
  const MAP = window.KERALA_MAP;
  const MEDIA = mergeMedia(window.KERALA_MEDIA || {}, window.KERALA_MEDIA_OVERRIDES || {});
  const HERO = ["alappuzha/houseboats", "idukki/munnar", "ernakulam/fort-kochi"];
  const app = document.getElementById("app");
  const STAMP_ICON =
    '<svg class="stamp-ic" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2.2 1.6"/><circle cx="10" cy="10" r="3.2" fill="currentColor"/></svg>';
  const canHover = () => matchMedia("(hover: hover)").matches;
  const CONFIG = window.KERALA_CONFIG || {};
  // Unverified food stops are visible only while developing locally, or with ?preview in the URL.
  const PREVIEW =
    /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || new URLSearchParams(location.search).has("preview");
  const isEat = (s) => s.type === "eat";
  const visibleStops = (s) => (s.stops || []).filter((x) => x.verified || PREVIEW);
  const FOOD = window.KERALA_FOOD || [];
  const TABLE = { moments: [], kitchens: [], sadya: [], ...window.KERALA_TABLE };
  const VISIT = window.KERALA_VISIT || {};
  const CLIMATES = window.KERALA_CLIMATES || { kinds: {} };
  const EXPERIENCES = window.KERALA_EXPERIENCES || {};
  const SOUNDS = window.KERALA_SOUNDS || {};
  const PANORAMAS = window.KERALA_PANORAMAS || {};
  const CULTURE = { kinds: {}, arts: [], festivals: [], timeline: [], phrases: [], ...window.KERALA_CULTURE };
  const ESSENTIALS = { sections: [], packing: { always: [], weather: {}, plans: {} }, ...window.KERALA_ESSENTIALS };
  const artById = (id) => CULTURE.arts.find((a) => a.id === id);
  const artImages = (a) => MEDIA[a.mediaKey || `culture/${a.id}`]?.images || [];
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  // Sounds come as MP3 (every browser), plus a smaller Ogg original where the browser can play it.
  const CAN_OGG = (() => {
    try {
      return !!document.createElement("audio").canPlayType('audio/ogg; codecs="vorbis"');
    } catch {
      return false;
    }
  })();

  // ---------- helpers ----------
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const byId = (id) => DISTRICTS.find((d) => d.id === id);
  const indexOf = (d) => DISTRICTS.indexOf(d);
  const imagesFor = (d, s) => MEDIA[`${d.id}/${s.id}`]?.images || [];
  const dishById = (id) => FOOD.find((f) => f.id === id);
  const dishImages = (f) => MEDIA[`${f.district}/${f.id}`]?.images || [];
  const kitchenOf = (f) => TABLE.kitchens.find((k) => k.id === f.kitchen);
  // "About 2 hours" → "about 2 hours", without touching names later in the sentence.
  const lcFirst = (s = "") => s.charAt(0).toLowerCase() + s.slice(1);
  const firstSentence = (s = "") => s.split(". ")[0].replace(/\.$/, "") + ".";
  // WebP copies exist on the deployed site (see scripts/build-pages.mjs); locally only the JPEGs do.
  // Use the 1280 px copy when the photo will be drawn no wider than that on this screen.
  const thumbOf = (im) => im.twebp || im.thumb;
  function srcFor(im, box) {
    if (!im.webp) return im.src;
    const vw = box?.clientWidth || innerWidth, vh = box?.clientHeight || innerHeight;
    const scale = Math.max(vw / (im.w || 16), vh / (im.h || 9)) * 1.12;
    const need = (im.w || 1920) * scale * Math.min(devicePixelRatio || 1, 2);
    return need <= 1400 ? im.mwebp : im.webp;
  }
  const coverOf = (d) => {
    for (const s of d.spots) {
      const im = imagesFor(d, s)[0];
      if (im) return im;
    }
    return null;
  };

  function mergeMedia(base, over) {
    const out = { ...base };
    for (const [k, v] of Object.entries(over)) {
      const b = out[k] || { images: [] };
      out[k] = { coords: v.coords || b.coords, images: v.replace ? v.images : [...(v.images || []), ...b.images] };
    }
    return out;
  }

  function project([lat, lon]) {
    const p = MAP.proj;
    return [p.pad + (lon - p.minX) * p.k * p.scale, p.pad + (p.maxY - lat) * p.scale];
  }

  function fmtDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  }

  // One food stop: name, what to order, price, veg, links out, verification status.
  function stopCard(x, d) {
    const q = encodeURIComponent(`${x.name}, ${x.area || d.name}, Kerala`);
    const report = CONFIG.reportUrl
      ? `${CONFIG.reportUrl}?title=${encodeURIComponent(`Food stop: ${x.name} (${d.name})`)}&body=${encodeURIComponent(
          "What needs fixing? (closed, moved, wrong details…)\n\n"
        )}`
      : "";
    const ig = x.instagram ? x.instagram.replace(/^@/, "") : "";
    return `
      <li class="stop${x.verified ? "" : " unverified"}">
        <div class="stop-head">
          <strong>${esc(x.name)}</strong>
          <span class="stop-meta">${esc(x.area || "")}${x.price ? ` · ${esc(x.price)}` : ""}${
      x.veg ? ` · <span class="veg" title="Pure vegetarian">Veg</span>` : ""
    }</span>
        </div>
        ${x.order ? `<p class="stop-order">Try: ${esc(x.order)}</p>` : ""}
        <p class="stop-links">
          <a href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">Map</a>
          ${ig ? `<a href="https://www.instagram.com/${encodeURIComponent(ig)}/" target="_blank" rel="noopener">Instagram</a>` : ""}
          ${x.website ? `<a href="${esc(x.website)}" target="_blank" rel="noopener">Website</a>` : ""}
          ${report ? `<a href="${esc(report)}" target="_blank" rel="noopener" class="report">Report a problem</a>` : ""}
        </p>
        <p class="stop-status">${
          x.verified
            ? `Last verified ${esc(fmtDate(x.lastChecked)) || "recently"}`
            : "Not yet verified · preview only, hidden on the public site"
        }</p>
      </li>`;
  }

  function stopsBlock(s, d) {
    const stops = visibleStops(s);
    if (!stops.length) return "";
    return `<div class="stops"><h2>Where to eat in ${esc(d.name)}</h2><ul>${stops.map((x) => stopCard(x, d)).join("")}</ul></div>`;
  }

  function suggestBlock(d) {
    if (!CONFIG.reportUrl) return "";
    const url = `${CONFIG.reportUrl}?title=${encodeURIComponent(`Food suggestion: ${d.name}`)}`;
    return `<div class="stops"><p class="suggest">Know a great place to eat in ${esc(d.name)}? <a href="${esc(
      url
    )}" target="_blank" rel="noopener">Suggest one</a></p></div>`;
  }

  // The header on every non-photo page: brand, the main sections, search, language and passport.
  const NAV = [
    ["map", "/map"],
    ["guide", "/guide"],
    ["food", "/eat"],
    ["culture", "/culture"],
    ["essentials", "/essentials"],
    ["trip", "/trip"],
  ];
  function siteHead(active) {
    return `<header class="site-head">
      <a class="brand" href="/">Kerala <span class="ml" lang="ml">കേരളം</span></a>
      <div class="head-tools">
        <button class="chip light icon" data-search aria-label="${t("search")}" title="${t("search")} (/)">${SEARCH_ICON}</button>
        <button class="chip light lang" data-lang aria-label="${t("langSwitch")}">${t("langShort")}</button>
        <button class="chip light" data-passport aria-label="${t("passport")}">${STAMP_ICON}<span class="lbl">${t("passport")} · </span><span data-count>${Passport.count()}</span>/14</button>
      </div>
      ${Lang.get() === "ml" ? `<p class="ml-note">${t("mlNote")}</p>` : ""}
      <nav class="head-nav" aria-label="${t("sections")}">
        ${NAV.map(
          ([key, href]) =>
            `<a href="${href}"${key === active ? ' aria-current="page"' : ""}>${t(key)}${key === "trip" ? ` <span class="nav-count" data-trip-count>${tripCount() || ""}</span>` : ""}</a>`
        ).join("")}
      </nav>
    </header>`;
  }

  function credit(im) {
    if (!im) return "";
    const lic = im.licenseUrl ? `<a href="${esc(im.licenseUrl)}" target="_blank" rel="noopener">${esc(im.license)}</a>` : esc(im.license);
    // Title + author + license + "resized" satisfies CC BY / BY-SA attribution (we scale and recompress).
    return `<a href="${esc(im.source)}" target="_blank" rel="noopener">“${esc(im.title)}”</a> by ${esc(im.author)} · ${lic} · resized`;
  }

  // ---------- passport (per-visitor, stored in this browser only) ----------
  const Passport = {
    key: "kerala-journey:stamps",
    get() {
      try {
        return JSON.parse(localStorage.getItem(this.key)) || {};
      } catch {
        return this._mem || {};
      }
    },
    stamp(id) {
      const all = this.get();
      if (all[id]) return false;
      all[id] = new Date().toISOString().slice(0, 10);
      this._mem = all;
      try {
        localStorage.setItem(this.key, JSON.stringify(all));
      } catch {}
      return true;
    },
    reset() {
      this._mem = {};
      try {
        localStorage.removeItem(this.key);
      } catch {}
    },
    count() {
      return Object.keys(this.get()).length;
    },
  };

  // ---------- food list: dishes the visitor wants to try (this browser only) ----------
  const Plate = {
    key: "kerala-journey:plate",
    get() {
      try {
        return JSON.parse(localStorage.getItem(this.key)) || this._mem || [];
      } catch {
        return this._mem || [];
      }
    },
    has(id) {
      return this.get().includes(id);
    },
    toggle(id) {
      const all = this.get().filter((x) => x !== id);
      const added = all.length === this.get().length;
      if (added) all.push(id);
      this._mem = all;
      try {
        localStorage.setItem(this.key, JSON.stringify(all));
      } catch {}
      return added;
    },
  };

  // ---------- language: interface text in English or Malayalam (js/i18n.js) ----------
  const I18N = window.KERALA_I18N || { en: {}, ml: {} };
  const Lang = {
    key: "kerala-journey:lang",
    get() {
      try {
        return localStorage.getItem(this.key) === "ml" ? "ml" : this._mem || "en";
      } catch {
        return this._mem || "en";
      }
    },
    set(v) {
      this._mem = v;
      try {
        localStorage.setItem(this.key, v);
      } catch {}
    },
  };
  function t(key, vars = {}) {
    const s = I18N[Lang.get()]?.[key] ?? I18N.en[key] ?? key;
    return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  }
  const SEARCH_ICON =
    '<svg class="stamp-ic" viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 13l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  // ---------- saved places and art forms for "My trip" (dishes live in Plate) ----------
  // Keys: "d/<district>/<spot>" or "culture/<art>".
  const Saved = {
    key: "kerala-journey:saved",
    get() {
      try {
        return JSON.parse(localStorage.getItem(this.key)) || this._mem || [];
      } catch {
        return this._mem || [];
      }
    },
    has(k) {
      return this.get().includes(k);
    },
    set(all) {
      this._mem = all;
      try {
        localStorage.setItem(this.key, JSON.stringify(all));
      } catch {}
    },
    toggle(k) {
      const all = this.get();
      const on = !all.includes(k);
      this.set(on ? [...all, k] : all.filter((x) => x !== k));
      return on;
    },
  };
  const tripCount = () => Saved.get().length + Plate.get().length;
  const saveBtn = (k, name, cls = "") => {
    const on = Saved.has(k);
    return `<button class="save-btn ${cls}" data-save="${esc(k)}" aria-pressed="${on}" aria-label="${esc(
      `${on ? "Remove" : "Save"} ${name} ${on ? "from" : "to"} my trip`
    )}"><span class="sv-ic" aria-hidden="true">${on ? "♥" : "♡"}</span><span class="sv-lbl">${on ? t("saved") : t("save")}</span></button>`;
  };

  // The month the visitor plans to travel in, remembered across districts. Defaults to this month.
  const TravelMonth = {
    key: "kerala-journey:month",
    get() {
      try {
        const v = localStorage.getItem(this.key);
        if (v !== null && !isNaN(+v)) return +v;
      } catch {}
      return this._mem ?? new Date().getMonth();
    },
    set(m) {
      this._mem = m;
      try {
        localStorage.setItem(this.key, String(m));
      } catch {}
    },
  };

  // Weather, "best time" and events for one district in one month.
  function monthInfo(d, m) {
    const v = VISIT[d.id];
    if (!v) return null;
    const kind = (CLIMATES[v.climate] || CLIMATES.coast || [])[m];
    const k = CLIMATES.kinds[kind] || { label: "", line: "" };
    return {
      kind,
      label: k.label,
      line: v.notes?.[kind] || k.line,
      best: (v.best || []).includes(m),
      // Rarer events first, so a short festival outranks something that happens all year.
      events: (v.events || []).filter((e) => e.months !== "moving" && e.months.includes(m)).sort((a, b) => a.months.length - b.months.length),
      moving: (v.events || []).filter((e) => e.months === "moving"),
    };
  }

  // [10, 11, 0, 1] → "November to February"; [2, 3, 9, 10] → "March to April, October to November".
  function fmtMonths(ms) {
    if (ms === "moving") return "Dates move each year";
    if (ms.length >= 12) return "All year";
    const set = new Set(ms);
    const runs = ms
      .filter((m) => !set.has((m + 11) % 12))
      .map((start) => {
        let end = start;
        while (set.has((end + 1) % 12)) end = (end + 1) % 12;
        return start === end ? MONTHS[start] : `${MONTHS[start]} to ${MONTHS[end]}`;
      });
    return runs.join(", ");
  }

  const plateBtn = (f) => {
    const on = Plate.has(f.id);
    return `<button class="plate-btn" data-plate="${esc(f.id)}" aria-pressed="${on}" aria-label="${esc(
      `${on ? "Remove" : "Add"} ${f.name} ${on ? "from" : "to"} my food list`
    )}"><span class="pl-ic" aria-hidden="true"></span><span class="pl-lbl">${on ? "On my list" : "Want to try"}</span></button>`;
  };

  // ---------- look-around viewer: drag to pan, scroll / double-click to zoom ----------
  function Viewer(el) {
    const st = { x: 0, y: 0, zoom: 1.12, drag: null };
    const MIN = 1.08, MAX = 2.4;
    const pointers = new Map(); // active pointers, for pinch-to-zoom
    let pinch = null, lastTap = 0, lastType = "mouse", tap = null;

    function layout(img) {
      const vw = el.clientWidth, vh = el.clientHeight;
      const nw = img.naturalWidth || 16, nh = img.naturalHeight || 9;
      const s = Math.max(vw / nw, vh / nh) * st.zoom;
      const w = nw * s, h = nh * s;
      const bx = (w - vw) / 2, by = (h - vh) / 2;
      st.x = Math.max(-bx, Math.min(bx, st.x));
      st.y = Math.max(-by, Math.min(by, st.y));
      img.style.width = w + "px";
      img.style.height = h + "px";
      img.style.transform = `translate(calc(-50% + ${st.x}px), calc(-50% + ${st.y}px))`;
    }
    const apply = () => el.querySelectorAll("img").forEach(layout);

    const dist = () => {
      const [a, b] = [...pointers.values()];
      return Math.hypot(a.x - b.x, a.y - b.y);
    };
    const toggleZoom = () => {
      st.zoom = st.zoom > 1.5 ? 1.12 : 1.9;
      apply();
    };
    el.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      lastType = e.pointerType;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      tap = pointers.size === 1 ? { x: e.clientX, y: e.clientY, t: Date.now() } : null;
      if (pointers.size === 2) pinch = { d: dist(), zoom: st.zoom };
      st.drag = { px: e.clientX, py: e.clientY };
      try {
        el.setPointerCapture(e.pointerId);
      } catch {}
      el.classList.add("grabbing");
    });
    el.addEventListener("pointermove", (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && pointers.size === 2) {
        st.zoom = Math.max(MIN, Math.min(MAX, (pinch.zoom * dist()) / pinch.d));
        apply();
        return;
      }
      if (!st.drag) return;
      st.x += e.clientX - st.drag.px;
      st.y += e.clientY - st.drag.py;
      st.drag = { px: e.clientX, py: e.clientY };
      apply();
    });
    const end = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (pointers.size) tap = null;
      if (pointers.size === 1) {
        const [p] = pointers.values();
        st.drag = { px: p.x, py: p.y };
        return;
      }
      st.drag = null;
      el.classList.remove("grabbing");
      // Double-tap to zoom on touch screens.
      const still = tap && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) < 10 && Date.now() - tap.t < 250;
      if (e.type === "pointerup" && e.pointerType === "touch" && still) {
        const now = Date.now();
        if (now - lastTap < 300) {
          toggleZoom();
          lastTap = 0;
        } else lastTap = now;
      }
      tap = null;
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        st.zoom = Math.max(MIN, Math.min(MAX, st.zoom * (1 - e.deltaY * 0.0012)));
        apply();
      },
      { passive: false }
    );
    el.addEventListener("dblclick", () => lastType !== "touch" && toggleZoom());
    const ro = new ResizeObserver(apply);
    ro.observe(el);

    return {
      show(im, alt) {
        el.classList.toggle("empty", !im);
        if (!im) {
          el.querySelectorAll("img").forEach((o) => o.remove());
          return;
        }
        const img = new Image();
        img.alt = alt || im.title;
        img.draggable = false;
        img.decoding = "async";
        img.onload = () => {
          st.x = 0;
          st.y = 0;
          st.zoom = 1.12;
          layout(img);
          const old = [...el.querySelectorAll("img")].filter((o) => o !== img);
          requestAnimationFrame(() => img.classList.add("in"));
          setTimeout(() => old.forEach((o) => o.remove()), 700);
        };
        img.src = srcFor(im, el);
        el.appendChild(img);
        // Not cached yet: show the small thumbnail, blurred, until the full photo arrives.
        if (!img.complete && im.thumb) {
          const ph = new Image();
          ph.alt = "";
          ph.className = "ph";
          ph.onload = () => {
            if (img.classList.contains("in")) return ph.remove();
            layout(ph);
            ph.classList.add("in");
          };
          ph.src = thumbOf(im);
          el.insertBefore(ph, img);
        }
      },
      destroy() {
        ro.disconnect();
      },
    };
  }

  const preload = (im) => {
    if (im) new Image().src = srcFor(im, app);
  };

  // ---------- routing ----------
  // Real paths, so every page can be shared and has its own title and preview (see scripts/build-pages.mjs).
  // /                  arrival
  // /map[/<district>]  map
  // /guide             must-visit places
  // /eat[/<section>[/<moment>]]   the Kerala table (food trail)
  // /eat/<dish>[/<n>]
  // /culture[/<section>]  /culture/<art>[/<n>]
  // /essentials[/<section>]
  // /trip              the visitor's saved trip (?s=… for a shared one)
  // /d/<district>[/<spot>[/<n>]]
  // Old #/ links are converted on arrival.
  function parse() {
    const p = decodeURIComponent(location.pathname).split("/").filter(Boolean);
    if (p[0] === "map") return { view: "map", focus: p[1] };
    if (p[0] === "culture") {
      const a = artById(p[1]);
      if (a) return { view: "art", a, n: Math.max(0, parseInt(p[2], 10) || 0) };
      return { view: "culture", section: p[1] };
    }
    if (p[0] === "essentials") return { view: "essentials", section: p[1] };
    if (p[0] === "trip") return { view: "trip" };
    if (p[0] === "guide" && p[1] === "food") return { view: "eat", section: "trail" };
    if (p[0] === "guide") return { view: "guide" };
    if (p[0] === "eat") {
      const f = dishById(p[1]);
      if (f) return { view: "dish", f, n: Math.max(0, parseInt(p[2], 10) || 0) };
      return { view: "eat", section: p[1], arg: p[2] };
    }
    if (p[0] === "d" && byId(p[1])) {
      const d = byId(p[1]);
      const si = Math.max(0, d.spots.findIndex((s) => s.id === p[2]));
      return { view: "district", d, si, n: Math.max(0, parseInt(p[3], 10) || 0), explicit: !!p[2] };
    }
    return { view: "home" };
  }
  // Keep ?preview (and a shared trip's ?s=) only where they mean something.
  const go = (path, { replace = false } = {}) => {
    const keep = new URLSearchParams(location.search);
    const qs = new URLSearchParams();
    if (keep.has("preview")) qs.set("preview", "");
    const url = path + (qs.toString() ? `?${qs.toString().replace(/=$/, "")}` : "");
    if (url === location.pathname + location.search) return render();
    history[replace ? "replaceState" : "pushState"](null, "", url);
    render();
  };
  function fromHash() {
    if (location.hash.startsWith("#/")) history.replaceState(null, "", location.hash.slice(1) + location.search);
  }

  // Same-site links navigate without a page load. Files (CREDITS.md, images) and new tabs are left alone.
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest("a[href]");
    if (!a || a.target || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || /\.[a-z0-9]+$/i.test(url.pathname)) return;
    e.preventDefault();
    if (url.search && url.pathname === "/trip") {
      history.pushState(null, "", url.pathname + url.search);
      return render();
    }
    go(url.pathname);
  });

  // Title and description for the current page (shared with the build script through js/meta.js).
  function setMeta() {
    const m = window.KERALA_META?.(location.pathname, window);
    if (!m) return;
    document.title = m.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", m.description);
  }

  let current = null; // { view, district, viewer, ... }

  function render() {
    setMeta();
    const r = parse();
    if (r.view === "district" && current?.view === "district" && current.d === r.d) {
      updateScene(r.si, r.n);
      return;
    }
    if (r.view === "dish" && current?.view === "dish" && current.f === r.f) {
      current.show(r.n);
      return;
    }
    // Long pages jump to a section instead of re-rendering (keeps the sadya leaf, dials and picks as they were).
    if (["eat", "culture", "essentials"].includes(r.view) && current?.view === r.view) {
      current.goTo(r.section, r.arg);
      return;
    }
    if (r.view === "art" && current?.view === "art" && current.a === r.a) {
      current.show(r.n);
      return;
    }
    current?.viewer?.destroy();
    current?.cleanup?.();
    const from = current;
    current = null;
    window.scrollTo(0, 0);
    if (r.view === "map") renderMap(r.focus);
    else if (r.view === "guide") renderGuide();
    else if (r.view === "eat") renderEat(r.section, r.arg);
    else if (r.view === "dish") renderDish(r.f, r.n);
    else if (r.view === "culture") renderCulture(r.section);
    else if (r.view === "art") renderArt(r.a, r.n);
    else if (r.view === "essentials") renderEssentials(r.section);
    else if (r.view === "trip") renderTrip();
    else if (r.view === "district") renderDistrict(r, from);
    else renderHome();
  }

  // ---------- arrival ----------
  function renderHome() {
    const heroKey = HERO.find((k) => MEDIA[k]?.images?.length);
    const im = heroKey ? MEDIA[heroKey].images[0] : DISTRICTS.map(coverOf).find(Boolean);
    const visited = Passport.count();
    app.innerHTML = `
      <section class="home">
        <div class="viewer" id="viewer" aria-hidden="true"></div>
        <div class="home-shade"></div>
        <div class="home-tools">
          <button class="chip" data-search aria-label="${t("search")}">${SEARCH_ICON}<span class="lbl"> ${t("search")}</span></button>
          <button class="chip lang" data-lang aria-label="${t("langSwitch")}">${t("langShort")}</button>
        </div>
        <div class="home-copy">
          <p class="eyebrow">${t("journeyThrough")}</p>
          <h1>Kerala <span class="ml" lang="ml">കേരളം</span></h1>
          <p class="lede">Fourteen districts between the Western Ghats and the Arabian Sea. Start at the forts in the far north and finish on the cliffs of the south, looking around at each stop.</p>
          <div class="actions">
            <a class="btn primary" href="/d/kasaragod">${visited ? t("continueJourney") : t("beginNorth")} <span aria-hidden="true">→</span></a>
            <a class="btn ghost" href="/map">${t("chooseMap")}</a>
          </div>
          <p class="home-links"><a href="/guide">Must-visit places</a> · <a href="/eat">The food trail</a> · <a href="/culture">${t("culture")}</a> · <a href="/essentials">${t("essentials")}</a> · <a href="/trip">${t("trip")}</a></p>
          <p class="hint"><span class="hint-icon" aria-hidden="true">✥</span> ${t("dragHint")}</p>
        </div>
        <p class="credit">${credit(im)}</p>
      </section>`;
    if (visited) {
      const next = DISTRICTS.find((d) => !Passport.get()[d.id]) || DISTRICTS[0];
      app.querySelector(".btn.primary").href = `/d/${next.id}`;
    }
    const viewer = Viewer(app.querySelector("#viewer"));
    viewer.show(im, "Kerala backwaters");
    current = { view: "home", viewer };
  }

  // ---------- map ----------
  function mapSvg({ focus, cls = "", pins = [], labels = true } = {}) {
    const stamps = Passport.get();
    const paths = DISTRICTS.map((d) => {
      const g = MAP.districts[d.id];
      return `<path d="${g.d}" data-id="${d.id}" class="district${stamps[d.id] ? " visited" : ""}${d.id === focus ? " focus" : ""}"
        tabindex="${labels ? 0 : -1}" role="${labels ? "link" : "presentation"}" aria-label="${esc(d.name)}"></path>`;
    }).join("");
    const text = labels
      ? DISTRICTS.map((d) => {
          const g = MAP.districts[d.id];
          const name = d.id === "thiruvananthapuram" ? "Thiruvanantha­puram" : d.name;
          return `<text x="${g.cx}" y="${g.cy}" class="label" data-for="${d.id}">${esc(name)}</text>`;
        }).join("")
      : "";
    return `<svg class="kmap ${cls}" viewBox="${MAP.viewBox}" xmlns="http://www.w3.org/2000/svg">${paths}${text}${pins.join("")}</svg>`;
  }

  function renderMap(focusId) {
    const stamps = Passport.get();
    const focus = byId(focusId) || DISTRICTS.find((d) => !stamps[d.id]) || DISTRICTS[0];
    app.innerHTML = `
      <section class="map-view">
        ${siteHead("map")}
        <div class="map-layout">
          <div class="map-wrap">
            ${mapSvg({ focus: focus.id })}
            <p class="compass" aria-hidden="true"><span>N</span>↑</p>
          </div>
          <div class="map-side">
            <p class="eyebrow">Choose your next stop</p>
            <h1 class="map-title">Fourteen districts,<br />north to south</h1>
            <p class="map-hint">${canHover() ? "Hover over a district to preview it, click to travel there." : "Tap a district to preview it, tap it again to travel there."}</p>
            <article class="preview" id="preview"></article>
            <ol class="route" aria-label="Districts from north to south">
              ${DISTRICTS.map(
                (d, i) => `<li><a href="/d/${d.id}" data-id="${d.id}" class="${stamps[d.id] ? "visited" : ""}">
                  <span class="num">${String(i + 1).padStart(2, "0")}</span>
                  <span class="nm">${esc(d.name)}</span>
                  <span class="ml" lang="ml">${esc(d.ml)}</span>
                  ${stamps[d.id] ? '<span class="tick" title="Visited">✓</span>' : ""}
                </a></li>`
              ).join("")}
            </ol>
            <p class="footnote">Photos from <a href="CREDITS.md">Wikimedia Commons contributors</a> under free licenses.</p>
          </div>
        </div>
      </section>`;

    const preview = app.querySelector("#preview");
    const setFocus = (d) => {
      app.querySelectorAll(".kmap .district, .kmap .label").forEach((p) =>
        p.classList.toggle("focus", (p.dataset.id || p.dataset.for) === d.id)
      );
      app.querySelectorAll(".route a").forEach((a) => a.classList.toggle("focus", a.dataset.id === d.id));
      const thumbs = d.spots
        .map((s) => [s, imagesFor(d, s)[0]])
        .filter(([, im]) => im)
        .slice(0, 4);
      preview.innerHTML = `
        <p class="pv-ml ml" lang="ml">${esc(d.ml)}</p>
        <h2>${esc(d.name)}</h2>
        <p class="pv-tag">${esc(d.tagline)}</p>
        <p class="pv-intro">${esc(d.intro)}</p>
        <div class="pv-thumbs">${thumbs
          .map(([s, im]) => `<a href="/d/${d.id}/${s.id}" title="${esc(s.name)}"><img src="${esc(thumbOf(im))}" alt="${esc(s.name)}" loading="lazy" /><span>${esc(s.name)}</span></a>`)
          .join("")}</div>
        <a class="btn primary" href="/d/${d.id}">Travel to ${esc(d.name)} <span aria-hidden="true">→</span></a>`;
    };
    setFocus(focus);

    app.querySelectorAll(".kmap .district").forEach((p) => {
      const d = byId(p.dataset.id);
      let wasFocused = false, touchy = false;
      p.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && setFocus(d));
      // Record state before the browser's own focus/hover events run for this tap.
      p.addEventListener("pointerdown", (e) => {
        touchy = e.pointerType !== "mouse" || !canHover();
        wasFocused = p.classList.contains("focus");
      });
      p.addEventListener("focus", () => setFocus(d));
      p.addEventListener("click", () => {
        if (touchy && !wasFocused) {
          setFocus(d);
          preview.scrollIntoView({ behavior: "smooth", block: "nearest" });
          return;
        }
        go(`/d/${d.id}`);
      });
      p.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go(`/d/${d.id}`);
        }
      });
    });
    app.querySelectorAll(".route a").forEach((a) => {
      a.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && setFocus(byId(a.dataset.id)));
      a.addEventListener("focus", () => setFocus(byId(a.dataset.id)));
    });
    current = { view: "map" };
  }

  // ---------- guide: must-visit places, by district ----------
  function renderGuide() {
    const card = (d, s) => {
      const im = imagesFor(d, s)[0];
      return `<a class="g-card" href="/d/${d.id}/${s.id}">
        ${im ? `<img src="${esc(thumbOf(im))}" alt="" loading="lazy" />` : '<span class="noimg"></span>'}
        <span class="g-name">${esc(s.name)}</span>
        <span class="g-blurb">${esc(firstSentence(s.blurb))}</span>
      </a>`;
    };
    const body = DISTRICTS.map((d) => {
      const items = d.spots.filter((s) => s.must);
      if (!items.length) return "";
      return `<section class="g-district">
        <header><span class="ml" lang="ml">${esc(d.ml)}</span><h2>${esc(d.name)}</h2><a href="/d/${d.id}">Visit →</a></header>
        <div class="g-grid">${items.map((s) => card(d, s)).join("")}</div>
      </section>`;
    }).join("");
    app.innerHTML = `
      <section class="guide-view">
        ${siteHead("guide")}
        <div class="guide-inner">
          <p class="eyebrow">The guide</p>
          <h1 class="map-title">Must-visit places</h1>
          <nav class="tabs" aria-label="Guide sections">
            <a href="/guide" aria-current="true">Must-visit places</a>
            <a href="/eat" aria-current="false">Food trail</a>
          </nav>
          <p class="map-hint">The places you shouldn't miss, from north to south. Tap one to step into it.</p>
          ${body}
        </div>
      </section>`;
    current = { view: "guide" };
  }

  // ---------- the Kerala table: a day of eating, the regional kitchens, a sadya, the trail ----------
  const dishCard = (f, cls = "") => {
    const im = dishImages(f)[0];
    return `<a class="dish-card ${cls}" href="/eat/${f.id}">
      ${im ? `<img src="${esc(thumbOf(im))}" alt="" loading="lazy" />` : '<span class="noimg"></span>'}
      <span class="dc-text">
        <span class="dc-ml ml" lang="ml">${esc(f.ml || "")}</span>
        <span class="dc-name">${esc(f.name)}</span>
        <span class="dc-where">${esc(byId(f.district)?.name || "")}</span>
      </span>
    </a>`;
  };

  const momentAt = (h) => TABLE.moments.find((m) => h >= m.from && h < m.to) || TABLE.moments[TABLE.moments.length - 1];
  const fmtHour = (h) => {
    const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, "0")} ${hh < 12 ? "am" : "pm"}`;
  };

  function renderEat(section, arg) {
    const { moments, kitchens, sadya } = TABLE;
    const kitchenOfDistrict = (id) => kitchens.find((k) => k.districts.includes(id));
    const dishOfDistrict = (id) => FOOD.find((f) => f.district === id);

    // The taste map: districts coloured by kitchen, labelled with their dish.
    const tasteMap = `<svg class="kmap tmap" viewBox="${MAP.viewBox}" xmlns="http://www.w3.org/2000/svg">
      ${DISTRICTS.map((d) => {
        const f = dishOfDistrict(d.id);
        return `<path d="${MAP.districts[d.id].d}" data-id="${d.id}" class="district k-${kitchenOfDistrict(d.id)?.id || "none"}"
          tabindex="0" role="button" aria-label="${esc(`${d.name}: ${f?.name || ""}`)}"></path>`;
      }).join("")}
      ${DISTRICTS.map((d) => {
        const g = MAP.districts[d.id], f = dishOfDistrict(d.id);
        return f ? `<text x="${g.cx}" y="${g.cy}" class="label" data-for="${d.id}">${esc(f.short || f.name)}</text>` : "";
      }).join("")}
    </svg>`;

    // The banana leaf. Tip to the left, as it's laid for a sadya.
    const veins = Array.from({ length: 24 }, (_, i) => `<line x1="${i * 27 - 40}" y1="290" x2="${i * 27 + 60}" y2="0" />`).join("");
    const rice = sadya.find((x) => x.shape === "rice");
    const leafItems = sadya
      .map((x, i) => {
        if (x.on) return "";
        let food;
        if (x.shape === "banana")
          food = `<path d="M${x.x - 30} ${x.y - 2} Q${x.x - 4} ${x.y + 22} ${x.x + 30} ${x.y - 10} Q${x.x + 2} ${x.y - 4} ${x.x - 30} ${x.y - 2}Z" fill="${x.color}" stroke="#8a6a1c" stroke-width="1.2"/>`;
        else if (x.shape === "rice")
          food = `<ellipse cx="${x.x}" cy="${x.y}" rx="${x.r * 1.7}" ry="${x.r * 0.8}" fill="${x.color}"/>
            <ellipse class="pour" cx="${x.x - 6}" cy="${x.y - 4}" rx="${x.r * 0.95}" ry="${x.r * 0.45}"/>`;
        else food = `<circle cx="${x.x}" cy="${x.y}" r="${x.r}" fill="${x.color}"/><circle cx="${x.x - x.r * 0.3}" cy="${x.y - x.r * 0.3}" r="${x.r * 0.35}" fill="#fff" opacity="0.18"/>`;
        const rs = x.shape === "rice" ? x.r * 1.7 : x.shape === "banana" ? 30 : x.r;
        return `<g class="item" data-i="${i}" role="button" tabindex="-1" aria-label="${esc(x.name)}">
          <circle class="slot" cx="${x.x}" cy="${x.y}" r="${Math.max(rs, 9) + 3}"/>
          <g class="food">${food}</g>
        </g>`;
      })
      .join("");
    const leafSvg = `<svg class="leaf" id="leaf" viewBox="0 0 600 290" role="group" aria-label="A banana leaf, laid for a sadya">
      <defs>
        <linearGradient id="leafg" x1="0" y1="0" x2="0.2" y2="1"><stop offset="0" stop-color="#5fa84a"/><stop offset="1" stop-color="#2d7434"/></linearGradient>
        <linearGradient id="leafb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc46e"/><stop offset="1" stop-color="#4f9244"/></linearGradient>
        <clipPath id="leafclip"><path d="M6 246 C 70 150, 210 52, 596 16 L 596 274 C 400 270, 150 264, 6 246 Z"/></clipPath>
        <clipPath id="foldclip"><path d="M6 246 C 90 214, 260 172, 596 150 L 596 274 C 400 270, 150 264, 6 246 Z"/></clipPath>
      </defs>
      <g class="leaf-body">
        <path d="M6 246 C 70 150, 210 52, 596 16 L 596 274 C 400 270, 150 264, 6 246 Z" fill="url(#leafg)"/>
        <g class="veins" clip-path="url(#leafclip)">${veins}</g>
        <path class="rib" d="M6 246 C 150 264, 400 270, 596 274"/>
      </g>
      <g class="leaf-folded" aria-hidden="true">
        <path d="M6 246 C 90 214, 260 172, 596 150 L 596 274 C 400 270, 150 264, 6 246 Z" fill="url(#leafb)"/>
        <g class="veins" clip-path="url(#foldclip)">${veins}</g>
        <path class="rib" d="M6 246 C 90 214, 260 172, 596 150"/>
      </g>
      <g class="items">${leafItems}</g>
      <text class="leaf-label" id="leaf-label" text-anchor="middle"></text>
    </svg>`;

    const plateSection = () => {
      const list = Plate.get().map(dishById).filter(Boolean);
      if (!list.length) return "";
      return `<section class="plate-list" aria-labelledby="plate-h">
        <p class="eyebrow">Your food list</p>
        <h2 id="plate-h">${list.length} ${list.length === 1 ? "dish" : "dishes"} to find in Kerala</h2>
        <ul>${list
          .map((f) => {
            const d = byId(f.district), stop = visibleStops(f)[0];
            return `<li><a href="/eat/${f.id}"><strong>${esc(f.name)}</strong><span>${esc(d.name)}${stop ? ` · try ${esc(stop.name)}` : ""}</span></a>${plateBtn(f)}</li>`;
          })
          .join("")}</ul>
        <p class="muted small">Saved in this browser. Tap a dish for where to find it.</p>
      </section>`;
    };

    app.innerHTML = `
      <section class="eat-view">
        ${siteHead("food")}
        <header class="eat-hero">
          <p class="eyebrow">The food trail</p>
          <h1 class="eat-title">Kerala, one plate <em>at a time</em> <span class="ml" lang="ml">രുചി</span></h1>
          <p class="eat-lede">Fourteen districts, fourteen dishes, and the everyday rhythm that ties them together. Walk through a day of eating, see why the food changes as you travel south, then sit down to a feast on a banana leaf.</p>
          <nav class="eat-jump" aria-label="On this page">
            <a href="/eat/day"><span>01</span>A day of eating</a>
            <a href="/eat/kitchens"><span>02</span>Five kitchens</a>
            <a href="/eat/leaf"><span>03</span>Serve a sadya</a>
            <a href="/eat/trail"><span>04</span>Fourteen dishes</a>
          </nav>
        </header>

        <div id="plate">${plateSection()}</div>

        <section class="eat-sec day" id="day">
          <div class="sec-head">
            <p class="eyebrow">01 · A day of eating</p>
            <h2 class="sec-title">Drag the sun across a Kerala day</h2>
          </div>
          <div class="day-dial">
            <svg class="sun-arc" viewBox="0 0 400 124" aria-hidden="true">
              <path class="arc" d="M20 112 Q200 -48 380 112" />
              <line class="horizon" x1="0" y1="112" x2="400" y2="112" />
              <g class="sun" id="sun"><circle r="13" class="sun-glow" /><circle r="8" class="sun-core" /></g>
            </svg>
            <p class="clock" id="clock" aria-hidden="true"></p>
            <input type="range" class="hour" id="hour" min="6" max="22.75" step="0.25" value="7.5" aria-label="Time of day" />
            <div class="moments" role="group" aria-label="Jump to a meal">
              ${moments.map((m) => `<button data-m="${m.id}" aria-pressed="false">${esc(m.name)}</button>`).join("")}
            </div>
          </div>
          <div class="day-body" id="day-body" aria-live="polite"></div>
        </section>

        <section class="eat-sec kitchens" id="kitchens">
          <div class="sec-head">
            <p class="eyebrow">02 · Five kitchens</p>
            <h2 class="sec-title">Why the food changes as you travel south</h2>
            <p class="sec-lede">Kerala is narrow, but its food shifts with every region: traders on the coast, plantations in the hills, Tamil Nadu through the mountain gap. Tap a region or a district.</p>
          </div>
          <div class="k-layout">
            <div class="k-map">${tasteMap}</div>
            <div class="k-side">
              <div class="k-tabs" role="tablist" aria-label="Regional kitchens">
                ${kitchens.map((k) => `<button role="tab" data-k="${k.id}" class="k-${k.id}" aria-selected="false"><i aria-hidden="true"></i>${esc(k.name)}</button>`).join("")}
              </div>
              <article class="k-panel" id="k-panel" role="tabpanel" aria-live="polite"></article>
            </div>
          </div>
        </section>

        <section class="eat-sec leaf-sec" id="leaf">
          <div class="sec-head">
            <p class="eyebrow">03 · Serve a sadya</p>
            <h2 class="sec-title">Sit down to a feast on a banana leaf</h2>
            <p class="sec-lede">A sadya comes in a set order, and every dish has its place on the leaf. Be the server: bring each one to the table.</p>
          </div>
          <div class="leaf-layout">
            <div class="leaf-stage">${leafSvg}</div>
            <div class="leaf-side">
              <p class="leaf-count" id="leaf-count"></p>
              <h3 id="leaf-name"></h3>
              <p class="leaf-ml ml" id="leaf-ml" lang="ml"></p>
              <p class="leaf-what" id="leaf-what"></p>
              <div class="leaf-actions">
                <button class="btn primary" id="serve"></button>
                <button class="link-btn" id="leaf-reset" hidden>Start again</button>
              </div>
              <p class="leaf-tip">Tap anything already on the leaf to see what it is.</p>
            </div>
          </div>
        </section>

        <section class="eat-sec trail" id="trail">
          <div class="sec-head">
            <p class="eyebrow">04 · Fourteen dishes</p>
            <h2 class="sec-title">The trail, north to south</h2>
            <p class="sec-lede">A signature dish from every district. Open one for its story, how it's made, how to eat it and where to try it.</p>
          </div>
          <ol class="trail-list">
            ${FOOD.map((f, i) => {
              const im = dishImages(f)[0];
              return `<li>
                <a class="trail-card" href="/eat/${f.id}">
                  <span class="tc-img">${im ? `<img src="${esc(thumbOf(im))}" alt="" loading="lazy" />` : ""}<span class="tc-num">${String(i + 1).padStart(2, "0")}</span></span>
                  <span class="tc-body">
                    <span class="dc-where">${esc(byId(f.district)?.name || "")}</span>
                    <span class="tc-ml ml" lang="ml">${esc(f.ml || "")}</span>
                    <span class="tc-name">${esc(f.name)}</span>
                    <span class="tc-line">${esc(firstSentence(f.blurb))}</span>
                  </span>
                </a>
                ${plateBtn(f)}
              </li>`;
            }).join("")}
          </ol>
          ${PREVIEW ? '<p class="footnote">Preview mode: unverified food stops are shown. They are hidden on the public site until marked verified in js/data/food.js.</p>' : ""}
        </section>
      </section>`;

    // --- a day of eating ---
    const dayEl = app.querySelector("#day");
    const hour = app.querySelector("#hour");
    const sun = app.querySelector("#sun");
    let shownMoment = null;
    const setHour = (h) => {
      const t = (h - 6) / (22.75 - 6);
      const x = (1 - t) ** 2 * 20 + 2 * (1 - t) * t * 200 + t * t * 380;
      const y = (1 - t) ** 2 * 112 + 2 * (1 - t) * t * -48 + t * t * 112;
      sun.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      const m = momentAt(h);
      app.querySelector("#clock").textContent = fmtHour(h);
      hour.setAttribute("aria-valuetext", `${fmtHour(h)}, ${m.meal}`);
      dayEl.dataset.moment = m.id;
      if (m === shownMoment) return;
      shownMoment = m;
      app.querySelectorAll(".moments button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.m === m.id)));
      app.querySelector("#day-body").innerHTML = `
        <div class="day-copy">
          <p class="day-ml ml" lang="ml">${esc(m.ml)}</p>
          <h3>${esc(m.meal)}</h3>
          <p>${esc(m.story)}</p>
          <p class="also-h">Also on the table</p>
          <ul class="also">${m.also.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
        </div>
        <div class="day-dishes">${FOOD.filter((f) => f.moments?.includes(m.id)).map((f) => dishCard(f)).join("")}</div>`;
    };
    hour.addEventListener("input", () => setHour(+hour.value));
    const jumpTo = (id) => {
      const m = moments.find((x) => x.id === id);
      if (!m) return;
      hour.value = m.id === "tea" ? 16 : m.from + 1.5;
      setHour(+hour.value);
    };
    app.querySelectorAll(".moments button").forEach((b) => b.addEventListener("click", () => jumpTo(b.dataset.m)));
    const now = new Date().getHours() + new Date().getMinutes() / 60;
    hour.value = now >= 6 && now < 22.75 ? now : 7.5;
    setHour(+hour.value);

    // --- five kitchens ---
    const kPanel = app.querySelector("#k-panel");
    const tmap = app.querySelector(".tmap");
    const selectKitchen = (k, focusDistrict) => {
      tmap.classList.add("picked");
      tmap.querySelectorAll(".district").forEach((p) => {
        p.classList.toggle("in", k.districts.includes(p.dataset.id));
        p.classList.toggle("focus", p.dataset.id === focusDistrict);
      });
      tmap.querySelectorAll(".label").forEach((t) => t.classList.toggle("in", k.districts.includes(t.dataset.for)));
      app.querySelectorAll(".k-tabs button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.k === k.id)));
      kPanel.className = `k-panel k-${k.id}`;
      kPanel.innerHTML = `
        <p class="k-line">${esc(k.line)}</p>
        <h3>${esc(k.name)}</h3>
        <p>${esc(k.story)}</p>
        <div class="k-dishes">${k.districts
          .map(dishOfDistrict)
          .filter(Boolean)
          .map((f) => dishCard(f, f.district === focusDistrict ? "hl" : ""))
          .join("")}</div>`;
    };
    app.querySelectorAll(".k-tabs button").forEach((b) =>
      b.addEventListener("click", () => selectKitchen(kitchens.find((k) => k.id === b.dataset.k)))
    );
    tmap.querySelectorAll(".district").forEach((p) => {
      const pick = () => {
        const k = kitchenOfDistrict(p.dataset.id);
        if (k) selectKitchen(k, p.dataset.id);
      };
      p.addEventListener("click", pick);
      p.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && pick());
      p.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const f = dishOfDistrict(p.dataset.id);
          if (f) go(`/eat/${f.id}`);
        }
      });
      p.addEventListener("focus", pick);
    });
    if (kitchens[0]) selectKitchen(kitchens[0]);

    // --- serve a sadya ---
    const leaf = app.querySelector("#leaf");
    const serveBtn = app.querySelector("#serve");
    const resetBtn = app.querySelector("#leaf-reset");
    const label = app.querySelector("#leaf-label");
    const pour = leaf.querySelector(".pour");
    let served = 0;
    const describe = (i) => {
      const x = sadya[i];
      app.querySelector("#leaf-count").textContent = `Course ${i + 1} of ${sadya.length}`;
      app.querySelector("#leaf-name").textContent = x.name;
      app.querySelector("#leaf-ml").textContent = x.ml;
      app.querySelector("#leaf-what").textContent = x.what;
      const at = x.on ? rice : x;
      const below = at.y > 200;
      label.textContent = x.name;
      label.setAttribute("x", Math.min(560, Math.max(50, at.x)));
      label.setAttribute("y", below ? at.y - (at.r || 10) - 12 : at.y + (at.r || 10) + 16);
      leaf.querySelectorAll(".item").forEach((g) => g.classList.toggle("sel", +g.dataset.i === (x.on ? sadya.indexOf(rice) : i)));
    };
    const leafState = () => {
      leaf.querySelectorAll(".item").forEach((g) => {
        const i = +g.dataset.i;
        g.classList.toggle("served", i < served);
        g.classList.toggle("next", i === served);
        g.setAttribute("tabindex", i < served || i === served ? "0" : "-1");
      });
      const lastPour = sadya.slice(0, served).filter((x) => x.on).pop();
      pour.style.fill = lastPour ? lastPour.color : "transparent";
      const done = served >= sadya.length;
      serveBtn.innerHTML = done
        ? leaf.classList.contains("folded") ? "Serve another" : "Fold the leaf"
        : served === 0 ? "Serve the first dish" : `Serve ${esc(sadya[served].name)} <span aria-hidden="true">→</span>`;
      resetBtn.hidden = served === 0;
    };
    const resetLeaf = () => {
      served = 0;
      leaf.classList.remove("folded");
      label.textContent = "";
      leaf.querySelectorAll(".item").forEach((g) => g.classList.remove("sel"));
      app.querySelector("#leaf-count").textContent = `${sadya.length} courses`;
      app.querySelector("#leaf-name").textContent = "An empty leaf";
      app.querySelector("#leaf-ml").textContent = "ഇല";
      app.querySelector("#leaf-what").textContent =
        "The leaf is laid with its tip to your left. Side dishes go along the top, rice in the middle, and everything arrives in order.";
      leafState();
    };
    const serve = () => {
      if (served < sadya.length) {
        served++;
        describe(served - 1);
      } else if (!leaf.classList.contains("folded")) {
        leaf.classList.add("folded");
        label.textContent = "";
        app.querySelector("#leaf-count").textContent = "The end of the meal";
        app.querySelector("#leaf-name").textContent = "Fold the leaf towards you";
        app.querySelector("#leaf-ml").textContent = "നന്ദി";
        app.querySelector("#leaf-what").textContent =
          "Folding the leaf towards yourself is how you tell the host it was a good meal. Now wash your hands: there's probably a second payasam coming.";
      } else return resetLeaf();
      leafState();
    };
    serveBtn.addEventListener("click", serve);
    resetBtn.addEventListener("click", resetLeaf);
    leaf.querySelectorAll(".item").forEach((g) => {
      const act = () => {
        const i = +g.dataset.i;
        if (i === served) serve();
        else if (i < served) {
          // The rice shows whichever course was poured on it last.
          const lastPour = sadya.slice(0, served).map((x, k) => [x, k]).filter(([x]) => x.on).pop();
          describe(sadya[i] === rice && lastPour ? lastPour[1] : i);
        }
      };
      g.addEventListener("click", act);
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          act();
        }
      });
    });
    resetLeaf();

    // --- the food list and in-page jumps ---
    const refreshPlate = () => (app.querySelector("#plate").innerHTML = plateSection());
    const goTo = (sec, a) => {
      if (sec === "day" && a) jumpTo(a);
      const el = sec && app.querySelector(`#${CSS.escape(sec)}`);
      if (el) el.scrollIntoView({ block: "start" });
      else window.scrollTo(0, 0);
    };
    current = { view: "eat", goTo, refreshPlate };
    if (section) requestAnimationFrame(() => goTo(section, arg));
  }

  // ---------- one dish: photos to look around, its story, how it's made, where to eat it ----------
  function renderDish(f, n) {
    const d = byId(f.district);
    const k = kitchenOf(f);
    const i = FOOD.indexOf(f);
    const prev = FOOD[i - 1], next = FOOD[i + 1];
    const imgs = dishImages(f);
    const moments = TABLE.moments.filter((m) => f.moments?.includes(m.id));
    const steps = f.steps || [];
    app.innerHTML = `
      <section class="dish-view">
        <div class="dish-photo">
          <div class="viewer" id="viewer"></div>
          <div class="dish-shade"></div>
          <a class="chip dish-back" href="/eat/trail"><span aria-hidden="true">←</span> Food trail</a>
          <div class="dish-dots dots" role="tablist" aria-label="Photos"></div>
          <p class="credit" id="credit"></p>
        </div>
        <article class="dish-panel">
          <p class="eyebrow">${String(i + 1).padStart(2, "0")} · ${esc(d.name)}${k ? ` · ${esc(k.name)}` : ""}</p>
          <p class="dish-ml ml" lang="ml">${esc(f.ml || "")}</p>
          <h1>${esc(f.name)}</h1>
          ${f.say ? `<p class="say">Say it <em>${esc(f.say)}</em></p>` : ""}
          <p class="dish-blurb">${esc(f.blurb)}</p>
          <div class="dish-actions">
            ${plateBtn(f)}
            <a class="btn outline" href="/d/${d.id}/${f.id}">See it on the journey <span aria-hidden="true">→</span></a>
          </div>
          ${f.ingredients ? `<ul class="ingredients" aria-label="What goes into it">${f.ingredients.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
          <dl class="dish-senses">
            <div><dt>Hear</dt><dd>${esc(f.senses.hear)}</dd></div>
            <div><dt>Taste</dt><dd>${esc(f.senses.taste)}</dd></div>
            <div><dt>Feel</dt><dd>${esc(f.senses.feel)}</dd></div>
          </dl>
          ${
            steps.length
              ? `<section class="dish-sec how">
            <h2>How it's made</h2>
            <div class="steps">
              <ol class="step-track">${steps.map((_, j) => `<li><button data-j="${j}" aria-label="Step ${j + 1}"></button></li>`).join("")}</ol>
              <p class="step-num" id="step-num"></p>
              <p class="step-text" id="step-text" aria-live="polite"></p>
              <div class="step-nav">
                <button class="round" data-dir="-1" aria-label="Previous step">‹</button>
                <button class="round" data-dir="1" aria-label="Next step">›</button>
              </div>
            </div>
            ${f.id === "sadya" || f.id === "valla-sadya" ? '<a class="text-link" href="/eat/leaf">Serve a sadya yourself →</a>' : ""}
          </section>`
              : ""
          }
          ${f.local ? `<section class="dish-sec local"><h2>Eat it like a local</h2><ul>${f.local.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>` : ""}
          ${
            moments.length
              ? `<section class="dish-sec when"><h2>When to eat it</h2><p>${moments
                  .map((m) => `<a class="moment-chip" href="/eat/day/${m.id}">${esc(m.meal)}</a>`)
                  .join("")}</p></section>`
              : ""
          }
          ${stopsBlock(f, d) || suggestBlock(d)}
          <nav class="dish-nav" aria-label="More dishes">
            ${prev ? `<a href="/eat/${prev.id}"><small>← Further north</small>${esc(prev.name)}</a>` : "<span></span>"}
            ${next ? `<a class="nx" href="/eat/${next.id}"><small>Continue south →</small>${esc(next.name)}</a>` : `<a class="nx" href="/eat/trail"><small>End of the trail</small>All dishes</a>`}
          </nav>
        </article>
      </section>`;

    const viewer = Viewer(app.querySelector("#viewer"));
    const dots = app.querySelector(".dish-dots");
    const show = (k2) => {
      k2 = imgs.length ? Math.min(k2, imgs.length - 1) : 0;
      current.n = k2;
      viewer.show(imgs[k2], `${f.name}, ${d.name}`);
      preload(imgs[k2 + 1]);
      app.querySelector("#credit").innerHTML = credit(imgs[k2]);
      dots.innerHTML =
        imgs.length > 1
          ? imgs.map((_, j) => `<button role="tab" aria-selected="${j === k2}" aria-label="Photo ${j + 1} of ${imgs.length}" data-n="${j}"></button>`).join("")
          : "";
    };
    dots.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-n]");
      if (b) go(`/eat/${f.id}/${b.dataset.n}`);
    });

    // How it's made: tap through the steps.
    let j = 0;
    const setStep = (to) => {
      j = Math.max(0, Math.min(steps.length - 1, to));
      app.querySelector("#step-num").textContent = `Step ${j + 1} of ${steps.length}`;
      app.querySelector("#step-text").textContent = steps[j];
      app.querySelectorAll(".step-track button").forEach((b) => {
        b.classList.toggle("done", +b.dataset.j <= j);
        b.setAttribute("aria-current", String(+b.dataset.j === j));
      });
      app.querySelector('.step-nav [data-dir="-1"]').disabled = j === 0;
      app.querySelector('.step-nav [data-dir="1"]').disabled = j === steps.length - 1;
    };
    if (steps.length) {
      app.querySelectorAll(".step-nav button").forEach((b) => b.addEventListener("click", () => setStep(j + +b.dataset.dir)));
      app.querySelectorAll(".step-track button").forEach((b) => b.addEventListener("click", () => setStep(+b.dataset.j)));
      setStep(0);
    }

    current = { view: "dish", f, viewer, n, show, count: imgs.length };
    show(n);
  }

  // A numbered in-page nav ("01 Art forms") shared by the long pages.
  const jumpNav = (base, items) =>
    `<nav class="eat-jump" aria-label="On this page">${items
      .map(([id, label], i) => `<a href="${base}/${id}"><span>${String(i + 1).padStart(2, "0")}</span>${esc(label)}</a>`)
      .join("")}</nav>`;
  const scrollToId = (id) => {
    const el = id && app.querySelector(`#${CSS.escape(id)}`);
    if (el) el.scrollIntoView({ block: "start" });
    else window.scrollTo(0, 0);
  };

  // ---------- culture: art forms, festival calendar, history, phrases ----------
  function renderCulture(section) {
    const kinds = CULTURE.kinds;
    const artCard = (a) => {
      const im = artImages(a)[0];
      return `<li data-kind="${a.kind}">
        <a class="trail-card" href="/culture/${a.id}">
          <span class="tc-img">${im ? `<img src="${esc(thumbOf(im))}" alt="" loading="lazy" />` : ""}</span>
          <span class="tc-body">
            <span class="dc-where">${esc(kinds[a.kind] || "")} · ${esc(byId(a.district)?.name || "")}</span>
            <span class="tc-ml ml" lang="ml">${esc(a.ml)}</span>
            <span class="tc-name">${esc(a.name)}</span>
            <span class="tc-line">${esc(a.blurb)}</span>
          </span>
        </a>
        ${saveBtn(`culture/${a.id}`, a.name, "dark")}
      </li>`;
    };
    // Every festival: statewide ones plus each district's from visit.js.
    const allEvents = [
      ...CULTURE.festivals.map((e) => ({ ...e, d: null })),
      ...DISTRICTS.flatMap((d) => (VISIT[d.id]?.events || []).map((e) => ({ ...e, d }))),
    ];
    const inMonth = (m) => allEvents.filter((e) => e.months !== "moving" && e.months.length < 12 && e.months.includes(m));
    const TL = CULTURE.timeline;

    app.innerHTML = `
      <section class="eat-view culture-view">
        ${siteHead("culture")}
        <header class="eat-hero">
          <p class="eyebrow">Culture</p>
          <h1 class="eat-title">Kerala, as it <em>lives and celebrates</em> <span class="ml" lang="ml">സംസ്കാരം</span></h1>
          <p class="eat-lede">Temple drums and church lamps, painted gods and snake boats. Meet the art forms, find out what's on when you travel, walk through two thousand years of history and learn a few words of Malayalam.</p>
          ${jumpNav("/culture", [["arts", "Art forms"], ["calendar", "Festival calendar"], ["history", "A long history"], ["phrases", "Say it in Malayalam"]])}
        </header>

        <section class="eat-sec" id="arts">
          <div class="sec-head">
            <p class="eyebrow">01 · Art forms</p>
            <h2 class="sec-title">Twelve ways Kerala performs, prays and plays</h2>
            <p class="sec-lede">Open one for its story, how to watch it and where to see it.</p>
          </div>
          <div class="k-tabs art-filter" role="group" aria-label="Filter art forms">
            <button data-kind="all" aria-pressed="true">All</button>
            ${Object.entries(kinds).map(([k, label]) => `<button data-kind="${k}" aria-pressed="false">${esc(label)}</button>`).join("")}
          </div>
          <ol class="trail-list art-list">${CULTURE.arts.map(artCard).join("")}</ol>
        </section>

        <section class="eat-sec" id="calendar">
          <div class="sec-head">
            <p class="eyebrow">02 · Festival calendar</p>
            <h2 class="sec-title">What's on, month by month</h2>
            <p class="sec-lede">Festivals follow the Malayalam, Hindu and Islamic calendars, so dates move from year to year. Always check before you book.</p>
          </div>
          <div class="cal-months" role="radiogroup" aria-label="Month">
            ${MONTHS.map((name, k) => {
              const n = inMonth(k).length;
              return `<button role="radio" data-m="${k}" aria-checked="false"><span>${name.slice(0, 3)}</span><small>${n || ""}</small></button>`;
            }).join("")}
          </div>
          <div class="cal-body" id="cal-body" aria-live="polite"></div>
        </section>

        <section class="eat-sec" id="history">
          <div class="sec-head">
            <p class="eyebrow">03 · A long history</p>
            <h2 class="sec-title">Two thousand years on the pepper coast</h2>
            <p class="sec-lede">Traders, faiths and kingdoms that shaped Kerala. Drag through time.</p>
          </div>
          <div class="tl">
            <input type="range" class="hour tl-range" id="tl-range" min="0" max="${TL.length - 1}" step="1" value="0" aria-label="Point in history" />
            <ol class="tl-ticks">${TL.map((e, i) => `<li><button data-i="${i}" aria-label="${esc(`${e.year}: ${e.title}`)}">${esc(e.year)}</button></li>`).join("")}</ol>
            <article class="tl-card" id="tl-card" aria-live="polite"></article>
          </div>
        </section>

        <section class="eat-sec" id="phrases">
          <div class="sec-head">
            <p class="eyebrow">04 · Say it in Malayalam</p>
            <h2 class="sec-title">A few words go a long way</h2>
            <p class="sec-lede">Tap a card to see what it means. Capitals show where the stress falls.</p>
          </div>
          <div class="phrase-tools"><button class="link-btn" id="phrase-all">Show all meanings</button></div>
          <ul class="phrases">${CULTURE.phrases
            .map(
              (p, i) => `<li><button class="phrase" data-i="${i}" aria-expanded="false">
                <span class="ph-ml ml" lang="ml">${esc(p.ml)}</span>
                <span class="ph-say">${esc(p.say)}</span>
                <span class="ph-en">${esc(p.en)}</span>
              </button></li>`
            )
            .join("")}</ul>
        </section>
      </section>`;

    // Filter the art forms.
    const filterBtns = app.querySelectorAll(".art-filter button");
    filterBtns.forEach((b) =>
      b.addEventListener("click", () => {
        filterBtns.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        app.querySelectorAll(".art-list > li").forEach((li) => (li.hidden = b.dataset.kind !== "all" && li.dataset.kind !== b.dataset.kind));
      })
    );

    // Festival calendar.
    const calBody = app.querySelector("#cal-body");
    const showMonth = (m) => {
      TravelMonth.set(m);
      app.querySelectorAll(".cal-months button").forEach((b) => b.setAttribute("aria-checked", String(+b.dataset.m === m)));
      const list = inMonth(m);
      const moving = allEvents.filter((e) => e.months === "moving");
      calBody.innerHTML = `
        <h3>${MONTHS[m]}</h3>
        ${
          list.length
            ? `<ul class="cal-list">${list
                .map(
                  (e) => `<li><span class="cal-where">${e.d ? `<a href="/d/${e.d.id}">${esc(e.d.name)}</a>` : "All of Kerala"}</span>
                    <strong>${esc(e.name)}</strong><span>${esc(e.what)}</span></li>`
                )
                .join("")}</ul>`
            : `<p class="muted">No big festivals this month: a quieter time to travel.</p>`
        }
        <h4>Dates that move every year</h4>
        <ul class="cal-list moving-list">${moving
          .map((e) => `<li><span class="cal-where">${e.d ? esc(e.d.name) : "All of Kerala"}</span><strong>${esc(e.name)}</strong><span>${esc(e.what)}</span></li>`)
          .join("")}</ul>`;
    };
    app.querySelectorAll(".cal-months button").forEach((b) => b.addEventListener("click", () => showMonth(+b.dataset.m)));
    showMonth(TravelMonth.get());

    // Timeline.
    const range = app.querySelector("#tl-range");
    const showYear = (i) => {
      const e = TL[i];
      range.value = i;
      range.setAttribute("aria-valuetext", `${e.year}: ${e.title}`);
      app.querySelectorAll(".tl-ticks button").forEach((b) => b.setAttribute("aria-current", String(+b.dataset.i === i)));
      app.querySelector("#tl-card").innerHTML = `
        <p class="tl-year">${esc(e.year)}</p>
        <h3>${esc(e.title)}</h3>
        <p>${esc(e.text)}</p>
        ${e.district ? `<a class="text-link" href="/d/${e.district}">Visit ${esc(byId(e.district).name)} →</a>` : ""}
        <div class="xp-nav">
          <button class="round" data-step="-1" aria-label="Earlier" ${i === 0 ? "disabled" : ""}>‹</button>
          <button class="round" data-step="1" aria-label="Later" ${i === TL.length - 1 ? "disabled" : ""}>›</button>
        </div>`;
      app.querySelectorAll("#tl-card [data-step]").forEach((b) => b.addEventListener("click", () => showYear(i + +b.dataset.step)));
    };
    range.addEventListener("input", () => showYear(+range.value));
    app.querySelectorAll(".tl-ticks button").forEach((b) => b.addEventListener("click", () => showYear(+b.dataset.i)));
    showYear(0);

    // Phrases: tap to reveal.
    app.querySelectorAll(".phrase").forEach((b) =>
      b.addEventListener("click", () => b.setAttribute("aria-expanded", String(b.getAttribute("aria-expanded") !== "true")))
    );
    app.querySelector("#phrase-all").addEventListener("click", (e) => {
      const show = e.currentTarget.textContent.startsWith("Show");
      app.querySelectorAll(".phrase").forEach((b) => b.setAttribute("aria-expanded", String(show)));
      e.currentTarget.textContent = show ? "Hide the meanings" : "Show all meanings";
    });

    current = { view: "culture", goTo: (sec) => scrollToId(sec) };
    if (section) requestAnimationFrame(() => scrollToId(section));
  }

  // ---------- one art form ----------
  function renderArt(a, n) {
    const d = byId(a.district);
    const i = CULTURE.arts.indexOf(a);
    const prev = CULTURE.arts[i - 1], next = CULTURE.arts[i + 1];
    const imgs = artImages(a);
    app.innerHTML = `
      <section class="dish-view">
        <div class="dish-photo">
          <div class="viewer" id="viewer"></div>
          <div class="dish-shade"></div>
          <a class="chip dish-back" href="/culture/arts"><span aria-hidden="true">←</span> ${t("culture")}</a>
          <div class="dish-dots dots" role="tablist" aria-label="Photos"></div>
          <p class="credit" id="credit"></p>
        </div>
        <article class="dish-panel">
          <p class="eyebrow">${esc(CULTURE.kinds[a.kind] || "")} · ${esc(d?.name || "")}</p>
          <p class="dish-ml ml" lang="ml">${esc(a.ml)}</p>
          <h1>${esc(a.name)}</h1>
          <p class="dish-blurb">${esc(a.blurb)}</p>
          <div class="dish-actions">
            ${saveBtn(`culture/${a.id}`, a.name)}
            ${d ? `<a class="btn outline" href="/d/${d.id}">Travel to ${esc(d.name)} <span aria-hidden="true">→</span></a>` : ""}
          </div>
          <section class="dish-sec story">${a.story.map((p) => `<p>${esc(p)}</p>`).join("")}</section>
          ${a.watch?.length ? `<section class="dish-sec local"><h2>How to watch</h2><ul>${a.watch.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>` : ""}
          <section class="dish-sec"><h2>When and where</h2><p>${esc(a.when)}</p></section>
          <nav class="dish-nav" aria-label="More art forms">
            ${prev ? `<a href="/culture/${prev.id}"><small>← Previous</small>${esc(prev.name)}</a>` : "<span></span>"}
            ${next ? `<a class="nx" href="/culture/${next.id}"><small>Next →</small>${esc(next.name)}</a>` : `<a class="nx" href="/culture/arts"><small>All art forms</small>${t("culture")}</a>`}
          </nav>
        </article>
      </section>`;
    const viewer = Viewer(app.querySelector("#viewer"));
    const dots = app.querySelector(".dish-dots");
    const show = (k) => {
      k = imgs.length ? Math.min(k, imgs.length - 1) : 0;
      current.n = k;
      viewer.show(imgs[k], a.name);
      preload(imgs[k + 1]);
      app.querySelector("#credit").innerHTML = credit(imgs[k]);
      dots.innerHTML =
        imgs.length > 1
          ? imgs.map((_, j) => `<button role="tab" aria-selected="${j === k}" aria-label="Photo ${j + 1} of ${imgs.length}" data-n="${j}"></button>`).join("")
          : "";
    };
    dots.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-n]");
      if (b) go(`/culture/${a.id}/${b.dataset.n}`);
    });
    current = { view: "art", a, viewer, n, show, count: imgs.length };
    show(n);
  }

  // ---------- essentials: practical travel info and a packing list ----------
  const Packing = {
    key: "kerala-journey:packing",
    get() {
      try {
        return { plans: [], done: [], ...JSON.parse(localStorage.getItem(this.key)) };
      } catch {
        return this._mem || { plans: [], done: [] };
      }
    },
    set(v) {
      this._mem = v;
      try {
        localStorage.setItem(this.key, JSON.stringify(v));
      } catch {}
    },
  };
  function renderEssentials(section) {
    const P = ESSENTIALS.packing;
    app.innerHTML = `
      <section class="eat-view essentials-view">
        ${siteHead("essentials")}
        <header class="eat-hero">
          <p class="eyebrow">Travel essentials</p>
          <h1 class="eat-title">Before you go, <em>and while you're there</em> <span class="ml" lang="ml">അറിയേണ്ടവ</span></h1>
          <p class="eat-lede">The practical side of a Kerala trip: getting around, money, phones, customs, staying safe, the monsoon and Ayurveda. Plus a packing list made for your month and your plans.</p>
        </header>

        <section class="eat-sec packing" id="packing">
          <div class="sec-head">
            <p class="eyebrow">Your packing list</p>
            <h2 class="sec-title">What to bring</h2>
            <p class="sec-lede">Pick your month and what you're planning. Tick things off as you pack; the list is saved in this browser.</p>
          </div>
          <div class="pack-layout">
            <div class="pack-form">
              <label class="pack-label" for="pack-month">Travelling in</label>
              <select id="pack-month">${MONTHS.map((m, k) => `<option value="${k}">${m}</option>`).join("")}</select>
              <p class="pack-label">Planning</p>
              <div class="pack-plans">${Object.entries(P.plans)
                .map(([id, p]) => `<label class="pack-plan"><input type="checkbox" value="${id}" /> <span>${esc(p.label)}</span></label>`)
                .join("")}</div>
            </div>
            <div class="pack-list" id="pack-list" aria-live="polite"></div>
          </div>
        </section>

        <section class="eat-sec" id="guide">
          <div class="sec-head"><p class="eyebrow">Good to know</p><h2 class="sec-title">The practical guide</h2></div>
          <nav class="k-tabs ess-nav" aria-label="Topics">${ESSENTIALS.sections.map((s) => `<a class="chip light" href="/essentials/${s.id}">${esc(s.title)}</a>`).join("")}</nav>
          <div class="ess-list">
            ${ESSENTIALS.sections
              .map(
                (s) => `<details class="ess" id="${s.id}"${section === s.id ? " open" : ""}>
                  <summary><h3>${esc(s.title)}</h3></summary>
                  <dl>${s.items.map((it) => `<div><dt>${esc(it.h)}</dt><dd>${esc(it.p)}</dd></div>`).join("")}</dl>
                </details>`
              )
              .join("")}
          </div>
          <p class="footnote">Rules, apps and prices change. Check anything important before you rely on it.</p>
        </section>
      </section>`;

    // Packing list: always + this month's weather (coast and, if going to the hills, the hills) + the plans ticked.
    const monthSel = app.querySelector("#pack-month");
    const state = Packing.get();
    monthSel.value = TravelMonth.get();
    app.querySelectorAll(".pack-plan input").forEach((c) => (c.checked = state.plans.includes(c.value)));
    const listEl = app.querySelector("#pack-list");
    const renderList = () => {
      const s = Packing.get();
      const m = +monthSel.value;
      const kinds = new Set([CLIMATES.coast?.[m]]);
      if (s.plans.includes("hills") || s.plans.includes("treks")) kinds.add(CLIMATES.hills?.[m]);
      const groups = [
        ["Every trip", P.always],
        ...[...kinds].filter(Boolean).map((k) => [`For ${CLIMATES.kinds[k]?.label.toLowerCase()} weather`, P.weather[k] || []]),
        ...s.plans.filter((id) => P.plans[id]).map((id) => [P.plans[id].label, P.plans[id].items]),
      ];
      const seen = new Set();
      let total = 0, done = 0;
      listEl.innerHTML = groups
        .map(([title, items]) => {
          const fresh = items.filter((x) => !seen.has(x) && seen.add(x));
          if (!fresh.length) return "";
          return `<h4>${esc(title)}</h4><ul>${fresh
            .map((x) => {
              total++;
              const on = s.done.includes(x);
              if (on) done++;
              return `<li><label><input type="checkbox" data-item="${esc(x)}"${on ? " checked" : ""} /> <span>${esc(x)}</span></label></li>`;
            })
            .join("")}</ul>`;
        })
        .join("");
      listEl.insertAdjacentHTML("afterbegin", `<p class="pack-count">${done} of ${total} packed</p>`);
      listEl.querySelectorAll("[data-item]").forEach((c) =>
        c.addEventListener("change", () => {
          const st = Packing.get();
          st.done = c.checked ? [...new Set([...st.done, c.dataset.item])] : st.done.filter((x) => x !== c.dataset.item);
          Packing.set(st);
          renderList();
        })
      );
    };
    monthSel.addEventListener("change", () => {
      TravelMonth.set(+monthSel.value);
      renderList();
    });
    app.querySelectorAll(".pack-plan input").forEach((c) =>
      c.addEventListener("change", () => {
        const st = Packing.get();
        st.plans = c.checked ? [...new Set([...st.plans, c.value])] : st.plans.filter((x) => x !== c.value);
        Packing.set(st);
        renderList();
      })
    );
    renderList();

    const goTo = (sec) => {
      const el = sec && app.querySelector(`details#${CSS.escape(sec)}`);
      if (el) el.open = true;
      scrollToId(sec);
    };
    current = { view: "essentials", goTo };
    if (section) requestAnimationFrame(() => goTo(section));
  }

  // ---------- my trip: saved places, dishes and art forms, by district ----------
  const encodeTrip = () =>
    [...Saved.get().map((k) => k.replace(/^d\//, "d:").replace(/^culture\//, "c:")), ...Plate.get().map((id) => `f:${id}`)].join(",");
  function decodeTrip(s) {
    const out = { saved: [], dishes: [] };
    for (const part of (s || "").split(",")) {
      const [type, rest] = [part.slice(0, 1), part.slice(2)];
      if (type === "d" && /^[\w-]+\/[\w-]+$/.test(rest)) out.saved.push(`d/${rest}`);
      else if (type === "c" && artById(rest)) out.saved.push(`culture/${rest}`);
      else if (type === "f" && dishById(rest)) out.dishes.push(rest);
    }
    return out;
  }
  function renderTrip() {
    const shared = new URLSearchParams(location.search).get("s");
    const src = shared ? decodeTrip(shared) : { saved: Saved.get(), dishes: Plate.get() };
    const m = TravelMonth.get();
    const byDistrict = DISTRICTS.map((d) => {
      const places = src.saved
        .filter((k) => k.startsWith(`d/${d.id}/`))
        .map((k) => d.spots.find((s) => s.id === k.split("/")[2]))
        .filter(Boolean);
      const dishes = src.dishes.map(dishById).filter((f) => f && f.district === d.id);
      const arts = src.saved
        .filter((k) => k.startsWith("culture/"))
        .map((k) => artById(k.split("/")[1]))
        .filter((a) => a && a.district === d.id);
      return { d, places, dishes, arts };
    }).filter((g) => g.places.length || g.dishes.length || g.arts.length);
    const minDays = byDistrict.reduce((n, g) => n + (parseInt(VISIT[g.d.id]?.days, 10) || 1), 0);
    const itemRow = (href, im, name, sub, btn) => `<li>
        <a href="${href}">${im ? `<img src="${esc(thumbOf(im))}" alt="" loading="lazy" />` : '<span class="noimg"></span>'}
          <span><strong>${esc(name)}</strong><small>${esc(sub)}</small></span></a>${shared ? "" : btn}</li>`;

    app.innerHTML = `
      <section class="eat-view trip-view">
        ${siteHead("trip")}
        <header class="eat-hero trip-hero">
          <p class="eyebrow">${shared ? "A trip shared with you" : "My trip"}</p>
          <h1 class="eat-title">${
            byDistrict.length
              ? `${byDistrict.length} ${byDistrict.length === 1 ? "district" : "districts"}, <em>about ${minDays}+ days</em>`
              : "Your Kerala trip <em>starts here</em>"
          }</h1>
          ${
            byDistrict.length
              ? `<div class="trip-tools">
                  <label>Travelling in <select id="trip-month">${MONTHS.map((x, k) => `<option value="${k}"${k === m ? " selected" : ""}>${x}</option>`).join("")}</select></label>
                  ${
                    shared
                      ? `<button class="btn primary" id="trip-import">Add these to my trip</button><a class="btn outline" href="/trip">See my own trip</a>`
                      : `<button class="btn primary" id="trip-share">Share this trip</button>
                         <button class="btn outline" id="trip-print">Print</button>
                         <button class="link-btn" id="trip-clear">Clear the trip</button>`
                  }
                </div>
                <p class="muted small" id="trip-msg" aria-live="polite">${shared ? "" : "Saved in this browser. Share the link to open it on another device."}</p>`
              : `<p class="eat-lede">Tap <strong>♡ ${t("save")}</strong> on any place or art form, and <strong>Want to try</strong> on any dish. They gather here, sorted north to south with the season, routes and tips for each district.</p>
                 <div class="trip-tools"><a class="btn primary" href="/d/kasaragod">Start in the north</a><a class="btn outline" href="/guide">Must-visit places</a><a class="btn outline" href="/eat">The food trail</a></div>`
          }
        </header>
        <ol class="trip-list">
          ${byDistrict
            .map(({ d, places, dishes, arts }) => {
              const v = VISIT[d.id];
              const mi = monthInfo(d, m);
              return `<li class="trip-district">
                <header>
                  <span class="ml" lang="ml">${esc(d.ml)}</span>
                  <h2><a href="/d/${d.id}">${esc(d.name)}</a></h2>
                  ${v?.days ? `<span class="trip-days">${esc(v.days)}</span>` : ""}
                </header>
                ${mi ? `<p class="trip-month"><span class="mk mk-${mi.kind}"></span> ${MONTHS[m]}: ${esc(mi.label.toLowerCase())}${mi.best ? ", a great time to go" : ""}${mi.events[0] ? ` · ${esc(mi.events[0].name)}` : ""}</p>` : ""}
                <ul class="trip-items">
                  ${places.map((s) => itemRow(`/d/${d.id}/${s.id}`, imagesFor(d, s)[0], s.name, s.must ? "Must-visit" : "Place", saveBtn(`d/${d.id}/${s.id}`, s.name))).join("")}
                  ${arts.map((a) => itemRow(`/culture/${a.id}`, artImages(a)[0], a.name, "Art form", saveBtn(`culture/${a.id}`, a.name))).join("")}
                  ${dishes.map((f) => itemRow(`/eat/${f.id}`, dishImages(f)[0], f.name, "To eat", plateBtn(f))).join("")}
                </ul>
                ${v?.getThere?.fromKochi ? `<p class="trip-note"><strong>Getting there:</strong> ${esc(v.getThere.fromKochi)}${v.road ? `. From the previous district: ${esc(lcFirst(v.road.how))}, ${esc(lcFirst(v.road.time))}` : ""}.</p>` : ""}
              </li>`;
            })
            .join("")}
        </ol>
      </section>`;

    app.querySelector("#trip-month")?.addEventListener("change", (e) => {
      TravelMonth.set(+e.target.value);
      rerender();
    });
    const msg = app.querySelector("#trip-msg");
    app.querySelector("#trip-share")?.addEventListener("click", async () => {
      const url = `${location.origin}/trip?s=${encodeURIComponent(encodeTrip())}`;
      try {
        if (navigator.share) await navigator.share({ title: "My Kerala trip", url });
        else {
          await navigator.clipboard.writeText(url);
          msg.textContent = "Link copied. Paste it anywhere to share your trip.";
        }
      } catch {
        msg.innerHTML = `Copy this link: <a href="${esc(url)}">${esc(url)}</a>`;
      }
    });
    app.querySelector("#trip-print")?.addEventListener("click", () => window.print());
    const clear = app.querySelector("#trip-clear");
    clear?.addEventListener("click", () => {
      if (clear.dataset.armed) {
        Saved.set([]);
        Plate.get().forEach((id) => Plate.toggle(id));
        tripChanged();
        rerender();
      } else {
        clear.dataset.armed = "1";
        clear.textContent = "Tap again to clear everything";
      }
    });
    app.querySelector("#trip-import")?.addEventListener("click", () => {
      Saved.set([...new Set([...Saved.get(), ...src.saved])]);
      src.dishes.forEach((id) => Plate.has(id) || Plate.toggle(id));
      tripChanged();
      go("/trip");
    });
    current = { view: "trip", refreshTrip: () => !shared && rerender() };
  }

  // ---------- search (the magnifier button, or press /) ----------
  const Search = (() => {
    let dlg = null, index = null, results = [], sel = 0;
    const norm = (s = "") => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    function build() {
      const out = [];
      const add = (type, title, sub, text, href, ml = "") => out.push({ type, title, sub, href, ml, hay: norm(`${title} ${ml}`), text: norm(text) });
      for (const d of DISTRICTS) {
        add("District", d.name, d.tagline, `${d.intro} ${d.tagline}`, `/d/${d.id}`, d.ml);
        for (const s of d.spots) if (!isEat(s)) add("Place", s.name, d.name, s.blurb, `/d/${d.id}/${s.id}`);
        for (const e of VISIT[d.id]?.events || []) add("Festival", e.name, `${d.name} · ${fmtMonths(e.months)}`, e.what, `/d/${d.id}`);
      }
      for (const f of FOOD) add("Dish", f.name, byId(f.district)?.name || "", `${f.blurb} ${(f.ingredients || []).join(" ")}`, `/eat/${f.id}`, f.ml);
      for (const a of CULTURE.arts) add("Art form", a.name, byId(a.district)?.name || "", `${a.blurb} ${a.story.join(" ")}`, `/culture/${a.id}`, a.ml);
      for (const e of CULTURE.festivals) add("Festival", e.name, "All of Kerala", e.what, "/culture/calendar");
      for (const s of ESSENTIALS.sections) add("Essentials", s.title, "Travel essentials", s.items.map((i) => `${i.h} ${i.p}`).join(" "), `/essentials/${s.id}`);
      for (const [title, href, text] of [
        ["The food trail", "/eat", "food dishes restaurants eat sadya"],
        ["Culture", "/culture", "art forms festivals history phrases malayalam"],
        ["Travel essentials", "/essentials", "packing money sim transport safety"],
        ["My trip", "/trip", "saved plan itinerary share"],
        ["Map", "/map", "districts map"],
      ])
        add("Page", title, "", text, href);
      return out;
    }
    function query(q) {
      const words = norm(q).split(/\s+/).filter(Boolean);
      if (!words.length) return [];
      return index
        .map((e) => {
          let score = 0;
          for (const w of words) {
            if (e.hay.startsWith(w)) score += 10;
            else if (e.hay.includes(w)) score += 6;
            else if (e.text.includes(w)) score += 1;
            else return null;
          }
          return { ...e, score: score + (e.type === "District" ? 2 : 0) };
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .slice(0, 12);
    }
    function draw() {
      const box = dlg.querySelector(".search-results");
      const q = dlg.querySelector("input").value.trim();
      box.innerHTML = !q
        ? `<p class="muted">${esc(t("searchPlaceholder"))}</p>`
        : results.length
        ? `<ul role="listbox">${results
            .map(
              (r, i) => `<li role="option" aria-selected="${i === sel}"><a href="${r.href}" data-close-search>
                <span class="sr-type">${esc(r.type)}</span><strong>${esc(r.title)}</strong>${r.sub ? `<small>${esc(r.sub)}</small>` : ""}</a></li>`
            )
            .join("")}</ul>`
        : `<p class="muted">${esc(t("noResults"))}</p>`;
    }
    function open() {
      index ||= build();
      if (!dlg) {
        dlg = document.createElement("dialog");
        dlg.className = "search";
        dlg.setAttribute("aria-label", t("search"));
        dlg.innerHTML = `<div class="search-inner">
          <div class="search-bar">${SEARCH_ICON}<input type="search" autocomplete="off" spellcheck="false" /><button class="icon-btn" data-close-search aria-label="${t("close")}">✕</button></div>
          <div class="search-results"></div></div>`;
        document.body.appendChild(dlg);
        const input = dlg.querySelector("input");
        input.addEventListener("input", () => {
          results = query(input.value);
          sel = 0;
          draw();
        });
        input.addEventListener("keydown", (e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            sel = Math.max(0, Math.min(results.length - 1, sel + (e.key === "ArrowDown" ? 1 : -1)));
            draw();
          } else if (e.key === "Enter" && results[sel]) {
            e.preventDefault();
            dlg.close();
            go(results[sel].href);
          }
        });
        dlg.addEventListener("click", (e) => {
          if (e.target === dlg || e.target.closest("[data-close-search]")) dlg.close();
        });
      }
      dlg.querySelector("input").placeholder = t("searchPlaceholder");
      dlg.showModal();
      dlg.querySelector("input").select();
      draw();
    }
    return { open, isOpen: () => !!dlg?.open };
  })();

  // ---------- panorama: a full-screen wide view you drag across ----------
  function openPano(key, name) {
    const p = PANORAMAS[key];
    if (!p) return;
    const el = document.createElement("div");
    el.className = "pano";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", `${t("panorama")}: ${name}`);
    el.innerHTML = `
      <div class="pano-stage" tabindex="0" aria-label="Drag, or use the arrow keys, to look around"><img alt="${esc(name)}" draggable="false" /></div>
      <div class="pano-top"><strong>${esc(name)}</strong><button class="chip" data-pano-close>✕ ${t("close")}</button></div>
      <div class="pano-strip" aria-hidden="true"><img alt="" draggable="false" /><span class="pano-win"></span></div>
      <p class="pano-credit"><a href="${esc(p.source)}" target="_blank" rel="noopener">“${esc(p.title)}”</a> by ${esc(p.author)} · ${
        p.licenseUrl ? `<a href="${esc(p.licenseUrl)}" target="_blank" rel="noopener">${esc(p.license)}</a>` : esc(p.license)
      } · resized</p>`;
    document.body.appendChild(el);
    const stage = el.querySelector(".pano-stage");
    const img = stage.querySelector("img");
    const strip = el.querySelector(".pano-strip");
    const win = el.querySelector(".pano-win");
    let x = 0, w = 0, drag = null;
    const layout = () => {
      const vh = stage.clientHeight, vw = stage.clientWidth;
      w = (img.naturalWidth / img.naturalHeight) * vh || vw;
      img.style.height = vh + "px";
      img.style.width = w + "px";
      x = Math.max(Math.min(0, vw - w), Math.min(0, x));
      img.style.transform = `translateX(${x}px)`;
      // The overview strip is a fixed height, so wider panoramas get a wider strip.
      const ratio = img.naturalWidth / img.naturalHeight || 3;
      strip.style.width = `${Math.min(ratio * 54, window.innerWidth - 32)}px`;
      const sw = strip.clientWidth;
      win.style.width = `${Math.min(1, vw / w) * sw}px`;
      win.style.transform = `translateX(${(-x / w) * sw}px)`;
    };
    const moveBy = (dx) => {
      x += dx;
      layout();
    };
    img.onload = () => {
      x = (stage.clientWidth - (img.naturalWidth / img.naturalHeight) * stage.clientHeight) / 2;
      layout();
    };
    img.src = strip.querySelector("img").src = p.src;
    stage.addEventListener("pointerdown", (e) => {
      drag = e.clientX;
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener("pointermove", (e) => {
      if (drag === null) return;
      moveBy(e.clientX - drag);
      drag = e.clientX;
    });
    stage.addEventListener("pointerup", () => (drag = null));
    stage.addEventListener("pointercancel", () => (drag = null));
    stage.addEventListener("wheel", (e) => {
      e.preventDefault();
      moveBy(-(e.deltaX || e.deltaY));
    }, { passive: false });
    // Tap or drag on the overview strip to jump there.
    const stripTo = (e) => {
      const r = strip.getBoundingClientRect();
      x = -((e.clientX - r.left) / r.width) * w + stage.clientWidth / 2;
      layout();
    };
    strip.addEventListener("pointerdown", (e) => {
      strip.setPointerCapture(e.pointerId);
      stripTo(e);
      strip.onpointermove = stripTo;
    });
    strip.addEventListener("pointerup", () => (strip.onpointermove = null));
    const ro = new ResizeObserver(layout);
    ro.observe(stage);
    const opener = document.activeElement;
    const close = () => {
      ro.disconnect();
      el.remove();
      document.removeEventListener("keydown", onKey, true);
      opener?.focus?.({ preventScroll: true });
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.stopPropagation();
        e.preventDefault();
        moveBy(e.key === "ArrowLeft" ? 80 : -80);
      }
    };
    document.addEventListener("keydown", onKey, true);
    el.querySelector("[data-pano-close]").addEventListener("click", close);
    stage.focus();
  }

  // ---------- district ----------
  function renderDistrict(r, from) {
    const d = r.d;
    const i = indexOf(d);
    const prev = DISTRICTS[i - 1], next = DISTRICTS[i + 1];
    const visit = VISIT[d.id];
    const xp = EXPERIENCES[d.id];
    const sound = SOUNDS[d.id] ? { ...SOUNDS[d.id], play: CAN_OGG && SOUNDS[d.id].ogg ? SOUNDS[d.id].ogg : SOUNDS[d.id].src } : null;
    const tm = TravelMonth.get();
    const month = monthInfo(d, tm);
    const pins = d.spots
      .map((s, si) => {
        const c = MEDIA[`${d.id}/${s.id}`]?.coords;
        if (!c || isEat(s)) return "";
        const [x, y] = project(c);
        return `<g class="pin" data-si="${si}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})" tabindex="0" role="button" aria-label="${esc(s.name)}">
          <circle r="7" class="pin-halo"></circle><circle r="3.2" class="pin-dot"></circle><title>${esc(s.name)}</title></g>`;
      })
      .join("");

    app.innerHTML = `
      <section class="scene-view" data-district="${d.id}">
        <div class="viewer" id="viewer"></div>
        <div class="scene-shade"></div>

        <header class="topbar">
          <a class="chip" href="/map/${d.id}" aria-label="Back to map"><span aria-hidden="true">←</span><span class="lbl"> ${t("backToMap")}</span></a>
          <div class="where">
            <span class="ml" lang="ml">${esc(d.ml)}</span>
            <strong>${esc(d.name)}</strong>
            <span class="count">${t("stopOf", { n: i + 1, total: DISTRICTS.length })}</span>
          </div>
          <div class="top-actions">
            ${VISIT[d.id] ? `<button class="chip plan-chip" data-sheet="when" title="Plan your visit (V)"><span aria-hidden="true">☼</span><span class="lbl"> ${t("plan")}</span></button>` : ""}
            ${sound ? `<button class="chip" data-sound aria-pressed="false" aria-label="Play sound: ${esc(sound.label)}" title="${esc(sound.label)}"><span aria-hidden="true">♪</span><span class="lbl"> ${t("sound")}</span></button>` : ""}
            <button class="chip" data-search aria-label="${t("search")}">${SEARCH_ICON}</button>
            <button class="chip" data-passport aria-label="${t("passport")}">${STAMP_ICON}<span class="lbl">${t("passport")} · </span><span data-count>${Passport.count()}</span>/14</button>
            <button class="chip" data-hide aria-pressed="false" title="Hide the panels (H)">${t("justLook")}</button>
          </div>
        </header>
        ${sound ? `<p class="sound-credit" hidden>♪ ${esc(sound.label)} · <a href="${esc(sound.source)}" target="_blank" rel="noopener">“${esc(sound.title)}”</a> by ${esc(sound.author)} · <a href="${esc(sound.licenseUrl)}" target="_blank" rel="noopener">${esc(sound.license)}</a></p>` : ""}

        <nav class="minimap" aria-label="Places in ${esc(d.name)}">
          ${mapSvg({ focus: d.id, cls: "mini", pins: [pins], labels: false })}
        </nav>

        <div class="dock">
        <aside class="place" id="place" aria-live="polite"></aside>

        <nav class="strip" aria-label="Places">
          ${prev ? `<a class="hop prev" href="/d/${prev.id}"><small>${t("backNorth")}</small>${esc(prev.name)}</a>` : `<a class="hop prev" href="/"><small>${t("backTo")}</small>${t("start")}</a>`}
          <div class="spots" id="spots">
            ${d.spots
              .map((s, si) => {
                const im = imagesFor(d, s)[0];
                return `<a href="/d/${d.id}/${s.id}" data-si="${si}" class="spot">
                  ${im ? `<img src="${esc(thumbOf(im))}" alt="" loading="lazy" />` : '<span class="noimg"></span>'}
                  ${isEat(s) ? '<span class="tag eat">Eat</span>' : s.must ? '<span class="tag">Must-visit</span>' : ""}
                  <span class="nm">${esc(s.name)}</span></a>`;
              })
              .join("")}
          </div>
          ${next ? `<a class="hop next" href="/d/${next.id}"><small>${t("continueSouth")}</small>${esc(next.name)} →</a>` : `<a class="hop next" href="/map"><small>${t("journeysEnd")}</small>${t("seeMap")}</a>`}
        </nav>
        </div>

        <p class="credit" id="credit"></p>

        <div class="board" id="board" hidden>
          <div class="board-card" role="dialog" aria-labelledby="board-title">
            ${
              visit?.road && prev
                ? `<div class="board-road">
                    <span class="br-k">${esc(t("roadFrom", { name: prev.name }))}</span>
                    <strong>${esc(visit.road.how)}</strong>
                    <span>${esc(visit.road.time)}${visit.road.tip ? ` · ${esc(visit.road.tip)}` : ""}</span>
                  </div>`
                : ""
            }
            <p class="board-kicker">${from?.view === "district" ? t("welcome") : t("arrived")}</p>
            <p class="board-ml ml" lang="ml">${esc(d.ml)}</p>
            <h2 id="board-title">${esc(d.name)}</h2>
            <p class="board-tag">${esc(d.tagline)}</p>
            <p class="board-intro">${esc(d.intro)}</p>
            <ul class="board-spots">${d.spots
              .map((s) => `<li class="${isEat(s) ? "eat" : s.must ? "must" : ""}">${isEat(s) ? "Taste: " : ""}${esc(s.name)}</li>`)
              .join("")}</ul>
            ${
              month
                ? `<p class="board-month"><span class="mk mk-${month.kind}"></span><span><strong>In ${MONTHS[tm]}:</strong> ${esc(month.label.toLowerCase())}${
                    month.best ? ", a great time to visit" : ""
                  }${month.events[0] ? `. ${esc(month.events[0].name)}` : ""}.</span> <button class="link-btn" data-board-sheet="when">${t("changeMonth")}</button></p>`
                : ""
            }
            <div class="board-actions">
              <button class="btn primary" data-enter>${t("stepIn")} <span aria-hidden="true">→</span></button>
              ${visit ? `<button class="btn board-ghost" data-board-sheet="plan">${t("planVisit")}</button>` : ""}
            </div>
            ${xp ? `<button class="board-xp" data-board-sheet="xp"><span class="tag">${t("tryIt")}</span> ${esc(xp.title)}</button>` : ""}
            <p class="board-hint">${t("orEnter")}</p>
          </div>
        </div>

        ${
          visit
            ? `<aside class="sheet" id="sheet" role="dialog" aria-labelledby="sheet-title" hidden>
            <header class="sheet-head">
              <div><p class="eyebrow">${t("planVisit")}</p><h2 id="sheet-title">${esc(d.name)} <span class="ml" lang="ml">${esc(d.ml)}</span></h2></div>
              <button class="icon-btn sheet-close" aria-label="${t("close")}">✕</button>
            </header>
            <nav class="sheet-tabs" role="tablist" aria-label="Plan your visit">
              <button role="tab" data-tab="when">${t("whenToGo")}</button>
              <button role="tab" data-tab="plan">${t("planTrip")}</button>
              ${xp ? `<button role="tab" data-tab="xp">${t("tryIt")}</button>` : ""}
            </nav>
            <div class="sheet-body" id="sheet-body" role="tabpanel"></div>
          </aside>`
            : ""
        }
      </section>`;

    // Zoom the mini map to this district.
    const svg = app.querySelector(".kmap.mini");
    const bb = svg.querySelector(`path[data-id="${d.id}"]`).getBBox();
    const padd = Math.max(bb.width, bb.height) * 0.25;
    svg.setAttribute("viewBox", `${bb.x - padd} ${bb.y - padd} ${bb.width + padd * 2} ${bb.height + padd * 2}`);
    svg.style.setProperty("--pin-scale", String(Math.max(bb.width, bb.height) / 110));

    const viewer = Viewer(app.querySelector("#viewer"));
    current = { view: "district", d, viewer, si: -1, n: -1 };

    // Wire controls
    const view = app.querySelector(".scene-view");
    app.querySelector("[data-hide]").addEventListener("click", toggleUi);
    app.querySelectorAll(".pin").forEach((p) => {
      const hop = () => go(`/d/${d.id}/${d.spots[+p.dataset.si].id}`);
      p.addEventListener("click", hop);
      p.addEventListener("keydown", (e) => e.key === "Enter" && hop());
    });

    // ----- the Plan sheet: when to go, a suggested trip, and the district's hands-on experience -----
    const sheet = app.querySelector("#sheet");
    const sheetBody = app.querySelector("#sheet-body");
    let sheetTab = null, sheetOpener = null;
    const spotLink = (id) => {
      const s = d.spots.find((x) => x.id === id);
      return s ? `<a href="/d/${d.id}/${s.id}" data-close-sheet>${esc(s.name)}</a>` : "";
    };
    const renderWhen = () => {
      const m = TravelMonth.get();
      const info = monthInfo(d, m);
      const kinds = [...new Set(CLIMATES[visit.climate] || [])];
      sheetBody.innerHTML = `
        <p class="sheet-q">When are you going?</p>
        <div class="months" role="radiogroup" aria-label="Month of travel">
          ${MONTHS.map((name, k) => {
            const mi = monthInfo(d, k);
            return `<button role="radio" aria-checked="${k === m}" data-m="${k}" class="mk-${mi.kind}${mi.best ? " best" : ""}" aria-label="${name}: ${esc(
              mi.label
            )}${mi.best ? ", best time" : ""}${mi.events.length ? `, ${mi.events.length} event${mi.events.length > 1 ? "s" : ""}` : ""}">
              <span>${name.slice(0, 3)}</span>${mi.events.some((e) => e.months.length < 12) ? '<i class="ev-dot" aria-hidden="true"></i>' : ""}</button>`;
          }).join("")}
        </div>
        <p class="legend">${kinds.map((k) => `<span><span class="mk mk-${k}"></span>${esc(CLIMATES.kinds[k]?.label || k)}</span>`).join("")}
          <span><span class="best-mark"></span>Best time</span><span><i class="ev-dot"></i>Festival</span></p>
        <article class="month-card">
          <p class="mc-kind"><span class="mk mk-${info.kind}"></span>${esc(info.label)}${info.best ? ' · <strong class="mc-best">One of the best months to visit</strong>' : ""}</p>
          <h3>${MONTHS[m]} in ${esc(d.name)}</h3>
          <p>${esc(info.line)}</p>
          ${
            info.events.length
              ? `<h4>What's on</h4><ul class="events">${info.events.map((e) => `<li><strong>${esc(e.name)}</strong> ${esc(e.what)}</li>`).join("")}</ul>`
              : `<p class="muted">No big festivals this month.</p>`
          }
          ${info.moving.map((e) => `<p class="moving"><strong>${esc(e.name)}:</strong> ${esc(e.what)}</p>`).join("")}
        </article>
        <h4>Through the year</h4>
        <ul class="year">${(visit.events || [])
          .map((e) => `<li><span>${esc(fmtMonths(e.months))}</span><strong>${esc(e.name)}</strong></li>`)
          .join("")}</ul>
        <p class="footnote">Festival dates follow traditional calendars and move from year to year. Check the dates before you book.</p>`;
      sheetBody.querySelectorAll(".months button").forEach((b) =>
        b.addEventListener("click", () => {
          TravelMonth.set(+b.dataset.m);
          renderWhen();
          sheetBody.querySelector(`.months [data-m="${b.dataset.m}"]`).focus();
        })
      );
    };
    const renderPlan = () => {
      const gt = visit.getThere || {};
      sheetBody.innerHTML = `
        <dl class="facts">
          ${gt.air ? `<div><dt>Fly into</dt><dd>${esc(gt.air)}</dd></div>` : ""}
          ${gt.rail ? `<div><dt>By train</dt><dd>${esc(gt.rail)}</dd></div>` : ""}
          ${gt.fromKochi ? `<div><dt>From Kochi</dt><dd>${esc(gt.fromKochi)}</dd></div>` : ""}
          ${visit.days ? `<div><dt>Stay</dt><dd>${esc(visit.days)}</dd></div>` : ""}
        </dl>
        ${
          visit.routes?.length
            ? `<h4>Suggested days</h4><ol class="routes">${visit.routes
                .map(
                  (rt) => `<li><strong>${esc(rt.title)}</strong>
                  <p class="route-stops">${rt.stops.map(spotLink).filter(Boolean).join('<span aria-hidden="true"> → </span>')}</p>
                  ${rt.note ? `<p class="route-note">${esc(rt.note)}</p>` : ""}</li>`
                )
                .join("")}</ol>`
            : ""
        }
        ${visit.tips?.length ? `<h4>Good to know</h4><ul class="tips">${visit.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
        ${
          visit.road && prev
            ? `<h4>Coming from ${esc(prev.name)}</h4><p>${esc(visit.road.how)}, ${esc(lcFirst(visit.road.time))}.${
                visit.road.tip ? ` ${esc(visit.road.tip)}` : ""
              }</p>`
            : ""
        }
        ${
          next && VISIT[next.id]?.road
            ? `<h4>Going on to ${esc(next.name)}</h4><p>${esc(VISIT[next.id].road.how)}, ${esc(lcFirst(VISIT[next.id].road.time))}.</p>`
            : ""
        }`;
    };
    const renderXp = () => {
      sheetBody.innerHTML = `<p class="xp-teaser">${esc(xp.teaser)}</p><h3 class="xp-head">${esc(xp.title)}</h3><div class="xp-host"></div>`;
      xp.mount(sheetBody.querySelector(".xp-host"));
    };
    const showTab = (tab) => {
      if (tab === "xp" && !xp) tab = "when";
      sheetTab = tab;
      sheet.querySelectorAll(".sheet-tabs button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
      sheet.classList.toggle("wide", tab === "xp");
      ({ when: renderWhen, plan: renderPlan, xp: renderXp })[tab]();
      sheetBody.scrollTop = 0;
    };
    const openSheet = (tab = "when") => {
      if (!sheet) return;
      sheetOpener = document.activeElement;
      sheet.hidden = false;
      view.classList.add("sheet-open");
      showTab(tab);
      sheet.querySelector(`.sheet-tabs [data-tab="${sheetTab}"]`).focus({ preventScroll: true });
    };
    const closeSheet = () => {
      if (!sheet || sheet.hidden) return;
      sheet.hidden = true;
      view.classList.remove("sheet-open");
      sheetOpener?.focus?.({ preventScroll: true });
    };
    if (sheet) {
      sheet.querySelector(".sheet-close").addEventListener("click", closeSheet);
      sheet.querySelectorAll(".sheet-tabs button").forEach((b) => b.addEventListener("click", () => showTab(b.dataset.tab)));
      sheet.addEventListener("click", (e) => e.target.closest("[data-close-sheet]") && closeSheet());
      app.querySelectorAll("[data-sheet]").forEach((b) => b.addEventListener("click", () => openSheet(b.dataset.sheet)));
    }
    current.openSheet = openSheet;
    current.closeSheet = closeSheet;
    current.sheetOpen = () => !!sheet && !sheet.hidden;

    // ----- sound: plays only when the visitor asks -----
    if (sound) {
      const btn = app.querySelector("[data-sound]");
      const creditEl = app.querySelector(".sound-credit");
      let audio = null;
      btn.addEventListener("click", () => {
        if (!audio) {
          audio = new Audio(sound.play);
          audio.loop = true;
        }
        const on = audio.paused;
        if (on) audio.play().catch(() => {});
        else audio.pause();
        btn.setAttribute("aria-pressed", String(on));
        creditEl.hidden = !on;
      });
      current.cleanup = () => audio?.pause();
    }

    // Arrival board: shown when you arrive at a district rather than deep-linking to a place.
    const board = app.querySelector("#board");
    if (!r.explicit) {
      board.hidden = false;
      view.classList.add("arriving");
      const enter = () => {
        board.hidden = true;
        view.classList.remove("arriving");
        stamp(d);
        app.querySelector("#place .scene-nav .next")?.focus({ preventScroll: true });
      };
      board.querySelector("[data-enter]").addEventListener("click", enter);
      board.addEventListener("click", (e) => e.target === board && enter());
      board.querySelectorAll("[data-board-sheet]").forEach((b) =>
        b.addEventListener("click", () => {
          enter();
          openSheet(b.dataset.boardSheet);
        })
      );
      current.enter = enter;
      requestAnimationFrame(() => board.querySelector("[data-enter]").focus({ preventScroll: true }));
    } else {
      stamp(d);
    }
    updateScene(r.si, r.n);
  }

  function stamp(d) {
    if (Passport.stamp(d.id)) {
      document.querySelectorAll("[data-count]").forEach((el) => (el.textContent = Passport.count()));
      const t = document.createElement("div");
      t.className = "toast";
      t.innerHTML = `<span class="toast-stamp ml" lang="ml">${esc(d.ml)}</span><span>Passport stamped: <strong>${esc(d.name)}</strong></span>`;
      document.body.appendChild(t);
      setTimeout(() => t.classList.add("out"), 2600);
      setTimeout(() => t.remove(), 3200);
    }
  }

  function updateScene(si, n) {
    const { d, viewer } = current;
    const s = d.spots[si];
    const imgs = imagesFor(d, s);
    n = imgs.length ? Math.min(n, imgs.length - 1) : 0;
    const spotChanged = si !== current.si;
    current.si = si;
    current.n = n;
    const im = imgs[n];

    viewer.show(im, `${s.name}, ${d.name}`);
    preload(imgs[n + 1] || imagesFor(d, d.spots[si + 1] || d.spots[0])[0]);
    app.querySelector("#credit").innerHTML = credit(im);

    const isLast = si === d.spots.length - 1 && n >= imgs.length - 1;
    const nextD = DISTRICTS[indexOf(d) + 1];
    const place = app.querySelector("#place");
    if (spotChanged || !place.innerHTML) {
      place.innerHTML = `
        <p class="eyebrow">${
          isEat(s) ? `<span class="tag eat">${t("eat")}</span> The taste of ${esc(d.name)}` : s.must ? `<span class="tag">${t("mustVisit")}</span> ${esc(d.tagline)}` : esc(d.tagline)
        }</p>
        <h1>${esc(s.name)}</h1>
        <div class="place-actions">
          ${isEat(s) && dishById(s.id) ? plateBtn(dishById(s.id)) : saveBtn(`d/${d.id}/${s.id}`, s.name, "dark")}
          ${PANORAMAS[`${d.id}/${s.id}`] ? `<button class="save-btn dark pano-btn" data-pano><span aria-hidden="true">⟷</span> ${t("panorama")}</button>` : ""}
        </div>
        <button class="more" aria-expanded="false">${t("about")}</button>
        <p class="blurb">${esc(s.blurb)}</p>
        <dl class="senses">
          <div><dt><span aria-hidden="true">◌</span> ${t("hear")}</dt><dd>${esc(s.senses.hear)}</dd></div>
          <div><dt><span aria-hidden="true">◌</span> ${t("taste")}</dt><dd>${esc(s.senses.taste)}</dd></div>
          <div><dt><span aria-hidden="true">◌</span> ${t("feel")}</dt><dd>${esc(s.senses.feel)}</dd></div>
        </dl>
        ${isEat(s) ? `<a class="dish-link" href="/eat/${s.id}">How it's made, how to eat it <span aria-hidden="true">→</span></a>${stopsBlock(s, d)}` : ""}
        <div class="scene-nav">
          <button class="round prev" aria-label="Previous view">‹</button>
          <span class="dots" role="tablist"></span>
          <button class="round next" aria-label="Next view">›</button>
          <span class="next-label"></span>
        </div>`;
      place.querySelector(".more").addEventListener("click", (e) => {
        const open = place.classList.toggle("open");
        e.currentTarget.setAttribute("aria-expanded", String(open));
      });
      place.querySelector("[data-pano]")?.addEventListener("click", () => openPano(`${d.id}/${s.id}`, s.name));
      place.querySelector(".prev").addEventListener("click", () => step(-1));
      place.querySelector(".next").addEventListener("click", () => step(1));
    }
    place.querySelector(".dots").innerHTML = imgs
      .map((_, k) => `<button role="tab" aria-selected="${k === n}" aria-label="View ${k + 1} of ${imgs.length}" data-n="${k}"></button>`)
      .join("");
    place.querySelectorAll(".dots button").forEach((b) =>
      b.addEventListener("click", () => go(`/d/${d.id}/${s.id}/${b.dataset.n}`))
    );
    const nextSpot = n >= imgs.length - 1 ? d.spots[si + 1] : null;
    place.querySelector(".next-label").textContent = isLast
      ? nextD ? t("next", { name: nextD.name }) : t("endOfRoad")
      : nextSpot ? t("next", { name: nextSpot.name }) : "";
    place.querySelector(".prev").disabled = indexOf(d) === 0 && si === 0 && n === 0;

    app.querySelectorAll("#spots .spot").forEach((a) => {
      const on = +a.dataset.si === si;
      a.classList.toggle("on", on);
      a.setAttribute("aria-current", on ? "true" : "false");
      if (on && spotChanged) {
        // Scroll only the strip; scrollIntoView would also shift the photo viewer.
        const strip = a.parentElement;
        strip.scrollTo({ left: a.offsetLeft - (strip.clientWidth - a.clientWidth) / 2, behavior: "smooth" });
      }
    });
    app.querySelectorAll(".pin").forEach((p) => p.classList.toggle("on", +p.dataset.si === si));
  }

  // Walk forward/back through views → places → districts.
  function step(dir) {
    const { d, si, n } = current;
    const imgs = imagesFor(d, d.spots[si]);
    if (dir > 0) {
      if (n < imgs.length - 1) return go(`/d/${d.id}/${d.spots[si].id}/${n + 1}`);
      if (si < d.spots.length - 1) return go(`/d/${d.id}/${d.spots[si + 1].id}`);
      const nd = DISTRICTS[indexOf(d) + 1];
      return go(nd ? `/d/${nd.id}` : "/map");
    }
    if (n > 0) return go(`/d/${d.id}/${d.spots[si].id}/${n - 1}`);
    if (si > 0) {
      const ps = d.spots[si - 1];
      return go(`/d/${d.id}/${ps.id}/${Math.max(0, imagesFor(d, ps).length - 1)}`);
    }
    const pd = DISTRICTS[indexOf(d) - 1];
    if (pd) {
      const ls = pd.spots[pd.spots.length - 1];
      go(`/d/${pd.id}/${ls.id}/${Math.max(0, imagesFor(pd, ls).length - 1)}`);
    }
  }

  function toggleUi() {
    const view = app.querySelector(".scene-view");
    if (!view) return;
    const hidden = view.classList.toggle("ui-hidden");
    const b = view.querySelector("[data-hide]");
    b.setAttribute("aria-pressed", String(hidden));
    b.textContent = hidden ? t("showPanels") : t("justLook");
  }

  // ---------- passport dialog ----------
  const dlg = document.getElementById("passport");
  function openPassport() {
    const stamps = Passport.get();
    const n = Passport.count();
    document.getElementById("stamps").innerHTML = DISTRICTS.map((d, i) => {
      const got = stamps[d.id];
      const rot = ((i * 37) % 17) - 8;
      return got
        ? `<a class="stamp got" href="/d/${d.id}" style="--rot:${rot}deg" data-close>
             <span class="ml" lang="ml">${esc(d.ml)}</span><strong>${esc(d.name)}</strong><small>${esc(got)}</small></a>`
        : `<a class="stamp" href="/d/${d.id}" data-close><strong>${esc(d.name)}</strong><small>not yet</small></a>`;
    }).join("");
    document.getElementById("passport-note").textContent =
      n === 14 ? "You've seen all of Kerala. Time to go for real." : `${n} of 14 districts visited. Stamps are saved in this browser.`;
    dlg.showModal();
  }
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg || e.target.closest("[data-close]")) dlg.close();
  });
  document.getElementById("passport-reset").addEventListener("click", () => {
    Passport.reset();
    dlg.close();
    render();
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-passport]")) openPassport();
    const pb = e.target.closest("[data-plate]");
    if (pb) {
      const f = dishById(pb.dataset.plate);
      Plate.toggle(f.id);
      document.querySelectorAll(`[data-plate="${CSS.escape(f.id)}"]`).forEach((b) => (b.outerHTML = plateBtn(f)));
      current?.refreshPlate?.();
      tripChanged();
    }
    const sb = e.target.closest("[data-save]");
    if (sb) {
      const k = sb.dataset.save;
      Saved.toggle(k);
      document.querySelectorAll(`[data-save="${CSS.escape(k)}"]`).forEach((b) => {
        const name = b.getAttribute("aria-label").replace(/^(Save|Remove) (.*) (to|from) my trip$/, "$2");
        b.outerHTML = saveBtn(k, name, b.classList.contains("dark") ? "dark" : "");
      });
      tripChanged();
    }
    if (e.target.closest("[data-search]")) Search.open();
    if (e.target.closest("[data-lang]")) {
      Lang.set(Lang.get() === "ml" ? "en" : "ml");
      applyLang();
      rerender();
    }
  });

  function tripChanged() {
    const n = tripCount();
    document.querySelectorAll("[data-trip-count]").forEach((el) => (el.textContent = n || ""));
    current?.refreshTrip?.();
  }
  function applyLang() {
    document.documentElement.lang = Lang.get() === "ml" ? "ml" : "en";
    document.documentElement.classList.toggle("lang-ml", Lang.get() === "ml");
  }
  // Rebuild the current page from scratch (after a language switch).
  function rerender() {
    current?.viewer?.destroy();
    current?.cleanup?.();
    current = null;
    render();
  }

  // ---------- keyboard ----------
  document.addEventListener("keydown", (e) => {
    if (dlg.open || Search.isOpen() || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest?.("input, textarea, select")) return;
    if (e.key === "/") {
      e.preventDefault();
      return Search.open();
    }
    if (current?.view === "art") {
      const { a, n, count } = current;
      if (e.key === "Escape") go("/culture/arts");
      else if (count > 1 && (e.key === "ArrowRight" || e.key === "ArrowLeft"))
        go(`/culture/${a.id}/${(n + (e.key === "ArrowRight" ? 1 : count - 1)) % count}`);
      return;
    }
    if (current?.view === "dish") {
      const { f, n, count } = current;
      if (e.key === "Escape") go("/eat/trail");
      else if (count > 1 && (e.key === "ArrowRight" || e.key === "ArrowLeft"))
        go(`/eat/${f.id}/${(n + (e.key === "ArrowRight" ? 1 : count - 1)) % count}`);
      return;
    }
    if (current?.view !== "district") return;
    if (current.sheetOpen()) {
      if (e.key === "Escape") current.closeSheet();
      return;
    }
    const arriving = !app.querySelector("#board").hidden;
    if (arriving) {
      if (["Enter", " ", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        current.enter();
      }
      return;
    }
    const k = e.key.toLowerCase();
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (k === "h") toggleUi();
    else if (k === "v") current.openSheet("when");
    else if (k === "m" || e.key === "Escape") go(`/map/${current.d.id}`);
    else if (k === "n") {
      const nd = DISTRICTS[indexOf(current.d) + 1];
      if (nd) go(`/d/${nd.id}`);
    } else if (k === "p") {
      const pd = DISTRICTS[indexOf(current.d) - 1];
      if (pd) go(`/d/${pd.id}`);
    }
  });

  window.addEventListener("popstate", render);
  window.addEventListener("hashchange", () => {
    fromHash();
    render();
  });
  fromHash();
  applyLang();
  render();
})();
