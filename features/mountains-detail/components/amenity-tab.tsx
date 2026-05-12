import { InfoCenterIcon } from "@/components/icons/info-center-icon";
import { ParkingIcon } from "@/components/icons/parking-icon";
import { ShelterIcon } from "@/components/icons/shelter-icon";
import { StoreIcon } from "@/components/icons/store-icon";
import { ToiletIcon } from "@/components/icons/toilet-icon";
import { useMountainDetail } from "@/features/mountains/hooks/use-mountain-detail";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

type Facility = "화장실" | "안내소" | "쉼터" | "주차장" | "매점";

type AmenityArea = {
  name: string;
  facilities: Facility[];
};

const AMENITY_AREAS: AmenityArea[] = [
  {
    name: "서울대 입구",
    facilities: ["화장실", "안내소", "쉼터", "주차장", "매점"],
  },
  { name: "신림 방향", facilities: ["화장실", "쉼터", "매점"] },
  { name: "과천 방향", facilities: ["화장실", "안내소", "주차장"] },
];

const FACILITY_ICON: Record<Facility, React.JSX.Element> = {
  화장실: <ToiletIcon />,
  안내소: <InfoCenterIcon />,
  쉼터: <ShelterIcon />,
  주차장: <ParkingIcon />,
  매점: <StoreIcon />,
};

export function AmenityTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, isError } = useMountainDetail(Number(id));

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }
  if (isError) return null;
  if (!data?.amenities) return null;

  return (
    <View className="w-full px-5">
      <Text className="mb-4 text-label-normal typo-headline-1-semi-bold">
        주요 편의시설
      </Text>
      {/* TODO : data.amentities 데이터 연동 */}
      <View className="gap-8">
        {AMENITY_AREAS.map((area) => (
          <View key={area.name} className="gap-3">
            <Text className="text-label-subtle typo-body-1-normal-semi-bold">
              {area.name}
            </Text>
            <View className="flex-row flex-wrap">
              {area.facilities.map((facility) => (
                <View key={facility} className="items-center gap-1.5 p-4">
                  {FACILITY_ICON[facility]}
                  <Text className="text-center text-label-subtle typo-body-3-regular">
                    {facility}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
