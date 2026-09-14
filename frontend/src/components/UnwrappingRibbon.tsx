"use client";

import { useState } from "react";

interface UnwrappingRibbonProps {
  senderName: string;
  messageCard?: string;
  cardTheme?: "ivory" | "emerald" | "noir" | "rose";
  onOpen: () => void;
}

export default function UnwrappingRibbon({
  senderName,
  messageCard = "당신을 위해 정성껏 고른 선물입니다.",
  cardTheme = "ivory",
  onOpen,
}: UnwrappingRibbonProps) {
  const [sealBroken, setSealBroken] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const themeStyles = {
    ivory: {
      envelopeBg: "bg-[#f5f2eb]",
      envelopeBorder: "border-[#d8d0c2]",
      letterBg: "bg-[#faf9f6]",
      sealBg: "bg-[#8c7355]",
      sealText: "text-[#fbf9f5]",
      textColor: "text-[#1a1a1a]",
      subText: "text-[#5e605d]",
      sealBorder: "border-[#a89073]",
    },
    emerald: {
      envelopeBg: "bg-[#1f2e24]",
      envelopeBorder: "border-[#3b4d40]",
      letterBg: "bg-[#25372b]",
      sealBg: "bg-[#526d5b]",
      sealText: "text-[#f2f7f4]",
      textColor: "text-[#f5f5f5]",
      subText: "text-[#b0c4b6]",
      sealBorder: "border-[#71917c]",
      dark: true,
    },
    noir: {
      envelopeBg: "bg-[#181818]",
      envelopeBorder: "border-[#333333]",
      letterBg: "bg-[#202020]",
      sealBg: "bg-[#333333]",
      sealText: "text-[#e5e5e5]",
      textColor: "text-[#f5f5f5]",
      subText: "text-[#999999]",
      sealBorder: "border-[#555555]",
      dark: true,
    },
    rose: {
      envelopeBg: "bg-[#f9f1f0]",
      envelopeBorder: "border-[#ebd7d5]",
      letterBg: "bg-[#fffaf9]",
      sealBg: "bg-[#b0787d]",
      sealText: "text-[#fff6f6]",
      textColor: "text-[#1a1a1a]",
      subText: "text-[#6e5d5e]",
      sealBorder: "border-[#c9959a]",
    },
  }[cardTheme];

  const handleBreakSeal = () => {
    if (sealBroken) return;
    setSealBroken(true);
  };

  const handleEnterLookbook = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center transition-all duration-600 ${
        isOpening ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <div className="w-full max-w-sm relative animate-fade-in">
        {/* Envelope Outer Box */}
        <div
          className={`rounded-2xl p-6 sm:p-8 border shadow-2xl transition-all duration-500 relative overflow-hidden ${
            themeStyles.envelopeBg
          } ${themeStyles.envelopeBorder}`}
        >
          {/* Top Envelope Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/10 mb-6">
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-70">
              PRIVATE INVITATION
            </span>
            <span className="text-[10px] font-mono tracking-wider opacity-60">
              NO. 001/SP
            </span>
          </div>

          {!sealBroken ? (
            /* PHASE 1: Sealed Envelope State */
            <div className="flex flex-col items-center py-4">
              <span className="text-[11px] font-bold tracking-widest uppercase mb-4 opacity-75">
                From. {senderName}
              </span>

              <h2 className="font-serif text-2xl font-bold mb-6 leading-snug">
                {senderName}님이 보내신<br />
                선물 룩북이 도착했습니다
              </h2>

              {/* 3D Wax Seal Button */}
              <div className="relative my-4">
                <button
                  onClick={handleBreakSeal}
                  className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-2 shadow-2xl transition-transform transform active:scale-95 hover:scale-105 animate-seal-pulse cursor-pointer relative z-10 ${
                    themeStyles.sealBg
                  } ${themeStyles.sealText} ${themeStyles.sealBorder}`}
                >
                  <span className="font-serif text-2xl font-bold tracking-tighter">
                    SP
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-mono mt-0.5 opacity-90">
                    SEAL
                  </span>
                </button>
                <div className="absolute -inset-2 rounded-full border border-dashed border-current opacity-30 animate-spin-slow"></div>
              </div>

              <p className="text-xs mt-6 opacity-80 animate-pulse">
                ✦ 왁스 씰(Wax Seal)을 눌러 봉투를 개봉하세요
              </p>
            </div>
          ) : (
            /* PHASE 2: Unsealed Letter Slide Out */
            <div className="flex flex-col items-center py-2 animate-fade-in">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-serif text-sm font-bold mb-4 shadow-md ${
                  themeStyles.sealBg
                } ${themeStyles.sealText}`}
              >
                SP
              </div>

              <span className="text-[10px] font-mono uppercase tracking-widest opacity-60 mb-2">
                A Letter For You
              </span>

              <h3 className="font-serif text-xl font-bold mb-3">
                &ldquo;{messageCard}&rdquo;
              </h3>

              <p className="text-xs mb-6 opacity-75 leading-relaxed max-w-xs">
                {senderName}님이 당신의 취향을 존중하여 큐레이션한 선물 리스트입니다. 마음에 드는 상품을 선택해주세요.
              </p>

              <button
                onClick={handleEnterLookbook}
                className="w-full py-4 bg-[#3b483a] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#2c362b] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>선물 룩북 확인하기</span>
                <span>✦</span>
              </button>
            </div>
          )}
        </div>

        {/* Zero Price Recipient Privacy Badge */}
        <p className="text-[11px] text-white/80 mt-4 tracking-wide">
          🔒 수령인에게는 가격 정보가 100% 비노출됩니다
        </p>
      </div>
    </div>
  );
}

