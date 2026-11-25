import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Item = { href: string; label: string; sub?: string };

/** Previous and next links at the foot of a deep-dive page, so you can keep exploring sideways. */
export function PrevNext({ prev, next, label }: { prev: Item; next: Item; label: string }) {
  return (
    <nav aria-label={label} className="grid gap-3 sm:grid-cols-2">
      {[{ ...prev, dir: "prev" as const }, { ...next, dir: "next" as const }].map((x) => (
        <Link
          key={x.dir}
          href={x.href}
          className={`glass group flex items-center gap-4 organic px-5 py-4 transition-transform hover:-translate-y-0.5 ${x.dir === "next" ? "sm:flex-row-reverse sm:text-right" : ""}`}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mood-accent text-white">
            {x.dir === "prev" ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
          </span>
          <span>
            <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">{x.dir === "prev" ? "Previous" : "Next"}{x.sub ? ` · ${x.sub}` : ""}</span>
            <span className="block font-serif text-xl font-semibold text-forest-900">{x.label}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}

/** Section heading for the deep-dive pages. */
export function DetailHeading({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <header className="mb-6 max-w-2xl">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] mood-accent">{eyebrow}</p>
      <h2 id={id} className="text-3xl font-semibold text-forest-900">{title}</h2>
      {children && <p className="mt-2 leading-relaxed text-ink-700">{children}</p>}
    </header>
  );
}
