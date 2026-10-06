"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Printer, X } from "lucide-react";
import { toMarkdown } from "@/lib/dossier.ts";
import { DossierDocument } from "./DossierDocument";
import { useTrip } from "./TripContext";
import { Button } from "./ui";

export function DossierModal() {
  const { itinerary, dossierOpen, setDossierOpen } = useTrip();
  const ref = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (dossierOpen && !d.open) d.showModal();
    if (!dossierOpen && d.open) d.close();
  }, [dossierOpen]);

  const filename = `kerala-dossier-${itinerary.input.days}d-${itinerary.stops.map((s) => s.region).join("-")}.md`;

  const download = () => {
    const blob = new Blob([toMarkdown(itinerary)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: filename });
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown(itinerary));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked: the download still works */ }
  };

  return (
    <dialog
      ref={ref}
      onClose={() => setDossierOpen(false)}
      onClick={(e) => { if (e.target === ref.current) setDossierOpen(false); }}
      aria-labelledby="dossier-title"
      className="m-auto h-[min(92vh,60rem)] w-[min(96vw,52rem)] overflow-hidden rounded-2xl bg-sand-50 p-0 text-ink-900 shadow-2xl"
    >
      <div className="flex h-full flex-col">
        <header className="border-b border-sand-200 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <h2 id="dossier-title" className="text-xl font-semibold text-forest-900">Your travel dossier</h2>
            <button type="button" onClick={() => setDossierOpen(false)} className="rounded-lg p-2 text-ink-500 hover:bg-sand-200" aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="accent" onClick={download}><Download size={16} /> Download My Travel Dossier</Button>
            <Button variant="secondary" onClick={() => window.print()}><Printer size={16} /> Print / PDF</Button>
            <Button variant="ghost" onClick={copy} aria-live="polite">
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy Markdown"}
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto bg-white px-6 py-8 sm:px-10">
          <DossierDocument itinerary={itinerary} />
        </div>
        <p className="border-t border-sand-200 px-5 py-2.5 text-xs text-ink-500">
          Download saves a Markdown file (opens in any notes app). For a PDF, choose Print, then &quot;Save as PDF&quot;.
        </p>
      </div>
    </dialog>
  );
}
