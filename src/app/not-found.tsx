import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageContainer title="페이지를 찾을 수 없습니다">
      <div className="flex flex-col items-center gap-4 py-[120px]">
        <p className="text-caption text-text-secondary">
          주소가 잘못되었거나 더 이상 제공되지 않는 페이지입니다.
        </p>
        <Link href="/" className={buttonVariants()}>
          도서 검색으로 이동
        </Link>
      </div>
    </PageContainer>
  );
}
