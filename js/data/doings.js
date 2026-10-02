/*
 * Kerala Journey — experiences: things to actually do on the trip (the /do page, and "Try" on each day of a plan).
 *
 * Not to be confused with js/experiences.js, the hands-on interactives inside each district's sheet.
 *
 *   base    – which planner base it's done from (js/data/plan.js)
 *   kind    – water, nature, wildlife, food, culture, wellness (the filter chips)
 *   hours   – roughly how long it takes, door to door
 *   cost    – a rough price in ₹, for the budget check. `per`: "person" (default) or "group" (one boat or jeep for the party)
 *   when    – optional: "morning", "evening" or "night"
 *   months  – optional: only happens in these months (0 = January)
 *   spot    – optional spot id in the same district, for the photos
 *   note    – optional: something to know before going
 *   tags    – interests from plan.js it suits
 *
 * Prices are ballpark figures that still need checking by someone local; the site always says "about".
 * No providers are listed yet: "Check availability" and booking come later, with verified partners only.
 */
window.KERALA_DOINGS_KINDS = {
  water: "On the water",
  nature: "Walks & treks",
  wildlife: "Wildlife",
  food: "Food",
  culture: "Culture",
  wellness: "Slow & wellness",
};

window.KERALA_DOINGS = [
  // Kasaragod
  { id: "bekal-sunset", base: "bekal", kind: "nature", name: "Sunset on the ramparts of Bekal Fort", hours: 2, cost: 25, when: "evening", spot: "bekal-fort", tags: ["heritage", "beaches"],
    blurb: "Walk the walls as the laterite turns orange, then down to the beach below the fort." },
  { id: "valiyaparamba-boat", base: "bekal", kind: "water", name: "Valiyaparamba backwater boat ride", hours: 3, cost: 2500, per: "group", spot: "valiyaparamba", tags: ["backwaters"],
    blurb: "North Kerala's quiet backwaters: a strip of islands, coconut groves and almost no other boats." },

  // Kannur
  { id: "theyyam-night", base: "kannur", kind: "culture", name: "Watch a village Theyyam", hours: 5, cost: 0, when: "night", months: [11, 0, 1, 2, 3], spot: "theyyam", tags: ["culture"],
    blurb: "A god arrives in a village courtyard, painted and crowned, by firelight. Performances often run all night.",
    note: "Dates are local and change each year: ask your stay which shrine has a kaliyattam that week." },
  { id: "muzhappilangad-drive", base: "kannur", kind: "nature", name: "Drive along Muzhappilangad beach", hours: 1.5, cost: 0, spot: "muzhappilangad", tags: ["beaches", "adventure"],
    blurb: "Four kilometres of firm sand you can drive a car along, at low tide." },
  { id: "kannur-handloom", base: "kannur", kind: "culture", name: "Visit a handloom weavers' co-operative", hours: 2, cost: 0, tags: ["culture", "heritage"],
    blurb: "Kannur has woven cloth for export since the 1800s. Watch the looms, then buy straight from the weavers." },

  // Wayanad
  { id: "chembra-trek", base: "wayanad", kind: "nature", name: "Trek up Chembra to the heart-shaped lake", hours: 5, cost: 900, when: "morning", spot: "chembra", tags: ["adventure", "hills"],
    blurb: "A steep climb through tea and grassland to a lake shaped like a heart, with Wayanad spread out below.",
    note: "Run by the forest department with a daily limit. Treks close after heavy rain; check before you go." },
  { id: "edakkal-climb", base: "wayanad", kind: "culture", name: "Climb to the Edakkal carvings", hours: 3, cost: 100, spot: "edakkal", tags: ["heritage", "adventure"],
    blurb: "A short, steep climb to a cave cleft carved with figures thousands of years old.",
    note: "Usually closed on Mondays." },
  { id: "wayanad-safari", base: "wayanad", kind: "wildlife", name: "Jeep safari at Tholpetty or Muthanga", hours: 2, cost: 2000, per: "group", when: "morning", spot: "wayanad-wildlife", tags: ["wildlife"],
    blurb: "Early drives through the forest where elephants, gaur and deer cross the road." },
  { id: "kuruva-rafting", base: "wayanad", kind: "water", name: "Bamboo raft to Kuruva Island", hours: 3, cost: 300, tags: ["adventure", "wildlife"],
    blurb: "Pole across the Kabini river on a bamboo raft to a cluster of forested river islands." },
  { id: "coffee-estate", base: "wayanad", kind: "food", name: "Walk a coffee and pepper estate", hours: 2, cost: 500, spot: "wayanad-coffee", tags: ["food", "hills"],
    blurb: "See robusta, pepper vines and cardamom growing under shade trees, then taste the coffee." },

  // Kozhikode
  { id: "sm-street-walk", base: "kozhikode", kind: "food", name: "Halwa and snacks on SM Street", hours: 2, cost: 400, when: "evening", tags: ["food"],
    blurb: "Kozhikode's old market street: slabs of halwa in every colour, banana chips fried in front of you." },
  { id: "beypore-uru", base: "kozhikode", kind: "culture", name: "See an uru being built at Beypore", hours: 2, cost: 0, tags: ["heritage", "culture"],
    blurb: "Shipwrights still build huge wooden dhows by hand on the river bank, the way they have for centuries." },
  { id: "kozhikode-beach-evening", base: "kozhikode", kind: "food", name: "Evening on Kozhikode beach", hours: 1.5, cost: 150, when: "evening", spot: "kozhikode-beach", tags: ["beaches", "food"],
    blurb: "Families, sea breeze and carts selling uppilittathu, fruit pickled in salt and chilli." },
  { id: "thusharagiri-hike", base: "kozhikode", kind: "nature", name: "Hike to the Thusharagiri waterfalls", hours: 4, cost: 100, spot: "thusharagiri", tags: ["adventure"],
    blurb: "A forest walk past three waterfalls, the highest dropping into a cold pool." },

  // Malappuram
  { id: "kottakkal-ayurveda", base: "kottakkal", kind: "wellness", name: "Ayurveda consultation at Kottakkal", hours: 2, cost: 500, spot: "kottakkal", tags: ["wellness"],
    blurb: "Kottakkal is home to one of Kerala's oldest Ayurveda institutions. Start with a doctor's consultation, not a spa menu." },
  { id: "nilambur-teak", base: "kottakkal", kind: "nature", name: "The world's oldest teak plantation, Nilambur", hours: 4, cost: 100, spot: "nilambur", tags: ["heritage", "adventure"],
    blurb: "Walk under teak trees planted in the 1840s, then the teak museum." },
  { id: "kadalundi-birds", base: "kottakkal", kind: "wildlife", name: "Birds at the Kadalundi estuary", hours: 2, cost: 0, when: "morning", spot: "kadalundi", tags: ["wildlife"],
    blurb: "Where the river meets the sea: waders and migrants on the mudflats in the cool months." },

  // Palakkad
  { id: "silent-valley-jeep", base: "palakkad", kind: "wildlife", name: "Silent Valley by forest jeep", hours: 6, cost: 3000, per: "group", spot: "silent-valley", tags: ["wildlife", "adventure"],
    blurb: "Into one of India's last untouched rainforests, with a watchtower over the valley.",
    note: "Only by the forest department's jeeps from Mukkali; book ahead." },
  { id: "kalpathy-walk", base: "palakkad", kind: "culture", name: "Walk the Kalpathy agraharam", hours: 1.5, cost: 0, when: "morning", spot: "kalpathy", tags: ["heritage", "culture"],
    blurb: "A street of joined Tamil Brahmin houses with kolam drawn at every door." },

  // Thrissur
  { id: "kalamandalam-day", base: "thrissur", kind: "culture", name: "A morning at Kerala Kalamandalam", hours: 4, cost: 1000, when: "morning", spot: "kalamandalam", tags: ["culture"],
    blurb: "Watch students train in Kathakali, Mohiniyattam and percussion at Kerala's great arts school." },
  { id: "athirappilly-walk", base: "thrissur", kind: "nature", name: "Down to the foot of Athirappilly falls", hours: 4, cost: 100, spot: "athirappilly", tags: ["adventure"],
    blurb: "Kerala's biggest waterfall, loudest just after the monsoon. The path down gets you into the spray." },
  { id: "pooram", base: "thrissur", kind: "culture", name: "Thrissur Pooram", hours: 8, cost: 0, months: [3, 4], spot: "thrissur-pooram", tags: ["culture"],
    blurb: "Caparisoned elephants, the kudamattam parasol exchange and an ocean of drums.",
    note: "One day in April or May, set by the Malayalam calendar. Book rooms months ahead." },

  // Kochi
  { id: "kathakali-show", base: "kochi", kind: "culture", name: "Kathakali, from make-up to performance", hours: 3, cost: 500, when: "evening", spot: "kathakali", tags: ["culture"],
    blurb: "Come early to watch the actors paint their faces, then see an hour of the story told in gesture." },
  { id: "fort-kochi-cycle", base: "kochi", kind: "culture", name: "Cycle through Fort Kochi and Mattancherry", hours: 3, cost: 400, when: "morning", spot: "fort-kochi", tags: ["heritage"],
    blurb: "Chinese fishing nets, Dutch houses, the spice market and Jew Town, before the heat." },
  { id: "kochi-cooking", base: "kochi", kind: "food", name: "Cook a Kerala lunch in a family kitchen", hours: 3, cost: 2000, tags: ["food"],
    blurb: "Grind a coconut masala, temper with mustard and curry leaves, then sit down to eat what you made." },
  { id: "fishing-nets-dusk", base: "kochi", kind: "food", name: "Buy your fish at the Chinese nets", hours: 1.5, cost: 600, when: "evening", spot: "fort-kochi", tags: ["food"],
    blurb: "Pick fish straight from the nets and have a stall next door fry it for you." },

  // Munnar
  { id: "kolukkumalai-sunrise", base: "munnar", kind: "nature", name: "Sunrise at Kolukkumalai tea estate", hours: 5, cost: 3000, per: "group", when: "morning", tags: ["hills", "adventure"],
    blurb: "A rough jeep ride in the dark to one of the highest tea gardens in the world, above the clouds." },
  { id: "tea-museum", base: "munnar", kind: "food", name: "Tea museum and tasting", hours: 2, cost: 200, spot: "munnar", tags: ["food", "hills"],
    blurb: "See how green leaf becomes tea, from withering to the rolling machines, then taste the grades." },
  { id: "tea-walk", base: "munnar", kind: "nature", name: "Walk through the tea gardens", hours: 3, cost: 800, when: "morning", spot: "munnar", tags: ["hills"],
    blurb: "Paths between the clipped bushes, past pickers and workers' lines, with a local guide." },
  { id: "eravikulam-tahr", base: "munnar", kind: "wildlife", name: "Nilgiri tahr at Eravikulam", hours: 3, cost: 200, when: "morning", spot: "eravikulam", tags: ["wildlife", "hills"],
    blurb: "Park buses climb to grassland where the rare mountain goats graze close to the path.",
    note: "Usually closed around February and March, when the tahr have their young." },

  // Thekkady
  { id: "periyar-boat", base: "thekkady", kind: "wildlife", name: "Boat on Periyar lake", hours: 2, cost: 400, when: "morning", spot: "thekkady", tags: ["wildlife"],
    blurb: "Drowned trees stand in the lake; elephants and gaur come down to the water. Take the first boat." },
  { id: "periyar-rafting", base: "thekkady", kind: "water", name: "Bamboo rafting in the tiger reserve", hours: 8, cost: 2500, spot: "thekkady", tags: ["wildlife", "adventure"],
    blurb: "A full day of trekking and rafting with forest guards, the closest you can get to the reserve's heart.",
    note: "Run by the forest department, a few groups a day. Book ahead." },
  { id: "spice-tour", base: "thekkady", kind: "food", name: "Spice plantation tour", hours: 2, cost: 400, spot: "cardamom", tags: ["food"],
    blurb: "Cardamom, pepper, clove, nutmeg and vanilla growing together, with someone to crush each leaf for you to smell." },
  { id: "kalari-show", base: "thekkady", kind: "culture", name: "Kalaripayattu show", hours: 1.5, cost: 300, when: "evening", tags: ["culture"],
    blurb: "Kerala's martial art up close: leaps, sticks, swords and fire." },

  // Vagamon
  { id: "vagamon-meadows", base: "vagamon", kind: "nature", name: "Walk the Vagamon meadows and pine forest", hours: 3, cost: 100, spot: "vagamon", tags: ["hills"],
    blurb: "Rolling bare hills, a planted pine forest and mist that rolls in by mid-afternoon." },

  // Kumarakom
  { id: "kumarakom-birds", base: "kumarakom", kind: "wildlife", name: "Early walk in the bird sanctuary", hours: 2, cost: 150, when: "morning", spot: "kumarakom", tags: ["wildlife"],
    blurb: "Herons, cormorants and kingfishers on the edge of Vembanad lake. Arrive at opening time." },
  { id: "village-life", base: "kumarakom", kind: "culture", name: "A village life experience", hours: 4, cost: 1500, tags: ["culture", "food", "backwaters"],
    blurb: "Tapping toddy, weaving coconut leaves and fishing with local families, as part of Kerala's responsible tourism programme." },

  // Alappuzha
  { id: "houseboat-night", base: "alappuzha", kind: "water", name: "A night on a houseboat", hours: 22, cost: 10000, per: "group", spot: "houseboats", tags: ["backwaters"],
    blurb: "Board at noon, drift through Kuttanad, eat what the cook makes and moor for the night on the water.",
    note: "Price is for a one-bedroom boat with meals; it replaces a night in a hotel." },
  { id: "shikara", base: "alappuzha", kind: "water", name: "Shikara ride through narrow canals", hours: 2, cost: 800, per: "group", spot: "kuttanad", tags: ["backwaters"],
    blurb: "A small covered boat goes where houseboats can't, past homes, churches and paddy." },
  { id: "village-canoe", base: "alappuzha", kind: "water", name: "Village canoe tour in Kuttanad", hours: 3, cost: 800, when: "morning", spot: "kuttanad", tags: ["backwaters", "culture"],
    blurb: "Paddled, not motored: quiet enough to hear kingfishers, with a stop for tea in a village." },
  { id: "toddy-shop", base: "alappuzha", kind: "food", name: "Lunch at a toddy shop", hours: 1.5, cost: 500, tags: ["food"],
    blurb: "Fiery fish curry, tapioca and duck roast, the spiciest cooking in Kerala, next to the paddy.",
    note: "Toddy is alcoholic; the food is the reason to go." },
  { id: "marari-beach", base: "alappuzha", kind: "nature", name: "A slow morning at Marari beach", hours: 3, cost: 0, spot: "marari", tags: ["beaches", "wellness"],
    blurb: "A fishing village beach with more boats than sunbeds." },

  // Pathanamthitta
  { id: "adavi-coracle", base: "pathanamthitta", kind: "water", name: "Coracle ride at Adavi, near Konni", hours: 2, cost: 500, spot: "konni", tags: ["adventure", "wildlife"],
    blurb: "Spin down the Kallar river in a round bamboo boat, after visiting the Konni elephant camp." },
  { id: "gavi-trip", base: "pathanamthitta", kind: "wildlife", name: "A day in Gavi's forest", hours: 8, cost: 2000, spot: "gavi", tags: ["wildlife", "hills"],
    blurb: "Through the tiger reserve to a cardamom-hill village with a lake and trekking trails.",
    note: "Entry is controlled by the forest department and closes at times; book ahead." },
  { id: "aranmula-mirror", base: "pathanamthitta", kind: "culture", name: "Watch an Aranmula mirror being made", hours: 1.5, cost: 0, spot: "aranmula", tags: ["culture", "heritage"],
    blurb: "A metal mirror polished until it reflects from its front face, made by a few families only." },

  // Kollam
  { id: "munroe-canoe", base: "kollam", kind: "water", name: "Canoe the canals of Munroe Island", hours: 3, cost: 600, when: "morning", spot: "munroe-island", tags: ["backwaters", "culture"],
    blurb: "Low bridges, coir-making and prawn farms, from a canoe that fits under all of them." },
  { id: "kollam-cruise", base: "kollam", kind: "water", name: "Day cruise from Kollam to Alappuzha", hours: 8, cost: 700, spot: "ashtamudi", tags: ["backwaters"],
    blurb: "A whole day on the backwaters that doubles as the journey north." },
  { id: "jatayu-cable", base: "kollam", kind: "nature", name: "Cable car up to Jatayu", hours: 3, cost: 500, spot: "jatayu", tags: ["adventure", "culture"],
    blurb: "A giant stone bird on a rock hill, and views across the whole district." },

  // Varkala
  { id: "varkala-cliff", base: "varkala", kind: "nature", name: "Sunset walk along Varkala cliff", hours: 2, cost: 0, when: "evening", spot: "varkala", tags: ["beaches"],
    blurb: "Red laterite cliffs straight above the sea, with cafés along the top." },
  { id: "ayurveda-massage", base: "varkala", kind: "wellness", name: "An Ayurvedic massage", hours: 1.5, cost: 1500, tags: ["wellness"],
    blurb: "Warm herbal oil, a wooden table and a therapist trained in the tradition. Look for a place with a doctor on site." },

  // Thiruvananthapuram
  { id: "padmanabha-visit", base: "trivandrum", kind: "culture", name: "The fort and temple quarter", hours: 3, cost: 0, when: "morning", spot: "padmanabhaswamy", tags: ["heritage", "culture"],
    blurb: "Walk around the temple tank and the old fort streets, then the palace museum next door.",
    note: "Only Hindus may enter the temple, with a strict dress code." },
  { id: "napier-walk", base: "trivandrum", kind: "culture", name: "Napier Museum and the gardens", hours: 2, cost: 100, spot: "napier-museum", tags: ["heritage"],
    blurb: "A painted Indo-Saracenic building full of bronzes, in gardens shared with the zoo." },
  { id: "ponmudi-drive", base: "trivandrum", kind: "nature", name: "Drive up to Ponmudi", hours: 6, cost: 3000, per: "group", spot: "ponmudi", tags: ["hills"],
    blurb: "22 hairpin bends up from the plains to a cool, misty hilltop." },
];
