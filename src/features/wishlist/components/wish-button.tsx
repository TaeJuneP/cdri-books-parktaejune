"use client";

import { HeartIcon } from "@/components/icons";
import type { Book } from "@/features/book/types";
import { cn } from "@/lib/cn";

import { useIsWished, useWishlistStore } from "../stores/wishlist-store";

interface WishButtonProps {
  book: Book;
  /** sm: 목록 썸네일(48px) 위, lg: 상세보기 표지(210px) 위 */
  size: "sm" | "lg";
}

/** 표지 오른쪽 위에 겹쳐 놓는 찜하기(하트) 토글 버튼 */
export function WishButton({ book, size }: WishButtonProps) {
  const isWished = useIsWished(book.id);
  const toggle = useWishlistStore((state) => state.toggle);
  const iconSize = size === "sm" ? 16 : 24;

  return (
    <button
      type="button"
      // 토글 버튼의 상태는 aria-pressed로 전달하고, 이름은 상태와 무관하게 고정한다
      aria-pressed={isWished}
      aria-label={`${book.title} 찜하기`}
      onClick={() => toggle(book)}
      className={cn(
        "absolute flex items-center justify-center rounded-sm transition-transform active:scale-90",
        // 목록 하트(16px)는 최소 터치 크기(WCAG 2.5.8, 24px)보다 작아,
        // 보이는 모양은 그대로 두고 투명한 가상 요소로 누를 수 있는 영역만 4px씩 넓힌다
        "after:absolute after:-inset-1",
        size === "sm" ? "top-0 right-0" : "top-2 right-2",
      )}
    >
      <HeartIcon filled={isWished} width={iconSize} height={iconSize} />
    </button>
  );
}

/** BookItem의 coverAction으로 넘기는 고정 렌더 함수 (렌더링마다 새로 만들지 않아 memo가 유지됨) */
export function renderWishButton(book: Book, size: WishButtonProps["size"]) {
  return <WishButton book={book} size={size} />;
}
