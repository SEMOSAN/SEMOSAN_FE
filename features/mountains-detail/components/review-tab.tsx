import { MagicWandIcon } from "@/components/icons/magic-wand-icon";
import { MegaphoneIcon } from "@/components/icons/megaphone-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { CourseBadge } from "@/features/mountains/components/course-badge";
import { useMountainDetail } from "@/features/mountains/hooks/use-mountain-detail";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";

export function ReviewTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, isError } = useMountainDetail(Number(id));

  if (isPending)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  if (isError) return null;
  if (!data?.reviews) return null;

  return (
    <View className="w-full gap-8 px-5">
      {/* 요약 카드 */}
      <View className="gap-3">
        <View className="gap-2 rounded-[12px] bg-blue-25 px-5 py-[18px]">
          <View className="flex-row items-center gap-2">
            <MagicWandIcon />
            <Text className="text-label-normal typo-body-1-normal-semi-bold">
              한줄 경험 요약
            </Text>
          </View>
          <Text className="text-label-subtle typo-body-2-normal-regular">
            생각보다 더 힘들고, 그만큼 정상에서의 보람이 큰 산
          </Text>
        </View>
        <View className="gap-2 rounded-[12px] bg-red-25 px-5 py-[18px]">
          <View className="flex-row items-center gap-2">
            <MegaphoneIcon />
            <Text className="text-label-normal typo-body-1-normal-semi-bold">
              가기 전에 꼭 알아야 할 한 가지
            </Text>
          </View>
          <Text className="text-label-subtle typo-body-2-normal-regular">
            중간에 화장실 거의 없음, 초입에서 미리 다녀오세요
          </Text>
        </View>
      </View>

      {/* 커뮤니티 리뷰 */}
      <View className="gap-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-label-normal typo-headline-1-semi-bold">
            커뮤니티 리뷰
          </Text>
          <Text className="text-neutral-300 typo-headline-1-semi-bold">
            {data.reviews.length}
          </Text>
        </View>

        <View className="gap-4">
          {data.reviews.map((review) => (
            <View key={review.reviewId} className="gap-3 px-1 pb-4 pt-1">
              <View className="flex-row gap-4">
                {review.imageUrl ? (
                  <Image
                    source={{ uri: review.imageUrl }}
                    className="size-[92px] rounded-[10px] bg-fill-stronger"
                  />
                ) : (
                  <View className="size-[92px] rounded-[10px] bg-fill-stronger" />
                )}
                <View className="flex-1 gap-1.5">
                  <View className="flex-row items-center gap-1.5">
                    <View className="items-center justify-center rounded-full bg-fill-strongest p-[3px]">
                      <UserIcon />
                    </View>
                    <Text className="text-label-normal typo-body-2-normal-semi-bold">
                      {review.authorName}
                    </Text>
                  </View>
                  <Text
                    className="text-label-normal typo-body-2-normal-regular"
                    numberOfLines={3}
                  >
                    {review.content}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <CourseBadge difficulty={review.difficulty} />
                <Text className="text-label-normal typo-body-2-normal-medium">
                  {review.courseName}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {data.reviews.length > 3 && (
          <TouchableOpacity className="h-[38px] items-center justify-center rounded-[8px] bg-fill-stronger">
            <Text className="text-label-subtle typo-label-medium">더보기</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
