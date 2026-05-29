import LottieView from 'lottie-react-native';
import { View } from 'react-native';

type Props = {
  /** true면 flex-1 + 중앙 정렬로 전체 화면 채움 */
  fullScreen?: boolean;
  size?: number;
};

export function LoadingSpinner({ fullScreen = false, size = 160 }: Props) {
  const animation = (
    <LottieView
      source={require('@/assets/animations/Spinner.json')}
      autoPlay
      loop
      style={{ width: size, height: size }}
    />
  );

  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center">
        {animation}
      </View>
    );
  }

  return animation;
}
