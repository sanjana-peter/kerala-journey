/*
 * Kerala Journey — one hands-on experience per district, shown in the district's Plan sheet.
 *
 * window.KERALA_EXPERIENCES[districtId] = { title, teaser, mount(root) }
 *   mount() draws into `root` and wires its own controls. Everything moves only when the visitor
 *   taps or drags: no autoplay.
 *
 * To add one: write a mount function below (the `stepper` helper covers the common
 * "picture + caption, tap to go on" shape) and register it at the bottom.
 */
(() => {
  "use strict";

  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // A drawing beside a caption, stepped through with Back / Next or the dots.
  // onStep(i, stage) updates the drawing for step i.
  function stepper(root, { svg, steps, onStep, doneLabel = "Start again" }) {
    root.innerHTML = `
      <div class="xp">
        <div class="xp-stage">${svg}</div>
        <div class="xp-side">
          <p class="xp-count"></p>
          <h3 class="xp-title"></h3>
          <p class="xp-text" aria-live="polite"></p>
          <div class="xp-nav">
            <button class="round xp-back" aria-label="Back">‹</button>
            <button class="btn primary xp-next"></button>
          </div>
          <ol class="xp-dots">${steps.map((s, i) => `<li><button data-i="${i}" aria-label="${esc(s.title)}"></button></li>`).join("")}</ol>
        </div>
      </div>`;
    const stage = root.querySelector(".xp-stage svg");
    let i = 0;
    const set = (to) => {
      i = Math.max(0, Math.min(steps.length - 1, to));
      const s = steps[i];
      root.querySelector(".xp-count").textContent = s.kicker || `${i + 1} of ${steps.length}`;
      root.querySelector(".xp-title").textContent = s.title;
      root.querySelector(".xp-text").textContent = s.text;
      root.querySelector(".xp-back").disabled = i === 0;
      root.querySelector(".xp-next").innerHTML =
        i === steps.length - 1 ? esc(doneLabel) : `${esc(steps[i + 1].short || steps[i + 1].title)} <span aria-hidden="true">→</span>`;
      root.querySelectorAll(".xp-dots button").forEach((b) => b.setAttribute("aria-current", String(+b.dataset.i === i)));
      // Layers: data-min / data-max show from / until that step, data-only on that step alone, data-not hides on it.
      stage.querySelectorAll("[data-min],[data-max],[data-only],[data-not]").forEach((el) => {
        const d = el.dataset;
        const on = (d.min === undefined || i >= +d.min) && (d.max === undefined || i <= +d.max) && (d.only === undefined || i === +d.only) && (d.not === undefined || i !== +d.not);
        el.classList.toggle("xp-off", !on);
      });
      onStep?.(i, stage);
    };
    root.querySelector(".xp-back").addEventListener("click", () => set(i - 1));
    root.querySelector(".xp-next").addEventListener("click", () => set(i === steps.length - 1 ? 0 : i + 1));
    root.querySelectorAll(".xp-dots button").forEach((b) => b.addEventListener("click", () => set(+b.dataset.i)));
    set(0);
  }

  // ---------- Alappuzha: a day and a night on a houseboat ----------
  function houseboat(root) {
    const pts = [
      [70, 246], [98, 150], [190, 214], [240, 176], [290, 222], [305, 92], [70, 246],
    ];
    const paddy = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) paddy.push(`<rect x="${150 + c * 17}" y="${228 + r * 14}" width="15" height="12"/>`);
    const palms = [[40, 220], [55, 190], [130, 240], [150, 200], [210, 240], [260, 200], [230, 150], [320, 240], [270, 250], [180, 180]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6"/>`)
      .join("");
    const svg = `<svg viewBox="0 0 400 300" role="img" aria-label="A map of the backwaters around Alappuzha with a houseboat">
      <rect class="hb-sky" width="400" height="300"/>
      <rect x="0" y="0" width="26" height="300" fill="#3f86a8"/>
      <path d="M232 0 H400 V160 Q330 150 290 128 Q250 96 232 0Z" fill="#4f9fc4"/>
      <ellipse cx="98" cy="150" rx="38" ry="22" fill="#4f9fc4"/>
      <g fill="#a9cf7c" stroke="#7fae55" stroke-width="1">${paddy.join("")}</g>
      <path d="M70 246 L92 170 M120 158 Q160 186 190 214 L240 176 L290 222 M240 176 Q268 132 300 104" stroke="#4f9fc4" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <g fill="#2f6b2f">${palms}</g>
      <g class="hb-labels" font-size="10" font-weight="700" fill="#0d2b21">
        <text x="36" y="276">Alappuzha</text><text x="300" y="40" fill="#0b3550">Vembanad Lake</text><text x="4" y="14" fill="#0b3550" transform="rotate(90 4 14)">Arabian Sea</text>
      </g>
      <g class="hb-stops">${pts.slice(0, 6).map(([x, y], i) => `<circle data-i="${i}" cx="${x}" cy="${y}" r="5"/>`).join("")}</g>
      <g class="hb-boat"><g transform="scale(1.5)">
        <path d="M-16 0 Q0 7 16 0 L13 -3 H-13Z" fill="#6b3f1d"/>
        <path d="M-11 -3 Q0 -15 11 -3Z" fill="#d9b36c" stroke="#8a6a2c"/>
      </g></g>
      <rect class="hb-night" width="400" height="300" fill="#0b1830" pointer-events="none"/>
    </svg>`;
    const times = ["noon", "noon", "afternoon", "afternoon", "evening", "dusk", "morning"];
    stepper(root, {
      svg,
      doneLabel: "Sail again",
      steps: [
        { kicker: "12:00", title: "Board at the jetty", short: "Punnamada Lake", text: "You board around midday. Houseboats, kettuvallams, were once rice barges; now they're floating homes with a crew and a cook." },
        { kicker: "13:00", title: "Punnamada Lake", short: "Kuttanad", text: "Out onto the lake where the Nehru Trophy snake boat race is held every August. Lunch is served on deck: rice, fish curry, thoran." },
        { kicker: "14:30", title: "Kuttanad", short: "A toddy shop", text: "Rice grows here a metre or two below sea level, behind earthen dikes. From the deck you look down onto the fields." },
        { kicker: "15:30", title: "A toddy shop stop", short: "Village canals", text: "Moor at a canal-side shop for kappa, spicy fish and a glass of toddy, fresh palm wine." },
        { kicker: "16:30", title: "Village canals", short: "Anchor for the night", text: "The canals narrow. Kitchens, churches, schools and ferry stops all open onto the water, and children wave from the steps." },
        { kicker: "18:00", title: "Anchor on Vembanad", short: "Morning", text: "India's longest lake. Houseboats stop cruising at dusk and anchor for the night, lamps on, frogs and crickets all around." },
        { kicker: "08:00", title: "Morning on deck", text: "Appam and egg curry on deck as the mist lifts, then back to the jetty by about nine." },
      ],
      onStep(i, stage) {
        const [x, y] = pts[i];
        stage.querySelector(".hb-boat").style.transform = `translate(${x}px, ${y - 8}px)`;
        stage.dataset.time = times[i];
        stage.querySelectorAll(".hb-stops circle").forEach((c) => c.classList.toggle("on", +c.dataset.i <= i));
      },
    });
  }

  // ---------- Ernakulam: read a Kathakali face ----------
  function kathakali(root) {
    const types = [
      { id: "pacha", name: "Pacha", en: "green", ml: "പച്ച", text: "Noble heroes, gods and kings, like Krishna, Arjuna and Nala. Green stands for goodness and inner calm." },
      { id: "kathi", name: "Kathi", en: "knife", ml: "കത്തി", text: "Proud, ambitious anti-heroes such as Ravana and Duryodhana: noble green, cut by a red knife-shaped mark, with white knobs on the nose and forehead." },
      { id: "chuvanna", name: "Chuvanna thadi", en: "red beard", ml: "ചുവന്ന താടി", text: "The fiercest, most violent characters, like Dushasana. The red beard is meant to terrify." },
      { id: "vella", name: "Vella thadi", en: "white beard", ml: "വെള്ള താടി", text: "Superhuman and virtuous beings, most famously Hanuman." },
      { id: "kari", name: "Kari", en: "black", ml: "കരി", text: "Forest dwellers and demonesses, painted black with red and white markings." },
      { id: "minukku", name: "Minukku", en: "radiant", ml: "മിനുക്ക്", text: "Women, sages and Brahmins: a soft, glowing face, with no white frame and no crown." },
    ];
    root.innerHTML = `
      <div class="xp">
        <div class="xp-stage">
          <svg class="kk" viewBox="0 0 300 330" role="img" aria-label="A Kathakali face">
            <rect width="300" height="330" fill="#1a1411"/>
            <g class="kk-crown">
              <circle cx="150" cy="118" r="102" fill="#c9a14a"/>
              <circle cx="150" cy="118" r="92" fill="#a8321f"/>
              <circle cx="150" cy="118" r="84" fill="#c9a14a"/>
              <g fill="#a8321f">${Array.from({ length: 24 }, (_, k) => {
                const a = (k / 24) * Math.PI * 2;
                return `<circle cx="${(150 + Math.cos(a) * 88).toFixed(1)}" cy="${(118 + Math.sin(a) * 88).toFixed(1)}" r="3"/>`;
              }).join("")}</g>
            </g>
            <path class="kk-scarf" d="M84 150 Q84 60 150 58 Q216 60 216 150 L230 300 H70Z" fill="#23305c"/>
            <path class="kk-beard" d="M92 190 Q70 300 150 318 Q230 300 208 190 Q150 250 92 190Z"/>
            <ellipse class="kk-face" cx="150" cy="176" rx="58" ry="72"/>
            <path class="kk-lower" d="M93 185 Q100 244 150 248 Q200 244 207 185 Q150 212 93 185Z"/>
            <path class="kk-chutti" d="M92 150 Q86 236 150 262 Q214 236 208 150" fill="none" stroke="#f7f3ea" stroke-width="15" stroke-linecap="round"/>
            <g class="kk-knife" fill="#d62b1f">
              <path d="M110 200 Q96 168 116 140 Q112 170 130 190Z"/><path d="M190 200 Q204 168 184 140 Q188 170 170 190Z"/>
            </g>
            <g class="kk-kari" fill="none" stroke="#d62b1f" stroke-width="3"><path d="M110 196 q10 8 20 0 M170 196 q10 8 20 0"/><path d="M118 132 q32 -14 64 0" stroke="#f7f3ea"/></g>
            <g stroke="#111" stroke-width="3.5" fill="none" stroke-linecap="round">
              <path d="M104 142 Q124 126 146 140"/><path d="M196 142 Q176 126 154 140"/>
            </g>
            <g fill="#e4553a" stroke="#111" stroke-width="3">
              <path d="M106 160 Q126 146 146 160 Q126 170 106 160Z"/><path d="M154 160 Q174 146 194 160 Q174 170 154 160Z"/>
            </g>
            <g fill="#111"><circle cx="126" cy="159" r="4"/><circle cx="174" cy="159" r="4"/></g>
            <path class="kk-mark" d="M146 108 h8 l-2 24 h-4z" fill="#d62b1f"/>
            <path d="M130 218 Q150 230 170 218 Q150 224 130 218Z" fill="#c62828" stroke="#8e1b1b" stroke-width="2"/>
            <g class="kk-fangs" fill="#fff"><path d="M131 218 l3 9 l3 -8z"/><path d="M169 218 l-3 9 l-3 -8z"/></g>
            <g class="kk-knobs" fill="#fff"><circle cx="150" cy="196" r="6"/><circle cx="150" cy="118" r="6"/></g>
          </svg>
        </div>
        <div class="xp-side">
          <p class="xp-count">Tap a character type</p>
          <div class="kk-types" role="group" aria-label="Kathakali character types">
            ${types.map((t) => `<button data-t="${t.id}" aria-pressed="false">${esc(t.name)}</button>`).join("")}
          </div>
          <h3 class="xp-title"></h3>
          <p class="xp-ml ml" lang="ml"></p>
          <p class="xp-text" aria-live="polite"></p>
          <p class="xp-note">Make-up takes three hours or more. The white frame around the jaw, the chutti, was traditionally built up from rice paste and paper, and actors redden their eyes with a seed placed under the eyelid.</p>
        </div>
      </div>`;
    const svg = root.querySelector(".kk");
    const set = (id) => {
      const t = types.find((x) => x.id === id);
      svg.dataset.type = id;
      root.querySelector(".xp-title").textContent = `${t.name} · ${t.en}`;
      root.querySelector(".xp-ml").textContent = t.ml;
      root.querySelector(".xp-text").textContent = t.text;
      root.querySelectorAll(".kk-types button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.t === id)));
    };
    root.querySelectorAll(".kk-types button").forEach((b) => b.addEventListener("click", () => set(b.dataset.t)));
    set("pacha");
  }

  // ---------- Idukki: climb the ghat road to Munnar ----------
  function ghatRoad(root) {
    const pts = [[60, 380], [240, 338], [70, 294], [230, 250], [80, 206], [225, 160], [90, 116], [205, 76], [150, 34]];
    const stopAt = [0, 1, 2, 3, 4, 6, 8]; // which bend each stop sits on
    const road = "M" + pts.map((p) => p.join(" ")).join(" L");
    const tea = [];
    for (let r = 0; r < 6; r++) for (let c = 0; c < 14; c++) tea.push(`<circle cx="${14 + c * 21 + (r % 2) * 10}" cy="${24 + r * 18}" r="6"/>`);
    const svg = `<svg viewBox="0 0 300 400" role="img" aria-label="A winding ghat road climbing from Kochi to Munnar">
      <defs><linearGradient id="gh-sky" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7fae55"/><stop offset="0.55" stop-color="#4f8f5a"/><stop offset="1" stop-color="#8fb9a6"/></linearGradient></defs>
      <rect width="300" height="400" fill="url(#gh-sky)"/>
      <g fill="#2f6b3a" opacity="0.9" data-min="5">${tea.join("")}</g>
      <g data-min="3"><path d="M262 180 v70 M270 176 v76 M278 182 v66" stroke="#e8f4ff" stroke-width="3" stroke-linecap="round"/><rect x="254" y="168" width="34" height="12" rx="4" fill="#5b5b52"/></g>
      <path d="M40 310 Q150 300 260 314" stroke="#4f9fc4" stroke-width="7" fill="none" data-min="2"/>
      <path d="${road}" stroke="#4b4b46" stroke-width="12" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="${road}" stroke="#f1eee4" stroke-width="1.5" fill="none" stroke-dasharray="6 6"/>
      <g class="gh-stops">${stopAt.map((b, i) => `<circle data-i="${i}" cx="${pts[b][0]}" cy="${pts[b][1]}" r="5"/>`).join("")}</g>
      <g class="gh-mist" data-min="6"><ellipse cx="80" cy="60" rx="90" ry="18" fill="#fff" opacity="0.35"/><ellipse cx="230" cy="40" rx="80" ry="14" fill="#fff" opacity="0.3"/></g>
      <g class="gh-car"><rect x="-9" y="-6" width="18" height="10" rx="3" fill="#d62b1f"/><rect x="-5" y="-10" width="10" height="6" rx="2" fill="#f7c9b8"/></g>
    </svg>`;
    // Rough heights, used only to move the gauge and estimate how much cooler it feels (about 6.5 °C per 1,000 m).
    const heights = [0, 50, 100, 350, 600, 1200, 1600];
    stepper(root, {
      svg,
      doneLabel: "Drive it again",
      steps: [
        { kicker: "Sea level", title: "Kochi", short: "Kothamangalam", text: "Humid and warm, around 30 °C for much of the year. The High Ranges are about four hours east." },
        { kicker: "The plains end", title: "Kothamangalam", short: "Neriamangalam", text: "Rubber and pineapple farms line the road, and the hills rise ahead." },
        { kicker: "Crossing the Periyar", title: "Neriamangalam bridge", short: "The waterfalls", text: "An arched bridge from the 1930s over the Periyar, the gateway to the High Ranges. The climb starts in earnest." },
        { kicker: "Roadside falls", title: "Cheeyappara falls", short: "Adimali", text: "Waterfalls tumble right beside the road, loudest in the monsoon. Everyone stops for a photo." },
        { kicker: "Halfway up", title: "Adimali", short: "Tea country", text: "A busy hill town. Spice shops sell cardamom, pepper and cinnamon by weight." },
        { kicker: "Almost there", title: "Tea country", short: "Munnar", text: "The first tea estates: hills clipped into neat green rows, with pickers' paths between them." },
        { kicker: "About 1,600 m", title: "Munnar", text: "Cool, misty air, around ten degrees cooler than Kochi. Time for a hot cup of tea and a jacket." },
      ],
      onStep(i, stage) {
        const [x, y] = pts[stopAt[i]];
        stage.querySelector(".gh-car").style.transform = `translate(${x}px, ${y}px)`;
        stage.querySelectorAll(".gh-stops circle").forEach((c) => c.classList.toggle("on", +c.dataset.i <= i));
        const side = root.querySelector(".xp-side");
        let gauge = side.querySelector(".gh-gauge");
        if (!gauge) {
          gauge = document.createElement("div");
          gauge.className = "gh-gauge";
          gauge.innerHTML = `<div class="gh-bar"><span></span></div><p></p>`;
          side.insertBefore(gauge, side.querySelector(".xp-nav"));
        }
        gauge.querySelector("span").style.height = `${(heights[i] / 1600) * 100}%`;
        const cooler = Math.round((heights[i] * 6.5) / 1000);
        gauge.querySelector("p").textContent = cooler ? `Feels about ${cooler} °C cooler than Kochi` : "Hot and humid";
      },
    });
  }

  // ---------- Thrissur: the kudamattam, Pooram's umbrella exchange ----------
  function kudamattam(root) {
    const sets = [
      ["#d7263d", "#f5c518"], ["#1b98e0", "#ffffff"], ["#f46036", "#2e294e"], ["#2ec4b6", "#ff9f1c"], ["#8e44ad", "#f1c40f"],
      ["#e84393", "#00b894"], ["#ffd166", "#ef476f"], ["#06d6a0", "#118ab2"], ["#ffffff", "#c9a14a"], ["#ff6b35", "#004e89"],
    ];
    const elephant = (x, flip, side) => `
      <g transform="translate(${x} 226) scale(${flip ? -1.3 : 1.3} 1.3)">
        <ellipse cx="0" cy="-22" rx="21" ry="15" fill="#4a4744"/>
        <rect x="-16" y="-12" width="7" height="16" rx="2" fill="#4a4744"/><rect x="-4" y="-12" width="7" height="16" rx="2" fill="#4a4744"/>
        <rect x="6" y="-12" width="7" height="16" rx="2" fill="#4a4744"/>
        <circle cx="19" cy="-29" r="11" fill="#4a4744"/>
        <path d="M27 -26 Q34 -12 29 2" stroke="#4a4744" stroke-width="5" fill="none" stroke-linecap="round"/>
        <ellipse cx="13" cy="-27" rx="6" ry="9" fill="#3b3836"/>
        <path d="M13 -40 h14 l-5 22z" fill="#e2b340"/>
        <circle cx="-2" cy="-42" r="4" fill="#f1d3b3"/><rect x="-5" y="-39" width="7" height="6" fill="#fff"/>
        <line x1="-1" y1="-44" x2="-1" y2="-74" stroke="#6b4a2a" stroke-width="1.5"/>
        <g class="kd-umb" data-side="${side}">
          <path class="kd-main" d="M-21 -74 Q-1 -104 19 -74Z"/>
          <path class="kd-trim" d="M-21 -74 Q-1 -81 19 -74" fill="none" stroke-width="3"/>
          <circle class="kd-dot" cx="-1" cy="-92" r="3.5"/>
        </g>
      </g>`;
    root.innerHTML = `
      <div class="xp">
        <div class="xp-stage">
          <svg class="kd" viewBox="0 0 400 260" role="img" aria-label="Two rows of elephants facing each other, holding up parasols">
            <defs><linearGradient id="kd-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b2a58"/><stop offset="0.7" stop-color="#e2804a"/></linearGradient></defs>
            <rect width="400" height="260" fill="url(#kd-sky)"/>
            <path d="M160 96 h80 v-24 h-10 l-8 -16 h-44 l-8 16 h-10z M176 56 l24 -28 l24 28z" fill="#2b1a22" opacity="0.75"/>
            <rect x="0" y="226" width="400" height="34" fill="#2b1a22"/>
            ${[30, 66, 102, 138, 174].map((x) => elephant(x, false, "a")).join("")}
            ${[226, 262, 298, 334, 370].map((x) => elephant(x, true, "b")).join("")}
            <g fill="#1a1016">${Array.from({ length: 30 }, (_, k) => `<circle cx="${k * 14 + 4}" cy="${250 + (k % 3) * 3}" r="9"/>`).join("")}</g>
          </svg>
        </div>
        <div class="xp-side">
          <p class="xp-count" id="kd-round">Before the exchange</p>
          <h3 class="xp-title">Kudamattam</h3>
          <p class="xp-ml ml" lang="ml">കുടമാറ്റം</p>
          <p class="xp-text">In front of the Vadakkunnathan temple, the Thiruvambadi and Paramekkavu groups face each other with fifteen elephants each. They take turns raising sets of dazzling parasols, each trying to outdo the other. Every design is kept secret until it goes up.</p>
          <div class="xp-nav"><button class="btn primary" id="kd-raise"></button></div>
          <p class="xp-note" id="kd-crowd">Each group brings dozens of sets. Tap to raise the next one.</p>
        </div>
      </div>`;
    const svg = root.querySelector(".kd");
    const btn = root.querySelector("#kd-raise");
    const crowd = ["The crowd roars.", "Whistles from the crowd.", "Someone nearby insists this set wins.", "Phones go up all around you.", "A cheer rolls across the square."];
    let turn = 0;
    const paint = (side, [main, trim]) =>
      svg.querySelectorAll(`.kd-umb[data-side="${side}"]`).forEach((u) => {
        u.querySelector(".kd-main").setAttribute("fill", main);
        u.querySelector(".kd-trim").setAttribute("stroke", trim);
        u.querySelector(".kd-dot").setAttribute("fill", trim);
      });
    const label = () => {
      btn.innerHTML = `${turn % 2 ? "Paramekkavu replies" : "Thiruvambadi raises"} <span aria-hidden="true">→</span>`;
    };
    paint("a", sets[0]);
    paint("b", sets[1]);
    label();
    btn.addEventListener("click", () => {
      turn++;
      const side = turn % 2 ? "a" : "b";
      paint(side, sets[(turn + 1) % sets.length]);
      root.querySelector("#kd-round").textContent = `Set ${Math.ceil(turn / 2)} · ${side === "a" ? "Thiruvambadi" : "Paramekkavu"}`;
      root.querySelector("#kd-crowd").textContent =
        turn >= 12 ? "It goes on until dusk, and there's never an official winner: Thrissur argues about it all year." : crowd[turn % crowd.length];
      label();
    });
  }

  // A drawing with tappable spots beside a caption. spots: [{ x, y, title, text }] in the SVG's coordinates.
  function hotspots(root, { svg, spots, intro, label = "Tap a numbered spot" }) {
    root.innerHTML = `
      <div class="xp">
        <div class="xp-stage">${svg}</div>
        <div class="xp-side">
          <p class="xp-count">${esc(label)}</p>
          <h3 class="xp-title"></h3>
          <p class="xp-text" aria-live="polite"></p>
          <div class="hs-list" role="group">${spots.map((s, i) => `<button data-i="${i}" aria-pressed="false"><b>${i + 1}</b> ${esc(s.title)}</button>`).join("")}</div>
        </div>
      </div>`;
    const stage = root.querySelector(".xp-stage svg");
    stage.insertAdjacentHTML(
      "beforeend",
      spots.map((s, i) => `<g class="hs" data-i="${i}" role="button" tabindex="0" aria-label="${esc(s.title)}" transform="translate(${s.x} ${s.y})"><circle r="11"/><text dy="4">${i + 1}</text></g>`).join("")
    );
    const set = (i) => {
      const s = spots[i];
      root.querySelector(".xp-title").textContent = i < 0 ? intro.title : s.title;
      root.querySelector(".xp-text").textContent = i < 0 ? intro.text : s.text;
      root.querySelectorAll(".hs-list button").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.i === i)));
      stage.querySelectorAll(".hs").forEach((g) => g.classList.toggle("on", +g.dataset.i === i));
    };
    root.querySelectorAll(".hs-list button, .hs").forEach((el) => {
      el.addEventListener("click", () => set(+el.dataset.i));
      el.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), set(+el.dataset.i)));
    });
    set(-1);
  }

  // ---------- Kasaragod: explore Bekal Fort ----------
  function bekal(root) {
    const bastions = [[150, 70], [230, 58], [300, 92], [318, 170], [286, 238], [205, 258], [130, 232], [104, 150]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13"/>`)
      .join("");
    const svg = `<svg viewBox="0 0 400 300" role="img" aria-label="A plan of Bekal Fort on its headland">
      <rect width="400" height="300" fill="#3f86a8"/>
      <g fill="#ffffff" opacity="0.12">${Array.from({ length: 14 }, (_, k) => `<path d="M${k * 30} ${20 + (k % 3) * 90} q10 -5 20 0 t20 0" stroke="#fff" fill="none"/>`).join("")}</g>
      <path d="M400 30 C 330 40 300 20 250 30 C 160 40 90 70 80 150 C 75 230 150 280 250 285 C 320 288 360 270 400 280 Z" fill="#c9b27a"/>
      <path d="M400 60 C 360 70 350 110 360 150 C 370 200 390 230 400 240 Z" fill="#7fae55" opacity="0.8"/>
      <g fill="#a0522d" stroke="#6b3a1f" stroke-width="2">
        <path d="M150 70 L230 58 L300 92 L318 170 L286 238 L205 258 L130 232 L104 150 Z" fill="#b5653a"/>
        ${bastions}
      </g>
      <path d="M150 70 L230 58 L300 92 L318 170 L286 238 L205 258 L130 232 L104 150 Z" fill="#d9c08f" transform="translate(211 158) scale(0.8) translate(-211 -158)"/>
      <path d="M318 150 l18 6 l-8 8 l18 6" stroke="#6b3a1f" stroke-width="5" fill="none" stroke-linejoin="round"/>
      <rect x="196" y="140" width="22" height="22" fill="#8b4a25" stroke="#6b3a1f" stroke-width="2"/>
      <rect x="150" y="185" width="30" height="22" fill="#3f86a8" stroke="#6b3a1f" stroke-width="2"/>
      <path d="M200 256 v28" stroke="#3b2414" stroke-width="4" stroke-dasharray="4 3"/>
      <text x="20" y="150" fill="#dbeaf2" font-size="12" font-weight="700" transform="rotate(-90 20 150)">Arabian Sea</text>
      <text x="372" y="160" fill="#2f5a2f" font-size="10" font-weight="700" transform="rotate(90 372 160)">to the road</text>
    </svg>`;
    hotspots(root, {
      svg,
      intro: {
        title: "Kerala's largest fort",
        text: "Built around 1650 by Shivappa Nayaka of Keladi, Bekal covers about 40 acres of a headland, with the sea on three sides. Tap a spot to explore it.",
      },
      spots: [
        { x: 344, y: 150, title: "The zig-zag entrance", text: "The way in turns back and forth, so no one could charge straight at the gate." },
        { x: 207, y: 128, title: "The observation tower", text: "The tower at the centre watched the sea for ships. Climb it today for the best view of the coast." },
        { x: 104, y: 124, title: "The sea bastions", text: "Round bastions jut out from the walls so defenders could cover every angle of the sea." },
        { x: 286, y: 262, title: "Gun holes at three levels", text: "The walls are pierced at three heights, said to be aimed at far, nearer and nearest targets." },
        { x: 165, y: 214, title: "The water tank", text: "A large tank with a flight of steps kept the garrison supplied through a siege." },
        { x: 200, y: 292, title: "The tunnel", text: "An underground passage opens towards the south, part of the fort's defences." },
      ],
    });
  }

  // ---------- Kannur: weave on a handloom ----------
  function loom(root) {
    const N = 24;
    const presets = {
      kasavu: { name: "Cream and gold", warp: (c) => (c < 3 || c > N - 4 ? "#c9a14a" : "#f3ead5"), weft: ["#f3ead5", "#c9a14a"] },
      checks: { name: "Checked lungi", warp: (c) => (Math.floor(c / 4) % 2 ? "#1d5a43" : "#2f7b8a"), weft: ["#1d5a43", "#2f7b8a", "#f3ead5"] },
      stripes: { name: "Furnishing stripes", warp: (c) => ["#a8452a", "#e8c04a", "#a8452a", "#f3ead5"][c % 4], weft: ["#a8452a", "#f3ead5", "#3c679f"] },
    };
    root.innerHTML = `
      <div class="xp">
        <div class="xp-stage">
          <svg class="loom" viewBox="0 0 ${N * 10} ${N * 10 + 20}" role="img" aria-label="Cloth being woven on a loom">
            <rect width="${N * 10}" height="${N * 10 + 20}" fill="#2b1d14"/>
            <g class="lm-warp"></g><g class="lm-cloth"></g>
            <rect class="lm-beater" x="0" y="0" width="${N * 10}" height="6" fill="#8a5a2b"/>
          </svg>
        </div>
        <div class="xp-side">
          <p class="xp-count" id="lm-count">0 rows woven</p>
          <h3 class="xp-title">Weave on a Kannur loom</h3>
          <p class="xp-text">The lengthwise warp threads are set up first. Each throw of the shuttle carries one crosswise weft thread over one warp and under the next: plain weave. Pick a pattern and a weft colour, then weave.</p>
          <p class="xp-label">Warp</p>
          <div class="kk-types lm-presets">${Object.entries(presets).map(([id, p]) => `<button data-p="${id}" aria-pressed="false">${esc(p.name)}</button>`).join("")}</div>
          <p class="xp-label">Weft colour</p>
          <div class="lm-wefts" role="radiogroup" aria-label="Weft colour"></div>
          <div class="xp-nav">
            <button class="btn primary" id="lm-throw">Throw the shuttle</button>
            <button class="btn outline" id="lm-five">Weave 5 rows</button>
            <button class="link-btn" id="lm-new">Cut and start again</button>
          </div>
          <p class="xp-note">Kannur's handloom tradition grew in the 1800s, when a weaving works was set up by the Basel Mission. Today its cooperatives weave furnishing fabrics sold around the world.</p>
        </div>
      </div>`;
    const svg = root.querySelector(".loom");
    let preset = "kasavu", weft = presets.kasavu.weft[0], rows = [];
    const draw = () => {
      const p = presets[preset];
      svg.querySelector(".lm-warp").innerHTML = Array.from({ length: N }, (_, c) => `<rect x="${c * 10 + 3}" y="0" width="4" height="${N * 10 + 20}" fill="${p.warp(c)}" opacity="0.9"/>`).join("");
      // Plain weave: in each row the weft shows on alternate threads, and the pattern shifts by one every row.
      svg.querySelector(".lm-cloth").innerHTML = rows
        .map((col, r) => {
          const y = N * 10 + 10 - (rows.length - r) * 10;
          return Array.from({ length: N }, (_, c) => `<rect x="${c * 10}" y="${y}" width="10" height="10" fill="${(r + c) % 2 ? col : p.warp(c)}"/>`).join("");
        })
        .join("");
      svg.querySelector(".lm-beater").setAttribute("y", N * 10 + 10 - rows.length * 10 - 6);
      root.querySelector("#lm-count").textContent = rows.length >= N ? "The cloth is full: cut it and start again" : `${rows.length} row${rows.length === 1 ? "" : "s"} woven`;
      root.querySelector(".lm-wefts").innerHTML = p.weft
        .map((c) => `<button role="radio" aria-checked="${c === weft}" aria-label="Weft colour ${c}" style="--sw:${c}" data-c="${c}"></button>`)
        .join("");
      root.querySelectorAll(".lm-presets button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.p === preset)));
      root.querySelector("#lm-throw").disabled = root.querySelector("#lm-five").disabled = rows.length >= N;
    };
    root.addEventListener("click", (e) => {
      const pb = e.target.closest("[data-p]");
      if (pb) {
        preset = pb.dataset.p;
        weft = presets[preset].weft[0];
        rows = [];
      }
      const cb = e.target.closest("[data-c]");
      if (cb) weft = cb.dataset.c;
      if (e.target.closest("#lm-throw")) rows.push(weft);
      if (e.target.closest("#lm-five")) for (let i = 0; i < 5 && rows.length < N; i++) rows.push(weft);
      if (e.target.closest("#lm-new")) rows = [];
      if (pb || cb || e.target.closest("#lm-throw, #lm-five, #lm-new")) draw();
    });
    draw();
  }

  // ---------- Wayanad: light up the Edakkal carvings ----------
  function edakkal(root) {
    const glyphs = [
      { x: 70, y: 70, text: "A human figure wearing a tall headdress, perhaps a chief or a dancer.", d: "M0 -18 l-8 -10 m8 10 l8 -10 M0 -18 v28 m-12 -18 h24 M0 10 l-9 16 m9 -16 l9 16 M-6 -30 l6 -8 l6 8" },
      { x: 170, y: 60, text: "An animal with long legs, often read as a deer.", d: "M-20 0 h34 M-18 0 l-4 16 m10 -16 v16 m16 -16 l2 16 m8 -16 l4 16 M14 0 l8 -12 m0 0 l4 -8 m-4 8 l6 -4" },
      { x: 275, y: 85, text: "A large animal with a trunk: an elephant.", d: "M-22 -6 q22 -22 40 0 v18 m-10 -18 v18 m-20 -18 v18 m-10 -18 v18 M18 -6 q10 4 6 22" },
      { x: 95, y: 175, text: "A wheel-like circle with spokes. No one knows for sure what it meant.", d: "M0 0 m-16 0 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0 M-16 0 h32 M0 -16 v32 M-11 -11 l22 22 M11 -11 l-22 22" },
      { x: 200, y: 160, text: "A pair of human figures, perhaps dancing, with raised arms.", d: "M-14 -14 v24 m-8 -20 l8 6 l8 -6 m-8 20 l-6 12 m6 -12 l6 12 M14 -14 v24 m-8 -20 l8 6 l8 -6 m-8 20 l-6 12 m6 -12 l6 12" },
      { x: 300, y: 185, text: "A pot or jar, maybe for water, food or offerings.", d: "M-10 -14 h20 M-8 -14 q-12 14 0 30 h16 q12 -16 0 -30" },
      { x: 150, y: 250, text: "A grid of lines, perhaps a pattern, a tally or a map.", d: "M-20 -12 h40 M-20 0 h40 M-20 12 h40 M-12 -18 v36 M0 -18 v36 M12 -18 v36" },
      { x: 270, y: 255, text: "Letters in the Brahmi script, added many centuries after the oldest carvings.", d: "M-26 0 h8 m-4 -8 v16 M-10 -8 q8 8 0 16 M6 -8 v16 h8 M22 -8 l6 8 l-6 8" },
    ];
    root.innerHTML = `
      <div class="xp">
        <div class="xp-stage">
          <svg class="ed" viewBox="0 0 360 300" role="img" aria-label="The dark rock wall of Edakkal cave">
            <defs>
              <radialGradient id="ed-torch"><stop offset="0" stop-color="#fff"/><stop offset="0.6" stop-color="#fff" stop-opacity="0.6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
              <mask id="ed-mask"><rect width="360" height="300" fill="#000"/><circle class="ed-light" cx="-100" cy="-100" r="60" fill="url(#ed-torch)"/><g class="ed-found"></g></mask>
            </defs>
            <rect width="360" height="300" fill="#0c0a09"/>
            <g mask="url(#ed-mask)">
              <rect width="360" height="300" fill="#8a7a66"/>
              ${Array.from({ length: 40 }, (_, k) => `<circle cx="${(k * 97) % 360}" cy="${(k * 53) % 300}" r="${4 + (k % 5) * 3}" fill="#6f614f" opacity="0.5"/>`).join("")}
              <g fill="none" stroke="#f1e6d2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                ${glyphs.map((g, i) => `<path data-i="${i}" transform="translate(${g.x} ${g.y})" d="${g.d}"/>`).join("")}
              </g>
            </g>
          </svg>
        </div>
        <div class="xp-side">
          <p class="xp-count" id="ed-count">0 of ${glyphs.length} carvings found</p>
          <h3 class="xp-title">Edakkal: carvings in the dark</h3>
          <p class="xp-text" id="ed-text" aria-live="polite">Move the torch over the rock (drag on a touch screen) to find the carvings. Some are thought to be at least 6,000 years old.</p>
          <div class="xp-nav"><button class="btn outline" id="ed-all">Light up everything</button></div>
          <p class="xp-note">Edakkal isn't really a cave but a cleft between huge boulders, high on Ambukuthi hill. The carvings were brought to wider attention in the 1890s by Fred Fawcett, a British police officer in Malabar.</p>
        </div>
      </div>`;
    const svg = root.querySelector(".ed");
    const light = svg.querySelector(".ed-light");
    const found = new Set();
    const pt = (e) => {
      const r = svg.getBoundingClientRect();
      return [((e.clientX - r.left) / r.width) * 360, ((e.clientY - r.top) / r.height) * 300];
    };
    const reveal = (i) => {
      if (found.has(i)) return;
      found.add(i);
      const g = glyphs[i];
      svg.querySelector(".ed-found").insertAdjacentHTML("beforeend", `<circle cx="${g.x}" cy="${g.y}" r="34" fill="url(#ed-torch)"/>`);
      root.querySelector("#ed-count").textContent =
        found.size === glyphs.length ? "All carvings found" : `${found.size} of ${glyphs.length} carvings found`;
      root.querySelector("#ed-text").textContent = g.text;
    };
    const move = (e) => {
      const [x, y] = pt(e);
      light.setAttribute("cx", x);
      light.setAttribute("cy", y);
      glyphs.forEach((g, i) => Math.hypot(g.x - x, g.y - y) < 32 && reveal(i));
    };
    svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerdown", (e) => {
      svg.setPointerCapture(e.pointerId);
      move(e);
    });
    svg.style.touchAction = "none";
    root.querySelector("#ed-all").addEventListener("click", () => glyphs.forEach((_, i) => reveal(i)));
  }

  // ---------- Kozhikode: follow the pepper ----------
  function spiceRoutes(root) {
    const places = { calicut: [250, 200], arabia: [120, 110], china: [380, 70], lisbon: [20, 40], cape: [60, 280] };
    const routes = [
      { id: "arab", label: "Arab traders", era: "For centuries before 1500", path: "M250 200 Q190 170 120 110", text: "Arab ships carried pepper, ginger and cardamom west to the Red Sea. From there it went overland to Egypt and on to Venice, which grew rich selling it to Europe." },
      { id: "china", label: "Chinese fleets", era: "Early 1400s", path: "M250 200 Q330 170 380 70", text: "Admiral Zheng He's great treasure fleets called at Calicut several times, trading silk and porcelain for pepper." },
      { id: "gama", label: "Vasco da Gama", era: "1498", path: "M20 40 Q10 180 60 280 Q160 290 250 200", text: "Sailing around Africa, the Portuguese navigator reached Kappad, just north of Calicut. Europe now had its own sea route to the spices, and the region's history changed course." },
    ];
    root.innerHTML = `
      <div class="xp">
        <div class="xp-stage">
          <svg class="sp" viewBox="0 0 400 300" role="img" aria-label="Sea routes from Calicut">
            <rect width="400" height="300" fill="#1f4f6b"/>
            <g stroke="#ffffff" stroke-opacity="0.06">${Array.from({ length: 10 }, (_, k) => `<line x1="0" y1="${k * 30}" x2="400" y2="${k * 30}"/><line x1="${k * 40}" y1="0" x2="${k * 40}" y2="300"/>`).join("")}</g>
            ${routes.map((r) => `<path class="sp-route" data-r="${r.id}" d="${r.path}" fill="none" stroke="#e8c04a" stroke-width="3" stroke-dasharray="600" stroke-dashoffset="600"/>`).join("")}
            ${Object.entries({ calicut: "Calicut", arabia: "Red Sea", china: "China", lisbon: "Lisbon", cape: "Cape of Good Hope" })
              .map(([k, name]) => {
                const [x, y] = places[k];
                return `<g transform="translate(${x} ${y})"><circle r="${k === "calicut" ? 7 : 5}" fill="${k === "calicut" ? "#d62b1f" : "#f3ead5"}"/><text x="${x > 300 ? -8 : 9}" y="4" text-anchor="${x > 300 ? "end" : "start"}" font-size="11" font-weight="700" fill="#f3ead5">${name}</text></g>`;
              })
              .join("")}
          </svg>
        </div>
        <div class="xp-side">
          <p class="xp-count" id="sp-era">The city of spices</p>
          <h3 class="xp-title" id="sp-title">Black gold</h3>
          <p class="xp-text" id="sp-text" aria-live="polite">Pepper from the Malabar coast was so valuable it was called black gold, and Calicut, today's Kozhikode, was its greatest market. Its rulers, the Zamorins, grew rich on the trade. Follow the routes.</p>
          <div class="kk-types sp-btns">${routes.map((r) => `<button data-r="${r.id}" aria-pressed="false">${esc(r.label)}</button>`).join("")}</div>
        </div>
      </div>`;
    root.querySelectorAll(".sp-btns button").forEach((b) =>
      b.addEventListener("click", () => {
        const r = routes.find((x) => x.id === b.dataset.r);
        root.querySelectorAll(".sp-btns button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        root.querySelectorAll(".sp-route").forEach((p) => p.classList.toggle("on", p.dataset.r === r.id));
        root.querySelector("#sp-era").textContent = r.era;
        root.querySelector("#sp-title").textContent = r.label;
        root.querySelector("#sp-text").textContent = r.text;
      })
    );
  }

  // ---------- Malappuram: the rings of a Nilambur teak ----------
  function teakRings(root) {
    const MAX = 175;
    // One ring a year, wide in a good monsoon, narrow in a dry year (a fixed pseudo-random pattern).
    const widths = Array.from({ length: MAX }, (_, i) => 0.55 + ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1 * 0.6);
    const notes = [
      [0, "Planted", "In the 1840s, teak saplings were planted at Nilambur for the British, who wanted timber for ships and buildings. Conolly's Plot is the oldest teak plantation in the world."],
      [8, "Racing upwards", "Young teak grows fast in the warm, wet climate, putting on thick rings in good monsoon years."],
      [30, "Heartwood", "The dark heartwood at the centre is what makes teak precious: it is full of natural oils that keep out water and termites."],
      [60, "Timber age", "Plantation teak is usually felled somewhere between 50 and 80 years. These trees were left standing."],
      [100, "A century", "Wide rings for wet years, narrow for dry ones: a tree's rings are a record of the monsoons it lived through."],
      [170, "Today", "The oldest trees in Conolly's Plot are now more than 170 years old, and among the tallest teak anywhere."],
    ];
    root.innerHTML = `
      <div class="xp">
        <div class="xp-stage"><svg class="teak" viewBox="-110 -110 220 220" role="img" aria-label="A cross-section of a teak trunk"><g class="tk-rings"></g></svg></div>
        <div class="xp-side">
          <p class="xp-count" id="tk-age">Age: 0 years</p>
          <h3 class="xp-title" id="tk-title"></h3>
          <p class="xp-text" id="tk-text" aria-live="polite"></p>
          <input type="range" class="hour tl-range" id="tk-range" min="0" max="${MAX}" value="0" aria-label="Age of the tree in years" />
          <p class="xp-note">Drag to grow the tree, one ring for every year.</p>
        </div>
      </div>`;
    const g = root.querySelector(".tk-rings");
    const set = (age) => {
      const total = widths.slice(0, age).reduce((a, b) => a + b, 0) || 1;
      const scale = (95 * Math.min(1, 0.25 + age / 60)) / total;
      let r = 0;
      const rings = [];
      for (let i = 0; i < age; i++) {
        r += widths[i] * scale;
        rings.push(r);
      }
      const heart = age > 25 ? rings[Math.floor(age * 0.75)] || r : 0;
      g.innerHTML = `
        <circle r="${r + 7}" fill="#6b4a2a"/>
        <circle r="${r + 1}" fill="#e3c08a"/>
        ${heart ? `<circle r="${heart}" fill="#a9743f"/>` : ""}
        ${rings.map((x) => `<circle r="${x}" fill="none" stroke="#7a5230" stroke-opacity="0.55" stroke-width="0.6"/>`).join("")}
        <circle r="2" fill="#4a2f1a"/>`;
      const note = [...notes].reverse().find(([a]) => age >= a);
      root.querySelector("#tk-age").textContent = `Age: ${age} years`;
      root.querySelector("#tk-title").textContent = note[1];
      root.querySelector("#tk-text").textContent = note[2];
    };
    root.querySelector("#tk-range").addEventListener("input", (e) => set(+e.target.value));
    set(0);
  }

  // ---------- Palakkad: blow a cloud through the gap ----------
  function palakkadGap(root) {
    const GAP = [138, 172]; // the gap's top and bottom on the drawing
    root.innerHTML = `
      <div class="xp">
        <div class="xp-stage">
          <svg class="gap" viewBox="0 0 360 300" role="img" aria-label="The Western Ghats with the Palakkad Gap">
            <rect width="360" height="300" fill="#d9c79a"/>
            <rect width="90" height="300" fill="#3f86a8"/>
            <path d="M90 0 H170 V300 H90 Z" fill="#7fae55"/>
            <path d="M170 0 L200 0 L215 ${GAP[0]} L175 ${GAP[0]} Z M175 ${GAP[1]} L215 ${GAP[1]} L200 300 L170 300 Z" fill="#4a5a3a"/>
            <path d="M178 0 L196 0 M180 40 l12 0 M182 90 l14 0 M181 220 l14 0 M178 270 l14 0" stroke="#6f7f5a" stroke-width="3"/>
            <text x="12" y="20" font-size="11" font-weight="700" fill="#e6f1f6">Arabian Sea</text>
            <text x="100" y="290" font-size="11" font-weight="700" fill="#244a24">Kerala</text>
            <text x="240" y="290" font-size="11" font-weight="700" fill="#6b5a32">Tamil Nadu</text>
            <text x="222" y="${(GAP[0] + GAP[1]) / 2 + 4}" font-size="10" font-weight="700" fill="#6b5a32">the gap</text>
            <g class="gap-rain" opacity="0"><path d="M150 0 v8 M160 6 v8 M142 10 v8 M168 14 v8 M154 18 v8" stroke="#3c679f" stroke-width="2" stroke-linecap="round"/></g>
            <g class="gap-cloud"><ellipse rx="22" ry="12" fill="#fff"/><ellipse cx="-14" cy="4" rx="14" ry="9" fill="#fff"/><ellipse cx="14" cy="4" rx="15" ry="9" fill="#fff"/></g>
          </svg>
        </div>
        <div class="xp-side">
          <p class="xp-count">The monsoon arrives from the south-west</p>
          <h3 class="xp-title" id="gap-title">Find the gap</h3>
          <p class="xp-text" id="gap-text" aria-live="polite">The Western Ghats run like a wall along Kerala's eastern edge. Choose where the monsoon cloud goes, then blow it east.</p>
          <label class="xp-label" for="gap-y">Cloud position, north to south</label>
          <input type="range" class="hour tl-range" id="gap-y" min="20" max="280" value="60" />
          <div class="xp-nav"><button class="btn primary" id="gap-go">Blow east <span aria-hidden="true">→</span></button><button class="link-btn" id="gap-reset">Start again</button></div>
        </div>
      </div>`;
    const cloud = root.querySelector(".gap-cloud");
    const rain = root.querySelector(".gap-rain");
    const yIn = root.querySelector("#gap-y");
    let x = 40;
    const place = () => {
      cloud.style.transform = `translate(${x}px, ${yIn.value}px)`;
      rain.style.transform = `translate(0px, ${+yIn.value + 6}px)`;
    };
    yIn.addEventListener("input", () => {
      x = 40;
      rain.setAttribute("opacity", "0");
      place();
    });
    root.querySelector("#gap-go").addEventListener("click", () => {
      const y = +yIn.value;
      const through = y > GAP[0] + 4 && y < GAP[1] - 4;
      x = through ? 300 : 150;
      rain.setAttribute("opacity", through ? "0" : "1");
      place();
      root.querySelector("#gap-title").textContent = through ? "Through the Palakkad Gap" : "Stopped by the Ghats";
      root.querySelector("#gap-text").textContent = through
        ? "You found it: the only big break in the Western Ghats, around 30 to 40 km wide. Winds pour through, which is why Palakkad is breezier and drier than the rest of Kerala, and why the road and railway to Coimbatore come this way."
        : "The mountains force the moist air upwards, and it falls as rain on Kerala's side. That's why Kerala is so green, and the land beyond the Ghats so much drier. Try somewhere else.";
    });
    root.querySelector("#gap-reset").addEventListener("click", () => {
      x = 40;
      rain.setAttribute("opacity", "0");
      place();
    });
    place();
  }

  // ---------- Kottayam: tap a rubber tree ----------
  function rubber(root) {
    const svg = `<svg viewBox="0 0 300 300" role="img" aria-label="A rubber tree being tapped">
      <rect width="300" height="300" fill="#dfe8d2"/>
      <rect class="rb-dark" width="300" height="300" fill="#1b2a3a" data-max="0" opacity="0.75"/>
      <rect x="60" y="0" width="70" height="300" fill="#8a7b66"/>
      <path d="M60 60 q35 10 70 -6" stroke="#6f6252" stroke-width="2" fill="none"/>
      <path d="M62 150 L128 120" stroke="#5a3d25" stroke-width="3" data-min="1"/>
      <path d="M128 120 L128 170" stroke="#5a3d25" stroke-width="2" data-min="1"/>
      <path d="M64 151 L126 122 M127 124 L127 168" stroke="#fffdf4" stroke-width="2.5" data-min="2"/>
      <path d="M110 172 q17 26 34 0 z" fill="#6b4a2a" data-min="2"/>
      <ellipse cx="127" cy="174" rx="15" ry="3.5" fill="#fffdf4" data-min="2"/>
      <path d="M130 168 v6" stroke="#6f6252" stroke-width="2" data-min="2"/>
      <g data-min="3"><rect x="170" y="190" width="100" height="40" fill="#c0c0b8"/><rect x="176" y="196" width="88" height="28" fill="#fffdf4"/></g>
      <g data-min="4"><circle cx="190" cy="120" r="16" fill="#8c8c84"/><circle cx="190" cy="152" r="16" fill="#8c8c84"/><rect x="206" y="128" width="60" height="16" fill="#e8dcc0"/></g>
      <g data-min="5"><rect x="175" y="40" width="10" height="60" fill="#e0c89a"/><rect x="190" y="40" width="10" height="60" fill="#c9a86a"/><rect x="205" y="40" width="10" height="60" fill="#a8844a"/><path d="M230 70 q10 -20 0 -40 M245 70 q10 -20 0 -40" stroke="#9a9a92" stroke-width="3" fill="none"/></g>
    </svg>`;
    stepper(root, {
      svg,
      doneLabel: "Tap again tomorrow",
      steps: [
        { kicker: "4 a.m.", title: "Before dawn", short: "The cut", text: "Tappers start in the dark with a head torch: latex flows best in the cool of the early morning." },
        { kicker: "The cut", title: "A thin slice of bark", short: "The drip", text: "A curved knife shaves a sliver of bark along a sloping groove, usually halfway round the trunk. Cut too deep and you harm the tree." },
        { kicker: "The drip", title: "Milky latex", short: "Setting", text: "White latex seeps down the groove into a cup, often a coconut shell, for a few hours." },
        { kicker: "Setting", title: "Into the trays", short: "Rolling", text: "The latex is mixed with a little acid in shallow trays and left to set into soft white slabs." },
        { kicker: "Rolling", title: "Through the rollers", short: "Smoking", text: "The slabs are squeezed through hand-turned rollers into thin sheets; the last roller presses in a pattern." },
        { kicker: "Smoking", title: "Smoke and sell", text: "The sheets are dried in the sun or in a smokehouse until they turn amber, then sold. Kerala grows most of India's natural rubber, much of it here in Kottayam." },
      ],
    });
  }

  // ---------- Pathanamthitta: the Aranmula mirror ----------
  function aranmula(root) {
    root.innerHTML = `
      <div class="xp">
        <div class="xp-stage">
          <svg class="am" viewBox="0 0 300 300" role="img" aria-label="A reflection in a mirror">
            <rect width="300" height="300" fill="#2a1f1a"/>
            <ellipse cx="150" cy="150" rx="105" ry="120" fill="#c9a14a"/>
            <ellipse class="am-face" cx="150" cy="150" rx="92" ry="107"/>
            <g class="am-ghost" opacity="0.35" transform="translate(7 5)"><rect x="143" y="150" width="14" height="60" fill="#e3c08a"/><ellipse cx="150" cy="138" rx="8" ry="16" fill="#ffb347"/></g>
            <g><rect x="143" y="150" width="14" height="60" fill="#e3c08a"/><ellipse cx="150" cy="138" rx="8" ry="16" fill="#ffb347"/><ellipse cx="150" cy="142" rx="4" ry="8" fill="#fff1c1"/></g>
            <rect x="140" y="268" width="20" height="30" fill="#a8844a"/>
          </svg>
        </div>
        <div class="xp-side">
          <p class="xp-count">Look closely at the flame</p>
          <div class="kk-types" role="group" aria-label="Kind of mirror">
            <button data-m="glass" aria-pressed="true">Ordinary glass mirror</button>
            <button data-m="metal" aria-pressed="false">Aranmula kannadi</button>
          </div>
          <h3 class="xp-title" id="am-title"></h3>
          <p class="xp-text" id="am-text" aria-live="polite"></p>
          <p class="xp-note">Made in the village of Aranmula by a few families, the mirror is cast from an alloy of copper and tin whose exact recipe is a family secret, then polished by hand for days. It has a Geographical Indication tag, and is a traditional gift for weddings and new homes.</p>
        </div>
      </div>`;
    const svg = root.querySelector(".am");
    const set = (m) => {
      svg.dataset.m = m;
      root.querySelectorAll("[data-m]").forEach((b) => b.tagName === "BUTTON" && b.setAttribute("aria-pressed", String(b.dataset.m === m)));
      root.querySelector("#am-title").textContent = m === "glass" ? "A faint double image" : "One perfect image";
      root.querySelector("#am-text").textContent =
        m === "glass"
          ? "In a glass mirror the silver is behind the glass. The front of the glass reflects a little too, so a bright flame shows a faint second image."
          : "The Aranmula kannadi reflects from its polished metal surface itself, with no glass in front, so there is only one sharp image and no distortion.";
    };
    root.querySelectorAll("button[data-m]").forEach((b) => b.addEventListener("click", () => set(b.dataset.m)));
    set("glass");
  }

  // ---------- Kollam: from cashew apple to kernel ----------
  function cashewSteps(root) {
    const svg = `<svg viewBox="0 0 300 300" role="img" aria-label="A cashew nut on its way from the tree to the tin">
      <rect width="300" height="300" fill="#f3ead5"/>
      <g data-max="1"><path d="M110 60 q40 -20 80 0 q10 60 -40 90 q-50 -30 -40 -90z" fill="#e2552c"/><path d="M150 150 q-30 10 -25 40 q10 25 35 10 q10 -25 -10 -50z" fill="#8a6a3a" data-only="0"/></g>
      <g data-min="1" data-max="1"><path d="M150 150 q-30 10 -25 40 q10 25 35 10 q10 -25 -10 -50z" fill="#8a6a3a"/><circle cx="240" cy="60" r="22" fill="#f5c518"/></g>
      <g data-only="2"><rect x="80" y="110" width="140" height="90" rx="20" fill="#5b5b52"/><path d="M110 230 q8 -16 0 -30 M150 230 q8 -16 0 -30 M190 230 q8 -16 0 -30" stroke="#e2552c" stroke-width="5" fill="none"/></g>
      <g data-only="3"><path d="M110 150 q-26 8 -22 36 q9 22 31 8" fill="#6b5132"/><path d="M190 150 q26 8 22 36 q-9 22 -31 8" fill="#6b5132"/><path d="M150 140 q-24 10 -18 40 q10 20 28 8 q8 -24 -10 -48z" fill="#c9a06a"/></g>
      <g data-only="4"><path d="M150 140 q-24 10 -18 40 q10 20 28 8 q8 -24 -10 -48z" fill="#f4e7c9" stroke="#d9c49a" stroke-width="2"/><path d="M200 120 q10 6 4 16 M210 150 q10 4 2 12" stroke="#a0784a" stroke-width="3" fill="none"/></g>
      <g data-min="5">
        ${[[70, "W180", 1.25], [150, "W240", 1], [225, "W320", 0.8]]
          .map(([x, l, s]) => `<g transform="translate(${x} 150) scale(${s})"><path d="M0 -20 q-24 10 -18 40 q10 20 28 8 q8 -24 -10 -48z" fill="#f4e7c9" stroke="#d9c49a" stroke-width="2"/></g><text x="${x}" y="215" text-anchor="middle" font-size="14" font-weight="800" fill="#6b4a2a">${l}</text>`)
          .join("")}
      </g>
    </svg>`;
    stepper(root, {
      svg,
      doneLabel: "Start again",
      steps: [
        { kicker: "On the tree", title: "The apple and the nut", short: "Drying", text: "What looks like the fruit is the cashew apple. The real fruit is the kidney-shaped nut hanging beneath, one per apple." },
        { kicker: "In the sun", title: "Sun-drying", short: "Roasting", text: "The nuts are collected and dried in the sun so they keep until the factories need them." },
        { kicker: "Heat", title: "Roasting or steaming", short: "Shelling", text: "The shell holds a caustic oil, so the nuts are roasted or steamed to make them safe to crack." },
        { kicker: "By hand", title: "Shelling", short: "Peeling", text: "Workers, most of them women, crack each shell open with a small tool, easing the kernel out whole." },
        { kicker: "The last layer", title: "Peeling", short: "Grading", text: "Once dried again, the thin brown skin is peeled away to reveal the pale kernel." },
        { kicker: "Sorting", title: "Grading", text: "Whole kernels are graded by size: W180 means about 180 nuts to a pound, the biggest and most prized. Broken pieces are sold separately." },
      ],
    });
  }

  // ---------- Thiruvananthapuram: cook an Attukal Pongala ----------
  function pongala(root) {
    const svg = `<svg viewBox="0 0 300 300" role="img" aria-label="A clay pot on a brick hearth">
      <rect width="300" height="300" fill="#f1e2c6"/>
      <rect y="230" width="300" height="70" fill="#b89a74"/>
      <g data-min="1"><rect x="90" y="200" width="30" height="40" fill="#a8452a"/><rect x="180" y="200" width="30" height="40" fill="#a8452a"/><rect x="135" y="215" width="30" height="25" fill="#8e3a22"/></g>
      <g data-min="2"><path d="M125 222 q10 -30 25 -10 q10 -30 25 10z" fill="#ff8a1c"/><path d="M138 222 q8 -18 12 -4 q6 -16 12 4z" fill="#ffd166"/></g>
      <g data-min="1"><path d="M100 200 q-10 -70 50 -80 q60 10 50 80z" fill="#9a5a34"/><ellipse cx="150" cy="122" rx="34" ry="7" fill="#7a4526"/></g>
      <g data-min="3" data-max="3"><ellipse cx="150" cy="122" rx="30" ry="5" fill="#fffdf4"/></g>
      <g data-min="4" data-max="4"><ellipse cx="150" cy="122" rx="30" ry="5" fill="#8a4e1f"/><circle cx="140" cy="121" r="3" fill="#fffdf4"/><circle cx="158" cy="122" r="3" fill="#fffdf4"/></g>
      <g data-min="5"><ellipse cx="150" cy="118" rx="36" ry="9" fill="#e8d7b0"/><path d="M116 120 q-6 20 -2 40 M184 120 q6 22 0 44 M130 124 q-4 16 0 26" stroke="#e8d7b0" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="140" cy="108" r="6" fill="#f4ead2"/><circle cx="160" cy="104" r="7" fill="#f4ead2"/></g>
      <g data-min="6"><path d="M60 60 q4 -8 8 0 M230 70 q4 -8 8 0 M90 40 q4 -8 8 0 M210 40 q4 -8 8 0" stroke="#3c679f" stroke-width="3" fill="none"/></g>
    </svg>`;
    stepper(root, {
      svg,
      doneLabel: "Cook another",
      steps: [
        { kicker: "Days before", title: "Find your spot", short: "Build the hearth", text: "For Attukal Pongala, women from all over Kerala and beyond claim a place on the city's streets, sometimes days ahead. Some years the pots stretch for kilometres." },
        { kicker: "Morning", title: "Three bricks and a new clay pot", short: "Light the fire", text: "Each woman builds a small hearth of bricks and sets a new clay pot on top." },
        { kicker: "The signal", title: "The fire is passed on", short: "Add the rice", text: "The temple's hearth is lit first, and the flame is passed from hearth to hearth through the streets." },
        { kicker: "Cooking", title: "Rice goes in", short: "Jaggery and coconut", text: "Raw rice is cooked in water in the clay pot." },
        { kicker: "Sweetening", title: "Jaggery and coconut", short: "Let it boil over", text: "Jaggery, grated coconut and often a little ghee turn it into pongala, a sweet rice offering for the goddess." },
        { kicker: "The moment", title: "It boils over!", short: "The blessing", text: "Letting the pot boil over is the whole point: it is a sign of abundance and of the goddess's blessing." },
        { kicker: "Evening", title: "The blessing", text: "Priests walk the streets sprinkling holy water over the pots. Then the offering is carried home and shared." },
      ],
    });
  }

  window.KERALA_EXPERIENCES = {
    kasaragod: { title: "Explore Bekal Fort", teaser: "Tap your way round Kerala's largest fort", mount: bekal },
    kannur: { title: "Weave on a Kannur loom", teaser: "Warp, weft and a throw of the shuttle", mount: loom },
    wayanad: { title: "Light up the Edakkal carvings", teaser: "Take a torch to carvings thousands of years old", mount: edakkal },
    kozhikode: { title: "Follow the pepper", teaser: "The sea routes that made Calicut rich", mount: spiceRoutes },
    malappuram: { title: "Count the rings of a Nilambur teak", teaser: "Grow the world's oldest teak plantation", mount: teakRings },
    palakkad: { title: "Blow a cloud through the gap", teaser: "Why Palakkad is drier and breezier", mount: palakkadGap },
    kottayam: { title: "Tap a rubber tree", teaser: "From a dawn cut to a smoked sheet", mount: rubber },
    pathanamthitta: { title: "The Aranmula mirror", teaser: "A mirror made of metal, not glass", mount: aranmula },
    kollam: { title: "From cashew apple to kernel", teaser: "How Kollam's cashews are made", mount: cashewSteps },
    thiruvananthapuram: { title: "Cook an Attukal Pongala", teaser: "Brick hearth, clay pot and a joyful boil-over", mount: pongala },
    thrissur: { title: "Join the kudamattam", teaser: "Raise the parasols at Thrissur Pooram", mount: kudamattam },
    ernakulam: { title: "Read a Kathakali face", teaser: "What the colours tell you about a character", mount: kathakali },
    idukki: { title: "Climb the ghat road to Munnar", teaser: "From the heat of Kochi to the tea hills", mount: ghatRoad },
    alappuzha: { title: "A day on a houseboat", teaser: "Noon at the jetty to morning on Vembanad", mount: houseboat },
  };
})();
