"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { realityCheck } from "@/lib/keralaData.ts";
import { cx } from "./ui";

export function RealityCheck() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-labelledby="reality-title" className="mt-14 grid gap-8 lg:grid-cols-[1fr_2fr]">
      <div>
        <h3 id="reality-title" className="text-2xl font-semibold text-forest-900">Is Kerala for you?</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">
          The honest version: what tourism brochures leave out. Better to read it now than find out on a hairpin bend.
        </p>
      </div>

      <ul className="glass divide-y divide-sand-200/70 overflow-hidden organic">
        {realityCheck.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={item.q}>
              <h4>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`reality-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[0.95rem] font-semibold text-ink-900 hover:bg-white/50"
                >
                  {item.q}
                  <ChevronDown size={18} className={cx("shrink-0 text-ink-400 transition-transform", isOpen && "rotate-180")} aria-hidden />
                </button>
              </h4>
              <div id={`reality-${i}`} hidden={!isOpen} className="px-5 pb-5 text-sm leading-relaxed text-ink-700">
                {item.a}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
