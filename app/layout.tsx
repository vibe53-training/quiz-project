import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 퀴즈 생성기",
  description: "과목과 단원명을 입력하면 AI가 객관식·주관식 문제를 출제합니다.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
