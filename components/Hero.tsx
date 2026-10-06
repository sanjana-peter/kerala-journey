"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, Ear, Flower2, Wind } from "lucide-react";
import { moodOrder, moods, photos } from "@/lib/experience.ts";
import { useMood } from "./MoodContext";
import { useTrip } from "./TripContext";
import { cx } from "./ui";

/** Full-bleed, cinematic hero. Hovering a region morphs the photo, the copy and the page's accent colours. */
export function Hero() {
  const { mood, preview, pin, idle } = useMood();
  const { input, toggleVibe } = useTrip();
  const photo = photos[mood.photo];

  return (
    <section id="top" aria-label="Kerala at a glance" className="relative isolate -mt-14 flex min-h-[92svh] items-end overflow-hidden bg-forest-900 pt-24 text-sand-50">
      {/* Photo stack: crossfade with a slow push-in */}
      <AnimatePresence initial={false}>
        <motion.div
          key={photo.src}
          className="absolute inset-0 -z-20"
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1.02, transition: { opacity: { duration: 1.4, ease: "easeOut" }, scale: { duration: 9, ease: "linear" } } }}
          exit={{ opacity: 0, transition: { duration: 1.4 } }}
        >
          <Image src={photo.src} alt={photo.alt} fill priority sizes="100vw" className="object-cover" />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic grade: letterbox-style vignettes plus a wash of the mood colour */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900/90 via-forest-900/25 to-forest-900/50" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-900/70 via-forest-900/20 to-transparent" />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-30 mix-blend-multiply transition-colors duration-1000" style={{ backgroundColor: "var(--mood-accent)" }} />

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-10 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:pb-16">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-sand-200"
          >
            Kerala, before you go
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mt-4 text-5xl font-semibold leading-[1.02] sm:text-7xl"
          >
            Feel it first.
            <br />
            <span className="italic text-sand-200">Then plan it properly.</span>
          </motion.h1>

          <div className="mt-6 min-h-[3.5rem] max-w-xl" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p
                key={mood.id}
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.6 }}
                className="font-serif text-xl leading-snug text-sand-50/95 sm:text-2xl"
              >
                <span className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-sand-200">{mood.place} · </span>
                {mood.line}
              </motion.p>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.ul
              key={mood.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { staggerChildren: 0.08 } }}
              exit={{ opacity: 0 }}
              className="mt-6 flex flex-wrap gap-2 text-sm"
              aria-label={`What ${mood.place} feels like`}
            >
              {[
                { icon: Ear, label: mood.sense.hear },
                { icon: Flower2, label: mood.sense.smell },
                { icon: Wind, label: mood.sense.feel },
              ].map(({ icon: Icon, label }) => (
                <motion.li key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-dark flex items-center gap-2 rounded-full px-3 py-1.5">
                  <Icon size={14} aria-hidden className="text-sand-200" /> {label}
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#explore" className="group inline-flex items-center gap-2 rounded-full bg-sand-50 px-6 py-3 text-sm font-semibold text-forest-900 transition-transform hover:-translate-y-0.5">
              Find your vibe <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
            </a>
            <a href="#decide" className="glass-dark inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:bg-forest-900/55">
              Skip to the planner
            </a>
          </div>
        </div>

        {/* Region selector */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-sand-200">
            Hover a place, tap to add it to your trip
          </p>
          <ul className="grid grid-cols-4 gap-2 sm:gap-3" onMouseLeave={() => preview(null)}>
            {moodOrder.map((id) => {
              const m = moods[id];
              const active = m.id === mood.id;
              const picked = input.vibes.includes(id);
              return (
                <li key={id}>
                  <button
                    type="button"
                    onMouseEnter={() => preview(id)}
                    onFocus={() => preview(id)}
                    onBlur={() => preview(null)}
                    onClick={() => { pin(id); if (!picked) toggleVibe(id); }}
                    aria-pressed={picked}
                    className={cx(
                      "group relative block aspect-[3/4] w-full overflow-hidden organic text-left ring-2 transition-all duration-500",
                      active ? "-translate-y-2 ring-sand-50" : "ring-transparent hover:-translate-y-1",
                    )}
                  >
                    <Image src={photos[m.photo].src} alt="" fill sizes="(min-width: 1024px) 140px, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <span className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/10 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-2 sm:p-3">
                      <span className="block text-sm font-semibold leading-tight sm:text-base">{m.place}</span>
                      <span className={cx("mt-1 block h-0.5 rounded-full bg-sand-50 transition-all duration-500", active ? "w-8" : "w-0 group-hover:w-4")} />
                    </span>
                    {picked && (
                      <span className="absolute right-2 top-2 rounded-full bg-sand-50 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-forest-900">
                        In trip
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex items-center justify-between gap-4 text-[0.7rem] text-sand-200/80">
            <span className="flex gap-1.5" aria-hidden>
              {moodOrder.map((id) => (
                <span key={id} className={cx("h-1 rounded-full transition-all duration-700", id === mood.id ? "w-6 bg-sand-50" : "w-2 bg-sand-50/40", idle && id === mood.id && "animate-pulse")} />
              ))}
            </span>
            <a href={photo.source} target="_blank" rel="noreferrer" className="truncate hover:text-sand-50">
              {photo.title} · Photo: {photo.credit}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
