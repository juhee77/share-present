"use client";

import Image from "next/image";

export interface MdPickItem {
  id: number;
  brand: string;
  name: string;
  price: number;
  description: string;
  mdComment: string;
  editorBadge: string;
  imageUrl: string;
}

interface MdPickSectionProps {
  onSelectMdPick?: (id: number) => void;
}

const MD_PICKS: MdPickItem[] = [
  {
    id: 2,
    brand: "GRANHAND",
    name: "마린 오크모스 사쉐 퍼퓸",
    price: 45000,
    description: "차분하고 내추럴한 나무와 풀 향으로 방 안을 가득 채우는 패브릭 사쉐.",
    editorBadge: "🌟 Editor's Top Pick",
    mdComment: "방 안을 감싸는 서늘하고 은은한 오크모스 향. 남녀노소 호불호 없이 모두가 만족하는 1위 큐레이션 선물.",
    imageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 1,
    brand: "OIMU",
    name: "소락사 샌디 도자기 머그",
    price: 38000,
    description: "설악산의 모래 질감을 담아낸 핸드메이드 도자기 컵 세트.",
    editorBadge: "☕ Tableware Pick",
    mdComment: "설악산의 모래 질감을 미니멀하게 표현한 내추럴 도자기 컵. 데일리 오피스 머그로 강력 추천합니다.",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    brand: "TAMBURINS",
    name: "퍼퓸 핸드크림 CHAMO (30ml)",
    price: 32000,
    description: "진득한 카모마일의 약초 향과 따스한 우디 가드의 부드러움.",
    editorBadge: "✨ Fragrance Pick",
    mdComment: "진득한 카모마일의 약초 향과 은은한 세이지의 조화. 주는 이와 받는 이 모두 감각적인 기분 전달.",
    imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
  },
];

export default function MdPickSection({ onSelectMdPick }: MdPickSectionProps) {
  return (
    <section className="my-8 editorial-card p-5 border border-[#eae6df] bg-white relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b border-[#eae6df] pb-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block mb-0.5">
            SharePresent Editorial Curation
          </span>
          <h2 className="font-serif text-xl font-bold text-[#1a1a1a] flex items-center gap-1.5">
            <span>✦</span>
            <span>오늘의 MD Pick!</span>
          </h2>
        </div>
        <span className="text-[10px] font-bold text-[#3b483a] bg-[#3b483a]/10 px-2.5 py-1 rounded-full border border-[#3b483a]/20">
          에디터 엄선
        </span>
      </div>

      <p className="text-xs text-[#5e605d] mb-5 leading-relaxed font-serif">
        "실제 수령 만족도가 가장 높았던 시그니처 잇템. 에디터가 직접 작성한 선물 스토리 큐레이션을 확인해보세요."
      </p>

      <div className="space-y-4">
        {MD_PICKS.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-[#eae6df] bg-[#faf9f6] hover:border-[#3b483a] transition-all flex flex-col sm:flex-row gap-4 items-start"
          >
            <div className="relative w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
              />
              <span className="absolute top-1 left-1 bg-black/70 backdrop-blur-sm text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                {item.editorBadge}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#a38974]">
                  {item.brand}
                </span>
                <span className="text-xs font-bold text-[#1a1a1a]">
                  {item.price.toLocaleString()}원
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#1a1a1a] mt-0.5 truncate">
                {item.name}
              </h3>
              
              <div className="mt-2 p-2.5 bg-white rounded-lg border border-[#eae6df]">
                <p className="text-[11px] text-[#3b483a] font-serif leading-relaxed italic">
                  "{item.mdComment}"
                </p>
              </div>

              {onSelectMdPick && (
                <button
                  onClick={() => onSelectMdPick(item.id)}
                  className="mt-3 text-[11px] font-bold text-[#3b483a] hover:text-[#2c362b] underline flex items-center gap-1"
                >
                  <span>이 아이템으로 큐레이션 세팅하기</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
