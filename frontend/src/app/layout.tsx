import type { Metadata, Viewport } from "next";
import { Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const pretendard = localFont({
  src: "../fonts/pretendard/variable/woff2/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
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
    <html lang="ko" className={`${playfair.variable} ${pretendard.variable}`}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
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
