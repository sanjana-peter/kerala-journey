// Tests for js/journeys.js:  node --test scripts/journeys.test.mjs   (no dependencies)
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const W = { window: {} };
W.window = W;
for (const f of ["data/districts.js", "data/food.js", "data/visit.js", "data/plan.js", "data/doings.js", "planner.js", "journeys.js"])
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js", f), "utf8"), W);

const DATA = {
  plan: W.KERALA_PLAN,
  doings: W.KERALA_DOINGS,
  districts: W.KERALA_DISTRICTS,
  food: W.KERALA_FOOD,
  tastes: W.KERALA_TASTES,
  visit: W.KERALA_VISIT,
  climates: W.KERALA_CLIMATES,
};
const J = W.KERALA_JOURNEYS;
// Objects made inside the vm come from another realm, so compare them as JSON.
const same = (a, b, msg) => assert.equal(JSON.stringify(a), JSON.stringify(b), msg);
const { buildPlan } = W.KERALA_PLANNER;
const now = new Date("2026-10-04T10:00:00Z");
const week = buildPlan({ days: 7, from: "cok", to: "cok", party: "couple", budget: "mid", pace: "balanced", month: 0, interests: ["hills", "backwaters"] }, DATA);

test("a journey from a plan copies its days and only known items", () => {
  const j = J.fromPlan(week, DATA, { start: "2027-01-10", now });
  assert.equal(j.days.length, 7);
  assert.equal(j.from, "cok");
  assert.match(j.title, /^7 days: /);
  for (const d of j.days) for (const k of d.items) assert.ok(J.known(k, DATA), k);
  assert.ok(j.days.some((d) => d.items.some((k) => k.startsWith("taste:"))), "includes food-passport tastes");
  assert.equal(J.dayDate(j, 1), "2027-01-10");
  assert.equal(J.dayDate(j, 3), "2027-01-12");
  assert.equal(J.dayDate({ ...j, start: null }, 3), null);
  assert.ok(J.km(j, DATA) > 100);
  assert.equal(J.km(j, DATA), week.km, "same route, same km as the plan");
});

test("a blank journey grows day by day without repeating places", () => {
  let j = J.blank(DATA, { now });
  assert.equal(j.days.length, 0);
  assert.equal(J.km(j, DATA), 0);
  j = J.addDay(j, DATA, "munnar");
  j = J.addDay(j, DATA, "munnar");
  j = J.addDay(j, DATA, "nowhere");
  assert.equal(j.days.length, 2);
  const first = new Set(j.days[0].items);
  assert.ok(j.days[1].items.every((k) => !first.has(k)), "day 2 doesn't repeat day 1");
  same(J.stops(j), ["munnar"]);
  j = J.addDay(j, DATA, "alappuzha");
  same(J.stops(j), ["munnar", "alappuzha"]);
  j = J.removeDay(j, 1);
  same(j.days.map((d) => d.n), [1, 2]);
});

test("items, notes, photos and reviews", () => {
  let j = J.addDay(J.blank(DATA, { now }), DATA, "kochi");
  j = J.addItem(j, 1, "xp:kathakali-show");
  j = J.addItem(j, 1, "xp:kathakali-show");
  assert.equal(j.days[0].items.filter((k) => k === "xp:kathakali-show").length, 1);
  j = J.removeItem(j, 1, "xp:kathakali-show");
  assert.ok(!j.days[0].items.includes("xp:kathakali-show"));
  j = J.setNote(j, 1, "Rain in the afternoon");
  assert.equal(j.days[0].note, "Rain in the afternoon");
  j = J.addPhoto(j, 1, "p1");
  j = J.addPhoto(j, 1, "p2");
  j = J.removePhoto(j, "p1");
  same(j.days[0].photos, ["p2"]);
  j = J.setReview(j, "dish:appam-stew", { stars: 9 });
  assert.equal(j.reviews["dish:appam-stew"].stars, 5);
  j = J.setReview(j, "dish:appam-stew", { text: "Soft and lacy" });
  same(j.reviews["dish:appam-stew"], { stars: 5, text: "Soft and lacy" });
  j = J.setReview(j, "dish:appam-stew", { stars: 0, text: "" });
  assert.equal(j.reviews["dish:appam-stew"], undefined);
});

test("stats count only known items", () => {
  const j = J.fromPlan(week, DATA, { now });
  const s = J.stats(
    { done: ["place:idukki/munnar", "dish:cardamom", "taste:sulaimani", "xp:nope", "junk", "place:idukki/cardamom"], stamps: { idukki: "2026-10-01" }, journeys: [j] },
    DATA
  );
  assert.equal(s.districts, 1);
  assert.equal(s.places, 1, "the dish isn't counted as a place");
  assert.equal(s.food, 2);
  assert.equal(s.foodTotal, DATA.food.length + DATA.tastes.length);
  assert.equal(s.experiences, 0);
  assert.equal(s.km, week.km);
  assert.equal(s.journeys, 1);
});

test("clean() repairs stored journeys", () => {
  same(J.clean("nope", DATA), []);
  const good = J.fromPlan(week, DATA, { now });
  const messy = [
    null,
    { id: 3 },
    {
      ...good,
      start: "soon",
      from: "xyz",
      days: [{ base: "atlantis" }, { ...good.days[0], items: [...good.days[0].items, "place:nowhere/x"], photos: [1, "p"] }],
      reviews: { "dish:cardamom": { stars: "4" }, "dish:nope": { stars: 5 } },
    },
  ];
  const [j] = J.clean(messy, DATA);
  assert.equal(j.start, null);
  assert.equal(j.from, null);
  assert.equal(j.days.length, 1);
  assert.equal(j.days[0].n, 1);
  same(j.days[0].items, good.days[0].items);
  same(j.days[0].photos, ["p"]);
  same(j.reviews, { "dish:cardamom": { stars: 4, text: "" } });
});
