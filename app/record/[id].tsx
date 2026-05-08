import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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
import { GlobeSimpleIcon } from '@/components/icons/globe-simple-icon';
import { LinkSimpleIcon } from '@/components/icons/link-simple-icon';
import { LockIcon } from '@/components/icons/lock-icon';
import { ShareIcon } from '@/components/icons/share-icon';
import { XIcon } from '@/components/icons/x-icon';

type RecordTab = '클라이브' | '포토 리포트';

export default function RecordScreen() {
  const { id, name, imageUri } = useLocalSearchParams<{ id: string; name: string; imageUri?: string }>();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<RecordTab>('클라이브');
  const [toastMessage, setToastMessage] = useState<'save' | 'public' | null>(null);
  const [showPublicDialog, setShowPublicDialog] = useState(false);
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const [isClivePublic, setIsClivePublic] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleSavePress = () => {
    setToastMessage('save');
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 1800);
  };

  const handleConfirmPublic = () => {
    setShowPublicDialog(false);
    setIsClivePublic(true);
    setToastMessage('public');
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 1800);
  };

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
              {toastMessage && (
                <View style={styles.savedToast}>
                  <View style={styles.savedToastCheckCircle}>
                    <Text style={styles.savedToastCheck}>✓</Text>
                  </View>
                  <Text style={styles.savedToastText}>
                    {toastMessage === 'public' ? '세모피드에 공개' : '사진에 저장 완료'}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.bottomIconRow}>
              <TouchableOpacity
                style={[
                  styles.roundIconButton,
                  isClivePublic && styles.roundIconButtonActive,
                ]}
                hitSlop={8}
                onPress={() => {
                  if (!isClivePublic) {
                    setShowPublicDialog(true);
                  }
                }}
              >
                {isClivePublic ? <GlobeSimpleIcon size={24} color="#FFFFFF" /> : <LockIcon size={24} />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.roundIconButton} hitSlop={8} onPress={handleSavePress}>
                <DownloadSimpleIcon size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.roundIconButton}
                hitSlop={8}
                onPress={() => setShowMoreSheet(true)}
              >
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

      {showMoreSheet && (
        <View style={styles.moreSheetBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setShowMoreSheet(false)}
          />
          <View style={styles.moreSheetContainer}>
            <View style={styles.moreSheetBody}>
              <TouchableOpacity style={styles.moreSheetItemRow} onPress={() => setShowMoreSheet(false)}>
                <LinkSimpleIcon size={20} />
                <Text style={styles.moreSheetItemText}>세모피드에서 보기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.moreSheetItemRowLast}
                onPress={() => {
                  setShowMoreSheet(false);
                  handleSavePress();
                }}
              >
                <DownloadSimpleIcon size={20} />
                <Text style={styles.moreSheetItemText}>원본 사진 저장하기</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.moreSheetCancelWrap}>
              <TouchableOpacity style={styles.moreSheetCancelButton} onPress={() => setShowMoreSheet(false)}>
                <Text style={styles.moreSheetCancelText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showPublicDialog && (
        <View style={styles.dialogBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setShowPublicDialog(false)}
          />
          <View style={styles.dialogCard}>
            <Text style={styles.dialogTitle}>세모피드에 클라이브를 공개할까요?</Text>
            <View style={styles.dialogButtonRow}>
              <TouchableOpacity style={styles.dialogCancelButton} onPress={() => setShowPublicDialog(false)}>
                <Text style={styles.dialogCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dialogConfirmButton} onPress={handleConfirmPublic}>
                <Text style={styles.dialogConfirmText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  savedToast: {
    position: 'absolute',
    left: '50%',
    bottom: 16,
    transform: [{ translateX: -72 }],
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2F323A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  savedToastCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedToastCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 12,
  },
  savedToastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    letterSpacing: -0.14,
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
  roundIconButtonActive: {
    backgroundColor: '#1A1B1F',
    borderColor: '#1A1B1F',
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
  dialogBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dialogCard: {
    width: 320,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  dialogTitle: {
    paddingHorizontal: 20,
    color: 'rgba(0,12,30,0.8)',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
    letterSpacing: -0.4,
  },
  dialogButtonRow: {
    height: 84,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  dialogCancelButton: {
    flex: 1,
    minHeight: 48,
    maxHeight: 48,
    borderRadius: 10,
    backgroundColor: '#F0F2F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogCancelText: {
    color: '#464A57',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 26,
    letterSpacing: -0.255,
  },
  dialogConfirmButton: {
    flex: 1,
    minHeight: 48,
    maxHeight: 48,
    borderRadius: 10,
    backgroundColor: '#1A1B1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogConfirmText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 26,
    letterSpacing: -0.255,
  },
  moreSheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  moreSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  moreSheetBody: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  moreSheetItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  moreSheetItemRowLast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
  },
  moreSheetItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1B1F',
    lineHeight: 24,
    letterSpacing: -0.16,
  },
  moreSheetCancelWrap: {
    height: 84,
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  moreSheetCancelButton: {
    flex: 1,
    borderRadius: 10,
    minHeight: 48,
    maxHeight: 48,
    backgroundColor: 'rgba(26,27,31,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreSheetCancelText: {
    color: '#1A1B1F',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 26,
    letterSpacing: -0.255,
  },
});
