"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { createCurationBox, fetchProducts, ProductDto } from "@/lib/api";

const LOOKBOOK_PRODUCTS: ProductDto[] = [
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
  {
    id: 7,
    brand: "TAMBURINS",
    name: "퍼퓸 핸드크림 CHAMO (30ml)",
    price: 32000,
    description: "진득한 카모마일의 약초 향과 따스한 우디 가드의 부드러움이 감도는 탬버린즈 시그니처 핸드크림.",
    options: ["CHAMO", "BERGA SANDAL", "LALE"],
    imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 8,
    brand: "AESOP",
    name: "레저렉션 아로마틱 핸드 밤 (75ml)",
    price: 39000,
    description: "지친 손에 유분기 없는 풍부한 수분감을 공급하는 이솝의 아이코닉 시트러스 우디 핸드밤.",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 9,
    brand: "DIPTYQUE",
    name: "미니 센티드 캔들 베이 (70g)",
    price: 68000,
    description: "장미 꽃다발의 향과 블랙커런트 잎의 싱그러운 도회적 노트가 조화로운 딥티크 시그니처 캔들.",
    options: ["베이(Baies)", "장미(Roses)", "피기에(Figuier)"],
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 10,
    brand: "SABRE",
    name: "비스트로 디너 카트러리 2인 세트",
    price: 46000,
    description: "파리 카페의 감성을 담아낸 컬러풀하고 세련된 프랑스 프리미엄 카트러리 세트.",
    options: ["아이보리", "티크", "타코이즈"],
    imageUrl: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 11,
    brand: "KINTO",
    name: "데이오프 텀블러 (500ml)",
    price: 42000,
    description: "부드러운 손잡이와 은은한 파스텔 톤 코팅으로 일상 속 휴식을 선사하는 킨토 스테인리스 텀블러.",
    options: ["무스타치 화이트", "페일 블루", "카키"],
    imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 12,
    brand: "LE LABO",
    name: "상탈 33 바디 로션 (237ml)",
    price: 98000,
    description: "스모키한 피망과 카드멈, 바이올렛 향이 아우러져 개성을 완성하는 르라보의 클래식 로션.",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 13,
    brand: "MAISON MARGIELA",
    name: "레이지 선데이 모닝 디퓨저 (185ml)",
    price: 118000,
    description: "깨끗하게 세탁된 갓 다린 리넨 이불에서 느껴지는 포근하고 부드러운 화이트 머스크 향.",
    imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 14,
    brand: "HAY",
    name: "클리어 그래픽 유리컵 & 트레이 세트",
    price: 54000,
    description: "덴마크 북유럽 감성의 덴마크 HAY 그래픽 기하학 패턴 테이블웨어 세트.",
    options: ["옐로우 트레이", "그린 트레이"],
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 15,
    brand: "SANTA MARIA NOVELLA",
    name: "프리지아 고체 향수 왁스 태블릿",
    price: 58000,
    description: "피렌체 전통 제조법으로 꽃잎을 굳혀 옷장과 드레스룸을 고급스러운 프리지아 향으로 채워주는 왁스.",
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 16,
    brand: "BANG & OLUFSEN",
    name: "베오사운드 A1 2nd Gen 포터블 스피커",
    price: 145000,
    description: "덴마크 뱅앤올룹슨의 명품 방수 블루투스 스피커. 아노다이징 알루미늄 돔 케이싱.",
    options: ["블랙 앤트러사이트", "샤방 핑크", "골드 톤"],
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
  },
];

const BUDGET_MIN_OPTIONS = [10000, 20000, 30000, 40000, 50000];
const BUDGET_MAX_OPTIONS = [30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 150000];

export default function CreateGiftPage() {
  const [senderName, setSenderName] = useState("주희");
  const [messageCard, setMessageCard] = useState(
    "생일 축하해! 마음에 드는 선물 하나 골라주면 주소지로 바로 보내줄게 🎁"
  );
  
  // Double-bound budget range states
  const [minBudget, setMinBudget] = useState(30000);
  const [maxBudget, setMaxBudget] = useState(60000);
  
  const [allowCustomInput, setAllowCustomInput] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([1, 2, 3]);

  // Catalog Search & Filter State
  const [searchKeyword, setSearchKeyword] = useState("");
  const [products, setProducts] = useState<ProductDto[]>(LOOKBOOK_PRODUCTS);

  // Custom External Product State
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customBrand, setCustomBrand] = useState("");
  const [customName, setCustomName] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [customDesc, setCustomDesc] = useState("");

  // Modal Share Link State
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch backend dynamic products or filter
  useEffect(() => {
    async function loadDynamicProducts() {
      try {
        const fetched = await fetchProducts(searchKeyword, minBudget, maxBudget);
        if (fetched && fetched.length > 0) {
          setProducts(fetched);
        } else {
          // Fallback to local filtering
          let filtered = LOOKBOOK_PRODUCTS.filter(
            (p) => p.price >= minBudget && p.price <= maxBudget
          );
          if (searchKeyword) {
            const kw = searchKeyword.toLowerCase();
            filtered = filtered.filter(
              (p) => p.brand.toLowerCase().includes(kw) || p.name.toLowerCase().includes(kw)
            );
          }
          setProducts(filtered.length > 0 ? filtered : LOOKBOOK_PRODUCTS);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadDynamicProducts();
  }, [searchKeyword, minBudget, maxBudget]);

  const toggleProductSelection = (id: number) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleCreateLink = async () => {
    if (minBudget > maxBudget) {
      alert("최소 예산이 최대 예산보다 클 수 없습니다.");
      return;
    }
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
        minBudget,
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
    <div className="flex flex-col min-h-screen pb-16 bg-[#faf9f6]">
      <Header />

      <main className="p-5 flex-1 max-w-[540px] mx-auto w-full">
        {/* Lookbook Title */}
        <div className="my-6 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block mb-1">
            Curated Gift Curation
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1a1a1a] tracking-tight">
            선물 큐레이션 박스 설계
          </h1>
          <p className="text-xs text-[#5e605d] mt-2 max-w-xs mx-auto leading-relaxed">
            보내는 분의 예산 범위를 설정하고, 제안하고 싶은 프리미엄 선물 리스트를 작성하세요.
          </p>
        </div>

        {/* 1. Sender Info Card */}
        <section className="editorial-card p-5 mb-5">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a] mb-4 flex items-center gap-2 border-b border-[#eae6df] pb-3">
            <span>✍️</span>
            <span>보내는 사람 & 카드 메시지</span>
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#5e605d] uppercase tracking-wider mb-1.5">
                보내는 사람 성함
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="input-editorial font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#5e605d] uppercase tracking-wider mb-1.5">
                카드 메시지
              </label>
              <textarea
                rows={3}
                value={messageCard}
                onChange={(e) => setMessageCard(e.target.value)}
                className="input-editorial resize-none font-serif text-sm"
              />
            </div>
          </div>
        </section>

        {/* 2. Double-Bound Budget & Custom Permissions */}
        <section className="editorial-card p-5 mb-5">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a] mb-4 flex items-center gap-2 border-b border-[#eae6df] pb-3">
            <span>💰</span>
            <span>예산 범위 및 수령인 옵션 설정</span>
          </h2>
          <div className="space-y-5">
            {/* Dual Range Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#5e605d] uppercase tracking-wider mb-1.5">
                  최소 예산 한도 (Min)
                </label>
                <select
                  value={minBudget}
                  onChange={(e) => setMinBudget(Number(e.target.value))}
                  className="select-editorial font-semibold text-xs"
                >
                  {BUDGET_MIN_OPTIONS.map((val) => (
                    <option key={val} value={val}>
                      {val.toLocaleString()} 원
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#5e605d] uppercase tracking-wider mb-1.5">
                  최대 예산 한도 (Max)
                </label>
                <select
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="select-editorial font-semibold text-xs"
                >
                  {BUDGET_MAX_OPTIONS.map((val) => (
                    <option key={val} value={val}>
                      {val.toLocaleString()} 원
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#eae6df]">
              <div>
                <span className="text-xs font-bold text-[#1a1a1a] block">
                  받는 이 직접 선물 입력 허용
                </span>
                <p className="text-[11px] text-[#5e605d] mt-0.5">
                  제안 리스트 외에 원하는 다른 선물 링크를 수령인이 직접 첨부할 수 있습니다.
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowCustomInput}
                onChange={(e) => setAllowCustomInput(e.target.checked)}
                className="w-5 h-5 accent-[#3b483a] cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* 3. Catalog Live Search Bar & Products List */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a]">
              Catalog & Live Open Search ({products.length})
            </span>
            <span className="text-xs font-bold text-[#3b483a] bg-[#3b483a]/5 px-2.5 py-0.5 rounded-md">
              {selectedProductIds.length}개 제안됨
            </span>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="🔍 수천 가지 브랜드 및 상품 실시간 검색... (예: 이솝, 탬버린즈, 딥티크, 머그)"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="input-editorial pl-4 pr-10 text-xs font-medium bg-white shadow-sm"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {products.map((product) => {
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

        {/* 4. External Custom proposal */}
        <section className="editorial-card p-4 my-5">
          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="w-full flex items-center justify-between text-xs font-bold text-[#3b483a]"
          >
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <span>✦</span>
              <span>외부 쇼핑몰 상품 직접 추가하기</span>
            </span>
            <span>{showCustomForm ? "▲" : "▼"}</span>
          </button>

          {showCustomForm && (
            <div className="mt-3 pt-3 border-t border-[#eae6df] space-y-3 animate-fade-in">
              <div>
                <label className="block text-xs text-[#5e605d] mb-1">브랜드명</label>
                <input
                  type="text"
                  placeholder="예: 탬버린즈"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  className="input-editorial"
                />
              </div>
              <div>
                <label className="block text-xs text-[#5e605d] mb-1">상품명</label>
                <input
                  type="text"
                  placeholder="예: 퍼퓸 핸드크림 CHAMO"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="input-editorial"
                />
              </div>
              <div>
                <label className="block text-xs text-[#5e605d] mb-1">외부 상품 링크 (URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="input-editorial"
                />
              </div>
            </div>
          )}
        </section>

        {/* Submit */}
        <button
          onClick={handleCreateLink}
          disabled={isSubmitting}
          className="btn-editorial py-4.5 text-xs tracking-widest uppercase font-bold shadow-md mt-2"
        >
          {isSubmitting ? "Curation Box Generating..." : "선물 링크 생성하기 ✦"}
        </button>
      </main>

      {/* Share Link Modal */}
      {createdToken && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl border border-[#eae6df]">
            <div className="w-12 h-12 rounded-full bg-[#3b483a]/5 flex items-center justify-center text-xl mx-auto mb-4">
              ✉️
            </div>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">
              선물 링크 생성 완료!
            </h2>
            <p className="text-xs text-[#5e605d] mb-5">
              아래 링크를 복사하여 선물 받을 분에게 카카오톡 또는 이메일로 전달해보세요.
            </p>

            <div className="p-3.5 bg-[#f6f4f0] rounded-xl break-all text-xs font-mono text-[#3b483a] mb-5 border border-[#eae6df] select-all font-semibold">
              {generatedGiftUrl}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedGiftUrl);
                  alert("선물 링크가 클립보드에 복사되었습니다!");
                }}
                className="btn-editorial py-3.5 text-xs tracking-wider uppercase font-bold"
              >
                선물 링크 복사하기 📋
              </button>

              <a
                href={`/gift/${createdToken}`}
                className="btn-editorial-outline block py-3.5 text-xs font-bold uppercase tracking-wider"
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
