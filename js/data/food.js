/*
 * Kerala Journey — food trail.
 *
 * One signature dish per district. It shows up as the last stop in that district
 * (with an "Eat" tag) and on the Guide page. Photos come from Wikimedia Commons
 * via `npm run media`, exactly like places (see districts.js for the media fields).
 *
 * The dish story (shown on #/eat/<id>):
 *   ml, say           – name in Malayalam, and how to say it
 *   short             – label on the taste map
 *   kitchen           – which regional kitchen it belongs to (see table.js)
 *   moments           – when it's eaten: breakfast, lunch, tea, dinner (see table.js)
 *   ingredients       – the main things that go into it
 *   steps             – how it's made, one short step per line (visitors tap through them)
 *   local             – tips for eating it like a local
 *
 * stops: famous places to eat in the district. They link out; we never copy their photos.
 *   name, area        – shown on the site; also used for the Google Maps search link
 *   order             – what to try there
 *   price             – "₹", "₹₹" or "₹₹₹"
 *   veg               – true = pure vegetarian
 *   instagram         – the official handle, without @ (verify it; never guess)
 *   website           – optional official website
 *   verified          – false = hidden on the public site, shown only locally or with ?preview
 *   lastChecked       – "YYYY-MM-DD" when someone last confirmed it's open and the details are right
 *
 * The stops below are well-known suggestions that still need checking by someone local.
 */
window.KERALA_FOOD = [
  {
    district: "kasaragod",
    id: "neer-dosa",
    name: "Neer Dosa",
    ml: "നീർ ദോശ",
    say: "neer DOH-sha",
    short: "Neer dosa",
    kitchen: "malabar",
    moments: ["breakfast", "dinner"],
    ingredients: ["Raw rice", "Grated coconut", "Water", "Salt"],
    steps: [
      "Raw rice is soaked for a few hours, then ground with a little coconut into a smooth batter.",
      "It's thinned with water until it's as runny as milk. No fermenting, so it's made fresh.",
      "A ladleful is splashed onto a hot pan so it runs into a lacy circle, then covered for a moment.",
      "Folded into quarters while still soft and white, never browned.",
    ],
    local: [
      "Eat it straight off the pan: it firms up as it cools.",
      "It's best with chicken curry or a coconut fish curry.",
      "For something sweet, have it with grated coconut and jaggery.",
    ],
    blurb:
      "Kasaragod's food leans towards the Tulu coast next door. Neer dosa means 'water dosa': a thin rice batter poured onto a hot pan that sets into soft, lacy crepes, eaten with fish or chicken curry.",
    senses: {
      hear: "Batter hissing across a hot iron pan",
      taste: "Soft rice crepes soaking up coconut curry",
      feel: "Folded, still warm, torn by hand",
    },
    media: { categories: ["Neer dosa"], search: "Neer dosa", wiki: "Neer dosa", minRatio: 1, minWidth: 1000 },
    stops: [],
  },
  {
    district: "kannur",
    id: "thalassery-biryani",
    name: "Thalassery Biryani",
    ml: "തലശ്ശേരി ബിരിയാണി",
    say: "tha-la-SHAY-ree bir-YAA-ni",
    short: "Biryani",
    kitchen: "malabar",
    moments: ["lunch", "dinner"],
    ingredients: ["Kaima rice", "Chicken or mutton", "Ghee", "Fried onion", "Cashews and raisins", "Whole spices"],
    steps: [
      "The meat is cooked in a thick masala of onion, tomato, ginger, garlic, green chilli and spices.",
      "The kaima rice is fried in ghee with whole spices, then cooked until just done.",
      "Rice is layered over the masala with fried onions, cashews and raisins.",
      "The pot is sealed and left on a low fire, often with coals on the lid, to finish in its own steam (dum).",
    ],
    local: [
      "It comes with a sweet date pickle, a coconut chutney and a raita of onion.",
      "Weddings in Thalassery and Kannur cook it in huge pots for hundreds of guests.",
      "Finish with a sulaimani, black tea with lemon, to help it settle.",
    ],
    blurb:
      "Malabar's own biryani uses small, fragrant kaima (jeerakasala) rice instead of basmati. Chicken or mutton is cooked in masala and layered with ghee rice, fried onions, cashews and raisins.",
    senses: {
      hear: "The lid lifting off a sealed biryani pot",
      taste: "Ghee, fried onion and gentle spice",
      feel: "Short grains that stay separate and light",
    },
    media: { categories: ["Thalassery biryani"], search: "Thalassery biryani", wiki: "Thalassery cuisine", minRatio: 1, minWidth: 1000, exclude: ["Chammandi"] },
    stops: [
      {
        name: "Paris Hotel",
        area: "Thalassery",
        order: "Chicken biryani",
        price: "₹₹",
        veg: false,
        instagram: "",
        verified: false,
        lastChecked: null,
      },
    ],
  },
  {
    district: "wayanad",
    id: "wayanad-coffee",
    name: "Wayanad Coffee",
    ml: "വയനാടൻ കാപ്പി",
    say: "VAI-a-naa-dan KAAP-pi",
    short: "Coffee",
    kitchen: "hills",
    moments: ["breakfast", "tea"],
    ingredients: ["Robusta beans", "Milk", "Sugar"],
    steps: [
      "Coffee cherries turn red in the cool months, roughly December to February, and are picked by hand.",
      "They're spread out to dry in the sun on the estate yard, then hulled to free the green beans.",
      "The beans are roasted, in many homes in a pan over the fire, and ground.",
      "It's brewed strong and boiled up with milk and plenty of sugar, the way tea shops serve it.",
    ],
    local: [
      "Ask for 'kaapi'. Black coffee is 'kattan kaapi'.",
      "Many estate stays will walk you through the plantation and the drying yard.",
      "Buy beans or powder from the estates to take home.",
    ],
    blurb:
      "Much of Kerala's coffee grows here, mostly robusta under the shade of silver oak and pepper vines. Estate stays roast their own beans, and every tea shop serves it strong, milky and sweet.",
    senses: {
      hear: "Beans crackling in a roasting drum",
      taste: "Strong filter coffee with plenty of sugar",
      feel: "Cool plantation air under the shade trees",
    },
    media: { categories: ["Coffee plantations in Wayanad"], search: "coffee plantation Wayanad", wiki: "Wayanad district", minRatio: 1, minWidth: 1000, exclude: ["tea plantations", "Wildlife Sanctuary"] },
    stops: [],
  },
  {
    district: "kozhikode",
    id: "kozhikodan-halwa",
    name: "Kozhikodan Halwa",
    ml: "കോഴിക്കോടൻ ഹൽവ",
    say: "KOH-zhi-koh-dan HAL-wa",
    short: "Halwa",
    kitchen: "malabar",
    moments: ["tea"],
    ingredients: ["Wheat or rice flour", "Sugar or jaggery", "Coconut oil or ghee", "Cashews"],
    steps: [
      "Wheat is soaked and squeezed for its milky starch, or refined flour is used instead.",
      "It's cooked with sugar and water in a wide pan, stirred without stopping for a long time.",
      "Coconut oil or ghee goes in little by little until the mass turns glossy and leaves the sides of the pan.",
      "Colour, flavour and nuts are stirred in, and it's poured into trays and cut into slabs once set.",
    ],
    local: [
      "Shopkeepers on SM Street will usually let you taste before you buy.",
      "The black halwa made with jaggery is the old favourite.",
      "It keeps well, so it's the classic gift to take home.",
    ],
    blurb:
      "Glossy slabs of halwa in every colour, made from wheat, coconut oil and jaggery or sugar, fill the shop fronts of SM Street, known locally as Mittai Theruvu, 'Sweet Meat Street'. Buy it by weight, and never just one flavour.",
    senses: {
      hear: "Shopkeepers calling out flavours down the street",
      taste: "Chewy, sweet and studded with cashews",
      feel: "A heavy paper parcel to carry home",
    },
    media: { categories: ["Kozhikode halwa"], search: "Kozhikode halwa", wiki: "Kozhikode", minRatio: 1, minWidth: 1000 },
    stops: [
      {
        name: "SM Street (Mittai Theruvu)",
        area: "Kozhikode",
        order: "Halwa and banana chips, from any of the old shops",
        price: "₹",
        veg: true,
        instagram: "",
        verified: false,
        lastChecked: null,
      },
      {
        name: "Paragon Restaurant",
        area: "Kannur Road, Kozhikode",
        order: "Biryani, fish curry meals",
        price: "₹₹",
        veg: false,
        instagram: "",
        verified: false,
        lastChecked: null,
      },
      {
        name: "Rahmath Hotel",
        area: "Kozhikode",
        order: "Beef biryani",
        price: "₹",
        veg: false,
        instagram: "",
        verified: false,
        lastChecked: null,
      },
    ],
  },
  {
    district: "malappuram",
    id: "pathiri",
    name: "Pathiri",
    ml: "പത്തിരി",
    say: "PATH-thi-ri",
    short: "Pathiri",
    kitchen: "malabar",
    moments: ["dinner", "breakfast"],
    ingredients: ["Rice flour", "Boiling water", "Salt", "Coconut milk"],
    steps: [
      "Rice flour is stirred into boiling salted water to make a soft dough.",
      "It's kneaded while still warm and rolled into paper-thin circles.",
      "Each one is cooked on a hot pan, without oil, until it puffs up.",
      "They're stacked and often dipped in coconut milk so they stay soft.",
    ],
    local: [
      "During Ramadan, Malabar homes make tall stacks for the evening meal that breaks the fast.",
      "Tear a piece and wrap it around a bite of chicken or mutton curry.",
      "Look out for its cousins: neypathiri, fried and puffy, and meen pathiri, stuffed with fish.",
    ],
    blurb:
      "Paper-thin flatbreads made from rice flour, a staple of Malabar Muslim kitchens. They're stacked soft and warm beside chicken or mutton curry, especially at iftar during Ramadan.",
    senses: {
      hear: "The quiet slap of dough on a hot pan",
      taste: "Soft rice bread with spicy mutton curry",
      feel: "A warm stack folded in a cloth",
    },
    media: { categories: ["Pathiri"], search: "Pathiri", wiki: "Pathiri", minRatio: 1, minWidth: 1000 },
    stops: [],
  },
  {
    district: "palakkad",
    id: "ramassery-idli",
    name: "Ramassery Idli",
    ml: "രാമശ്ശേരി ഇഡ്ഡലി",
    say: "RAA-mash-shay-ri ID-li",
    short: "Idli",
    kitchen: "palakkad",
    moments: ["breakfast"],
    ingredients: ["Rice", "Urad dal", "Salt", "Chutney powder"],
    steps: [
      "Rice and urad dal are soaked, ground and left to ferment overnight.",
      "A cloth is stretched over the mouth of a clay pot of boiling water.",
      "The batter is poured onto the cloth in flat rounds, covered, and steamed over a wood fire.",
      "Peeled off the cloth, they come out flat and wide, not domed like ordinary idlis.",
    ],
    local: [
      "Eat them with chutney powder (podi) mixed with a little coconut oil.",
      "Go in the morning, when they're coming off the cloth.",
      "They keep for a day or two, so people buy a packet for the road.",
    ],
    blurb:
      "In the village of Ramassery, families have made these flat, spongy idlis for generations, steaming them on cloth over clay pots. They come with chutney powder and a little coconut oil, and keep for days.",
    senses: {
      hear: "Wood fires crackling under clay pots",
      taste: "Soft idli with fiery chutney powder",
      feel: "Warm, flat and lighter than you expect",
    },
    media: { categories: ["Ramassery idli", "Idli"], search: "Ramassery idli", wiki: "Ramassery Idli", minRatio: 1, minWidth: 1000, exclude: ["Handful", "flour for idly"] },
    stops: [
      {
        name: "Sree Saraswathi Tea Stall",
        area: "Ramassery, Palakkad",
        order: "Ramassery idli with chutney powder",
        price: "₹",
        veg: true,
        instagram: "",
        verified: false,
        lastChecked: null,
      },
    ],
  },
  {
    district: "thrissur",
    id: "sadya",
    name: "Sadya",
    ml: "സദ്യ",
    say: "SUD-ya",
    short: "Sadya",
    kitchen: "central",
    moments: ["lunch"],
    ingredients: ["Matta rice", "Coconut", "Seasonal vegetables", "Yoghurt", "Jaggery"],
    steps: [
      "The banana leaf goes down first, with its tip pointing to your left.",
      "Side dishes are served across the top half of the leaf, in a set order, starting from the left.",
      "Rice comes to the bottom half, first with parippu and ghee, then with sambar.",
      "Payasam follows in the middle of the meal, then rasam and buttermilk to finish.",
    ],
    local: [
      "Eat with your right hand, mixing a little rice with each curry.",
      "Say yes to a second payasam: there are often two or three kinds.",
      "When you finish, fold the leaf towards you. It says you enjoyed the meal.",
    ],
    blurb:
      "Kerala's vegetarian feast, served on a banana leaf in a set order: upperi, pickles, avial, thoran, olan, sambar, rasam and payasam, over twenty dishes in all. It's at the heart of Onam, weddings and temple festivals.",
    senses: {
      hear: "Servers moving quickly down long rows of leaves",
      taste: "Sweet, sour, salty and spicy in one meal",
      feel: "Eating with your right hand, the proper way",
    },
    media: { categories: ["Sadya"], search: "Kerala sadya banana leaf", wiki: "Sadhya", minRatio: 1, minWidth: 1000 },
    stops: [
      {
        name: "Bharath Hotel",
        area: "Chembottil Lane, Thrissur",
        order: "Vegetarian meals",
        price: "₹",
        veg: true,
        instagram: "",
        verified: false,
        lastChecked: null,
      },
    ],
  },
  {
    district: "ernakulam",
    id: "appam-stew",
    name: "Appam & Stew",
    ml: "അപ്പവും സ്റ്റൂവും",
    say: "UP-pam and stew",
    short: "Appam",
    kitchen: "central",
    moments: ["breakfast", "dinner"],
    ingredients: ["Rice", "Coconut", "Toddy or yeast", "Coconut milk", "Potato", "Black pepper"],
    steps: [
      "Rice and coconut are ground together and left to ferment overnight, traditionally with a splash of toddy.",
      "A ladleful goes into a hot appachatti, a small curved pan, which is swirled once around.",
      "Covered, the middle steams soft and spongy while the thin edge crisps into lace.",
      "The stew is vegetables or meat simmered in coconut milk with pepper, green chilli, ginger and curry leaves.",
    ],
    local: [
      "Christmas and Easter breakfasts in Syrian Christian homes aren't complete without it.",
      "Order it with mutton or chicken stew for the classic Kochi pairing.",
      "Tear from the crisp edge in towards the soft centre.",
    ],
    blurb:
      "Soft in the middle, crisp and lacy at the edges, appam is made from a fermented rice and coconut batter. Kochi's Syrian Christian families serve it at breakfast with a mild stew of coconut milk, pepper and potato.",
    senses: {
      hear: "The appachatti swirled over the flame",
      taste: "Coconut milk, black pepper and curry leaf",
      feel: "Tearing the crisp edge to scoop up the stew",
    },
    media: { categories: ["Appam"], search: "Appam stew Kerala", wiki: "Appam", minRatio: 1, minWidth: 1000 },
    stops: [
      {
        name: "Kayees Rahmathulla Café",
        area: "Mattancherry, Kochi",
        order: "Mutton biryani",
        price: "₹",
        veg: false,
        instagram: "",
        verified: false,
        lastChecked: null,
      },
      {
        name: "Dhe Puttu",
        area: "Edappally, Kochi",
        order: "Puttu in many varieties",
        price: "₹₹",
        veg: false,
        instagram: "",
        verified: false,
        lastChecked: null,
      },
    ],
  },
  {
    district: "idukki",
    id: "cardamom",
    name: "Cardamom & Spice Tea",
    ml: "ഏലക്ക ചായ",
    say: "AY-lak-ka CHAA-ya",
    short: "Cardamom",
    kitchen: "hills",
    moments: ["tea", "breakfast"],
    ingredients: ["Green cardamom", "Tea", "Milk", "Sugar"],
    steps: [
      "Cardamom grows as a tall leafy plant in the shade of forest trees; its pods sprout from shoots near the ground.",
      "Pickers go round the plants every few weeks and pick the ripe pods by hand.",
      "The pods are dried slowly in heated curing houses, which keeps them green.",
      "At the tea stall, crushed pods are boiled with tea leaves, milk and sugar.",
    ],
    local: [
      "Spice gardens around Kumily and Thekkady run short guided walks.",
      "Good pods are green and plump; pale, shrivelled ones are old.",
      "Watch for tea pulled from a height, poured back and forth until it froths.",
    ],
    blurb:
      "Idukki's Cardamom Hills grow much of India's small cardamom. Spice gardens around Kumily and Munnar let you smell green pods drying beside pepper, cloves and nutmeg, then sit down to a cardamom tea.",
    senses: {
      hear: "Pods rattling on drying racks",
      taste: "Sweet, milky tea fragrant with cardamom",
      feel: "Sticky resin on your fingers from a fresh pod",
    },
    media: { categories: ["Elettaria cardamomum"], search: "cardamom plantation Idukki", wiki: "Cardamom Hills", minRatio: 1, minWidth: 1000 },
    stops: [],
  },
  {
    district: "kottayam",
    id: "kappa-meen",
    name: "Kappa & Meen Curry",
    ml: "കപ്പയും മീൻകറിയും",
    say: "KUP-pa and meen curry",
    short: "Kappa & meen",
    kitchen: "central",
    moments: ["lunch", "dinner"],
    ingredients: ["Tapioca", "Fish", "Kudampuli", "Red chilli", "Shallots", "Coconut oil"],
    steps: [
      "Tapioca is peeled, cut, boiled, and mashed with a coarse paste of coconut, chilli and turmeric.",
      "For the curry, shallots, ginger and garlic are fried in coconut oil in a clay pot (manchatti).",
      "Chilli powder goes in, then water, soaked kudampuli and the fish.",
      "It simmers until thick and red, and it tastes even better the next day.",
    ],
    local: [
      "Toddy shops (kallu shaap) serve some of the best versions.",
      "Kottayam's fish curry is red and sour; further north it's often made with coconut.",
      "Mix the curry into the kappa with your fingers.",
    ],
    blurb:
      "Mashed tapioca with a fiery red fish curry, soured with kudampuli (Malabar tamarind) and slow-cooked in a clay pot. It's everyday comfort food, and the classic toddy shop order.",
    senses: {
      hear: "A clay pot bubbling on a wood fire",
      taste: "Tangy, chilli-red curry and soft tapioca",
      feel: "Heat that builds slowly on your tongue",
    },
    media: { categories: ["Kappa (dish)"], search: "Kappa fish curry Kerala", wiki: "Kappa (dish)", minRatio: 1, minWidth: 1000 },
    stops: [],
  },
  {
    district: "alappuzha",
    id: "karimeen-pollichathu",
    name: "Karimeen Pollichathu",
    ml: "കരിമീൻ പൊള്ളിച്ചത്",
    say: "ka-ri-MEEN POL-li-chath",
    short: "Karimeen",
    kitchen: "central",
    moments: ["lunch"],
    ingredients: ["Pearl spot fish", "Shallots", "Red chilli", "Lime", "Banana leaf", "Coconut oil"],
    steps: [
      "The fish is cleaned, scored and rubbed with chilli, turmeric, pepper and lime.",
      "It's lightly fried, then covered in a thick masala of shallots, tomato and ginger.",
      "Everything is wrapped in a softened banana leaf and tied up.",
      "The parcel is roasted on a pan, both sides, until the leaf chars.",
    ],
    local: [
      "Karimeen is Kerala's state fish.",
      "Houseboat cooks will make it fresh if you ask ahead.",
      "Mind the fine bones: pick the flesh away with your fingers.",
    ],
    blurb:
      "Pearl spot fish from the backwaters, coated in a spicy masala, wrapped in banana leaf and roasted on a pan. It's the dish to order on a houseboat or at a canal-side toddy shop.",
    senses: {
      hear: "Banana leaf crackling on a hot pan",
      taste: "Smoky, spicy, flaky backwater fish",
      feel: "Unwrapping the leaf, and the steam that comes out",
    },
    media: { categories: ["Karimeen pollichathu"], search: "Karimeen pollichathu", wiki: "Karimeen", minRatio: 1, minWidth: 1000 },
    stops: [],
  },
  {
    district: "pathanamthitta",
    id: "valla-sadya",
    name: "Aranmula Valla Sadya",
    ml: "വള്ളസദ്യ",
    say: "VULL-a SUD-ya",
    short: "Valla sadya",
    kitchen: "south",
    moments: ["lunch"],
    ingredients: ["Matta rice", "More than sixty dishes", "Several payasams"],
    steps: [
      "A snake boat crew rows up to the temple steps on the Pamba river, singing as they come.",
      "They're welcomed at the temple and seated in long rows of banana leaves.",
      "Dishes are served, and when the rowers sing a verse asking for a dish, it has to be brought.",
      "It ends with several payasams, cooked in huge bronze vessels.",
    ],
    local: [
      "It runs roughly from July to early October; check that year's dates first.",
      "Visitors can book a place through the Palliyoda Seva Sangham, which organises the feasts.",
      "Come hungry and don't rush: it's a long meal.",
    ],
    blurb:
      "From July to October, the Parthasarathy temple at Aranmula serves the crews of its snake boats a feast of more than sixty dishes, sung for in verses. Visitors can book a place at the long rows.",
    senses: {
      hear: "Oarsmen singing requests for their favourite dishes",
      taste: "Dozens of curries, and several payasams",
      feel: "Sitting cross-legged in a row a hundred leaves long",
    },
    media: { categories: ["Valla Sadya"], search: "Valla sadya Aranmula", wiki: "Aranmula Valla Sadya", minRatio: 1, minWidth: 1000 },
    stops: [],
  },
  {
    district: "kollam",
    id: "cashew",
    name: "Kollam Cashews",
    ml: "കശുവണ്ടി",
    say: "ka-shu-AN-di",
    short: "Cashews",
    kitchen: "south",
    moments: ["tea"],
    ingredients: ["Cashew nuts", "Salt"],
    steps: [
      "Each cashew apple ripens with a single nut hanging beneath it. The nuts are collected and sun-dried.",
      "They're roasted or steamed to soften the shell, which holds a caustic oil.",
      "Workers crack each shell open by hand, then peel away the thin brown skin.",
      "The kernels are graded by size and colour; whole white ones fetch the most.",
    ],
    local: [
      "Most of the workers are women, and many families have worked in the factories for generations.",
      "Buy from factory outlets or cooperative stores in Kollam.",
      "Try them roasted and salted, or tossed with chilli.",
    ],
    blurb:
      "Kollam has been the centre of India's cashew industry for over a century. In its factories, rows of workers shell, peel and grade nuts by hand, and they're sold roasted and salted, still warm.",
    senses: {
      hear: "Shells cracking in the factory halls",
      taste: "Warm, buttery roasted cashews",
      feel: "The smoky smell of roasting on your clothes",
    },
    media: { categories: ["Cashew industry in Kollam"], search: "cashew Kollam", wiki: "Cashew business in Kollam", minRatio: 1, minWidth: 1000, exclude: ["Kochupilamoodu"] },
    stops: [],
  },
  {
    district: "thiruvananthapuram",
    id: "puttu-kadala",
    name: "Puttu & Kadala",
    ml: "പുട്ടും കടലയും",
    say: "PUT-tu and KUD-a-la",
    short: "Puttu",
    kitchen: "south",
    moments: ["breakfast"],
    ingredients: ["Rice flour", "Grated coconut", "Black chickpeas", "Pappadam", "Banana"],
    steps: [
      "Rice flour is rubbed with salt and water until it feels like damp sand.",
      "It's packed into the puttu tube in layers, with grated coconut between them.",
      "Steam from the pot below rises through the tube until it's cooked through.",
      "Pushed out with a stick, it's served with kadala curry: black chickpeas in roasted coconut masala.",
    ],
    local: [
      "Crush a pappadam over the top.",
      "Mash in a ripe banana for the sweet version, a local favourite.",
      "Puttu goes with almost anything: fish curry, beef, even just sugar.",
    ],
    blurb:
      "Cylinders of rice flour and grated coconut, steamed in a bamboo or metal tube, served with a black chickpea curry. It's the capital's favourite breakfast, often with a pappadam or a ripe banana.",
    senses: {
      hear: "Steam whistling through the puttu kutti",
      taste: "Coconut-sweet rice with spicy kadala",
      feel: "Crumbling it together with curry by hand",
    },
    media: { categories: ["Puttu"], search: "Puttu kadala curry", wiki: "Puttu", minRatio: 1, minWidth: 1000 },
    stops: [
      {
        name: "Indian Coffee House",
        area: "Thampanoor, Thiruvananthapuram",
        order: "Coffee and snacks in Laurie Baker's spiral building",
        price: "₹",
        veg: false,
        instagram: "",
        verified: false,
        lastChecked: null,
      },
    ],
  },
];

// Merge each dish into its district as the last stop of the visit.
(function () {
  const districts = window.KERALA_DISTRICTS || [];
  for (const f of window.KERALA_FOOD) {
    const d = districts.find((x) => x.id === f.district);
    if (d && !d.spots.some((s) => s.id === f.id)) d.spots.push({ ...f, type: "eat" });
  }
})();
