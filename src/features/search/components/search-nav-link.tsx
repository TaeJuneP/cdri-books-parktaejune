"use client";

import { NavLink } from "@/components/layout/nav-link";

import { useLastSearchStore } from "../stores/last-search-store";
import { SEARCH_PATH } from "../utils/search-href";

/**
 * GNB '도서 검색' 탭. 마지막으로 본 검색 결과 주소로 이동해, 다른 탭에 다녀와도 결과가 유지된다.
 * 결과 데이터는 React Query 캐시에서 바로 표시되므로 API를 다시 호출하지 않는다.
 */
export function SearchNavLink() {
  const href = useLastSearchStore((state) => state.href);

  return (
    <NavLink href={href} activePath={SEARCH_PATH}>
      도서 검색
    </NavLink>
  );
}
