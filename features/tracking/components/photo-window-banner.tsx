import { HikerIcon } from '@/components/icons/hiker-icon';
import { Text, View } from 'react-native';

type Props = {
  milestoneDistance: number;
};

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)}km`;
  return `${meters}m`;
}

export function PhotoWindowBanner({ milestoneDistance }: Props) {
  return (
    <View
      className="flex-row items-center bg-fill-heavy rounded-xl"
      style={{
        width: 262,
        height: 48,
        paddingVertical: 10,
        paddingHorizontal: 16,
        gap: 8,
      }}
    >
      <HikerIcon width={18} height={16} color="#ffffff" />
      <Text className="typo-body-2-normal-medium text-common-100" numberOfLines={1}>
        {formatDistance(milestoneDistance)} 돌파! 인증 사진을 남겨보세요!
      </Text>
    </View>
  );
}
