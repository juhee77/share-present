"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { GiftDraft } from "@/lib/createFlow";
import { LOOKBOOK_PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/catalog";
import { ProductDto } from "@/lib/api";

interface GiftPickerStepProps {
  draft: GiftDraft;
  onChange: (patch: Partial<GiftDraft>) => void;
  onOpenMdPick?: () => void;
}

export default function GiftPickerStep({ draft, onChange }: GiftPickerStepProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isCustomDrawerOpen, setIsCustomDrawerOpen] = useState(false);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "ALL") return LOOKBOOK_PRODUCTS;
    const cat = PRODUCT_CATEGORIES.find((c) => c.id === selectedCategory);
    if (!cat || !cat.keywords) return LOOKBOOK_PRODUCTS;

    return LOOKBOOK_PRODUCTS.filter((prod) => {
      const searchTarget = `${prod.brand} ${prod.name} ${prod.description}`.toLowerCase();
      return cat.keywords!.some((kw) => searchTarget.includes(kw.toLowerCase()));
    });
  }, [selectedCategory]);

  const toggleProduct = (productId: number) => {
    const isAlready = draft.selectedProductIds.includes(productId);
    const nextIds = isAlready
      ? draft.selectedProductIds.filter((id) => id !== productId)
      : [...draft.selectedProductIds, productId];

    onChange({ selectedProductIds: nextIds });
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Category Pills & Selected Counter */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0">
          {PRODUCT_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#3b483a] text-white shadow-xs"
                    : "bg-white text-[#5e605d] border border-[#eae3d5] hover:border-[#3b483a]/40"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="shrink-0 bg-[#fdf5e2] text-[#7a5416] border border-[#f5dfa6] px-2.5 py-1 rounded-full text-[11px] font-bold">
          선택 {draft.selectedProductIds.length}개
        </div>
      </div>

      {/* 2-Column Editorial Product Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {filteredProducts.map((prod) => {
          const numId = Number(prod.id);
          const isSelected = draft.selectedProductIds.includes(numId);

          return (
            <div
              key={prod.id}
              onClick={() => toggleProduct(numId)}
              className={`rounded-2xl overflow-hidden border p-2 transition-all flex flex-col justify-between cursor-pointer select-none ${
                isSelected
                  ? "bg-[#eff4ed] border-[#3b483a] ring-2 ring-[#3b483a]/20 shadow-xs"
                  : "bg-white border-[#eae3d5] hover:border-[#3b483a]/30 hover:shadow-2xs"
              }`}
            >
              {/* Product Thumbnail with Floating Checkbox */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#faf7f0] mb-2">
                <Image
                  src={prod.imageUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600"}
                  alt={prod.name}
                  fill
                  sizes="(max-width: 640px) 45vw, 240px"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
                {/* Floating Checkmark Pill */}
                <div
                  className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-xs transition-transform ${
                    isSelected
                      ? "bg-[#3b483a] text-white scale-105"
                      : "bg-white/90 text-transparent border border-black/10 hover:bg-white"
                  }`}
                >
                  ✓
                </div>
              </div>

              {/* Product Meta */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#a38974]">
                    {prod.brand}
                  </div>
                  <div className="text-xs font-bold text-[#1a1a1a] line-clamp-1 mt-0.5">
                    {prod.name}
                  </div>
                </div>

                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#3b483a]">
                    {prod.price.toLocaleString()}원
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      isSelected ? "text-[#3b483a]" : "text-[#8a8e85]"
                    }`}
                  >
                    {isSelected ? "담김 ✓" : "+ 추가"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Item Accordion / Drawer */}
      <div className="bg-white rounded-3xl border border-[#eae3d5] p-4 shadow-xs mt-4">
        <button
          type="button"
          onClick={() => setIsCustomDrawerOpen(!isCustomDrawerOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">✨</span>
            <div>
              <span className="text-xs font-bold text-[#1a1a1a] block">
                직접 추천하고 싶은 아이템 추가 (선택사항)
              </span>
              <span className="text-[10.5px] text-[#8a8e85] block">
                원하는 외부 브랜드나 선물 링크를 입력해 리스트에 함께 담을 수 있어요.
              </span>
            </div>
          </div>
          <span className="text-sm font-bold text-[#3b483a]">
            {isCustomDrawerOpen ? "닫기 ▲" : "입력 ▼"}
          </span>
        </button>

        {isCustomDrawerOpen && (
          <div className="mt-3.5 pt-3.5 border-t border-[#f2ede3] space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-[#5e605d] mb-1">
                  브랜드명
                </label>
                <input
                  type="text"
                  value={draft.customBrand}
                  onChange={(e) => onChange({ customBrand: e.target.value })}
                  placeholder="예: 조말론, 다이슨"
                  className="w-full px-2.5 py-2 bg-[#faf7f0] border border-[#eae3d5] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#3b483a]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#5e605d] mb-1">
                  상품명
                </label>
                <input
                  type="text"
                  value={draft.customName}
                  onChange={(e) => onChange({ customName: e.target.value })}
                  placeholder="예: 잉글리쉬 페어 앤 프리지아"
                  className="w-full px-2.5 py-2 bg-[#faf7f0] border border-[#eae3d5] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#3b483a]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#5e605d] mb-1">
                상품 구매/참고 URL
              </label>
              <input
                type="url"
                value={draft.customUrl}
                onChange={(e) => onChange({ customUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-2.5 py-2 bg-[#faf7f0] border border-[#eae3d5] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#3b483a]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#5e605d] mb-1">
                추천 이유 또는 메모
              </label>
              <input
                type="text"
                value={draft.customDesc}
                onChange={(e) => onChange({ customDesc: e.target.value })}
                placeholder="예: 요즘 너한테 너무 잘 어울릴 것 같아서 골라봤어!"
                className="w-full px-2.5 py-2 bg-[#faf7f0] border border-[#eae3d5] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#3b483a]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
