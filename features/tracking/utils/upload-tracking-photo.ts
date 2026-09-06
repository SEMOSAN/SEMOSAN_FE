import { optimizeImageForUpload } from "@/lib/optimize-image";
import { requestPresignedUrl } from "@/lib/presigned-upload";

/**
 * 트래킹 인증 사진을 tracking-photos 버킷에 업로드합니다.
 * 리사이징/압축/EXIF 제거 후 Presigned URL을 발급받아 MinIO에 직접 PUT 합니다.
 * @returns 업로드된 이미지의 최종 URL
 */
export async function uploadTrackingPhoto(uri: string): Promise<string> {
  const optimizedUri = await optimizeImageForUpload(uri);
  const filename = `tracking_${Date.now()}.jpg`;

  const { uploadUrl, imageUrl, contentType } = await requestPresignedUrl(
    "tracking-photos",
    filename,
  );

  // React Native에서 file:// URI를 바이너리로 읽음
  const fileResponse = await fetch(optimizedUri);
  const blob = await fileResponse.blob();

  // Presigned URL이므로 Authorization 헤더는 불필요
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob,
  });

  if (!uploadResponse.ok) {
    throw new Error(`이미지 업로드 실패: ${uploadResponse.status}`);
  }

  return imageUrl;
}
