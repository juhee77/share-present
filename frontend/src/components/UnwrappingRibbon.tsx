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
      className={`fixed inset-0 z-50 bg-[#f6f4f0]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center transition-all duration-700 ${
        isOpening ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <div className="editorial-card max-w-sm w-full p-8 flex flex-col items-center border border-[#eae6df] shadow-lg animate-float">
        <div 
          onClick={handleOpenClick}
          className="w-20 h-20 rounded-full bg-[#3b483a]/5 flex items-center justify-center text-3xl mb-6 shadow-inner cursor-pointer hover:scale-105 transition-transform"
        >
          ✉️
        </div>

        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] mb-2">
          Private Invitation
        </span>

        <h1 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-3 leading-snug">
          {senderName}님이 제안하는<br />선물 상자가 도착했습니다
        </h1>

        <p className="text-xs text-[#5e605d] max-w-xs mb-8 leading-relaxed">
          당신을 위해 세심하게 준비한 프리미엄 선물 리스트가도착했습니다. 아래 버튼을 눌러 확인해보세요.
        </p>

        <button
          onClick={handleOpenClick}
          className="btn-editorial text-xs tracking-widest uppercase font-bold py-4 shadow-md"
        >
          <span>선물 상자 열기</span>
          <span>✦</span>
        </button>
      </div>
    </div>
  );
}
