import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center p-6 text-center">

      {/* Logo */}
      <Link href="/" className="mb-10 flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-xl bg-[#0f1e3d] flex items-center justify-center group-hover:opacity-80 transition-opacity">
          <Image src="/images/logo.png" alt="Korner" width={18} height={18} className="object-contain" />
        </div>
        <span className="text-sm font-bold text-[#0f1e3d]">Korner</span>
      </Link>

      {/* 404 number */}
      <p className="text-[7rem] sm:text-[10rem] font-black text-[#0f1e3d]/[0.06] leading-none select-none mb-2">
        404
      </p>

      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-[#0f1e3d] flex items-center justify-center shadow-[0_8px_24px_rgba(15,30,61,0.25)] -mt-6 mb-6">
        <BookOpen size={28} className="text-white" />
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-2 mb-8 max-w-sm">
        <h1 className="text-2xl font-bold text-[#0f1e3d]">
          This page no dey here
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          E fit be say the link don spoil, the page don move, or e never exist
          for the first place. No worry — plenty good stories still dey.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/stories"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0f1e3d] text-white text-sm font-semibold hover:opacity-80 transition-opacity"
        >
          <BookOpen size={15} />
          Read stories
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#B4CFF6] text-primary text-sm font-semibold hover:bg-[#f0f5ff] transition-colors"
        >
          <ArrowLeft size={15} />
          Go home
        </Link>
      </div>

      <p className="mt-12 text-xs text-gray-400">© Korner · by Kampos</p>
    </main>
  );
}
