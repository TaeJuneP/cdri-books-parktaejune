import { Suspense } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { BookSearch } from "@/features/search/components/book-search";

export default function SearchPage() {
  return (
    <PageContainer title="도서 검색">
      {/* URL 검색 조건(useSearchParams)을 읽는 영역만 클라이언트에서 렌더링하고,
          헤더와 제목은 정적으로 미리 렌더링된 HTML로 즉시 보여준다 */}
      <Suspense
        fallback={<div className="mt-6 h-[50px] max-w-[480px] rounded-full bg-light-gray" />}
      >
        <BookSearch />
      </Suspense>
    </PageContainer>
  );
}
