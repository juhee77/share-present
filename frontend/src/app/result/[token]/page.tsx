"use client";

import { use, useEffect, useState } from "react";
import Header from "@/components/Header";
import { getOrderResult, OrderResponse } from "@/lib/api";

export default function OrderResultPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResult() {
      try {
        const data = await getOrderResult(token);
        setOrder(data);
      } catch (err) {
        console.error(err);
        // Fallback Mock Data for local testing
        setOrder({
          orderId: 101,
          selectedProductBrand: "OIMU",
          selectedProductName: "소락사 샌디 도자기 머그",
          selectedOption: "샌드 화이트",
          shippingStatus: "COMPLETED",
          lockedAmount: 50000,
          finalAmount: 38000,
          refundAmount: 12000,
          status: "COMPLETED",
        });
      } finally {
        setLoading(false);
      }
    }
    loadResult();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center">
        <p className="text-sm font-semibold text-[#798a75] animate-pulse">
          선물 정산 결과를 조회하는 중... 🎁
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center p-6 text-center">
        <p className="text-sm text-[#7c7e7c]">정산 결과를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const formattedAddressText = `[SharePresent 선물 배송지 정보]
- 상품: [${order.selectedProductBrand}] ${order.selectedProductName} (${order.selectedOption || "옵션없음"})
- 배송상태: ${order.shippingStatus}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(formattedAddressText);
    alert("배송 주소 정보가 클립보드에 복사되었습니다!");
  };

  return (
    <div className="flex flex-col min-h-screen pb-12">
      <Header />

      <main className="p-6 flex-1 max-w-[600px] mx-auto w-full">
        <div className="text-center my-6">
          <span className="text-4xl">🎉</span>
          <p className="text-xs uppercase tracking-widest text-[#b58d75] font-semibold mt-2 mb-1">
            Gift Settlement Complete
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#2a2c2b]">
            선물 선택 완료!
          </h1>
          <p className="text-xs text-[#7c7e7c] mt-2">
            받으실 분이 가장 원하시는 선물을 선택하셨습니다.
          </p>
        </div>

        {/* Selected Product Summary */}
        <section className="card-premium mb-4">
          <span className="text-xs font-bold text-[#b58d75] uppercase">
            선택된 선물
          </span>
          <div className="mt-2">
            <span className="text-xs font-bold text-[#798a75]">
              {order.selectedProductBrand}
            </span>
            <h2 className="text-xl font-bold text-[#2a2c2b]">
              {order.selectedProductName}
            </h2>
            {order.selectedOption && (
              <p className="text-xs text-[#7c7e7c] mt-1">
                옵션: <span className="font-semibold text-[#2a2c2b]">{order.selectedOption}</span>
              </p>
            )}
          </div>
        </section>

        {/* Settlement Payment Details */}
        <section className="card-premium mb-6">
          <h3 className="text-sm font-bold text-[#2a2c2b] mb-3 border-b border-black/5 pb-2">
            💳 예산 정산 및 환불 내역
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#7c7e7c]">가결제 한도 금액</span>
              <span className="font-semibold">{order.lockedAmount.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7c7e7c]">최종 상품 정산 금액</span>
              <span className="font-semibold text-[#798a75]">{order.finalAmount.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-black/5 text-sm font-bold">
              <span className="text-[#b58d75]">자동 부분 환불 예정액</span>
              <span className="text-[#b58d75]">{order.refundAmount.toLocaleString()} 원</span>
            </div>
          </div>
        </section>

        {/* External Link Action or Copy Button */}
        <div className="space-y-3">
          {order.externalUrl && (
            <a
              href={order.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              외부 파트너몰에서 구매하기 ↗
            </a>
          )}

          <button onClick={handleCopyAddress} className="btn-secondary">
            선물 정산 내역 복사하기 📋
          </button>
        </div>
      </main>
    </div>
  );
}
