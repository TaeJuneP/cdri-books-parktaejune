import { type NextRequest, NextResponse } from "next/server";

import { isSearchTarget, KAKAO_MAX_PAGE } from "@/features/book/constants";
import {
  KakaoApiError,
  KakaoNetworkError,
  KakaoTimeoutError,
  MissingApiKeyError,
  searchKakaoBooks,
} from "@/features/book/server/kakao-book-client";
import { toBookSearchResult } from "@/features/book/server/kakao-book-mapper";

function errorResponse(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

/**
 * GET /api/books?query=&target=&page=
 * 브라우저 대신 카카오 API를 호출하는 BFF. API 키가 클라이언트에 노출되지 않는다.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query")?.trim() ?? "";
  const target = searchParams.get("target");
  const page = Number(searchParams.get("page") ?? "1");

  if (!query) return errorResponse("검색어를 입력해 주세요.", 400);
  if (target !== null && !isSearchTarget(target)) {
    return errorResponse("지원하지 않는 검색 조건입니다.", 400);
  }
  if (!Number.isInteger(page) || page < 1 || page > KAKAO_MAX_PAGE) {
    return errorResponse(`page는 1~${KAKAO_MAX_PAGE} 사이의 정수여야 합니다.`, 400);
  }

  try {
    const response = await searchKakaoBooks({ query, target: target ?? undefined, page });
    return NextResponse.json(toBookSearchResult(response));
  } catch (error) {
    if (error instanceof MissingApiKeyError) {
      console.error(error.message);
      return errorResponse("서버 설정 오류로 검색할 수 없습니다.", 500);
    }
    if (error instanceof KakaoApiError) {
      console.error(error.message);
      // 호출량 초과는 그대로 알려 클라이언트가 잠시 후 재시도할 수 있게 한다
      if (error.status === 429) {
        return errorResponse("요청이 많아 잠시 후 다시 시도해 주세요.", 429);
      }
      return errorResponse("도서 검색 서비스에 일시적인 문제가 발생했습니다.", 502);
    }
    if (error instanceof KakaoTimeoutError) {
      console.error(error.message);
      return errorResponse("도서 검색 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", 504);
    }
    if (error instanceof KakaoNetworkError) {
      console.error(error.message, error.cause);
      return errorResponse("도서 검색 서비스에 일시적인 문제가 발생했습니다.", 502);
    }
    throw error;
  }
}
