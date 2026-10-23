import Image from "next/image";

import emptyBookImage from "@/assets/images/empty-book.png";

interface EmptyStateProps {
  message: string;
}

/** 검색 결과·찜 목록이 비었을 때 보여주는 안내 (시안: 책 일러스트 + 안내 문구) */
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-[120px]">
      {/* 의미는 문구로 전달되므로 이미지는 장식용(alt="") */}
      <Image src={emptyBookImage} alt="" width={80} height={82} />
      <p className="text-caption text-text-secondary">{message}</p>
    </div>
  );
}
