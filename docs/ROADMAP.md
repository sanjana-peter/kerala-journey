# Kerala Journey: roadmap

From "read about Kerala" to **plan the trip → travel it → track it → remember it**, without losing the visual,
district-by-district tour. The tour stays the storytelling front end. The new work is the product underneath it.

## The idea: one system, four verbs

| Verb | What it is now | What it becomes |
|---|---|---|
| **Plan** | A per-district "Plan" sheet, plus a list of saved places (`/trip`) | A trip builder: inputs → a day-by-day itinerary on a map that can be edited, saved and shared |
| **Eat** | `/eat`: 14 signature dishes, the regional kitchens, the sadya | "While you're in Kozhikode, eat…" on each day of the plan, plus a **food passport** (≈45 tastes to tick off) |
| **Experience** | Try-it interactives inside each district | Real things to do (`/do`), each with hours, a rough price and its season, with **Add to Day N** |
| **Collect** | 14 district stamps for visiting the virtual tour | Passport stats: districts, places, dishes tasted, experiences done, km travelled |
| **Remember** | Nothing | A journal of trips already taken (`/journeys`): what they did, photos, and a rating and review for each place, dish and experience |

**Plan is for the future, Journeys is for the past.** `/plan` is where someone builds a trip they haven't taken yet.
The old saved-places list (`/trip`) folds into it as "Want to see". `/journeys` is where they record a trip they've
been on. A finished plan can be turned into a journey with one click, so its days become the journal's outline.

Every day of an itinerary reads the same way:

```
Day 2 · Munnar (Idukki)              cool, clear · about 3½ h from Kochi
  See      Munnar tea hills, Eravikulam
  Eat      Cardamom tea · also from the hill kitchen: Wayanad coffee
  Try      Sunrise at Kolukkumalai  [Add] · Tea museum and tasting
  Collect  ☐ each of the above · Idukki stamp
```

## Guiding rules

- **The AI never invents places.** A deterministic planner builds every itinerary from the site's own data. The AI
  turns free text into planner inputs and explains the result. Any id it outputs that isn't in the data is rejected.
- **Everything works without an account.** It saves in the browser first. Signing in only syncs.
- **Interaction, not animation** (as now). No autoplay.
- **Honest numbers.** Drive times and prices always say "about". Prices carry a `lastChecked` date and stay marked
  as ballpark until someone local confirms them.
- **Kerala Tourism content needs their written permission before launch.** For the proof of concept, photos from
  their royalty-free gallery are used on the `kerala-tourism-photos` and `kerala-trip` branches only (`main` keeps
  Wikimedia Commons), so the site can be shown to Kerala Tourism and permission asked for. Using their pages as a
  "source layer" also needs permission. Otherwise: Wikimedia Commons, Wikipedia facts, and our own writing.
- Keep the no-framework vanilla JS structure. New logic goes in small, testable modules, not more lines in `app.js`.

---

## Phase 1: the planner in the browser (no backend, no keys)

It ships on the current static Vercel site.

### Data (`js/data/`)

| File | Contents | Status |
|---|---|---|
| `plan.js` | 17 **bases** (the towns a trip stays in: Kochi, Munnar, Thekkady, Alappuzha, Varkala…), each with district, coordinates, `hills`, interest tags, the spots seen from it, `[least, ideal]` days and a "classic" weight. Also gateways (COK, TRV, CCJ, CNN), parties, paces, event seasons and daily costs per style | In use by `/plan`; costs need a local check |
| `doings.js` | ≈55 experiences: base, kind, hours, cost (`per` person or group), `when`, `months`, notes such as closures | In use by `/plan` ("Try"); prices need a local check |
| `food.js` → `KERALA_TASTES` | ≈30 extra well-known tastes per district (Kozhikode biryani, unnakkaya, sulaimani, boli…) for the food passport | To do; needs a local check |

### Engine: `js/planner.js` (pure functions, no DOM, runs in Node for tests)

```
buildPlan(inputs, data) → plan
inputs = { days, from, to, party, budget, interests[], pace, month, mustSee[] (saved places) }
plan   = { stops: [{ base, days }], days: [{ base, see[], eat[], try[], travel? }], km, cost, fits }
```

1. **Score each base.** Interest tag matches ×3, the base's classic weight, +5 if it contains a saved place,
   and a penalty in months when its main attraction is closed or poor (Eravikulam in Feb–Mar, beaches in the monsoon).
2. **Choose how many bases.** `round(days / pace.daysPerBase)`, clamped so each base gets at least its least days.
3. **Choose which bases.** Greedily: score minus a distance penalty from the gateway or the bases already chosen.
   Short trips penalise distance harder.
4. **Put them in order.** Brute-force the shortest route from the arrival gateway to the departure gateway (≤ 8 bases,
   so ≤ 40,320 orders, which is instant). Reject any leg longer than `pace.maxDrive`.
5. **Share out the days.** Each base gets its least days first. The rest go by ideal days and score.
6. **Fill each day.** Share the base's spots across its days. Add the district dish and its kitchen-mates for Eat.
   Pick the best-matching experiences for Try, respecting `months`, `when` (one morning and one evening slot) and hours.
7. **Cost it.** Rooms × nights + food + local costs + transfers (`perKm`) + chosen experiences, for each style.
   Pick the highest style that fits the budget, or say how far over it is.

Drive time (Phase 1): straight-line distance × a road factor at an average speed, by the kind of road. Coast to
coast: × 1.2 at 45 km/h. Coast up into the hills: × 1.4 at 36 km/h. Hill to hill: × 1.55 at 30 km/h. Checked:
Kochi→Alappuzha 1½ h (real: about 1½–2 h), Kochi→Thiruvananthapuram 4½ h (real: about 5 h), Kochi→Munnar 3½–4½ h
(real: about 4 h), Munnar→Thekkady 3 h (real: about 3½ h), Kozhikode→Wayanad 2½ h (real: about 2½ h). That's good
enough to rank routes, and the site always says "about", but Phase 2 replaces it with a real road matrix.

Built so far (`kerala-trip` branch): steps 1–7 in `js/planner.js`, with two additions found while testing. Towns are
only picked if they're within the pace's longest drive of the airport or a town already chosen, and a drive that's
still too long gets a town in between where the days allow. Interests already covered by a chosen town count for
less, so a "hills + backwaters" week gets both. Event places (snake boat races, Pooram, Theyyam, Kalpathy, Sabarimala)
only appear in their months (`seasonal` in `plan.js`). Long drives on the first or last day suggest a nearer airport.

**Edits.** Each edit changes only part of the plan, then re-runs steps 5–7:

| Edit | What it does |
|---|---|
| Swap a town | Replace one base with an alternative that scores well nearby |
| ± a night | Move a day to or from a neighbouring base |
| Less driving | Drop the base whose removal saves the most km, and give its days to its neighbours |
| Make it cheaper | Step the style down, and swap priced experiences for free ones |
| Add a beach day / Make it family-friendly | Boost the interest or filter experiences (no 8 h treks, no toddy shops), then rebuild from step 3 |
| Add to Day N | Pin an experience or dish to a day. Pins survive rebuilds while their base is still in the plan |

Tests: `node --test scripts/planner.test.mjs` (no dependencies). Every base is reachable, legs respect the pace,
days add up, the cost is right for a fixed input, and no unknown ids come out.

### Pages and changes in `app.js`

- **`/plan`**: the hero form (days, arriving at / leaving from, party, budget band (₹20–40k / 40–80k / 80k+ per
  person), interests, pace, month). The "fits" check compares against the top of the band.
  "Build my journey" leads to the itinerary: a route map (the existing `mapSvg` with numbered pins and route lines drawn
  with `project()`), a day list with See / Eat / Try / Collect, a budget bar, edit buttons, share, and print.
  `/plan?p=…` opens a shared, read-only plan with a "Use this plan" button.
- **`/do`**: experiences grouped north → south, with kind filters and **Add to Day N** (days in that town listed first).
- **Collect:** a `Done` store (`place:…`, `dish:…`, `taste:…`, `xp:…`) with ✓ ticks on plan days, `/do` cards and dish pages.
- **Passport dialog:** a stats row (districts · places · food n/≈45 · experiences · km) and a food trail checklist.
- **Stamps** stay "visited in the tour" for now. Real-world check-ins can add a second kind later (Phase 3).
- **`/trip` folds into `/plan`:** the ♡ saved places become a "Want to see" list on `/plan` and feed `mustSee`.
  `/trip` and `/trip?s=…` redirect to `/plan` so old share links still work. The `kerala-journey:saved` store is unchanged.
- **Links between sections:** "Want to see" feeds `mustSee`. The district Plan sheet gets "Things to do here"
  and "Plan a trip with {district}". The home page gets a "Plan my trip" button next to "Begin in the north".
- **Nav:** Plan first, Experiences after Food, and Journeys replacing My trip. Check that the header still fits on a phone.
- **Plumbing:** `meta.js` titles for `/plan`, `/do` and `/journeys`, routes in `scripts/build-pages.mjs`, and English strings in `i18n.js`
  (Malayalam falls back to English until someone translates it).

- **`/journeys`**: a list of trips taken, each with dates and a route map. Opening one shows its days, and each day
  lets the traveller write notes, add photos, and give a place, dish or experience 1–5 stars and a short review.
  "Start a journey from this plan" copies the plan's days in. Journeys are private and only on this device until Phase 3.

Storage: `kerala-journey:plan` (inputs + edits + pins), `kerala-journey:done` and `kerala-journey:journeys`
(text, ratings, reviews), all in localStorage and wrapped in try/catch like the existing stores. Photos are too big
for localStorage: they're resized in the browser (longest side about 1600 px, JPEG) and kept in IndexedDB, with a
warning that clearing site data deletes them until they sync.

---

## Phase 2: AI on top of the engine (one Vercel function + one API key)

**`POST /api/plan-from-text`**: *"Couple, 6 days, landing in Kochi, ₹60k, max 3 hours driving, love nature and food."*

1. Claude (a small, fast model such as Haiku 4.5) is called with a **tool whose schema is the planner inputs**.
   Enums come from `plan.js` (bases, interests, gateways), so it can only answer with real ids.
2. The server validates the result, fills defaults, and returns the inputs. **The browser runs `buildPlan`**,
   so the same engine and the same result come out whether the form or the text was used.
3. **`POST /api/explain`** (optional, streamed): given the finished plan JSON, a larger model (Sonnet 5) writes a short
   "why this route" paragraph and one line per day. It is told to use only facts from the JSON.

Guardrails: a length cap on input, per-IP rate limiting (Vercel KV or Upstash), `max_tokens` caps, no user data stored,
and a fallback to the form if anything fails. Log inputs, outputs, latency and cost per request (observability).

Replacing the estimates, still with no runtime keys:
- **Drive times:** precompute a 21×21 base/gateway matrix once with OpenRouteService or OSRM, and save it as
  `js/data/drive.js` at build time. The haversine estimate stays as the fallback.
- **Weather:** Open-Meteo (free, no key) for trips starting within about 14 days. Otherwise the existing monthly climate data.

## Phase 3: accounts and journeys

- **Supabase** (Postgres + auth + storage, with a free tier) is the suggested choice. Magic-link or Google sign-in.
- Tables: `plans` (inputs, edits, pins, share slug), `journeys` (dates, days, notes, share slug), `checkins` (item key,
  date, note, lat/lon?), `reviews` (item key, stars, text, public?), `photos` (storage path).
- **Public reviews.** A traveller can choose to publish a review. Published reviews then appear on place, dish and
  `/do` cards, after a report button, basic moderation and a privacy policy are in place. Before that, reviews stay private.
  Row-level security: only the owner can read or write, and a public share slug is read-only.
- Local-first: on the first sign-in, upload the localStorage plan and ticks, then keep them in sync.
- While travelling: mark visited, add a note, add a photo. **GPS check-in** (the stamp only counts when you're within
  about 2 km) is optional, per item, and never required.

## Phase 4: "My Kerala Journey"

A public page `/j/<slug>` with the route map, stamps, dishes and photos, plus a generated share image (`@vercel/og`),
so a WhatsApp or Instagram link shows the route and the counts.

## Phase 5: the business layer (only with verified partners)

A `providers` table (houseboats, guides, cooking classes) with a verified flag and a last-checked date, the same rule as
the food stops. "Check availability" → a lead form → the partner by email or WhatsApp, and lead tracking. Take a
referral fee before trying real bookings. Nothing appears publicly until a partner is verified.

---

## Not doing

More animations, more destination cards, a generic chatbot, or pages of articles. None of them make the product better.

## Needs a person

- Checking prices, closures and seasons in `doings.js` and `plan.js` costs, and the extra food tastes, before launch.
- Malayalam for the new interface strings.
- Choosing and paying for Phase 2–3 services (an Anthropic API key, Supabase), and deciding the privacy policy
  before any accounts or photos are stored.
- Written permission if Kerala Tourism content is ever used.

## Decisions (2026-09-24)

1. **Budget input uses bands:** ₹20–40k / 40–80k / 80k+.
2. **District stamps stay "visited in the tour" for now.** "Visited for real" can come later with check-ins.
3. **`/plan` is for future trips, and saved places fold into it.** Trips already taken, with their experiences,
   photos and reviews, get their own section: `/journeys`.
