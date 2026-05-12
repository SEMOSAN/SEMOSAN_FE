import { RESTAURANT_SECTIONS } from "@/features/mountains/constants/mountain-detail";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export function RestaurantTab(): React.JSX.Element {
  // TODO : data.restaurant 데이터 연동

  return (
    <View className="w-full gap-8">
      {RESTAURANT_SECTIONS.map((section) => (
        <View key={section.title} className="gap-4">
          <Text className="px-5 text-label-normal typo-headline-1-semi-bold">
            {section.title}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
          >
            {section.items.map((item) => (
              <View key={item.id} className="gap-2">
                <View className="h-[116px] w-[188px] rounded-[10px] bg-fill-stronger" />
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
            <View className="h-[116px] w-[188px] items-center justify-center gap-1 rounded-[10px] bg-fill-stronger">
              <Text className="text-center text-label-subtle typo-body-2-normal-semi-bold">
                {section.moreLabel}
              </Text>
              <Text className="text-label-subtler typo-body-2-normal-regular">
                {"더보기 >"}
              </Text>
            </View>
          </ScrollView>
        </View>
      ))}
    </View>
  );
}
