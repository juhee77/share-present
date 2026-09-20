"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";

interface ThankYouPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  senderName?: string;
  recipientName?: string;
  productName?: string;
  sticker?: string;
  message?: string;
  photoUrl?: string;
  date?: string;
}

export default function ThankYouPhotoModal({
  isOpen,
  onClose,
  recipientName = "소중한 수령인",
  productName,
  sticker = "💖 취향저격 고마워!",
  message = "정성스러운 선물 너무 감사해요! 예쁘게 잘 쓸게요.",
  photoUrl = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80",
  date = "2026.07.24",
}: ThankYouPhotoModalProps) {
  const { showToast } = useToast();
  const [reactedEmoji, setReactedEmoji] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen) return null;

  const handleReact = (emoji: string, label: string) => {
    setReactedEmoji(emoji);
    showToast(`${recipientName}님에게 '${emoji} ${label}' 반응이 전송되었습니다!`, "success");
  };

  const handleDownload = () => {
    showToast("감사 언박싱 사진이 앨범에 저장되었습니다! 📸", "info");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#faf9f6] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[#eae6df] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eae6df] bg-white">
          <div className="flex items-center gap-2">
            <span className="text-base">💌</span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block">
                UNBOXING MEMORY
              </span>
              <h3 className="text-sm font-bold font-serif text-[#1a1a1a]">
                {recipientName}님의 감사 카드 & 포토
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f2efe9] hover:bg-[#e5e1d8] flex items-center justify-center text-[#5e605d] transition-colors text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
          {/* Photo Showcase Container */}
          {photoUrl && (
            <div className="relative group rounded-2xl overflow-hidden border-2 border-[#eae6df] bg-neutral-900 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Unboxing photo"
                className={`w-full object-cover transition-all duration-300 cursor-zoom-in ${
                  isZoomed ? "max-h-[500px] object-contain" : "max-h-72"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-sm flex items-center gap-1.5">
                <span>📸 실시간 언박싱</span>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-[#1a1a1a] px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-md transition-all flex items-center gap-1"
              >
                <span>💾 저장</span>
              </button>
            </div>
          )}

          {/* Recipient Handwritten Sticker & Note Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#fffdfa] to-[#fbf9f5] border border-[#e5dfd5] shadow-xs relative">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-block px-3 py-1 bg-[#3b483a]/10 text-[#3b483a] text-xs font-bold rounded-full">
                {sticker}
              </span>
              <span className="text-[10px] text-[#8c887b] font-mono">{date}</span>
            </div>

            {productName && (
              <p className="text-[11px] font-semibold text-[#a38974] mb-2">
                선택한 선물: <span className="text-[#1a1a1a]">{productName}</span>
              </p>
            )}

            <div className="relative pl-3 border-l-2 border-[#3b483a]/30 my-3">
              <p className="font-serif italic text-sm text-[#2b2b2b] leading-relaxed">
                &ldquo;{message}&rdquo;
              </p>
            </div>

            <div className="text-right text-[11px] font-bold text-[#5e605d]">
              — from. {recipientName}
            </div>
          </div>

          {/* Quick Warm Reactions Bar */}
          <div className="p-4 bg-white rounded-2xl border border-[#eae6df] text-center">
            <p className="text-[11px] font-bold text-[#7a7873] uppercase tracking-wider mb-2.5">
              따뜻한 마음으로 답장 리액션 보내기
            </p>
            <div className="flex justify-center gap-2 sm:gap-3">
              {[
                { emoji: "❤️", label: "하트" },
                { emoji: "👏", label: "박수" },
                { emoji: "🥰", label: "감동" },
                { emoji: "✨", label: "뿌듯" },
                { emoji: "☕", label: "커피한잔" },
              ].map((item) => (
                <button
                  key={item.emoji}
                  type="button"
                  onClick={() => handleReact(item.emoji, item.label)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                    reactedEmoji === item.emoji
                      ? "bg-[#3b483a] text-white border-[#3b483a] scale-105 shadow-sm"
                      : "bg-[#fbf9f5] border-[#eae6df] hover:border-[#3b483a]/40 hover:bg-white text-[#1a1a1a]"
                  }`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f6f4f0] border-t border-[#eae6df] text-center">
          <button
            onClick={onClose}
            className="btn-editorial py-3 text-xs font-bold uppercase tracking-widest w-full shadow-xs"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
