"use client";

import React from "react";
import Image from "next/image";
import { GiftDraft, CreateStepId } from "@/lib/createFlow";
import {
  LOOKBOOK_PRODUCTS,
  OCCASION_PRESETS,
  CARD_THEMES,
  PACKAGING_STYLES,
} from "@/lib/catalog";

interface ReviewStepProps {
  draft: GiftDraft;
  onEditStep: (step: CreateStepId) => void;
  onOpenCheckout: () => void;
  isSubmitting?: boolean;
}

export default function ReviewStep({
  draft,
  onEditStep,
  onOpenCheckout,
  isSubmitting = false,
}: ReviewStepProps) {
  const occasion = OCCASION_PRESETS.find((p) => p.id === draft.activePresetId);
  const selectedProducts = LOOKBOOK_PRODUCTS.filter((p) =>
    draft.selectedProductIds.includes(Number(p.id))
  );
  const cardTheme = CARD_THEMES.find((t) => t.id === draft.cardTheme);
  const packaging = PACKAGING_STYLES.find((p) => p.id === draft.packagingStyle);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* 1. Safe Escrow Notice Banner */}
      <section className="bg-gradient-to-br from-[#eff4ed] to-[#e2ebe0] rounded-3xl p-5 border border-[#3b483a]/20 shadow-xs">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">🛡️</span>
          <div>
            <h3 className="text-xs font-extrabold text-[#384937] uppercase tracking-wider">
              SharePresent 안심 에스크로 보증
            </h3>
            <p className="text-xs text-[#273426] font-medium leading-relaxed mt-1">
              최대 예산인 <b>{draft.maxBudget.toLocaleString()}원</b>으로 안전하게 사전 예치되며, 받는 분이 최종 선물을 고르면 차액은 <b>100% 자동 즉시 환불</b>됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Step 1 Summary Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae3d5] shadow-xs">
        <div className="flex items-center justify-between mb-2.5 pb-2.5 border-b border-[#f2ede3]">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3b483a] flex items-center gap-1.5">
            <span>🎂</span>
            <span>1단계 · 상황 및 예산</span>
          </span>
          <button
            type="button"
            onClick={() => onEditStep("occasion")}
            className="text-[11px] font-bold text-[#a38974] hover:text-[#3b483a] transition-colors cursor-pointer"
          >
            수정 ✎
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-[#8a8e85] block">보내는 분</span>
            <span className="font-bold text-[#1a1a1a]">{draft.senderName}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#8a8e85] block">상황 테마</span>
            <span className="font-bold text-[#1a1a1a]">
              {occasion?.label || "직접 설정"}
            </span>
          </div>
          <div className="col-span-2 pt-2 border-t border-[#f2ede3]">
            <span className="text-[10px] text-[#8a8e85] block">설정 예산 범위</span>
            <span className="font-extrabold text-[#3b483a] text-sm">
              {draft.minBudget.toLocaleString()}원 ~ {draft.maxBudget.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      {/* 3. Step 2 Summary Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae3d5] shadow-xs">
        <div className="flex items-center justify-between mb-2.5 pb-2.5 border-b border-[#f2ede3]">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3b483a] flex items-center gap-1.5">
            <span>🎁</span>
            <span>2단계 · 큐레이션 선물 ({selectedProducts.length}개)</span>
          </span>
          <button
            type="button"
            onClick={() => onEditStep("products")}
            className="text-[11px] font-bold text-[#a38974] hover:text-[#3b483a] transition-colors cursor-pointer"
          >
            수정 ✎
          </button>
        </div>

        {/* Horizontal Mini Thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {selectedProducts.map((p) => (
            <div
              key={p.id}
              className="w-16 shrink-0 rounded-xl overflow-hidden border border-[#eae3d5] bg-[#faf7f0] p-1 text-center"
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-1">
                <Image
                  src={p.imageUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600"}
                  alt={p.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <span className="text-[9px] font-bold text-[#1a1a1a] block truncate">
                {p.name}
              </span>
            </div>
          ))}

          {draft.customName && (
            <div className="w-16 shrink-0 rounded-xl border border-dashed border-[#a38974] bg-[#faf7f0] p-1 text-center flex flex-col justify-center items-center aspect-square">
              <span className="text-base">✨</span>
              <span className="text-[9px] font-bold text-[#a38974] truncate">
                {draft.customName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Step 3 Summary Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae3d5] shadow-xs">
        <div className="flex items-center justify-between mb-2.5 pb-2.5 border-b border-[#f2ede3]">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3b483a] flex items-center gap-1.5">
            <span>💌</span>
            <span>3단계 · 카드 및 패키징</span>
          </span>
          <button
            type="button"
            onClick={() => onEditStep("card")}
            className="text-[11px] font-bold text-[#a38974] hover:text-[#3b483a] transition-colors cursor-pointer"
          >
            수정 ✎
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#5e605d]">
            <span>테마 & 왁스씰:</span>
            <span className="font-bold text-[#1a1a1a]">
              {cardTheme?.label} · 씰 {draft.sealMonogram}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#5e605d]">
            <span>부티크 패키징:</span>
            <span className="font-bold text-[#1a1a1a]">
              {packaging?.icon} {packaging?.label}
            </span>
          </div>
          {draft.enablePinSecurity && (
            <div className="flex items-center justify-between text-[#5e605d]">
              <span>보안 PIN:</span>
              <span className="font-bold text-[#df6d53]">🔒 4자리 설정됨</span>
            </div>
          )}
          <div className="p-2.5 rounded-xl bg-[#faf7f0] border border-[#eae3d5] text-[11px] text-[#5e605d] italic">
            &ldquo;{draft.messageCard}&rdquo;
          </div>
        </div>
      </div>

      {/* 5. Escrow Payment Summary Box */}
      <section className="bg-white rounded-3xl p-5 border border-[#eae3d5] shadow-xs space-y-2.5">
        <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a]">
          결제 내역 요약
        </h4>

        <div className="flex items-center justify-between text-xs text-[#5e605d]">
          <span>최대 예산 가승인 금액</span>
          <span className="font-bold text-[#1a1a1a]">
            {draft.maxBudget.toLocaleString()}원
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-[#5e605d]">
          <span>배송비</span>
          <span className="font-bold text-[#3b483a]">무료 배송 (0원)</span>
        </div>
        <div className="flex items-center justify-between text-xs text-[#5e605d]">
          <span>예상 환불 금액</span>
          <span className="font-bold text-[#7a5416]">
            최대 {(draft.maxBudget - draft.minBudget).toLocaleString()}원 자동 환불
          </span>
        </div>

        <div className="pt-3 border-t border-[#eae3d5] flex items-center justify-between">
          <span className="text-sm font-bold text-[#1a1a1a]">최종 예치 결제액</span>
          <span className="text-lg font-extrabold text-[#3b483a]">
            {draft.maxBudget.toLocaleString()}원
          </span>
        </div>
      </section>

      {/* Final Action CTA button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onOpenCheckout}
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#3b483a] to-[#273426] text-white font-extrabold text-base tracking-tight shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>선물 상자 생성 중...</span>
            </>
          ) : (
            <>
              <span>안심 예약 결제 및 선물링크 생성</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
