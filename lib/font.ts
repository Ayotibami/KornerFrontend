import { Nunito } from "next/font/google";
const nunito = Nunito({
  subsets: ["latin"],
  // 900 is for bold text inside headings, which are already 800.
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-nunito", // registers as CSS var so Tailwind's font-nunito class works
});

import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // optional but common
});
export { nunito, inter };
