"use client";

import {
  type FocusEvent,
  type FormEvent,
  type KeyboardEvent,
  useId,
  useRef,
  useState,
} from "react";

import { CloseIcon, SearchIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

interface SearchBarProps {
  /** 현재 검색어. URL이 바뀌면(뒤로가기 등) 입력창도 이 값으로 초기화된다 */
  defaultQuery: string;
  /** 최근 검색어 (최신순) */
  history: string[];
  onSearch: (query: string) => void;
  onRemoveHistory: (keyword: string) => void;
}

export function SearchBar({ defaultQuery, history, onSearch, onRemoveHistory }: SearchBarProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const historyListRef = useRef<HTMLUListElement>(null);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  // Esc로 닫은 뒤 입력창으로 포커스를 되돌려도 다시 열리지 않도록, 사용자가 닫았음을 따로 기억한다
  const [isDismissed, setIsDismissed] = useState(false);

  const isHistoryOpen = isFocusWithin && !isDismissed && history.length > 0;

  const close = () => {
    setIsFocusWithin(false);
    setIsDismissed(false);
    inputRef.current?.blur();
  };

  const submit = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
    close();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(new FormData(event.currentTarget).get("query")?.toString() ?? "");
  };

  // 포커스가 검색 영역(입력창 + 기록 목록) 밖으로 나갈 때만 닫는다.
  // 기록 항목을 클릭하면 입력창 blur가 먼저 일어나므로, 이동한 대상이 영역 안이면 열린 상태를 유지한다
  const handleBlur = (event: FocusEvent<HTMLFormElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocusWithin(false);
      setIsDismissed(false);
    }
  };

  const getHistoryButtons = () =>
    Array.from(
      historyListRef.current?.querySelectorAll<HTMLButtonElement>("[data-history-item]") ?? [],
    );

  // ↑/↓로 입력창과 기록 항목 사이를 이동하고, Esc로 닫는다
  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Escape") {
      setIsDismissed(true);
      inputRef.current?.focus();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    // 닫힌 상태에서 ↓를 누르면 목록을 다시 연다
    if (!isHistoryOpen) {
      if (event.key === "ArrowDown") setIsDismissed(false);
      return;
    }

    event.preventDefault();
    const buttons = getHistoryButtons();
    const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const nextIndex = event.key === "ArrowDown" ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex < 0) inputRef.current?.focus();
    else buttons[Math.min(nextIndex, buttons.length - 1)]?.focus();
  };

  const handleRemove = (keyword: string) => {
    onRemoveHistory(keyword);
    // 누른 X 버튼이 사라져 포커스를 잃지 않도록 입력창으로 돌려보낸다
    inputRef.current?.focus();
  };

  return (
    // role="search"로 보조기기가 검색 영역으로 바로 이동할 수 있게 한다
    <form
      role="search"
      onSubmit={handleSubmit}
      onFocus={() => setIsFocusWithin(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      // 기록 목록은 아래 콘텐츠를 밀지 않고 위에 겹쳐 펼쳐지므로, 자리는 입력창 높이만 차지한다
      className="relative h-[50px] w-full max-w-[480px]"
    >
      <div
        className={cn(
          // 시안에 포커스 테두리가 없어, 입력창 포커스는 커서로 표시한다
          "absolute inset-x-0 top-0 z-10 rounded-[25px] bg-light-gray",
          isHistoryOpen && "pb-[15px]",
        )}
      >
        <label htmlFor={inputId} className="sr-only">
          도서 검색어
        </label>
        <div className="flex h-[50px] items-center gap-4 px-[15px]">
          <SearchIcon className="shrink-0 text-text-primary" />
          <input
            ref={inputRef}
            id={inputId}
            name="query"
            type="search"
            // defaultValue는 처음 마운트될 때만 반영되므로, URL 검색어가 바뀌면 key로 다시 마운트한다
            key={defaultQuery}
            defaultValue={defaultQuery}
            placeholder="검색어를 입력하세요"
            autoComplete="off"
            enterKeyHint="search"
            // 직접 닫은 뒤에도 다시 입력하거나 클릭하면 목록을 연다
            onChange={() => setIsDismissed(false)}
            onMouseDown={() => setIsDismissed(false)}
            className="min-w-0 flex-1 bg-transparent text-caption text-text-primary outline-none placeholder:text-text-subtitle [&::-webkit-search-cancel-button]:hidden"
          />
        </div>

        {isHistoryOpen && (
          <ul ref={historyListRef} aria-label="최근 검색어" className="mt-2">
            {history.map((keyword) => (
              <li key={keyword} className="flex h-10 items-center pr-[25px] pl-[51px]">
                <button
                  type="button"
                  data-history-item
                  onClick={() => submit(keyword)}
                  className="min-w-0 flex-1 truncate text-left text-caption text-text-subtitle hover:text-text-primary focus-visible:text-text-primary focus-visible:outline-none"
                >
                  {keyword}
                </button>
                <button
                  type="button"
                  aria-label={`최근 검색어 '${keyword}' 삭제`}
                  onClick={() => handleRemove(keyword)}
                  className="flex size-6 shrink-0 items-center justify-center text-black hover:text-text-secondary"
                >
                  <CloseIcon width={16} height={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}
