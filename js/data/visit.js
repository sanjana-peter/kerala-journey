/*
 * Kerala Journey — planning a visit, per district (the "Plan" sheet on each district).
 *
 *   climate   – "coast", "hills" or "gap" (Palakkad). Picks the month-by-month weather from CLIMATES below.
 *   notes     – optional district-specific line per kind of weather (monsoon, showers, hot, pleasant, cool)
 *   best      – months that are the best time to go (0 = January … 11 = December)
 *   events    – festivals and seasons: name, months (array, or "moving" for dates that shift every year), what
 *   getThere  – air, rail, fromKochi
 *   days      – how long to stay
 *   routes    – suggested days: title, stops (spot ids from districts.js / food.js), optional note
 *   tips      – good to know
 *   road      – the way in from the previous district: how, time, tip (shown on the arrival board)
 *
 * Festival dates follow the Malayalam, Hindu or Islamic calendars and move from year to year,
 * so months are approximate: the site always tells visitors to check the dates.
 */
window.KERALA_CLIMATES = {
  kinds: {
    pleasant: { label: "Pleasant", line: "Dry, sunny and warm, with cooler evenings." },
    cool: { label: "Cool", line: "Clear days and chilly nights. Pack a jacket." },
    hot: { label: "Hot", line: "Hot and humid, with the odd evening thunderstorm." },
    monsoon: { label: "Monsoon", line: "The south-west monsoon: heavy rain, deep green, fewer crowds." },
    showers: { label: "Showers", line: "The north-east monsoon: sunny mornings, afternoon storms." },
  },
  // One entry per month, January first.
  coast: ["pleasant", "pleasant", "hot", "hot", "hot", "monsoon", "monsoon", "monsoon", "monsoon", "showers", "showers", "pleasant"],
  hills: ["cool", "cool", "pleasant", "pleasant", "pleasant", "monsoon", "monsoon", "monsoon", "monsoon", "showers", "showers", "cool"],
  gap: ["pleasant", "pleasant", "hot", "hot", "hot", "monsoon", "monsoon", "monsoon", "showers", "showers", "pleasant", "pleasant"],
};

window.KERALA_VISIT = {
  kasaragod: {
    climate: "coast",
    notes: { monsoon: "Ranipuram's grassland turns bright green, but the trail gets slippery." },
    best: [10, 11, 0, 1, 2],
    events: [
      {
        name: "Theyyam season",
        months: [11, 0, 1, 2, 3],
        what: "Village shrines across north Malabar hold Theyyam through the dry months, often all night. Ask locally for the nearest kaliyattam.",
      },
    ],
    getThere: {
      air: "Mangaluru (IXE), about 1½ hours north, or Kannur (CNN), about 2½ hours south",
      rail: "Kasaragod, or Kanhangad for Bekal",
      fromKochi: "About 6 hours by train up the coast",
    },
    days: "1–2 days",
    routes: [
      { title: "Day 1", stops: ["ananthapura", "bekal-fort"], note: "Save Bekal for late afternoon, when the laterite glows." },
      { title: "Day 2", stops: ["valiyaparamba", "neer-dosa"], note: "Or trek Ranipuram at dawn if you like hills more than water." },
    ],
    tips: [
      "Theyyam is a living ritual, not a show: dress modestly, keep out of the performers' path and don't use flash.",
      "Valiyaparamba has few tourist boats. Arrange a canoe or houseboat through your stay.",
      "Kasaragod's hotels fill up less than the south's, even in season.",
    ],
    road: null,
  },

  kannur: {
    climate: "coast",
    notes: { monsoon: "The sea is rough and beaches close to swimming, but the coast is at its greenest." },
    best: [10, 11, 0, 1, 2, 3],
    events: [
      {
        name: "Theyyam season",
        months: [10, 11, 0, 1, 2, 3],
        what: "Kannur is the heart of Theyyam country. Village shrines hold performances from about November to April.",
      },
      {
        name: "Muthappan Theyyam, Parassinikadavu",
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        what: "The Muthappan temple by the Valapattanam river holds a Theyyam almost every day of the year, so you can see one in any season.",
      },
    ],
    getThere: {
      air: "Kannur International (CNN), about 40 minutes from town",
      rail: "Kannur, or Thalassery for the biryani",
      fromKochi: "About 4–5 hours by train",
    },
    days: "2 days",
    routes: [
      { title: "Day 1", stops: ["st-angelo-fort", "payyambalam"], note: "End on Payyambalam beach for sunset." },
      { title: "Day 2", stops: ["muzhappilangad", "thalassery-biryani"], note: "Thalassery is half an hour south: go at lunchtime." },
      { title: "A night", stops: ["theyyam"], note: "Find a village kaliyattam, or go to Parassinikadavu." },
    ],
    tips: [
      "Muzhappilangad is a drive-in beach: keep to the firm sand near the water and follow local signs.",
      "At a Theyyam, devotees come forward for blessings. Watch how others approach before you do.",
      "Kannur is known for its handlooms: look for weaving cooperatives if you want fabric to take home.",
    ],
    road: {
      how: "Train down the coast from Kasaragod",
      time: "About 1½ hours",
      tip: "Sit on the right, facing south, for glimpses of rivers meeting the sea.",
    },
  },

  wayanad: {
    climate: "hills",
    notes: {
      monsoon: "Very heavy rain and a real landslide risk on ghat roads. Waterfalls are at their fullest; check road conditions before you go.",
      cool: "Misty mornings and cold nights up on the plateau.",
    },
    best: [9, 10, 11, 0, 1, 2, 3, 4],
    events: [
      { name: "Coffee harvest", months: [11, 0, 1], what: "Estates pick and sun-dry the ripe red cherries. Many estate stays let you join in." },
      {
        name: "Valliyoorkavu festival",
        months: [2, 3],
        what: "A two-week festival at the Valliyoorkavu Bhagavathi temple near Mananthavady, important to Wayanad's Adivasi communities.",
      },
    ],
    getThere: {
      air: "Kozhikode (CCJ) or Kannur (CNN), about 3 hours either way",
      rail: "No railway. The nearest stations are Kozhikode and Mysuru",
      fromKochi: "About 6–7 hours by road",
    },
    days: "2–3 days",
    routes: [
      { title: "Day 1", stops: ["chembra", "soochipara"], note: "Start the Chembra trek early: permits are limited." },
      { title: "Day 2", stops: ["edakkal", "wayanad-wildlife"], note: "Edakkal is a steep climb; Muthanga jeep safaris run at set times." },
      { title: "Day 3", stops: ["banasura", "wayanad-coffee"] },
    ],
    tips: [
      "Chembra needs a forest department permit with a daily limit. Arrive early.",
      "Safari jeeps into the sanctuary fill up quickly at weekends.",
      "Nights are cold for most of the year. Pack a warm layer.",
    ],
    road: {
      how: "Up from Kannur through the Palchuram ghat",
      time: "About 3 hours",
      tip: "Hairpins through forest, and the air cools as you climb onto the plateau.",
    },
  },

  kozhikode: {
    climate: "coast",
    best: [9, 10, 11, 0, 1, 2],
    events: [
      { name: "Kerala Literature Festival", months: [0], what: "Writers and big crowds gather on Kozhikode beach every January." },
      {
        name: "Ramadan",
        months: "moving",
        what: "The dates move about 11 days earlier each year. After sunset the old town fills with food: pathiri, samosas, fruit and sweets.",
      },
    ],
    getThere: {
      air: "Calicut International (CCJ) at Karipur, about 45 minutes south",
      rail: "Kozhikode",
      fromKochi: "About 3½–4 hours by train",
    },
    days: "1–2 days",
    routes: [
      { title: "Day 1", stops: ["mishkal-mosque", "kozhikodan-halwa", "kozhikode-beach"], note: "SM Street is busiest in the evening; finish on the beach." },
      { title: "Day 2", stops: ["kappad", "thusharagiri"], note: "Kappad in the morning, the waterfalls inland in the afternoon." },
    ],
    tips: [
      "Mishkal Mosque is a working mosque: dress modestly and ask before entering.",
      "Try a sulaimani, black tea with lemon, at any beach stall.",
      "The city is famous for its food; eat where the queues are.",
    ],
    road: {
      how: "Down from Wayanad on the Thamarassery churam",
      time: "About 2½–3 hours",
      tip: "Nine hairpin bends. Stop at the Lakkidi viewpoint at the top.",
    },
  },

  malappuram: {
    climate: "coast",
    notes: { monsoon: "Karkidakam, July to August, is the traditional season for Ayurvedic treatment." },
    best: [9, 10, 11, 0, 1, 2],
    events: [
      { name: "Karkidakam Ayurveda season", months: [6, 7], what: "Kottakkal's Ayurveda centres are busiest in the monsoon, thought to be the best time for treatment." },
      { name: "Kottakkal Pooram", months: [2, 3], what: "A week of classical music and dance at the Viswambhara temple, organised by the Arya Vaidya Sala." },
      { name: "Ramadan", months: "moving", what: "The dates move about 11 days earlier each year. Evenings are for iftar feasts of pathiri and curry." },
    ],
    getThere: {
      air: "Calicut International (CCJ) at Karipur is in the district",
      rail: "Tirur on the main line; Nilambur Road at the end of the branch line",
      fromKochi: "About 4 hours by road",
    },
    days: "1–2 days",
    routes: [
      { title: "Day 1", stops: ["kadalundi", "thirunavaya", "kottakkal"] },
      { title: "Day 2", stops: ["nilambur", "pathiri"], note: "Take the branch-line train to Nilambur through teak country." },
    ],
    tips: [
      "Kadalundi's migratory birds are best from November to April.",
      "Ayurvedic treatments at Kottakkal need booking well ahead.",
      "Conolly's Plot, the world's oldest teak plantation, is reached by a hanging bridge over the Chaliyar.",
    ],
    road: {
      how: "South from Kozhikode by road, or the train to Tirur",
      time: "About 1–1½ hours",
      tip: "For Nilambur, the Shoranur–Nilambur branch line is one of Kerala's prettiest train rides.",
    },
  },

  palakkad: {
    climate: "gap",
    notes: { hot: "Palakkad is one of Kerala's hottest districts in March to May. Carry water." },
    best: [8, 9, 10, 11, 0, 1],
    events: [
      { name: "Kalpathy Ratholsavam", months: [10], what: "Chariots are pulled through the old Tamil Brahmin village of Kalpathy in November." },
      { name: "Nenmara–Vallangi Vela", months: [3], what: "Two neighbouring villages compete with elephants, drums and fireworks every April." },
    ],
    getThere: {
      air: "Coimbatore (CJB), about 1½ hours, or Kochi (COK), about 3 hours",
      rail: "Palakkad Junction (Olavakkode)",
      fromKochi: "About 3–3½ hours",
    },
    days: "2 days",
    routes: [
      { title: "Day 1", stops: ["ramassery-idli", "palakkad-fort", "kalpathy", "malampuzha"], note: "Idli for breakfast, Malampuzha's gardens in the evening." },
      { title: "Day 2", stops: ["silent-valley"], note: "Book the forest department jeep from Mukkali ahead." },
      { title: "Extra day", stops: ["nelliyampathy"] },
    ],
    tips: [
      "Silent Valley is visited by forest department jeep from Mukkali. Book ahead and start early.",
      "Ramassery idli is breakfast food: go before ten.",
      "Palakkad's paddy fields and palmyra palms are best seen from a slow drive through the villages.",
    ],
    road: {
      how: "Inland from Malappuram past Perinthalmanna",
      time: "About 2–3 hours",
      tip: "Watch for palmyra palms: they mark the start of Palakkad's drier plains.",
    },
  },

  thrissur: {
    climate: "coast",
    notes: { monsoon: "Athirappilly Falls is at its most powerful in the monsoon." },
    best: [10, 11, 0, 1],
    events: [
      {
        name: "Thrissur Pooram",
        months: [3, 4],
        what: "The festival of festivals, around the Vadakkunnathan temple: elephants, the kudamattam umbrella exchange and hours of drumming.",
      },
      { name: "Pulikali", months: [7, 8], what: "On the fourth day of Onam, dancers painted as tigers parade through the city." },
    ],
    getThere: {
      air: "Kochi (COK), about 1 hour",
      rail: "Thrissur",
      fromKochi: "About 2 hours",
    },
    days: "1–2 days",
    routes: [
      { title: "Day 1", stops: ["vadakkunnathan", "sadya", "kalamandalam"], note: "Kalamandalam is about an hour north at Cheruthuruthy." },
      { title: "Day 2", stops: ["athirappilly"], note: "About 1½ hours south; the viewpoint trail is steep." },
    ],
    tips: [
      "Only Hindus may enter Vadakkunnathan's inner temple, but the grounds around it are open to everyone.",
      "Kerala Kalamandalam runs visits where you can watch classes. Book ahead.",
      "For Pooram, book a room months in advance.",
    ],
    road: {
      how: "Down from Palakkad through the Kuthiran tunnel",
      time: "About 1½–2 hours",
      tip: "The twin tunnels skip the old winding ghat road.",
    },
  },

  ernakulam: {
    climate: "coast",
    best: [10, 11, 0, 1, 2],
    events: [
      {
        name: "Cochin Carnival",
        months: [11],
        what: "Fort Kochi celebrates New Year's week with parades, ending with a giant Pappanji effigy burned at midnight.",
      },
      {
        name: "Kochi-Muziris Biennale",
        months: [11, 0, 1, 2],
        what: "In biennale years, contemporary art fills Fort Kochi's old warehouses from December to about March.",
      },
      { name: "Athachamayam", months: [7, 8], what: "Onam opens with a street procession of floats and folk art at Tripunithura." },
    ],
    getThere: {
      air: "Cochin International (COK), about 1–1½ hours from Fort Kochi",
      rail: "Ernakulam Junction or Ernakulam Town",
      fromKochi: "You're here",
    },
    days: "2–3 days",
    routes: [
      { title: "Day 1", stops: ["fort-kochi", "mattancherry-palace", "paradesi-synagogue"], note: "The nets are busiest early; Jew Town is a short walk from the palace." },
      { title: "Day 2", stops: ["appam-stew", "cherai", "kathakali"], note: "Arrive early at a Kathakali show to watch the make-up go on." },
    ],
    tips: [
      "The synagogue closes on Fridays, Saturdays and Jewish holidays, and the palace on Fridays. Check before you go.",
      "Ferries link Ernakulam, Fort Kochi and Vypin for a few rupees; the Water Metro runs to several islands.",
      "Fort Kochi is best explored on foot or by bicycle.",
    ],
    road: {
      how: "South from Thrissur by train or road, or the Kochi Metro from Aluva",
      time: "About 2 hours",
    },
  },

  idukki: {
    climate: "hills",
    notes: {
      cool: "Munnar's nights can drop close to freezing in December and January.",
      monsoon: "Misty and green, but landslides can close roads. Travel early in the day.",
    },
    best: [8, 9, 10, 11, 0, 1, 2, 3, 4],
    events: [
      {
        name: "Eravikulam closed for calving",
        months: [1, 2],
        what: "Eravikulam National Park usually closes for the Nilgiri tahr calving season, roughly February and March.",
      },
      {
        name: "Chitra Pournami at Mangala Devi",
        months: [3, 4],
        what: "The ancient forest temple near Thekkady opens to visitors on only one day a year, the full moon of Chithira.",
      },
      {
        name: "Neelakurinji bloom",
        months: [7, 8, 9],
        what: "Once every twelve years the hills turn blue with kurinji flowers. The last bloom was in 2018; the next is expected around 2030.",
      },
    ],
    getThere: {
      air: "Kochi (COK), about 3½–4 hours to Munnar",
      rail: "No railway. Use Aluva or Ernakulam for Munnar, Kottayam for Thekkady",
      fromKochi: "About 4 hours to Munnar, 4½–5 to Thekkady",
    },
    days: "3 days",
    routes: [
      { title: "Day 1", stops: ["munnar", "eravikulam"], note: "Book Eravikulam tickets online." },
      { title: "Day 2", stops: ["idukki-dam", "vagamon"] },
      { title: "Day 3", stops: ["thekkady", "cardamom"], note: "Take the first Periyar boat of the day for the best wildlife." },
    ],
    tips: [
      "Book Eravikulam tickets online; the queues are long in season.",
      "Pack a jacket for Munnar, even in summer.",
      "Hill roads are narrow and slow. Allow more time than the map says.",
    ],
    road: {
      how: "Up into the ghats from Ernakulam via Kothamangalam and Adimali",
      time: "About 4 hours to Munnar",
      tip: "Waterfalls right by the road at Cheeyappara and Valara, and spice shops at Adimali.",
    },
  },

  kottayam: {
    climate: "coast",
    best: [10, 11, 0, 1, 2],
    events: [
      { name: "Migratory birds at Kumarakom", months: [10, 11, 0, 1], what: "Winter visitors join the resident herons, darters and kingfishers. Go at dawn." },
      { name: "Vaikom Ashtami", months: [10, 11], what: "A twelve-day festival at the Vaikom Mahadeva temple, one of Kerala's oldest." },
    ],
    getThere: {
      air: "Kochi (COK), about 2 hours",
      rail: "Kottayam",
      fromKochi: "About 2 hours",
    },
    days: "1–2 days",
    routes: [
      { title: "Day 1", stops: ["kumarakom", "vembanad", "kappa-meen"], note: "Birds at dawn, the lake at sunset, fish curry for dinner." },
      { title: "Day 2", stops: ["illikkal-kallu", "rubber"], note: "Skip Illikkal Kallu in heavy rain: the summit is steep and windy." },
    ],
    tips: [
      "Kumarakom Bird Sanctuary is best at dawn.",
      "Lakeside toddy shops serve kappa and fish curry for lunch.",
      "Kottayam is known as the land of letters, lakes and latex: books, backwaters and rubber.",
    ],
    road: {
      how: "Down from Idukki on the KK Road through rubber country",
      time: "About 3–4 hours",
    },
  },

  alappuzha: {
    climate: "coast",
    notes: { monsoon: "Houseboats are cheaper and the paddy fields are green, but rain comes in heavy bursts." },
    best: [10, 11, 0, 1, 2],
    events: [
      { name: "Nehru Trophy Boat Race", months: [7], what: "Snake boats race on Punnamada Lake, traditionally on the second Saturday of August." },
      { name: "Champions Boat League", months: [7, 8, 9, 10], what: "In recent years, a league of snake boat races has toured the backwaters from August to November." },
    ],
    getThere: {
      air: "Kochi (COK), about 2 hours",
      rail: "Alappuzha",
      fromKochi: "About 1½ hours",
    },
    days: "2 days, with a night on a houseboat",
    routes: [
      { title: "Day 1", stops: ["houseboats", "kuttanad", "karimeen-pollichathu"], note: "Board around noon; the boat anchors for the night at dusk." },
      { title: "Day 2", stops: ["marari", "alappuzha-beach"], note: "A slow beach morning, then sunset by the old pier." },
    ],
    tips: [
      "Houseboats board around noon and stop cruising at dusk. Air conditioning often runs only at night: check what's included.",
      "Book through a licensed operator and agree on the route before you set off.",
      "On a budget? A few hours on a shikara (small canopy boat) or the public ferry shows you the same canals.",
    ],
    road: {
      how: "The public ferry from Kottayam across Vembanad Lake",
      time: "About 2½ hours",
      tip: "The cheapest backwater cruise in Kerala, on a working ferry.",
    },
  },

  pathanamthitta: {
    climate: "coast",
    best: [9, 10, 11, 0, 1, 2],
    events: [
      {
        name: "Sabarimala season",
        months: [10, 11, 0],
        what: "The Mandala–Makaravilakku pilgrimage, mid-November to mid-January. Millions of pilgrims, and very busy roads.",
      },
      { name: "Aranmula Valla Sadya", months: [6, 7, 8, 9], what: "Temple feasts for the snake boat crews, with more than sixty dishes. Visitors can book a place." },
      { name: "Aranmula Uthrattathi boat race", months: [7, 8], what: "Snake boats race, singing, on the Pamba during Onam." },
      { name: "Maramon Convention", months: [1], what: "One of Asia's largest Christian gatherings, held on the Pamba riverbed in February." },
    ],
    getThere: {
      air: "Thiruvananthapuram (TRV) or Kochi (COK), about 2½–3 hours",
      rail: "Chengannur or Thiruvalla",
      fromKochi: "About 3 hours",
    },
    days: "1–2 days",
    routes: [
      { title: "Day 1", stops: ["aranmula", "valla-sadya", "konni"], note: "The Valla Sadya runs from July to October only." },
      { title: "Day 2", stops: ["gavi"], note: "Book your Gavi visit ahead: entries are limited." },
    ],
    tips: [
      "Gavi is inside a forest reserve. Visits are by permit or booked package, with limited daily entries.",
      "Sabarimala has strict customs and rules. Check the latest before planning a pilgrimage.",
      "At Aranmula, look for makers of the Aranmula kannadi, a mirror polished from a secret metal alloy.",
    ],
    road: {
      how: "East from Alappuzha through Kuttanad to Chengannur",
      time: "About 2 hours",
    },
  },

  kollam: {
    climate: "coast",
    best: [10, 11, 0, 1, 2],
    events: [
      {
        name: "Kottankulangara Chamayavilakku",
        months: [2, 3],
        what: "At this temple festival near Chavara, men dress as women and carry lamps through the night.",
      },
      { name: "Kollam Pooram", months: [3], what: "Elephants and a kudamattam umbrella exchange at the Asramam temple in April." },
    ],
    getThere: {
      air: "Thiruvananthapuram (TRV), about 1½ hours",
      rail: "Kollam Junction",
      fromKochi: "About 3 hours by train",
    },
    days: "1–2 days",
    routes: [
      { title: "Day 1", stops: ["munroe-island", "ashtamudi", "cashew"], note: "Canoe Munroe Island at sunrise." },
      { title: "Day 2", stops: ["jatayu", "thenmala"] },
    ],
    tips: [
      "Munroe Island canoe trips are best at sunrise or late afternoon.",
      "The long tourist boat between Kollam and Alappuzha takes most of a day and is a beautiful way to travel.",
      "Buy cashews from factory outlets or cooperative stores.",
    ],
    road: {
      how: "South from Pathanamthitta via Adoor",
      time: "About 1½–2 hours",
    },
  },

  thiruvananthapuram: {
    climate: "coast",
    notes: { showers: "The north-east monsoon brings more rain here in October and November than further north." },
    best: [10, 11, 0, 1, 2],
    events: [
      {
        name: "Attukal Pongala",
        months: [1, 2],
        what: "Hundreds of thousands of women cook pongala, a sweet rice offering, in clay pots along the city's streets on one day.",
      },
      { name: "Onam week", months: [7, 8], what: "The state's Onam celebrations: lights across the city and a grand closing procession." },
      {
        name: "Padmanabhaswamy Aarattu",
        months: [2, 3, 9, 10],
        what: "Twice a year the temple's deities are carried in procession to Shankumugham beach for a ritual bath.",
      },
    ],
    getThere: {
      air: "Thiruvananthapuram International (TRV), about 15 minutes from the city",
      rail: "Thiruvananthapuram Central; Varkala Sivagiri for the cliffs",
      fromKochi: "About 4 hours by train",
    },
    days: "2–3 days",
    routes: [
      { title: "Day 1", stops: ["puttu-kadala", "padmanabhaswamy", "napier-museum"], note: "Puttu for breakfast, the temple early, the museum in the afternoon." },
      { title: "Day 2", stops: ["kovalam"] },
      { title: "Day 3", stops: ["varkala", "ponmudi"], note: "Pick one: cliffs by the sea, or cool hills inland." },
    ],
    tips: [
      "Padmanabhaswamy Temple is open only to Hindus and has a strict dress code: a mundu (dhoti) for men, a sari or long skirt for women.",
      "Swim only where lifeguards are posted; currents off Kovalam and Varkala are strong.",
      "Varkala's cliff paths have no railings in places. Take care after dark.",
    ],
    road: {
      how: "The coastal train from Kollam",
      time: "About 1–1½ hours",
      tip: "Hop off at Varkala for the cliffs on the way.",
    },
  },
};
