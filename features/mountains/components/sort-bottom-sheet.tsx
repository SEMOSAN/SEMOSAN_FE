import { Pressable, Text, View } from 'react-native';
import { FilterBottomSheet } from './filter-bottom-sheet';

export type SortOption = 'popularity' | 'nearby' | 'height';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popularity', label: '인기순' },
  { value: 'nearby', label: '가까운순' },
  { value: 'height', label: '높이순' },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  selected: SortOption;
  onSelect: (option: SortOption) => void;
};

export function SortBottomSheet({ visible, onClose, selected, onSelect }: Props) {
  const handleSelect = (option: SortOption) => {
    onSelect(option);
    onClose();
  };

  return (
    <FilterBottomSheet visible={visible} onClose={onClose} title="정렬">
      <View className="pt-3">
        {SORT_OPTIONS.map(({ value, label }) => (
          <Pressable
            key={value}
            className="px-5 py-3 active:bg-fill-normal"
            onPress={() => handleSelect(value)}
          >
            <Text
              className={`typo-body-1-normal-medium ${
                selected === value ? 'text-label-normal font-semibold' : 'text-label-normal'
              }`}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </FilterBottomSheet>
  );
}
