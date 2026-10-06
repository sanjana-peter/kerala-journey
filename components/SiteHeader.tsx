"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { useTrip } from "./TripContext";
import { cx } from "./ui";

const LINKS = [
  { href: "#explore", label: "Explore" },
  { href: "#seasons", label: "Seasons" },
  { href: "#decide", label: "Decide" },
  { href: "#plan", label: "Plan" },
  { href: "#export", label: "Export" },
];

/** Transparent over the hero photo, frosted glass once you scroll. */
export function SiteHeader() {
  const { generated, setDossierOpen } = useTrip();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cx(
        "sticky top-0 z-30 border-b transition-[background-color,border-color,color,backdrop-filter] duration-500",
        scrolled ? "border-white/50 bg-sand-50/70 text-ink-900 backdrop-blur-xl" : "border-transparent bg-transparent text-sand-50",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href="#top" className="font-serif text-lg font-semibold">Kerala Journey</a>
        <nav aria-label="Sections" className="ml-auto hidden md:block">
          <ol className="flex items-center gap-1 text-sm">
            {LINKS.map((f) => (
              <li key={f.href}>
                <a href={f.href} className={cx("rounded-full px-3 py-1 font-medium transition-colors", scrolled ? "text-ink-700 hover:bg-sand-200 hover:text-ink-900" : "text-sand-50/85 hover:bg-white/15 hover:text-sand-50")}>
                  {f.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <button
          type="button"
          className={cx(
            "ml-auto inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:ml-2",
            scrolled ? "bg-forest-800 text-sand-50 hover:bg-forest-700" : "bg-sand-50/20 text-sand-50 ring-1 ring-sand-50/40 hover:bg-sand-50/30",
          )}
          disabled={!generated}
          onClick={() => setDossierOpen(true)}
          title={generated ? undefined : "Build your trip first"}
        >
          <Download size={15} /> <span className="hidden sm:inline">Dossier</span>
        </button>
      </div>
    </header>
  );
}
