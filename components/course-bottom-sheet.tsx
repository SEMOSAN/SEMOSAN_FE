import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRightIcon } from './icons/chevron-right-icon';

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

export type Course = {
  id: string;
  name: string;
  distanceKm: number;
  durationHours: number;
  date: string;
  imageUris?: string[];
};

export const MOCK_COURSES: Course[] = [
  { id: '1', name: '코스이름', distanceKm: 10, durationHours: 3, date: '24년 9월 5일' },
  { id: '2', name: '코스이름', distanceKm: 10, durationHours: 3, date: '24년 9월 5일' },
  { id: '3', name: '코스이름', distanceKm: 10, durationHours: 3, date: '24년 9월 5일' },
];

type Props = {
  courses?: Course[];
  onCoursePress?: (courseId: string) => void;
};

export default function CourseBottomSheet({ courses = MOCK_COURSES, onCoursePress }: Props) {
  return (
    <View className="gap-2.5">
      {courses.map((course) => (
        <CourseItem key={course.id} course={course} onPress={() => onCoursePress?.(course.id)} />
      ))}
    </View>
  );
}

function StackedThumbnail({ imageUris = [] }: { imageUris?: string[] }) {
  const W = 64;
  const H = 72;
  const n = imageUris.length;

  const cards = [
    { isFront: false, uri: imageUris[n - 2], rotate: '6deg', translateX: 6.2, translateY: 0, zIndex: 1 },
    { isFront: true,  uri: imageUris[n - 1], rotate: '0deg', translateX: 0,   translateY: 8, zIndex: 2 },
  ];

  return (
    <View style={styles.thumbnailWrap}>
      {cards.map((card, i) => (
        <View
          key={i}
          className={`absolute rounded-[10px] overflow-hidden ${
            card.isFront ? 'bg-fill-strong' : 'bg-fill-neutral'
          }`}
          style={{
            width: W,
            height: H,
            zIndex: card.zIndex,
            transform: [
              { rotate: card.rotate },
              { translateX: card.translateX },
              { translateY: card.translateY },
            ],
          }}
        >
          {card.uri ? (
            <Image
              source={{ uri: card.uri }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : null}
          {!card.isFront && (
            <View className="absolute inset-0 bg-black/20" />
          )}
        </View>
      ))}
    </View>
  );
}

function CourseItem({ course, onPress }: { course: Course; onPress?: () => void }) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between w-full"
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View className="flex-row items-center" style={styles.leftGroup}>
        {/* 스택 썸네일 */}
        <StackedThumbnail imageUris={course.imageUris} />

        {/* 텍스트 */}
        <View style={styles.textGroup}>
          <Text className="typo-body-1-normal-semi-bold text-common-0" numberOfLines={1}>
            {course.name}
          </Text>
          <Text className="typo-caption-1-medium text-label-subtler">
            {(course.distanceKm / 1000).toFixed(1)}km · {formatDuration(course.durationHours)} · {course.date}
          </Text>
        </View>
      </View>

      {/* 화살표 버튼 */}
      <View style={styles.arrowButton}>
        <ChevronRightIcon size={16} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  thumbnailWrap: {
    width: 71.2,
    height: 78.3,
  },
  leftGroup: {
    gap: 16,
  },
  textGroup: {
    gap: 6,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
