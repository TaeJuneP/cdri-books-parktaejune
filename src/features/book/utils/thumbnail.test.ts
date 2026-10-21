import { describe, expect, it } from "vitest";

import { kakaoThumbnailLoader } from "./thumbnail";

const thumbnail = (size: string) =>
  `https://search1.kakaocdn.net/thumb/${size}.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F5497767`;

describe("kakaoThumbnailLoader", () => {
  it("목록 썸네일(2x 96px)은 기본 크기(120)를 요청한다", () => {
    expect(kakaoThumbnailLoader({ src: thumbnail("R120x174"), width: 96 })).toBe(
      thumbnail("R120x174"),
    );
  });

  it("상세 표지(2x 420px)는 고해상도 크기(420)를 요청한다", () => {
    expect(kakaoThumbnailLoader({ src: thumbnail("R120x174"), width: 420 })).toBe(
      thumbnail("R420x612"),
    );
  });

  it("허용 크기보다 큰 너비를 요청하면 가장 큰 허용 크기를 사용한다", () => {
    expect(kakaoThumbnailLoader({ src: thumbnail("R120x174"), width: 828 })).toBe(
      thumbnail("R420x612"),
    );
  });

  it("카카오 리사이즈 형식이 아닌 URL은 그대로 반환한다", () => {
    const src = "https://example.com/cover.jpg";
    expect(kakaoThumbnailLoader({ src, width: 420 })).toBe(src);
  });
});
