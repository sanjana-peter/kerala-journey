import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Photo } from "@/lib/experience.ts";

/**
 * The top of every deep-dive page: a photo (or a colour wash when there's no photo), breadcrumbs,
 * the title, and room for chips and actions underneath.
 */
export function DetailHero({
  photo, tint = "#1f3d2b", crumbs, eyebrow, title, titleLang, lede, children, actions, art,
}: {
  photo?: Photo;
  /** Colour behind the copy; the whole background when there's no photo. */
  tint?: string;
  crumbs: { href: string; label: string }[];
  eyebrow: React.ReactNode;
  title: string;
  titleLang?: string;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  /** Buttons under the chips. */
  actions?: React.ReactNode;
  /** Decoration behind the copy, for heroes without a photo. */
  art?: React.ReactNode;
}) {
  return (
    <section className="relative isolate -mt-14 flex min-h-[64svh] items-end overflow-hidden pt-24 text-sand-50" style={{ backgroundColor: tint }}>
      {photo && <Image src={photo.src} alt={photo.alt} fill priority sizes="100vw" className="-z-20 object-cover" />}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900/90 via-forest-900/30 to-forest-900/55" />
      {art && <div aria-hidden className="absolute inset-0 -z-10">{art}</div>}
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: `linear-gradient(100deg, ${tint}cc 0%, ${tint}66 45%, transparent 85%)` }} />

      <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-sand-200">
            <li><Link href="/" className="hover:text-sand-50">Home</Link></li>
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-1">
                <ChevronRight size={12} aria-hidden />
                <Link href={c.href} className="hover:text-sand-50">{c.label}</Link>
              </li>
            ))}
          </ol>
        </nav>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-200">{eyebrow}</p>
        <h1 lang={titleLang} className="mt-3 max-w-3xl text-5xl font-semibold leading-[1.02] sm:text-7xl">{title}</h1>
        {lede && <div className="mt-4 max-w-2xl font-serif text-xl leading-snug text-sand-50/95 sm:text-2xl">{lede}</div>}
        {children && <div className="mt-6 flex flex-wrap items-center gap-2">{children}</div>}
        {actions && <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div>}
        {photo && (
          <p className="mt-6 text-[0.7rem] text-sand-200/80">
            <a href={photo.source} target="_blank" rel="noreferrer" className="hover:text-sand-50">{photo.title} · Photo: {photo.credit}</a>
          </p>
        )}
      </div>
    </section>
  );
}

/** A pill in the hero: a fact, or a link when given an href. */
export function HeroChip({ href, children }: { href?: string; children: React.ReactNode }) {
  const cls = "glass-dark inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm";
  return href ? <Link href={href} className={`${cls} transition-colors hover:bg-forest-900/55`}>{children}</Link> : <span className={cls}>{children}</span>;
}
