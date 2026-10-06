"use client";

import { Check, Mountain, Sailboat, Sun, Trees, type LucideIcon } from "lucide-react";
import { vibes, type VibeId } from "@/lib/keralaData.ts";
import { useTrip } from "./TripContext";
import { Button, cx, SectionHeading } from "./ui";

const icons: Record<VibeId, LucideIcon> = { mist: Mountain, backwaters: Sailboat, coast: Sun, wild: Trees };

export function VibeSelector() {
  const { input, toggleVibe } = useTrip();
  const picked = vibes.filter((v) => input.vibes.includes(v.id));

  return (
    <section id="explore" className="scroll-mt-20">
      <SectionHeading step={1} eyebrow="Explore" title="What kind of Kerala do you want?">
        Pick one or more. Each one is a different part of the state, and the planner fits as many as your days allow.
      </SectionHeading>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" role="group" aria-label="Trip vibes">
        {vibes.map((v) => {
          const Icon = icons[v.id];
          const on = input.vibes.includes(v.id);
          return (
            <button
              key={v.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggleVibe(v.id)}
              className={cx(
                "group relative flex flex-col rounded-2xl border-2 bg-sand-50 p-5 text-left transition-all",
                on ? "border-forest-700 shadow-[0_0_0_4px_var(--color-forest-100)]" : "border-sand-200 hover:border-sand-300",
              )}
            >
              <span
                className={cx(
                  "absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full border-2 transition-colors",
                  on ? "border-forest-700 bg-forest-700 text-white" : "border-sand-300 text-transparent",
                )}
                aria-hidden
              >
                <Check size={14} strokeWidth={3} />
              </span>
              <span className={cx("mb-4 grid h-11 w-11 place-items-center rounded-xl", on ? "bg-forest-800 text-sand-50" : "bg-forest-50 text-forest-700")}>
                <Icon size={22} />
              </span>
              <span className="font-serif text-xl font-semibold text-forest-900">{v.name}</span>
              <span className="mt-0.5 text-sm font-medium text-clay-600">{v.places}</span>
              <span className="mt-2 text-sm text-ink-700">{v.tagline}</span>

              <dl className="mt-4 space-y-2 border-t border-sand-200 pt-4 text-[0.8rem] leading-snug">
                <div>
                  <dt className="font-semibold text-ink-900">Best months</dt>
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
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-xl bg-sand-200/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-700" aria-live="polite">
          {picked.length === 0
            ? "Nothing picked yet. Not sure? Mist + Backwaters is the classic first trip."
            : `Picked: ${picked.map((v) => v.name).join(" + ")}`}
        </p>
        <Button onClick={() => document.getElementById("decide")?.scrollIntoView()} disabled={picked.length === 0}>
          Next: build the trip
        </Button>
      </div>
    </section>
  );
}
