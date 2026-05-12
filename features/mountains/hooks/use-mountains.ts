import { api } from "@/lib/api";
import {
  ENDPOINTS,
  MountainListResponse,
  PageResponseMountainListResponse,
} from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";

export type { MountainListResponse };
export type MountainDifficulty = NonNullable<MountainListResponse["difficulty"]>;

type SortOrder = "ASC" | "DESC";
type MountainSortField = "name" | "altitude" | "difficulty" | "duration";

export type GetMountainsParams = {
  page?: number;
  size?: number;
  sort?: `${MountainSortField},${SortOrder}`;
};

async function getMountains({
  page = 0,
  size = 10,
  sort = "name,ASC",
}: GetMountainsParams = {}): Promise<PageResponseMountainListResponse> {
  const res = await api.get<PageResponseMountainListResponse>({
    path: ENDPOINTS.MOUNTAINS,
    params: { page, size, sort },
  });
  return res.data;
}

export function useMountains(params: GetMountainsParams = {}) {
  return useQuery({
    queryKey: ["mountains", params],
    queryFn: () => getMountains(params),
  });
}
