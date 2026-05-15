import { BusIcon } from "@/components/icons/bus-icon";
import { CarIcon } from "@/components/icons/car-icon";
import { SubwayIcon } from "@/components/icons/subway-icon";
import { useMountainDetail } from "@/features/mountains/hooks/use-mountain-detail";
import { TransportationItem } from "@/types/api.generated";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

type TransportType = NonNullable<TransportationItem["type"]>;
type DirectionMap = Record<string, TransportationItem[]>;

function TransportIcon({ type }: { type: TransportType }) {
  if (type === "SUBWAY") return <SubwayIcon size={16} color="#5C6170" />;
  if (type === "BUS") return <BusIcon size={16} color="#5C6170" />;
  return <CarIcon size={16} color="#5C6170" />;
}

export function TransportTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, isError } = useMountainDetail(Number(id));

  if (isPending)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  if (isError) return null;
  if (!data.transportations) return null;

  const { publicTransport, parking } = data.transportations;
  const sections = [
    {
      heading: "대중교통",
      directionMap: publicTransport as DirectionMap | undefined,
    },
    { heading: "주차장", directionMap: parking as DirectionMap | undefined },
  ];

  return (
    <View className="w-full gap-10 px-6">
      {sections.map(({ heading, directionMap }) => {
        if (!directionMap) return null;
        const items = Object.values(directionMap).flat();
        if (items.length === 0) return null;

        return (
          <View key={heading} className="gap-4">
            <Text className="text-label-normal typo-headline-1-semi-bold">
              {heading}
            </Text>
            <View className="gap-4">
              {items.map((item) => (
                <View
                  key={item.transportationId}
                  className="flex-row items-start gap-3"
                >
                  <View className="items-center justify-center rounded-full bg-fill-stronger p-1">
                    <TransportIcon type={item.type ?? "BUS"} />
                  </View>
                  <View className="flex-1 gap-2">
                    <Text className="text-label-normal typo-body-1-normal-semi-bold">
                      {item.name}
                    </Text>
                    <Text className="text-label-subtle typo-body-2-reading-regular">
                      {item.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}
