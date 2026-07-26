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

interface MockReceivedBox {
  id: number;
  token: string;
  receivedAt: string;
  senderName: string;
  messageCard: string;
  selectedProductBrand: string;
  selectedProductName: string;
  selectedOption?: string;
  shippingStatus: "PREPARING" | "SHIPPED" | "DELIVERED";
  carrierName: string;
  trackingNumber: string;
  imageUrl: string;
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

const MOCK_RECEIVED_BOXES: MockReceivedBox[] = [
  {
    id: 101,
    token: "demo_token_123",
    receivedAt: "2026.07.24",
    senderName: "주희",
    messageCard: "생일 축하해! 마음에 드는 선물 하나 골라주면 주소지로 바로 보내줄게 🎁",
    selectedProductBrand: "OIMU",
    selectedProductName: "소락사 샌디 도자기 머그",
    selectedOption: "샌드 화이트",
    shippingStatus: "PREPARING",
    carrierName: "CJ대한통운",
    trackingNumber: "6849-3012-9381",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 102,
    token: "demo_token_789",
    receivedAt: "2026.07.15",
    senderName: "민우",
    messageCard: "올 한 해도 정말 수고 많았어! 힐링하는 시간 되길 바라 🌿",
    selectedProductBrand: "NONFICTION",
    selectedProductName: "젠틀나잇 핸드워시 (300ml)",
    shippingStatus: "SHIPPED",
    carrierName: "CJ대한통운",
    trackingNumber: "7210-9834-1102",
    imageUrl: "https://images.unsplash.com/photo-1608248597309-45da1e028896?w=600&auto=format&fit=crop&q=80",
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

type DashboardTab = "RECEIVED" | "SENT" | "TRENDS";

export default function SenderDashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("RECEIVED");
  const [sentBoxes] = useState<MockSentBox[]>(MOCK_SENT_BOXES);
  const [receivedBoxes] = useState<MockReceivedBox[]>(MOCK_RECEIVED_BOXES);

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-[#faf9f6]">
      <Header />

      <main className="p-4 flex-1 max-w-[540px] mx-auto w-full">
        {/* Header Banner */}
        <div className="my-5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block mb-1">
            Personal Gifting Archive
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1a1a1a]">
            선물 보관함 및 대시보드
          </h1>
          <p className="text-xs text-[#5e605d] mt-1 leading-relaxed">
            받으신 선물과 보내신 선물의 배송 상태 및 정산 내역을 한눈에 관리해보세요.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[#eae6df]/60 p-1 rounded-xl mb-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab("RECEIVED")}
            className={`flex-1 py-2.5 rounded-lg text-center transition-all ${
              activeTab === "RECEIVED"
                ? "bg-white text-[#3b483a] shadow-sm font-extrabold"
                : "text-[#5e605d] hover:text-[#1a1a1a]"
            }`}
          >
            🎁 내가 받은 선물 ({receivedBoxes.length})
          </button>

          <button
            onClick={() => setActiveTab("SENT")}
            className={`flex-1 py-2.5 rounded-lg text-center transition-all ${
              activeTab === "SENT"
                ? "bg-white text-[#3b483a] shadow-sm font-extrabold"
                : "text-[#5e605d] hover:text-[#1a1a1a]"
            }`}
          >
            💌 내가 보낸 선물 ({sentBoxes.length})
          </button>

          <button
            onClick={() => setActiveTab("TRENDS")}
            className={`flex-1 py-2.5 rounded-lg text-center transition-all ${
              activeTab === "TRENDS"
                ? "bg-white text-[#3b483a] shadow-sm font-extrabold"
                : "text-[#5e605d] hover:text-[#1a1a1a]"
            }`}
          >
            🔥 인기 랭킹
          </button>
        </div>

        {/* TAB 1: Received Gifts */}
        {activeTab === "RECEIVED" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a]">
                Received Gifts Archive
              </span>
              <span className="text-[10px] text-[#5e605d]">
                금액 정보는 100% 비노출 처리됩니다
              </span>
            </div>

            {receivedBoxes.map((box) => (
              <div key={box.id} className="editorial-card p-4.5 bg-white">
                <div className="flex items-center justify-between border-b border-[#eae6df] pb-3 mb-3">
                  <span className="text-[11px] font-bold text-[#a38974]">
                    From. {box.senderName}님 ({box.receivedAt})
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      box.shippingStatus === "SHIPPED"
                        ? "bg-[#3b483a] text-white"
                        : "bg-[#a38974]/15 text-[#a38974]"
                    }`}
                  >
                    {box.shippingStatus === "SHIPPED" ? "🚚 배송 시작됨" : "📦 상품 준비 중"}
                  </span>
                </div>

                <p className="text-xs text-[#1a1a1a] font-serif font-bold italic mb-3">
                  "{box.messageCard}"
                </p>

                {/* Selected Item info (Zero Price) */}
                <div className="flex gap-3.5 items-center p-3 bg-[#f6f4f0] rounded-xl border border-[#eae6df] mb-3.5">
                  <div className="w-14 h-14 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                    <img src={box.imageUrl} alt={box.selectedProductName} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#a38974] block">
                      {box.selectedProductBrand}
                    </span>
                    <h3 className="text-xs font-bold text-[#1a1a1a] truncate">
                      {box.selectedProductName}
                    </h3>
                    {box.selectedOption && (
                      <span className="text-[10px] text-[#5e605d] block mt-0.5">
                        옵션: {box.selectedOption}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/gift/track/${box.token}`}
                  className="btn-editorial text-center text-xs py-3 font-bold uppercase tracking-wider block shadow-sm"
                >
                  실시간 배송 상태 조회 📦
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Sent Gifts */}
        {activeTab === "SENT" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a]">
                Sent Gifts Archive
              </span>
              <Link
                href="/"
                className="text-[10px] font-bold text-[#3b483a] bg-[#3b483a]/5 px-2.5 py-1 rounded-md hover:bg-[#3b483a]/10 transition-colors"
              >
                + 새 선물함 만들기
              </Link>
            </div>

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
        )}

        {/* TAB 3: Trending Gifts */}
        {activeTab === "TRENDS" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2 px-1">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block">
                  Weekly Popular Choice
                </span>
                <h2 className="text-base font-serif font-bold text-[#1a1a1a]">
                  🔥 요즘 인기 큐레이션 선물 랭킹
                </h2>
              </div>
            </div>

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

            <div className="mt-6">
              <Link
                href="/"
                className="btn-editorial py-4 text-xs tracking-widest uppercase font-bold text-center block shadow-md"
              >
                인기 선물들로 선물함 생성하기 ✦
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
