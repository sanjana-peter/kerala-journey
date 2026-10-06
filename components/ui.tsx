import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Bus, Car, Route, Ship, Train, type LucideIcon } from "lucide-react";
import type { TransitMode } from "@/lib/keralaData.ts";

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "ghost" | "accent";

const variants: Record<Variant, string> = {
  primary: "bg-forest-800 text-sand-50 hover:bg-forest-700 disabled:bg-ink-400",
  accent: "bg-clay-600 text-white hover:bg-clay-700 disabled:bg-ink-400",
  secondary: "border border-sand-300 bg-sand-50 text-ink-900 hover:border-forest-600 hover:text-forest-800",
  ghost: "text-ink-700 hover:bg-sand-200 hover:text-ink-900",
};

export function Button({ variant = "primary", className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function SectionHeading({ step, eyebrow, title, children }: { step: number; eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-8 max-w-2xl">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] mood-accent">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-mood-accent text-[0.65rem] text-white">{step}</span>
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold text-forest-900 sm:text-4xl">{title}</h2>
      {children && <p className="mt-3 text-base leading-relaxed text-ink-700">{children}</p>}
    </header>
  );
}

export const modeIcons: Record<TransitMode, LucideIcon> = { cab: Car, bus: Bus, train: Train, ferry: Ship, combo: Route };
