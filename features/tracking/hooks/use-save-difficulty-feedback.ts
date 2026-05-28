import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

type Comparison = 'SIMILAR' | 'EASIER' | 'HARDER';

type Params = {
  hikingRecordId: number;
  comparison: Comparison;
};

export function useSaveDifficultyFeedback() {
  return useMutation({
    mutationFn: async ({ hikingRecordId, comparison }: Params) => {
      const res = await api.post({
        path: `/api/hiking-records/${hikingRecordId}/difficulty-feedback`,
        body: { comparison },
      });
      return res.data;
    },
  });
}
