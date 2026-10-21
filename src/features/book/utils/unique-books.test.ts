import { describe, expect, it } from "vitest";

import type { Book } from "../types";
import { uniqueBooksById } from "./unique-books";

function createBook(id: string, url: string): Book {
  return {
    id,
    title: "가",
    authors: [],
    publisher: "인민문학출판사",
    contents: "",
    price: 10000,
    salePrice: null,
    thumbnail: null,
    url,
  };
}

describe("uniqueBooksById", () => {
  it("ISBN이 같은 중복 문서는 처음 나온 것만 남긴다", () => {
    const books = [
      createBook("9787020016600", "https://search.daum.net/?bookId=2773892"),
      createBook("9788937434488", "https://search.daum.net/?bookId=1"),
      createBook("9787020016600", "https://search.daum.net/?bookId=323623"),
    ];

    expect(uniqueBooksById(books).map((book) => book.url)).toEqual([
      "https://search.daum.net/?bookId=2773892",
      "https://search.daum.net/?bookId=1",
    ]);
  });

  it("중복이 없으면 순서를 그대로 유지한다", () => {
    const books = [createBook("1", "a"), createBook("2", "b")];
    expect(uniqueBooksById(books)).toEqual(books);
  });
});
