import type { Book } from "../types";

/**
 * 같은 id(ISBN)의 도서는 처음 나온 것만 남긴다.
 * 카카오 DB에는 ISBN이 같은데 등록(bookId)만 다른 중복 문서가 있어
 * (예: '가' 검색 100건 중 4건), 같은 페이지 또는 다른 페이지에서 같은 책이 반복될 수 있다.
 */
export function uniqueBooksById(books: Book[]): Book[] {
  const seen = new Set<string>();
  return books.filter((book) => {
    if (seen.has(book.id)) return false;
    seen.add(book.id);
    return true;
  });
}
