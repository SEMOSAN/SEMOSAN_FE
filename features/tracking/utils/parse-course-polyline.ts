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
export function parseCoursePolyline(polyline: string | object | null | undefined): Coord[] {
  if (!polyline) return [];
  try {
    // API가 문자열로 줄 수도, 이미 파싱된 객체로 줄 수도 있음
    const geojson = typeof polyline === 'string' ? JSON.parse(polyline) : polyline;
    if (geojson?.type === 'LineString' && Array.isArray(geojson.coordinates)) {
      return geojson.coordinates.map(([lng, lat]: [number, number]) => ({
        latitude: lat,
        longitude: lng,
      }));
    }
    console.warn('[parseCoursePolyline] 예상과 다른 포맷:', JSON.stringify(geojson)?.slice(0, 100));
  } catch {
    console.warn('[parseCoursePolyline] polyline 파싱 실패');
  }
  return [];
}
