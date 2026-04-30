import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRightIcon } from './icons/chevron-right-icon';

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
};

export default function CourseBottomSheet({ courses = MOCK_COURSES }: Props) {
  return (
    <View className="gap-2.5">
      {courses.map((course) => (
        <CourseItem key={course.id} course={course} />
      ))}
    </View>
  );
}

function StackedThumbnail({ imageUris = [] }: { imageUris?: string[] }) {
  const W = 64;
  const H = 72;

  const cards = [
    { isFront: false, imageIdx: 2, rotate: '6deg', translateX: 4, translateY: -5, zIndex: 1 },
    { isFront: false, imageIdx: 1, rotate: '6deg', translateX: 2,  translateY: -5, zIndex: 2 },
    { isFront: true,  imageIdx: 0, rotate: '0deg', translateX: 0,  translateY: 0, zIndex: 3 },
  ];

  return (
    <View style={{ width: W + 16, height: H }}>
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
          {imageUris[card.imageIdx] ? (
            <Image
              source={{ uri: imageUris[card.imageIdx] }}
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

function CourseItem({ course }: { course: Course }) {
  return (
    <TouchableOpacity className="flex-row items-center gap-3">
      {/* 스택 썸네일 */}
      <StackedThumbnail imageUris={course.imageUris} />

      {/* 텍스트 */}
      <View className="flex-1 gap-1">
        <Text className="typo-body-1-normal-semi-bold text-common-0" numberOfLines={1}>
          {course.name}
        </Text>
        <Text className="typo-caption-1-medium text-label-subtler">
          {course.distanceKm}km · {course.durationHours}시간 · {course.date}
        </Text>
      </View>

      {/* 화살표 버튼 */}
      <View className="w-10 h-10 rounded-full bg-fill-normal items-center justify-center">
        <ChevronRightIcon size={16} />
      </View>
    </TouchableOpacity>
  );
}
