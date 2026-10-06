/*
 * Kerala Journey — everything the planner knows.
 *
 * vibes    – the four trip archetypes. `regions` lists the bases for that vibe, the main one first.
 * regions  – the towns a trip actually stays in, with what to do there.
 *   order    – west→east / north→south position on the classic loop. Itineraries visit stops in this order,
 *              so a route never doubles back across the state.
 *   nights   – [minimum, ideal] nights per pace
 * gateways – airports a trip starts and ends at
 * legs     – curated transit between two places (works in both directions). Pairs that aren't listed
 *            fall back to an estimate from straight-line distance, and the UI says so.
 *
 * Fares are 2025–26 ballpark figures in ₹, not quotes. Check facts that change (fares, opening days,
 * closures) at least once a season.
 */

import { src, type Source } from "./sources.ts";

export type VibeId = "mist" | "backwaters" | "coast" | "wild";
export type RegionId = "wayanad" | "kochi" | "munnar" | "thekkady" | "kumarakom" | "alleppey" | "varkala" | "kovalam";
export type GatewayId = "COK" | "TRV" | "CCJ";
export type NodeId = RegionId | GatewayId;
export type Traveler = "solo" | "couple" | "family" | "friends";
export type Pace = "relaxed" | "packed";
export type TripLength = 3 | 5 | 7 | 10;
export type When = "Sunrise" | "Morning" | "Any time" | "Afternoon" | "Evening";
export type TransitMode = "cab" | "bus" | "train" | "ferry" | "combo";

export interface Activity {
  id: string;
  name: string;
  hours: number;
  when: When;
  note: string;
  cost?: string;
  booking?: string;
  /** Left out of the itinerary entirely for these travellers. */
  avoidFor?: Traveler[];
  /** Kept, but shown with a warning for these travellers. */
  cautionFor?: Partial<Record<Traveler, string>>;
  /** 0 = January. Left out in these months. */
  closedMonths?: number[];
  /** Takes the evening and the night (houseboats). */
  overnight?: boolean;
  /** Where the opening days, rules and prices were checked. */
  sources?: Source[];
}

export interface Region {
  id: RegionId;
  name: string;
  area: string;
  vibe: VibeId | null;
  order: number;
  coords: [number, number];
  hills: boolean;
  tagline: string;
  nights: Record<Pace, [number, number]>;
  stayTip: string;
  freeTime: string;
  activities: Activity[];
}

export interface Vibe {
  id: VibeId;
  name: string;
  places: string;
  tagline: string;
  regions: RegionId[];
  bestMonths: string;
  suits: string;
  skipIf: string;
}

export interface Gateway {
  id: GatewayId;
  name: string;
  city: string;
  coords: [number, number];
}

export interface TransitOption {
  mode: TransitMode;
  label: string;
  hours: [number, number];
  cost: [number, number];
  per: "car" | "person" | "boat";
  how: string;
}

export interface Leg {
  between: [NodeId, NodeId];
  km: number;
  options: TransitOption[];
  tips: string[];
  /** Distance/time/fare cross-checks. Legs without sources are estimates from comparable routes. */
  sources?: Source[];
}

// ─── Vibes ────────────────────────────────────────────────────────────────────

export const vibes: Vibe[] = [
  {
    id: "mist",
    name: "Mist & Mountains",
    places: "Munnar · Wayanad",
    tagline: "Tea gardens, cool air, sunrise treks.",
    regions: ["munnar", "wayanad"],
    bestMonths: "Sep–Mar. Monsoon is lush but wet, foggy and full of leeches.",
    suits: "People who want cooler weather, walks and viewpoints.",
    skipIf: "You get car-sick easily: every road up is hairpin bends.",
  },
  {
    id: "backwaters",
    name: "Backwaters & Slow Living",
    places: "Alleppey · Kumarakom",
    tagline: "Houseboats, canals, village life.",
    regions: ["alleppey", "kumarakom"],
    bestMonths: "Nov–Feb. Aug brings the snake-boat races.",
    suits: "Couples, families, anyone happy to do very little, beautifully.",
    skipIf: "You get restless without a schedule. A houseboat day is mostly sitting and watching.",
  },
  {
    id: "coast",
    name: "Cliffside & Surf",
    places: "Varkala · Kovalam",
    tagline: "Sea breeze, cafés, laid-back beaches.",
    regions: ["varkala", "kovalam"],
    bestMonths: "Oct–Mar. Most cliff cafés close Jun–Aug.",
    suits: "Solo travellers, friends, remote workers.",
    skipIf: "You want Goa-style nightlife. Nights are quiet and alcohol is hard to find.",
  },
  {
    id: "wild",
    name: "Wild Rainforests",
    places: "Thekkady (Periyar)",
    tagline: "Wildlife boats, jungle walks, spice farms.",
    regions: ["thekkady"],
    bestMonths: "Oct–Apr. Animals come to the lake in the dry months (Feb–Apr).",
    suits: "Nature lovers, families with older kids.",
    skipIf: "You expect a guaranteed tiger. This is dense forest, and sightings are luck.",
  },
];

// ─── Gateways ─────────────────────────────────────────────────────────────────

export const gateways: Record<GatewayId, Gateway> = {
  COK: { id: "COK", name: "Kochi International Airport (COK)", city: "Kochi", coords: [10.152, 76.391] },
  TRV: { id: "TRV", name: "Thiruvananthapuram International Airport (TRV)", city: "Thiruvananthapuram", coords: [8.482, 76.92] },
  CCJ: { id: "CCJ", name: "Kozhikode International Airport (CCJ)", city: "Kozhikode", coords: [11.137, 75.955] },
};

// ─── Regions ──────────────────────────────────────────────────────────────────

export const regions: Record<RegionId, Region> = {
  wayanad: {
    id: "wayanad",
    name: "Wayanad",
    area: "Kalpetta / Vythiri",
    vibe: "mist",
    order: 0,
    coords: [11.608, 76.083],
    hills: true,
    tagline: "Coffee estates, caves and forest in the far north.",
    nights: { relaxed: [2, 3], packed: [2, 2] },
    stayTip: "Stay in a plantation homestay near Vythiri or Meppadi: central for most sights.",
    freeTime: "Slow morning on the estate, then a coffee-and-pepper walk with your host.",
    activities: [
      { id: "edakkal", name: "Edakkal Caves", hours: 3, when: "Morning", note: "Stone Age carvings at the top of a steep climb. Closed on Mondays and some public holidays; go early to beat the queue.", sources: src("ktEdakkal"), cautionFor: { family: "Steep rock steps and an iron ladder. Hard for small kids and bad knees." } },
      { id: "wayanad-safari", name: "Muthanga or Tholpetty jeep safari", hours: 2.5, when: "Sunrise", note: "Forest department jeeps run from opening time; in high season arrive an hour early to register. Both sanctuaries close for several weeks in the fire season (roughly March to April).", closedMonths: [2, 3], sources: src("wayanadSanctuary") },
      { id: "chembra", name: "Chembra Peak trek", hours: 5, when: "Sunrise", note: "Up to the heart-shaped lake with a forest department guide. Permits are first-come, first-served in the morning with a daily cap; in 2026 the trek ends at the lake and the summit is off-limits. Confirm before you go.", avoidFor: ["family"], sources: src("ktChembra", "chembraStatus") },
      { id: "banasura", name: "Banasura Sagar Dam", hours: 2, when: "Afternoon", note: "A huge earth dam with speedboats and easy walks. Good with kids." },
      { id: "estate-walk", name: "Coffee and spice estate walk", hours: 2, when: "Morning", note: "Most homestays will walk you through their coffee, pepper and cardamom." },
    ],
  },
  kochi: {
    id: "kochi",
    name: "Kochi",
    area: "Fort Kochi",
    vibe: null,
    order: 1,
    coords: [9.965, 76.242],
    hills: false,
    tagline: "Spice-trade port, colonial lanes, the easy first night.",
    nights: { relaxed: [2, 2], packed: [1, 1] },
    stayTip: "Stay in Fort Kochi, not Ernakulam: it's walkable and the old town is the point.",
    freeTime: "Café-hop around Princess Street and take the ferry to Ernakulam for ₹10.",
    activities: [
      { id: "fort-kochi-walk", name: "Fort Kochi heritage walk", hours: 3, when: "Morning", note: "Chinese fishing nets, St Francis Church, Santa Cruz Basilica. It's flat; start before 9 to beat the heat." },
      { id: "mattancherry", name: "Mattancherry Palace and Jew Town", hours: 2.5, when: "Morning", note: "Palace murals (10 am to 5 pm, closed Fridays) and the Paradesi Synagogue (closed Saturdays, and open only until 2 pm on Fridays).", sources: src("ktDutchPalace", "ktSynagogue") },
      { id: "kathakali", name: "Kathakali performance", hours: 2, when: "Evening", note: "Arrive an hour early to watch the make-up being applied. Regular nightly shows in Fort Kochi.", cost: "₹400–600" },
      { id: "water-metro", name: "Water Metro across the harbour", hours: 1.5, when: "Afternoon", note: "Electric ferries from the High Court terminal to Fort Kochi, Vypin or Bolgatty, about 7 am to 8 pm. A cheap harbour cruise.", cost: "₹20–40", sources: src("waterMetro") },
    ],
  },
  munnar: {
    id: "munnar",
    name: "Munnar",
    area: "Munnar town / Chithirapuram",
    vibe: "mist",
    order: 2,
    coords: [10.089, 77.06],
    hills: true,
    tagline: "Rolling tea estates at 1,600 m. Bring a jacket.",
    nights: { relaxed: [2, 3], packed: [1, 2] },
    stayTip: "Stay just outside town (Chithirapuram, Pallivasal, Pothamedu) for the views. Munnar town itself is noisy.",
    freeTime: "Walk the estate roads near your stay: the tea pickers start around 8 am.",
    activities: [
      { id: "eravikulam", name: "Eravikulam National Park (Rajamala)", hours: 3, when: "Morning", note: "Nilgiri tahr on the grassy slopes, 7:30 am to 4 pm. Closed every February and March for the calving season; reopens 1 April.", booking: "Book online at eravikulamnationalpark.in. Visitor numbers are capped daily, and weekends sell out.", closedMonths: [1, 2], sources: src("eravikulamReopen", "eravikulamBooking") },
      { id: "tea-walk", name: "Guided tea-estate walk", hours: 2, when: "Morning", note: "Your homestay can arrange a local guide. You walk through working estates, not along a road.", cost: "₹500–1,000" },
      { id: "tea-museum", name: "KDHP Tea Museum", hours: 1.5, when: "Afternoon", note: "Short film, old machinery and a working line from leaf to tea." },
      { id: "mattupetty", name: "Mattupetty Dam and Echo Point", hours: 2, when: "Afternoon", note: "Easy and scenic, crowded on weekends. Good with kids." },
      { id: "top-station", name: "Top Station viewpoint", hours: 4, when: "Sunrise", note: "About 35 km of winding road each way to look out over Tamil Nadu. Go early, before the mist comes in.", cautionFor: { family: "Long winding drive. Carry motion-sickness tablets for the kids." } },
      { id: "kolukkumalai", name: "Kolukkumalai sunrise jeep safari", hours: 5, when: "Sunrise", note: "Off-road 4×4 up to one of the highest tea estates. Leaves around 4 am.", cost: "₹2,500–3,500 per jeep", cautionFor: { family: "Very rough, bumpy ride. Not good with toddlers." } },
      { id: "meesapulimala", name: "Meesapulimala trek", hours: 8, when: "Sunrise", note: "Full-day guided trek, moderate to hard.", booking: "Permits only through KFDC (Kerala Forest Development Corporation), Munnar. No walk-ins.", avoidFor: ["family"], sources: src("meesapulimala") },
    ],
  },
  thekkady: {
    id: "thekkady",
    name: "Thekkady",
    area: "Kumily / Periyar",
    vibe: "wild",
    order: 3,
    coords: [9.602, 77.165],
    hills: true,
    tagline: "Periyar Tiger Reserve and the cardamom hills.",
    nights: { relaxed: [2, 2], packed: [1, 1] },
    stayTip: "Stay in Kumily within walking distance of the Periyar gate, so the 7 am boat is easy.",
    freeTime: "Browse the spice shops on Kumily's main road and take a slow walk along the forest edge.",
    activities: [
      { id: "periyar-boat", name: "Periyar lake boat safari", hours: 1.5, when: "Sunrise", note: "90-minute cruise. The first boat, at 7:30 am, gives the best chance of seeing elephants and gaur.", booking: "Book online in advance and reach the counter 45 minutes early.", sources: src("periyarBoating") },
      { id: "nature-walk", name: "Guided nature walk in Periyar", hours: 2.5, when: "Sunrise", note: "4–5 km in small groups with a tribal guide; slots from 7 am. Leech socks are handed out in wet months.", cost: "₹350 per person", cautionFor: { family: "Some forest programmes exclude young children. Check age rules when you book." }, sources: src("ktPeriyar") },
      { id: "spice-plantation", name: "Spice plantation tour", hours: 2, when: "Morning", note: "Cardamom, pepper, vanilla and coffee. Most tours end in a shop, and you don't have to buy." },
      { id: "kalari", name: "Kalaripayattu show", hours: 1, when: "Evening", note: "Kerala's martial art. Shows run nightly in Kumily from about 6 pm.", cost: "₹300–400" },
      { id: "bamboo-rafting", name: "Bamboo rafting and trek (full day)", hours: 8, when: "Sunrise", note: "Forest department eco-tourism programme; reporting 7:45 am, only three rafts a day.", cost: "₹2,400 per person (full day)", avoidFor: ["family"], sources: src("ktPeriyar") },
    ],
  },
  kumarakom: {
    id: "kumarakom",
    name: "Kumarakom",
    area: "Vembanad Lake, east shore",
    vibe: "backwaters",
    order: 4,
    coords: [9.617, 76.43],
    hills: false,
    tagline: "Quieter, resort-style backwaters on Vembanad Lake.",
    nights: { relaxed: [2, 2], packed: [1, 1] },
    stayTip: "Pick a lakeside stay with its own jetty: boats pick you up at the door.",
    freeTime: "Lie in a hammock by the lake. That's the plan.",
    activities: [
      { id: "bird-sanctuary", name: "Kumarakom Bird Sanctuary", hours: 2, when: "Sunrise", note: "Walk the trail at dawn. Migratory birds are best from Nov to Feb." },
      { id: "village-life", name: "Village life tour (Responsible Tourism)", hours: 3, when: "Morning", note: "Coir-making, toddy tapping and fishing with local families. Book through the state's Responsible Tourism Mission packages." },
      { id: "houseboat-day", name: "Houseboat day cruise", hours: 5, when: "Morning", note: "About 10 am to 5 pm on Vembanad, with lunch on board, and none of the overnight cost." },
      { id: "sunset-cruise", name: "Sunset cruise on Vembanad Lake", hours: 2, when: "Evening", note: "Motorboat or shikara from your stay's jetty." },
      { id: "ayurveda-kumarakom", name: "Ayurveda massage", hours: 1.5, when: "Afternoon", note: "Choose a centre the state classifies as Green Leaf or Olive Leaf." },
    ],
  },
  alleppey: {
    id: "alleppey",
    name: "Alleppey",
    area: "Alappuzha / Kuttanad",
    vibe: "backwaters",
    order: 5,
    coords: [9.498, 76.339],
    hills: false,
    tagline: "Houseboats, paddy fields below sea level, narrow canals.",
    nights: { relaxed: [2, 2], packed: [1, 1] },
    stayTip: "One night on a houseboat, and any extra nights in a canal-side homestay (cheaper and more local).",
    freeTime: "Rent a bicycle and ride the canal paths, or just watch the boats go by.",
    activities: [
      { id: "houseboat", name: "Overnight houseboat", hours: 5, when: "Afternoon", overnight: true, note: "Board at noon. No cruising after dusk: boats moor for the night around 5:30 to 6 pm, and checkout is 9 am. Book a licensed boat directly or through your stay, never from touts at the jetty.", sources: src("houseboatTimes"), cost: "₹8,000–15,000 per boat (1 bedroom, meals included)", cautionFor: { solo: "A private boat for one person is expensive. Take a day cruise or a shikara instead.", family: "Ask for a boat with railings on the upper deck." } },
      { id: "canoe", name: "Canoe or shikara through narrow canals", hours: 3, when: "Morning", note: "Small boats reach canals the houseboats can't.", cost: "Shikara ₹400–800/hour · canoe tour ₹700–1,000 per person", cautionFor: { family: "Insist on life jackets for the kids." } },
      { id: "village-walk", name: "Kuttanad village walk and toddy-shop lunch", hours: 3, when: "Afternoon", note: "Paddy fields below sea level, then fish curry and tapioca in a toddy shop.", cautionFor: { family: "Toddy shops serve palm wine. Ask for a family restaurant instead." } },
      { id: "alleppey-beach", name: "Alleppey Beach at sunset", hours: 1.5, when: "Evening", note: "An old pier and a wide beach. Not for swimming." },
      { id: "state-ferry", name: "State ferry ride", hours: 2.5, when: "Morning", note: "The public ferry towards Kottayam crosses the backwaters, the cheapest backwater cruise there is.", cost: "₹20–30" },
    ],
  },
  varkala: {
    id: "varkala",
    name: "Varkala",
    area: "North Cliff",
    vibe: "coast",
    order: 6,
    coords: [8.737, 76.703],
    hills: false,
    tagline: "Red laterite cliffs over the Arabian Sea.",
    nights: { relaxed: [2, 3], packed: [1, 2] },
    stayTip: "Stay on or just behind the North Cliff. Quieter options are at Odayam and Black Beach.",
    freeTime: "A long café breakfast on the cliff, a swim, a nap. Repeat.",
    activities: [
      { id: "cliff-walk", name: "North Cliff walk at sunset", hours: 2, when: "Evening", note: "Cafés and sunset views along the cliff path.", cautionFor: { family: "Some stretches of the cliff edge have no railing. Hold small hands." } },
      { id: "papanasam", name: "Swim at Papanasam Beach", hours: 2, when: "Morning", note: "Swim between the lifeguard flags. The currents are strong.", cautionFor: { family: "Strong undertow. Keep kids in the shallows." }, closedMonths: [5, 6, 7] },
      { id: "surf", name: "Beginner surf lesson", hours: 2, when: "Morning", note: "Schools on the cliff run 2-hour lessons from October to April.", cost: "₹1,500–2,500", closedMonths: [4, 5, 6, 7, 8], cautionFor: { family: "Fine for teenagers. Check the school's minimum age." } },
      { id: "kappil", name: "Kappil Beach and backwaters", hours: 2.5, when: "Afternoon", note: "Where the lake meets the sea, 9 km north. Quiet, with kayaks to rent." },
      { id: "janardhana", name: "Janardhana Swamy Temple", hours: 1, when: "Morning", note: "An ancient temple above the beach. Non-Hindus can't enter the inner shrine. Cover shoulders and knees." },
      { id: "yoga", name: "Drop-in yoga class", hours: 1.5, when: "Morning", note: "Dozens of shalas along the cliff run morning classes.", cost: "₹400–800" },
    ],
  },
  kovalam: {
    id: "kovalam",
    name: "Kovalam",
    area: "Lighthouse Beach",
    vibe: "coast",
    order: 7,
    coords: [8.4, 76.979],
    hills: false,
    tagline: "Crescent beaches next to the capital, Thiruvananthapuram.",
    nights: { relaxed: [2, 2], packed: [1, 1] },
    stayTip: "Stay near Lighthouse Beach for cafés, or Samudra Beach for quiet.",
    freeTime: "Beach morning, Ayurveda afternoon, seafood dinner on the promenade.",
    activities: [
      { id: "lighthouse", name: "Vizhinjam Lighthouse and Lighthouse Beach", hours: 2, when: "Evening", note: "Climb the lighthouse (small fee) for the view over the bay." },
      { id: "poovar", name: "Poovar estuary boat ride", hours: 3, when: "Morning", note: "Mangroves and a golden sandbar where the river meets the sea.", cost: "₹1,500–3,000 per boat" },
      { id: "padmanabhaswamy", name: "Padmanabhaswamy Temple, Thiruvananthapuram", hours: 2, when: "Morning", note: "Entry is for Hindus. Strict dress code: men in a mundu and no shirt, women in a sari or set-mundu (dhotis can be rented and worn over trousers). No phones inside. Anyone can see the gopuram and the East Fort area.", sources: src("ktPadmanabhaswamy", "padmanabhaswamyEntry") },
      { id: "napier", name: "Napier Museum", hours: 2.5, when: "Afternoon", note: "A striking Indo-Saracenic building next to the city zoo. Closed on Mondays and Wednesday mornings.", sources: src("napier") },
      { id: "ayurveda-kovalam", name: "Ayurveda treatment", hours: 1.5, when: "Afternoon", note: "Kovalam has plenty of Ayurveda centres. Choose one classified as Green Leaf or Olive Leaf." },
    ],
  },
};

export const routeOrder: RegionId[] = (Object.values(regions) as Region[])
  .sort((a, b) => a.order - b.order)
  .map((r) => r.id);

// ─── Transit legs ─────────────────────────────────────────────────────────────

const cab = (hours: [number, number], cost: [number, number], how = "Book through your stay, a local taxi stand, or Uber/Ola in cities. Agree the fare (and whether tolls and parking are included) before you leave."): TransitOption =>
  ({ mode: "cab", label: "Private cab", hours, cost, per: "car", how });

export const legs: Leg[] = [
  {
    between: ["COK", "kochi"], km: 45,
    options: [
      cab([1, 1.5], [1000, 1500], "Use the prepaid taxi counter outside arrivals, or the Uber/Ola pickup zone."),
      { mode: "bus", label: "KSRTC airport bus (AC)", hours: [1.5, 2], cost: [70, 150], per: "person", how: "Every 30–40 minutes from the bus stop near the terminal, via Aluva and Vyttila to Fort Kochi." },
    ],
    tips: ["Fort Kochi is on a peninsula. Rush-hour traffic on the bridges can add 30–45 minutes."],
    sources: src("airportBus"),
  },
  {
    between: ["COK", "munnar"], km: 110,
    options: [
      cab([3.5, 4.5], [3000, 4000]),
      { mode: "bus", label: "KSRTC bus from Aluva", hours: [4.5, 5.5], cost: [150, 250], per: "person", how: "Take a cab to Aluva KSRTC stand (about 20 min). Munnar buses leave roughly every hour in the morning." },
    ],
    tips: ["After Neriamangalam it's about two hours of hairpin bends. Eat light and sit in front.", "Cheeyappara and Valara waterfalls are right by the road on the way up."],
    sources: src("kochiMunnar", "uberKochiMunnar"),
  },
  {
    between: ["kochi", "munnar"], km: 130,
    options: [
      cab([4, 5], [3500, 4500]),
      { mode: "bus", label: "KSRTC bus", hours: [5, 6], cost: [150, 250], per: "person", how: "From Ernakulam KSRTC stand or Vyttila Hub. Morning departures are the most reliable." },
    ],
    tips: ["Leave by 8 am to get to Munnar before the afternoon mist and rain.", "The ghat section is winding. Take motion-sickness tablets 30 minutes before you go."],
    sources: src("kochiMunnar", "uberKochiMunnar"),
  },
  {
    between: ["munnar", "thekkady"], km: 95,
    options: [
      cab([3, 4], [3000, 4000]),
      { mode: "bus", label: "KSRTC bus", hours: [4.5, 5.5], cost: [120, 200], per: "person", how: "Only a few direct buses, mostly early morning, from Munnar KSRTC stand. Check times at the stand the day before." },
    ],
    tips: ["A beautiful drive through cardamom hills, but slow. Two routes: via Pooppara, or the shorter one via Rajakkad and Nedumkandam."],
    sources: src("munnarThekkady"),
  },
  {
    between: ["munnar", "alleppey"], km: 170,
    options: [
      cab([4.5, 5.5], [4000, 5000]),
      { mode: "bus", label: "KSRTC bus via Kottayam", hours: [6, 7], cost: [200, 300], per: "person", how: "Munnar → Kottayam, then a frequent bus or train to Alappuzha." },
    ],
    tips: ["If you're boarding a houseboat, leave Munnar by 7 am. Boats leave around noon."],
  },
  {
    between: ["munnar", "kumarakom"], km: 140,
    options: [
      cab([4, 5], [3800, 4800]),
      { mode: "bus", label: "KSRTC bus via Kottayam", hours: [5.5, 6.5], cost: [180, 280], per: "person", how: "Munnar → Kottayam (KSRTC stand), then a local bus or auto to Kumarakom (30 min)." },
    ],
    tips: ["The hills give way to flat paddy fields after Thodupuzha: the worst of the bends is in the first two hours."],
  },
  {
    between: ["thekkady", "kumarakom"], km: 115,
    options: [
      cab([3.5, 4], [3000, 4000]),
      { mode: "bus", label: "KSRTC bus to Kottayam + auto", hours: [4, 4.5], cost: [450, 600], per: "person", how: "Kumily → Kottayam buses run often (3.5 h). An auto from Kottayam to Kumarakom costs ₹300–400." },
    ],
    tips: ["The descent from the cardamom hills is winding for the first 90 minutes."],
  },
  {
    between: ["thekkady", "alleppey"], km: 140,
    options: [
      cab([4, 4.5], [3500, 4500]),
      { mode: "bus", label: "KSRTC bus via Kottayam", hours: [4.5, 5.5], cost: [180, 250], per: "person", how: "Kumily → Kottayam, then a bus or train to Alappuzha." },
    ],
    tips: ["Leave by 7:30 am if you're boarding a houseboat that day."],
  },
  {
    between: ["kochi", "alleppey"], km: 55,
    options: [
      { mode: "train", label: "Train", hours: [0.75, 1.25], cost: [30, 150], per: "person", how: "Ernakulam Jn (South) → Alappuzha, roughly hourly. Buy unreserved tickets on the RailOne app (it replaced UTS in March 2026) or at the counter." },
      { mode: "bus", label: "KSRTC bus", hours: [1.5, 2], cost: [70, 100], per: "person", how: "Frequent buses from Vyttila Hub, every 15–20 minutes." },
      cab([1.5, 2], [1800, 2500]),
    ],
    tips: ["Coastal highway (NH 66): flat and easy, but heavy traffic around Aroor."],
    sources: src("ersAlleppeyTrain", "railOne"),
  },
  {
    between: ["kochi", "kumarakom"], km: 55,
    options: [
      cab([1.5, 2], [2000, 2500]),
      { mode: "train", label: "Train to Kottayam + auto", hours: [1.5, 2], cost: [330, 550], per: "person", how: "Ernakulam → Kottayam (about 1 h), then an auto to Kumarakom for ₹300–400." },
    ],
    tips: [],
  },
  {
    between: ["kochi", "thekkady"], km: 165,
    options: [
      cab([4.5, 5.5], [4000, 5000]),
      { mode: "bus", label: "KSRTC bus", hours: [5.5, 6.5], cost: [200, 300], per: "person", how: "Direct buses from Ernakulam KSRTC stand to Kumily, mostly in the morning." },
    ],
    tips: ["The last two hours are winding hill road."],
  },
  {
    between: ["kochi", "varkala"], km: 165,
    options: [
      { mode: "train", label: "Train", hours: [3, 4.25], cost: [100, 500], per: "person", how: "Ernakulam Jn → Varkala Sivagiri: about 3 h by express, up to 4¼ h by passenger train. Book on IRCTC or RailOne. The station is 3 km from the cliff, and an auto costs ₹100–150." },
      cab([4, 5], [4500, 5500]),
    ],
    tips: ["The train beats the road: the coastal highway is slow and under construction in places."],
    sources: src("ersVarkalaTrain", "railOne"),
  },
  {
    between: ["alleppey", "varkala"], km: 110,
    options: [
      { mode: "train", label: "Train", hours: [2, 2.5], cost: [70, 400], per: "person", how: "Alappuzha → Varkala Sivagiri. Book on IRCTC or the RailOne app." },
      cab([2.5, 3.5], [3000, 3800]),
    ],
    tips: ["Houseboats check out at 9 am. A late-morning train gets you to Varkala for sunset."],
  },
  {
    between: ["kumarakom", "varkala"], km: 130,
    options: [
      { mode: "train", label: "Auto to Kottayam + train", hours: [3, 3.5], cost: [400, 700], per: "person", how: "Auto to Kottayam station (30 min, ₹300–400), then a train to Varkala Sivagiri (about 2.5 h)." },
      cab([3, 4], [3500, 4200]),
    ],
    tips: [],
  },
  {
    between: ["thekkady", "varkala"], km: 200,
    options: [
      cab([5, 6], [5000, 6000]),
      { mode: "combo", label: "Bus to Kottayam + train", hours: [6, 7], cost: [300, 600], per: "person", how: "Kumily → Kottayam by KSRTC (3.5 h), then a train to Varkala Sivagiri (2.5 h)." },
    ],
    tips: ["A long day. Leave early and plan nothing for the evening except the cliff at sunset."],
  },
  {
    between: ["munnar", "varkala"], km: 240,
    options: [
      cab([6.5, 7.5], [6000, 7000]),
      { mode: "combo", label: "Bus to Kottayam + train", hours: [7.5, 8.5], cost: [350, 700], per: "person", how: "Munnar → Kottayam by KSRTC (4.5 h), then a train to Varkala Sivagiri (2.5 h)." },
    ],
    tips: ["The longest leg in Kerala. If your dates allow, add a backwaters night in between."],
  },
  {
    between: ["varkala", "kovalam"], km: 55,
    options: [
      cab([1.5, 2], [1800, 2500]),
      { mode: "train", label: "Train + auto", hours: [1.5, 2], cost: [350, 550], per: "person", how: "Varkala Sivagiri → Thiruvananthapuram Central (45–60 min), then an auto or cab to Kovalam (30 min, ₹300–450)." },
    ],
    tips: [],
  },
  {
    between: ["varkala", "TRV"], km: 45,
    options: [
      cab([1, 1.5], [1500, 2200], "Prepaid taxi counter at the airport, or book through your stay."),
      { mode: "train", label: "Train + cab", hours: [1.5, 2], cost: [350, 500], per: "person", how: "Varkala Sivagiri ↔ Thiruvananthapuram Central, then a 20-minute cab to the airport." },
    ],
    tips: ["Allow extra time: traffic through the city is unpredictable."],
  },
  {
    between: ["kovalam", "TRV"], km: 15,
    options: [cab([0.4, 0.75], [500, 800], "Prepaid taxi counter at the airport, or Uber/Ola.")],
    tips: [],
  },
  {
    between: ["alleppey", "COK"], km: 85,
    options: [
      cab([2, 2.5], [2500, 3000]),
      { mode: "train", label: "Train + cab", hours: [2.5, 3], cost: [700, 1000], per: "person", how: "Alappuzha → Aluva or Ernakulam, then a 30–45 minute cab to the airport." },
    ],
    tips: ["Houseboat checkout is 9 am, so an afternoon flight is comfortable."],
  },
  {
    between: ["kumarakom", "COK"], km: 90,
    options: [cab([2, 2.5], [2500, 3200])],
    tips: [],
  },
  {
    between: ["thekkady", "COK"], km: 150,
    options: [
      cab([4.5, 5], [4000, 5000]),
      { mode: "bus", label: "KSRTC bus to Aluva + cab", hours: [5.5, 6.5], cost: [500, 700], per: "person", how: "Kumily → Aluva, then a 20-minute cab." },
    ],
    tips: ["Book flights after 3 pm if you're driving down on the same day."],
  },
  {
    between: ["CCJ", "wayanad"], km: 100,
    options: [
      cab([3, 3.5], [3000, 3800]),
      { mode: "bus", label: "Cab to Kozhikode + KSRTC bus", hours: [3.5, 4.5], cost: [800, 1100], per: "person", how: "Cab from the airport to Kozhikode KSRTC stand (45 min), then a frequent bus to Kalpetta (85 km, 2.5–3 h, ₹100–150)." },
    ],
    tips: ["The road climbs the Thamarassery ghat (nine hairpin bends). Weekend traffic jams are common."],
    sources: src("ktThamarassery", "calicutWayanad"),
  },
  {
    between: ["wayanad", "kochi"], km: 260,
    options: [
      { mode: "combo", label: "Bus to Kozhikode + train", hours: [6.5, 8], cost: [250, 800], per: "person", how: "Kalpetta → Kozhikode by KSRTC (2.5–3 h), then Kozhikode → Ernakulam Jn by train (4–4.5 h, book on IRCTC)." },
      cab([6, 7.5], [6500, 8000]),
    ],
    tips: ["Treat this as a full travel day. The train half is comfortable; the ghat half isn't."],
  },
];

// ─── Survival essentials ──────────────────────────────────────────────────────

export const essentials: { id: string; title: string; items: { h: string; p: string }[]; sources?: Source[] }[] = [
  {
    id: "money",
    title: "Money and UPI",
    items: [
      { h: "Currency", p: "Indian rupee (₹). Cards work in hotels and bigger restaurants. Carry cash for tea stalls, autos, ferries and temple offerings." },
      { h: "UPI", p: "Almost every shop takes UPI (QR-code payments). Visitors from abroad can use NPCI's UPI One World prepaid wallet: KYC with passport and visa in an app such as CheqUPI, then load it with a foreign card (₹25,000 per load, ₹50,000 a month). Availability is still limited, so set it up before relying on it." },
      { h: "ATMs", p: "Easy to find in towns and rarer in the hills and forests. Take out cash before Wayanad's forests or Thekkady's back roads." },
      { h: "Tipping", p: "Not expected everywhere, but welcome for houseboat crews, drivers and guides (₹200–500 a day)." },
    ],
    sources: src("upiOneWorld"),
  },
  {
    id: "power",
    title: "Power and phone",
    items: [
      { h: "Plugs", p: "Types C, D and M; 230 V, 50 Hz. Bring a universal adapter. Type D/M sockets are common in older homestays." },
      { h: "SIM", p: "Jio or Airtel have the best coverage. Visitors from abroad need their original passport, visa and a photo, and activation can take up to 24 hours. An eSIM bought before you fly saves the hassle." },
      { h: "Coverage", p: "Good in towns and along the coast; patchy in forests, on ghat roads and on parts of the backwaters. Download offline maps." },
    ],
    sources: src("touristSim"),
  },
  {
    id: "scams",
    title: "Scams and traps",
    items: [
      { h: "Houseboat touts", p: "Men at Alleppey's jetties and the bus stand offer \"cheap\" boats that turn out to be unlicensed, run down, or come with surprise extra charges. Book directly with a licensed operator or through your stay, and see the boat (or recent photos) first." },
      { h: "Commission stops", p: "Drivers stop at spice, tea and handicraft shops where they earn a cut. Say no politely at the start, or treat the stops as window-shopping." },
      { h: "\"Your hotel is closed\"", p: "An auto driver says your hotel has closed or flooded and offers a better one. Call the hotel yourself." },
      { h: "Jeep safari pricing", p: "Kolukkumalai and other jeep rides vary wildly in price. Agree the total per jeep, with entry fees included, in writing (a WhatsApp message counts)." },
      { h: "\"Ayurveda\" massage parlours", p: "Real treatments come from doctors and certified centres. Look for the state's Green Leaf or Olive Leaf classification." },
      { h: "Autos without meters", p: "Ask for the meter, or agree the fare before you get in. In cities, Uber/Ola auto shows you a fair price." },
    ],
  },
  {
    id: "customs",
    title: "Local norms",
    items: [
      { h: "Dress", p: "Away from the beach, cover shoulders and knees, especially at temples. Some temples admit Hindus only." },
      { h: "Shoes off", p: "Take your shoes off at temples, homes and many shops." },
      { h: "Alcohol", p: "Sold only in licensed bars, some hotels and state-run outlets. The first of every month is a dry day (plus election and festival dry days). Beach shacks may serve discreetly; don't count on it." },
      { h: "Right hand", p: "Eat, give and receive with your right hand." },
    ],
    sources: src("dryDay", "ktPadmanabhaswamy"),
  },
];

const helplines = src("lsgHelplines")[0];

export const emergencyContacts: { label: string; number: string; note?: string; source: Source }[] = [
  { label: "All emergencies", number: "112", note: "Police, fire, ambulance", source: helplines },
  { label: "Police", number: "100", source: helplines },
  { label: "Ambulance", number: "108", source: helplines },
  { label: "Fire & rescue", number: "101", source: helplines },
  { label: "Women's helpline", number: "1091", note: "or 181", source: helplines },
  { label: "India tourist helpline", number: "1363", note: "24×7 in 12 languages (also 1800-11-1363)", source: src("indiaTouristHelpline")[0] },
  { label: "Kerala Tourism info (toll-free)", number: "1800-425-4747", note: "From Indian numbers only", source: src("ktFooter")[0] },
];

// ─── Months ───────────────────────────────────────────────────────────────────

export type Climate = "pleasant" | "hot" | "monsoon" | "showers";

export const months: { name: string; short: string; climate: Climate; note: string }[] = [
  { name: "January", short: "Jan", climate: "pleasant", note: "Dry, clear and peak season. Book stays early." },
  { name: "February", short: "Feb", climate: "pleasant", note: "Dry and warming up. Eravikulam usually closes for the tahr calving season." },
  { name: "March", short: "Mar", climate: "hot", note: "Hot and humid on the coast (around 35 °C). The hills are still pleasant." },
  { name: "April", short: "Apr", climate: "hot", note: "Hottest and stickiest month, with some evening thunderstorms. Low season prices begin." },
  { name: "May", short: "May", climate: "hot", note: "Muggy. The monsoon usually breaks around the end of the month." },
  { name: "June", short: "Jun", climate: "monsoon", note: "Heavy monsoon. Seas are closed to swimmers, and landslides can close hill roads." },
  { name: "July", short: "Jul", climate: "monsoon", note: "Wettest month. Lush, cheap and quiet. The best season for Ayurveda." },
  { name: "August", short: "Aug", climate: "monsoon", note: "Rain eases a little. Snake-boat races in Alleppey and Onam celebrations." },
  { name: "September", short: "Sep", climate: "showers", note: "Rain thins out. Green everywhere, waterfalls at their best." },
  { name: "October", short: "Oct", climate: "showers", note: "Afternoon thunderstorms from the second monsoon. Mornings are clear." },
  { name: "November", short: "Nov", climate: "showers", note: "Occasional showers and the start of the season. Cliff cafés reopen." },
  { name: "December", short: "Dec", climate: "pleasant", note: "Peak season. Prices can double over Christmas and New Year." },
];

// ─── Packing ──────────────────────────────────────────────────────────────────

export const packing: { always: string[]; climate: Record<Climate, string[]>; vibe: Record<VibeId, string[]>; traveler: Partial<Record<Traveler, string[]>> } = {
  always: [
    "Light cotton or linen clothes",
    "One outfit that covers shoulders and knees (temples)",
    "Universal plug adapter (types C, D, M; 230 V)",
    "Sunscreen, hat and sunglasses",
    "Refillable water bottle",
    "Sandals that slip off easily",
    "Copies of passport, visa and bookings (paper and phone)",
    "Some cash in small notes (₹10–100)",
  ],
  climate: {
    pleasant: ["A light layer for evenings and air-conditioning"],
    hot: ["Electrolyte sachets", "Loose, breathable clothes", "A small towel for the sweat"],
    monsoon: ["Light rain jacket or umbrella", "Quick-dry clothes", "Waterproof phone pouch", "Mosquito repellent"],
    showers: ["Compact umbrella", "Mosquito repellent"],
  },
  vibe: {
    mist: ["Fleece or warm layer (nights can drop to 10 °C)", "Closed walking shoes", "Motion-sickness tablets"],
    backwaters: ["Insect repellent for evenings on the water", "A book for slow afternoons"],
    coast: ["Swimwear and a cover-up for walking into town", "Reef-safe sunscreen"],
    wild: ["Leech socks (after any rain)", "Binoculars", "Neutral-coloured clothes"],
  },
  traveler: {
    family: ["Kids' motion-sickness medicine", "Oral rehydration salts", "Snacks for long drives"],
    solo: ["Power bank (long days on buses and trains)", "Door wedge or travel lock"],
  },
};

// ─── "Is Kerala for you?" ─────────────────────────────────────────────────────

export const realityCheck: { q: string; a: string; sources?: Source[] }[] = [
  {
    q: "It's humid. Really humid.",
    sources: src("imdKochi"),
    a: "The coast is humid most of the year, and March to May feels like a sauna (daytime highs around 33–35 °C in Kochi). Hill stations are the escape: Munnar is 10–15 °C cooler. If you hate sticky weather, go from November to February, or spend more nights in the hills.",
  },
  {
    q: "The monsoon is a real season, not a light drizzle.",
    a: "The monsoon normally arrives around 1 June and runs to September: heavy downpours (Kochi averages about 600 mm in June alone), rough seas closed to swimmers, and occasional landslides on hill roads. You get low prices, empty sights and huge waterfalls in return. Rain usually comes in bursts, not all day.",
    sources: src("monsoonOnset", "imdKochi"),
  },
  {
    q: "Short distances take a long time.",
    a: "Average road speed is 30–40 km/h. Kochi to Munnar is 130 km and takes 4–5 hours. Plan one move every 2–3 days, not one a day, or you'll spend the trip in a car.",
    sources: src("kochiMunnar"),
  },
  {
    q: "Mountain roads cause motion sickness.",
    a: "Every road to Munnar, Thekkady and Wayanad has dozens of hairpin bends. Take tablets before you set off, eat light, sit in front, and ask the driver to slow down (they will).",
  },
  {
    q: "It's slow, not a party.",
    a: "Kerala is about village life, early mornings and quiet evenings. Alcohol is sold only in licensed bars and state outlets, and the first of every month is a dry day. Varkala has a café scene, but nothing like Goa's nightlife. Most towns are asleep by 10 pm.",
    sources: src("dryDay"),
  },
  {
    q: "The beaches aren't for lazy swimming.",
    a: "The Arabian Sea has strong currents and undertow. Swim only between lifeguard flags at Varkala or Kovalam, never when the red flag is up, and not at all in the monsoon.",
  },
  {
    q: "Temples have rules, and some are closed to you.",
    a: "Some major temples, including Padmanabhaswamy and Guruvayur, admit Hindus only. Many have a dress code (at Padmanabhaswamy: a mundu and no shirt for men, a sari or set-mundu for women). Ask before taking photos.",
    sources: src("guruvayurEntry", "ktPadmanabhaswamy"),
  },
  {
    q: "Wildlife is a gamble.",
    a: "Periyar and Wayanad are dense forest. Elephants, gaur and deer are likely, but a tiger is rare. Go for the forest itself, not for a checklist.",
  },
  {
    q: "December and January are expensive and crowded.",
    a: "Houseboat and resort prices can double around Christmas and New Year, and good stays sell out. Book 6–8 weeks ahead, or go in November or February instead.",
  },
];
