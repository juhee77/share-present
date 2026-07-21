"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { createCurationBox, ProductDto } from "@/lib/api";

const INSTA_PRODUCTS: ProductDto[] = [
  {
    id: 1,
    brand: "OIMU",
    name: "소락사 샌디 도자기 머그",
    price: 38000,
    description: "설악산의 모래 질감을 담아낸 아늑하고 미니멀한 핸드메이드 도자기 컵 세트입니다.",
    options: ["샌드 화이트", "클레이 브라운"],
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    brand: "GRANHAND",
    name: "마린 오크모스 사쉐 퍼퓸",
    price: 45000,
    description: "차분하고 내추럴한 나무와 풀 향으로 방 안을 가득 채우는 섬세한 패브릭 사쉐 퍼퓸입니다.",
    options: ["규장", "마린", "수지발삼"],
    imageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    brand: "NONFICTION",
    name: "젠틀나잇 핸드워시 (300ml)",
    price: 32000,
    description: "달콤한 스웨이드와 시더우드 향이 어우러져 매일의 일상을 특별하게 해주는 핸드케어.",
    imageUrl: "https://images.unsplash.com/photo-1608248597309-45da1e028896?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    brand: "CROWCANYON",
    name: "머그 & 플레이트 세트",
    price: 48000,
    description: "마블 패턴으로 주방의 감도를 한 단계 올려주는 빈티지 테이블웨어 세트입니다.",
    options: ["블랙 마블", "핑크 마블", "베이비 블루 마블"],
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    brand: "HUXLEY",
    name: "바디 케어 워시 & 로션 듀오",
    price: 52000,
    description: "선인장 시드 오일이 선사하는 깊은 보습과 시그니처 모로칸 정원 향의 바디 세트.",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    brand: "SOHPE",
    name: "아로마 오일 센티드 홈 캔들",
    price: 41000,
    description: "천연 에센셜 오일 블렌딩으로 심신을 안정시키고 평온한 무드를 제안하는 홈 캔들.",
    options: ["유칼립투스 라벤더", "패츌리 샌달우드"],
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80",
  },
];

const STORY_HIGHLIGHTS = [
  { name: "Best 5", emoji: "🔥" },
  { name: "Ceramic", emoji: "☕" },
  { name: "Scent", emoji: "✨" },
  { name: "Body Care", emoji: "🛁" },
  { name: "Custom", emoji: "🔗" },
];

export default function CreateGiftPage() {
  const [senderName, setSenderName] = useState("주희");
  const [messageCard, setMessageCard] = useState(
    "생일 축하해! 마음에 드는 선물 하나 골라주면 주소지로 바로 보내줄게 🎁"
  );
  const [maxBudget, setMaxBudget] = useState(50000);
  const [allowCustomInput, setAllowCustomInput] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([1, 2, 3]);

  // Custom External Product State
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customBrand, setCustomBrand] = useState("");
  const [customName, setCustomName] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [customDesc, setCustomDesc] = useState("");

  // Modal Share Link State
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleProductSelection = (id: number) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleCreateLink = async () => {
    if (selectedProductIds.length === 0 && !customName) {
      alert("적어도 하나 이상의 선물 아이템을 선택하거나 제안해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const customProductsPayload =
        customName && customUrl
          ? [
              {
                brand: customBrand || "CUSTOM",
                name: customName,
                externalUrl: customUrl,
                description: customDesc,
              },
            ]
          : [];

      const result = await createCurationBox({
        senderId: 1,
        maxBudget,
        messageCard,
        allowCustomInput,
        productIds: selectedProductIds,
        customProducts: customProductsPayload,
      });

      setCreatedToken(result.sharingToken);
    } catch (err) {
      console.error(err);
      alert("백엔드 연결에 실패했습니다. (기본 개발 서버: http://localhost:8081)");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatedGiftUrl = createdToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/gift/${createdToken}`
    : "";

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-white">
      <Header />

      {/* Instagram Story Highlights Bar */}
      <section className="px-4 py-3 flex gap-4 overflow-x-auto no-scrollbar border-b border-[#f5f5f5]">
        {STORY_HIGHLIGHTS.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
            <div className="insta-story-ring">
              <div className="insta-story-inner">
                <div className="w-14 h-14 rounded-full bg-[#fafafa] flex items-center justify-center text-xl">
                  {item.emoji}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#262626] mt-1">
              {item.name}
            </span>
          </div>
        ))}
      </section>

      <main className="p-4 flex-1 max-w-[540px] mx-auto w-full">
        {/* Editorial Title */}
        <div className="my-5 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#737373] block mb-1">
            Instagram Editorial Gifting
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#121212] tracking-tight">
            선물 큐레이션 상자 만들기
          </h1>
        </div>

        {/* 1. Sender Info Form */}
        <section className="insta-card p-5 mb-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#121212] mb-3 flex items-center gap-1.5">
            <span>✍️</span>
            <span>Sender Info & Message</span>
          </h2>
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#737373] mb-1">
                보내는 사람 성함
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="input-insta font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#737373] mb-1">
                카드 메시지
              </label>
              <textarea
                rows={3}
                value={messageCard}
                onChange={(e) => setMessageCard(e.target.value)}
                className="input-insta resize-none font-serif text-sm"
              />
            </div>
          </div>
        </section>

        {/* 2. Budget & Permission Controls */}
        <section className="insta-card p-5 mb-5">
          <div className="flex items-center justify-between border-b border-[#f5f5f5] pb-3 mb-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#121212] flex items-center gap-1.5">
              <span>💳</span>
              <span>Budget & Options</span>
            </h2>
            <span className="text-xs font-bold text-white bg-[#121212] px-3 py-1 rounded-full">
              {maxBudget.toLocaleString()} 원
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#737373] font-semibold mb-2 flex justify-between">
                <span>최대 가결제 예산 한도</span>
                <span>3만원 ~ 10만원</span>
              </label>
              <input
                type="range"
                min={30000}
                max={100000}
                step={5000}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-[#121212] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#f5f5f5]">
              <div>
                <span className="text-xs font-bold text-[#121212] block">
                  받는 이 직접 선물 입력 허용
                </span>
                <p className="text-[11px] text-[#737373] mt-0.5">
                  제안 목록 외에 원하는 선물 링크를 첨부할 수 있습니다.
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowCustomInput}
                onChange={(e) => setAllowCustomInput(e.target.checked)}
                className="w-5 h-5 accent-[#121212] cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* 3. Products List Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#121212]">
            Curated Products ({selectedProductIds.length})
          </span>
          <span className="text-[11px] text-[#737373]">터치하여 선택</span>
        </div>

        {/* 4. Products Cards Grid */}
        <div className="space-y-4">
          {INSTA_PRODUCTS.map((product) => {
            const isSelected = selectedProductIds.includes(Number(product.id));
            return (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={isSelected}
                onSelect={() => toggleProductSelection(Number(product.id))}
              />
            );
          })}
        </div>

        {/* 5. Custom Link Accordion */}
        <section className="insta-card p-4 my-5">
          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="w-full flex items-center justify-between text-xs font-bold text-[#121212]"
          >
            <span className="flex items-center gap-1.5">
              <span>➕</span>
              <span>원하는 외부 쇼핑몰 상품 직접 제안하기</span>
            </span>
            <span>{showCustomForm ? "▲" : "▼"}</span>
          </button>

          {showCustomForm && (
            <div className="mt-3 pt-3 border-t border-[#f5f5f5] space-y-3 animate-fade-in">
              <div>
                <label className="block text-xs text-[#737373] mb-1">브랜드명</label>
                <input
                  type="text"
                  placeholder="예: 탬버린즈"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  className="input-insta"
                />
              </div>
              <div>
                <label className="block text-xs text-[#737373] mb-1">상품명</label>
                <input
                  type="text"
                  placeholder="예: 퍼퓸 핸드크림 CHAMO"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="input-insta"
                />
              </div>
              <div>
                <label className="block text-xs text-[#737373] mb-1">상품 링크 (URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="input-insta"
                />
              </div>
            </div>
          )}
        </section>

        {/* Submit Button */}
        <button
          onClick={handleCreateLink}
          disabled={isSubmitting}
          className="btn-insta-gradient py-4 text-base mt-2"
        >
          {isSubmitting ? "선물 링크 생성 중..." : "선물 링크 생성하기 🎁"}
        </button>
      </main>

      {/* Share Link Modal */}
      {createdToken && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-5 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-gray-100">
            <div className="insta-story-ring mb-3">
              <div className="insta-story-inner">
                <div className="w-14 h-14 rounded-full bg-[#121212] flex items-center justify-center text-2xl text-white">
                  💌
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#121212] mb-1">
              선물 링크 생성 완료!
            </h2>
            <p className="text-xs text-[#737373] mb-4">
              생성된 선물 링크를 카카오톡 또는 DM으로 전달해보세요.
            </p>

            <div className="p-3 bg-[#fafafa] rounded-xl break-all text-xs font-mono text-[#121212] mb-4 border border-[#e6e6e6] select-all">
              {generatedGiftUrl}
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedGiftUrl);
                  alert("선물 링크가 복사되었습니다!");
                }}
                className="btn-insta py-3.5"
              >
                선물 링크 복사하기 📋
              </button>

              <a
                href={`/gift/${createdToken}`}
                className="btn-insta-gradient block py-3.5 text-xs text-center"
              >
                수령인 페이지 미리보기 ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
