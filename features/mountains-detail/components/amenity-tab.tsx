import { InfoCenterIcon } from "@/components/icons/info-center-icon";
import { ParkingIcon } from "@/components/icons/parking-icon";
import { ShelterIcon } from "@/components/icons/shelter-icon";
import { StoreIcon } from "@/components/icons/store-icon";
import { ToiletIcon } from "@/components/icons/toilet-icon";
import { useMountainDetail } from "@/features/mountains/hooks/use-mountain-detail";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { MountainDetailResponse } from "@/types/api.generated";

type AmenityMap = NonNullable<MountainDetailResponse["amenities"]>;
type AmenityType = NonNullable<AmenityMap[string]>[number];

const AMENITY_ICON: Record<
  AmenityType,
  { korean: string; icon: React.JSX.Element }
> = {
  RESTROOM: { korean: "화장실", icon: <ToiletIcon /> },
  INFORMATION: { korean: "안내소", icon: <InfoCenterIcon /> },
  SHELTER: { korean: "쉼터", icon: <ShelterIcon /> },
  PARKING: { korean: "주차장", icon: <ParkingIcon /> },
  STORE: { korean: "매점", icon: <StoreIcon /> },
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
      <View className="gap-8">
        {Object.entries(data.amenities).map(([area, facilities]) => (
          <View key={area} className="gap-3">
            <Text className="text-label-subtle typo-body-1-normal-semi-bold">
              {area}
            </Text>
            <View className="flex-row flex-wrap">
              {facilities.map((facility) => (
                <View key={facility} className="items-center gap-1.5 p-4">
                  {AMENITY_ICON[facility].icon}
                  <Text className="text-center text-label-subtle typo-body-3-regular">
                    {AMENITY_ICON[facility].korean}
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
