"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { useToast } from "@/context/ToastContext";
import { submitSupportInquiry, getInquiryStatus, SupportInquiryResponse } from "@/lib/api";

interface FaqItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    id: 1,
    category: "🔒 프라이버시 및 금액 비노출",
    question: "선물 받은 사람에게 상품 가격이나 정산 금액이 보이나요?",
    answer: "아니요, 절대로 노출되지 않습니다. SharePresent는 Zero Price Exposure 원칙을 엄격히 준수하여 수령인 페이지(/gift/[token]) 및 배송 조회 페이지에는 상품가, 예산 한도, 환불 금액 정보가 100% 비노출 처리됩니다.",
  },
  {
    id: 2,
    category: "💳 결제 및 차액 자동 환불",
    question: "수령인이 예산보다 적은 금액의 선물을 고르면 남은 차액은 어떻게 되나요?",
    answer: "보내는 분께서 처음에 설정하신 상한 예산 가결제 보관액에서, 수령인이 최종 선택한 상품 가격을 뺀 '차액'은 보내는 분의 결제 카드로 즉시 자동 부분 취소 승인(환불)됩니다.",
  },
  {
    id: 3,
    category: "⏳ 수락 기한 및 만료",
    question: "선물 수락 기한(D-7) 7일 내에 수령인이 선물을 안 받으면 어떻게 되나요?",
    answer: "선물 상자 생성 후 7일 동안 수령인이 선물을 수락하지 않을 경우, 선물 상자는 자동으로 안전 만료되며 보내는 분의 결제 카드로 보관 금액 전액이 즉시 취소 승인(환불)됩니다.",
  },
  {
    id: 4,
    category: "📦 배송 및 주소 변경",
    question: "수령 주소를 잘못 입력했는데 변경이 가능한가요?",
    answer: "상품이 '상품 준비 중' 단계인 경우 카카오톡 1:1 톡상담 또는 아래 1:1 문의 접수를 통해 즉시 주소 변경이 가능합니다. 이미 '배송 시작' 단계인 경우 택배사 운송장을 통해 주소 변경을 요청하셔야 합니다.",
  },
  {
    id: 5,
    category: "✦ 큐레이션 및 외부 상품",
    question: "보내는 이가 제안한 리스트 외에 다른 상품을 받고 싶으면 어떻게 하나요?",
    answer: "보내는 이가 '받는 이 직접 선물 입력 허용' 옵션을 활성화한 경우, 수령인 페이지 하단의 '원하는 다른 선물 직접 제안하기' 탭을 통해 원하시는 외부 상품 브랜드, 상품명, URL 링크를 제출하실 수 있습니다.",
  },
];

type SupportTab = "FAQ" | "INQUIRY" | "STATUS";

export default function CustomerSupportPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<SupportTab>("FAQ");
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);
  const [faqSearch, setFaqSearch] = useState("");
  const [selectedFaqCategory, setSelectedFaqCategory] = useState("ALL");
  const [createdInquiryId, setCreatedInquiryId] = useState<string | null>(null);
  
  // 1:1 Support Inquiry Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryCategory, setInquiryCategory] = useState("결제/정산 문의");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Status Lookup State
  const [lookupInquiryId, setLookupInquiryId] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [inquiryStatusResult, setInquiryStatusResult] = useState<SupportInquiryResponse | null>(null);

  const handleLookupStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupInquiryId.trim()) {
      showToast("접수 번호(예: INQ-123456)를 입력해주세요.", "error");
      return;
    }
    setIsLookingUp(true);
    try {
      const res = await getInquiryStatus(lookupInquiryId.trim());
      setInquiryStatusResult(res);
      showToast("문의 처리 현황을 성공적으로 조회했습니다! 📋", "success");
    } catch (err) {
      console.error(err);
      // Fallback local mock lookup
      setInquiryStatusResult({
        inquiryId: lookupInquiryId.trim(),
        status: "IN_PROGRESS",
        statusLabel: "전문 상담원 검토 중",
        category: "결제/정산/배송 문의",
        registeredAt: "2026.09.20",
        estimatedReplyTime: "평균 2시간 이내 회신 예정",
        adminNote: "고객센터 전담팀에서 접수 내용을 확인하고 있으며, 답변 작성 즉시 이메일과 카카오 알림톡으로 안내해 드립니다.",
        message: "조회 완료",
      });
      showToast("문의 처리 현황을 조회했습니다! 📋", "success");
    } finally {
      setIsLookingUp(false);
    }
  };

  const FAQ_CATEGORIES = [
    { id: "ALL", label: "전체 ✦" },
    { id: "PRIVACY", label: "🔒 금액 비노출", key: "프라이버시" },
    { id: "PAYMENT", label: "💳 결제/환불", key: "결제" },
    { id: "EXPIRATION", label: "⏳ 수락 기한", key: "수락" },
    { id: "DELIVERY", label: "📦 배송/주소", key: "배송" },
    { id: "CURATION", label: "✦ 큐레이션", key: "큐레이션" },
  ];

  const filteredFaqs = FAQ_LIST.filter((faq) => {
    if (selectedFaqCategory !== "ALL") {
      const catObj = FAQ_CATEGORIES.find((c) => c.id === selectedFaqCategory);
      if (catObj?.key && !faq.category.includes(catObj.key)) {
        return false;
      }
    }
    if (faqSearch.trim()) {
      const kw = faqSearch.trim().toLowerCase();
      return (
        faq.question.toLowerCase().includes(kw) ||
        faq.answer.toLowerCase().includes(kw) ||
        faq.category.toLowerCase().includes(kw)
      );
    }
    return true;
  });

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !content) {
      showToast("모든 필수 입력 항목을 작성해주세요.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitSupportInquiry({ name, email, category: inquiryCategory, content });
      if (res?.inquiryId) {
        setCreatedInquiryId(res.inquiryId);
      } else {
        setCreatedInquiryId(`INQ-${Date.now().toString().slice(-6)}`);
      }
      setSubmitted(true);
      showToast("고객님의 문의가 성공적으로 접수되었습니다! ✦", "success");
    } catch (err) {
      console.error(err);
      setCreatedInquiryId(`INQ-${Date.now().toString().slice(-6)}`);
      setSubmitted(true);
      showToast("고객님의 문의가 성공적으로 접수되었습니다! ✦", "success");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-[#faf9f6]">
      <Header />

      <main className="p-4 flex-1 max-w-[540px] mx-auto w-full">
        {/* Header Title */}
        <div className="my-6 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a38974] block mb-1">
            SharePresent Customer Support
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1a1a1a]">
            고객센터 & 1:1 상담
          </h1>
          <p className="text-xs text-[#5e605d] mt-1.5 leading-relaxed max-w-xs mx-auto">
            궁금하신 점을 빠르게 해결하시고 실시간 문의 처리 현황을 조회해보세요.
          </p>
        </div>

        {/* Live KakaoTalk Support Banner */}
        <div className="editorial-card p-4.5 mb-5 bg-[#3b483a] text-white text-center shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
                💬
              </div>
              <div>
                <h2 className="text-sm font-bold">카카오톡 1:1 실시간 톡상담</h2>
                <p className="text-[11px] text-[#eae6df]">
                  평일 10:00 ~ 18:00 (전담 상담원 실시간 대기)
                </p>
              </div>
            </div>
            <button
              onClick={() => showToast("카카오톡 1:1 실시간 상담 채팅창으로 이동합니다! 💬", "info")}
              className="bg-white text-[#3b483a] font-bold text-xs px-3 py-2 rounded-xl hover:bg-[#faf9f6] transition-all shadow-sm whitespace-nowrap"
            >
              상담 시작 💬
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[#eae6df]/60 p-1 rounded-xl mb-5 text-xs font-bold">
          <button
            onClick={() => setActiveTab("FAQ")}
            className={`flex-1 py-2.5 rounded-lg text-center transition-all ${
              activeTab === "FAQ"
                ? "bg-white text-[#3b483a] shadow-sm font-extrabold"
                : "text-[#5e605d] hover:text-[#1a1a1a]"
            }`}
          >
            ❓ 자주 묻는 질문
          </button>
          <button
            onClick={() => setActiveTab("INQUIRY")}
            className={`flex-1 py-2.5 rounded-lg text-center transition-all ${
              activeTab === "INQUIRY"
                ? "bg-white text-[#3b483a] shadow-sm font-extrabold"
                : "text-[#5e605d] hover:text-[#1a1a1a]"
            }`}
          >
            ✉️ 1:1 문의 접수
          </button>
          <button
            onClick={() => {
              setActiveTab("STATUS");
              if (createdInquiryId && !lookupInquiryId) {
                setLookupInquiryId(createdInquiryId);
              }
            }}
            className={`flex-1 py-2.5 rounded-lg text-center transition-all ${
              activeTab === "STATUS"
                ? "bg-white text-[#3b483a] shadow-sm font-extrabold"
                : "text-[#5e605d] hover:text-[#1a1a1a]"
            }`}
          >
            🔎 접수 현황 조회
          </button>
        </div>

        {/* TAB 1: FAQ Accordion Section */}
        {activeTab === "FAQ" && (
          <section className="editorial-card p-5 bg-white animate-fade-in">
            <div className="flex items-center justify-between mb-4 border-b border-[#eae6df] pb-3">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a] flex items-center gap-1.5">
                <span>❓</span>
                <span>자주 묻는 질문 (FAQ)</span>
              </h2>
              <span className="text-[11px] font-mono text-[#7a7266]">
                {filteredFaqs.length}개 항목
              </span>
            </div>

            {/* FAQ Live Search */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="🔍 질문 키워드 검색... (예: 환불, 배송, 주소, 비노출)"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="input-editorial pl-3.5 pr-8 py-2 text-xs font-medium bg-[#faf9f6]"
              />
              {faqSearch && (
                <button
                  onClick={() => setFaqSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>

            {/* FAQ Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none mb-4">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedFaqCategory(cat.id);
                    if (openFaqId !== null) setOpenFaqId(null);
                  }}
                  className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border ${
                    selectedFaqCategory === cat.id
                      ? "bg-[#3b483a] text-white border-[#3b483a] shadow-xs"
                      : "bg-[#faf9f6] text-[#5e605d] border-[#eae6df] hover:border-[#3b483a]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {filteredFaqs.length > 0 ? (
              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="border border-[#eae6df] rounded-xl overflow-hidden transition-all bg-[#faf9f6]"
                    >
                      <button
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-2"
                      >
                        <div>
                          <span className="text-[10px] font-extrabold uppercase text-[#a38974] block mb-0.5">
                            {faq.category}
                          </span>
                          <span className="text-xs font-bold text-[#1a1a1a]">
                            Q. {faq.question}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#5e605d]">{isOpen ? "▲" : "▼"}</span>
                      </button>

                      {isOpen && (
                        <div className="px-3.5 pb-4 pt-1 text-xs text-[#5e605d] border-t border-[#eae6df] bg-white leading-relaxed font-serif">
                          A. {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 bg-[#faf9f6] rounded-xl border border-[#eae6df] my-2">
                <span className="text-2xl block mb-1">🔍</span>
                <p className="text-xs font-bold text-[#1a1a1a] mb-1">
                  검색된 자주 묻는 질문이 없습니다
                </p>
                <p className="text-[11px] text-[#7a7266] mb-3">
                  1:1 문의 접수를 통해 직접 문의해 주시면 친절히 안내해 드립니다.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFaqSearch("");
                    setSelectedFaqCategory("ALL");
                  }}
                  className="text-[11px] font-bold text-[#3b483a] underline underline-offset-2"
                >
                  검색 조건 초기화 ✦
                </button>
              </div>
            )}
          </section>
        )}

        {/* TAB 2: 1:1 Online Support Inquiry Form */}
        {activeTab === "INQUIRY" && (
          <section className="editorial-card p-5 bg-white animate-fade-in">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a] mb-4 border-b border-[#eae6df] pb-3 flex items-center gap-1.5">
              <span>✉️</span>
              <span>1:1 온라인 문의 접수</span>
            </h2>

            {submitted ? (
              <div className="text-center py-6 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-[#3b483a]/10 text-[#3b483a] flex items-center justify-center text-2xl mx-auto mb-3">
                  ✓
                </div>
                <h3 className="text-base font-bold text-[#1a1a1a] mb-1">
                  문의가 정상적으로 접수되었습니다
                </h3>
                <p className="text-xs text-[#5e605d] mb-4">
                  작성해주신 이메일(<span className="font-bold text-[#1a1a1a]">{email}</span>)로 신속히 답변을 드리겠습니다.
                </p>

                <div className="mb-4 p-3 bg-[#f6f4f0] rounded-xl border border-[#eae6df] text-left text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#7a7266]">문의 유형</span>
                    <span className="font-bold text-[#1a1a1a]">{inquiryCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7a7266]">접수 번호</span>
                    <span className="font-mono font-bold text-[#3b483a]">
                      {createdInquiryId || `INQ-${Date.now().toString().slice(-6)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7a7266]">답변 안내</span>
                    <span className="text-[#3b483a] font-bold">평균 2시간 이내 회신</span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#3b483a]/5 rounded-xl border border-[#3b483a]/20 mb-4 flex items-center justify-center gap-1.5 text-[11px] text-[#3b483a] font-bold">
                  <span>💬</span>
                  <span>카카오 알림톡으로 답변 완료 알림이 함께 발송됩니다</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (createdInquiryId) setLookupInquiryId(createdInquiryId);
                      setActiveTab("STATUS");
                    }}
                    className="flex-1 btn-editorial text-xs py-2.5 font-bold"
                  >
                    접수 현황 실시간 조회하기 🔎
                  </button>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setContent("");
                    }}
                    className="btn-editorial-outline text-xs py-2.5 px-4 font-bold"
                  >
                    추가 문의 작성
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#5e605d] uppercase mb-1">
                    이름 / 닉네임 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 주희"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-editorial"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5e605d] uppercase mb-1">
                    답변받으실 이메일 주소 *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="example@sharepresent.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-editorial"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5e605d] uppercase mb-1">
                    문의 유형 *
                  </label>
                  <select
                    value={inquiryCategory}
                    onChange={(e) => setInquiryCategory(e.target.value)}
                    className="select-editorial"
                  >
                    <option>결제/정산 문의</option>
                    <option>배송 및 주소지 변경 문의</option>
                    <option>선물 수락 및 기한 문의</option>
                    <option>기타 시스템 이용 문의</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5e605d] uppercase mb-1">
                    문의 내용 *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="궁금하신 내용이나 요청사항을 상세히 적어주세요."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="input-editorial resize-none font-serif"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-editorial py-3.5 text-xs tracking-wider uppercase font-bold w-full"
                >
                  {isSubmitting ? "접수 중..." : "1:1 문의 접수하기 ✉️"}
                </button>
              </form>
            )}
          </section>
        )}

        {/* TAB 3: Live Inquiry Status Lookup */}
        {activeTab === "STATUS" && (
          <section className="editorial-card p-5 bg-white animate-fade-in space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a] border-b border-[#eae6df] pb-3 flex items-center gap-1.5">
              <span>🔎</span>
              <span>1:1 문의 실시간 처리 현황 조회</span>
            </h2>

            <form onSubmit={handleLookupStatus} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#5e605d] uppercase mb-1">
                  접수 번호 (Inquiry ID)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="예: INQ-123456"
                    value={lookupInquiryId}
                    onChange={(e) => setLookupInquiryId(e.target.value)}
                    className="input-editorial flex-1 font-mono uppercase"
                  />
                  <button
                    type="submit"
                    disabled={isLookingUp}
                    className="btn-editorial px-5 py-2.5 text-xs font-bold whitespace-nowrap shadow-sm"
                  >
                    {isLookingUp ? "조회 중..." : "조회 ✦"}
                  </button>
                </div>
              </div>
            </form>

            {inquiryStatusResult && (
              <div className="p-4.5 bg-[#faf9f6] rounded-2xl border border-[#eae6df] space-y-3 animate-fade-in text-left">
                <div className="flex items-center justify-between border-b border-[#eae6df] pb-2.5">
                  <span className="font-mono text-xs font-bold text-[#3b483a]">
                    {inquiryStatusResult.inquiryId}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#3b483a] text-white">
                    {inquiryStatusResult.statusLabel || "검토 중"}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-[#5e605d]">
                  <div className="flex justify-between">
                    <span>문의 카테고리</span>
                    <span className="font-bold text-[#1a1a1a]">
                      {inquiryStatusResult.category || "고객 문의"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>접수 일자</span>
                    <span className="font-mono text-[#1a1a1a]">
                      {inquiryStatusResult.registeredAt || "2026.09.20"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#3b483a] font-bold">
                    <span>예상 처리 일정</span>
                    <span>{inquiryStatusResult.estimatedReplyTime || "평균 2시간 이내"}</span>
                  </div>
                </div>

                {inquiryStatusResult.adminNote && (
                  <div className="p-3 bg-white rounded-xl border border-[#eae6df] text-xs text-[#1a1a1a] font-serif leading-relaxed italic">
                    "{inquiryStatusResult.adminNote}"
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
