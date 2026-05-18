import BottomSheet, { type Tab } from "@/components/bottom-sheet";
import {
  HomeBottomSheetContainer,
  SNAP_DEFAULT,
  SNAP_EXPANDED,
  type HomeBottomSheetRef,
} from "@/components/home-bottom-sheet-container";
import { CrosshairIcon } from "@/components/icons/crosshair-icon";
import {
  UnvisitedMountainPillMarker,
  UNVISITED_MOUNTAIN_PILL_MARKER_HEIGHT,
  UNVISITED_MOUNTAIN_PILL_MARKER_WIDTH,
} from "@/components/map-markers/unvisited-mountain-pill-marker";
import {
  VisitedMarker,
  VISITED_MARKER_OVERLAY_HEIGHT,
  VISITED_MARKER_OVERLAY_WIDTH,
} from "@/components/map-markers/visited-marker";
import NoRecordBottomSheet from "@/components/no-record-bottom-sheet";
import { useHomeState } from "@/hooks/useHomeState";
import { NaverMapMarkerOverlay, NaverMapView } from "@mj-studio/react-native-naver-map";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

type Region = {
  latitude: number;
  longitude: number;
  zoom: number;
};

type Mountain = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  visitCount: number;
  imageUri?: string;
  category: "default" | "popular" | "curated";
  visited: boolean;
};

const DEFAULT_REGION: Region = {
  latitude: 37.5665,
  longitude: 126.978,
  zoom: 12,
};

const MOCK_USER_NAME = "맹쏘";

const MOCK_MOUNTAINS: Mountain[] = [
  { id: "1", name: "북한산", latitude: 37.6577, longitude: 126.9791, visitCount: 3, imageUri: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80", category: "popular", visited: true },
  { id: "2", name: "관악산", latitude: 37.4441, longitude: 126.9644, visitCount: 1, imageUri: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80", category: "default", visited: true },
  { id: "3", name: "도봉산", latitude: 37.6892, longitude: 127.0158, visitCount: 5, imageUri: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80", category: "curated", visited: true },
  { id: "4", name: "남산", latitude: 37.5512, longitude: 126.9882, visitCount: 7, imageUri: "https://images.unsplash.com/photo-1570198788870-48acab9571f6?auto=format&fit=crop&w=600&q=80", category: "curated", visited: true },
  { id: "5", name: "수락산", latitude: 37.6873, longitude: 127.0862, visitCount: 2, imageUri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80", category: "default", visited: true },
  { id: "6", name: "아차산", latitude: 37.5507, longitude: 127.1065, visitCount: 4, imageUri: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80", category: "popular", visited: true },
  { id: "7", name: "인왕산", latitude: 37.5815, longitude: 126.9580, visitCount: 2, category: "popular", visited: false },
  { id: "8", name: "청계산", latitude: 37.4239, longitude: 127.0553, visitCount: 0, category: "popular", visited: false },
  { id: "9", name: "불암산", latitude: 37.6524, longitude: 127.1012, visitCount: 0, category: "curated", visited: false },
];

export type MapHomeViewRef = {
  collapseSheet: () => void;
  expandSheet: () => void;
};

type MapHomeViewProps = {
  closeSelectedToken: number;
  onMountainRecordListOpenChange: (isOpen: boolean) => void;
};

export const MapHomeView = forwardRef<MapHomeViewRef, MapHomeViewProps>(
  function MapHomeView({ closeSelectedToken, onMountainRecordListOpenChange }, ref) {
    const { hasRecords } = useHomeState();
    const [region, setRegion] = useState<Region>(DEFAULT_REGION);
    const [activeTab, setActiveTab] = useState<Tab>("내 기록");
    const [selectedMountainId, setSelectedMountainId] = useState<string | null>(null);
    const sheetRef = useRef<HomeBottomSheetRef>(null);
    const sheetHeight = useSharedValue(SNAP_DEFAULT);

    useImperativeHandle(ref, () => ({
      collapseSheet: () => sheetRef.current?.collapseToMin(),
      expandSheet: () => sheetRef.current?.expandToDefault(),
    }));

    const locationButtonStyle = useAnimatedStyle(() => ({
      bottom: sheetHeight.value + 12,
      opacity: interpolate(sheetHeight.value, [SNAP_DEFAULT, SNAP_EXPANDED], [1, 0], "clamp"),
    }));

    useEffect(() => {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const location = await Location.getCurrentPositionAsync({});
        setRegion((prev) => ({
          ...prev,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }));
      })();
    }, []);

    const moveToCurrentLocation = async (): Promise<void> => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const location = await Location.getCurrentPositionAsync({});
      setRegion((prev) => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
    };

    const visitedMountains = MOCK_MOUNTAINS.filter((m) => m.visited);
    const visitedCards = visitedMountains.map((m) => ({
      id: m.id,
      name: m.name,
      trailNumber: m.visitCount,
      daysAgo: 1,
      badgeCount: m.visitCount,
      imageUri: m.imageUri,
    }));
    const unvisitedMountains = MOCK_MOUNTAINS.filter(
      (m) => !m.visited && activeTab === "큐레이션" && m.category === "curated"
    );
    const allMountains =
      activeTab === "내 기록" ? visitedMountains : [...visitedMountains, ...unvisitedMountains];
    const visibleMountains = selectedMountainId
      ? allMountains.filter((m) => m.id === selectedMountainId)
      : allMountains;
    const noRecordMountains = MOCK_MOUNTAINS.map((m) => ({ ...m, visited: false }));

    const handleDetailOpenChange = (isOpen: boolean): void => {
      onMountainRecordListOpenChange(isOpen);
      if (!isOpen) setSelectedMountainId(null);
    };

    return (
      <View className="flex-1 w-full">
        <NaverMapView
          style={{ flex: 1 }}
          camera={{ latitude: region.latitude, longitude: region.longitude, zoom: region.zoom }}
          isShowLocationButton={false}
          onTapMap={() => sheetRef.current?.collapseToMin()}
        >
          {hasRecords
            ? visibleMountains.map((mountain) => (
                <NaverMapMarkerOverlay
                  key={`${mountain.id}-${activeTab}-${selectedMountainId}`}
                  latitude={mountain.latitude}
                  longitude={mountain.longitude}
                  width={mountain.visited ? VISITED_MARKER_OVERLAY_WIDTH : UNVISITED_MOUNTAIN_PILL_MARKER_WIDTH}
                  height={mountain.visited ? VISITED_MARKER_OVERLAY_HEIGHT : UNVISITED_MOUNTAIN_PILL_MARKER_HEIGHT}
                  anchor={mountain.visited ? { x: 0.2, y: 1 } : { x: 0.5, y: 0.5 }}
                >
                  <View
                    collapsable={false}
                    style={{
                      width: mountain.visited ? VISITED_MARKER_OVERLAY_WIDTH : UNVISITED_MOUNTAIN_PILL_MARKER_WIDTH,
                      height: mountain.visited ? VISITED_MARKER_OVERLAY_HEIGHT : UNVISITED_MOUNTAIN_PILL_MARKER_HEIGHT,
                    }}
                  >
                    {mountain.visited ? (
                      <VisitedMarker
                        name={mountain.name}
                        visitCount={mountain.visitCount}
                        imageUri={mountain.imageUri}
                        selected={mountain.id === selectedMountainId}
                      />
                    ) : (
                      <UnvisitedMountainPillMarker
                        name={mountain.name}
                        variant={mountain.visited ? "visited" : activeTab === "큐레이션" ? "curation" : "trending"}
                        selected={mountain.id === selectedMountainId}
                      />
                    )}
                  </View>
                </NaverMapMarkerOverlay>
              ))
            : noRecordMountains.map((mountain) => (
                <NaverMapMarkerOverlay
                  key={`no-record-${mountain.id}`}
                  latitude={mountain.latitude}
                  longitude={mountain.longitude}
                  width={UNVISITED_MOUNTAIN_PILL_MARKER_WIDTH}
                  height={UNVISITED_MOUNTAIN_PILL_MARKER_HEIGHT}
                  anchor={{ x: 0.5, y: 0.5 }}
                >
                  <View
                    collapsable={false}
                    style={{
                      width: UNVISITED_MOUNTAIN_PILL_MARKER_WIDTH,
                      height: UNVISITED_MOUNTAIN_PILL_MARKER_HEIGHT,
                    }}
                  >
                    <UnvisitedMountainPillMarker name={mountain.name} variant="trending" />
                  </View>
                </NaverMapMarkerOverlay>
              ))}
        </NaverMapView>

        <LinearGradient
          colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 154 }}
          pointerEvents="none"
        />

        <Animated.View
          className="absolute right-5 size-12 rounded-full bg-fill-normal border border-line-normal items-center justify-center"
          style={[
            locationButtonStyle,
            {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 4,
            },
          ]}
        >
          <Pressable
            className="flex-1 items-center justify-center"
            onPress={moveToCurrentLocation}
            hitSlop={8}
          >
            <CrosshairIcon size={24} />
          </Pressable>
        </Animated.View>

        <HomeBottomSheetContainer
          ref={sheetRef}
          heightSharedValue={sheetHeight}
          renderContent={({ scrollEnabled }) =>
            hasRecords ? (
              <BottomSheet
                title="다녀온 산"
                titleCount={visitedCards.length}
                cards={visitedCards}
                showTabs={false}
                scrollEnabled={scrollEnabled}
                onCardSelect={(id) => setSelectedMountainId(id)}
                onDetailOpenChange={handleDetailOpenChange}
                closeSelectedToken={closeSelectedToken}
              />
            ) : (
              <NoRecordBottomSheet userName={MOCK_USER_NAME} scrollEnabled={scrollEnabled} />
            )
          }
        />

      </View>
    );
  }
);

