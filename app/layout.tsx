import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["opsz"] });
const malayalam = Noto_Sans_Malayalam({ subsets: ["malayalam"], variable: "--font-malayalam", display: "swap", weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "Kerala Journey: plan a Kerala trip without the guesswork",
  description:
    "Pick a vibe, set your days and who's coming, and get a no-backtracking Kerala route with real transit times, fares in ₹, and a dossier you can print.",
};

export const viewport: Viewport = {
  themeColor: "#1f3d2b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${malayalam.variable}`}>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
