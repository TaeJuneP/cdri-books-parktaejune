import type { ImageLoader } from "next/image";

/** 카카오 썸네일 URL의 리사이즈 파라미터 (예: /thumb/R120x174.q85/) */
const KAKAO_RESIZE_PATTERN = /\/thumb\/R\d+x\d+/;

/**
 * 카카오 CDN이 허용하는 리사이즈 크기 (너비 오름차순).
 * 임의 크기는 403으로 거부되어, 실제 요청으로 응답(200)을 확인한 크기만 사용한다.
 */
const KAKAO_THUMBNAIL_SIZES = [
  { width: 120, height: 174 },
  { width: 420, height: 612 },
] as const;

/**
 * next/image 커스텀 loader.
 * 카카오 CDN의 리사이즈 기능으로 화면에 필요한 크기(1x/2x)를 직접 받아온다.
 * 요청 너비 이상인 허용 크기 중 가장 작은 것을 고르고, 없으면 가장 큰 크기를 사용한다.
 * 리사이즈 형식이 아닌 URL은 그대로 사용한다.
 */
export const kakaoThumbnailLoader: ImageLoader = ({ src, width }) => {
  if (!KAKAO_RESIZE_PATTERN.test(src)) return src;
  const size =
    KAKAO_THUMBNAIL_SIZES.find((candidate) => candidate.width >= width) ??
    KAKAO_THUMBNAIL_SIZES[KAKAO_THUMBNAIL_SIZES.length - 1];
  return src.replace(KAKAO_RESIZE_PATTERN, `/thumb/R${size.width}x${size.height}`);
};
