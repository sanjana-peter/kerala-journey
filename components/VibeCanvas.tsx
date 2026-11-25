"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check, Plus } from "lucide-react";
import { microStories, moods, photos } from "@/lib/experience.ts";
import { regions, vibes } from "@/lib/keralaData.ts";
import { ComparisonSlider } from "./ComparisonSlider";
import { useMood } from "./MoodContext";
import { useTrip } from "./TripContext";
import { Reveal } from "./Reveal";
import { cx, SectionHeading } from "./ui";

/** Module A, reimagined: big photo cards with a micro-story each. Tap to add a vibe to the trip. */
export function VibeCanvas() {
  const { input, toggleVibe } = useTrip();
  const { preview, pin } = useMood();
  const picked = vibes.filter((v) => input.vibes.includes(v.id));

  return (
    <section id="explore" className="scroll-mt-20">
      <Reveal>
        <SectionHeading step={1} eyebrow="Explore" title="Four Keralas. Pick the ones that pull at you.">
          Each is a different corner of the state with its own weather, pace and food. Choose one or several, and the planner
          fits in as many as your days allow.
        </SectionHeading>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2" onMouseLeave={() => preview(null)}>
        {vibes.map((v, i) => {
          const on = input.vibes.includes(v.id);
          const mood = moods[v.id];
          const photo = photos[mood.photo];
          return (
            <Reveal key={v.id} delay={i * 0.08}>
              <motion.div
                layout
                onMouseEnter={() => preview(v.id)}
                whileHover={{ y: -4 }}
                className={cx(
                  "group relative flex h-full w-full flex-col overflow-hidden organic transition-shadow duration-500",
                  on ? "shadow-[0_0_0_3px_var(--mood-accent),0_24px_48px_-24px_rgb(31_61_43/0.5)]" : "shadow-[0_12px_32px_-20px_rgb(31_61_43/0.45)]",
                )}
              >
                <motion.button
                  type="button"
                  aria-pressed={on}
                  onClick={() => { toggleVibe(v.id); pin(v.id); }}
                  onFocus={() => preview(v.id)}
                  onBlur={() => preview(null)}
                  whileTap={{ scale: 0.99 }}
                  className="flex flex-1 flex-col text-left"
                >
                  {/* Photo with name */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.07]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-sand-50">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sand-200">{v.places}</p>
                        <h3 className="mt-1 text-2xl font-semibold sm:text-3xl">{v.name}</h3>
                      </div>
                      <span
                        className={cx(
                          "grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all duration-300",
                          on ? "bg-sand-50 text-forest-900" : "glass-dark group-hover:bg-sand-50/25",
                        )}
                        aria-hidden
                      >
                        {on ? <Check size={18} strokeWidth={3} /> : <Plus size={18} />}
                      </span>
                    </div>
                  </div>

                  {/* Micro-story and the honest details */}
                  <div className="glass flex flex-1 flex-col gap-4 rounded-none border-0 p-5">
                    <p className="font-serif text-[1.05rem] italic leading-relaxed text-ink-700">“{microStories[v.id]}”</p>
                    <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-sand-200/80 pt-4 text-[0.78rem] leading-snug">
                      <div>
                        <dt className="font-semibold text-ink-900">Best</dt>
                        <dd className="text-ink-500">{v.bestMonths}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-ink-900">Suits</dt>
                        <dd className="text-ink-500">{v.suits}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-clay-700">Skip if</dt>
                        <dd className="text-ink-500">{v.skipIf}</dd>
                      </div>
                    </dl>
                  </div>
                </motion.button>

                {/* Dig deeper: the vibe's own page and each of its places */}
                <div className="glass flex flex-wrap items-center gap-2 rounded-none border-0 border-t border-sand-200/80 px-5 py-3 text-sm">
                  <Link href={`/vibes/${v.id}`} className="inline-flex items-center gap-1 font-semibold mood-accent hover:underline">
                    Explore {v.name} <ArrowRight size={14} aria-hidden />
                  </Link>
                  <span className="ml-auto flex flex-wrap gap-1.5">
                    {v.regions.map((r) => (
                      <Link key={r} href={`/places/${r}`} className="rounded-full bg-sand-50 px-2.5 py-0.5 text-ink-700 ring-1 ring-sand-200 hover:text-ink-900 hover:ring-forest-600">
                        {regions[r].name}
                      </Link>
                    ))}
                  </span>
                </div>
              </motion.div>
            </Reveal>
          );
        })}
      </div>

      <div className="glass sticky bottom-3 z-20 mt-6 flex items-center justify-between gap-3 organic px-4 py-3 sm:bottom-4 sm:px-5 sm:py-4">
        <p className="text-[0.8rem] leading-snug text-ink-700 sm:text-sm" aria-live="polite">
          {picked.length === 0
            ? "Not sure? Mist + Backwaters is the classic first trip."
            : <>Your Kerala: <b className="text-ink-900">{picked.map((v) => v.name).join(" + ")}</b></>}
        </p>
        <a
          href="#decide"
          aria-disabled={picked.length === 0}
          className={cx(
            "inline-flex shrink-0 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity sm:px-5 sm:py-2.5",
            picked.length === 0 ? "pointer-events-none bg-ink-400" : "bg-mood-accent hover:opacity-90",
          )}
        >
          Build the trip
        </a>
      </div>

      <Reveal>
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-forest-900">Mist or gold?</h3>
          <p className="mb-5 mt-1 text-sm text-ink-700">Same state, same day: dawn in the hills, sunset on the water. Drag to compare.</p>
          <ComparisonSlider left="munnar-mist" right="kumarakom-sunset" leftLabel="Munnar, 6 am" rightLabel="Kumarakom, 6 pm" />
        </div>
      </Reveal>
    </section>
  );
}
