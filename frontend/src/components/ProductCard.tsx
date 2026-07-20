"use client";

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
  const detailUrl = product.externalUrl || `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(product.brand + ' ' + product.name)}`;

  return (
    <div
      onClick={onSelect}
      className={`card-premium cursor-pointer transition-all duration-300 relative ${
        isSelected
          ? "border-[#798a75] ring-2 ring-[#798a75]/30 bg-white shadow-lg"
          : "hover:border-[#798a75]/40 opacity-90 hover:opacity-100"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#b58d75]">
              {product.brand}
            </span>
            {product.isCustom && (
              <span className="text-[10px] bg-[#b58d75]/15 text-[#b58d75] px-2 py-0.5 rounded-full font-semibold">
                직접 추가
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-[#2a2c2b] mb-1">{product.name}</h3>
          {!hidePrice && product.price > 0 && (
            <p className="text-sm font-semibold text-[#798a75] mb-2">
              {product.price.toLocaleString()} 원
            </p>
          )}
          {product.description && (
            <p className="text-xs text-[#7c7e7c] leading-relaxed mb-3">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              isSelected
                ? "border-[#798a75] bg-[#798a75]"
                : "border-black/20 bg-transparent"
            }`}
          >
            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>

          <a
            href={detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] font-medium text-[#798a75] hover:underline flex items-center gap-0.5 mt-2"
          >
            상세보기 ↗
          </a>
        </div>
      </div>

      {isSelected && product.options && product.options.length > 0 && onOptionChange && (
        <div className="mt-4 pt-3 border-t border-black/5" onClick={(e) => e.stopPropagation()}>
          <label className="block text-xs font-semibold text-[#2a2c2b] mb-1.5">
            옵션 선택
          </label>
          <select
            value={selectedOption || ""}
            onChange={(e) => onOptionChange(e.target.value)}
            className="input-text text-xs py-2 bg-white"
          >
            <option value="">-- 옵션을 선택하세요 --</option>
            {product.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
