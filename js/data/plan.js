/*
 * Kerala Journey — what the trip planner (/plan) builds itineraries from.
 *
 * bases – the towns a trip actually stays in. A district can have more than one (Idukki: Munnar, Thekkady, Vagamon).
 *   district  – the district it belongs to (districts.js)
 *   coords    – [lat, lon] of the town, used for the route map and drive-time estimates
 *   hills     – true = slow, winding roads (drive times are estimated slower)
 *   tags      – which interests it's good for (see `interests`)
 *   spots     – spot ids from districts.js that you see from here, in a sensible visiting order
 *   days      – [least, ideal] full days to spend
 *   weight    – how "classic" it is for a first visit (0–3); breaks ties between equally good bases
 * seasonal – spots that are events, with the months they happen in
 * gateways – where a trip can start and end (airports)
 * costs    – rough daily costs in ₹ by travel style, for the budget check. They are ballpark figures, not quotes:
 *   room      – one room, one night       food   – per person, per day
 *   local     – per person per day: entry tickets, autos, small things
 *   perKm     – moving between towns: per person by bus/train (budget), per vehicle with a driver (comfort, luxury)
 *
 * Drive times are estimated from straight-line distance, so the site calls them "about".
 */
window.KERALA_PLAN = {
  interests: {
    backwaters: "Backwaters",
    hills: "Hills & tea",
    beaches: "Beaches",
    wildlife: "Wildlife",
    heritage: "History",
    culture: "Art & ritual",
    food: "Food",
    adventure: "Treks & outdoors",
    wellness: "Ayurveda & slow",
  },

  parties: {
    solo: { label: "Solo", people: 1, rooms: 1 },
    couple: { label: "Couple", people: 2, rooms: 1 },
    family: { label: "Family of 4", people: 4, rooms: 1.5 },
    friends: { label: "4 friends", people: 4, rooms: 2 },
  },

  paces: {
    // maxDrive: the longest town-to-town drive (hours) the planner aims for. Kochi–Munnar, the classic, is about 4.
    relaxed: { label: "Relaxed", daysPerBase: 3, maxDrive: 4 },
    balanced: { label: "Balanced", daysPerBase: 2, maxDrive: 5 },
    packed: { label: "See a lot", daysPerBase: 1.5, maxDrive: 6.5 },
  },

  // Places that are really events: the planner only lists them in these months (0 = January).
  // Dates move a little each year, so the place page has the details.
  seasonal: {
    "alappuzha/snake-boats": [7, 8],
    "thrissur/thrissur-pooram": [3, 4],
    "kannur/theyyam": [10, 11, 0, 1, 2, 3, 4],
    "palakkad/kalpathy": [10],
    "pathanamthitta/sabarimala": [10, 11, 0],
  },

  gateways: [
    { id: "cok", name: "Kochi airport", short: "Kochi", coords: [10.152, 76.391] },
    { id: "trv", name: "Thiruvananthapuram airport", short: "Thiruvananthapuram", coords: [8.482, 76.92] },
    { id: "ccj", name: "Kozhikode airport", short: "Kozhikode", coords: [11.137, 75.955] },
    { id: "cnn", name: "Kannur airport", short: "Kannur", coords: [11.918, 75.547] },
  ],

  styles: {
    budget: { label: "Budget", room: 1500, food: 600, local: 300, perKm: 2, transit: "bus and train" },
    comfort: { label: "Comfort", room: 4500, food: 1400, local: 500, perKm: 18, transit: "a car with a driver" },
    luxury: { label: "Luxury", room: 12000, food: 3000, local: 900, perKm: 22, transit: "a car with a driver" },
  },

  bases: [
    {
      id: "bekal", name: "Bekal", district: "kasaragod", coords: [12.392, 75.033],
      tags: ["beaches", "heritage", "backwaters"], spots: ["ananthapura", "bekal-fort", "valiyaparamba", "ranipuram"], days: [1, 2], weight: 1,
    },
    {
      id: "kannur", name: "Kannur", district: "kannur", coords: [11.874, 75.37],
      tags: ["culture", "beaches", "heritage", "food"], spots: ["st-angelo-fort", "payyambalam", "muzhappilangad", "theyyam"], days: [1, 2], weight: 1,
    },
    {
      id: "wayanad", name: "Wayanad", district: "wayanad", coords: [11.609, 76.083], hills: true,
      tags: ["hills", "wildlife", "adventure"], spots: ["chembra", "soochipara", "edakkal", "wayanad-wildlife", "banasura"], days: [2, 3], weight: 2,
    },
    {
      id: "kozhikode", name: "Kozhikode", district: "kozhikode", coords: [11.259, 75.78],
      tags: ["food", "heritage", "beaches"], spots: ["mishkal-mosque", "kozhikode-beach", "kappad", "thusharagiri"], days: [1, 2], weight: 1,
    },
    {
      id: "kottakkal", name: "Kottakkal", district: "malappuram", coords: [11.0, 75.995],
      tags: ["wellness", "heritage"], spots: ["kottakkal", "kadalundi", "thirunavaya", "nilambur"], days: [1, 2], weight: 0,
    },
    {
      id: "palakkad", name: "Palakkad", district: "palakkad", coords: [10.776, 76.654],
      tags: ["heritage", "culture", "wildlife", "hills"], spots: ["palakkad-fort", "kalpathy", "malampuzha", "silent-valley", "nelliyampathy"], days: [1, 2], weight: 0,
    },
    {
      id: "thrissur", name: "Thrissur", district: "thrissur", coords: [10.527, 76.214],
      tags: ["culture", "heritage", "adventure"], spots: ["vadakkunnathan", "kalamandalam", "thrissur-pooram", "athirappilly"], days: [1, 2], weight: 1,
    },
    {
      id: "kochi", name: "Kochi", district: "ernakulam", coords: [9.965, 76.243],
      tags: ["heritage", "culture", "food", "beaches"], spots: ["fort-kochi", "mattancherry-palace", "paradesi-synagogue", "kathakali", "cherai"], days: [1, 2], weight: 3,
    },
    {
      id: "munnar", name: "Munnar", district: "idukki", coords: [10.089, 77.06], hills: true,
      tags: ["hills", "adventure", "wildlife"], spots: ["munnar", "eravikulam"], days: [2, 2], weight: 3,
    },
    {
      id: "thekkady", name: "Thekkady", district: "idukki", coords: [9.603, 77.161], hills: true,
      tags: ["wildlife", "hills", "adventure"], spots: ["thekkady"], days: [1, 2], weight: 2,
    },
    {
      id: "vagamon", name: "Vagamon", district: "idukki", coords: [9.686, 76.905], hills: true,
      tags: ["hills", "adventure"], spots: ["vagamon", "idukki-dam"], days: [1, 1], weight: 0,
    },
    {
      id: "kumarakom", name: "Kumarakom", district: "kottayam", coords: [9.617, 76.43],
      tags: ["backwaters", "wildlife", "wellness"], spots: ["kumarakom", "vembanad", "illikkal-kallu", "rubber"], days: [1, 2], weight: 1,
    },
    {
      id: "alappuzha", name: "Alappuzha", district: "alappuzha", coords: [9.498, 76.339],
      tags: ["backwaters", "beaches", "food"], spots: ["houseboats", "kuttanad", "snake-boats", "marari", "alappuzha-beach"], days: [1, 2], weight: 3,
    },
    {
      id: "pathanamthitta", name: "Konni & Gavi", district: "pathanamthitta", coords: [9.23, 76.85], hills: true,
      tags: ["wildlife", "culture", "adventure"], spots: ["aranmula", "konni", "gavi", "sabarimala"], days: [1, 2], weight: 0,
    },
    {
      id: "kollam", name: "Kollam", district: "kollam", coords: [8.893, 76.614],
      tags: ["backwaters", "adventure", "heritage"], spots: ["munroe-island", "ashtamudi", "jatayu", "thenmala"], days: [1, 2], weight: 1,
    },
    {
      id: "varkala", name: "Varkala", district: "thiruvananthapuram", coords: [8.734, 76.703],
      tags: ["beaches", "wellness"], spots: ["varkala"], days: [1, 2], weight: 2,
    },
    {
      id: "trivandrum", name: "Thiruvananthapuram", district: "thiruvananthapuram", coords: [8.524, 76.936],
      tags: ["heritage", "culture", "beaches", "hills"], spots: ["padmanabhaswamy", "napier-museum", "kovalam", "ponmudi"], days: [1, 2], weight: 1,
    },
  ],
};
