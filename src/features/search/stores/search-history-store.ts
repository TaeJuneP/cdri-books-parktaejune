import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { addSearchKeyword, removeSearchKeyword } from "../utils/search-history";

interface SearchHistoryState {
  keywords: string[];
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;
}

/**
 * 검색 기록 저장소.
 * 브라우저를 재시작해도 유지되어야 하므로(시안 요구사항) localStorage에 저장한다.
 * 서버 상태가 아닌 순수 클라이언트 상태라 React Query 대신 Zustand로 관리한다.
 */
export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      keywords: [],
      addKeyword: (keyword) =>
        set((state) => ({ keywords: addSearchKeyword(state.keywords, keyword) })),
      removeKeyword: (keyword) =>
        set((state) => ({ keywords: removeSearchKeyword(state.keywords, keyword) })),
    }),
    {
      name: "certicos-books:search-history",
      storage: createJSONStorage(() => localStorage),
      // 함수는 저장하지 않고 데이터만 저장한다
      partialize: (state) => ({ keywords: state.keywords }),
      // 저장 형식이 바뀌면 version을 올리고 migrate로 이전 데이터를 변환한다
      version: 1,
    },
  ),
);
