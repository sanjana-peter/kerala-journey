import Link from "next/link";
import type { Metadata } from "next";
import { photos } from "@/lib/experience.ts";
import { monthSlug, placesInRouteOrder } from "@/lib/explore.ts";
import { months, vibes } from "@/lib/keralaData.ts";
import { DetailHero } from "@/components/explore/DetailHero";
import { PlaceCard } from "@/components/explore/PlaceCard";
import { DetailHeading } from "@/components/explore/PrevNext";

export const metadata: Metadata = {
  title: "Places",
  description: "Every stop a Kerala trip can make, north to south: what to do, where to stay and how to get between them.",
};

/** The way in to the deep-dive pages: every place, then the vibes and months to browse by. */
export default function PlacesIndex() {
  return (
    <>
      <DetailHero
        photo={photos["kuttanad-paddy"]}
        crumbs={[]}
        eyebrow="Explore Kerala"
        title="Every stop, up close"
        lede="Eight bases, from Wayanad's coffee hills in the north to Kovalam's beaches in the south. Open one to see what's there."
      />
      <main className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 sm:py-20">
        <section aria-labelledby="places">
          <DetailHeading id="places" eyebrow="North to south" title="The places">
            In the order a route visits them, so a trip never doubles back.
          </DetailHeading>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {placesInRouteOrder.map((r) => <PlaceCard key={r.id} region={r} />)}
          </div>
        </section>

        <section aria-labelledby="by-vibe">
          <DetailHeading id="by-vibe" eyebrow="Or start from a feeling" title="By vibe" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {vibes.map((v) => (
              <li key={v.id}>
                <Link href={`/vibes/${v.id}`} className="glass block h-full organic p-5 transition-transform hover:-translate-y-0.5">
                  <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">{v.places}</span>
                  <span className="mt-1 block font-serif text-xl font-semibold text-forest-900">{v.name}</span>
                  <span className="mt-1 block text-sm text-ink-700">{v.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="by-district">
          <DetailHeading id="by-district" eyebrow="Or see all of it" title="By district">
            All 14 districts, including the ones tours skip, and the everyday things people do there.
          </DetailHeading>
          <div className="flex flex-wrap gap-3">
            <Link href="/districts" className="rounded-full bg-forest-900 px-5 py-2.5 text-sm font-semibold text-sand-50 hover:bg-forest-800">All 14 districts →</Link>
            <Link href="/everyday" className="glass rounded-full px-5 py-2.5 text-sm font-semibold text-ink-900">Everyday Kerala →</Link>
          </div>
        </section>

        <section aria-labelledby="by-month">
          <DetailHeading id="by-month" eyebrow="Or start from a date" title="By month">
            Weather, festivals and what&apos;s closed, month by month.
          </DetailHeading>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {months.map((m, i) => (
              <li key={m.name}>
                <Link href={`/months/${monthSlug(i)}`} className="glass block organic px-4 py-3 text-center font-semibold text-ink-900 transition-transform hover:-translate-y-0.5">
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
