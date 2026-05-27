import { useMountainDetail } from "@/features/mountains/hooks/use-mountain-detail";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";

export function RestaurantTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, isError } = useMountainDetail(Number(id));

  if (isPending)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  if (isError) return null;
  if (!data?.restaurantSections) return null;

  return (
    <View className="w-full gap-8">
      {data.restaurantSections.map((section) => (
        <View key={section.title} className="gap-4">
          <Text className="px-5 text-label-normal typo-headline-1-semi-bold">
            {section.title}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
          >
            {section.restaurants?.map((item) => (
              <View key={item.restaurantId} className="gap-2">
                <Image
                  source={{ uri: item.imageUrl }}
                  className="h-[116px] w-[188px] rounded-[10px] bg-fill-stronger"
                />
                <View className="gap-0.5">
                  <Text className="text-label-normal typo-body-1-normal-semi-bold">
                    {item.name}
                  </Text>
                  <Text className="text-label-subtler typo-caption-1-medium">
                    {item.category}
                  </Text>
                </View>
              </View>
            ))}
            {/* TODO : 화면 개발되면 추가 */}
            {/* 더보기 버튼은 앞에 아이템 3개 이상일때 부터 추가 */}
            {/* {(section.restaurants?.length ?? 0) >= 3 && (
              <Pressable
                className="h-[116px] w-[188px] items-center justify-center gap-1 rounded-[10px] bg-fill-stronger"
                onPress={() => {
                  // TODO: 맛집 더보기 화면으로 이동
                }}
              >
                <Text className="text-center text-label-subtle typo-body-2-normal-semi-bold">
                  {section.title}
                </Text>
                <Text className="text-label-subtler typo-body-2-normal-regular">
                  {"더보기 >"}
                </Text>
              </Pressable>
            )} */}
          </ScrollView>
        </View>
      ))}
    </View>
  );
}
