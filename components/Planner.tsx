"use client";

import { ArrowDown, Download, FileText } from "lucide-react";
import { legs, regions, vibes } from "@/lib/keralaData.ts";
import { DossierDocument } from "./DossierDocument";
import { DossierModal } from "./DossierModal";
import { LogisticsCard } from "./LogisticsCard";
import { RealityCheck } from "./RealityCheck";
import { SiteHeader } from "./SiteHeader";
import { SurvivalEssentials } from "./SurvivalEssentials";
import { useTrip } from "./TripContext";
import { TripWizard } from "./TripWizard";
import { Button, SectionHeading } from "./ui";
import { VibeSelector } from "./VibeSelector";

/** The whole funnel on one page: Explore → Decide → Plan → Export. */
export function Planner() {
  const { itinerary, generated, setDossierOpen } = useTrip();

  return (
    <>
      <div className="screen-only">
        <SiteHeader />
        <main id="top" className="mx-auto max-w-6xl px-4 sm:px-6">
          <Hero />

          <div className="space-y-24 pb-24">
            <div>
              <VibeSelector />
              <RealityCheck />
            </div>

            <TripWizard />

            <section id="plan" className="scroll-mt-20">
              <SectionHeading step={3} eyebrow="Plan" title="Getting between places">
                {generated
                  ? "Every leg of your route, with the realistic ways to do it: travel times, fares in ₹, and where to catch the bus."
                  : "Build your trip above and your transit legs appear here. The essentials below apply to any Kerala trip."}
              </SectionHeading>

              {generated && (
                <div className="mb-12 grid gap-4 md:grid-cols-2">
                  {itinerary.legs.map((l, i) => <LogisticsCard key={`${l.from}-${l.to}`} leg={l} index={i} />)}
                </div>
              )}

              <h3 className="mb-4 text-2xl font-semibold text-forest-900">Survival essentials</h3>
              <SurvivalEssentials />
            </section>

            <section id="export" className="scroll-mt-20">
              <SectionHeading step={4} eyebrow="Export" title="Take it with you">
                One document with your day-by-day plan, every transit leg, emergency numbers and a packing list for your month.
                Download it as Markdown, or print it to PDF.
              </SectionHeading>
              <div className="flex flex-col items-start gap-5 rounded-2xl border border-sand-200 bg-sand-50 p-6 sm:flex-row sm:items-center">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-clay-50 text-clay-600"><FileText size={26} /></span>
                <div className="flex-1">
                  <p className="font-semibold text-ink-900">
                    {generated ? `${itinerary.input.days}-day dossier: ${itinerary.stops.map((s) => regions[s.region].name).join(", ")}` : "No trip yet"}
                  </p>
                  <p className="text-sm text-ink-500">
                    {generated ? `${itinerary.days.length} days · ${itinerary.legs.length} transit legs · emergency numbers · packing list` : "Answer the three questions in Decide first."}
                  </p>
                </div>
                {generated ? (
                  <Button variant="accent" onClick={() => setDossierOpen(true)}><Download size={16} /> Download My Travel Dossier</Button>
                ) : (
                  <Button variant="secondary" onClick={() => document.getElementById("decide")?.scrollIntoView()}>Build my trip</Button>
                )}
              </div>
            </section>
          </div>
        </main>

        <footer className="border-t border-sand-200 py-8 text-center text-xs text-ink-500">
          Kerala Journey. Fares and times are ballpark figures; confirm locally. No sponsored listings.
        </footer>
        <DossierModal />
      </div>

      {/* What the browser prints, whether from the dossier's Print button or Ctrl+P. */}
      <div className="print-only">
        {generated ? <DossierDocument itinerary={itinerary} /> : <p>Build a trip at Kerala Journey to print your dossier.</p>}
      </div>
    </>
  );
}

function Hero() {
  return (
    <section className="py-14 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay-600">Kerala trip planner</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.08] text-forest-900 sm:text-6xl">
        Plan Kerala properly. Skip the brochure.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-700">
        Pick a vibe and tell us your days and who&apos;s coming. You get a route that never doubles back, honest transit
        times and fares, and a dossier you can print.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button onClick={() => document.getElementById("explore")?.scrollIntoView()} className="px-5 py-3 text-base">
          Start with a vibe <ArrowDown size={18} />
        </Button>
        <dl className="flex gap-6 text-sm">
          <Stat n={vibes.length} label="trip vibes" />
          <Stat n={Object.keys(regions).length} label="bases" />
          <Stat n={legs.length} label="transit legs" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="sr-only">{label}</dt>
      <dd className="font-serif text-2xl font-semibold text-forest-800">{n}</dd>
      <span className="text-ink-500" aria-hidden>{label}</span>
    </div>
  );
}
