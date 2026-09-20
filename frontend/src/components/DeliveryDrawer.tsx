"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";

interface DeliveryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; phone: string; address: string; deliveryMemo?: string; selectedOption?: string }) => void;
  selectedProductName?: string;
  selectedProductBrand?: string;
  selectedOption?: string;
  availableOptions?: string[];
  isSubmitting?: boolean;
}

interface PostalAddress {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  buildingName: string;
}

const SAMPLE_POSTAL_DATA: PostalAddress[] = [
  {
    zonecode: "06236",
    roadAddress: "서울특별시 강남구 테헤란로 152",
    jibunAddress: "서울특별시 강남구 역삼동 737",
    buildingName: "강남파이낸스센터",
  },
  {
    zonecode: "04419",
    roadAddress: "서울특별시 용산구 한남대로 91",
    jibunAddress: "서울특별시 용산구 한남동 829",
    buildingName: "한남더힐",
  },
  {
    zonecode: "04782",
    roadAddress: "서울특별시 성동구 성수일로 89",
    jibunAddress: "서울특별시 성동구 성수동1가 656-335",
    buildingName: "성수 메타밸리",
  },
  {
    zonecode: "13529",
    roadAddress: "경기도 성남시 분당구 판교역로 166",
    jibunAddress: "경기도 성남시 분당구 백현동 532",
    buildingName: "카카오판교아지트",
  },
  {
    zonecode: "48119",
    roadAddress: "부산광역시 해운대구 마린시티2로 33",
    jibunAddress: "부산광역시 해운대구 우동 1407",
    buildingName: "두산위브더제니스",
  },
  {
    zonecode: "03045",
    roadAddress: "서울특별시 종로구 삼청로 30",
    jibunAddress: "서울특별시 종로구 소격동 165-10",
    buildingName: "국립현대미술관 서울",
  },
  {
    zonecode: "07241",
    roadAddress: "서울특별시 영등포구 여의대로 108",
    jibunAddress: "서울특별시 영등포구 여의도동 22",
    buildingName: "더현대 서울",
  },
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
  availableOptions,
  isSubmitting = false,
}: DeliveryDrawerProps) {
  const { showToast } = useToast();
  const [currentOption, setCurrentOption] = useState(
    selectedOption || (availableOptions && availableOptions.length > 0 ? availableOptions[0] : "")
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [zonecode, setZonecode] = useState("");
  const [baseAddress, setBaseAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [entranceCode, setEntranceCode] = useState("");
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

  const handleSelectPostalAddress = (item: PostalAddress) => {
    setZonecode(item.zonecode);
    setBaseAddress(`${item.roadAddress} (${item.buildingName})`);
    setShowAddressSearch(false);
    showToast("우편번호와 기본 주소가 입력되었습니다. 상세 주소를 입력해주세요.", "info");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !baseAddress.trim()) {
      showToast("수령인 성함, 연락처, 배송 주소를 모두 입력해주세요.", "error");
      return;
    }

    const fullAddress = zonecode.trim()
      ? `[${zonecode.trim()}] ${baseAddress.trim()}${detailAddress.trim() ? " " + detailAddress.trim() : ""}`
      : detailAddress.trim()
      ? `${baseAddress.trim()} ${detailAddress.trim()}`
      : baseAddress.trim();

    let baseMemo =
      deliveryMemo === "✍️ 직접 입력" ? customMemo.trim() : deliveryMemo;

    if (entranceCode.trim()) {
      baseMemo = baseMemo ? `${baseMemo} (공동현관: ${entranceCode.trim()})` : `공동현관: ${entranceCode.trim()}`;
    }

    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      address: fullAddress,
      deliveryMemo: baseMemo || undefined,
      selectedOption: currentOption || selectedOption || undefined,
    });
  };

  const filteredAddresses = searchQuery.trim()
    ? SAMPLE_POSTAL_DATA.filter(
        (a) =>
          a.roadAddress.includes(searchQuery.trim()) ||
          a.jibunAddress.includes(searchQuery.trim()) ||
          a.buildingName.includes(searchQuery.trim()) ||
          a.zonecode.includes(searchQuery.trim())
      )
    : SAMPLE_POSTAL_DATA;


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
              {(currentOption || selectedOption) && (
                <span className="text-[10px] font-semibold text-[#3b483a] bg-[#3b483a]/10 px-2 py-0.5 rounded-full flex-shrink-0">
                  {currentOption || selectedOption}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Option Selection Chips (Colors, Scents, Sizes) */}
        {availableOptions && availableOptions.length > 0 && (
          <div className="p-3.5 bg-white rounded-xl border border-[#eae6df] mb-4 shadow-sm">
            <label className="block text-[11px] font-bold text-[#5e605d] uppercase tracking-wider mb-2">
              선물 옵션 선택 (색상 / 향 / 사이즈)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCurrentOption(opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentOption === opt
                      ? "bg-[#3b483a] text-white shadow-sm ring-1 ring-[#3b483a]"
                      : "bg-[#f5f3ef] text-[#5e605d] border border-[#e5e1da] hover:bg-[#eae6df]"
                  }`}
                >
                  {currentOption === opt && "✓ "}
                  {opt}
                </button>
              ))}
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

          {/* Street Address & Postal Code Search */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#1a1a1a]">
                배송지 주소 <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowAddressSearch(!showAddressSearch)}
                className="text-[11px] font-bold text-[#3b483a] bg-[#f2efe9] hover:bg-[#eae5dc] px-2 py-1 rounded transition-colors"
              >
                {showAddressSearch ? "검색창 닫기 ▲" : "🔍 우편번호 / 주소 검색"}
              </button>
            </div>

            {/* Address Search Autocomplete Box */}
            {showAddressSearch && (
              <div className="p-3.5 bg-white rounded-xl border border-[#3b483a]/30 mb-2.5 animate-fade-in shadow-md">
                <div className="flex items-center gap-1.5 mb-2">
                  <input
                    type="text"
                    placeholder="도로명, 건물명, 지번 검색 (예: 테헤란로, 한남더힐, 판교역로)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-editorial text-xs py-2 flex-1"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-[#8c887b] hover:text-black px-2 py-1"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 max-h-44 overflow-y-auto text-xs pr-1 scrollbar-thin">
                  {filteredAddresses.length > 0 ? (
                    filteredAddresses.map((item, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectPostalAddress(item)}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-[#f6f4f0] text-[#333] transition-colors border border-transparent hover:border-[#eae6df] block group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-[#3b483a] bg-[#3b483a]/10 px-1.5 py-0.5 rounded">
                            {item.zonecode}
                          </span>
                          <span className="text-[10px] text-[#a38974] font-medium group-hover:text-[#3b483a]">
                            {item.buildingName}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-[#1a1a1a] mt-1">
                          {item.roadAddress}
                        </div>
                        <div className="text-[10px] text-[#7a7266] mt-0.5 truncate">
                          [지번] {item.jibunAddress}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-4 text-center text-xs text-[#8c887b]">
                      검색 결과가 없습니다. 도로명 또는 건물명을 확인해주세요.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Postal Code & Base Address Row */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="우편번호"
                value={zonecode}
                onChange={(e) => setZonecode(e.target.value)}
                className="input-editorial text-xs w-24 font-mono font-bold"
                readOnly={!!zonecode}
              />
              <input
                type="text"
                placeholder="기본 도로명 주소 (예: 서울특별시 강남구 테헤란로 152)"
                value={baseAddress}
                onChange={(e) => setBaseAddress(e.target.value)}
                className="input-editorial text-xs flex-1"
                required
              />
            </div>

            <input
              type="text"
              placeholder="상세 주소 (동, 호수, 층수 등)"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
              className="input-editorial text-xs mb-2"
            />
            <input
              type="text"
              placeholder="공동현관 출입번호 (선택: 예: #1234*)"
              value={entranceCode}
              onChange={(e) => setEntranceCode(e.target.value)}
              className="input-editorial text-xs placeholder:text-gray-400"
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

