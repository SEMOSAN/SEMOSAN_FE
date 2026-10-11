import { api } from "@/lib/api";
import {
  ENDPOINTS,
  LikedMountainResponse,
  MountainDetailResponse,
  MountainLikeToggleResponse,
  PageResponseLikedMountainResponse,
  PageResponseMountainListResponse,
} from "@/types/api.generated";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRef } from "react";

export const LIKES_KEY = [ENDPOINTS.MOUNTAINS_LIKES] as const;

export async function getLikedMountains(): Promise<PageResponseLikedMountainResponse> {
  const res = await api.get<PageResponseLikedMountainResponse>({
    path: ENDPOINTS.MOUNTAINS_LIKES,
  });
  return res.data;
}

/**
 * likedByMe를 함께 내려주는 산 목록 응답들.
 * 추천·지도 응답에는 likedByMe가 없어 대상이 아니다.
 */
const MOUNTAIN_LIST_ENDPOINTS: string[] = [
  ENDPOINTS.MOUNTAINS,
  ENDPOINTS.MOUNTAINS_SEARCH,
];

function isMountainListQuery(query: { queryKey: readonly unknown[] }): boolean {
  const [endpoint] = query.queryKey;
  return (
    typeof endpoint === "string" && MOUNTAIN_LIST_ENDPOINTS.includes(endpoint)
  );
}

function detailKey(mountainId: number) {
  return [ENDPOINTS.MOUNTAINS_BY_MOUNTAINID(mountainId)] as const;
}

type LikeCacheSnapshot = [readonly unknown[], unknown][];

function snapshotLikeCaches(
  queryClient: QueryClient,
  mountainId: number,
): LikeCacheSnapshot {
  return [
    ...queryClient.getQueriesData({ queryKey: detailKey(mountainId) }),
    ...queryClient.getQueriesData({ queryKey: LIKES_KEY }),
    ...queryClient.getQueriesData({ predicate: isMountainListQuery }),
  ];
}

function restoreLikeCaches(
  queryClient: QueryClient,
  snapshot: LikeCacheSnapshot,
): void {
  for (const [queryKey, data] of snapshot) {
    queryClient.setQueryData(queryKey, data);
  }
}

/**
 * 좋아요 상태를 보여줄 수 있는 모든 캐시에 반영한다.
 * 하트는 각 응답의 likedByMe를 그대로 읽으므로, 저장 목록을 다시 받아오지 않아도
 * 화면이 즉시 맞는 상태가 된다.
 */
function writeLikeState(
  queryClient: QueryClient,
  mountainId: number,
  liked: boolean,
  mountainData?: LikedMountainResponse,
): void {
  // 상세 — 하트의 1차 소스
  queryClient.setQueryData<MountainDetailResponse>(
    detailKey(mountainId),
    (old) =>
      old?.mountain
        ? { ...old, mountain: { ...old.mountain, likedByMe: liked } }
        : old,
  );

  // 목록·검색 — 같은 산이 담긴 페이지만 갱신
  queryClient.setQueriesData<PageResponseMountainListResponse>(
    { predicate: isMountainListQuery },
    (old) => {
      if (!old?.content?.some((m) => m.mountainId === mountainId)) return old;
      return {
        ...old,
        content: old.content.map((m) =>
          m.mountainId === mountainId ? { ...m, likedByMe: liked } : m,
        ),
      };
    },
  );

  // 저장한 산 목록
  queryClient.setQueryData<PageResponseLikedMountainResponse>(
    LIKES_KEY,
    (old) => {
      if (!old) return old;
      const content = old.content ?? [];
      const alreadyIn = content.some((m) => m.mountainId === mountainId);
      const total = old.totalElements ?? content.length;

      if (!liked) {
        if (!alreadyIn) return old;
        return {
          ...old,
          content: content.filter((m) => m.mountainId !== mountainId),
          totalElements: Math.max(0, total - 1),
        };
      }

      // 서버가 created_at DESC로 내려주므로 새로 누른 산은 맨 앞에 온다.
      if (alreadyIn || !mountainData?.name) return old;
      return {
        ...old,
        content: [mountainData, ...content],
        totalElements: total + 1,
      };
    },
  );
}

/**
 * 산 좋아요 토글.
 *
 * `liked`는 화면이 받은 서버 응답의 likedByMe를 그대로 넘긴다.
 * 저장 목록(`GET /api/mountains/likes`)은 기본 page size가 10이라
 * 그 목록으로 좋아요 여부를 판정하면 11번째 이후 산이 꺼진 채 보인다.
 */
export function useMountainBookmark(
  mountainId: number,
  liked: boolean,
  mountainData?: LikedMountainResponse,
) {
  const queryClient = useQueryClient();
  const inFlight = useRef(false);

  const toggleLike = useMutation({
    // POST 하나로 토글된다. 응답의 liked가 서버 확정 상태.
    mutationFn: async (next: boolean) => {
      const res = await api.post<MountainLikeToggleResponse>({
        path: ENDPOINTS.MOUNTAINS_BY_MOUNTAINID_LIKE(mountainId),
      });
      return res.data?.liked ?? next;
    },
    onMutate: async (next) => {
      // 진행 중인 refetch가 낙관적 반영을 덮어쓰지 않게 먼저 끊는다.
      await Promise.all([
        queryClient.cancelQueries({ queryKey: detailKey(mountainId) }),
        queryClient.cancelQueries({ queryKey: LIKES_KEY }),
      ]);
      const snapshot = snapshotLikeCaches(queryClient, mountainId);
      writeLikeState(queryClient, mountainId, next, mountainData);
      return { snapshot };
    },
    onSuccess: (serverLiked) => {
      // 서버 확정 상태로 한 번 더 고정한다. 목록 refetch 없이 여기서 끝난다.
      writeLikeState(queryClient, mountainId, serverLiked, mountainData);
    },
    onError: (_err, _next, context) => {
      if (context) restoreLikeCaches(queryClient, context.snapshot);
    },
    onSettled: () => {
      inFlight.current = false;
    },
  });

  // isPending은 렌더 시점 값이라 같은 프레임에 두 번 눌리면 둘 다 통과한다.
  // 요청이 겹치지 않게 ref로 동기적으로 잠근다.
  function toggle(): void {
    if (inFlight.current) return;
    inFlight.current = true;
    toggleLike.mutate(!liked);
  }

  return { isBookmarked: liked, isPending: toggleLike.isPending, toggle };
}
