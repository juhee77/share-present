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
    }, 800);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#f7f6f2] flex flex-col items-center justify-center p-6 text-center transition-all duration-700 ${
        isOpening ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <div className="w-24 h-24 rounded-full bg-[#798a75]/10 flex items-center justify-center mb-6 animate-bounce">
        <span className="text-4xl">🎁</span>
      </div>

      <p className="text-xs uppercase tracking-widest text-[#b58d75] font-semibold mb-2">
        Special Gift For You
      </p>

      <h1 className="font-serif text-3xl font-bold text-[#2a2c2b] mb-4">
        {senderName}님이 도착한 선물 상자
      </h1>

      <p className="text-sm text-[#7c7e7c] max-w-xs mb-8 leading-relaxed">
        당신의 취향을 가득 담은 프리미엄 선물 리스트가도착했습니다. 리본을 풀어 확인해보세요.
      </p>

      <button
        onClick={handleOpenClick}
        className="btn-primary max-w-xs text-base py-4 shadow-xl"
      >
        <span>선물함 열어보기</span>
        <span>🎀</span>
      </button>
    </div>
  );
}
