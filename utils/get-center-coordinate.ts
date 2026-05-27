type Coord = { latitude: number; longitude: number };

export function getCenterCoordinate(coords: Coord[]): Coord | null {
  if (!coords || coords.length === 0) return null;
  if (coords.length === 1) return coords[0];

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

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
  };
}
