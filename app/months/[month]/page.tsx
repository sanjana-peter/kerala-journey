import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Backpack, CalendarX, CloudRain, Sparkles, Thermometer } from "lucide-react";
import { climateSource, photos, seasons } from "@/lib/experience.ts";
import { closedIn, monthIndex, monthSlug } from "@/lib/explore.ts";
import { months, packing } from "@/lib/keralaData.ts";
import { DetailHero, HeroChip } from "@/components/explore/DetailHero";
import { DetailHeading, PrevNext } from "@/components/explore/PrevNext";
import { PlanMonthButton } from "@/components/explore/TripActions";
import { SourceLinks } from "@/components/SourceLinks";
import { cx } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return months.map((_, i) => ({ month: monthSlug(i) }));
}

export async function generateMetadata({ params }: PageProps<"/months/[month]">): Promise<Metadata> {
  const m = monthIndex((await params).month);
  return m < 0 ? {} : { title: `Kerala in ${months[m].name}`, description: `${months[m].note} Weather, festivals and what's closed in ${months[m].name}.` };
}

const MAX_RAIN = Math.max(...seasons.map((s) => s.rainMm));

export default async function MonthPage({ params }: PageProps<"/months/[month]">) {
  const m = monthIndex((await params).month);
  if (m < 0) notFound();
  const month = months[m];
  const season = seasons[m];
  const closed = closedIn(m);
  const prev = (m + 11) % 12;
  const next = (m + 1) % 12;

  return (
    <>
      <DetailHero
        photo={photos[season.photo]}
        tint={season.tint}
        crumbs={[{ href: "/#seasons", label: "Seasons" }]}
        eyebrow={season.mood}
        title={month.name}
        lede={month.note}
        actions={<PlanMonthButton month={m} />}
      >
        <HeroChip><CloudRain size={14} aria-hidden /> ~{season.rainMm} mm of rain in Kochi</HeroChip>
        <HeroChip><Thermometer size={14} aria-hidden /> Highs around {season.highC} °C</HeroChip>
      </DetailHero>

      <main className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 sm:py-20">
        <section>
          <DetailHeading eyebrow="What's on" title={`Festivals in ${month.name}`} />
          <ul className="grid gap-4 md:grid-cols-2">
            {season.festivals.map((f) => (
              <li key={f.name} className="glass organic p-5">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500"><Sparkles size={13} className="mood-accent" aria-hidden /> {f.where}</p>
                <h3 className="mt-1 text-xl font-semibold text-ink-900">{f.name}</h3>
                <p className="mt-2 leading-relaxed text-ink-700">{f.what}</p>
                <SourceLinks sources={f.sources} className="mt-3" />
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="glass organic p-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-forest-900"><CalendarX size={22} className="text-clay-600" aria-hidden /> Closed or off-season</h2>
            {closed.length === 0 ? (
              <p className="mt-3 text-ink-700">Nothing the planner knows of is closed in {month.name}. Check opening days locally, as always.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {closed.map((c) => (
                  <li key={c.name}>
                    <p className="font-semibold text-ink-900">
                      {c.name} · <Link href={`/places/${c.region.id}`} className="mood-accent hover:underline">{c.region.name}</Link>
                    </p>
                    <p className="text-sm leading-relaxed text-ink-500">{c.note}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="glass organic p-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-forest-900"><Backpack size={22} className="mood-accent" aria-hidden /> Pack for {month.name}</h2>
            <ul className="mt-4 space-y-2">
              {packing.climate[month.climate].map((p) => <li key={p} className="flex gap-2 text-ink-700"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mood-accent" />{p}</li>)}
            </ul>
            <p className="mt-4 text-sm text-ink-500">On top of the basics for any trip, which your dossier lists.</p>
          </div>
        </section>

        {/* The year at a glance: each bar opens its month */}
        <section className="glass organic p-5 sm:p-6">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-semibold text-ink-900">Average monthly rainfall in Kochi (mm)</h2>
            <span className="text-xs text-ink-500">IMD normals, 1991–2020</span>
          </div>
          <ol className="flex h-36 items-end gap-1 border-b border-sand-300 sm:gap-2">
            {seasons.map((s, i) => (
              <li key={i} className="flex h-full flex-1">
                <Link
                  href={`/months/${monthSlug(i)}`}
                  aria-current={i === m ? "page" : undefined}
                  aria-label={`${months[i].name}, about ${s.rainMm} mm of rain`}
                  className="group flex h-full w-full items-end justify-center"
                >
                  <span
                    className={cx("block w-full max-w-9 rounded-t-[4px] transition-opacity group-hover:opacity-80", i === m ? "bg-[#2e5d74]" : "bg-[#9dbccc]")}
                    style={{ height: `${Math.max(2, (s.rainMm / MAX_RAIN) * 100)}%` }}
                  />
                </Link>
              </li>
            ))}
          </ol>
          <div className="mt-2 flex gap-1 sm:gap-2" aria-hidden>
            {months.map((mo, i) => (
              <span key={mo.short} className={cx("flex-1 text-center text-[0.7rem] font-medium", i === m ? "text-ink-900" : "text-ink-400")}>
                <span className="sm:hidden">{mo.short[0]}</span><span className="hidden sm:inline">{mo.short}</span>
              </span>
            ))}
          </div>
          <SourceLinks sources={climateSource} className="mt-3" />
        </section>

        <PrevNext
          label="Other months"
          prev={{ href: `/months/${monthSlug(prev)}`, label: months[prev].name }}
          next={{ href: `/months/${monthSlug(next)}`, label: months[next].name }}
        />
      </main>
    </>
  );
}
