import { api } from "@/lib/api";
import {
  ENDPOINTS,
  PageResponseMountainListResponse,
} from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

async function searchMountains(
  keyword: string,
): Promise<PageResponseMountainListResponse> {
  const res = await api.get<PageResponseMountainListResponse>({
    path: ENDPOINTS.MOUNTAINS_SEARCH,
    params: { keyword, size: 100 },
  });
  return res.data;
}

export function useMountainSearch(keyword: string) {
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  return useQuery({
    queryKey: [ENDPOINTS.MOUNTAINS_SEARCH, debouncedKeyword],
    queryFn: () => searchMountains(debouncedKeyword),
    enabled: debouncedKeyword.trim().length > 0,
  });
}
