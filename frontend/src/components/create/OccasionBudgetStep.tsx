"use client";

import React from "react";
import { GiftDraft } from "@/lib/createFlow";
import {
  OCCASION_PRESETS,
  BUDGET_MIN_OPTIONS,
  BUDGET_MAX_OPTIONS,
  OccasionPreset,
} from "@/lib/catalog";

interface OccasionBudgetStepProps {
  draft: GiftDraft;
  onChange: (patch: Partial<GiftDraft>) => void;
}

export default function OccasionBudgetStep({ draft, onChange }: OccasionBudgetStepProps) {
  const handleSelectPreset = (preset: OccasionPreset) => {
    onChange({
      activePresetId: preset.id,
      minBudget: preset.minBudget,
      maxBudget: preset.maxBudget,
      messageCard: preset.message,
      selectedProductIds: preset.productIds,
    });
  };

  const isBudgetInvalid = draft.minBudget > draft.maxBudget;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Sender Info Card */}
      <section className="bg-white rounded-3xl p-5 border border-[#eae3d5] shadow-xs">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#3b483a] mb-3 flex items-center gap-1.5 border-b border-[#f2ede3] pb-2.5">
          <span>✍️</span>
          <span>보내는 사람</span>
        </h3>
        <div>
          <label className="block text-[11px] font-bold text-[#5e605d] uppercase tracking-wider mb-1.5">
            보내는 분 성함 (호칭)
          </label>
          <input
            type="text"
            value={draft.senderName}
            onChange={(e) => onChange({ senderName: e.target.value })}
            placeholder="예: 주희, 팀원 일동, 민수"
            className="w-full px-3.5 py-2.5 bg-[#faf7f0] border border-[#eae3d5] rounded-2xl text-sm font-semibold text-[#1a1a1a] focus:outline-none focus:border-[#3b483a] focus:bg-white transition-all"
          />
        </div>
      </section>

      {/* 2. Occasion Presets Grid */}
      <section className="bg-white rounded-3xl p-5 border border-[#eae3d5] shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-[#f2ede3] pb-2.5">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#3b483a] flex items-center gap-1.5">
            <span>🎉</span>
            <span>선물 상황 선택</span>
          </h3>
          <span className="text-[10px] text-[#8a8e85] font-semibold">
            선택 시 예산·메시지 자동 추천
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {OCCASION_PRESETS.map((preset) => {
            const isSelected = draft.activePresetId === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-[#eff4ed] border-[#3b483a] ring-2 ring-[#3b483a]/20 shadow-xs"
                    : "bg-[#faf7f0] border-[#eae3d5] hover:border-[#3b483a]/40 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">{preset.icon}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-[#3b483a] text-white"
                        : "bg-[#eae3d5]/70 text-[#7a7266]"
                    }`}
                  >
                    {isSelected ? "선택됨 ✓" : "추천"}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1a1a1a]">
                    {preset.title}
                  </div>
                  <div className="text-[10.5px] text-[#7a7266] mt-0.5">
                    {preset.minBudget.toLocaleString()}원 ~ {preset.maxBudget.toLocaleString()}원
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Double-Bound Budget Setting */}
      <section className="bg-white rounded-3xl p-5 border border-[#eae3d5] shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-[#f2ede3] pb-2.5">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#3b483a] flex items-center gap-1.5">
            <span>💰</span>
            <span>예산 범위 설정 (Double-Bound)</span>
          </h3>
          <span className="text-[10px] text-[#7a5416] bg-[#fdf5e2] px-2 py-0.5 rounded-full border border-[#f5dfa6] font-bold">
            차액 100% 자동 환불
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-[#5e605d] uppercase tracking-wider mb-1.5">
              최소 예산 (Min)
            </label>
            <select
              value={draft.minBudget}
              onChange={(e) => onChange({ minBudget: Number(e.target.value) })}
              className="w-full px-3 py-2.5 bg-[#faf7f0] border border-[#eae3d5] rounded-2xl text-xs font-bold text-[#1a1a1a] focus:outline-none focus:border-[#3b483a]"
            >
              {BUDGET_MIN_OPTIONS.map((val) => (
                <option key={val} value={val}>
                  {val.toLocaleString()} 원
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5e605d] uppercase tracking-wider mb-1.5">
              최대 예산 (Max)
            </label>
            <select
              value={draft.maxBudget}
              onChange={(e) => onChange({ maxBudget: Number(e.target.value) })}
              className="w-full px-3 py-2.5 bg-[#faf7f0] border border-[#eae3d5] rounded-2xl text-xs font-bold text-[#1a1a1a] focus:outline-none focus:border-[#3b483a]"
            >
              {BUDGET_MAX_OPTIONS.map((val) => (
                <option key={val} value={val}>
                  {val.toLocaleString()} 원
                </option>
              ))}
            </select>
          </div>
        </div>

        {isBudgetInvalid && (
          <div className="mt-2.5 p-2 bg-[#fcedea] text-[#df6d53] text-[11px] font-bold rounded-xl border border-[#f6c8bf] flex items-center gap-1.5">
            <span>⚠️</span>
            <span>최소 예산이 최대 예산보다 클 수 없습니다. 범위를 재조정해주세요.</span>
          </div>
        )}

        <div className="mt-3.5 p-3 rounded-2xl bg-[#eff4ed] border border-[#e2ebe0] text-[11px] text-[#384937] leading-relaxed">
          <span className="font-bold">💡 안심 에스크로 결제 안내:</span> 결제 시에는 <b>최대 예산({draft.maxBudget.toLocaleString()}원)</b>으로 안전하게 사전 예치되며, 받는 분이 선물을 확정하면 실제 상품 가격과의 차액이 즉시 자동 환불됩니다.
        </div>

        {/* Custom Input Permission Toggle */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#f2ede3]">
          <div>
            <span className="text-xs font-bold text-[#1a1a1a] block">
              받는 이 직접 선물 입력 허용
            </span>
            <span className="text-[10px] text-[#8a8e85] block mt-0.5">
              마음에 드는 상품이 없을 때 원하는 선물 URL을 직접 제안할 수 있습니다.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onChange({ allowCustomInput: !draft.allowCustomInput })}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 cursor-pointer ${
              draft.allowCustomInput ? "bg-[#3b483a]" : "bg-[#d8d3c8]"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                draft.allowCustomInput ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </section>
    </div>
  );
}
