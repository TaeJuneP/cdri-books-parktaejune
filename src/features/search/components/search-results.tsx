"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ResultCount } from "@/components/ui/result-count";
import { BookItem } from "@/features/book/components/book-item";
import { BookListSkeleton } from "@/features/book/components/book-list-skeleton";
import { renderWishButton } from "@/features/wishlist/components/wish-button";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

import { useBookSearch } from "../hooks/use-book-search";
import type { SearchCondition } from "../types";

interface SearchResultsProps {
  condition: SearchCondition;
}

export function SearchResults({ condition }: SearchResultsProps) {
  const {
    data,
    error,
    refetch,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useBookSearch(condition);
  const totalCount = data?.totalCount ?? 0;

  // 다음 페이지 요청이 실패하면 자동 재요청을 멈추고 사용자가 직접 재시도하게 한다
  const sentinelRef = useIntersectionObserver<HTMLDivElement>({
    onIntersect: () => fetchNextPage(),
    enabled: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
  });

  return (
    <section aria-labelledby="search-result-heading" className="mt-6">
      <ResultCount id="search-result-heading" label="도서 검색 결과" count={totalCount} />

      {/* 검색어가 없는 첫 진입 화면도 시안과 같이 '결과 없음'으로 안내한다 */}
      {!condition.query ? (
        <EmptyState message="검색된 결과가 없습니다." />
      ) : data ? (
        // 다음 페이지 요청이 실패하면 status가 'error'가 되지만 이미 받은 목록은 남아 있으므로,
        // status가 아닌 데이터 유무로 분기해 기존 목록을 유지한 채 하단에서만 재시도를 안내한다
        data.books.length === 0 ? (
          <EmptyState message="검색된 결과가 없습니다." />
        ) : (
          <>
            <ul className="mt-9">
              {data.books.map((book) => (
                <BookItem key={book.id} book={book} coverAction={renderWishButton} />
              ))}
            </ul>
            <div ref={sentinelRef} aria-hidden />
            {isFetchingNextPage && (
              <p role="status" className="py-6 text-center text-body2 text-text-subtitle">
                도서를 더 불러오는 중입니다...
              </p>
            )}
            {isFetchNextPageError && (
              <div role="alert" className="flex flex-col items-center gap-3 py-6">
                <p className="text-body2 text-text-secondary">다음 결과를 불러오지 못했습니다.</p>
                <Button variant="secondary" onClick={() => fetchNextPage()}>
                  다시 시도
                </Button>
              </div>
            )}
          </>
        )
      ) : error ? (
        <div role="alert" className="flex flex-col items-center gap-4 py-[120px]">
          <p className="text-caption text-text-secondary">{error.message}</p>
          <Button onClick={() => refetch()} disabled={isFetching}>
            다시 시도
          </Button>
        </div>
      ) : (
        <BookListSkeleton label="검색 결과를 불러오는 중" />
      )}
    </section>
  );
}
