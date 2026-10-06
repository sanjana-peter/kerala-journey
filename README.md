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

The page is meant to be played with before planning:

- **Atmospheric hero and theme engine:** a full-bleed, slowly pushing-in photo of Munnar, Alleppey, Varkala or Thekkady.
  Hovering a place (in the hero or on a vibe card) morphs the photo, the copy, the sensory notes and the whole page's accent
  and ambient-glow colours (CSS custom properties registered with `@property`, so they interpolate). It drifts through the
  moods on its own until someone interacts.
- **Vibe Canvas:** photo cards with a micro-story each, plus a drag-to-compare slider (Munnar mist vs Kumarakom sunset).
- **Monsoon & Festival Time-Machine:** a Jan–Dec slider (or "Play the year") with rainfall, temperature, festivals and a
  photo per month; the rainfall bars double as the month picker, and "Plan my trip for…" feeds the month into the wizard.
- **Spice Matrix:** eight spices with where they grow, where to taste them, a story and a buying tip; filter by region.
- **Malayalam card-flip:** 22 survival, transit, food and slang phrases with pronunciation and context; progress is saved.
- **Easter eggs:** type a secret word anywhere on the page.

Motion uses [Motion](https://motion.dev) (Framer Motion) and respects `prefers-reduced-motion`. The last trip, and which
phrases you've discovered, are remembered in the browser (localStorage).

Photos in `public/images` are from Kerala Tourism's royalty-free gallery (credited in `lib/experience.ts` and on the page),
used pending their written permission as on the earlier version of the site. Swap them in that one file if needed.

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
  MoodContext.tsx    theme engine: the active mood and its CSS colour variables
  Hero.tsx           cinematic hero with the region selector
  VibeCanvas.tsx     Module A: photo vibe cards with micro-stories; ComparisonSlider.tsx
  RealityCheck.tsx   Module A: "Is Kerala for you?" accordion
  TimeMachine.tsx    month slider: rainfall, festivals, seasonal photos
  SpiceMatrix.tsx    spice grid and detail panel
  PhraseFlip.tsx     Malayalam flip cards
  EasterEgg.tsx, Reveal.tsx  secret words; scroll-in animation
  TripWizard.tsx     Module B: steps 1–3
  ItineraryView.tsx  Module B: route strip and day-by-day plan
  LogisticsCard.tsx  Module C: one transit leg
  SurvivalEssentials.tsx  Module C: money, power, scams, norms, emergency numbers
  DossierModal.tsx   Module D: preview, download, copy, print
  DossierDocument.tsx  the dossier as a printable document
lib/
  keralaData.ts      vibes, regions, activities, transit legs, essentials, months, packing
  experience.ts      photos and credits, moods, micro-stories, seasons, phrases, spices
  planner.ts         stop selection, route order, day building (pure functions)
  dossier.ts         Markdown export and shared formatting
  planner.test.ts
```

Facts were checked against official and published sources on 2026-10-06. Links appear next to each fact on the page and
in the dossier, the registry is `lib/sources.ts`, and [SOURCES.md](SOURCES.md) lists what was confirmed, what was corrected
and what is still unverified (most cab fares, activity prices and the Malayalam transliterations). Re-check fares, opening
days and closures each season, and update `CHECKED_ON` in `lib/sources.ts`.

The previous version of the site (interactive district map, panoramas, culture and food pages) is in git history on `main`
before this rewrite.

## License

MIT, see [LICENSE](LICENSE).
