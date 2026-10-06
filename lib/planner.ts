/*
 * Builds a day-by-day itinerary from the wizard's answers.
 *
 * 1. Pick stops: the main region of each chosen vibe gets its minimum nights, then is topped up towards
 *    its ideal; Kochi is added as an easy first night on longer trips; second-choice regions fill what's left.
 * 2. Order stops along the classic loop (routeOrder), so the route never doubles back.
 * 3. Choose the airports nearest the first and last stop.
 * 4. Fill each day with activities that fit the hours left after travel, skipping ones that don't suit the
 *    traveller or are closed that month.
 */
import {
  gateways, legs, months, regions, routeOrder, vibes,
  type Activity, type GatewayId, type Leg, type NodeId, type Pace, type RegionId, type TransitOption,
  type Traveler, type TripLength, type VibeId, type When,
} from "./keralaData.ts";
import type { Source } from "./sources.ts";

export interface TripInput {
  vibes: VibeId[];
  days: TripLength;
  pace: Pace;
  traveler: Traveler;
  /** 0 = January; null = not decided. */
  month: number | null;
}

export interface Stop {
  region: RegionId;
  nights: number;
}

export interface ResolvedLeg {
  from: NodeId;
  to: NodeId;
  km: number;
  options: TransitOption[];
  tips: string[];
  /** True when the leg isn't in the data and was estimated from distance. */
  estimated: boolean;
  sources: Source[];
}

export interface PlannedActivity extends Activity {
  caution?: string;
}

export interface DayPlan {
  day: number;
  /** Where you sleep tonight; null on the last day. */
  base: RegionId | null;
  title: string;
  travel?: ResolvedLeg;
  items: PlannedActivity[];
  note?: string;
}

export interface Itinerary {
  input: TripInput;
  arrival: GatewayId;
  departure: GatewayId;
  stops: Stop[];
  legs: ResolvedLeg[];
  days: DayPlan[];
  /** Things the traveller should know about this trip as a whole. */
  warnings: string[];
  skipped: { name: string; region: RegionId; reason: string }[];
}

export const DEFAULT_INPUT: TripInput = { vibes: ["mist", "backwaters"], days: 7, pace: "relaxed", traveler: "couple", month: null };

const COAST: RegionId[] = ["varkala", "kovalam"];

export const travelerLabels: Record<Traveler, string> = { solo: "Solo travellers", couple: "Couples", family: "Families with kids", friends: "Groups of friends" };

export function placeName(id: NodeId): string {
  return id in regions ? regions[id as RegionId].name : gateways[id as GatewayId].city + " airport";
}

// ─── 1–2. Stops ───────────────────────────────────────────────────────────────

export function pickStops(input: TripInput): Stop[] {
  const chosenVibes = input.vibes.length ? input.vibes : DEFAULT_INPUT.vibes;
  const totalNights = input.days - 1;
  const nightsOf = (id: RegionId) => regions[id].nights[input.pace];
  const primaries = chosenVibes.map((v) => vibes.find((x) => x.id === v)!.regions[0]);
  const secondaries = chosenVibes.flatMap((v) => vibes.find((x) => x.id === v)!.regions.slice(1));

  const stops = new Map<RegionId, number>();
  let budget = totalNights;

  // Main regions at their minimum.
  for (const id of primaries) {
    const [min] = nightsOf(id);
    if (min <= budget) { stops.set(id, min); budget -= min; }
  }
  // Nothing fit (e.g. a relaxed 3-day trip): give everything to the first vibe.
  if (stops.size === 0) { stops.set(primaries[0], totalNights); budget = 0; }

  // Top up towards the ideal.
  for (const id of stops.keys()) {
    const add = Math.min(nightsOf(id)[1] - stops.get(id)!, budget);
    if (add > 0) { stops.set(id, stops.get(id)! + add); budget -= add; }
  }

  // Kochi as a first night, on trips long enough to afford it, when the route goes through central Kerala.
  const central = [...stops.keys()].some((id) => !COAST.includes(id));
  if (input.days >= 5 && central && budget >= 1) {
    const n = Math.min(nightsOf("kochi")[1], budget);
    stops.set("kochi", n);
    budget -= n;
  }

  // Second-choice regions with what's left.
  for (const id of secondaries) {
    if (stops.has(id)) continue;
    if (id === "kumarakom" && stops.has("alleppey")) continue; // same lake, same experience
    if (id === "wayanad") {
      // A detour to the far north: only on a week or more, and with Kochi as the bridge back south.
      if (input.days < 7 || (stops.size > 0 && !stops.has("kochi"))) continue;
    }
    const [min] = nightsOf(id);
    if (min <= budget) { stops.set(id, min); budget -= min; }
  }

  // Spread leftover nights over the real destinations (not Kochi), up to two over ideal each.
  const fillable = [...stops.keys()].filter((id) => id !== "kochi");
  let guard = 0;
  while (budget > 0 && guard++ < 50) {
    let placed = false;
    for (const id of fillable) {
      if (budget === 0) break;
      if (stops.get(id)! < nightsOf(id)[1] + 2) { stops.set(id, stops.get(id)! + 1); budget--; placed = true; }
    }
    if (!placed) break;
  }
  if (budget > 0) { const first = fillable[0] ?? [...stops.keys()][0]; stops.set(first, stops.get(first)! + budget); budget = 0; }

  return routeOrder.filter((id) => stops.has(id)).map((id) => ({ region: id, nights: stops.get(id)! }));
}

export function gatewaysFor(stops: Stop[]): { arrival: GatewayId; departure: GatewayId } {
  const near = (id: RegionId): GatewayId => (id === "wayanad" ? "CCJ" : COAST.includes(id) ? "TRV" : "COK");
  return { arrival: near(stops[0].region), departure: near(stops[stops.length - 1].region) };
}

// ─── Legs ─────────────────────────────────────────────────────────────────────

function coordsOf(id: NodeId): [number, number] {
  return id in regions ? regions[id as RegionId].coords : gateways[id as GatewayId].coords;
}

function haversineKm([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]): number {
  const r = (d: number) => (d * Math.PI) / 180;
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lon2 - lon1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

const roundTo = (n: number, step: number) => Math.round(n / step) * step;

export function findLeg(from: NodeId, to: NodeId): ResolvedLeg {
  const hit: Leg | undefined = legs.find(
    (l) => (l.between[0] === from && l.between[1] === to) || (l.between[0] === to && l.between[1] === from),
  );
  if (hit) return { from, to, km: hit.km, options: hit.options, tips: hit.tips, estimated: false, sources: hit.sources ?? [] };

  // Estimate: road distance ≈ 1.35 × straight line; ~30 km/h if either end is in the hills, ~40 km/h otherwise.
  const km = roundTo(haversineKm(coordsOf(from), coordsOf(to)) * 1.35, 5);
  const hills = [from, to].some((id) => id in regions && regions[id as RegionId].hills);
  const h = km / (hills ? 30 : 40);
  return {
    from, to, km, estimated: true, sources: [],
    options: [{
      mode: "cab", label: "Private cab", per: "car",
      hours: [roundTo(h * 0.9, 0.5), roundTo(h * 1.15, 0.5)],
      cost: [roundTo(km * 20, 100), roundTo(km * 26, 100)],
      how: "Book through your stay. This leg isn't in our transit data, so the times and fares are estimates.",
    }],
    tips: ["Estimated from distance. Ask your host for the current road conditions."],
  };
}

// ─── 4. Days ──────────────────────────────────────────────────────────────────

const WHEN_ORDER: When[] = ["Sunrise", "Morning", "Any time", "Afternoon", "Evening"];
const MORNING: When[] = ["Sunrise", "Morning", "Any time"];
const LATER: When[] = ["Any time", "Afternoon", "Evening"];

function usable(a: Activity, input: TripInput): string | null {
  if (a.avoidFor?.includes(input.traveler)) return `not suited to ${travelerLabels[input.traveler].toLowerCase()}`;
  if (input.month !== null && a.closedMonths?.includes(input.month)) return `usually closed or unsafe in ${months[input.month].name}`;
  return null;
}

/** Picks activities from `pool` (removing them) that fit `hours` and the time of day. */
function take(pool: Activity[], hours: number, slots: When[] | null, input: TripInput): PlannedActivity[] {
  const out: PlannedActivity[] = [];
  let left = hours;
  for (let i = 0; i < pool.length && left > 0; ) {
    const a = pool[i];
    if (a.hours <= left + 0.25 && (!slots || slots.includes(a.when))) {
      out.push(plan(a, input));
      left -= a.hours;
      pool.splice(i, 1);
    } else i++;
  }
  return out.sort((x, y) => WHEN_ORDER.indexOf(x.when) - WHEN_ORDER.indexOf(y.when));
}

const plan = (a: Activity, input: TripInput): PlannedActivity => ({ ...a, caution: a.cautionFor?.[input.traveler] });

const maxHours = (leg: ResolvedLeg) => leg.options[0].hours[1];

export function buildItinerary(input: TripInput): Itinerary {
  const stops = pickStops(input);
  const { arrival, departure } = gatewaysFor(stops);
  const nodes: NodeId[] = [arrival, ...stops.map((s) => s.region), departure];
  const route = nodes.slice(1).map((to, i) => findLeg(nodes[i], to));

  const packed = input.pace === "packed";
  const fullDay = packed ? 9 : 5;
  const skipped: Itinerary["skipped"] = [];

  // Activity pools per stop, with unsuitable ones set aside.
  const pools = new Map<RegionId, Activity[]>();
  for (const s of stops) {
    const pool: Activity[] = [];
    for (const a of regions[s.region].activities) {
      const why = usable(a, input);
      if (why) skipped.push({ name: a.name, region: s.region, reason: why });
      else pool.push(a);
    }
    pools.set(s.region, pool);
  }

  const days: DayPlan[] = [];
  // mornings[i]: something quick to do before setting off on route[i]
  const mornings: PlannedActivity[][] = route.map(() => []);
  const beforeLeaving = (i: number) => mornings[i].map((a) => ({ ...a, note: `Before you leave: ${a.note}` }));
  let day = 1;
  stops.forEach((s, i) => {
    const region = regions[s.region];
    const pool = pools.get(s.region)!;
    const inbound = route[i];
    const from = placeName(inbound.from);
    // An overnight activity (the houseboat) gets a day of its own: the arrival day on a one-night stop
    // (boats board at noon, so leave early), otherwise the last full day.
    const overnightAt = pool.findIndex((a) => a.overnight);
    const overnight = overnightAt >= 0 ? plan(pool.splice(overnightAt, 1)[0], input) : null;

    // Arrival day: whatever time is left after the journey, in the afternoon/evening.
    // On day 1 the flight takes time too, so assume half the evening is gone.
    const evening = Math.max(0, (packed ? 9 : 6.5) - maxHours(inbound) - 1 - (i === 0 ? 1.5 : 0));
    const arrivalItems = overnight && s.nights === 1 ? [overnight] : take(pool, evening, LATER, input);
    days.push({
      day: day++,
      base: s.region,
      title: i === 0 ? `Land at ${placeName(arrival)} → ${region.name}` : `${from} → ${region.name}`,
      travel: inbound,
      items: [...beforeLeaving(i), ...arrivalItems],
      note: arrivalItems[0]?.overnight
        ? `Boats board around noon: set off by ${Math.max(5, Math.floor(12 - maxHours(inbound)))} am.`
        : arrivalItems.length ? undefined : "Check in, walk around, early night.",
    });

    // Full days at the stop.
    for (let n = 1; n < s.nights; n++) {
      const items = overnight && n === s.nights - 1
        ? [...take(pool, 3, MORNING, input), overnight]
        : take(pool, fullDay, null, input);
      days.push({
        day: day++,
        base: s.region,
        title: `${region.name}`,
        items,
        note: items.length === 0 ? `Free day: ${region.freeTime}`
          : items.some((a) => a.overnight) ? "Tonight you sleep on the boat."
          : !packed ? "Afternoon free." : undefined,
      });
    }

    // Morning before moving on: a quick activity if the next leg is short, or on a packed trip.
    const outbound = route[i + 1];
    const morning = maxHours(outbound) <= 3 ? (packed ? 3 : 2) : packed ? 1.5 : 0;
    mornings[i + 1] = take(pool, morning, MORNING, input);
  });

  // Last day: fly home.
  const last = route[route.length - 1];
  days.push({
    day: day++,
    base: null,
    title: `${placeName(last.from)} → ${placeName(departure)}, fly home`,
    travel: last,
    items: beforeLeaving(route.length - 1),
  });

  return { input, arrival, departure, stops, legs: route, days, warnings: warningsFor(input, stops, route), skipped };
}

function warningsFor(input: TripInput, stops: Stop[], route: ResolvedLeg[]): string[] {
  const out: string[] = [];
  if (input.month !== null) {
    const m = months[input.month];
    out.push(`${m.name}: ${m.note}`);
    if (m.climate === "monsoon" && stops.some((s) => regions[s.region].hills)) {
      out.push("Monsoon on hill roads: travel early in the day, check for landslide closures, and keep a spare day if you can.");
    }
    if (m.climate === "monsoon" && stops.some((s) => COAST.includes(s.region))) {
      out.push("The sea is closed to swimmers in the monsoon, and many cliff cafés in Varkala shut until September.");
    }
  }
  const long = route.filter((l) => maxHours(l) >= 5);
  if (long.length) {
    out.push(`Long travel day${long.length > 1 ? "s" : ""}: ${long.map((l) => `${placeName(l.from)} → ${placeName(l.to)}`).join(", ")}. Leave early and don't plan much else.`);
  }
  if (input.traveler === "family" && stops.filter((s) => regions[s.region].hills).length >= 2) {
    out.push("Two hill regions mean two long sets of hairpin bends. Pack motion-sickness medicine for the kids.");
  }
  const chosen = input.vibes.length ? input.vibes : DEFAULT_INPUT.vibes;
  const dropped = chosen.filter((v) => !stops.some((s) => regions[s.region].vibe === v));
  if (dropped.length) {
    out.push(`Not enough days for ${dropped.map((v) => vibes.find((x) => x.id === v)!.name).join(" and ")}. Add days or switch to a packed pace to fit it in.`);
  }
  if (stops.length === 1 && input.days >= 5) {
    out.push(`All ${input.days - 1} nights in ${regions[stops[0].region].name}. Pick another vibe to see more of Kerala.`);
  }
  return out;
}

/** Road hours over the whole trip, [best case, worst case], using the first (recommended) option of each leg. */
export function totalTravelHours(it: Itinerary): [number, number] {
  return it.legs.reduce<[number, number]>((acc, l) => [acc[0] + l.options[0].hours[0], acc[1] + l.options[0].hours[1]], [0, 0]);
}
