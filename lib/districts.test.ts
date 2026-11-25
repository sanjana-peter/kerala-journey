import { test } from "node:test";
import assert from "node:assert/strict";
import { districts, everyday, regionDistrict } from "./districts.ts";
import { spiceRegions } from "./experience.ts";
import { districtForSpiceRegion, festivalsIn, nearestDistrictAirport } from "./explore.ts";
import { routeOrder } from "./keralaData.ts";

test("all 14 districts, north to south, each once", () => {
  assert.equal(districts.length, 14);
  assert.equal(new Set(districts.map((d) => d.id)).size, 14);
  for (let i = 1; i < districts.length; i++) {
    assert.ok(districts[i].coords[0] < districts[i - 1].coords[0] + 0.3, `${districts[i].name} is out of north–south order`);
  }
});

test("every planner base and spice district maps to a district", () => {
  for (const r of routeOrder) assert.ok(regionDistrict[r], r);
  for (const s of spiceRegions) assert.ok(districtForSpiceRegion(s), s);
});

test("every district festival is a real festival in the season data", () => {
  for (const d of districts) assert.equal(festivalsIn(d.id).length, d.festivals.length, `${d.name}: ${d.festivals.join(", ")}`);
});

test("everyday items are unique and point at real districts", () => {
  assert.equal(new Set(everyday.map((e) => e.id)).size, everyday.length);
  const ids = new Set(districts.map((d) => d.id));
  for (const e of everyday) assert.ok(e.district === null || ids.has(e.district), e.id);
});

test("the far north flies from Kannur or Mangaluru, the capital from TRV", () => {
  assert.ok(["CNN", "IXE"].includes(nearestDistrictAirport("kasaragod").code));
  assert.equal(nearestDistrictAirport("kannur").code, "CNN");
  assert.equal(nearestDistrictAirport("thiruvananthapuram").code, "TRV");
});
