"use client";

import { useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { ResultCount } from "@/components/ui/result-count";
import { BookItem } from "@/features/book/components/book-item";
import { BookListSkeleton } from "@/features/book/components/book-list-skeleton";
import { BOOK_PAGE_SIZE } from "@/features/book/constants";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

import { useWishlistHydrated, useWishlistStore } from "../stores/wishlist-store";
import { renderWishButton } from "./wish-button";

/** 내가 찜한 책 목록. 저장된 스냅샷을 10개씩 나눠 보여준다 (시안: 페이지당 10개) */
export function WishlistContent() {
  const isHydrated = useWishlistHydrated();
  const items = useWishlistStore((state) => state.items);
  const [visibleCount, setVisibleCount] = useState(BOOK_PAGE_SIZE);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  // 데이터는 이미 모두 로컬에 있지만, 한 번에 렌더링할 행 수를 제한해 첫 화면을 가볍게 유지한다
  const sentinelRef = useIntersectionObserver<HTMLDivElement>({
    onIntersect: () => setVisibleCount((count) => count + BOOK_PAGE_SIZE),
    enabled: isHydrated && hasMore,
  });

  return (
    <section aria-labelledby="wishlist-heading" className="mt-3">
      {/* 저장된 목록을 복원하기 전에는 건수를 비워 '0건'이 잠깐 보이지 않게 한다 */}
      <ResultCount id="wishlist-heading" label="찜한 책" count={isHydrated ? items.length : null} />

      {!isHydrated ? (
        <BookListSkeleton label="찜한 책을 불러오는 중" />
      ) : items.length === 0 ? (
        <EmptyState message="찜한 책이 없습니다." />
      ) : (
        <>
          <ul className="mt-9">
            {visibleItems.map((book) => (
              <BookItem key={book.id} book={book} coverAction={renderWishButton} />
            ))}
          </ul>
          <div ref={sentinelRef} aria-hidden />
        </>
      )}
    </section>
  );
}
