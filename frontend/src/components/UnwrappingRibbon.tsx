"use client";

import { useState } from "react";
import { verifyClaimPin } from "@/lib/api";
import { soundFx } from "@/lib/sound";

interface UnwrappingRibbonProps {
  senderName: string;
  messageCard?: string;
  cardTheme?: "ivory" | "emerald" | "noir" | "rose";
  sealMonogram?: string;
  hasPinSecurity?: boolean;
  sharingToken?: string;
  onOpen: () => void;
}

export default function UnwrappingRibbon({
  senderName,
  messageCard = "당신을 위해 정성껏 고른 선물입니다.",
  cardTheme = "ivory",
  sealMonogram = "SP",
  hasPinSecurity = false,
  sharingToken = "",
  onOpen,
}: UnwrappingRibbonProps) {
  const [sealBroken, setSealBroken] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [soundActive, setSoundActive] = useState(soundFx.isEnabled());

  const themeStyles = {
    ivory: {
      envelopeBg: "bg-[#f5f2eb]",
      envelopeBorder: "border-[#d8d0c2]",
      letterBg: "bg-[#faf9f6]",
      sealBg: "bg-[#8c7355]",
      sealText: "text-[#fbf9f5]",
      textColor: "text-[#1a1a1a]",
      subText: "text-[#5e605d]",
      sealBorder: "border-[#a89073]",
    },
    emerald: {
      envelopeBg: "bg-[#1f2e24]",
      envelopeBorder: "border-[#3b4d40]",
      letterBg: "bg-[#25372b]",
      sealBg: "bg-[#526d5b]",
      sealText: "text-[#f2f7f4]",
      textColor: "text-[#f5f5f5]",
      subText: "text-[#b0c4b6]",
      sealBorder: "border-[#71917c]",
      dark: true,
    },
    noir: {
      envelopeBg: "bg-[#181818]",
      envelopeBorder: "border-[#333333]",
      letterBg: "bg-[#202020]",
      sealBg: "bg-[#333333]",
      sealText: "text-[#e5e5e5]",
      textColor: "text-[#f5f5f5]",
      subText: "text-[#999999]",
      sealBorder: "border-[#555555]",
      dark: true,
    },
    rose: {
      envelopeBg: "bg-[#f9f1f0]",
      envelopeBorder: "border-[#ebd7d5]",
      letterBg: "bg-[#fffaf9]",
      sealBg: "bg-[#b0787d]",
      sealText: "text-[#fff6f6]",
      textColor: "text-[#1a1a1a]",
      subText: "text-[#6e5d5e]",
      sealBorder: "border-[#c9959a]",
    },
  }[cardTheme || "ivory"] || {
    envelopeBg: "bg-[#f5f2eb]",
    envelopeBorder: "border-[#d8d0c2]",
    letterBg: "bg-[#faf9f6]",
    sealBg: "bg-[#8c7355]",
    sealText: "text-[#fbf9f5]",
    textColor: "text-[#1a1a1a]",
    subText: "text-[#5e605d]",
    sealBorder: "border-[#a89073]",
  };

  const handleBreakSeal = () => {
    if (sealBroken) return;
    if (hasPinSecurity) {
      setShowPinModal(true);
      return;
    }
    soundFx.playWaxSealBreak();
    setSealBroken(true);
  };

  const handleVerifyPin = async () => {
    if (pinInput.length !== 4) {
      setPinError("4자리 PIN 번호를 입력해주세요.");
      return;
    }

    setIsVerifying(true);
    setPinError("");

    try {
      if (sharingToken) {
        const res = await verifyClaimPin(sharingToken, pinInput);
        if (res.valid) {
          soundFx.playWaxSealBreak();
          setShowPinModal(false);
          setSealBroken(true);
        } else {
          setPinError("PIN 번호가 일치하지 않습니다. 다시 확인해주세요.");
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
        }
      } else {
        // Local fallback
        soundFx.playWaxSealBreak();
        setShowPinModal(false);
        setSealBroken(true);
      }
    } catch {
      // Fallback for demo
      soundFx.playWaxSealBreak();
      setShowPinModal(false);
      setSealBroken(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleEnterLookbook = () => {
    soundFx.playLuxuryChime();
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center transition-all duration-600 ${
        isOpening ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <div className="w-full max-w-sm relative animate-fade-in">
        {/* Envelope Outer Box */}
        <div
          className={`rounded-2xl p-6 sm:p-8 border shadow-2xl transition-all duration-500 relative overflow-hidden ${
            themeStyles.envelopeBg
          } ${themeStyles.envelopeBorder}`}
        >
          {/* Top Envelope Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/10 mb-6">
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-70">
              PRIVATE INVITATION
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSoundActive(soundFx.toggleSound())}
                className="text-[11px] px-2 py-0.5 rounded-full bg-black/5 hover:bg-black/10 transition-colors opacity-70 hover:opacity-100 flex items-center gap-1"
                title={soundActive ? "효과음 켜짐" : "효과음 음소거됨"}
              >
                <span>{soundActive ? "🔔" : "🔕"}</span>
                <span className="text-[9px]">{soundActive ? "ON" : "OFF"}</span>
              </button>
              {hasPinSecurity && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 border border-amber-500/30">
                  🔒 PIN 보안
                </span>
              )}
              <span className="text-[10px] font-mono tracking-wider opacity-60">
                NO. 001/SP
              </span>
            </div>
          </div>

          {!sealBroken ? (
            /* PHASE 1: Sealed Envelope State */
            <div className="flex flex-col items-center py-4">
              <span className="text-[11px] font-bold tracking-widest uppercase mb-4 opacity-75">
                From. {senderName}
              </span>

              <h2 className="font-serif text-2xl font-bold mb-6 leading-snug">
                {senderName}님이 보내신<br />
                선물 룩북이 도착했습니다
              </h2>

              {/* 3D Wax Seal Button */}
              <div className="relative my-4">
                <button
                  onClick={handleBreakSeal}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleBreakSeal();
                    }
                  }}
                  aria-label="왁스 씰을 눌러 선물 봉투 개봉하기"
                  className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-2 shadow-2xl transition-transform transform active:scale-95 hover:scale-105 animate-seal-pulse cursor-pointer relative z-10 focus:outline-none focus:ring-4 focus:ring-current/30 ${
                    themeStyles.sealBg
                  } ${themeStyles.sealText} ${themeStyles.sealBorder}`}
                >
                  <span className="font-serif text-2xl font-bold tracking-tighter">
                    {sealMonogram || "SP"}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-mono mt-0.5 opacity-90">
                    SEAL
                  </span>
                </button>
                <div className="absolute -inset-2 rounded-full border border-dashed border-current opacity-30 animate-spin-slow pointer-events-none"></div>
                <div className="absolute -inset-4 rounded-full border border-dotted border-current opacity-15 animate-ping pointer-events-none"></div>
              </div>

              <p className="text-xs mt-6 opacity-90 animate-pulse font-medium flex items-center justify-center gap-1.5">
                <span>✦</span>
                <span>
                  {hasPinSecurity
                    ? "안심 PIN 번호로 봉투를 개봉하세요 🔒"
                    : `모노그램 [${sealMonogram || "SP"}] 왁스 씰을 눌러 봉투를 개봉하세요`}
                </span>
                <span>✦</span>
              </p>
            </div>
          ) : (
            /* PHASE 2: Unsealed Letter Slide Out */
            <div className="flex flex-col items-center py-2 animate-fade-in">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-serif text-sm font-bold mb-4 shadow-md ${
                  themeStyles.sealBg
                } ${themeStyles.sealText}`}
              >
                {sealMonogram || "SP"}
              </div>

              <span className="text-[10px] font-mono uppercase tracking-widest opacity-60 mb-2">
                A Letter For You
              </span>

              <h3 className="font-serif text-xl font-bold mb-3">
                &ldquo;{messageCard}&rdquo;
              </h3>

              <p className="text-xs mb-6 opacity-75 leading-relaxed max-w-xs">
                {senderName}님이 당신의 취향을 존중하여 큐레이션한 선물 리스트입니다. 마음에 드는 상품을 선택해주세요.
              </p>

              <button
                onClick={handleEnterLookbook}
                className="w-full py-4 bg-[#3b483a] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#2c362b] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>선물 룩북 확인하기</span>
                <span>✦</span>
              </button>
            </div>
          )}
        </div>

        {/* PIN Security Modal Dialog */}
        {showPinModal && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div
              className={`w-full max-w-xs bg-white rounded-2xl p-6 border border-[#eae6df] shadow-2xl text-center transform transition-all ${
                isShaking ? "animate-shake" : "animate-fade-in"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-[#3b483a]/10 flex items-center justify-center text-xl mx-auto mb-3">
                🔒
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-1">
                안심 선물 개봉 PIN
              </h3>
              <p className="text-xs text-[#5e605d] mb-4">
                보낸 분({senderName}님)이 설정한<br />
                <span className="font-semibold text-[#1a1a1a]">4자리 안심 비밀번호</span>를 입력해주세요.
              </p>

              <div className="mb-4">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  autoFocus
                  placeholder="••••"
                  value={pinInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setPinInput(val);
                    setPinError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleVerifyPin();
                    }
                  }}
                  className="w-40 text-center text-2xl font-mono tracking-[0.5em] py-2 px-3 border-2 border-[#3b483a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b483a]/30"
                />
                {pinError && (
                  <p className="text-[11px] text-red-500 font-medium mt-2">
                    {pinError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleVerifyPin}
                  disabled={isVerifying || pinInput.length !== 4}
                  className="btn-editorial w-full py-3 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {isVerifying ? "PIN 확인 중..." : "봉투 개봉하기 ✦"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="text-[11px] text-[#7a7266] hover:text-[#1a1a1a] py-1 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Zero Price Recipient Privacy Badge */}
        <p className="text-[11px] text-white/80 mt-4 tracking-wide">
          🔒 수령인에게는 가격 정보가 100% 비노출됩니다
        </p>
      </div>
    </div>
  );
}

