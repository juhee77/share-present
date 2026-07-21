"use client";

import { useState } from "react";

interface UnwrappingRibbonProps {
  senderName: string;
  onOpen: () => void;
}

export default function UnwrappingRibbon({ senderName, onOpen }: UnwrappingRibbonProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 700);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#f8f7f4]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center transition-all duration-700 ${
        isOpening ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Glowing Orb */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#5d6d5a]/20 to-[#b58d75]/20 blur-3xl animate-glow pointer-events-none" />

      <div className="relative glass-card max-w-sm w-full p-8 flex flex-col items-center border border-white/80 shadow-2xl animate-float">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#5d6d5a] to-[#798a75] flex items-center justify-center mb-6 shadow-xl relative group cursor-pointer" onClick={handleOpenClick}>
          <span className="text-5xl group-hover:scale-110 transition-transform">🎁</span>
          <div className="absolute inset-0 rounded-3xl border-2 border-white/40 animate-ping opacity-25" />
        </div>

        <span className="text-[11px] uppercase tracking-widest text-[#b58d75] font-bold mb-2">
          Special Gift Invitation
        </span>

        <h1 className="font-serif text-3xl font-bold text-[#1c1e1d] mb-3 leading-snug">
          {senderName}님이 보내신<br />선물 상자가 도착했습니다
        </h1>

        <p className="text-xs text-[#6e706e] max-w-xs mb-8 leading-relaxed">
          당신의 취향을 가득 담은 감도 높은 선물 리스트가도착했습니다. 아래 버튼을 터치하여 선물함을 열어보세요.
        </p>

        <button
          onClick={handleOpenClick}
          className="btn-primary text-base py-4 shadow-2xl group"
        >
          <span>선물함 열어보기</span>
          <span className="group-hover:rotate-12 transition-transform">🎀</span>
        </button>
      </div>
    </div>
  );
}
