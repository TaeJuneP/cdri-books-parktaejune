"use client";

import { useEffect } from "react";

import { useSearchCondition } from "../hooks/use-search-condition";
import { useLastSearchStore } from "../stores/last-search-store";
import { useSearchHistoryStore } from "../stores/search-history-store";
import type { SearchCondition } from "../types";
import { toSearchHref } from "../utils/search-href";
import { DetailSearch } from "./detail-search";
import { SearchBar } from "./search-bar";
import { SearchResults } from "./search-results";

/** 도서 검색 화면의 클라이언트 영역 (검색창 + 상세검색 + 결과) */
export function BookSearch() {
  const { condition, search } = useSearchCondition();
  const history = useSearchHistoryStore((state) => state.keywords);
  const addKeyword = useSearchHistoryStore((state) => state.addKeyword);
  const removeKeyword = useSearchHistoryStore((state) => state.removeKeyword);
  const setLastSearchHref = useLastSearchStore((state) => state.setHref);

  // 현재 검색 조건을 기억해 GNB '도서 검색' 탭으로 돌아올 때 같은 결과를 보여준다.
  // 로고로 첫 화면에 오면 조건이 비어 기억도 초기화된다
  useEffect(() => {
    setLastSearchHref(toSearchHref(condition));
  }, [condition, setLastSearchHref]);

  // 전체 검색과 상세검색은 동시에 진행할 수 없다 (시안 요구사항).
  // 검색 조건은 URL 하나에만 저장되므로, 한쪽으로 검색하면 다른 쪽 조건은 자연히 초기화된다.
  const detailCondition = condition.target
    ? { query: condition.query, target: condition.target }
    : undefined;

  const handleSearch = (query: string) => {
    addKeyword(query);
    // target 없이 검색 → 상세검색 조건 초기화
    search({ query });
  };

  const handleDetailSearch = (next: Required<SearchCondition>) => {
    search(next);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 md:gap-4">
        <SearchBar
          // 상세검색 중에는 전체 검색창을 비운다
          defaultQuery={detailCondition ? "" : condition.query}
          history={history}
          onSearch={handleSearch}
          onRemoveHistory={removeKeyword}
        />
        <DetailSearch currentCondition={detailCondition} onSearch={handleDetailSearch} />
      </div>
      <SearchResults condition={condition} />
    </div>
  );
}
