/*
 * The travel dossier: the itinerary, transit guide and essentials as one plain-text document.
 * The modal shows it, "Download" saves it as Markdown, and the print view renders the same sections.
 */
import { emergencyContacts, essentials, gateways, months, packing, regions, vibes, type TransitOption } from "./keralaData.ts";
import { placeName, totalTravelHours, travelerLabels, type Itinerary } from "./planner.ts";
import { CHECKED_ON, type Source } from "./sources.ts";

// ─── Formatting (shared with the UI) ─────────────────────────────────────────

const inr = new Intl.NumberFormat("en-IN");

export function formatINR([lo, hi]: [number, number]): string {
  return lo === hi ? `₹${inr.format(lo)}` : `₹${inr.format(lo)}–${inr.format(hi)}`;
}

export function formatHours([lo, hi]: [number, number]): string {
  const one = (h: number) => (h < 1 ? `${Math.round(h * 60)} min` : `${+h.toFixed(1)}`);
  if (hi < 1) return `${one(lo)}–${one(hi)}`.replace(" min–", "–");
  return lo === hi ? `${one(lo)} h` : `${one(lo)}–${one(hi)} h`;
}

export function formatOption(o: TransitOption): string {
  return `${o.label}: ${formatHours(o.hours)}, ${formatINR(o.cost)} per ${o.per}`;
}

export function routeLine(it: Itinerary): string {
  return [gateways[it.arrival].city + " (" + it.arrival + ")", ...it.stops.map((s) => regions[s.region].name), gateways[it.departure].city + " (" + it.departure + ")"].join(" → ");
}

export function tripSummary(it: Itinerary): string {
  const { input } = it;
  const parts = [`${input.days}${input.days === 10 ? "+" : ""} days`, input.pace === "packed" ? "packed pace" : "relaxed pace", travelerLabels[input.traveler].toLowerCase()];
  if (input.month !== null) parts.push(months[input.month].name);
  return parts.join(" · ");
}

export function packingList(it: Itinerary): { title: string; items: string[] }[] {
  const { input } = it;
  const groups: { title: string; items: string[] }[] = [{ title: "Always", items: packing.always }];
  if (input.month !== null) groups.push({ title: `For ${months[input.month].name}`, items: packing.climate[months[input.month].climate] });
  const tripVibes = vibes.filter((v) => it.stops.some((s) => regions[s.region].vibe === v.id));
  for (const v of tripVibes) groups.push({ title: v.name, items: packing.vibe[v.id] });
  const extra = packing.traveler[input.traveler];
  if (extra) groups.push({ title: travelerLabels[input.traveler], items: extra });
  return groups;
}

/** Every source behind the facts in this dossier, de-duplicated. */
export function dossierSources(it: Itinerary): Source[] {
  const all: Source[] = [
    ...it.days.flatMap((d) => d.items.flatMap((a) => a.sources ?? [])),
    ...it.legs.flatMap((l) => l.sources),
    ...emergencyContacts.map((c) => c.source),
    ...essentials.flatMap((e) => e.sources ?? []),
  ];
  return all.filter((s, i) => all.findIndex((x) => x.url === s.url) === i);
}

// ─── Markdown ─────────────────────────────────────────────────────────────────

export function toMarkdown(it: Itinerary): string {
  const out: string[] = [];
  const line = (s = "") => out.push(s);
  const [roadLo, roadHi] = totalTravelHours(it);

  line("# My Kerala travel dossier");
  line();
  line(`**${tripSummary(it)}**`);
  line();
  line(`Route: ${routeLine(it)}`);
  line();
  line(`Fly in to ${gateways[it.arrival].name}; fly out of ${gateways[it.departure].name}. About ${Math.round(roadLo)}–${Math.round(roadHi)} hours on the road in total.`);

  if (it.warnings.length) {
    line();
    line("## Before you book");
    line();
    for (const w of it.warnings) line(`- ${w}`);
  }

  line();
  line("## Where you stay");
  line();
  for (const s of it.stops) {
    const r = regions[s.region];
    line(`- **${r.name}** (${r.area}): ${s.nights} night${s.nights > 1 ? "s" : ""}. ${r.stayTip}`);
  }

  line();
  line("## Day by day");
  for (const d of it.days) {
    line();
    line(`### Day ${d.day}: ${d.title}`);
    line();
    if (d.travel) {
      const o = d.travel.options[0];
      line(`- **Travel:** ${placeName(d.travel.from)} → ${placeName(d.travel.to)}, ${formatOption(o)}`);
    }
    for (const a of d.items) {
      line(`- **${a.name}** (${a.when.toLowerCase()}, ~${a.hours} h): ${a.note}`);
      if (a.cost) line(`  - Cost: ${a.cost}`);
      if (a.booking) line(`  - Booking: ${a.booking}`);
      if (a.caution) line(`  - Caution: ${a.caution}`);
    }
    if (d.note) line(`- ${d.note}`);
    if (d.base) line(`- Sleep: ${regions[d.base].name}`);
  }

  if (it.skipped.length) {
    line();
    line("## Left out, and why");
    line();
    for (const s of it.skipped) line(`- ${s.name} (${regions[s.region].name}): ${s.reason}`);
  }

  line();
  line("## Transit guide");
  for (const l of it.legs) {
    line();
    line(`### ${placeName(l.from)} → ${placeName(l.to)} (~${l.km} km)`);
    line();
    for (const o of l.options) {
      line(`- **${formatOption(o)}**`);
      line(`  - ${o.how}`);
    }
    for (const t of l.tips) line(`- Tip: ${t}`);
    if (l.estimated) line("- _Estimated from distance; confirm locally._");
  }

  line();
  line("## Emergency numbers");
  line();
  line("| Service | Number |");
  line("| --- | --- |");
  for (const c of emergencyContacts) line(`| ${c.label}${c.note ? ` (${c.note})` : ""} | ${c.number} |`);

  line();
  line("## Survival essentials");
  for (const sec of essentials) {
    line();
    line(`### ${sec.title}`);
    line();
    for (const i of sec.items) line(`- **${i.h}:** ${i.p}`);
  }

  line();
  line("## Packing");
  for (const g of packingList(it)) {
    line();
    line(`**${g.title}**`);
    line();
    for (const i of g.items) line(`- [ ] ${i}`);
  }

  line();
  line("## Sources");
  line();
  line(`Facts checked on ${CHECKED_ON}. Travel-guide sources are marked; re-check those first.`);
  line();
  for (const s of dossierSources(it)) line(`- [${s.label}](${s.url})${s.kind === "guide" ? " (travel guide)" : ""}`);

  line();
  line("---");
  line();
  line("Fares and times are 2025–26 ballpark figures, not quotes. Opening days and road conditions change, so confirm locally.");
  line();
  return out.join("\n");
}
