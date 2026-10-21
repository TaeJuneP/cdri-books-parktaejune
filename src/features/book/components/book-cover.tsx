"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import { KAKAO_DEFAULT_THUMBNAIL_WIDTH, kakaoThumbnailLoader } from "../utils/thumbnail";

interface BookCoverProps {
  src: string | null;
  title: string;
  width: number;
  height: number;
  className?: string;
}

/** 도서 표지. 표지가 없는 도서는 같은 크기의 대체 박스를 보여 레이아웃이 흔들리지 않게 한다 */
export function BookCover({ src, title, width, height, className }: BookCoverProps) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={`${title} 표지 없음`}
        style={{ width, height }}
        className={cn("flex shrink-0 items-center justify-center bg-light-gray", className)}
      >
        <span className="text-small text-text-subtitle">No Image</span>
      </div>
    );
  }

  // 고해상도(2x) 화면에서도 기본 썸네일(120px)로 충분하면 원본을 그대로 쓰고,
  // 더 큰 표지(상세보기 210px → 2x 420px)만 CDN 리사이즈 loader로 요청한다
  const needsResize = width * 2 > KAKAO_DEFAULT_THUMBNAIL_WIDTH;

  return (
    <Image
      {...(needsResize ? { loader: kakaoThumbnailLoader } : { unoptimized: true })}
      src={src}
      alt={`${title} 표지`}
      width={width}
      height={height}
      // 표지 원본 비율이 제각각이라, 시안처럼 고정 박스에 맞춰 잘라내(object-cover) 행 높이를 일정하게 유지
      style={{ width, height }}
      className={cn("shrink-0 object-cover", className)}
    />
  );
}
