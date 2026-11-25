import Link from "next/link";
import { districts, regionDistrict, type DistrictId } from "@/lib/districts.ts";
import { cx } from "../ui";

// The bounding box of the district headquarters, with a margin. Plotted flat (it's a strip 600 km long,
// so the distortion is small); the coast runs down the left side.
const LAT: [number, number] = [8.3, 12.75];
const LON: [number, number] = [74.75, 77.2];
const withBase = new Set<DistrictId>(Object.values(regionDistrict));
// Labelled on the left, where a label to the right would hit a neighbour's dot or run off the edge.
const labelLeft = new Set<DistrictId>(["alappuzha", "idukki", "pathanamthitta", "thiruvananthapuram"]);

/**
 * Kerala's districts as dots at their headquarters, north at the top. Not a drawn map: no borders, just
 * where each district sits, so you can see the north–south spread at a glance. `active` highlights one.
 */
export function DistrictMap({ active }: { active?: DistrictId }) {
  return (
    <figure className="glass organic p-4 sm:p-5">
      <div
        className="relative mx-auto w-full"
        style={{ aspectRatio: `${(LON[1] - LON[0]) * 0.98} / ${LAT[1] - LAT[0]}`, maxWidth: "22rem" }}
      >
        {/* The line through the headquarters, north to south */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          <polyline
            points={districts.map((d) => `${x(d.coords[1])},${y(d.coords[0])}`).join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="1.5 1.5"
            vectorEffect="non-scaling-stroke"
            className="text-sand-300"
          />
        </svg>
        <span className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ink-400" aria-hidden>
          Arabian Sea
        </span>
        {/* Each <li> is a zero-size anchor at the dot, so labels never widen the page */}
        <ol aria-label="Districts, north to south">
          {districts.map((d) => {
            const on = d.id === active;
            return (
              <li key={d.id} className="absolute h-0 w-0" style={{ left: `${x(d.coords[1])}%`, top: `${y(d.coords[0])}%` }}>
                <Link
                  href={`/districts/${d.id}`}
                  aria-current={on ? "page" : undefined}
                  className={cx(
                    "group flex w-max -translate-y-1/2 items-center gap-1.5 whitespace-nowrap",
                    labelLeft.has(d.id) ? "-translate-x-[calc(100%-0.4rem)] flex-row-reverse" : "-translate-x-[0.4rem]",
                  )}
                >
                  <span
                    className={cx(
                      "block shrink-0 rounded-full ring-2 transition-transform group-hover:scale-125",
                      on ? "h-4 w-4 bg-mood-accent ring-white" : withBase.has(d.id) ? "h-3 w-3 bg-forest-700 ring-white" : "h-3 w-3 bg-sand-50 ring-forest-600",
                    )}
                  />
                  <span className={cx("rounded px-1 text-xs leading-tight", on ? "bg-mood-accent font-semibold text-white" : "text-ink-700 group-hover:text-ink-900")}>
                    {d.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
      <figcaption className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] text-ink-500">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-forest-700" aria-hidden /> Has a trip-planner base</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sand-50 ring-2 ring-forest-600" aria-hidden /> Off the tourist trail</span>
        <span>Dots are district headquarters, not to scale.</span>
      </figcaption>
    </figure>
  );
}

function x(lon: number) { return ((lon - LON[0]) / (LON[1] - LON[0])) * 100; }
function y(lat: number) { return ((LAT[1] - lat) / (LAT[1] - LAT[0])) * 100; }
