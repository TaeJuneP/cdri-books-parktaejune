import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
  it("커스텀 타이포 토큰과 글자색 클래스를 함께 유지한다", () => {
    expect(cn("text-caption", "text-white")).toBe("text-caption text-white");
  });

  it("같은 그룹의 클래스가 충돌하면 뒤에 온 클래스를 우선한다", () => {
    expect(cn("text-caption", "text-body2")).toBe("text-body2");
    expect(cn("bg-primary", "bg-light-gray")).toBe("bg-light-gray");
  });

  it("falsy 값은 무시한다", () => {
    expect(cn("px-4", false, undefined, null, "py-2")).toBe("px-4 py-2");
  });
});
