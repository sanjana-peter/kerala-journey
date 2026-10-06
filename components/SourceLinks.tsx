import type { Source } from "@/lib/sources.ts";
import { cx } from "./ui";

/** Small numbered links to where a fact was checked, e.g. "Sources: Kerala Tourism · Wikipedia". */
export function SourceLinks({ sources, className, tone = "light" }: { sources?: Source[]; className?: string; tone?: "light" | "dark" }) {
  if (!sources?.length) return null;
  const unique = sources.filter((s, i) => sources.findIndex((x) => x.url === s.url) === i);
  return (
    <p className={cx("text-[0.7rem] leading-snug", tone === "dark" ? "text-sand-200/80" : "text-ink-400", className)}>
      {unique.length > 1 ? "Sources: " : "Source: "}
      {unique.map((s, i) => (
        <span key={s.url}>
          {i > 0 && " · "}
          <a
            href={s.url}
            target="_blank"
            rel="noreferrer"
            title={s.kind === "official" ? "Official source" : s.kind === "guide" ? "Travel guide: re-check before relying on it" : undefined}
            className={cx("underline decoration-dotted underline-offset-2", tone === "dark" ? "hover:text-sand-50" : "hover:text-ink-700")}
          >
            {s.label}
          </a>
        </span>
      ))}
    </p>
  );
}
