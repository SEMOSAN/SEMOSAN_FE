type Coord = { latitude: number; longitude: number };

function haversineDistance(a: Coord, b: Coord): number {
  const R = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function calcCourseProgress(
  currentPos: Coord,
  coordinates: Coord[],
  totalDistance: number
): { progress: number; remainingMeters: number } {
  if (coordinates.length === 0) {
    return { progress: 0, remainingMeters: totalDistance };
  }

  let minDist = Infinity;
  let closestIdx = 0;
  for (let i = 0; i < coordinates.length; i++) {
    const d = haversineDistance(currentPos, coordinates[i]);
    if (d < minDist) {
      minDist = d;
      closestIdx = i;
    }
  }

  let traveled = 0;
  for (let i = 0; i < closestIdx; i++) {
    traveled += haversineDistance(coordinates[i], coordinates[i + 1]);
  }

  const progress = Math.min(traveled / totalDistance, 1);
  const remainingMeters = Math.max(0, totalDistance - traveled);
  return { progress, remainingMeters };
}
