// Tests for js/planner.js:  node --test scripts/planner.test.mjs   (no dependencies)
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const W = { window: {} };
W.window = W;
for (const f of ["data/districts.js", "data/food.js", "data/visit.js", "data/plan.js", "data/doings.js", "planner.js"])
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js", f), "utf8"), W);

const DATA = {
  plan: W.KERALA_PLAN,
  doings: W.KERALA_DOINGS,
  districts: W.KERALA_DISTRICTS,
  food: W.KERALA_FOOD,
  visit: W.KERALA_VISIT,
  climates: W.KERALA_CLIMATES,
};
const { buildPlan, edits, encode, decode } = W.KERALA_PLANNER;
const P = DATA.plan;
const spotIds = new Set(DATA.districts.flatMap((d) => d.spots.map((s) => `${d.id}/${s.id}`)));
const foodIds = new Set(DATA.food.map((f) => f.id));
const doingIds = new Set(DATA.doings.map((x) => x.id));
const baseIds = new Set(P.bases.map((b) => b.id));

// A spread of realistic trips.
const CASES = [];
for (const days of [2, 3, 5, 7, 10, 14, 21])
  for (const pace of Object.keys(P.paces))
    for (const [from, to] of [["cok", "cok"], ["cok", "trv"], ["trv", "trv"], ["cnn", "cok"], ["ccj", "trv"]])
      for (const month of [0, 6])
        CASES.push({ days, pace, from, to, month, party: "couple", budget: "mid", interests: days % 2 ? ["hills", "food"] : ["backwaters", "beaches"] });

test("the data is consistent", () => {
  for (const b of P.bases) {
    assert.ok(DATA.districts.some((d) => d.id === b.district), `${b.id}: unknown district ${b.district}`);
    for (const s of b.spots) assert.ok(spotIds.has(`${b.district}/${s}`), `${b.id}: unknown spot ${s}`);
    for (const t of b.tags) assert.ok(P.interests[t], `${b.id}: unknown interest ${t}`);
    assert.ok(b.days[0] >= 1 && b.days[1] >= b.days[0], `${b.id}: bad days`);
  }
  for (const x of DATA.doings) {
    assert.ok(baseIds.has(x.base), `${x.id}: unknown base ${x.base}`);
    assert.ok(typeof x.cost === "number" && x.cost >= 0, `${x.id}: bad cost`);
    for (const t of x.tags || []) assert.ok(P.interests[t], `${x.id}: unknown interest ${t}`);
  }
});

test("every plan adds up and only uses known ids", () => {
  for (const c of CASES) {
    const p = buildPlan(c, DATA);
    const label = JSON.stringify(c);
    assert.equal(p.days.length, c.days, `days add up: ${label}`);
    assert.equal(p.stops.reduce((t, s) => t + s.days, 0), c.days, `stops add up: ${label}`);
    assert.ok(p.stops.length >= 1 && p.stops.length <= 8, label);
    assert.equal(new Set(p.stops.map((s) => s.base)).size, p.stops.length, `no town twice: ${label}`);
    p.days.forEach((d, k) => {
      assert.equal(d.n, k + 1);
      assert.ok(baseIds.has(d.base));
      for (const s of d.see) assert.ok(spotIds.has(`${d.district}/${s}`), `unknown spot ${s}`);
      for (const f of d.eat) assert.ok(foodIds.has(f), `unknown dish ${f}`);
      for (const t of d.try) assert.ok(doingIds.has(t), `unknown experience ${t}`);
    });
    const tries = p.days.flatMap((d) => d.try);
    assert.equal(new Set(tries).size, tries.length, `no experience twice: ${label}`);
    assert.ok(p.cost.byStyle.budget.total > 0 && p.cost.byStyle.budget.total < p.cost.byStyle.luxury.total, label);
  }
});

test("town-to-town drives respect the pace where the trip allows it", () => {
  let long = 0;
  for (const c of CASES) {
    const p = buildPlan(c, DATA);
    const max = P.paces[c.pace].maxDrive;
    if (!p.legs.slice(1, -1).some((l) => l.hours > max)) continue;
    long++;
    // Any over-long drive must be called out, and only one-way trips the length of Kerala should need one.
    assert.ok(p.warnings.length, JSON.stringify(c));
    assert.notEqual(c.from, c.to, `a round trip with a long drive: ${JSON.stringify(c)}`);
  }
  assert.ok(long <= CASES.length * 0.05, `too many trips with a long drive: ${long} of ${CASES.length}`);
});

test("experiences respect their months", () => {
  const months = Object.fromEntries(DATA.doings.map((x) => [x.id, x.months]));
  for (const c of CASES) {
    for (const d of buildPlan(c, DATA).days)
      for (const t of d.try) if (months[t]) assert.ok(months[t].includes(c.month), `${t} in month ${c.month}`);
  }
});

test("event places only appear in their season", () => {
  for (const c of CASES)
    for (const d of buildPlan(c, DATA).days)
      for (const s of d.see) {
        const months = P.seasonal[`${d.district}/${s}`];
        if (months) assert.ok(months.includes(c.month), `${d.district}/${s} in month ${c.month}`);
      }
});

test("a saved place pulls its town into the plan", () => {
  const p = buildPlan({ days: 5, from: "cok", to: "cok", mustSee: ["wayanad/edakkal"] }, DATA);
  assert.ok(p.stops.some((s) => s.base === "wayanad"));
  assert.ok(p.days.some((d) => d.see.includes("edakkal")));
});

test("a classic first week from Kochi", () => {
  const p = buildPlan({ days: 7, from: "cok", to: "cok", party: "couple", budget: "mid", pace: "balanced", month: 0, interests: ["hills", "backwaters"] }, DATA);
  const towns = p.stops.map((s) => s.base);
  assert.ok(towns.includes("munnar"), towns.join());
  assert.ok(towns.includes("alappuzha") || towns.includes("kumarakom"), towns.join());
});

test("the cost is fixed for a fixed input", () => {
  const p = buildPlan({ days: 4, from: "cok", to: "cok", party: "solo", budget: "low", pace: "relaxed", month: 0, interests: [], stops: 1, include: ["kochi"] }, DATA);
  assert.equal(JSON.stringify(p.stops), JSON.stringify([{ base: "kochi", days: 4 }]));
  // Budget style: 3 nights × ₹1500 + 4 days × (₹600 + ₹300) + the local km and any experiences.
  assert.ok(p.cost.byStyle.budget.total >= 8000 && p.cost.byStyle.budget.total <= 12000, String(p.cost.byStyle.budget.total));
  assert.equal(p.cost.fits, true);
});

test("edits", () => {
  const base = { days: 10, from: "cok", to: "trv", party: "couple", budget: "mid", pace: "balanced", month: 0, interests: ["hills", "beaches"] };
  const p = buildPlan(base, DATA);

  const less = buildPlan(edits.lessDriving(p, DATA), DATA);
  // A trip with a saved place far north, where bridging matters.
  const far = buildPlan({ ...base, from: "cok", to: "cok", days: 9, mustSee: ["wayanad/edakkal"], interests: ["hills", "wildlife"] }, DATA);
  assert.equal(buildPlan(edits.lessDriving(far, DATA), DATA).stops.length, far.stops.length - 1, "Less driving always drops a town");
  assert.equal(less.stops.length, p.stops.length - 1);
  assert.ok(less.km <= p.km, `${less.km} <= ${p.km}`);
  assert.equal(less.days.length, 10);

  const swapped = buildPlan(edits.swap(p, DATA, p.stops[0].base), DATA);
  assert.ok(!swapped.stops.some((s) => s.base === p.stops[0].base));
  assert.equal(swapped.stops.length, p.stops.length);

  const plus = buildPlan(edits.nights(p, DATA, p.stops[1].base, +1), DATA);
  assert.equal(plus.days.length, 11);
  assert.equal(plus.stops.find((s) => s.base === p.stops[1].base).days, p.stops[1].days + 1);
  assert.equal(plus.stops.map((s) => s.base).sort().join(), p.stops.map((s) => s.base).sort().join());

  const cheap = buildPlan(edits.cheaper(p, DATA), DATA);
  assert.ok(cheap.cost.byStyle[cheap.cost.style].perPerson <= p.cost.byStyle[p.cost.style].perPerson);

  const outsider = P.bases.find((b) => !p.stops.some((s) => s.base === b.id)).id;
  const added = buildPlan(edits.add(p, DATA, outsider), DATA);
  assert.ok(added.stops.some((s) => s.base === outsider));
});

test("Add to Day N pins an experience, and the pin survives edits", () => {
  const p = buildPlan({ days: 8, from: "cok", to: "cok", party: "couple", pace: "balanced", month: 0, interests: ["backwaters", "hills"] }, DATA);
  const alleppeyDays = p.days.filter((d) => d.base === "alappuzha").map((d) => d.n);
  assert.ok(alleppeyDays.length >= 2, "test needs two days in Alappuzha");
  const lastDay = alleppeyDays[alleppeyDays.length - 1];
  const pinned = buildPlan(edits.pin(p, DATA, "toddy-shop", lastDay), DATA);
  assert.ok(pinned.days.find((d) => d.n === lastDay).try.includes("toddy-shop"));
  assert.equal(pinned.days.flatMap((d) => d.try).filter((x) => x === "toddy-shop").length, 1, "only once");
  // Survives a cheaper edit.
  assert.ok(buildPlan(edits.cheaper(pinned, DATA), DATA).days.some((d) => d.try.includes("toddy-shop")));
  // Pinning something in a town that isn't in the plan adds the town.
  const outside = DATA.doings.find((x) => !p.stops.some((s) => s.base === x.base));
  const added = buildPlan(edits.pin(p, DATA, outside.id, 1), DATA);
  assert.ok(added.stops.some((s) => s.base === outside.base));
  assert.ok(added.days.some((d) => d.try.includes(outside.id)));
  // Unpinning removes it.
  assert.equal(buildPlan(edits.unpin(pinned, DATA, "toddy-shop"), DATA).inputs.pins["toddy-shop"], undefined);
});

test("share links round-trip", () => {
  const p = buildPlan({ days: 8, from: "ccj", to: "cok", party: "family", budget: "high", pace: "relaxed", month: 11, interests: ["wildlife", "food"], mustSee: ["wayanad/chembra"], exclude: ["kannur"], nights: { wayanad: 3 }, pins: { "chembra-trek": 1 } }, DATA);
  const again = buildPlan(decode(encode(p.inputs)), DATA);
  assert.equal(JSON.stringify(again.stops), JSON.stringify(p.stops));
  assert.equal(JSON.stringify(again.days), JSON.stringify(p.days));
});

test("bad input never throws", () => {
  for (const bad of [{}, null, { days: -3 }, { days: 99, from: "xyz", interests: ["nope"], mustSee: [42] }, decode("garbage")]) {
    const p = buildPlan(bad, DATA);
    assert.ok(p.days.length >= 2 && p.days.length <= 21);
  }
});
