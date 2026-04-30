import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Difficulty = '하' | '중' | '상';

type Mountain = {
  id: number;
  name: string;
  location: string;
  altitude: number;
  difficulty: Difficulty;
};

const MOCK_MOUNTAINS: Mountain[] = [
  { id: 1, name: '관악산', location: '경기 과천시 중앙동', altitude: 632, difficulty: '중' },
  { id: 2, name: '관악산', location: '경기 과천시 중앙동', altitude: 632, difficulty: '상' },
  { id: 3, name: '관악산', location: '경기 과천시 중앙동', altitude: 632, difficulty: '하' },
  { id: 4, name: '관악산', location: '경기 과천시 중앙동', altitude: 632, difficulty: '중' },
  { id: 5, name: '관악산', location: '경기 과천시 중앙동', altitude: 632, difficulty: '상' },
  { id: 6, name: '관악산', location: '경기 과천시 중앙동', altitude: 632, difficulty: '하' },
  { id: 7, name: '관악산', location: '경기 과천시 중앙동', altitude: 632, difficulty: '중' },
  { id: 8, name: '관악산', location: '경기 과천시 중앙동', altitude: 632, difficulty: '상' },
];

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  하: 'text-green-500',
  중: 'text-blue-500',
  상: 'text-red-500',
};

function SearchIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
        stroke="#1A1B1F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CaretDownIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M4 6L8 10L12 6"
        stroke="#1A1B1F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <TouchableOpacity className="flex-row items-center gap-1 px-3 py-1.5 rounded-full border border-line-subtle">
      <Text className="typo-body-3-semi-bold text-label-normal">{label}</Text>
      <CaretDownIcon />
    </TouchableOpacity>
  );
}

function MountainCard({ mountain }: { mountain: Mountain }) {
  return (
    <View className="flex-row items-center gap-4">
      <View className="w-[86px] h-[72px] rounded-[10px] bg-fill-stronger" />
      <View className="flex-col gap-1.5">
        <View className="flex-row items-end gap-[9px]">
          <Text className="typo-headline-1-semi-bold text-label-normal">{mountain.name}</Text>
          <Text className="typo-body-3-medium text-label-subtler pb-[3px]">{mountain.location}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Text className="typo-body-3-medium text-label-subtle">고도 {mountain.altitude}m</Text>
          <View className="w-0.5 h-0.5 rounded-full bg-label-subtler" />
          <Text className={`typo-body-3-semi-bold ${DIFFICULTY_STYLE[mountain.difficulty]}`}>
            난이도 {mountain.difficulty}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function MountainsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-fill-normal" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 h-14">
        <Text className="flex-1 typo-headline-1-semi-bold text-label-normal">산 목록</Text>
        <SearchIcon />
      </View>

      {/* Filter bar */}
      <View className="flex-row items-center gap-2 px-5 h-[52px]">
        <FilterChip label="인기순" />
        <FilterChip label="지역" />
        <FilterChip label="소요시간" />
        <FilterChip label="난이도" />
      </View>

      {/* Mountain list */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 py-3 gap-5">
          {MOCK_MOUNTAINS.map((mountain) => (
            <MountainCard key={mountain.id} mountain={mountain} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
