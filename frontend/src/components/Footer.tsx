"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-[#1e293b] bg-[#0b101a] py-8 px-6 text-[#64748b] text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#3b483a] flex items-center justify-center text-white text-xs font-serif font-bold">
            S
          </div>
          <span className="font-serif font-bold text-[#94a3b8]">SharePresent Editorial Concierge</span>
          <span className="text-[10px] text-[#475569]">© 2026 SharePresent Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <Link href="/" className="hover:text-white transition-colors">{t("nav.create")}</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">{t("nav.dashboard")}</Link>
          <Link href="/support" className="hover:text-white transition-colors">{t("nav.support")}</Link>
          <Link href="/admin" className="text-[#d4af37] hover:underline font-bold">관리자 콘솔</Link>
        </div>
      </div>
    </footer>
  );
}
