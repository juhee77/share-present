"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { createCurationBox, ProductDto } from "@/lib/api";

const STATIC_PRODUCTS: ProductDto[] = [
  {
    id: 1,
    brand: "OIMU",
    name: "소락사 샌디 도자기 머그",
    price: 38000,
    description: "설악산의 모래 질감을 담아낸 아늑하고 미니멀한 핸드메이드 도자기 컵 세트입니다.",
    options: ["샌드 화이트", "클레이 브라운"],
    icon: "mug",
  },
  {
    id: 2,
    brand: "GRANHAND",
    name: "마린 오크모스 사쉐 퍼퓸",
    price: 45000,
    description: "차분하고 내추럴한 나무와 풀 향으로 방 안을 가득 채우는 섬세한 패브릭 사쉐 퍼퓸입니다.",
    options: ["규장", "마린", "수지발삼"],
    icon: "perfume",
  },
  {
    id: 3,
    brand: "NONFICTION",
    name: "젠틀나잇 핸드워시 (300ml)",
    price: 32000,
    description: "달콤한 스웨이드와 시더우드 향이 어우러져 매일의 일상을 특별하게 해주는 핸드케어.",
    icon: "wash",
  },
  {
    id: 4,
    brand: "CROWCANYON",
    name: "머그 & 플레이트 세트",
    price: 48000,
    description: "마블 패턴으로 주방의 감도를 한 단계 올려주는 빈티지 테이블웨어 세트입니다.",
    options: ["블랙 마블", "핑크 마블", "베이비 블루 마블"],
    icon: "plate",
  },
  {
    id: 5,
    brand: "HUXLEY",
    name: "바디 케어 워시 & 로션 듀오",
    price: 52000,
    description: "선인장 시드 오일이 선사하는 깊은 보습과 시그니처 모로칸 정원 향의 바디 세트.",
    icon: "wash",
  },
  {
    id: 6,
    brand: "SOHPE",
    name: "아로마 오일 센티드 홈 캔들",
    price: 41000,
    description: "천연 에센셜 오일 블렌딩으로 심신을 안정시키고 평온한 무드를 제안하는 홈 캔들.",
    options: ["유칼립투스 라벤더", "패츌리 샌달우드"],
    icon: "candle",
  },
];

export default function CreateGiftPage() {
  const [senderName, setSenderName] = useState("주희");
  const [messageCard, setMessageCard] = useState(
    "생일 축하해! 마음에 드는 선물 하나 골라주면 주소지로 바로 보내줄게 🎁"
  );
  const [maxBudget, setMaxBudget] = useState(50000);
  const [allowCustomInput, setAllowCustomInput] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([1, 2, 3]);

  // Custom Product State
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
      const customProductsPayload = customName && customUrl ? [{
        brand: customBrand || "CUSTOM",
        name: customName,
        externalUrl: customUrl,
        description: customDesc,
      }] : [];

      const result = await createCurationBox({
        senderId: 1, // Default user
        maxBudget,
        messageCard,
        allowCustomInput,
        productIds: selectedProductIds,
        customProducts: customProductsPayload,
      });

      setCreatedToken(result.sharingToken);
    } catch (err) {
      console.error(err);
      alert("백엔드 연결에 실패했습니다. (기본 개발 서버: http://localhost:8080)");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatedGiftUrl = createdToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/gift/${createdToken}`
    : "";

  return (
    <div className="flex flex-col min-h-screen pb-12">
      <Header />

      <main className="p-6 flex-1 max-w-[600px] mx-auto w-full">
        <div className="text-center my-6">
          <p className="text-xs uppercase tracking-widest text-[#b58d75] font-semibold mb-1">
            Curate Premium Gifts
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#2a2c2b]">
            선물 큐레이션 상자 만들기
          </h1>
          <p className="text-xs text-[#7c7e7c] mt-2">
            받는 사람의 취향을 위한 선물 목록을 제안하고 예산 안에서 선택받으세요.
          </p>
        </div>

        {/* 1. Sender Info Card */}
        <section className="card-premium">
          <h2 className="text-sm font-bold text-[#2a2c2b] mb-3 flex items-center gap-2">
            <span>👤</span> 보내는 분 정보 & 메시지
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-[#7c7e7c] mb-1">보내는 사람 성함</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="input-text"
              />
            </div>
            <div>
              <label className="block text-xs text-[#7c7e7c] mb-1">카드 메시지</label>
              <textarea
                rows={3}
                value={messageCard}
                onChange={(e) => setMessageCard(e.target.value)}
                className="input-text resize-none"
              />
            </div>
          </div>
        </section>

        {/* 2. Budget & Custom Input Settings */}
        <section className="card-premium">
          <h2 className="text-sm font-bold text-[#2a2c2b] mb-3 flex items-center gap-2">
            <span>💰</span> 예산 및 수령인 권한 설정
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#7c7e7c] mb-1">
                최대 가결제 예산 한도:{" "}
                <span className="font-bold text-[#798a75]">
                  {maxBudget.toLocaleString()} 원
                </span>
              </label>
              <input
                type="range"
                min={30000}
                max={100000}
                step={5000}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-[#798a75] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>3만원</span>
                <span>5만원</span>
                <span>10만원</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-black/5">
              <div>
                <span className="text-xs font-bold text-[#2a2c2b]">
                  받는 이 직접 선물 입력 허용
                </span>
                <p className="text-[11px] text-[#7c7e7c]">
                  제안 목록 외에 받는 사람이 직접 선물 링크를 작성할 수 있습니다.
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowCustomInput}
                onChange={(e) => setAllowCustomInput(e.target.checked)}
                className="w-5 h-5 accent-[#798a75] cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* 3. Products Selection List */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold text-[#2a2c2b]">
              제안할 선물 아이템 선택 ({selectedProductIds.length}개 선택됨)
            </h2>
          </div>

          <div className="space-y-3">
            {STATIC_PRODUCTS.map((product) => {
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
        </section>

        {/* 4. Add External Custom Item Accordion */}
        <section className="card-premium mb-8">
          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="w-full flex items-center justify-between text-xs font-bold text-[#798a75]"
          >
            <span>+ 원하는 외부 쇼핑몰 상품 직접 제안하기</span>
            <span>{showCustomForm ? "▲" : "▼"}</span>
          </button>

          {showCustomForm && (
            <div className="mt-4 pt-4 border-t border-black/5 space-y-3 animate-fade-in">
              <div>
                <label className="block text-xs text-[#7c7e7c] mb-1">브랜드명</label>
                <input
                  type="text"
                  placeholder="예: 탬버린즈"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  className="input-text"
                />
              </div>
              <div>
                <label className="block text-xs text-[#7c7e7c] mb-1">상품명</label>
                <input
                  type="text"
                  placeholder="예: 퍼퓸 핸드크림 CHAMO"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="input-text"
                />
              </div>
              <div>
                <label className="block text-xs text-[#7c7e7c] mb-1">상품 외부 링크 (URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="input-text"
                />
              </div>
            </div>
          )}
        </section>

        {/* Create Button */}
        <button
          onClick={handleCreateLink}
          disabled={isSubmitting}
          className="btn-primary py-4 text-base"
        >
          {isSubmitting ? "선물 상자 생성 중..." : "선물 링크 생성하기 🎁"}
        </button>
      </main>

      {/* Share Link Result Modal */}
      {createdToken && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <span className="text-4xl">🎉</span>
            <h2 className="text-xl font-bold text-[#2a2c2b] mt-2 mb-1">
              선물 링크 생성 완료!
            </h2>
            <p className="text-xs text-[#7c7e7c] mb-4">
              아래 링크를 복사하여 선물 받을 분에게 카카오톡으로 전달해보세요.
            </p>

            <div className="p-3 bg-gray-50 rounded-xl break-all text-xs font-mono text-[#798a75] mb-4 select-all">
              {generatedGiftUrl}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedGiftUrl);
                  alert("선물 링크가 클립보드에 복사되었습니다!");
                }}
                className="btn-primary"
              >
                선물 링크 복사하기 📋
              </button>

              <a
                href={`/gift/${createdToken}`}
                className="btn-secondary block"
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
