import BottomSheet, { type Tab } from "@/components/bottom-sheet";
import {
  HomeBottomSheetContainer,
  HomeBottomSheetRef,
  SNAP_DEFAULT,
  SNAP_EXPANDED_WITH_RECORDS,
  SNAP_EXPANDED_NO_RECORDS,
} from "@/components/home-bottom-sheet-container";
import { CrosshairIcon } from "@/components/icons/crosshair-icon";
import {
  UNVISITED_MOUNTAIN_PILL_MARKER_HEIGHT,
  UNVISITED_MOUNTAIN_PILL_MARKER_WIDTH,
  UnvisitedMountainPillMarker,
} from "@/components/map-markers/unvisited-mountain-pill-marker";
import {
  VISITED_MARKER_OVERLAY_HEIGHT,
  VISITED_MARKER_OVERLAY_WIDTH,
  VisitedMarker,
} from "@/components/map-markers/visited-marker";
import NoRecordBottomSheet from "@/components/no-record-bottom-sheet";
import { useMountains } from "@/features/mountains/hooks/use-mountains";
import { useMyMountains } from "@/features/home/hooks/use-my-mountains";
import { useProfile } from "@/features/mypage/hooks/use-profile";
import {
  BBox,
  useMountainsMap,
} from "@/features/mountains/hooks/use-mountains-map";
import {
  NaverMapMarkerOverlay,
  NaverMapView,
} from "@mj-studio/react-native-naver-map";
import { LinearGradient } from "expo-linear-gradient";
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { router } from "expo-router";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type Region = {
  latitude: number;
  longitude: number;
  zoom: number;
};

const DEFAULT_REGION: Region = {
  latitude: 37.5665,
  longitude: 126.978,
  zoom: 8,
};

export type MapHomeViewRef = {
  collapseSheet: () => void;
  expandSheet: () => void;
};

type MapHomeViewProps = {
  closeSelectedToken: number;
  onMountainRecordListOpenChange: (isOpen: boolean) => void;
};

export const MapHomeView = forwardRef<MapHomeViewRef, MapHomeViewProps>(
  function MapHomeView(
    { closeSelectedToken, onMountainRecordListOpenChange },
    ref,
  ) {
    const sheetRef = useRef<HomeBottomSheetRef>(null);
    const [region, setRegion] = useState<Region>(DEFAULT_REGION);
    const [bbox, setBbox] = useState<BBox>(null);
    const [activeTab, setActiveTab] = useState<Tab>("내 기록");
    const [selectedMountainId, setSelectedMountainId] = useState<number | null>(
      null,
    );
    const { data: mapData } = useMountainsMap(bbox);
    const hasRecords = mapData?.hasHikingRecord ?? false;
    const snapExpanded = hasRecords ? SNAP_EXPANDED_WITH_RECORDS : SNAP_EXPANDED_NO_RECORDS;
    const { data, isPending, isError } = useMountains();
    const { data: myMountains = [] } = useMyMountains();
    const { data: profile } = useProfile();

    const moveToCurrentLocation = async () => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const location = await getCurrentPositionAsync({});
      setRegion((prev) => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
    };

    const handleDetailOpenChange = (isOpen: boolean) => {
      onMountainRecordListOpenChange(isOpen);
      if (!isOpen) {
        setSelectedMountainId(null);
      }
    };

    useImperativeHandle(ref, () => ({
      collapseSheet: () => sheetRef.current?.collapseToMin(),
      expandSheet: () => sheetRef.current?.expandToDefault(),
    }));

    const sheetHeight = useSharedValue(SNAP_DEFAULT);
    const locationButtonStyle = useAnimatedStyle(() => ({
      bottom: sheetHeight.value + 12,
      opacity: interpolate(
        sheetHeight.value,
        [SNAP_DEFAULT, snapExpanded],
        [1, 0],
        "clamp",
      ),
    }));

    const myMountainImageMap = Object.fromEntries(
      myMountains.map((m) => [m.mountainId, m.imageUrl])
    );

    const visitedCards = myMountains.map((m) => ({
      id: String(m.mountainId),
      name: m.mountainName ?? "",
      trailNumber: m.hikingCount ?? 1,
      daysAgo: getDaysAgo(m.lastHikedAt),
      badgeCount: m.hikingCount ?? 1,
      imageUri: m.imageUrl,
    }));

    return (
      <View className="w-full flex-1">
        <NaverMapView
          style={styles.map}
          camera={{
            latitude: region.latitude,
            longitude: region.longitude,
            zoom: region.zoom,
          }}
          isShowLocationButton={false}
          isShowZoomControls={false}
          onTapMap={() => sheetRef.current?.collapseToMin()}
          onCameraIdle={(e) => {
            const { latitude, longitude, latitudeDelta, longitudeDelta } =
              e.region;
            setBbox({
              swLat: latitude,
              swLng: longitude,
              neLat: latitude + latitudeDelta,
              neLng: longitude + longitudeDelta,
            });
          }}
        >
          {hasRecords
            ? mapData?.mountains?.filter((m) => m.visited).map((mountain) => (
                <NaverMapMarkerOverlay
                  key={`${mountain.id}-${activeTab}-${selectedMountainId}`}
                  latitude={mountain.latitude}
                  longitude={mountain.longitude}
                  width={
                    mountain.visited
                      ? VISITED_MARKER_OVERLAY_WIDTH
                      : UNVISITED_MOUNTAIN_PILL_MARKER_WIDTH
                  }
                  height={
                    mountain.visited
                      ? VISITED_MARKER_OVERLAY_HEIGHT
                      : UNVISITED_MOUNTAIN_PILL_MARKER_HEIGHT
                  }
                  anchor={
                    mountain.visited ? { x: 0.2, y: 1 } : { x: 0.5, y: 0.5 }
                  }
                  onTap={() => router.push(`/mountains/${mountain.id}`)}
                >
                  <View
                    collapsable={false}
                    style={{
                      width: mountain.visited
                        ? VISITED_MARKER_OVERLAY_WIDTH
                        : UNVISITED_MOUNTAIN_PILL_MARKER_WIDTH,
                      height: mountain.visited
                        ? VISITED_MARKER_OVERLAY_HEIGHT
                        : UNVISITED_MOUNTAIN_PILL_MARKER_HEIGHT,
                    }}
                  >
                    {mountain.visited ? (
                      <VisitedMarker
                        name={mountain.name}
                        visitCount={mountain.visitCount}
                        imageUri={myMountainImageMap[mountain.id] ?? mountain.imageUrl}
                        selected={mountain.id === selectedMountainId}
                      />
                    ) : (
                      <UnvisitedMountainPillMarker
                        name={mountain.name ?? ""}
                        variant="trending"
                        selected={mountain.id === selectedMountainId}
                      />
                    )}
                  </View>
                </NaverMapMarkerOverlay>
              ))
            : data?.content?.map((mountain) => (
                <NaverMapMarkerOverlay
                  key={`no-record-${mountain.mountainId}`}
                  latitude={mountain.latitude ?? 0}
                  longitude={mountain.longitude ?? 0}
                  width={UNVISITED_MOUNTAIN_PILL_MARKER_WIDTH}
                  height={UNVISITED_MOUNTAIN_PILL_MARKER_HEIGHT}
                  anchor={{ x: 0.5, y: 0.5 }}
                  onTap={() => router.push(`/mountains/${mountain.mountainId}`)}
                >
                  <View
                    collapsable={false}
                    style={{
                      width: UNVISITED_MOUNTAIN_PILL_MARKER_WIDTH,
                      height: UNVISITED_MOUNTAIN_PILL_MARKER_HEIGHT,
                    }}
                  >
                    <UnvisitedMountainPillMarker
                      name={mountain.name ?? ""}
                      variant="trending"
                    />
                  </View>
                </NaverMapMarkerOverlay>
              ))}
        </NaverMapView>

        <LinearGradient
          colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.mapTopGradient}
          pointerEvents="none"
        />

        {/* 현위치 버튼 - 바텀시트 높이에 따라 이동 */}
        <Animated.View
          style={[
            styles.locationButton,
            // locationButtonStyle, // TODO : 하단 바텀시트  (HomeBottomSheetContainer) 가 주석처리가 풀리면 다시 사용하도록 한다.
            { bottom: 12 }, // TODO : 하단 바텀시트  (HomeBottomSheetContainer) 가 주석처리 풀리면 삭제하도록 한다.
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            onPress={moveToCurrentLocation}
            hitSlop={8}
          >
            <CrosshairIcon size={24} />
          </TouchableOpacity>
        </Animated.View>

        {/* TODO : API 나오면 연동 */}
        {/* 바텀시트 - 절대 위치, 애니메이션 높이 */}
        <HomeBottomSheetContainer
          ref={sheetRef}
          heightSharedValue={sheetHeight}
          snapExpanded={snapExpanded}
          renderContent={({ scrollEnabled }) =>
            hasRecords ? (
              <BottomSheet
                title="다녀온 산"
                titleCount={visitedCards.length}
                cards={visitedCards}
                showTabs={false}
                scrollEnabled={scrollEnabled}
                onCardSelect={(id) => setSelectedMountainId(Number(id))}
                onDetailOpenChange={handleDetailOpenChange}
                closeSelectedToken={closeSelectedToken}
              />
            ) : (
              <NoRecordBottomSheet
                userName={profile?.nickname ?? ""}
                scrollEnabled={scrollEnabled}
                lat={region.latitude}
                lng={region.longitude}
              />
            )
          }
        />
      </View>
    );
  },
);

function getDaysAgo(dateStr?: string): number {
  if (!dateStr) return 0;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  mapTopGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 154,
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  bellButton: {
    boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.1)",
  },
  locationButton: {
    position: "absolute",
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.15)",
  },
});
