import { api } from "@/lib/api";
import { ENDPOINTS, TrackingTrackResponse } from "@/types/api.generated";

export type LatLng = { latitude: number; longitude: number };

/**
 * GeoJSON LineString 문자열을 좌표 배열로 파싱.
 * GeoJSON 좌표 순서는 [경도, 위도]이므로 뒤집어서 매핑한다.
 */
export function parseGeoJsonTrack(track?: string): LatLng[] {
  if (!track) return [];
  try {
    const geo = JSON.parse(track) as { coordinates?: [number, number][] };
    const coords = geo.coordinates ?? [];
    return coords
      .filter(
        (c): c is [number, number] =>
          Array.isArray(c) &&
          c.length >= 2 &&
          typeof c[0] === "number" &&
          typeof c[1] === "number",
      )
      .map(([lng, lat]) => ({ latitude: lat, longitude: lng }));
  } catch {
    return [];
  }
}

/**
 * 세션의 저장된 이동 경로를 서버에서 조회해 좌표 배열로 반환한다.
 * 앱 재실행/강제 종료 후 지도에 경로를 다시 그릴 때 사용.
 * 저장 점이 없거나(0~1개) 실패(403/404 등) 시 빈 배열(fail-open).
 */
export async function fetchSessionTrack(sessionId: number): Promise<LatLng[]> {
  try {
    const res = await api.get<TrackingTrackResponse>({
      path: ENDPOINTS.TRACKING_SESSIONS_BY_SESSIONID_TRACK(sessionId),
    });
    return parseGeoJsonTrack(res.data?.track);
  } catch {
    return [];
  }
}
