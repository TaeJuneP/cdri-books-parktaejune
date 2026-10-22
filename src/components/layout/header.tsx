import Link from "next/link";

import { NavLink } from "./nav-link";

const NAV_ITEMS = [
  { href: "/", label: "도서 검색" },
  { href: "/wishlist", label: "내가 찜한 책" },
] as const;

export function Header() {
  return (
    <header className="w-full md:h-20">
      {/* 모바일: 로고와 메뉴를 위아래로 / md 이상: 로고 | 메뉴(가운데) | 빈 칸의 3열 그리드 */}
      <div className="mx-auto flex max-w-[1920px] flex-col items-center gap-3 px-4 py-4 md:grid md:h-full md:grid-cols-[1fr_auto_1fr] md:gap-0 md:px-10 md:py-0 xl:px-40">
        <Link
          href="/"
          className="text-title3 whitespace-nowrap text-text-primary md:justify-self-start md:text-title1"
        >
          CERTICOS BOOKS
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className="flex gap-8 md:gap-14">
            {NAV_ITEMS.map(({ href, label }) => (
              <li key={href}>
                <NavLink href={href}>{label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
