import { FreeBoardDetailScreen } from "@/features/community/components/free-board-detail-screen";
import {
  MOCK_COMMENTS,
  MOCK_POST_DETAIL,
} from "@/features/community/constants/mock-post-detail";
import { Stack } from "expo-router";
import React from "react";

export default function FreeBoardDetailPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <FreeBoardDetailScreen
        post={MOCK_POST_DETAIL}
        commentList={MOCK_COMMENTS}
      />
    </>
  );
}
