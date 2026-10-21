import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// 가변 폰트라 weight 지정 없이 전체 굵기를 사용할 수 있다.
// 한글 글리프는 unicode-range로 분할되어 필요한 조각만 내려받는다.
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CERTICOS BOOKS",
  description: "카카오 책 검색 API 기반 도서 검색 서비스",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
