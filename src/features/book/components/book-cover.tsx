"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import { kakaoThumbnailLoader } from "../utils/thumbnail";

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

  return (
    <Image
      loader={kakaoThumbnailLoader}
      src={src}
      alt={`${title} 표지`}
      width={width}
      height={height}
      className={cn("shrink-0 object-cover", className)}
    />
  );
}
