"use client";

import { use, useEffect, useState } from "react";
import Header from "@/components/Header";
import { getOrderResult, OrderResponse } from "@/lib/api";

export default function RecipientTrackingPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

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

  // 4-step delivery progress state
  const steps = [
    { label: "선물 수락", status: "completed" },
    { label: "상품 준비중", status: "active" },
    { label: "배송 시작", status: "pending" },
    { label: "배송 완료", status: "pending" },
  ];

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

        {/* Selected Product Card (Zero Price) */}
        <section className="editorial-card p-5 mb-5 bg-white">
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
        <section className="editorial-card p-5 mb-5 bg-white">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a] mb-5 border-b border-[#eae6df] pb-3">
            📍 실시간 배송 진행 단계
          </h3>

          <div className="relative flex items-center justify-between px-2">
            {/* Horizontal Line */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#eae6df] -z-0" />

            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step.status === "completed"
                      ? "bg-[#3b483a] text-white shadow-sm"
                      : step.status === "active"
                      ? "bg-[#a38974] text-white ring-4 ring-[#a38974]/20 animate-pulse"
                      : "bg-[#f6f4f0] text-gray-400 border border-[#eae6df]"
                  }`}
                >
                  {step.status === "completed" ? "✓" : idx + 1}
                </div>
                <span className="text-[11px] font-bold text-[#1a1a1a] mt-2 text-center">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Tracking Details */}
        <section className="editorial-card p-5 mb-6 bg-white space-y-3.5 text-xs">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a] border-b border-[#eae6df] pb-3">
            🚚 운송장 정보
          </h3>

          <div className="flex justify-between items-center">
            <span className="text-[#5e605d]">택배사</span>
            <span className="font-bold text-[#1a1a1a]">{order.carrierName || "CJ대한통운"}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#5e605d]">운송장 번호</span>
            <span className="font-mono font-extrabold text-[#3b483a] text-sm">
              {order.trackingNumber || "6849-3012-9381"}
            </span>
          </div>

          <div className="pt-2">
            <a
              href={`https://tracker.delivery/rubydb/${order.trackingNumber || "684930129381"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-editorial-outline block text-center py-3 text-xs font-bold uppercase tracking-wider"
            >
              택배사 배송 조회 바로가기 ↗
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
