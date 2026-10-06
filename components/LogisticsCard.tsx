import { ArrowRight, Info } from "lucide-react";
import { placeName, type ResolvedLeg } from "@/lib/planner.ts";
import { formatHours, formatINR } from "@/lib/dossier.ts";
import { modeIcons } from "./ui";

/** One transit leg: every realistic way to make it, best first, with fares and boarding tips. */
export function LogisticsCard({ leg, index }: { leg: ResolvedLeg; index: number }) {
  return (
    <article id={`leg-${leg.from}-${leg.to}`} className="scroll-mt-24 rounded-2xl border border-sand-200 bg-sand-50">
      <header className="flex items-center justify-between gap-3 border-b border-sand-200 px-5 py-4">
        <h4 className="flex flex-wrap items-center gap-2 font-serif text-lg font-semibold text-ink-900">
          <span className="font-sans text-xs font-bold text-clay-600">LEG {index + 1}</span>
          {placeName(leg.from)} <ArrowRight size={16} className="text-ink-400" aria-hidden /> {placeName(leg.to)}
        </h4>
        <span className="shrink-0 text-xs text-ink-500">~{leg.km} km</span>
      </header>

      <ul className="divide-y divide-sand-200">
        {leg.options.map((o, i) => {
          const Icon = modeIcons[o.mode];
          return (
            <li key={o.label} className="grid grid-cols-[auto_1fr] gap-x-3 px-5 py-4">
              <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-lg bg-forest-50 text-forest-700">
                <Icon size={16} aria-hidden />
              </span>
              <div>
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-semibold text-ink-900">{o.label}</span>
                  {i === 0 && <span className="rounded bg-forest-800 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-sand-50">Recommended</span>}
                </p>
                <p className="mt-1 flex flex-wrap gap-x-4 text-sm tabular-nums text-ink-700">
                  <span>{formatHours(o.hours)}</span>
                  <span>{formatINR(o.cost)} <span className="text-ink-400">per {o.per}</span></span>
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{o.how}</p>
              </div>
            </li>
          );
        })}
      </ul>

      {(leg.tips.length > 0 || leg.estimated) && (
        <ul className="space-y-1.5 rounded-b-2xl bg-sand-100 px-5 py-3 text-sm text-ink-700">
          {leg.tips.map((t) => (
            <li key={t} className="flex gap-2"><Info size={15} className="mt-0.5 shrink-0 text-forest-600" aria-hidden />{t}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
