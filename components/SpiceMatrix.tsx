"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Flame, MapPin, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { spiceRegions, spices, type SpiceRegion } from "@/lib/experience.ts";
import { Reveal } from "./Reveal";
import { cx } from "./ui";

/** A clickable grid of Kerala's spices. Filter by where they grow; open one for its story. */
export function SpiceMatrix() {
  const [activeId, setActiveId] = useState(spices[0].id);
  const [region, setRegion] = useState<SpiceRegion | null>(null);
  const active = spices.find((s) => s.id === activeId)!;

  return (
    <section id="spices" aria-labelledby="spices-title" className="scroll-mt-20">
      <Reveal>
        <div className="mb-6 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] mood-accent">The spice matrix</p>
          <h2 id="spices-title" className="text-3xl font-semibold text-forest-900 sm:text-4xl">Why the world sailed here</h2>
          <p className="mt-3 text-ink-700">
            Romans, Arabs, the Chinese and the Portuguese all came for these. Tap a spice to see where it grows, where you&apos;ll taste it,
            and how not to get fleeced buying it.
          </p>
        </div>
      </Reveal>

      <div className="mb-5 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by region">
        <span className="mr-1 flex items-center gap-1 text-sm text-ink-500"><MapPin size={14} aria-hidden /> Grown in</span>
        {spiceRegions.map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={region === r}
            onClick={() => setRegion(region === r ? null : r)}
            className={cx("rounded-full px-3 py-1 text-sm font-medium transition-colors", region === r ? "bg-forest-900 text-sand-50" : "glass text-ink-700 hover:text-ink-900")}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        {/* The grid */}
        <ul className="grid content-start grid-cols-2 gap-3 sm:grid-cols-4">
          {spices.map((s) => {
            const on = s.id === activeId;
            const dim = region !== null && !s.regions.includes(region);
            return (
              <li key={s.id}>
                <motion.button
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  aria-pressed={on}
                  animate={{ opacity: dim ? 0.3 : 1, scale: dim ? 0.96 : 1 }}
                  whileHover={{ y: -3 }}
                  className={cx(
                    "glass group relative flex aspect-square w-full flex-col items-start justify-between overflow-hidden organic p-3 text-left",
                    on && "ring-2 ring-[var(--mood-accent)]",
                  )}
                >
                  {/* A soft orb in the spice's colours */}
                  <span
                    aria-hidden
                    className="h-9 w-9 rounded-full transition-transform duration-500 group-hover:scale-110"
                    style={{ background: `radial-gradient(circle at 35% 35%, ${s.color[1]}, ${s.color[0]})`, boxShadow: `0 6px 18px -4px ${s.color[1]}` }}
                  />
                  <span>
                    <span lang="ml" className="block font-ml text-base font-semibold leading-tight text-ink-900">{s.ml}</span>
                    <span className="mt-0.5 block text-sm leading-tight text-ink-700">{s.name}</span>
                    <span className="mt-1 flex gap-0.5" aria-label={`Heat ${s.heat} of 3`}>
                      {[1, 2, 3].map((n) => (
                        <span key={n} className={cx("h-1 w-3 rounded-full", n <= s.heat ? "bg-clay-600" : "bg-sand-300")} />
                      ))}
                    </span>
                  </span>
                </motion.button>
              </li>
            );
          })}
        </ul>

        {/* The detail */}
        <div className="relative min-h-[22rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.article
              key={active.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="relative h-full overflow-hidden organic bg-forest-900 p-6 text-sand-50"
            >
              <span
                aria-hidden
                className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full opacity-60 blur-2xl"
                style={{ background: `radial-gradient(circle, ${active.color[1]}, transparent 70%)` }}
              />
              <div className="relative">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-sand-200">
                  <span lang="ml" className="font-ml normal-case tracking-normal">{active.ml}</span> · say “{active.say}”
                </p>
                <h3 className="mt-1 text-3xl font-semibold">{active.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-sand-200">
                  <Flame size={14} aria-hidden /> {active.taste}
                </p>
                <p className="mt-4 leading-relaxed text-sand-50/90">{active.story}</p>

                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex gap-3">
                    <dt><MapPin size={16} className="mt-0.5 text-sand-200" aria-label="Grown in" /></dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {active.regions.map((r) => <span key={r} className="glass-dark rounded-full px-2.5 py-0.5 text-xs">{r}</span>)}
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt><UtensilsCrossed size={16} className="mt-0.5 text-sand-200" aria-label="Taste it in" /></dt>
                    <dd>{active.where}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt><ShoppingBag size={16} className="mt-0.5 text-sand-200" aria-label="Buying tip" /></dt>
                    <dd>{active.tip}</dd>
                  </div>
                </dl>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
