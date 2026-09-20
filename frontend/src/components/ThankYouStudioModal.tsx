"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";

interface ThankYouStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { sticker: string; message: string; theme: string }) => void;
  recipientName?: string;
  productBrand?: string;
  productName?: string;
  senderName?: string;
}

interface ThemeOption {
  id: string;
  name: string;
  bg: string;
  cardBg: string;
  border: string;
  text: string;
  subText: string;
  accent: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "cream",
    name: "클래식 크림",
    bg: "bg-[#faf9f6]",
    cardBg: "bg-white",
    border: "border-[#e8e4dc]",
    text: "text-[#1a1a1a]",
    subText: "text-[#7d807b]",
    accent: "bg-[#3b483a] text-white",
  },
  {
    id: "sand",
    name: "웜 샌드",
    bg: "bg-[#f5efe6]",
    cardBg: "bg-[#fcfaf7]",
    border: "border-[#dfd7cc]",
    text: "text-[#2e261f]",
    subText: "text-[#87786b]",
    accent: "bg-[#8a684b] text-white",
  },
  {
    id: "rose",
    name: "로즈 블러쉬",
    bg: "bg-[#fdf2f4]",
    cardBg: "bg-[#fffafa]",
    border: "border-[#f2d5dc]",
    text: "text-[#3d1d24]",
    subText: "text-[#9c6370]",
    accent: "bg-[#b8586c] text-white",
  },
  {
    id: "olive",
    name: "포레스트 올리브",
    bg: "bg-[#252f24]",
    cardBg: "bg-[#2c372b]",
    border: "border-[#3e4d3c]",
    text: "text-[#f2f4f1]",
    subText: "text-[#9cb39a]",
    accent: "bg-[#d4b996] text-[#252f24]",
  },
];

const STICKER_LIST = [
  "💖 취향저격 고마워!",
  "☕ 따뜻한 하루 보낼게",
  "✨ 평생 아껴쓸게!",
  "🎁 최고의 선물이야!",
  "🌿 힐링 선물 감동이야",
  "🥂 우리 조만간 만나자",
];

const PRESET_MESSAGES = [
  {
    title: "감동형",
    text: "정말 필요하고 갖고 싶었던 선물인데, 이렇게 섬세하게 골라줘서 너무 감동이야. 예쁘게 오래오래 잘 쓸게! 고마워 💕",
  },
  {
    title: "유쾌형",
    text: "보자마자 감탄했잖아! 내 취향을 어쩜 이렇게 찰떡같이 알지? 오늘 하루 중 제일 신나는 순간이었어 🥳",
  },
  {
    title: "정중형",
    text: "따뜻한 마음과 정성이 담긴 귀한 선물 진심으로 감사드립니다. 보내주신 응원에 힘입어 더욱 보람찬 하루 보내겠습니다 🌿",
  },
  {
    title: "애정형",
    text: "항상 곁에서 든든하게 챙겨줘서 고마워. 이번 선물도 소중한 추억으로 간직할게. 조만간 꼭 맛있는 밥 먹자! 🥰",
  },
];

export default function ThankYouStudioModal({
  isOpen,
  onClose,
  onSave,
  recipientName = "받는 분",
  productBrand = "SharePresent",
  productName = "특별한 선물",
  senderName = "보내는 분",
}: ThankYouStudioModalProps) {
  const { showToast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(THEME_OPTIONS[0]);
  const [selectedSticker, setSelectedSticker] = useState(STICKER_LIST[0]);
  const [message, setMessage] = useState(PRESET_MESSAGES[0].text);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!message.trim()) {
      showToast("감사 메시지를 작성해주세요.", "error");
      return;
    }
    onSave({
      sticker: selectedSticker,
      message: message.trim(),
      theme: selectedTheme.id,
    });
    showToast("감사 편지 카드가 발신인에게 안전하게 전달되었습니다! 💌", "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#faf9f6] border border-[#e8e4dc] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#242b23] text-white p-4 px-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#a38974] block">
              Thank-You Card Studio
            </span>
            <h3 className="font-serif text-lg font-medium text-[#fcfbf9]">
              감사 카드 & 답장 메시지 꾸미기
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Real-time Postcard Preview */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#3b483a] uppercase tracking-wider block">
              실시간 감사 엽서 미리보기
            </label>

            <div
              className={`p-5 rounded-2xl border transition-all duration-300 shadow-md relative overflow-hidden ${selectedTheme.cardBg} ${selectedTheme.border}`}
            >
              {/* Stamp Decoration */}
              <div className="absolute top-3.5 right-3.5 w-12 h-14 border border-dashed border-[#a38974]/50 rounded-sm p-1 flex flex-col items-center justify-center bg-white/40 shadow-xs">
                <span className="text-base">💌</span>
                <span className="text-[8px] font-serif font-bold text-[#a38974] uppercase tracking-tighter mt-0.5">
                  POST
                </span>
              </div>

              {/* To / From */}
              <div className="mb-3 pr-14">
                <span className="text-[10px] font-bold tracking-wider text-[#a38974] uppercase block">
                  To. {senderName}님에게
                </span>
                <span className={`text-xs font-semibold ${selectedTheme.subText}`}>
                  [{productBrand}] {productName}
                </span>
              </div>

              {/* Sticker Badge */}
              <div className="mb-3">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full shadow-xs ${selectedTheme.accent}`}>
                  {selectedSticker}
                </span>
              </div>

              {/* Message */}
              <p
                className={`font-serif text-sm italic leading-relaxed whitespace-pre-wrap min-h-[50px] ${selectedTheme.text}`}
              >
                &ldquo;{message || "감사 메시지를 입력하세요..."}&rdquo;
              </p>

              {/* From sign */}
              <div className="text-right mt-4 pt-3 border-t border-black/5">
                <span className={`text-[11px] font-serif italic ${selectedTheme.subText}`}>
                  From. {recipientName} 올림 ✦
                </span>
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="text-[11px] font-bold text-[#3b483a] uppercase tracking-wider block mb-2">
              엽서 테마 선택
            </label>
            <div className="grid grid-cols-4 gap-2">
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedTheme(theme)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedTheme.id === theme.id
                      ? "border-[#3b483a] ring-2 ring-[#3b483a]/30 shadow-sm"
                      : "border-[#eae6df] hover:border-[#a38974]"
                  } ${theme.bg}`}
                >
                  <span className={`text-xs font-medium block truncate ${theme.id === "olive" ? "text-white" : "text-[#1a1a1a]"}`}>
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sticker Selector */}
          <div>
            <label className="text-[11px] font-bold text-[#3b483a] uppercase tracking-wider block mb-2">
              감사 스티커 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {STICKER_LIST.map((stk) => (
                <button
                  key={stk}
                  type="button"
                  onClick={() => setSelectedSticker(stk)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedSticker === stk
                      ? "bg-[#3b483a] text-white border-[#3b483a] shadow-sm scale-102"
                      : "bg-white text-[#5e605d] border-[#eae6df] hover:border-[#a38974]"
                  }`}
                >
                  {stk}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Preset Messages */}
          <div>
            <label className="text-[11px] font-bold text-[#3b483a] uppercase tracking-wider block mb-2">
              AI 추천 메시지 프리셋 (원클릭 적용)
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {PRESET_MESSAGES.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => setMessage(preset.text)}
                  className="p-2.5 bg-white border border-[#eae6df] hover:border-[#3b483a] rounded-xl text-left transition-colors group shadow-2xs"
                >
                  <span className="text-[11px] font-bold text-[#3b483a] block mb-0.5 group-hover:underline">
                    ✦ {preset.title}
                  </span>
                  <p className="text-[10px] text-[#7d807b] truncate">
                    {preset.text}
                  </p>
                </button>
              ))}
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={300}
              placeholder="직접 진심이 담긴 감사 메시지를 작성해 보세요..."
              className="w-full text-xs p-3 bg-white border border-[#eae6df] rounded-xl focus:outline-none focus:border-[#3b483a] focus:ring-1 focus:ring-[#3b483a] leading-relaxed resize-none"
            />
            <div className="text-right text-[10px] text-[#7d807b] mt-1">
              {message.length} / 300자
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#eae6df] flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-medium text-[#5e605d] hover:bg-[#faf9f6] rounded-xl border border-[#eae6df] transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] py-2.5 text-xs font-bold text-white bg-[#3b483a] hover:bg-[#2e392d] rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>💌 감사 카드 완성 및 전송</span>
          </button>
        </div>
      </div>
    </div>
  );
}
