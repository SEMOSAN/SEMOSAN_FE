import { api } from "@/lib/api";
import {
  ENDPOINTS,
  SemoFeedEmojiRequest,
  SemoFeedEmojiToggleResponse,
} from "@/types/api.generated";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

type ToggleEmojiVariables = {
  semoFeedId: number;
  emojiType: SemoFeedEmojiRequest["emojiType"];
};

export function useToggleSemofeedEmoji(): UseMutationResult<
  Awaited<ReturnType<typeof api.post<SemoFeedEmojiToggleResponse>>>,
  Error,
  ToggleEmojiVariables
> {
  return useMutation({
    mutationFn: ({ semoFeedId, emojiType }: ToggleEmojiVariables) =>
      api.post<SemoFeedEmojiToggleResponse>({
        path: ENDPOINTS.SEMOFEED_BY_SEMOFEEDID_EMOJIS(semoFeedId),
        body: { emojiType },
      }),
  });
}
