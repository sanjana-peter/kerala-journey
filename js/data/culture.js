/*
 * Kerala Journey — culture (the /culture page).
 *
 * arts      – art forms, rituals and festivals. Each opens at /culture/<id>.
 *   kind      – stage, ritual, community, street or martial (the filter chips)
 *   district  – where it's strongest (links to that district)
 *   mediaKey  – reuse the photos of an existing place ("<district>/<spot>"), or
 *   media     – a media block like districts.js; `npm run media culture` downloads the photos
 *   story     – paragraphs; watch – tips for watching; when – when and where to see it
 * festivals – statewide festivals for the calendar (district festivals come from visit.js)
 * timeline  – a short history, oldest first
 * phrases   – Malayalam for travellers: ml, say (how it sounds), en
 */
window.KERALA_CULTURE = {
  kinds: {
    stage: "Stage",
    ritual: "Temple and ritual",
    community: "Community dances",
    street: "Street and water",
    martial: "Martial art",
  },

  arts: [
    {
      id: "kathakali",
      name: "Kathakali",
      ml: "കഥകളി",
      kind: "stage",
      district: "ernakulam",
      mediaKey: "ernakulam/kathakali",
      blurb: "Epic stories told without a spoken word, through painted faces, huge costumes and a language of hand gestures.",
      story: [
        "Kathakali took shape in the 17th century, telling stories from the Ramayana and the Mahabharata. The actors never speak: singers at the side of the stage sing the lines while the actors act them out with mudras, a vocabulary of hand gestures, and extraordinary control of the eyes and face.",
        "Traditionally a performance ran all night by the light of a single large oil lamp. The make-up alone takes hours, and the colour of a face tells you who a character is: green for the noble, red beards for the villainous, soft yellow for women and sages.",
      ],
      watch: [
        "Arrive early: at visitor shows in Kochi you can watch the actors paint their faces.",
        "Read the story beforehand, as the lines are sung in a classical style of Malayalam.",
        "Watch the eyes. Actors train for years to move them independently.",
      ],
      when: "Nightly visitor shows in Fort Kochi and Ernakulam; full performances at temple festivals and at Kerala Kalamandalam, Cheruthuruthy.",
    },
    {
      id: "theyyam",
      name: "Theyyam",
      ml: "തെയ്യം",
      kind: "ritual",
      district: "kannur",
      mediaKey: "kannur/theyyam",
      blurb: "In north Malabar's village shrines, a performer becomes a god for a night.",
      story: [
        "Theyyam is worship, not theatre. In village shrines called kavus across Kannur and Kasaragod, a performer from one of the hereditary communities is painted and dressed as one of hundreds of deities, heroes or ancestors, and for the length of the ritual is believed to be that god.",
        "The deity dances to the drums, sometimes through fire, then speaks to devotees one by one, hearing their troubles and giving blessings. Many performances run through the night and end at dawn.",
      ],
      watch: [
        "It's a religious ritual: dress modestly, stay out of the performers' path and don't use flash.",
        "Ask at your stay about the nearest kaliyattam; dates are local and rarely advertised online.",
        "At Parassinikadavu, near Kannur, a Muthappan Theyyam is held almost every day.",
      ],
      when: "Mostly November to April, in Kannur and Kasaragod.",
    },
    {
      id: "mohiniyattam",
      name: "Mohiniyattam",
      ml: "മോഹിനിയാട്ടം",
      kind: "stage",
      district: "thrissur",
      media: { categories: ["Mohiniyattam"], search: "Mohiniyattam dance", minRatio: 1, minWidth: 1200 },
      blurb: "The 'dance of the enchantress': slow, swaying and graceful, like palms in the wind.",
      story: [
        "Mohiniyattam is Kerala's classical solo dance, traditionally performed by women. Its name comes from Mohini, the enchantress form of Vishnu, and its movements are soft and circular, swaying gently from side to side.",
        "The dancer wears a white and gold kasavu sari, with her hair gathered in a bun on the left side of the head and circled with jasmine. The dance nearly disappeared in the early 20th century and was revived at Kerala Kalamandalam in the 1930s.",
      ],
      watch: [
        "Look for the sideways sway of the upper body, called andolika, which gives the dance its flowing feel.",
        "Festivals of classical dance, and Kalamandalam's performances, are the best places to see it.",
      ],
      when: "At cultural festivals and Kerala Kalamandalam, Cheruthuruthy.",
    },
    {
      id: "koodiyattam",
      name: "Koodiyattam",
      ml: "കൂടിയാട്ടം",
      kind: "stage",
      district: "thrissur",
      media: { categories: ["Koodiyattam"], search: "Koodiyattam", minRatio: 1, minWidth: 1200 },
      blurb: "Sanskrit theatre, performed in temples for many centuries. A single act can take days.",
      story: [
        "Koodiyattam is one of the oldest living theatre traditions in the world, Sanskrit drama performed in Kerala's temple theatres, the koothambalams. UNESCO recognised it as a Masterpiece of the Oral and Intangible Heritage of Humanity in 2001.",
        "It is famously slow: an actor may spend hours elaborating a single verse through gesture and expression, and a full play can take many days. It was traditionally performed by the Chakyar and Nangiar communities, accompanied by the mizhavu, a large copper drum.",
      ],
      watch: [
        "Visitor performances are shortened to an hour or two: a good way in.",
        "Watch the eyes and face; Koodiyattam actors are known for their expressive control.",
      ],
      when: "At temple festivals, and at centres in Thrissur district and Thiruvananthapuram.",
    },
    {
      id: "kalaripayattu",
      name: "Kalaripayattu",
      ml: "കളരിപ്പയറ്റ്",
      kind: "martial",
      district: "kozhikode",
      media: { categories: ["Kalaripayattu"], search: "Kalaripayattu", minRatio: 1, minWidth: 1200 },
      blurb: "Kerala's martial art: leaps, kicks, sticks, swords and shields, trained in an earthen pit.",
      story: [
        "Kalaripayattu is trained in a kalari, a sunken earthen gymnasium. Students move through stages: body conditioning and flexibility, then wooden weapons, then metal ones such as swords, shields and the flexible urumi sword, and finally bare-handed combat.",
        "Masters, called gurukkal, also learn traditional healing and massage, and kalaris often treat injuries. The northern style is strongest in Malabar; there is also a southern style in old Travancore.",
      ],
      watch: [
        "Many kalaris in Kozhikode, Kannur and Thiruvananthapuram hold early-morning training you can watch.",
        "Evening demonstrations for visitors are common in Kochi and Thekkady.",
      ],
      when: "Year round, in kalaris across Kerala.",
    },
    {
      id: "ottamthullal",
      name: "Ottamthullal",
      ml: "ഓട്ടൻതുള്ളൽ",
      kind: "stage",
      district: "palakkad",
      media: { categories: ["Ottamthullal"], search: "Ottamthullal", minRatio: 1, minWidth: 1200 },
      blurb: "A one-man show of songs, jokes and satire, created so ordinary people could follow along.",
      story: [
        "Ottamthullal was created by the poet Kunchan Nambiar in the 18th century. Unlike the Sanskrit temple arts, it was performed in everyday Malayalam, so anyone could understand it.",
        "A single performer in a bright costume and green face sings and dances through a story, poking fun at the powerful and the pompous along the way. The story goes that Nambiar invented it after being mocked for dozing off while drumming for a temple performance.",
      ],
      watch: [
        "You don't need to understand every word: the expressions and timing carry the jokes.",
        "It is a regular at school and college arts festivals, as well as temple festivals.",
      ],
      when: "At temple festivals and cultural events across Kerala.",
    },
    {
      id: "oppana",
      name: "Oppana",
      ml: "ഒപ്പന",
      kind: "community",
      district: "malappuram",
      media: { categories: ["Oppana"], search: "Oppana dance", minRatio: 1, minWidth: 1200 },
      blurb: "Clapping, singing and circling the bride: the dance at Malabar's Muslim weddings.",
      story: [
        "Oppana is performed by women at Mappila (Muslim) weddings in Malabar. The dancers circle the bride, clapping in rhythm and singing Mappilappattu, songs that mix Malayalam with Arabic words.",
        "The songs tease and celebrate the bride and the wedding. There is also a men's version, performed around the groom.",
      ],
      watch: [
        "Outside weddings, the best place to see it is at school and college youth festivals, where it is a popular competition item.",
      ],
      when: "At weddings in Malabar, and at arts festivals.",
    },
    {
      id: "margamkali",
      name: "Margamkali",
      ml: "മാർഗ്ഗംകളി",
      kind: "community",
      district: "kottayam",
      media: { categories: ["Margamkali"], search: "Margamkali", minRatio: 1, minWidth: 1200 },
      blurb: "A circle dance of Kerala's Syrian Christians, around a tall brass lamp.",
      story: [
        "Margamkali belongs to Kerala's Syrian Christian community. Dancers move in a circle around a nilavilakku, a tall brass oil lamp, clapping and singing.",
        "The songs tell the story of St Thomas the Apostle's journey and mission in Kerala. It was once performed at weddings and church feasts, and today it is a favourite at arts festivals.",
      ],
      watch: ["Look for it at church feasts in central Kerala and at youth festivals."],
      when: "At church festivals and arts festivals, mostly in central Kerala.",
    },
    {
      id: "pulikali",
      name: "Pulikali",
      ml: "പുലികളി",
      kind: "street",
      district: "thrissur",
      media: { categories: ["Pulikali"], search: "Pulikali Thrissur", minRatio: 1, minWidth: 1200 },
      blurb: "On the fourth day of Onam, Thrissur's streets fill with dancing 'tigers'.",
      story: [
        "Pulikali means 'tiger play'. Troupes of men paint their bodies in tiger stripes and spots, with a snarling tiger face painted across the belly, and dance through the streets of Thrissur to the beat of drums.",
        "Painting starts in the early morning and takes hours. Each troupe competes to have the most spectacular tigers, and the procession around the Swaraj Round draws huge crowds.",
      ],
      watch: ["Find a spot on the Swaraj Round in the afternoon; the tigers arrive from all directions."],
      when: "Fourth day of Onam (August or September), Thrissur.",
    },
    {
      id: "chenda-melam",
      name: "Chenda melam",
      ml: "ചെണ്ടമേളം",
      kind: "ritual",
      district: "thrissur",
      media: { categories: ["Chenda melam", "Panchavadyam"], search: "Chenda melam", minRatio: 1, minWidth: 1200 },
      blurb: "Rows of drummers building slowly to a thunderous climax: the sound of every temple festival.",
      story: [
        "The chenda is a cylindrical drum played with sticks, and a melam is an ensemble of chendas with cymbals and horns. Forms such as panchari melam and pandi melam start slowly and build over hours, the tempo rising in fixed stages.",
        "At Thrissur Pooram, the Ilanjithara melam brings together hundreds of musicians under a tree in the temple grounds, and crowds wave their hands in the air to the beat.",
      ],
      watch: ["Stand close enough to feel it. Earplugs are sensible for the big ones."],
      when: "At almost every temple festival; best at Thrissur Pooram (April or May).",
    },
    {
      id: "vallam-kali",
      name: "Vallam kali",
      ml: "വള്ളംകളി",
      kind: "street",
      district: "alappuzha",
      mediaKey: "alappuzha/snake-boats",
      blurb: "Snake boats over 100 feet long, with more than a hundred rowers singing as they race.",
      story: [
        "The chundan vallam, or snake boat, is a long, narrow boat with a raised stern like a cobra's hood. Each belongs to a village, which trains its crew for months and treats the boat almost as a deity.",
        "Rowers keep time with vanchipattu, boat songs, as the boats race side by side. The Nehru Trophy race on Punnamada Lake began in 1952, when Jawaharlal Nehru visited Alappuzha.",
      ],
      watch: ["Buy a pavilion ticket for the Nehru Trophy in advance, or watch from the banks for free."],
      when: "August to October; the Nehru Trophy is on the second Saturday of August.",
    },
    {
      id: "thrissur-pooram",
      name: "Thrissur Pooram",
      ml: "തൃശ്ശൂർ പൂരം",
      kind: "ritual",
      district: "thrissur",
      mediaKey: "thrissur/thrissur-pooram",
      blurb: "The festival of festivals: elephants, drums, parasols and fireworks around one temple.",
      story: [
        "Thrissur Pooram was started in the late 18th century by Sakthan Thampuran, ruler of Kochi, who brought the temples of the area together for one great festival at the Vadakkunnathan temple.",
        "Its high points are the Ilanjithara melam, when hundreds of drummers play together, and the kudamattam, when two rival groups on caparisoned elephants take turns raising sets of dazzling parasols. It ends with fireworks in the early hours.",
      ],
      watch: ["Book accommodation months ahead, and expect enormous crowds.", "Try the kudamattam in Thrissur's 'Try it' tab first."],
      when: "April or May (the Malayalam month of Medam).",
    },
  ],

  festivals: [
    { name: "Onam", months: [7, 8], what: "Kerala's harvest festival: flower carpets (pookalam) outside every home, the Onam sadya, boat races and ten days of celebration." },
    { name: "Vishu", months: [3], what: "The Malayalam new year in mid-April. The first sight of the morning is the vishukkani, a tray of auspicious things, and elders give children money." },
    { name: "Navaratri and Vidyarambham", months: [8, 9], what: "Nine nights of worship. On Vijayadashami, young children write their first letters in a tray of rice." },
    { name: "Thiruvathira", months: [11, 0], what: "Women perform the Thiruvathirakali, a graceful circle dance, on the night of the Thiruvathira star." },
    { name: "Christmas", months: [11], what: "Paper star lanterns glow outside homes, churches hold midnight mass, and every bakery sells plum cake." },
    { name: "Easter", months: "moving", what: "A big feast for Kerala's Christians, with appam and stew for breakfast. March or April." },
    { name: "Eid al-Fitr and Bakrid", months: "moving", what: "The dates follow the Islamic calendar and move about 11 days earlier each year. Biryani is cooked in every Muslim home." },
  ],

  timeline: [
    { year: "1st century", title: "The pepper coast", text: "Roman, Greek and Arab ships sail to Muziris, near today's Kodungallur, trading gold for pepper." },
    { year: "52", title: "St Thomas arrives", text: "Tradition holds that St Thomas the Apostle landed at Muziris, the beginning of Kerala's ancient Christian community." },
    { year: "629", title: "An early mosque", text: "Tradition dates the Cheraman Juma Masjid in Kodungallur to 629, making it one of the oldest mosques in India." },
    { year: "c. 1000", title: "The Jewish copper plates", text: "A Chera king grants privileges to Joseph Rabban, leader of Kerala's Jewish community, recorded on copper plates." },
    { year: "1498", title: "Vasco da Gama", text: "The Portuguese navigator lands at Kappad near Kozhikode, opening the sea route from Europe to India.", district: "kozhikode" },
    { year: "1568", title: "The Paradesi Synagogue", text: "Kochi's Jewish community builds the synagogue in Mattancherry. It is still in use today.", district: "ernakulam" },
    { year: "1663", title: "The Dutch in Kochi", text: "The Dutch East India Company takes Kochi from the Portuguese." },
    { year: "1741", title: "The Battle of Colachel", text: "Marthanda Varma of Travancore defeats the Dutch, one of the first defeats of a European power in India." },
    { year: "1750", title: "Travancore's gift", text: "Marthanda Varma dedicates his kingdom to Sree Padmanabha, ruling as the deity's servant.", district: "thiruvananthapuram" },
    { year: "1792", title: "Malabar under the British", text: "After the Third Anglo-Mysore War, Malabar passes to the British East India Company." },
    { year: "1924", title: "Vaikom Satyagraha", text: "A peaceful campaign demands that people of all castes may use the roads around the Vaikom temple.", district: "kottayam" },
    { year: "1936", title: "Temple Entry Proclamation", text: "Travancore opens its temples to all Hindus, regardless of caste." },
    { year: "1956", title: "Kerala is born", text: "On 1 November, the Malayalam-speaking regions are united as the state of Kerala. The day is celebrated as Kerala Piravi." },
    { year: "1957", title: "A first at the ballot box", text: "Kerala elects one of the world's first democratically elected communist governments." },
    { year: "1991", title: "Total literacy", text: "Kerala is declared India's first fully literate state, the result of a statewide volunteer campaign." },
    { year: "2018", title: "The great flood", text: "Kerala's worst floods in a century. Fishermen bring their boats inland and rescue thousands of people." },
  ],

  phrases: [
    { ml: "നമസ്കാരം", say: "na-mas-KAA-ram", en: "Hello (polite)" },
    { ml: "നന്ദി", say: "NUN-dhi", en: "Thank you" },
    { ml: "സുഖമാണോ?", say: "su-kha-MAA-no?", en: "How are you?" },
    { ml: "ശരി", say: "SHA-ri", en: "OK" },
    { ml: "വേണ്ട", say: "VAYN-da", en: "No thanks, I don't want it" },
    { ml: "മതി", say: "MA-thi", en: "That's enough" },
    { ml: "എത്രയാ?", say: "ETH-ra-yaa?", en: "How much is it?" },
    { ml: "എവിടെയാണ്…?", say: "e-vi-DAY-yaa-nu…?", en: "Where is…?" },
    { ml: "വെള്ളം", say: "VELL-um", en: "Water" },
    { ml: "ചായ, കാപ്പി", say: "CHAA-ya, KAAP-pi", en: "Tea, coffee" },
    { ml: "എരിവ് കുറച്ച്", say: "e-riv KU-rach", en: "Less spicy, please" },
    { ml: "നല്ല രുചി!", say: "NULL-a RU-chi!", en: "Delicious!" },
    { ml: "ഇത് എന്താ?", say: "ith EN-thaa?", en: "What is this?" },
    { ml: "എനിക്ക് മലയാളം അറിയില്ല", say: "e-NIK-ku ma-la-YAA-lam a-ri-YIL-la", en: "I don't speak Malayalam" },
    { ml: "പോകാം", say: "POH-kaam", en: "Let's go" },
  ],
};
