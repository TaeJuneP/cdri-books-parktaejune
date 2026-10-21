"use client";

import { useEffect, useId, useRef, useState } from "react";

import { ChevronDownIcon } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

import type { Book } from "../types";
import { formatPrice, getSellingPrice, hasDiscount } from "../utils/price";
import { BookCover } from "./book-cover";

interface BookItemProps {
  book: Book;
}

/** 도서 목록의 한 행. 상세보기로 펼쳐 책 소개와 가격 정보를 볼 수 있다 */
export function BookItem({ book }: BookItemProps) {
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
        <div id={detailId} className="flex pt-6 pr-4 pb-10 pl-[54px]">
          <BookCover src={book.thumbnail} title={book.title} width={210} height={280} />
          <div className="ml-8 min-w-0 flex-1 pt-5">
            <div className="flex items-center gap-4">
              <h3 className="text-title3 text-text-primary">{book.title}</h3>
              <p className="text-body2 text-text-subtitle">{book.authors.join(", ")}</p>
            </div>
            <h4 className="mt-4 text-body2-bold text-text-primary">책 소개</h4>
            <p className="mt-3 max-w-[360px] text-small whitespace-pre-line text-text-primary">
              {book.contents || "책 소개가 없습니다."}
            </p>
          </div>
          <div className="ml-12 flex w-[240px] shrink-0 flex-col items-end justify-between">
            {toggleButton}
            <div className="flex w-full flex-col items-end gap-7">
              <PriceDetail book={book} />
              <PurchaseLink book={book} className="w-full" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[100px] items-center pr-4 pl-12">
          <BookCover src={book.thumbnail} title={book.title} width={48} height={68} />
          <div className="ml-12 flex min-w-0 flex-1 items-center gap-4">
            <h3 className="truncate text-title3 text-text-primary">{book.title}</h3>
            <p className="shrink-0 text-body2 text-text-secondary">{book.authors.join(", ")}</p>
          </div>
          <p className="ml-6 shrink-0 text-title3 text-text-primary">
            {formatPrice(getSellingPrice(book))}
          </p>
          <div className="ml-14 flex shrink-0 gap-2">
            <PurchaseLink book={book} />
            {toggleButton}
          </div>
        </div>
      )}
    </li>
  );
}

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
