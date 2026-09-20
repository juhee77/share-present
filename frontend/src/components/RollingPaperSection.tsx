"use client";

import { useState } from "react";
import { RollingPaperMessageDto } from "@/lib/api";
import RollingPaperModal from "./RollingPaperModal";

interface RollingPaperSectionProps {
  token: string;
  senderName: string;
  messages?: RollingPaperMessageDto[];
}

export default function RollingPaperSection({
  token,
  senderName,
  messages = [],
}: RollingPaperSectionProps) {
  const [msgList, setMsgList] = useState<RollingPaperMessageDto[]>(messages);
  const [showModal, setShowModal] = useState(false);

  const handleSuccess = (newMsg: RollingPaperMessageDto) => {
    setMsgList((prev) => [...prev, newMsg]);
  };

  return (
    <div className="my-6 p-5 rounded-2xl bg-gradient-to-br from-[#fbf9f5] to-[#f5f2eb] border border-[#eae5dc] shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#e5dfd5]">
        <div className="flex items-center gap-2">
          <span className="text-sm">📜</span>
          <h3 className="text-xs font-bold font-serif text-[#1a1a1a] tracking-wider uppercase">
            Together Rolling Paper ({msgList.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="text-[11px] font-bold text-[#3b483a] bg-[#3b483a]/10 hover:bg-[#3b483a]/20 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
        >
          <span>✍️</span>
          <span>메시지 추가</span>
        </button>
      </div>

      {msgList.length === 0 ? (
        <div className="py-4 text-center bg-white/70 rounded-xl border border-[#e5dfd5] border-dashed">
          <p className="text-xs text-[#5e605d] mb-1">
            {senderName}님과 함께 축하하는 공동 선물 롤링페이퍼 공간입니다.
          </p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-[11px] font-bold text-[#3b483a] hover:underline"
          >
            + 첫 번째 축하 롤링페이퍼 카드 남기기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {msgList.map((m) => (
            <div
              key={m.id}
              className="p-3.5 bg-white rounded-xl border border-[#eae6df] shadow-xs hover:border-[#3b483a]/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{m.avatarEmoji || "💌"}</span>
                  <span className="text-[11px] font-bold text-[#1a1a1a]">
                    {m.authorName}
                  </span>
                </div>
                <span className="text-[9px] text-[#8c887b] font-mono">
                  {m.createdAt ? m.createdAt.slice(0, 10) : "2026.07"}
                </span>
              </div>
              <p className="text-xs font-serif italic text-[#333] leading-relaxed line-clamp-3">
                &ldquo;{m.message}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Rolling Paper Modal */}
      <RollingPaperModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        token={token}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
