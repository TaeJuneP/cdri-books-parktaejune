"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BookItem } from "@/features/book/components/book-item";

import { useBookSearch } from "../hooks/use-book-search";
import type { SearchCondition } from "../types";

interface SearchResultsProps {
  condition: SearchCondition;
}

export function SearchResults({ condition }: SearchResultsProps) {
  const { data, status, error, refetch, isFetching } = useBookSearch(condition);
  const totalCount = data?.totalCount ?? 0;

  return (
    <section aria-labelledby="search-result-heading" className="mt-6">
      <h2 id="search-result-heading" className="flex gap-4 text-caption text-text-primary">
        도서 검색 결과
        <span>
          총 <span className="text-primary">{totalCount.toLocaleString("ko-KR")}</span>건
        </span>
      </h2>

      {/* 검색어가 없는 첫 진입 화면도 시안과 같이 '결과 없음'으로 안내한다 */}
      {!condition.query ? (
        <EmptyState message="검색된 결과가 없습니다." />
      ) : status === "pending" ? (
        <BookListSkeleton />
      ) : status === "error" ? (
        <div role="alert" className="flex flex-col items-center gap-4 py-[120px]">
          <p className="text-caption text-text-secondary">{error.message}</p>
          <Button onClick={() => refetch()} disabled={isFetching}>
            다시 시도
          </Button>
        </div>
      ) : data.books.length === 0 ? (
        <EmptyState message="검색된 결과가 없습니다." />
      ) : (
        <ul className="mt-9">
          {data.books.map((book) => (
            <BookItem key={book.id} book={book} />
          ))}
        </ul>
      )}
    </section>
  );
}

/** 첫 페이지 로딩 중 행 레이아웃과 같은 크기의 자리 표시자를 보여 화면 흔들림을 줄인다 */
function BookListSkeleton() {
  return (
    <ul className="mt-9" aria-busy="true" aria-label="검색 결과를 불러오는 중">
      {Array.from({ length: 5 }, (_, index) => (
        <li key={index} className="flex h-[100px] items-center border-b border-divider pr-4 pl-12">
          <div className="h-[68px] w-12 animate-pulse bg-light-gray" />
          <div className="ml-12 h-5 w-64 animate-pulse rounded bg-light-gray" />
        </li>
      ))}
    </ul>
  );
}
