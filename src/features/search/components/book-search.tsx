"use client";

import { useSearchCondition } from "../hooks/use-search-condition";
import { useSearchHistoryStore } from "../stores/search-history-store";
import { SearchBar } from "./search-bar";
import { SearchResults } from "./search-results";

/** 도서 검색 화면의 클라이언트 영역 (검색창 + 결과) */
export function BookSearch() {
  const { condition, search } = useSearchCondition();
  const history = useSearchHistoryStore((state) => state.keywords);
  const addKeyword = useSearchHistoryStore((state) => state.addKeyword);
  const removeKeyword = useSearchHistoryStore((state) => state.removeKeyword);

  const handleSearch = (query: string) => {
    addKeyword(query);
    search({ query });
  };

  return (
    <div className="mt-6">
      <SearchBar
        defaultQuery={condition.query}
        history={history}
        onSearch={handleSearch}
        onRemoveHistory={removeKeyword}
      />
      <SearchResults condition={condition} />
    </div>
  );
}
