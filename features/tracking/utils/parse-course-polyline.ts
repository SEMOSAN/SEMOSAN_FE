import type { Coord } from '@mj-studio/react-native-naver-map';

/**
 * API의 polyline 문자열(GeoJSON LineString JSON)을
 * 네이버맵 Coord 배열로 변환합니다.
 *
 * 예시 polyline 값:
 *   '{"type":"LineString","coordinates":[[127.0,37.5],[127.1,37.6]]}'
 *
 * GeoJSON coordinates 순서: [longitude, latitude]
 */
export function parseCoursePolyline(polyline: string | null | undefined): Coord[] {
  if (!polyline) return [];
  try {
    const geojson = JSON.parse(polyline);
    if (geojson?.type === 'LineString' && Array.isArray(geojson.coordinates)) {
      return geojson.coordinates.map(([lng, lat]: [number, number]) => ({
        latitude: lat,
        longitude: lng,
      }));
    }
  } catch {
    console.warn('[parseCoursePolyline] polyline 파싱 실패:', polyline?.slice(0, 100));
  }
  return [];
}
