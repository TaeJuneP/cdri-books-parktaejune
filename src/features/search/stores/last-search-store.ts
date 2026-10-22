import { create } from "zustand";

import { SEARCH_PATH } from "../utils/search-href";

interface LastSearchState {
  /** 마지막으로 본 검색 결과의 URL. GNB '도서 검색' 탭이 이 주소로 이동해 결과를 유지한다 */
  href: string;
  setHref: (href: string) => void;
}

/**
 * 탭 이동 후 돌아왔을 때 검색 결과를 유지하기 위한 저장소.
 * localStorage에 저장하면 서버가 렌더링한 링크(/)와 브라우저의 링크가 달라져
 * hydration 불일치가 생기므로, 메모리에만 보관한다. (새로고침하면 첫 화면부터 시작)
 */
export const useLastSearchStore = create<LastSearchState>()((set) => ({
  href: SEARCH_PATH,
  setHref: (href) => set({ href }),
}));
