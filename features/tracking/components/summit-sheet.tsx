import { Path, Svg } from 'react-native-svg';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  /** 정상 인증하기 */
  onCertify: () => void;
  /** 아직이에요 — 일정 시간 후 재표시 */
  onNotYet: () => void;
};

export function SummitSheet({ onCertify, onNotYet }: Props) {
  return (
    <View
      className="w-full bg-fill-normal"
      style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
    >
      {/* 핸들 */}
      <View className="items-center pt-3 pb-4">
        <View className="w-10 h-1 rounded-full bg-fill-neutral" />
      </View>

      {/* 텍스트 + 이미지 영역 */}
      <View className="px-4 gap-2">
        <Text className="typo-headline-1-semi-bold text-label-normal">
          정상에 도착했나요?
        </Text>
        <Text className="typo-body-1-normal-regular text-label-subtle">
          도착하셨다면 정상에서의 순간을 사진으로 남겨보세요.
        </Text>

        {/* 그래픽 영역 */}
        <View className="mt-2 items-center self-center">
          <Svg width={237} height={191} viewBox="0 0 237 191" fill="none">
            <Path
              d="M177.072 32.4094L177.27 32.4848C177.719 32.6854 178.081 33.0464 178.283 33.5008C178.513 34.0201 178.511 34.6131 178.279 35.1312L175.442 41.4413L203.091 50.4251C203.631 50.6006 204.071 50.9975 204.301 51.5166C204.531 52.0358 204.53 52.6289 204.297 53.1469L187.868 89.6997C187.449 90.6308 186.396 91.0974 185.425 90.7822L147.536 78.471C146.995 78.2954 146.555 77.8976 146.325 77.3783C146.095 76.859 146.097 76.2663 146.33 75.7483L149.165 69.4387L140.133 66.504L135.572 90.8784C135.466 91.4438 135.121 91.9358 134.627 92.2295C134.132 92.5232 133.535 92.5905 132.988 92.4128L125.574 90.004C124.619 89.6934 124.042 88.7211 124.227 87.7332L136.597 21.6323C136.703 21.0668 137.047 20.5736 137.542 20.2799C138.037 19.9861 138.634 19.9201 139.182 20.0979L177.072 32.4094Z"
              fill="#FF5249"
              stroke="#DC2626"
              strokeWidth={4}
              strokeLinejoin="round"
            />
            <Path
              d="M87.5289 73.0611C93.8001 72.551 99.7291 76.0821 104.566 81.7675C108.557 86.4592 111.972 92.7944 114.463 100.162C117.14 94.4616 121.202 90.347 126.518 89.6942C132.571 88.951 138.141 92.9824 142.298 98.9967C146.516 105.099 149.66 113.719 150.85 123.41C152.04 133.101 151.075 142.226 148.458 149.167C145.879 156.008 141.451 161.266 135.398 162.009C130.723 162.583 126.317 160.287 122.687 156.498C120.231 153.935 118.033 150.599 116.205 146.717C114.888 151.143 113.097 155.049 110.878 158.209C107.659 162.792 103.436 165.934 98.3933 166.553C93.6624 167.134 89.0881 165.384 85.0474 162.135C82.3565 159.971 79.8564 157.109 77.6177 153.711C77.0025 157.204 75.9738 160.361 74.5727 162.983C72.3825 167.082 69.1157 170.148 64.9017 170.665C59.7876 171.293 55.1427 167.969 51.7273 163.125C48.2572 158.203 45.6944 151.268 44.7391 143.488C43.784 135.709 44.5931 128.36 46.7693 122.745C48.9114 117.219 52.6141 112.87 57.7282 112.242C60.8997 111.852 63.8908 112.987 66.5173 115.054C66.2061 105.073 67.688 95.8976 70.5903 88.6881C73.9857 80.254 79.559 74.0269 86.9215 73.1229L87.5289 73.0611Z"
              fill="#00D864"
              stroke="#15803D"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </Svg>
        </View>
      </View>

      <View className="px-4 pt-4 pb-4 gap-2">
        {/* 정상 인증하기 */}
        <TouchableOpacity
          className="bg-label-normal rounded-[10px] items-center justify-center"
          style={{ height: 48 }}
          onPress={onCertify}
        >
          <Text className="typo-label-large text-common-100">정상 인증하기</Text>
        </TouchableOpacity>

        {/* 아직이에요 */}
        <TouchableOpacity
          className="bg-fill-stronger rounded-[10px] items-center justify-center"
          style={{ minHeight: 48, maxHeight: 48, paddingVertical: 11, paddingHorizontal: 20 }}
          onPress={onNotYet}
        >
          <Text className="typo-label-large text-label-normal">아직이에요</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
