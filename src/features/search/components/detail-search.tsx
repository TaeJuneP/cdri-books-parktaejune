"use client";

import { type FormEvent, useId, useRef, useState } from "react";

import { ChevronDownIcon, CloseIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { SearchTarget } from "@/features/book/types";
import { type DismissReason, useDismiss } from "@/hooks/use-dismiss";

import { SEARCH_TARGET_OPTIONS } from "../constants";
import type { SearchCondition } from "../types";

interface DetailSearchProps {
  /** 현재 상세검색 조건. 팝업을 열 때 입력값으로 채운다 (전체 검색 중이면 비어 있음) */
  currentCondition?: Required<SearchCondition>;
  onSearch: (condition: Required<SearchCondition>) => void;
}

/** '상세검색' 버튼과, 버튼 아래에 열리는 검색 조건 팝업 */
export function DetailSearch({ currentCondition, onSearch }: DetailSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = (reason: DismissReason | "submit") => {
    setIsOpen(false);
    // 바깥 클릭이면 사용자가 누른 곳에 포커스를 두고, 그 외에는 트리거로 되돌린다
    if (reason !== "outside-click") triggerRef.current?.focus();
  };

  useDismiss({ ref: containerRef, onDismiss: close, enabled: isOpen });

  return (
    <div ref={containerRef} className="relative">
      <Button
        ref={triggerRef}
        variant="outline"
        size="sm"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        aria-haspopup="dialog"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        상세검색
      </Button>

      {isOpen && (
        <DetailSearchPanel
          id={panelId}
          initialCondition={currentCondition}
          onClose={() => close("escape")}
          onSubmit={(condition) => {
            onSearch(condition);
            close("submit");
          }}
        />
      )}
    </div>
  );
}

interface DetailSearchPanelProps {
  id: string;
  initialCondition?: Required<SearchCondition>;
  onClose: () => void;
  onSubmit: (condition: Required<SearchCondition>) => void;
}

/**
 * 팝업 본문. 열릴 때마다 새로 마운트되므로 입력값은 항상 현재 조건으로 초기화된다.
 * (전체 검색을 하면 상세 조건이 사라지므로, 다음에 열 때 빈 값으로 시작)
 */
function DetailSearchPanel({ id, initialCondition, onClose, onSubmit }: DetailSearchPanelProps) {
  const [target, setTarget] = useState<SearchTarget>(initialCondition?.target ?? "title");
  const [query, setQuery] = useState(initialCondition?.query ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const selectId = useId();
  const inputId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    onSubmit({ target, query: trimmed });
  };

  return (
    <div
      id={id}
      role="dialog"
      aria-label="상세검색"
      // 시안: 버튼 아래 14px, 버튼 중앙 정렬, 360×160
      className="absolute top-[calc(100%+14px)] left-1/2 z-20 w-[360px] -translate-x-1/2 rounded-lg bg-white px-6 pt-9 pb-9 shadow-[0_4px_14px_6px_rgba(151,151,151,0.15)]"
    >
      <button
        type="button"
        aria-label="상세검색 닫기"
        onClick={onClose}
        className="absolute top-2 right-2 flex size-5 items-center justify-center text-icon hover:text-text-secondary"
      >
        <CloseIcon />
      </button>

      <form onSubmit={handleSubmit}>
        <div className="flex items-end gap-1">
          <label htmlFor={selectId} className="sr-only">
            검색 조건
          </label>
          <div className="relative w-[100px] shrink-0">
            <select
              id={selectId}
              value={target}
              onChange={(event) => setTarget(event.target.value as SearchTarget)}
              className="h-9 w-full appearance-none border-b border-divider bg-transparent pr-6 pl-2 text-body2-bold text-text-primary outline-none focus-visible:border-primary"
            >
              {SEARCH_TARGET_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              width={10}
              height={6}
              className="pointer-events-none absolute top-1/2 right-[10px] -translate-y-1/2 text-icon"
            />
          </div>

          <label htmlFor={inputId} className="sr-only">
            상세검색어
          </label>
          <input
            ref={inputRef}
            id={inputId}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            // 팝업을 열면 바로 입력할 수 있도록 포커스 (시안: 입력창이 활성 상태)
            autoFocus
            placeholder="검색어 입력"
            autoComplete="off"
            className="h-9 min-w-0 flex-1 border-b border-divider bg-transparent px-[9px] text-body2 text-text-primary outline-none placeholder:text-text-subtitle focus:border-primary"
          />
        </div>

        <Button type="submit" className="mt-4 h-9 w-full text-body2">
          검색하기
        </Button>
      </form>
    </div>
  );
}
