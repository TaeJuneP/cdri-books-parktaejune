"use client";

import { type FormEvent, useId } from "react";

import { SearchIcon } from "@/components/icons";

interface SearchBarProps {
  /** 현재 검색어. URL이 바뀌면(뒤로가기 등) 입력창도 이 값으로 초기화된다 */
  defaultQuery: string;
  onSearch: (query: string) => void;
}

export function SearchBar({ defaultQuery, onSearch }: SearchBarProps) {
  const inputId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("query")?.toString().trim() ?? "";
    if (!query) return;
    onSearch(query);
  };

  return (
    // role="search"로 보조기기가 검색 영역으로 바로 이동할 수 있게 한다
    <form role="search" onSubmit={handleSubmit} className="w-full max-w-[480px]">
      <label htmlFor={inputId} className="sr-only">
        도서 검색어
      </label>
      <div className="flex h-[50px] items-center gap-4 rounded-full bg-light-gray px-[15px] focus-within:outline-2 focus-within:outline-primary">
        <SearchIcon className="shrink-0 text-text-primary" />
        <input
          id={inputId}
          name="query"
          type="search"
          // defaultValue는 처음 마운트될 때만 반영되므로, URL 검색어가 바뀌면 key로 다시 마운트한다
          key={defaultQuery}
          defaultValue={defaultQuery}
          placeholder="검색어를 입력하세요"
          autoComplete="off"
          enterKeyHint="search"
          className="min-w-0 flex-1 bg-transparent text-caption text-text-primary outline-none placeholder:text-text-subtitle [&::-webkit-search-cancel-button]:hidden"
        />
      </div>
    </form>
  );
}
