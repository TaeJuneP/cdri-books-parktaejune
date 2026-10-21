import type { SearchTarget } from "./types";

/** 한 번에 불러오는 도서 수 (시안: 페이지당 10개) */
export const BOOK_PAGE_SIZE = 10;

/** 카카오 API가 허용하는 최대 페이지 번호 */
export const KAKAO_MAX_PAGE = 50;

export const SEARCH_TARGETS = ["title", "person", "publisher"] as const satisfies SearchTarget[];
