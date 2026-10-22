import type { Book } from "@/features/book/types";

/**
 * 찜 상태를 토글한다.
 * - 이미 찜한 책이면 목록에서 제거
 * - 아니면 찜한 시점의 도서 정보(스냅샷)를 맨 앞에 추가해 최근 찜한 순서로 보여준다
 *   (시안: 찜한 시점의 데이터를 보관하므로 이후 API 결과와 다를 수 있음)
 */
export function toggleWishlistItem(items: readonly Book[], book: Book): Book[] {
  return isWished(items, book.id)
    ? items.filter((item) => item.id !== book.id)
    : [{ ...book }, ...items];
}

export function isWished(items: readonly Book[], bookId: string): boolean {
  return items.some((item) => item.id === bookId);
}
