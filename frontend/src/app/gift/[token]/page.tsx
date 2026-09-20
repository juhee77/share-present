"use client";

import { use, useEffect, useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import UnwrappingRibbon from "@/components/UnwrappingRibbon";
import DeliveryDrawer from "@/components/DeliveryDrawer";
import { AlternativeGiftsDrawer } from "@/components/AlternativeGiftsDrawer";
import ConfettiEffect from "@/components/ConfettiEffect";
import RollingPaperSection from "@/components/RollingPaperSection";
import TasteSurveyModal from "@/components/TasteSurveyModal";
import ThankYouStudioModal from "@/components/ThankYouStudioModal";
import { useToast } from "@/context/ToastContext";
import { getCurationBox, acceptGift, submitThankYouReply, CurationBoxResponse, ProductDto } from "@/lib/api";

export default function RecipientGiftPage({ params }: { params: Promise<{ token: string }> }) {
  const { showToast } = useToast();
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [boxData, setBoxData] = useState<CurationBoxResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRibbon, setShowRibbon] = useState(true);

  // Selection & Option state
  const [selectedProductId, setSelectedProductId] = useState<number | string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");

  // Recipient Custom Input state
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customBrand, setCustomBrand] = useState("");
  const [customName, setCustomName] = useState("");
  const [customUrl, setCustomUrl] = useState("");

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAlternativeDrawerOpen, setIsAlternativeDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Feature 4: Thank-You Reply Card Modal State
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [thankYouSticker, setThankYouSticker] = useState("💖 취향저격 고마워!");
  const [thankYouMsg, setThankYouMsg] = useState("예쁜 선물 골라줘서 너무 고마워! 예쁘게 잘 쓸게 🎁");
  const [thankYouPhoto, setThankYouPhoto] = useState<string>("https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80");
  const [thankYouSent, setThankYouSent] = useState(false);

  // Feature 5: AI Taste Survey State
  const [showTasteModal, setShowTasteModal] = useState(false);
  const [tasteMatchResult, setTasteMatchResult] = useState<{ productId: number | string; summary: string } | null>(null);

  useEffect(() => {
    async function loadBox() {
      try {
        const data = await getCurationBox(token);
        setBoxData(data);
      } catch (err) {
        console.error("Fetch error:", err);
        // Fallback mock
        setBoxData({
          id: 1,
          senderName: "주희",
          messageCard: "생일 축하해! 마음에 드는 선물 하나 골라주면 주소지로 바로 보내줄게 🎁",
          minBudget: 30000,
          maxBudget: 60000,
          sharingToken: token,
          allowCustomInput: true,
          rollingPaperMessages: [
            {
              id: 1,
              authorName: "마케팅팀 동기 민우",
              message: "생일 진심으로 축하해! 원하는 거 골라서 유용하게 잘 쓰길 바라 🎉",
              avatarEmoji: "🎉",
              createdAt: "2026-07-24",
            },
            {
              id: 2,
              authorName: "수진 팀장님",
              message: "언제나 열정 넘치는 모습 너무 멋져요! 항상 응원합니다 ✨",
              avatarEmoji: "✨",
              createdAt: "2026-07-24",
            },
          ],
          items: [
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
          ],
        });
      } finally {
        setLoading(false);
      }
    }
    loadBox();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center">
        <p className="text-xs font-bold text-[#3b483a] tracking-wider uppercase animate-pulse">
          Loading Invitation... ✦
        </p>
      </div>
    );
  }

  if (!boxData) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-lg font-bold text-[#1a1a1a] mb-2">선물 상자를 찾을 수 없습니다</h2>
        <p className="text-xs text-[#5e605d] mb-4">유효하지 않거나 만료된 선물 링크입니다.</p>
      </div>
    );
  }

  const handleProductSelect = (product: ProductDto) => {
    setSelectedProductId(product.id);
    setSelectedOption(product.options?.[0] || "");
    setIsDrawerOpen(true);
  };

  const [selectedAltProduct, setSelectedAltProduct] = useState<ProductDto | null>(null);

  const handleAlternativeProductSelect = (product: ProductDto) => {
    setSelectedAltProduct(product);
    setSelectedProductId(product.id);
    setSelectedOption(product.options?.[0] || "");
    setIsDrawerOpen(true);
    showToast(`'${product.brand} - ${product.name}' 선물이 선택되었습니다! 🎁`, "success");
  };

  const handleCustomSubmit = () => {
    if (!customName || !customUrl) {
      showToast("원하시는 선물명과 링크를 입력해주세요.", "error");
      return;
    }
    setSelectedProductId("CUSTOM_RECIPIENT");
    setIsDrawerOpen(true);
  };

  const handleAddressSubmit = async (addressData: {
    name: string;
    phone: string;
    address: string;
    deliveryMemo?: string;
    selectedOption?: string;
    desiredDeliveryDate?: string;
    ecoFriendlyPackaging?: boolean;
    entranceMemo?: string;
    preDeliveryNotification?: boolean;
  }) => {
    setIsSubmitting(true);
    try {
      const isCustomRecipient = selectedProductId === "CUSTOM_RECIPIENT";
      const finalOption = addressData.selectedOption || selectedOption;
      if (finalOption) {
        setSelectedOption(finalOption);
      }

      await acceptGift(token, {
        receiverName: addressData.name,
        receiverPhone: addressData.phone,
        shippingAddress: addressData.address,
        selectedProductId: typeof selectedProductId === "number" ? selectedProductId : undefined,
        selectedOption: finalOption,
        desiredDeliveryDate: addressData.desiredDeliveryDate,
        ecoFriendlyPackaging: addressData.ecoFriendlyPackaging,
        entranceMemo: addressData.entranceMemo,
        preDeliveryNotification: addressData.preDeliveryNotification,
        isRecipientAdded: isCustomRecipient,
        recipientCustomBrand: isCustomRecipient ? customBrand || "직접입력" : undefined,
        recipientCustomName: isCustomRecipient ? customName : undefined,
        recipientCustomUrl: isCustomRecipient ? customUrl : undefined,
      });

      setIsDrawerOpen(false);
      setIsCompleted(true);
      showToast("선물 수락 및 배송지 접수가 완료되었습니다! 🎁", "success");
    } catch (err) {
      console.error(err);
      showToast("선물 수락 처리에 실패했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProductObj =
    selectedAltProduct && selectedAltProduct.id === selectedProductId
      ? selectedAltProduct
      : boxData?.items.find((p) => p.id === selectedProductId);
  const selectedProductName = selectedProductId === "CUSTOM_RECIPIENT" ? customName : selectedProductObj?.name;

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-[#faf9f6]">
      {/* Invitation Overlay */}
      {showRibbon && (
        <UnwrappingRibbon
          senderName={boxData.senderName}
          messageCard={boxData.messageCard}
          cardTheme={boxData.cardTheme as "ivory" | "emerald" | "noir" | "rose"}
          sealMonogram={boxData.sealMonogram}
          hasPinSecurity={boxData.hasPinSecurity}
          sharingToken={token}
          onOpen={() => setShowRibbon(false)}
        />
      )}

      <Header />

      {/* Feature 3: Gift Expiration D-Day Banner */}
      <div className="bg-[#3b483a]/10 border-b border-[#3b483a]/20 py-2.5 px-4 text-center">
        <p className="text-[11px] font-bold text-[#3b483a] flex items-center justify-center gap-1.5">
          <span>⏳</span>
          <span>선물 수락 기한: D-7 (6일 23시간 남음)</span>
          <span className="text-[10px] text-[#5e605d] font-normal hidden sm:inline">
            · 기한 내 미수락 시 보내는 이에게 자동 환불됩니다
          </span>
        </p>
      </div>

      <main className="p-4 flex-1 max-w-[540px] mx-auto w-full">
        {isCompleted ? (
          /* Recipient Pure Gratitude Completion Screen (Zero Price Mention) */
          <div className="text-center py-12 editorial-card p-6 my-8 animate-fade-in border border-white relative overflow-hidden">
            <ConfettiEffect active={isCompleted} durationMs={5000} />
            <div className="w-16 h-16 rounded-full bg-[#3b483a]/5 flex items-center justify-center text-3xl mx-auto mb-4">
              🎁
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#1a1a1a] mb-2">
              선물 수락 완료
            </h1>
            <p className="text-xs text-[#5e605d] max-w-xs mx-auto mb-8 leading-relaxed">
              선택하신 선물과 배송 주소가 {boxData.senderName}님에게 잘 전달되었습니다. 예쁘게 포장하여 빠르게 배송해 드릴게요!
            </p>

            {/* Selected Gift Summary */}
            {selectedProductName && (
              <div className="mb-6 p-4 bg-[#fbf9f5] rounded-xl border border-[#eae6df] text-left">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974]">
                    선택하신 선물
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3b483a]/10 text-[#3b483a] font-bold">
                    ✓ 접수 완료
                  </span>
                </div>
                <p className="text-xs font-bold text-[#1a1a1a]">
                  {selectedProductObj?.brand ? `[${selectedProductObj.brand}] ` : ""}
                  {selectedProductName}
                </p>
                {selectedOption && (
                  <p className="text-[11px] text-[#5e605d] mt-0.5">
                    선택 옵션: <span className="font-semibold text-[#1a1a1a]">{selectedOption}</span>
                  </p>
                )}
                {(() => {
                  const pkg = boxData.packagingStyle || "STANDARD";
                  const pkgMap: Record<string, { label: string; icon: string }> = {
                    STANDARD: { label: "시그니처 화이트 박스 & 실링 왁스", icon: "📦" },
                    BOJAGI: { label: "전통 실크 보자기 & 수공예 노리개", icon: "🪡" },
                    LUXURY_RIBBON: { label: "로열 리본 하드케이스 & 새틴 리본", icon: "🎀" },
                    ECO_CRAFT: { label: "친환경 생분해 크래프트 & 천연 허브 리프", icon: "🌿" },
                  };
                  const cur = pkgMap[pkg] || pkgMap.STANDARD;
                  return (
                    <div className="mt-2 pt-2 border-t border-[#eae6df] flex items-center gap-1.5 text-[10px] text-[#7a7266]">
                      <span>{cur.icon}</span>
                      <span>{cur.label} 패키징으로 정성껏 포장되어 출고됩니다.</span>
                    </div>
                  );
                })()}
              </div>
            )}

            {thankYouSent && (
              <div className="mb-6 p-4 bg-[#f6f4f0] rounded-xl border border-[#eae6df] text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block mb-1">
                  Sent Thank-You Reply
                </span>
                <p className="text-xs font-bold text-[#1a1a1a] mb-1">{thankYouSticker}</p>
                <p className="text-xs text-[#5e605d] font-serif">"{thankYouMsg}"</p>
              </div>
            )}

            <div className="space-y-3 max-w-xs mx-auto">
              <a
                href={`/gift/track/${token}`}
                className="btn-editorial block text-center text-xs py-4 uppercase tracking-widest font-bold shadow-md"
              >
                내 선물 배송 상태 조회하기 📦
              </a>
              
              <button
                type="button"
                onClick={() => {
                  const trackingUrl = `${window.location.origin}/gift/track/${token}`;
                  navigator.clipboard.writeText(trackingUrl);
                  showToast("배송 조회 링크가 클립보드에 복사되었습니다! 📋", "success");
                }}
                className="w-full text-[11px] font-semibold text-[#5e605d] hover:text-[#1a1a1a] py-1 transition-colors flex items-center justify-center gap-1"
              >
                <span>📋</span>
                <span>배송 조회 링크 복사하기</span>
              </button>

              <button
                onClick={() => setShowThankYouModal(true)}
                className="btn-editorial-outline block text-center text-xs py-3.5 uppercase tracking-wider font-bold w-full"
              >
                {thankYouSent ? "감사 카드 수정하기 💌" : `${boxData.senderName}님에게 감사 카드 보내기 💌`}
              </button>
            </div>
          </div>
        ) : (
          /* Gift Curation Selection Feed (Zero Price Exposure) */
          <>
            {/* Sender Personal Card with dynamic cardTheme styling */}
            {(() => {
              const theme = boxData.cardTheme || "ivory";
              let cardBg = "bg-white border-[#eae6df]";
              let tagColor = "text-[#a38974]";
              let textColor = "text-[#1a1a1a]";
              let borderColor = "border-[#eae6df]";
              let iconEmoji = "💌";

              if (theme === "emerald") {
                cardBg = "bg-[#f2f7f3] border-[#2e5339]/30";
                tagColor = "text-[#2e5339]";
                textColor = "text-[#1a3322]";
                borderColor = "border-[#2e5339]/20";
                iconEmoji = "🌿";
              } else if (theme === "noir") {
                cardBg = "bg-[#1f2120] border-[#383a39] text-white shadow-xl";
                tagColor = "text-[#c5a880]";
                textColor = "text-[#f5f5f5]";
                borderColor = "border-[#383a39]";
                iconEmoji = "✦";
              } else if (theme === "rose") {
                cardBg = "bg-[#fff6f7] border-[#f8ccd6]";
                tagColor = "text-[#b04a6b]";
                textColor = "text-[#4a1828]";
                borderColor = "border-[#f8ccd6]";
                iconEmoji = "🌸";
              }

              const fontStyle = boxData.fontStyle || "serif";
              let messageFontClass = "font-serif font-bold";
              if (fontStyle === "handwriting") {
                messageFontClass = "font-serif font-medium tracking-wide italic";
              } else if (fontStyle === "sans") {
                messageFontClass = "font-sans font-bold";
              } else if (fontStyle === "mono") {
                messageFontClass = "font-mono font-semibold tracking-tight";
              }

              return (
                <section className={`editorial-card p-6 mb-5 relative overflow-hidden transition-all duration-500 shadow-sm ${cardBg}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest block ${tagColor}`}>
                      {iconEmoji} Personal Message from {boxData.senderName}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                      {theme} edition
                    </span>
                  </div>
                  <p className={`text-lg ${messageFontClass} ${textColor} mt-2 leading-relaxed border-t ${borderColor} pt-3.5`}>
                    "{boxData.messageCard}"
                  </p>
                </section>
              );
            })()}

            {/* Packaging Style Preview Banner */}
            {(() => {
              const pkg = boxData.packagingStyle || "STANDARD";
              const pkgMap: Record<string, { label: string; icon: string; desc: string; badgeClass: string }> = {
                STANDARD: { label: "시그니처 기프트 박스", icon: "📦", desc: "정갈한 화이트 박스와 왁스 실링 패키징", badgeClass: "bg-[#f5f2eb] text-[#4a4036] border-[#d8d0c2]" },
                BOJAGI: { label: "전통 실크 보자기 & 수공예 노리개", icon: "🪡", desc: "단아한 옥빛 전통 보자기와 수공예 노리개 포장", badgeClass: "bg-[#eef5f0] text-[#245237] border-[#b9d9c3]" },
                LUXURY_RIBBON: { label: "로열 리본 하드케이스", icon: "🎀", desc: "다크 포레스트 하드케이스 & 골드 새틴 리본", badgeClass: "bg-[#f2f0ea] text-[#2f3b30] border-[#c2b9a7]" },
                ECO_CRAFT: { label: "친환경 크래프트 & 천연 허브 리프", icon: "🌿", desc: "100% 생분해 크래프트 & 천연 로즈마리 리프", badgeClass: "bg-[#f4f7f2] text-[#334d31] border-[#c0d6bd]" },
              };
              const pkgInfo = pkgMap[pkg] || pkgMap.STANDARD;

              return (
                <div className="mb-4 px-3.5 py-2.5 rounded-xl border border-[#eae6df] bg-white flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{pkgInfo.icon}</span>
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#a38974] block">
                        Complimentary Packaging
                      </span>
                      <span className="text-xs font-bold text-[#1a1a1a] block">{pkgInfo.label}</span>
                      <span className="text-[10px] text-[#7a7266] block">{pkgInfo.desc}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pkgInfo.badgeClass}`}>
                    포장 포함
                  </span>
                </div>
              );
            })()}

            {/* Feature 4: Co-Sender Group Rolling Paper Section */}
            <RollingPaperSection
              token={token}
              senderName={boxData.senderName}
              messages={boxData.rollingPaperMessages}
            />

            {/* AI Taste Matching Quick Banner */}
            <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-[#3b483a]/10 via-[#a38974]/15 to-[#3b483a]/10 border border-[#3b483a]/20 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#3b483a] block">
                    AI Curated Matcher
                  </span>
                  <span className="text-xs font-bold text-[#1a1a1a] block">
                    {tasteMatchResult ? `🎯 ${tasteMatchResult.summary}` : "어떤 선물이 어울릴지 고민되시나요?"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTasteModal(true)}
                className="text-[10px] font-bold text-white bg-[#3b483a] hover:bg-[#2d382c] px-3 py-1.5 rounded-xl shadow-xs transition-colors flex-shrink-0"
              >
                {tasteMatchResult ? "다시 분석 ↻" : "30초 취향 분석 ✦"}
              </button>
            </div>

            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a]">
                Curated Gift Options ({boxData.items.length})
              </span>
              <span className="text-[10px] font-bold text-[#3b483a] bg-[#3b483a]/5 px-2.5 py-1 rounded-md">
                1가지선택
              </span>
            </div>

            {/* Product Options Feed (Prices 100% hidden) */}
            <div className="space-y-4">
              {(tasteMatchResult
                ? [...boxData.items].sort((a, b) => (a.id === tasteMatchResult.productId ? -1 : b.id === tasteMatchResult.productId ? 1 : 0))
                : boxData.items
              ).map((product) => {
                const isBestMatch = tasteMatchResult?.productId === product.id;
                return (
                  <div key={product.id} className="relative">
                    {isBestMatch && (
                      <div className="mb-1.5 flex items-center gap-1 text-[10px] font-bold text-[#3b483a] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        <span>✦</span>
                        <span>취향 저격 베스트 매칭 (98% 일치)</span>
                      </div>
                    )}
                    <ProductCard
                      product={product}
                      isSelected={selectedProductId === product.id}
                      onSelect={() => handleProductSelect(product)}
                      selectedOption={selectedOption}
                      onOptionChange={(opt) => setSelectedOption(opt)}
                      hidePrice={true} // Prices completely hidden for recipient!
                    />
                  </div>
                );
              })}
            </div>

            {/* Alternative Gifts Button (Gift Swap Exploration) */}
            <div className="mt-5 p-4 rounded-2xl bg-white border border-[#eae6df] text-center shadow-sm">
              <p className="text-xs text-[#5e605d] mb-3 leading-relaxed">
                마음에 드는 다른 감도의 선물을 직접 탐색하고 싶으신가요?
              </p>
              <button
                type="button"
                onClick={() => setIsAlternativeDrawerOpen(true)}
                className="btn-editorial-outline text-xs py-3 w-full font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <span>✦</span>
                <span>다른 추천 선물 둘러보기 (선물 교체)</span>
                <span>✦</span>
              </button>
            </div>

            {/* Recipient Custom Wish Proposal */}
            {boxData.allowCustomInput && (
              <section className="editorial-card p-4 my-5">
                <button
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#1a1a1a]"
                >
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <span>✦</span>
                    <span>원하는 다른 선물 직접 제안하기</span>
                  </span>
                  <span>{showCustomInput ? "▲" : "▼"}</span>
                </button>

                {showCustomInput && (
                  <div className="mt-3 pt-3 border-t border-[#eae6df] space-y-3 animate-fade-in">
                    <div>
                      <label className="block text-xs text-[#5e605d] mb-1">브랜드명</label>
                      <input
                        type="text"
                        placeholder="예: 이솝"
                        value={customBrand}
                        onChange={(e) => setCustomBrand(e.target.value)}
                        className="input-editorial"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#5e605d] mb-1">상품명</label>
                      <input
                        type="text"
                        placeholder="예: 레저렉션 아로마틱 핸드 밤"
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
                    <button
                      onClick={handleCustomSubmit}
                      className="btn-editorial-outline text-xs py-3 mt-2 font-bold uppercase tracking-wider"
                    >
                      이 선물로 신청하기 ✦
                    </button>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>

      <DeliveryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleAddressSubmit}
        selectedProductName={selectedProductName}
        selectedProductBrand={selectedProductObj?.brand || (selectedProductId === "CUSTOM_RECIPIENT" ? customBrand || "직접입력" : undefined)}
        selectedOption={selectedOption}
        availableOptions={selectedProductObj?.options}
        isSubmitting={isSubmitting}
      />

      <AlternativeGiftsDrawer
        isOpen={isAlternativeDrawerOpen}
        onClose={() => setIsAlternativeDrawerOpen(false)}
        onSelectProduct={handleAlternativeProductSelect}
      />

      {/* Feature 4: Thank-You Card Studio Modal */}
      <ThankYouStudioModal
        isOpen={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
        senderName={boxData.senderName}
        recipientName="받는 분"
        productBrand={
          boxData.items.find((i) => i.id === selectedProductId)?.brand || "SharePresent"
        }
        productName={
          boxData.items.find((i) => i.id === selectedProductId)?.name || "소중한 선물"
        }
        onSave={async ({ sticker, message }) => {
          setThankYouSticker(sticker);
          setThankYouMsg(message);
          try {
            await submitThankYouReply(token, {
              thankYouSticker: sticker,
              thankYouMessage: message,
              thankYouPhotoUrl: thankYouPhoto,
            });
          } catch (e) {
            console.error(e);
          }
          setThankYouSent(true);
        }}
      />

      {/* Feature 5: AI Taste Survey Modal */}
      <TasteSurveyModal
        isOpen={showTasteModal}
        onClose={() => setShowTasteModal(false)}
        products={boxData.items}
        onComplete={(id, summary) => {
          setTasteMatchResult({ productId: id, summary });
          setSelectedProductId(id);
        }}
      />
    </div>
  );
}
