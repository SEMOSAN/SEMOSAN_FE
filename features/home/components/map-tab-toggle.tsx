import { Pressable, Text, View } from "react-native";

export type MapTab = "map" | "feed";

type MapTabToggleProps = {
  value: MapTab;
  onChange: (tab: MapTab) => void;
};

export function MapTabToggle({ value, onChange }: MapTabToggleProps): React.JSX.Element {
  return (
    <View className="h-[39px] w-[171px] flex-row rounded-full bg-[#2F323A] p-0.5">
      {(["map", "feed"] as const).map((tab) => (
        <Pressable
          key={tab}
          className={`flex-1 items-center justify-center rounded-full ${value === tab ? "bg-fill-normal" : ""}`}
          onPress={() => onChange(tab)}
        >
          <Text
            className={value === tab ? "text-label-normal" : "text-line-subtle"}
            style={{ fontFamily: "Pretendard", fontSize: 15, fontWeight: "600" }}
          >
            {tab === "map" ? "정복 지도" : "세모피드"}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
