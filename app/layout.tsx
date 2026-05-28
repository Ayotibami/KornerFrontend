import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import OneSignalInit from "@/components/usercomponent/OneSignalInit";
import { Toaster } from "sonner";
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
      <body className={poppins.className}>
        <OneSignalInit />
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
