import { useState } from 'react';
import { Text, View } from 'react-native';
import { LongButton } from '@/components/long-button';
import { RangeSlider } from '@/components/slider';
import { FilterBottomSheet } from './filter-bottom-sheet';

const MIN_HOURS = 0;
const MAX_HOURS = 7;
const STEP = 0.5;

function formatDuration(hours: number, isMin: boolean): string {
  if (isMin && hours === MIN_HOURS) return '30분 이하';
  if (!isMin && hours === MAX_HOURS) return '7시간 이상';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}분`;
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
}

type Props = {
  visible: boolean;
  onClose: () => void;
  low: number;
  high: number;
  onApply: (low: number, high: number) => void;
};

export function DurationBottomSheet({ visible, onClose, low, high, onApply }: Props) {
  const [localLow, setLocalLow] = useState(low);
  const [localHigh, setLocalHigh] = useState(high);

  const handleApply = () => {
    onApply(localLow, localHigh);
    onClose();
  };

  return (
    <FilterBottomSheet visible={visible} onClose={onClose} title="소요시간">
      <View className="px-5 pt-3">
        <RangeSlider
          min={MIN_HOURS}
          max={MAX_HOURS}
          low={localLow}
          high={localHigh}
          step={STEP}
          onValueChange={(l, h) => {
            setLocalLow(l);
            setLocalHigh(h);
          }}
          filledTrackColor="#22C55E"
        />
      </View>

      <View className="items-center pt-3">
        <Text className="typo-headline-1-semi-bold text-label-normal">
          {formatDuration(localLow, true)} ~ {formatDuration(localHigh, false)}
        </Text>
      </View>

      <View className="h-[45px]" />

      <View className="px-5 pt-4 pb-4">
        <LongButton label="적용하기" onPress={handleApply} />
      </View>
    </FilterBottomSheet>
  );
}
