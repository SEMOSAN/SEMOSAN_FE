import { FreeBoardDetailScreen } from "@/features/community/components/free-board-detail-screen";
import { useLocalSearchParams } from "expo-router";

export default function FreeBoardDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <FreeBoardDetailScreen postId={Number(id)} />;
}
