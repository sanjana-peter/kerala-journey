import { emergencyContacts, essentials, gateways, regions } from "@/lib/keralaData.ts";
import { placeName, type Itinerary } from "@/lib/planner.ts";
import { dossierSources, formatOption, packingList, routeLine, tripSummary } from "@/lib/dossier.ts";
import { CHECKED_ON } from "@/lib/sources.ts";

/** The dossier as a plain, print-friendly document. Same sections as the Markdown download. */
export function DossierDocument({ itinerary: it }: { itinerary: Itinerary }) {
  return (
    <article className="dossier space-y-7 text-[0.9rem] leading-relaxed text-ink-900">
      <header className="border-b-2 border-forest-800 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-clay-600">Kerala Journey · Travel dossier</p>
        <h1 className="mt-1 text-3xl font-semibold text-forest-900">My Kerala trip</h1>
        <p className="mt-1 font-medium">{tripSummary(it)}</p>
        <p className="mt-2 text-ink-700">{routeLine(it)}</p>
        <p className="text-ink-700">Fly in: {gateways[it.arrival].name}. Fly out: {gateways[it.departure].name}.</p>
      </header>

      {it.warnings.length > 0 && (
        <section>
          <H2>Before you book</H2>
          <ul className="list-disc space-y-1 pl-5">{it.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
        </section>
      )}

      <section>
        <H2>Where you stay</H2>
        <ul className="space-y-1">
          {it.stops.map((s) => (
            <li key={s.region}><b>{regions[s.region].name}</b> ({regions[s.region].area}), {s.nights} night{s.nights > 1 ? "s" : ""}. {regions[s.region].stayTip}</li>
          ))}
        </ul>
      </section>

      <section>
        <H2>Day by day</H2>
        <ol className="space-y-4">
          {it.days.map((d) => (
            <li key={d.day}>
              <h3 className="font-sans text-base font-bold">Day {d.day}: {d.title}</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {d.travel && <li><b>Travel:</b> {placeName(d.travel.from)} → {placeName(d.travel.to)}, {formatOption(d.travel.options[0])}</li>}
                {d.items.map((a) => (
                  <li key={a.id}>
                    <b>{a.name}</b> ({a.when.toLowerCase()}, ~{a.hours} h): {a.note}
                    {a.cost && <> Cost: {a.cost}.</>}
                    {a.booking && <> Booking: {a.booking}</>}
                    {a.caution && <span className="block text-clay-700">Caution: {a.caution}</span>}
                  </li>
                ))}
                {d.note && <li>{d.note}</li>}
                {d.base && <li className="text-ink-500">Sleep: {regions[d.base].name}</li>}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <H2>Transit guide</H2>
        <div className="space-y-3">
          {it.legs.map((l) => (
            <div key={`${l.from}-${l.to}`}>
              <h3 className="font-sans text-base font-bold">{placeName(l.from)} → {placeName(l.to)} (~{l.km} km)</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {l.options.map((o) => <li key={o.label}><b>{formatOption(o)}.</b> {o.how}</li>)}
                {l.tips.map((t) => <li key={t}>Tip: {t}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <H2>Emergency numbers</H2>
        <table className="w-full border-collapse text-left">
          <tbody>
            {emergencyContacts.map((c) => (
              <tr key={c.number} className="border-b border-sand-200">
                <td className="py-1.5 pr-4">{c.label}{c.note && <span className="text-ink-500"> ({c.note})</span>}</td>
                <td className="py-1.5 font-mono font-semibold">{c.number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <H2>Survival essentials</H2>
        <div className="space-y-3">
          {essentials.map((sec) => (
            <div key={sec.id}>
              <h3 className="font-sans text-base font-bold">{sec.title}</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5">{sec.items.map((i) => <li key={i.h}><b>{i.h}:</b> {i.p}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <H2>Packing</H2>
        <div className="grid gap-4 sm:grid-cols-2">
          {packingList(it).map((g) => (
            <div key={g.title}>
              <h3 className="font-sans text-sm font-bold">{g.title}</h3>
              <ul className="mt-1 space-y-0.5">{g.items.map((i) => <li key={i}>☐ {i}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <H2>Sources</H2>
        <p className="mb-1 text-ink-500">Facts checked on {CHECKED_ON}. Travel-guide sources are marked; re-check those first.</p>
        <ul className="list-disc space-y-0.5 pl-5 text-[0.8rem]">
          {dossierSources(it).map((s) => (
            <li key={s.url}>
              <a href={s.url} className="underline">{s.label}</a>
              {s.kind === "guide" && <span className="text-ink-500"> (travel guide)</span>}
              <span className="block break-all text-ink-400 print:block">{s.url}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-sand-200 pt-3 text-xs text-ink-500">
        Fares and times are 2025–26 ballpark figures, not quotes. Opening days and road conditions change, so confirm locally.
      </footer>
    </article>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 border-b border-sand-200 pb-1 text-xl font-semibold text-forest-900">{children}</h2>;
}
