/** 상세검색 대상. 값은 카카오 API의 target 파라미터와 동일하다. */
export type SearchTarget = "title" | "person" | "publisher";

/**
 * 앱 내부에서 사용하는 도서 모델.
 * 카카오 응답(snake_case, 특수값 -1, 공백으로 합쳐진 ISBN 등)을 그대로 쓰지 않고
 * UI가 다루기 쉬운 형태로 정규화해, API 특성이 컴포넌트까지 새어 나가지 않게 한다.
 */
export interface Book {
  /** 찜하기 등에서 쓰는 고유 식별자 (ISBN13 > ISBN10 > 상세 URL 순으로 결정) */
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  contents: string;
  price: number;
  /** 할인가가 없으면 null */
  salePrice: number | null;
  /** 표지 이미지가 없으면 null */
  thumbnail: string | null;
  /** 도서 상세 페이지(다음 책) URL */
  url: string;
}

export interface BookSearchResult {
  books: Book[];
  /** 현재 페이지가 마지막 페이지인지 여부 */
  isEnd: boolean;
  /** 검색된 전체 문서 수 */
  totalCount: number;
}
