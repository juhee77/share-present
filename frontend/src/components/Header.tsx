"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full py-3.5 px-5 flex items-center justify-between border-b border-[#efefef] bg-white sticky top-0 z-40">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="insta-story-ring">
          <div className="insta-story-inner">
            <div className="w-8 h-8 rounded-full bg-[#121212] flex items-center justify-center text-white text-xs font-bold font-serif">
              SP
            </div>
          </div>
        </div>
        <span className="font-serif text-xl font-bold tracking-tight text-[#121212]">
          SharePresent
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-[#fafafa] border border-[#e6e6e6] text-[#737373]">
          Curation Feed
        </span>
        <div className="w-8 h-8 rounded-full bg-[#fafafa] border border-[#e6e6e6] flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100 transition-colors">
          ✉️
        </div>
      </div>
    </header>
  );
}
