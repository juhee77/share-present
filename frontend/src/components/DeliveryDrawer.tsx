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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-[580px] bg-white/95 backdrop-blur-2xl rounded-t-[36px] p-7 shadow-2xl max-h-[90vh] overflow-y-auto border-t border-white/80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-300/80 rounded-full mx-auto mb-6" />

        <div className="flex items-center justify-between mb-5 border-b border-black/5 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#b58d75]">
              Shipping Address
            </span>
            <h2 className="text-xl font-bold text-[#1c1e1d]">선물 받을 주소 입력</h2>
            {selectedProductName && (
              <p className="text-xs text-[#5d6d5a] font-bold mt-1 flex items-center gap-1">
                <span>🎁 선택한 선물:</span>
                <span>{selectedProductName}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors font-bold text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1c1e1d] mb-1.5">
              수령인 성함
            </label>
            <input
              type="text"
              placeholder="예: 홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-premium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1c1e1d] mb-1.5">
              연락처
            </label>
            <input
              type="tel"
              placeholder="010-0000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-premium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1c1e1d] mb-1.5">
              배송지 주소
            </label>
            <textarea
              rows={3}
              placeholder="도로명 주소 및 상세주소를 입력해주세요."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-premium resize-none"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary py-4 text-base shadow-xl"
            >
              {isSubmitting ? "정산 처리 중..." : "이 주소로 선물 수락하기 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
