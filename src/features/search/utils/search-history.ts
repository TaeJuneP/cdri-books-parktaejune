/** 검색 기록 최대 저장 개수 (시안: 최대 8개) */
export const MAX_SEARCH_HISTORY = 8;

/**
 * 검색어를 기록 맨 앞에 추가한다.
 * - 이미 있는 검색어는 기존 위치에서 빼고 맨 앞으로 옮긴다 (중복 없이 최근 순서 유지)
 * - 최대 개수를 넘으면 가장 오래된 기록부터 지운다
 * - 앞뒤 공백은 제거하고, 빈 검색어는 저장하지 않는다
 */
export function addSearchKeyword(
  history: readonly string[],
  keyword: string,
  max: number = MAX_SEARCH_HISTORY,
): string[] {
  const trimmed = keyword.trim();
  if (!trimmed) return [...history];
  return [trimmed, ...history.filter((item) => item !== trimmed)].slice(0, max);
}

export function removeSearchKeyword(history: readonly string[], keyword: string): string[] {
  return history.filter((item) => item !== keyword);
}
