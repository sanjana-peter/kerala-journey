"use client";

import { Fragment } from "react";
import { BedDouble, ChevronDown, Clock, Plane, TriangleAlert } from "lucide-react";
import { regions } from "@/lib/keralaData.ts";
import { placeName, totalTravelHours } from "@/lib/planner.ts";
import { formatHours, formatINR, tripSummary } from "@/lib/dossier.ts";
import { useTrip } from "./TripContext";
import { cx, modeIcons } from "./ui";

export function ItineraryView() {
  const { itinerary: it } = useTrip();
  const [roadLo, roadHi] = totalTravelHours(it);

  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="text-2xl font-semibold text-forest-900">Your route</h3>
        <p className="text-sm text-ink-500">{tripSummary(it)} · ~{Math.round(roadLo)}–{Math.round(roadHi)} h on the road</p>
      </div>

      {/* Route strip: airport → stops → airport, with leg times between */}
      <ol className="mt-5 flex flex-col gap-0 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-y-3">
        <RouteNode label={placeName(it.arrival)} sub="Fly in" airport />
        {it.stops.map((s, i) => (
          <Fragment key={s.region}>
            <RouteLeg hours={it.legs[i].options[0].hours} />
            <RouteNode label={regions[s.region].name} sub={`${s.nights} night${s.nights > 1 ? "s" : ""}`} />
          </Fragment>
        ))}
        <RouteLeg hours={it.legs[it.legs.length - 1].options[0].hours} />
        <RouteNode label={placeName(it.departure)} sub="Fly out" airport />
      </ol>

      {it.warnings.length > 0 && (
        <ul className="mt-6 space-y-2 rounded-xl border border-clay-100 bg-clay-50 p-4 text-sm text-clay-700">
          {it.warnings.map((w) => (
            <li key={w} className="flex gap-2">
              <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden />
              <span>{w}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Day by day */}
      <ol className="mt-8 space-y-4">
        {it.days.map((d) => {
          const travel = d.travel;
          const TravelIcon = travel ? modeIcons[travel.options[0].mode] : null;
          return (
            <li key={d.day} className="rounded-xl border border-sand-200 bg-white/70">
              <div className="flex items-baseline gap-3 border-b border-sand-200 px-4 py-3 sm:px-5">
                <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-clay-600">Day {d.day}</span>
                <h4 className="font-serif text-lg font-semibold text-ink-900">{d.title}</h4>
              </div>
              <div className="space-y-3 px-4 py-4 sm:px-5">
                {travel && TravelIcon && (
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-sand-100 px-3 py-2 text-sm text-ink-700">
                    <TravelIcon size={16} className="text-forest-700" aria-hidden />
                    <span className="font-medium text-ink-900">{travel.options[0].label}</span>
                    <span className="flex items-center gap-1"><Clock size={14} aria-hidden /> {formatHours(travel.options[0].hours)}</span>
                    <span>{formatINR(travel.options[0].cost)} / {travel.options[0].per}</span>
                    <a href={`#leg-${travel.from}-${travel.to}`} className="ml-auto text-xs font-medium text-forest-700 underline underline-offset-2">
                      other ways
                    </a>
                  </p>
                )}

                {d.items.map((a) => (
                  <div key={a.id} className="grid gap-1 sm:grid-cols-[6.5rem_1fr] sm:gap-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-ink-400 sm:pt-0.5">
                      {a.when} · {a.hours} h
                    </div>
                    <div>
                      <p className="font-semibold text-ink-900">{a.name}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-ink-700">{a.note}</p>
                      {(a.cost || a.booking) && (
                        <p className="mt-1 text-xs text-ink-500">
                          {a.cost && <span className="mr-4"><span className="font-semibold text-ink-700">Cost</span> {a.cost}</span>}
                          {a.booking && <span><span className="font-semibold text-ink-700">Book</span> {a.booking}</span>}
                        </p>
                      )}
                      {a.caution && (
                        <p className="mt-1.5 flex gap-1.5 text-xs font-medium text-clay-700">
                          <TriangleAlert size={14} className="mt-px shrink-0" aria-hidden /> {a.caution}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {d.note && <p className="text-sm italic text-ink-500">{d.note}</p>}

                <p className="flex items-center gap-1.5 text-xs text-ink-500">
                  {d.base ? (
                    <><BedDouble size={14} aria-hidden /> Sleep in {regions[d.base].name}</>
                  ) : (
                    <><Plane size={14} aria-hidden /> Departure day</>
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {it.skipped.length > 0 && (
        <details className="group mt-6 rounded-xl border border-sand-200 bg-sand-100/60 px-4 py-3 text-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink-700">
            Left out of your plan ({it.skipped.length}), and why
            <ChevronDown size={16} className="transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <ul className="mt-3 space-y-1 text-ink-500">
            {it.skipped.map((s) => (
              <li key={s.name}>
                <span className="text-ink-900">{s.name}</span> ({regions[s.region].name}): {s.reason}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function RouteNode({ label, sub, airport }: { label: string; sub: string; airport?: boolean }) {
  return (
    <li className={cx("rounded-lg border px-3 py-2", airport ? "border-dashed border-sand-300 bg-transparent" : "border-forest-200 bg-forest-50")}>
      <span className="flex items-center gap-1.5 text-sm font-semibold text-ink-900">
        {airport && <Plane size={14} className="text-ink-400" aria-hidden />}
        {label}
      </span>
      <span className={cx("block text-xs", airport ? "text-ink-400" : "font-medium text-forest-700")}>{sub}</span>
    </li>
  );
}

function RouteLeg({ hours }: { hours: [number, number] }) {
  return (
    <li aria-hidden className="flex items-center gap-2 py-1 pl-4 text-xs text-ink-400 sm:px-2 sm:py-0 sm:pl-2">
      <span className="h-4 w-px bg-sand-300 sm:h-px sm:w-4" />
      {formatHours(hours)}
      <span className="h-4 w-px bg-sand-300 sm:h-px sm:w-4" />
    </li>
  );
}
