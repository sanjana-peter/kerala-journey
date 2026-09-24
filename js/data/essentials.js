/*
 * Kerala Journey — travel essentials (the /essentials page).
 *
 * sections – each opens as a panel: id (used in the URL, /essentials/<id>), title, items (h = heading, p = text)
 * packing  – the packing list: `always` items, plus items for a kind of weather (see visit.js climates)
 *            or a kind of plan the visitor ticks
 * Check facts that change (apps, rules, prices) at least once a season.
 */
window.KERALA_ESSENTIALS = {
  sections: [
    {
      id: "getting-around",
      title: "Getting around",
      items: [
        { h: "Trains", p: "The railway runs the length of the coast from Kasaragod to Thiruvananthapuram and is often the quickest way between cities. Book on the IRCTC website or app; reserved seats sell out at weekends and festivals." },
        { h: "Buses", p: "KSRTC, the state bus company, and private buses go almost everywhere for very little. Longer KSRTC routes can be booked online." },
        { h: "Ferries", p: "Public ferries cross the backwaters, including the Kottayam–Alappuzha route and the ferries around Kochi. They cost a few rupees and show you village life from the water." },
        { h: "Kochi Metro and Water Metro", p: "Kochi has a metro line from Aluva through the city, and electric Water Metro boats to the islands." },
        { h: "Auto-rickshaws and cabs", p: "Autos are everywhere. Ask for the meter or agree on the fare before you set off. Ride-hailing apps work in the bigger cities." },
        { h: "Driving", p: "Roads are busy and hill roads slow. Hiring a car with a driver is common and affordable, and saves a lot of stress." },
      ],
    },
    {
      id: "money",
      title: "Money",
      items: [
        { h: "Cash and cards", p: "The currency is the Indian rupee (₹). Cards work in hotels, larger restaurants and shops. Carry cash for tea stalls, autos, ferries and temple offerings." },
        { h: "UPI", p: "Almost every shop takes UPI, India's QR-code payments. Visitors from abroad can't always use it; some prepaid options are offered at major airports, so check before relying on it." },
        { h: "ATMs", p: "ATMs are easy to find in towns, rarer in the hills and forests. Take out cash before heading to Gavi, Wayanad's forests or Silent Valley." },
        { h: "Tipping", p: "Not expected everywhere, but a tip for good restaurant service, houseboat crews, guides and drivers is appreciated." },
      ],
    },
    {
      id: "phone",
      title: "Phone and internet",
      items: [
        { h: "Local SIM", p: "Buy a Jio, Airtel or Vi SIM at the airport or a phone shop. Visitors from abroad need their passport, visa and a photo, and activation can take a few hours." },
        { h: "Coverage", p: "Good in towns and along the coast; patchy in forests, on hill roads and in some backwater stretches. Download maps before you go." },
      ],
    },
    {
      id: "customs",
      title: "Customs and etiquette",
      items: [
        { h: "Shoes off", p: "Take off your shoes before entering temples, mosques, many churches and people's homes." },
        { h: "Dress", p: "Away from the beach, cover shoulders and knees, especially at places of worship. Some temples ask men to remove their shirts, and some are open to Hindus only." },
        { h: "Right hand", p: "Eat, give and receive things with your right hand." },
        { h: "Photos", p: "Ask before photographing people and rituals. Photography is not allowed inside many temples." },
        { h: "The head wobble", p: "A gentle side-to-side shake of the head usually means yes, or OK." },
        { h: "Affection in public", p: "Keep it low-key outside the big cities." },
      ],
    },
    {
      id: "health",
      title: "Health and safety",
      items: [
        { h: "Emergencies", p: "Call 112 for police, fire and ambulance." },
        { h: "Water", p: "Drink bottled or filtered water. Restaurants often serve warm, pink-tinted herbal water that has been boiled, which is safe to drink." },
        { h: "Mosquitoes", p: "Use repellent, especially in the monsoon, when dengue is more common." },
        { h: "The sea", p: "Currents are strong. Swim only where lifeguards are posted, never when red flags are up, and not at all in the monsoon." },
        { h: "Personal safety", p: "Kerala is one of India's safer states for travellers, including women travelling alone. Take the usual care at night and on empty beaches." },
      ],
    },
    {
      id: "food-drink",
      title: "Food and drink",
      items: [
        { h: "Meals", p: "'Meals' on a board means a set rice lunch with curries, often refilled for free. Most restaurants serve both vegetarian and non-vegetarian food." },
        { h: "Spice", p: "Food can be hot. Say 'erivu kurachu' (less spicy) when you order." },
        { h: "Alcohol", p: "Alcohol is sold only in bars, some hotels and government-run shops, and some days are dry days. Toddy, palm wine, is sold in licensed toddy shops." },
      ],
    },
    {
      id: "monsoon",
      title: "Travelling in the monsoon",
      items: [
        { h: "Why go", p: "June to September brings heavy rain, but also low prices, empty sights, roaring waterfalls and the traditional Ayurveda season." },
        { h: "What it's like", p: "Rain usually comes in heavy bursts rather than all day, with dry spells between." },
        { h: "Hill roads", p: "Landslides can close roads in the hills. Check the news, travel early in the day and allow extra time." },
        { h: "Beaches", p: "The sea is rough and swimming is closed. Enjoy the beaches from the sand." },
      ],
    },
    {
      id: "ayurveda",
      title: "Ayurveda",
      items: [
        { h: "Choosing a centre", p: "Centres range from day spas to hospitals. The Department of Tourism classifies centres as Green Leaf or Olive Leaf: look for one of those." },
        { h: "Proper treatments", p: "A full course takes one to three weeks, with a diet and routine set by an Ayurvedic doctor. A one-hour massage is a treat, not a treatment." },
        { h: "Tell the doctor", p: "Mention any medical conditions and medicines you take." },
      ],
    },
  ],

  packing: {
    always: ["Light cotton or linen clothes", "Sunscreen and a hat", "Refillable water bottle", "Comfortable sandals", "Plug adapter (India uses types C, D and M; 230 V)", "A copy of your passport and visa"],
    weather: {
      monsoon: ["Umbrella or light rain jacket", "Quick-dry clothes", "Waterproof bag for your phone", "Mosquito repellent"],
      showers: ["Compact umbrella", "Mosquito repellent"],
      hot: ["Extra water and electrolyte sachets", "Loose, breathable clothes"],
      cool: ["Warm layer or fleece", "Light jacket for evenings"],
      pleasant: ["A light layer for evenings and air-conditioning"],
    },
    plans: {
      hills: { label: "Hills and tea country", items: ["Warm jacket (nights get cold)", "Closed walking shoes"] },
      beaches: { label: "Beaches", items: ["Swimwear, and a cover-up for walking into town"] },
      temples: { label: "Temples and festivals", items: ["A scarf or shawl", "Clothes that cover shoulders and knees", "Shoes that slip off easily", "Earplugs for the big drum ensembles"] },
      treks: { label: "Forest treks and wildlife", items: ["Leech socks (monsoon and after rain)", "Binoculars", "Neutral-coloured clothes"] },
      backwaters: { label: "Houseboats and backwaters", items: ["Insect repellent for evenings on the water", "A book for slow afternoons"] },
      ayurveda: { label: "Ayurveda", items: ["Old clothes you don't mind getting oily"] },
    },
  },
};
