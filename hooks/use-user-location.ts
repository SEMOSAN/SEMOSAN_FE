import * as Location from "expo-location";
import { useEffect, useState } from "react";

type Coordinates = {
  latitude: number;
  longitude: number;
};

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState<Coordinates | undefined>();

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status !== "granted") return;
      Location.getCurrentPositionAsync().then(({ coords }) => {
        setUserLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      });
    });
  }, []);

  return userLocation;
}
