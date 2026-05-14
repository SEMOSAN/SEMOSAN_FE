import { DifficultyOption } from "@/features/mountains/components/difficulty-bottom-sheet";
import { Selection } from "@/features/mountains/components/region-filter-content";
import { SortOption } from "@/features/mountains/components/sort-bottom-sheet";
import { MountainListResponse } from "@/types/api.generated";

const DIFFICULTY_MAP: Record<DifficultyOption, MountainListResponse["difficulty"]> = {
  high: "HARD",
  medium: "NORMAL",
  low: "EASY",
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

function getDistanceKm(from: Coordinates, to: Coordinates): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function filterByDifficulty(
  mountains: MountainListResponse[],
  options: DifficultyOption[]
): MountainListResponse[] {
  if (options.length === 0) return mountains;
  return mountains.filter((m) =>
    options.some((opt) => DIFFICULTY_MAP[opt] === m.difficulty)
  );
}

export function filterByRegions(
  mountains: MountainListResponse[],
  selections: Selection[]
): MountainListResponse[] {
  if (selections.length === 0) return mountains;
  return mountains.filter((m) =>
    selections.some(({ region, district }) => {
      const address = m.address ?? "";
      if (district.endsWith(" 전체")) return address.startsWith(region);
      return address.includes(district);
    })
  );
}

export function sortMountains(
  mountains: MountainListResponse[],
  option: SortOption,
  userLocation?: Coordinates
): MountainListResponse[] {
  const list = [...mountains];

  switch (option) {
    case "height":
      return list.sort((a, b) => (b.altitude ?? 0) - (a.altitude ?? 0));

    case "nearby":
      if (!userLocation) return list;
      return list.sort((a, b) => {
        const distA = getDistanceKm(userLocation, {
          latitude: a.latitude ?? 0,
          longitude: a.longitude ?? 0,
        });
        const distB = getDistanceKm(userLocation, {
          latitude: b.latitude ?? 0,
          longitude: b.longitude ?? 0,
        });
        return distA - distB;
      });

    case "popularity":
    default:
      return list;
  }
}
