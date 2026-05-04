import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clive, type ClivePhoto } from '@/components/clive';
import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon';
import { XIcon } from '@/components/icons/x-icon';

const MOCK_CLIVE_PHOTOS: ClivePhoto[] = [
  { id: '1', distance: '1500m', isTop: true },
  { id: '2', distance: '1000m' },
  { id: '3', distance: '500m' },
];

type RecordTab = '클라이브' | '포토 리포트';

export default function RecordScreen() {
  const { id, name, imageUri } = useLocalSearchParams<{ id: string; name: string; imageUri?: string }>();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<RecordTab>('클라이브');

  return (
    <View className="flex-1 bg-fill-normal">
      {/* 헤더 */}
      <View style={{ paddingTop: top }} className="bg-fill-normal">
        <View className="flex-row items-center justify-between px-5 h-14">
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <ChevronLeftIcon size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <XIcon size={24} />
          </TouchableOpacity>
        </View>

        {/* 산 이름 + 코스명 */}
        <View className="flex-row items-center gap-2 px-5 pb-3">
          <View style={styles.mountainIconCircle}>
            <View style={styles.mountainIconInner} />
          </View>
          <Text className="typo-body-1-normal-semi-bold text-label-normal">
            {name ?? '관악산'}
          </Text>
          <Text className="typo-body-1-normal-medium text-label-subtle" numberOfLines={1}>
            과천향교 출발 코스
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 거리 */}
        <View className="flex-row items-end px-5 pt-4 pb-4" style={{ gap: 4 }}>
          <Text style={styles.distanceNumber}>6.34</Text>
          <Text style={styles.distanceUnit}>km</Text>
        </View>

        {/* 루트 지도 */}
        <View className="mx-5 rounded-xl overflow-hidden" style={styles.mapContainer}>
          <View style={[styles.mapImage, { backgroundColor: '#E5E7EB' }]} />
          {/* 날짜/시간 pill */}
          <View style={styles.datePillWrapper}>
            <View style={styles.datePill}>
              <Text style={styles.datePillText}>2026.04.25 금</Text>
              <Text style={styles.datePillSub}>10:03 - 12:19</Text>
            </View>
          </View>
        </View>

        {/* 통계 */}
        <View className="flex-row mx-5 mt-4 mb-4">
          {[
            { label: '소요시간', value: '2시간 16분' },
            { label: '고도', value: '15Nm' },
            { label: '칼로리', value: '360kcal' },
          ].map((stat, i) => (
            <View key={stat.label} style={[styles.statItem, i < 2 && styles.statDivider]}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* 기록 공유하기 버튼 */}
        <View className="items-center mb-5">
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>기록 공유하기</Text>
          </TouchableOpacity>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 탭 */}
        <View className="flex-row px-5 pt-5 pb-4 gap-4">
          {(['클라이브', '포토 리포트'] as RecordTab[]).map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab ? styles.tabActive : styles.tabInactive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 클라이브 */}
        {activeTab === '클라이브' && (
          <View className="pb-32 pt-2">
            <Clive photos={MOCK_CLIVE_PHOTOS} />
          </View>
        )}

        {activeTab === '포토 리포트' && (
          <View className="px-5 pb-32 items-center justify-center" style={{ height: 200 }}>
            <Text className="typo-body-1-normal-medium text-label-subtler">포토 리포트 준비 중</Text>
          </View>
        )}
      </ScrollView>

      {/* 저장하기 버튼 (fixed bottom) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>저장하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mountainIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#00D864',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mountainIconInner: {
    width: 12,
    height: 8,
    backgroundColor: '#DCFCE7',
  },
  distanceNumber: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 60,
    color: '#1A1B1F',
    lineHeight: 72,
  },
  distanceUnit: {
    fontSize: 24,
    fontWeight: '500',
    color: '#464A57',
    lineHeight: 29,
    paddingBottom: 8,
  },
  mapContainer: {
    height: 235,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: 235,
  },
  datePillWrapper: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  datePill: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#464A57',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  datePillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#ffffff',
  },
  datePillSub: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  statDivider: {
    borderRightWidth: 1,
    borderRightColor: '#F0F1F4',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#73798C',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1B1F',
  },
  shareButton: {
    width: 164,
    height: 48,
    backgroundColor: '#F0F1F4',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#464A57',
  },
  divider: {
    height: 6,
    backgroundColor: '#F9FAFB',
  },
  tabText: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabActive: {
    color: '#1A1B1F',
  },
  tabInactive: {
    color: '#BFC4D1',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  saveButton: {
    width: 164,
    height: 48,
    backgroundColor: '#1A1B1F',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
});
