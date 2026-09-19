"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  minBudget: number;
  maxBudget: number;
  selectedProductCount: number;
  senderName: string;
}

const PAYMENT_METHODS = [
  { id: "toss", name: "토스페이", icon: "💙", desc: "1초 간편결제" },
  { id: "kakao", name: "카카오페이", icon: "🟡", desc: "카톡 머니 / 카드" },
  { id: "card", name: "신용/체크카드", icon: "💳", desc: "현대·신한·KB·삼성" },
  { id: "naver", name: "네이버페이", icon: "🟢", desc: "포인트 동시 적립" },
];

export default function CheckoutModal({
  isOpen,
  onClose,
  onSuccess,
  minBudget,
  maxBudget,
  selectedProductCount,
  senderName,
}: CheckoutModalProps) {
  const { showToast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState("toss");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"SELECT" | "PROCESSING" | "APPROVED">("SELECT");

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setStep("PROCESSING");

    setTimeout(() => {
      setStep("APPROVED");
      showToast(`${maxBudget.toLocaleString()}원 가승인 결제가 완료되었습니다! 💳`, "success");
      setTimeout(() => {
        setIsProcessing(false);
        setStep("SELECT");
        onSuccess();
      }, 900);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-[#faf9f6] w-full max-w-md rounded-2xl p-6 sm:p-7 shadow-2xl border border-[#d8d5cf] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "PROCESSING" && (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full border-4 border-[#3b483a]/20 border-t-[#3b483a] animate-spin mb-6" />
            <h3 className="font-serif text-xl font-bold text-[#1a1a1a] mb-2">
              PG사 안전 결제 승인 중...
            </h3>
            <p className="text-xs text-[#5e605d] font-mono">
              최대 예산 한도({maxBudget.toLocaleString()}원) 가승인 토큰 발급 중
            </p>
          </div>
        )}

        {step === "APPROVED" && (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-3xl mb-4 font-bold">
              ✓
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-2">
              가승인 결제 완료!
            </h3>
            <p className="text-xs text-[#5e605d]">
              선물 상자가 성공적으로 활성화되었습니다.
            </p>
          </div>
        )}

        {step === "SELECT" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e2db] mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3b483a]"></span>
                <h3 className="text-xs font-serif font-bold text-[#1a1a1a] tracking-wider uppercase">
                  Secure Escrow Checkout
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-[#8c8e8b] hover:text-[#1a1a1a] p-1 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Curation Box Summary */}
            <div className="p-4 bg-white rounded-xl border border-[#eae6df] mb-5 shadow-sm space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#5e605d]">
                <span>선물 제안 구성</span>
                <span className="font-bold text-[#1a1a1a]">{selectedProductCount}개 엄선 아이템</span>
              </div>
              <div className="flex justify-between items-center text-[#5e605d]">
                <span>설정 예산 범위</span>
                <span className="font-bold text-[#1a1a1a]">
                  {minBudget.toLocaleString()}원 ~ {maxBudget.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between items-center text-[#5e605d] pt-2 border-t border-[#f0ede6]">
                <span>보내는 분</span>
                <span className="font-semibold text-[#1a1a1a]">{senderName}</span>
              </div>
            </div>

            {/* Escrow Payment Notice */}
            <div className="p-3.5 bg-[#f0ece3] rounded-xl border border-[#dedad0] mb-5">
              <div className="flex items-start gap-2.5">
                <span className="text-base mt-0.5">💡</span>
                <div className="text-[11px] text-[#4a4c48] leading-relaxed">
                  <strong className="text-[#1a1a1a] block mb-0.5">안심 차액 자동 환불 시스템</strong>
                  최대 예산 한도인 <strong>{maxBudget.toLocaleString()}원</strong>이 먼저 결제 가승인되며, 수령인이 최종 상품을 선택하면 차액은 <strong>1초 만에 자동 즉시 환불</strong>됩니다.
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-5">
              <label className="block text-[11px] font-bold text-[#5e605d] uppercase tracking-wider mb-2">
                결제 수단 선택
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedMethod === m.id
                        ? "bg-white border-[#3b483a] ring-2 ring-[#3b483a]/20 shadow-sm"
                        : "bg-[#fffdfa] border-[#e2ded6] hover:bg-[#f5f2eb]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{m.icon}</span>
                      <span className="text-xs font-bold text-[#1a1a1a]">{m.name}</span>
                    </div>
                    <span className="text-[10px] text-[#7a7266] block">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="btn-editorial py-4 text-xs tracking-widest uppercase font-bold shadow-md w-full"
            >
              <span>{maxBudget.toLocaleString()}원 결제 및 선물 상자 활성화 ✦</span>
            </button>

            {/* Escrow Trust Security Footer */}
            <p className="text-[10px] text-[#7a7266] text-center mt-3 flex items-center justify-center gap-1">
              <span>🔒</span>
              <span>금융감독원 전자금융거래법 기준 100% 에스크로 안전 결제</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
