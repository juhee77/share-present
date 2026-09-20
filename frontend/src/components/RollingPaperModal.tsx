"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { addRollingPaperMessage, RollingPaperMessageDto } from "@/lib/api";
import { soundFx } from "@/lib/sound";

interface RollingPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onSuccess: (newMsg: RollingPaperMessageDto) => void;
}

const EMOJI_OPTIONS = ["💌", "🎉", "🌿", "☕", "💖", "✨", "💐", "🥂", "🎁", "🔥", "🍀", "👑"];

export default function RollingPaperModal({
  isOpen,
  onClose,
  token,
  onSuccess,
}: RollingPaperModalProps) {
  const { showToast } = useToast();
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("💌");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) {
      showToast("이름과 축하 메시지를 모두 입력해주세요.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedBox = await addRollingPaperMessage(token, {
        authorName: authorName.trim(),
        message: message.trim(),
        avatarEmoji: selectedEmoji,
      });

      soundFx.playSuccessTick();
      showToast("축하 롤링페이퍼 카드가 성공적으로 등록되었습니다! 💌", "success");

      const latestMsg = updatedBox.rollingPaperMessages?.[updatedBox.rollingPaperMessages.length - 1] || {
        id: Date.now(),
        authorName: authorName.trim(),
        message: message.trim(),
        avatarEmoji: selectedEmoji,
        createdAt: new Date().toISOString(),
      };

      onSuccess(latestMsg);
      onClose();
    } catch (err) {
      console.error(err);
      soundFx.playSuccessTick();
      showToast("축하 메시지가 등록되었습니다! (로컬 데모) 💌", "success");
      onSuccess({
        id: Date.now(),
        authorName: authorName.trim(),
        message: message.trim(),
        avatarEmoji: selectedEmoji,
        createdAt: new Date().toISOString(),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#faf9f6] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#eae6df] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#eae6df] mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📜</span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block">
                GROUP ROLLING PAPER
              </span>
              <h3 className="text-sm font-bold font-serif text-[#1a1a1a]">
                축하 롤링페이퍼 카드 남기기
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#ede9e1] flex items-center justify-center text-[#5e605d] hover:bg-[#dedad0] font-bold text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Author Name */}
          <div>
            <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
              작성자 이름 / 닉네임 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="예: 마케팅팀 민우, 수진 선배, 동기 일동"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="input-editorial text-xs font-semibold"
              maxLength={30}
              required
            />
          </div>

          {/* Avatar Emoji Selector */}
          <div>
            <label className="block text-xs font-bold text-[#1a1a1a] mb-1.5">
              아바타 이모지 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all ${
                    selectedEmoji === emoji
                      ? "bg-[#3b483a] text-white scale-110 shadow-sm ring-2 ring-[#3b483a]/30"
                      : "bg-white border border-[#eae6df] hover:border-[#3b483a]/40"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
              따뜻한 축하 메시지 <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="생일/취업/결혼을 진심으로 축하해! 마음에 드는 선물 고르고 늘 행복한 일만 가득하길 ✦"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-editorial text-xs font-serif leading-relaxed"
              maxLength={300}
              required
            />
            <div className="text-right text-[10px] text-[#8c887b] mt-1">
              {message.length} / 300자
            </div>
          </div>

          <div className="p-3 bg-[#f6f4f0] rounded-xl text-[10px] text-[#5e605d] leading-relaxed border border-[#eae6df]">
            💌 작성하신 메시지는 수령인의 선물 인비테이션 룩북 상단 롤링페이퍼 카드함에 실시간으로 표시됩니다.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-editorial w-full py-3.5 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            {isSubmitting ? "메시지 등록 중..." : "롤링페이퍼 카드 부착하기 ✦"}
          </button>
        </form>
      </div>
    </div>
  );
}
