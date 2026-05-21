import { api } from '@/lib/api';
import { ENDPOINTS } from '@/types/api.generated';

type PresignedUrlResponse = {
  uploadUrl: string;
  imageUrl: string;
};

export async function uploadImage(uri: string, filename: string): Promise<string> {
  // HEIC/HEIF → jpg로 변환 (S3 허용 확장자만 가능)
  const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
  const safeFilename = safeExt === ext ? filename : filename.replace(/\.[^.]+$/, '.jpg');
  const mimeType = safeExt === 'png' ? 'image/png' : safeExt === 'webp' ? 'image/webp' : 'image/jpeg';

  // 1. Presigned URL 발급
  console.log('[Upload] presigned URL 요청:', safeFilename);
  const { data } = await api.get<PresignedUrlResponse>({
    path: ENDPOINTS.IMAGES_PRESIGNED_URL,
    params: { bucket: 'posts', filename: safeFilename },
  });
  console.log('[Upload] presigned URL 발급 완료:', data.imageUrl);

  // 2. XMLHttpRequest로 바이너리 PUT 업로드
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', data.uploadUrl);
    xhr.onload = () => {
      console.log('[Upload] PUT 결과:', xhr.status);
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`이미지 업로드 실패: ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error('네트워크 오류'));
    xhr.send({ uri, type: mimeType, name: safeFilename } as any);
  });

  // 3. 최종 이미지 URL 반환
  return data.imageUrl;
}
