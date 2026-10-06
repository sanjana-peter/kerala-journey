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
} satisfies Record<string, Source>;

export type SourceKey = keyof typeof sources;

export const src = (...keys: SourceKey[]): Source[] => keys.map((k) => sources[k]);
