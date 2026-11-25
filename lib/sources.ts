/*
 * Where the facts come from. Each entry is a page that was read when the data was last checked;
 * data files point at these by key. SOURCES.md lists which claim each one supports.
 *
 * Official pages (Kerala Tourism, government, Indian Railways, IMD) are preferred. Where only news
 * or travel-guide pages were available, `kind` says so, so the claim can be re-checked first.
 */

export interface Source {
  label: string;
  url: string;
  kind: "official" | "news" | "reference" | "guide";
}

export const CHECKED_ON = "2026-10-06";

export const sources = {
  // Emergency & helplines
  lsgHelplines: { label: "Kerala LSG Dept: important helpline numbers", url: "https://thalappalampanchayat.lsgkerala.gov.in/en/node/138", kind: "official" },
  ktFooter: { label: "Kerala Tourism (site footer: tourist information numbers)", url: "https://www.keralatourism.org/experiences/", kind: "official" },
  indiaTouristHelpline: { label: "Embassy of India: 24x7 multilingual tourist helpline", url: "https://indembassysweden.gov.in/page/tourist-help-line-in-india", kind: "official" },

  // Sights and opening days
  ktSynagogue: { label: "Kerala Tourism: Paradesi Synagogue", url: "https://keralatourism.org/destination/synagogue-mattancherry/163", kind: "official" },
  ktDutchPalace: { label: "Kerala Tourism: Mattancherry Palace", url: "https://www.keralatourism.org/destination/mattancherry-palace-kochi/178", kind: "official" },
  ktEdakkal: { label: "Kerala Tourism: Edakkal Caves", url: "https://www.keralatourism.org/malabar/edakkal-caves/195", kind: "official" },
  eravikulamReopen: { label: "Outlook Traveller: Eravikulam reopens after breeding-season closure", url: "https://www.outlooktraveller.com/News/keralas-eravikulam-national-park-reopens-after-breeding-season-closure", kind: "news" },
  eravikulamBooking: { label: "Eravikulam National Park online tickets", url: "https://www.eravikulamnationalpark.in/", kind: "official" },
  napier: { label: "Wikipedia: Napier Museum (hours and closed days)", url: "https://en.wikipedia.org/wiki/Napier_Museum", kind: "reference" },
  ktPeriyar: { label: "Kerala Tourism: Periyar eco-tourism programmes", url: "https://www.keralatourism.org/ecotourism/trekking-programs/periyar-programme/30", kind: "official" },
  periyarBoating: { label: "Abad Hotels: Periyar boating schedule", url: "https://www.abadhotels.com/green-forest-resort-thekkady/blogs/periyar-boating.html", kind: "guide" },
  ktChembra: { label: "Kerala Tourism: Chembra Peak trek", url: "https://www.keralatourism.org/adventure-tourism/trekking/chembra-peak", kind: "official" },
  chembraStatus: { label: "Wayanadn: Chembra Peak trekking 2026 (permit, cap, lake-only)", url: "https://www.wayanadn.com/chembra-peak-trekking-ticket-rates-timings-guide-2026/", kind: "guide" },
  meesapulimala: { label: "Onmanorama: how to get an entry pass for Meesapulimala", url: "https://onmanorama.com/travel/kerala/2018/01/15/meesappulimala-entry-pass-forest-department.html", kind: "news" },
  wayanadSanctuary: { label: "Lonely Planet: Wayanad Wildlife Sanctuary (safaris, fire-season closure)", url: "https://www.lonelyplanet.com/points-of-interest/wayanad-wildlife-sanctuary/1307482", kind: "guide" },
  houseboatTimes: { label: "Backwater Holidays: Alleppey houseboat check-in, check-out and mooring", url: "https://www.backwaterholidays.in/blog/alleppey-houseboat-check-in-time", kind: "guide" },
  waterMetro: { label: "Wikipedia: Kochi Water Metro (routes, fares, hours)", url: "https://en.wikipedia.org/wiki/Kochi_Water_Metro", kind: "reference" },
  ktPadmanabhaswamy: { label: "Kerala Tourism FAQ: Padmanabhaswamy Temple dress code", url: "https://www.keralatourism.org/faq/is-there-any-dress-code-for-padmanabha-swamy-temple", kind: "official" },
  padmanabhaswamyEntry: { label: "Travel India Smart: Padmanabhaswamy Temple entry rules", url: "https://www.travelindiasmart.com/religious-tours/padmanabhaswamy_temple", kind: "guide" },
  guruvayurEntry: { label: "The News Minute: Guruvayur temple and non-Hindu entry", url: "https://www.thenewsminute.com/amp/story/kerala/allowing-non-hindus-temple-feast-will-affect-sanctity-guruvayur-chief-priest-79987", kind: "news" },

  // Transport
  kochiMunnar: { label: "Fragrant Nature: Kochi to Munnar distance, route and buses", url: "https://www.fragrantnature.com/blogs/kochi-to-munnar-travel-guide-how-to-reach-best-route-distance-options.html", kind: "guide" },
  uberKochiMunnar: { label: "Uber Intercity: Kochi to Munnar fares", url: "https://www.uber.com/in/en/r/intercity/kochi-kerala-to-munnar-kerala/", kind: "guide" },
  munnarThekkady: { label: "Iris Holidays: Munnar to Thekkady routes and times", url: "https://irisholidays.com/keralatourism/munnar-to-thekkady/", kind: "guide" },
  airportBus: { label: "Airport Transfer Portal: Cochin airport buses", url: "https://www.airporttransferportal.com/en/airport-guides/cok", kind: "guide" },
  ersAlleppeyTrain: { label: "Rome2rio: Kochi to Alappuzha by train", url: "https://www.rome2rio.com/s/Kochi/Alappuzha", kind: "guide" },
  ersVarkalaTrain: { label: "GoAsia: Ernakulam to Varkala by train", url: "https://goasia.cc/en/india/ernakulam-to-varkala", kind: "guide" },
  railOne: { label: "BW Businessworld: Railways withdraw UTS, move unreserved tickets to RailOne", url: "https://www.businessworld.in/article/railways-to-withdraw-uts-app-shift-even-unreserved-ticketing-to-railone-585852", kind: "news" },
  ktThamarassery: { label: "Kerala Tourism: Wayanad ghats (Thamarassery pass)", url: "https://keralatourism.org/destination/wayanad-ghats/271", kind: "official" },
  calicutWayanad: { label: "StayVista: Calicut to Wayanad (85 km, 9 hairpins)", url: "https://www.stayvista.com/blog/calicut-to-wayanad-85-km-9-hairpins-how-to-reach-2026-guide/", kind: "guide" },

  // Money, phone, rules
  upiOneWorld: { label: "BOOM: how the UPI One World wallet works for foreign visitors", url: "https://www.boomlive.in/web-stories/what-is-the-upi-one-world-wallet-how-it-works-for-foreign-visitors-in-india", kind: "news" },
  touristSim: { label: "Embassy of India: SIM cards for foreign tourists", url: "https://www.indembassybern.gov.in/page/introduction-of-sim-cards-for-the-foreign-tourists/", kind: "official" },
  dryDay: { label: "Hospitality Biz India: Kerala relaxes dry-day rule (first of month)", url: "https://hospitalitybizindia.com/news-track/kerala-relaxes-dry-day-rule-to-boost-tourism/", kind: "news" },

  // Climate & seasons
  imdKochi: { label: "Wikipedia: Kochi climate table (IMD, Cochin airport 1991–2020)", url: "https://en.wikipedia.org/wiki/Kochi#Climate", kind: "reference" },
  monsoonOnset: { label: "The News Minute: IMD normal monsoon onset over Kerala (1 June)", url: "https://www.thenewsminute.com/article/southwest-monsoon-likely-hit-kerala-june-5-imd-124627", kind: "news" },

  // Festivals
  nehruTrophy2026: { label: "Alappuzha district: 72nd Nehru Trophy Boat Race, 22 Aug 2026", url: "https://alappuzha.nic.in/en/72nd-nehru-trophy-boat-race-in-2026/", kind: "official" },
  thrissurPooram: { label: "Incredible India: Thrissur Pooram", url: "https://www.incredibleindia.gov.in/en/festivals-and-events/kerala/thrissur-pooram", kind: "official" },
  poorumElephants: { label: "Wikipedia: Thrissur Pooram (kudamattam, 15 elephants a side)", url: "https://en.wikipedia.org/wiki/Thrissur_Pooram", kind: "reference" },
  pooram2026: { label: "Drik Panchang: Thrissur Pooram 2026 date", url: "https://www.drikpanchang.com/malayalam/festivals/thrissur-pooram/thrissur-pooram-date-time.html?year=2026", kind: "reference" },
  attukal2026: { label: "Drik Panchang: Attukal Pongala 2026 date", url: "https://www.drikpanchang.com/malayalam/festivals/attukal-pongala/attukal-pongala-date-time.html?year=2026", kind: "reference" },
  attukal: { label: "Wikipedia: Attukal Pongala", url: "https://en.wikipedia.org/wiki/Attukal_Pongala", kind: "reference" },
  onam2026: { label: "Drik Panchang: Onam / Thiruvonam 2026", url: "https://www.drikpanchang.com/festivals/onam/onam-thiruvonam-date.html?year=2026", kind: "reference" },
  ktPulikali: { label: "Kerala Tourism: Pulikali", url: "https://keralatourism.org/onam/onam-games/pulikali", kind: "official" },
  ktAranmula: { label: "Kerala Tourism: Aranmula boat race", url: "https://www.keralatourism.org/champions-boat-league/boat-races/aranmula-boat-race", kind: "official" },
  ktKalpathy: { label: "Kerala Tourism: Kalpathy Ratholsavam", url: "https://keralatourism.org/kerala-article/kalpathy-ratholsavam/684", kind: "official" },
  sabarimala: { label: "AIR News: Sabarimala opens for Mandala–Makaravilakku season", url: "https://www.newsonair.gov.in/sabarimala-ayyappa-temple-opens-today-for-mandala-makaravilakku-pilgrimage-season", kind: "official" },
  theyyamSeason: { label: "Kerala Tourism FAQ: theyyam season and participation", url: "https://www.keralatourism.org/faq/can-i-participate-theyyam-rituals-as-part-of-a-cultural-tour", kind: "official" },
  cochinCarnival: { label: "Kerala Tourism: Cochin Carnival", url: "https://www.keralatourism.org/event/cochin-carnival/114/", kind: "official" },
  pappanji: { label: "Wikipedia: Pappanji", url: "https://en.wikipedia.org/wiki/Pappanji", kind: "reference" },

  // Spices
  ktSpiceDistricts: { label: "Kerala Tourism FAQ: which parts of Kerala grow spices", url: "https://www.keralatourism.org/faq/which-part-of-kerala-is-popular-for-spices-cultivation", kind: "official" },
  pepperDistricts: { label: "ICAR journal: pepper area by Kerala district", url: "https://epubs.icar.org.in/index.php/JAEM/article/download/171373/62370/487427", kind: "reference" },
  vascoDaGama: { label: "Wikipedia: Vasco da Gama (Kappad landing, May 1498)", url: "https://en.wikipedia.org/wiki/Vasco_da_Gama", kind: "reference" },
  cardamomAuctions: { label: "Spices Board: weekly market report (Puttady and Bodinayakanur e-auctions)", url: "https://indianspices.com/sites/default/files/04.04.2026%20SPICEMARKET.pdf", kind: "official" },
  ktAnjarakandy: { label: "Kerala Tourism: Cinnamon Valley, Anjarakandy", url: "https://www.keralatourism.org/destination/cinnamon-valley-anjarakandy/501", kind: "official" },
  anjarakandyWiki: { label: "Wikipedia: Anjarakkandy (estate founded 1767)", url: "https://en.wikipedia.org/wiki/Anjarakkandy", kind: "reference" },
  iissrNutmeg: { label: "ICAR-IISR: nutmeg (growing districts, mace)", url: "https://www.spices.res.in/crops/nutmeg", kind: "official" },
  alleppeyTurmeric: { label: "FAO: turmeric fingers (Alleppey grade, curcumin content)", url: "https://fao.org/fileadmin/templates/inpho/documents/CURCUMA%20FINGERS.pdf", kind: "reference" },
  kudampuli: { label: "Wikipedia: Malabar matthi curry (kudampuli, Garcinia gummi-gutta)", url: "https://en.wikipedia.org/wiki/Malabar_matthi_curry", kind: "reference" },

  // Districts and everyday Kerala
  districtList: { label: "Wikipedia: List of districts of Kerala (headquarters)", url: "https://en.wikipedia.org/wiki/List_of_districts_of_Kerala", kind: "reference" },
  kasaragodLanguages: { label: "Wikipedia: Kasaragod district (seven languages, formed 1984)", url: "https://en.wikipedia.org/wiki/Kasaragod_district", kind: "reference" },
  ktYakshagana: { label: "Kerala Tourism: Yakshagana", url: "https://keralatourism.org/malabar/yakshagana/11", kind: "official" },
  bekalFort: { label: "Wikipedia: Bekal Fort", url: "https://en.wikipedia.org/wiki/Bekal_Fort", kind: "reference" },
  ktKanhirode: { label: "Kerala Tourism: Kanhirode Weaving Co-operative Society", url: "https://www.keralatourism.org/malabar/kanhirode-weaving-society/140", kind: "official" },
  loknathWeavers: { label: "Lonely Planet: Loknath Weavers' Co-operative, Kannur", url: "https://www.lonelyplanet.com/india/kerala/kannur-cannanore/attractions/loknath-weavers-co-operative/a/poi-sig/1151132/356343", kind: "guide" },
  mambally: { label: "The News Minute: how Mambally Bapu baked the first Christmas cake, 1883", url: "https://www.thenewsminute.com/kerala/how-mambally-bapu-baked-first-christmas-cake-1883-kerala-159135", kind: "news" },
  ktUravu: { label: "Kerala Tourism: Uravu bamboo eco-tourism, Wayanad", url: "https://www.keralatourism.org/kerala-article/2024/uravu-bamboo-ecotourism-wayanad/1436", kind: "official" },
  ktSmStreet: { label: "Kerala Tourism: SM Street (Mittayitheruvu), Kozhikode", url: "https://www.keralatourism.org/destination/sm-street-kozhikode/252/", kind: "official" },
  ktHalwa: { label: "Kerala Tourism: Kozhikkodan halwa", url: "https://keralatourism.org/shopping-options/kozhikkodan-halwa-a-sweet-legacy-of-kerala/31", kind: "official" },
  beyporeUru: { label: "The News Minute: the urus of Beypore", url: "https://www.thenewsminute.com/article/urus-kerala-s-beypore-these-traditional-boats-find-home-wealthy-qataris-80446", kind: "news" },
  ktSevens: { label: "Kerala Tourism: Sevens football", url: "https://www.keralatourism.org/malabar/sevens-football/214", kind: "official" },
  sevensSeason: { label: "Olympics.com: Sevens football in Kerala (season, tournaments)", url: "https://olympics.com/en/news/what-is-sevens-football-kerala-history", kind: "news" },
  aryaVaidyaSala: { label: "Wikipedia: Arya Vaidya Sala, Kottakkal (founded 1902)", url: "https://en.wikipedia.org/wiki/Arya_Vaidya_Sala", kind: "reference" },
  palakkadDistrict: { label: "Wikipedia: Palakkad district (\"Granary of Kerala\")", url: "https://en.wikipedia.org/wiki/Palakkad_district", kind: "reference" },
  palakkadGap: { label: "Wikipedia: Palakkad Gap", url: "https://en.wikipedia.org/wiki/Palakkad_Gap", kind: "reference" },
  thrissurCulture: { label: "Wikipedia: Thrissur (cultural capital, state academies)", url: "https://en.wikipedia.org/wiki/Thrissur", kind: "reference" },
  kalamandalamTour: { label: "Kerala Kalamandalam: guided tour (A Day with the Masters)", url: "https://kalamandalam.ac.in/guided-tour/", kind: "official" },
  ktKumbalangi: { label: "Kerala Tourism: Kumbalangi tourism village", url: "https://keralatourism.org/destination/kumbalangi-kochi-tourist-village/353", kind: "official" },
  idukkiDam: { label: "Onmanorama: Idukki dam opened for visitors for the season", url: "https://onmanorama.com/travel/kerala/2024/09/04/idukki-dam-open-for-visitors-onam-vacation-kerala-tourism.html", kind: "news" },
  kottayamLiteracy: { label: "Wikipedia: 1989 in Kerala (Kottayam, first fully literate town)", url: "https://en.wikipedia.org/wiki/1989_in_Kerala", kind: "reference" },
  kottayamLetters: { label: "Outlook Traveller: the lure of Kottayam (letters, latex and lakes)", url: "https://www.outlooktraveller.com/explore/features/kerala-the-lure-of-kottayam", kind: "news" },
  kuttanadGiahs: { label: "FAO GIAHS: Kuttanad below-sea-level farming system", url: "https://www.fao.org/giahs/giahs-around-the-world/india-kuttanad-farming-system/en", kind: "official" },
  ktKuttanad: { label: "Kerala Tourism: heritage status for Kuttanad", url: "https://www.keralatourism.org/kerala-article/2013/heritage-status-kuttanad/455", kind: "official" },
  aranmulaKannadi: { label: "Wikipedia: Aranmula kannadi (GI tag 2005)", url: "https://en.wikipedia.org/wiki/Aranmula_kannadi", kind: "reference" },
  kollamCashew: { label: "Wikipedia: Cashew business in Kollam", url: "https://en.wikipedia.org/wiki/Cashew_business_in_Kollam", kind: "reference" },
  kollamBoat: { label: "A Social Nomad: Alleppey to Kollam by boat (2026)", url: "https://asocialnomad.com/?p=6964", kind: "guide" },
  kollamBoatTimes: { label: "Onmanorama: the Kollam–Alappuzha boat journey", url: "https://onmanorama.com/travel/kerala/2019/09/17/panoramic-boat-journey-kollam-alappuzha.html", kind: "news" },
  chalai: { label: "The News Minute: Chalai, Kerala's oldest market", url: "https://www.thenewsminute.com/kerala/tale-chalai-kerala-s-oldest-market-thriving-even-after-centuries-143541", kind: "news" },
  swtdFares: { label: "Onmanorama: Kumarakom water routes and fares (Dec 2025)", url: "https://www.onmanorama.com/travel/kerala/2025/12/08/how-to-explore-kumarakom-routes-fares.html", kind: "news" },
  swtdCommuters: { label: "Onmanorama: rush on the Kottayam–Alappuzha SWTD boat", url: "https://onmanorama.com/travel/travel-news/2024/06/22/kottayam-alappuzha-boat-service-heavy-rush-kuttanad-swtd-boats.html", kind: "news" },
  janakeeya: { label: "Onmanorama: subsidy cuts push Janakeeya hotels out of business (Aug 2026)", url: "https://www.onmanorama.com/news/kerala/2026/08/15/subsidy-cuts-rising-costs-push-janakeeya-hotels-out-of-business-in-pathanamthitta.html", kind: "news" },
  toddyFamilies: { label: "Onmanorama: Kakkathuruthu toddy shop, a family getaway", url: "https://www.onmanorama.com/travel/kerala/2017/05/09/kakkathuruthu-shap-family-getaway-toddy.html", kind: "news" },
  libraries: { label: "Onmanorama: all public libraries in Kerala to be computerised (2024)", url: "https://www.onmanorama.com/news/kerala/2024/02/03/all-public-libraries-kerala-to-be-computerised-r-bindu.amp.html", kind: "news" },
} satisfies Record<string, Source>;

export type SourceKey = keyof typeof sources;

export const src = (...keys: SourceKey[]): Source[] => keys.map((k) => sources[k]);
