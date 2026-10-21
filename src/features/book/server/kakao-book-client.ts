import "server-only";

import { BOOK_PAGE_SIZE } from "../constants";
import type { SearchTarget } from "../types";
import type { KakaoBookSearchResponse } from "./kakao-book-mapper";

const KAKAO_BOOK_SEARCH_URL = "https://dapi.kakao.com/v3/search/book";

export class KakaoApiError extends Error {
  constructor(public readonly status: number) {
    super(`Kakao book search failed with status ${status}`);
    this.name = "KakaoApiError";
  }
}

export class MissingApiKeyError extends Error {
  constructor() {
    super("KAKAO_REST_API_KEY is not set");
    this.name = "MissingApiKeyError";
  }
}

interface SearchKakaoBooksParams {
  query: string;
  target?: SearchTarget;
  page: number;
}

/**
 * 카카오 책 검색 API를 호출한다.
 * API 키는 서버 환경변수에서만 읽으며, 이 모듈은 클라이언트 번들에 포함될 수 없다(server-only).
 */
export async function searchKakaoBooks({
  query,
  target,
  page,
}: SearchKakaoBooksParams): Promise<KakaoBookSearchResponse> {
  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) throw new MissingApiKeyError();

  const url = new URL(KAKAO_BOOK_SEARCH_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("size", String(BOOK_PAGE_SIZE));
  if (target) url.searchParams.set("target", target);

  const response = await fetch(url, {
    headers: { Authorization: `KakaoAK ${apiKey}` },
  });

  if (!response.ok) throw new KakaoApiError(response.status);
  return response.json();
}
