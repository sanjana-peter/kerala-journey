import { test } from "node:test";
import assert from "node:assert/strict";
import { buildItinerary, findLeg, type TripInput } from "./planner.ts";
import { regions, type Pace, type Traveler, type TripLength, type VibeId } from "./keralaData.ts";
import { toMarkdown } from "./dossier.ts";

const VIBES: VibeId[] = ["mist", "backwaters", "coast", "wild"];
const LENGTHS: TripLength[] = [3, 5, 7, 10];
const PACES: Pace[] = ["relaxed", "packed"];
const TRAVELERS: Traveler[] = ["solo", "couple", "family", "friends"];

function* everyInput(): Generator<TripInput> {
  for (let mask = 1; mask < 16; mask++) {
    const vibes = VIBES.filter((_, i) => mask & (1 << i));
    for (const days of LENGTHS) for (const pace of PACES) for (const traveler of TRAVELERS) {
      yield { vibes, days, pace, traveler, month: null };
    }
  }
}

test("every combination gives the right number of days and nights", () => {
  for (const input of everyInput()) {
    const it = buildItinerary(input);
    const nights = it.stops.reduce((n, s) => n + s.nights, 0);
    assert.equal(nights, input.days - 1, JSON.stringify(input));
    assert.equal(it.days.length, input.days, JSON.stringify(input));
    assert.deepEqual(it.days.map((d) => d.day), it.days.map((_, i) => i + 1));
  }
});

test("routes never double back", () => {
  for (const input of everyInput()) {
    const order = buildItinerary(input).stops.map((s) => regions[s.region].order);
    assert.deepEqual(order, [...order].sort((a, b) => a - b), JSON.stringify(input));
  }
});

test("every leg uses curated transit data", () => {
  for (const input of everyInput()) {
    for (const leg of buildItinerary(input).legs) {
      assert.equal(leg.estimated, false, `${leg.from} → ${leg.to} for ${JSON.stringify(input)}`);
    }
  }
});

test("no activity appears twice in a trip", () => {
  for (const input of everyInput()) {
    const ids = buildItinerary(input).days.flatMap((d) => d.items.map((a) => a.id));
    assert.equal(new Set(ids).size, ids.length, JSON.stringify(input));
  }
});

test("families never get activities marked unsuitable for them", () => {
  const it = buildItinerary({ vibes: ["mist", "wild"], days: 10, pace: "packed", traveler: "family", month: null });
  const ids = it.days.flatMap((d) => d.items.map((a) => a.id));
  for (const id of ["meesapulimala", "bamboo-rafting", "chembra"]) assert.ok(!ids.includes(id), id);
  assert.ok(it.skipped.some((s) => s.name.includes("Meesapulimala")));
});

test("closed activities are left out in their months", () => {
  const it = buildItinerary({ vibes: ["mist"], days: 5, pace: "packed", traveler: "couple", month: 1 });
  assert.ok(!it.days.some((d) => d.items.some((a) => a.id === "eravikulam")));
  assert.ok(it.skipped.some((s) => s.name.startsWith("Eravikulam")));
});

test("cautions are attached for the traveller type", () => {
  const it = buildItinerary({ vibes: ["backwaters"], days: 3, pace: "relaxed", traveler: "solo", month: null });
  const boat = it.days.flatMap((d) => d.items).find((a) => a.id === "houseboat");
  assert.ok(boat, "houseboat scheduled");
  assert.match(boat.caution ?? "", /expensive/);
});

test("the classic week: Kochi → Munnar → Alleppey with a houseboat night", () => {
  const it = buildItinerary({ vibes: ["mist", "backwaters"], days: 7, pace: "relaxed", traveler: "couple", month: null });
  assert.equal(it.arrival, "COK");
  assert.equal(it.departure, "COK");
  assert.deepEqual(it.stops.map((s) => s.region), ["kochi", "munnar", "alleppey"]);
  assert.ok(it.days.some((d) => d.items.some((a) => a.overnight)));
});

test("beach trips fly in and out of Thiruvananthapuram", () => {
  const it = buildItinerary({ vibes: ["coast"], days: 5, pace: "relaxed", traveler: "friends", month: null });
  assert.equal(it.arrival, "TRV");
  assert.equal(it.departure, "TRV");
});

test("Wayanad comes in through Kozhikode and goes south through Kochi", () => {
  const it = buildItinerary({ vibes: ["mist", "backwaters"], days: 10, pace: "relaxed", traveler: "couple", month: null });
  if (it.stops[0].region === "wayanad") {
    assert.equal(it.arrival, "CCJ");
    assert.equal(it.stops[1].region, "kochi");
  }
});

test("too few days for every vibe produces a warning", () => {
  const it = buildItinerary({ vibes: ["mist", "backwaters", "coast", "wild"], days: 3, pace: "relaxed", traveler: "couple", month: null });
  assert.ok(it.warnings.some((w) => w.startsWith("Not enough days")));
});

test("legs work in both directions", () => {
  assert.equal(findLeg("munnar", "kochi").estimated, false);
  assert.equal(findLeg("kochi", "munnar").km, findLeg("munnar", "kochi").km);
});

test("the dossier contains the plan, transit and emergency numbers", () => {
  const md = toMarkdown(buildItinerary({ vibes: ["mist", "backwaters"], days: 7, pace: "relaxed", traveler: "family", month: 11 }));
  assert.match(md, /^# /);
  assert.match(md, /Day 1/);
  assert.match(md, /Day 7/);
  assert.match(md, /KSRTC/);
  assert.match(md, /112/);
  assert.match(md, /Packing/);
});
