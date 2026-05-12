import { BusIcon } from "@/components/icons/bus-icon";
import { CarIcon } from "@/components/icons/car-icon";
import { SubwayIcon } from "@/components/icons/subway-icon";
import React from "react";
import { Text, View } from "react-native";

type TransportItem = {
  id: number;
  title: string;
  description: string;
  icon?: React.JSX.Element;
};

type TransportSection = {
  heading: string;
  items: TransportItem[];
};

const TRANSPORT_SECTIONS: TransportSection[] = [
  {
    heading: "대중교통",
    items: [
      {
        id: 1,
        title: "지하철",
        description: "2호선 서울대입구역 하차 후 5511번 버스 탑승",
        icon: <SubwayIcon size={16} color="#5C6170" />,
      },
      {
        id: 2,
        title: "버스",
        description: "5511, 5513번 버스 이용 (관악산 입구 하차)",
        icon: <BusIcon size={16} color="#5C6170" />,
      },
    ],
  },
  {
    heading: "주차장",
    items: [
      {
        id: 1,
        title: "서울대 정문",
        description: "서울대학교 정문 주차장 (유료, 30분 1,000원)",
        icon: <CarIcon size={16} color="#5C6170" />,
      },
      {
        id: 2,
        title: "과천 향교 방면",
        description: "과천 방면 공영주차장 (무료, 100대 수용)",
        icon: <CarIcon size={16} color="#5C6170" />,
      },
    ],
  },
];

export function TransportTab(): React.JSX.Element {
  return (
    <View className="w-full gap-10 px-6">
      {TRANSPORT_SECTIONS.map((section) => (
        <View key={section.heading} className="gap-4">
          <Text className="text-label-normal typo-headline-1-semi-bold">
            {section.heading}
          </Text>
          <View className="gap-4">
            {section.items.map((item) => (
              <View key={item.id} className="flex-row items-start gap-3">
                <View className="items-center justify-center rounded-full bg-fill-stronger p-1">
                  {item.icon ?? (
                    <View className="size-5 rounded-[4px] bg-fill-stronger" />
                  )}
                </View>
                <View className="flex-1 gap-2">
                  <Text className="text-label-normal typo-body-1-normal-semi-bold">
                    {item.title}
                  </Text>
                  <Text className="text-label-subtle typo-body-2-reading-regular">
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
