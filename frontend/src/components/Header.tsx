"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between border-b border-[#eae6df] bg-white sticky top-0 z-40">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#3b483a] flex items-center justify-center text-white text-sm font-serif font-bold shadow-sm">
          S
        </div>
        <span className="font-serif text-2xl font-bold tracking-tight text-[#1a1a1a]">
          SharePresent
        </span>
      </Link>

      <span className="text-[10px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full bg-[#f6f4f0] border border-[#eae6df] text-[#3b483a]">
        Private Salon
      </span>
    </header>
  );
}
