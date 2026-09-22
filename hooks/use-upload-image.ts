import { optimizeImageForUpload } from "@/lib/optimize-image";
import { requestPresignedUrl } from "@/lib/presigned-upload";

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

  const { uploadUrl, imageUrl, contentType } = await requestPresignedUrl(
    bucket,
    safeFilename,
  );

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    // Android는 uri 바디를 보낼 때 이 헤더가 없으면 요청 자체가 실패한다
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

  return imageUrl;
}
