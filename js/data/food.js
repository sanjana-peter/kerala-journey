/*
 * Kerala Journey — food trail.
 *
 * One signature dish per district. It shows up as the last stop in that district
 * (with an "Eat" tag) and on the Guide page. Photos come from Wikimedia Commons
 * via `npm run media`, exactly like places (see districts.js for the media fields).
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
