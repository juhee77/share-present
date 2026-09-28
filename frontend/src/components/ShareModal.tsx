"use client";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { soundFx } from "@/lib/sound";
import AlimtalkPreviewModal from "./AlimtalkPreviewModal";
import PrintableGiftCardModal from "./PrintableGiftCardModal";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  senderName: string;
  messageCard?: string;
  cardTheme?: "ivory" | "emerald" | "noir" | "rose" | string;
  sealMonogram?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  token,
  senderName,
  messageCard = "당신을 위해 정성껏 고른 선물입니다.",
  cardTheme = "ivory",
  sealMonogram = "SP",
}: ShareModalProps) {
  const { showToast } = useToast();
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [showAlimtalkModal, setShowAlimtalkModal] = useState(false);
  const [showPrintableModal, setShowPrintableModal] = useState(false);

  if (!isOpen) return null;

  const giftUrl = typeof window !== "undefined" ? `${window.location.origin}/gift/${token}` : `https://sharepresent.app/gift/${token}`;

  const kakaoMessage = `💌 [SharePresent] ${senderName}님이 당신을 위한 프라이빗 선물 룩북을 보냈습니다.
받는 분의 취향에 꼭 맞는 선물을 직접 고르실 수 있도록 정성껏 준비했어요.

▶ ${giftUrl}`;

  const instagramMessage = `✨ ${senderName}님이 선물 상자를 보냈어요! 🎁
원하는 아이템과 배송지를 입력하면 선물 배송이 시작됩니다:
${giftUrl}`;

  const handleKakaoShare = async () => {
    // 1. 클립보드에 초대 텍스트 자동 복사 (안전장치)
    try {
      await navigator.clipboard.writeText(kakaoMessage);
    } catch {
      // ignore clipboard error
    }

    // 2. 카카오톡 웹 공유 팝업 열기 (PC/모바일 공통 지원)
    const kakaoSharerUrl = `https://sharer.kakao.com/talk/friends/picker/link?link=${encodeURIComponent(
      giftUrl
    )}&app_key=sharepresent`;

    // 3. 모바일 Web Share API가 사용 가능한 경우 시스템 공유 시도
    if (typeof navigator !== "undefined" && navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: `[SharePresent] ${senderName}님의 프라이빗 선물`,
          text: kakaoMessage,
          url: giftUrl,
        });
        soundFx.playSuccessTick();
        showToast("카카오톡으로 선물이 공유되었습니다! 💌", "success");
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }

    // 4. 데스크탑 또는 Web Share fallback: 카카오 공식 웹 공유 팝업 열기
    soundFx.playSuccessTick();
    setCopiedType("kakao");
    const width = 500;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      kakaoSharerUrl,
      "kakao_share",
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );
    showToast("카카오톡 공유창이 열렸습니다! (문구도 복사 완료) 💌", "success");
    setTimeout(() => setCopiedType(null), 3000);
  };

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      soundFx.playSuccessTick();
      setCopiedType(type);
      if (type === "kakao-text") {
        showToast("카카오톡 초대 문구가 복사되었습니다! 💬", "success");
      } else if (type === "insta") {
        showToast("인스타 DM 초대 링크가 복사되었습니다! ✨", "success");
      } else {
        showToast("선물 초대 링크가 클립보드에 복사되었습니다! 🔗", "success");
      }
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      showToast("클립보드 복사에 실패했습니다.", "error");
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

  const themeMap: Record<string, { bg: string; border: string; seal: string; label: string; dark?: boolean }> = {
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
  };
  const themeStyles = themeMap[cardTheme] || themeMap.ivory;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
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
              {sealMonogram}
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
          {/* Primary Kakao Direct Send Button */}
          <button
            onClick={handleKakaoShare}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#FEE500] hover:bg-[#FDD800] text-[#191919] rounded-xl text-xs font-bold active:scale-[0.99] transition-all shadow-md border border-[#f0d600]"
          >
            <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
              <path d="M12 3C6.477 3 2 6.477 2 10.765c0 2.766 1.868 5.19 4.686 6.556l-.97 3.567a.5.5 0 0 0 .736.545l4.242-2.802c.427.042.862.064 1.306.064 5.523 0 10-3.477 10-7.765S17.523 3 12 3z" />
            </svg>
            <span>카카오톡으로 선물 바로 보내기</span>
            {copiedType === "kakao" && <span className="text-[10px] text-[#3c1e1e] font-normal">(실행 중)</span>}
          </button>

          {/* Native Mobile Share */}
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#3b483a] text-white rounded-xl text-xs font-medium hover:bg-[#2e392d] active:scale-[0.99] transition-all shadow-sm"
          >
            <span>📱</span>
            <span>스마트폰 기본 앱으로 공유하기</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {/* Kakao Formatted Copy */}
            <button
              onClick={() => handleCopy(kakaoMessage, "kakao-text")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                copiedType === "kakao-text"
                  ? "bg-[#fee500]/20 border-[#fee500] text-[#3c1e1e]"
                  : "bg-[#fffdfa] border-[#e2ded6] hover:bg-[#f5f2eb] text-[#3c1e1e]"
              }`}
            >
              <span className="text-base mb-1">💬</span>
              <span className="font-bold">초대 문구 복사</span>
              <span className="text-[10px] text-[#7a7266] mt-0.5">
                {copiedType === "kakao-text" ? "✓ 복사 완료!" : "정중한 안내 텍스트"}
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

          {/* Printable Luxury Invitation Card & QR Trigger */}
          <button
            onClick={() => setShowPrintableModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#f5f2eb] hover:bg-[#eae6df] border border-[#dedad0] rounded-xl text-xs font-bold text-[#1a1a1a] transition-all"
          >
            <span>🖨️</span>
            <span>실물 인쇄용 럭셔리 기프트 카드 / QR 코드 생성</span>
          </button>

          {/* Alimtalk Simulator Trigger */}
          <button
            onClick={() => setShowAlimtalkModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#fee500]/15 hover:bg-[#fee500]/30 border border-[#fee500]/70 rounded-xl text-xs font-bold text-[#3c1e1e] transition-all"
          >
            <span>💬</span>
            <span>카카오 알림톡 실시간 미리보기 / 시뮬레이터</span>
          </button>

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

      {/* Alimtalk Preview Simulator Modal */}
      <AlimtalkPreviewModal
        isOpen={showAlimtalkModal}
        onClose={() => setShowAlimtalkModal(false)}
        senderName={senderName}
        messageCard={messageCard}
      />

      {/* Printable Luxury Gift Card & QR Modal */}
      <PrintableGiftCardModal
        isOpen={showPrintableModal}
        onClose={() => setShowPrintableModal(false)}
        token={token}
        senderName={senderName}
        messageCard={messageCard}
        cardTheme={cardTheme}
        sealMonogram={sealMonogram}
      />
    </div>
  );
}
