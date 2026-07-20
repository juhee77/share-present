"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full py-5 px-6 flex items-center justify-between border-b border-black/5 bg-[#f7f6f2]">
      <Link href="/" className="flex items-center gap-2 text-decoration-none">
        <span className="font-serif text-2xl font-bold tracking-tight text-[#798a75]">
          SharePresent
        </span>
      </Link>
      <span className="text-xs px-3 py-1 rounded-full bg-[#798a75]/10 text-[#798a75] font-medium">
        Premium Gift
      </span>
    </header>
  );
}
