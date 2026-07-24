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
        // Fallback mock for local testing
        setOrder({
          orderId: 101,
          selectedProductBrand: "OIMU",
          selectedProductName: "소락사 샌디 도자기 머그",
          selectedOption: "샌드 화이트",
          shippingStatus: "COMPLETED",
          lockedAmount: 60000,
          finalAmount: 38000,
          refundAmount: 22000,
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
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center">
        <p className="text-xs font-bold text-[#3b483a] tracking-wider uppercase animate-pulse">
          Calculating Settlement... ✦
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 text-center">
        <p className="text-sm text-[#5e605d]">정산 결과를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const formattedAddressText = `[SharePresent 선물 배송지 정보]
- 브랜드/상품명: [${order.selectedProductBrand}] ${order.selectedProductName}
- 선택 옵션: ${order.selectedOption || "옵션없음"}
- 배송상태: ${order.shippingStatus}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(formattedAddressText);
    alert("선물 정산 정보가 클립보드에 복사되었습니다!");
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-[#faf9f6]">
      <Header />

      <main className="p-4 flex-1 max-w-[540px] mx-auto w-full">
        <div className="text-center my-6">
          <div className="w-12 h-12 rounded-full bg-[#3b483a]/5 flex items-center justify-center text-2xl mx-auto mb-3">
            💌
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block mb-1">
            Sender Private Settlement Report
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1a1a1a]">
            선물 선택 및 정산 완료
          </h1>
          <p className="text-xs text-[#5e605d] mt-1.5 leading-relaxed max-w-xs mx-auto">
            소중한 분께서 마음이 담긴 선물을 선택하셨습니다.
          </p>
        </div>

        {/* Selected Product Summary */}
        <section className="editorial-card p-5 mb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-white bg-[#3b483a] px-2.5 py-1 rounded-md">
            Recipient's Selection
          </span>
          <div className="mt-4">
            <span className="text-xs font-extrabold text-[#a38974] block mb-0.5">
              {order.selectedProductBrand}
            </span>
            <h2 className="text-xl font-bold text-[#1a1a1a]">
              {order.selectedProductName}
            </h2>
            {order.selectedOption && (
              <p className="text-xs text-[#5e605d] mt-2 flex items-center gap-1.5">
                <span>선택 옵션:</span>
                <span className="font-bold text-[#1a1a1a] bg-[#f6f4f0] border border-[#eae6df] px-2.5 py-0.5 rounded-md">
                  {order.selectedOption}
                </span>
              </p>
            )}
          </div>
        </section>

        {/* Settlement Details */}
        <section className="editorial-card p-5 mb-6">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a] mb-4 border-b border-[#eae6df] pb-3 flex items-center gap-1.5">
            <span>💳</span>
            <span>예산 및 자동 차액 환불 명세표</span>
          </h3>

          <div className="space-y-3 text-xs mb-4">
            <div className="flex justify-between items-center">
              <span className="text-[#5e605d]">상한 예산 가결제 보관액</span>
              <span className="font-bold text-[#1a1a1a]">{order.lockedAmount.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#5e605d]">선택 상품 최종 결제액</span>
              <span className="font-extrabold text-[#3b483a] text-sm">{order.finalAmount.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-[#eae6df] text-sm font-bold">
              <span className="text-[#3b483a]">카드 자동 부분 취소 환불액</span>
              <span className="text-[#3b483a] text-base">{order.refundAmount.toLocaleString()} 원</span>
            </div>
          </div>

          <div className="p-3 bg-[#f6f4f0] rounded-xl text-[11px] text-[#5e605d] leading-relaxed border border-[#eae6df]">
            🔒 <strong>보안 노출 안내</strong>: 선물 받으신 분께는 금액 정보가 100% 비노출 처리되었습니다. 최종 정산 금액과의 차액 {order.refundAmount.toLocaleString()}원은 대표님의 결제 카드로 즉시 자동 부분 취소 승인되었습니다.
          </div>
        </section>

        {/* Action Buttons */}
        <div className="space-y-3">
          {order.externalUrl && (
            <a
              href={order.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-editorial py-4 text-xs font-bold uppercase tracking-widest text-center block shadow-md"
            >
              외부 쇼핑몰에서 직접 구매하기 ↗
            </a>
          )}

          <button onClick={handleCopyAddress} className="btn-editorial-outline py-3.5 text-xs font-bold uppercase tracking-wider">
            선물 정산 및 배송 내역 복사하기 📋
          </button>
        </div>
      </main>
    </div>
  );
}
