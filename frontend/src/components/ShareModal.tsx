"use client";

import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  senderName: string;
  messageCard?: string;
  cardTheme?: "ivory" | "emerald" | "noir" | "rose";
}

export default function ShareModal({
  isOpen,
  onClose,
  token,
  senderName,
  messageCard = "당신을 위해 정성껏 고른 선물입니다.",
  cardTheme = "ivory",
}: ShareModalProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const giftUrl = typeof window !== "undefined" ? `${window.location.origin}/gift/${token}` : `https://sharepresent.app/gift/${token}`;

  const kakaoMessage = `💌 [SharePresent] ${senderName}님이 당신을 위한 프라이빗 선물 룩북을 보냈습니다.

"${messageCard.length > 50 ? messageCard.slice(0, 50) + "..." : messageCard}"

아래 링크를 열어 마음에 드는 선물을 직접 선택해 주세요. (수령인 부담 비용 0원)
▶ ${giftUrl}`;

  const instagramMessage = `✨ ${senderName}님이 선물 상자를 보냈어요! 🎁
원하는 아이템과 배송지를 입력하면 선물 배송이 시작됩니다:
${giftUrl}`;

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      alert("클립보드 복사에 실패했습니다.");
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `SharePresent - ${senderName}님의 선물`,
          text: messageCard,
          url: giftUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          handleCopy(giftUrl, "link");
        }
      }
    } else {
      handleCopy(giftUrl, "link");
    }
  };

  const themeStyles = {
    ivory: {
      bg: "bg-[#f5f2eb]",
      border: "border-[#d8d0c2]",
      seal: "bg-[#8c7355] text-[#fbf9f5]",
      label: "클래식 아이보리 린넨",
    },
    emerald: {
      bg: "bg-[#1f2e24]",
      border: "border-[#3b4d40]",
      seal: "bg-[#526d5b] text-[#f2f7f4]",
      label: "포레스트 에메랄드",
      dark: true,
    },
    noir: {
      bg: "bg-[#181818]",
      border: "border-[#333333]",
      seal: "bg-[#333333] text-[#e5e5e5]",
      label: "미드나잇 노아르",
      dark: true,
    },
    rose: {
      bg: "bg-[#f9f1f0]",
      border: "border-[#ebd7d5]",
      seal: "bg-[#b0787d] text-[#fff6f6]",
      label: "더스티 로즈",
    },
  }[cardTheme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-[#faf9f6] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#d8d5cf] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e5e2db] mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3b483a]"></span>
            <h3 className="text-sm font-serif font-bold text-[#1a1a1a] tracking-wider uppercase">
              Private Invitation Share
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c8e8b] hover:text-[#1a1a1a] p-1 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Card Live Preview */}
        <div
          className={`p-4 rounded-xl border mb-5 transition-all relative ${themeStyles.bg} ${themeStyles.border} ${
            themeStyles.dark ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-70">
              INVITATION CARD PREVIEW
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-serif font-bold shadow-inner ${themeStyles.seal}`}
            >
              SP
            </div>
          </div>
          <p className="text-xs font-serif italic mb-2 line-clamp-2">
            &ldquo;{messageCard}&rdquo;
          </p>
          <div className="flex items-center justify-between text-[11px] opacity-80 pt-2 border-t border-black/10">
            <span>From. {senderName}</span>
            <span className="text-[10px] bg-black/10 px-2 py-0.5 rounded-full font-mono">
              7일 내 수락 기한
            </span>
          </div>
        </div>

        {/* Share Action Grid */}
        <div className="space-y-2.5 mb-5">
          {/* Native Mobile Share */}
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#3b483a] text-white rounded-xl text-xs font-medium hover:bg-[#2e392d] active:scale-[0.99] transition-all shadow-md"
          >
            <span>📱</span>
            <span>스마트폰 기본 공유하기 (카카오톡, SNS)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {/* Kakao Formatted Copy */}
            <button
              onClick={() => handleCopy(kakaoMessage, "kakao")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                copiedType === "kakao"
                  ? "bg-[#fee500]/20 border-[#fee500] text-[#3c1e1e]"
                  : "bg-[#fffdfa] border-[#e2ded6] hover:bg-[#f5f2eb] text-[#3c1e1e]"
              }`}
            >
              <span className="text-base mb-1">🟡</span>
              <span className="font-bold">카카오톡 초대문구</span>
              <span className="text-[10px] text-[#7a7266] mt-0.5">
                {copiedType === "kakao" ? "✓ 복사 완료!" : "정중한 안내 텍스트 복사"}
              </span>
            </button>

            {/* Instagram / Short DM Copy */}
            <button
              onClick={() => handleCopy(instagramMessage, "insta")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                copiedType === "insta"
                  ? "bg-[#e1306c]/10 border-[#e1306c] text-[#833ab4]"
                  : "bg-[#fffdfa] border-[#e2ded6] hover:bg-[#f5f2eb] text-[#1a1a1a]"
              }`}
            >
              <span className="text-base mb-1">📸</span>
              <span className="font-bold">인스타 DM / 숏폼</span>
              <span className="text-[10px] text-[#7a7266] mt-0.5">
                {copiedType === "insta" ? "✓ 복사 완료!" : "간결한 메시지 복사"}
              </span>
            </button>
          </div>

          {/* Simple Link Copy */}
          <div className="flex items-center gap-2 p-2 bg-[#f0ede6] rounded-xl border border-[#dedad0]">
            <input
              type="text"
              readOnly
              value={giftUrl}
              className="flex-1 bg-transparent text-[11px] font-mono text-[#4a4c48] px-2 outline-none select-all"
            />
            <button
              onClick={() => handleCopy(giftUrl, "link")}
              className="px-3 py-1.5 bg-[#1a1a1a] text-white text-[11px] font-medium rounded-lg hover:bg-black transition-colors"
            >
              {copiedType === "link" ? "복사됨!" : "링크복사"}
            </button>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="text-center">
          <p className="text-[10px] text-[#8c8e8b]">
            ✦ 수령인에게는 가격 정보가 100% 비노출되며, 선물 수락 후 안심 배송됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
