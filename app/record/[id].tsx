import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image as ExpoImage } from 'expo-image';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Clive1Svg from '@/assets/clive1.svg';
import Clive2Svg from '@/assets/clive2.svg';
import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon';
import { DotsThreeIcon } from '@/components/icons/dots-three-icon';
import { DownloadSimpleIcon } from '@/components/icons/download-simple-icon';
import { LockIcon } from '@/components/icons/lock-icon';
import { ShareIcon } from '@/components/icons/share-icon';
import { XIcon } from '@/components/icons/x-icon';

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
        <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
          <View className="flex-row items-end" style={{ gap: 4 }}>
            <Text style={styles.distanceNumber}>6.34</Text>
            <Text style={styles.distanceUnit}>km</Text>
          </View>
          <TouchableOpacity
            style={styles.shareIconButton}
            hitSlop={8}
            onPress={() =>
              router.push({
                pathname: '/community/write',
                params: { name: name ?? '관악산' },
              })
            }
          >
            <ShareIcon size={24} />
          </TouchableOpacity>
        </View>

        {/* 루트 지도 */}
        <View className="mx-5 rounded-xl overflow-hidden" style={styles.mapContainer}>
          {typeof Clive1Svg === 'number' ? (
            <ExpoImage source={Clive1Svg} style={styles.mapImage} contentFit="cover" />
          ) : (
            <Clive1Svg width="100%" height="100%" />
          )}
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
          <View className="pb-10 pt-2">
            <View style={styles.cliveImageWrap}>
              <LinearGradient
                colors={['#507EF4', '#4ADE80', '#FFD40D', '#FF5249']}
                locations={[0, 0.33, 0.66, 1]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.cliveGradientBar}
              />
              {typeof Clive2Svg === 'number' ? (
                <ExpoImage source={Clive2Svg} style={styles.cliveImage} contentFit="cover" />
              ) : (
                <Clive2Svg width="100%" height="100%" />
              )}
            </View>
            <View style={styles.bottomIconRow}>
              <TouchableOpacity style={styles.roundIconButton} hitSlop={8}>
                <LockIcon size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.roundIconButton} hitSlop={8}>
                <DownloadSimpleIcon size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.roundIconButton} hitSlop={8}>
                <DotsThreeIcon size={24} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === '포토 리포트' && (
          <View className="px-5 pb-20 items-center justify-center" style={{ height: 200 }}>
            <Text className="typo-body-1-normal-medium text-label-subtler">포토 리포트 준비 중</Text>
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 6,
  },
  mapContainer: {
    height: 235,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: 235,
  },
  cliveImageWrap: {
    width: 335,
    height: 596,
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
    position: 'relative',
  },
  cliveGradientBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    zIndex: 2,
  },
  cliveImage: {
    width: '100%',
    height: '100%',
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
  roundIconButton: {
    width: 48,
    height: 48,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIconButton: {
    width: 48,
    height: 48,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  bottomIconRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
