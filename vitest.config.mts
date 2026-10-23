import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // tsconfig의 "@/*" 경로 별칭을 테스트에서도 동일하게 사용
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    // 테스트 대상은 순수 도메인 로직이므로 브라우저 환경(jsdom) 없이 node에서 실행
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
