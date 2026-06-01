import { useHikingSummary } from "@/features/mypage/hooks/use-hiking-summary";
import { Text, View } from "react-native";

export function HikingStatsCard() {
  const { data } = useHikingSummary();

  return (
    <View className="mb-3 flex-row rounded-2xl bg-fill-strong px-2 py-[22px]">
      <StatItem
        label="누적 등산 횟수"
        value={`${data?.totalHikingCount ?? 0}회`}
      />
      <Divider />
      <StatItem
        label="정복한 산"
        value={`${data?.conqueredMountainCount ?? 0}개`}
      />
      <Divider />
      <StatItem
        label="누적 등산 고도"
        value={`${Math.round(data?.totalAltitude ?? 0)}m`}
      />
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center gap-1">
      <Text className="text-label-alternative typo-caption-1-medium">
        {label}
      </Text>
      <Text className="text-label-normal typo-headline-1-semi-bold">
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  return <View className="w-px self-stretch bg-line-subtle opacity-50" />;
}
