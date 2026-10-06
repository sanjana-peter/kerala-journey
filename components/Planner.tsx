"use client";

import { Download, FileText } from "lucide-react";
import { regions } from "@/lib/keralaData.ts";
import { DossierDocument } from "./DossierDocument";
import { DossierModal } from "./DossierModal";
import { EasterEgg } from "./EasterEgg";
import { Hero } from "./Hero";
import { LogisticsCard } from "./LogisticsCard";
import { PhraseFlip } from "./PhraseFlip";
import { RealityCheck } from "./RealityCheck";
import { Reveal } from "./Reveal";
import { SiteHeader } from "./SiteHeader";
import { SpiceMatrix } from "./SpiceMatrix";
import { SurvivalEssentials } from "./SurvivalEssentials";
import { TimeMachine } from "./TimeMachine";
import { useTrip } from "./TripContext";
import { TripWizard } from "./TripWizard";
import { Button, SectionHeading } from "./ui";
import { VibeCanvas } from "./VibeCanvas";

/**
 * The whole funnel on one page: Explore (vibes, seasons, spices) → Decide → Plan (logistics, phrases) → Export.
 * The ambient background and accent colours follow the mood set in the hero and vibe cards.
 */
export function Planner() {
  const { itinerary, generated, setDossierOpen } = useTrip();

  return (
    <>
      <div className="screen-only">
        <div aria-hidden className="ambient" />
        <SiteHeader />
        <Hero />
        <main className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 sm:pt-28">
          <div className="space-y-28 pb-24">
            <div>
              <VibeCanvas />
              <RealityCheck />
            </div>

            <TimeMachine />
            <SpiceMatrix />

            <Reveal><TripWizard /></Reveal>

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

            <PhraseFlip />

            <section id="export" className="scroll-mt-20">
              <SectionHeading step={4} eyebrow="Export" title="Take it with you">
                One document with your day-by-day plan, every transit leg, emergency numbers and a packing list for your month.
                Download it as Markdown, or print it to PDF.
              </SectionHeading>
              <div className="glass flex flex-col items-start gap-5 organic p-6 sm:flex-row sm:items-center">
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
        <EasterEgg />
      </div>

      {/* What the browser prints, whether from the dossier's Print button or Ctrl+P. */}
      <div className="print-only">
        {generated ? <DossierDocument itinerary={itinerary} /> : <p>Build a trip at Kerala Journey to print your dossier.</p>}
      </div>
    </>
  );
}
