/** 서버가 내려준 에러 메시지와 HTTP 상태를 함께 담는 에러 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const DEFAULT_ERROR_MESSAGE = "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";

export async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    // 서버가 { message }를 내려주면 그대로 사용자 안내에 사용한다
    const body = await response.json().catch(() => null);
    const message = typeof body?.message === "string" ? body.message : DEFAULT_ERROR_MESSAGE;
    throw new ApiError(message, response.status);
  }

  return response.json();
}
