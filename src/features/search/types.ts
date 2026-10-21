import type { SearchTarget } from "@/features/book/types";

/** 검색 조건. target이 없으면 전체 검색, 있으면 상세검색 */
export interface SearchCondition {
  query: string;
  target?: SearchTarget;
}
