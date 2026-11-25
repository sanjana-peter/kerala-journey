import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Backpack, Ear, Flower2, Wind } from "lucide-react";
import { microStories, moodOrder, moods, photos } from "@/lib/experience.ts";
import { isVibeId, vibeOf } from "@/lib/explore.ts";
import { packing, regions, vibes } from "@/lib/keralaData.ts";
import { DetailHero } from "@/components/explore/DetailHero";
import { PlaceCard } from "@/components/explore/PlaceCard";
import { DetailHeading, PrevNext } from "@/components/explore/PrevNext";
import { PinMood, VibeToggle } from "@/components/explore/TripActions";

export const dynamicParams = false;

export function generateStaticParams() {
  return vibes.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: PageProps<"/vibes/[id]">): Promise<Metadata> {
  const { id } = await params;
  if (!isVibeId(id)) return {};
  const v = vibeOf(id);
  return { title: `${v.name} in Kerala`, description: `${v.tagline} ${v.places}. Best ${v.bestMonths}` };
}

export default async function VibePage({ params }: PageProps<"/vibes/[id]">) {
  const { id } = await params;
  if (!isVibeId(id)) notFound();
  const v = vibeOf(id);
  const mood = moods[id];
  const i = moodOrder.indexOf(id);
  const prev = vibeOf(moodOrder[(i + moodOrder.length - 1) % moodOrder.length]);
  const next = vibeOf(moodOrder[(i + 1) % moodOrder.length]);

  return (
    <>
      <PinMood vibe={id} />
      <DetailHero
        photo={photos[mood.photo]}
        tint={mood.accent}
        crumbs={[{ href: "/places", label: "Explore" }]}
        eyebrow={v.places}
        title={v.name}
        lede={mood.line}
        actions={<VibeToggle vibe={id} />}
      />

      <main className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 sm:py-20">
        <section className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <blockquote className="font-serif text-2xl italic leading-relaxed text-ink-700 sm:text-3xl">“{microStories[id]}”</blockquote>
          <ul className="space-y-3" aria-label={`What ${mood.place} feels like`}>
            {[
              { icon: Ear, label: "Hear", text: mood.sense.hear },
              { icon: Flower2, label: "Smell", text: mood.sense.smell },
              { icon: Wind, label: "Feel", text: mood.sense.feel },
            ].map(({ icon: Icon, label, text }) => (
              <li key={label} className="glass flex items-center gap-4 organic px-5 py-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mood-accent text-white"><Icon size={18} aria-hidden /></span>
                <span><span className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">{label}</span><span className="text-ink-900">{text}</span></span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="honest">
          <DetailHeading id="honest" eyebrow="The honest version" title="Is it for you?" />
          <dl className="grid gap-4 md:grid-cols-3">
            {[
              { t: "Best time", d: v.bestMonths, warn: false },
              { t: "Suits", d: v.suits, warn: false },
              { t: "Skip if", d: v.skipIf, warn: true },
            ].map((x) => (
              <div key={x.t} className="glass organic p-5">
                <dt className={`text-sm font-semibold ${x.warn ? "text-clay-700" : "text-ink-900"}`}>{x.t}</dt>
                <dd className="mt-2 leading-relaxed text-ink-700">{x.d}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="where">
          <DetailHeading id="where" eyebrow="Where you'll stay" title={v.regions.length > 1 ? "The places" : "The place"}>
            {v.regions.length > 1
              ? `The planner starts with ${regions[v.regions[0]].name} and adds ${v.regions.slice(1).map((r) => regions[r].name).join(" and ")} when your days allow.`
              : `Everything here centres on ${regions[v.regions[0]].name}.`}
          </DetailHeading>
          <div className="grid gap-5 sm:grid-cols-2">
            {v.regions.map((r) => (
              <div key={r}>
                <PlaceCard region={regions[r]} />
                <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                  {regions[r].activities.slice(0, 4).map((a) => (
                    <li key={a.id} className="rounded-full bg-sand-50/80 px-3 py-1 text-ink-700 ring-1 ring-sand-200">{a.name}</li>
                  ))}
                  <li><Link href={`/places/${r}`} className="inline-block rounded-full px-3 py-1 font-semibold mood-accent hover:underline">All {regions[r].activities.length} →</Link></li>
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="pack" className="glass organic p-6 sm:p-8">
          <h2 id="pack" className="flex items-center gap-2 text-2xl font-semibold text-forest-900"><Backpack size={22} className="mood-accent" aria-hidden /> Pack for {v.name.toLowerCase()}</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {packing.vibe[id].map((p) => <li key={p} className="flex gap-2 text-ink-700"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mood-accent" />{p}</li>)}
          </ul>
          <p className="mt-4 text-sm text-ink-500">Your dossier adds the rest: basics for any trip, plus what the month and your group need.</p>
        </section>

        <PrevNext label="Other vibes" prev={{ href: `/vibes/${prev.id}`, label: prev.name }} next={{ href: `/vibes/${next.id}`, label: next.name }} />
      </main>
    </>
  );
}
