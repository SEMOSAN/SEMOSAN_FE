import { api } from '@/lib/api';
import { optimizeImageForUpload } from '@/lib/optimize-image';
import { ENDPOINTS } from '@/types/api.generated';

type PresignedUrlResponse = {
  uploadUrl: string;
  imageUrl: string;
};

/**
 * 트래킹 인증 사진을 tracking-photos 버킷에 업로드합니다.
 * 1. 리사이징/압축/EXIF 제거 후 Presigned URL 발급 (GET /api/images/presigned-url?bucket=tracking-photos)
 * 2. uri → blob 변환 후 uploadUrl로 MinIO에 직접 PUT
 * @returns 업로드된 이미지의 최종 URL
 */
export async function uploadTrackingPhoto(uri: string): Promise<string> {
  const optimizedUri = await optimizeImageForUpload(uri);
  const timestamp = Date.now();
  const filename = `tracking_${timestamp}.jpg`;

  // 1. Presigned URL 발급
  const { data } = await api.get<PresignedUrlResponse>({
    path: ENDPOINTS.IMAGES_PRESIGNED_URL,
    params: { bucket: 'tracking-photos', filename },
  });

  // 2. uri → blob 변환 (React Native에서 file:// URI를 바이너리로 읽음)
  const fileResponse = await fetch(optimizedUri);
  const blob = await fileResponse.blob();

  // 3. MinIO에 직접 PUT (Presigned URL이므로 Authorization 헤더 불필요)
  const uploadResponse = await fetch(data.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/jpeg' },
    body: blob,
  });

  if (!uploadResponse.ok) {
    throw new Error(`이미지 업로드 실패: ${uploadResponse.status}`);
  }

  return data.imageUrl;
}
