import BottomSheet from "@/components/bottom-sheet";
import {
  HomeBottomSheetContainer,
  HomeBottomSheetRef,
  SNAP_DEFAULT,
  SNAP_EXPANDED_NO_RECORDS,
  SNAP_EXPANDED_WITH_RECORDS,
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
import { useMyMountains } from "@/features/home/hooks/use-my-mountains";
import {
  BBox,
  MountainMapItem,
  useMountainsMap,
} from "@/features/mountains/hooks/use-mountains-map";
import { useProfile } from "@/features/mypage/hooks/use-profile";
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
import {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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

type VisitedMarkerOverlayProps = {
  mountain: MountainMapItem;
  selected: boolean;
  imageUri?: string;
  onPress: () => void;
};

const VisitedMarkerOverlay = memo(function VisitedMarkerOverlay({
  mountain,
  selected,
  imageUri,
  onPress,
}: VisitedMarkerOverlayProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <NaverMapMarkerOverlay
      latitude={mountain.latitude}
      longitude={mountain.longitude}
      width={VISITED_MARKER_OVERLAY_WIDTH}
      height={VISITED_MARKER_OVERLAY_HEIGHT}
      anchor={{ x: 0.2, y: 1 }}
      onTap={onPress}
    >
      <View
        key={`${selected} ${isLoaded}`}
        collapsable={false}
        style={{
          width: VISITED_MARKER_OVERLAY_WIDTH,
          height: VISITED_MARKER_OVERLAY_HEIGHT,
        }}
      >
        <VisitedMarker
          name={mountain.name}
          visitCount={mountain.visitCount}
          imageUri={imageUri}
          selected={selected}
          onImageLoad={() => setIsLoaded(true)}
        />
      </View>
    </NaverMapMarkerOverlay>
  );
});

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
const [selectedMountainId, setSelectedMountainId] = useState<number | null>(
      null,
    );
    const { data: mapData } = useMountainsMap(bbox);
    const hasRecords = mapData?.hasHikingRecord ?? false;
    const snapExpanded = hasRecords
      ? SNAP_EXPANDED_WITH_RECORDS
      : SNAP_EXPANDED_NO_RECORDS;
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
      myMountains.map((m) => [m.mountainId, m.imageUrls?.[0]]),
    );

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
            ? mapData?.mountains
                ?.filter((m) => m.visited)
                .map((mountain) => (
                  <VisitedMarkerOverlay
                    key={mountain.id}
                    mountain={mountain}
                    selected={mountain.id === selectedMountainId}
                    imageUri={
                      myMountainImageMap[mountain.id] ?? mountain.imageUrl
                    }
                    onPress={() => {
                      setSelectedMountainId(mountain.id);
                      sheetRef.current?.expandToDefault();
                    }}
                  />
                ))
            : mapData?.mountains?.map((mountain) => (
                <NaverMapMarkerOverlay
                  key={`no-record-${mountain.id}`}
                  latitude={mountain.latitude}
                  longitude={mountain.longitude}
                  width={UNVISITED_MOUNTAIN_PILL_MARKER_WIDTH}
                  height={UNVISITED_MOUNTAIN_PILL_MARKER_HEIGHT}
                  anchor={{ x: 0.5, y: 0.5 }}
                  onTap={() => router.push(`/mountains/${mountain.id}`)}
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
        <Animated.View style={[styles.locationButton, locationButtonStyle]}>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            onPress={moveToCurrentLocation}
            hitSlop={8}
          >
            <CrosshairIcon size={24} />
          </TouchableOpacity>
        </Animated.View>

        {/* 바텀시트 - 절대 위치, 애니메이션 높이 */}
        <HomeBottomSheetContainer
          ref={sheetRef}
          heightSharedValue={sheetHeight}
          snapExpanded={snapExpanded}
          renderContent={({ scrollEnabled }) =>
            hasRecords ? (
              <BottomSheet
                title="다녀온 산"
                titleCount={myMountains.length}
                cards={myMountains}
                showTabs={false}
                scrollEnabled={scrollEnabled}
                onCardSelect={(id) => setSelectedMountainId(Number(id))}
                onDetailOpenChange={handleDetailOpenChange}
                closeSelectedToken={closeSelectedToken}
                selectedMountainId={selectedMountainId}
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
