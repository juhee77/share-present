"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "선물 생성" },
    { href: "/dashboard", label: "내 선물 보관함" },
    { href: "/support", label: "고객센터" },
  ];

  return (
    <header className="w-full py-4 px-6 border-b border-[#eae6df] bg-white sticky top-0 z-40 backdrop-blur-md bg-white/95">
      <div className="max-w-[540px] mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="SharePresent 홈으로 이동">
          <div className="w-8 h-8 rounded-lg bg-[#3b483a] group-hover:bg-[#2e392d] group-hover:rotate-6 transition-all duration-300 flex items-center justify-center text-white text-sm font-serif font-bold shadow-sm">
            S
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#1a1a1a] group-hover:text-[#3b483a] transition-colors">
            SharePresent
          </span>
        </Link>

        <nav className="flex items-center gap-1.5 text-xs font-bold" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  isActive
                    ? "bg-[#3b483a] text-white shadow-sm font-extrabold"
                    : "text-[#5e605d] hover:text-[#1a1a1a] hover:bg-[#f6f4f0]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
