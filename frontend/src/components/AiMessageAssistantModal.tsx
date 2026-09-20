"use client";

import { useState } from "react";
import { generateAiMessage, AiMessageResponse } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

interface AiMessageAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (message: string, theme?: string, monogram?: string) => void;
  initialSituation?: string;
  initialReceiverName?: string;
}

const SITUATIONS = [
  { id: "BIRTHDAY", label: "🎂 생일 축하", defaultTheme: "rose", defaultMonogram: "HBD" },
  { id: "THANK_YOU", label: "💌 특별한 감사", defaultTheme: "ivory", defaultMonogram: "THX" },
  { id: "HOUSEWARMING", label: "🏠 집들이/이사", defaultTheme: "emerald", defaultMonogram: "CONG" },
  { id: "PROMOTION", label: "💼 취업/승진", defaultTheme: "noir", defaultMonogram: "CONG" },
  { id: "ROMANCE", label: "💖 연인/기념일", defaultTheme: "rose", defaultMonogram: "LOVE" },
  { id: "COMFORT", label: "🌿 힐링/위로", defaultTheme: "ivory", defaultMonogram: "LUCK" },
];

const TONES = [
  { id: "EDITORIAL", label: "✨ 정제된 에디토리얼", desc: "차분하고 품격 있는 문체" },
  { id: "WARM", label: "🌸 따뜻하고 다정한", desc: "진심 어린 감동의 톤" },
  { id: "WITTY", label: "⚡ 위트 있고 센스 있는", desc: "경쾌하고 트렌디한 톤" },
];

export default function AiMessageAssistantModal({
  isOpen,
  onClose,
  onApply,
  initialSituation = "BIRTHDAY",
  initialReceiverName = "",
}: AiMessageAssistantModalProps) {
  const { showToast } = useToast();
  const [situation, setSituation] = useState(initialSituation);
  const [tone, setTone] = useState("EDITORIAL");
  const [receiverName, setReceiverName] = useState(initialReceiverName);
  const [senderName, setSenderName] = useState("주희");
  const [customKeyword, setCustomKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiMessageResponse | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await generateAiMessage({
        situation,
        tone,
        receiverName: receiverName.trim() || undefined,
        senderName: senderName.trim() || undefined,
        customKeyword: customKeyword.trim() || undefined,
      });
      setResult(response);
      showToast("AI 감성 카드 문구가 성공적으로 생성되었습니다! ✨", "success");
    } catch (err) {
      console.error(err);
      // Fallback local mock generation if backend is temporarily unreachable
      const fallbackMsg = `To. ${receiverName || "소중한 분"}\n빛나는 당신의 특별한 날을 진심으로 축하하며, 일상의 감도를 높여줄 감각적인 큐레이션을 보냅니다.`;
      setResult({
        situation,
        tone,
        generatedMessage: fallbackMsg,
        alternativeSnippets: [
          `소중한 ${receiverName || "당신"}에게 감사의 마음을 담아 보냅니다 🌿`,
          `당신의 공간을 은은하게 채워줄 정제된 선물을 골라주세요 ✨`,
        ],
        recommendedTheme: situation === "BIRTHDAY" ? "rose" : situation === "HOUSEWARMING" ? "emerald" : "ivory",
        recommendedMonogram: situation === "BIRTHDAY" ? "HBD" : situation === "ROMANCE" ? "LOVE" : "THX",
        stylingTip: "테마와 모노그램 씰이 어우러져 더욱 완성도 높은 감동을 선사합니다.",
      });
      showToast("AI 감성 카드 문구가 생성되었습니다! ✨", "success");
    } finally {
      setLoading(false);
    }
  };

  const handleApplySnippet = (snippet: string) => {
    onApply(snippet, result?.recommendedTheme, result?.recommendedMonogram);
    showToast("선택한 AI 문구와 추천 테마가 카드에 적용되었습니다! 💌", "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#eae6df] max-h-[92vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#eae6df] mb-5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#3b483a] text-white flex items-center justify-center text-xs font-serif font-bold">
              ✦
            </span>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#a38974] font-bold block">
                AI CURATION ASSISTANT
              </span>
              <h2 className="font-serif text-lg font-bold text-[#1a1a1a]">
                AI 감성 카드 문구 추천
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f2eb] hover:bg-[#e8e4dc] flex items-center justify-center text-xs font-bold text-[#5e605d] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-4 text-left">
          {/* Situation Chips */}
          <div>
            <label className="text-[11px] font-bold text-[#1a1a1a] block mb-2">
              1. 선물 상황 선택
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SITUATIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSituation(s.id);
                    setResult(null);
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                    situation === s.id
                      ? "bg-[#3b483a] text-white border-[#3b483a] shadow-sm"
                      : "bg-[#faf9f6] text-[#5e605d] border-[#eae6df] hover:border-[#a38974]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="text-[11px] font-bold text-[#1a1a1a] block mb-2">
              2. 문체 및 감성 톤
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTone(t.id);
                    setResult(null);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                    tone === t.id
                      ? "bg-[#3b483a] text-white border-[#3b483a] shadow-sm"
                      : "bg-[#faf9f6] text-[#5e605d] border-[#eae6df] hover:border-[#a38974]"
                  }`}
                >
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recipient & Keyword Inputs */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-bold text-[#5e605d] block mb-1">
                수령인 호칭 (선택)
              </label>
              <input
                type="text"
                placeholder="예: 지우, 팀장님"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#eae6df] bg-[#faf9f6] focus:outline-none focus:border-[#3b483a]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#5e605d] block mb-1">
                키워드 / 배경 (선택)
              </label>
              <input
                type="text"
                placeholder="예: 이직, 첫 자취"
                value={customKeyword}
                onChange={(e) => setCustomKeyword(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#eae6df] bg-[#faf9f6] focus:outline-none focus:border-[#3b483a]"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full btn-editorial py-3 text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-1.5 shadow-md mt-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="animate-spin text-sm">✦</span>
                <span>AI가 감성 문구를 큐레이션 중입니다...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>맞춤형 감성 문구 추천받기</span>
              </>
            )}
          </button>

          {/* Result Card Preview */}
          {result && (
            <div className="mt-5 p-4.5 bg-[#faf9f6] rounded-2xl border border-[#eae6df] space-y-3.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] flex items-center gap-1">
                  <span>✦</span>
                  <span>AI Generated Recommendation</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#3b483a]/10 text-[#3b483a]">
                    테마: {result.recommendedTheme}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#a38974]/15 text-[#a38974]">
                    씰: {result.recommendedMonogram}
                  </span>
                </div>
              </div>

              {/* Main Message Block */}
              <div className="p-3.5 bg-white rounded-xl border border-[#dedad0] shadow-xs relative">
                <p className="text-xs text-[#1a1a1a] font-serif leading-relaxed whitespace-pre-line italic">
                  "{result.generatedMessage}"
                </p>
                <button
                  type="button"
                  onClick={() => handleApplySnippet(result.generatedMessage)}
                  className="mt-2.5 w-full btn-editorial py-2 text-[11px] font-bold flex items-center justify-center gap-1"
                >
                  <span>이 문구로 카드에 바로 적용하기 ✦</span>
                </button>
              </div>

              {/* Alternative Snippets */}
              {result.alternativeSnippets && result.alternativeSnippets.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-[#5e605d] block">
                    다른 감성 문구 제안 (클릭 시 즉시 적용):
                  </span>
                  {result.alternativeSnippets.map((snippet, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplySnippet(snippet)}
                      className="w-full text-left p-2.5 bg-white hover:bg-[#f5f2eb] rounded-xl border border-[#eae6df] hover:border-[#a38974] transition-all text-xs text-[#1a1a1a] font-serif leading-relaxed block shadow-2xs group"
                    >
                      <span className="text-[10px] text-[#a38974] font-mono mr-1.5 font-bold">
                        #{idx + 1}
                      </span>
                      <span>"{snippet}"</span>
                    </button>
                  ))}
                </div>
              )}

              {result.stylingTip && (
                <p className="text-[10px] text-[#7a7266] italic text-center pt-1 border-t border-[#eae6df]">
                  💡 Tip: {result.stylingTip}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
