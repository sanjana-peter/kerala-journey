import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { districts, everyday } from "@/lib/districts.ts";
import { placesInRouteOrder } from "@/lib/explore.ts";
import { PlaceCard } from "./explore/PlaceCard";
import { Reveal } from "./Reveal";

/** Every base, north to south, each opening its own page. */
export function PlacesStrip() {
  return (
    <Reveal>
      <section aria-labelledby="places-strip-title" className="mt-16">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 id="places-strip-title" className="text-2xl font-semibold text-forest-900">Every stop, up close</h3>
            <p className="mt-1 text-sm text-ink-700">Open a place for everything there is to do, where to stay and how to get there.</p>
          </div>
          <Link href="/places" className="inline-flex items-center gap-1.5 text-sm font-semibold mood-accent hover:underline">
            All places, vibes and months <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {placesInRouteOrder.map((r) => <li key={r.id}><PlaceCard region={r} compact /></li>)}
        </ul>

        {/* Beyond the tourist trail */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { href: "/districts", title: `All ${districts.length} districts`, sub: "The whole state, north to south, including the parts tours skip." },
            { href: "/everyday", title: "Everyday Kerala", sub: `${everyday.length} things locals do: tea shops, ferries, Theyyam nights, Sevens football.` },
          ].map((x) => (
            <Link key={x.href} href={x.href} className="glass group flex items-center justify-between gap-3 organic px-5 py-4">
              <span>
                <span className="block font-serif text-lg font-semibold text-forest-900">{x.title}</span>
                <span className="block text-sm text-ink-700">{x.sub}</span>
              </span>
              <ArrowRight size={18} className="shrink-0 mood-accent transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
