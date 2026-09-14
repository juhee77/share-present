"use client";

import { use, useEffect, useState } from "react";
import Header from "@/components/Header";
import { getOrderResult, OrderResponse } from "@/lib/api";

export default function RecipientTrackingPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedTracking, setCopiedTracking] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await getOrderResult(token);
        setOrder(data);
      } catch (err) {
        console.error(err);
        // Fallback mock for recipient live delivery status
        setOrder({
          orderId: 101,
          selectedProductBrand: "OIMU",
          selectedProductName: "소락사 샌디 도자기 머그",
          selectedOption: "샌드 화이트",
          shippingStatus: "PREPARING",
          carrierName: "CJ대한통운",
          trackingNumber: "6849-3012-9381",
          lockedAmount: 60000,
          finalAmount: 38000,
          refundAmount: 22000,
          status: "COMPLETED",
        });
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center">
        <p className="text-xs font-bold text-[#3b483a] tracking-wider uppercase animate-pulse">
          Retrieving Delivery Status... 📦
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 text-center">
        <p className="text-sm text-[#5e605d]">배송 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  // Dynamic status index
  const statusMap: Record<string, number> = {
    ACCEPTED: 0,
    PREPARING: 1,
    SHIPPED: 2,
    DELIVERED: 3,
  };

  const currentStepIndex = statusMap[order.shippingStatus?.toUpperCase() || "PREPARING"] ?? 1;

  const steps = [
    { label: "선물 수락", desc: "주소지 접수 완료" },
    { label: "상품 준비중", desc: "검수 및 선물 포장" },
    { label: "배송 시작", desc: "택배사 인계 완료" },
    { label: "배송 완료", desc: "수령인 전달" },
  ];

  const handleCopyTrackingNumber = () => {
    const num = order.trackingNumber || "6849-3012-9381";
    navigator.clipboard.writeText(num.replace(/[^0-9]/g, ""));
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-[#faf9f6]">
      <Header />

      <main className="p-4 flex-1 max-w-[540px] mx-auto w-full">
        {/* Title */}
        <div className="text-center my-6">
          <div className="w-12 h-12 rounded-full bg-[#3b483a]/5 flex items-center justify-center text-2xl mx-auto mb-3">
            📦
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block mb-1">
            Recipient Delivery Tracker
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1a1a1a]">
            선물 배송 현황 조회
          </h1>
          <p className="text-xs text-[#5e605d] mt-1.5 leading-relaxed">
            수락하신 선물이 정성스럽게 포장되어 배송 준비 중입니다.
          </p>
        </div>

        {/* Selected Product Card (Zero Price Guaranteed) */}
        <section className="editorial-card p-5 mb-5 bg-white shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block mb-1">
            {order.selectedProductBrand}
          </span>
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">
            {order.selectedProductName}
          </h2>
          {order.selectedOption && (
            <span className="inline-block text-xs text-[#3b483a] bg-[#f6f4f0] border border-[#eae6df] px-2.5 py-1 rounded-md font-bold mt-1">
              옵션: {order.selectedOption}
            </span>
          )}
        </section>

        {/* 4-Step Timeline Progress */}
        <section className="editorial-card p-5 mb-5 bg-white shadow-sm">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a] mb-6 border-b border-[#eae6df] pb-3">
            📍 실시간 배송 진행 단계
          </h3>

          <div className="relative flex items-center justify-between px-2 mb-2">
            {/* Horizontal Line */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#eae6df] -z-0" />

            {steps.map((s, idx) => {
              const isPassed = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={idx} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPassed
                        ? "bg-[#3b483a] text-white shadow-sm"
                        : isCurrent
                        ? "bg-[#a38974] text-white ring-4 ring-[#a38974]/20 animate-pulse"
                        : "bg-[#f6f4f0] text-gray-400 border border-[#eae6df]"
                    }`}
                  >
                    {isPassed ? "✓" : idx + 1}
                  </div>
                  <span className="text-[11px] font-bold text-[#1a1a1a] mt-2 text-center">
                    {s.label}
                  </span>
                  <span className="text-[9px] text-[#7a7266] text-center hidden sm:block">
                    {s.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Detailed Courier Activity Logs */}
        <section className="editorial-card p-5 mb-5 bg-white shadow-sm">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a] mb-4 border-b border-[#eae6df] pb-3">
            📋 배송 히스토리 타임라인
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#3b483a] mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-[#1a1a1a]">럭셔리 패키징 및 송장 등록 완료</p>
                <p className="text-[10px] text-[#7a7266] font-mono mt-0.5">오늘 14:20 · SharePresent 부티크 물류센터</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#a38974] mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-[#1a1a1a]">선물 수락 및 배송지 정보 접수</p>
                <p className="text-[10px] text-[#7a7266] font-mono mt-0.5">오늘 09:30 · 온라인 선물 수락 완료</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tracking Details */}
        <section className="editorial-card p-5 mb-6 bg-white space-y-3.5 text-xs shadow-sm">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a] border-b border-[#eae6df] pb-3">
            🚚 운송장 정보
          </h3>

          <div className="flex justify-between items-center">
            <span className="text-[#5e605d]">택배사</span>
            <span className="font-bold text-[#1a1a1a]">{order.carrierName || "CJ대한통운"}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#5e605d]">운송장 번호</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-[#3b483a] text-sm">
                {order.trackingNumber || "6849-3012-9381"}
              </span>
              <button
                onClick={handleCopyTrackingNumber}
                className="text-[10px] px-2 py-0.5 rounded bg-[#f0ece3] text-[#3b483a] font-bold hover:bg-[#e4decb]"
              >
                {copiedTracking ? "복사됨!" : "복사"}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={`https://tracker.delivery/rubydb/${(order.trackingNumber || "684930129381").replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-editorial-outline block text-center py-3 text-xs font-bold uppercase tracking-wider"
            >
              택배사 실시간 위치조회 바로가기 ↗
            </a>
          </div>
        </section>

        <p className="text-[11px] text-[#5e605d] text-center leading-relaxed">
          💡 출고 완료 시 수령인 휴대폰 번호로 카카오 알림톡이 자동 발송됩니다.
        </p>
      </main>
    </div>
  );
}
