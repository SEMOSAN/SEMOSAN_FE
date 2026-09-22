import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";

// 클라이언트는 업로드 전 항상 jpg로 재인코딩하므로, 서버가 contentType을
// 아직 내려주지 않는 동안 쓰는 기준값
const DEFAULT_CONTENT_TYPE = "image/jpeg";

type PresignedUrlResponse = {
  uploadUrl: string;
  imageUrl: string;
  contentType?: string;
};

export type PresignedUpload = {
  uploadUrl: string;
  imageUrl: string;
  /** 서명에 포함된 값이라, PUT의 Content-Type 헤더로 그대로 실어야 한다.
   *  없거나 다르면 SignatureDoesNotMatch로 업로드가 실패한다. */
  contentType: string;
};

export async function requestPresignedUrl(
  bucket: string,
  filename: string,
): Promise<PresignedUpload> {
  const { data } = await api.get<PresignedUrlResponse>({
    path: ENDPOINTS.IMAGES_PRESIGNED_URL,
    params: { bucket, filename },
  });

  return {
    uploadUrl: data.uploadUrl,
    imageUrl: data.imageUrl,
    contentType: data.contentType ?? DEFAULT_CONTENT_TYPE,
  };
}
