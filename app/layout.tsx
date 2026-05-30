import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import OneSignalInit from "@/components/usercomponent/OneSignalInit";
import ThemedToaster from "@/components/admin/ui/ThemedToaster";
import { nunito } from "@/lib/font";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Korner",
  description: "The Korner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/*
          Anti-FOUC (Flash Of Unstyled Content) script.
          Runs synchronously before the browser paints, so there is never a flash
          of the wrong theme on page load.

          Logic:
            1. Read "theme" from localStorage
            2. If "dark" → add the `dark` class to <html> immediately
            3. If no saved preference → check the OS prefers-color-scheme
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      {/* poppins.className = default font for public pages
          nunito.variable = registers --font-nunito CSS var for admin components */}
      <body className={`${poppins.className} ${nunito.variable}`}>
        <OneSignalInit />
        <ThemedToaster />
        {children}
      </body>
    </html>
  );
}
