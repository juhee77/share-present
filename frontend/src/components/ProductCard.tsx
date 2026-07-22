"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ProductDto } from "@/lib/api";

interface ProductCardProps {
  product: ProductDto;
  isSelected: boolean;
  onSelect: () => void;
  selectedOption?: string;
  onOptionChange?: (option: string) => void;
  hidePrice?: boolean;
}

export default function ProductCard({
  product,
  isSelected,
  onSelect,
  selectedOption,
  onOptionChange,
  hidePrice = false,
}: ProductCardProps) {
  const detailUrl =
    product.externalUrl ||
    `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(
      product.brand + " " + product.name
    )}`;

  return (
    <div
      onClick={onSelect}
      className={`editorial-card cursor-pointer relative mb-5 transition-all duration-300 ${
        isSelected ? "ring-1.5 ring-[#3b483a] border-transparent" : "border-[#eae6df]"
      }`}
    >
      {/* Product Image Aspect Frame */}
      {product.imageUrl && (
        <div className="aspect-[4/3] relative overflow-hidden bg-gray-50 border-b border-[#eae6df]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 hover:scale-103"
            sizes="(max-width: 600px) 100vw, 600px"
          />
          {product.isCustom && (
            <span className="absolute top-4 left-4 bg-[#3b483a] text-white text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-md shadow-sm">
              Custom proposal
            </span>
          )}
        </div>
      )}

      {/* Product Description details */}
      <div className="p-4.5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block mb-1">
              {product.brand}
            </span>
            <h3 className="text-base font-bold text-[#1a1a1a] leading-tight mb-1.5">
              {product.name}
            </h3>
            {!hidePrice && product.price > 0 && (
              <p className="text-sm font-extrabold text-[#3b483a] mb-2">
                {product.price.toLocaleString()} KRW
              </p>
            )}
            {product.description && (
              <p className="text-xs text-[#5e605d] leading-relaxed mb-3">
                {product.description}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end justify-between h-full gap-5">
            {/* Selection Check Circle */}
            <div
              className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center ${
                isSelected
                  ? "border-[#3b483a] bg-[#3b483a] text-white shadow-sm"
                  : "border-gray-300 bg-white"
              }`}
            >
              {isSelected && (
                <svg className="w-2.5 h-2.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </div>

            <a
              href={detailUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[10px] font-bold text-[#3b483a] hover:underline flex items-center gap-0.5 tracking-wider uppercase"
            >
              상세보기 ↗
            </a>
          </div>
        </div>

        {/* Option Selector Dropdown */}
        {isSelected && product.options && product.options.length > 0 && onOptionChange && (
          <div className="mt-3.5 pt-3.5 border-t border-[#eae6df]" onClick={(e) => e.stopPropagation()}>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#5e605d] mb-1.5">
              Select Option
            </label>
            <select
              value={selectedOption || ""}
              onChange={(e) => onOptionChange(e.target.value)}
              className="select-editorial"
            >
              <option value="">-- 옵션을 선택해주세요 --</option>
              {product.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
