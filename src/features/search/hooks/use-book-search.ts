"use client";

import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import { searchBooks } from "@/features/book/api/search-books";
import { KAKAO_MAX_PAGE } from "@/features/book/constants";
import { bookKeys } from "@/features/book/query-keys";
import type { BookSearchResult } from "@/features/book/types";
import { uniqueBooksById } from "@/features/book/utils/unique-books";

import type { SearchCondition } from "../types";

// 컴포넌트 밖에 두어 참조가 고정되므로, 데이터가 바뀔 때만 다시 계산된다
function selectBooks(data: InfiniteData<BookSearchResult, number>) {
  return {
    // 페이지를 넘나드는 중복도 있으므로 모든 페이지를 합친 뒤 중복을 제거한다
    books: uniqueBooksById(data.pages.flatMap((page) => page.books)),
    totalCount: data.pages[0]?.totalCount ?? 0,
  };
}

/** 검색 조건으로 도서를 페이지(10개) 단위로 이어서 불러온다 */
export function useBookSearch({ query, target }: SearchCondition) {
  return useInfiniteQuery({
    queryKey: bookKeys.search({ query, target }),
    queryFn: ({ pageParam, signal }) => searchBooks({ query, target, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      // 마지막 페이지이거나 카카오 API의 최대 페이지(50)에 도달하면 더 불러오지 않는다
      lastPage.isEnd || allPages.length >= KAKAO_MAX_PAGE ? undefined : allPages.length + 1,
    select: selectBooks,
    // 검색어가 없으면 요청하지 않는다 (첫 진입 화면)
    enabled: query.length > 0,
  });
}
