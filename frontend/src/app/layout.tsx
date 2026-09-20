import type { Metadata, Viewport } from "next";
import { Playfair_Display, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: "#3b483a",
};

export const metadata: Metadata = {
  title: "SharePresent - 당신을 위한 특별한 선물",
  description: "보내시는 분의 예산 안에서, 받는 분의 취향을 담아 고르는 프리미엄 모바일 선물 플랫폼",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SharePresent",
  },
  openGraph: {
    title: "SharePresent - 프리미엄 큐레이션 선물",
    description: "소중한 분에게 감도 높은 선물 리스트를 제안해보세요.",
    type: "website",
  },
};

import { ToastProvider } from "@/context/ToastContext";
import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${playfair.variable} ${notoSans.variable}`}>
      <body>
        <LanguageProvider>
          <ToastProvider>
            <div className="app-container">{children}</div>
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
