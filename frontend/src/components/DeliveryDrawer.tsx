"use client";

import { useState } from "react";

interface DeliveryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; phone: string; address: string }) => void;
  selectedProductName?: string;
  isSubmitting?: boolean;
}

export default function DeliveryDrawer({
  isOpen,
  onClose,
  onSubmit,
  selectedProductName,
  isSubmitting = false,
}: DeliveryDrawerProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert("모든 배송지 정보를 입력해주세요.");
      return;
    }
    onSubmit({ name, phone, address });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-[560px] bg-white rounded-t-3xl p-7 shadow-2xl max-h-[85vh] overflow-y-auto border-t border-[#eae6df]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#eae6df] rounded-full mx-auto mb-6" />

        <div className="flex items-center justify-between mb-5 border-b border-[#eae6df] pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974]">
              Shipping Details
            </span>
            <h2 className="text-xl font-bold text-[#1a1a1a]">배송 주소지 입력</h2>
            {selectedProductName && (
              <p className="text-xs text-[#3b483a] font-bold mt-1">
                선택한 선물: {selectedProductName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f6f4f0] flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors font-bold text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1a1a1a] mb-1.5">
              수령인 성함
            </label>
            <input
              type="text"
              placeholder="예: 홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-editorial"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1a1a1a] mb-1.5">
              연락처
            </label>
            <input
              type="tel"
              placeholder="010-0000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-editorial"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1a1a1a] mb-1.5">
              배송 주소
            </label>
            <textarea
              rows={3}
              placeholder="도로명 주소 및 상세 주소를 입력해주세요."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-editorial resize-none"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-editorial py-4 text-sm tracking-wider uppercase font-bold shadow-md"
            >
              {isSubmitting ? "처리 중..." : "이 주소로 선물 수락하기 ✦"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
