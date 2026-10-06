import { Phone, Plug, ShieldAlert, Users, Wallet, type LucideIcon } from "lucide-react";
import { emergencyContacts, essentials } from "@/lib/keralaData.ts";
import { SourceLinks } from "./SourceLinks";

const icons: Record<string, LucideIcon> = { money: Wallet, power: Plug, scams: ShieldAlert, customs: Users };

export function SurvivalEssentials() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <article className="organic bg-forest-800 p-5 text-sand-50 lg:row-span-2">
        <h4 className="flex items-center gap-2 font-serif text-lg font-semibold">
          <Phone size={18} aria-hidden /> Emergency numbers
        </h4>
        <p className="mt-1 text-sm text-forest-100">Save these before you land.</p>
        <ul className="mt-4 divide-y divide-forest-700">
          {emergencyContacts.map((c) => (
            <li key={c.number} className="flex items-baseline justify-between gap-3 py-2.5">
              <span className="text-sm">
                {c.label}
                {c.note && <span className="block text-xs text-forest-200">{c.note}</span>}
              </span>
              <a href={`tel:${c.number.replace(/-/g, "")}`} className="shrink-0 font-mono text-lg font-semibold tabular-nums text-white underline-offset-4 hover:underline">
                {c.number}
              </a>
            </li>
          ))}
        </ul>
        <SourceLinks sources={emergencyContacts.map((c) => c.source)} tone="dark" className="mt-3" />
      </article>

      {essentials.map((sec) => {
        const Icon = icons[sec.id] ?? ShieldAlert;
        const warn = sec.id === "scams";
        return (
          <article key={sec.id} className={warn ? "organic border border-clay-100 bg-clay-50/80 p-5 backdrop-blur-xl lg:col-span-2" : "glass organic p-5"}>
            <h4 className={`flex items-center gap-2 font-serif text-lg font-semibold ${warn ? "text-clay-700" : "text-forest-900"}`}>
              <Icon size={18} aria-hidden /> {sec.title}
            </h4>
            <dl className={warn ? "mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2" : "mt-3 space-y-3"}>
              {sec.items.map((i) => (
                <div key={i.h}>
                  <dt className="text-sm font-semibold text-ink-900">{i.h}</dt>
                  <dd className="text-sm leading-relaxed text-ink-700">{i.p}</dd>
                </div>
              ))}
            </dl>
            <SourceLinks sources={sec.sources} className="mt-3" />
          </article>
        );
      })}
    </div>
  );
}
