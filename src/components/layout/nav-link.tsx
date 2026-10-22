"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

/** 현재 경로와 일치하면 밑줄로 활성 상태를 표시하는 GNB 링크 */
export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

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
