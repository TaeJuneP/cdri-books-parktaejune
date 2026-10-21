import type { SVGProps } from "react";

import { cn } from "@/lib/cn";

/*
 * Figma 시안(PDF)의 벡터 경로를 그대로 추출한 아이콘.
 * 색은 currentColor를 따르므로 text-* 유틸리티로 지정한다.
 * 장식용이 기본이며(aria-hidden), 의미는 감싸는 버튼의 aria-label로 전달한다.
 */
type IconProps = SVGProps<SVGSVGElement>;

const baseProps = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  "aria-hidden": true,
  focusable: false,
} as const;

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" width={20} height={20} {...baseProps} {...props}>
      <path d="M19.67 18.09L15.89 14.33C17.11 12.78 17.77 10.86 17.77 8.89C17.77 7.13 17.25 5.41 16.27 3.95C15.3 2.49 13.91 1.35 12.29 0.68C10.66 0 8.88 -0.17 7.15 0.17C5.43 0.51 3.85 1.36 2.6 2.6C1.36 3.85 0.51 5.43 0.17 7.15C-0.17 8.88 0 10.66 0.68 12.29C1.35 13.91 2.49 15.3 3.95 16.27C5.41 17.25 7.13 17.77 8.89 17.77C10.86 17.77 12.78 17.11 14.33 15.89L18.09 19.67C18.2 19.78 18.32 19.86 18.46 19.91C18.59 19.97 18.74 20 18.88 20C19.03 20 19.17 19.97 19.31 19.91C19.45 19.86 19.57 19.78 19.67 19.67C19.78 19.57 19.86 19.45 19.91 19.31C19.97 19.17 20 19.03 20 18.88C20 18.74 19.97 18.59 19.91 18.46C19.86 18.32 19.78 18.2 19.67 18.09ZM2.22 8.89C2.22 7.57 2.61 6.28 3.34 5.18C4.08 4.09 5.12 3.23 6.34 2.73C7.55 2.22 8.89 2.09 10.19 2.35C11.48 2.61 12.67 3.24 13.6 4.17C14.53 5.11 15.17 6.29 15.42 7.59C15.68 8.88 15.55 10.22 15.04 11.44C14.54 12.65 13.68 13.7 12.59 14.43C11.49 15.16 10.2 15.55 8.89 15.55C7.12 15.55 5.42 14.85 4.17 13.6C2.92 12.35 2.22 10.65 2.22 8.89Z" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 14 8" width={14} height={8} {...baseProps} {...props}>
      <path d="M2 0L7 5L12 0L14 1L7 8L0 1L2 0Z" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 12 12" width={12} height={12} {...baseProps} {...props}>
      <path d="M10.66 0.17L6 4.83L1.34 0.17L0.17 1.34L4.82 6L0.17 10.66L1.34 11.83L6 7.18L10.66 11.83L11.83 10.66L7.17 6L11.83 1.34L10.66 0.17Z" />
    </svg>
  );
}

// Figma에서 내보낸 원본 SVG (like/line.svg, like/fill.svg)
const HEART_LINE_PATH =
  "M1 9.5C1 5.91017 3.91015 3 7.5 3C9.24701 3 10.8329 3.68982 12 4.80968C13.1671 3.68982 14.753 3 16.5 3C20.0898 3 23 5.91017 23 9.5C23 12.6341 21.164 15.4994 19.0231 17.6615C16.8724 19.8335 14.2421 21.4718 12.3154 22.1121C12.1106 22.1801 11.8894 22.1801 11.6846 22.1121C9.75788 21.4718 7.12761 19.8335 4.97692 17.6615C2.83596 15.4994 1 12.6341 1 9.5ZM7.5 5C5.01472 5 3 7.01473 3 9.5C3 11.8659 4.41404 14.2506 6.39808 16.2543C8.24453 18.119 10.4368 19.5021 12 20.1011C13.5632 19.5021 15.7555 18.119 17.6019 16.2543C19.586 14.2506 21 11.8659 21 9.5C21 7.01473 18.9853 5 16.5 5C14.9789 5 13.6337 5.75379 12.8176 6.91266C12.6303 7.17865 12.3253 7.3369 12 7.3369C11.6747 7.3369 11.3697 7.17865 11.1824 6.91266C10.3663 5.75379 9.02112 5 7.5 5Z";
const HEART_FILL_PATH =
  "M7.5 4C4.46244 4 2 6.46245 2 9.5C2 15 8.5 20 12 21.1631C15.5 20 22 15 22 9.5C22 6.46245 19.5375 4 16.5 4C14.6398 4 12.9953 4.92345 12 6.3369C11.0047 4.92345 9.36015 4 7.5 4Z";

interface HeartIconProps extends IconProps {
  /** true면 빨간색으로 채운 하트(찜한 상태), false면 회색 테두리 하트 */
  filled: boolean;
}

export function HeartIcon({ filled, className, ...props }: HeartIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      {...baseProps}
      className={cn(filled ? "text-red" : "text-gray", className)}
      {...props}
    >
      {filled ? (
        <path
          d={HEART_FILL_PATH}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path d={HEART_LINE_PATH} fillRule="evenodd" clipRule="evenodd" />
      )}
    </svg>
  );
}
