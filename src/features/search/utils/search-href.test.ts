import { describe, expect, it } from "vitest";

import { toSearchHref } from "./search-href";

describe("toSearchHref", () => {
  it("전체 검색은 query만 담는다", () => {
    expect(toSearchHref({ query: "노르웨이의 숲" })).toBe(
      "/?query=%EB%85%B8%EB%A5%B4%EC%9B%A8%EC%9D%B4%EC%9D%98+%EC%88%B2",
    );
  });

  it("상세검색은 target을 함께 담는다", () => {
    expect(toSearchHref({ query: "민음사", target: "publisher" })).toBe(
      "/?query=%EB%AF%BC%EC%9D%8C%EC%82%AC&target=publisher",
    );
  });

  it("검색어가 없거나 공백뿐이면 조건 없는 첫 화면 경로를 반환한다", () => {
    expect(toSearchHref({ query: "" })).toBe("/");
    expect(toSearchHref({ query: "   " })).toBe("/");
  });
});
