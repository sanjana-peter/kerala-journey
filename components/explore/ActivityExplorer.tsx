"use client";

import { useState } from "react";
import { CalendarX, Clock, Sunrise, Ticket, TriangleAlert, Users, Wallet } from "lucide-react";
import { formatMonths } from "@/lib/explore.ts";
import { months, type Activity, type Traveler } from "@/lib/keralaData.ts";
import { travelerLabels } from "@/lib/planner.ts";
import { SourceLinks } from "../SourceLinks";
import { useTrip } from "../TripContext";
import { cx } from "../ui";

const TRAVELERS: Traveler[] = ["solo", "couple", "family", "friends"];

/** Why an activity doesn't fit, matching the planner's own rules. */
function ruledOut(a: Activity, who: Traveler | null, month: number | null): string | null {
  if (who && a.avoidFor?.includes(who)) return `Not suited to ${travelerLabels[who].toLowerCase()}`;
  if (month !== null && a.closedMonths?.includes(month)) return `Usually closed or unsafe in ${months[month].name}`;
  return null;
}

/**
 * Everything to do in a place, filterable by who's travelling and the month. Starts from the trip's own
 * month (if set), so the page answers "what can I do when I'm there?".
 */
export function ActivityExplorer({ activities }: { activities: Activity[] }) {
  const { input } = useTrip();
  const [who, setWho] = useState<Traveler | null>(null);
  const [month, setMonth] = useState<number | null | "trip">("trip");
  const m = month === "trip" ? input.month : month;

  const rows = activities.map((a) => ({ a, out: ruledOut(a, who, m) }));
  const fits = rows.filter((r) => !r.out).length;

  return (
    <div>
      <div className="glass mb-5 flex flex-col gap-3 organic p-4 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Who's travelling">
          <Users size={15} className="mr-1 text-ink-500" aria-hidden />
          {[null, ...TRAVELERS].map((t) => (
            <button
              key={t ?? "any"}
              type="button"
              aria-pressed={who === t}
              onClick={() => setWho(t)}
              className={cx("rounded-full px-3 py-1 text-sm font-medium capitalize transition-colors", who === t ? "bg-forest-900 text-sand-50" : "text-ink-700 hover:bg-sand-200")}
            >
              {t ?? "Anyone"}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-700 sm:ml-auto">
          <CalendarX size={15} className="text-ink-500" aria-hidden />
          <span className="sr-only">Month</span>
          <select
            value={m ?? ""}
            onChange={(e) => setMonth(e.target.value === "" ? null : Number(e.target.value))}
            className="rounded-lg border border-sand-300 bg-sand-50 px-2 py-1 text-sm"
          >
            <option value="">Any month</option>
            {months.map((mo, i) => <option key={mo.name} value={i}>{mo.name}</option>)}
          </select>
        </label>
      </div>

      <p className="mb-4 text-sm text-ink-500" aria-live="polite">
        {fits === activities.length ? `All ${activities.length} fit` : `${fits} of ${activities.length} fit`}
        {who ? ` ${travelerLabels[who].toLowerCase()}` : ""}
        {m !== null ? ` in ${months[m].name}` : ""}.
      </p>

      <ul className="grid gap-4 md:grid-cols-2">
        {rows.map(({ a, out }) => {
          const cautions = Object.entries(a.cautionFor ?? {}) as [Traveler, string][];
          const shown = who ? cautions.filter(([t]) => t === who) : cautions;
          return (
            <li key={a.id} className={cx("glass flex flex-col organic p-5 transition-opacity duration-300", out && "opacity-55")}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-xl font-semibold leading-snug text-ink-900">{a.name}</h3>
                {a.overnight && <span className="shrink-0 rounded bg-forest-800 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-sand-50">Overnight</span>}
              </div>
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-500">
                <span className="flex items-center gap-1"><Sunrise size={14} aria-hidden /> {a.when}</span>
                <span className="flex items-center gap-1"><Clock size={14} aria-hidden /> ~{a.hours} h</span>
                {a.cost && <span className="flex items-center gap-1"><Wallet size={14} aria-hidden /> {a.cost}</span>}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">{a.note}</p>
              {a.booking && <p className="mt-3 flex gap-2 text-sm text-ink-700"><Ticket size={15} className="mt-0.5 shrink-0 text-forest-600" aria-hidden /> {a.booking}</p>}
              {a.closedMonths && (
                <p className="mt-2 flex gap-2 text-sm text-ink-700"><CalendarX size={15} className="mt-0.5 shrink-0 text-clay-600" aria-hidden /> Off in {formatMonths(a.closedMonths)}</p>
              )}
              {shown.map(([t, why]) => (
                <p key={t} className="mt-2 flex gap-2 text-sm text-clay-700"><TriangleAlert size={15} className="mt-0.5 shrink-0" aria-hidden /> <span><b className="capitalize">{t}:</b> {why}</span></p>
              ))}
              {!who && a.avoidFor && (
                <p className="mt-2 flex gap-2 text-sm text-clay-700"><TriangleAlert size={15} className="mt-0.5 shrink-0" aria-hidden /> Not for {a.avoidFor.map((t) => travelerLabels[t].toLowerCase()).join(" or ")}</p>
              )}
              <div className="mt-auto pt-3">
                {out && <p className="mb-2 inline-block rounded-full bg-clay-50 px-2.5 py-0.5 text-xs font-semibold text-clay-700">{out}</p>}
                <SourceLinks sources={a.sources} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
