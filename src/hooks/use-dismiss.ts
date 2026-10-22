"use client";

import { type RefObject, useEffect, useRef } from "react";

/** 닫힌 이유. Esc로 닫으면 포커스를 되돌리고, 바깥 클릭이면 사용자가 누른 곳에 포커스를 둔다 */
export type DismissReason = "outside-click" | "escape";

interface UseDismissOptions {
  /** 이 요소 바깥을 누르면 닫는다 */
  ref: RefObject<HTMLElement | null>;
  onDismiss: (reason: DismissReason) => void;
  /** false면 감지하지 않는다 (예: 팝업이 닫혀 있을 때) */
  enabled?: boolean;
}

/**
 * 팝업처럼 떠 있는 UI를 닫는 공통 동작: 바깥 영역 클릭(터치 포함), Esc 키.
 * 팝업마다 document 이벤트를 직접 다루지 않도록 훅으로 분리한다.
 */
export function useDismiss({ ref, onDismiss, enabled = true }: UseDismissOptions) {
  // 콜백이 바뀔 때마다 리스너를 다시 등록하지 않도록 최신 콜백을 ref로 참조한다
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!enabled) return;

    // click 대신 pointerdown: 마우스·터치 모두 대응하고, 바깥을 누르는 즉시 닫힌다
    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onDismissRef.current("outside-click");
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismissRef.current("escape");
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, enabled]);
}
