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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-[600px] bg-white rounded-t-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#2a2c2b]">선물 받을 주소 입력</h2>
            {selectedProductName && (
              <p className="text-xs text-[#798a75] font-semibold mt-1">
                선택한 선물: {selectedProductName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2a2c2b] mb-1">
              수령인 성함
            </label>
            <input
              type="text"
              placeholder="예: 홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-text"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2a2c2b] mb-1">
              연락처
            </label>
            <input
              type="tel"
              placeholder="010-0000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-text"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2a2c2b] mb-1">
              배송지 주소
            </label>
            <textarea
              rows={3}
              placeholder="도로명 주소 및 상세주소를 입력해주세요."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-text resize-none"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? "정산 처리 중..." : "이 주소로 선물 수락하기 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
