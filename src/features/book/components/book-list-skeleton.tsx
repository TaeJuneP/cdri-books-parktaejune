interface BookListSkeletonProps {
  label: string;
  rows?: number;
}

/** 목록을 불러오는 동안 행과 같은 크기의 자리 표시자를 보여 화면 흔들림을 줄인다 */
export function BookListSkeleton({ label, rows = 5 }: BookListSkeletonProps) {
  return (
    <ul className="mt-9" aria-busy="true" aria-label={label}>
      {Array.from({ length: rows }, (_, index) => (
        <li key={index} className="flex h-[100px] items-center border-b border-divider pr-4 pl-12">
          <div className="h-[68px] w-12 animate-pulse bg-light-gray" />
          <div className="ml-12 h-5 w-64 animate-pulse rounded bg-light-gray" />
        </li>
      ))}
    </ul>
  );
}
