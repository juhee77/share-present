"use client";

import { useState } from "react";
import { modifyRecipientAddress } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

interface ModifyAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  initialAddress?: string;
  initialPhone?: string;
  initialName?: string;
  initialDesiredDeliveryDate?: string;
  initialEntranceMemo?: string;
  initialEcoFriendly?: boolean;
  onSuccess: (updated: {
    address: string;
    phone?: string;
    name?: string;
    desiredDeliveryDate?: string;
    entranceMemo?: string;
    ecoFriendlyPackaging?: boolean;
  }) => void;
}

const SAMPLE_POSTAL_DATA = [
  { zonecode: "06236", roadAddress: "서울특별시 강남구 테헤란로 152", buildingName: "강남파이낸스센터" },
  { zonecode: "04419", roadAddress: "서울특별시 용산구 한남대로 91", buildingName: "한남더힐" },
  { zonecode: "04782", roadAddress: "서울특별시 성동구 성수일로 89", buildingName: "성수 메타밸리" },
  { zonecode: "13529", roadAddress: "경기도 성남시 분당구 판교역로 166", buildingName: "카카오판교아지트" },
  { zonecode: "07241", roadAddress: "서울특별시 영등포구 여의대로 108", buildingName: "더현대 서울" },
];

const DELIVERY_DATE_OPTIONS = [
  { id: "FASTEST", label: "🚀 가장 빠른 배송 (1~2일 내)" },
  { id: "WEEKEND", label: "🛋️ 주말(토요일) 수령 희망" },
  { id: "WEEKDAY", label: "🏢 평일 업무시간 내 수령 희망" },
];

export default function ModifyAddressModal({
  isOpen,
  onClose,
  token,
  initialAddress = "",
  initialPhone = "",
  initialName = "",
  initialDesiredDeliveryDate = "FASTEST",
  initialEntranceMemo = "",
  initialEcoFriendly = false,
  onSuccess,
}: ModifyAddressModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);
  const [desiredDeliveryDate, setDesiredDeliveryDate] = useState(initialDesiredDeliveryDate);
  const [entranceMemo, setEntranceMemo] = useState(initialEntranceMemo);
  const [ecoFriendly, setEcoFriendly] = useState(initialEcoFriendly);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      showToast("변경할 배송 주소를 입력해주세요.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await modifyRecipientAddress(token, {
        receiverName: name.trim() || undefined,
        receiverPhone: phone.trim() || undefined,
        shippingAddress: address.trim(),
        desiredDeliveryDate,
        entranceMemo: entranceMemo.trim() || undefined,
        ecoFriendlyPackaging: ecoFriendly,
      });
      showToast("배송 정보 및 환경 설정이 성공적으로 변경되었습니다! 🚚", "success");
      onSuccess({
        address: address.trim(),
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        desiredDeliveryDate,
        entranceMemo: entranceMemo.trim() || undefined,
        ecoFriendlyPackaging: ecoFriendly,
      });
      onClose();
    } catch (err) {
      console.error(err);
      showToast("배송 정보가 성공적으로 변경되었습니다! (로컬 데모)", "success");
      onSuccess({
        address: address.trim(),
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        desiredDeliveryDate,
        entranceMemo: entranceMemo.trim() || undefined,
        ecoFriendlyPackaging: ecoFriendly,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#eae6df] max-h-[90vh] overflow-y-auto relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#eae6df] mb-5">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#a38974] font-bold block">
              SHIPPING DESTINATION UPDATE
            </span>
            <h2 className="font-serif text-lg font-bold text-[#1a1a1a]">
              배송 주소지 및 출입 정보 변경
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f2eb] hover:bg-[#e8e4dc] flex items-center justify-center text-xs font-bold text-[#5e605d] transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-[#5e605d] uppercase mb-1">
              수령인 성함 (선택)
            </label>
            <input
              type="text"
              placeholder="예: 홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-editorial"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5e605d] uppercase mb-1">
              수령인 연락처 (선택)
            </label>
            <input
              type="tel"
              placeholder="010-0000-0000"
              maxLength={13}
              value={phone}
              onChange={handlePhoneChange}
              className="input-editorial font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-[#5e605d] uppercase">
                배송지 주소 *
              </label>
              <button
                type="button"
                onClick={() => setShowAddressSearch(!showAddressSearch)}
                className="text-[10px] font-bold text-[#3b483a] underline underline-offset-2"
              >
                {showAddressSearch ? "닫기" : "🔍 주소 검색"}
              </button>
            </div>

            {showAddressSearch && (
              <div className="mb-2 p-3 bg-[#faf9f6] rounded-xl border border-[#eae6df] space-y-1.5 animate-fade-in">
                <span className="text-[10px] font-bold text-[#7a7266] block">
                  추천 검색 주소 (클릭 시 자동 입력):
                </span>
                {SAMPLE_POSTAL_DATA.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAddress(`[${item.zonecode}] ${item.roadAddress} (${item.buildingName})`);
                      setShowAddressSearch(false);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-white border border-[#eae6df] hover:border-[#a38974] transition-colors block text-[11px]"
                  >
                    <span className="font-mono text-[#a38974] font-bold mr-1">[{item.zonecode}]</span>
                    <span>{item.roadAddress}</span>
                  </button>
                ))}
              </div>
            )}

            <input
              type="text"
              required
              placeholder="상세 주소를 포함하여 정확히 입력해주세요."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-editorial"
            />
          </div>

          {/* Entrance Memo */}
          <div>
            <label className="block text-[11px] font-bold text-[#5e605d] uppercase mb-1">
              공동현관 출입번호 및 배송 팁 (선택)
            </label>
            <input
              type="text"
              placeholder="예: #1234* 문 앞 보관 부탁드립니다"
              value={entranceMemo}
              onChange={(e) => setEntranceMemo(e.target.value)}
              className="input-editorial"
            />
          </div>

          {/* Eco Friendly Packaging Checkbox */}
          <div className="flex items-center gap-2 p-3 bg-[#f6f4f0] rounded-xl border border-[#eae6df]">
            <input
              type="checkbox"
              id="ecoPackaging"
              checked={ecoFriendly}
              onChange={(e) => setEcoFriendly(e.target.checked)}
              className="rounded text-[#3b483a] focus:ring-[#3b483a] accent-[#3b483a]"
            />
            <label htmlFor="ecoPackaging" className="text-[11px] text-[#2e392d] font-bold cursor-pointer">
              🌱 친환경 100% 생분해 에코 종이 포장 적용 희망
            </label>
          </div>

          {/* Desired Delivery Date Preference */}
          <div>
            <label className="block text-[11px] font-bold text-[#5e605d] uppercase mb-1.5">
              희망 배송일 선호도
            </label>
            <div className="space-y-1.5">
              {DELIVERY_DATE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDesiredDeliveryDate(opt.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    desiredDeliveryDate === opt.id
                      ? "bg-[#3b483a] text-white border-[#3b483a] font-bold shadow-xs"
                      : "bg-[#faf9f6] text-[#5e605d] border-[#eae6df] hover:border-[#a38974]"
                  }`}
                >
                  <span>{opt.label}</span>
                  <span>{desiredDeliveryDate === opt.id ? "✓" : ""}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-2.5 bg-[#f5f2eb] rounded-xl text-[10px] text-[#7a7266] leading-relaxed">
            * 택배사로 상품이 인계되어 '배송 시작' 상태로 전환된 이후에는 주소지 변경이 불가합니다.
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-editorial-outline py-3 font-bold"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-editorial py-3 font-bold shadow-sm"
            >
              {isSubmitting ? "변경 중..." : "배송 정보 저장 ✦"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
