import type { SearchTarget } from "@/features/book/types";

/** 상세검색 조건 선택지 (시안 순서) */
export const SEARCH_TARGET_OPTIONS: { value: SearchTarget; label: string }[] = [
  { value: "title", label: "제목" },
  { value: "person", label: "저자명" },
  { value: "publisher", label: "출판사" },
];
