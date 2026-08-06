import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

export const LOCATION_TASK_NAME = "semosan-tracking-location";

type LocationTaskData = {
  locations: Location.LocationObject[];
};

type LocationCallback = (location: {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
  timestamp: number;
}) => void;

// 백그라운드 위치 업데이트를 전달할 콜백 저장소
let _onLocation: LocationCallback | null = null;

export function setLocationTaskCallback(cb: LocationCallback | null) {
  _onLocation = cb;
}

// TaskManager는 앱 최상단(모듈 레벨)에서 정의되어야 함
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.warn("[LocationTask] 에러:", error.message);
    return;
  }
  const { locations } = data as LocationTaskData;
  if (!locations?.length) return;

  const loc = locations[locations.length - 1];
  _onLocation?.({
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
    altitude: loc.coords.altitude,
    accuracy: loc.coords.accuracy,
    timestamp: loc.timestamp,
  });
});

/** 백그라운드 위치 추적 시작 */
export async function startLocationTask() {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status !== "granted") {
    console.warn("[LocationTask] 백그라운드 위치 권한 거부됨");
    return false;
  }

  const isRunning = await Location.hasStartedLocationUpdatesAsync(
    LOCATION_TASK_NAME,
  ).catch(() => false);
  if (isRunning) return true;

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 3000,
    distanceInterval: 10,
    showsBackgroundLocationIndicator: true, // iOS 상태바 파란 아이콘
    foregroundService: {
      // Android 포어그라운드 서비스 알림
      notificationTitle: "세모산 트래킹 중",
      notificationBody: "위치를 기록하고 있습니다.",
    },
  });

  return true;
}

/** 백그라운드 위치 추적 중지 */
export async function stopLocationTask() {
  const isRunning = await Location.hasStartedLocationUpdatesAsync(
    LOCATION_TASK_NAME,
  ).catch(() => false);
  if (isRunning) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
  _onLocation = null;
}
