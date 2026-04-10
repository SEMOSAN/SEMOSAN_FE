import { useLocation } from "@/hooks/use-location";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const INITIAL_DELTA = 0.005; // 줌 레벨 (작을수록 확대)

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const {
    location,
    errorMsg,
    loading,
    permissionGranted,
    requestPermission,
    getCurrentLocation,
  } = useLocation();

  // 위치가 처음 들어오면 지도 카메라 이동
  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: INITIAL_DELTA,
          longitudeDelta: INITIAL_DELTA,
        },
        600
      );
    }
  }, [location]);

  // 권한 없음
  if (!permissionGranted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.message}>지도를 보려면 위치 권한이 필요합니다</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>위치 권한 허용하기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // 위치 로딩 중
  if (loading && !location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={[styles.message, { marginTop: 12 }]}>위치 불러오는 중...</Text>
      </View>
    );
  }

  // 오류
  if (errorMsg && !location) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={[styles.message, { color: "#EF4444" }]}>{errorMsg}</Text>
        <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
          <Text style={styles.buttonText}>다시 시도</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        showsUserLocation={false} // 커스텀 마커 사용
        showsMyLocationButton={false}
        initialRegion={
          location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: INITIAL_DELTA,
                longitudeDelta: INITIAL_DELTA,
              }
            : {
                latitude: 37.5665,
                longitude: 126.978,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
        }
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="내 위치"
            description={
              location.accuracy != null
                ? `정확도 ±${location.accuracy.toFixed(0)}m`
                : undefined
            }
          >
            {/* 커스텀 마커 */}
            <View style={styles.markerOuter}>
              <View style={styles.markerInner} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* 하단 위치 정보 카드 */}
      {location && (
        <SafeAreaView edges={["bottom"]} style={styles.cardWrapper}>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>위도</Text>
              <Text style={styles.cardValue}>{location.latitude.toFixed(6)}°</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>경도</Text>
              <Text style={styles.cardValue}>{location.longitude.toFixed(6)}°</Text>
            </View>
            {location.accuracy != null && (
              <>
                <View style={styles.cardDivider} />
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>정확도</Text>
                  <Text style={styles.cardValue}>±{location.accuracy.toFixed(0)}m</Text>
                </View>
              </>
            )}
            {location.altitude != null && (
              <>
                <View style={styles.cardDivider} />
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>고도</Text>
                  <Text style={styles.cardValue}>{location.altitude.toFixed(1)}m</Text>
                </View>
              </>
            )}
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={getCurrentLocation}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.refreshText}>위치 새로고침</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 24,
    backgroundColor: "#fff",
  },
  message: {
    fontSize: 15,
    color: "#374151",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  // 커스텀 마커
  markerOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(59,130,246,0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  markerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3B82F6",
  },

  // 하단 카드
  cardWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  cardValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    fontVariant: ["tabular-nums"],
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  refreshButton: {
    marginTop: 4,
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  refreshText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
