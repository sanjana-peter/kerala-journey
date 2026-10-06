/*
 * Kerala Journey — the trip planner engine (the /plan page).
 *
 * Pure functions, no DOM: the same file runs in the browser (window.KERALA_PLANNER) and in Node for the tests
 * (scripts/planner.test.mjs). It only ever uses places, dishes and experiences from the site's own data, so it
 * cannot invent anything.
 *
 *   buildPlan(inputs, data) → plan
 *
 *   inputs = {
 *     days, from, to          trip length (2–21) and the arrival / departure airports (gateway ids)
 *     party, budget, pace     ids from plan.js (budget: "low" | "mid" | "high", the per-person bands below)
 *     interests[]             interest ids from plan.js
 *     month                   0–11, for seasons and experiences that only run in some months
 *     mustSee[]               saved places as "district/spot"; the towns they're seen from are always included
 *     include[], exclude[]    towns the traveller added or swapped out
 *     stops                   how many towns (null = decided from the days and pace)
 *     nights{}                { townId: days } fixed by the ± buttons
 *     cheap                   prefer free things to do
 *     pins{}                  { experienceId: k } "Add to Day N": done on the k-th day (0-based) in its town.
 *                             A pin stays while its town is in the plan, and is ignored otherwise.
 *   }
 *   data = { plan, doings, districts, food, tastes, visit, climates }   (the window.KERALA_* objects)
 *
 * Drive times come from straight-line distance, so they are rough and always shown as "about".
 */
(function (root) {
  "use strict";

  const BANDS = {
    low: { label: "₹20–40k", top: 40000 },
    mid: { label: "₹40–80k", top: 80000 },
    high: { label: "₹80k+", top: Infinity },
  };
  const STYLE_ORDER = ["budget", "comfort", "luxury"];
  // Hours of sightseeing a day comfortably holds, by pace.
  const DAY_HOURS = { relaxed: 4, balanced: 6, packed: 8 };
  const SPOTS_PER_DAY = { relaxed: 2, balanced: 3, packed: 4 };
  const TRIES_PER_DAY = { relaxed: 1, balanced: 2, packed: 2 };

  // ---------- distances ----------
  function crowKm([lat1, lon1], [lat2, lon2]) {
    const r = Math.PI / 180;
    const a = Math.sin(((lat2 - lat1) * r) / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lon2 - lon1) * r) / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(a));
  }
  // Road distance and time between two places ({ coords, hills }).
  // Coast roads: about 1.2 × the straight line at 45 km/h (Kochi–Alappuzha ≈ 1½ h, Kochi–Thiruvananthapuram ≈ 4½ h).
  // From the coast up into the hills: 1.4 × at 36 km/h (Kochi–Munnar ≈ 3½ h, Kochi–Wayanad ≈ 7 h).
  // Hill to hill, winding all the way: 1.55 × at 30 km/h (Munnar–Thekkady ≈ 3 h).
  const ROAD = [
    { factor: 1.2, kmh: 45 },
    { factor: 1.4, kmh: 36 },
    { factor: 1.55, kmh: 30 },
  ];
  function leg(a, b) {
    const r = ROAD[(a.hills ? 1 : 0) + (b.hills ? 1 : 0)];
    const km = crowKm(a.coords, b.coords) * r.factor;
    return { km: Math.round(km), hours: Math.round((km / r.kmh) * 2) / 2 };
  }

  // ---------- helpers ----------
  const byIdOf = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  function normalise(inputs, plan) {
    const gw = plan.gateways.map((g) => g.id);
    const i = { ...inputs };
    i.days = clamp(Math.round(+i.days || 7), 2, 21);
    i.from = gw.includes(i.from) ? i.from : "cok";
    i.to = gw.includes(i.to) ? i.to : i.from;
    i.party = plan.parties[i.party] ? i.party : "couple";
    i.budget = BANDS[i.budget] ? i.budget : "mid";
    i.pace = plan.paces[i.pace] ? i.pace : "balanced";
    i.interests = (i.interests || []).filter((x) => plan.interests[x]);
    i.month = Number.isInteger(+i.month) && +i.month >= 0 && +i.month < 12 ? +i.month : null;
    i.mustSee = (i.mustSee || []).filter((k) => typeof k === "string");
    const baseIds = new Set(plan.bases.map((b) => b.id));
    i.include = (i.include || []).filter((x) => baseIds.has(x));
    i.exclude = (i.exclude || []).filter((x) => baseIds.has(x) && !i.include.includes(x));
    i.nights = Object.fromEntries(Object.entries(i.nights || {}).filter(([k, v]) => baseIds.has(k) && v >= 1));
    i.stops = i.stops ? clamp(Math.round(+i.stops), 1, 8) : null;
    i.cheap = !!i.cheap;
    i.pins = Object.fromEntries(Object.entries(i.pins || {}).filter(([, k]) => Number.isInteger(+k) && +k >= 0).map(([id, k]) => [id, +k]));
    return i;
  }

  function climateKind(data, district, month) {
    if (month === null) return null;
    const v = data.visit?.[district];
    const table = data.climates?.[v?.climate] || data.climates?.coast;
    return table ? table[month] : null;
  }

  // ---------- 1. score each town ----------
  // Interests count 3 each; one the plan already covers counts 1, so the towns don't all offer the same thing.
  const interestScore = (b, i, covered) => b.tags.filter((t) => i.interests.includes(t)).reduce((t, g) => t + (covered.has(g) ? 1 : 3), 0);
  function scoreBase(b, i, data) {
    let s = b.weight || 0;
    const must = i.mustSee.filter((k) => k.split("/")[0] === b.district && b.spots.includes(k.split("/")[1])).length;
    s += must * 5;
    if (i.month !== null) {
      if ((data.visit?.[b.district]?.best || []).includes(i.month)) s += 1;
      const kind = climateKind(data, b.district, i.month);
      // Beaches are rough and closed to swimming in the south-west monsoon.
      if (kind === "monsoon" && b.tags.includes("beaches") && !b.tags.includes("hills")) s -= 2;
      // Eravikulam (Munnar's park) closes for the Nilgiri tahr calving season, roughly February to March.
      if (b.id === "munnar" && (i.month === 1 || i.month === 2)) s -= 1;
    }
    return { s, must };
  }

  // ---------- 2–4. choose the towns and their order ----------
  function chooseBases(i, data) {
    const P = data.plan;
    const gw = byIdOf(P.gateways);
    const from = gw[i.from], to = gw[i.to];
    const pace = P.paces[i.pace];
    const pool = P.bases.filter((b) => !i.exclude.includes(b.id)).map((b) => {
      const x = { b, ...scoreBase(b, i, data) };
      x.s0 = x.s;
      x.s = x.s0 + interestScore(b, i, new Set());
      return x;
    });

    let n = i.stops || Math.round(i.days / pace.daysPerBase);
    n = clamp(n, 1, Math.min(8, pool.length));
    const forced = pool.filter((x) => i.include.includes(x.b.id) || x.must > 0).sort((a, b) => b.s - a.s);
    n = Math.max(n, Math.min(forced.length, 8));

    // Short trips can't afford long drives between towns.
    const distWeight = i.days <= 4 ? 1.6 : i.days <= 7 ? 0.9 : 0.45;
    const chosen = forced.slice(0, 8);
    while (chosen.length < n) {
      const covered = new Set(chosen.flatMap((c) => c.b.tags));
      let best = null;
      for (const x of pool) {
        if (chosen.includes(x)) continue;
        const anchors = [from, to, ...chosen.map((c) => c.b)];
        const near = Math.min(...anchors.map((a) => leg(a, x.b).hours));
        // Only towns within a day's drive (for this pace) of the airport or a town already in the plan.
        if (near > pace.maxDrive) continue;
        const v = x.s0 + interestScore(x.b, i, covered) - distWeight * near;
        if (!best || v > best.v) best = { x, v };
      }
      if (!best) break;
      chosen.push(best.x);
    }

    // Too many towns for the days? Drop the weakest unforced ones until every town gets its least days.
    const least = (x) => i.nights[x.b.id] || x.b.days[0];
    while (chosen.length > 1 && chosen.reduce((t, x) => t + least(x), 0) > i.days) {
      const drop = [...chosen].filter((x) => !forced.includes(x)).sort((a, b) => a.s - b.s)[0] || [...chosen].sort((a, b) => a.s - b.s)[0];
      chosen.splice(chosen.indexOf(drop), 1);
    }

    let order = bestOrder(chosen, from, to, pace.maxDrive);

    // Bridge any drive that's still too long with a town in between, if the days allow one more stop;
    // otherwise swap it in for the weakest town that isn't forced. A few rounds at most.
    for (let round = 0; round < 3; round++) {
      const gap = order.findIndex((x, k) => k > 0 && leg(order[k - 1].b, x.b).hours > pace.maxDrive);
      if (gap < 0) break;
      const a = order[gap - 1], z = order[gap];
      const bridge = pool
        .filter((y) => !order.includes(y) && leg(a.b, y.b).hours <= pace.maxDrive && leg(y.b, z.b).hours <= pace.maxDrive)
        .sort((p, q) => q.s - p.s)[0];
      if (!bridge) break;
      // A number of towns set by an edit ("Less driving") is kept: then the bridge can only swap in.
      const room = order.reduce((t, x) => t + least(x), 0) + least(bridge) <= i.days && order.length < (i.stops || 8);
      const next = [...order];
      if (room) next.push(bridge);
      else {
        const weakest = next.filter((x) => x !== a && x !== z && !forced.includes(x)).sort((p, q) => p.s - q.s)[0];
        if (!weakest) break;
        next.splice(next.indexOf(weakest), 1, bridge);
      }
      order = bestOrder(next, from, to, pace.maxDrive);
    }
    return { order, from, to };
  }

  // The shortest route from the arrival airport through every town to the departure airport (≤ 8 towns, so
  // brute force is instant). Orders with a leg over the pace's longest drive are only used if nothing else fits.
  function bestOrder(chosen, from, to, maxDrive) {
    const pts = [from, ...chosen.map((x) => x.b), to];
    const H = pts.map((p) => pts.map((q) => leg(p, q).hours));
    const n = chosen.length, last = n + 1;
    let best = null;
    const path = [];
    // Depth-first over the orders, carrying the hours so far, the longest town-to-town leg and whether it's too long.
    const walk = (prev, used, hours, longest) => {
      if (path.length === n) {
        const total = hours + H[prev][last];
        const over = longest > maxDrive ? 1 : 0;
        if (!best || over < best.over || (over === best.over && total < best.hours)) best = { order: [...path], hours: total, over };
        return;
      }
      if (best && best.over === 0 && hours >= best.hours) return;
      for (let k = 1; k <= n; k++) {
        if (used & (1 << k)) continue;
        path.push(k);
        // The drives to and from the airports happen on travel days, so only town-to-town legs count as "long".
        walk(k, used | (1 << k), hours + H[prev][k], prev === 0 ? longest : Math.max(longest, H[prev][k]));
        path.pop();
      }
    };
    walk(0, 0, 0, 0);
    return best ? best.order.map((k) => chosen[k - 1]) : [];
  }

  // ---------- 5. share out the days ----------
  function shareDays(order, i) {
    const days = order.map((x) => i.nights[x.b.id] || Math.min(x.b.days[0], i.days));
    let left = i.days - days.reduce((a, b) => a + b, 0);
    const free = order.map((x, k) => k).filter((k) => !i.nights[order[k].b.id]);
    // First up to each town's ideal days, best-scoring towns first; then round-robin by score.
    const byScore = [...free].sort((a, b) => order[b].s - order[a].s);
    for (const k of byScore) {
      const add = Math.min(left, order[k].b.days[1] - days[k]);
      if (add > 0) {
        days[k] += add;
        left -= add;
      }
    }
    for (let r = 0; left > 0 && byScore.length; r++, left--) days[byScore[r % byScore.length]] += 1;
    // Fixed nights can overshoot a short trip: trim from the end, keeping at least one day per town.
    for (let k = days.length - 1; left < 0 && k >= 0; k--) {
      while (left < 0 && days[k] > 1) {
        days[k]--;
        left++;
      }
    }
    return days;
  }

  // ---------- 6. fill each day ----------
  const dayInDistrict = (days, district) => days.filter((o) => o.district === district).length;
  function fillDays(order, counts, i, data, from, to) {
    const P = data.plan;
    const pace = i.pace;
    const districts = byIdOf(data.districts);
    const doings = data.doings || [];
    const usedTry = new Set();
    const out = [];
    let n = 1;
    order.forEach((x, k) => {
      const b = x.b;
      const d = districts[b.district];
      const inSeason = (id) => i.month === null || !P.seasonal?.[`${b.district}/${id}`] || P.seasonal[`${b.district}/${id}`].includes(i.month);
      const spotIds = b.spots.filter((id) => d?.spots.some((s) => s.id === id && s.type !== "eat") && inSeason(id));
      // Saved places first, then the base's own order.
      const must = new Set(i.mustSee.filter((m) => m.startsWith(b.district + "/")).map((m) => m.split("/")[1]));
      const spots = [...spotIds.filter((id) => must.has(id)), ...spotIds.filter((id) => !must.has(id))];
      const dishes = (data.food || []).filter((f) => f.district === b.district).map((f) => f.id);
      const tastes = (data.tastes || []).filter((f) => f.district === b.district).map((f) => f.id);
      const options = doings
        .filter((t) => t.base === b.id && (i.month === null || !t.months || t.months.includes(i.month)))
        .map((t) => ({
          t,
          v: (t.tags || []).filter((g) => i.interests.includes(g)).length * 2 + (t.cost === 0 ? (i.cheap ? 3 : 0.5) : 0) - (i.cheap ? t.cost / 2000 : 0),
        }))
        .sort((a, b) => b.v - a.v)
        .map((o) => o.t);

      // Pinned experiences in this town, by the day they're pinned to (clamped to the days the town has).
      const pinned = doings.filter((t) => t.base === b.id && i.pins[t.id] !== undefined);
      pinned.forEach((t) => usedTry.add(t.id));
      const prev = k === 0 ? from : order[k - 1].b;
      const arrive = leg(prev, b);
      const perDay = Math.ceil(spots.length / counts[k]);
      for (let day = 0; day < counts[k]; day++) {
        const isLast = k === order.length - 1 && day === counts[k] - 1;
        const travel = day === 0 ? { from: prev.name, to: b.name, ...arrive } : null;
        const depart = isLast ? { from: b.name, to: to.name, ...leg(b, to) } : null;
        let hours = DAY_HOURS[pace] - (travel ? travel.hours : 0) - (depart ? depart.hours : 0);
        const see = spots.slice(day * perDay, (day + 1) * perDay).slice(0, SPOTS_PER_DAY[pace]);
        hours -= see.length * 1.5;
        const tries = [];
        const slots = new Set();
        for (const t of pinned.filter((t) => Math.min(i.pins[t.id], counts[k] - 1) === day)) {
          tries.push(t.id);
          if (t.when) slots.add(t.when);
          hours -= t.when === "evening" || t.when === "night" ? 0 : t.hours;
        }
        for (const t of options) {
          if (tries.length >= TRIES_PER_DAY[pace] || usedTry.has(t.id)) continue;
          if (t.when && slots.has(t.when)) continue;
          // Evening and night things don't eat into the day.
          const cost = t.when === "evening" || t.when === "night" ? 0 : t.hours;
          if (cost > Math.max(hours, 0) + 1 && tries.length) continue;
          tries.push(t.id);
          usedTry.add(t.id);
          if (t.when) slots.add(t.when);
          hours -= cost;
        }
        // A thing to try at a place replaces seeing it (the Kathakali show covers "Kathakali").
        const trySpots = new Set(tries.map((id) => options.find((t) => t.id === id)?.spot).filter(Boolean));
        const firstInDistrict = day === 0 && !out.some((o) => o.district === b.district);
        out.push({
          n: n++,
          base: b.id,
          district: b.district,
          see: see.filter((id) => !trySpots.has(id)),
          // The district's dish on the first day in each district, so it isn't repeated.
          eat: firstInDistrict ? dishes : [],
          // Other local tastes for the food passport, a couple a day across the days in the district.
          tastes: tastes.slice(dayInDistrict(out, b.district) * 2, dayInDistrict(out, b.district) * 2 + 2),
          try: tries,
          travel,
          depart,
          climate: climateKind(data, b.district, i.month),
        });
      }
    });
    return out;
  }

  // ---------- 7. cost it ----------
  function costPlan(days, legs, i, data) {
    const P = data.plan;
    const party = P.parties[i.party];
    const doings = byIdOf(data.doings || []);
    const km = legs.reduce((t, l) => t + l.km, 0);
    const nights = Math.max(i.days - 1, 1);
    const tryCost = days.flatMap((d) => d.try).reduce((t, id) => {
      const x = doings[id];
      return t + (x ? (x.per === "group" ? x.cost : x.cost * party.people) : 0);
    }, 0);
    const byStyle = {};
    for (const id of STYLE_ORDER) {
      const st = P.styles[id];
      // Budget travellers each buy a bus or train ticket; the others share one car with a driver.
      const transfers = km * st.perKm * (id === "budget" ? party.people : Math.ceil(party.people / 4));
      const total = Math.ceil(party.rooms) * nights * st.room + party.people * i.days * (st.food + st.local) + transfers + tryCost;
      byStyle[id] = { total: round(total), perPerson: round(total / party.people) };
    }
    const top = BANDS[i.budget].top;
    let style = [...STYLE_ORDER].reverse().find((id) => byStyle[id].perPerson <= top) || "budget";
    if (i.style && STYLE_ORDER.indexOf(i.style) < STYLE_ORDER.indexOf(style)) style = i.style;
    const fits = byStyle[style].perPerson <= top;
    return { byStyle, style, fits, over: fits ? 0 : byStyle[style].perPerson - top, band: BANDS[i.budget].label, km };
  }
  const round = (n) => Math.round(n / 500) * 500;

  // ---------- the whole plan ----------
  function buildPlan(rawInputs, data) {
    const i = normalise(rawInputs || {}, data.plan);
    const { order, from, to } = chooseBases(i, data);
    const counts = shareDays(order, i);
    const days = fillDays(order, counts, i, data, from, to);
    const stops = [from, ...order.map((x) => x.b), to];
    const legs = stops.slice(1).map((s, k) => leg(stops[k], s));
    const cost = costPlan(days, legs, i, data);
    const pace = data.plan.paces[i.pace];
    const warnings = [];
    legs.forEach((l, k) => {
      if (k > 0 && k < legs.length - 1 && l.hours > pace.maxDrive)
        warnings.push(`The drive from ${stops[k].name} to ${stops[k + 1].name} is about ${l.hours} hours, longer than this pace likes.`);
    });
    // A pinned experience out of its season is kept (the traveller chose it) but flagged.
    for (const t of data.doings || []) {
      if (i.pins[t.id] === undefined || !t.months || i.month === null || t.months.includes(i.month)) continue;
      if (days.some((d) => d.try.includes(t.id))) warnings.push(`${t.name} doesn't usually happen in the month you chose.`);
    }
    // Long drives on arrival or departure day: suggest the airport nearest that town.
    const nearest = (b) => [...data.plan.gateways].sort((x, y) => leg(x, b).hours - leg(y, b).hours)[0];
    const firstLeg = legs[0], lastLeg = legs[legs.length - 1];
    if (firstLeg && firstLeg.hours > 4) {
      const g = nearest(stops[1]);
      warnings.push(`Day 1 starts with about ${firstLeg.hours} hours from ${from.name} to ${stops[1].name}${g.id !== from.id ? `. Flying into ${g.name} instead saves most of that drive` : ""}.`);
    }
    if (lastLeg && lastLeg.hours > 4 && legs.length > 1) {
      const g = nearest(stops[stops.length - 2]);
      warnings.push(`The last day ends with about ${lastLeg.hours} hours from ${stops[stops.length - 2].name} to ${to.name}: leave early${g.id !== to.id ? `, or fly out from ${g.name}` : ""}.`);
    }
    return {
      inputs: i,
      stops: order.map((x, k) => ({ base: x.b.id, days: counts[k] })),
      days,
      legs,
      km: legs.reduce((t, l) => t + l.km, 0),
      hours: legs.reduce((t, l) => t + l.hours, 0),
      cost,
      warnings,
    };
  }

  // ---------- edits: each returns new inputs to rebuild from ----------
  const edits = {
    // Drop the town whose removal saves the most driving (never a town with a saved place in it).
    lessDriving(plan, data) {
      const i = plan.inputs;
      if (plan.stops.length < 2) return null;
      const gw = byIdOf(data.plan.gateways), bases = byIdOf(data.plan.bases);
      const pts = [gw[i.from], ...plan.stops.map((s) => bases[s.base]), gw[i.to]];
      let best = null;
      plan.stops.forEach((s, k) => {
        if (i.include.includes(s.base) || i.mustSee.some((m) => bases[s.base].district === m.split("/")[0] && bases[s.base].spots.includes(m.split("/")[1]))) return;
        const saved = leg(pts[k], pts[k + 1]).km + leg(pts[k + 1], pts[k + 2]).km - leg(pts[k], pts[k + 2]).km;
        if (!best || saved > best.saved) best = { id: s.base, saved };
      });
      if (!best) return null;
      const nights = { ...i.nights };
      delete nights[best.id];
      return { ...i, exclude: [...i.exclude, best.id], stops: plan.stops.length - 1, nights };
    },
    cheaper(plan) {
      const i = plan.inputs;
      const k = STYLE_ORDER.indexOf(plan.cost.style);
      return { ...i, style: STYLE_ORDER[Math.max(0, k - 1)], cheap: true };
    },
    swap(plan, data, baseId) {
      const i = plan.inputs;
      const nights = { ...i.nights };
      delete nights[baseId];
      return { ...i, exclude: [...i.exclude, baseId], include: i.include.filter((x) => x !== baseId), stops: plan.stops.length, nights };
    },
    // ± a day in one town; the trip gets a day longer or shorter.
    nights(plan, data, baseId, delta) {
      const i = plan.inputs;
      const cur = plan.stops.find((s) => s.base === baseId)?.days || 0;
      const next = cur + delta;
      if (next < 1 || i.days + delta < 2 || i.days + delta > 21) return null;
      const fixed = Object.fromEntries(plan.stops.map((s) => [s.base, s.days]));
      return { ...i, days: i.days + delta, nights: { ...fixed, [baseId]: next }, stops: plan.stops.length, include: plan.stops.map((s) => s.base) };
    },
    // "Add to Day N": pin an experience to day n of the plan (adding its town first if it isn't in the plan).
    pin(plan, data, doingId, n) {
      const i = plan.inputs;
      const t = (data.doings || []).find((x) => x.id === doingId);
      if (!t) return null;
      const inTown = plan.days.filter((d) => d.base === t.base).map((d) => d.n);
      if (!inTown.length) return { ...edits.add(plan, data, t.base), pins: { ...i.pins, [doingId]: 0 } };
      return { ...i, pins: { ...i.pins, [doingId]: Math.max(0, inTown.indexOf(n)) } };
    },
    unpin(plan, data, doingId) {
      const pins = { ...plan.inputs.pins };
      delete pins[doingId];
      return { ...plan.inputs, pins };
    },
    add(plan, data, baseId) {
      const i = plan.inputs;
      return { ...i, include: [...new Set([...i.include, ...plan.stops.map((s) => s.base), baseId])], exclude: i.exclude.filter((x) => x !== baseId), stops: plan.stops.length + 1 };
    },
  };

  // ---------- share links: the inputs, packed into the URL ----------
  function encode(i) {
    const compact = [i.days, i.from, i.to, i.party, i.budget, i.pace, i.month ?? "", i.interests.join("."), i.mustSee.join("."), i.include.join("."), i.exclude.join("."),
      Object.entries(i.nights).map(([k, v]) => `${k}:${v}`).join("."), i.stops || "", i.cheap ? 1 : "", i.style || "",
      Object.entries(i.pins || {}).map(([k, v]) => `${k}:${v}`).join(".")];
    return compact.join("~");
  }
  function decode(s) {
    const p = String(s || "").split("~");
    const list = (x) => (x ? x.split(".").filter(Boolean) : []);
    return {
      days: +p[0], from: p[1], to: p[2], party: p[3], budget: p[4], pace: p[5], month: p[6] === "" ? null : +p[6],
      interests: list(p[7]), mustSee: list(p[8]), include: list(p[9]), exclude: list(p[10]),
      nights: Object.fromEntries(list(p[11]).map((x) => x.split(":")).map(([k, v]) => [k, +v])),
      stops: p[12] ? +p[12] : null, cheap: p[13] === "1", style: p[14] || undefined,
      pins: Object.fromEntries(list(p[15]).map((x) => x.split(":")).map(([k, v]) => [k, +v])),
    };
  }

  root.KERALA_PLANNER = { buildPlan, edits, encode, decode, leg, BANDS };
})(typeof window !== "undefined" ? window : globalThis);
