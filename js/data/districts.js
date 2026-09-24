/*
 * Kerala Journey — district & place content.
 *
 * This is the file to edit when adding places. Each spot's `media` block tells
 * scripts/fetch-media.mjs where to look on Wikimedia Commons:
 *   categories – Commons categories to pull files from (without "Category:")
 *   search     – fallback full-text search if categories give too few photos
 *   wiki       – English Wikipedia title, used to fetch map coordinates
 *   coords     – [lat, lon] to use instead of the Wikipedia lookup
 *   exclude    – title fragments of Commons photos to skip
 * After editing, run `npm run media` to download photos and credits.
 *
 * must: true marks a place as a must-visit (badge + Guide page).
 * Signature dishes live in food.js and are added to each district automatically.
 *
 * Districts are listed north → south: the order of the journey.
 */
window.KERALA_DISTRICTS = [
  {
    id: "kasaragod",
    name: "Kasaragod",
    ml: "കാസർഗോഡ്",
    tagline: "Forts on the edge of the sea",
    intro:
      "Kerala begins here, at its northern tip, where seven languages share one small district and laterite forts still watch the Arabian Sea.",
    spots: [
      {
        id: "bekal-fort",
        must: true,
        name: "Bekal Fort",
        blurb:
          "Built around 1650 by Shivappa Nayaka of Keladi, Kerala's largest fort curls around a headland so that the sea presses in on three sides. Climb the observation tower and the coastline runs away in both directions.",
        senses: {
          hear: "Waves slapping laterite walls below the ramparts",
          taste: "Kallummakkaya (mussel) fry from a beach stall",
          feel: "Salt wind pushing through the gun-holes",
        },
        media: { categories: ["Bekal Fort"], search: "Bekal Fort Kasaragod", wiki: "Bekal Fort", exclude: ["TPR", "GuestHouse", "Pallikara"] },
      },
      {
        id: "ananthapura",
        name: "Ananthapura Lake Temple",
        blurb:
          "Kerala's only lake temple sits in the middle of a still, square pond. For decades the pond was home to Babiya, a crocodile devotees said lived on temple offerings alone.",
        senses: {
          hear: "A temple bell carrying across still water",
          taste: "Sweet payasam offered after the pooja",
          feel: "Cool stone underfoot on the walkway",
        },
        media: { categories: ["Ananthapura Lake Temple"], search: "Ananthapura lake temple", wiki: "Ananthapura Lake Temple" },
      },
      {
        id: "ranipuram",
        name: "Ranipuram",
        blurb:
          "A trek through evergreen shola forest opens onto rolling grassland about 750 m up, with the Western Ghats layered blue into the distance.",
        senses: {
          hear: "Grass hissing in a mountain breeze",
          taste: "Black tea from a flask at the summit",
          feel: "Mist beading on your sleeves",
        },
        media: { categories: ["Ranipuram"], search: "Ranipuram hills", wiki: "Ranipuram", exclude: ["Half Kilometer", "Flora"] },
      },
      {
        id: "valiyaparamba",
        name: "Valiyaparamba Backwaters",
        blurb:
          "Northern Kerala's quietest backwater: a long sheet of water dotted with islands, fishing canoes and coconut groves, with none of the southern crowds.",
        senses: {
          hear: "Paddles dipping, and nothing else",
          taste: "Fresh karimeen from a village kitchen",
          feel: "The slow rock of a country boat",
        },
        media: { categories: ["Valiyaparamba", "Kavvayi Backwaters", "Kavvayi"], search: "Kavvayi backwaters", wiki: "Valiyaparamba", exclude: ["Photos taken from a boat"] },
      },
    ],
  },
  {
    id: "kannur",
    name: "Kannur",
    ml: "കണ്ണൂർ",
    tagline: "The land of looms and lore",
    intro:
      "Handloom weaving, Portuguese ramparts and the fire-lit nights of Theyyam. Kannur holds on to its rituals more closely than anywhere else in Kerala.",
    spots: [
      {
        id: "theyyam",
        must: true,
        name: "Theyyam",
        blurb:
          "From December to April, village shrines light up for Theyyam, a ritual in which the performer, in towering headdress and painted face, is believed to become the deity.",
        senses: {
          hear: "Chenda drums rising to a frenzy",
          taste: "Rice and jaggery prasadam at dawn",
          feel: "Heat from the torches in the night air",
        },
        media: { categories: ["Theyyam"], search: "Theyyam Kannur", wiki: "Theyyam", coords: [11.8745, 75.3704] },
      },
      {
        id: "muzhappilangad",
        name: "Muzhappilangad Drive-in Beach",
        blurb:
          "About four kilometres of hard-packed sand you can drive along, with black rocks offshore and Dharmadam Island within reach at low tide.",
        senses: {
          hear: "Tyres crunching on wet sand",
          taste: "Unnakkaya, a banana dumpling Malabar makes for tea time",
          feel: "Spray from the surf through an open window",
        },
        media: { categories: ["Muzhappilangad Beach"], search: "Muzhappilangad drive-in beach", wiki: "Muzhappilangad Drive-in Beach" },
      },
      {
        id: "st-angelo-fort",
        name: "St. Angelo Fort",
        blurb:
          "Francisco de Almeida, the first Portuguese viceroy in India, built this fort in 1505. It later passed to the Dutch and the British, and still overlooks Mappila Bay's fishing harbour.",
        senses: {
          hear: "Fishermen calling across Mappila Bay",
          taste: "Kannur's famous thalassery-style biryani",
          feel: "Rough moss-green laterite under your palm",
        },
        media: { categories: ["St. Angelo Fort"], search: "St Angelo Fort Kannur", wiki: "St. Angelo Fort" },
      },
      {
        id: "payyambalam",
        name: "Payyambalam Beach",
        blurb:
          "A long, clean beach at the edge of Kannur town, lined with casuarinas. Locals come here in the evening to watch the sun drop into the sea.",
        senses: {
          hear: "Evening crowds and a kite snapping overhead",
          taste: "Roasted peanuts in a paper cone",
          feel: "Warm sand cooling as the sun sets",
        },
        media: { categories: ["Payyambalam Beach"], search: "Payyambalam beach Kannur", wiki: "Payyambalam Beach", exclude: ["Sukumar"] },
      },
    ],
  },
  {
    id: "wayanad",
    name: "Wayanad",
    ml: "വയനാട്",
    tagline: "Highlands of mist and spice",
    intro:
      "A plateau in the Western Ghats full of coffee, pepper and cardamom. Neolithic caves, elephant forests and peaks sit in cloud for half the year.",
    spots: [
      {
        id: "edakkal",
        must: true,
        name: "Edakkal Caves",
        blurb:
          "Scramble up Ambukuthi Mala to a cleft in the rock whose walls are covered in Neolithic carvings of human figures, animals and symbols, among the oldest in South India.",
        senses: {
          hear: "Echoes inside the rock chamber",
          taste: "Wayanad coffee, strong and sweet",
          feel: "Cold granite and a narrow, steep climb",
        },
        media: { categories: ["Edakkal Caves"], search: "Edakkal caves petroglyphs", wiki: "Edakkal Caves" },
      },
      {
        id: "chembra",
        name: "Chembra Peak",
        blurb:
          "Wayanad's highest peak at 2,100 m. Halfway up is Hridaya Saras, a small lake that stays heart-shaped all year.",
        senses: {
          hear: "Wind over bare grassy ridges",
          taste: "Cardamom tea from the base camp",
          feel: "Cloud drifting straight through you",
        },
        media: { categories: ["Chembra Peak"], search: "Chembra peak Wayanad", wiki: "Chembra Peak" },
      },
      {
        id: "banasura",
        name: "Banasura Sagar",
        blurb:
          "One of India's largest earth dams, holding back a reservoir scattered with small islands, the tops of drowned hills.",
        senses: {
          hear: "A speedboat's wake fading into silence",
          taste: "Bamboo rice payasam, a tribal speciality",
          feel: "Cool highland air over open water",
        },
        media: { categories: ["Banasura Sagar Dam"], search: "Banasura Sagar dam", wiki: "Banasura Sagar Dam" },
      },
      {
        id: "soochipara",
        name: "Soochipara Falls",
        blurb:
          "A three-tiered waterfall dropping about 200 m through evergreen forest into a pool where you can wade in.",
        senses: {
          hear: "A roar that you feel in your chest",
          taste: "Spiced banana fritters at the trailhead",
          feel: "Icy spray on your face",
        },
        media: { categories: ["Soochipara Falls"], search: "Soochipara falls Wayanad", wiki: "Soochipara Falls" },
      },
      {
        id: "wayanad-wildlife",
        name: "Wayanad Wildlife Sanctuary",
        blurb:
          "Part of the Nilgiri Biosphere Reserve, where wild elephants, gaur and deer often cross the forest roads.",
        senses: {
          hear: "A langur's alarm call in the canopy",
          taste: "Wild honey collected by forest communities",
          feel: "Stillness, then a branch snapping nearby",
        },
        media: { categories: ["Wayanad Wildlife Sanctuary"], search: "Wayanad wildlife sanctuary elephant", wiki: "Wayanad Wildlife Sanctuary", exclude: ["Antipoaching"] },
      },
    ],
  },
  {
    id: "kozhikode",
    name: "Kozhikode",
    ml: "കോഴിക്കോട്",
    tagline: "City of spices and sweet halwa",
    intro:
      "The old port of Calicut traded pepper with Arabia and China for centuries. It is still a city of merchants, mosques and some of Kerala's best food.",
    spots: [
      {
        id: "kappad",
        must: true,
        name: "Kappad Beach",
        blurb:
          "The rocky shore where Vasco da Gama is said to have landed in 1498, opening the sea route from Europe to India. A small stone memorial marks the spot.",
        senses: {
          hear: "Waves breaking over black boulders",
          taste: "Kallummakkaya nirachathu, stuffed mussels",
          feel: "Warm rock under bare feet",
        },
        media: { categories: ["Kappad"], search: "Kappad beach", wiki: "Kappad" },
      },
      {
        id: "kozhikode-beach",
        name: "Kozhikode Beach",
        blurb:
          "The city's evening gathering place, with old piers rusting out into the sea, a lighthouse and food carts lit up after dark.",
        senses: {
          hear: "Hawkers calling over the surf",
          taste: "Uppilittathu: gooseberry and mango pickled in salt",
          feel: "Humid sea breeze at dusk",
        },
        media: { categories: [], search: "Kozhikode beach sunset", wiki: "Kozhikode Beach" },
      },
      {
        id: "mishkal-mosque",
        name: "Mishkal Mosque",
        blurb:
          "A 14th-century mosque made largely of wood, four storeys tall, built in Kerala's temple style with tiled roofs. It stands in Kuttichira, the old Muslim quarter.",
        senses: {
          hear: "The azaan drifting over tiled rooftops",
          taste: "Kozhikodan biryani with fragrant kaima rice",
          feel: "Cool shade under deep wooden eaves",
        },
        media: { categories: ["Mishkal Mosque"], search: "Mishkal mosque Kozhikode", wiki: "Mishkal Mosque" },
      },
      {
        id: "thusharagiri",
        name: "Thusharagiri Falls",
        blurb:
          "The name means 'snow-capped mountain', after the white spray. A chain of falls in the forest, popular with trekkers and rock climbers.",
        senses: {
          hear: "Water on water, all around",
          taste: "Kozhikodan halwa brought for the road",
          feel: "Slippery rocks and a sudden drop in temperature",
        },
        media: { categories: [], search: "Thusharagiri waterfall", wiki: "Thusharagiri Falls", exclude: ["WUS06319", "bridge"] },
      },
    ],
  },
  {
    id: "malappuram",
    name: "Malappuram",
    ml: "മലപ്പുറം",
    tagline: "Teak forests and healing traditions",
    intro:
      "Rivers, teak and Ayurveda. Malappuram is home to the world's oldest teak plantation and to one of Kerala's most famous centres of traditional medicine.",
    spots: [
      {
        id: "nilambur",
        must: true,
        name: "Nilambur & Conolly's Plot",
        blurb:
          "Planted in the 1840s, Conolly's Plot is the oldest teak plantation in the world. You reach it over a hanging bridge across the Chaliyar, and the trees are huge.",
        senses: {
          hear: "The hanging bridge creaking underfoot",
          taste: "Tender coconut cut open with a machete",
          feel: "Dappled light through towering teak",
        },
        media: { categories: ["Conolly's Plot", "Nilambur", "Teak Museum Nilambur"], search: "Nilambur teak", wiki: "Nilambur", coords: [11.2866, 76.2386], exclude: ["Godavarman", "town and around", "Research Institute", "vinnila2k24"] },
      },
      {
        id: "kadalundi",
        name: "Kadalundi Bird Sanctuary",
        blurb:
          "Where the Kadalundi river meets the sea, islands and mangroves draw more than a hundred species of native birds and many migrants in winter.",
        senses: {
          hear: "Terns and gulls over the estuary",
          taste: "Crab curry from the fishing village",
          feel: "Mangrove mud and brackish breeze",
        },
        media: { categories: ["Kadalundi Bird Sanctuary"], search: "Kadalundi bird sanctuary", wiki: "Kadalundi Bird Sanctuary", exclude: ["Sanctuary09337", "Thottavadi"] },
      },
      {
        id: "kottakkal",
        name: "Kottakkal",
        blurb:
          "Home of the Arya Vaidya Sala, founded in 1902, one of the best-known names in Ayurveda. People come from around the world for its treatments.",
        senses: {
          hear: "Quiet corridors and rustling herb gardens",
          taste: "Bitter herbal kashayam, taken for health",
          feel: "Warm medicated oil and a slow massage",
        },
        media: { categories: ["Arya Vaidya Sala"], search: "Arya Vaidya Sala Kottakkal", wiki: "Kottakkal" },
      },
      {
        id: "thirunavaya",
        name: "Thirunavaya",
        blurb:
          "On the banks of the Bharathapuzha, this was the site of the Mamankam, a great festival and fair held every twelve years in medieval times.",
        senses: {
          hear: "The river moving slowly over sandbanks",
          taste: "Pathiri and chicken curry, the Malabar way",
          feel: "Soft river sand warm in the afternoon",
        },
        media: { categories: ["Thirunavaya", "Bharathappuzha"], search: "Bharathapuzha river", wiki: "Thirunavaya" },
      },
    ],
  },
  {
    id: "palakkad",
    name: "Palakkad",
    ml: "പാലക്കാട്",
    tagline: "The granary through the gap",
    intro:
      "The Palakkad Gap cuts through the Western Ghats, and the wind, trade and Tamil influences that came through it shaped a green district of paddy fields and palmyra palms.",
    spots: [
      {
        id: "palakkad-fort",
        name: "Palakkad Fort",
        blurb:
          "Hyder Ali rebuilt this granite fort in 1766. It is one of the best-preserved in Kerala, with its moat still full of water.",
        senses: {
          hear: "Kids' cricket echoing off the ramparts",
          taste: "Rice-flour pidi with mutton curry",
          feel: "Dry Palakkad wind coming through the gap",
        },
        media: { categories: ["Palakkad Fort"], search: "Palakkad fort Tipu", wiki: "Palakkad Fort" },
      },
      {
        id: "silent-valley",
        must: true,
        name: "Silent Valley National Park",
        blurb:
          "One of the last undisturbed tropical evergreen forests in India, saved from a dam project by a people's movement in the 1980s. It is home to the lion-tailed macaque.",
        senses: {
          hear: "A forest without cicadas: the 'silence' in its name",
          taste: "Nothing but clean mountain air",
          feel: "Leeches, moss and ancient shade",
        },
        media: { categories: ["Silent Valley National Park"], search: "Silent Valley national park", wiki: "Silent Valley National Park" },
      },
      {
        id: "malampuzha",
        name: "Malampuzha",
        blurb:
          "A dam and reservoir under the hills, with gardens, a ropeway and a large reclining Yakshi sculpture by the artist Kanayi Kunhiraman.",
        senses: {
          hear: "Families picnicking by the fountains",
          taste: "Ice-cold sarbath with lime and basil seeds",
          feel: "Swaying in a ropeway cabin above the gardens",
        },
        media: { categories: ["Malampuzha Dam", "Malampuzha"], search: "Malampuzha dam garden", wiki: "Malampuzha Dam" },
      },
      {
        id: "nelliyampathy",
        name: "Nelliyampathy",
        blurb:
          "Hairpin bends climb to orange orchards, tea and coffee estates, and cliffs where the whole of the Palakkad plain spreads out below.",
        senses: {
          hear: "Hornbills whooshing overhead",
          taste: "Oranges picked straight from the estate",
          feel: "Cold air after the heat of the plains",
        },
        media: { categories: ["Nelliampathy"], search: "Nelliyampathy hills", wiki: "Nelliampathy" },
      },
      {
        id: "kalpathy",
        name: "Kalpathy",
        blurb:
          "A heritage village of Tamil Brahmin agraharams. Each November its streets fill for the Kalpathy Ratholsavam temple chariot festival.",
        senses: {
          hear: "Nadaswaram at the temple gate",
          taste: "Filter coffee and crisp vadas",
          feel: "Kolam patterns in rice flour at every doorstep",
        },
        media: { categories: ["Kalpathi"], search: "Kalpathy ratholsavam", wiki: "Kalpathy", exclude: ["Kalpathy 01"] },
      },
    ],
  },
  {
    id: "thrissur",
    name: "Thrissur",
    ml: "തൃശ്ശൂർ",
    tagline: "The cultural capital",
    intro:
      "Thrissur has temple festivals with caparisoned elephants, the Kalamandalam dance school and Kerala's most dramatic waterfall.",
    spots: [
      {
        id: "thrissur-pooram",
        must: true,
        name: "Thrissur Pooram",
        blurb:
          "Every April or May, dozens of caparisoned elephants face each other at the Vadakkunnathan temple grounds for kudamattam, a fast exchange of bright parasols, accompanied by hundreds of drummers.",
        senses: {
          hear: "Ilanjithara melam, hundreds of drums in one pulse",
          taste: "Nei appam from a festival stall",
          feel: "A crowd of lakhs moving as one",
        },
        media: { categories: ["Thrissur Pooram"], search: "Thrissur Pooram elephants", wiki: "Thrissur Pooram", coords: [10.5276, 76.2144], exclude: ["Cruelty", "Thrissur (99530)"] },
      },
      {
        id: "athirappilly",
        must: true,
        name: "Athirappilly Falls",
        blurb:
          "Kerala's largest waterfall, where the Chalakudy river drops about 25 m across a wide rock face. At full monsoon it is a wall of white.",
        senses: {
          hear: "Thunder that never stops",
          taste: "Spicy kappa and fish curry nearby",
          feel: "Mist soaking you from fifty metres away",
        },
        media: { categories: ["Athirappilly Falls"], search: "Athirappilly waterfalls", wiki: "Athirappilly Falls" },
      },
      {
        id: "vadakkunnathan",
        name: "Vadakkunnathan Temple",
        blurb:
          "An ancient Shiva temple in classical Kerala architecture at the heart of the city, surrounded by the Thekkinkadu Maidan. Its murals and woodwork are protected as a national monument.",
        senses: {
          hear: "Conch shells at dawn",
          taste: "Sweet ghee-soaked prasadam",
          feel: "Mud floors swept smooth and cool",
        },
        media: { categories: ["Vadakkumnathan Temple"], search: "Vadakkunnathan temple Thrissur", wiki: "Vadakkunnathan Temple", coords: [10.5244, 76.2144] },
      },
      {
        id: "kalamandalam",
        name: "Kerala Kalamandalam",
        blurb:
          "A school founded in 1930 by the poet Vallathol to revive Kathakali, Mohiniyattam, Koodiyattam and more. You can watch students practising from dawn.",
        senses: {
          hear: "Rhythmic syllables chanted by a teacher",
          taste: "Canteen chaya between classes",
          feel: "Students' eyes flicking through the navarasas",
        },
        media: { categories: ["Kerala Kalamandalam"], search: "Kerala Kalamandalam Cheruthuruthy", wiki: "Kerala Kalamandalam", exclude: ["Karakkad"] },
      },
    ],
  },
  {
    id: "ernakulam",
    name: "Ernakulam",
    ml: "എറണാകുളം",
    tagline: "The Queen of the Arabian Sea",
    intro:
      "Kochi has been a port for centuries. Chinese nets, Portuguese churches, Dutch palaces and a Jewish synagogue all stand within walking distance of each other.",
    spots: [
      {
        id: "fort-kochi",
        must: true,
        name: "Chinese Fishing Nets, Fort Kochi",
        blurb:
          "Giant cantilevered nets, said to have arrived with traders from Kublai Khan's court, are raised and lowered by teams of fishermen using stone counterweights.",
        senses: {
          hear: "Fishermen chanting as the net rises",
          taste: "Today's catch fried on the spot",
          feel: "Sunset light on teak and rope",
        },
        media: { categories: ["Chinese fishing nets in Kochi"], search: "Chinese fishing nets Fort Kochi", wiki: "Chinese fishing nets", coords: [9.9677, 76.2425] },
      },
      {
        id: "mattancherry-palace",
        name: "Mattancherry Palace",
        blurb:
          "Also called the Dutch Palace, though the Portuguese built it around 1555 as a gift to the Raja of Kochi. Its walls hold some of Kerala's finest murals from the Ramayana.",
        senses: {
          hear: "Footsteps on polished floors",
          taste: "Cardamom tea in a Jew Town café",
          feel: "Dim, cool rooms after bright streets",
        },
        media: { categories: ["Mattancherry Palace"], search: "Mattancherry Dutch palace", wiki: "Mattancherry Palace", exclude: ["Pazhayannur", "DSCF8402"] },
      },
      {
        id: "paradesi-synagogue",
        name: "Paradesi Synagogue & Jew Town",
        blurb:
          "Built in 1568, it is the oldest active synagogue in the Commonwealth. Inside are hand-painted Chinese floor tiles and Belgian chandeliers. Antique shops and spice warehouses line the lane outside.",
        senses: {
          hear: "A clock tower chiming over the lane",
          taste: "Pepper and ginger smell from the warehouses",
          feel: "Worn cobbles and antique brass",
        },
        media: { categories: ["Paradesi Synagogue", "Jew Town, Kochi"], search: "Paradesi synagogue Kochi", wiki: "Paradesi Synagogue" },
      },
      {
        id: "cherai",
        name: "Cherai Beach",
        blurb:
          "On Vypin island, a golden beach with backwaters running parallel just behind it: waves on one side and still lagoon on the other.",
        senses: {
          hear: "Surf on one side, silence on the other",
          taste: "Prawn fry and appam at a shack",
          feel: "Soft sand and the chance of dolphins offshore",
        },
        media: { categories: ["Cherai Beach"], search: "Cherai beach", wiki: "Cherai Beach" },
      },
      {
        id: "kathakali",
        name: "Kathakali",
        blurb:
          "Kerala's classical dance-drama, with green faces, huge skirts and eyes that carry the whole story. Kochi's cultural centres show the hour-long makeup as well as the performance.",
        senses: {
          hear: "Chenda, maddalam and sung padams",
          taste: "Banana chips and sukhiyan at the interval",
          feel: "The actor's glare meeting yours",
        },
        media: { categories: ["Kathakali"], search: "Kathakali performance", wiki: "Kathakali", coords: [9.9658, 76.2421], exclude: ["art stone", "Gopi"] },
      },
    ],
  },
  {
    id: "idukki",
    name: "Idukki",
    ml: "ഇടുക്കി",
    tagline: "Tea hills and cloud forests",
    intro:
      "Kerala's high country, with endless tea estates, a great arch dam, meadows under mist and the tiger forests of Periyar.",
    spots: [
      {
        id: "munnar",
        must: true,
        name: "Munnar",
        blurb:
          "At the meeting of three mountain streams, tea bushes cover the hills like green velvet. Estate roads climb past pluckers and waterfalls to viewpoints above the clouds.",
        senses: {
          hear: "Tea pluckers chatting between rows",
          taste: "Estate-fresh tea, and homemade chocolate in town",
          feel: "Cold morning mist on the valley road",
        },
        media: { categories: ["Tea plantations in Munnar", "Munnar"], search: "Munnar tea plantation hills", wiki: "Munnar", exclude: ["Sunflower", "Flower"] },
      },
      {
        id: "eravikulam",
        name: "Eravikulam National Park",
        blurb:
          "Rolling grasslands where the endangered Nilgiri tahr grazes near the road. Every twelve years the slopes turn blue with blooming Neelakurinji.",
        senses: {
          hear: "Wind over grass at 2,000 metres",
          taste: "Hot corn from the park gate",
          feel: "A tahr's calm gaze a few metres away",
        },
        media: { categories: ["Eravikulam National Park"], search: "Eravikulam national park Nilgiri tahr", wiki: "Eravikulam National Park", exclude: ["Edamalakudy", "JEG"] },
      },
      {
        id: "idukki-dam",
        name: "Idukki Arch Dam",
        blurb:
          "Built between two granite hills, Kuravan and Kurathi, this was one of Asia's first arch dams. A huge double-curved wall holds back the Periyar.",
        senses: {
          hear: "Absolute stillness over deep water",
          taste: "Cardamom from nearby estates",
          feel: "Vertigo at the curve of the wall",
        },
        media: { categories: ["Idukki Dam"], search: "Idukki arch dam", wiki: "Idukki Dam", exclude: ["dam2", "at night"] },
      },
      {
        id: "vagamon",
        name: "Vagamon",
        blurb:
          "Pine forests, soft green meadows and paragliders drifting over the hills. It was a quiet hill station for a long time and is still peaceful.",
        senses: {
          hear: "Pine needles whispering",
          taste: "Hot bajji with chilli chutney",
          feel: "Grass slopes that make you want to roll",
        },
        media: { categories: ["Vagamon"], search: "Vagamon meadows pine forest", wiki: "Vagamon", exclude: ["Swimming Pool", "Hindu shrine"] },
      },
      {
        id: "thekkady",
        must: true,
        name: "Thekkady & Periyar",
        blurb:
          "A boat on Periyar lake glides past dead tree stumps where elephants come down to drink. Spice gardens around the town smell of pepper and clove.",
        senses: {
          hear: "Elephants trumpeting across the lake",
          taste: "Fresh pepper and cardamom in the spice market",
          feel: "Stillness as a bison herd crosses",
        },
        media: { categories: ["Periyar National Park"], search: "Periyar lake Thekkady", wiki: "Periyar National Park" },
      },
    ],
  },
  {
    id: "kottayam",
    name: "Kottayam",
    ml: "കോട്ടയം",
    tagline: "Letters, latex and lakes",
    intro:
      "India's first fully literate town, Kerala's rubber country, and the eastern shore of the great Vembanad lake.",
    spots: [
      {
        id: "kumarakom",
        must: true,
        name: "Kumarakom",
        blurb:
          "A cluster of islands on Vembanad lake, laced with canals, mangroves and a bird sanctuary. The heart of backwater Kerala.",
        senses: {
          hear: "Kingfishers diving at the canal's edge",
          taste: "Karimeen pollichathu, pearl spot grilled in banana leaf",
          feel: "Lazy afternoon on a houseboat deck",
        },
        media: { categories: ["Kumarakom"], search: "Kumarakom backwaters", wiki: "Kumarakom", exclude: ["Road during", "Church", "Boat Jetty", "reconstruction"] },
      },
      {
        id: "vembanad",
        name: "Vembanad Lake",
        blurb:
          "Kerala's largest lake spans three districts. At sunset its horizon is marked only by coconut palms and a few canoes.",
        senses: {
          hear: "Water lapping at a coconut-log jetty",
          taste: "Toddy shop kappa and fish curry",
          feel: "A breeze across miles of open water",
        },
        media: { categories: ["Vembanad Lake"], search: "Vembanad lake sunset", wiki: "Vembanad", exclude: ["Buildings along"] },
      },
      {
        id: "illikkal-kallu",
        name: "Illikkal Kallu",
        blurb:
          "A giant rock about 1,200 m up, split into three parts. The top is often in the clouds, and a narrow ridge called Narakapalam runs across it.",
        senses: {
          hear: "Wind howling past the rock",
          taste: "A thermos of chukku kaapi (dry-ginger coffee)",
          feel: "Standing inside a cloud",
        },
        media: { categories: ["Illikkal Kallu"], search: "Illikkal Kallu rock", wiki: "Illikkal Kallu" },
      },
      {
        id: "rubber",
        name: "Rubber Estates",
        blurb:
          "Rows of rubber trees with coconut-shell cups catching white latex, tapped by hand before sunrise. Kottayam's wealth grew from these estates.",
        senses: {
          hear: "Tappers' knives in the pre-dawn quiet",
          taste: "Appam and stew at a tharavad breakfast",
          feel: "Sticky latex and cool morning shade",
        },
        media: { categories: ["Rubber plantations in Kerala"], search: "rubber plantation Kottayam Kerala", wiki: "Kottayam", exclude: ["Golden colour leaves"] },
      },
    ],
  },
  {
    id: "alappuzha",
    name: "Alappuzha",
    ml: "ആലപ്പുഴ",
    tagline: "The Venice of the East",
    intro:
      "Canals, houseboats and paddy fields that lie below sea level. Alappuzha is the Kerala of postcards, and it looks just as good in person.",
    spots: [
      {
        id: "houseboats",
        must: true,
        name: "Houseboat Cruise",
        blurb:
          "Board a kettuvallam, a thatched rice barge turned floating home, and drift past villages where life happens on the water's edge.",
        senses: {
          hear: "Ducks paddling, washing slapped on stone steps",
          taste: "Meals on banana leaf cooked on board",
          feel: "The world slowing to walking pace",
        },
        media: { categories: ["Houseboats in Kerala", "Alappuzha backwaters"], search: "Alappuzha houseboat backwaters", wiki: "Kettuvallam", coords: [9.5001, 76.3446] },
      },
      {
        id: "snake-boats",
        name: "Snake Boat Races",
        blurb:
          "In August, the Nehru Trophy race sends chundan vallams over 100 feet long, each with more than a hundred oarsmen, racing down Punnamada lake.",
        senses: {
          hear: "Vanchipattu, the boat songs that set the stroke",
          taste: "Festival sweets and hot chai along the bank",
          feel: "The crowd roaring as the prows cross the line",
        },
        media: { categories: ["Nehru Trophy Boat Race", "Snake boat races"], search: "Nehru Trophy snake boat race", wiki: "Nehru Trophy Boat Race", coords: [9.5102, 76.3505], exclude: ["Celebration"] },
      },
      {
        id: "kuttanad",
        name: "Kuttanad Paddy Fields",
        blurb:
          "Farmers here grow rice below sea level, one of the few places in the world where they do, on land reclaimed from the lake and protected by dykes.",
        senses: {
          hear: "Egrets lifting off in a white cloud",
          taste: "Red Kuttanad rice with duck roast",
          feel: "Walking a narrow bund between water and field",
        },
        media: { categories: ["Kuttanad"], search: "Kuttanad paddy fields", wiki: "Kuttanad", exclude: ["Slab Bund"] },
      },
      {
        id: "alappuzha-beach",
        name: "Alappuzha Beach",
        blurb:
          "An old pier more than 150 years old, a lighthouse and wide sand where the whole town comes out in the evening.",
        senses: {
          hear: "Kids and the call of peanut sellers",
          taste: "Masala-dusted mango on a stick",
          feel: "An orange sky over the ruined pier",
        },
        media: { categories: ["Alappuzha Beach"], search: "Alappuzha beach pier", wiki: "Alappuzha Beach" },
      },
      {
        id: "marari",
        name: "Marari Beach",
        blurb:
          "A fishing-village beach lined with coconut palms, quiet and unhurried, where the day's catch still comes in on wooden boats.",
        senses: {
          hear: "Fishermen hauling nets in rhythm",
          taste: "Coconut toddy straight from the tapper",
          feel: "Hammock shade under the palms",
        },
        media: { categories: ["Mararikulam"], search: "Marari beach Mararikulam", wiki: "Mararikulam", exclude: ["Samhathi"] },
      },
    ],
  },
  {
    id: "pathanamthitta",
    name: "Pathanamthitta",
    ml: "പത്തനംതിട്ട",
    tagline: "Pilgrim hills and forest trails",
    intro:
      "Temple towns, hill forests and the river Pamba. Millions of pilgrims come through Pathanamthitta every year, and its wild interior is some of Kerala's least explored.",
    spots: [
      {
        id: "sabarimala",
        name: "Sabarimala",
        blurb:
          "A hilltop shrine to Ayyappa in the Periyar Tiger Reserve, reached on foot through forest after a 41-day vow of simplicity, by millions every season.",
        senses: {
          hear: "'Swamiye Saranam Ayyappa' echoing through the forest",
          taste: "Aravana payasam, dark and sweet",
          feel: "Bare feet on a mountain path at night",
        },
        media: { categories: ["Sabarimala"], search: "Sabarimala temple pilgrims", wiki: "Sabarimala", exclude: ["Chengannur", "vazhappally", "Guruvayur"] },
      },
      {
        id: "aranmula",
        must: true,
        name: "Aranmula",
        blurb:
          "Home of the Parthasarathy temple, the Uthrattathi snake boat regatta on the Pamba, and the Aranmula kannadi, a mirror cast from secret metal alloys.",
        senses: {
          hear: "Boat songs across the Pamba",
          taste: "Vallasadya, a feast of more than 60 dishes",
          feel: "Your reflection in a mirror of polished metal",
        },
        media: { categories: ["Aranmula Boat Race", "Aranmula Parthasarathy Temple", "Aranmula"], search: "Aranmula boat race", wiki: "Aranmula" },
      },
      {
        id: "gavi",
        name: "Gavi",
        blurb:
          "An eco-tourism village deep in the forest, with cardamom slopes, a quiet lake and the chance of meeting elephants on the road in.",
        senses: {
          hear: "Great hornbills and silence",
          taste: "Forest-grown cardamom tea",
          feel: "Mist settling at dusk over the lake",
        },
        media: { categories: ["Gavi", "Gavi, Kerala", "Kakki Reservoir"], search: "Gavi Kerala", wiki: "Gavi, Kerala", exclude: ["Adavi"] },
      },
      {
        id: "konni",
        name: "Konni",
        blurb:
          "An old elephant training centre in the forest, and a starting point for kayaking at Adavi and bamboo rafting on the Kallar.",
        senses: {
          hear: "Bamboo creaking as the raft turns",
          taste: "Tapioca with red chilli chammanthi",
          feel: "River water cool on your ankles",
        },
        media: { categories: ["Konni"], search: "Konni elephant Pathanamthitta", wiki: "Konni", coords: [9.2267, 76.8487] },
      },
    ],
  },
  {
    id: "kollam",
    name: "Kollam",
    ml: "കൊല്ലം",
    tagline: "The cashew coast of Ashtamudi",
    intro:
      "An ancient trading port and the capital of India's cashew industry. The backwaters start here at Ashtamudi, the eight-armed lake.",
    spots: [
      {
        id: "ashtamudi",
        name: "Ashtamudi Lake",
        blurb:
          "A palm-shaped lake with eight arms, the gateway to Kerala's backwaters. Boats run all the way to Alappuzha along the canals.",
        senses: {
          hear: "Chinese nets creaking at the lake's edge",
          taste: "Roasted cashews still warm from the factory",
          feel: "The long, flat calm of the lake at noon",
        },
        media: { categories: ["Ashtamudi Lake"], search: "Ashtamudi lake Kollam", wiki: "Ashtamudi Lake" },
      },
      {
        id: "munroe-island",
        name: "Munroe Island",
        blurb:
          "A maze of tiny islands and narrow canals where a canoe slips under footbridges and past coir-making homes.",
        senses: {
          hear: "Coir being beaten and spun",
          taste: "Fresh prawns from village fish farms",
          feel: "Ducking under a low footbridge",
        },
        media: { categories: ["Munroe Island"], search: "Munroe island canal", wiki: "Munroe Island" },
      },
      {
        id: "jatayu",
        must: true,
        name: "Jatayu Earth's Center",
        blurb:
          "On a rock 1,000 feet up, a 200-foot sculpture of the mythical bird Jatayu, who in the Ramayana is said to have fallen here fighting Ravana.",
        senses: {
          hear: "Wind whistling round the giant wings",
          taste: "Cold lime soda after the climb",
          feel: "A cable car swinging over bare granite",
        },
        media: { categories: ["Jatayu Earth's Center"], search: "Jatayu Earth's Center sculpture", wiki: "Jatayu Earth's Center", coords: [8.8661, 76.8686] },
      },
      {
        id: "thenmala",
        name: "Thenmala",
        blurb:
          "India's first planned eco-tourism destination, with a canopy walk, a deer park and the Shenduruny forest. The name means 'honey hill'.",
        senses: {
          hear: "Cicadas in the rubber and teak",
          taste: "Forest honey, true to the name",
          feel: "A swaying canopy walkway",
        },
        media: { categories: ["Thenmala"], search: "Thenmala eco tourism", wiki: "Thenmala", exclude: ["St George"] },
      },
    ],
  },
  {
    id: "thiruvananthapuram",
    name: "Thiruvananthapuram",
    ml: "തിരുവനന്തപുരം",
    tagline: "The evergreen capital",
    intro:
      "Kerala's capital sits among seven hills by the sea. It is a city of palaces and museums, with a golden temple at its centre and famous beaches to its north and south.",
    spots: [
      {
        id: "padmanabhaswamy",
        must: true,
        name: "Sree Padmanabhaswamy Temple",
        blurb:
          "The city grew around this temple, whose seven-storey gopuram is reflected in the Padma Theertham tank. Inside, Vishnu reclines on the serpent Anantha.",
        senses: {
          hear: "Temple drums and the East Fort bustle",
          taste: "Palpayasam, rice slow-cooked in milk",
          feel: "Mundu and veshti, the required dress",
        },
        media: { categories: ["Padmanabhaswamy Temple"], search: "Padmanabhaswamy temple Thiruvananthapuram", wiki: "Padmanabhaswamy Temple" },
      },
      {
        id: "kovalam",
        name: "Kovalam",
        blurb:
          "Three crescent beaches divided by rocky headlands, with a red-and-white lighthouse standing over Lighthouse Beach.",
        senses: {
          hear: "Surf and lifeguards' whistles",
          taste: "Grilled seafood picked from ice at dusk",
          feel: "Warm, bath-like sea water",
        },
        media: { categories: ["Kovalam"], search: "Kovalam lighthouse beach", wiki: "Kovalam", exclude: ["forming Boat"] },
      },
      {
        id: "varkala",
        must: true,
        name: "Varkala Cliff",
        blurb:
          "Red laterite cliffs rise straight from the Arabian Sea, the only such cliffs on Kerala's coast. Cafés line the edge and there are mineral springs at the foot.",
        senses: {
          hear: "Waves far below the cliff path",
          taste: "Banana pancakes and fresh juice at a cliff café",
          feel: "Sunset glow on red rock",
        },
        media: { categories: ["Varkala Cliff", "Varkala Beach"], search: "Varkala cliff beach", wiki: "Varkala Beach", coords: [8.7340, 76.7035] },
      },
      {
        id: "napier-museum",
        name: "Napier Museum",
        blurb:
          "An 1880 Indo-Saracenic building with striped brickwork and a gabled roof, set among gardens. It holds bronzes, carvings and old ornaments.",
        senses: {
          hear: "Birds in the museum gardens",
          taste: "Pazham pori, a banana fritter at the gate",
          feel: "Cool shade under the ornate eaves",
        },
        media: { categories: ["Napier Museum"], search: "Napier museum Thiruvananthapuram", wiki: "Napier Museum", coords: [8.5090, 76.9553] },
      },
      {
        id: "ponmudi",
        name: "Ponmudi",
        blurb:
          "Twenty-two hairpin bends lead up from the city to the 'golden peak', a hill station of tea and mist less than two hours from the beach.",
        senses: {
          hear: "Rain arriving across the valley",
          taste: "Chilli bajji at the last hairpin",
          feel: "From sea level to cloud in an afternoon",
        },
        media: { categories: ["Ponmudi"], search: "Ponmudi hill station", wiki: "Ponmudi", exclude: ["Agasthyarkoodam"] },
      },
    ],
  },
];
