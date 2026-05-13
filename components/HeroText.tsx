import { Nunito } from "next/font/google";
import React from "react";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});
export default function HeroText({ children }: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        fontFamily: nunito.style.fontFamily,
        fontSize: 80,
        fontWeight: 800,
        color: "white",
      }}
    >
      {children}
    </h1>
  );
}
