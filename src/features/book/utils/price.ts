import type { Book } from "../types";

const priceFormatter = new Intl.NumberFormat("ko-KR");

/** 13300 → "13,300원" */
export function formatPrice(price: number): string {
  return `${priceFormatter.format(price)}원`;
}

/** 목록에 보여줄 실제 판매가. 할인가가 있으면 할인가, 없으면 정가 */
export function getSellingPrice(book: Pick<Book, "price" | "salePrice">): number {
  return book.salePrice ?? book.price;
}

/** 할인가 노출 여부. 할인가가 없거나 정가와 같으면 할인으로 보지 않는다 */
export function hasDiscount(book: Pick<Book, "price" | "salePrice">): boolean {
  return book.salePrice !== null && book.salePrice < book.price;
}
