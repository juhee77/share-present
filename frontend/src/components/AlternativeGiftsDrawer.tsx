"use client";

import React, { useState } from "react";
import { ProductDto } from "@/lib/api";

interface AlternativeGiftsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: ProductDto) => void;
}

const ALTERNATIVE_CATALOG: ProductDto[] = [
  {
    id: 101,
    brand: "AESOP",
    name: "레저렉션 아로마틱 핸드 밤 (75ml)",
    price: 39000,
    description: "지친 손과 큐티클에 풍부한 수분을 공급하는 시트러스, 우디, 허브 아로마의 시그니처 핸드 밤.",
    imageUrl: "https://images.unsplash.com/photo-1608248597309-45da1e028896?w=600&auto=format&fit=crop&q=80",
    options: ["기본 밤 (75ml)", "대용량 (120ml)"],
  },
  {
    id: 102,
    brand: "DIPTYQUE",
    name: "센티드 캔들 베이스 (190g)",
    price: 98000,
    description: "갓 수확한 블랙커런트 베리와 다마스크 로즈의 섬세한 조화가 공간을 로맨틱하게 물들입니다.",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80",
    options: ["BAIES (베이)", "FIGUIER (휘기에)", "TUBEREUSE (투베로즈)"],
  },
  {
    id: 103,
    brand: "LE LABO",
    name: "히노키 핸드 로션 (250ml)",
    price: 49000,
    description: "일본 고야산의 불교 사원에서 영감을 받은 신비롭고 따뜻한 편백나무 숲의 힐링 아로마.",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    options: ["HINOKI (히노키)", "BASIL (바질)"],
  },
  {
    id: 104,
    brand: "SABON",
    name: "바디 스크럽 패키지 (320g)",
    price: 45000,
    description: "사해 소금과 4가지 식물성 보태니컬 오일이 선사하는 매끄럽고 실키한 바디 트리트먼트.",
    imageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80",
    options: ["파출리 라벤더 바닐라", "델리케이트 자스민", "화이트 티"],
  },
  {
    id: 105,
    brand: "TAMBURINS",
    name: "더 쉘 퍼퓸 핸드 (카모 30ml)",
    price: 32000,
    description: "진득한 카모마일과 부드러운 우디 가드가 전하는 특별한 감각의 쉘 패키지 퍼퓸 크림.",
    imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
    options: ["CHAMO", "BERGA SANDAL", "LALE"],
  },
  {
    id: 106,
    brand: "OIMU",
    name: "에어리 인센스 스틱 & 홀더 세트",
    price: 36000,
    description: "국내 전통 향방의 숙련된 장인들이 빚어낸 은은하고 고요한 휴식의 내추럴 인센스.",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    options: ["백단나무향 (우디)", "모과향 (프루티)", "연꽃향 (플로럴)"],
  }
];

export function AlternativeGiftsDrawer({
  isOpen,
  onClose,
  onSelectProduct,
}: AlternativeGiftsDrawerProps) {
  const [selectedAltCategory, setSelectedAltCategory] = useState("ALL");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="bg-[#faf9f6] w-full max-w-md h-full overflow-y-auto flex flex-col p-6 border-l border-[#eae6df] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#eae6df] mb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block mb-1">
              Alternative Curation
            </span>
            <h2 className="text-lg font-serif font-bold text-[#1a1a1a]">
              다른 추천 선물 둘러보기
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#eae6df] flex items-center justify-center text-xs font-bold text-gray-400 hover:text-black hover:border-black transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Security & Privacy Notice (Zero Price) */}
        <div className="p-3 bg-white rounded-xl border border-[#eae6df] mb-4 flex items-center gap-2">
          <span className="text-sm">🛡️</span>
          <p className="text-[11px] text-[#5e605d] leading-relaxed">
            보낸 분의 소중한 마음과 동일한 감도의 엄선된 대안 아이템들입니다. 마음에 드는 선물을 자유롭게 골라보세요.
          </p>
        </div>

        {/* Product Items List (Zero Price) */}
        <div className="space-y-4 flex-1">
          {ALTERNATIVE_CATALOG.map((item) => (
            <div
              key={item.id}
              className="editorial-card p-4 hover:border-[#1a1a1a] transition-all bg-white flex flex-col justify-between"
            >
              <div className="flex gap-3 mb-3">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border border-[#eae6df]"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block">
                    {item.brand}
                  </span>
                  <h3 className="text-sm font-bold text-[#1a1a1a] truncate mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#5e605d] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectProduct(item);
                  onClose();
                }}
                className="btn-editorial-outline text-xs py-2.5 w-full font-bold uppercase tracking-wider"
              >
                이 선물로 변경 및 수락하기 ✦
              </button>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div className="pt-4 border-t border-[#eae6df] mt-4">
          <button
            onClick={onClose}
            className="w-full py-3 text-xs text-[#5e605d] hover:text-[#1a1a1a] font-bold text-center"
          >
            기존 선물 목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
