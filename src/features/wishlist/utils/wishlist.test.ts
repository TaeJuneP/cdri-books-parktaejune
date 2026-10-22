import { describe, expect, it } from "vitest";

import type { Book } from "@/features/book/types";

import { isWished, toggleWishlistItem } from "./wishlist";

function createBook(id: string, overrides: Partial<Book> = {}): Book {
  return {
    id,
    title: `책 ${id}`,
    authors: ["저자"],
    publisher: "출판사",
    contents: "",
    price: 10000,
    salePrice: 9000,
    thumbnail: null,
    url: `https://search.daum.net/?bookId=${id}`,
    ...overrides,
  };
}

describe("toggleWishlistItem", () => {
  it("찜하지 않은 책은 맨 앞에 추가한다 (최근 찜한 순)", () => {
    const result = toggleWishlistItem([createBook("1")], createBook("2"));
    expect(result.map((book) => book.id)).toEqual(["2", "1"]);
  });

  it("이미 찜한 책은 목록에서 제거한다", () => {
    const result = toggleWishlistItem([createBook("1"), createBook("2")], createBook("1"));
    expect(result.map((book) => book.id)).toEqual(["2"]);
  });

  it("찜한 시점의 도서 정보를 보관해, 원본 객체가 바뀌어도 영향받지 않는다", () => {
    const book = createBook("1", { salePrice: 9000 });
    const [saved] = toggleWishlistItem([], book);

    book.salePrice = 5000;

    expect(saved?.salePrice).toBe(9000);
  });

  it("원본 배열을 변경하지 않는다", () => {
    const items = [createBook("1")];
    toggleWishlistItem(items, createBook("2"));
    expect(items).toHaveLength(1);
  });
});

describe("isWished", () => {
  it("id로 찜 여부를 판단한다", () => {
    const items = [createBook("1")];
    expect(isWished(items, "1")).toBe(true);
    expect(isWished(items, "2")).toBe(false);
  });
});
