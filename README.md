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
js/data/districts.js          ← CONTENT: districts, places, stories, sensory notes
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

## Photos and licensing

Every photo is from [Wikimedia Commons](https://commons.wikimedia.org) under CC BY, CC BY-SA, CC0 or public domain.
The site shows the author and license on each photo, and `CREDITS.md` lists all of them.
**Keep those credits if you deploy the site.** CC BY-SA and CC BY require them.

Photos from **Kerala Tourism** (keralatourism.org) are copyrighted by the Department of Tourism, Government of Kerala.
Crediting them isn't enough; you need their written permission. If they give it, put those images in
`js/data/media-overrides.js` with a credit line and they'll appear first for that place.

District boundaries: [geohacker/kerala](https://github.com/geohacker/kerala), derived from [DataMeet](https://datameet.org/) (CC BY 4.0).

## Ideas for next steps

- Ambient sound per place (waves, chenda, rain on a tiled roof), with a mute toggle
- True 360° panoramas where Commons has them
- Season guide: monsoon vs. winter, festival calendar (Onam, Pooram, boat races)
- Food trail and a "plan my trip" list built from the places a visitor liked
- Malayalam language toggle
