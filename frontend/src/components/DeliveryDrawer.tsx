"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";

interface DeliveryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; phone: string; address: string; deliveryMemo?: string }) => void;
  selectedProductName?: string;
  selectedProductBrand?: string;
  selectedOption?: string;
  isSubmitting?: boolean;
}

const SAMPLE_ADDRESSES = [
  "서울특별시 강남구 테헤란로 152 (강남파이낸스센터)",
  "서울특별시 용산구 한남대로 91 (한남더힐)",
  "서울특별시 성동구 성수일로 89 (성수 메타밸리)",
  "경기도 성남시 분당구 판교역로 166 (카카오판교아지트)",
  "부산광역시 해운대구 마린시티2로 33 (두산위브더제니스)",
];

const DELIVERY_MEMOS = [
  "🚪 문 앞에 놓아주세요 (기본)",
  "📦 경비실에 보관해 주세요",
  "📞 배송 전 미리 연락 부탁드립니다",
  "📬 택배함에 넣어주세요",
  "✍️ 직접 입력",
];

export default function DeliveryDrawer({
  isOpen,
  onClose,
  onSubmit,
  selectedProductName,
  selectedProductBrand,
  selectedOption,
  isSubmitting = false,
}: DeliveryDrawerProps) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [baseAddress, setBaseAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [deliveryMemo, setDeliveryMemo] = useState(DELIVERY_MEMOS[0]);
  const [customMemo, setCustomMemo] = useState("");
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Phone number auto-formatter
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    let formatted = raw;
    if (raw.length > 3 && raw.length <= 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else if (raw.length > 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }
    setPhone(formatted);
  };

  const handleSelectSampleAddress = (addr: string) => {
    setBaseAddress(addr);
    setShowAddressSearch(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !baseAddress.trim()) {
      showToast("수령인 성함, 연락처, 배송 주소를 모두 입력해주세요.", "error");
      return;
    }

    const fullAddress = detailAddress.trim()
      ? `${baseAddress.trim()} ${detailAddress.trim()}`
      : baseAddress.trim();

    const finalMemo =
      deliveryMemo === "✍️ 직접 입력" ? customMemo.trim() : deliveryMemo;

    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      address: fullAddress,
      deliveryMemo: finalMemo || undefined,
    });
  };

  const filteredAddresses = searchQuery.trim()
    ? SAMPLE_ADDRESSES.filter((a) => a.includes(searchQuery.trim()))
    : SAMPLE_ADDRESSES;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-[560px] bg-[#faf9f6] rounded-t-3xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto border-t border-[#eae6df]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#d8d5cf] rounded-full mx-auto mb-5" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-[#eae6df] pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974]">
              Shipping Address
            </span>
            <h2 className="text-xl font-bold font-serif text-[#1a1a1a]">
              선물 수령지 입력
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#ede9e1] flex items-center justify-center text-[#5e605d] hover:bg-[#dedad0] transition-colors font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Selected Product Summary (Zero Price Guarantee) */}
        {selectedProductName && (
          <div className="p-3.5 bg-white rounded-xl border border-[#eae6df] mb-4 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#a38974] block">
              SELECTED GIFT
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-bold text-[#1a1a1a] truncate">
                {selectedProductBrand ? `[${selectedProductBrand}] ` : ""}
                {selectedProductName}
              </span>
              {selectedOption && (
                <span className="text-[10px] font-semibold text-[#3b483a] bg-[#3b483a]/10 px-2 py-0.5 rounded-full flex-shrink-0">
                  {selectedOption}
                </span>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Name */}
          <div>
            <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
              받는 분 성함 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="예: 홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-editorial text-sm font-semibold"
              required
            />
          </div>

          {/* Recipient Phone */}
          <div>
            <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
              연락처 (휴대폰 번호) <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="010-0000-0000"
              maxLength={13}
              value={phone}
              onChange={handlePhoneChange}
              className="input-editorial text-sm font-mono"
              required
            />
          </div>

          {/* Street Address & Search */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#1a1a1a]">
                배송지 주소 <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowAddressSearch(!showAddressSearch)}
                className="text-[11px] font-bold text-[#3b483a] underline hover:opacity-80"
              >
                {showAddressSearch ? "검색창 닫기 ▲" : "🔍 주소 검색 / 추천"}
              </button>
            </div>

            {/* Address Search Autocomplete Box */}
            {showAddressSearch && (
              <div className="p-3 bg-white rounded-xl border border-[#3b483a]/30 mb-2.5 animate-fade-in shadow-inner">
                <input
                  type="text"
                  placeholder="도로명 또는 동(예: 테헤란로, 한남대로, 성수일로)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-editorial text-xs mb-2 py-2"
                />
                <div className="space-y-1 max-h-32 overflow-y-auto text-xs">
                  {filteredAddresses.map((addr, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSampleAddress(addr)}
                      className="w-full text-left p-2 rounded-lg hover:bg-[#f6f4f0] text-[#333] truncate transition-colors text-[11px] block"
                    >
                      📍 {addr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <input
              type="text"
              placeholder="도로명 주소 (예: 서울특별시 강남구 테헤란로 152)"
              value={baseAddress}
              onChange={(e) => setBaseAddress(e.target.value)}
              className="input-editorial text-xs mb-2"
              required
            />
            <input
              type="text"
              placeholder="상세 주소 (동, 호수, 층수 등)"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
              className="input-editorial text-xs"
            />
          </div>

          {/* Delivery Memo */}
          <div>
            <label className="block text-xs font-bold text-[#1a1a1a] mb-1.5">
              배송 요청사항
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {DELIVERY_MEMOS.map((memo) => (
                <button
                  key={memo}
                  type="button"
                  onClick={() => setDeliveryMemo(memo)}
                  className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-all ${
                    deliveryMemo === memo
                      ? "bg-[#3b483a] text-white border-[#3b483a] font-bold"
                      : "bg-white text-[#5e605d] border-[#eae6df] hover:border-[#3b483a]"
                  }`}
                >
                  {memo}
                </button>
              ))}
            </div>

            {deliveryMemo === "✍️ 직접 입력" && (
              <input
                type="text"
                placeholder="배송 기사님께 전달할 요청사항을 입력해주세요."
                value={customMemo}
                onChange={(e) => setCustomMemo(e.target.value)}
                className="input-editorial text-xs"
              />
            )}
          </div>

          {/* Privacy Security Note */}
          <div className="p-3 bg-[#f0ece3] rounded-xl border border-[#dedad0] text-[10px] text-[#5e605d] leading-relaxed">
            🛡️ <strong className="text-[#1a1a1a]">수령인 안심 배송 보증:</strong> 입력하신 주소와 연락처는 선물 배송 완료 후 안전하게 암호화 보관되며, 가격 및 결제 정보는 일절 노출되지 않습니다.
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-editorial py-4 text-xs tracking-widest uppercase font-bold shadow-md w-full"
            >
              {isSubmitting ? "선물 수락 처리 중..." : "이 주소로 선물 수락하기 ✦"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

