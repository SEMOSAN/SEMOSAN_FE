import type { Coord } from "@mj-studio/react-native-naver-map";

/**
 * API의 polyline 문자열(GeoJSON LineString JSON)을
 * 네이버맵 Coord 배열로 변환합니다.
 *
 * 예시 polyline 값:
 *   '{"type":"LineString","coordinates":[[127.0,37.5],[127.1,37.6]]}'
 *
 * GeoJSON coordinates 순서: [longitude, latitude]
 */
export function parseCoursePolyline(
  polyline: string | object | null | undefined,
): Coord[] {
  if (!polyline) return [];
  try {
    // API가 문자열로 줄 수도, 이미 파싱된 객체로 줄 수도 있음
    const geojson =
      typeof polyline === "string" ? JSON.parse(polyline) : polyline;
    if (geojson?.type === "LineString" && Array.isArray(geojson.coordinates)) {
      return geojson.coordinates.map(([lng, lat]: [number, number]) => ({
        latitude: lat,
        longitude: lng,
      }));
    }
    console.warn(
      "[parseCoursePolyline] 예상과 다른 포맷:",
      JSON.stringify(geojson)?.slice(0, 100),
    );
  } catch {
    console.warn("[parseCoursePolyline] polyline 파싱 실패");
  }
  return [];
}

/**
 * 이동 평균으로 좌표 배열을 부드럽게 만듭니다.
 * 시작/종료점은 고정해 출발·도착 마커 위치가 틀어지지 않게 합니다.
 *
 * @param coords  원본 좌표 배열
 * @param window  평균 낼 이웃 좌표 수 (클수록 더 부드럽고 더 느슨해짐)
 */
export function smoothCourseCoords(coords: Coord[], window = 7): Coord[] {
  if (coords.length < 3) return coords;
  const half = Math.floor(window / 2);
  return coords.map((point, i) => {
    if (i === 0 || i === coords.length - 1) return point;
    const start = Math.max(0, i - half);
    const end = Math.min(coords.length - 1, i + half);
    const slice = coords.slice(start, end + 1);
    return {
      latitude: slice.reduce((s, c) => s + c.latitude, 0) / slice.length,
      longitude: slice.reduce((s, c) => s + c.longitude, 0) / slice.length,
    };
  });
}
