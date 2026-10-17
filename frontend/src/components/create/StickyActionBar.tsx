"use client";

import React from "react";
import { CreateStepId, getPrevStep, validateStep, GiftDraft } from "@/lib/createFlow";

interface StickyActionBarProps {
  draft: GiftDraft;
  onPrev: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
}

export default function StickyActionBar({
  draft,
  onPrev,
  onNext,
  isSubmitting = false,
}: StickyActionBarProps) {
  const hasPrev = getPrevStep(draft.step) !== null;
  const isLastStep = draft.step === "review";
  const validation = validateStep(draft, draft.step);
  const isValid = validation.isValid;

  return (
    <div className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eae3d5] p-3 sm:px-4 shadow-lg transition-all">
      <div className="max-w-[540px] mx-auto flex flex-col gap-1.5">
        {/* Validation hint if invalid */}
        {!isValid && validation.error && (
          <div className="text-[11px] font-semibold text-[#df6d53] text-center bg-[#fcedea] py-1 px-3 rounded-full border border-[#f6c8bf]">
            ⚠️ {validation.error}
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Back button */}
          {hasPrev && (
            <button
              type="button"
              onClick={onPrev}
              disabled={isSubmitting}
              className="px-3.5 py-3 rounded-2xl bg-[#f5f2eb] hover:bg-[#eae3d5] text-[#5e605d] font-bold text-xs transition-colors flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <span>←</span>
              <span>이전</span>
            </button>
          )}

          {/* Quick Info Pill */}
          {draft.step === "products" && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#fdf5e2] text-[#7a5416] rounded-xl text-xs font-bold border border-[#f5dfa6] shrink-0">
              <span>🎁</span>
              <span>{draft.selectedProductIds.length}개 선택</span>
            </div>
          )}

          {/* Main Action Button */}
          <button
            type="button"
            onClick={onNext}
            disabled={!isValid || isSubmitting}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm tracking-tight transition-all flex items-center justify-center gap-2 shadow-sm ${
              !isValid || isSubmitting
                ? "bg-[#d8d3c8] text-[#8a857b] cursor-not-allowed shadow-none"
                : isLastStep
                ? "bg-gradient-to-r from-[#3b483a] to-[#273426] text-white hover:brightness-110 cursor-pointer shadow-md"
                : "bg-[#3b483a] text-white hover:bg-[#273426] cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>처리 중...</span>
              </>
            ) : isLastStep ? (
              <>
                <span>안심 결제 및 선물링크 생성</span>
                <span>✨</span>
              </>
            ) : (
              <>
                <span>다음 단계로 이동</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
