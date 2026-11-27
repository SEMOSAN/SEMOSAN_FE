import * as Location from "expo-location";
import { useEffect, useState } from "react";

type Coordinates = {
  latitude: number;
  longitude: number;
};

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState<Coordinates | undefined>();

  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status !== "granted") return;
        // 체인으로 이어줘야 아래 catch가 위치 조회 실패까지 받는다
        return Location.getCurrentPositionAsync().then(({ coords }) => {
          setUserLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
        });
      })
      // 기기 위치 설정이 꺼져 있으면 거부된다(ERR_LOCATION_SETTINGS_UNSATISFIED).
      // 위치 없이도 화면은 동작해야 하므로 경고만 남긴다.
      .catch((error) => {
        console.warn("[Location] 현재 위치 조회 실패:", error);
      });
  }, []);

  return userLocation;
}
