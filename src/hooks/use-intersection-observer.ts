"use client";

import { useEffect, useRef } from "react";

interface UseIntersectionObserverOptions {
  /** 대상 요소가 화면에 들어왔을 때 호출 */
  onIntersect: () => void;
  /** false면 관찰하지 않는다 (예: 다음 페이지가 없거나 이미 불러오는 중) */
  enabled?: boolean;
  /** 화면에 닿기 전 미리 감지할 여유 거리. 사용자가 끝에 도달하기 전에 다음 페이지를 요청한다 */
  rootMargin?: string;
}

/**
 * 대상 요소가 뷰포트에 들어오면 콜백을 호출한다. 무한 스크롤의 감지 요소(sentinel)에 사용한다.
 * scroll 이벤트 대신 IntersectionObserver를 사용해 메인 스레드 부담 없이 교차를 감지한다.
 */
export function useIntersectionObserver<T extends Element>({
  onIntersect,
  enabled = true,
  rootMargin = "200px",
}: UseIntersectionObserverOptions) {
  const targetRef = useRef<T>(null);
  // 콜백이 바뀔 때마다 observer를 다시 만들지 않도록 최신 콜백을 ref로 참조한다
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) return;

    // enabled가 다시 true가 될 때 observer를 새로 만들므로, 다음 페이지를 불러온 뒤에도
    // 감지 요소가 여전히 화면 안에 있으면(화면이 큰 경우) 즉시 한 번 더 불러온다
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onIntersectRef.current();
      },
      { rootMargin },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return targetRef;
}
