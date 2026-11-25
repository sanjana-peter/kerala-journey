"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CalendarCheck, Check, Plus, Route } from "lucide-react";
import { months, type VibeId } from "@/lib/keralaData.ts";
import { vibeOf } from "@/lib/explore.ts";
import { useMood } from "../MoodContext";
import { useTrip } from "../TripContext";
import { cx } from "../ui";

const pill = "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5";

/** Adds or removes a vibe from the trip, from any page. */
export function VibeToggle({ vibe }: { vibe: VibeId }) {
  const { input, toggleVibe } = useTrip();
  const on = input.vibes.includes(vibe);
  return (
    <>
      <button
        type="button"
        aria-pressed={on}
        onClick={() => toggleVibe(vibe)}
        className={cx(pill, on ? "bg-sand-50/20 text-sand-50 ring-1 ring-sand-50/60" : "bg-sand-50 text-forest-900")}
      >
        {on ? <Check size={16} strokeWidth={3} /> : <Plus size={16} />}
        {on ? `${vibeOf(vibe).name} is in your trip` : `Add ${vibeOf(vibe).name} to my trip`}
      </button>
      <BuildLink />
    </>
  );
}

/** Sets the trip's month and heads to the planner. */
export function PlanMonthButton({ month }: { month: number }) {
  const { input, update } = useTrip();
  const on = input.month === month;
  return (
    <>
      <button
        type="button"
        aria-pressed={on}
        onClick={() => update({ month })}
        className={cx(pill, on ? "bg-sand-50/20 text-sand-50 ring-1 ring-sand-50/60" : "bg-sand-50 text-forest-900")}
      >
        <CalendarCheck size={16} /> {on ? `Planning for ${months[month].name}` : `Plan my trip for ${months[month].name}`}
      </button>
      <BuildLink />
    </>
  );
}

export function BuildLink({ note }: { note?: string }) {
  return (
    <>
      <Link href="/#decide" className={cx(pill, "glass-dark hover:bg-forest-900/55")}>
        <Route size={16} /> Build the trip
      </Link>
      {note && <p className="text-sm text-sand-200">{note}</p>}
    </>
  );
}

/** Tints the page with a vibe's mood while you're on its page. */
export function PinMood({ vibe }: { vibe: VibeId }) {
  const { pin } = useMood();
  useEffect(() => { pin(vibe); }, [vibe]);
  return null;
}
