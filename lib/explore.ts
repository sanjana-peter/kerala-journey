/*
 * Links between the data sets, for the deep-dive pages (/places, /vibes, /spices, /months).
 *
 * regionPhotos    – photos of each place, the hero first. Kovalam has none yet, so its page uses a plain hero.
 * Districts join everything else: a place is in a district, and a district grows spices and holds festivals.
 */
import { gateways, legs, months, regions, routeOrder, vibes, type GatewayId, type NodeId, type Region, type RegionId, type VibeId } from "./keralaData.ts";
import { seasons, spices, type Festival, type PhotoId, type Spice, type SpiceRegion } from "./experience.ts";
import { districtAirports, districtById, districts, everyday, regionDistrict, type District, type DistrictId, type Everyday } from "./districts.ts";

export const regionPhotos: Record<RegionId, PhotoId[]> = {
  wayanad: ["wayanad-chembra"],
  kochi: ["kochi-nets"],
  munnar: ["munnar-tea", "munnar-mist"],
  thekkady: ["thekkady-elephants", "thekkady-lake"],
  kumarakom: ["kumarakom-sunset"],
  alleppey: ["alleppey-houseboat", "kuttanad-paddy", "kuttanad-storm", "snake-boats"],
  varkala: ["varkala-cliff", "varkala-beach"],
  kovalam: [],
};

export const placesInRouteOrder: Region[] = routeOrder.map((id) => regions[id]);

export const isRegionId = (id: string): id is RegionId => id in regions;
export const isVibeId = (id: string): id is VibeId => vibes.some((v) => v.id === id);

export const vibeOf = (id: VibeId) => vibes.find((v) => v.id === id)!;

/** Spices grown in the district a place is in. */
export function spicesFor(region: RegionId): Spice[] {
  return spicesIn(regionDistrict[region]);
}

/** Places you can stay in to be near where a spice grows. */
export function placesFor(spice: Spice): Region[] {
  return placesInRouteOrder.filter((r) => {
    const d = districtById[regionDistrict[r.id]].spice;
    return d !== undefined && spice.regions.includes(d);
  });
}

// ─── Districts ────────────────────────────────────────────────────────────────

export const districtOf = (region: RegionId): District => districtById[regionDistrict[region]];

/** The spice matrix names districts by their old spellings ("Alleppey"); this maps them back. */
export function districtForSpiceRegion(r: SpiceRegion): District {
  return districts.find((d) => d.spice === r)!;
}

export const spicesIn = (id: DistrictId): Spice[] => {
  const d = districtById[id].spice;
  return d ? spices.filter((s) => s.regions.includes(d)) : [];
};

export const placesIn = (id: DistrictId): Region[] => placesInRouteOrder.filter((r) => regionDistrict[r.id] === id);

export const everydayIn = (id: DistrictId): Everyday[] => everyday.filter((e) => e.district === id);

/** A district's festivals, each with the month it falls in. */
export function festivalsIn(id: DistrictId): { festival: Festival; month: number }[] {
  return districtById[id].festivals.flatMap((name) => {
    const month = seasons.findIndex((s) => s.festivals.some((f) => f.name === name));
    return month < 0 ? [] : [{ festival: seasons[month].festivals.find((f) => f.name === name)!, month }];
  });
}

export function nearestDistrictAirport(id: DistrictId): { name: string; code: string; km: number } {
  const [a, d] = districtAirports.map((a) => [a, km(a.coords, districtById[id].coords)] as const).sort((x, y) => x[1] - y[1])[0];
  return { name: a.name, code: a.code, km: Math.max(5, Math.round(d / 5) * 5) };
}

/** Every place with a curated transit leg to or from this one, airports included, in route order. */
export function connectionsOf(region: RegionId): NodeId[] {
  const other = legs.flatMap((l) => (l.between[0] === region ? [l.between[1]] : l.between[1] === region ? [l.between[0]] : []));
  const rank = (n: NodeId) => (n in regions ? regions[n as RegionId].order : -1);
  return [...new Set(other)].sort((a, b) => rank(a) - rank(b));
}

function km([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]): number {
  const rad = Math.PI / 180;
  const a = Math.sin(((lat2 - lat1) * rad) / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lon2 - lon1) * rad) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

export function nearestAirport(region: RegionId): { id: GatewayId; city: string; km: number } {
  const [g, d] = (Object.values(gateways))
    .map((g) => [g, km(g.coords, regions[region].coords)] as const)
    .sort((a, b) => a[1] - b[1])[0];
  return { id: g.id, city: g.city, km: Math.round(d / 5) * 5 };
}

// ─── Months ───────────────────────────────────────────────────────────────────

export const monthSlug = (i: number) => months[i].name.toLowerCase();
export const monthIndex = (slug: string) => months.findIndex((m) => m.name.toLowerCase() === slug);

/** "Feb–Mar", "Jun, Aug", "May–Sep": a compact list of 0-based months. */
export function formatMonths(list: number[]): string {
  const sorted = [...list].sort((a, b) => a - b);
  const runs: [number, number][] = [];
  for (const m of sorted) {
    const last = runs[runs.length - 1];
    if (last && m === last[1] + 1) last[1] = m;
    else runs.push([m, m]);
  }
  return runs.map(([a, b]) => (a === b ? months[a].short : `${months[a].short}–${months[b].short}`)).join(", ");
}

/** Activities that are closed or off-season in a month, with the place they're in. */
export function closedIn(month: number): { region: Region; name: string; note: string }[] {
  return placesInRouteOrder.flatMap((r) =>
    r.activities.filter((a) => a.closedMonths?.includes(month)).map((a) => ({ region: r, name: a.name, note: a.note })),
  );
}
