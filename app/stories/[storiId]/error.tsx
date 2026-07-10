"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RefreshCw, ArrowLeft } from "lucide-react";

const IMAGES = ["/images/confused.png", "/images/facepalm.png"];

export default function StoriError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [src] = useState(
    () => IMAGES[Math.floor(Math.random() * IMAGES.length)],
  );

  return (
    <main className="h-screen bg-[#f8f9fb] flex flex-col overflow-hidden">
      <div className="px-6 pt-5 shrink-0">
        <Link
          href="/"
          className="text-sm font-bold text-[#0f1e3d] hover:opacity-70 transition-opacity"
        >
          Korner
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center w-full max-w-xs sm:max-w-sm">
          <div className="relative mb-5 flex items-center justify-center">
            <div className="absolute w-[85%] h-[85%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] scale-150" />
            <Image
              src={src}
              alt="Kappy confused"
              width={600}
              height={600}
              className="relative z-10 w-60 sm:w-72 md:w-80 max-h-[45vh] h-auto object-contain"
              priority
            />
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            Omo! This stori no dey load well but no panic
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={reset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0f1e3d] text-white text-sm font-bold hover:opacity-80 transition-opacity cursor-pointer"
            >
              <RefreshCw size={14} />
              Try again
            </button>
            <Link
              href="/stories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={14} />
              See other stories
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
