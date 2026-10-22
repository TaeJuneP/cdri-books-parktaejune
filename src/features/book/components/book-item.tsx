"use client";

import { memo, type ReactNode, useEffect, useId, useRef, useState } from "react";

import { ChevronDownIcon } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

import type { Book } from "../types";
import { formatPrice, getSellingPrice, hasDiscount } from "../utils/price";
import { BookCover } from "./book-cover";

/** 행 버튼: 모바일은 작게, lg 이상은 시안 크기(115×48) */
const ROW_BUTTON_CLASS =
  "h-9 min-w-0 px-3 text-body2 lg:h-12 lg:min-w-[115px] lg:px-5 lg:text-caption";

interface BookItemProps {
  book: Book;
  /**
   * 표지 위에 겹쳐 놓을 요소 (예: 찜하기 버튼). 크기에 맞는 요소를 반환한다.
   * book 기능이 wishlist 기능을 직접 알지 않도록 사용하는 쪽에서 주입한다.
   * memo가 유효하도록 렌더링마다 새로 만들지 않는 고정 함수를 넘긴다.
   */
  coverAction?: (book: Book, size: "sm" | "lg") => ReactNode;
}

/**
 * 도서 목록의 한 행. 상세보기로 펼쳐 책 소개와 가격 정보를 볼 수 있다.
 * 무한 스크롤로 목록이 늘어날 때 이미 그려진 행은 다시 렌더링하지 않도록 memo로 감싼다.
 */
export const BookItem = memo(function BookItem({ book, coverAction }: BookItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const hasToggledRef = useRef(false);

  // 접힘/펼침 레이아웃이 달라 토글 버튼이 새로 그려지므로,
  // 사용자가 토글한 경우 새 버튼으로 포커스를 옮겨 키보드 사용자의 위치를 유지한다
  useEffect(() => {
    if (hasToggledRef.current) toggleRef.current?.focus();
  }, [isExpanded]);

  const toggleButton = (
    <Button
      ref={toggleRef}
      variant="secondary"
      className={ROW_BUTTON_CLASS}
      aria-expanded={isExpanded}
      aria-controls={detailId}
      onClick={() => {
        hasToggledRef.current = true;
        setIsExpanded((prev) => !prev);
      }}
    >
      상세보기
      <ChevronDownIcon
        className={cn("text-icon transition-transform", isExpanded && "rotate-180")}
      />
    </Button>
  );

  return (
    <li className="border-b border-divider">
      {isExpanded ? (
        // 모바일: [표지 | 상세보기] / [책 소개] / [가격·구매하기] 순으로 쌓고,
        // lg 이상: 시안대로 [표지 | 책 소개 | 상세보기·가격·구매하기] 3열.
        // 요소를 화면별로 두 벌 두지 않고 grid 배치만 바꿔, 읽기·포커스 순서를 동일하게 유지한다
        <div
          id={detailId}
          className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-5 py-6 lg:grid-cols-[210px_1fr_240px] lg:grid-rows-[auto_1fr_auto] lg:gap-x-8 lg:gap-y-0 lg:pt-6 lg:pr-4 lg:pb-10 lg:pl-[54px]"
        >
          <div className="relative col-start-1 row-start-1 lg:row-span-3">
            <BookCover src={book.thumbnail} title={book.title} width={210} height={280} />
            {coverAction?.(book, "lg")}
          </div>
          <div className="col-span-2 row-start-2 min-w-0 lg:col-span-1 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:pt-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <h3 className="text-title3 text-text-primary">{book.title}</h3>
              <p className="text-body2 text-text-subtitle">{book.authors.join(", ")}</p>
            </div>
            <h4 className="mt-4 text-body2-bold text-text-primary">책 소개</h4>
            <p className="mt-3 text-small whitespace-pre-line text-text-primary lg:max-w-[360px]">
              {book.contents || "책 소개가 없습니다."}
            </p>
          </div>
          <div className="col-start-2 row-start-1 justify-self-end lg:col-start-3">
            {toggleButton}
          </div>
          <div className="col-span-2 row-start-3 flex flex-col items-end gap-5 lg:col-span-1 lg:col-start-3 lg:gap-7">
            <PriceDetail book={book} />
            <PurchaseLink book={book} className="w-full" />
          </div>
        </div>
      ) : (
        // 모바일: [썸네일 | 제목·저자 / 가격 / 버튼] / lg 이상: 시안대로 한 줄(높이 100px)
        <div className="grid grid-cols-[48px_1fr] items-start gap-x-4 gap-y-2 py-4 lg:flex lg:h-[100px] lg:items-center lg:gap-0 lg:py-0 lg:pr-4 lg:pl-12">
          <div className="relative row-span-3 shrink-0">
            <BookCover src={book.thumbnail} title={book.title} width={48} height={68} />
            {coverAction?.(book, "sm")}
          </div>
          <div className="flex min-w-0 flex-col gap-1 lg:ml-12 lg:flex-1 lg:flex-row lg:items-center lg:gap-4">
            <h3 className="line-clamp-2 text-title3 text-text-primary lg:line-clamp-none lg:truncate">
              {book.title}
            </h3>
            <p className="truncate text-body2 text-text-secondary lg:max-w-[40%] lg:shrink-0">
              {book.authors.join(", ")}
            </p>
          </div>
          <p className="text-title3 text-text-primary lg:ml-6 lg:shrink-0">
            {formatPrice(getSellingPrice(book))}
          </p>
          <div className="flex gap-2 lg:ml-14 lg:shrink-0">
            <PurchaseLink book={book} className={ROW_BUTTON_CLASS} />
            {toggleButton}
          </div>
        </div>
      )}
    </li>
  );
});

/** 원가/할인가. 시안 규칙에 따라 할인가가 없으면 원가만 취소선 없이 표시한다 */
function PriceDetail({ book }: { book: Book }) {
  const discounted = hasDiscount(book);

  return (
    <dl className="grid grid-cols-[auto_auto] items-center justify-end gap-x-2 gap-y-3">
      <dt className="text-right text-small text-text-subtitle">원가</dt>
      <dd
        className={cn(
          "text-right text-title3 text-text-primary",
          discounted && "font-medium line-through",
        )}
      >
        {formatPrice(book.price)}
      </dd>
      {discounted && book.salePrice !== null && (
        <>
          <dt className="text-right text-small text-text-subtitle">할인가</dt>
          <dd className="text-right text-title3 text-text-primary">
            {formatPrice(book.salePrice)}
          </dd>
        </>
      )}
    </dl>
  );
}

function PurchaseLink({ book, className }: { book: Book; className?: string }) {
  return (
    // 시안: 새 탭에서 도서 상세 페이지(다음 책)로 이동
    <a
      href={book.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${book.title} 구매하기 (새 탭)`}
      className={cn(buttonVariants({ variant: "primary" }), className)}
    >
      구매하기
    </a>
  );
}
