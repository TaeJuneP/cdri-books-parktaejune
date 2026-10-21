import type { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  children?: ReactNode;
}

/** 시안의 본문 영역: 최대 폭 960px, 헤더 아래 80px 여백, 페이지 제목(Title2) */
export function PageContainer({ title, children }: PageContainerProps) {
  return (
    <main className="mx-auto w-full max-w-[960px] px-4 pt-10 pb-20 md:pt-20 lg:px-0">
      <h1 className="text-title2 text-text-title">{title}</h1>
      {children}
    </main>
  );
}
