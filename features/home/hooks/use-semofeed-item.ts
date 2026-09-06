import { api } from "@/lib/api";
import { ENDPOINTS, SemoFeedResponse } from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";

/**
 * 세모피드 단건 조회. 알림(푸시/알림함)에서 해당 게시물로 이동할 때 사용한다.
 * 비공개 세모피드는 작성자 본인 외 403, 삭제된 경우 404.
 */
export function useSemofeedItem(semoFeedId: number | undefined) {
  return useQuery<SemoFeedResponse>({
    queryKey: [ENDPOINTS.SEMOFEED, "item", semoFeedId],
    enabled: semoFeedId != null,
    retry: false,
    queryFn: async () => {
      const res = await api.get<SemoFeedResponse>(
        { path: ENDPOINTS.SEMOFEED_BY_SEMOFEEDID(semoFeedId!) },
        // 403/404는 화면에서 안내 후 뒤로 가므로 공통 토스트는 끈다
        { ignoreErrorToast: true },
      );
      return res.data;
    },
  });
}
