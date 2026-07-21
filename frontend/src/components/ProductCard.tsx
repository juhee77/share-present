"use client";

import { useState, useEffect } from "react";
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
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(120);

  useEffect(() => {
    setLikeCount(Math.floor(Math.random() * 400) + 120);
  }, []);

  const detailUrl =
    product.externalUrl ||
    `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(
      product.brand + " " + product.name
    )}`;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div
      onClick={onSelect}
      className={`insta-card cursor-pointer relative mb-5 transition-all ${
        isSelected ? "ring-2 ring-[#121212] border-transparent" : "border-[#e6e6e6]"
      }`}
    >
      {/* Feed Header */}
      <div className="p-3.5 flex items-center justify-between border-b border-[#f5f5f5]">
        <div className="flex items-center gap-2.5">
          <div className="insta-story-ring">
            <div className="insta-story-inner">
              <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white text-[10px] font-bold">
                {product.brand.substring(0, 2)}
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-[#121212]">{product.brand}</span>
              <span className="text-blue-500 text-xs">✓</span>
            </div>
            <span className="text-[10px] text-[#737373]">Curated Selection</span>
          </div>
        </div>

        {/* Selected Checkmark Badge */}
        <div
          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
            isSelected
              ? "border-[#121212] bg-[#121212] text-white"
              : "border-gray-300 bg-white"
          }`}
        >
          {isSelected && <span className="text-xs font-bold">✓</span>}
        </div>
      </div>

      {/* Product Image Aspect Frame */}
      {product.imageUrl && (
        <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 600px) 100vw, 600px"
          />
          {product.isCustom && (
            <span className="absolute top-3 left-3 bg-[#121212]/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              ✨ Custom Item
            </span>
          )}
        </div>
      )}

      {/* Instagram Action Icons Bar */}
      <div className="px-4 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xl">
          <button onClick={handleLikeClick} className="transition-transform active:scale-125">
            {isLiked ? "❤️" : "🤍"}
          </button>
          <span>💬</span>
          <span>✈️</span>
        </div>
        <a
          href={detailUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-bold text-[#121212] hover:opacity-70 flex items-center gap-0.5"
        >
          <span>상세보기</span>
          <span>↗</span>
        </a>
      </div>

      {/* Likes Count */}
      <div className="px-4 pt-2 text-xs font-bold text-[#121212]">
        좋아요 {likeCount.toLocaleString()}개
      </div>

      {/* Product Info & Caption */}
      <div className="px-4 pb-4 pt-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-bold text-[#121212]">{product.brand}</span>
          <span className="text-sm font-semibold text-[#262626]">{product.name}</span>
        </div>

        {!hidePrice && product.price > 0 && (
          <p className="text-sm font-extrabold text-[#121212] mt-1">
            {product.price.toLocaleString()} 원
          </p>
        )}

        {product.description && (
          <p className="text-xs text-[#737373] mt-1.5 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Option Selector Dropdown */}
        {isSelected && product.options && product.options.length > 0 && onOptionChange && (
          <div className="mt-3 pt-3 border-t border-[#f5f5f5]" onClick={(e) => e.stopPropagation()}>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#737373] mb-1.5">
              Select Option
            </label>
            <select
              value={selectedOption || ""}
              onChange={(e) => onOptionChange(e.target.value)}
              className="input-insta text-xs py-2 bg-white"
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
