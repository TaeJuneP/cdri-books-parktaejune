"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface NavLinkProps {
  href: string;
  /** 활성 상태를 판단할 경로. href에 검색 조건이 붙는 경우처럼 href와 다를 때 지정 */
  activePath?: string;
  children: ReactNode;
}

/** 현재 경로와 일치하면 밑줄로 활성 상태를 표시하는 GNB 링크 */
export function NavLink({ href, activePath, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === (activePath ?? href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "border-b pb-1 text-caption whitespace-nowrap text-text-primary transition-colors hover:text-primary md:text-body1",
        isActive ? "border-primary" : "border-transparent",
      )}
    >
      {children}
    </Link>
  );
}
