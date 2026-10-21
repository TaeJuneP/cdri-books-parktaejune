import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/*
 * tailwind-merge는 기본 Tailwind 클래스만 알고 있어, 커스텀 타이포 토큰(text-caption 등)을
 * 글자색으로 오인해 text-white 같은 색 클래스를 지워버린다.
 * 디자인 토큰을 font-size 그룹으로 등록해 올바르게 병합되도록 한다.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: ["title1", "title2", "title3", "body1", "body2", "body2-bold", "caption", "small"],
        },
      ],
    },
  },
});

/** 조건부 클래스를 합치고, 충돌하는 Tailwind 클래스는 뒤에 온 것을 우선한다 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
