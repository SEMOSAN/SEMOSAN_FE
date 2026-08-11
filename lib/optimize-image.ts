import { Image as ImageCompressor } from "react-native-compressor";

// 업로드 전 리사이징 + 압축 — 서버 리소스/전송량 절감 목적
// react-native-compressor는 재인코딩 과정에서 EXIF(위치정보 등 메타데이터)도 함께 제거함.
// 압축에 실패했다고 원본으로 폴백하면 EXIF가 남은 원본이 그대로 업로드돼
// 위치정보 제거 요구사항이 깨지므로, 원본으로 대체하지 않고 에러를 그대로
// 던져 호출부(업로드 자체)가 중단되도록 한다.
const MAX_DIMENSION = 1920;
const COMPRESS_QUALITY = 0.8;

export function optimizeImageForUpload(uri: string): Promise<string> {
  return ImageCompressor.compress(uri, {
    compressionMethod: "auto",
    maxWidth: MAX_DIMENSION,
    maxHeight: MAX_DIMENSION,
    quality: COMPRESS_QUALITY,
    output: "jpg",
  });
}
