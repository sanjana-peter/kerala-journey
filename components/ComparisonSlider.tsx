"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { photos, type PhotoId } from "@/lib/experience.ts";

/** Drag, tap or use the arrow keys to wipe between two photos. */
export function ComparisonSlider({ left, right, leftLabel, rightLabel }: { left: PhotoId; right: PhotoId; leftLabel: string; rightLabel: string }) {
  const [pos, setPos] = useState(50);

  return (
    <figure className="overflow-hidden organic">
      <div className="relative aspect-[16/10] w-full select-none sm:aspect-[21/9]">
        <Image src={photos[right].src} alt={photos[right].alt} fill sizes="(min-width: 1152px) 1152px, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={photos[left].src} alt={photos[left].alt} fill sizes="(min-width: 1152px) 1152px, 100vw" className="object-cover" />
        </div>

        <span className="glass-dark absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-semibold">{leftLabel}</span>
        <span className="glass-dark absolute right-4 top-4 rounded-full px-3 py-1 text-sm font-semibold">{rightLabel}</span>

        {/* Handle */}
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-sand-50/90 shadow-[0_0_12px_rgb(0_0_0/0.4)]" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-sand-50 text-forest-900 shadow-lg">
            <ChevronsLeftRight size={20} />
          </span>
        </div>

        {/* An invisible range input over the whole image does the dragging, keyboard and screen-reader work. */}
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare ${leftLabel} and ${rightLabel}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="flex flex-wrap justify-between gap-2 bg-forest-900 px-4 py-2 text-[0.7rem] text-sand-200">
        <span>{photos[left].title} · {photos[right].title}</span>
        <span>Photos: Kerala Tourism</span>
      </figcaption>
    </figure>
  );
}
