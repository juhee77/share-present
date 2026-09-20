"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "ko" | "en";

interface Translations {
  [key: string]: {
    ko: string;
    en: string;
  };
}

const translations: Translations = {
  // Navigation
  "nav.create": {
    ko: "선물 생성",
    en: "Create Gift",
  },
  "nav.dashboard": {
    ko: "내 선물 보관함",
    en: "My Gifts",
  },
  "nav.support": {
    ko: "고객센터",
    en: "Support Center",
  },

  // Home / Curation
  "home.curated_tag": {
    ko: "EDITORIAL GIFTING",
    en: "EDITORIAL GIFTING",
  },
  "home.hero_title_1": {
    ko: "소중한 분을 위한",
    en: "Thoughtful Gifts,",
  },
  "home.hero_title_2": {
    ko: "감도 높은 선물 큐레이션",
    en: "Curated with Precision",
  },
  "home.hero_desc": {
    ko: "보내시는 분의 예산 안에서 받는 분의 취향을 담아 고르는 프리미엄 모바일 선물 플랫폼",
    en: "A refined mobile gift experience letting recipients choose within your thoughtful budget.",
  },
  "home.budget_label": {
    ko: "선물 예산 범위 설정",
    en: "Set Budget Range",
  },
  "home.occasion_label": {
    ko: "테마 및 상황별 추천",
    en: "Occasions & Themes",
  },
  "home.sort_label": {
    ko: "정렬 기준",
    en: "Sort By",
  },
  "home.selected_count": {
    ko: "선택된 선물",
    en: "Selected Gifts",
  },
  "home.create_card_btn": {
    ko: "선물 카드 생성하기",
    en: "Create Gift Card",
  },

  // Occasions
  "occasion.all": {
    ko: "전체 테마",
    en: "All Themes",
  },
  "occasion.birthday": {
    ko: "생일 축하",
    en: "Birthday",
  },
  "occasion.housewarming": {
    ko: "집들이/이사",
    en: "Housewarming",
  },
  "occasion.wedding": {
    ko: "결혼/약혼",
    en: "Wedding",
  },
  "occasion.promotion": {
    ko: "취업/승진",
    en: "Career & Success",
  },
  "occasion.gratitude": {
    ko: "감사/명절",
    en: "Gratitude & Holiday",
  },
  "occasion.luxury": {
    ko: "프리미엄 럭셔리",
    en: "Luxury Edition",
  },

  // Sort options
  "sort.popular": {
    ko: "인기순",
    en: "Most Popular",
  },
  "sort.price_asc": {
    ko: "낮은 가격순",
    en: "Price: Low to High",
  },
  "sort.price_desc": {
    ko: "높은 가격순",
    en: "Price: High to Low",
  },
  "sort.name_asc": {
    ko: "상품명 가나다순",
    en: "Alphabetical",
  },

  // Common UI
  "common.select": {
    ko: "선택",
    en: "Select",
  },
  "common.selected": {
    ko: "선택됨",
    en: "Selected",
  },
  "common.close": {
    ko: "닫기",
    en: "Close",
  },
  "common.cancel": {
    ko: "취소",
    en: "Cancel",
  },
  "common.confirm": {
    ko: "확인",
    en: "Confirm",
  },
  "common.copy_link": {
    ko: "링크 복사",
    en: "Copy Link",
  },
  "common.link_copied": {
    ko: "링크가 클립보드에 복사되었습니다.",
    en: "Link copied to clipboard.",
  },
  "common.currency": {
    ko: "원",
    en: "KRW",
  },
  "common.footer_desc": {
    ko: "받는 사람의 취향을 온전히 존중하는 프라이빗 기프팅 서비스",
    en: "A private gifting experience respecting the recipient's refined taste.",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "sharepresent_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ko");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "ko" || saved === "en") {
        setLanguageState(saved);
      } else {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith("en")) {
          setLanguageState("en");
        }
      }
    } catch {
      // Ignore localStorage access errors
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === "ko" ? "en" : "ko";
    setLanguage(nextLang);
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry["ko"] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
