import { describe, expect, it } from "vitest";

import {
  type KakaoBookDocument,
  type KakaoBookSearchResponse,
  toBook,
  toBookSearchResult,
} from "./kakao-book-mapper";

// 실제 API 응답(무라카미 하루키 검색 결과)을 바탕으로 만든 기본 문서
function createDocument(overrides: Partial<KakaoBookDocument> = {}): KakaoBookDocument {
  return {
    title: "노르웨이의 숲",
    contents: "무라카미 하루키의 대표작 『노르웨이의 숲』.",
    url: "https://search.daum.net/search?w=bookpage&bookId=1",
    isbn: "8937434482 9788937434488",
    datetime: "2017-08-07T00:00:00.000+09:00",
    authors: ["무라카미 하루키"],
    publisher: "민음사",
    translators: ["양억관"],
    price: 17000,
    sale_price: 15300,
    thumbnail: "https://search1.kakaocdn.net/thumb/1.jpg",
    status: "정상판매",
    ...overrides,
  };
}

describe("toBook", () => {
  it("카카오 응답 문서를 Book 모델로 변환한다", () => {
    expect(toBook(createDocument())).toEqual({
      id: "9788937434488",
      title: "노르웨이의 숲",
      authors: ["무라카미 하루키"],
      publisher: "민음사",
      contents: "무라카미 하루키의 대표작 『노르웨이의 숲』.",
      price: 17000,
      salePrice: 15300,
      thumbnail: "https://search1.kakaocdn.net/thumb/1.jpg",
      url: "https://search.daum.net/search?w=bookpage&bookId=1",
    });
  });

  describe("할인가", () => {
    it("할인가가 없으면(-1) null로 변환한다", () => {
      expect(toBook(createDocument({ sale_price: -1 })).salePrice).toBeNull();
    });

    it("할인가가 0원이면 유효한 할인가로 유지한다", () => {
      expect(toBook(createDocument({ sale_price: 0 })).salePrice).toBe(0);
    });
  });

  describe("식별자(id)", () => {
    it("ISBN10과 ISBN13이 함께 있으면 ISBN13을 사용한다", () => {
      expect(toBook(createDocument({ isbn: "8937434482 9788937434488" })).id).toBe("9788937434488");
    });

    it("ISBN13 순서가 앞에 있어도 ISBN13을 사용한다", () => {
      expect(toBook(createDocument({ isbn: "9788937434488 8937434482" })).id).toBe("9788937434488");
    });

    it("ISBN10만 있으면 ISBN10을 사용한다", () => {
      expect(toBook(createDocument({ isbn: " 8937434482" })).id).toBe("8937434482");
    });

    it("ISBN이 없으면 상세 URL을 사용한다", () => {
      const document = createDocument({ isbn: "" });
      expect(toBook(document).id).toBe(document.url);
    });
  });

  it("표지 이미지가 빈 문자열이면 null로 변환한다", () => {
    expect(toBook(createDocument({ thumbnail: "" })).thumbnail).toBeNull();
  });
});

describe("toBookSearchResult", () => {
  it("meta 정보와 문서 목록을 검색 결과로 변환한다", () => {
    const response: KakaoBookSearchResponse = {
      meta: { total_count: 779, pageable_count: 779, is_end: false },
      documents: [createDocument(), createDocument({ isbn: "1111111111" })],
    };

    const result = toBookSearchResult(response);

    expect(result.isEnd).toBe(false);
    expect(result.totalCount).toBe(779);
    expect(result.books.map((book) => book.id)).toEqual(["9788937434488", "1111111111"]);
  });
});
