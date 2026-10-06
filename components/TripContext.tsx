"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { VibeId } from "@/lib/keralaData.ts";
import { buildItinerary, DEFAULT_INPUT, type Itinerary, type TripInput } from "@/lib/planner.ts";

export type WizardStep = 1 | 2 | 3;

interface TripState {
  input: TripInput;
  update: (patch: Partial<TripInput>) => void;
  toggleVibe: (id: VibeId) => void;
  step: WizardStep;
  setStep: (step: WizardStep) => void;
  /** True once the traveller has reached the itinerary step at least once. */
  generated: boolean;
  itinerary: Itinerary;
  dossierOpen: boolean;
  setDossierOpen: (open: boolean) => void;
  reset: () => void;
}

const TripContext = createContext<TripState | null>(null);
const STORAGE_KEY = "kerala-journey:trip:v1";

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState<TripInput>({ ...DEFAULT_INPUT, vibes: [] });
  const [step, setStepState] = useState<WizardStep>(1);
  const [generated, setGenerated] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Restore the last trip from this browser. Storage can be missing or blocked; the app works without it.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved?.input) {
        setInput({ ...DEFAULT_INPUT, ...saved.input });
        setGenerated(Boolean(saved.generated));
        if (saved.generated) setStepState(3);
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ input, generated })); } catch { /* ignore */ }
  }, [input, generated, loaded]);

  const itinerary = useMemo(() => buildItinerary(input), [input]);

  const value: TripState = {
    input,
    update: (patch) => setInput((prev) => ({ ...prev, ...patch })),
    toggleVibe: (id) =>
      setInput((prev) => ({ ...prev, vibes: prev.vibes.includes(id) ? prev.vibes.filter((v) => v !== id) : [...prev.vibes, id] })),
    step,
    setStep: (s) => {
      setStepState(s);
      if (s === 3) setGenerated(true);
    },
    generated,
    itinerary,
    dossierOpen,
    setDossierOpen,
    reset: () => {
      setInput({ ...DEFAULT_INPUT, vibes: [] });
      setStepState(1);
      setGenerated(false);
    },
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip(): TripState {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used inside <TripProvider>");
  return ctx;
}
