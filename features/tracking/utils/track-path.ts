export type Coord = { latitude: number; longitude: number };

const EARTH_RADIUS_M = 6371000;

const toRad = (d: number) => (d * Math.PI) / 180;

/** 두 좌표 간 거리(m) — Haversine */
export function haversineMeters(a: Coord, b: Coord): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/**
 * 이동 경로에 새 좌표를 남길지 판단한다.
 * GPS는 정지 중에도 계속 좌표를 뱉으므로, 일정 거리 이상 움직였을 때만 남겨
 * 경로 배열이 무한히 커지는 것을 막는다.
 */
export function shouldAppendCoord(
  last: Coord | null,
  next: Coord,
  minMeters: number,
): boolean {
  if (!last) return true;
  return haversineMeters(last, next) >= minMeters;
}

/** 좌표 배열의 총 이동 거리(m) */
export function totalPathMeters(coords: Coord[]): number {
  return coords.reduce(
    (total, coord, i) =>
      i === 0 ? 0 : total + haversineMeters(coords[i - 1], coord),
    0,
  );
}
