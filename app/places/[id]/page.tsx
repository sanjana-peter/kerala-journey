import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BedDouble, ChevronDown, Coffee, Landmark, Moon, Mountain, Plane, Sun } from "lucide-react";
import { photos } from "@/lib/experience.ts";
import { connectionsOf, districtOf, isRegionId, nearestAirport, placesInRouteOrder, regionPhotos, spicesFor, vibeOf } from "@/lib/explore.ts";
import { regions, routeOrder } from "@/lib/keralaData.ts";
import { findLeg, placeName } from "@/lib/planner.ts";
import { formatHours } from "@/lib/dossier.ts";
import { ActivityExplorer } from "@/components/explore/ActivityExplorer";
import { DetailHero, HeroChip } from "@/components/explore/DetailHero";
import { PlaceCard } from "@/components/explore/PlaceCard";
import { DetailHeading, PrevNext } from "@/components/explore/PrevNext";
import { BuildLink, PinMood, VibeToggle } from "@/components/explore/TripActions";
import { LogisticsCard } from "@/components/LogisticsCard";
import { modeIcons } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return routeOrder.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/places/[id]">): Promise<Metadata> {
  const { id } = await params;
  if (!isRegionId(id)) return {};
  const r = regions[id];
  return { title: `${r.name}: what to do, where to stay, how to get there`, description: `${r.tagline} ${r.stayTip}` };
}

export default async function PlacePage({ params }: PageProps<"/places/[id]">) {
  const { id } = await params;
  if (!isRegionId(id)) notFound();
  const r = regions[id];
  const vibe = r.vibe ? vibeOf(r.vibe) : null;
  const [hero, ...gallery] = regionPhotos[id].map((p) => photos[p]);
  const airport = nearestAirport(id);
  const district = districtOf(id);
  const spices = spicesFor(id);
  const connections = connectionsOf(id);
  const i = routeOrder.indexOf(id);
  const prev = regions[routeOrder[(i + routeOrder.length - 1) % routeOrder.length]];
  const next = regions[routeOrder[(i + 1) % routeOrder.length]];
  const sameVibe = vibe ? placesInRouteOrder.filter((p) => p.vibe === vibe.id && p.id !== id) : [];

  return (
    <>
      {r.vibe && <PinMood vibe={r.vibe} />}
      <DetailHero
        photo={hero}
        crumbs={[{ href: "/places", label: "Places" }]}
        eyebrow={r.area}
        title={r.name}
        lede={r.tagline}
        actions={vibe ? <VibeToggle vibe={vibe.id} /> : <BuildLink note={`The planner adds ${r.name} as an easy first night on longer trips.`} />}
      >
        {vibe && <HeroChip href={`/vibes/${vibe.id}`}>{vibe.name}</HeroChip>}
        <HeroChip href={`/districts/${district.id}`}><Landmark size={14} aria-hidden /> {district.name} district</HeroChip>
        <HeroChip><Moon size={14} aria-hidden /> {r.nights.relaxed[0]}–{r.nights.relaxed[1]} nights, relaxed</HeroChip>
        {r.hills && <HeroChip><Mountain size={14} aria-hidden /> Hill roads</HeroChip>}
        <HeroChip><Plane size={14} aria-hidden /> ~{airport.km} km from {airport.city} airport</HeroChip>
      </DetailHero>

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_20rem]">
          <section aria-labelledby="todo">
            <DetailHeading id="todo" eyebrow="Things to do" title={`${r.activities.length} ways to spend a day in ${r.name}`}>
              Filter by who&apos;s coming and when, to see what fits. The planner uses the same rules.
            </DetailHeading>
            <ActivityExplorer activities={r.activities} />
          </section>

          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <Fact icon={BedDouble} title="Where to stay">{r.stayTip}</Fact>
            <Fact icon={Coffee} title="A free afternoon">{r.freeTime}</Fact>
            {vibe && <Fact icon={Sun} title="Best time">{vibe.bestMonths}</Fact>}
            <Fact icon={Moon} title="How long">
              {r.nights.relaxed[0]}–{r.nights.relaxed[1]} nights at a relaxed pace, {r.nights.packed[0] === r.nights.packed[1] ? r.nights.packed[0] : `${r.nights.packed[0]}–${r.nights.packed[1]}`} if you&apos;re packing it in.
            </Fact>
            {spices.length > 0 && (
              <div className="glass organic p-5">
                <h3 className="text-sm font-semibold text-ink-900">Grown around here</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {spices.map((s) => (
                    <li key={s.id}>
                      <Link href={`/spices/${s.id}`} className="flex items-center gap-2 rounded-full bg-sand-50 px-3 py-1 text-sm text-ink-700 ring-1 ring-sand-200 hover:text-ink-900 hover:ring-forest-600">
                        <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: `radial-gradient(circle at 35% 35%, ${s.color[1]}, ${s.color[0]})` }} />
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {gallery.length > 0 && (
          <section aria-label={`More of ${r.name}`} className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((p) => (
              <figure key={p.src} className="overflow-hidden organic bg-forest-900">
                <div className="relative aspect-[4/3]"><Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover" /></div>
                <figcaption className="px-4 py-2.5 text-xs text-sand-200"><a href={p.source} target="_blank" rel="noreferrer" className="hover:text-sand-50">{p.title} · Photo: {p.credit}</a></figcaption>
              </figure>
            ))}
          </section>
        )}

        <section aria-labelledby="getting" className="mt-20">
          <DetailHeading id="getting" eyebrow="Getting around" title={`To and from ${r.name}`}>
            Every connection we have checked, nearest along the route first. Open one for cabs, buses and trains with times and fares.
          </DetailHeading>
          <ul className="space-y-3">
            {connections.map((to) => {
              const leg = findLeg(id, to);
              const best = leg.options[0];
              const Icon = modeIcons[best.mode];
              return (
                <li key={to}>
                  <details className="group">
                    <summary className="glass flex cursor-pointer list-none items-center gap-3 organic px-5 py-4 [&::-webkit-details-marker]:hidden">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-forest-50 text-forest-700"><Icon size={17} aria-hidden /></span>
                      <span className="flex-1">
                        <span className="block font-semibold text-ink-900">{placeName(to)}</span>
                        <span className="block text-sm text-ink-500">~{leg.km} km · {formatHours(best.hours)} by {best.label.toLowerCase()}</span>
                      </span>
                      <ChevronDown size={18} className="text-ink-400 transition-transform group-open:rotate-180" aria-hidden />
                    </summary>
                    <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
                      <LogisticsCard leg={leg} />
                      {to in regions && (
                        <Link href={`/places/${to}`} className="glass inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-ink-900 hover:text-forest-800">
                          Explore {placeName(to)} →
                        </Link>
                      )}
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        </section>

        {sameVibe.length > 0 && vibe && (
          <section aria-labelledby="pair" className="mt-20">
            <DetailHeading id="pair" eyebrow={vibe.name} title="Pairs well with" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sameVibe.map((p) => <PlaceCard key={p.id} region={p} />)}
            </div>
          </section>
        )}

        <div className="mt-20">
          <PrevNext
            label="Along the route"
            prev={{ href: `/places/${prev.id}`, label: prev.name, sub: "along the route" }}
            next={{ href: `/places/${next.id}`, label: next.name, sub: "along the route" }}
          />
        </div>
      </main>
    </>
  );
}

function Fact({ icon: Icon, title, children }: { icon: typeof Sun; title: string; children: React.ReactNode }) {
  return (
    <div className="glass organic p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900"><Icon size={16} className="mood-accent" aria-hidden /> {title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">{children}</p>
    </div>
  );
}
