"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, Shuffle } from "lucide-react";
import { phraseKinds, phrases, type Phrase, type PhraseKind } from "@/lib/experience.ts";
import { Reveal } from "./Reveal";
import { cx } from "./ui";

const STORAGE_KEY = "kerala-journey:phrases:v1";
const kindStyle: Record<PhraseKind, string> = {
  survival: "bg-forest-100 text-forest-800",
  transit: "bg-sand-200 text-ink-700",
  food: "bg-clay-100 text-clay-700",
  slang: "bg-[#e6e0f0] text-[#4b3d6b]",
};

/** Flip cards: Malayalam on the front, how to say it, what it means and when to use it on the back. */
export function PhraseFlip() {
  const [kind, setKind] = useState<PhraseKind | "all">("all");
  const [order, setOrder] = useState<Phrase[]>(phrases);
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [seen, setSeen] = useState<Set<string>>(new Set());

  useEffect(() => {
    try { setSeen(new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"))); } catch { /* ignore */ }
  }, []);

  const flip = (ml: string) => {
    setFlipped((f) => { const n = new Set(f); if (n.has(ml)) n.delete(ml); else n.add(ml); return n; });
    setSeen((s) => {
      if (s.has(ml)) return s;
      const n = new Set(s).add(ml);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...n])); } catch { /* ignore */ }
      return n;
    });
  };

  const shown = order.filter((p) => kind === "all" || p.kind === kind);
  const allSeen = seen.size === phrases.length;

  return (
    <section id="phrases" aria-labelledby="phrases-title" className="scroll-mt-20">
      <Reveal>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] mood-accent">Talk like a local</p>
            <h2 id="phrases-title" className="text-3xl font-semibold text-forest-900 sm:text-4xl">Flip a word, earn a smile</h2>
            <p className="mt-3 text-ink-700">
              Malayalam is famously hard. Nobody expects you to speak it, so even one word goes a long way.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="tabular-nums text-ink-500" aria-live="polite">
              {seen.size}/{phrases.length} discovered
            </span>
            <span className="h-1.5 w-24 overflow-hidden rounded-full bg-sand-200" aria-hidden>
              <span className="block h-full rounded-full bg-mood-accent transition-all duration-500" style={{ width: `${(seen.size / phrases.length) * 100}%` }} />
            </span>
          </div>
        </div>
      </Reveal>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {[{ id: "all" as const, label: "All" }, ...phraseKinds].map((k) => (
          <button
            key={k.id}
            type="button"
            aria-pressed={kind === k.id}
            onClick={() => setKind(k.id)}
            className={cx(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              kind === k.id ? "bg-forest-900 text-sand-50" : "glass text-ink-700 hover:text-ink-900",
            )}
          >
            {k.label}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-sand-300" aria-hidden />
        <button type="button" onClick={() => setOrder((o) => [...o].sort(() => Math.random() - 0.5))} className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-700 hover:text-ink-900">
          <Shuffle size={14} /> Shuffle
        </button>
        {flipped.size > 0 && (
          <button type="button" onClick={() => setFlipped(new Set())} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-500 hover:text-ink-900">
            <RotateCcw size={14} /> Flip all back
          </button>
        )}
      </div>

      <AnimatePresence>
        {allSeen && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-5 rounded-2xl bg-forest-900 px-5 py-3 text-sm text-sand-50"
          >
            <span className="font-ml text-base">അടിപൊളി!</span> You&apos;ve found every word. Try them on the next auto driver.
          </motion.p>
        )}
      </AnimatePresence>

      <motion.ul layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => {
            const isFlipped = flipped.has(p.ml);
            return (
              <motion.li
                key={p.ml}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flip h-52"
              >
                <button
                  type="button"
                  onClick={() => flip(p.ml)}
                  aria-pressed={isFlipped}
                  aria-label={isFlipped ? `${p.ml}: ${p.en}. Say ${p.say}. ${p.context}` : `${p.ml}, ${p.kind} phrase. Flip to reveal.`}
                  className={cx("flip-inner relative block h-full w-full text-left", isFlipped && "is-flipped")}
                >
                  {/* Front */}
                  <span className="flip-face flip-front glass absolute inset-0 flex flex-col justify-between organic p-4 transition-shadow hover:shadow-[0_12px_32px_-12px_rgb(31_61_43/0.35)]">
                    <span className={cx("self-start rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide", kindStyle[p.kind])}>
                      {p.kind}
                    </span>
                    <span lang="ml" className="font-ml text-2xl font-semibold leading-snug text-forest-900 sm:text-[1.65rem]">{p.ml}</span>
                    <span className="flex items-center justify-between text-xs text-ink-400">
                      Tap to flip
                      {seen.has(p.ml) && <span className="h-1.5 w-1.5 rounded-full bg-mood-accent" title="Discovered" />}
                    </span>
                  </span>
                  {/* Back */}
                  <span className="flip-face flip-back absolute inset-0 flex flex-col organic bg-forest-900 p-4 text-sand-50">
                    <span className="text-xs font-medium uppercase tracking-wide text-sand-200">say “{p.say}”</span>
                    <span className="mt-1 font-serif text-lg font-semibold leading-tight">{p.en}</span>
                    <span className="mt-2 text-[0.8rem] leading-snug text-sand-50/85">{p.context}</span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
}
