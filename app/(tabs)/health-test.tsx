import {
  queryCategorySamples,
  queryQuantitySamples,
  queryStatisticsForQuantity,
  requestAuthorization,
} from "@kingstinct/react-native-healthkit";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type HealthSection = {
  title: string;
  data: unknown;
  error?: string;
};

const READ_PERMISSIONS = [
  "HKQuantityTypeIdentifierStepCount",
  "HKQuantityTypeIdentifierHeartRate",
  "HKQuantityTypeIdentifierActiveEnergyBurned",
  "HKQuantityTypeIdentifierBodyMass",
  "HKQuantityTypeIdentifierHeight",
  "HKQuantityTypeIdentifierOxygenSaturation",
  "HKQuantityTypeIdentifierRespiratoryRate",
  "HKQuantityTypeIdentifierDistanceWalkingRunning",
  "HKCategoryTypeIdentifierSleepAnalysis",
] as const;

export default function HealthTestScreen() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<HealthSection[]>([]);

  if (Platform.OS !== "ios") {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>HealthKit은 iOS 전용입니다.</Text>
      </View>
    );
  }

  async function handleRequestPermissions() {
    setLoading(true);
    try {
      await requestAuthorization({ toRead: READ_PERMISSIONS });
      setAuthorized(true);
      Alert.alert("권한 획득 성공", "이제 건강 데이터를 불러올 수 있습니다.");
    } catch (e) {
      Alert.alert("권한 오류", String(e));
    } finally {
      setLoading(false);
    }
  }

  async function fetchAllHealthData() {
    if (!authorized) {
      Alert.alert("먼저 권한을 허용해주세요.");
      return;
    }

    setLoading(true);
    const results: HealthSection[] = [];

    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const to = new Date();
    const opts = { from, to, limit: 20 };

    const tasks: Promise<void>[] = [
      // 1. 걸음 수 샘플
      queryQuantitySamples("HKQuantityTypeIdentifierStepCount", opts)
        .then((r) => results.push({ title: "걸음 수 샘플 (7일)", data: r }))
        .catch((e) => results.push({ title: "걸음 수 샘플 (7일)", data: null, error: String(e) })),

      // 2. 걸음 수 통계 (합계)
      queryStatisticsForQuantity(
        "HKQuantityTypeIdentifierStepCount",
        ["cumulativeSum"],
        { from, to },
      )
        .then((r) => results.push({ title: "걸음 수 통계 합계 (7일)", data: r }))
        .catch((e) => results.push({ title: "걸음 수 통계 합계 (7일)", data: null, error: String(e) })),

      // 3. 심박수
      queryQuantitySamples("HKQuantityTypeIdentifierHeartRate", opts)
        .then((r) => results.push({ title: "심박수 샘플 (bpm)", data: r }))
        .catch((e) => results.push({ title: "심박수 샘플 (bpm)", data: null, error: String(e) })),

      // 4. 수면 분석
      queryCategorySamples("HKCategoryTypeIdentifierSleepAnalysis", opts)
        .then((r) => results.push({ title: "수면 분석 샘플", data: r }))
        .catch((e) => results.push({ title: "수면 분석 샘플", data: null, error: String(e) })),

      // 5. 활동 에너지 소모
      queryQuantitySamples("HKQuantityTypeIdentifierActiveEnergyBurned", opts)
        .then((r) => results.push({ title: "활동 에너지 소모 (kcal)", data: r }))
        .catch((e) => results.push({ title: "활동 에너지 소모 (kcal)", data: null, error: String(e) })),

      // 6. 체중 최신
      queryQuantitySamples("HKQuantityTypeIdentifierBodyMass", { limit: 1 })
        .then((r) => results.push({ title: "체중 최신 (kg)", data: r }))
        .catch((e) => results.push({ title: "체중 최신 (kg)", data: null, error: String(e) })),

      // 7. 키 최신
      queryQuantitySamples("HKQuantityTypeIdentifierHeight", { limit: 1 })
        .then((r) => results.push({ title: "키 최신 (m)", data: r }))
        .catch((e) => results.push({ title: "키 최신 (m)", data: null, error: String(e) })),

      // 8. 산소 포화도
      queryQuantitySamples("HKQuantityTypeIdentifierOxygenSaturation", opts)
        .then((r) => results.push({ title: "산소 포화도 (%)", data: r }))
        .catch((e) => results.push({ title: "산소 포화도 (%)", data: null, error: String(e) })),

      // 9. 호흡수
      queryQuantitySamples("HKQuantityTypeIdentifierRespiratoryRate", opts)
        .then((r) => results.push({ title: "호흡수 (회/분)", data: r }))
        .catch((e) => results.push({ title: "호흡수 (회/분)", data: null, error: String(e) })),

      // 10. 걷기+달리기 거리
      queryQuantitySamples("HKQuantityTypeIdentifierDistanceWalkingRunning", opts)
        .then((r) => results.push({ title: "걷기+달리기 거리 (m)", data: r }))
        .catch((e) => results.push({ title: "걷기+달리기 거리 (m)", data: null, error: String(e) })),
    ];

    await Promise.all(tasks);
    setSections(results);
    setLoading(false);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>HealthKit 데이터 포맷 확인</Text>
      <Text style={styles.subtitle}>iOS 전용 · 실기기 권장</Text>

      <TouchableOpacity
        style={[styles.btn, authorized && styles.btnDisabled]}
        onPress={handleRequestPermissions}
        disabled={authorized || loading}
      >
        <Text style={styles.btnText}>
          {authorized ? "권한 허용됨" : "1. HealthKit 권한 요청"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.btnFetch, (!authorized || loading) && styles.btnDisabled]}
        onPress={fetchAllHealthData}
        disabled={!authorized || loading}
      >
        <Text style={styles.btnText}>
          {loading ? "불러오는 중..." : "2. 건강 데이터 모두 불러오기"}
        </Text>
      </TouchableOpacity>

      {sections.map((section, i) => (
        <View key={i} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.error ? (
            <Text style={styles.errorText}>오류: {section.error}</Text>
          ) : (
            <Text style={styles.jsonText}>
              {JSON.stringify(section.data, null, 2)}
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  content: { padding: 16, paddingBottom: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#ffffff", marginBottom: 4, marginTop: 20 },
  subtitle: { fontSize: 13, color: "#888", marginBottom: 20 },
  btn: {
    backgroundColor: "#1e90ff",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 12,
  },
  btnFetch: { backgroundColor: "#28a745" },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  section: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: "#1e90ff",
  },
  sectionTitle: { color: "#1e90ff", fontWeight: "700", fontSize: 14, marginBottom: 8 },
  jsonText: { color: "#c8e6c9", fontFamily: "monospace", fontSize: 11, lineHeight: 18 },
  errorText: { color: "#ff6b6b", fontSize: 12 },
});
