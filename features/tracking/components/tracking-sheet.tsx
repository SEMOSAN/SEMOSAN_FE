import { CameraIcon } from '@/components/icons/camera-icon';
import { CloseSmallIcon } from '@/components/icons/close-small-icon';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { TRACKING_TIMER_STYLE, formatElapsedTime } from '../constants';

const TOOLTIP_BG = '#4ADE80';
const TOOLTIP_TAIL_OVERLAP = 10;

type Props = {
  elapsedSeconds: number;
  isPaused: boolean;
  showTooltip: boolean;
  /** 정상 인증 후 true → 라벨이 "하산까지"로 전환 */
  hasSummited: boolean;
  /** 정상/하산까지 남은 시간 */
  timeToTarget: string;
  /** 정상/하산까지 남은 거리 */
  distanceToTarget: string;
  onDismissTooltip: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onSummit: () => void;
};

export function TrackingSheet({
  elapsedSeconds,
  isPaused,
  showTooltip,
  hasSummited,
  timeToTarget,
  distanceToTarget,
  onDismissTooltip,
  onPause,
  onResume,
  onStop,
  onSummit,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const timeLabel = hasSummited ? '하산까지 시간' : '정상까지 시간';
  const distanceLabel = hasSummited ? '하산까지 거리' : '정상까지 거리';

  return (
    <View
      className="w-full bg-fill-normal overflow-hidden"
      style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
    >
      {/* 핸들 — 탭하면 펼침/접힘 */}
      <TouchableOpacity
        className="items-center pt-3 pb-1"
        onPress={() => setIsExpanded((v) => !v)}
        activeOpacity={0.7}
      >
        <Svg
          width={23}
          height={9}
          viewBox="0 0 23 9"
          fill="none"
          style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
        >
          <Path
            d="M21.5 1.49988L11.4972 7.50195L1.5 1.49988"
            stroke="#D1D5DB"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>

      {/* 등산 시간 + 타이머 */}
      <View className="items-center py-3">
        <Text className="typo-caption-1-medium text-label-subtler">등산 시간</Text>
        <Text className="text-label-normal" style={TRACKING_TIMER_STYLE}>
          {formatElapsedTime(elapsedSeconds)}
        </Text>
      </View>

      {/* 펼침 상태 — 정상/하산까지 시간 & 거리 */}
      {isExpanded && (
        <View className="border-t border-line-subtle flex-row">
          <View className="flex-1 items-center gap-1 py-3">
            <Text className="typo-caption-1-medium text-label-subtler">{timeLabel}</Text>
            <Text className="typo-body-1-normal-semi-bold text-label-normal">{timeToTarget}</Text>
          </View>

          <View className="w-px bg-line-subtle self-stretch" />

          {/* 거리 */}
          <View className="flex-1 items-center gap-1 py-3">
            <Text className="typo-caption-1-medium text-label-subtler">{distanceLabel}</Text>
            <Text className="typo-body-1-normal-semi-bold text-label-normal">{distanceToTarget}</Text>
          </View>
        </View>
      )}

      {/* 버튼 영역 */}
      <View className="px-4 pb-4 gap-2">

        {/* 말풍선 툴팁 — 트래킹 중(비일시정지)에만 표시 */}
        {!isPaused && showTooltip && (
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
            <Svg width={11} height={20} viewBox="0 0 11 20" style={{ marginTop: -TOOLTIP_TAIL_OVERLAP }}>
              <Path d="M0 20L7.94781e-07 -2.869e-06L11 10L0 20Z" fill={TOOLTIP_BG} />
            </Svg>
          </View>
        )}

        {/* 카메라 + 액션 버튼 */}
        <View className="flex-row gap-2">
          <TouchableOpacity className="w-12 h-12 rounded-full bg-fill-normal border border-line-normal items-center justify-center">
            <CameraIcon />
          </TouchableOpacity>

          {isPaused ? (
            <>
              {/* 일시 정지 상태: 다시 시작 + 기록 종료 */}
              <TouchableOpacity
                className="flex-1 bg-label-normal rounded-[10px] items-center justify-center"
                style={{ minHeight: 48, maxHeight: 48, paddingVertical: 11, paddingHorizontal: 20 }}
                onPress={onResume}
              >
                <Text className="typo-label-large text-common-100">다시 시작</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-fill-stronger rounded-[10px] items-center justify-center"
                style={{ minHeight: 48, maxHeight: 48, paddingVertical: 11, paddingHorizontal: 20 }}
                onPress={onStop}
              >
                <Text className="typo-label-large text-label-subtle">기록 종료</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* 트래킹 중: 일시 정지 + 정상 도착 */}
              <TouchableOpacity
                className="flex-1 bg-fill-stronger rounded-[10px] items-center justify-center"
                style={{ minHeight: 48, maxHeight: 48, paddingVertical: 11, paddingHorizontal: 20 }}
                onPress={onPause}
              >
                <Text className="typo-label-large text-label-subtle">일시 정지</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-secondary-normal rounded-[10px] items-center justify-center"
                style={{ minHeight: 48, maxHeight: 48, paddingVertical: 11, paddingHorizontal: 20 }}
                onPress={onSummit}
              >
                <Text className="typo-label-large text-label-normal">정상 도착</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
