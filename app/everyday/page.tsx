import type { Metadata } from "next";
import { photos } from "@/lib/experience.ts";
import { everyday } from "@/lib/districts.ts";
import { DetailHero } from "@/components/explore/DetailHero";
import { EverydayList } from "@/components/explore/Everyday";

export const metadata: Metadata = {
  title: "Everyday Kerala",
  description: "Tea shops, state ferries, toddy-shop lunches, Theyyam nights and Sevens football: what people in Kerala actually do, and how to join in.",
};

/** The common Kerala: ordinary things to do, anywhere and district by district. */
export default function EverydayPage() {
  return (
    <>
      <DetailHero
        photo={photos["kochi-nets"]}
        crumbs={[{ href: "/districts", label: "Districts" }]}
        eyebrow="Everyday Kerala"
        title="Do what Keralites do"
        lede="Not sights or tours: the tea shop, the ferry commute, the Sunday match. Each one comes with how to join in politely."
      />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <EverydayList items={everyday} />
      </main>
    </>
  );
}
