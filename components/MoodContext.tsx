"use client";

import { createContext, useContext, useEffect, useState, type CSSProperties } from "react";
import { MotionConfig } from "motion/react";
import { moodOrder, moods, type Mood } from "@/lib/experience.ts";
import type { VibeId } from "@/lib/keralaData.ts";

/*
 * The theme engine. One mood (a region) is active at a time; hovering a region previews its mood, and
 * selecting one pins it. The mood's colours are written to CSS custom properties on a wrapper, and
 * globals.css registers them with @property so they morph smoothly instead of snapping.
 */

interface MoodState {
  mood: Mood;
  /** Temporarily show a mood (hover/focus). null returns to the pinned one. */
  preview: (id: VibeId | null) => void;
  /** Make a mood stick, and stop the hero's slow auto-cycle. */
  pin: (id: VibeId) => void;
  /** True until someone interacts; the hero cycles through moods meanwhile. */
  idle: boolean;
}

const MoodContext = createContext<MoodState | null>(null);

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const [pinned, setPinned] = useState<VibeId>("mist");
  const [previewing, setPreviewing] = useState<VibeId | null>(null);
  const [idle, setIdle] = useState(true);

  // Drift through the moods while nobody's touching anything (not with reduced motion).
  useEffect(() => {
    if (!idle || previewing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setPinned((p) => moodOrder[(moodOrder.indexOf(p) + 1) % moodOrder.length]), 7000);
    return () => clearInterval(t);
  }, [idle, previewing]);

  const mood = moods[previewing ?? pinned];
  const value: MoodState = {
    mood,
    preview: (id) => { setPreviewing(id); if (id) setIdle(false); },
    pin: (id) => { setPinned(id); setIdle(false); },
    idle,
  };

  const vars = {
    "--mood-accent": mood.accent,
    "--mood-wash": mood.wash,
    "--mood-glow-a": mood.glow[0],
    "--mood-glow-b": mood.glow[1],
  } as CSSProperties;

  return (
    <MoodContext.Provider value={value}>
      <MotionConfig reducedMotion="user">
        <div style={vars} className="mood-root">{children}</div>
      </MotionConfig>
    </MoodContext.Provider>
  );
}

export function useMood(): MoodState {
  const ctx = useContext(MoodContext);
  if (!ctx) throw new Error("useMood must be used inside <MoodProvider>");
  return ctx;
}
