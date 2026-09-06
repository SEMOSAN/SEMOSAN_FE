import { api } from "@/lib/api";
import { optimizeImageForUpload } from "@/lib/optimize-image";
import { ENDPOINTS } from "@/types/api.generated";

type PresignedUrlResponse = {
  uploadUrl: string;
  imageUrl: string;
  /** 서명에 포함된 Content-Type. 이 값과 다른 헤더로 PUT하면 SignatureDoesNotMatch. */
  contentType?: string;
};

// 압축 결과는 항상 jpg이므로, 서버가 contentType을 아직 안 내려줄 때의 기준값
const DEFAULT_CONTENT_TYPE = "image/jpeg";

export async function uploadImage(
  uri: string,
  filename: string,
  bucket: string = "posts",
): Promise<string> {
  // 압축 결과는 항상 jpg로 재인코딩되므로 확장자/mime도 jpg로 통일
  // (확장자가 없는 filename도 대비해 basename만 뽑아 항상 .jpg를 붙임)
  const optimizedUri = await optimizeImageForUpload(uri);
  const baseName = filename.replace(/\.[^./]+$/, "");
  const safeFilename = `${baseName}.jpg`;

  const { data } = await api.get<PresignedUrlResponse>({
    path: ENDPOINTS.IMAGES_PRESIGNED_URL,
    params: { bucket, filename: safeFilename },
  });

  const contentType = data.contentType ?? DEFAULT_CONTENT_TYPE;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", data.uploadUrl);
    // Presigned URL 서명에 Content-Type이 포함되므로 발급 응답의 값을 그대로 실어야 한다.
    // Android는 uri 바디를 보낼 때 이 헤더가 없으면 요청 자체가 실패한다.
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`이미지 업로드 실패: ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("네트워크 오류"));
    xhr.send({
      uri: optimizedUri,
      type: contentType,
      name: safeFilename,
    } as any);
  });

  return data.imageUrl;
}
