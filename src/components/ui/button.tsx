import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/*
 * 시안의 버튼 종류
 * - primary   : 구매하기, 검색하기 (파란 배경)
 * - secondary : 상세보기 (밝은 회색 배경)
 * - outline   : 상세검색 (회색 테두리)
 */
export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-[5px] rounded-lg whitespace-nowrap",
    "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:brightness-95",
        secondary: "bg-light-gray text-text-secondary hover:brightness-95",
        outline: "border border-text-subtitle bg-white text-text-subtitle hover:bg-light-gray",
      },
      size: {
        /** 115×48 (구매하기, 상세보기) */
        md: "h-12 min-w-[115px] px-5 text-caption",
        /** 74×37 (상세검색) */
        sm: "h-[37px] px-[10px] text-body2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  // form 안에서 의도치 않은 submit을 막기 위해 type 기본값을 "button"으로 둔다
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
