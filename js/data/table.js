/*
 * Kerala Journey — the Kerala table (the #/eat page).
 *
 * Content that ties the dishes in food.js together:
 *   moments  – a day of eating, used by the time-of-day dial. Dishes join a moment through their `moments` field.
 *   kitchens – the regional kitchens on the taste map. Dishes join a kitchen through their `kitchen` field.
 *   sadya    – the banana-leaf feast, in the order a server brings each dish.
 *              x, y, r are positions on the leaf drawing (viewBox 0 0 600 290); `on: "rice"` pours onto the rice.
 */
window.KERALA_TABLE = {
  moments: [
    {
      id: "breakfast",
      name: "Morning",
      ml: "രാവിലെ",
      from: 6,
      to: 10.5,
      meal: "Breakfast",
      story:
        "Kerala wakes early. Steam rises from puttu tubes and appam pans, and the first glass of tea comes from the corner shop before the buses start.",
      also: ["Idiyappam (string hoppers) with egg curry", "Upma with a ripe banana", "A glass of chaya from the tea shop"],
    },
    {
      id: "lunch",
      name: "Midday",
      ml: "ഉച്ച",
      from: 10.5,
      to: 15,
      meal: "Lunch, the big meal",
      story:
        "Lunch means rice: a heap of it with a curry, a thoran, pickle and pappadam. 'Meals ready' boards go up outside small hotels, and on feast days it comes on a banana leaf.",
      also: ["Fish curry meals", "Moru (spiced buttermilk)", "Pappadam and pickle with everything"],
    },
    {
      id: "tea",
      name: "Four o'clock",
      ml: "നാലുമണി",
      from: 15,
      to: 18.5,
      meal: "Tea time",
      story:
        "Around four the whole state stops for tea. Tea is pulled from a height until it froths, and the glass cases on the counter fill with fried snacks.",
      also: ["Pazham pori (banana fritters)", "Parippu vada (lentil fritters)", "Unniyappam", "Sulaimani, black tea with lemon"],
    },
    {
      id: "dinner",
      name: "Night",
      ml: "രാത്രി",
      from: 18.5,
      to: 23,
      meal: "Dinner",
      story:
        "Evenings belong to porotta stalls, biryani and soft rice breads. Street carts called thattukada light up, and during Ramadan the streets of Malabar fill with food after sunset.",
      also: ["Porotta and beef fry", "Kanji (rice porridge) with green gram", "An omelette from a thattukada cart"],
    },
  ],

  kitchens: [
    {
      id: "malabar",
      name: "Malabar",
      line: "Spice ports and Mappila kitchens",
      story:
        "The northern coast traded pepper with Arab merchants for centuries, and its Mappila Muslim kitchens show it: biryani, rice breads, rich meat curries and sweets sold by weight. Kasaragod, at the border, adds the Tulu coast's rice crepes.",
      districts: ["kasaragod", "kannur", "kozhikode", "malappuram"],
    },
    {
      id: "hills",
      name: "The high ranges",
      line: "Coffee, cardamom and tea",
      story:
        "Up in the Western Ghats, the food follows the plantations. Wayanad grows coffee and pepper, Idukki's Cardamom Hills grow the spice they're named for, and every stop is an excuse for a hot drink.",
      districts: ["wayanad", "idukki"],
    },
    {
      id: "palakkad",
      name: "The Palakkad Gap",
      line: "Rice bowl on the road to Tamil Nadu",
      story:
        "A wide break in the Ghats opens Palakkad to Tamil Nadu. It's Kerala's rice bowl, and its villages have a vegetarian, Tamil-influenced kitchen of idlis, dosas and spiced powders.",
      districts: ["palakkad"],
    },
    {
      id: "central",
      name: "Backwaters and Kochi",
      line: "Temple feasts, church breakfasts, toddy shops",
      story:
        "Here Kerala's communities share a table: temple towns famous for their feasts, Syrian Christian breakfasts of appam and stew, and toddy shops on the canals serving fish straight from the lakes.",
      districts: ["thrissur", "ernakulam", "kottayam", "alappuzha"],
    },
    {
      id: "south",
      name: "Old Travancore",
      line: "Royal feasts and the cashew coast",
      story:
        "The old kingdom of Travancore gave the south its temple feasts and its love of a coconut-rich breakfast. Kollam's cashew factories and Thiruvananthapuram's tea shops finish the trail.",
      districts: ["pathanamthitta", "kollam", "thiruvananthapuram"],
    },
  ],

  sadya: [
    { id: "uppu", name: "Uppu", ml: "ഉപ്പ്", what: "A pinch of salt, placed first at the top left.", x: 112, y: 196, r: 5, color: "#f4f1ea" },
    { id: "upperi", name: "Upperi", ml: "ഉപ്പേരി", what: "Banana chips, fried in coconut oil.", x: 150, y: 172, r: 15, color: "#e8c04a" },
    { id: "sharkara", name: "Sharkara varatti", ml: "ശർക്കരവരട്ടി", what: "Thick banana chips coated in jaggery and dry ginger.", x: 190, y: 148, r: 14, color: "#8a4e1f" },
    { id: "naranga", name: "Naranga achar", ml: "നാരങ്ങ അച്ചാർ", what: "Lime pickle, sour and fiery.", x: 225, y: 124, r: 10, color: "#c2601f" },
    { id: "manga", name: "Manga achar", ml: "മാങ്ങ അച്ചാർ", what: "Tender mango pickle in chilli and mustard.", x: 258, y: 108, r: 10, color: "#a8321f" },
    { id: "puli-inji", name: "Puli inji", ml: "പുളിയിഞ്ചി", what: "Ginger in tamarind and jaggery: sweet, sour and hot at once.", x: 292, y: 96, r: 11, color: "#4f2512" },
    { id: "kichadi", name: "Kichadi", ml: "കിച്ചടി", what: "Cucumber or beetroot in yoghurt with crushed mustard.", x: 330, y: 86, r: 14, color: "#c24d78" },
    { id: "pachadi", name: "Pachadi", ml: "പച്ചടി", what: "A sweet one, often pineapple, in yoghurt and coconut.", x: 370, y: 78, r: 14, color: "#efd27a" },
    { id: "thoran", name: "Thoran", ml: "തോരൻ", what: "Finely chopped cabbage or beans, stir-fried with grated coconut.", x: 412, y: 71, r: 16, color: "#b9c85a" },
    { id: "avial", name: "Avial", ml: "അവിയൽ", what: "Mixed vegetables in a thick coconut and yoghurt paste, finished with coconut oil and curry leaves.", x: 457, y: 65, r: 18, color: "#e6b86a" },
    { id: "olan", name: "Olan", ml: "ഓലൻ", what: "Ash gourd and cowpeas in thin coconut milk. Mild, to cool the palate.", x: 503, y: 60, r: 16, color: "#f1ead2" },
    { id: "kalan", name: "Kalan", ml: "കാളൻ", what: "Yam and raw banana in thick, tangy yoghurt with pepper.", x: 548, y: 56, r: 15, color: "#e3c43a" },
    { id: "erissery", name: "Erissery", ml: "എരിശ്ശേരി", what: "Pumpkin and red beans with roasted coconut.", x: 540, y: 112, r: 16, color: "#d9782b" },
    { id: "pazham", name: "Pazham", ml: "പഴം", what: "A small ripe banana, at the bottom left corner.", x: 70, y: 232, r: 16, shape: "banana", color: "#f0cd4b" },
    { id: "pappadam", name: "Pappadam", ml: "പപ്പടം", what: "Crisp, puffed lentil wafers. Crush one into your rice.", x: 150, y: 226, r: 22, color: "#efdca6" },
    { id: "choru", name: "Choru", ml: "ചോറ്", what: "Kerala's red matta rice, a generous heap in the middle of the leaf.", x: 330, y: 200, r: 44, shape: "rice", color: "#e9d2bd" },
    { id: "parippu", name: "Parippu and ghee", ml: "പരിപ്പ്, നെയ്യ്", what: "The first course: yellow lentils poured over the rice with a spoon of ghee.", on: "rice", color: "#e9b83a" },
    { id: "sambar", name: "Sambar", ml: "സാമ്പാർ", what: "The second course: lentils, vegetables and tamarind, with more rice.", on: "rice", color: "#c0622a" },
    { id: "payasam", name: "Payasam", ml: "പായസം", what: "Dessert, in the middle of the meal: ada pradhaman of rice flakes in jaggery and coconut milk, often with a second, milky payasam.", x: 455, y: 205, r: 24, color: "#9a5a2a" },
    { id: "rasam", name: "Rasam", ml: "രസം", what: "Peppery tamarind broth, to settle things after the sweets.", on: "rice", color: "#b1461f" },
    { id: "moru", name: "Moru", ml: "മോര്", what: "Buttermilk spiced with ginger, chilli and curry leaf. The last course.", on: "rice", color: "#f3f0e6" },
  ],
};
