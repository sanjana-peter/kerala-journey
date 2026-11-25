import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { photos } from "@/lib/experience.ts";
import { regionPhotos } from "@/lib/explore.ts";
import type { Region } from "@/lib/keralaData.ts";
import { cx } from "../ui";

/** A photo card linking to a place's page. `compact` is the small version used in strips and sidebars. */
export function PlaceCard({ region, compact = false }: { region: Region; compact?: boolean }) {
  const id = regionPhotos[region.id][0];
  const photo = id ? photos[id] : null;
  return (
    <Link
      href={`/places/${region.id}`}
      className={cx(
        "group relative block overflow-hidden organic bg-forest-800 text-sand-50 shadow-[0_12px_32px_-20px_rgb(31_61_43/0.45)] transition-transform duration-300 hover:-translate-y-1",
        compact ? "aspect-[4/5]" : "aspect-[4/3]",
      )}
    >
      {photo && <Image src={photo.src} alt="" fill sizes={compact ? "(min-width: 1024px) 180px, 45vw" : "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"} className="object-cover transition-transform duration-700 group-hover:scale-[1.07]" />}
      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/20 to-transparent" />
      <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-sand-50/20 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100" aria-hidden>
        <ArrowUpRight size={16} />
      </span>
      <span className={cx("absolute inset-x-0 bottom-0", compact ? "p-3" : "p-5")}>
        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-sand-200">{region.area}</span>
        <span className={cx("block font-serif font-semibold leading-tight", compact ? "text-lg" : "text-2xl")}>{region.name}</span>
        {!compact && <span className="mt-1 block text-sm leading-snug text-sand-50/85">{region.tagline}</span>}
      </span>
    </Link>
  );
}
