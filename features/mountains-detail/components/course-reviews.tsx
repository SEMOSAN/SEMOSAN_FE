import { UserIcon } from "@/components/icons/user-icon";
import { Review } from "@/features/mountains/constants/mountain-detail";
import { Pressable, Text, View } from "react-native";

type CourseReviewsProps = {
  reviews: Review[];
  totalCount: number;
};

export function CourseReviews({ reviews, totalCount }: CourseReviewsProps) {
  return (
    <View className="gap-4 px-5 py-6">
      <View className="flex-row items-center gap-2">
        <Text className="text-label-normal typo-headline-1-semi-bold">
          커뮤니티 리뷰
        </Text>
        <Text className="text-neutral-300 typo-headline-1-semi-bold">
          {totalCount}
        </Text>
      </View>

      {reviews.length > 0 ? (
        <>
          <View className="gap-4">
            {reviews.map((review, idx) => (
              <View
                key={review.id}
                className={`gap-3 px-1 pb-4 pt-1 ${
                  idx < reviews.length - 1 ? "border-b border-line-subtle" : ""
                }`}
              >
                <View className="flex-row items-start gap-4">
                  <View className="size-[92px] rounded-[10px] bg-fill-stronger" />
                  <View className="flex-1 gap-1.5">
                    <View className="flex-row items-center gap-1.5">
                      <View className="items-center justify-center rounded-full bg-fill-strongest p-[3px]">
                        <UserIcon />
                      </View>
                      <Text className="text-label-normal typo-body-2-normal-semi-bold">
                        {review.userName}
                      </Text>
                    </View>
                    <Text
                      className="text-label-normal typo-body-2-normal-regular"
                      numberOfLines={3}
                    >
                      {review.text}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <Pressable className="h-[38px] items-center justify-center rounded-[8px] bg-fill-stronger">
            <Text className="text-label-subtle typo-label-medium">더보기</Text>
          </Pressable>
        </>
      ) : (
        <View className="items-center justify-center py-8">
          <Text className="text-label-subtle typo-body-2-normal-regular">
            아직 작성된 리뷰가 없습니다.
          </Text>
        </View>
      )}
    </View>
  );
}
