import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { photos } from "@/lib/experience.ts";
import { districts, everyday, type District } from "@/lib/districts.ts";
import { everydayIn, placesIn } from "@/lib/explore.ts";
import { DetailHero } from "@/components/explore/DetailHero";
import { DistrictMap } from "@/components/explore/DistrictMap";
import { DetailHeading } from "@/components/explore/PrevNext";

export const metadata: Metadata = {
  title: "Districts",
  description: "All 14 districts of Kerala, north to south: what each is like, where the planner's bases are, and what locals do there.",
};

const PARTS: { id: District["part"]; title: string; blurb: string }[] = [
  { id: "Malabar", title: "Malabar, the north", blurb: "The old spice coast: Theyyam, Sevens football, biryani and the far-north hills." },
  { id: "Central", title: "Central Kerala", blurb: "Kochi, Thrissur's festivals and the high ranges of Idukki." },
  { id: "Travancore", title: "Travancore, the south", blurb: "Backwaters, pilgrim hills, cashew country and the capital." },
];

export default function DistrictsIndex() {
  return (
    <>
      <DetailHero
        photo={photos["kuttanad-storm"]}
        crumbs={[]}
        eyebrow="Beyond the tourist trail"
        title="Kerala, district by district"
        lede="Fourteen districts, from Kasaragod's seven languages to the capital in the south. Most visitors see four. Here are the rest."
      />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div className="space-y-14">
            {PARTS.map((part) => (
              <section key={part.id} aria-labelledby={`part-${part.id}`}>
                <DetailHeading id={`part-${part.id}`} eyebrow={`${districts.filter((d) => d.part === part.id).length} districts`} title={part.title}>{part.blurb}</DetailHeading>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {districts.filter((d) => d.part === part.id).map((d) => {
                    const bases = placesIn(d.id).length;
                    const things = everydayIn(d.id).length;
                    return (
                      <li key={d.id}>
                        <Link href={`/districts/${d.id}`} className="glass group block h-full organic p-5 transition-transform hover:-translate-y-0.5">
                          <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                            <span className="font-serif text-xl font-semibold text-forest-900">{d.name}</span>
                            <span lang="ml" className="font-ml text-sm text-ink-500">{d.ml}</span>
                          </span>
                          <span className="mt-1 block text-sm text-ink-700">{d.character}</span>
                          <span className="mt-3 flex flex-wrap gap-1.5 text-xs">
                            <span className={`rounded-full px-2 py-0.5 ${bases ? "bg-forest-800 text-sand-50" : "bg-sand-200 text-ink-700"}`}>{bases ? `${bases} planner base${bases > 1 ? "s" : ""}` : "Off the trail"}</span>
                            {things > 0 && <span className="rounded-full bg-sand-50 px-2 py-0.5 text-ink-700 ring-1 ring-sand-200">{things} everyday thing{things > 1 ? "s" : ""} to do</span>}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
          <div className="space-y-4 lg:sticky lg:top-20">
            <DistrictMap />
            <Link href="/everyday" className="glass group flex items-center justify-between gap-3 organic px-5 py-4">
              <span>
                <span className="block font-serif text-lg font-semibold text-forest-900">Everyday Kerala</span>
                <span className="block text-sm text-ink-700">{everyday.length} things locals do, and how to join in</span>
              </span>
              <ArrowRight size={18} className="mood-accent transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
