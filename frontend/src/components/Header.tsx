"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full py-4 px-6 border-b border-[#eae6df] bg-white sticky top-0 z-40">
      <div className="max-w-[540px] mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#3b483a] flex items-center justify-center text-white text-sm font-serif font-bold shadow-sm">
            S
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#1a1a1a]">
            SharePresent
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-xs font-bold">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-full text-[#3b483a] hover:bg-[#f6f4f0] transition-colors"
          >
            선물 생성
          </Link>
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-full text-[#3b483a] hover:bg-[#f6f4f0] transition-colors"
          >
            내 선물 보관함
          </Link>
        </nav>
      </div>
    </header>
  );
}
