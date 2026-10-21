import { describe, expect, it } from "vitest";

import { addSearchKeyword, MAX_SEARCH_HISTORY, removeSearchKeyword } from "./search-history";

describe("addSearchKeyword", () => {
  it("새 검색어를 맨 앞에 추가한다", () => {
    expect(addSearchKeyword(["노르웨이 숲"], "무라카미 하루키")).toEqual([
      "무라카미 하루키",
      "노르웨이 숲",
    ]);
  });

  it(`최대 ${MAX_SEARCH_HISTORY}개를 넘으면 가장 오래된 기록부터 지운다`, () => {
    const history = ["8", "7", "6", "5", "4", "3", "2", "1"];

    const result = addSearchKeyword(history, "9");

    expect(result).toHaveLength(MAX_SEARCH_HISTORY);
    expect(result[0]).toBe("9");
    expect(result).not.toContain("1");
  });

  it("이미 있는 검색어는 중복 없이 맨 앞으로 옮긴다", () => {
    expect(addSearchKeyword(["a", "b", "c"], "c")).toEqual(["c", "a", "b"]);
  });

  it("앞뒤 공백을 제거해 같은 검색어로 취급한다", () => {
    expect(addSearchKeyword(["노르웨이 숲"], "  노르웨이 숲 ")).toEqual(["노르웨이 숲"]);
  });

  it("빈 검색어는 저장하지 않는다", () => {
    expect(addSearchKeyword(["a"], "   ")).toEqual(["a"]);
  });

  it("원본 배열을 변경하지 않는다", () => {
    const history = ["a"];
    addSearchKeyword(history, "b");
    expect(history).toEqual(["a"]);
  });
});

describe("removeSearchKeyword", () => {
  it("해당 검색어만 지운다", () => {
    expect(removeSearchKeyword(["a", "b", "c"], "b")).toEqual(["a", "c"]);
  });
});
