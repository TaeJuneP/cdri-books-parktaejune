import { fetchJson } from "@/lib/http";

import type { BookSearchResult, SearchTarget } from "../types";

export interface SearchBooksParams {
  query: string;
  /** 지정하지 않으면 전체 검색 */
  target?: SearchTarget;
  page: number;
}

/**
 * BFF(/api/books)를 통해 도서를 검색한다.
 * signal은 React Query가 전달하며, 검색어가 바뀌면 이전 요청을 취소하는 데 쓰인다.
 */
export function searchBooks(
  { query, target, page }: SearchBooksParams,
  signal?: AbortSignal,
): Promise<BookSearchResult> {
  const searchParams = new URLSearchParams({ query, page: String(page) });
  if (target) searchParams.set("target", target);

  return fetchJson<BookSearchResult>(`/api/books?${searchParams}`, { signal });
}
