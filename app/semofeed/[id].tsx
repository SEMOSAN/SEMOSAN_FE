import { colors } from "@/constants/colors";
import { FeedCellDetail } from "@/features/home/components/feed-cell-detail";
import { useSemofeedItem } from "@/features/home/hooks/use-semofeed-item";
import { ApiError } from "@/lib/api";
import { toast } from "@/store/toast.store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

/** 알림함/푸시 딥링크의 도착지. 조회 후 기존 피드 상세 모달을 그대로 띄운다. */
export default function SemofeedDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const semoFeedId = Number(id);
  const isValidId = Number.isFinite(semoFeedId);
  const closedRef = useRef(false);

  const { data, error, isFetching, refetch } = useSemofeedItem(
    isValidId ? semoFeedId : undefined,
  );

  const close = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    // 앱이 종료된 상태에서 딥링크로 열리면 뒤로 갈 스택이 없다
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  }, [router]);

  // 비공개(403)·삭제(404)만 되돌릴 수 없다.
  // 네트워크 오류나 5xx는 재시도하면 열릴 수 있으므로 화면을 닫지 않는다.
  const status = error instanceof ApiError ? error.statusCode : undefined;
  const shouldClose = !isValidId || status === 403 || status === 404;

  useEffect(() => {
    if (!shouldClose) return;
    toast.show("삭제되었거나 볼 수 없는 게시물이에요.", { type: "error" });
    close();
  }, [shouldClose, close]);

  if (data) {
    return <FeedCellDetail item={data} onClose={close} />;
  }

  if (error && !shouldClose) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-black/80">
        <Text className="text-label-normal-inverse typo-body-1-normal-medium">
          게시물을 불러오지 못했어요
        </Text>
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => refetch()}
            disabled={isFetching}
            className="rounded-full bg-white/20 px-5 py-3"
          >
            <Text className="text-label-normal-inverse typo-body-2-normal-semi-bold">
              {isFetching ? "불러오는 중..." : "다시 시도"}
            </Text>
          </Pressable>
          <Pressable onPress={close} className="rounded-full px-5 py-3">
            <Text className="typo-body-2-normal-medium text-label-subtler-inverse">
              닫기
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-black/80">
      <ActivityIndicator size="large" color={colors.common["100"]} />
    </View>
  );
}
