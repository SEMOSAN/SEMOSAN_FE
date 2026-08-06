import { useMountainDetail } from "@/features/mountains/hooks/use-mountain-detail";
import { useHikingRecordDetail } from "@/features/home/hooks/use-hiking-record-detail";
import { GetUserHikingRecordResponse } from "@/types/api.generated";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChevronRightIcon } from "./icons/chevron-right-icon";

function formatHikedAt(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const yy = String(d.getFullYear()).slice(2);
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  return `${yy}년 ${mm}월 ${dd}일`;
}

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
  {
    id: "1",
    name: "코스이름",
    distanceKm: 10,
    durationHours: 3,
    date: "24년 9월 5일",
  },
  {
    id: "2",
    name: "코스이름",
    distanceKm: 10,
    durationHours: 3,
    date: "24년 9월 5일",
  },
  {
    id: "3",
    name: "코스이름",
    distanceKm: 10,
    durationHours: 3,
    date: "24년 9월 5일",
  },
];

type Props = {
  courses: GetUserHikingRecordResponse[];
  mountainId?: number;
  onCoursePress?: (hikingRecordId?: number) => void;
};

export default function CourseBottomSheet({
  courses,
  mountainId,
  onCoursePress,
}: Props) {
  return (
    <View className="gap-2.5">
      {courses.map((course) => (
        <CourseItem
          key={course.hikingRecordId}
          course={course}
          mountainId={mountainId}
          onPress={() => onCoursePress?.(course.hikingRecordId)}
        />
      ))}
    </View>
  );
}

function StackedThumbnail({
  imageUris = [],
  mountainId,
}: {
  imageUris?: string[];
  mountainId?: number;
}) {
  const { data: detail } = useMountainDetail(mountainId ?? 0);
  const resolvedUris =
    imageUris.length > 0 ? imageUris : (detail?.mountain?.imageUrls ?? []);
  const W = 64;
  const H = 72;
  const n = resolvedUris.length;

  const cards = [
    ...(n >= 2
      ? [
          {
            isFront: false,
            uri: resolvedUris[n - 2],
            rotate: "6deg",
            translateX: 6.2,
            translateY: 0,
            zIndex: 1,
          },
        ]
      : []),
    {
      isFront: true,
      uri: resolvedUris[n - 1],
      rotate: "0deg",
      translateX: 0,
      translateY: 8,
      zIndex: 2,
    },
  ];

  return (
    <View style={styles.thumbnailWrap}>
      {cards.map((card, i) => (
        <View
          key={i}
          className={`absolute overflow-hidden rounded-[10px] ${
            card.isFront ? "bg-fill-strong" : "bg-fill-neutral"
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
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : null}
          {!card.isFront && <View className="absolute inset-0 bg-black/20" />}
        </View>
      ))}
    </View>
  );
}

function CourseItem({
  course,
  mountainId,
  onPress,
}: {
  course: GetUserHikingRecordResponse;
  mountainId?: number;
  onPress?: () => void;
}) {
  // 자유기록 등 목록 요약 API의 distance/duration이 비어있는 경우 상세 API로 폴백
  const needsDetailFallback = !course.distance || !course.duration;
  const { data: recordDetail } = useHikingRecordDetail(
    needsDetailFallback ? (course.hikingRecordId ?? null) : null,
  );
  const distanceMeters = course.distance || recordDetail?.distanceMeters;
  const durationSeconds = course.duration || recordDetail?.durationSeconds;

  return (
    <TouchableOpacity
      className="w-full flex-row items-center justify-between"
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View className="flex-row items-center" style={styles.leftGroup}>
        {/* 스택 썸네일 */}
        <StackedThumbnail
          imageUris={course.imageUrls}
          mountainId={mountainId}
        />

        {/* 텍스트 */}
        <View style={styles.textGroup}>
          <Text
            className="text-common-0 typo-body-1-normal-semi-bold"
            numberOfLines={1}
          >
            {course.courseName}
          </Text>
          <Text className="text-label-subtler typo-caption-1-medium">
            {!!distanceMeters && (
              <>{(distanceMeters / 1000).toFixed(1)}km · </>
            )}
            {!!durationSeconds && (
              <>
                {formatDuration(durationSeconds)} ·{" "}
                {formatHikedAt(course.hikedAt)}
              </>
            )}
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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
