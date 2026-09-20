"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";

interface GroupSplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  productName: string;
  brandName?: string;
}

const POPULAR_BANKS = [
  "카카오뱅크",
  "토스뱅크",
  "신한은행",
  "KB국민은행",
  "우리은행",
  "하나은행",
  "NH농협",
];

export default function GroupSplitModal({
  isOpen,
  onClose,
  totalAmount,
  productName,
  brandName = "SharePresent",
}: GroupSplitModalProps) {
  const { showToast } = useToast();
  const [memberCount, setMemberCount] = useState(3);
  const [selectedBank, setSelectedBank] = useState("카카오뱅크");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const perPersonAmount = Math.ceil(totalAmount / memberCount / 100) * 100;
  const remainder = perPersonAmount * memberCount - totalAmount;

  const generateShareText = () => {
    let text = `[SharePresent 공동 선물 1/N 정산 요청] 🎁\n\n`;
    text += `• 선물: [${brandName}] ${productName}\n`;
    text += `• 총 결제 금액: ${totalAmount.toLocaleString()}원 (${memberCount}명 분담)\n`;
    text += `• 1인당 정산 금액: ₩${perPersonAmount.toLocaleString()}원\n`;
    if (accountNumber && accountHolder) {
      text += `\n• 입금 계좌: ${selectedBank} ${accountNumber} (예금주: ${accountHolder})\n`;
    }
    text += `\n함께 마음을 모아주셔서 감사합니다! ✨`;
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateShareText());
    setCopied(true);
    showToast("정산 요청 메시지가 복사되었습니다! 💬", "success");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#faf9f6] border border-[#e8e4dc] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#242b23] text-white p-5 flex items-center justify-between relative">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#a38974] block mb-0.5">
              Co-Funding Split Calculator
            </span>
            <h3 className="font-serif text-lg font-medium text-[#fcfbf9]">
              공동 선물 1/N 정산 계산기
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Summary Card */}
          <div className="bg-white border border-[#eae6df] rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center text-xs text-[#7d807b] mb-1">
              <span>선물 상품</span>
              <span className="font-semibold text-[#3b483a]">{brandName}</span>
            </div>
            <p className="font-medium text-[#1a1a1a] text-sm truncate mb-3">
              {productName}
            </p>
            <div className="flex justify-between items-baseline pt-2 border-t border-[#f0ece4]">
              <span className="text-xs text-[#5e605d]">총 결제 금액</span>
              <span className="font-serif text-lg font-bold text-[#1a1a1a]">
                ₩{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Member Count Selector */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#3b483a] uppercase tracking-wider">
                함께 결제하는 인원 ({memberCount}명)
              </label>
              <span className="text-xs text-[#7d807b]">
                {memberCount === 1 ? "단독 선물" : `나 포함 총 ${memberCount}명`}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMemberCount(num)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    memberCount === num
                      ? "bg-[#3b483a] text-white border-[#3b483a] shadow-sm"
                      : "bg-white text-[#5e605d] border-[#eae6df] hover:border-[#a38974]"
                  }`}
                >
                  {num}명
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="2"
                max="10"
                value={memberCount}
                onChange={(e) => setMemberCount(Number(e.target.value))}
                className="w-full h-1.5 bg-[#eae6df] rounded-lg appearance-none cursor-pointer accent-[#3b483a]"
              />
              <span className="text-xs font-bold text-[#3b483a] w-8 text-right">
                {memberCount}명
              </span>
            </div>
          </div>

          {/* Split Result Card */}
          <div className="bg-[#f4efe8] border border-[#e2d8cc] rounded-xl p-4 text-center">
            <span className="text-[11px] font-bold text-[#a38974] uppercase tracking-wider block mb-1">
              1인당 분담 금액 (100원 단위 절상)
            </span>
            <div className="font-serif text-2xl font-bold text-[#242b23]">
              ₩{perPersonAmount.toLocaleString()}
              <span className="text-xs font-sans font-normal text-[#7d807b] ml-1">
                / 1명
              </span>
            </div>
            {remainder > 0 && (
              <p className="text-[10px] text-[#7d807b] mt-1">
                * 절상 차액 ₩{remainder.toLocaleString()}원은 정산 주최자 잔여 적립
              </p>
            )}
          </div>

          {/* Account Input (Optional) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#3b483a] uppercase tracking-wider block">
              정산받을 계좌 정보 (선택)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="text-xs bg-white border border-[#eae6df] rounded-lg px-2 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#3b483a]"
              >
                {POPULAR_BANKS.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="계좌번호 (- 없이)"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="col-span-2 text-xs bg-white border border-[#eae6df] rounded-lg px-3 py-2 text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:border-[#3b483a]"
              />
            </div>
            <input
              type="text"
              placeholder="예금주 성명 (예: 김선물)"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              className="w-full text-xs bg-white border border-[#eae6df] rounded-lg px-3 py-2 text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:border-[#3b483a]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-[#eae6df] flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-medium text-[#5e605d] hover:bg-[#faf9f6] rounded-xl border border-[#eae6df] transition-colors"
          >
            닫기
          </button>
          <button
            onClick={handleCopy}
            className="flex-[2] py-2.5 text-xs font-bold text-white bg-[#3b483a] hover:bg-[#2e392d] rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>{copied ? "✓ 복사 완료!" : "💬 카톡 정산 메시지 복사"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
