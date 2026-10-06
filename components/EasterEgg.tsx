"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const SECRETS: Record<string, string> = {
  adipoli: "അടിപൊളി! You already sound like a local.",
  chai: "Chai break. A glass of sweet tea at any roadside stall costs ₹10–15.",
  monsoon: "Locals say the monsoon arrives on 1 June, give or take a week. It's usually right.",
};

/** Type a secret word anywhere on the page (not in a text field) for a surprise. */
export function EasterEgg() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      if (e.key.length !== 1) return;
      typed = (typed + e.key.toLowerCase()).slice(-12);
      const hit = Object.keys(SECRETS).find((w) => typed.endsWith(w));
      if (hit) { setMessage(SECRETS[hit]); typed = ""; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4" role="status">
      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24 }}
            className="font-ml w-full max-w-[26rem] rounded-2xl bg-forest-900 px-5 py-4 text-sm text-sand-50 shadow-2xl"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
