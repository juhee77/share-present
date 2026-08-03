"use client";

import { useState } from "react";
import Header from "@/components/Header";

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

export default function CustomerSupportPage() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);
  
  // 1:1 Support Inquiry Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryCategory, setInquiryCategory] = useState("결제/정산 문의");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !content) {
      alert("모든 필수 입력 항목을 작성해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch("http://localhost:8081/api/v1/support/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, category: inquiryCategory, content }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
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
            고객센터 & 자주 묻는 질문
          </h1>
          <p className="text-xs text-[#5e605d] mt-1.5 leading-relaxed max-w-xs mx-auto">
            궁금하신 사항을 확인하시거나 1:1 상담 및 카카오톡 톡상담을 이용해보세요.
          </p>
        </div>

        {/* Live KakaoTalk Support Banner */}
        <div className="editorial-card p-5 mb-6 bg-[#3b483a] text-white text-center shadow-md">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl mx-auto mb-2">
            💬
          </div>
          <h2 className="text-base font-bold mb-1">카카오톡 1:1 실시간 톡상담</h2>
          <p className="text-xs text-[#eae6df] mb-4">
            평일 10:00 ~ 18:00 (점심시간 12:00 ~ 13:00) 전문 상담원이 친절히 답변 드립니다.
          </p>
          <button
            onClick={() => alert("카카오톡 1:1 실시간 상담 채팅창으로 이동합니다! 💬")}
            className="w-full bg-white text-[#3b483a] font-bold text-xs py-3 rounded-xl hover:bg-[#faf9f6] transition-all shadow-sm uppercase tracking-wider"
          >
            카카오톡 1:1 상담 시작하기 💬
          </button>
        </div>

        {/* FAQ Accordion Section */}
        <section className="editorial-card p-5 mb-6 bg-white">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a] mb-4 border-b border-[#eae6df] pb-3 flex items-center gap-1.5">
            <span>❓</span>
            <span>자주 묻는 질문 (FAQ)</span>
          </h2>

          <div className="space-y-3">
            {FAQ_LIST.map((faq) => {
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
        </section>

        {/* 1:1 Online Support Inquiry Form */}
        <section className="editorial-card p-5 bg-white">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a] mb-4 border-b border-[#eae6df] pb-3 flex items-center gap-1.5">
            <span>✉️</span>
            <span>1:1 문의 접수하기</span>
          </h2>

          {submitted ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-[#3b483a]/10 text-[#3b483a] flex items-center justify-center text-2xl mx-auto mb-3">
                ✓
              </div>
              <h3 className="text-base font-bold text-[#1a1a1a] mb-1">
                문의가 정상적으로 접수되었습니다
              </h3>
              <p className="text-xs text-[#5e605d] mb-4">
                작성해주신 이메일({email})로 빠르게 답변을 드리겠습니다.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setContent("");
                }}
                className="btn-editorial-outline text-xs py-2.5 px-4 font-bold"
              >
                추가 문의 작성하기
              </button>
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
      </main>
    </div>
  );
}
