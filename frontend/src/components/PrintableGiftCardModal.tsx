"use client";

import { useToast } from "@/context/ToastContext";

interface PrintableGiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  senderName: string;
  messageCard: string;
  cardTheme?: "ivory" | "emerald" | "noir" | "rose" | string;
  sealMonogram?: string;
}

export default function PrintableGiftCardModal({
  isOpen,
  onClose,
  token,
  senderName,
  messageCard,
  cardTheme = "ivory",
  sealMonogram = "SP",
}: PrintableGiftCardModalProps) {
  const { showToast } = useToast();

  if (!isOpen) return null;

  const giftUrl = typeof window !== "undefined"
    ? `${window.location.origin}/gift/${token}`
    : `https://sharepresent.app/gift/${token}`;

  // High-res QR code image URL via quickchart/api for crisp printing
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    giftUrl
  )}&format=svg`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(giftUrl);
    showToast("선물 링크가 클립보드에 복사되었습니다! 🔗", "success");
  };

  const themeConfig = {
    ivory: {
      bg: "bg-[#faf8f5]",
      border: "border-[#d8d0c2]",
      text: "text-[#1a1a1a]",
      sealBg: "bg-[#8c7355]",
      sealText: "text-[#fbf9f5]",
      accent: "text-[#8c7355]",
      name: "Classic Ivory Linen",
    },
    emerald: {
      bg: "bg-[#17261c]",
      border: "border-[#324b38]",
      text: "text-[#f2f7f4]",
      sealBg: "bg-[#45614d]",
      sealText: "text-[#f2f7f4]",
      accent: "text-[#a3c9ae]",
      name: "Forest Emerald",
    },
    noir: {
      bg: "bg-[#141414]",
      border: "border-[#333333]",
      text: "text-[#f5f5f5]",
      sealBg: "bg-[#2d2d2d]",
      sealText: "text-[#e5e5e5]",
      accent: "text-[#a3a3a3]",
      name: "Midnight Noir",
    },
    rose: {
      bg: "bg-[#fcf5f5]",
      border: "border-[#ebd7d5]",
      text: "text-[#261819]",
      sealBg: "bg-[#b0787d]",
      sealText: "text-[#fff6f6]",
      accent: "text-[#b0787d]",
      name: "Dusty Rose",
    },
  }[cardTheme] || {
    bg: "bg-[#faf8f5]",
    border: "border-[#d8d0c2]",
    text: "text-[#1a1a1a]",
    sealBg: "bg-[#8c7355]",
    sealText: "text-[#fbf9f5]",
    accent: "text-[#8c7355]",
    name: "Classic Ivory Linen",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#eae6df] max-h-[95vh] overflow-y-auto relative print:border-none print:shadow-none print:max-w-none print:w-full print:p-0">
        {/* Modal Top Header (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#eae6df] mb-5 print:hidden">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#a38974] font-bold block">
              PHYSICAL INVITATION STATIONERY
            </span>
            <h2 className="font-serif text-lg font-bold text-[#1a1a1a]">
              실물 인쇄용 럭셔리 기프트 카드 & QR
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f2eb] hover:bg-[#e8e4dc] flex items-center justify-center text-xs font-bold text-[#5e605d] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Printable Card Area */}
        <div
          id="printable-luxury-card"
          className={`p-7 sm:p-8 rounded-2xl border-2 ${themeConfig.border} ${themeConfig.bg} ${themeConfig.text} shadow-lg relative overflow-hidden text-center space-y-5 print:shadow-none print:border-2 print:rounded-none`}
        >
          {/* Subtle Outer Frame Decoration */}
          <div className="absolute inset-2 border border-dashed border-current opacity-20 pointer-events-none rounded-xl" />

          {/* Top Brand & Monogram Seal */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-serif font-bold shadow-md ring-4 ring-white/20 mb-2.5 ${themeConfig.sealBg} ${themeConfig.sealText}`}
            >
              {sealMonogram}
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest font-mono opacity-80">
              SHAREPRESENT LUXURY CURATION
            </span>
            <span className="text-xs font-serif font-bold tracking-widest uppercase mt-0.5 opacity-90">
              Private Invitation
            </span>
          </div>

          {/* Sender Message in classical typography */}
          <div className="py-2 px-3">
            <p className="font-serif text-sm sm:text-base leading-relaxed italic whitespace-pre-line">
              &ldquo;{messageCard}&rdquo;
            </p>
            <p className="text-xs font-serif font-bold mt-3 opacity-90">
              From. {senderName}
            </p>
          </div>

          {/* High-Resolution QR Code Block */}
          <div className="bg-white p-4 rounded-2xl border border-[#dedad0] shadow-sm max-w-[200px] mx-auto text-center space-y-2">
            <div className="w-36 h-36 mx-auto bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-1">
              <img
                src={qrCodeUrl}
                alt="Gift QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[9px] font-mono text-[#7a7266] block font-bold uppercase tracking-wider">
              Scan to Choose Gift
            </span>
          </div>

          {/* Recipient Privacy Guarantee Badge */}
          <div className="pt-2 text-[10px] opacity-70 leading-relaxed font-serif">
            스마트폰 카메라로 QR 코드를 스캔하시면 큐레이션된 선물 룩북이 열립니다.
            <br />
            (수령인 결제 비용 0원 · 안심 배송)
          </div>
        </div>

        {/* Modal Actions (Hidden when printing) */}
        <div className="mt-6 pt-4 border-t border-[#eae6df] flex gap-2 print:hidden">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 btn-editorial-outline py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <span>🔗</span>
            <span>선물 링크 복사</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 btn-editorial py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
          >
            <span>🖨️</span>
            <span>카드 인쇄 / PDF 저장</span>
          </button>
        </div>
      </div>
    </div>
  );
}
