"use client";

import { ArrowLeft, ArrowRight, Baby, Download, Heart, RotateCcw, User, Users, type LucideIcon } from "lucide-react";
import { months, vibes, type Pace, type Traveler, type TripLength } from "@/lib/keralaData.ts";
import { travelerLabels } from "@/lib/planner.ts";
import { ItineraryView } from "./ItineraryView";
import { useTrip, type WizardStep } from "./TripContext";
import { Button, cx, SectionHeading } from "./ui";

const LENGTHS: { days: TripLength; label: string; hint: string }[] = [
  { days: 3, label: "3 days", hint: "One region, maybe two" },
  { days: 5, label: "5 days", hint: "Two regions" },
  { days: 7, label: "7 days", hint: "The classic loop" },
  { days: 10, label: "10+ days", hint: "Hills, water and coast" },
];

const PACES: { id: Pace; label: string; hint: string }[] = [
  { id: "relaxed", label: "Relaxed", hint: "2–3 nights per stop, afternoons free, no 5 am alarms unless worth it." },
  { id: "packed", label: "Packed", hint: "More stops and full days. Early starts and longer drives." },
];

const TRAVELERS: { id: Traveler; icon: LucideIcon; hint: string }[] = [
  { id: "solo", icon: User, hint: "Flags pricey private houseboats; keeps treks and surf." },
  { id: "couple", icon: Heart, hint: "Everything on the table. Houseboat night included." },
  { id: "family", icon: Baby, hint: "Drops hard treks, flags steep climbs, rough jeeps and strong surf." },
  { id: "friends", icon: Users, hint: "Treks, surf and jeep safaris stay in; cost splits well." },
];

const STEPS: { n: WizardStep; label: string }[] = [
  { n: 1, label: "Duration & pace" },
  { n: 2, label: "Who's going" },
  { n: 3, label: "Your itinerary" },
];

export function TripWizard() {
  const { input, update, step, setStep, setDossierOpen, reset } = useTrip();
  const pickedVibes = vibes.filter((v) => input.vibes.includes(v.id));

  const go = (s: WizardStep) => {
    setStep(s);
    document.getElementById("decide")?.scrollIntoView();
  };

  return (
    <section id="decide" className="scroll-mt-20">
      <SectionHeading step={2} eyebrow="Decide" title="Build the trip">
        Three questions. The route follows the map (hills, then water, then coast), so you never cross the state twice.
      </SectionHeading>

      <div className="overflow-hidden rounded-2xl border border-sand-200 bg-sand-50">
        {/* Step indicator */}
        <ol className="flex border-b border-sand-200 text-sm">
          {STEPS.map((s) => {
            const active = step === s.n;
            const done = step > s.n;
            return (
              <li key={s.n} className="flex-1">
                <button
                  type="button"
                  onClick={() => (s.n < step ? go(s.n) : undefined)}
                  disabled={s.n > step}
                  aria-current={active ? "step" : undefined}
                  className={cx(
                    "flex w-full items-center justify-center gap-2 px-2 py-3.5 font-medium sm:justify-start sm:px-5",
                    active ? "bg-forest-800 text-sand-50" : done ? "text-forest-700 hover:bg-sand-100" : "text-ink-400",
                  )}
                >
                  <span className={cx("grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold", active ? "bg-sand-50 text-forest-800" : done ? "bg-forest-100 text-forest-800" : "bg-sand-200")}>
                    {s.n}
                  </span>
                  <span className={cx(!active && "hidden sm:inline")}>{s.label}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="p-5 sm:p-8">
          {step === 1 && (
            <div className="space-y-8">
              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-ink-900">How long?</legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {LENGTHS.map((l) => (
                    <Choice key={l.days} on={input.days === l.days} onClick={() => update({ days: l.days })} title={l.label} hint={l.hint} />
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-ink-900">What pace?</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {PACES.map((p) => (
                    <Choice key={p.id} on={input.pace === p.id} onClick={() => update({ pace: p.id })} title={p.label} hint={p.hint} />
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-1 text-sm font-semibold text-ink-900">
                  When? <span className="font-normal text-ink-500">(optional: tunes closures, weather warnings and packing)</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill on={input.month === null} onClick={() => update({ month: null })}>Not sure yet</Pill>
                  {months.map((m, i) => (
                    <Pill key={m.short} on={input.month === i} onClick={() => update({ month: i })} tone={m.climate === "monsoon" ? "wet" : undefined}>
                      {m.short}
                    </Pill>
                  ))}
                </div>
                {input.month !== null && <p className="mt-3 text-sm text-ink-700">{months[input.month].note}</p>}
              </fieldset>

              <div className="rounded-xl bg-sand-100 px-4 py-3 text-sm text-ink-700">
                <span className="font-semibold text-ink-900">Vibes: </span>
                {pickedVibes.length ? pickedVibes.map((v) => v.name).join(" + ") : "none picked, so you'll get the classic Mist + Backwaters"}
                {" · "}
                <a href="#explore" className="font-medium text-forest-700 underline underline-offset-2">change</a>
              </div>

              <Nav next={() => go(2)} nextLabel="Next: who's going" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-ink-900">Who's travelling?</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {TRAVELERS.map((t) => {
                    const Icon = t.icon;
                    return (
                      <Choice
                        key={t.id}
                        on={input.traveler === t.id}
                        onClick={() => update({ traveler: t.id })}
                        title={travelerLabels[t.id]}
                        hint={t.hint}
                        icon={<Icon size={18} />}
                      />
                    );
                  })}
                </div>
              </fieldset>
              <Nav back={() => go(1)} next={() => go(3)} nextLabel="Build my itinerary" />
            </div>
          )}

          {step === 3 && (
            <div>
              <ItineraryView />
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-sand-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => go(2)}><ArrowLeft size={16} /> Adjust</Button>
                  <Button variant="ghost" onClick={() => { reset(); document.getElementById("explore")?.scrollIntoView(); }}>
                    <RotateCcw size={16} /> Start over
                  </Button>
                </div>
                <Button variant="accent" onClick={() => setDossierOpen(true)}><Download size={16} /> Download My Travel Dossier</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Choice({ on, onClick, title, hint, icon }: { on: boolean; onClick: () => void; title: string; hint: string; icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cx(
        "flex h-full flex-col rounded-xl border-2 px-4 py-3 text-left transition-colors",
        on ? "border-forest-700 bg-forest-50" : "border-sand-200 bg-white/60 hover:border-sand-300",
      )}
    >
      <span className="flex items-center gap-2 font-semibold text-ink-900">
        {icon && <span className={on ? "text-forest-700" : "text-ink-400"}>{icon}</span>}
        {title}
      </span>
      <span className="mt-1 text-[0.8rem] leading-snug text-ink-500">{hint}</span>
    </button>
  );
}

function Pill({ on, onClick, children, tone }: { on: boolean; onClick: () => void; children: React.ReactNode; tone?: "wet" }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cx(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        on ? "border-forest-800 bg-forest-800 text-sand-50" : "border-sand-300 bg-white/60 text-ink-700 hover:border-forest-600",
        !on && tone === "wet" && "border-dashed",
      )}
      title={tone === "wet" ? "Monsoon" : undefined}
    >
      {children}
    </button>
  );
}

function Nav({ back, next, nextLabel }: { back?: () => void; next: () => void; nextLabel: string }) {
  return (
    <div className="flex items-center justify-between border-t border-sand-200 pt-6">
      {back ? <Button variant="ghost" onClick={back}><ArrowLeft size={16} /> Back</Button> : <span />}
      <Button onClick={next}>{nextLabel} <ArrowRight size={16} /></Button>
    </div>
  );
}
