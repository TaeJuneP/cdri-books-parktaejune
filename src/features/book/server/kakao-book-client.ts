import "server-only";

import { BOOK_PAGE_SIZE } from "../constants";
import type { SearchTarget } from "../types";
import type { KakaoBookSearchResponse } from "./kakao-book-mapper";

const KAKAO_BOOK_SEARCH_URL = "https://dapi.kakao.com/v3/search/book";

/** 카카오가 응답하지 않을 때 사용자가 로딩 화면에 무한정 머물지 않도록 하는 제한 시간 */
const KAKAO_TIMEOUT_MS = 5000;

export class KakaoApiError extends Error {
  constructor(public readonly status: number) {
    super(`Kakao book search failed with status ${status}`);
    this.name = "KakaoApiError";
  }
}

/** 제한 시간 안에 카카오가 응답하지 않음 */
export class KakaoTimeoutError extends Error {
  constructor() {
    super(`Kakao book search timed out after ${KAKAO_TIMEOUT_MS}ms`);
    this.name = "KakaoTimeoutError";
  }
}

/** 카카오 서버에 연결하지 못함 (DNS 실패, 연결 끊김 등) */
export class KakaoNetworkError extends Error {
  constructor(cause: unknown) {
    super("Failed to connect to Kakao book search", { cause });
    this.name = "KakaoNetworkError";
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

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Authorization: `KakaoAK ${apiKey}` },
      signal: AbortSignal.timeout(KAKAO_TIMEOUT_MS),
    });
  } catch (error) {
    // 응답을 받지 못한 경우는 원인별로 구분해, Route Handler가 알맞은 상태 코드로 안내하게 한다
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new KakaoTimeoutError();
    }
    throw new KakaoNetworkError(error);
  }

  if (!response.ok) throw new KakaoApiError(response.status);
  return response.json();
}
