import { CameraIcon } from '@/components/icons/camera-icon';
import { CloseSmallIcon } from '@/components/icons/close-small-icon';
import { Text, TouchableOpacity, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { TRACKING_TIMER_STYLE, formatElapsedTime } from '../constants';

const TOOLTIP_BG = '#4ADE80';
const TOOLTIP_TAIL_OVERLAP = 10;

type Props = {
  elapsedSeconds: number;
  showTooltip: boolean;
  onDismissTooltip: () => void;
  onStop: () => void;
};

export function TrackingSheet({ elapsedSeconds, showTooltip, onDismissTooltip, onStop }: Props) {
  return (
    <View
      className="w-full bg-fill-normal overflow-hidden"
      style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
    >
      {/* 핸들 — chevron 아이콘 */}
      <View className="items-center pt-3 pb-1">
        <Svg width={23} height={9} viewBox="0 0 23 9" fill="none">
          <Path
            d="M21.5 1.49988L11.4972 7.50195L1.5 1.49988"
            stroke="#D1D5DB"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>

      {/* 등산 시간 + 타이머 */}
      <View className="items-center py-3">
        <Text className="typo-caption-1-medium text-label-subtler">등산 시간</Text>
        <Text className="text-label-normal" style={TRACKING_TIMER_STYLE}>
          {formatElapsedTime(elapsedSeconds)}
        </Text>
      </View>

      {/* 툴팁 + 버튼 영역 */}
      <View className="px-4 pb-4 gap-2">

        {showTooltip && (
          <View style={{ alignItems: 'flex-start', marginLeft: 25 }}>
            <View
              className="flex-row items-center justify-center gap-2"
              style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: TOOLTIP_BG }}
            >
              <Text className="typo-caption-1-medium text-label-normal">500m마다 활성화돼요!</Text>
              <TouchableOpacity onPress={onDismissTooltip}>
                <CloseSmallIcon size={16} color="#1A1B1F" />
              </TouchableOpacity>
            </View>

            <Svg
              width={11}
              height={20}
              viewBox="0 0 11 20"
              style={{ marginTop: -TOOLTIP_TAIL_OVERLAP }}
            >
              <Path d="M0 20L7.94781e-07 -2.869e-06L11 10L0 20Z" fill={TOOLTIP_BG} />
            </Svg>
          </View>
        )}

        {/* 카메라 + 기록 중단 */}
        <View className="flex-row gap-2">
          <TouchableOpacity className="w-12 h-12 rounded-full bg-fill-normal border border-line-normal items-center justify-center">
            <CameraIcon />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 h-12 bg-label-normal rounded-[10px] items-center justify-center"
            onPress={onStop}
          >
            <Text className="typo-label-large text-common-100">기록 중단</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
