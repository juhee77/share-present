"use client";

import React from "react";
import { CreateStepId, CREATE_STEPS } from "@/lib/createFlow";

interface StepProgressProps {
  currentStep: CreateStepId;
  onStepClick: (step: CreateStepId) => void;
}

export default function StepProgress({ currentStep, onStepClick }: StepProgressProps) {
  const currentIdx = CREATE_STEPS.findIndex((s) => s.id === currentStep);
  const currentMeta = CREATE_STEPS[currentIdx] || CREATE_STEPS[0];
  const progressPercent = ((currentIdx + 1) / CREATE_STEPS.length) * 100;

  return (
    <div className="w-full pt-2 pb-4 mb-2">
      {/* Step Numbers & Title */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-extrabold tracking-wider text-[#3b483a] bg-[#eff4ed] px-2.5 py-0.5 rounded-full border border-[#e2ebe0]">
          STEP {currentMeta.number} OF 4
        </span>
        <span className="text-[11px] font-semibold text-[#8a8e85]">
          {currentMeta.title}
        </span>
      </div>

      {/* Smooth Rounded Progress Bar */}
      <div className="h-2 w-full bg-[#eae3d5]/60 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full bg-gradient-to-r from-[#3b483a] to-[#5a7258] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Clickable Pills */}
      <div className="grid grid-cols-4 gap-1.5 mt-3">
        {CREATE_STEPS.map((s, idx) => {
          const isActive = s.id === currentStep;
          const isPassed = idx < currentIdx;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onStepClick(s.id)}
              disabled={idx > currentIdx} // Cannot jump forward past current step without validation
              className={`py-1.5 px-1 rounded-xl text-center transition-all flex flex-col items-center gap-0.5 ${
                isActive
                  ? "bg-[#3b483a] text-white shadow-xs font-bold"
                  : isPassed
                  ? "bg-white text-[#3b483a] border border-[#e2ebe0] hover:bg-[#eff4ed] font-medium cursor-pointer"
                  : "bg-[#f5f2eb]/60 text-[#a39e94] border border-transparent opacity-60 cursor-not-allowed"
              }`}
            >
              <span className="text-xs">{s.icon}</span>
              <span className="text-[10px] leading-tight tracking-tight">
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Step Subtitle */}
      <div className="mt-4 text-center">
        <h2 className="text-lg font-bold text-[#1a1a1a] tracking-tight">
          {currentMeta.title}
        </h2>
        <p className="text-xs text-[#5e605d] mt-0.5">
          {currentMeta.subtitle}
        </p>
      </div>
    </div>
  );
}
