# Kerala Journey

A zero-BS Kerala trip planner for first-timers: **Explore → Decide → Plan → Export.**

1. **Explore:** pick one or more trip vibes (Mist & Mountains, Backwaters & Slow Living, Cliffside & Surf,
   Wild Rainforests) and read the candid *Is Kerala for you?* reality check.
2. **Decide:** a three-step wizard asks for length and pace, then who's travelling, and builds a day-by-day itinerary.
   Stops follow the map (hills → water → coast), so a route never doubles back, and the airports are chosen to match
   (Kochi, Thiruvananthapuram or Kozhikode). Activities that don't suit the traveller or are closed that month are left out
   with a reason, and riskier ones are flagged.
3. **Plan:** every transit leg with realistic options (cab, KSRTC bus, train), times, fares in ₹ and boarding tips, plus
   survival essentials: UPI and cash, plugs, SIMs, common scams and emergency numbers.
4. **Export:** *Download My Travel Dossier* saves the plan, transit guide, emergency numbers and a packing list as Markdown;
   *Print / PDF* prints the same dossier.

The last trip is remembered in the browser (localStorage).

## Run it

```sh
npm install
npm run dev        # http://localhost:3000
npm test           # planner + dossier tests (Node 22+)
npm run build      # production build
```

Deploys to Vercel as a standard Next.js app.

## Layout

```
app/                 layout, page, globals.css (Tailwind v4 theme: forest, sand, clay, ink)
components/
  TripContext.tsx    all trip state; derives the itinerary from the wizard answers
  VibeSelector.tsx   Module A: vibe cards
  RealityCheck.tsx   Module A: "Is Kerala for you?" accordion
  TripWizard.tsx     Module B: steps 1–3
  ItineraryView.tsx  Module B: route strip and day-by-day plan
  LogisticsCard.tsx  Module C: one transit leg
  SurvivalEssentials.tsx  Module C: money, power, scams, norms, emergency numbers
  DossierModal.tsx   Module D: preview, download, copy, print
  DossierDocument.tsx  the dossier as a printable document
lib/
  keralaData.ts      vibes, regions, activities, transit legs, essentials, months, packing
  planner.ts         stop selection, route order, day building (pure functions)
  dossier.ts         Markdown export and shared formatting
  planner.test.ts
```

Fares and times in `lib/keralaData.ts` are 2025–26 ballpark figures. Re-check fares, opening days and closures each season.

The previous version of the site (interactive district map, panoramas, culture and food pages) is in git history on `main`
before this rewrite.

## License

MIT, see [LICENSE](LICENSE).
