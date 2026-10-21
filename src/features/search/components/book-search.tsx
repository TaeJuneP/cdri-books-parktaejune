"use client";

import { useSearchCondition } from "../hooks/use-search-condition";
import { SearchBar } from "./search-bar";

/** 도서 검색 화면의 클라이언트 영역 (검색창 + 결과) */
export function BookSearch() {
  const { condition, search } = useSearchCondition();

  return (
    <div className="mt-6">
      <SearchBar defaultQuery={condition.query} onSearch={(query) => search({ query })} />
    </div>
  );
}
