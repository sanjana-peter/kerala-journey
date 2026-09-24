// Downloads freely-licensed photos from Wikimedia Commons for every spot in
// js/data/districts.js, and writes js/data/media.js with credits + coordinates.
//
//   node scripts/fetch-media.mjs            fetch spots that have no photos yet
//   node scripts/fetch-media.mjs --force    refetch everything
//   node scripts/fetch-media.mjs idukki     only one district
//   node scripts/fetch-media.mjs pathanamthitta/gavi   refetch one place
//
// Manual overrides (e.g. photos you have permission to use from another source)
// go in js/data/media-overrides.js and are merged in by the site at runtime.

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const UA = "KeralaJourney/0.1 (educational tourism site; contact: site owner)";
const PER_SPOT = 4;
const FULL_W = 1920;
const THUMB_W = 500;
const OK_LICENSE = /^(cc[- ]by(-sa)?[- ][0-9.]+|cc0|public domain|pd)/i;
const BAD_TITLE = /(map|logo|sign|board|ticket|poster|plaque|notice|diagram|flag|seal|emblem|screenshot|stamp|inscription|document|chart|bus stand|guest ?house|tomb|gate|welcome|entrance|hotel|resort)/i;

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.find((a) => !a.startsWith("--"));

const ctx = { window: {} };
vm.runInNewContext(
  ["districts.js", "food.js"].map((f) => fs.readFileSync(path.join(ROOT, "js/data", f), "utf8")).join(";\n"),
  ctx
);
const DISTRICTS = ctx.window.KERALA_DISTRICTS;

const mediaFile = path.join(ROOT, "js/data/media.js");
let media = {};
if (fs.existsSync(mediaFile)) {
  const c = { window: {} };
  vm.runInNewContext(fs.readFileSync(mediaFile, "utf8"), c);
  media = c.window.KERALA_MEDIA || {};
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(host, params) {
  const url = `https://${host}/w/api.php?` + new URLSearchParams({ format: "json", formatversion: "2", ...params });
  for (let i = 0; i < 4; i++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok) return res.json();
    // 429 = rate limited; honour Retry-After when given.
    const wait = +res.headers.get("retry-after") || 2 * (i + 1);
    await sleep(wait * 1000);
  }
  throw new Error("API failed: " + url);
}

const IMAGE_PROPS = {
  prop: "imageinfo",
  iiprop: "url|size|mime|extmetadata",
  iiextmetadatafilter: "LicenseShortName|LicenseUrl|Artist|Categories|ImageDescription",
  iiurlwidth: String(FULL_W),
};

async function fromCategory(cat) {
  const j = await api("commons.wikimedia.org", {
    action: "query",
    generator: "categorymembers",
    gcmtitle: "Category:" + cat,
    gcmtype: "file",
    gcmlimit: "150",
    ...IMAGE_PROPS,
  });
  return j.query?.pages || [];
}

async function fromSearch(q) {
  const j = await api("commons.wikimedia.org", {
    action: "query",
    generator: "search",
    gsrsearch: `${q} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "40",
    ...IMAGE_PROPS,
  });
  return j.query?.pages || [];
}

const strip = (html = "") => html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

function candidate(p, exclude = [], { minWidth = 1600, minRatio = 1.25 } = {}) {
  const ii = p.imageinfo?.[0];
  if (!ii || ii.mime !== "image/jpeg") return null;
  if (exclude.some((x) => p.title.toLowerCase().includes(x.toLowerCase()))) return null;
  const m = ii.extmetadata || {};
  const license = m.LicenseShortName?.value || "";
  if (!OK_LICENSE.test(license)) return null;
  if (BAD_TITLE.test(p.title)) return null;
  const ratio = ii.width / ii.height;
  if (ii.width < minWidth || ratio < minRatio || ratio > 3.6) return null;
  const cats = m.Categories?.value || "";
  let score = Math.min(ii.width, 6000) / 1000;
  if (/Featured pictures/i.test(cats)) score += 6;
  if (/Quality images/i.test(cats)) score += 4;
  if (/Valued images/i.test(cats)) score += 2;
  if (/Wiki Loves (Monuments|Earth)/i.test(cats)) score += 0.5;
  return {
    title: p.title.replace(/^File:/, "").replace(/\.jpe?g$/i, ""),
    thumbUrl: ii.thumburl?.split("?")[0],
    w: ii.thumbwidth,
    h: ii.thumbheight,
    author: strip(m.Artist?.value) || "Unknown",
    license,
    licenseUrl: m.LicenseUrl?.value || "",
    source: ii.descriptionurl,
    score,
  };
}

// Best-scoring photos, but avoid numbered series ("Kappad 1", "Kappad 2"...) and
// prefer different photographers so each place shows several angles.
const stem = (t) => t.toLowerCase().replace(/[0-9_().,\-]+/g, " ").replace(/\s+/g, " ").trim();
function pickVaried(cands) {
  const sorted = cands.sort((a, b) => b.score - a.score);
  const picks = [];
  const stems = new Set();
  for (const maxPerAuthor of [1, 2]) {
    for (const c of sorted) {
      if (picks.length >= PER_SPOT) break;
      if (picks.includes(c) || stems.has(stem(c.title))) continue;
      if (picks.filter((p) => p.author === c.author).length >= maxPerAuthor) continue;
      picks.push(c);
      stems.add(stem(c.title));
    }
  }
  return picks;
}

async function coordsFor(title) {
  if (!title) return null;
  const j = await api("en.wikipedia.org", { action: "query", prop: "coordinates", titles: title, redirects: "1" });
  const c = j.query?.pages?.[0]?.coordinates?.[0];
  return c ? [+c.lat.toFixed(4), +c.lon.toFixed(4)] : null;
}

async function download(url, file) {
  if (fs.existsSync(file)) return;
  for (let i = 0; i < 4; i++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      return;
    }
    await sleep(2000 * (i + 1));
  }
  throw new Error("Download failed: " + url);
}

// Thumb URLs look like .../thumb/a/ab/Name.jpg/1920px-Name.jpg
const atWidth = (u, w) => u.replace(/\/\d+px-([^/]+)$/, `/${w}px-$1`);

async function run() {
  for (const d of DISTRICTS) {
    if (only && d.id !== only.split("/")[0]) continue;
    for (const s of d.spots) {
      const key = `${d.id}/${s.id}`;
      if (only?.includes("/") && key !== only) continue;
      if (!force && !only?.includes("/") && media[key]?.images?.length) {
        if (s.media.coords) media[key].coords = s.media.coords;
        continue;
      }
      try {
        await fetchSpot(d, s, key);
      } catch (e) {
        console.log(`${key.padEnd(40)} FAILED: ${e.message}`);
      }
    }
  }
}

async function fetchSpot(d, s, key) {
  // Clear old files so a refetch never mixes stale photos with new credits.
  const dir = path.join(ROOT, "assets/img", d.id);
  if (fs.existsSync(dir))
    for (const f of fs.readdirSync(dir)) if (f.startsWith(s.id + "-")) fs.unlinkSync(path.join(dir, f));

  const exclude = s.media.exclude || [];
  const seen = new Map();
  for (const cat of s.media.categories || []) {
    for (const p of await fromCategory(cat)) {
      const c = candidate(p, exclude, s.media);
      if (c) seen.set(c.source, c);
    }
    await sleep(300);
  }
  let picks = pickVaried([...seen.values()]);
  if (picks.length < PER_SPOT && s.media.search) {
    for (const p of await fromSearch(s.media.search)) {
      const c = candidate(p, exclude, s.media);
      if (c && !seen.has(c.source)) seen.set(c.source, { ...c, score: c.score - 3 });
    }
    picks = pickVaried([...seen.values()]);
  }

  const images = [];
  for (const [i, c] of picks.entries()) {
    const base = `assets/img/${d.id}/${s.id}-${i + 1}`;
    await download(c.thumbUrl, path.join(ROOT, base + ".jpg"));
    await download(atWidth(c.thumbUrl, THUMB_W), path.join(ROOT, base + "-t.jpg"));
    images.push({
      src: base + ".jpg",
      thumb: base + "-t.jpg",
      w: c.w,
      h: c.h,
      title: c.title,
      author: c.author,
      license: c.license,
      licenseUrl: c.licenseUrl,
      source: c.source,
    });
    await sleep(400);
  }
  const coords = s.media.coords || (await coordsFor(s.media.wiki).catch(() => null));
  media[key] = { coords, images };
  console.log(`${key.padEnd(40)} ${images.length} photos ${coords ? "📍" : "(no coords)"}`);
  write();
}

function write() {
  const sorted = Object.fromEntries(Object.entries(media).sort());
  fs.writeFileSync(
    mediaFile,
    "/* Generated by scripts/fetch-media.mjs — photos from Wikimedia Commons with credits. */\n" +
      "window.KERALA_MEDIA = " + JSON.stringify(sorted, null, 1) + ";\n"
  );
}

run().then(() => {
  write();
  writeCredits();
});

function writeCredits() {
  let md = "# Photo credits\n\nAll photographs are from [Wikimedia Commons](https://commons.wikimedia.org) and used under their free licenses.\n\n";
  for (const d of DISTRICTS) {
    md += `## ${d.name}\n\n`;
    for (const s of d.spots) {
      for (const im of media[`${d.id}/${s.id}`]?.images || []) {
        md += `- **${s.name}** — [${im.title}](${im.source}) by ${im.author}, ${im.licenseUrl ? `[${im.license}](${im.licenseUrl})` : im.license}\n`;
      }
    }
    md += "\n";
  }
  md += "Map boundaries: [geohacker/kerala](https://github.com/geohacker/kerala), derived from [DataMeet](https://datameet.org/) maps (CC BY 4.0).\n";
  fs.writeFileSync(path.join(ROOT, "CREDITS.md"), md);
}
