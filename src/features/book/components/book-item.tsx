"use client";

import { useId, useState } from "react";

import { ChevronDownIcon } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

import type { Book } from "../types";
import { formatPrice, getSellingPrice } from "../utils/price";
import { BookCover } from "./book-cover";

interface BookItemProps {
  book: Book;
}

/** 도서 목록의 한 행. 상세보기로 펼쳐 책 소개와 가격 정보를 볼 수 있다 */
export function BookItem({ book }: BookItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailId = useId();

  const toggleButton = (
    <Button
      variant="secondary"
      aria-expanded={isExpanded}
      aria-controls={detailId}
      onClick={() => setIsExpanded((prev) => !prev)}
    >
      상세보기
      <ChevronDownIcon
        className={cn("text-icon transition-transform", isExpanded && "rotate-180")}
      />
    </Button>
  );

  return (
    <li className="border-b border-divider">
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
    </li>
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
