import { CameraIcon } from '@/components/icons/camera-icon';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';
import { TRACKING_TIMER_STYLE, formatElapsedTime } from '../constants';

const TOOLTIP_BG = '#2F323A'; // fill-heavy
const TOOLTIP_TAIL_OVERLAP = 10;

type Props = {
  elapsedSeconds: number;
  isPaused: boolean;
  showTooltip: boolean;
  /** 자유기록 모드 — true이면 토글 화살표·펼침 섹션 숨김 */
  isFreeMode?: boolean;
  /** 사진 윈도우 열림 여부 — 열리면 툴팁 문구가 "사진 기록을 남겨보세요!"로 전환 */
  isPhotoWindowOpen: boolean;
  /** 정상 인증 후 true → 라벨이 "하산까지"로 전환 */
  hasSummited: boolean;
  /** 정상/하산까지 남은 시간 */
  timeToTarget: string;
  /** 정상/하산까지 남은 거리 */
  distanceToTarget: string;
  onDismissTooltip: () => void;
  onCameraPress: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onSummit: () => void;
};

export function TrackingSheet({
  elapsedSeconds,
  isPaused,
  showTooltip,
  isFreeMode = false,
  isPhotoWindowOpen,
  hasSummited,
  timeToTarget,
  distanceToTarget,
  onDismissTooltip,
  onCameraPress,
  onPause,
  onResume,
  onStop,
  onSummit,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const insets = useSafeAreaInsets();

  const timeLabel = hasSummited ? '하산까지 시간' : '정상까지 시간';
  const distanceLabel = hasSummited ? '하산까지 거리' : '정상까지 거리';

  return (
    <View
      className="w-full bg-fill-normal overflow-hidden"
      style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, minHeight: 220 }}
    >
      {/* 핸들 — 자유기록이 아닐 때만 표시 (탭하면 펼침/접힘) */}
      {!isFreeMode ? (
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
      ) : (
        <View className="pt-3 pb-1" />
      )}

      {/* 등산 시간 + 타이머 */}
      <View className="items-center py-3">
        <Text className="typo-caption-1-medium text-label-subtler">등산 시간</Text>
        <Text className="text-label-normal" style={TRACKING_TIMER_STYLE}>
          {formatElapsedTime(elapsedSeconds)}
        </Text>
      </View>

      {/* 펼침 상태 — 정상/하산까지 시간 & 거리 (자유기록 제외) */}
      {!isFreeMode && isExpanded && (
        <View className="border-t border-line-subtle flex-row">
          <View className="flex-1 items-center gap-1 py-5">
            <Text className="typo-caption-1-medium text-label-subtler">{timeLabel}</Text>
            <Text className="typo-heading-1-semi-bold text-label-normal text-center">{timeToTarget}</Text>
          </View>

          <View className="w-px bg-line-subtle self-stretch" />

          <View className="flex-1 items-center gap-1 py-5">
            <Text className="typo-caption-1-medium text-label-subtler">{distanceLabel}</Text>
            <Text className="typo-heading-1-semi-bold text-label-normal text-center">{distanceToTarget}</Text>
          </View>
        </View>
      )}

      {/* 버튼 영역 — 툴팁은 absolute로 위에 띄워서 시트 높이 유지 */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: insets.bottom }}>

        {/* 말풍선 툴팁 — absolute로 버튼 위에 오버레이 */}
        {!isPaused && (isPhotoWindowOpen || showTooltip) && (
          <View style={{ position: 'absolute', bottom: insets.bottom + 48 + 4, left: 36, zIndex: 10 }}>
            <View
              className="flex-row items-center justify-center gap-2"
              style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: TOOLTIP_BG }}
            >
              <Text className="typo-caption-1-medium text-common-100">
                {isPhotoWindowOpen ? '사진 기록을 남겨보세요!' : '1/4 지점마다 카메라가 활성화돼요!'}
              </Text>
              <TouchableOpacity onPress={onDismissTooltip}>
                <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <Path d="M12.8538 12.1465C12.9002 12.193 12.9371 12.2481 12.9622 12.3088C12.9873 12.3695 13.0003 12.4346 13.0003 12.5003C13.0003 12.566 12.9873 12.631 12.9622 12.6917C12.9371 12.7524 12.9002 12.8076 12.8538 12.854C12.8073 12.9005 12.7521 12.9373 12.6915 12.9625C12.6308 12.9876 12.5657 13.0006 12.5 13.0006C12.4343 13.0006 12.3693 12.9876 12.3086 12.9625C12.2479 12.9373 12.1927 12.9005 12.1463 12.854L8 8.70715L3.85375 12.854C3.75993 12.9478 3.63269 13.0006 3.5 13.0006C3.36732 13.0006 3.24007 12.9478 3.14625 12.854C3.05243 12.7602 2.99973 12.633 2.99973 12.5003C2.99973 12.3676 3.05243 12.2403 3.14625 12.1465L7.29313 8.00028L3.14625 3.85403C3.05243 3.76021 2.99973 3.63296 2.99973 3.50028C2.99973 3.3676 3.05243 3.24035 3.14625 3.14653C3.24007 3.05271 3.36732 3 3.5 3C3.63269 3 3.75993 3.05271 3.85375 3.14653L8 7.2934L12.1463 3.14653C12.2401 3.05271 12.3673 3 12.5 3C12.6327 3 12.7599 3.05271 12.8538 3.14653C12.9476 3.24035 13.0003 3.3676 13.0003 3.50028C13.0003 3.63296 12.9476 3.76021 12.8538 3.85403L8.70688 8.00028L12.8538 12.1465Z" fill="white" />
                </Svg>
              </TouchableOpacity>
            </View>
            <Svg width={11} height={20} viewBox="0 0 11 20" style={{ marginTop: -TOOLTIP_TAIL_OVERLAP }}>
              <Path d="M0 20L7.94781e-07 -2.869e-06L11 10L0 20Z" fill="#2F323A" />
            </Svg>
          </View>
        )}

        {/* 카메라 + 액션 버튼 */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-fill-normal border border-line-normal items-center justify-center"
            onPress={onCameraPress}
            disabled={!isPhotoWindowOpen}
            style={{ opacity: isPhotoWindowOpen ? 1 : 0.3 }}
          >
            <CameraIcon />
          </TouchableOpacity>

          {isPaused ? (
            <>
              {/* 일시 정지 상태 (등산 중 / 하산 중 공통): 다시 시작 + 기록 종료 */}
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
          ) : hasSummited ? (
            <>
              {/* 하산 중: 일시 정지만 (전체 너비) */}
              <TouchableOpacity
                className="flex-1 bg-fill-stronger rounded-[10px] items-center justify-center"
                style={{ minHeight: 48, maxHeight: 48, paddingVertical: 11, paddingHorizontal: 20 }}
                onPress={onPause}
              >
                <Text className="typo-label-large text-label-subtle">일시 정지</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* 등산 중: 일시 정지 + 정상 도착 */}
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
