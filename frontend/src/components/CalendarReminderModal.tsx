"use client";

import { useToast } from "@/context/ToastContext";

interface CalendarReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftToken: string;
  recipientName?: string;
  productBrand?: string;
  productName?: string;
}

export default function CalendarReminderModal({
  isOpen,
  onClose,
  giftToken,
  recipientName = "소중한 분",
  productBrand = "SharePresent",
  productName = "특별한 선물",
}: CalendarReminderModalProps) {
  const { showToast } = useToast();

  if (!isOpen) return null;

  // Set reminder date 7 days from now (D-7 expiry check)
  const now = new Date();
  const reminderDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const formattedDateString = reminderDate.toISOString().slice(0, 10);

  const eventTitle = `[SharePresent] ${recipientName}님 선물 상자 수락 만료 확인 알림`;
  const eventDetails = `[SharePresent 선물 상자 알림]\n- 받는 분: ${recipientName}님\n- 선물: [${productBrand}] ${productName}\n- 배송/수락 현황 확인: https://sharepresent.app/gift/track/${giftToken}\n\n선물 수락 기한(7일) 내 수령인이 옵션 및 배송지를 입력했는지 확인하세요.`;

  // Google Calendar URL
  const gcalStartDate = reminderDate.toISOString().replace(/-|:|\.\d\d\d/g, "").slice(0, 15) + "Z";
  const gcalEndDate = new Date(reminderDate.getTime() + 60 * 60 * 1000)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "")
    .slice(0, 15) + "Z";

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventTitle
  )}&dates=${gcalStartDate}/${gcalEndDate}&details=${encodeURIComponent(
    eventDetails
  )}&location=${encodeURIComponent("https://sharepresent.app")}`;

  // Generate .ics file for Apple / Outlook
  const handleDownloadICS = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//SharePresent//Gift Reminder//KO",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:${eventDetails.replace(/\n/g, "\\n")}`,
      `DTSTART:${gcalStartDate}`,
      `DTEND:${gcalEndDate}`,
      `STATUS:CONFIRMED`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sharepresent_reminder_${giftToken}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showToast("iCal 캘린더 일정 파일(.ics)이 저장되었습니다! 📅", "success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#faf9f6] border border-[#e8e4dc] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#242b23] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#a38974] block mb-0.5">
              Calendar Schedule Sync
            </span>
            <h3 className="font-serif text-lg font-medium text-[#fcfbf9]">
              선물 만료 및 일정 캘린더 등록
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Info Card */}
          <div className="bg-white border border-[#eae6df] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">⏰</span>
              <span className="text-xs font-bold text-[#3b483a] uppercase tracking-wider">
                선물 수락 만료 예정일 (D-7)
              </span>
            </div>
            <p className="font-serif text-base font-bold text-[#1a1a1a]">
              {formattedDateString} 23:59까지
            </p>
            <p className="text-[11px] text-[#7d807b] mt-1 leading-relaxed">
              수령인이 선물을 수락하고 배송지를 입력했는지 잊지 않고 확인하실 수 있도록 캘린더에 일정을 등록해 드립니다.
            </p>
          </div>

          {/* Sync Options */}
          <div className="space-y-3">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                showToast("구글 캘린더로 이동합니다! 🗓️", "info");
              }}
              className="flex items-center justify-between p-3.5 bg-white hover:bg-[#f6f4f0] border border-[#eae6df] rounded-xl transition-all group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📅</span>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#1a1a1a] group-hover:text-[#3b483a]">
                    구글 캘린더 (Google Calendar)
                  </div>
                  <div className="text-[10px] text-[#7d807b]">
                    원클릭 웹 캘린더 즉시 등록
                  </div>
                </div>
              </div>
              <span className="text-xs text-[#a38974] font-bold">등록 ↗</span>
            </a>

            <button
              onClick={handleDownloadICS}
              className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-[#f6f4f0] border border-[#eae6df] rounded-xl transition-all group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🍏</span>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#1a1a1a] group-hover:text-[#3b483a]">
                    애플 캘린더 / 아웃룩 (.ics)
                  </div>
                  <div className="text-[10px] text-[#7d807b]">
                    iPhone, Mac, Outlook 캘린더 파일 다운로드
                  </div>
                </div>
              </div>
              <span className="text-xs text-[#a38974] font-bold">다운로드 ⬇</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#eae6df]">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-medium text-[#5e605d] hover:bg-[#faf9f6] rounded-xl border border-[#eae6df] transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
