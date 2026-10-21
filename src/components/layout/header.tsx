import Link from "next/link";

import { NavLink } from "./nav-link";

const NAV_ITEMS = [
  { href: "/", label: "도서 검색" },
  { href: "/wishlist", label: "내가 찜한 책" },
] as const;

export function Header() {
  return (
    <header className="h-20 w-full">
      {/* 로고 | 메뉴(가운데) | 빈 칸 — 3열 그리드로 메뉴를 화면 중앙에 고정 */}
      <div className="mx-auto grid h-full max-w-[1920px] grid-cols-[1fr_auto_1fr] items-center px-4 md:px-10 xl:px-40">
        <Link href="/" className="text-title1 whitespace-nowrap text-text-primary">
          CERTICOS BOOKS
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className="flex gap-6 md:gap-14">
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
