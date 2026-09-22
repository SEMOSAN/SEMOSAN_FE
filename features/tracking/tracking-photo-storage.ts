import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api";
import { ENDPOINTS, TrackingPhotoResponse } from "@/types/api.generated";

/** 레일에 보여줄 인증 사진 한 장 */
export type TrackingPhoto = {
  milestoneIndex: number;
  /** 촬영 직후의 기기 파일. 캐시가 비워지면 없을 수 있어 imageUrl로 폴백한다 */
  localUri?: string;
  /** 서버 업로드 URL */
  imageUrl: string;
};

const storageKey = (sessionId: number) => `tracking-photos:${sessionId}`;

export async function getLocalTrackingPhotos(
  sessionId: number,
): Promise<TrackingPhoto[]> {
  try {
    const json = await AsyncStorage.getItem(storageKey(sessionId));
    return json ? (JSON.parse(json) as TrackingPhoto[]) : [];
  } catch {
    return [];
  }
}

export async function addLocalTrackingPhoto(
  sessionId: number,
  photo: TrackingPhoto,
): Promise<void> {
  try {
    const current = await getLocalTrackingPhotos(sessionId);
    await AsyncStorage.setItem(
      storageKey(sessionId),
      JSON.stringify([...current, photo]),
    );
  } catch (e) {
    console.warn("[TrackingPhoto] 로컬 저장 실패:", e);
  }
}

export async function clearLocalTrackingPhotos(
  sessionId: number,
): Promise<void> {
  try {
    await AsyncStorage.removeItem(storageKey(sessionId));
  } catch {
    // 정리 실패는 무시 — 다음 세션에 영향 없음
  }
}

/**
 * 세션의 인증 사진을 복원한다. 서버 목록이 기준(재설치·다른 기기 대비)이고,
 * 로컬에 같은 imageUrl이 있으면 기기 파일(localUri)을 붙여 즉시 표시한다.
 */
export async function restoreTrackingPhotos(
  sessionId: number,
): Promise<TrackingPhoto[]> {
  const local = await getLocalTrackingPhotos(sessionId);
  let server: TrackingPhotoResponse[] = [];
  try {
    const res = await api.get<TrackingPhotoResponse[]>({
      path: ENDPOINTS.TRACKING_SESSIONS_BY_SESSIONID_PHOTOS(sessionId),
    });
    server = res.data ?? [];
  } catch {
    // 오프라인이면 로컬만으로 보여준다
    return local;
  }
  const localByUrl = new Map(local.map((p) => [p.imageUrl, p]));
  return server
    .filter(
      (p): p is TrackingPhotoResponse & { imageUrl: string } => !!p.imageUrl,
    )
    .sort((a, b) => (a.milestoneIndex ?? 0) - (b.milestoneIndex ?? 0))
    .map((p) => ({
      milestoneIndex: p.milestoneIndex ?? 0,
      imageUrl: p.imageUrl,
      localUri: localByUrl.get(p.imageUrl)?.localUri,
    }));
}
