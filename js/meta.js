/*
 * Kerala Journey — page titles, descriptions and preview images.
 *
 * Used twice: by the site (the browser tab title) and by scripts/build-pages.mjs, which writes one HTML file
 * per page so link previews on WhatsApp, Instagram, Google etc. show the right title and photo.
 *
 * KERALA_META(pathname, window) → { title, description, image }   (image is a site-relative path or null)
 */
window.KERALA_META = function (pathname, W) {
  const D = W.KERALA_DISTRICTS || [];
  const F = W.KERALA_FOOD || [];
  const M = W.KERALA_MEDIA || {};
  const C = W.KERALA_CULTURE || { arts: [] };
  const site = "Kerala Journey";
  const p = decodeURIComponent(pathname).split("/").filter(Boolean);
  const cover = (key) => M[key]?.images?.[0]?.src || null;
  const firstImg = (d) => d.spots.map((s) => cover(`${d.id}/${s.id}`)).find(Boolean) || null;
  const short = (s = "", n = 155) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s);
  const home = {
    title: `${site}: explore Kerala district by district`,
    description:
      "Walk through all fourteen districts of Kerala before you visit: backwaters, hills, forts, festivals, food and culture, with seasons, routes and tips for planning your trip.",
    image: cover("alappuzha/houseboats"),
  };

  if (p[0] === "d") {
    const d = D.find((x) => x.id === p[1]);
    if (!d) return home;
    const s = d.spots.find((x) => x.id === p[2]);
    if (s) return { title: `${s.name}, ${d.name} · ${site}`, description: short(s.blurb), image: cover(`${d.id}/${s.id}`) || firstImg(d) };
    return { title: `${d.name}: ${d.tagline} · ${site}`, description: short(d.intro), image: firstImg(d) };
  }
  if (p[0] === "eat") {
    const f = F.find((x) => x.id === p[1]);
    if (f) return { title: `${f.name}, ${D.find((d) => d.id === f.district)?.name || "Kerala"} · ${site}`, description: short(f.blurb), image: cover(`${f.district}/${f.id}`) };
    return {
      title: `The Kerala table: food trail · ${site}`,
      description: "Fourteen districts, fourteen dishes: what Kerala eats through the day, its regional kitchens, a sadya served course by course, and where to eat.",
      image: cover("thrissur/sadya"),
    };
  }
  if (p[0] === "culture") {
    const a = C.arts.find((x) => x.id === p[1]);
    const img = (a) => cover(a.mediaKey || `culture/${a.id}`);
    if (a) return { title: `${a.name} · Kerala culture · ${site}`, description: short(a.blurb), image: img(a) };
    return {
      title: `Kerala culture: art forms, festivals and history · ${site}`,
      description: "Kathakali, Theyyam, Mohiniyattam, snake boat races and more; a festival calendar, 2,000 years of history and Malayalam phrases for travellers.",
      image: cover("ernakulam/kathakali"),
    };
  }
  if (p[0] === "essentials")
    return {
      title: `Kerala travel essentials · ${site}`,
      description: "Getting around, money, SIM cards, customs, health and safety, monsoon travel and Ayurveda, plus a packing list for your month and plans.",
      image: cover("ernakulam/fort-kochi"),
    };
  if (p[0] === "trip") return { title: `My Kerala trip · ${site}`, description: "The places and dishes saved for a trip to Kerala, district by district.", image: home.image };
  if (p[0] === "map") return { title: `Map of Kerala's fourteen districts · ${site}`, description: home.description, image: home.image };
  if (p[0] === "guide")
    return { title: `Must-visit places in Kerala · ${site}`, description: "The places you shouldn't miss in every district of Kerala, from Bekal Fort in the north to Varkala in the south.", image: cover("idukki/munnar") };
  return home;
};
