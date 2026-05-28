import { CaretLeftIcon } from "@/components/icons/caret-left-icon";
import { RouteIcon } from "@/components/icons/route-icon";
import { CourseDetailInfo } from "@/features/mountains-detail/components/course-detail-info";
import { useCourseDetail } from "@/features/tracking/hooks/use-course-detail";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CourseDetailScreen() {
  const { id, mountainId } = useLocalSearchParams<{ id: string; mountainId?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const courseId = Number(id);
  const isValidId = !isNaN(courseId) && courseId > 0;

  const {
    data: course,
    isPending,
    isError,
  } = useCourseDetail(isValidId ? courseId : null);

  if (!isValidId) {
    return (
      <View className="flex-1 items-center justify-center bg-fill-normal">
        <Text className="text-label-subtle typo-body-2-normal-regular">
          코스를 찾을 수 없습니다.
        </Text>
      </View>
    );
  }

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-fill-normal">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || !course) {
    return (
      <View className="flex-1 items-center justify-center bg-fill-normal">
        <Text className="text-label-subtle typo-body-2-normal-regular">
          코스를 찾을 수 없습니다.
        </Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 bg-fill-normal">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        >
          {/* Header spacer */}
          <View style={{ height: insets.top + 56 + 8 }} />

          <CourseDetailInfo course={course} />

          {/* Divider */}
          <View className="mt-6 h-[6px] bg-fill-strong" />

          {/* TODO : 코스상세 내 커뮤니티 리뷰는 api제작 전까지 주석처리 */}
          {/* Reviews */}
          {/* <CourseReviews reviews={MOCK_REVIEWS} totalCount={54} /> */}
        </ScrollView>

        {/* Header overlay */}
        <View
          className="absolute left-0 right-0 top-0"
          style={{ paddingTop: insets.top }}
          pointerEvents="box-none"
        >
          <View
            className="h-14 flex-row items-center px-5"
            pointerEvents="box-none"
          >
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <CaretLeftIcon />
            </Pressable>
          </View>
        </View>

        {/* CTA floating button */}
        <View
          className="absolute left-0 right-0 items-center"
          style={{ bottom: insets.bottom + 8 }}
          pointerEvents="box-none"
        >
          <Pressable
            onPress={() =>
              router.push(`/(tabs)/tracking?collapse=true&courseId=${id}${mountainId ? `&mountainId=${mountainId}` : ''}`)
            }
            className="flex-row items-center gap-2 rounded-full bg-primary-normal px-5 py-3"
          >
            <RouteIcon />
            <Text className="text-label-normal-inverse typo-label-large">
              코스 따라가기
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
