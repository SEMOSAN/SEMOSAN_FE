import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export type MountainDifficulty = "EASY" | "NORMAL" | "HARD";

export type MountainListItem = {
  mountainId: number;
  name: string;
  address: string;
  altitude: number;
  difficulty: MountainDifficulty;
  duration: number;
  imageUrl: string;
  latitude: number;
  longitude: number;
};

type MountainsPage = {
  content: MountainListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type GetMountainsParams = {
  page?: number;
  size?: number;
  sort?: string;
};

async function getMountains({
  page = 0,
  size = 10,
  sort = "name,ASC",
}: GetMountainsParams = {}): Promise<MountainsPage> {
  const res = await api.get<MountainsPage>({
    path: "/api/mountains",
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
