import { QueryClient } from "@tanstack/react-query";

const ONE_MINUTE = 60 * 1000;

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 도서 정보는 자주 바뀌지 않으므로, 같은 검색을 다시 해도 1분간은 캐시를 그대로 사용
        staleTime: ONE_MINUTE,
        // 탭 전환마다 재요청할 만큼 실시간성이 필요한 데이터가 아님
        refetchOnWindowFocus: false,
        // 일시적 네트워크 오류만 한 번 재시도하고, 그 이상은 에러 UI로 안내
        retry: 1,
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
