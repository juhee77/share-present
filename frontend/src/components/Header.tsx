"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Header() {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { href: "/", label: t("nav.create") },
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/support", label: t("nav.support") },
    { href: "/admin", label: t("nav.admin") },
  ];

  const isAdmin = pathname === "/admin";

  return (
    <header
      className={`w-full py-4 px-6 border-b sticky top-0 z-40 backdrop-blur-md transition-colors duration-300 ${
        isAdmin
          ? "bg-[#0d131f]/95 border-[#1e293b] text-white shadow-lg"
          : "bg-white/95 border-[#eae6df] text-[#1a1a1a]"
      }`}
    >
      <div className={`${isAdmin ? "max-w-6xl" : "max-w-[540px]"} mx-auto flex items-center justify-between`}>
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="SharePresent 홈으로 이동">
          <div
            className={`w-8 h-8 rounded-lg group-hover:rotate-6 transition-all duration-300 flex items-center justify-center text-white text-sm font-serif font-bold shadow-sm ${
              isAdmin ? "bg-gradient-to-br from-[#d4af37] to-[#996515] text-black font-extrabold" : "bg-[#3b483a] group-hover:bg-[#2e392d]"
            }`}
          >
            S
          </div>
          <span
            className={`font-serif text-2xl font-bold tracking-tight transition-colors ${
              isAdmin
                ? "text-white group-hover:text-[#d4af37]"
                : "text-[#1a1a1a] group-hover:text-[#3b483a]"
            }`}
          >
            SharePresent
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1 text-xs font-bold" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 py-1.5 rounded-full transition-all ${
                    isActive
                      ? isAdmin
                        ? "bg-[#d4af37] text-black shadow-sm font-extrabold"
                        : "bg-[#3b483a] text-white shadow-sm font-extrabold"
                      : isAdmin
                      ? "text-[#94a3b8] hover:text-white hover:bg-[#1e293b]"
                      : "text-[#5e605d] hover:text-[#1a1a1a] hover:bg-[#f6f4f0]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={toggleLanguage}
            type="button"
            className={`text-[11px] font-bold px-2 py-1 rounded border transition-all ${
              isAdmin
                ? "border-[#334155] text-[#94a3b8] hover:text-white hover:border-[#d4af37] bg-[#1e293b]"
                : "border-[#d6cfc7] text-[#5e605d] hover:text-[#1a1a1a] hover:border-[#3b483a] bg-[#fbfaf8]"
            }`}
            aria-label={`현재 언어: ${language === "ko" ? "한국어" : "English"}. 클릭하여 언어 변경.`}
            title="언어 전환 / Switch Language"
          >
            {language === "ko" ? "EN" : "KR"}
          </button>
        </div>
      </div>
    </header>
  );
}

