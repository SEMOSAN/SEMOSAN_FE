import { FeedCellDetail } from "@/features/home/components/feed-cell-detail";
import { useSemofeedItem } from "@/features/home/hooks/use-semofeed-item";
import { toast } from "@/store/toast.store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";

/**
 * 세모피드 단건 화면. 알림함/푸시 딥링크의 도착지로,
 * 단건 조회 후 기존 피드 상세 모달(FeedCellDetail)을 그대로 띄운다.
 */
export default function SemofeedDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const semoFeedId = Number(id);
  const isValidId = Number.isFinite(semoFeedId);
  const closedRef = useRef(false);

  const { data, isError } = useSemofeedItem(isValidId ? semoFeedId : undefined);

  const close = useCallback(() => {
    // 이펙트 재실행으로 화면이 두 장 닫히는 것을 막는다
    if (closedRef.current) return;
    closedRef.current = true;
    // 앱이 종료된 상태에서 딥링크로 바로 열리면 뒤로 갈 스택이 없다
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  }, [router]);

  // 잘못된 id, 비공개(403)·삭제(404) 등 조회 불가 시 안내 후 복귀
  const shouldClose = isError || !isValidId;
  useEffect(() => {
    if (!shouldClose) return;
    toast.show("삭제되었거나 볼 수 없는 게시물이에요.", { type: "error" });
    close();
  }, [shouldClose, close]);

  if (data) {
    return <FeedCellDetail item={data} onClose={close} />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-black/80">
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}
