import { CircleSlashIcon } from "@/components/icons/circle-slash-icon";
import { DistanceIcon } from "@/components/icons/distance-icon";
import { LoadingSpinner } from "@/components/loading-spinner";
import { NearbyMountainCourseInfo } from "@/types/api.generated";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SHADOW } from "../constants";

// API 난이도 → 한글 라벨/스타일 매핑
const DIFFICULTY_LABEL: Record<string, string> = {
  EASY: "초급",
  NORMAL: "중급",
  HARD: "고급",
};
const DIFFICULTY_BG: Record<string, string> = {
  EASY: "bg-green-50",
  NORMAL: "bg-yellow-50",
  HARD: "bg-red-50",
};
const DIFFICULTY_TEXT: Record<string, string> = {
  EASY: "text-secondary-strong",
  NORMAL: "text-yellow-600",
  HARD: "text-red-500",
};

const CARD_HEIGHT = 96;
const CARD_GAP = 8;
const CAROUSEL_PADDING_Y = 12;
const CTA_HEIGHT = 56;

/** 하단 캐러셀 + 시작 버튼 영역의 높이 (안전영역 제외 — 호출부에서 insets.bottom을 더한다) */
export const COURSE_CAROUSEL_AREA_HEIGHT =
  CAROUSEL_PADDING_Y * 2 + CARD_HEIGHT + CTA_HEIGHT;

/** 분 → "3시간 50분" / "50분" */
function formatDuration(minutes?: number): string {
  if (minutes == null) return "-";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

function formatDistance(meters?: number): string {
  if (meters == null) return "-";
  return `${(meters / 1000).toFixed(2)}km`;
}

type CardShellProps = {
  selected: boolean;
  onPress: () => void;
  children: React.ReactNode;
  width: number;
};

function CardShell({ selected, onPress, children, width }: CardShellProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`justify-center rounded-2xl border-2 bg-fill-normal ${
        selected ? "border-secondary-normal" : "border-transparent"
      }`}
      style={{ height: CARD_HEIGHT, width, ...SHADOW }}
    >
      {children}
    </TouchableOpacity>
  );
}

type Props = {
  courses?: NearbyMountainCourseInfo[];
  isLoading?: boolean;
  selectedCourseId: number | null;
  isFreeSelected: boolean;
  onSelectCourse: (id: number) => void;
  onSelectFree: () => void;
  onStart: () => void;
  /** 홈 인디케이터 등 하단 안전영역. 시작 버튼 아래에 같은 색으로 채운다 */
  bottomInset?: number;
};

export function CourseCarousel({
  courses,
  isLoading,
  selectedCourseId,
  isFreeSelected,
  onSelectCourse,
  onSelectFree,
  onStart,
  bottomInset = 0,
}: Props) {
  const canStart = isFreeSelected || selectedCourseId !== null;

  return (
    <View className="absolute bottom-0 left-0 right-0">
      {/* 코스 캐러셀 — 지도 위에 떠 있음 */}
      <View style={{ paddingVertical: CAROUSEL_PADDING_Y }}>
        {isLoading ? (
          <View style={{ height: CARD_HEIGHT }}>
            <LoadingSpinner fullScreen />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: CARD_GAP }}
          >
            {/* 자유 기록 카드 */}
            <CardShell
              selected={isFreeSelected}
              onPress={onSelectFree}
              width={104}
            >
              <View className="items-center gap-2">
                <CircleSlashIcon size={28} />
                <Text className="typo-label-normal text-label-normal">
                  코스 선택 안 함
                </Text>
              </View>
            </CardShell>

            {(courses ?? []).map((course) => {
              const difficulty = course.difficulty ?? "";
              return (
                <CardShell
                  key={course.courseId}
                  selected={selectedCourseId === course.courseId}
                  onPress={() =>
                    course.courseId != null && onSelectCourse(course.courseId)
                  }
                  width={220}
                >
                  <View className="gap-1 px-4">
                    <View className="flex-row items-center gap-1.5">
                      <View
                        className={`rounded px-1.5 py-0.5 ${
                          DIFFICULTY_BG[difficulty] ?? "bg-fill-stronger"
                        }`}
                      >
                        <Text
                          className={`typo-caption-1-semi-bold ${
                            DIFFICULTY_TEXT[difficulty] ?? "text-label-normal"
                          }`}
                        >
                          {DIFFICULTY_LABEL[difficulty] ?? difficulty ?? "-"}
                        </Text>
                      </View>
                      <Text
                        className="typo-label-normal flex-1 text-label-normal"
                        numberOfLines={1}
                      >
                        {course.name}
                      </Text>
                    </View>
                    <Text className="text-label-normal typo-headline-1-semi-bold">
                      {formatDuration(course.duration)}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <DistanceIcon />
                      <Text className="text-label-subtler typo-caption-1-regular">
                        거리 {formatDistance(course.distance)}
                      </Text>
                    </View>
                  </View>
                </CardShell>
              );
            })}

            {!isLoading && !courses?.length && (
              <View
                className="justify-center px-4"
                style={{ height: CARD_HEIGHT }}
              >
                <Text className="text-label-subtler typo-body-2-normal-regular">
                  등록된 코스가 없어요
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* 시작 버튼 — 화면 하단에 꽉 찬 바, 안전영역까지 같은 색으로 채움 */}
      <TouchableOpacity
        className={`flex-row items-center justify-center gap-2 ${
          canStart ? "bg-secondary-normal" : "bg-fill-neutral"
        }`}
        style={{ height: CTA_HEIGHT + bottomInset, paddingBottom: bottomInset }}
        onPress={onStart}
        disabled={!canStart}
      >
        <Text className="text-common-100 typo-label-large">▶</Text>
        <Text className="text-common-100 typo-label-large">기록 시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}
