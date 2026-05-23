import { CameraIcon } from '@/components/icons/camera-icon';
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
      className="flex-row items-center gap-2 self-start mx-4 px-4 py-2 bg-label-normal rounded-full"
      style={{ maxWidth: '90%' }}
    >
      <CameraIcon size={16} color="#ffffff" />
      <Text className="typo-caption-1-medium text-common-100" numberOfLines={1}>
        {formatDistance(milestoneDistance)} 돌파! 인증 사진을 남겨보세요!
      </Text>
    </View>
  );
}
