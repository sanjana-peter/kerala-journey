# Kerala Journey

An interactive walk through Kerala's fourteen districts, meant as a first look before a real trip.
There are no autoplay animations: visitors move through the state at their own pace.

- **Arrival:** a full-screen photo you can drag to look around.
- **Map:** real district boundaries. Hover or tab to preview a district, click to travel there.
- **Districts:** each one opens with a green road-sign welcome. Step in to explore its places.
  Every place has several photos you can drag and zoom, a short story, and _Hear / Taste / Feel_ notes.
  A minimap shows where each place is.
- **Journey:** keep pressing → to go photo → place → next district, from Kasaragod in the north
  down to Thiruvananthapuram.
- **Passport:** each district you visit stamps your passport. It also shows stats (districts · places seen · tastes n/41 ·
  experiences · km on journeys) and a food passport: the 14 signature dishes plus 27 local tastes to tick off. All saved in the browser.
- **Plan your visit** (the ☼ Plan button, or V, on every district): a month picker with the weather, best time to go and
  festivals for that month (remembered across districts), how to get there, suggested days that link to the places, and tips.
  The arrival board shows the road in from the previous district and a one-line summary for the chosen month.
- **Try it:** a hands-on experience in all fourteen districts: Bekal Fort's plan,
  a Kannur loom, Edakkal's carvings by torchlight, Calicut's spice routes, Nilambur teak rings, the Palakkad Gap,
  the Pooram kudamattam, a Kathakali face, the ghat road to Munnar, rubber tapping, a houseboat day, the Aranmula mirror,
  Kollam's cashews and an Attukal Pongala.
- **Sound:** seven districts have a sound button (drums, temple melam, backwater birds). It never autoplays.
- **Panorama:** seven places have a wide panorama to drag across (Bekal Fort, Banasura, Kuttanad, Munnar, Idukki, Palakkad Fort, Malampuzha).
- **Save:** ♡ any place or art form and "Want to try" any dish; they gather in **Want to see** on `/plan`, sorted north to south,
  with the season and a share link (`/plan?s=…`). Old `/trip` and `/trip?s=…` links redirect there.
- **Plan** (`/plan`): a day-by-day itinerary built from the site's own data (`js/planner.js`): route map, See / Eat / Try
  for each day, a rough budget, edits, and WhatsApp sharing. "Plan a trip with {district}" on each district's Plan sheet
  starts one around that district (`/plan?with=<district>`).
- **Things to do** (`/do`): experiences with rough hours and prices, and **Add to Day N**.
- **Collect:** ✓ ticks ("Been here?", "Tasted it?", "Done it?") on plan days, `/do` cards, dish pages and journeys.
- **Journeys** (`/journeys`): a private journal of trips taken. Start one from your plan or from scratch; each day has
  notes, photos (resized to 1600 px and kept in IndexedDB on the device) and a 1–5 star rating and review per item.
- **Food trail:** a signature dish is the last stop in every district, with famous places to eat nearby.
- **Guide** (`/guide`): must-visit places, listed by district.
- **The Kerala table** (`/eat`): a time-of-day dial for what Kerala eats when, a taste map of the five regional kitchens,
  a banana leaf you serve a sadya onto course by course, and a story page per dish (`/eat/<dish>`): how it's made
  (tap through the steps), how to eat it like a local, where to try it, and a "want to try" list saved in the browser.
- **Culture** (`/culture`): twelve art forms, rituals and festivals with their own pages, a month-by-month festival calendar
  for the whole state, a history timeline to drag through, and Malayalam phrases for travellers.
- **Essentials** (`/essentials`): getting around, money, SIMs, customs, health and safety, monsoon travel and Ayurveda,
  plus a packing list built from your month and plans.
- **Search:** the magnifier button or `/` searches places, dishes, festivals, art forms and essentials.
- **Malayalam:** the മല button switches menus and buttons to Malayalam (descriptions stay in English for now).
- **Shareable pages:** every district, place, dish and art form has its own address (`/d/kannur/theyyam`) with its own
  title and preview image. Old `#/` links still work.
- **Works on every screen:** phones in either orientation, tablets, laptops and large monitors.
  Touch screens get pinch-to-zoom and double-tap on photos. On the map, tap once to preview a district and tap again to travel.

## Run it

```sh
npm start          # http://localhost:5173
```

No build step is needed to develop: `npm start` serves the site as it is.

```sh
npm install        # once: installs sharp, used only by the build
npm run build      # → dist/: one HTML page per place for link previews, a sitemap, and WebP copies of every photo
```

Vercel runs `npm run build` on deploy and serves `dist/` (see `vercel.json`). Set the public address in
`js/data/config.js` (`siteUrl`) so previews and the sitemap point to the right place.

### Keyboard

| Key | Action |
| --- | --- |
| ← / → | previous / next view (continues into the next place and district) |
| N / P | next / previous district |
| H | hide the panels ("Just look") |
| V | plan your visit (seasons, routes, Try it) |
| / | search |
| M or Esc | back to the map |
| Drag · scroll · double-click | look around · zoom |

## Project layout

```
index.html
css/styles.css
js/app.js                     views, routing, look-around viewer, passport
js/data/districts.js          ← CONTENT: districts, places, stories, sensory notes, must-visit flags
js/data/food.js               ← CONTENT: signature dish per district, its story + food stops
js/data/table.js              ← CONTENT: meal times, regional kitchens, sadya serving order
js/data/visit.js              ← CONTENT: per district: seasons, festivals, getting there, suggested days, tips, the road in
js/data/sounds.js             ← CONTENT: district soundscapes (files in assets/audio/, credits required)
js/data/culture.js            ← CONTENT: art forms, statewide festivals, history timeline, Malayalam phrases
js/data/essentials.js         ← CONTENT: travel essentials and the packing list rules
js/data/panoramas.js          wide panoramas (files in assets/pano/, credits required)
js/experiences.js             the hands-on "Try it" experiences, one function per district
js/planner.js                 the trip planner engine (pure functions; tests: scripts/planner.test.mjs)
js/journeys.js                journeys and the passport stats (pure functions; tests: scripts/journeys.test.mjs)
js/data/plan.js               ← CONTENT: towns, airports, paces and costs for the planner
js/data/doings.js             ← CONTENT: things to do (/do), with hours, prices and months
js/i18n.js                    interface text in English and Malayalam
js/meta.js                    page titles, descriptions and preview images (site + build)
js/data/config.js             site settings (public address, where "Report a problem" links go)
js/data/media.js              generated: photo list + credits + coordinates
js/data/media-overrides.js    hand-picked photos (e.g. ones you have permission for)
js/data/map.js                generated: SVG district paths
assets/img/<district>/        downloaded photos (1920px + 500px thumbnails)
scripts/fetch-media.mjs       downloads photos from Wikimedia Commons
scripts/optimize-images.py    recompresses photos (progressive JPEG)
scripts/build-map.mjs         builds map.js from data-src/kerala-districts.geojson
scripts/serve.mjs             tiny local server
scripts/build-pages.mjs       builds dist/ for deployment
vercel.json                   deploy settings (build, rewrites, caching)
CREDITS.md                    generated: every photo's author and license
```

## Adding a place

1. Add a spot to its district in `js/data/districts.js`. Copy an existing one: `id`, `name`, `blurb`,
   `senses`, and a `media` block naming Commons categories, a search phrase and a Wikipedia title.
2. Run `npm run media`. It fetches only spots that have no photos yet.
   - `npm run media -- idukki` fetches only that district.
   - `npm run media -- idukki/munnar` refetches one place.
   - `npm run media -- --force` refetches everything.
3. Run `npm run optimize` to recompress new photos. This needs Python with Pillow.
4. Reload the page.

If a photo is a poor fit, add part of its Commons title to that spot's `media.exclude` list
(`CREDITS.md` lists every title) and refetch the place. The picker prefers featured and quality-rated
images, avoids numbered near-duplicates, and mixes photographers.

## Food stops

Food stops live in `js/data/food.js`. Each one has an area, what to order, price, veg/non-veg,
an Instagram handle and a `lastChecked` date. The site links to the shop's Instagram and a Google Maps search;
we never copy its photos.

- New stops start as `verified: false`. They're **hidden on the public site** and only show when you run it locally
  or add `?preview` to the URL (e.g. `https://kerala-tourism-vert.vercel.app/?preview#/eat`).
- To publish a stop, check that it's open, confirm the official Instagram handle (never guess one),
  then set `verified: true` and `lastChecked: "YYYY-MM-DD"`.
- Every stop has a **Report a problem** link, and districts without stops show **Suggest one**.
  Both open a GitHub issue by default; change `reportUrl` in `js/data/config.js` to use a Google Form instead.
- Re-check every few months. The site shows visitors the "last verified" date.

## Photos and licensing

Every photo is from [Wikimedia Commons](https://commons.wikimedia.org) under CC BY, CC BY-SA, CC0 or public domain.
The site shows the title, author and license on each photo, and notes that it was resized.
`CREDITS.md` lists all of them.
**Keep those credits if you deploy the site.** CC BY-SA and CC BY require them.

Photos from **Kerala Tourism** (keralatourism.org) are copyrighted by the Department of Tourism, Government of Kerala.
Crediting them isn't enough; you need their written permission. If they give it, put those images in
`js/data/media-overrides.js` with a credit line and they'll appear first for that place.

District boundaries: [geohacker/kerala](https://github.com/geohacker/kerala), derived from [DataMeet](https://datameet.org/) (CC BY 4.0).

## Ideas for next steps

- Sounds for the other seven districts: Commons has few Kerala recordings, so record your own (waves, rain on a tiled roof, a ferry) and add them to sounds.js
- True 360° panoramas: Commons has none of Kerala yet, so these would need to be shot
- Translate the descriptions into Malayalam (the interface is done; see js/i18n.js)
- Use the site offline on the road
- An automatic weekly "is this shop still open?" check (Google Places API), put on hold for now
