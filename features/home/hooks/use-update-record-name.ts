import { api } from "@/lib/api";
import {
  ENDPOINTS,
  UpdateHikingRecordNameResponse,
} from "@/types/api.generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HikingRecordDetail } from "./use-hiking-record-detail";

type UpdateRecordNameParams = {
  hikingRecordId: number;
  name: string;
};

export function useUpdateRecordName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      hikingRecordId,
      name,
    }: UpdateRecordNameParams): Promise<UpdateHikingRecordNameResponse> => {
      const res = await api.patch<UpdateHikingRecordNameResponse>({
        path: ENDPOINTS.HIKING_RECORDS_BY_HIKINGRECORDID(hikingRecordId),
        body: { name },
      });
      return res.data;
    },
    onSuccess: (data, { hikingRecordId, name }) => {
      const nextName = data?.recordName ?? name;
      // 상세는 곧바로 갱신해 화면이 깜빡이지 않게 하고,
      queryClient.setQueryData<HikingRecordDetail>(
        ["hikingRecordDetail", hikingRecordId],
        (prev) => (prev ? { ...prev, recordName: nextName } : prev),
      );
      // 산별 기록 목록은 캐시된 산이 여럿일 수 있어 경로 접두사로 모두 무효화한다
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return (
            typeof key === "string" &&
            key.startsWith(ENDPOINTS.HIKING_RECORDS_ME_MOUNTAINS)
          );
        },
      });
    },
  });
}
