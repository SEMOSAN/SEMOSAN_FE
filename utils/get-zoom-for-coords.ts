type Coord = { latitude: number; longitude: number };

export function getZoomForCoords(coords: Coord[], paddingFactor = 1.5): number {
  if (coords.length < 2) return 14;

  let minLat = coords[0].latitude;
  let maxLat = coords[0].latitude;
  let minLng = coords[0].longitude;
  let maxLng = coords[0].longitude;

  for (let i = 1; i < coords.length; i++) {
    const { latitude, longitude } = coords[i];
    if (latitude < minLat) minLat = latitude;
    if (latitude > maxLat) maxLat = latitude;
    if (longitude < minLng) minLng = longitude;
    if (longitude > maxLng) maxLng = longitude;
  }

  const latSpan = (maxLat - minLat) * paddingFactor;
  const lngSpan = (maxLng - minLng) * paddingFactor;
  const maxSpan = Math.max(latSpan, lngSpan);

  // 줌 1 당 위도 span ≈ 360 / 2^zoom (메르카토르 근사)
  const zoom = Math.log2(360 / maxSpan) - 1;

  return Math.min(Math.max(Math.round(zoom), 6), 18);
}
