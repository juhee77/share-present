"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";

interface MockSentBox {
  id: number;
  token: string;
  createdAt: string;
  minBudget: number;
  maxBudget: number;
  status: "WAITING" | "COMPLETED";
  messageCard: string;
  selectedProductName?: string;
  selectedProductBrand?: string;
  selectedOption?: string;
  refundAmount?: number;
  shippingStatus?: string;
}

const MOCK_SENT_BOXES: MockSentBox[] = [
  {
    id: 1,
    token: "demo_token_123",
    createdAt: "2026.07.24",
    minBudget: 30000,
    maxBudget: 60000,
    status: "COMPLETED",
    messageCard: "생일 축하해! 마음에 드는 선물 하나 골라주면 주소지로 바로 보내줄게 🎁",
    selectedProductBrand: "OIMU",
    selectedProductName: "소락사 샌디 도자기 머그",
    selectedOption: "샌드 화이트",
    refundAmount: 22000,
    shippingStatus: "PREPARING",
  },
  {
    id: 2,
    token: "demo_token_456",
    createdAt: "2026.07.22",
    minBudget: 40000,
    maxBudget: 80000,
    status: "WAITING",
    messageCard: "취업을 축하해! 원하는 선물을 고르면 주소지로 배송해드립니다 ✦",
  },
];

const TRENDING_GIFTS = [
  {
    rank: 1,
    brand: "GRANHAND",
    name: "마린 오크모스 사쉐 퍼퓸",
    price: 45000,
    pickRate: "48%",
    category: "향수/인테리어",
    tag: "🔥 수령인 선택률 1위",
    imageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80",
  },
  {
    rank: 2,
    brand: "OIMU",
    name: "소락사 샌디 도자기 머그",
    price: 38000,
    pickRate: "32%",
    category: "테이블웨어",
    tag: "☕ 감성 오피스 베스트",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
  },
  {
    rank: 3,
    brand: "NONFICTION",
    name: "젠틀나잇 핸드워시 (300ml)",
    price: 32000,
    pickRate: "20%",
    category: "바디/스파",
    tag: "🌿 부담없는 럭셔리",
    imageUrl: "https://images.unsplash.com/photo-1608248597309-45da1e028896?w=600&auto=format&fit=crop&q=80",
  },
];

export default function SenderDashboardPage() {
  const [sentBoxes] = useState<MockSentBox[]>(MOCK_SENT_BOXES);

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-[#faf9f6]">
      <Header />

      <main className="p-4 flex-1 max-w-[540px] mx-auto w-full">
        {/* Title Header */}
        <div className="my-6">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block mb-1">
            Sender Dashboard & Curation Trends
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1a1a1a]">
            내가 보낸 선물함
          </h1>
          <p className="text-xs text-[#5e605d] mt-1.5 leading-relaxed">
            보내신 선물함의 실시간 수령 현황과 요즘 인기 있는 선물 랭킹을 확인해보세요.
          </p>
        </div>

        {/* Section 1: My Sent Boxes */}
        <div className="flex items-center justify-between mb-3.5 px-1">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a]">
            Sent Gift Archives ({sentBoxes.length})
          </span>
          <Link
            href="/"
            className="text-[10px] font-bold text-[#3b483a] bg-[#3b483a]/5 px-2.5 py-1 rounded-md hover:bg-[#3b483a]/10 transition-colors"
          >
            + 새 선물함 만들기
          </Link>
        </div>

        <div className="space-y-4 mb-8">
          {sentBoxes.map((box) => (
            <div key={box.id} className="editorial-card p-5 bg-white relative">
              <div className="flex items-center justify-between border-b border-[#eae6df] pb-3 mb-3">
                <span className="text-[11px] font-mono text-[#5e605d]">
                  {box.createdAt} 작성
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    box.status === "COMPLETED"
                      ? "bg-[#3b483a] text-white"
                      : "bg-[#a38974]/15 text-[#a38974]"
                  }`}
                >
                  {box.status === "COMPLETED" ? "🟢 선택 완료 & 정산 완료" : "🟡 수령인 선택 대기 중"}
                </span>
              </div>

              <p className="text-xs text-[#1a1a1a] font-serif font-bold italic mb-3">
                "{box.messageCard}"
              </p>

              <div className="text-xs text-[#5e605d] space-y-1.5 mb-4 bg-[#f6f4f0] p-3 rounded-xl border border-[#eae6df]">
                <div className="flex justify-between">
                  <span>설정 예산 범위</span>
                  <span className="font-bold text-[#1a1a1a]">
                    {box.minBudget.toLocaleString()}원 ~ {box.maxBudget.toLocaleString()}원
                  </span>
                </div>

                {box.status === "COMPLETED" && (
                  <>
                    <div className="flex justify-between text-[#3b483a] font-bold pt-1 border-t border-[#eae6df]">
                      <span>선택된 선물</span>
                      <span>[{box.selectedProductBrand}] {box.selectedProductName}</span>
                    </div>
                    {box.selectedOption && (
                      <div className="flex justify-between text-[11px]">
                        <span>선택 옵션</span>
                        <span className="font-semibold">{box.selectedOption}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#3b483a] font-bold pt-1 border-t border-[#eae6df]">
                      <span>자동 부분 환불액</span>
                      <span>{box.refundAmount?.toLocaleString()}원 환불 완료</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {box.status === "COMPLETED" ? (
                  <Link
                    href={`/result/${box.token}`}
                    className="btn-editorial-outline text-center text-xs py-3 font-bold uppercase tracking-wider w-full"
                  >
                    정산 및 배송 내역 상세 ↗
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/gift/${box.token}`;
                      navigator.clipboard.writeText(url);
                      alert("카카오톡 선물 링크가 복사되었습니다!");
                    }}
                    className="btn-editorial text-center text-xs py-3 font-bold uppercase tracking-wider w-full"
                  >
                    선물 링크 복사하기 📋
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Trending Gifts */}
        <div id="trends" className="pt-4">
          <div className="flex items-center justify-between mb-3.5 px-1 border-t border-[#eae6df] pt-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block">
                Weekly Popular Choice
              </span>
              <h2 className="text-lg font-serif font-bold text-[#1a1a1a]">
                🔥 요즘 인기 큐레이션 선물 랭킹
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {TRENDING_GIFTS.map((item) => (
              <div key={item.rank} className="editorial-card p-4 bg-white flex gap-4 items-center">
                <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-[#eae6df]">
                  <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                  <span className="absolute top-1 left-1 bg-[#3b483a] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    #{item.rank}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#a38974] block">
                    {item.brand} · {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#1a1a1a] truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs font-bold text-[#3b483a] mt-0.5">
                    {item.price.toLocaleString()} KRW
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-[#3b483a] bg-[#3b483a]/10 px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">
                      선택률 {item.pickRate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="btn-editorial py-4 text-xs tracking-widest uppercase font-bold text-center block shadow-md"
            >
              인기 선물들로 선물함 생성하기 ✦
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
