import { NaverMapMarkerOverlay, NaverMapView } from '@mj-studio/react-native-naver-map';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { type Tab } from '@/components/bottom-sheet';
import {
  HomeBottomSheetContainer,
  SNAP_DEFAULT,
  SNAP_EXPANDED,
  type HomeBottomSheetRef,
} from '@/components/home-bottom-sheet-container';
import NoRecordBottomSheet from '@/components/no-record-bottom-sheet';
import { BellIcon } from '@/components/icons/bell-icon';
import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon';
import { CrosshairIcon } from '@/components/icons/crosshair-icon';
import { SemosanLogo } from '@/components/icons/semosan-logo';
import { XIcon } from '@/components/icons/x-icon';
import {
  UnvisitedMountainPillMarker,
  UNVISITED_MOUNTAIN_PILL_MARKER_HEIGHT,
  UNVISITED_MOUNTAIN_PILL_MARKER_WIDTH,
} from '@/components/map-markers/unvisited-mountain-pill-marker';
import {
  VisitedMarker,
  VISITED_MARKER_OVERLAY_HEIGHT,
  VISITED_MARKER_OVERLAY_WIDTH,
} from '@/components/map-markers/visited-marker';
import { PermissionBottomSheet } from '@/components/permission-bottom-sheet';
import { type BBox, useMountainsMap } from '@/features/mountains/hooks/use-mountains-map';

type Region = {
  latitude: number;
  longitude: number;
  zoom: number;
};

const DEFAULT_REGION: Region = {
  latitude: 37.5665,
  longitude: 126.978,
  zoom: 12,
};

const MOCK_USER_NAME = '맹쏘';

type MapTab = 'map' | 'feed';

export default function HomeScreen() {
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [bbox, setBbox] = useState<BBox>(null);
  const [activeTab, setActiveTab] = useState<Tab>('내 기록');
  const [mapTab, setMapTab] = useState<MapTab>('map');
  const [selectedMountainId, setSelectedMountainId] = useState<number | null>(null);
  const [isMountainRecordListOpen, setIsMountainRecordListOpen] = useState(false);
  const [closeSelectedToken, setCloseSelectedToken] = useState(0);
  const [showPermissionSheet, setShowPermissionSheet] = useState(false);
  const { data: mapData } = useMountainsMap(bbox);
  const hasRecords = mapData?.hasHikingRecord ?? false;
  const mountains = mapData?.mountains ?? [];
  const { top } = useSafeAreaInsets();
  const sheetRef = useRef<HomeBottomSheetRef>(null);
  const sheetHeight = useSharedValue(SNAP_DEFAULT);

  const locationButtonStyle = useAnimatedStyle(() => ({
    bottom: sheetHeight.value + 12,
    opacity: interpolate(sheetHeight.value, [SNAP_DEFAULT, SNAP_EXPANDED], [1, 0], 'clamp'),
  }));

  useEffect(() => {
    AsyncStorage.getItem('permission_sheet_shown').then((val) => {
      if (!val) setShowPermissionSheet(true);
    });
  }, []);

  const handlePermissionConfirm = () => {
    AsyncStorage.setItem('permission_sheet_shown', 'true');
    setShowPermissionSheet(false);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const location = await Location.getCurrentPositionAsync({});
      setRegion((prev) => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
    })();
  }, []);

  const moveToCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const location = await Location.getCurrentPositionAsync({});
    setRegion((prev) => ({
      ...prev,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }));
  };

  const visitedMountains = mountains.filter((m) => m.visited);
  const visitedCards = visitedMountains.map((m) => ({
    id: String(m.id),
    name: m.name,
    trailNumber: m.visitCount,
    daysAgo: 1,
    badgeCount: m.visitCount,
    imageUri: m.imageUrl,
  }));
  const unvisitedMountains = mountains.filter(
    (m) => !m.visited && activeTab === '큐레이션'
  );
  const allMountains =
    activeTab === '내 기록' ? visitedMountains : [...visitedMountains, ...unvisitedMountains];
  const visibleMountains = selectedMountainId
    ? allMountains.filter((m) => m.id === selectedMountainId)
    : allMountains;
  const handleDetailOpenChange = (isOpen: boolean) => {
    setIsMountainRecordListOpen(isOpen);
    if (!isOpen) {
      setSelectedMountainId(null);
    }
  };

  return (
    <View className="flex-1 w-full">
      <NaverMapView
        style={styles.map}
        camera={{ latitude: region.latitude, longitude: region.longitude, zoom: region.zoom }}
        isShowLocationButton={false}
        onTapMap={() => sheetRef.current?.collapseToMin()}
        onCameraIdle={(e) => {
          const { latitude, longitude, latitudeDelta, longitudeDelta } = e.region;
          setBbox({
            swLat: latitude,
            swLng: longitude,
            neLat: latitude + latitudeDelta,
            neLng: longitude + longitudeDelta,
          });
        }}
      >
        {hasRecords
          ? visibleMountains.map((mountain) => (
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
                  mountain.visited
                    ? { x: 0.2, y: 1 }
                    : { x: 0.5, y: 0.5 }
                }
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
                      imageUri={mountain.imageUrl}
                      selected={mountain.id === selectedMountainId}
                    />
                  ) : (
                    <UnvisitedMountainPillMarker
                      name={mountain.name}
                      variant={activeTab === '큐레이션' ? 'curation' : 'trending'}
                      selected={mountain.id === selectedMountainId}
                    />
                  )}
                </View>
              </NaverMapMarkerOverlay>
            ))
          : mountains.map((mountain) => (
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
        colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.mapTopGradient}
        pointerEvents="none"
      />

      {/* 현위치 버튼 - 바텀시트 높이에 따라 이동 */}
      <Animated.View style={[styles.locationButton, locationButtonStyle]}>
        <TouchableOpacity
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
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
              userName={MOCK_USER_NAME}
              scrollEnabled={scrollEnabled}
              lat={region.latitude}
              lng={region.longitude}
            />
          )
        }
      />

      <PermissionBottomSheet
        visible={showPermissionSheet}
        onConfirm={handlePermissionConfirm}
      />

      {/* 상단 floating 영역 */}
      <View style={[styles.overlay, { top: 0 }]} pointerEvents="box-none">
        <View style={{ height: top }} />

        {isMountainRecordListOpen ? (
          <View className="flex-row items-center justify-between px-5 h-14">
            <TouchableOpacity
              onPress={() => setCloseSelectedToken((prev) => prev + 1)}
              className="w-12 h-12 rounded-full bg-fill-normal items-center justify-center"
              style={styles.bellButton}
              hitSlop={8}
            >
              <ChevronLeftIcon size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCloseSelectedToken((prev) => prev + 1)}
              className="w-12 h-12 rounded-full bg-fill-normal items-center justify-center"
              style={styles.bellButton}
              hitSlop={8}
            >
              <XIcon size={24} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* 헤더: 로고 + 알림 */}
            <View className="flex-row items-center justify-between px-5 h-14">
              <SemosanLogo />
              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-fill-normal items-center justify-center"
                style={styles.bellButton}
                hitSlop={8}
              >
                <BellIcon size={24} color="#1A1B1F" />
              </TouchableOpacity>
            </View>

            {/* 정복 지도 / 세모피드 토글 */}
            <View className="items-center mt-1">
              <MapTabToggle value={mapTab} onChange={setMapTab} />
            </View>
          </>
        )}
      </View>
    </View>
  );
}

function MapTabToggle({ value, onChange }: { value: MapTab; onChange: (v: MapTab) => void }) {
  return (
    <View style={toggleStyles.container}>
      {(['map', 'feed'] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[toggleStyles.tab, value === tab && toggleStyles.activeTab]}
          onPress={() => onChange(tab)}
          activeOpacity={0.8}
        >
          <Text style={[toggleStyles.tabText, value === tab && toggleStyles.activeTabText]}>
            {tab === 'map' ? '정복 지도' : '세모피드'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  mapTopGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 154,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  bellButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationButton: {
    position: 'absolute',
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});

const toggleStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#2F323A',
    borderRadius: 999,
    padding: 2,
    height: 39,
    width: 171,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontFamily: 'Pretendard',
    fontSize: 15,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  activeTabText: {
    color: '#1A1B1F',
  },
});
