import { useRef } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

type Props = {
  tabs: readonly string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export function MountainTabs({ tabs, activeTab, onTabChange }: Props) {
  const tabScrollRef = useRef<ScrollView>(null);
  const tabLayoutMap = useRef<Record<string, { x: number; width: number }>>({});

  return (
    <ScrollView
      ref={tabScrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      className="border-b border-line-subtle bg-fill-normal"
      contentContainerStyle={{ paddingHorizontal: 20 }}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => {
            onTabChange(tab);
            const layout = tabLayoutMap.current[tab];
            if (layout) {
              tabScrollRef.current?.scrollTo({
                x: layout.x - 20,
                animated: true,
              });
            }
          }}
          onLayout={(e) => {
            tabLayoutMap.current[tab] = {
              x: e.nativeEvent.layout.x,
              width: e.nativeEvent.layout.width,
            };
          }}
          className={`items-center justify-center px-3 py-2 ${
            activeTab === tab ? "border-b-2 border-line-primary" : ""
          }`}
        >
          <Text
            className={
              activeTab === tab
                ? "text-label-normal typo-body-1-normal-semi-bold"
                : "text-label-subtler typo-body-1-normal-medium"
            }
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
