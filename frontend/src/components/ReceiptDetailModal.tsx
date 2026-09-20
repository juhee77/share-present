"use client";

import { useToast } from "@/context/ToastContext";

export interface ReceiptDetailBox {
  id: number;
  token: string;
  createdAt: string;
  minBudget: number;
  maxBudget: number;
  messageCard: string;
  selectedProductName?: string;
  selectedProductBrand?: string;
  selectedOption?: string;
  refundAmount?: number;
  shippingStatus?: string;
  carrierName?: string;
  trackingNumber?: string;
  thankYouSticker?: string;
  thankYouMessage?: string;
  thankYouPhotoUrl?: string;
}

interface ReceiptDetailModalProps {
  isOpen: boolean;
  box: ReceiptDetailBox | null;
  onClose: () => void;
}

export default function ReceiptDetailModal({ isOpen, box, onClose }: ReceiptDetailModalProps) {
  const { showToast } = useToast();

  if (!isOpen || !box) return null;

  const actualPrice = (box.maxBudget || 0) - (box.refundAmount || 0);

  const formattedReceiptText = `[SharePresent 선물 정산 영수증]
• 선물 토큰: ${box.token}
• 작성일자: ${box.createdAt}
• 선택 상품: [${box.selectedProductBrand || "브랜드"}] ${box.selectedProductName || "상품명"}
• 선택 옵션: ${box.selectedOption || "옵션없음"}
• 최대 보관 예산: ${box.maxBudget.toLocaleString()}원
• 최종 결제 금액: ${actualPrice.toLocaleString()}원
• 자동 환불 금액: ${(box.refundAmount || 0).toLocaleString()}원
• 택배사: ${box.carrierName || "CJ대한통운"} (운송장: ${box.trackingNumber || "6849-3012-9381"})
• 배송 상태: ${box.shippingStatus || "PREPARING"}`;

  const handleCopyReceipt = () => {
    navigator.clipboard.writeText(formattedReceiptText);
    showToast("정산 영수증 전문이 클립보드에 복사되었습니다! 📋", "success");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#eae6df] max-h-[90vh] overflow-y-auto relative print:border-none print:shadow-none print:max-w-none print:w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#eae6df] mb-6 print:hidden">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#a38974] font-bold">
            SETTLEMENT STATEMENT
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f2eb] hover:bg-[#e8e4dc] flex items-center justify-center text-xs font-bold text-[#5e605d] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Printable Receipt Card Body */}
        <div className="text-left space-y-6">
          {/* Brand Header */}
          <div className="text-center pb-4 border-b border-dashed border-[#d8d0c2]">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3b483a] block mb-1">
              SHAREPRESENT LUXURY CURATION
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1a1a1a]">
              선물 정산 및 출고 명세서
            </h2>
            <p className="text-[11px] font-mono text-[#7a7266] mt-1">
              Token: {box.token} · Date: {box.createdAt}
            </p>
          </div>

          {/* Selected Gift Section */}
          <div className="p-4 bg-[#faf9f6] rounded-2xl border border-[#eae6df]">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#a38974] block mb-1">
              Selected Gift Item
            </span>
            <span className="text-xs font-extrabold text-[#3b483a] block">
              {box.selectedProductBrand}
            </span>
            <h3 className="text-base font-bold text-[#1a1a1a] mt-0.5">
              {box.selectedProductName}
            </h3>
            {box.selectedOption && (
              <span className="inline-block mt-1.5 text-[11px] font-semibold bg-white border border-[#eae6df] px-2.5 py-0.5 rounded-md text-[#5e605d]">
                옵션: {box.selectedOption}
              </span>
            )}
          </div>

          {/* Financial Breakdown Table */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 text-[#5e605d]">
              <span>가결제 보관 예산 (Locked Max)</span>
              <span className="font-mono font-bold text-[#1a1a1a]">
                ₩{box.maxBudget.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 text-[#5e605d]">
              <span>선택 상품 최종 실 결제액</span>
              <span className="font-mono font-bold text-[#1a1a1a]">
                ₩{actualPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-t border-[#eae6df] text-[#3b483a] font-bold text-sm">
              <span className="flex items-center gap-1">
                <span>✦</span>
                <span>차액 즉시 자동 환불액</span>
              </span>
              <span className="font-mono">
                +₩{(box.refundAmount || 0).toLocaleString()}
              </span>
            </div>
            <p className="text-[10px] text-[#7a7266] text-right">
              * 결제하신 카드사를 통해 차액이 전액 자동 부분 환불되었습니다.
            </p>
          </div>

          {/* Delivery Carrier Status */}
          <div className="p-4 bg-[#f5f2eb] rounded-2xl border border-[#dedad0] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1a1a1a] flex items-center gap-1.5">
                <span>🚚</span>
                <span>실시간 배송 정보</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3b483a] text-white">
                {box.shippingStatus === "SHIPPED" ? "배송 중" : "상품 준비 중"}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-[#5e605d] pt-1">
              <span>택배사 / 운송장</span>
              <span className="font-mono font-bold text-[#1a1a1a]">
                {box.carrierName || "CJ대한통운"} {box.trackingNumber || "6849-3012-9381"}
              </span>
            </div>
          </div>

          {/* Polaroid Thank-You Card */}
          {box.thankYouMessage && (
            <div className="p-4 bg-white rounded-2xl border border-[#dedad0] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#a38974]">
                  💌 Recipient Thank-You Reply
                </span>
                <span className="text-[11px] font-bold text-[#3b483a] bg-[#3b483a]/10 px-2.5 py-0.5 rounded-full">
                  {box.thankYouSticker}
                </span>
              </div>

              {box.thankYouPhotoUrl && (
                <div className="aspect-[16/10] relative rounded-xl overflow-hidden bg-gray-100 mb-2.5 border border-[#eae6df]">
                  <img
                    src={box.thankYouPhotoUrl}
                    alt="Unboxing photo"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              <p className="text-xs text-[#1a1a1a] font-serif leading-relaxed italic bg-[#faf9f6] p-3 rounded-xl border border-[#eae6df]">
                "{box.thankYouMessage}"
              </p>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="mt-6 pt-4 border-t border-[#eae6df] flex gap-2 print:hidden">
          <button
            type="button"
            onClick={handleCopyReceipt}
            className="flex-1 btn-editorial-outline py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <span>📋</span>
            <span>영수증 복사</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 btn-editorial py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
          >
            <span>🖨️</span>
            <span>인쇄 / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
