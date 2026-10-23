"use client";

import { useEffect } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

/** 예상치 못한 런타임 에러 화면. 헤더는 유지하고 본문만 대체해 다른 메뉴로 이동할 수 있게 한다 */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // 실서비스라면 에러 수집 서비스(Sentry 등)로 전송한다
    console.error(error);
  }, [error]);

  return (
    <PageContainer title="문제가 발생했습니다">
      <div role="alert" className="flex flex-col items-center gap-4 py-[120px]">
        <p className="text-caption text-text-secondary">
          일시적인 오류로 화면을 표시하지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
        <Button onClick={() => retry()}>다시 시도</Button>
      </div>
    </PageContainer>
  );
}
