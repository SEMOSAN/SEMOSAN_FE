import { Image as ImageCompressor } from "react-native-compressor";

// 업로드 전 리사이징 + 압축 — 서버 리소스/전송량 절감 목적
// react-native-compressor는 재인코딩 과정에서 EXIF(위치정보 등 메타데이터)도 함께 제거함
const MAX_DIMENSION = 1920;
const COMPRESS_QUALITY = 0.8;

export async function optimizeImageForUpload(uri: string): Promise<string> {
  try {
    return await ImageCompressor.compress(uri, {
      compressionMethod: "auto",
      maxWidth: MAX_DIMENSION,
      maxHeight: MAX_DIMENSION,
      quality: COMPRESS_QUALITY,
      output: "jpg",
    });
  } catch (error) {
    console.warn("[optimizeImageForUpload] 압축 실패, 원본으로 업로드:", error);
    return uri;
  }
}
