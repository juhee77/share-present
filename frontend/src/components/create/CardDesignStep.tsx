"use client";

import React from "react";
import { GiftDraft } from "@/lib/createFlow";
import {
  CARD_THEMES,
  FONT_STYLES,
  PACKAGING_STYLES,
  SEAL_MONOGRAMS,
} from "@/lib/catalog";

interface CardDesignStepProps {
  draft: GiftDraft;
  onChange: (patch: Partial<GiftDraft>) => void;
  onOpenAiModal: () => void;
}

export default function CardDesignStep({
  draft,
  onChange,
  onOpenAiModal,
}: CardDesignStepProps) {
  // Theme-specific styles for the Live Preview
  const previewThemeClasses = {
    ivory: "bg-[#fdfaf3] text-[#222521] border-[#eae3d5]",
    emerald: "bg-[#1f2e24] text-[#eff4ed] border-[#3b4d40]",
    noir: "bg-[#181818] text-[#ffffff] border-[#333333]",
    rose: "bg-[#fcf5f4] text-[#2a2221] border-[#ebd7d5]",
  }[draft.cardTheme];

  const fontClasses = {
    serif: "font-serif italic",
    handwriting: "font-serif font-medium tracking-wide",
    sans: "font-sans font-medium",
    mono: "font-mono text-xs",
  }[draft.fontStyle];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Live Card & Packaging Preview */}
      <section className="bg-white rounded-3xl p-5 border border-[#eae3d5] shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-[#f2ede3] pb-2.5">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#3b483a] flex items-center gap-1.5">
            <span>💌</span>
            <span>인비테이션 카드 실시간 미리보기</span>
          </h3>
          <span className="text-[10.5px] font-bold text-[#8a8e85]">Live Preview</span>
        </div>

        {/* The Decorated Letter Card */}
        <div
          className={`relative rounded-3xl p-6 border shadow-sm transition-all duration-300 flex flex-col justify-between min-h-[170px] ${previewThemeClasses}`}
        >
          {/* Wax Seal Monogram Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#df6d53] to-[#b84832] text-white flex items-center justify-center font-serif text-[11px] font-extrabold shadow-md border-2 border-white/60">
            {draft.sealMonogram}
          </div>

          <div className="pt-2">
            <p className={`text-sm leading-relaxed whitespace-pre-wrap ${fontClasses}`}>
              {draft.messageCard || "마음을 전할 따뜻한 메시지를 입력해주세요..."}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-xs opacity-80">
            <span className="font-semibold">
              From. {draft.senderName || "보내는 분"}
            </span>
            <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-black/5">
              {PACKAGING_STYLES.find((p) => p.id === draft.packagingStyle)?.label}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Message Editor & AI Trigger */}
      <section className="bg-white rounded-3xl p-5 border border-[#eae3d5] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#3b483a]">
              메시지 작성
            </h3>
            <button
              type="button"
              onClick={onOpenAiModal}
              className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#3b483a] text-white hover:bg-[#273426] transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <span>✨</span>
              <span>AI 감성 추천</span>
            </button>
          </div>
          <span className="text-[10px] font-mono text-[#8a8e85]">
            {draft.messageCard.length}/200자
          </span>
        </div>

        {/* Quick Message Chips */}
        <div className="flex gap-1.5 mb-2.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { label: "🎂 생일", text: "생일 진심으로 축하해! 마음에 드는 선물 하나 골라주면 주소지로 바로 보내줄게 🎁" },
            { label: "💌 응원/감사", text: "항상 곁에서 힘이 되어줘서 고마워. 당신의 일상에 작은 힐링이 되길 바라 🌿" },
            { label: "🏠 집들이/결혼", text: "새로운 시작을 진심으로 축하해! 공간을 따뜻하게 채워줄 선물이길 바라 ✨" },
            { label: "☕ 가벼운 선물", text: "오다 주웠다! 취향에 딱 맞는 아이템으로 골라줘 ✦" },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange({ messageCard: preset.text })}
              className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-[#faf7f0] hover:bg-[#eae3d5] text-[#1a1a1a] border border-[#eae3d5] whitespace-nowrap transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <textarea
          rows={3}
          maxLength={200}
          value={draft.messageCard}
          onChange={(e) => onChange({ messageCard: e.target.value })}
          placeholder="받는 분에게 전할 축하와 응원의 메시지를 적어주세요."
          className="w-full px-3.5 py-2.5 bg-[#faf7f0] border border-[#eae3d5] rounded-2xl text-sm leading-relaxed text-[#1a1a1a] resize-none focus:outline-none focus:border-[#3b483a] focus:bg-white transition-all"
        />
      </section>

      {/* 3. Theme & Typography Selectors */}
      <section className="bg-white rounded-3xl p-5 border border-[#eae3d5] shadow-xs space-y-4">
        {/* Card Themes */}
        <div>
          <label className="block text-[11px] font-bold text-[#5e605d] uppercase tracking-wider mb-2">
            인비테이션 레터 컬러 테마
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CARD_THEMES.map((theme) => {
              const isSelected = draft.cardTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onChange({ cardTheme: theme.id })}
                  className={`py-2 px-2.5 rounded-2xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    theme.chip
                  } ${
                    isSelected
                      ? "ring-2 ring-[#3b483a] shadow-xs scale-[1.02]"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <span>{isSelected ? "✓" : "✦"}</span>
                  <span>{theme.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Typography */}
        <div>
          <label className="block text-[11px] font-bold text-[#5e605d] uppercase tracking-wider mb-2">
            카드 서체 스타일 (Typography)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {FONT_STYLES.map((style) => {
              const isSelected = draft.fontStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onChange({ fontStyle: style.id })}
                  className={`py-2 px-2 rounded-2xl border text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#3b483a] text-white border-[#3b483a] shadow-xs font-bold"
                      : "bg-[#faf7f0] text-[#5e605d] border-[#eae3d5] hover:border-[#3b483a]"
                  } ${style.fontClass}`}
                >
                  <span>{isSelected ? "✓" : "Aa"}</span>
                  <span>{style.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Packaging Style */}
        <div>
          <label className="block text-[11px] font-bold text-[#5e605d] uppercase tracking-wider mb-2">
            선물 부티크 패키징
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PACKAGING_STYLES.map((pkg) => {
              const isSelected = draft.packagingStyle === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => onChange({ packagingStyle: pkg.id })}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "bg-[#eff4ed] border-[#3b483a] ring-2 ring-[#3b483a]/20 shadow-xs"
                      : "bg-[#faf7f0] border-[#eae3d5] hover:border-[#3b483a]/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">{pkg.icon}</span>
                    <span className="text-[10px] font-bold text-[#3b483a]">
                      {isSelected ? "선택됨 ✓" : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1a1a1a] block">
                      {pkg.label}
                    </span>
                    <span className="text-[9.5px] text-[#7a7266] block mt-0.5">
                      {pkg.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wax Seal Monogram */}
        <div>
          <label className="block text-[11px] font-bold text-[#5e605d] uppercase tracking-wider mb-2">
            3D 왁스 씰 인장 모노그램
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {SEAL_MONOGRAMS.map((mono) => {
              const isSelected = draft.sealMonogram === mono.id;
              return (
                <button
                  key={mono.id}
                  type="button"
                  onClick={() => onChange({ sealMonogram: mono.id })}
                  className={`p-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? "bg-[#3b483a] text-white border-[#3b483a] shadow-xs font-bold"
                      : "bg-[#faf7f0] text-[#5e605d] border-[#eae3d5] hover:border-[#3b483a]"
                  }`}
                >
                  <span className="font-serif text-xs font-bold block">
                    {mono.id}
                  </span>
                  <span className="text-[9px] opacity-80 block mt-0.5">
                    {mono.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional PIN Security */}
        <div className="pt-3 border-t border-[#f2ede3]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#1a1a1a] block">
                🔒 안심 PIN 보안 수령 (4자리)
              </span>
              <span className="text-[10px] text-[#8a8e85] block mt-0.5">
                링크 오발송 방지를 위해 설정한 비밀번호 입력 시에만 선물이 열립니다.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onChange({ enablePinSecurity: !draft.enablePinSecurity })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 cursor-pointer ${
                draft.enablePinSecurity ? "bg-[#3b483a]" : "bg-[#d8d3c8]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  draft.enablePinSecurity ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {draft.enablePinSecurity && (
            <div className="mt-3">
              <input
                type="password"
                maxLength={4}
                value={draft.claimPin}
                onChange={(e) =>
                  onChange({ claimPin: e.target.value.replace(/[^0-9]/g, "") })
                }
                placeholder="숫자 4자리 PIN 번호 입력"
                className="w-full px-3.5 py-2.5 bg-[#faf7f0] border border-[#eae3d5] rounded-2xl text-xs font-bold tracking-widest text-center focus:outline-none focus:border-[#3b483a]"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
