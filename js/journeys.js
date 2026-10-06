/*
 * Kerala Journey — journeys and the "Collect" tally (the /journeys page and the passport stats).
 *
 * Pure functions, no DOM: the same file runs in the browser (window.KERALA_JOURNEYS) and in Node for the tests
 * (scripts/journeys.test.mjs). Storage, photos and rendering live in app.js.
 *
 * Item keys are shared by the Done store, journeys and reviews:
 *   place:<district>/<spot>   dish:<id>   taste:<id>   xp:<experience id>
 *
 *   journey = {
 *     id, title, start ("YYYY-MM-DD" or null), created (ISO),
 *     from, to                gateway ids, or null for a journey started from scratch
 *     days: [{ n, base, items: [key], note, photos: [photo id] }]
 *     reviews: { key: { stars (1–5), text } }
 *   }
 *   data = { plan, doings, districts, food, tastes }   (the window.KERALA_* objects)
 */
(function (root) {
  "use strict";

  const leg = (a, b) => root.KERALA_PLANNER.leg(a, b);
  const baseOf = (data, id) => data.plan.bases.find((b) => b.id === id);
  const gatewayOf = (data, id) => data.plan.gateways.find((g) => g.id === id);

  function parseKey(key) {
    const k = String(key || "");
    const i = k.indexOf(":");
    return i < 0 ? { type: "", id: "" } : { type: k.slice(0, i), id: k.slice(i + 1) };
  }

  // Is this a key for something that exists in the site's data?
  function known(key, data) {
    const { type, id } = parseKey(key);
    if (type === "place") {
      const [d, s] = id.split("/");
      return !!data.districts.find((x) => x.id === d)?.spots.some((x) => x.id === s && x.type !== "eat");
    }
    if (type === "dish") return data.food.some((f) => f.id === id);
    if (type === "taste") return (data.tastes || []).some((f) => f.id === id);
    if (type === "xp") return (data.doings || []).some((x) => x.id === id);
    return false;
  }

  // The district an item belongs to (for grouping and stats).
  function districtOf(key, data) {
    const { type, id } = parseKey(key);
    if (type === "place") return id.split("/")[0];
    if (type === "dish") return data.food.find((f) => f.id === id)?.district;
    if (type === "taste") return (data.tastes || []).find((f) => f.id === id)?.district;
    if (type === "xp") return baseOf(data, (data.doings || []).find((x) => x.id === id)?.base)?.district;
    return undefined;
  }

  // A plan day (from planner.js) as journey items.
  const planDayItems = (d) => [
    ...d.see.map((s) => `place:${d.district}/${s}`),
    ...d.eat.map((f) => `dish:${f}`),
    ...(d.tastes || []).map((f) => `taste:${f}`),
    ...d.try.map((x) => `xp:${x}`),
  ];

  const newId = (now) => `j${now.getTime().toString(36)}${Math.floor(Math.random() * 1296).toString(36).padStart(2, "0")}`;
  const isoDate = (s) => (/^\d{4}-\d{2}-\d{2}$/.test(String(s || "")) ? s : null);

  function fromPlan(plan, data, { title, start, now = new Date() } = {}) {
    const names = [...new Set(plan.stops.map((s) => baseOf(data, s.base)?.name).filter(Boolean))];
    return {
      id: newId(now),
      title: String(title || "").trim() || `${plan.days.length} days: ${names.join(", ")}`,
      start: isoDate(start),
      created: now.toISOString(),
      from: plan.inputs.from,
      to: plan.inputs.to,
      days: plan.days.map((d) => ({ n: d.n, base: d.base, items: planDayItems(d), note: "", photos: [] })),
      reviews: {},
    };
  }

  function blank(data, { title, start, now = new Date() } = {}) {
    return { id: newId(now), title: String(title || "").trim() || "My Kerala trip", start: isoDate(start), created: now.toISOString(), from: null, to: null, days: [], reviews: {} };
  }

  const renumber = (days) => days.map((d, k) => ({ ...d, n: k + 1 }));

  // A new day in a town: its first places, and the district's food if this journey hasn't had it yet.
  function addDay(j, data, baseId) {
    const b = baseOf(data, baseId);
    if (!b) return j;
    const district = data.districts.find((d) => d.id === b.district);
    const had = new Set(j.days.flatMap((d) => d.items));
    const places = b.spots
      .filter((s) => district?.spots.some((x) => x.id === s && x.type !== "eat"))
      .map((s) => `place:${b.district}/${s}`)
      .filter((k) => !had.has(k))
      .slice(0, 3);
    const food = [
      ...data.food.filter((f) => f.district === b.district).map((f) => `dish:${f.id}`),
      ...(data.tastes || []).filter((f) => f.district === b.district).map((f) => `taste:${f.id}`),
    ]
      .filter((k) => !had.has(k))
      .slice(0, 2);
    return { ...j, days: renumber([...j.days, { n: 0, base: b.id, items: [...places, ...food], note: "", photos: [] }]) };
  }

  function removeDay(j, n) {
    return { ...j, days: renumber(j.days.filter((d) => d.n !== n)) };
  }

  const editDay = (j, n, fn) => ({ ...j, days: j.days.map((d) => (d.n === n ? fn(d) : d)) });
  const addItem = (j, n, key) => editDay(j, n, (d) => (d.items.includes(key) ? d : { ...d, items: [...d.items, key] }));
  const removeItem = (j, n, key) => editDay(j, n, (d) => ({ ...d, items: d.items.filter((k) => k !== key) }));
  const setNote = (j, n, note) => editDay(j, n, (d) => ({ ...d, note: String(note || "").slice(0, 4000) }));
  const addPhoto = (j, n, id) => editDay(j, n, (d) => ({ ...d, photos: [...d.photos, id] }));
  const removePhoto = (j, id) => ({ ...j, days: j.days.map((d) => ({ ...d, photos: d.photos.filter((p) => p !== id) })) });

  function setReview(j, key, { stars, text } = {}) {
    const reviews = { ...j.reviews };
    const prev = reviews[key] || {};
    const next = {
      stars: stars === undefined ? prev.stars || 0 : Math.max(0, Math.min(5, Math.round(+stars || 0))),
      text: text === undefined ? prev.text || "" : String(text).slice(0, 1000),
    };
    if (!next.stars && !next.text) delete reviews[key];
    else reviews[key] = next;
    return { ...j, reviews };
  }

  // The towns in order, without repeats in a row (two days in Munnar is one stop).
  const stops = (j) => j.days.map((d) => d.base).filter((b, k, a) => b && b !== a[k - 1]);

  // Rough km: airport → towns → airport, using the planner's estimate.
  function km(j, data) {
    const pts = [gatewayOf(data, j.from), ...stops(j).map((id) => baseOf(data, id)), gatewayOf(data, j.to)].filter(Boolean);
    return pts.slice(1).reduce((t, p, k) => t + leg(pts[k], p).km, 0);
  }

  // The date of day n, or null when the journey has no start date.
  function dayDate(j, n) {
    if (!j.start) return null;
    const d = new Date(`${j.start}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + n - 1);
    return d.toISOString().slice(0, 10);
  }

  // The passport's stats row. done = Done store keys, stamps = { district: date } from the virtual tour.
  function stats({ done = [], stamps = {}, journeys = [] }, data) {
    const ok = done.filter((k) => known(k, data));
    const count = (type) => ok.filter((k) => parseKey(k).type === type).length;
    return {
      districts: Object.keys(stamps).length,
      places: count("place"),
      food: count("dish") + count("taste"),
      foodTotal: data.food.length + (data.tastes || []).length,
      experiences: count("xp"),
      km: journeys.reduce((t, j) => t + km(j, data), 0),
      journeys: journeys.length,
    };
  }

  // Keep only journeys that look right (stored data can be old or hand-edited).
  function clean(list, data) {
    if (!Array.isArray(list)) return [];
    return list
      .filter((j) => j && typeof j.id === "string" && Array.isArray(j.days))
      .map((j) => ({
        id: j.id,
        title: String(j.title || "My Kerala trip"),
        start: isoDate(j.start),
        created: String(j.created || ""),
        from: gatewayOf(data, j.from) ? j.from : null,
        to: gatewayOf(data, j.to) ? j.to : null,
        days: renumber(
          j.days
            .filter((d) => d && baseOf(data, d.base))
            .map((d) => ({
              n: 0,
              base: d.base,
              items: (Array.isArray(d.items) ? d.items : []).filter((k) => known(k, data)),
              note: String(d.note || ""),
              photos: (Array.isArray(d.photos) ? d.photos : []).filter((p) => typeof p === "string"),
            }))
        ),
        reviews: Object.fromEntries(
          Object.entries(j.reviews && typeof j.reviews === "object" ? j.reviews : {})
            .filter(([k, r]) => known(k, data) && r && typeof r === "object")
            .map(([k, r]) => [k, { stars: Math.max(0, Math.min(5, Math.round(+r.stars || 0))), text: String(r.text || "") }])
        ),
      }));
  }

  root.KERALA_JOURNEYS = {
    parseKey,
    known,
    districtOf,
    planDayItems,
    fromPlan,
    blank,
    addDay,
    removeDay,
    addItem,
    removeItem,
    setNote,
    addPhoto,
    removePhoto,
    setReview,
    stops,
    km,
    dayDate,
    stats,
    clean,
  };
})(typeof window !== "undefined" ? window : globalThis);
