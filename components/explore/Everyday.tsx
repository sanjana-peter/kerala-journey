"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Bus, Footprints, Hammer, MapPin, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { districtById, districts, everydayKinds, type Everyday, type EverydayKind } from "@/lib/districts.ts";
import { SourceLinks } from "../SourceLinks";
import { cx } from "../ui";

const kindIcons: Record<EverydayKind, LucideIcon> = { eat: UtensilsCrossed, move: Bus, watch: Footprints, make: Hammer };

/** One everyday experience: what it is, and how to do it like a local. */
export function EverydayCard({ item, showDistrict = true }: { item: Everyday; showDistrict?: boolean }) {
  const Icon = kindIcons[item.kind];
  const d = item.district ? districtById[item.district] : null;
  return (
    <article className="glass flex h-full flex-col organic p-5">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
        <span className="flex items-center gap-1.5"><Icon size={13} className="mood-accent" aria-hidden /> {everydayKinds.find((k) => k.id === item.kind)!.label}</span>
        {showDistrict && (d
          ? <Link href={`/districts/${d.id}`} className="flex items-center gap-1 normal-case tracking-normal mood-accent hover:underline"><MapPin size={12} aria-hidden /> {d.name}</Link>
          : <span className="flex items-center gap-1 normal-case tracking-normal"><MapPin size={12} aria-hidden /> Anywhere in Kerala</span>)}
      </p>
      <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-ink-900">{item.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">{item.what}</p>
      <div className="mt-3 rounded-xl bg-sand-50/80 p-3 text-sm leading-relaxed text-ink-700 ring-1 ring-sand-200">
        <span className="font-semibold text-ink-900">How to do it: </span>{item.how}
      </div>
      <SourceLinks sources={item.sources} className="mt-auto pt-3" />
    </article>
  );
}

/** Every everyday experience, filterable by kind; anywhere-in-Kerala ones first, then north to south. */
export function EverydayList({ items }: { items: Everyday[] }) {
  const [kind, setKind] = useState<EverydayKind | null>(null);
  const top = useRef<HTMLDivElement>(null);
  // After filtering from far down the page, jump back to the start of the (now shorter) list.
  const pick = (k: EverydayKind | null) => {
    setKind(k);
    if (top.current && top.current.getBoundingClientRect().top < 0) top.current.scrollIntoView({ block: "start" });
  };
  const shown = items.filter((e) => !kind || e.kind === kind);
  const anywhere = shown.filter((e) => !e.district);
  const north = (e: Everyday) => districts.findIndex((d) => d.id === e.district);
  const local = shown.filter((e) => e.district).sort((a, b) => north(a) - north(b));

  return (
    <div ref={top} className="scroll-mt-14">
      {/* Stays under the header while scrolling; one swipeable row on phones */}
      <div
        className="sticky top-14 z-20 -mx-4 mb-8 flex gap-2 overflow-x-auto bg-sand-100/85 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:flex-wrap sm:rounded-full sm:px-2"
        role="group"
        aria-label="Filter by kind"
      >
        {[null, ...everydayKinds.map((k) => k.id)].map((k) => (
          <button
            key={k ?? "all"}
            type="button"
            aria-pressed={kind === k}
            onClick={() => pick(k)}
            className={cx("shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors", kind === k ? "bg-forest-900 text-sand-50" : "glass text-ink-700 hover:text-ink-900")}
          >
            {k ? everydayKinds.find((x) => x.id === k)!.label : "Everything"}
          </button>
        ))}
      </div>

      {anywhere.length > 0 && (
        <section aria-labelledby="anywhere" className="mb-14">
          <h2 id="anywhere" className="mb-4 text-2xl font-semibold text-forest-900">Anywhere in Kerala</h2>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {anywhere.map((e) => <li key={e.id}><EverydayCard item={e} showDistrict={false} /></li>)}
          </ul>
        </section>
      )}
      {local.length > 0 && (
        <section aria-labelledby="by-district">
          <h2 id="by-district" className="mb-4 text-2xl font-semibold text-forest-900">District by district, north to south</h2>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {local.map((e) => <li key={e.id}><EverydayCard item={e} /></li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
