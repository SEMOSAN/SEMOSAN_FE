import { NaverMapMarkerOverlay, NaverMapView } from '@mj-studio/react-native-naver-map';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { type Tab } from '@/components/bottom-sheet';
import { BellIcon } from '@/components/icons/bell-icon';
import { CrosshairIcon } from '@/components/icons/crosshair-icon';
import { SemosanLogo } from '@/components/icons/semosan-logo';
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
  category: 'default' | 'popular' | 'curated';
  visited: boolean;
};

const DEFAULT_REGION: Region = {
  latitude: 37.5665,
  longitude: 126.978,
  zoom: 12,
};

const MOCK_USER_NAME = '맹쏘';
const MOCK_RECORD_COUNT = 11;

const MOCK_MOUNTAINS: Mountain[] = [
  {
    id: '1',
    name: '북한산',
    latitude: 37.6577,
    longitude: 126.9791,
    visitCount: 3,
    imageUri:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    category: 'popular',
    visited: true,
  },
  {
    id: '2',
    name: '관악산',
    latitude: 37.4441,
    longitude: 126.9644,
    visitCount: 1,
    imageUri:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    category: 'default',
    visited: true,
  },
  {
    id: '3',
    name: '도봉산',
    latitude: 37.6892,
    longitude: 127.0158,
    visitCount: 5,
    imageUri:
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80',
    category: 'curated',
    visited: true,
  },
  {
    id: '4',
    name: '남산',
    latitude: 37.5512,
    longitude: 126.9882,
    visitCount: 7,
    imageUri: 'https://images.unsplash.com/photo-1570198788870-48acab9571f6?auto=format&fit=crop&w=600&q=80',
    category: 'curated',
    visited: true,
  },
  {
    id: '5',
    name: '수락산',
    latitude: 37.6873,
    longitude: 127.0862,
    visitCount: 2,
    imageUri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
    category: 'default',
    visited: true,
  },
  {
    id: '6',
    name: '아차산',
    latitude: 37.5507,
    longitude: 127.1065,
    visitCount: 4,
    imageUri: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80',
    category: 'popular',
    visited: true,
  },
  { id: '7', name: '인왕산', latitude: 37.5815, longitude: 126.9580, visitCount: 2, category: 'popular', visited: false },
  { id: '8', name: '청계산', latitude: 37.4239, longitude: 127.0553, visitCount: 0, category: 'popular', visited: false },
  { id: '9', name: '불암산', latitude: 37.6524, longitude: 127.1012, visitCount: 0, category: 'curated', visited: false },
];

export default function HomeScreen() {
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [activeTab, setActiveTab] = useState<Tab>('내 기록');
  const [selectedMountainId, setSelectedMountainId] = useState<string | null>(null);
  const { top } = useSafeAreaInsets();

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

  const visitedMountains = MOCK_MOUNTAINS.filter((m) => m.visited);
  const visitedCards = visitedMountains.map((m) => ({
    id: m.id,
    name: m.name,
    trailNumber: m.visitCount,
    daysAgo: 1,
    badgeCount: m.visitCount,
    imageUri: m.imageUri,
  }));
  const unvisitedMountains = MOCK_MOUNTAINS.filter((m) => {
    if (!m.visited && activeTab === '지금 뜨는') return m.category === 'popular';
    if (!m.visited && activeTab === '큐레이션') return m.category === 'curated';
    return false;
  });
  const allMountains = activeTab === '내 기록'
    ? visitedMountains
    : [...visitedMountains, ...unvisitedMountains];
  const visibleMountains = selectedMountainId
    ? allMountains.filter((m) => m.id === selectedMountainId)
    : allMountains;

  return (
    <View className="flex-1 w-full">
      {/* 지도 */}
      <NaverMapView
        style={styles.map}
        camera={{
          latitude: region.latitude,
          longitude: region.longitude,
          zoom: region.zoom,
        }}
        isShowLocationButton
      >
        {visibleMountains.map((mountain) =>
          mountain.visited ? (
            <NaverMapMarkerOverlay
              key={`${mountain.id}-${activeTab}-${selectedMountainId}`}
              latitude={mountain.latitude}
              longitude={mountain.longitude}
              width={VISITED_MARKER_OVERLAY_WIDTH}
              height={VISITED_MARKER_OVERLAY_HEIGHT}
              anchor={{ x: 0.2, y: 1 }}
            >
              <View
                collapsable={false}
                style={{
                  width: VISITED_MARKER_OVERLAY_WIDTH,
                  height: VISITED_MARKER_OVERLAY_HEIGHT,
                }}
              >
                <VisitedMarker
                  name={mountain.name}
                  visitCount={mountain.visitCount}
                  imageUri={mountain.imageUri}
                  flagColor={
                    activeTab === '지금 뜨는' ? '#507EF4'
                    : activeTab === '큐레이션' ? '#FFD40D'
                    : '#00D864'
                  }
                  selected={mountain.id === selectedMountainId}
                />
              </View>
            </NaverMapMarkerOverlay>
          ) : (
            <NaverMapMarkerOverlay
              key={`${mountain.id}-${activeTab}-${selectedMountainId}`}
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
                <UnvisitedMountainPillMarker
                  key={`pill-${mountain.id}-${activeTab}`}
                  name={mountain.name}
                  variant={activeTab === '큐레이션' ? 'curation' : 'trending'}
                />
              </View>
            </NaverMapMarkerOverlay>
          )
        )}
      </NaverMapView>

      {/* 바텀시트 */}
      <View className="w-full h-[302px] rounded-tl-3xl rounded-tr-3xl bg-fill-normal">
        <BottomSheet
          title="다녀온 산"
          titleCount={visitedCards.length}
          cards={visitedCards}
          activeTab={activeTab}
          onTabChange={(tab) => { setActiveTab(tab); setSelectedMountainId(null); }}
          onCardSelect={(id) => setSelectedMountainId(id)}
        />
      </View>

      {/* 현위치 버튼 */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={moveToCurrentLocation}
        hitSlop={8}
      >
        <CrosshairIcon size={24} />
      </TouchableOpacity>

      {/* 상단 floating 영역 */}
      <View style={[styles.overlay, { top: 0 }]} pointerEvents="box-none">
        <View style={{ height: top }} />

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

        {/* 등산 기록 pill */}
        <View className="items-center mt-2">
          <View
            className="flex-row items-center gap-1.5 bg-primary-subtle rounded-full px-4 py-2"
            style={[styles.pill, { alignSelf: 'center' }]}
          >
            <Text className="typo-body-1-normal-semi-bold text-fill-normal">
              {MOCK_USER_NAME} 님의 등산 기록
            </Text>
            <Text className="typo-body-1-normal-semi-bold text-secondary-normal">
              {MOCK_RECORD_COUNT}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
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
  pill: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  locationButton: {
    position: 'absolute',
    bottom: 302 + 12,
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
