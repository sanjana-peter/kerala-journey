"use client";

import { Download } from "lucide-react";
import { useTrip } from "./TripContext";
import { Button } from "./ui";

const FUNNEL = [
  { href: "#explore", label: "Explore" },
  { href: "#decide", label: "Decide" },
  { href: "#plan", label: "Plan" },
  { href: "#export", label: "Export" },
];

export function SiteHeader() {
  const { generated, setDossierOpen } = useTrip();
  return (
    <header className="sticky top-0 z-30 border-b border-sand-200 bg-sand-100/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href="#top" className="font-serif text-lg font-semibold text-forest-900">Kerala Journey</a>
        <nav aria-label="Planner steps" className="ml-auto hidden md:block">
          <ol className="flex items-center gap-1 text-sm">
            {FUNNEL.map((f, i) => (
              <li key={f.href} className="flex items-center gap-1">
                {i > 0 && <span className="text-sand-300" aria-hidden>→</span>}
                <a href={f.href} className="rounded-md px-2 py-1 font-medium text-ink-700 hover:bg-sand-200 hover:text-ink-900">{f.label}</a>
              </li>
            ))}
          </ol>
        </nav>
        <Button variant="primary" className="ml-auto px-3 py-1.5 md:ml-2" disabled={!generated} onClick={() => setDossierOpen(true)}
          title={generated ? undefined : "Build your trip first"}>
          <Download size={15} /> <span className="hidden sm:inline">Dossier</span>
        </Button>
      </div>
    </header>
  );
}
