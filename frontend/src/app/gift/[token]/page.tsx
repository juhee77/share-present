"use client";

import { use, useEffect, useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import UnwrappingRibbon from "@/components/UnwrappingRibbon";
import DeliveryDrawer from "@/components/DeliveryDrawer";
import { getCurationBox, acceptGift, CurationBoxResponse, ProductDto } from "@/lib/api";

export default function RecipientGiftPage({ params }: { params: Promise<{ token: string }> }) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    async function loadBox() {
      try {
        const data = await getCurationBox(token);
        setBoxData(data);
      } catch (err) {
        console.error("Fetch error:", err);
        // Fallback mock data
        setBoxData({
          id: 1,
          senderName: "주희",
          messageCard: "생일 축하해! 마음에 드는 선물 하나 골라주면 주소지로 바로 보내줄게 🎁",
          maxBudget: 50000,
          sharingToken: token,
          allowCustomInput: true,
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
        <div className="insta-story-ring mb-3 animate-bounce">
          <div className="insta-story-inner">
            <div className="w-12 h-12 rounded-full bg-[#121212] flex items-center justify-center text-xl text-white">
              🎁
            </div>
          </div>
        </div>
        <p className="text-xs font-bold text-[#121212] tracking-wider uppercase">
          Loading Selection Feed...
        </p>
      </div>
    );
  }

  if (!boxData) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-[#121212] mb-2">선물 상자를 찾을 수 없습니다</h2>
        <p className="text-xs text-[#737373] mb-4">유효하지 않거나 만료된 선물 링크입니다.</p>
      </div>
    );
  }

  const handleProductSelect = (product: ProductDto) => {
    setSelectedProductId(product.id);
    setSelectedOption(product.options?.[0] || "");
    setIsDrawerOpen(true);
  };

  const handleCustomSubmit = () => {
    if (!customName || !customUrl) {
      alert("원하시는 선물명과 링크를 입력해주세요.");
      return;
    }
    setSelectedProductId("CUSTOM_RECIPIENT");
    setIsDrawerOpen(true);
  };

  const handleAddressSubmit = async (addressData: { name: string; phone: string; address: string }) => {
    setIsSubmitting(true);
    try {
      const isCustomRecipient = selectedProductId === "CUSTOM_RECIPIENT";

      await acceptGift(token, {
        receiverName: addressData.name,
        receiverPhone: addressData.phone,
        shippingAddress: addressData.address,
        selectedProductId: typeof selectedProductId === "number" ? selectedProductId : undefined,
        selectedOption: selectedOption,
        isRecipientAdded: isCustomRecipient,
        recipientCustomBrand: isCustomRecipient ? customBrand || "직접입력" : undefined,
        recipientCustomName: isCustomRecipient ? customName : undefined,
        recipientCustomUrl: isCustomRecipient ? customUrl : undefined,
      });

      setIsDrawerOpen(false);
      setIsCompleted(true);
    } catch (err) {
      console.error(err);
      alert("선물 수락 처리에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProductObj = boxData.items.find((p) => p.id === selectedProductId);
  const selectedProductName = selectedProductId === "CUSTOM_RECIPIENT" ? customName : selectedProductObj?.name;

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-white">
      {/* 3D Ribbon Opening Overlay */}
      {showRibbon && (
        <UnwrappingRibbon
          senderName={boxData.senderName}
          onOpen={() => setShowRibbon(false)}
        />
      )}

      <Header />

      <main className="p-4 flex-1 max-w-[540px] mx-auto w-full">
        {isCompleted ? (
          /* Completion Screen */
          <div className="text-center py-12 insta-card p-6 my-8 animate-fade-in">
            <div className="insta-story-ring mb-4 inline-block">
              <div className="insta-story-inner">
                <div className="w-16 h-16 rounded-full bg-[#121212] flex items-center justify-center text-3xl text-white">
                  🎉
                </div>
              </div>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#121212] mb-2">
              선물 수락 완료!
            </h1>
            <p className="text-xs text-[#737373] max-w-xs mx-auto mb-8 leading-relaxed">
              선택하신 정보가 보낸 분({boxData.senderName})에게 안전하게 전달되었습니다.
            </p>

            <a
              href={`/result/${token}`}
              className="btn-insta-gradient max-w-xs mx-auto block text-center text-xs py-4"
            >
              보낸 사람에게 전달할 정산 결과 보기 ↗
            </a>
          </div>
        ) : (
          /* Main Gift Options Feed */
          <>
            {/* Sender Message Card Header */}
            <section className="insta-card p-5 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#121212] text-white flex items-center justify-center text-[10px] font-bold">
                  {boxData.senderName.substring(0, 1)}
                </div>
                <span className="text-xs font-bold text-[#121212]">
                  {boxData.senderName}님의 큐레이션 선물 카드
                </span>
              </div>
              <p className="text-base font-serif font-bold text-[#121212] leading-relaxed border-t border-[#f5f5f5] pt-3">
                "{boxData.messageCard}"
              </p>
            </section>

            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#121212]">
                Select 1 Gift ({boxData.items.length})
              </span>
              <span className="text-[11px] text-[#737373]">원하는 상품 터치</span>
            </div>

            {/* Product Feed */}
            <div className="space-y-4">
              {boxData.items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={selectedProductId === product.id}
                  onSelect={() => handleProductSelect(product)}
                  selectedOption={selectedOption}
                  onOptionChange={(opt) => setSelectedOption(opt)}
                  hidePrice={true}
                />
              ))}
            </div>

            {/* Custom Input */}
            {boxData.allowCustomInput && (
              <section className="insta-card p-4 my-5">
                <button
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#121212]"
                >
                  <span className="flex items-center gap-1.5">
                    <span>✨</span>
                    <span>원하는 다른 선물 직접 링크 입력하기</span>
                  </span>
                  <span>{showCustomInput ? "▲" : "▼"}</span>
                </button>

                {showCustomInput && (
                  <div className="mt-3 pt-3 border-t border-[#f5f5f5] space-y-3 animate-fade-in">
                    <div>
                      <label className="block text-xs text-[#737373] mb-1">브랜드명</label>
                      <input
                        type="text"
                        placeholder="예: 이솝"
                        value={customBrand}
                        onChange={(e) => setCustomBrand(e.target.value)}
                        className="input-insta"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#737373] mb-1">상품명</label>
                      <input
                        type="text"
                        placeholder="예: 레저렉션 아로마틱 핸드 밤"
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
                    <button
                      onClick={handleCustomSubmit}
                      className="btn-insta text-xs py-3 mt-2"
                    >
                      이 선물로 신청하기 🚀
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
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
