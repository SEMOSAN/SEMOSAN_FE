import { LoadingSpinner } from "@/components/loading-spinner";
import { useMountainDetail } from "@/features/mountains/hooks/use-mountain-detail";
import { useLocalSearchParams } from "expo-router";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export function RestaurantTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, isError } = useMountainDetail(Number(id));

  if (isPending) return <LoadingSpinner fullScreen />;
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
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          >
            {section.restaurants?.map((item) => (
              <Pressable
                key={item.restaurantId}
                className="gap-2"
                disabled={!item.mapUrl}
                onPress={() => {
                  // 맛집 탭 시 네이버 지도(mapUrl)로 이동
                  if (!item.mapUrl) return;
                  Linking.openURL(item.mapUrl).catch((err) =>
                    console.warn("[Restaurant] 지도 열기 실패:", err),
                  );
                }}
              >
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    className="h-[116px] w-[188px] rounded-[10px] bg-fill-stronger"
                  />
                ) : (
                  <View className="h-[116px] w-[188px] rounded-[10px] bg-fill-stronger" />
                )}
                <View className="w-[188px] gap-0.5">
                  <Text
                    numberOfLines={1}
                    className="text-label-normal typo-body-1-normal-semi-bold"
                  >
                    {item.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="text-label-subtler typo-caption-1-medium"
                  >
                    {item.category}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
}
