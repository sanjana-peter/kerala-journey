"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { useTrip } from "./TripContext";
import { cx } from "./ui";

const LINKS = [
  { href: "/#explore", label: "Explore" },
  { href: "/places", label: "Places" },
  { href: "/districts", label: "Districts" },
  { href: "/#seasons", label: "Seasons" },
  { href: "/#decide", label: "Decide" },
  { href: "/#plan", label: "Plan" },
  { href: "/#export", label: "Export" },
];

/** The phone menu also lists the deep-dive hubs, since there's no room for a second row of links. */
const MOBILE_EXTRA = [{ href: "/everyday", label: "Everyday Kerala" }];

/** Transparent over the hero photo, frosted glass once you scroll. */
export function SiteHeader() {
  const { generated, setDossierOpen } = useTrip();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the phone menu whenever the page changes, and on Escape.
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);
  const solid = scrolled || menuOpen;

  // Every page opens on a photo hero; the detail pages' heroes are shorter, so the header turns solid sooner.
  useEffect(() => {
    const at = pathname === "/" ? 0.6 : 0.35;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * at);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <header
      className={cx(
        "sticky top-0 z-30 border-b transition-[background-color,border-color,color,backdrop-filter] duration-500",
        solid ? "border-white/50 bg-sand-50/90 text-ink-900 backdrop-blur-xl" : "border-transparent bg-transparent text-sand-50",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="font-serif text-lg font-semibold">Kerala Journey</Link>
        <nav aria-label="Sections" className="ml-auto hidden md:block">
          <ol className="flex items-center gap-1 text-sm">
            {LINKS.map((f) => (
              <li key={f.href}>
                <Link href={f.href} aria-current={pathname !== "/" && f.href !== "/" && pathname.startsWith(f.href) ? "page" : undefined} className={cx("rounded-full px-3 py-1 font-medium transition-colors aria-[current=page]:underline aria-[current=page]:underline-offset-4", scrolled ? "text-ink-700 hover:bg-sand-200 hover:text-ink-900" : "text-sand-50/85 hover:bg-white/15 hover:text-sand-50")}>
                  {f.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <button
          type="button"
          className={cx(
            "ml-auto inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:ml-2",
            solid ? "bg-forest-800 text-sand-50 hover:bg-forest-700" : "bg-sand-50/20 text-sand-50 ring-1 ring-sand-50/40 hover:bg-sand-50/30",
          )}
          disabled={!generated}
          onClick={() => setDossierOpen(true)}
          title={generated ? undefined : "Build your trip first"}
          aria-label="Dossier"
        >
          <Download size={15} aria-hidden /> <span className="hidden sm:inline">Dossier</span>
        </button>
        <button
          type="button"
          className={cx("-mr-2 grid h-10 w-10 place-items-center rounded-full md:hidden", solid ? "hover:bg-sand-200" : "hover:bg-white/15")}
          aria-expanded={menuOpen}
          aria-controls="phone-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </div>

      {menuOpen && (
        <nav id="phone-menu" aria-label="Sections" className="border-t border-sand-200 bg-sand-50 px-4 pb-4 pt-2 shadow-lg md:hidden">
          <ul className="grid grid-cols-2 gap-1">
            {[...LINKS, ...MOBILE_EXTRA].map((f) => (
              <li key={f.href}>
                <Link
                  href={f.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname !== "/" && pathname.startsWith(f.href) ? "page" : undefined}
                  className="block rounded-xl px-3 py-3 font-medium text-ink-900 hover:bg-sand-200 aria-[current=page]:bg-sand-200"
                >
                  {f.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
