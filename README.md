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
- **Passport:** each district you visit stamps your passport. The stamps are saved in the visitor's browser.
- **Food trail:** a signature dish is the last stop in every district, with famous places to eat nearby.
- **Guide** (`#/guide`): must-visit places and the food trail, listed by district.
- **Works on every screen:** phones in either orientation, tablets, laptops and large monitors.
  Touch screens get pinch-to-zoom and double-tap on photos. On the map, tap once to preview a district and tap again to travel.

## Run it

```sh
npm start          # http://localhost:5173
```

No build step and no dependencies. Opening `index.html` directly from disk also works.

### Keyboard

| Key | Action |
| --- | --- |
| ← / → | previous / next view (continues into the next place and district) |
| N / P | next / previous district |
| H | hide the panels ("Just look") |
| M or Esc | back to the map |
| Drag · scroll · double-click | look around · zoom |

## Project layout

```
index.html
css/styles.css
js/app.js                     views, routing, look-around viewer, passport
js/data/districts.js          ← CONTENT: districts, places, stories, sensory notes, must-visit flags
js/data/food.js               ← CONTENT: signature dish per district + food stops
js/data/config.js             site settings (where "Report a problem" links go)
js/data/media.js              generated: photo list + credits + coordinates
js/data/media-overrides.js    hand-picked photos (e.g. ones you have permission for)
js/data/map.js                generated: SVG district paths
assets/img/<district>/        downloaded photos (1920px + 500px thumbnails)
scripts/fetch-media.mjs       downloads photos from Wikimedia Commons
scripts/optimize-images.py    recompresses photos (progressive JPEG)
scripts/build-map.mjs         builds map.js from data-src/kerala-districts.geojson
scripts/serve.mjs             tiny local server
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
  or add `?preview` to the URL (e.g. `https://kerala-tourism-vert.vercel.app/?preview#/guide/food`).
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

- Ambient sound per place (waves, chenda, rain on a tiled roof), with a mute toggle
- True 360° panoramas where Commons has them
- Season guide: monsoon vs. winter, festival calendar (Onam, Pooram, boat races)
- A "plan my trip" list built from the places a visitor liked
- An automatic weekly "is this shop still open?" check (Google Places API), put on hold for now
- Malayalam language toggle
