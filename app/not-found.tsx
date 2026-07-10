"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const IMAGES = ["/images/magnifyingglass.png", "/images/notfound.png"];

export default function NotFound() {
  const [src] = useState(() => IMAGES[Math.floor(Math.random() * IMAGES.length)]);

  return (
    <main className="h-screen bg-[#f8f9fb] flex flex-col overflow-hidden">

      <div className="px-6 pt-5 shrink-0">
        <Link href="/" className="text-sm font-bold text-[#0f1e3d] hover:opacity-70 transition-opacity">
          Korner
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center w-full max-w-xs sm:max-w-sm">

          <div className="relative mb-5 flex items-center justify-center">
            <div className="absolute w-[85%] h-[85%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] scale-150" />
            <Image
              src={src}
              alt="Kappy searching"
              width={600}
              height={600}
              className="relative z-10 w-60 sm:w-72 md:w-80 max-h-[45vh] h-auto object-contain"
              priority
            />
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            I don check, I neva see wetin you dey find o
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0f1e3d] text-white text-sm font-bold hover:opacity-80 transition-opacity"
            >
              <ArrowLeft size={14} />
              Go home
            </Link>
            <button
              onClick={() => history.back()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Go back
            </button>
          </div>

        </div>
      </div>

    </main>
  );
}
