import type { SearchTarget } from "./types";

/**
 * 도서 쿼리 키 팩토리. 키를 한 곳에서 만들어 오타로 인한 캐시 불일치를 막고,
 * bookKeys.all 단위로 관련 캐시를 한 번에 무효화할 수 있게 한다.
 */
export const bookKeys = {
  all: ["books"] as const,
  search: (condition: { query: string; target?: SearchTarget }) =>
    [...bookKeys.all, "search", condition] as const,
};
