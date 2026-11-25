import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Flame, MapPin, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { spices } from "@/lib/experience.ts";
import { districtForSpiceRegion, placesFor } from "@/lib/explore.ts";
import { DetailHero, HeroChip } from "@/components/explore/DetailHero";
import { PlaceCard } from "@/components/explore/PlaceCard";
import { DetailHeading, PrevNext } from "@/components/explore/PrevNext";
import { SourceLinks } from "@/components/SourceLinks";
import { cx } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return spices.map((s) => ({ id: s.id }));
}

const find = (id: string) => spices.find((s) => s.id === id);

export async function generateMetadata({ params }: PageProps<"/spices/[id]">): Promise<Metadata> {
  const s = find((await params).id);
  return s ? { title: `${s.name} (${s.ml})`, description: `${s.taste} ${s.where}` } : {};
}

export default async function SpicePage({ params }: PageProps<"/spices/[id]">) {
  const s = find((await params).id);
  if (!s) notFound();
  const places = placesFor(s);
  const i = spices.indexOf(s);
  const prev = spices[(i + spices.length - 1) % spices.length];
  const next = spices[(i + 1) % spices.length];

  return (
    <>
      <DetailHero
        tint={s.color[0]}
        crumbs={[{ href: "/#spices", label: "Spices" }]}
        eyebrow={<><span lang="ml" className="font-ml normal-case tracking-normal">{s.ml}</span> · say “{s.say}”</>}
        title={s.name}
        lede={s.taste}
        art={
          // A big soft orb in the spice's colours, like its tile in the matrix
          <span
            className="absolute -right-24 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full opacity-80 sm:right-[6%]"
            style={{ background: `radial-gradient(circle at 35% 35%, ${s.color[1]}, ${s.color[0]} 70%)`, boxShadow: `0 0 160px 40px ${s.color[1]}55` }}
          />
        }
      >
        <HeroChip><Flame size={14} aria-hidden /> Heat {s.heat} of 3</HeroChip>
        {s.regions.length === 0 ? <HeroChip><MapPin size={14} aria-hidden /> Across Kerala</HeroChip> : s.regions.map((r) => { const d = districtForSpiceRegion(r); return <HeroChip key={r} href={`/districts/${d.id}`}><MapPin size={14} aria-hidden /> {d.name}</HeroChip>; })}
      </DetailHero>

      <main className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 sm:py-20">
        <section className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <DetailHeading eyebrow="The story" title={`Why ${s.name.toLowerCase()} matters`} />
            <p className="font-serif text-xl leading-relaxed text-ink-700">{s.story}</p>
            <SourceLinks sources={s.sources} className="mt-4" />
          </div>
          <dl className="space-y-4">
            <div className="glass organic p-5">
              <dt className="flex items-center gap-2 text-sm font-semibold text-ink-900"><UtensilsCrossed size={16} className="mood-accent" aria-hidden /> Taste it in</dt>
              <dd className="mt-2 leading-relaxed text-ink-700">{s.where}</dd>
            </div>
            <div className="glass organic p-5">
              <dt className="flex items-center gap-2 text-sm font-semibold text-ink-900"><ShoppingBag size={16} className="mood-accent" aria-hidden /> Buying it</dt>
              <dd className="mt-2 leading-relaxed text-ink-700">{s.tip}</dd>
            </div>
          </dl>
        </section>

        {places.length > 0 && (
          <section>
            <DetailHeading eyebrow="See it growing" title="Stay near the farms">
              {s.name} grows in {s.regions.map((r) => districtForSpiceRegion(r).name).join(", ")}. These bases put you closest.
            </DetailHeading>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((r) => <PlaceCard key={r.id} region={r} />)}
            </div>
          </section>
        )}

        <section>
          <DetailHeading eyebrow="The spice matrix" title="Other spices" />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {spices.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/spices/${o.id}`}
                  aria-current={o.id === s.id ? "page" : undefined}
                  className={cx("glass flex items-center gap-3 organic p-3 transition-transform hover:-translate-y-0.5", o.id === s.id && "ring-2 ring-[var(--mood-accent)]")}
                >
                  <span aria-hidden className="h-8 w-8 shrink-0 rounded-full" style={{ background: `radial-gradient(circle at 35% 35%, ${o.color[1]}, ${o.color[0]})` }} />
                  <span>
                    <span lang="ml" className="block font-ml text-sm font-semibold leading-tight text-ink-900">{o.ml}</span>
                    <span className="block text-sm leading-tight text-ink-700">{o.name}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <PrevNext label="More spices" prev={{ href: `/spices/${prev.id}`, label: prev.name }} next={{ href: `/spices/${next.id}`, label: next.name }} />
      </main>
    </>
  );
}
