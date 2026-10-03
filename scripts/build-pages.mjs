// Builds the deployable site into dist/: a copy of the site plus one HTML file per page
// (dist/d/kannur/index.html, dist/eat/sadya/index.html …) with that page's own title, description
// and preview image, so shared links look right on WhatsApp, Instagram, Google etc.
//
//   npm run build       → dist/   (Vercel runs this automatically; see vercel.json)
//
// Titles and descriptions come from js/meta.js, the same file the site uses in the browser.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const OUT = path.join(ROOT, "dist");

const W = { window: {} };
W.window = W;
for (const f of ["data/config.js", "data/districts.js", "data/food.js", "data/culture.js", "data/plan.js", "data/doings.js", "data/media.js", "data/media-overrides.js", "meta.js"])
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js", f), "utf8"), W);
// Fold the hand-picked photos into the Commons ones (same rule as mergeMedia in js/app.js), so they
// get WebP copies and can be link-preview images. dist/ then ships the merged list with no overrides.
for (const [k, v] of Object.entries(W.KERALA_MEDIA_OVERRIDES || {})) {
  const b = W.KERALA_MEDIA[k] || { images: [] };
  W.KERALA_MEDIA[k] = { coords: v.coords || b.coords, images: v.replace ? v.images : [...(v.images || []), ...b.images] };
}
const SITE = (W.KERALA_CONFIG?.siteUrl || "").replace(/\/$/, "");

// Every page worth sharing or indexing.
const routes = ["/", "/plan", "/map", "/guide", "/eat", "/culture", "/essentials", "/trip"];
for (const d of W.KERALA_DISTRICTS) {
  routes.push(`/d/${d.id}`);
  for (const s of d.spots) routes.push(`/d/${d.id}/${s.id}`);
}
for (const f of W.KERALA_FOOD) routes.push(`/eat/${f.id}`);
for (const a of W.KERALA_CULTURE.arts) routes.push(`/culture/${a.id}`);
routes.push("/do");
for (const x of W.KERALA_DOINGS) routes.push(`/do/${x.id}`);

// Copy the site.
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);
for (const item of ["css", "js", "assets", "CREDITS.md", "LICENSE"])
  if (fs.existsSync(path.join(ROOT, item))) fs.cpSync(path.join(ROOT, item), path.join(OUT, item), { recursive: true });

const esc = (s = "") => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const template = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

let sharp = null;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.log("sharp not installed: skipping WebP copies and link-preview images (run npm install to enable them)");
}

// Link-preview images: 1200 × 630 JPEGs under 300 KB, the size WhatsApp, Facebook and X expect.
// WhatsApp often shows no picture at all for bigger files, and the site's photos are up to 2560 px.
const OG_W = 1200, OG_H = 630;
const OG_CACHE = path.join(ROOT, "node_modules/.cache/kerala-og");
async function ogImage(src) {
  if (!sharp) return src;
  const dest = "og/" + src.replace(/^assets\/img\//, "").replace(/\.\w+$/, ".jpg");
  const cached = path.join(OG_CACHE, dest);
  const from = path.join(ROOT, src);
  if (!fs.existsSync(cached) || fs.statSync(cached).mtimeMs < fs.statSync(from).mtimeMs) {
    fs.mkdirSync(path.dirname(cached), { recursive: true });
    for (const quality of [80, 70, 60]) {
      await sharp(from).resize(OG_W, OG_H, { fit: "cover", position: "attention" }).jpeg({ quality, mozjpeg: true }).toFile(cached);
      if (fs.statSync(cached).size < 300_000) break;
    }
  }
  fs.mkdirSync(path.dirname(path.join(OUT, dest)), { recursive: true });
  fs.copyFileSync(cached, path.join(OUT, dest));
  return dest;
}

for (const route of routes) {
  const m = W.KERALA_META(route, W);
  const url = SITE + (route === "/" ? "/" : route);
  const og = m.image && fs.existsSync(path.join(ROOT, m.image)) ? await ogImage(m.image) : null;
  const image = og ? `${SITE}/${og}` : "";
  const head = [
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Kerala Journey" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    image && `<meta property="og:image" content="${esc(image)}" />`,
    image && og !== m.image && `<meta property="og:image:width" content="${OG_W}" />`,
    image && og !== m.image && `<meta property="og:image:height" content="${OG_H}" />`,
    image && `<meta property="og:image:type" content="image/jpeg" />`,
    image && `<meta property="og:image:alt" content="${esc(m.title)}" />`,
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
  ]
    .filter(Boolean)
    .map((l) => "  " + l)
    .join("\n");
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(m.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(m.description)}" />`)
    .replace("</head>", `${head}\n</head>`);
  const file = route === "/" ? path.join(OUT, "index.html") : path.join(OUT, route, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

// Lighter photos: WebP copies at full size, 1280 px wide (for smaller screens) and thumbnail size.
// The site picks the right one; browsers without WebP keep using the JPEGs. Results are cached in
// node_modules/.cache so rebuilds only convert new photos. Skipped if sharp isn't installed.
if (sharp) {
  const CACHE = path.join(ROOT, "node_modules/.cache/kerala-webp");
  const jobs = [];
  const convert = async (src, dest, width, quality) => {
    const cached = path.join(CACHE, dest);
    const from = path.join(ROOT, src);
    if (!fs.existsSync(cached) || fs.statSync(cached).mtimeMs < fs.statSync(from).mtimeMs) {
      fs.mkdirSync(path.dirname(cached), { recursive: true });
      let img = sharp(from);
      if (width) img = img.resize({ width, withoutEnlargement: true });
      await img.webp({ quality, effort: 5 }).toFile(cached);
    }
    fs.mkdirSync(path.dirname(path.join(OUT, dest)), { recursive: true });
    fs.copyFileSync(cached, path.join(OUT, dest));
  };
  let saved = 0, before = 0;
  for (const entry of Object.values(W.KERALA_MEDIA)) {
    for (const im of entry.images || []) {
      if (!im.src.startsWith("assets/") || !fs.existsSync(path.join(ROOT, im.src))) continue;
      const base = im.src.replace(/\.jpe?g$/i, "");
      im.webp = `${base}.webp`;
      im.mwebp = `${base}-m.webp`;
      if (im.thumb && fs.existsSync(path.join(ROOT, im.thumb))) im.twebp = im.thumb.replace(/\.jpe?g$/i, ".webp");
      jobs.push(() => convert(im.src, im.webp, null, 74));
      jobs.push(() => convert(im.src, im.mwebp, 1280, 72));
      if (im.twebp) jobs.push(() => convert(im.thumb, im.twebp, null, 72));
      before += fs.statSync(path.join(ROOT, im.src)).size;
    }
  }
  // A few at a time, so a small build machine isn't overwhelmed.
  const queue = [...jobs];
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (queue.length) await queue.shift()();
  }));
  for (const entry of Object.values(W.KERALA_MEDIA))
    for (const im of entry.images || []) if (im.webp) saved += fs.statSync(path.join(OUT, im.webp)).size;
  // With WebP copies in place the site no longer loads the JPEGs, so leave them out of the deploy
  // (link previews use their own small JPEGs in og/).
  const keep = new Set();
  let dropped = 0;
  for (const entry of Object.values(W.KERALA_MEDIA))
    for (const im of entry.images || []) {
      if (!im.webp) continue;
      for (const f of [im.src, im.twebp && im.thumb]) {
        if (!f || keep.has(f) || !fs.existsSync(path.join(OUT, f))) continue;
        dropped += fs.statSync(path.join(OUT, f)).size;
        fs.unlinkSync(path.join(OUT, f));
      }
    }
  console.log(`Left ${(dropped / 1e6).toFixed(0)} MB of JPEGs out of dist/`);
  console.log(`WebP: ${jobs.length} files; full-size photos ${(before / 1e6).toFixed(0)} MB → ${(saved / 1e6).toFixed(0)} MB`);
}
fs.writeFileSync(
  path.join(OUT, "js/data/media.js"),
  "/* Generated by scripts/fetch-media.mjs, merged with media-overrides.js (and WebP copies added) by scripts/build-pages.mjs. */\n" +
    "window.KERALA_MEDIA = " + JSON.stringify(W.KERALA_MEDIA) + ";\n"
);
fs.writeFileSync(path.join(OUT, "js/data/media-overrides.js"), "/* Already merged into media.js by scripts/build-pages.mjs. */\nwindow.KERALA_MEDIA_OVERRIDES = {};\n");

// Sitemap and robots.txt (the trip page is personal, so it stays out of the sitemap).
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .filter((r) => r !== "/trip")
    .map((r) => `  <url><loc>${esc(SITE + (r === "/" ? "/" : r))}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`
);
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Built ${routes.length} pages into dist/ for ${SITE || "(no siteUrl set)"}`);
