"use client";

import { CHECKED_ON } from "@/lib/sources.ts";
import { DossierDocument } from "./DossierDocument";
import { DossierModal } from "./DossierModal";
import { EasterEgg } from "./EasterEgg";
import { MoodProvider } from "./MoodContext";
import { SiteHeader } from "./SiteHeader";
import { TripProvider, useTrip } from "./TripContext";

/**
 * Everything every page shares: trip state and the mood theme (so they survive moving between pages),
 * the header, footer, dossier dialog, and the print-only dossier.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <TripProvider>
      <MoodProvider>
        <Frame>{children}</Frame>
      </MoodProvider>
    </TripProvider>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  const { itinerary, generated } = useTrip();
  return (
    <>
      <div className="screen-only">
        <div aria-hidden className="ambient" />
        <SiteHeader />
        {children}
        <footer className="border-t border-sand-200 py-8 text-center text-xs text-ink-500">
          Kerala Journey. Facts checked on {CHECKED_ON}, with sources linked throughout; fares are ballpark figures, so confirm locally.
          No sponsored listings.
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
