import { cn } from "@/lib/cn";

interface ResultCountProps {
  id?: string;
  label: string;
  /** null이면 건수를 아직 알 수 없는 상태(로딩)로 보고 숫자를 비워 둔다 */
  count: number | null;
  className?: string;
}

/** "도서 검색 결과 총 N건", "찜한 책 총 N건" 형태의 건수 표시 (숫자는 Primary 색) */
export function ResultCount({ id, label, count, className }: ResultCountProps) {
  return (
    <h2 id={id} className={cn("flex gap-4 text-caption text-text-primary", className)}>
      {label}
      <span>
        총{" "}
        <span className="inline-block min-w-[1ch] text-primary">
          {count === null ? "" : count.toLocaleString("ko-KR")}
        </span>
        건
      </span>
    </h2>
  );
}
