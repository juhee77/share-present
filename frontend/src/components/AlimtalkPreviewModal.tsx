"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";

interface AlimtalkPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  senderName?: string;
  receiverName?: string;
  messageCard?: string;
  productName?: string;
  refundAmount?: number;
  trackingNumber?: string;
}

type AlimtalkTemplate = "ARRIVAL" | "ACCEPTED" | "SHIPPING";

export default function AlimtalkPreviewModal({
  isOpen,
  onClose,
  senderName = "주희",
  receiverName = "민우",
  messageCard = "생일 축하해! 마음에 드는 선물 하나 골라주면 주소지로 바로 보내줄게 🎁",
  productName = "소락사 샌디 도자기 머그",
  refundAmount = 22000,
  trackingNumber = "6849-3012-9381",
}: AlimtalkPreviewModalProps) {
  const { showToast } = useToast();
  const [activeTemplate, setActiveTemplate] = useState<AlimtalkTemplate>("ARRIVAL");
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  const handleSimulateSend = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      showToast("카카오 비즈메시지 알림톡 가상 발송이 완료되었습니다! 💬", "success");
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-[#faf9f6] w-full max-w-sm rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#d8d5cf] relative overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5e2db] mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEE500] border border-[#d1be00]"></span>
            <h3 className="text-xs font-bold text-[#1a1a1a] tracking-wider uppercase">
              KakaoTalk Alimtalk Simulator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#ede9e1] flex items-center justify-center text-[#5e605d] hover:bg-[#dedad0] transition-colors font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Template Selector Tabs */}
        <div className="flex bg-[#ede9e1] p-1 rounded-xl mb-4 text-[11px] font-bold">
          <button
            onClick={() => setActiveTemplate("ARRIVAL")}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              activeTemplate === "ARRIVAL"
                ? "bg-white text-[#1a1a1a] shadow-sm font-extrabold"
                : "text-[#5e605d] hover:text-[#1a1a1a]"
            }`}
          >
            🎁 선물 도착
          </button>
          <button
            onClick={() => setActiveTemplate("ACCEPTED")}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              activeTemplate === "ACCEPTED"
                ? "bg-white text-[#1a1a1a] shadow-sm font-extrabold"
                : "text-[#5e605d] hover:text-[#1a1a1a]"
            }`}
          >
            ✨ 수락 & 환불
          </button>
          <button
            onClick={() => setActiveTemplate("SHIPPING")}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              activeTemplate === "SHIPPING"
                ? "bg-white text-[#1a1a1a] shadow-sm font-extrabold"
                : "text-[#5e605d] hover:text-[#1a1a1a]"
            }`}
          >
            🚚 배송 시작
          </button>
        </div>

        {/* Smartphone Screen Mockup */}
        <div className="flex-1 bg-[#BACEE0] rounded-2xl p-4 overflow-y-auto border border-[#a2b7ca] shadow-inner mb-4">
          {/* Chat Date Divider */}
          <div className="flex justify-center mb-3">
            <span className="bg-[#000000]/15 text-white text-[10px] px-3 py-0.5 rounded-full font-medium">
              2026년 7월 24일 금요일
            </span>
          </div>

          {/* Profile & Bubble */}
          <div className="flex items-start gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#3b483a] text-white flex items-center justify-center font-serif font-bold text-xs shadow-sm flex-shrink-0">
              SP
            </div>
            <div className="flex-1 max-w-[260px]">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-bold text-[#2c3e50]">SharePresent</span>
                <span className="bg-[#FEE500] text-[#3c1e1e] text-[9px] font-bold px-1.5 py-0.2 rounded">
                  알림톡
                </span>
              </div>

              {/* Alimtalk Yellow Card Bubble */}
              <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-black/5 text-[#191919] space-y-3">
                {/* 1. Template: Arrival */}
                {activeTemplate === "ARRIVAL" && (
                  <>
                    <div className="border-b border-[#f0f0f0] pb-2.5">
                      <span className="text-[11px] font-bold text-[#3b483a] block">
                        [프라이빗 선물 도착 알림]
                      </span>
                      <h4 className="text-sm font-bold text-[#111] mt-0.5">
                        {senderName}님이 당신을 위한 선물함을 보냈습니다 💌
                      </h4>
                    </div>

                    <div className="text-xs text-[#444] space-y-1 leading-relaxed">
                      <p className="bg-[#faf9f6] p-2.5 rounded-xl border border-[#eae6df] text-[11px] italic text-[#555]">
                        "{messageCard}"
                      </p>
                      <p className="text-[11px] text-[#666] pt-1">
                        • 마음에 드는 선물을 골라주시면 주소지로 무료 배송됩니다.
                        <br />
                        • 수령인 결제/부담 비용: <strong className="text-[#3b483a]">0원</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      className="w-full bg-[#FEE500] hover:bg-[#ebd300] text-[#191919] text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                    >
                      선물 룩북 열어보기 ✦
                    </button>
                  </>
                )}

                {/* 2. Template: Accepted */}
                {activeTemplate === "ACCEPTED" && (
                  <>
                    <div className="border-b border-[#f0f0f0] pb-2.5">
                      <span className="text-[11px] font-bold text-[#3b483a] block">
                        [선물 수락 및 차액 환불 안내]
                      </span>
                      <h4 className="text-sm font-bold text-[#111] mt-0.5">
                        {receiverName}님이 선물을 수락하셨습니다! 🎁
                      </h4>
                    </div>

                    <div className="text-xs text-[#444] space-y-1.5 leading-relaxed">
                      <div className="bg-[#f8f6f0] p-2.5 rounded-xl border border-[#eae6df] space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-[#777]">선택 상품:</span>
                          <span className="font-bold text-[#111]">{productName}</span>
                        </div>
                        <div className="flex justify-between text-[#3b483a]">
                          <span className="font-bold">자동 환불액:</span>
                          <span className="font-extrabold">{refundAmount.toLocaleString()}원</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#888]">
                        * 가승인 차액은 결제하신 카드사 정책에 따라 1~3 영업일 내 자동 취소 환불됩니다.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="w-full bg-[#FEE500] hover:bg-[#ebd300] text-[#191919] text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                    >
                      최종 정산 명세서 확인 ↗
                    </button>
                  </>
                )}

                {/* 3. Template: Shipping */}
                {activeTemplate === "SHIPPING" && (
                  <>
                    <div className="border-b border-[#f0f0f0] pb-2.5">
                      <span className="text-[11px] font-bold text-[#3b483a] block">
                        [배송 시작 안내]
                      </span>
                      <h4 className="text-sm font-bold text-[#111] mt-0.5">
                        선택하신 선물의 배송이 시작되었습니다 🚚
                      </h4>
                    </div>

                    <div className="text-xs text-[#444] space-y-1.5 leading-relaxed">
                      <div className="bg-[#f8f6f0] p-2.5 rounded-xl border border-[#eae6df] space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-[#777]">택배사:</span>
                          <span className="font-bold text-[#111]">CJ대한통운</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#777]">운송장번호:</span>
                          <span className="font-mono font-bold text-[#111]">{trackingNumber}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#888]">
                        * 도서산간 지역의 경우 1~2일 추가 소요될 수 있습니다.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="w-full bg-[#FEE500] hover:bg-[#ebd300] text-[#191919] text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                    >
                      실시간 배송 조회하기 📦
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSimulateSend}
            disabled={isSimulating}
            className="flex-1 bg-[#3b483a] hover:bg-[#2e392d] text-white py-3 rounded-xl text-xs font-bold tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>💬</span>
            <span>{isSimulating ? "전송 중..." : "알림톡 가상 발송 테스트"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
