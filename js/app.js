/* Kerala Journey — a walk through Kerala's districts, one scene at a time. */
(() => {
  "use strict";

  const DISTRICTS = window.KERALA_DISTRICTS;
  const MAP = window.KERALA_MAP;
  const MEDIA = mergeMedia(window.KERALA_MEDIA || {}, window.KERALA_MEDIA_OVERRIDES || {});
  const HERO = ["alappuzha/houseboats", "idukki/munnar", "ernakulam/fort-kochi"];
  const app = document.getElementById("app");

  // ---------- helpers ----------
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const byId = (id) => DISTRICTS.find((d) => d.id === id);
  const indexOf = (d) => DISTRICTS.indexOf(d);
  const imagesFor = (d, s) => MEDIA[`${d.id}/${s.id}`]?.images || [];
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

  function credit(im) {
    if (!im) return "";
    const lic = im.licenseUrl ? `<a href="${esc(im.licenseUrl)}" target="_blank" rel="noopener">${esc(im.license)}</a>` : esc(im.license);
    return `Photo: <a href="${esc(im.source)}" target="_blank" rel="noopener">${esc(im.author)}</a> · ${lic}`;
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

  // ---------- look-around viewer: drag to pan, scroll / double-click to zoom ----------
  function Viewer(el) {
    const st = { x: 0, y: 0, zoom: 1.12, drag: null };
    const MIN = 1.08, MAX = 2.4;

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

    el.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      st.drag = { px: e.clientX, py: e.clientY };
      el.setPointerCapture(e.pointerId);
      el.classList.add("grabbing");
    });
    el.addEventListener("pointermove", (e) => {
      if (!st.drag) return;
      st.x += e.clientX - st.drag.px;
      st.y += e.clientY - st.drag.py;
      st.drag = { px: e.clientX, py: e.clientY };
      apply();
    });
    const end = () => {
      st.drag = null;
      el.classList.remove("grabbing");
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
    el.addEventListener("dblclick", () => {
      st.zoom = st.zoom > 1.5 ? 1.12 : 1.9;
      apply();
    });
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
        img.src = im.src;
        el.appendChild(img);
      },
      destroy() {
        ro.disconnect();
      },
    };
  }

  const preload = (im) => {
    if (im) new Image().src = im.src;
  };

  // ---------- routing ----------
  // #/                 arrival
  // #/map              map
  // #/d/<district>[/<spot>[/<n>]]
  function parse() {
    const p = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (p[0] === "map") return { view: "map", focus: p[1] };
    if (p[0] === "d" && byId(p[1])) {
      const d = byId(p[1]);
      const si = Math.max(0, d.spots.findIndex((s) => s.id === p[2]));
      return { view: "district", d, si, n: Math.max(0, parseInt(p[3], 10) || 0), explicit: !!p[2] };
    }
    return { view: "home" };
  }
  const go = (hash) => (location.hash = hash);

  let current = null; // { view, district, viewer, ... }

  function render() {
    const r = parse();
    if (r.view === "district" && current?.view === "district" && current.d === r.d) {
      updateScene(r.si, r.n);
      return;
    }
    current?.viewer?.destroy();
    const from = current;
    current = null;
    window.scrollTo(0, 0);
    if (r.view === "map") renderMap(r.focus);
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
        <div class="home-copy">
          <p class="eyebrow">A journey through</p>
          <h1>Kerala <span class="ml" lang="ml">കേരളം</span></h1>
          <p class="lede">Fourteen districts between the Western Ghats and the Arabian Sea. Start at the forts in the far north and finish on the cliffs of the south, looking around at each stop.</p>
          <div class="actions">
            <a class="btn primary" href="#/d/kasaragod">${visited ? "Continue the journey" : "Begin in the north"} <span aria-hidden="true">→</span></a>
            <a class="btn ghost" href="#/map">Choose on the map</a>
          </div>
          <p class="hint"><span class="hint-icon" aria-hidden="true">✥</span> Drag any photo to look around · scroll to look closer</p>
        </div>
        <p class="credit">${credit(im)}</p>
      </section>`;
    if (visited) {
      const next = DISTRICTS.find((d) => !Passport.get()[d.id]) || DISTRICTS[0];
      app.querySelector(".btn.primary").href = `#/d/${next.id}`;
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
        <header class="map-head">
          <a class="brand" href="#/">Kerala <span class="ml" lang="ml">കേരളം</span></a>
          <button class="chip light" data-passport>Passport · <span data-count>${Passport.count()}</span>/14</button>
        </header>
        <div class="map-layout">
          <div class="map-wrap">
            ${mapSvg({ focus: focus.id })}
            <p class="compass" aria-hidden="true"><span>N</span>↑</p>
          </div>
          <div class="map-side">
            <p class="eyebrow">Choose your next stop</p>
            <h1 class="map-title">Fourteen districts,<br />north to south</h1>
            <article class="preview" id="preview"></article>
            <ol class="route" aria-label="Districts from north to south">
              ${DISTRICTS.map(
                (d, i) => `<li><a href="#/d/${d.id}" data-id="${d.id}" class="${stamps[d.id] ? "visited" : ""}">
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
          .map(([s, im]) => `<a href="#/d/${d.id}/${s.id}" title="${esc(s.name)}"><img src="${esc(im.thumb)}" alt="${esc(s.name)}" loading="lazy" /><span>${esc(s.name)}</span></a>`)
          .join("")}</div>
        <a class="btn primary" href="#/d/${d.id}">Travel to ${esc(d.name)} <span aria-hidden="true">→</span></a>`;
    };
    setFocus(focus);

    app.querySelectorAll(".kmap .district").forEach((p) => {
      const d = byId(p.dataset.id);
      p.addEventListener("mouseenter", () => setFocus(d));
      p.addEventListener("focus", () => setFocus(d));
      p.addEventListener("click", () => go(`#/d/${d.id}`));
      p.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go(`#/d/${d.id}`);
        }
      });
    });
    app.querySelectorAll(".route a").forEach((a) => {
      a.addEventListener("mouseenter", () => setFocus(byId(a.dataset.id)));
      a.addEventListener("focus", () => setFocus(byId(a.dataset.id)));
    });
    current = { view: "map" };
  }

  // ---------- district ----------
  function renderDistrict(r, from) {
    const d = r.d;
    const i = indexOf(d);
    const prev = DISTRICTS[i - 1], next = DISTRICTS[i + 1];
    const g = MAP.districts[d.id];
    const pins = d.spots
      .map((s, si) => {
        const c = MEDIA[`${d.id}/${s.id}`]?.coords;
        if (!c) return "";
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
          <a class="chip" href="#/map/${d.id}" aria-label="Back to map"><span aria-hidden="true">←</span> Map</a>
          <div class="where">
            <span class="ml" lang="ml">${esc(d.ml)}</span>
            <strong>${esc(d.name)}</strong>
            <span class="count">Stop ${i + 1} of ${DISTRICTS.length}</span>
          </div>
          <div class="top-actions">
            <button class="chip" data-passport>Passport · <span data-count>${Passport.count()}</span>/14</button>
            <button class="chip" data-hide aria-pressed="false" title="Hide the panels (H)">Just look</button>
          </div>
        </header>

        <aside class="place" id="place" aria-live="polite"></aside>

        <nav class="minimap" aria-label="Places in ${esc(d.name)}">
          ${mapSvg({ focus: d.id, cls: "mini", pins: [pins], labels: false })}
        </nav>

        <nav class="strip" aria-label="Places">
          ${prev ? `<a class="hop prev" href="#/d/${prev.id}"><small>Back north</small>${esc(prev.name)}</a>` : `<a class="hop prev" href="#/"><small>Back to</small>Start</a>`}
          <div class="spots" id="spots">
            ${d.spots
              .map((s, si) => {
                const im = imagesFor(d, s)[0];
                return `<a href="#/d/${d.id}/${s.id}" data-si="${si}" class="spot">
                  ${im ? `<img src="${esc(im.thumb)}" alt="" loading="lazy" />` : '<span class="noimg"></span>'}
                  <span>${esc(s.name)}</span></a>`;
              })
              .join("")}
          </div>
          ${next ? `<a class="hop next" href="#/d/${next.id}"><small>Continue south</small>${esc(next.name)} →</a>` : `<a class="hop next" href="#/map"><small>Journey's end</small>See the map</a>`}
        </nav>

        <p class="credit" id="credit"></p>

        <div class="board" id="board" hidden>
          <div class="board-card" role="dialog" aria-labelledby="board-title">
            <p class="board-kicker">${from?.view === "district" ? "Welcome to" : "You have arrived in"}</p>
            <p class="board-ml ml" lang="ml">${esc(d.ml)}</p>
            <h2 id="board-title">${esc(d.name)}</h2>
            <p class="board-tag">${esc(d.tagline)}</p>
            <p class="board-intro">${esc(d.intro)}</p>
            <ul class="board-spots">${d.spots.map((s) => `<li>${esc(s.name)}</li>`).join("")}</ul>
            <button class="btn primary" data-enter>Step in <span aria-hidden="true">→</span></button>
            <p class="board-hint">or press Enter</p>
          </div>
        </div>
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
      const hop = () => go(`#/d/${d.id}/${d.spots[+p.dataset.si].id}`);
      p.addEventListener("click", hop);
      p.addEventListener("keydown", (e) => e.key === "Enter" && hop());
    });

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
        <p class="eyebrow">${esc(d.tagline)}</p>
        <h1>${esc(s.name)}</h1>
        <button class="more" aria-expanded="false">About this place</button>
        <p class="blurb">${esc(s.blurb)}</p>
        <dl class="senses">
          <div><dt><span aria-hidden="true">◌</span> Hear</dt><dd>${esc(s.senses.hear)}</dd></div>
          <div><dt><span aria-hidden="true">◌</span> Taste</dt><dd>${esc(s.senses.taste)}</dd></div>
          <div><dt><span aria-hidden="true">◌</span> Feel</dt><dd>${esc(s.senses.feel)}</dd></div>
        </dl>
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
      place.querySelector(".prev").addEventListener("click", () => step(-1));
      place.querySelector(".next").addEventListener("click", () => step(1));
    }
    place.querySelector(".dots").innerHTML = imgs
      .map((_, k) => `<button role="tab" aria-selected="${k === n}" aria-label="View ${k + 1} of ${imgs.length}" data-n="${k}"></button>`)
      .join("");
    place.querySelectorAll(".dots button").forEach((b) =>
      b.addEventListener("click", () => go(`#/d/${d.id}/${s.id}/${b.dataset.n}`))
    );
    const nextSpot = n >= imgs.length - 1 ? d.spots[si + 1] : null;
    place.querySelector(".next-label").textContent = isLast
      ? nextD ? `Next: ${nextD.name}` : "End of the road"
      : nextSpot ? `Next: ${nextSpot.name}` : "";
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
      if (n < imgs.length - 1) return go(`#/d/${d.id}/${d.spots[si].id}/${n + 1}`);
      if (si < d.spots.length - 1) return go(`#/d/${d.id}/${d.spots[si + 1].id}`);
      const nd = DISTRICTS[indexOf(d) + 1];
      return go(nd ? `#/d/${nd.id}` : "#/map");
    }
    if (n > 0) return go(`#/d/${d.id}/${d.spots[si].id}/${n - 1}`);
    if (si > 0) {
      const ps = d.spots[si - 1];
      return go(`#/d/${d.id}/${ps.id}/${Math.max(0, imagesFor(d, ps).length - 1)}`);
    }
    const pd = DISTRICTS[indexOf(d) - 1];
    if (pd) {
      const ls = pd.spots[pd.spots.length - 1];
      go(`#/d/${pd.id}/${ls.id}/${Math.max(0, imagesFor(pd, ls).length - 1)}`);
    }
  }

  function toggleUi() {
    const view = app.querySelector(".scene-view");
    if (!view) return;
    const hidden = view.classList.toggle("ui-hidden");
    const b = view.querySelector("[data-hide]");
    b.setAttribute("aria-pressed", String(hidden));
    b.textContent = hidden ? "Show panels" : "Just look";
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
        ? `<a class="stamp got" href="#/d/${d.id}" style="--rot:${rot}deg" data-close>
             <span class="ml" lang="ml">${esc(d.ml)}</span><strong>${esc(d.name)}</strong><small>${esc(got)}</small></a>`
        : `<a class="stamp" href="#/d/${d.id}" data-close><strong>${esc(d.name)}</strong><small>not yet</small></a>`;
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
  });

  // ---------- keyboard ----------
  document.addEventListener("keydown", (e) => {
    if (dlg.open || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest?.("input, textarea")) return;
    if (current?.view !== "district") return;
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
    else if (k === "m" || e.key === "Escape") go(`#/map/${current.d.id}`);
    else if (k === "n") {
      const nd = DISTRICTS[indexOf(current.d) + 1];
      if (nd) go(`#/d/${nd.id}`);
    } else if (k === "p") {
      const pd = DISTRICTS[indexOf(current.d) - 1];
      if (pd) go(`#/d/${pd.id}`);
    }
  });

  window.addEventListener("hashchange", render);
  render();
})();
