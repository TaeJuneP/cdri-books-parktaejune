import { describe, expect, it } from "vitest";

import { ApiError } from "./http";
import { shouldRetryQuery } from "./query-client";

describe("shouldRetryQuery", () => {
  it.each([400, 401, 404])("%i 응답은 다시 보내도 결과가 같으므로 재시도하지 않는다", (status) => {
    expect(shouldRetryQuery(0, new ApiError("요청 오류", status))).toBe(false);
  });

  it("429(호출량 초과)는 잠시 뒤 성공할 수 있어 한 번 재시도한다", () => {
    expect(shouldRetryQuery(0, new ApiError("호출량 초과", 429))).toBe(true);
  });

  it.each([500, 502])("%i 응답은 일시적일 수 있어 한 번 재시도한다", (status) => {
    expect(shouldRetryQuery(0, new ApiError("서버 오류", status))).toBe(true);
  });

  it("네트워크 오류(ApiError가 아닌 에러)는 한 번 재시도한다", () => {
    expect(shouldRetryQuery(0, new TypeError("Failed to fetch"))).toBe(true);
  });

  it("재시도는 최대 한 번만 한다", () => {
    expect(shouldRetryQuery(1, new ApiError("서버 오류", 502))).toBe(false);
    expect(shouldRetryQuery(1, new TypeError("Failed to fetch"))).toBe(false);
  });
});
