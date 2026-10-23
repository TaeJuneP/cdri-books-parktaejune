import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "./http";

const ONE_MINUTE = 60 * 1000;
const MAX_RETRY_COUNT = 1;

/**
 * 실패한 요청을 다시 보낼지 판단한다.
 * - 4xx(잘못된 검색 조건 등)는 다시 보내도 결과가 같으므로 재시도하지 않는다
 * - 단, 429(호출량 초과)는 잠시 뒤 성공할 수 있어 재시도한다
 * - 5xx, 네트워크 오류처럼 일시적일 수 있는 실패는 한 번만 재시도한다
 */
export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
    if (error.status !== 429) return false;
  }
  return failureCount < MAX_RETRY_COUNT;
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 도서 정보는 자주 바뀌지 않으므로, 같은 검색을 다시 해도 1분간은 캐시를 그대로 사용
        staleTime: ONE_MINUTE,
        // 탭 전환마다 재요청할 만큼 실시간성이 필요한 데이터가 아님
        refetchOnWindowFocus: false,
        retry: shouldRetryQuery,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  // 서버: 요청 간 캐시가 섞이지 않도록 매번 새로 생성
  if (typeof window === "undefined") return createQueryClient();
  // 브라우저: 리렌더링되어도 캐시가 유지되도록 하나를 재사용
  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}
