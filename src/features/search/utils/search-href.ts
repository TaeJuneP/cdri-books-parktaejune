import type { SearchCondition } from "../types";

/** 도서 검색 페이지 경로 */
export const SEARCH_PATH = "/";

/** 검색 조건을 검색 페이지 URL로 만든다. 검색어가 없으면 조건 없는 첫 화면 */
export function toSearchHref({ query, target }: SearchCondition): string {
  const trimmed = query.trim();
  if (!trimmed) return SEARCH_PATH;

  const params = new URLSearchParams({ query: trimmed });
  if (target) params.set("target", target);
  return `${SEARCH_PATH}?${params}`;
}
