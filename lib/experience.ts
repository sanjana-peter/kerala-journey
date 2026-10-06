/*
 * Content for the immersive layer: moods (the theme engine), micro-stories, the season time-machine,
 * Malayalam phrase cards and the spice matrix.
 *
 * photos – every image in public/images with its credit. Kerala Tourism photos come from their
 *          royalty-free gallery (keralatourism.org/highresolutionimages) and are used pending their
 *          written permission, as on the earlier version of the site.
 */
import type { VibeId } from "./keralaData.ts";

// ─── Photos ───────────────────────────────────────────────────────────────────

export type PhotoId =
  | "munnar-tea" | "munnar-mist" | "alleppey-houseboat" | "kumarakom-sunset" | "varkala-cliff" | "varkala-beach"
  | "thekkady-elephants" | "thekkady-lake" | "wayanad-chembra" | "kuttanad-storm" | "snake-boats" | "kuttanad-paddy"
  | "kathakali" | "kochi-nets";

export interface Photo { src: string; alt: string; title: string; credit: string; source: string }

const kt = (id: PhotoId, alt: string, title: string, gallery: string): Photo => ({
  src: `/images/${id}.webp`, alt, title, credit: "Kerala Tourism", source: `https://www.keralatourism.org/highresolutionimages/${gallery}/`,
});

export const photos: Record<PhotoId, Photo> = {
  "munnar-tea": kt("munnar-tea", "Rows of tea bushes rolling over green hills under a blue sky", "Tea Plantation, Munnar", "hills"),
  "munnar-mist": kt("munnar-mist", "Mist settling in a dark blue valley at dawn, seen from a grassy ridge", "View from Chokramudi Peak, Munnar", "hills"),
  "alleppey-houseboat": kt("alleppey-houseboat", "A thatched houseboat gliding past coconut palms on still water", "Houseboat Cruise", "backwater"),
  "kumarakom-sunset": kt("kumarakom-sunset", "A wooden canoe on glassy golden water at sunset, palms on the far bank", "Kumarakom backwater", "backwater"),
  "varkala-cliff": kt("varkala-cliff", "Red laterite cliff dropping to a long beach and grey-blue surf", "Varkala Papanasam Beach", "beaches"),
  "varkala-beach": kt("varkala-beach", "Varkala beach from above, with the cliff and its cafés behind", "Varkala Beach and Cliff", "beaches"),
  "thekkady-elephants": kt("thekkady-elephants", "A family of elephants grazing in tall green grass", "Elephants at Periyar", "wildlife"),
  "thekkady-lake": kt("thekkady-lake", "Dead tree trunks standing in Periyar lake below forested hills", "Thekkady, Idukki", "hills"),
  "wayanad-chembra": kt("wayanad-chembra", "A heart-shaped lake on the grassy slopes of Chembra Peak", "Chembra Peak", "hills"),
  "kuttanad-storm": kt("kuttanad-storm", "A lone fisherman in a canoe under heavy monsoon clouds", "Backwater stretches of Kuttanad", "backwater"),
  "snake-boats": kt("snake-boats", "A long snake boat packed with rowers racing through spray", "Snake boat in action, Kerala Backwaters", "backwater"),
  "kuttanad-paddy": kt("kuttanad-paddy", "A farmer bent over golden paddy in soft morning haze", "Kuttanad, Alappuzha", "others"),
  "kathakali": kt("kathakali", "A Kathakali dancer in green face paint and a towering headdress", "Kathakali Performance, Kerala Kalamandalam", "others"),
  "kochi-nets": kt("kochi-nets", "Chinese fishing nets silhouetted against the sky at Fort Kochi", "Chinese Fishing Net", "others"),
};

// ─── Moods (the theme engine) ─────────────────────────────────────────────────

export interface Mood {
  id: VibeId;
  place: string;
  photo: PhotoId;
  /** Accent for buttons, rings and highlights. */
  accent: string;
  /** Soft wash behind sections. */
  wash: string;
  /** Ambient glow blobs. */
  glow: [string, string];
  line: string;
  sense: { hear: string; smell: string; feel: string };
}

export const moods: Record<VibeId, Mood> = {
  mist: {
    id: "mist", place: "Munnar", photo: "munnar-tea",
    accent: "#2f6b4a", wash: "#e6efe6", glow: ["#b9d3c2", "#dfe9e4"],
    line: "Tea rows at 1,600 metres. The mist comes in at four.",
    sense: { hear: "Pickers calling across the slopes", smell: "Wet earth and eucalyptus", feel: "A cold breeze, so wear a fleece" },
  },
  backwaters: {
    id: "backwaters", place: "Alleppey", photo: "alleppey-houseboat",
    accent: "#a86a1f", wash: "#f5ebd8", glow: ["#efd2a1", "#f6e6c8"],
    line: "Water as a road. The day moves at the speed of a paddle.",
    sense: { hear: "Oars, ducks, a temple loudspeaker far off", smell: "Woodsmoke and frying fish", feel: "Warm, still, heavy air" },
  },
  coast: {
    id: "coast", place: "Varkala", photo: "varkala-cliff",
    accent: "#b4532c", wash: "#f7e4d8", glow: ["#efbea3", "#f6dccb"],
    line: "Red cliffs, a long drop, the Arabian Sea all the way down.",
    sense: { hear: "Surf below and café music above", smell: "Salt and coconut oil", feel: "Hot sand, then a sea breeze at sunset" },
  },
  wild: {
    id: "wild", place: "Thekkady", photo: "thekkady-elephants",
    accent: "#2c5a3b", wash: "#e1eadf", glow: ["#a9c6ac", "#d6e3d3"],
    line: "Dawn on the lake. Something big is moving in the grass.",
    sense: { hear: "Langurs barking, cicadas switching on", smell: "Cardamom drying in the sun", feel: "Damp forest air and leech socks" },
  },
};

export const moodOrder: VibeId[] = ["mist", "backwaters", "coast", "wild"];

export const microStories: Record<VibeId, string> = {
  mist: "You wake at six to a window full of white. By eight the tea appears row by row, pickers already on the slope, and your chai is steaming harder than you are.",
  backwaters: "Lunch is karimeen fried on the boat. A kingfisher follows you for a kilometre. By evening you've seen a whole village go by from the deck, and done absolutely nothing.",
  coast: "Breakfast on the cliff edge, a swim between the flags, a nap. At six the whole cliff turns to face the sun as it goes down into the sea.",
  wild: "The 7:30 boat glides out in silence. A herd of gaur stands at the water's edge, and the guide points at a tree where a hornbill is watching you back.",
};

// ─── Seasons ──────────────────────────────────────────────────────────────────

export interface Festival { name: string; where: string; what: string }

export interface Season {
  /** Approximate long-term average rainfall in Kochi, mm. */
  rainMm: number;
  /** Typical daytime high on the coast, °C. */
  highC: number;
  photo: PhotoId;
  tint: string;
  mood: string;
  festivals: Festival[];
}

export const seasons: Season[] = [
  { rainMm: 15, highC: 31, photo: "kumarakom-sunset", tint: "#c98a3a", mood: "Golden and dry",
    festivals: [
      { name: "Makaravilakku", where: "Sabarimala", what: "The climax of the pilgrim season in mid-January. Huge crowds of devotees in black." },
      { name: "Theyyam season", where: "Kannur & Kasaragod", what: "Night-long ritual performances in village shrines. Painted dancers become gods." },
    ] },
  { rainMm: 25, highC: 32, photo: "kathakali", tint: "#b8692e", mood: "Festival nights",
    festivals: [
      { name: "Temple utsavams", where: "Statewide", what: "Temple festivals with caparisoned elephants, drums and fireworks, almost every week somewhere." },
      { name: "Attukal Pongala", where: "Thiruvananthapuram", what: "Lakhs of women cook pongala in clay pots on the city streets on one day in Feb or Mar." },
    ] },
  { rainMm: 40, highC: 33, photo: "varkala-beach", tint: "#c2703e", mood: "Heat building",
    festivals: [
      { name: "Theyyam season (late)", where: "North Kerala", what: "The last big months of theyyam before the rains." },
      { name: "Temple utsavams", where: "Statewide", what: "Festival season continues with elephant processions and percussion." },
    ] },
  { rainMm: 120, highC: 33, photo: "kochi-nets", tint: "#b65a33", mood: "Sticky, with thunder",
    festivals: [
      { name: "Vishu", where: "Statewide", what: "Malayalam New Year in mid-April. The first sight of the morning is the vishukkani, and fireworks go off all evening." },
      { name: "Thrissur Pooram", where: "Thrissur", what: "Rival temples face off with 30 elephants a side, parasol switching and a dawn fireworks show. April or May." },
    ] },
  { rainMm: 290, highC: 32, photo: "kuttanad-paddy", tint: "#8a6a3c", mood: "Waiting for rain",
    festivals: [
      { name: "Thrissur Pooram (some years)", where: "Thrissur", what: "Falls in May when the Malayalam month of Medam runs late." },
    ] },
  { rainMm: 680, highC: 29, photo: "kuttanad-storm", tint: "#3f5c6e", mood: "The monsoon breaks",
    festivals: [
      { name: "Monsoon Ayurveda season", where: "Statewide", what: "Cool, damp air is said to open the pores. Proper treatment courses begin." },
    ] },
  { rainMm: 600, highC: 28, photo: "munnar-mist", tint: "#34566a", mood: "Green and roaring",
    festivals: [
      { name: "Karkidakam", where: "Statewide", what: "The Ramayana is read aloud in homes, and people eat karkidaka kanji, a medicinal rice porridge." },
    ] },
  { rainMm: 380, highC: 29, photo: "snake-boats", tint: "#2f6274", mood: "Boat races and Onam",
    festivals: [
      { name: "Nehru Trophy Boat Race", where: "Punnamada Lake, Alleppey", what: "100-oar snake boats race on the second Saturday of August. Book a stand ticket early." },
      { name: "Onam", where: "Statewide", what: "Kerala's harvest festival: flower carpets, the sadya feast and ten days of celebration. August or September." },
    ] },
  { rainMm: 300, highC: 30, photo: "thekkady-lake", tint: "#3f6a55", mood: "Rain thinning out",
    festivals: [
      { name: "Onam (some years)", where: "Statewide", what: "Pulikali tiger dancers take over Thrissur's streets on the fourth day." },
      { name: "Aranmula Uthrattathi Boat Race", where: "Aranmula, Pampa river", what: "A ritual snake-boat procession more than a race, with the rowers singing vanchipattu." },
    ] },
  { rainMm: 320, highC: 30, photo: "wayanad-chembra", tint: "#466b4f", mood: "Afternoon storms",
    festivals: [
      { name: "Navaratri & Vidyarambham", where: "Statewide", what: "Nine nights of worship. On Vijayadashami, small children write their first letters in rice." },
    ] },
  { rainMm: 160, highC: 31, photo: "munnar-tea", tint: "#4d7a4a", mood: "Fresh and clearing",
    festivals: [
      { name: "Sabarimala season begins", where: "Pathanamthitta", what: "Mandala pilgrimage starts in mid-November. Expect busy roads around Pampa." },
      { name: "Kalpathy Ratholsavam", where: "Palakkad", what: "Three days of temple-chariot processions through an old Tamil Brahmin village." },
    ] },
  { rainMm: 40, highC: 31, photo: "alleppey-houseboat", tint: "#a87430", mood: "Peak season",
    festivals: [
      { name: "Christmas", where: "Kochi & statewide", what: "Paper star lanterns outside every Christian home, midnight mass and plum cake." },
      { name: "Cochin Carnival", where: "Fort Kochi", what: "A week of parades ending with the Pappanji effigy burnt at midnight on New Year's Eve." },
    ] },
];

// ─── Malayalam phrase cards ───────────────────────────────────────────────────

export type PhraseKind = "survival" | "transit" | "food" | "slang";

export interface Phrase { ml: string; say: string; en: string; kind: PhraseKind; context: string }

export const phraseKinds: { id: PhraseKind; label: string }[] = [
  { id: "survival", label: "Survival" },
  { id: "transit", label: "Transit" },
  { id: "food", label: "Food" },
  { id: "slang", label: "Slang" },
];

export const phrases: Phrase[] = [
  { kind: "survival", ml: "നമസ്കാരം", say: "na-mas-KAA-ram", en: "Hello (polite)", context: "Say it with palms together. It works with elders, temple staff and homestay hosts." },
  { kind: "survival", ml: "നന്ദി", say: "NUN-dhi", en: "Thank you", context: "Malayalis rarely say it to family, but a visitor saying it always gets a smile." },
  { kind: "survival", ml: "എത്രയാ?", say: "ETH-ra-yaa?", en: "How much?", context: "Ask it before the auto moves, not after." },
  { kind: "survival", ml: "വേണ്ട", say: "VAYN-da", en: "Don't want it / no thanks", context: "The most useful word with touts. Say it calmly and keep walking." },
  { kind: "survival", ml: "മതി", say: "MA-thi", en: "Enough!", context: "Your host will keep refilling your plate. This is the only way to stop it." },
  { kind: "transit", ml: "നേരെ പോ", say: "NAY-ray poh", en: "Go straight", context: "Paired with a hand chop forward, for auto drivers." },
  { kind: "transit", ml: "ഇടത്തോട്ട് / വലത്തോട്ട്", say: "i-DATH-ot / va-LATH-ot", en: "To the left / to the right", context: "Directions are often given by landmark (\"after the church\") rather than street name." },
  { kind: "transit", ml: "ഇവിടെ നിർത്തണം", say: "i-VI-de NIR-tha-nam", en: "Stop here", context: "On private buses, the conductor's whistle stops the bus. Tell them early." },
  { kind: "transit", ml: "മീറ്റർ ഇടൂ", say: "MEE-ter i-DOO", en: "Put the meter on", context: "Autos are supposed to use the meter. Asking politely, in Malayalam, works surprisingly often." },
  { kind: "transit", ml: "ബസ് സ്റ്റാൻഡ്", say: "bus STAAND", en: "Bus station", context: "Ask for the \"KSRTC stand\" (government) or the \"private stand\": they're often in different places." },
  { kind: "food", ml: "ഊണ്", say: "OO-nu", en: "Rice meal", context: "Boards saying \"Meals ready\" mean ഊണ്: rice, curries, refills, for ₹80–150." },
  { kind: "food", ml: "എരിവ് കുറച്ച്", say: "e-riv KU-rach", en: "Less spicy, please", context: "Say it when you order. Beef fry and fish curry can be fierce." },
  { kind: "food", ml: "കട്ടൻ ചായ", say: "KUT-tan CHAA-ya", en: "Black tea", context: "Sweet black tea, the drink of every bus stop. Add \"madhuram venda\" for no sugar." },
  { kind: "food", ml: "കപ്പ", say: "KUP-pa", en: "Tapioca", context: "Boiled and mashed with chilli and coconut, served with fish curry in toddy shops." },
  { kind: "food", ml: "കരിമീൻ", say: "ka-ri-MEEN", en: "Pearl-spot fish", context: "The backwater fish. Karimeen pollichathu is marinated, wrapped in banana leaf and roasted." },
  { kind: "food", ml: "നല്ല രുചി!", say: "NULL-a RU-chi!", en: "Delicious!", context: "Say it to the cook. Expect a second helping you didn't ask for." },
  { kind: "slang", ml: "അടിപൊളി", say: "a-di-PO-li", en: "Fantastic, awesome", context: "Kerala's favourite word. Sunset? Adipoli. Biryani? Adipoli." },
  { kind: "slang", ml: "പൊളി", say: "PO-li", en: "Lit, amazing", context: "The short form. \"Poli saanam\" means a brilliant thing." },
  { kind: "slang", ml: "കിടു", say: "KI-du", en: "Top-notch", context: "Younger slang for something excellent: \"kidu porotta\"." },
  { kind: "slang", ml: "ചേട്ടാ / ചേച്ചീ", say: "CHAY-taa / CHAY-chee", en: "Big brother / big sister", context: "The polite way to call any waiter, driver or shopkeeper. Use it instead of \"excuse me\"." },
  { kind: "slang", ml: "മച്ചാനേ", say: "mach-CHAA-nay", en: "Buddy, mate", context: "Between friends. Fine with your surf instructor, not with the temple priest." },
  { kind: "slang", ml: "മോനേ / മോളേ", say: "MO-nay / MO-lay", en: "Son / daughter", context: "What aunties and uncles will call you, at any age. It's affectionate." },
];

// ─── Spice matrix ─────────────────────────────────────────────────────────────

export type SpiceRegion = "Idukki" | "Wayanad" | "Kannur" | "Alleppey" | "Kottayam" | "Thrissur";

export interface Spice {
  id: string;
  name: string;
  ml: string;
  say: string;
  color: [string, string];
  regions: SpiceRegion[];
  heat: 0 | 1 | 2 | 3;
  taste: string;
  where: string;
  story: string;
  tip: string;
}

export const spiceRegions: SpiceRegion[] = ["Idukki", "Wayanad", "Kannur", "Kottayam", "Alleppey", "Thrissur"];

export const spices: Spice[] = [
  {
    id: "pepper", name: "Black pepper", ml: "കുരുമുളക്", say: "ku-ru-MU-lak", color: ["#2b2622", "#5a4d43"],
    regions: ["Wayanad", "Idukki", "Kannur"], heat: 3, taste: "Sharp, woody, slow-burning heat.",
    where: "Kerala pepper chicken, rasam, nadan beef fry.",
    story: "\"Black gold\". Pepper from the Malabar coast drew Arab, Chinese and Roman traders, and Vasco da Gama landed near Kozhikode in 1498 looking for it.",
    tip: "Buy whole Tellicherry or Malabar pepper and grind it fresh. The pre-ground stuff in tourist shops is dust.",
  },
  {
    id: "cardamom", name: "Green cardamom", ml: "ഏലം", say: "AY-lam", color: ["#4f7a3a", "#8fb071"],
    regions: ["Idukki"], heat: 0, taste: "Floral, citrusy and cooling.",
    where: "Chai, payasam, biryani, unniyappam.",
    story: "The \"queen of spices\" grows under the forest shade of the Cardamom Hills around Kumily and Vandanmedu, where the auctions set prices for the whole country.",
    tip: "Look for fat, bright green pods that smell strongly when cracked. Pale, small pods are old.",
  },
  {
    id: "ginger", name: "Ginger", ml: "ഇഞ്ചി", say: "IN-ji", color: ["#b9935c", "#e0c48f"],
    regions: ["Wayanad", "Idukki"], heat: 2, taste: "Hot, bright, a little sweet.",
    where: "Inji puli at a sadya, chukku kaapi (dry-ginger coffee) for a cold.",
    story: "Dried \"Cochin ginger\" (chukku) was traded for centuries. Every Malayali grandmother prescribes chukku kaapi for a monsoon cold.",
    tip: "Ask for chukku kaapi at a tea shop on a rainy day.",
  },
  {
    id: "turmeric", name: "Turmeric", ml: "മഞ്ഞൾ", say: "MAN-jal", color: ["#c98a12", "#f0bf3c"],
    regions: ["Alleppey", "Wayanad"], heat: 0, taste: "Earthy, warm, slightly bitter.",
    where: "Almost every curry, and fish marinades.",
    story: "Alleppey finger turmeric is prized for its deep colour. Turmeric also turns up in rituals and in the paste brides wear before a wedding.",
    tip: "It stains everything: banana leaves, fingers and white shirts.",
  },
  {
    id: "cinnamon", name: "Cinnamon", ml: "കറുവപ്പട്ട", say: "ka-ru-va-PAT-ta", color: ["#7a4421", "#b06d3c"],
    regions: ["Kannur"], heat: 1, taste: "Sweet, warm, woody.",
    where: "Malabar biryani, meat stews, Christmas plum cake.",
    story: "The East India Company planted the Anjarakandy cinnamon estate near Kannur in the 1760s. It's still one of the largest in Asia.",
    tip: "True cinnamon has thin, papery, many-layered quills. Thick single bark is usually cassia.",
  },
  {
    id: "clove", name: "Clove", ml: "ഗ്രാമ്പൂ", say: "GRAAM-poo", color: ["#4a2a1c", "#7d4a32"],
    regions: ["Idukki", "Kottayam"], heat: 2, taste: "Intense, numbing, medicinal.",
    where: "Biryani, garam masala, appam-and-stew.",
    story: "Cloves are the unopened flower buds of a tree that grows in the hills above Kottayam. A clove held on a sore tooth is the classic home remedy.",
    tip: "A good clove leaves oil on your fingernail when you press it.",
  },
  {
    id: "nutmeg", name: "Nutmeg & mace", ml: "ജാതിക്ക", say: "JAA-thik-ka", color: ["#8a3b24", "#c4583a"],
    regions: ["Thrissur", "Kottayam"], heat: 1, taste: "Sweet, nutty, resinous.",
    where: "Meat dishes, sweets, and nutmeg-fruit pickle and juice.",
    story: "Kerala grows most of India's nutmeg. The red lace around the seed is mace, a second spice from the same fruit.",
    tip: "Try the candied nutmeg fruit sold at spice shops in Thrissur and Kalady.",
  },
  {
    id: "kudampuli", name: "Kudampuli", ml: "കുടംപുളി", say: "ku-dam-PU-li", color: ["#1f1a17", "#4a3b34"],
    regions: ["Kottayam", "Alleppey"], heat: 0, taste: "Smoky, sour and deep.",
    where: "Meen curry, the red fish curry of central Kerala.",
    story: "Malabar tamarind: a fruit smoked and dried until it's black. It gives Kottayam's fish curry its sourness, and the curry tastes better the next day.",
    tip: "Order meen curry with kappa in a toddy shop and taste the kudampuli.",
  },
];
