import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";

type PresignedUrlResponse = {
  uploadUrl: string;
  imageUrl: string;
};

export async function uploadImage(
  uri: string,
  filename: string,
  bucket: string = "posts",
): Promise<string> {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
  const safeFilename =
    safeExt === ext ? filename : filename.replace(/\.[^.]+$/, ".jpg");
  const mimeType =
    safeExt === "png"
      ? "image/png"
      : safeExt === "webp"
        ? "image/webp"
        : "image/jpeg";

  const { data } = await api.get<PresignedUrlResponse>({
    path: ENDPOINTS.IMAGES_PRESIGNED_URL,
    params: { bucket, filename: safeFilename },
  });

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", data.uploadUrl);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`이미지 업로드 실패: ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("네트워크 오류"));
    xhr.send({ uri, type: mimeType, name: safeFilename } as any);
  });

  return data.imageUrl;
}
