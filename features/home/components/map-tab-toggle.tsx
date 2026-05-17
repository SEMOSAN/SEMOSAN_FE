import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type MapTab = "map" | "feed";

type MapTabToggleProps = {
  value: MapTab;
  onChange: (tab: MapTab) => void;
};

export function MapTabToggle({ value, onChange }: MapTabToggleProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {(["map", "feed"] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, value === tab && styles.activeTab]}
          onPress={() => onChange(tab)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, value === tab && styles.activeTabText]}>
            {tab === "map" ? "정복 지도" : "세모피드"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#2F323A",
    borderRadius: 999,
    padding: 2,
    height: 39,
    width: 171,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  activeTab: {
    backgroundColor: "#ffffff",
  },
  tabText: {
    fontFamily: "Pretendard",
    fontSize: 15,
    fontWeight: "600",
    color: "#E5E7EB",
  },
  activeTabText: {
    color: "#1A1B1F",
  },
});
