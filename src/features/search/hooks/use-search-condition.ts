"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { isSearchTarget } from "@/features/book/constants";

import type { SearchCondition } from "../types";
import { toSearchHref } from "../utils/search-href";

/**
 * 검색 조건을 URL query(?query=&target=)와 동기화한다.
 * URL을 단일 진실 공급원으로 두어 새로고침/뒤로가기/링크 공유 시에도 검색 상태가 유지된다.
 */
export function useSearchCondition() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("query")?.trim() ?? "";
  const rawTarget = searchParams.get("target");
  // URL은 사용자가 직접 수정할 수 있으므로 지원하지 않는 target은 무시한다
  const target = rawTarget && isSearchTarget(rawTarget) ? rawTarget : undefined;

  const condition = useMemo<SearchCondition>(() => ({ query, target }), [query, target]);

  const search = useCallback(
    (next: SearchCondition) => {
      // push로 이력을 남겨 뒤로가기 시 이전 검색으로 돌아갈 수 있게 한다
      router.push(toSearchHref(next));
    },
    [router],
  );

  return { condition, search };
}
