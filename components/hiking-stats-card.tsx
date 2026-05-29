import { Text, View } from "react-native";
import { useHikingSummary } from "@/features/mypage/hooks/use-hiking-summary";

export function HikingStatsCard() {
  const { data } = useHikingSummary();

  return (
    <View className="bg-fill-strong rounded-2xl px-2 py-[22px] flex-row mx-2 mb-3">
      <StatItem label="누적 등산 횟수" value={`${data?.totalHikingCount ?? 0}회`} />
      <Divider />
      <StatItem label="정복한 산" value={`${data?.conqueredMountainCount ?? 0}개`} />
      <Divider />
      <StatItem label="누적 등산 고도" value={`${Math.round(data?.totalAltitude ?? 0)}Nm`} />
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center gap-1">
      <Text className="typo-caption-1-medium text-label-alternative">{label}</Text>
      <Text className="typo-headline-1-semi-bold text-label-normal">{value}</Text>
    </View>
  );
}

function Divider() {
  return <View className="w-px bg-line-subtle self-stretch opacity-50" />;
}
