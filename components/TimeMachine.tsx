"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck, CloudRain, Pause, Play, Sparkles, Thermometer } from "lucide-react";
import { photos, seasons } from "@/lib/experience.ts";
import { months } from "@/lib/keralaData.ts";
import { useTrip } from "./TripContext";
import { Reveal } from "./Reveal";
import { cx } from "./ui";

const MAX_RAIN = Math.max(...seasons.map((s) => s.rainMm));
// One hue for magnitude; the selected month is the same hue, darker.
const BAR = "#9dbccc";
const BAR_ON = "#2e5d74";

/** Month-by-month: weather, rainfall and festivals, with a photo that changes with the season. */
export function TimeMachine() {
  const { input, update } = useTrip();
  const [m, setM] = useState(0);
  const [playing, setPlaying] = useState(false);
  const season = seasons[m];
  const month = months[m];
  const photo = photos[season.photo];
  const planned = input.month === m;

  // Start on this month (after mount: the page is prerendered, so the server doesn't know the date),
  // or on the month already chosen for the trip.
  useEffect(() => { setM(new Date().getMonth()); }, []);
  useEffect(() => { if (input.month !== null) setM(input.month); }, [input.month]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setM((x) => (x + 1) % 12), 1800);
    return () => clearInterval(t);
  }, [playing]);

  const pick = (i: number) => { setPlaying(false); setM(i); };

  return (
    <section id="seasons" aria-labelledby="seasons-title" className="scroll-mt-20">
      <Reveal>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] mood-accent">Time machine</p>
            <h2 id="seasons-title" className="text-3xl font-semibold text-forest-900 sm:text-4xl">Slide through a Kerala year</h2>
            <p className="mt-3 text-ink-700">Two monsoons, a festival season and a hot spell. See what each month really feels like.</p>
          </div>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="glass inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold text-ink-900 sm:self-auto"
            aria-pressed={playing}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />} {playing ? "Pause" : "Play the year"}
          </button>
        </div>
      </Reveal>

      <Reveal>
        <div className="relative isolate overflow-hidden organic bg-forest-900 text-sand-50">
          <AnimatePresence initial={false}>
            <motion.div
              key={photo.src}
              className="absolute inset-0 -z-20"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1152px) 1152px, 100vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>
          <div aria-hidden className="absolute inset-0 -z-10 transition-colors duration-1000" style={{ background: `linear-gradient(100deg, ${season.tint}f2 0%, ${season.tint}b3 38%, transparent 80%)` }} />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900/60 to-transparent" />

          <div className="grid min-h-[30rem] gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr]">
            <div aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div key={m} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.45 }}>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sand-200">{season.mood}</p>
                  <h3 className="mt-1 text-6xl font-semibold sm:text-7xl">{month.name}</h3>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-sand-50/95">{month.note}</p>

                  <dl className="mt-6 flex flex-wrap gap-3">
                    <div className="glass-dark flex items-center gap-3 rounded-2xl px-4 py-3">
                      <CloudRain size={20} aria-hidden className="text-sand-200" />
                      <div><dt className="text-xs text-sand-200">Rain (Kochi)</dt><dd className="text-lg font-semibold tabular-nums">~{season.rainMm} mm</dd></div>
                    </div>
                    <div className="glass-dark flex items-center gap-3 rounded-2xl px-4 py-3">
                      <Thermometer size={20} aria-hidden className="text-sand-200" />
                      <div><dt className="text-xs text-sand-200">Coast high</dt><dd className="text-lg font-semibold tabular-nums">~{season.highC} °C</dd></div>
                    </div>
                  </dl>

                  <button
                    type="button"
                    onClick={() => { update({ month: m }); document.getElementById("decide")?.scrollIntoView(); }}
                    className={cx(
                      "mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5",
                      planned ? "bg-sand-50/20 text-sand-50 ring-1 ring-sand-50/60" : "bg-sand-50 text-forest-900",
                    )}
                  >
                    <CalendarCheck size={16} /> {planned ? `Planning for ${month.name}` : `Plan my trip for ${month.name}`}
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col justify-end">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-sand-200">
                <Sparkles size={14} aria-hidden /> What&apos;s on
              </p>
              <AnimatePresence mode="wait">
                <motion.ul key={m} className="space-y-3" initial="hide" animate="show" exit="hide" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
                  {season.festivals.map((f) => (
                    <motion.li
                      key={f.name}
                      variants={{ hide: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                      className="glass-dark rounded-2xl p-4"
                    >
                      <p className="font-serif text-lg font-semibold">{f.name}</p>
                      <p className="text-xs font-medium uppercase tracking-wide text-sand-200">{f.where}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-sand-50/90">{f.what}</p>
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Rainfall bars double as the month picker */}
      <Reveal>
        <div className="glass mt-5 organic p-5 sm:p-6">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h4 className="text-sm font-semibold text-ink-900">Average monthly rainfall in Kochi (mm)</h4>
            <span className="text-xs text-ink-500">Approximate long-term averages</span>
          </div>
          <div className="relative flex h-40 items-end gap-1 border-b border-sand-300 sm:gap-2" role="radiogroup" aria-label="Month">
            {seasons.map((s, i) => {
              const on = i === m;
              return (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={`${months[i].name}, about ${s.rainMm} mm of rain`}
                  onClick={() => pick(i)}
                  className="group relative flex h-full flex-1 items-end justify-center"
                >
                  {on && <span className="absolute text-[0.7rem] font-semibold tabular-nums text-ink-900" style={{ bottom: `calc(${(s.rainMm / MAX_RAIN) * 100}% + 4px)` }}>{s.rainMm}</span>}
                  <span
                    className="block w-full max-w-9 rounded-t-[4px] transition-all duration-500 group-hover:opacity-80"
                    style={{ height: `${Math.max(2, (s.rainMm / MAX_RAIN) * 100)}%`, backgroundColor: on ? BAR_ON : BAR }}
                  />
                  <span className="pointer-events-none absolute bottom-full z-10 mb-6 hidden whitespace-nowrap rounded-md bg-ink-900 px-2 py-1 text-xs text-white group-hover:block">
                    {months[i].short} · ~{s.rainMm} mm · {s.highC} °C
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex gap-1 sm:gap-2">
            {months.map((mo, i) => (
              <span key={mo.short} className={cx("flex-1 text-center text-[0.7rem] font-medium", i === m ? "text-ink-900" : "text-ink-400")}>
                <span className="sm:hidden">{mo.short[0]}</span><span className="hidden sm:inline">{mo.short}</span>
              </span>
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={11}
            value={m}
            onChange={(e) => pick(Number(e.target.value))}
            aria-label="Month"
            aria-valuetext={month.name}
            className="mt-4 w-full accent-[var(--mood-accent)]"
          />
          {/* sr-only on the wrapper: a table ignores the 1px width on itself and would widen the page */}
          <div className="sr-only"><table>
            <caption>Average monthly rainfall and coastal high temperature in Kochi</caption>
            <thead><tr><th>Month</th><th>Rain (mm)</th><th>High (°C)</th></tr></thead>
            <tbody>{seasons.map((s, i) => <tr key={i}><td>{months[i].name}</td><td>{s.rainMm}</td><td>{s.highC}</td></tr>)}</tbody>
          </table></div>
          <p className="mt-3 text-right text-[0.7rem] text-ink-400">{photo.title} · Photo: {photo.credit}</p>
        </div>
      </Reveal>
    </section>
  );
}
