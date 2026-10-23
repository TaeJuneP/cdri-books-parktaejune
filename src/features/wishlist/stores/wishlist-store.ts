import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Book } from "@/features/book/types";

import { isWished, toggleWishlistItem } from "../utils/wishlist";

interface WishlistState {
  /** 찜한 도서 (최근 찜한 순) */
  items: Book[];
  toggle: (book: Book) => void;
}

/**
 * 찜 목록 저장소. 브라우저를 재시작해도 유지되도록 localStorage에 저장한다.
 * 찜한 시점의 도서 정보를 그대로 보관하므로 찜 목록 화면은 API를 다시 호출하지 않는다.
 */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      toggle: (book) => set((state) => ({ items: toggleWishlistItem(state.items, book) })),
    }),
    {
      name: "certicos-books:wishlist",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      version: 1,
    },
  ),
);

/** 특정 도서의 찜 여부. boolean만 구독해 다른 책의 찜 상태가 바뀌어도 다시 렌더링되지 않는다 */
export function useIsWished(bookId: string) {
  return useWishlistStore((state) => isWished(state.items, bookId));
}

/**
 * localStorage에서 찜 목록을 복원했는지 여부.
 *
 * 서버는 localStorage를 읽을 수 없어 '찜 0건'으로 렌더링하므로, 브라우저가 첫 렌더에서 바로
 * 저장된 목록을 그리면 hydration 불일치가 발생한다. useSyncExternalStore의 서버 스냅샷을
 * false로 두면 hydration 시점에는 서버와 같은 결과(false)를 쓰고, 직후 실제 값(true)으로
 * 다시 렌더링한다. 복원 전에는 '찜한 책이 없습니다' 대신 로딩 UI를 보여 깜빡임을 막는다.
 */
export function useWishlistHydrated() {
  return useSyncExternalStore(
    (onChange) => useWishlistStore.persist.onFinishHydration(onChange),
    () => useWishlistStore.persist.hasHydrated(),
    () => false,
  );
}
