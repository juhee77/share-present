"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import MdPickSection from "@/components/MdPickSection";
import ShareModal from "@/components/ShareModal";
import CheckoutModal from "@/components/CheckoutModal";
import { useToast } from "@/context/ToastContext";
import { createCurationBox, fetchProducts, searchOpenProducts, ProductDto } from "@/lib/api";

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

const OCCASION_PRESETS = [
  {
    id: "birthday",
    label: "🎂 생일 축하",
    minBudget: 30000,
    maxBudget: 60000,
    message: "생일 진심으로 축하해! 마음에 드는 선물 하나 골라주면 주소지로 바로 보내줄게 🎁",
    productIds: [1, 2, 7],
  },
  {
    id: "housewarming",
    label: "🏡 집들이",
    minBudget: 40000,
    maxBudget: 80000,
    message: "새 보금자리 입주를 축하해! 공간을 아늑하게 채워줄 잇템으로 골라봐 🌿",
    productIds: [4, 6, 10],
  },
  {
    id: "career",
    label: "💼 이직/퇴사",
    minBudget: 30000,
    maxBudget: 50000,
    message: "새로운 시작을 축하하고 응원해! 언제나 너의 도전을 응원하고 있어 ✦",
    productIds: [3, 7, 11],
  },
  {
    id: "wedding",
    label: "👶 신혼/출산",
    minBudget: 50000,
    maxBudget: 120000,
    message: "소중한 기쁨을 함께 나눠서 너무 기뻐! 행복 가득한 날들 보내 💐",
    productIds: [5, 9, 14],
  },
  {
    id: "healing",
    label: "🌿 힐링/위로",
    minBudget: 30000,
    maxBudget: 50000,
    message: "요즘 고생 많았지? 소소하지만 마음 담은 선물로 힐링 타임 갖길 바랄게 ☕",
    productIds: [2, 8, 15],
  },
];

const PRODUCT_CATEGORIES = [
  { id: "ALL", label: "전체 ✦" },
  { id: "FRAGRANCE", label: "향수/디퓨저 🌿", keywords: ["향수", "사쉐", "캔들", "디퓨저", "르라보", "딥티크", "그랑핸드", "산타마리아노벨라", "perfume", "fragrance"] },
  { id: "BODYCARE", label: "핸드/바디 🧴", keywords: ["핸드", "바디", "워시", "밤", "이솝", "논픽션", "탬버린즈", "로션"] },
  { id: "LIVING", label: "홈/테이블웨어 ☕", keywords: ["머그", "도자기", "컵", "트레이", "오이뮤", "하야", "킨토", "사브르"] },
  { id: "TECH", label: "테크/라이프 🎧", keywords: ["스피커", "뱅앤올룹슨", "텀블러"] },
];

export default function CreateGiftPage() {
  const { showToast } = useToast();
  const [senderName, setSenderName] = useState("주희");
  const [messageCard, setMessageCard] = useState(
    "생일 축하해! 마음에 드는 선물 하나 골라주면 주소지로 바로 보내줄게 🎁"
  );
  const [cardTheme, setCardTheme] = useState<"ivory" | "emerald" | "noir" | "rose">("ivory");
  
  // Double-bound budget range states
  const [minBudget, setMinBudget] = useState(30000);
  const [maxBudget, setMaxBudget] = useState(60000);
  const [activePreset, setActivePreset] = useState<string>("birthday");
  
  const [allowCustomInput, setAllowCustomInput] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([1, 2, 7]);

  const applyPreset = (preset: typeof OCCASION_PRESETS[0]) => {
    setActivePreset(preset.id);
    setMinBudget(preset.minBudget);
    setMaxBudget(preset.maxBudget);
    setMessageCard(preset.message);
    setSelectedProductIds(preset.productIds);
    showToast(`${preset.label} 테마와 추천 선물 구성이 적용되었습니다! 🎁`, "success");
  };

  // Catalog Search & Filter State
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"DEFAULT" | "PRICE_ASC" | "PRICE_DESC" | "NAME_ASC">("DEFAULT");
  const [showOnlySelected, setShowOnlySelected] = useState(false);
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
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Fetch backend dynamic products or filter
  useEffect(() => {
    async function loadDynamicProducts() {
      try {
        if (searchKeyword && searchKeyword.trim().length >= 2) {
          const openSearchRes = await searchOpenProducts(searchKeyword.trim());
          if (openSearchRes && openSearchRes.length > 0) {
            setProducts(openSearchRes);
            return;
          }
        }

        const fetched = await fetchProducts(searchKeyword, minBudget, maxBudget, selectedCategory, sortOrder);
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
          if (selectedCategory !== "ALL") {
            const catObj = PRODUCT_CATEGORIES.find((c) => c.id === selectedCategory);
            if (catObj && catObj.keywords) {
              filtered = filtered.filter((p) => {
                const combined = (p.brand + " " + p.name + " " + (p.description || "")).toLowerCase();
                return catObj.keywords.some((kw) => combined.includes(kw.toLowerCase()));
              });
            }
          }
          if (sortOrder === "PRICE_ASC") {
            filtered = [...filtered].sort((a, b) => a.price - b.price);
          } else if (sortOrder === "PRICE_DESC") {
            filtered = [...filtered].sort((a, b) => b.price - a.price);
          } else if (sortOrder === "NAME_ASC") {
            filtered = [...filtered].sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
          }
          setProducts(filtered.length > 0 ? filtered : LOOKBOOK_PRODUCTS);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadDynamicProducts();
  }, [searchKeyword, selectedCategory, minBudget, maxBudget, sortOrder]);

  const toggleProductSelection = (id: number) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleCreateLink = async () => {
    if (minBudget > maxBudget) {
      showToast("최소 예산이 최대 예산보다 클 수 없습니다.", "error");
      return;
    }
    if (selectedProductIds.length === 0 && !customName) {
      showToast("적어도 하나 이상의 선물 아이템을 선택하거나 제안해주세요.", "error");
      return;
    }

    setIsCheckoutOpen(true);
  };

  const executeCreateLink = async () => {
    setIsCheckoutOpen(false);
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
      // Mock fallback token for local showcase
      const fallbackToken = "demo-" + Math.random().toString(36).substring(2, 9);
      setCreatedToken(fallbackToken);
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

          {/* Quick Occasion Preset Chips */}
          <div className="mt-5 flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {OCCASION_PRESETS.map((preset) => {
              const isActive = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap border ${
                    isActive
                      ? "bg-[#3b483a] text-white border-[#3b483a] shadow-sm scale-[1.02]"
                      : "bg-white text-[#5e605d] border-[#eae6df] hover:border-[#3b483a]"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {activePreset && (
            <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 bg-[#f4f1eb] rounded-full text-[10px] font-medium text-[#5e605d]">
              <span className="font-bold text-[#3b483a]">💡 테마 추천 예산:</span>
              <span>
                {minBudget.toLocaleString()}원 ~ {maxBudget.toLocaleString()}원
              </span>
              <span className="text-[#a38974]">|</span>
              <span>추천 상품 {selectedProductIds.length}개 기본 선택됨</span>
            </div>
          )}
        </div>

        {/* Feature: Today's MD Pick Showcase */}
        <MdPickSection
          onSelectMdPick={(id) => {
            if (!selectedProductIds.includes(id)) {
              setSelectedProductIds([...selectedProductIds, id]);
            }
            showToast("선택하신 MD Pick 아이템이 큐레이션 세팅에 추가되었습니다! ✦", "success");
          }}
        />

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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-[#5e605d] uppercase tracking-wider">
                  카드 메시지
                </label>
                <span className="text-[10px] font-mono text-[#7a7266]">
                  {messageCard.length}/200자
                </span>
              </div>

              {/* Quick Message Chips */}
              <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { label: "🎂 생일", text: "생일 축하해! 마음에 드는 선물 하나 골라주면 주소지로 바로 보내줄게 🎁" },
                  { label: "💌 응원/감사", text: "항상 곁에서 힘이 되어줘서 고마워. 당신의 일상에 작은 힐링이 되길 바라 🌿" },
                  { label: "🏠 집들이/결혼", text: "새로운 시작을 진심으로 축하해! 공간을 따뜻하게 채워줄 선물이길 바라 ✨" },
                  { label: "☕ 가벼운 선물", text: "오다 주웠다! 취향에 맞는 아이템으로 골라줘 ✦" },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setMessageCard(preset.text);
                      showToast(`${preset.label} 메시지가 적용되었습니다! ✍️`, "success");
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-[#f6f4f0] hover:bg-[#eae6df] text-[#1a1a1a] border border-[#eae6df] whitespace-nowrap transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                maxLength={200}
                value={messageCard}
                onChange={(e) => setMessageCard(e.target.value)}
                className="input-editorial resize-none font-serif text-sm"
              />
            </div>

            {/* Stationery Theme Selector */}
            <div>
              <label className="block text-[11px] font-bold text-[#5e605d] uppercase tracking-wider mb-1.5">
                인비테이션 레터 테마 (Stationery Theme)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "ivory" as const, label: "아이보리 린넨", chip: "bg-[#f5f2eb] border-[#d8d0c2] text-[#333]" },
                  { id: "emerald" as const, label: "포레스트 에메랄드", chip: "bg-[#1f2e24] border-[#3b4d40] text-white" },
                  { id: "noir" as const, label: "미드나잇 노아르", chip: "bg-[#181818] border-[#333] text-white" },
                  { id: "rose" as const, label: "더스티 로즈", chip: "bg-[#f9f1f0] border-[#ebd7d5] text-[#333]" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCardTheme(item.id)}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      item.chip
                    } ${
                      cardTheme === item.id
                        ? "ring-2 ring-[#3b483a] ring-offset-1 font-bold shadow-sm"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <span>{cardTheme === item.id ? "✓" : "✦"}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
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
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a]">
              Catalog & Live Open Search ({products.length})
            </span>
            <div className="flex items-center gap-2">
              <select
                value={sortOrder}
                onChange={(e) => {
                  const newSort = e.target.value as "DEFAULT" | "PRICE_ASC" | "PRICE_DESC" | "NAME_ASC";
                  setSortOrder(newSort);
                  const sortLabels = {
                    DEFAULT: "추천 큐레이션순",
                    PRICE_ASC: "가격 낮은순",
                    PRICE_DESC: "가격 높은순",
                    NAME_ASC: "브랜드 가나다순",
                  };
                  showToast(`${sortLabels[newSort]}으로 정렬되었습니다. ✦`, "info");
                }}
                className="text-[11px] font-bold px-2 py-1 rounded-md bg-white border border-[#e5e1da] text-[#1a1a1a] shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#3b483a]"
              >
                <option value="DEFAULT">✦ 추천 큐레이션순</option>
                <option value="PRICE_ASC">💰 가격 낮은순</option>
                <option value="PRICE_DESC">💎 가격 높은순</option>
                <option value="NAME_ASC">🔤 브랜드 가나다순</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setShowOnlySelected(!showOnlySelected);
                  showToast(
                    !showOnlySelected
                      ? `선택된 ${selectedProductIds.length}개 선물만 모아봅니다. 🎁`
                      : "전체 카탈로그를 표시합니다. ✦",
                    "info"
                  );
                }}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  showOnlySelected
                    ? "bg-[#3b483a] text-white shadow-sm"
                    : "bg-[#3b483a]/10 text-[#3b483a] hover:bg-[#3b483a]/20"
                }`}
              >
                <span>{showOnlySelected ? "✓" : "✦"}</span>
                <span>선택된 선물만 보기 ({selectedProductIds.length})</span>
              </button>
            </div>
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

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none mb-4 -mx-1 px-1">
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-bold tracking-tight transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#3b483a] text-white shadow-sm scale-[1.02]"
                    : "bg-white text-[#5e605d] border border-[#e5e1da] hover:border-[#3b483a]/40 hover:text-[#1a1a1a]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Popular Brand Quick Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none mb-3 text-[10px]">
            <span className="text-[#a38974] font-extrabold uppercase tracking-wider mr-1 whitespace-nowrap">
              인기 브랜드:
            </span>
            {["LE LABO", "AESOP", "DIPTYQUE", "TAMBURINS", "OIMU", "NONFICTION", "CROWCANYON"].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => {
                  setSearchKeyword(searchKeyword === b ? "" : b);
                  showToast(`'${b}' 브랜드 큐레이션 필터가 적용되었습니다! ✨`, "success");
                }}
                className={`px-2 py-0.5 rounded-md whitespace-nowrap font-medium transition-all ${
                  searchKeyword === b
                    ? "bg-[#3b483a] text-white font-bold"
                    : "bg-[#f6f4f0] text-[#5e605d] hover:bg-[#eae6df] hover:text-[#1a1a1a]"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {(() => {
            const displayedProducts = showOnlySelected
              ? products.filter((p) => selectedProductIds.includes(Number(p.id)))
              : products;

            if (displayedProducts.length === 0) {
              return (
                <div className="editorial-card p-8 text-center bg-white my-4">
                  <div className="w-12 h-12 rounded-full bg-[#3b483a]/5 flex items-center justify-center text-2xl mx-auto mb-3">
                    🔍
                  </div>
                  <h3 className="text-sm font-bold text-[#1a1a1a] mb-1">
                    {showOnlySelected
                      ? "선택된 선물이 아직 없습니다"
                      : "일치하는 상품을 찾지 못했습니다"}
                  </h3>
                  <p className="text-xs text-[#5e605d] mb-4">
                    {showOnlySelected
                      ? "카탈로그에서 마음에 드는 상품 카드를 클릭하여 큐레이션에 담아보세요."
                      : "검색어 또는 예산 범위를 조절하거나 아래 버튼을 눌러 전체 카탈로그를 확인해보세요."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (showOnlySelected) {
                        setShowOnlySelected(false);
                      } else {
                        setSearchKeyword("");
                        setSelectedCategory("ALL");
                      }
                      showToast("카탈로그 전체 목록이 표시됩니다! ✦", "success");
                    }}
                    className="btn-editorial-outline text-xs py-2 px-4 font-bold"
                  >
                    {showOnlySelected ? "전체 카탈로그 둘러보기 ✦" : "검색 조건 초기화 ↺"}
                  </button>
                </div>
              );
            }

            return displayedProducts.map((product) => {
              const isSelected = selectedProductIds.includes(Number(product.id));
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={isSelected}
                  onSelect={() => toggleProductSelection(Number(product.id))}
                />
              );
            });
          })()}
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

        {/* Curation Summary Bar */}
        <div className="p-3.5 bg-white rounded-2xl border border-[#eae6df] shadow-sm mb-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b483a] animate-pulse" />
            <span className="font-bold text-[#1a1a1a]">
              선택 선물: <span className="text-[#3b483a]">{selectedProductIds.length + (customName ? 1 : 0)}개</span>
            </span>
          </div>
          <div className="text-[11px] text-[#5e605d]">
            최대 가승인 한도: <strong className="text-[#1a1a1a]">{maxBudget.toLocaleString()}원</strong>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleCreateLink}
          disabled={isSubmitting}
          className="btn-editorial py-4.5 text-xs tracking-widest uppercase font-bold shadow-md w-full"
        >
          {isSubmitting ? "Curation Box Generating..." : "선물 상자 결제 및 생성하기 ✦"}
        </button>
      </main>

      {/* Escrow Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={executeCreateLink}
        minBudget={minBudget}
        maxBudget={maxBudget}
        selectedProductCount={selectedProductIds.length + (customName ? 1 : 0)}
        senderName={senderName}
      />

      {/* Luxury Share Modal */}
      <ShareModal
        isOpen={!!createdToken}
        onClose={() => setCreatedToken(null)}
        token={createdToken || ""}
        senderName={senderName}
        messageCard={messageCard}
        cardTheme={cardTheme}
      />
    </div>
  );
}
