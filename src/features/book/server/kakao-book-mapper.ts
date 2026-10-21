import type { Book, BookSearchResult } from "../types";

/** 카카오 책 검색 API 응답의 문서 단위 (https://developers.kakao.com/docs/latest/ko/daum-search/dev-guide#search-book) */
export interface KakaoBookDocument {
  title: string;
  contents: string;
  url: string;
  /** ISBN10, ISBN13이 공백으로 구분되어 함께 오며, 둘 중 하나만 있거나 비어 있을 수 있다 */
  isbn: string;
  datetime: string;
  authors: string[];
  publisher: string;
  translators: string[];
  price: number;
  /** 할인가가 없으면 -1 */
  sale_price: number;
  thumbnail: string;
  status: string;
}

export interface KakaoBookSearchResponse {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents: KakaoBookDocument[];
}

function resolveBookId(isbn: string, url: string): string {
  const codes = isbn.trim().split(/\s+/).filter(Boolean);
  return codes.find((code) => code.length === 13) ?? codes[0] ?? url;
}

export function toBook(document: KakaoBookDocument): Book {
  return {
    id: resolveBookId(document.isbn, document.url),
    title: document.title,
    authors: document.authors,
    publisher: document.publisher,
    contents: document.contents,
    price: document.price,
    salePrice: document.sale_price >= 0 ? document.sale_price : null,
    thumbnail: document.thumbnail || null,
    url: document.url,
  };
}

export function toBookSearchResult(response: KakaoBookSearchResponse): BookSearchResult {
  return {
    books: response.documents.map(toBook),
    isEnd: response.meta.is_end,
    totalCount: response.meta.total_count,
  };
}
