/*
 * Kerala's 14 districts, and "everyday Kerala": the ordinary things people here actually do, which no
 * tour sells. Explore-only for now: the planner still routes through the bases in keralaData.ts.
 *
 * districts – north to south. `coords` is the headquarters town, used to draw the district map and to
 *             find the nearest airport. `spice` joins a district to the spice matrix.
 * everyday  – things to do. `district: null` means you'll find it anywhere in Kerala.
 *
 * Facts that can change (timings, fares, closures) carry a source; see SOURCES.md.
 */
import type { RegionId } from "./keralaData.ts";
import type { SpiceRegion } from "./experience.ts";
import { src, type Source } from "./sources.ts";

export type DistrictId =
  | "kasaragod" | "kannur" | "wayanad" | "kozhikode" | "malappuram" | "palakkad" | "thrissur"
  | "ernakulam" | "idukki" | "kottayam" | "alappuzha" | "pathanamthitta" | "kollam" | "thiruvananthapuram";

export interface District {
  id: DistrictId;
  name: string;
  ml: string;
  /** Headquarters town. */
  hq: string;
  coords: [number, number];
  /** The three broad regions people talk about: Malabar (north), central Kerala and Travancore (south). */
  part: "Malabar" | "Central" | "Travancore";
  /** One line on what the district is like. */
  character: string;
  /** A short paragraph: what it's known for. */
  about: string;
  spice?: SpiceRegion;
  /** Festival names from experience.ts `seasons`, so the page can link to their months. */
  festivals: string[];
  sources: Source[];
}

/** Every district headquarters is from the same list. */
const hq = src("districtList");

export const districts: District[] = [
  {
    id: "kasaragod", name: "Kasaragod", ml: "കാസർഗോഡ്", hq: "Kasaragod", coords: [12.5, 74.99], part: "Malabar",
    character: "The far north, where Kerala shades into Karnataka.",
    about: "Kerala's newest district, split from Kannur in 1984, and its most multilingual: Malayalam, Tulu, Kannada, Marathi, Konkani, Beary and Urdu are all spoken here, which is why it's called the land of seven languages. Yakshagana, the dance-drama of coastal Karnataka, is performed in its temples, and Bekal Fort, the largest fort in Kerala, sits on the sea.",
    festivals: ["Theyyam season", "Theyyam season (late)"],
    sources: [...hq, ...src("kasaragodLanguages", "ktYakshagana", "bekalFort")],
  },
  {
    id: "kannur", name: "Kannur", ml: "കണ്ണൂർ", hq: "Kannur", coords: [11.87, 75.37], part: "Malabar",
    character: "Theyyam, looms and cake.",
    about: "Kannur is the heart of Theyyam country: from October to May, village shrines hold night-long rituals where painted dancers become gods. It's also a weaving district, with handloom co-operatives you can walk around, and nearby Thalassery is where Mambally Bapu baked what is said to be India's first Christmas cake, in 1883. The East India Company's old cinnamon estate is at Anjarakandy.",
    spice: "Kannur",
    festivals: ["Theyyam season", "Theyyam season (late)"],
    sources: [...hq, ...src("theyyamSeason", "ktKanhirode", "mambally", "ktAnjarakandy")],
  },
  {
    id: "wayanad", name: "Wayanad", ml: "വയനാട്", hq: "Kalpetta", coords: [11.61, 76.08], part: "Malabar",
    character: "Coffee, pepper and forest on a high plateau.",
    about: "A green plateau in the Western Ghats, with coffee and pepper estates, wildlife sanctuaries and Stone Age carvings in the Edakkal Caves. It's one of the trip planner's bases, and the place page has everything to do there.",
    spice: "Wayanad",
    festivals: [],
    sources: hq,
  },
  {
    id: "kozhikode", name: "Kozhikode", ml: "കോഴിക്കോട്", hq: "Kozhikode", coords: [11.25, 75.78], part: "Malabar",
    character: "The old spice port: halwa, biryani and boatbuilders.",
    about: "Calicut, the port Vasco da Gama sailed to in 1498, landing at Kappad nearby. The city's SM Street (Mittayitheruvu, \"sweet street\") is famous for Kozhikodan halwa, made with coconut oil instead of ghee. At Beypore, on the Chaliyar river, carpenters still build urus, huge wooden dhows, by hand.",
    festivals: [],
    sources: [...hq, ...src("vascoDaGama", "ktSmStreet", "ktHalwa", "beyporeUru")],
  },
  {
    id: "malappuram", name: "Malappuram", ml: "മലപ്പുറം", hq: "Malappuram", coords: [11.07, 76.07], part: "Malabar",
    character: "Football-mad, and the home of Kottakkal Ayurveda.",
    about: "Malappuram is the hub of Sevens, Kerala's seven-a-side football, played on packed local grounds from November to May. Kottakkal, in the same district, is where P. S. Varier founded the Arya Vaidya Sala in 1902, which grew into one of the best-known names in Ayurveda.",
    festivals: [],
    sources: [...hq, ...src("ktSevens", "sevensSeason", "aryaVaidyaSala")],
  },
  {
    id: "palakkad", name: "Palakkad", ml: "പാലക്കാട്", hq: "Palakkad", coords: [10.78, 76.65], part: "Malabar",
    character: "Paddy fields in the gap in the mountains.",
    about: "Called the Granary of Kerala for its paddy fields. It sits at the Palakkad Gap, a low pass about 30 km wide through the Western Ghats that links Kerala with Coimbatore in Tamil Nadu, so it's drier and more Tamil-influenced than the coast. The old agraharam (Tamil Brahmin street) at Kalpathy holds its chariot festival in November.",
    spice: "Palakkad",
    festivals: ["Kalpathy Ratholsavam"],
    sources: [...hq, ...src("palakkadDistrict", "palakkadGap", "ktKalpathy")],
  },
  {
    id: "thrissur", name: "Thrissur", ml: "തൃശ്ശൂർ", hq: "Thrissur", coords: [10.53, 76.21], part: "Central",
    character: "The cultural capital: Pooram, tigers and the arts academies.",
    about: "Thrissur calls itself the cultural capital of Kerala, and the state's academies for literature, music and drama, and fine arts are all in the city. It's best known for Thrissur Pooram, the temple festival with lines of caparisoned elephants, and for Pulikali tiger dancers at Onam. Kerala Kalamandalam, the classical arts school, is at Cheruthuruthy in the north of the district.",
    spice: "Thrissur",
    festivals: ["Thrissur Pooram", "Thrissur Pooram (some years)", "Onam (some years)"],
    sources: [...hq, ...src("thrissurCulture", "thrissurPooram", "ktPulikali", "kalamandalamTour")],
  },
  {
    id: "ernakulam", name: "Ernakulam", ml: "എറണാകുളം", hq: "Kakkanad", coords: [10.01, 76.35], part: "Central",
    character: "Kochi, Kerala's busiest city, and the islands around it.",
    about: "The district around Kochi, the commercial capital (the district offices are at Kakkanad, on the city's edge). Fort Kochi and Mattancherry are covered on the Kochi place page; across the water, villages like Kumbalangi still live by fishing, with Chinese nets along the shore and homestays instead of resorts.",
    festivals: ["Cochin Carnival", "Christmas"],
    sources: [...hq, ...src("ktKumbalangi", "cochinCarnival")],
  },
  {
    id: "idukki", name: "Idukki", ml: "ഇടുക്കി", hq: "Painavu", coords: [9.85, 76.95], part: "Central",
    character: "The high ranges: tea, cardamom and dams.",
    about: "Kerala's mountain district, home to Munnar and Thekkady, the Cardamom Hills and most of the state's tea. The Idukki arch dam, one of the tallest in Asia, opens to visitors only for short spells, usually around Onam and Christmas, with online booking.",
    spice: "Idukki",
    festivals: [],
    sources: [...hq, ...src("idukkiDam", "ktSpiceDistricts")],
  },
  {
    id: "kottayam", name: "Kottayam", ml: "കോട്ടയം", hq: "Kottayam", coords: [9.59, 76.52], part: "Travancore",
    character: "Letters, latex and lakes.",
    about: "Known for letters, latex and lakes: it was the first town in India declared fully literate, in 1989, Malayala Manorama and other big newspapers are based here, rubber estates cover the hills, and the district runs down to Vembanad Lake at Kumarakom.",
    spice: "Kottayam",
    festivals: [],
    sources: [...hq, ...src("kottayamLiteracy", "kottayamLetters")],
  },
  {
    id: "alappuzha", name: "Alappuzha", ml: "ആലപ്പുഴ", hq: "Alappuzha", coords: [9.5, 76.34], part: "Travancore",
    character: "Canals, coir and farms below sea level.",
    about: "Alleppey's district, and most of Kuttanad, one of the few places in the world farmed below sea level (FAO lists it as a globally important agricultural heritage system). Rice, ducks and fish share the same waterways, and in August the snake boats race on Punnamada Lake.",
    spice: "Alleppey",
    festivals: ["Nehru Trophy Boat Race"],
    sources: [...hq, ...src("kuttanadGiahs", "ktKuttanad", "nehruTrophy2026")],
  },
  {
    id: "pathanamthitta", name: "Pathanamthitta", ml: "പത്തനംതിട്ട", hq: "Pathanamthitta", coords: [9.26, 76.79], part: "Travancore",
    character: "Pilgrim country: Sabarimala and Aranmula.",
    about: "A forested, hilly district best known for Sabarimala, whose pilgrim season fills the roads from mid-November to January. At Aranmula, families still hand-make the Aranmula kannadi, a polished metal mirror that was the first product from Kerala with a GI tag, and temple snake boats row in the Uthrattathi boat race.",
    festivals: ["Makaravilakku", "Sabarimala season begins", "Aranmula Uthrattathi Boat Race"],
    sources: [...hq, ...src("sabarimala", "aranmulaKannadi", "ktAranmula")],
  },
  {
    id: "kollam", name: "Kollam", ml: "കൊല്ലം", hq: "Kollam", coords: [8.89, 76.61], part: "Travancore",
    character: "Cashew town on Ashtamudi Lake.",
    about: "An old trading port on Ashtamudi Lake, and for nearly a century the centre of the world's cashew-processing trade. The slow way to Alleppey is the public boat through Ashtamudi, Kayamkulam and Vembanad: about eight hours on the water.",
    festivals: [],
    sources: [...hq, ...src("kollamCashew", "kollamBoat")],
  },
  {
    id: "thiruvananthapuram", name: "Thiruvananthapuram", ml: "തിരുവനന്തപുരം", hq: "Thiruvananthapuram", coords: [8.52, 76.94], part: "Travancore",
    character: "The capital, with Varkala and Kovalam on its coast.",
    about: "The state capital and the old seat of Travancore, around the Padmanabhaswamy Temple. Chalai, opposite the temple, is said to be Kerala's oldest market, and once a year the streets fill with women cooking for Attukal Pongala. Varkala and Kovalam, two of the planner's beach bases, are in this district.",
    festivals: ["Attukal Pongala"],
    sources: [...hq, ...src("chalai", "attukal", "ktPadmanabhaswamy")],
  },
];

export const districtById = Object.fromEntries(districts.map((d) => [d.id, d])) as Record<DistrictId, District>;
export const isDistrictId = (id: string): id is DistrictId => id in districtById;

/** Which district each planner base is in. */
export const regionDistrict: Record<RegionId, DistrictId> = {
  wayanad: "wayanad",
  kochi: "ernakulam",
  munnar: "idukki",
  thekkady: "idukki",
  kumarakom: "kottayam",
  alleppey: "alappuzha",
  varkala: "thiruvananthapuram",
  kovalam: "thiruvananthapuram",
};

/** Airports for the district pages: the planner's three, plus Kannur and Mangaluru for the far north. */
export const districtAirports: { name: string; code: string; coords: [number, number] }[] = [
  { name: "Kochi", code: "COK", coords: [10.152, 76.391] },
  { name: "Thiruvananthapuram", code: "TRV", coords: [8.482, 76.92] },
  { name: "Kozhikode", code: "CCJ", coords: [11.137, 75.955] },
  { name: "Kannur", code: "CNN", coords: [11.918, 75.547] },
  { name: "Mangaluru (Karnataka)", code: "IXE", coords: [12.961, 74.89] },
];

// ─── Everyday Kerala ──────────────────────────────────────────────────────────

export type EverydayKind = "eat" | "move" | "watch" | "make";

export const everydayKinds: { id: EverydayKind; label: string }[] = [
  { id: "eat", label: "Eat & drink" },
  { id: "move", label: "Get around" },
  { id: "watch", label: "Watch & join in" },
  { id: "make", label: "Crafts & work" },
];

export interface Everyday {
  id: string;
  name: string;
  kind: EverydayKind;
  /** null: anywhere in Kerala. */
  district: DistrictId | null;
  what: string;
  /** How to do it without being awkward: etiquette, timing, what to say. */
  how: string;
  sources?: Source[];
}

export const everyday: Everyday[] = [
  // Anywhere
  {
    id: "chaaya-kada", name: "Tea at a chaaya kada", kind: "eat", district: null,
    what: "Every junction has a tea shop: a counter, a glass case of fried snacks (pazham pori, parippu vada, sukhiyan), a bench and the morning paper. It's where a village talks.",
    how: "Order a chaaya (milky tea) or kattan chaaya (black). The tea is \"pulled\" between two jugs for froth. Sit on the bench, read the paper over someone's shoulder, and pay at the counter when you leave.",
  },
  {
    id: "meals", name: "\"Meals ready\": a rice lunch on a banana leaf", kind: "eat", district: null,
    what: "From around noon, small restaurants put up a \"Meals ready\" board: rice with sambar, rasam, a few vegetables, pickle and papadam, refilled until you stop them.",
    how: "Eat with your right hand. Staff come round with refills; say \"mathi\" (enough) when you're done.",
  },
  {
    id: "janakeeya", name: "A cheap lunch at a Janakeeya hotel", kind: "eat", district: null,
    what: "Kudumbashree, the state's women's self-help network, set up \"people's hotels\" serving rice meals for ₹20. The subsidy has since stopped: survivors charge about ₹35–40, and many have closed.",
    how: "Look for the Kudumbashree logo near bus stands and panchayat offices at lunchtime. You'll eat with drivers, workers and students. Pay at the counter.",
    sources: src("janakeeya"),
  },
  {
    id: "toddy-shop", name: "Lunch at a toddy shop (kallu shappu)", kind: "eat", district: null,
    what: "Licensed shops selling toddy, a mildly alcoholic palm wine, with some of the fiercest and best food in the state: kappa (tapioca) with fish curry, duck roast, fried mussels.",
    how: "Traditionally a men's space, though many now have family rooms and some, like Kakkathuruthu near Alappuzha, are popular weekend family spots. Go at lunch, when the food is freshest. Toddy is alcohol: don't drive after it.",
    sources: src("toddyFamilies"),
  },
  {
    id: "state-ferry", name: "Commute by state ferry", kind: "move", district: null,
    what: "State Water Transport boats are buses on water for backwater villages, carrying students, office workers and fish. Kottayam to Alappuzha costs about ₹29, and Kumarakom to Muhamma about ₹16.",
    how: "Buy the ticket on board or at the jetty. Morning boats are full of commuters, so give up the seat by the rail and stand. Check the return time before you go: some routes have only a few boats a day.",
    sources: src("swtdFares", "swtdCommuters"),
  },
  {
    id: "private-bus", name: "Ride a private bus", kind: "move", district: null,
    what: "Kerala's private buses are loud, fast and covered in names and stickers. They run the short routes between towns, and they're how most people get around.",
    how: "Get on at the back and pay the conductor, who keeps notes folded between their fingers. Say your stop early, and hold on: they don't wait long. Some seats are marked for women, the elderly and people with disabilities.",
  },
  {
    id: "utsavam", name: "Stand at the back of a temple utsavam", kind: "watch", district: null,
    what: "Through the dry season, almost every temple holds its yearly festival: elephant processions, chenda drums and fireworks, with a fairground of bangle and balloon stalls outside.",
    how: "Anyone can watch the processions and the drumming outside. Dress modestly, keep your distance from the elephants, and expect fireworks late at night. Entry to the inner temple may be restricted to Hindus.",
  },
  {
    id: "library", name: "Drop into a village library", kind: "watch", district: null,
    what: "Kerala has thousands of public libraries (over 7,000 grant-aided ones), many in small villages, often doubling as the reading room, debating club and youth centre.",
    how: "Most welcome visitors to the reading room. Evenings are busiest, when people come in for the newspapers.",
    sources: src("libraries"),
  },

  // In particular districts
  {
    id: "theyyam", name: "A Theyyam night in a village shrine", kind: "watch", district: "kannur",
    what: "In village kavus (shrines) across Kannur and Kasaragod, performers in towering headdresses and painted faces become gods for a night, from about October to May. These are rituals, not shows.",
    how: "Ask your homestay which kavu has a Theyyam on: schedules are local and change each year. Arrive in the evening, dress modestly, sit with the villagers and don't use flash. Some go on all night.",
    sources: src("theyyamSeason"),
  },
  {
    id: "weavers", name: "Watch the looms at a weavers' co-operative", kind: "make", district: "kannur",
    what: "Kannur is \"the land of looms\". Co-operatives like Kanhirode (since 1952) and Loknath (since 1955) still weave cotton and silk by hand and let visitors walk the floor.",
    how: "Go on a weekday, when the looms are running. Loknath, 3 km from town, offers a quick free tour and has a shop.",
    sources: src("ktKanhirode", "loknathWeavers"),
  },
  {
    id: "thalassery-cake", name: "Plum cake in Thalassery", kind: "eat", district: "kannur",
    what: "Mambally Bapu's bakery in Thalassery is said to have baked India's first Christmas cake in 1883. The family's bakeries are still around Kerala.",
    how: "Come in December, when the plum cakes are out. The rest of the year, try a Thalassery biryani, made with short-grain kaima rice.",
    sources: src("mambally"),
  },
  {
    id: "seven-languages", name: "Hear seven languages in one market", kind: "watch", district: "kasaragod",
    what: "In Kasaragod you can hear Malayalam, Tulu, Kannada, Marathi, Konkani, Beary and Urdu in a single street, more than anywhere else in Kerala.",
    how: "Spend a morning in the town market and on the buses. Kannada is more common than Malayalam in the far north, around Manjeshwar and Kumbla.",
    sources: src("kasaragodLanguages"),
  },
  {
    id: "yakshagana", name: "See a Yakshagana performance", kind: "watch", district: "kasaragod",
    what: "A dance-drama from coastal Karnataka, with huge gilded headdresses and stories from the epics, performed in the temples of northern Kasaragod, mostly in Kannada.",
    how: "Performances are part of temple festivals and often run late into the night. Ask locally for dates.",
    sources: src("ktYakshagana"),
  },
  {
    id: "uravu", name: "Bamboo craft at Uravu", kind: "make", district: "wayanad",
    what: "A village organisation at Thrikkaipetta that trains local people in bamboo craft, with plantations, a workshop and a shop.",
    how: "Open daily, with no entry fee. Walk the bamboo groves, then watch the workshop turn raw bamboo into lamps, baskets and masks.",
    sources: src("ktUravu"),
  },
  {
    id: "sm-street", name: "Halwa-tasting on SM Street", kind: "eat", district: "kozhikode",
    what: "Kozhikode's 500-year-old shopping street, Mittayitheruvu, is lined with shops selling slabs of glossy halwa in every colour, made with coconut oil.",
    how: "Most shops let you taste before you buy. Go in the evening, when the street is busiest, and finish with a Kozhikode biryani nearby.",
    sources: src("ktSmStreet", "ktHalwa"),
  },
  {
    id: "beypore", name: "The uru builders of Beypore", kind: "make", district: "kozhikode",
    what: "At Beypore, 10 km from Kozhikode, teams of carpenters build urus, huge wooden dhows, by hand from teak, without drawings. One can take years.",
    how: "Ask at the yards by the river mouth if you can look around. Be respectful of the workers' space and ask before photographing.",
    sources: src("beyporeUru"),
  },
  {
    id: "sevens", name: "A Sevens football match", kind: "watch", district: "malappuram",
    what: "Seven-a-side football on village grounds, from November to May, with temporary galleries packed with fans and imported players from West Africa.",
    how: "Matches are mostly in the evening under floodlights. Watch for posters, or ask anyone: everyone knows where tonight's match is. Tickets are cheap.",
    sources: src("ktSevens", "sevensSeason"),
  },
  {
    id: "kalamandalam", name: "Watch the morning classes at Kalamandalam", kind: "watch", district: "thrissur",
    what: "Kerala's classical arts school, where students train in Kathakali, Mohiniyattam, Kutiyattam and percussion from early morning. Its \"A Day with the Masters\" guided tour has run with Kerala Tourism since 2003.",
    how: "Book the tour in advance with Kalamandalam, and go in the morning, when the classes are on. Sit quietly at the edge of the kalari (practice hall).",
    sources: src("kalamandalamTour"),
  },
  {
    id: "kumbalangi", name: "A day in Kumbalangi fishing village", kind: "make", district: "ernakulam",
    what: "An island village near Kochi that chose village tourism over resorts: Chinese fishing nets, crab and prawn farming in the mangroves, and homestays.",
    how: "Go with a local guide or homestay to try net fishing and see how the village works. It's 14 km from Ernakulam station.",
    sources: src("ktKumbalangi"),
  },
  {
    id: "kuttanad-farm", name: "Walk the bunds of a Kuttanad paddy", kind: "make", district: "alappuzha",
    what: "In Kuttanad, rice grows below sea level, behind earth bunds, with ducks and fish in the same water.",
    how: "Walk the bunds with a homestay host or a canoe guide. Planting and harvest times change with the season; harvest is the liveliest.",
    sources: src("kuttanadGiahs", "ktKuttanad"),
  },
  {
    id: "aranmula-mirror", name: "Meet an Aranmula mirror-maker", kind: "make", district: "pathanamthitta",
    what: "Families in Aranmula hand-make the kannadi, a mirror of polished metal alloy whose recipe they keep secret. It has had a GI tag since 2005.",
    how: "Workshops sell directly. Real ones reflect from the surface, with no glass: ask to see the polishing.",
    sources: src("aranmulaKannadi"),
  },
  {
    id: "kollam-boat", name: "Kollam to Alappuzha by public boat", kind: "move", district: "kollam",
    what: "About eight hours across Ashtamudi, Kayamkulam and Vembanad on the tourism boat, past fishing villages and coir yards.",
    how: "Boats leave each end in the morning (around 10:30). Buy tickets at the DTPC counter by the jetty, and bring water and snacks. Check before you go: one canal on the route was blocked for a while until late 2025.",
    sources: src("kollamBoat", "kollamBoatTimes"),
  },
  {
    id: "cashew", name: "See where the cashews come from", kind: "make", district: "kollam",
    what: "Kollam has been the world's cashew-processing centre since the 1930s, with hundreds of units shelling, roasting and grading by hand.",
    how: "Most factories aren't open to visitors, but shops around the city sell graded cashews straight from processing. \"W240\" means whole nuts, about 240 to the pound: the bigger the grade number, the smaller the nut.",
    sources: src("kollamCashew"),
  },
  {
    id: "chalai", name: "Get lost in Chalai market", kind: "eat", district: "thiruvananthapuram",
    what: "Said to be Kerala's oldest market, a kilometre of lanes opposite the Padmanabhaswamy Temple: wholesale vegetables, spices, brass, fish and flowers.",
    how: "Go in the morning, when the wholesale trade is busiest. Bargaining is normal, except for things with printed prices.",
    sources: src("chalai"),
  },
];
