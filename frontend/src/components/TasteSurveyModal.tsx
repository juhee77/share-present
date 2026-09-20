"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { soundFx } from "@/lib/sound";
import { ProductDto } from "@/lib/api";

interface TasteSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductDto[];
  onComplete: (recommendedProductId: number | string, tasteSummary: string) => void;
}

const QUESTIONS = [
  {
    id: 1,
    title: "1. 어떤 분위기의 선물을 가장 선호하시나요?",
    subtitle: "평소 일상에서 추구하는 무드를 골라주세요.",
    options: [
      { id: "natural", label: "🌿 내추럴 & 릴랙싱 (자연과 휴식)", category: "향수/인테리어", keyword: "오크모스, 사쉐, 힐링" },
      { id: "minimal", label: "☕ 모던 & 미니멀 (단정한 일상템)", category: "테이블웨어", keyword: "도자기 머그, 오브제" },
      { id: "spa", label: "🧴 프라이빗 스파 & 바디케어 (기분 전환)", category: "바디/스파", keyword: "핸드워시, 시더우드" },
      { id: "trendy", label: "✨ 트렌디 & 유니크 (감각적인 향)", category: "향수/뷰티", keyword: "핸드크림, 향수" },
    ],
  },
  {
    id: 2,
    title: "2. 선물을 주로 어디에서 사용하고 싶으신가요?",
    subtitle: "선물이 놓일 공간을 생각해보세요.",
    options: [
      { id: "room", label: "🛋️ 포근한 내 방 / 침실 (퇴근 후 힐링)", weight: "fragrance" },
      { id: "office", label: "🏢 회사 오피스 / 업무 데스크 (일상 에너지)", weight: "tableware" },
      { id: "bathroom", label: "🛁 욕실 & 파우더룸 (나만의 루틴)", weight: "body" },
      { id: "dining", label: "🍽️ 주방 & 다이닝 공간 (홈카페)", weight: "dining" },
    ],
  },
  {
    id: 3,
    title: "3. 선물에서 가장 기대하는 포인트는?",
    subtitle: "선물을 받았을 때 가장 설레는 요소를 골라주세요.",
    options: [
      { id: "scent", label: "🕯️ 은은하게 퍼지는 고급스러운 시그니처 향", type: "SCENT" },
      { id: "practical", label: "☕ 매일 손이 가는 실용적인 디자인과 촉감", type: "TOUCH" },
      { id: "care", label: "🍃 거친 손과 피부를 보듬어주는 섬세한 케어", type: "CARE" },
      { id: "aesthetic", label: "🎨 공간의 무드를 바꿔주는 인테리어 오브제", type: "AESTHETIC" },
    ],
  },
];

export default function TasteSurveyModal({
  isOpen,
  onClose,
  products,
  onComplete,
}: TasteSurveyModalProps) {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  if (!isOpen) return null;

  const currentQ = QUESTIONS[currentStep];

  const handleSelectOption = (optionId: string) => {
    const updated = { ...selectedAnswers, [currentStep]: optionId };
    setSelectedAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Analyze and finish
      let matchedProd = products[0];
      const ans1 = updated[0];

      if (ans1 === "natural" && products.length > 1) {
        matchedProd = products.find((p) => p.name.includes("사쉐") || p.brand.includes("GRANHAND")) || products[1];
      } else if (ans1 === "minimal" && products.length > 0) {
        matchedProd = products.find((p) => p.name.includes("머그") || p.brand.includes("OIMU")) || products[0];
      } else if (ans1 === "spa" && products.length > 2) {
        matchedProd = products.find((p) => p.name.includes("핸드워시") || p.brand.includes("NONFICTION")) || products[2];
      } else {
        matchedProd = products[0];
      }

      const summaries = [
        "차분한 쉼과 내추럴 우디 향을 사랑하는 힐링러 타입",
        "단정하고 미니멀한 라이프스타일을 추구하는 감성러 타입",
        "일상의 작은 스파 루틴으로 리프레시를 즐기는 케어러 타입",
        "트렌디하고 감각적인 디자인을 선호하는 에디터 타입",
      ];
      const summary = summaries[Math.floor(Math.random() * summaries.length)];

      soundFx.playLuxuryChime();
      showToast("✨ 취향 분석 완료! 가장 잘 어울리는 선물이 추천되었습니다.", "success");
      onComplete(matchedProd.id, summary);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#faf9f6] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#eae6df] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eae6df] mb-4">
          <div className="flex items-center gap-2">
            <span className="text-base">✨</span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block">
                AI TASTE MATCHING
              </span>
              <h3 className="text-sm font-bold font-serif text-[#1a1a1a]">
                30초 취향 분석 (빠른 추천 받기)
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#ede9e1] flex items-center justify-center text-[#5e605d] hover:bg-[#dedad0] font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-1.5 mb-5">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= currentStep ? "bg-[#3b483a]" : "bg-[#eae6df]"
              }`}
            />
          ))}
        </div>

        {/* Question Content */}
        <div className="space-y-4">
          <div>
            <h4 className="font-serif font-bold text-base text-[#1a1a1a]">
              {currentQ.title}
            </h4>
            <p className="text-xs text-[#5e605d] mt-1">
              {currentQ.subtitle}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt.id)}
                className="w-full text-left p-4 rounded-2xl bg-white border border-[#eae6df] hover:border-[#3b483a] hover:bg-[#faf9f6] hover:shadow-sm transition-all group flex items-center justify-between"
              >
                <span className="text-xs font-semibold text-[#1a1a1a] group-hover:text-[#3b483a]">
                  {opt.label}
                </span>
                <span className="text-xs text-[#8c887b] opacity-0 group-hover:opacity-100 transition-opacity">
                  선택 →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Back Button */}
        {currentStep > 0 && (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="text-xs text-[#7a7873] hover:text-[#1a1a1a] font-medium"
            >
              ← 이전 질문으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
