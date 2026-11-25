import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Building2, CalendarDays, MapPin, Plane } from "lucide-react";
import { photos, type PhotoId } from "@/lib/experience.ts";
import { districtById, districts, isDistrictId, type District } from "@/lib/districts.ts";
import { everydayIn, festivalsIn, monthSlug, nearestDistrictAirport, placesIn, regionPhotos, spicesIn } from "@/lib/explore.ts";
import { months } from "@/lib/keralaData.ts";
import { DetailHero, HeroChip } from "@/components/explore/DetailHero";
import { DistrictMap } from "@/components/explore/DistrictMap";
import { EverydayCard } from "@/components/explore/Everyday";
import { PlaceCard } from "@/components/explore/PlaceCard";
import { DetailHeading, PrevNext } from "@/components/explore/PrevNext";
import { SourceLinks } from "@/components/SourceLinks";

export const dynamicParams = false;

export function generateStaticParams() {
  return districts.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: PageProps<"/districts/[id]">): Promise<Metadata> {
  const { id } = await params;
  if (!isDistrictId(id)) return {};
  const d = districtById[id];
  return { title: `${d.name} district`, description: `${d.character} ${d.about.split(". ")[0]}.` };
}

/** Photos for districts without a planner base: Kalamandalam is in Thrissur. */
const extraPhotos: Partial<Record<District["id"], PhotoId>> = { thrissur: "kathakali" };
const partTint: Record<District["part"], string> = { Malabar: "#7a3b1f", Central: "#1f4d3a", Travancore: "#2e5d74" };

export default async function DistrictPage({ params }: PageProps<"/districts/[id]">) {
  const { id } = await params;
  if (!isDistrictId(id)) notFound();
  const d = districtById[id];
  const places = placesIn(id);
  const photoId = extraPhotos[id] ?? places.map((p) => regionPhotos[p.id][0]).find(Boolean);
  const things = everydayIn(id);
  const spices = spicesIn(id);
  const festivals = festivalsIn(id);
  const airport = nearestDistrictAirport(id);
  const i = districts.indexOf(d);
  const north = districts[(i + districts.length - 1) % districts.length];
  const south = districts[(i + 1) % districts.length];

  return (
    <>
      <DetailHero
        photo={photoId ? photos[photoId] : undefined}
        tint={partTint[d.part]}
        crumbs={[{ href: "/districts", label: "Districts" }]}
        eyebrow={<><span lang="ml" className="font-ml normal-case tracking-normal">{d.ml}</span> · {d.part === "Central" ? "Central Kerala" : d.part}</>}
        title={d.name}
        lede={d.character}
        art={!photoId && (
          <span lang="ml" className="absolute -right-6 bottom-6 select-none font-ml text-[9rem] font-semibold leading-none text-white/10 sm:text-[14rem]">{d.ml}</span>
        )}
      >
        <HeroChip><Building2 size={14} aria-hidden /> HQ: {d.hq}</HeroChip>
        <HeroChip><Plane size={14} aria-hidden /> {airport.name} airport ({airport.code}), ~{airport.km} km as the crow flies</HeroChip>
        <HeroChip><MapPin size={14} aria-hidden /> {places.length ? `${places.length} trip-planner base${places.length > 1 ? "s" : ""}` : "Off the tourist trail"}</HeroChip>
      </DetailHero>

      <main className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 sm:py-20">
        <section className="grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <div>
            <DetailHeading eyebrow="The district" title={`What ${d.name} is like`} />
            <p className="font-serif text-xl leading-relaxed text-ink-700">{d.about}</p>
            <SourceLinks sources={d.sources} className="mt-4" />
            {(spices.length > 0 || festivals.length > 0) && (
              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                {spices.length > 0 && (
                  <div className="glass organic p-5">
                    <dt className="text-sm font-semibold text-ink-900">Grown here</dt>
                    <dd className="mt-3 flex flex-wrap gap-2">
                      {spices.map((s) => (
                        <Link key={s.id} href={`/spices/${s.id}`} className="flex items-center gap-2 rounded-full bg-sand-50 px-3 py-1 text-sm text-ink-700 ring-1 ring-sand-200 hover:text-ink-900 hover:ring-forest-600">
                          <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: `radial-gradient(circle at 35% 35%, ${s.color[1]}, ${s.color[0]})` }} />
                          {s.name}
                        </Link>
                      ))}
                    </dd>
                  </div>
                )}
                {festivals.length > 0 && (
                  <div className="glass organic p-5">
                    <dt className="text-sm font-semibold text-ink-900">Festivals</dt>
                    <dd className="mt-3 space-y-1.5">
                      {festivals.map(({ festival, month }) => (
                        <Link key={festival.name} href={`/months/${monthSlug(month)}`} className="flex items-center gap-2 text-sm text-ink-700 hover:text-ink-900">
                          <CalendarDays size={14} className="mood-accent shrink-0" aria-hidden />
                          <span><b className="font-semibold">{festival.name}</b> · {months[month].name}</span>
                        </Link>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </div>
          <DistrictMap active={id} />
        </section>

        {things.length > 0 && (
          <section aria-labelledby="everyday">
            <DetailHeading id="everyday" eyebrow="Everyday Kerala" title={`Do what people in ${d.name} do`}>
              Not sights: ordinary things locals do, and how to join in without feeling like a tourist.
            </DetailHeading>
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {things.map((e) => <li key={e.id}><EverydayCard item={e} showDistrict={false} /></li>)}
            </ul>
          </section>
        )}

        {places.length > 0 && (
          <section aria-labelledby="bases">
            <DetailHeading id="bases" eyebrow="Stay here" title={places.length > 1 ? "Trip-planner bases in this district" : "The trip-planner base in this district"} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((p) => <PlaceCard key={p.id} region={p} />)}
            </div>
          </section>
        )}

        <Link href="/everyday" className="glass group flex flex-wrap items-center justify-between gap-3 organic px-6 py-5">
          <span>
            <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Anywhere in Kerala</span>
            <span className="block font-serif text-xl font-semibold text-forest-900">Tea shops, ferries, toddy shops and more: everyday Kerala</span>
          </span>
          <ArrowRight size={20} className="mood-accent transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>

        <PrevNext
          label="Neighbouring districts"
          prev={{ href: `/districts/${north.id}`, label: north.name, sub: i === 0 ? "back to the south" : "to the north" }}
          next={{ href: `/districts/${south.id}`, label: south.name, sub: i === districts.length - 1 ? "back to the north" : "to the south" }}
        />
      </main>
    </>
  );
}
