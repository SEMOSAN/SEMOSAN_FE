import { NaverMapView } from '@mj-studio/react-native-naver-map';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet from '@/components/bottom-sheet';

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

export default function HomeScreen() {
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);

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
        onCameraChanged={(params) =>
          setRegion({ latitude: params.latitude, longitude: params.longitude, zoom: params.zoom })
        }
      />

      {/* 바텀시트 */}
      <View className="w-full h-[302px] rounded-tl-3xl rounded-tr-3xl bg-fill-normal">
        <BottomSheet title="다녀온 산" titleCount={4} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
