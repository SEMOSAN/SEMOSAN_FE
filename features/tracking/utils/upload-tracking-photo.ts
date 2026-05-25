import { api } from '@/lib/api';
import { ENDPOINTS } from '@/types/api.generated';

type PresignedUrlResponse = {
  uploadUrl: string;
  imageUrl: string;
};

/**
 * 트래킹 인증 사진을 tracking-photos 버킷에 업로드합니다.
 * 1. Presigned URL 발급 (GET /api/images/presigned-url?bucket=tracking-photos)
 * 2. uploadUrl로 MinIO에 직접 PUT (Authorization 헤더 없음)
 * @returns 업로드된 이미지의 최종 URL
 */
export async function uploadTrackingPhoto(uri: string): Promise<string> {
  const timestamp = Date.now();
  const filename = `tracking_${timestamp}.jpg`;

  // 1. Presigned URL 발급
  const { data } = await api.get<PresignedUrlResponse>({
    path: ENDPOINTS.IMAGES_PRESIGNED_URL,
    params: { bucket: 'tracking-photos', filename },
  });

  // 2. MinIO에 직접 PUT (서명된 URL이므로 Authorization 헤더 불필요)
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', data.uploadUrl);
    xhr.setRequestHeader('Content-Type', 'image/jpeg');
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`이미지 업로드 실패: ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error('네트워크 오류'));
    xhr.send({ uri, type: 'image/jpeg', name: filename } as any);
  });

  return data.imageUrl;
}
