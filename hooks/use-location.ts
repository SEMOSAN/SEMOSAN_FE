import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export type LocationState = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
};

export type UseLocationReturn = {
  location: LocationState | null;
  errorMsg: string | null;
  loading: boolean;
  permissionGranted: boolean;
  requestPermission: () => Promise<void>;
  getCurrentLocation: () => Promise<LocationState | null>;
};

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  async function checkPermission() {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted') {
      setPermissionGranted(true);
      fetchLocation();
    }
  }

  async function requestPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      setPermissionGranted(true);
      await fetchLocation();
    } else {
      setErrorMsg('위치 권한이 거부되었습니다.');
    }
  }

  async function fetchLocation() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // GPS 고정밀도
      });
      const parsed: LocationState = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
        accuracy: result.coords.accuracy,
        altitude: result.coords.altitude,
      };
      setLocation(parsed);
      return parsed;
    } catch (e) {
      setErrorMsg('위치를 가져오지 못했습니다.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function getCurrentLocation(): Promise<LocationState | null> {
    if (!permissionGranted) {
      setErrorMsg('위치 권한이 없습니다.');
      return null;
    }
    return await fetchLocation();
  }

  return {
    location,
    errorMsg,
    loading,
    permissionGranted,
    requestPermission,
    getCurrentLocation,
  };
}
