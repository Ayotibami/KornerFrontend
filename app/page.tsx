// Root landing page — assembles all the landing sections in order top to bottom.
// Each section is a standalone component; this file just stacks them.
// The background color #f1f5f9 (light grey-blue) is the base behind all sections.
//
// No "use client" here — none of the interactivity in this file's own scope
// needs it (HeroSection/ActivationForm already declare it themselves where
// needed), and this needs to be a Server Component to fetch the real story
// list for PeepSection's preview cards.

import type { Metadata } from "next";
import Navbar from "@/components/usercomponent/Navbar";
import HeroSection from "@/components/usercomponent/HeroSection";
import AboutSection from "@/components/usercomponent/AboutSection";
import PeepSection from "@/components/usercomponent/PeepSection";
import Testimony from "@/components/usercomponent/Testimony";
import ActivationForm from "@/components/usercomponent/ActivationForm";
import Footer from "@/components/usercomponent/Footer";
import { getPublicStories } from "@/lib/publicApi";

export const metadata: Metadata = {
  title: "The Korner — Kampos talks you listen",
  description:
    "Korner is that chill corner on Kampos where we just get student life. From late-night gist about love and grades to real talks on career, money, and culture — it's Kampos talking your talk, straight from our hearts to yours.",
  openGraph: {
    title: "The Korner — Kampos talks you listen",
    description:
      "Korner's is that chill corner on Kampos where we just get student life. From late-night gist about love and grades to real talks on career, money, and culture — it's Kampos talking your talk, straight from our hearts to yours.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "The Korner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Korner — Kampos talks you listen",
    description:
      "Korner's is that chill corner on Kampos where we just get student life. From late-night gist about love and grades to real talks on career, money, and culture.",
    images: ["/images/og-default.png"],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
  },
};

export default async function Home() {
  const { stories } = await getPublicStories(3, 0);
  const base = process.env.NEXT_PUBLIC_BASE_URL!;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "The Korner",
      url: base,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "The Korner",
      url: base,
      logo: `${base}/images/logo.png`,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        style={{
          paddingTop: 16,
          height: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#f1f5f9",
          flexDirection: "column",
        }}
      >
      <Navbar />

      {/* Full-screen hero: background image, big title, floating cards at bottom */}
      <HeroSection />

      {/* "Na your Korner" text blurb + the 2x2 animated icon grid */}
      <AboutSection />

      {/* Spacer between About and the torn dark section */}
      <div style={{ marginTop: 40 }} />

      {/* Dark torn-paper section showing 3 story card previews */}
      <PeepSection stories={stories} />

      {/* Testimonials section — placeholder visuals for now */}
      <Testimony />

      {/* Email subscription form — "Korner Effect" */}
      <ActivationForm />

      {/* Footer with link columns and social icons */}
      <Footer />
    </div>
    </>
  );
}
