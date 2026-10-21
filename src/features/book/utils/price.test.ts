import { describe, expect, it } from "vitest";

import { formatPrice, getSellingPrice, hasDiscount } from "./price";

describe("formatPrice", () => {
  it("천 단위 구분 기호와 '원'을 붙인다", () => {
    expect(formatPrice(13300)).toBe("13,300원");
    expect(formatPrice(0)).toBe("0원");
  });
});

describe("getSellingPrice", () => {
  it("할인가가 있으면 할인가를 반환한다", () => {
    expect(getSellingPrice({ price: 16000, salePrice: 13500 })).toBe(13500);
  });

  it("할인가가 없으면 정가를 반환한다", () => {
    expect(getSellingPrice({ price: 16000, salePrice: null })).toBe(16000);
  });
});

describe("hasDiscount", () => {
  it("할인가가 정가보다 낮으면 할인으로 본다", () => {
    expect(hasDiscount({ price: 16000, salePrice: 13500 })).toBe(true);
  });

  it("할인가가 없으면 할인이 아니다 (할인가 미노출)", () => {
    expect(hasDiscount({ price: 16000, salePrice: null })).toBe(false);
  });

  it("할인가가 정가와 같으면 할인이 아니다", () => {
    expect(hasDiscount({ price: 16000, salePrice: 16000 })).toBe(false);
  });
});
